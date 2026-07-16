'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';

const LOCALES = ['ru', 'kk', 'en'] as const;

type NavChild = { href: string; label: string };
type NavLink = { href: string; label: string; children?: NavChild[] };

export default function Header() {
  const t = useTranslations('nav');
  const ta = useTranslations('about');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: NavLink[] = [
    {
      href: '/about',
      label: t('about'),
      children: [
        { href: '/about/board', label: ta('menu.board') },
        { href: '/about/management', label: ta('menu.management') },
        { href: '/about/anticorruption', label: ta('menu.anticorruption') },
        { href: '/about/documents', label: ta('menu.documents') },
        { href: '/about/vacancies', label: ta('menu.vacancies') },
      ],
    },
    { href: '/projects', label: t('projects') },
    { href: '/services', label: t('services') },
    { href: '/contacts', label: t('contacts') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-line bg-white">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-[10px]">
        {/* Логотип */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Group.svg"
            alt="PolyTech Park"
            width={160}
            height={40}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Десктоп-навигация */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={`border-b-2 pb-1 text-base font-semibold leading-none tracking-wider transition-colors ${
                    isActive
                      ? 'border-[#002A7A] text-[#002A7A]'
                      : 'border-transparent text-[#494949] hover:border-[#002A7A] hover:text-[#002A7A]'
                  }`}
                >
                  {link.label}
                </Link>

                {link.children ? (
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-4 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                    <div className="flex w-80 flex-col rounded-xl border border-brand-line bg-white p-2 shadow-xl shadow-brand-blue/5">
                      {link.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-soft hover:text-brand-navy ${
                            pathname === c.href
                              ? 'text-brand-navy'
                              : 'text-[#494949]'
                          }`}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Переключатель языков (десктоп) */}
          <div className="relative hidden md:block">
            <div className="group">
              <button className="flex items-center gap-2 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-brand-blue">
                {locale.toUpperCase()}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="invisible absolute right-0 top-full mt-2 flex w-20 flex-col overflow-hidden rounded-md border border-gray-100 bg-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                {LOCALES.map((l) => (
                  <Link
                    key={l}
                    href={pathname}
                    locale={l}
                    className={`px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-gray-50 ${
                      locale === l ? 'bg-gray-100 text-brand-navy' : 'text-gray-700'
                    }`}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Кнопка-гамбургер (мобильные) */}
          <button
            type="button"
            aria-label="Меню"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-brand-ink transition-colors hover:bg-brand-soft md:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильная панель */}
      {mobileOpen && (
        <nav className="border-t border-brand-line bg-white md:hidden">
          <div className="mx-auto max-w-[1440px] px-6 py-4">
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 text-base font-semibold tracking-wider transition-colors ${
                        isActive ? 'text-brand-navy' : 'text-[#494949]'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children ? (
                      <ul className="mb-2 ml-3 flex flex-col border-l border-brand-line pl-3">
                        {link.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setMobileOpen(false)}
                              className={`block py-2 text-sm font-medium transition-colors ${
                                pathname === c.href
                                  ? 'text-brand-navy'
                                  : 'text-brand-muted'
                              }`}
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {/* Языки в мобильном меню */}
            <div className="mt-4 flex gap-2 border-t border-brand-line pt-4">
              {LOCALES.map((l) => (
                <Link
                  key={l}
                  href={pathname}
                  locale={l}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    locale === l
                      ? 'bg-brand-navy text-white'
                      : 'bg-brand-soft text-brand-ink'
                  }`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
