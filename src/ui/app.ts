/** @file Каркас страницы. */
import { APP_TITLE } from '../config/constants';

/** Отрисовывает текст-приглашение (индикатор работы приложения). */
export function renderApp(root: HTMLElement): void {
  root.textContent = `Добро пожаловать в ${APP_TITLE}!`;
}
