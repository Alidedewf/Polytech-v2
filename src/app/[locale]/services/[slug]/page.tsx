import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import BackLink from '@/components/ui/BackLink';
import { DIRECTION_ICONS } from '@/components/ui/icons';
import { getService, getServices } from '@/lib/content';
import { DEFAULT_LOCALE } from '@/lib/site';

export const dynamicParams = false;

export async function generateStaticParams() {
  const services = await getServices(DEFAULT_LOCALE);
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const service = await getService(slug, locale);
  if (!service) return { title: 'PolyTechPark' };
  return {
    title: `${service.title} — PolyTechPark`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const service = await getService(slug, locale);
  if (!service) notFound();

  const t = await getTranslations('services');
  const Icon = DIRECTION_ICONS[service.category];

  return (
    <>
      <PageHeader label={t('label')} title={service.title} />
      <Container className="py-16">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-tag text-brand-blue">
          <Icon className="h-8 w-8" />
        </span>
        <Prose paragraphs={service.paragraphs} className="mt-8 max-w-3xl" />

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link
            href="/contacts"
            className="rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
          >
            {t('requestCta')}
          </Link>
          <BackLink href="/services" label={t('all')} />
        </div>
      </Container>
    </>
  );
}
