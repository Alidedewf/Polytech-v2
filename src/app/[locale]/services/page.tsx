import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowIcon, DIRECTION_ICONS } from '@/components/ui/icons';
import { getServices } from '@/lib/content';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');
  const tc = await getTranslations('common');
  const services = await getServices(locale);

  return (
    <>
      <PageHeader label={t('label')} title={t('title')} description={t('intro')} />
      <Container className="py-20">
        {services.length === 0 ? (
          <p className="py-12 text-center text-brand-muted">{tc('empty')}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = DIRECTION_ICONS[s.category];
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-brand-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-xl hover:shadow-brand-blue/5"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-tag text-brand-blue">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-brand-ink transition-colors group-hover:text-brand-navy">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                    {s.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                    {t('details')}
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </>
  );
}
