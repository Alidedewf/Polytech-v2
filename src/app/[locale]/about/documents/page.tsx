import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import BackLink from '@/components/ui/BackLink';
import DocumentsAccordion from '@/components/sections/DocumentsAccordion';

type DocGroup = { title: string; items: { title: string; file?: string }[] };

export default async function AboutDocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const groups = t.raw('documents.groups') as DocGroup[];

  return (
    <>
      <PageHeader label={t('label')} title={t('documents.title')} />
      <Container className="py-16">
        <p className="max-w-3xl text-lg text-brand-gray">
          {t('documents.intro')}
        </p>

        <div className="mt-10">
          <DocumentsAccordion
            groups={groups}
            downloadLabel={t('documents.download')}
            noFileLabel={t('documents.noFile')}
          />
        </div>

        <div className="mt-12">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
