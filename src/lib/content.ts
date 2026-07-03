/**
 * Слой контента. Данные статические (вшиты во фронт, см. content-static.ts),
 * бэкенда нет. Функции оставлены async с прежними сигнатурами, чтобы страницы
 * не приходилось менять.
 */

import type { Service, Partner, Leader, DocItem, ContactInfo } from './data';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './site';
import { SERVICES, PARTNERS, LEADERS, DOCUMENTS, CONTACT } from './content-static';

/** Приводит произвольную строку локали к поддерживаемой (fallback — ru). */
function asLocale(locale: string): Locale {
  return (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
}

/* -------------------------------- Партнёры -------------------------------- */

export async function getPartners(limit = 10): Promise<Partner[]> {
  return PARTNERS.slice(0, limit);
}

/* --------------------------------- Услуги --------------------------------- */

export async function getServices(locale: string): Promise<Service[]> {
  return SERVICES[asLocale(locale)];
}

export async function getService(
  slug: string,
  locale: string,
): Promise<Service | null> {
  return SERVICES[asLocale(locale)].find((s) => s.slug === slug) ?? null;
}

/* ------------------------------- Руководство ------------------------------ */

export async function getLeaders(locale: string): Promise<Leader[]> {
  return LEADERS[asLocale(locale)];
}

/* -------------------------------- Документы ------------------------------- */

export async function getDocuments(locale: string): Promise<DocItem[]> {
  return DOCUMENTS[asLocale(locale)];
}

/* -------------------------------- Контакты -------------------------------- */

export async function getContact(locale: string): Promise<ContactInfo | null> {
  return CONTACT[asLocale(locale)] ?? null;
}
