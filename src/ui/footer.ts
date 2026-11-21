/** @file Подвал страницы: команда, год, репозиторий и RS School. */
import {
  COPYRIGHT_YEAR,
  GITHUB_URL,
  REPO_URL,
  RS_SCHOOL_URL,
  TEAM_MEMBERS,
} from '../config/constants';
import { createElement, createExternalLink } from './dom';
import { createGithubLink } from './icons';

/**
 * Создаёт подвал страницы из трёх зон: команда, год, ссылки проекта.
 * @returns элемент `<footer>`
 */
export function createFooter(): HTMLElement {
  const team = createElement(
    'ul',
    { className: 'footer__team', attrs: { 'aria-label': 'Команда' } },
    TEAM_MEMBERS.map((member) =>
      createElement('li', {}, [
        createGithubLink(`${GITHUB_URL}/${member.github}`, member.github, 'footer__link'),
      ]),
    ),
  );

  const year = createElement('p', { className: 'footer__year', text: `© ${COPYRIGHT_YEAR}` });

  const links = createElement('div', { className: 'footer__links' }, [
    createGithubLink(REPO_URL, 'Репозиторий', 'footer__link'),
    createExternalLink(RS_SCHOOL_URL, 'RS School', 'footer__link footer__rs'),
  ]);

  return createElement('footer', { className: 'footer' }, [
    createElement('div', { className: 'container footer__inner' }, [team, year, links]),
  ]);
}
