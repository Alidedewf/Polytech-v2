/**
 * Статический UI-конфиг и типы данных.
 *
 * Здесь НЕТ контента, который приходит из Strapi (проекты, новости, партнёры) —
 * он целиком тянется через `lib/content.ts`. Остаются только:
 *  - направления деятельности (фиксированные пункты с иконками; тексты — из i18n);
 *  - цифры блока «О компании» (статические показатели, без сущности в CMS);
 *  - типы, общие для слоя контента.
 */

export type DirectionKey =
  | 'research'
  | 'commercialization'
  | 'transfer'
  | 'innovation';

export const DIRECTIONS: { key: DirectionKey; index: string }[] = [
  { key: 'research', index: '01' },
  { key: 'commercialization', index: '02' },
  { key: 'transfer', index: '03' },
  { key: 'innovation', index: '04' },
];

/** Ключевые факты о компании (без выдуманных цифр). Тексты — из i18n. */
export type FactKey = 'direction' | 'university' | 'transfer' | 'research';

export const FACTS: { key: FactKey }[] = [
  { key: 'direction' },
  { key: 'university' },
  { key: 'transfer' },
  { key: 'research' },
];

/* --- Типы нормализованного контента (наполняются из Strapi) --- */

export type ProjectCategory = 'industry' | 'ecology' | 'construction';

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  coverUrl?: string | null;
};

export type NewsItem = {
  slug: string;
  date: string;
  category: string;
  title: string;
  coverUrl?: string | null;
};

export type Partner = { name: string; logoUrl?: string | null; website?: string | null };

export type ServiceCategory = 'research' | 'commercialization' | 'transfer';

export type Service = {
  slug: string;
  title: string;
  category: ServiceCategory;
  description: string; // плоский текст для карточек
  paragraphs: string[]; // абзацы для детальной страницы
  iconUrl?: string | null;
};

export type Leader = {
  fullName: string;
  position: string;
  bio: string[];
  photoUrl?: string | null;
};

export type DocItem = {
  title: string;
  category: string;
  fileUrl?: string | null;
};

export type Vacancy = {
  slug: string;
  title: string;
  department: string;
  description: string[];
  requirements: string[];
};

export type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  /** Запрос для карты — единый для всех локалей, иначе геокодер уводит точку. */
  mapQuery?: string;
  mapLatitude?: number | null;
  mapLongitude?: number | null;
};
