/** @file Общие SVG-иконки и ссылки с иконками. */
import { createExternalLink } from './dom';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Контур логотипа GitHub (Octicons `mark-github`, 16×16). */
const GITHUB_ICON_PATH =
  'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';

/**
 * Создаёт монохромную SVG-иконку GitHub 16×16 (цвет наследуется от текста).
 * @returns элемент `<svg>`
 */
export function createGithubIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'icon icon--github');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', GITHUB_ICON_PATH);
  svg.append(path);
  return svg;
}

/**
 * Создаёт внешнюю ссылку с иконкой GitHub перед подписью.
 * @param href адрес
 * @param text подпись
 * @param className дополнительные CSS-классы
 * @returns элемент ссылки
 */
export function createGithubLink(href: string, text: string, className = ''): HTMLAnchorElement {
  const link = createExternalLink(href, '', `icon-link ${className}`.trim());
  link.append(createGithubIcon(), document.createTextNode(text));
  return link;
}
