import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import { DIRECTIONS } from '@/lib/data';
import { DIRECTION_ICONS, ArrowIcon } from '@/components/ui/icons';

export default function Directions() {
  const t = useTranslations('directions');

  return (
    <section className="bg-brand-soft py-20 lg:py-28">
      <Container>
        <SectionHeading label={t('label')} title={t('title')} />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DIRECTIONS.map(({ key, index }, i) => {
            const Icon = DIRECTION_ICONS[key];
            return (
              <Reveal key={key} delay={i * 0.08}>
                <Link
                  href="/services"
                  className="group flex h-full flex-col rounded-2xl border border-brand-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-xl hover:shadow-brand-blue/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-tag text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="text-2xl font-bold text-brand-line transition-colors group-hover:text-brand-blue/30">
                      {index}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold leading-snug text-brand-ink">
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-muted">
                    {t(`items.${key}.desc`)}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                    {t('more')}
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
