import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import BackLink from '@/components/ui/BackLink';
import { ArrowIcon } from '@/components/ui/icons';

export default function VacanciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');

  return (
    <>
      <PageHeader label={t('label')} title={t('vacancies.title')} />
      <Container className="py-16">
        <p className="max-w-3xl text-lg leading-relaxed text-brand-gray">
          {t('vacancies.intro')}
        </p>

        <div className="mt-8 flex flex-col items-start gap-6 rounded-2xl border border-brand-line bg-brand-soft p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base text-brand-muted">
            {t('vacancies.empty')}
          </p>
          <Link
            href="/contacts"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
          >
            {t('vacancies.cta')}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
