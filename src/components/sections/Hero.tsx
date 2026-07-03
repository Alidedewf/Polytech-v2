'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Container from '@/components/ui/Container';
import { ArrowIcon } from '@/components/ui/icons';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden bg-brand-soft">
      {/* Фоновый баннер */}
      <Image
        src="/banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-right"
      />
      {/* Осветление слева — под текст (справа баннер открыт) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-soft via-brand-soft/80 to-brand-soft/50 lg:from-brand-soft lg:from-5% lg:via-brand-soft/55 lg:via-45% lg:to-transparent lg:to-80%"
        aria-hidden
      />
      {/* Затемнение снизу — для «веса» и читаемости */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-navy/10 to-transparent"
        aria-hidden
      />
      {/* Мягкое синее свечение */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-blue/10 blur-3xl"
        aria-hidden
      />

      <Container className="relative py-24 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-sm font-semibold uppercase tracking-[0.14em] text-brand-blue"
            >
              {t('badge')}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl"
            >
              {t('title_1')}
              <br />
              <span className="text-brand-blue">{t('title_2')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-brand-gray"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-7 py-3.5 text-[15px] font-semibold text-white shadow-md shadow-brand-navy/20 transition-colors hover:bg-brand-blue"
              >
                {t('cta')}
                <ArrowIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-md border border-brand-line bg-white px-7 py-3.5 text-[15px] font-semibold text-brand-ink transition-colors hover:border-brand-navy hover:text-brand-navy"
              >
                {t('secondary')}
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
