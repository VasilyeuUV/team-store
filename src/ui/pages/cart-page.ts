/** @file Страница корзины: список элементов, управление количеством, промокод SALE10 и итоги. */
import type { CartLine } from '../../domain/cart-line';
import type { CartTotals } from '../../domain/cart-totals';
import { MIN_CART_QUANTITY } from '../../services/cart-calculations';
import {
  changeCartItemQuantity,
  getCartPromoCode,
  getCartTotals,
  removeProductFromCart,
  setCartPromoCode,
} from '../../services/cart-store';
import { getRouteHash } from '../../services/router';
import { createElement } from '../dom';
import { formatPriceCents } from '../format';

/**
 * Создаёт DOM-элемент одной строки товара в корзине.
 * @param line рассчитанная строка корзины
 * @param onUpdate колбэк перерисовки корзины после изменения элемента
 * @returns элемент `<li>`
 */
function createCartLineItem(line: CartLine, onUpdate: () => void): HTMLElement {
  const { product, quantity, lineTotalCents } = line;
  const children: Node[] = [];

  if (product.imageUrl.trim() !== '') {
    children.push(
      createElement('img', {
        className: 'cart-item__image',
        attrs: {
          src: product.imageUrl,
          alt: product.title,
          width: '64',
          height: '64',
          loading: 'lazy',
        },
      }),
    );
  }

  const info = createElement('div', { className: 'cart-item__info' }, [
    createElement('h2', { className: 'cart-item__title', text: product.title }),
    createElement('p', {
      className: 'cart-item__price',
      text: `Цена за шт.: ${formatPriceCents(product.priceCents)}`,
    }),
  ]);
  children.push(info);

  const isMinQuantity = quantity <= MIN_CART_QUANTITY;
  const decreaseButton = createElement('button', {
    className: 'cart-item__qty-btn',
    text: '−',
    attrs: {
      type: 'button',
      'aria-label': `Уменьшить количество «${product.title}»`,
      ...(isMinQuantity ? { disabled: 'disabled' } : {}),
    },
  });
  decreaseButton.addEventListener('click', () => {
    changeCartItemQuantity(product.id, -1);
    onUpdate();
  });

  const quantityValue = createElement('span', {
    className: 'cart-item__qty-value',
    text: String(quantity),
    attrs: { 'aria-label': `Количество: ${quantity}` },
  });

  const increaseButton = createElement('button', {
    className: 'cart-item__qty-btn',
    text: '+',
    attrs: {
      type: 'button',
      'aria-label': `Увеличить количество «${product.title}»`,
    },
  });
  increaseButton.addEventListener('click', () => {
    changeCartItemQuantity(product.id, 1);
    onUpdate();
  });

  const controls = createElement('div', { className: 'cart-item__controls' }, [
    decreaseButton,
    quantityValue,
    increaseButton,
  ]);

  const lineTotal = createElement('p', {
    className: 'cart-item__total',
    text: formatPriceCents(lineTotalCents),
  });

  const removeButton = createElement('button', {
    className: 'cart-item__remove',
    text: 'Удалить',
    attrs: {
      type: 'button',
      'aria-label': `Удалить «${product.title}» из корзины`,
    },
  });
  removeButton.addEventListener('click', () => {
    removeProductFromCart(product.id);
    onUpdate();
  });

  children.push(controls, lineTotal, removeButton);

  return createElement(
    'li',
    {
      className: 'cart-item',
      attrs: { 'data-product-id': String(product.id) },
    },
    children,
  );
}

/**
 * Создаёт строку в блоке итоговых сумм корзины.
 * @param label название показателя
 * @param value отформатированная сумма
 * @param modifierClass дополнительный CSS-класс модификатора
 * @returns элемент строки `<div class="cart-totals__row">`
 */
function createTotalsRow(label: string, value: string, modifierClass = ''): HTMLElement {
  const rowClass = `cart-totals__row ${modifierClass}`.trim();
  return createElement('div', { className: rowClass }, [
    createElement('dt', { className: 'cart-totals__label', text: label }),
    createElement('dd', { className: 'cart-totals__value', text: value }),
  ]);
}

/**
 * Создаёт блок итогов и формы промокода.
 * @param totals рассчитанные суммы и статус промокода
 * @param onUpdate колбэк перерисовки корзины после применения промокода
 * @returns элемент `<aside>`
 */
function createCartSummary(totals: CartTotals, onUpdate: () => void): HTMLElement {
  const promoInput = createElement('input', {
    className: 'cart-promo__input',
    attrs: {
      type: 'text',
      name: 'promoCode',
      placeholder: 'Введите промокод (SALE10)',
      'aria-label': 'Промокод',
      autocomplete: 'off',
    },
  });
  promoInput.value = getCartPromoCode();

  const promoButton = createElement('button', {
    className: 'btn btn--primary cart-promo__button',
    text: 'Применить',
    attrs: { type: 'submit' },
  });

  const promoForm = createElement('form', { className: 'cart-promo' }, [
    createElement('div', { className: 'cart-promo__field' }, [promoInput, promoButton]),
  ]);

  if (totals.isPromoApplied && totals.appliedPromoCode !== null) {
    promoForm.append(
      createElement('p', {
        className: 'cart-promo__status cart-promo__status--success',
        text: `Промокод ${totals.appliedPromoCode} применён (−10%)`,
      }),
    );
  } else if (totals.isPromoInvalid) {
    promoForm.append(
      createElement('p', {
        className: 'cart-promo__status cart-promo__status--error',
        text: 'Промокод не найден. Скидка не применена.',
        attrs: { role: 'alert' },
      }),
    );
  }

  promoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setCartPromoCode(promoInput.value);
    onUpdate();
  });

  const discountText =
    totals.discountCents > 0 ? `−${formatPriceCents(totals.discountCents)}` : formatPriceCents(0);

  const totalsList = createElement('dl', { className: 'cart-totals' }, [
    createTotalsRow('Сумма до скидки', formatPriceCents(totals.subtotalCents)),
    createTotalsRow(
      'Скидка по промокоду',
      discountText,
      totals.discountCents > 0 ? 'cart-totals__row--discount' : '',
    ),
    createTotalsRow(
      'Итого к оплате',
      formatPriceCents(totals.totalCents),
      'cart-totals__row--total',
    ),
  ]);

  return createElement(
    'aside',
    { className: 'cart__summary', attrs: { 'aria-label': 'Итоги корзины' } },
    [
      createElement('h2', { className: 'cart__summary-title', text: 'Ваш заказ' }),
      promoForm,
      totalsList,
    ],
  );
}

/**
 * Создаёт содержимое страницы корзины.
 * @returns элемент страницы корзины
 */
export function renderCartPage(): HTMLElement {
  const layout = createElement('div', { className: 'cart' });

  const renderContent = (): void => {
    const totals = getCartTotals();
    const contentColumn = createElement('div', { className: 'cart__content' });

    if (totals.lines.length === 0) {
      const emptyBox = createElement('div', { className: 'cart-empty' }, [
        createElement('p', {
          className: 'cart-empty__text',
          text: 'Корзина пока пуста. Добавьте товары из каталога, чтобы оформить заказ.',
        }),
        createElement('a', {
          className: 'btn btn--primary cart-empty__link',
          text: 'Перейти в каталог',
          attrs: { href: getRouteHash('home') },
        }),
      ]);
      contentColumn.append(emptyBox);
    } else {
      const list = createElement(
        'ul',
        { className: 'cart__list', attrs: { 'aria-label': 'Товары в корзине' } },
        totals.lines.map((line) => createCartLineItem(line, renderContent)),
      );
      contentColumn.append(list);
    }

    const summaryColumn = createCartSummary(totals, renderContent);
    layout.replaceChildren(contentColumn, summaryColumn);
  };

  renderContent();

  return createElement('section', { className: 'page page--cart' }, [
    createElement('h1', { className: 'page__title', text: 'Корзина' }),
    layout,
  ]);
}
