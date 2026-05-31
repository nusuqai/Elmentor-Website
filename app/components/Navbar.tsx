'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { MenuIcon, CloseIcon, ArrowRightIcon, GlobeIcon } from './icons';
import { translations } from '../data/translations';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const lang = pathname.startsWith('/ar') ? 'ar' : 'en';
  const t = translations[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const nextLang = lang === 'en' ? 'ar' : 'en';
  const nextLangName = lang === 'en' ? 'العربية' : 'English';

  const toggleLang = () => {
    const segments = pathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'ar') {
      segments[1] = nextLang;
    } else {
      segments.splice(1, 0, nextLang);
    }
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const newPath = segments.join('/') + search;
    router.push(newPath);
  };

  const links = [
    { label: t.nav.mentors, href: `/${lang}/mentors` },
    { label: t.nav.howItWorks, href: `/${lang}/#how-it-works` },
  ];

  const isActive = (href: string) => {
    if (href.includes('#')) {
      const pathOnly = href.split('#')[0];
      return pathname === pathOnly;
    }
    return pathname === href;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] h-[64px]'
            : 'bg-white h-[72px]'
        }`}
      >
        <div className={`max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 lg:px-10 ${
          lang === 'ar' ? 'flex-row-reverse' : ''
        }`}>
          {/* Logo */}
          <Link href={`/${lang}`} className={`flex items-center gap-2.5 group ${
            lang === 'ar' ? 'flex-row-reverse' : ''
          }`} aria-label="Elmentor Home">
            <Image
              src="/logo.png"
              alt="Elmentor"
              width={38}
              height={38}
              className="transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <span className="text-[22px] font-bold tracking-tight text-navy-base">
              {t.nav.logoText}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center gap-6 ${
            lang === 'ar' ? 'flex-row-reverse' : ''
          }`}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] font-medium transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-teal'
                    : 'text-text-secondary hover:text-navy-base'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-white/50 text-[13px] font-semibold text-text-secondary hover:text-navy-base hover:border-navy-base/20 transition-all cursor-pointer shadow-sm hover:shadow"
            >
              <GlobeIcon size={14} className="text-teal" />
              <span>{nextLangName}</span>
            </button>

            <Link
              href={`/${lang}/chat`}
              className="inline-flex items-center gap-2 bg-navy-base text-white text-[14px] font-semibold px-5 py-2.5 rounded-full hover:bg-deep-navy transition-all duration-200 hover:shadow-lg"
            >
              {t.nav.getMatched}
              <ArrowRightIcon size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-navy-base p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-[64px] left-0 right-0 bg-white shadow-elevated p-6 flex flex-col gap-4 animate-fade-up">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[16px] font-medium text-navy-base py-2 border-b border-border/50"
                onClick={() => setMobileOpen(false)}
                style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <button
              onClick={() => { toggleLang(); setMobileOpen(false); }}
              className={`inline-flex items-center justify-between px-4 py-3 rounded-xl border border-border bg-surface text-[14px] font-semibold text-navy-base hover:bg-border/30 transition-all cursor-pointer ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              <span className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <GlobeIcon size={16} className="text-teal" />
                <span>{lang === 'en' ? 'اللغة العربية' : 'English language'}</span>
              </span>
              <span className="text-[12px] text-text-muted font-medium">{nextLangName}</span>
            </button>

            <Link
              href={`/${lang}/chat`}
              className="inline-flex items-center justify-center gap-2 bg-navy-base text-white text-[15px] font-semibold px-6 py-3 rounded-full mt-2"
              onClick={() => setMobileOpen(false)}
            >
              {t.nav.getMatched}
              <ArrowRightIcon size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
