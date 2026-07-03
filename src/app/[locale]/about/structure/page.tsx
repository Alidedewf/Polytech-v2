import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import BackLink from '@/components/ui/BackLink';

export default function AboutStructurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');
  const body = t.raw('structure.body') as string[];
  const units = t.raw('structure.units') as string[];

  return (
    <>
      <PageHeader label={t('label')} title={t('structure.title')} />
      <Container className="py-16">
        <Prose paragraphs={body} className="max-w-3xl" />

        <h2 className="mt-12 text-xl font-bold text-brand-ink">
          {t('structure.unitsTitle')}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {units.map((u, i) => (
            <div
              key={i}
              className="rounded-2xl border border-brand-line bg-white p-6 text-base font-semibold text-brand-ink"
            >
              {u}
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
