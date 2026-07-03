'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function Footer() {
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');

  const navLinks = [
    { href: '/about', label: tNav('about') },
    { href: '/services', label: tNav('services') },
    { href: '/partners', label: tNav('partners') },
    { href: '/contacts', label: tNav('contacts') },
  ];

  const legalLinks = [
    { href: '/terms', label: tFooter('terms') },
    { href: '/privacy', label: tFooter('privacy') },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F9FAFB] border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[5px]">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Logo & Description */}
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Image 
                src="/Group.svg" 
                alt="PolyTech Park" 
                width={160} 
                height={40} 
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-[#6B7280] text-[15px] font-medium leading-normal tracking-wider max-w-xs">
              {tFooter('description')}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-lg font-semibold leading-none tracking-wider text-[#111827] mb-6">{tFooter('navigation')}</h3>
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#6B7280] text-[15px] font-medium leading-none tracking-wider hover:text-[#002A7A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-lg font-semibold leading-none tracking-wider text-[#111827] mb-6">{tFooter('legal')}</h3>
            <ul className="flex flex-col gap-4">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#6B7280] text-[15px] font-medium leading-none tracking-wider hover:text-[#002A7A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contacts */}
          <div>
            <h3 className="text-lg font-semibold leading-none tracking-wider text-[#111827] mb-6">Контакты</h3>
            <ul className="flex flex-col gap-6">
              
              <li className="flex items-start gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0040BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-[#6B7280] text-[15px] font-medium leading-tight tracking-wider">
                  {tFooter('address_part1')}<br />
                  {tFooter('address_part2')}
                </span>
              </li>

              <li className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0040BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+77172954343" className="text-[#6B7280] text-[15px] font-medium leading-none tracking-wider hover:text-[#002A7A] transition-colors">
                  +7 7172 95 43 43
                </a>
              </li>

              <li className="flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0040BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:info@stsolutions.kz" className="text-[#6B7280] text-[15px] font-medium leading-none tracking-wider hover:text-[#002A7A] transition-colors">
                  info@stsolutions.kz
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="text-xs font-medium tracking-wider text-[#6B7280]">
          © {currentYear} PolyTechPark.kz {tFooter('rights')}.
        </div>
        
      </div>
    </footer>
  );
}
