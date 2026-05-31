import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from './icons';
import { translations } from '../data/translations';

export default function CTASection({ lang = 'en' }: { lang?: string }) {
  const isAr = lang === 'ar';
  const t = translations[lang as 'en' | 'ar'];

  return (
    <section className="py-28 px-6 lg:px-10 bg-surface/50 gradient-mesh">
      <div className="max-w-[720px] mx-auto text-center">
        <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight text-navy-base leading-tight mb-6">
          {t.cta.titlePre}{' '}
          <span className="text-gradient-purple">{t.cta.titleHighlight}</span>
        </h2>
        <p className="text-[18px] text-text-secondary leading-relaxed mb-10 max-w-[520px] mx-auto">
          {t.cta.subtitle}
        </p>
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${
          isAr ? 'sm:flex-row-reverse' : ''
        }`}>
          <Link
            href={`/${lang}/chat`}
            className="inline-flex items-center gap-2.5 bg-navy-base text-white text-[16px] font-semibold px-10 py-4 rounded-full hover:bg-deep-navy transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"
          >
            {t.cta.findMentorBtn}
            <ArrowRightIcon size={18} className={isAr ? 'rotate-180' : ''} />
          </Link>
          <Link
            href={`/${lang}/mentors`}
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-text-secondary hover:text-navy-base transition-colors"
          >
            {t.cta.browseMentorsLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
