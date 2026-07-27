import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import BackLink from '@/components/ui/BackLink';
import { ArrowIcon } from '@/components/ui/icons';
import { getVacancies } from '@/lib/content';

export default async function VacanciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const vacancies = await getVacancies(locale);

  return (
    <>
      <PageHeader label={t('label')} title={t('vacancies.title')} />
      <Container className="py-16">
        <p className="max-w-3xl text-lg leading-relaxed text-brand-gray">
          {t('vacancies.intro')}
        </p>

        {vacancies.length > 0 ? (
          <div className="mt-10 space-y-6">
            {vacancies.map((v) => (
              <article
                key={v.id}
                className="rounded-2xl border border-brand-line bg-white p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-brand-ink">{v.title}</h2>
                {v.department ? (
                  <p className="mt-1 text-sm font-semibold text-brand-blue">
                    {v.department}
                  </p>
                ) : null}

                {v.description.length > 0 ? (
                  <div className="mt-4 space-y-2 text-base leading-relaxed text-brand-gray">
                    {v.description.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                ) : null}

                {v.requirements.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 text-base text-brand-gray">
                    {v.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                ) : null}

                <Link
                  href="/contacts"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
                >
                  {t('vacancies.apply')}
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
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
        )}

        <div className="mt-10">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
