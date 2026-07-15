import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import { FACT_ICONS, DIRECTION_ICONS } from '@/components/ui/icons';
import { FACTS, DIRECTIONS } from '@/lib/data';

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');
  const td = useTranslations('directions');

  return (
    <>
      <PageHeader
        label={t('label')}
        title={t('pageTitle')}
        description={t('pageText')}
      />
      <Container className="py-20 lg:py-24">
        {/* Развёрнутый рассказ о компании */}
        <section className="grid gap-10 lg:grid-cols-3 lg:gap-16">
          <h2 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {t('overviewTitle')}
          </h2>
          <div className="lg:col-span-2">
            <Prose
              paragraphs={t.raw('overview') as string[]}
              className="max-w-3xl text-lg"
            />
          </div>
        </section>

        {/* Ключевые факты */}
        <section className="mt-24">
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

        {/* Направления деятельности */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {td('title')}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {DIRECTIONS.map(({ key, index }) => {
              const Icon = DIRECTION_ICONS[key];
              return (
                <div
                  key={key}
                  className="flex gap-5 rounded-2xl border border-brand-line bg-white p-7"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-tag text-brand-blue">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-bold text-brand-blue">
                        {index}
                      </span>
                      <h3 className="text-lg font-bold text-brand-ink">
                        {td(`items.${key}.title`)}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                      {td(`items.${key}.desc`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </Container>
    </>
  );
}
