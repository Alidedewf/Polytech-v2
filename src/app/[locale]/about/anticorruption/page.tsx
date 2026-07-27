import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import BackLink from '@/components/ui/BackLink';
import { getDocumentsByGroup } from '@/lib/content';

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

export default async function AntiCorruptionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const body = t.raw('anticorruption.body') as string[];
  const phone = t('anticorruption.phone');
  const email = t('anticorruption.email');
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;
  // Документы категории «Антикоррупционные» из базы (добавляются в разделе «Документы»)
  const docs = await getDocumentsByGroup(locale, 'anticorruption');

  return (
    <>
      <PageHeader label={t('label')} title={t('anticorruption.title')} />
      <Container className="py-16">
        {/* Текст */}
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-brand-gray">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Каналы связи */}
        <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <a
            href={telHref}
            className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-5 transition-colors hover:border-brand-blue/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
              <PhoneIcon />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-brand-blue">
                {t('anticorruption.phoneLabel')}
              </span>
              <span className="mt-1 block text-base font-medium text-brand-ink">
                {phone}
              </span>
            </span>
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-5 transition-colors hover:border-brand-blue/40"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
              <MailIcon />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-brand-blue">
                {t('anticorruption.emailLabel')}
              </span>
              <span className="mt-1 block truncate text-base font-medium text-brand-ink">
                {email}
              </span>
            </span>
          </a>
        </div>

        {/* Гарантия конфиденциальности */}
        <p className="mt-6 max-w-3xl rounded-xl bg-brand-soft px-5 py-4 text-base font-medium text-brand-ink">
          {t('anticorruption.confidential')}
        </p>

        {/* Документы категории «Антикоррупционные» — из базы */}
        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-bold text-brand-ink">
            {t('anticorruption.documentsTitle')}
          </h2>
          {docs.length > 0 ? (
            <ul className="mt-5 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white">
              {docs.map((doc, i) => (
                <li key={`${doc.title}-${i}`} className="flex items-center gap-4 px-5 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
                    <DocIcon />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-brand-ink">
                    {doc.title}
                  </span>
                  {doc.file ? (
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
                    >
                      {t('documents.download')}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 flex items-center gap-4 rounded-2xl border border-dashed border-brand-line bg-white p-5 text-brand-muted">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
                <DocIcon />
              </span>
              <span className="text-sm">{t('anticorruption.documentsEmpty')}</span>
            </div>
          )}
        </section>

        <div className="mt-12">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
