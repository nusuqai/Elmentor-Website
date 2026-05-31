import React from 'react';
import Link from 'next/link';
import { SparkleIcon, TargetIcon, CalendarIcon, ArrowRightIcon } from './icons';
import { translations } from '../data/translations';

export default function HowItWorks({ lang = 'en' }: { lang?: string }) {
  const isAr = lang === 'ar';
  const t = translations[lang as 'en' | 'ar'];

  const stepStyles = [
    {
      icon: <TargetIcon size={28} />,
      gradient: 'from-teal/10 to-teal/[0.02]',
      iconColor: 'text-teal',
    },
    {
      icon: <SparkleIcon size={28} />,
      gradient: 'from-purple/10 to-purple/[0.02]',
      iconColor: 'text-purple',
    },
    {
      icon: <CalendarIcon size={28} />,
      gradient: 'from-navy-base/10 to-navy-base/[0.02]',
      iconColor: 'text-navy-base',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block text-[13px] font-semibold text-purple uppercase tracking-widest mb-4">
            {t.howItWorks.tag}
          </span>
          <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight text-navy-base leading-tight">
            {isAr ? (
              <>
                {t.howItWorks.titlePre}{' '}
                <span className="text-gradient">{t.howItWorks.titleHighlight}</span>
              </>
            ) : (
              <>
                {t.howItWorks.titlePre}{' '}
                <span className="text-gradient">{t.howItWorks.titleHighlight}</span>
              </>
            )}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.howItWorks.steps.map((step, i) => {
            const style = stepStyles[i];
            return (
              <div
                key={i}
                className="group relative bg-white rounded-2xl p-8 border border-border/60 hover:border-border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              >
                {/* Step Number */}
                <div className={`absolute top-6 text-[72px] font-bold text-surface-alt/80 leading-none select-none pointer-events-none ${
                  isAr ? 'left-6' : 'right-6'
                }`}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center mb-6 ${style.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                  {style.icon}
                </div>

                <h3 className="text-[20px] font-semibold text-navy-base mb-3 leading-tight" style={{ textAlign: isAr ? 'right' : 'left' }}>
                  {step.title}
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed" style={{ textAlign: isAr ? 'right' : 'left' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            href={`/${lang}/chat`}
            className="inline-flex items-center gap-2.5 bg-navy-base text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-deep-navy transition-all duration-200 hover:shadow-lg"
          >
            {t.howItWorks.getStartedBtn}
            <ArrowRightIcon size={16} className={isAr ? 'rotate-180' : ''} />
          </Link>
        </div>
      </div>
    </section>
  );
}
