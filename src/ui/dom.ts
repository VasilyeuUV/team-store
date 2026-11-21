/** @file Вспомогательные функции для создания DOM-элементов. */

/** Параметры создаваемого элемента. */
export interface ElementOptions {
  /** CSS-классы через пробел. */
  className?: string;
  /** Текстовое содержимое. */
  text?: string;
  /** HTML-атрибуты. */
  attrs?: Readonly<Record<string, string>>;
}

/**
 * Создаёт DOM-элемент с классами, текстом, атрибутами и дочерними узлами.
 * @param tag имя тега
 * @param options классы, текст и атрибуты
 * @param children дочерние узлы
 * @returns созданный элемент
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
  children: readonly Node[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.className !== undefined) {
    element.className = options.className;
  }
  if (options.text !== undefined) {
    element.textContent = options.text;
  }
  Object.entries(options.attrs ?? {}).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
  element.append(...children);
  return element;
}

/**
 * Создаёт внешнюю ссылку, открывающуюся в новой вкладке.
 * @param href адрес
 * @param text подпись
 * @param className CSS-классы
 * @returns элемент ссылки
 */
export function createExternalLink(
  href: string,
  text: string,
  className?: string,
): HTMLAnchorElement {
  return createElement('a', {
    className,
    text,
    attrs: { href, target: '_blank', rel: 'noopener noreferrer' },
  });
}
