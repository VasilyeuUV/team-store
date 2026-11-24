/** @file Загрузка, валидация и сохранение элементов корзины в localStorage. */

import { CART_STORAGE_KEY } from '../config/storage';
import type { CartItem } from '../domain/cart-item';
import type { Product } from '../domain/product';
import { MIN_CART_QUANTITY, addCartItem } from './cart-calculations';

/** Минимальный интерфейс хранилища для чтения и записи корзины. */
export interface CartStorage {
  /** Читает значение по ключу. */
  getItem(key: string): string | null;

  /** Записывает значение по ключу. */
  setItem(key: string, value: string): void;
}

/**
 * Проверяет, является ли произвольное значение валидной доменной моделью товара.
 * @param value проверяемое значение
 * @returns признак корректной структуры `Product`
 */
function isValidProduct(value: unknown): value is Product {
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
  const hasValidCategory = typeof record.category === 'string' && record.category.trim().length > 0;
  const hasValidImageUrl = typeof record.imageUrl === 'string';

  return hasValidId && hasValidTitle && hasValidPrice && hasValidCategory && hasValidImageUrl;
}

/**
 * Проверяет, является ли произвольное значение валидным элементом корзины.
 * @param value проверяемое значение
 * @returns признак корректной структуры `CartItem`
 */
function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const hasValidQuantity =
    typeof record.quantity === 'number' &&
    Number.isInteger(record.quantity) &&
    record.quantity >= MIN_CART_QUANTITY;

  return hasValidQuantity && isValidProduct(record.product);
}

/**
 * Безопасно разбирает JSON-строку из `localStorage` в список элементов корзины.
 * При битом JSON или неверном формате возвращает пустой массив.
 * @param raw сырая JSON-строка из хранилища
 * @returns валидный массив элементов корзины без дублей
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
        const product: Product = {
          id: entry.product.id,
          title: entry.product.title,
          priceCents: entry.product.priceCents,
          category: entry.product.category,
          imageUrl: entry.product.imageUrl,
        };
        items = addCartItem(items, product, entry.quantity);
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
 * Загружает элементы корзины из `localStorage` (с защитой от ошибок доступа и битых данных).
 * @param storage хранилище (по умолчанию `window.localStorage`)
 * @returns массив элементов корзины
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
 * Сохраняет элементы корзины в `localStorage` (с защитой от ошибок записи).
 * @param items элементы корзины для сохранения
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
