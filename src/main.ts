/** @file Точка входа приложения. */
import './styles/reset.css';
import './styles/main.css';
import { renderApp } from './ui/app';

const root = document.querySelector<HTMLDivElement>('#app');

if (!root) {
  throw new Error('Не найден контейнер #app');
}

renderApp(root);
