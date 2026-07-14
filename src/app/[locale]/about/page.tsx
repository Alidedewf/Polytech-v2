import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import Accordion, { type AccordionItem } from '@/components/ui/Accordion';
import { FACT_ICONS } from '@/components/ui/icons';
import { FACTS } from '@/lib/data';
import { getLeaders, getDocuments } from '@/lib/content';

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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const leaders = await getLeaders(locale);
  const documents = await getDocuments(locale);

  const sections: AccordionItem[] = [
    {
      key: 'history',
      title: t('menu.history'),
      desc: t('menuDesc.history'),
      content: <Prose paragraphs={t.raw('history.body') as string[]} />,
    },
    {
      key: 'strategy',
      title: t('menu.strategy'),
      desc: t('menuDesc.strategy'),
      content: (
        <>
          <Prose paragraphs={t.raw('strategy.body') as string[]} />
          <h3 className="mt-8 text-base font-bold text-brand-ink">
            {t('strategy.goalsTitle')}
          </h3>
          <ul className="mt-4 space-y-3">
            {(t.raw('strategy.goals') as string[]).map((g, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-brand-line p-4"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-tag text-xs font-bold text-brand-blue">
                  {i + 1}
                </span>
                <span className="text-base text-brand-gray">{g}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      key: 'leadership',
      title: t('menu.leadership'),
      desc: t('menuDesc.leadership'),
      content: (
        <>
          <p className="text-base leading-relaxed text-brand-gray">
            {t('leadership.intro')}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader, i) => (
              <div
                key={`${leader.fullName}-${i}`}
                className="rounded-xl border border-brand-line p-5"
              >
                <h4 className="text-base font-bold text-brand-ink">
                  {leader.fullName}
                </h4>
                <p className="mt-1 text-sm font-semibold text-brand-blue">
                  {leader.position}
                </p>
                <Prose
                  paragraphs={leader.bio}
                  className="mt-3 text-sm text-brand-muted"
                />
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      key: 'structure',
      title: t('menu.structure'),
      desc: t('menuDesc.structure'),
      content: (
        <>
          <Prose paragraphs={t.raw('structure.body') as string[]} />
          <h3 className="mt-8 text-base font-bold text-brand-ink">
            {t('structure.unitsTitle')}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(t.raw('structure.units') as string[]).map((u, i) => (
              <div
                key={i}
                className="rounded-xl border border-brand-line p-5 text-base font-semibold text-brand-ink"
              >
                {u}
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      key: 'documents',
      title: t('menu.documents'),
      desc: t('menuDesc.documents'),
      content: (
        <>
          <p className="text-base leading-relaxed text-brand-gray">
            {t('documents.intro')}
          </p>
          <ul className="mt-6 divide-y divide-brand-line overflow-hidden rounded-xl border border-brand-line">
            {documents.map((doc, i) => (
              <li key={`${doc.title}-${i}`} className="flex items-center gap-4 p-5">
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
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        label={t('label')}
        title={t('pageTitle')}
        description={t('pageText')}
      />
      <Container className="py-20 lg:py-24">
        {/* Ключевые факты */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {t('factsTitle')}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map(({ key }) => {
              const Icon = FACT_ICONS[key];
              return (
                <div
                  key={key}
                  className="flex h-full flex-col items-start gap-4 rounded-2xl border border-brand-line bg-white p-7"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="text-lg font-bold leading-snug text-brand-ink">
                    {t(`facts.${key}.title`)}
                  </div>
                  <div className="text-sm leading-relaxed text-brand-muted">
                    {t(`facts.${key}.desc`)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Разделы — раскрывающийся список */}
        <section className="mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {t('sectionsTitle')}
          </h2>
          <div className="mt-10">
            <Accordion items={sections} />
          </div>
        </section>
      </Container>
    </>
  );
}
