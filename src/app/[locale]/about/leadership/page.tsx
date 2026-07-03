import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Cover from '@/components/ui/Cover';
import Prose from '@/components/ui/Prose';
import BackLink from '@/components/ui/BackLink';
import { getLeaders } from '@/lib/content';

export default async function AboutLeadershipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tc = await getTranslations('common');
  const leaders = await getLeaders(locale);

  return (
    <>
      <PageHeader label={t('label')} title={t('leadership.title')} />
      <Container className="py-16">
        <p className="max-w-2xl text-lg text-brand-gray">
          {t('leadership.intro')}
        </p>

        {leaders.length === 0 ? (
          <p className="py-12 text-brand-muted">{tc('empty')}</p>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((leader, i) => (
              <div
                key={`${leader.fullName}-${i}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white"
              >
                <Cover
                  url={leader.photoUrl}
                  alt={leader.fullName}
                  className="aspect-[4/5]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-brand-ink">
                    {leader.fullName}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-brand-blue">
                    {leader.position}
                  </p>
                  <Prose
                    paragraphs={leader.bio}
                    className="mt-4 text-sm text-brand-muted"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
