import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import { getPartners } from '@/lib/content';

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('partners');
  const tc = await getTranslations('common');
  const partners = await getPartners(40);

  return (
    <>
      <PageHeader label={t('label')} title={t('title')} />
      <Container className="py-20">
        {partners.length === 0 ? (
          <p className="py-12 text-center text-brand-muted">{tc('empty')}</p>
        ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex h-32 items-center justify-center rounded-xl border border-brand-line bg-white px-6 text-center text-sm font-semibold text-brand-muted transition-colors hover:border-brand-blue/40 hover:text-brand-navy"
            >
              {partner.logoUrl ? (
                <Image
                  src={partner.logoUrl}
                  alt={partner.name}
                  width={160}
                  height={64}
                  className="max-h-16 w-auto object-contain"
                />
              ) : (
                partner.name
              )}
            </div>
          ))}
        </div>
        )}
      </Container>
    </>
  );
}
