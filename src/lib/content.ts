/**
 * Слой контента. Данные статические (вшиты во фронт, см. content-static.ts),
 * бэкенда нет. Функции оставлены async с прежними сигнатурами, чтобы страницы
 * не приходилось менять.
 */

import type {
  Service,
  Partner,
  Leader,
  DocItem,
  ContactInfo,
  Project,
} from './data';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './site';
import {
  SERVICES,
  PARTNERS,
  LEADERS,
  DOCUMENTS,
  CONTACT,
  PROJECTS,
} from './content-static';

/** Приводит произвольную строку локали к поддерживаемой (fallback — ru). */
function asLocale(locale: string): Locale {
  return (LOCALES as readonly string[]).includes(locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
}

/** Сырой проект из API (все поля опциональны — валидируем при маппинге). */
type ApiProject = {
  id?: string;
  slug?: string;
  title?: string;
  titleRu?: string;
  titleKk?: string;
  titleEn?: string;
  description?: string;
  descRu?: string;
  descKk?: string;
  descEn?: string;
  category?: Project['category'];
  status?: Project['status'];
  imageUrl?: string | null;
};

export async function getProjects(locale: string): Promise<Project[]> {
  const loc = asLocale(locale);
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
  try {
    // force-cache: запрос выполняется на этапе сборки и «запекается» в статику
    const res = await fetch(`${API_URL}/projects`, { cache: 'force-cache' });
    if (res.ok) {
      const data: unknown = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return (data as ApiProject[]).map((item) => {
          const title =
            (loc === 'kk' && item.titleKk) ||
            (loc === 'en' && item.titleEn) ||
            item.titleRu ||
            item.title ||
            '';
          const description =
            (loc === 'kk' && item.descKk) ||
            (loc === 'en' && item.descEn) ||
            item.descRu ||
            item.description ||
            '';
          return {
            slug: item.slug || item.id || '',
            title,
            description,
            category: item.category || 'industry',
            status: item.status || 'active',
            coverUrl: item.imageUrl || null,
          };
        });
      }
    }
  } catch (e) {
    console.error('Ошибка загрузки проектов с API:', e);
  }
  return PROJECTS[loc];
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
