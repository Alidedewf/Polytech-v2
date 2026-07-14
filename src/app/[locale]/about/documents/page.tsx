import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import BackLink from '@/components/ui/BackLink';
import { getDocuments } from '@/lib/content';

function DocIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  );
}

export default async function AboutDocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tc = await getTranslations('common');
  const documents = await getDocuments(locale);

  return (
    <>
      <PageHeader label={t('label')} title={t('documents.title')} />
      <Container className="py-16">
        <p className="max-w-2xl text-lg text-brand-gray">
          {t('documents.intro')}
        </p>

        {documents.length === 0 ? (
          <p className="py-12 text-brand-muted">{tc('empty')}</p>
        ) : (
          <ul className="mt-10 max-w-3xl divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white">
            {documents.map((doc, i) => (
              <li
                key={`${doc.title}-${i}`}
                className="flex items-center gap-4 p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
                  <DocIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-brand-ink">
                    {doc.title}
                  </p>
                  {doc.category ? (
                    <p className="text-sm text-brand-muted">{doc.category}</p>
                  ) : null}
                </div>
                {doc.fileUrl ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-blue"
                  >
                    {t('documents.download')}
                  </a>
                ) : (
                  <span className="shrink-0 text-sm text-brand-muted">
                    {t('documents.noFile')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
