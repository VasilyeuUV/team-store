/** @file Создание SVG-иконок из файлов `src/assets/icons/` и ссылок с иконками. */
import githubIconSource from '../assets/icons/github.svg?raw';
import { createExternalLink } from './dom';

const iconCache = new Map<string, SVGSVGElement>();

/**
 * Разбирает исходник SVG один раз и возвращает свежую копию для вставки в DOM.
 * Цвет иконки задаётся через `fill="currentColor"` в файле и наследуется от текста.
 * @param source текст SVG-файла (импорт с суффиксом `?raw`)
 * @param className CSS-классы иконки
 * @returns элемент `<svg>`
 */
function createIcon(source: string, className: string): SVGSVGElement {
  let template = iconCache.get(source);
  if (template === undefined) {
    const parsed = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
    if (!(parsed instanceof SVGSVGElement)) {
      throw new Error('Некорректный SVG-файл иконки');
    }
    template = parsed;
    iconCache.set(source, template);
  }
  const icon = document.importNode(template, true);
  icon.setAttribute('class', className);
  return icon;
}

/**
 * Создаёт монохромную SVG-иконку GitHub 16×16 (цвет наследуется от текста).
 * @returns элемент `<svg>`
 */
export function createGithubIcon(): SVGSVGElement {
  return createIcon(githubIconSource, 'icon icon--github');
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
