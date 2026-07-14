import { use } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import BackLink from '@/components/ui/BackLink';

export default function AboutHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('about');
  const body = t.raw('history.body') as string[];

  return (
    <>
      <PageHeader label={t('label')} title={t('history.title')} />
      <Container className="py-16">
        <Prose paragraphs={body} className="max-w-3xl" />
        <div className="mt-10">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
