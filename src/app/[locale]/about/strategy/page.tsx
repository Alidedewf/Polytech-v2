import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import BackLink from '@/components/ui/BackLink';

export default function AboutStrategyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');
  const body = t.raw('strategy.body') as string[];
  const goals = t.raw('strategy.goals') as string[];

  return (
    <>
      <PageHeader label={t('label')} title={t('strategy.title')} />
      <Container className="py-16">
        <Prose paragraphs={body} className="max-w-3xl" />

        <h2 className="mt-12 text-xl font-bold text-brand-ink">
          {t('strategy.goalsTitle')}
        </h2>
        <ul className="mt-6 max-w-3xl space-y-3">
          {goals.map((g, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-brand-line bg-white p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-tag text-xs font-bold text-brand-blue">
                {i + 1}
              </span>
              <span className="text-base text-brand-gray">{g}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
