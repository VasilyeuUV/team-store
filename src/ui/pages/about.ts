/** @file Страница «О нас»: о магазине, стек технологий и команда. */
import type { TeamMember } from '../../config/team';
import { APP_TITLE, COURSE_NAME, GITHUB_URL, RS_SCHOOL_URL } from '../../config/constants';
import { TECH_STACK, TEAM_MEMBERS } from '../../config/team';
import { createElement, createExternalLink } from '../dom';
import { createGithubLink } from '../icons';

/**
 * Создаёт карточку участника команды с аватаром GitHub.
 * @param member участник команды
 * @returns элемент карточки
 */
function createMemberCard(member: TeamMember): HTMLElement {
  const profileUrl = `${GITHUB_URL}/${member.github}`;
  const avatar = createElement('img', {
    className: 'member__avatar',
    attrs: {
      src: `${profileUrl}.png?size=160`,
      alt: `Аватар ${member.name}`,
      width: '80',
      height: '80',
      loading: 'lazy',
    },
  });

  return createElement('li', { className: 'member' }, [
    avatar,
    createElement('h3', { className: 'member__name', text: member.name }),
    createGithubLink(profileUrl, `@${member.github}`, 'member__github'),
    createElement('p', { className: 'member__role', text: member.role }),
  ]);
}

/**
 * Создаёт содержимое страницы «О нас».
 * @returns элемент страницы
 */
export function renderAboutPage(): HTMLElement {
  const intro = createElement('section', { className: 'about__section' }, [
    createElement('h1', { className: 'page__title', text: 'О нас' }),
    createElement('p', {
      text: `${APP_TITLE} — интернет-магазин электроники: смартфоны, ноутбуки, планшеты и аксессуары. Каталог с поиском, фильтрами и сортировкой, корзина с промокодами.`,
    }),
    createElement('p', {}, [
      document.createTextNode('Проект создан командой в рамках курса '),
      createExternalLink(RS_SCHOOL_URL, 'RS School', 'about__link'),
      document.createTextNode(` (${COURSE_NAME}).`),
    ]),
  ]);

  const stack = createElement('section', { className: 'about__section' }, [
    createElement('h2', { className: 'about__subtitle', text: 'Технологии' }),
    createElement(
      'ul',
      { className: 'about__stack' },
      TECH_STACK.map((tech) => createElement('li', { className: 'about__tech', text: tech })),
    ),
  ]);

  const team = createElement('section', { className: 'about__section' }, [
    createElement('h2', { className: 'about__subtitle', text: 'Команда' }),
    createElement('ul', { className: 'about__team' }, TEAM_MEMBERS.map(createMemberCard)),
  ]);

  return createElement('div', { className: 'page page--about' }, [intro, stack, team]);
}
