import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { translations } from '../data/translations';

export default function Footer({ lang = 'en' }: { lang?: string }) {
  const isAr = lang === 'ar';
  const t = translations[lang as 'en' | 'ar'];

  const domains = isAr
    ? ['إدارة المنتجات', 'هندسة البرمجيات', 'تصميم تجربة المستخدم', 'التسويق والنمو']
    : ['Product Management', 'Software Engineering', 'UX Design', 'Growth Marketing'];

  return (
    <footer className="bg-deep-navy text-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 ${
          isAr ? 'md:flex md:flex-row-reverse md:justify-between' : ''
        }`}>
          {/* Brand */}
          <div className="md:col-span-1" style={{ textAlign: isAr ? 'right' : 'left' }}>
            <Link href={`/${lang}`} className={`flex items-center gap-2 mb-4 ${isAr ? 'flex-row-reverse' : ''}`}>
              <Image src="/logo.png" alt="Elmentor" width={28} height={28} className="brightness-0 invert" />
              <span className="text-[20px] font-bold tracking-tight text-white">
                {t.nav.logoText}
              </span>
            </Link>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-[240px] md:max-w-none">
              {t.footer.brandDescription}
            </p>
          </div>

          {/* Links */}
          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <h4 className="text-[14px] font-semibold text-white/80 mb-4 uppercase tracking-wider">
              {t.footer.platform}
            </h4>
            <div className="flex flex-col gap-3">
              <Link href={`/${lang}/mentors`} className="text-[14px] text-white/50 hover:text-white transition-colors">
                {t.mentorsPage.title}
              </Link>
              <Link href={`/${lang}/chat`} className="text-[14px] text-white/50 hover:text-white transition-colors">
                {t.nav.getMatched}
              </Link>
              <Link href={`/${lang}/#how-it-works`} className="text-[14px] text-white/50 hover:text-white transition-colors">
                {t.nav.howItWorks}
              </Link>
            </div>
          </div>

          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <h4 className="text-[14px] font-semibold text-white/80 mb-4 uppercase tracking-wider">
              {t.footer.domains}
            </h4>
            <div className="flex flex-col gap-3">
              {domains.map((dom, idx) => (
                <span key={idx} className="text-[14px] text-white/50">{dom}</span>
              ))}
            </div>
          </div>

          <div style={{ textAlign: isAr ? 'right' : 'left' }}>
            <h4 className="text-[14px] font-semibold text-white/80 mb-4 uppercase tracking-wider">
              {t.footer.company}
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">
                {t.footer.about}
              </Link>
              <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 ${
          isAr ? 'sm:flex-row-reverse' : ''
        }`}>
          <p className="text-[13px] text-white/40">
            {t.footer.copyright}
          </p>
          <p className="text-[13px] text-white/40">
            {t.footer.regionalNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
