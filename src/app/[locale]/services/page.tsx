import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import { ArrowIcon, DIRECTION_ICONS } from '@/components/ui/icons';
import { getServices } from '@/lib/content';

function IdeaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

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
                <div
                  key={s.slug}
                  className="flex h-full flex-col rounded-2xl border border-brand-line bg-white p-7"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-tag text-brand-blue">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-brand-ink">
                    {s.title}
                  </h3>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-muted">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Баннер: есть задача или идея? */}
        <div className="mt-14 flex flex-col items-start gap-6 rounded-2xl bg-brand-navy p-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <IdeaIcon />
            </span>
            <div>
              <p className="text-lg font-bold text-white">{t('cta.title')}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                {t('cta.text')}
              </p>
            </div>
          </div>

          <Link
            href="/contacts"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-tag"
          >
            {t('cta.button')}
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </>
  );
}
