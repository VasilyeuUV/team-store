/** @file Главная страница (каталог) — заглушка до реализации каталога. */
import { APP_TITLE } from '../../config/constants';
import { createElement } from '../dom';

/**
 * Создаёт содержимое главной страницы.
 * @returns элемент страницы
 */
export function renderHomePage(): HTMLElement {
  return createElement('section', { className: 'page page--home' }, [
    createElement('h1', { className: 'page__title', text: `Добро пожаловать в ${APP_TITLE}!` }),
    createElement('p', { text: 'Каталог гаджетов скоро появится здесь.' }),
  ]);
}
