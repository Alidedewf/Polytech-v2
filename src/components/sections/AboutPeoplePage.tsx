import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/ui/PageHeader';
import Prose from '@/components/ui/Prose';
import BackLink from '@/components/ui/BackLink';

type Person = { name: string; position: string; photo?: string };

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="h-20 w-20">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/** Подстраница раздела «О компании»: текст + карточки людей (состав органа). */
export default function AboutPeoplePage({ sectionKey }: { sectionKey: string }) {
  const t = useTranslations('about');
  const body = t.raw(`${sectionKey}.body`) as string[];
  const people = (t.raw(`${sectionKey}.people`) as Person[]) ?? [];

  return (
    <>
      <PageHeader label={t('label')} title={t(`${sectionKey}.title`)} />
      <Container className="py-16">
        <Prose paragraphs={body} className="max-w-3xl text-lg" />

        {people.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-brand-ink">
              {t(`${sectionKey}.membersTitle`)}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((person, i) => (
                <div
                  key={`${person.name}-${i}`}
                  className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-sm"
                >
                  {/* Фото (или заглушка) */}
                  <div className="relative flex aspect-[4/5] items-center justify-center bg-brand-soft text-brand-blue/60">
                    {person.photo ? (
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                  {/* Имя и должность */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-brand-ink">
                      {person.name}
                    </h3>
                    <p className="mt-1.5 text-sm font-semibold leading-relaxed text-brand-blue">
                      {person.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12">
          <BackLink href="/about" label={t('label')} />
        </div>
      </Container>
    </>
  );
}
