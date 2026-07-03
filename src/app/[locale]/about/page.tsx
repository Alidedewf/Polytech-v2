import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowIcon, FACT_ICONS } from '@/components/ui/icons';
import { FACTS } from '@/lib/data';

const SECTIONS = [
  'history',
  'mission',
  'strategy',
  'leadership',
  'structure',
  'documents',
] as const;

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');

  return (
    <>
      <PageHeader label={t('label')} title={t('title')} description={t('text')} />
      <Container className="py-20 lg:py-24">
        {/* Ключевые факты */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {t('factsTitle')}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map(({ key }) => {
              const Icon = FACT_ICONS[key];
              return (
                <div
                  key={key}
                  className="flex h-full flex-col items-start gap-4 rounded-2xl border border-brand-line bg-white p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="text-lg font-bold leading-snug text-brand-ink">
                    {t(`facts.${key}.title`)}
                  </div>
                  <div className="text-sm leading-relaxed text-brand-muted">
                    {t(`facts.${key}.desc`)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Подразделы «О компании» */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {t('sectionsTitle')}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((key) => (
              <Link
                key={key}
                href={`/about/${key}`}
                className="group flex h-full flex-col rounded-2xl border border-brand-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5"
              >
                <h3 className="text-lg font-bold text-brand-ink transition-colors group-hover:text-brand-navy">
                  {t(`menu.${key}`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                  {t(`menuDesc.${key}`)}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                  {t('menu.' + key)}
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
