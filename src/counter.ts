/**
 * Инициализирует демонстрационный счётчик на кнопке.
 * @param element кнопка, на которую вешается обработчик клика
 */
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `Count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
