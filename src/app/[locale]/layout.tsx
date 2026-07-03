import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '../globals.css';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { SITE_URL, languageAlternates } from '@/lib/site';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'cyrillic'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const title = 'PolyTechPark';
  const description = t('subtitle');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${title}`,
    },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates(''),
    },
    openGraph: {
      type: 'website',
      siteName: title,
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      locale,
    },
    icons: { icon: [{ url: '/icon.svg?v=2', type: 'image/svg+xml' }] },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Включаем статический рендеринг для локали
  setRequestLocale(locale);

  const messages = await getMessages();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PolyTechPark',
    url: SITE_URL,
    description: 'АО «PolyTechPark» — технопарк Satbayev University',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Алматы',
      addressCountry: 'KZ',
      streetAddress: 'ул. Сатпаева, 22/5',
    },
    email: 'info@stsolutions.kz',
    telephone: '+7 7172 95 43 43',
  };

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className={`${montserrat.className} flex min-h-full flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
