/** @file Сервис корзины: чистые функции расчёта, хранение в localStorage и состояние корзины. */

import type { CartItem, CartLine, CartProductInput, CartTotals } from '../domain/cart';

/** Минимально допустимое количество единиц одной позиции в корзине. */
export const MIN_CART_QUANTITY = 1;

/** Ключ сохранения позиций корзины в `localStorage`. */
export const CART_STORAGE_KEY = 'team-store:cart';

/** Доступные промокоды: код → размер скидки в долях. */
export const PROMO_CODES: Readonly<Record<string, number>> = {
  SALE10: 0.1,
};

/** Минимальный интерфейс хранилища для чтения и записи корзины. */
export interface CartStorage {
  /** Читает значение по ключу. */
  getItem(key: string): string | null;
  /** Записывает значение по ключу. */
  setItem(key: string, value: string): void;
}

/** Подписчик на изменения состояния корзины. */
export type CartListener = (totals: CartTotals) => void;

/**
 * Добавляет товар в корзину или увеличивает количество существующей позиции.
 * @param items текущие позиции корзины
 * @param product добавляемый товар
 * @param quantity добавляемое количество (по умолчанию 1)
 * @returns новый массив позиций корзины
 */
export function addCartItem(
  items: readonly CartItem[],
  product: CartProductInput,
  quantity = MIN_CART_QUANTITY,
): CartItem[] {
  const addedQuantity = Math.max(MIN_CART_QUANTITY, Math.trunc(quantity));
  const hasExistingItem = items.some((item) => item.id === product.id);

  if (hasExistingItem) {
    return items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + addedQuantity } : item,
    );
  }

  return [...items, { ...product, quantity: addedQuantity }];
}

/**
 * Изменяет количество товара в корзине на заданную величину, не опуская ниже 1.
 * @param items текущие позиции корзины
 * @param productId идентификатор товара
 * @param delta изменение количества (например, +1 или -1)
 * @returns новый массив позиций корзины
 */
export function updateCartItemQuantity(
  items: readonly CartItem[],
  productId: number,
  delta: number,
): CartItem[] {
  const step = Math.trunc(delta);

  return items.map((item) => {
    if (item.id !== productId) {
      return item;
    }

    const nextQuantity = Math.max(MIN_CART_QUANTITY, item.quantity + step);
    return { ...item, quantity: nextQuantity };
  });
}

/**
 * Удаляет позицию товара из корзины по идентификатору.
 * @param items текущие позиции корзины
 * @param productId идентификатор удаляемого товара
 * @returns новый массив позиций без удалённого товара
 */
export function removeCartItem(items: readonly CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.id !== productId);
}

/**
 * Считает строку корзины со стоимостью позиции в копейках.
 * @param item позиция корзины
 * @returns строка корзины с полем `lineTotalCents`
 */
export function calcCartLine(item: CartItem): CartLine {
  return {
    ...item,
    lineTotalCents: item.priceCents * item.quantity,
  };
}

/**
 * Считает строки корзины, сумму до скидки, скидку по промокоду и итоговую сумму к оплате.
 * @param items позиции корзины
 * @param promoCode введённый промокод (необязателен)
 * @returns строки корзины, суммы в копейках и статус промокода
 */
export function calcCart(items: readonly CartItem[], promoCode?: string): CartTotals {
  const lines = items.map(calcCartLine);
  const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0);

  const normalizedCode = promoCode?.trim().toUpperCase() ?? '';
  const discountRate = Object.hasOwn(PROMO_CODES, normalizedCode)
    ? PROMO_CODES[normalizedCode]
    : undefined;

  const isPromoApplied = discountRate !== undefined;
  const isPromoInvalid = normalizedCode !== '' && !isPromoApplied;
  const discountCents = isPromoApplied ? Math.round(subtotalCents * discountRate) : 0;
  const totalCents = subtotalCents - discountCents;
  const appliedPromoCode = isPromoApplied ? normalizedCode : null;

  return {
    lines,
    subtotalCents,
    discountCents,
    totalCents,
    appliedPromoCode,
    isPromoApplied,
    isPromoInvalid,
  };
}

/**
 * Считает общее количество единиц всех товаров в корзине.
 * @param items позиции корзины
 * @returns суммарное количество единиц товаров
 */
export function calcCartCount(items: readonly CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Форматирует сумму в целых копейках в строку с валютой (например, `$12.99`).
 * @param cents сумма в целых копейках
 * @returns отформатированная цена
 */
export function formatPriceCents(cents: number): string {
  const safeCents = Number.isFinite(cents) ? Math.round(cents) : 0;
  return `$${(safeCents / 100).toFixed(2)}`;
}

/**
 * Проверяет, является ли произвольное значение валидной позицией корзины.
 * @param value проверяемое значение
 * @returns признак корректной структуры `CartItem`
 */
function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const hasValidId = typeof record.id === 'number' && Number.isInteger(record.id) && record.id > 0;
  const hasValidTitle = typeof record.title === 'string' && record.title.trim().length > 0;
  const hasValidPrice =
    typeof record.priceCents === 'number' &&
    Number.isInteger(record.priceCents) &&
    record.priceCents >= 0;
  const hasValidQuantity =
    typeof record.quantity === 'number' &&
    Number.isInteger(record.quantity) &&
    record.quantity >= MIN_CART_QUANTITY;
  const hasValidImage = record.imageUrl === undefined || typeof record.imageUrl === 'string';

  return hasValidId && hasValidTitle && hasValidPrice && hasValidQuantity && hasValidImage;
}

/**
 * Безопасно разбирает JSON-строку из `localStorage` в список позиций корзины.
 * При битом JSON или неверном формате возвращает пустой массив.
 * @param raw сырая JSON-строка из хранилища
 * @returns валидный массив позиций без дублей
 */
export function parseStoredCartItems(raw: string | null): CartItem[] {
  if (raw === null || raw.trim() === '') {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    let items: CartItem[] = [];
    parsed.forEach((entry) => {
      if (isValidCartItem(entry)) {
        const productInput: CartProductInput =
          entry.imageUrl !== undefined
            ? {
                id: entry.id,
                title: entry.title,
                priceCents: entry.priceCents,
                imageUrl: entry.imageUrl,
              }
            : {
                id: entry.id,
                title: entry.title,
                priceCents: entry.priceCents,
              };
        items = addCartItem(items, productInput, entry.quantity);
      }
    });

    return items;
  } catch {
    return [];
  }
}

/**
 * Возвращает браузерный `localStorage`, если он доступен.
 * @returns объект хранилища или `null`
 */
function getDefaultStorage(): CartStorage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/**
 * Загружает позиции корзины из `localStorage` (с защитой от ошибок доступа и битых данных).
 * @param storage хранилище (по умолчанию `window.localStorage`)
 * @returns массив позиций корзины
 */
export function loadCartItems(storage: CartStorage | null = getDefaultStorage()): CartItem[] {
  if (storage === null) {
    return [];
  }

  try {
    return parseStoredCartItems(storage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
}

/**
 * Сохраняет позиции корзины в `localStorage` (с защитой от ошибок записи).
 * @param items позиции корзины для сохранения
 * @param storage хранилище (по умолчанию `window.localStorage`)
 */
export function saveCartItems(
  items: readonly CartItem[],
  storage: CartStorage | null = getDefaultStorage(),
): void {
  if (storage === null) {
    return;
  }

  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Игнорируем ошибки квоты или заблокированного localStorage
  }
}

let stateItems: CartItem[] | null = null;
let statePromoCode = '';
const listeners = new Set<CartListener>();

/**
 * Инициализирует состояние корзины из `localStorage` при первом обращении.
 * @returns текущий массив позиций
 */
function ensureCartState(): CartItem[] {
  if (stateItems === null) {
    stateItems = loadCartItems();
  }
  return stateItems;
}

/**
 * Уведомляет всех подписчиков об актуальном состоянии корзины.
 * @param totals рассчитанные итоги корзины
 */
function notifyCartListeners(totals: CartTotals): void {
  listeners.forEach((listener) => listener(totals));
}

/**
 * Возвращает текущие позиции корзины из состояния.
 * @returns позиции корзины
 */
export function getCartItems(): readonly CartItem[] {
  return ensureCartState();
}

/**
 * Возвращает текущий введённый промокод.
 * @returns строка промокода
 */
export function getCartPromoCode(): string {
  return statePromoCode;
}

/**
 * Возвращает актуальный расчёт корзины с учётом активного промокода.
 * @returns итоги корзины
 */
export function getCartTotals(): CartTotals {
  return calcCart(ensureCartState(), statePromoCode);
}

/**
 * Возвращает суммарное количество единиц товаров в текущей корзине.
 * @returns общее количество товаров
 */
export function getCartCount(): number {
  return calcCartCount(ensureCartState());
}

/**
 * Добавляет товар в состояние корзины, сохраняет в `localStorage` и уведомляет подписчиков.
 * @param product добавляемый товар
 * @param quantity количество (по умолчанию 1)
 * @returns обновлённый расчёт корзины
 */
export function addProductToCart(
  product: CartProductInput,
  quantity = MIN_CART_QUANTITY,
): CartTotals {
  stateItems = addCartItem(ensureCartState(), product, quantity);
  saveCartItems(stateItems);
  const totals = getCartTotals();
  notifyCartListeners(totals);
  return totals;
}

/**
 * Изменяет количество позиции в состоянии корзины (не ниже 1), сохраняет и уведомляет подписчиков.
 * @param productId идентификатор товара
 * @param delta изменение количества (`+1` или `-1`)
 * @returns обновлённый расчёт корзины
 */
export function changeCartItemQuantity(productId: number, delta: number): CartTotals {
  stateItems = updateCartItemQuantity(ensureCartState(), productId, delta);
  saveCartItems(stateItems);
  const totals = getCartTotals();
  notifyCartListeners(totals);
  return totals;
}

/**
 * Удаляет товар из состояния корзины, сохраняет в `localStorage` и уведомляет подписчиков.
 * @param productId идентификатор удаляемого товара
 * @returns обновлённый расчёт корзины
 */
export function removeProductFromCart(productId: number): CartTotals {
  stateItems = removeCartItem(ensureCartState(), productId);
  saveCartItems(stateItems);
  const totals = getCartTotals();
  notifyCartListeners(totals);
  return totals;
}

/**
 * Устанавливает промокод для расчёта корзины и уведомляет подписчиков.
 * @param promoCode код промокода
 * @returns обновлённый расчёт корзины
 */
export function setCartPromoCode(promoCode: string): CartTotals {
  statePromoCode = promoCode.trim();
  const totals = getCartTotals();
  notifyCartListeners(totals);
  return totals;
}

/**
 * Очищает состояние корзины и промокод, синхронизирует `localStorage` и уведомляет подписчиков.
 * @returns обновлённый расчёт пустой корзины
 */
export function clearCart(): CartTotals {
  stateItems = [];
  statePromoCode = '';
  saveCartItems(stateItems);
  const totals = getCartTotals();
  notifyCartListeners(totals);
  return totals;
}

/**
 * Подписывает обработчик на изменения корзины.
 * @param listener функция, вызываемая при изменении позиций или промокода
 * @returns функция отписки
 */
export function subscribeToCart(listener: CartListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
