/**
 * @file Реэкспорт доменных типов предметной области магазина (товары и корзина).
 * Слой не зависит от config/, services/ и ui/.
 */

export type { Category, Product } from './product';
export type { CartItem, CartLine, CartProductInput, CartTotals } from './cart';
