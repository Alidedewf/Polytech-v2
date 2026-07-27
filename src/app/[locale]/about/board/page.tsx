import { setRequestLocale } from 'next-intl/server';
import AboutPeoplePage from '@/components/sections/AboutPeoplePage';
import { getBoard } from '@/lib/content';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const people = await getBoard(locale);
  return <AboutPeoplePage sectionKey="board" people={people} />;
}
