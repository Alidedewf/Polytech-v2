import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import MapEmbed from '@/components/ui/MapEmbed';
import { ArrowIcon } from '@/components/ui/icons';
import { getContact } from '@/lib/content';

/** Блок «Контакты (кратко)» на главной: адрес/телефон/почта + карта. */
export default async function Contacts() {
  const t = await getTranslations('contacts');
  const tFooter = await getTranslations('footer');
  const locale = await getLocale();
  const contact = await getContact(locale);

  const address =
    contact?.address ||
    `${tFooter('address_part1')} ${tFooter('address_part2')}`;
  const phone = contact?.phone || '+7 7172 95 43 43';
  const email = contact?.email || 'Info@polytechpark.kz';
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading label={t('label')} title={t('heading')} />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col">
            <p className="max-w-md text-lg text-brand-gray">{t('subtitle')}</p>
            <div className="mt-8 space-y-5">
              <Row label={t('address')}>{address}</Row>
              <Row label={t('phone')}>
                <a href={telHref} className="hover:text-brand-navy">
                  {phone}
                </a>
              </Row>
              <Row label={t('email')}>
                <a href={`mailto:${email}`} className="hover:text-brand-navy">
                  {email}
                </a>
              </Row>
            </div>
            <Link
              href="/contacts"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-brand-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
            >
              {t('writeUs')}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>

          <MapEmbed
            query={contact?.mapQuery ?? address}
            lat={contact?.mapLatitude}
            lng={contact?.mapLongitude}
            title={t('onMap')}
            className="min-h-[320px] w-full overflow-hidden rounded-2xl border border-brand-line"
          />
        </div>
      </Container>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-blue">
        {label}
      </div>
      <div className="mt-1 text-lg text-brand-gray">{children}</div>
    </div>
  );
}
