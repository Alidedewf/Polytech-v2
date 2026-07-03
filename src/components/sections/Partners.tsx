import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { ArrowIcon } from '@/components/ui/icons';
import { getPartners } from '@/lib/content';

export default async function Partners() {
  const t = await getTranslations('partners');
  const partners = await getPartners(10);
  if (partners.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          label={t('label')}
          title={t('title')}
          action={
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
            >
              {t('all')}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          }
        />

        <Reveal>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex h-28 items-center justify-center rounded-xl border border-brand-line bg-white px-6 text-center text-sm font-semibold text-brand-muted transition-colors hover:border-brand-blue/40 hover:text-brand-navy"
              >
                {partner.logoUrl ? (
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    width={140}
                    height={56}
                    className="max-h-14 w-auto object-contain"
                  />
                ) : (
                  partner.name
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
