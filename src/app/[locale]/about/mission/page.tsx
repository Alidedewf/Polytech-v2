import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import BackLink from '@/components/ui/BackLink';

export default function AboutMissionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');
  const values = t.raw('mission.values') as string[];

  return (
    <>
      <PageHeader label={t('label')} title={t('mission.title')} />
      <Container className="py-16">
        <p className="max-w-3xl text-2xl font-medium leading-relaxed text-brand-ink">
          {t('mission.lead')}
        </p>

        <h2 className="mt-14 text-xl font-bold text-brand-ink">
          {t('mission.valuesTitle')}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {values.map((v, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-sm font-bold text-brand-blue">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-base font-medium text-brand-gray">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
