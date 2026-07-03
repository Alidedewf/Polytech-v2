import type { Metadata } from 'next';
import { use } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE_URL, languageAlternates } from '@/lib/site';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Directions from '@/components/sections/Directions';
import Partners from '@/components/sections/Partners';
import Contacts from '@/components/sections/Contacts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  return {
    title: `${t('title_1')} ${t('title_2')}`,
    description: t('subtitle'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates(''),
    },
  };
}

export default function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <About />
      <Directions />
      <Partners />
      <Contacts />
    </>
  );
}
