import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import BackLink from '@/components/ui/BackLink';

/** Текстовая подстраница раздела «О компании»: заголовок + абзацы из i18n. */
export default function AboutTextPage({ sectionKey }: { sectionKey: string }) {
  const t = useTranslations('about');
  const body = t.raw(`${sectionKey}.body`) as string[];

  return (
    <>
      <PageHeader label={t('label')} title={t(`${sectionKey}.title`)} />
      <Container className="py-16">
        <Prose paragraphs={body} className="max-w-3xl text-lg" />
        <div className="mt-10">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
