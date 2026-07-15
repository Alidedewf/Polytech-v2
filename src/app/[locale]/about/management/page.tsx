import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import AboutPeoplePage from '@/components/sections/AboutPeoplePage';

export default function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <AboutPeoplePage sectionKey="management" />;
}
