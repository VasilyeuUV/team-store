/** @file Хранилище состояния корзины в памяти, подписки UI и синхронизация с localStorage. */

import type { CartItem } from '../domain/cart-item';
import type { CartTotals } from '../domain/cart-totals';
import type { Product } from '../domain/product';
import {
  MIN_CART_QUANTITY,
  addCartItem,
  calcCart,
  calcCartCount,
  removeCartItem,
  updateCartItemQuantity,
} from './cart-calculations';
import { loadCartItems, saveCartItems } from './cart-storage';

/** Подписчик на изменения состояния корзины. */
export type CartListener = (totals: CartTotals) => void;

let stateItems: CartItem[] | null = null;
let statePromoCode = '';
const listeners = new Set<CartListener>();

/**
 * Инициализирует состояние корзины из `localStorage` при первом обращении.
 * @returns текущий массив элементов корзины
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
 * Возвращает текущие элементы корзины из состояния.
 * @returns элементы корзины
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
export function addProductToCart(product: Product, quantity = MIN_CART_QUANTITY): CartTotals {
  stateItems = addCartItem(ensureCartState(), product, quantity);
  saveCartItems(stateItems);
  const totals = getCartTotals();
  notifyCartListeners(totals);
  return totals;
}

/**
 * Изменяет количество элемента в состоянии корзины (не ниже 1), сохраняет и уведомляет подписчиков.
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
 * @param listener функция, вызываемая при изменении элементов или промокода
 * @returns функция отписки
 */
export function subscribeToCart(listener: CartListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
