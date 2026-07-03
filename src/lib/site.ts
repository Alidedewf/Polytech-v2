/** Базовая конфигурация для SEO (канонические ссылки, sitemap, hreflang). */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://polytechpark.kz'
).replace(/\/$/, '');

export const LOCALES = ['ru', 'kk', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

/** Статические маршруты для sitemap (динамические добавляются отдельно). */
export const STATIC_PATHS = [
  '',
  '/about',
  '/about/history',
  '/about/mission',
  '/about/strategy',
  '/about/leadership',
  '/about/structure',
  '/about/documents',
  '/services',
  '/services/research',
  '/services/commercialization',
  '/services/transfer',
  '/partners',
  '/contacts',
];

/** Карта hreflang-альтернатив для заданного пути. */
export function languageAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]),
  );
}
