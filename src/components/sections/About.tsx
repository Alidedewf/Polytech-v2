import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import { FACTS } from '@/lib/data';
import { FACT_ICONS, ArrowIcon } from '@/components/ui/icons';

export default function About() {
  const t = useTranslations('about');

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Левая колонка — текст */}
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-blue">
              {t('label')}
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-brand-ink sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-brand-gray">
              {t('text')}
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-brand-blue transition-colors hover:text-brand-navy"
            >
              {t('more')}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* Правая колонка — статистика 2×2 */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12">
              {FACTS.map(({ key }) => {
                const Icon = FACT_ICONS[key];
                return (
                  <div key={key} className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-tag text-brand-blue">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="text-base font-bold text-brand-ink">
                        {t(`facts.${key}.title`)}
                      </div>
                      <div className="mt-1 text-sm text-brand-muted">
                        {t(`facts.${key}.desc`)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
