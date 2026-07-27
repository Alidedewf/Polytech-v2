import { setRequestLocale } from 'next-intl/server';
import AboutPeoplePage from '@/components/sections/AboutPeoplePage';
import { getManagement } from '@/lib/content';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const people = await getManagement(locale);
  return <AboutPeoplePage sectionKey="management" people={people} />;
}
