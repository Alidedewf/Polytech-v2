import type { MetadataRoute } from 'next';
import { SITE_URL, LOCALES, STATIC_PATHS, languageAlternates } from '@/lib/site';

// Требуется для статического экспорта (output: 'export')
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Статические страницы — по одной записи на локаль, с hreflang-альтернативами
  for (const path of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.7,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  return entries;
}
