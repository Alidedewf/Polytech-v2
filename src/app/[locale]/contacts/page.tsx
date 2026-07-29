import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import MapEmbed from '@/components/ui/MapEmbed';
import { getContact } from '@/lib/content';

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contacts');
  const tFooter = await getTranslations('footer');
  const contact = await getContact(locale);

  const address =
    contact?.address ||
    `${tFooter('address_part1')} ${tFooter('address_part2')}`;
  const phone = contact?.phone || '+7 7172 95 43 43';
  const email = contact?.email || 'Info@polytechpark.kz';
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <>
      <PageHeader label={t('label')} title={t('title')} description={t('subtitle')} />
      <Container className="py-20">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {/* Контактная информация */}
          <div className="space-y-8">
            <InfoRow label={t('address')}>{address}</InfoRow>
            <InfoRow label={t('phone')}>
              <a href={telHref} className="hover:text-brand-navy">
                {phone}
              </a>
            </InfoRow>
            <InfoRow label={t('email')}>
              <a href={`mailto:${email}`} className="hover:text-brand-navy">
                {email}
              </a>
            </InfoRow>
          </div>

          {/* Карта */}
          <MapEmbed
            query={contact?.mapQuery ?? address}
            lat={contact?.mapLatitude}
            lng={contact?.mapLongitude}
            title={t('onMap')}
            className="aspect-[16/11] w-full overflow-hidden rounded-2xl border border-brand-line"
          />
        </div>
      </Container>
    </>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-semibold uppercase tracking-[0.1em] text-brand-blue">
        {label}
      </div>
      <div className="mt-2 text-lg text-brand-gray">{children}</div>
    </div>
  );
}
