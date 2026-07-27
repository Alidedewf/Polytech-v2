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

/* ---------------------- Универсальная загрузка коллекций ------------------- */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/** Тянет коллекцию из бэкенда на этапе сборки. При любой ошибке — пустой
 *  массив (страница откатится на статический i18n-контент, фронт не ломается). */
async function fetchCollection<T = Record<string, unknown>>(
  name: string,
): Promise<T[]> {
  try {
    const res = await fetch(`${API_BASE}/c/${name}`, { cache: 'force-cache' });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch (e) {
    console.error(`Ошибка загрузки раздела «${name}»:`, e);
    return [];
  }
}

/** Выбирает поле по локали: base+'Ru'|'Kk'|'En' с откатом на Ru. */
function pick(
  item: Record<string, unknown>,
  base: string,
  loc: Locale,
): string {
  const suffix = loc === 'kk' ? 'Kk' : loc === 'en' ? 'En' : 'Ru';
  return (
    (item[`${base}${suffix}`] as string) ||
    (item[`${base}Ru`] as string) ||
    ''
  );
}

/* -------------------------------- Партнёры -------------------------------- */

export async function getPartners(limit = 10): Promise<Partner[]> {
  const items = await fetchCollection('partners');
  if (items.length > 0) {
    return items.slice(0, limit).map((p) => ({
      name: (p.name as string) || '',
      logoUrl: (p.logoUrl as string) || null,
      website: (p.website as string) || null,
    }));
  }
  return PARTNERS.slice(0, limit);
}

/* -------------------- Люди: совет директоров / правление ------------------- */

export type PersonCard = { name: string; position: string; photo?: string };

async function getPeople(
  name: 'board' | 'management',
  locale: string,
): Promise<PersonCard[]> {
  const loc = asLocale(locale);
  const items = await fetchCollection(name);
  return items.map((p) => ({
    name: pick(p, 'name', loc),
    position: pick(p, 'position', loc),
    photo: (p.photo as string) || undefined,
  }));
}

export async function getBoard(locale: string): Promise<PersonCard[]> {
  return getPeople('board', locale);
}

export async function getManagement(locale: string): Promise<PersonCard[]> {
  return getPeople('management', locale);
}

/* ----------------------------- Вакансии ----------------------------------- */

export type VacancyCard = {
  id: string;
  title: string;
  department: string;
  description: string[];
  requirements: string[];
};

/** Делит многострочный текст на непустые строки. */
function lines(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getVacancies(locale: string): Promise<VacancyCard[]> {
  const loc = asLocale(locale);
  const items = await fetchCollection('vacancies');
  return items.map((v) => ({
    id: (v.id as string) || '',
    title: pick(v, 'title', loc),
    department: pick(v, 'department', loc),
    description: lines(pick(v, 'description', loc)),
    requirements: lines(pick(v, 'requirements', loc)),
  }));
}

/* ----------------------------- Документы ---------------------------------- */

export type DocGroupView = {
  title: string;
  items: { title: string; file?: string }[];
};

const DOC_GROUP_ORDER = ['founding', 'permits', 'financial', 'anticorruption'];
const DOC_GROUP_LABELS: Record<string, Record<Locale, string>> = {
  founding: {
    ru: 'Учредительные документы',
    kk: 'Құрылтай құжаттары',
    en: 'Founding documents',
  },
  permits: {
    ru: 'Разрешительные и подтверждающие документы',
    kk: 'Рұқсат беруші және растайтын құжаттар',
    en: 'Permits and certificates',
  },
  financial: {
    ru: 'Финансовая отчётность',
    kk: 'Қаржылық есептілік',
    en: 'Financial statements',
  },
  anticorruption: {
    ru: 'Антикоррупционные документы',
    kk: 'Сыбайлас жемқорлыққа қарсы құжаттар',
    en: 'Anti-corruption documents',
  },
};

/** Документы одной категории (например, 'anticorruption') — плоским списком. */
export async function getDocumentsByGroup(
  locale: string,
  group: string,
): Promise<{ title: string; file?: string }[]> {
  const loc = asLocale(locale);
  const items = await fetchCollection('documents');
  return items
    .filter((d) => (d.group as string) === group)
    .map((d) => ({
      title: pick(d, 'title', loc),
      file: (d.file as string) || undefined,
    }));
}

/** Группирует плоский список документов по ключу group в порядке DOC_GROUP_ORDER. */
export async function getDocumentGroups(
  locale: string,
): Promise<DocGroupView[]> {
  const loc = asLocale(locale);
  const all = await fetchCollection('documents');
  // Антикоррупционные показываются на своей странице (/about/anticorruption)
  const items = all.filter((d) => (d.group as string) !== 'anticorruption');
  if (items.length === 0) return [];

  const byGroup = new Map<string, { title: string; file?: string }[]>();
  for (const d of items) {
    const g = (d.group as string) || 'founding';
    if (!byGroup.has(g)) byGroup.set(g, []);
    byGroup.get(g)!.push({
      title: pick(d, 'title', loc),
      file: (d.file as string) || undefined,
    });
  }

  // Сначала известные группы в заданном порядке, затем любые нестандартные
  const keys = [
    ...DOC_GROUP_ORDER.filter((k) => byGroup.has(k)),
    ...[...byGroup.keys()].filter((k) => !DOC_GROUP_ORDER.includes(k)),
  ];
  return keys.map((k) => ({
    title: DOC_GROUP_LABELS[k]?.[loc] || k,
    items: byGroup.get(k)!,
  }));
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
