import React from 'react';
import { ShieldCheckIcon, MessageCircleIcon, TrendingUpIcon } from './icons';
import { translations } from '../data/translations';

export default function ValueProps({ lang = 'en' }: { lang?: string }) {
  const isAr = lang === 'ar';
  const t = translations[lang as 'en' | 'ar'];

  const valueStyles = [
    {
      icon: <TargetMatchIcon />,
    },
    {
      icon: <ShieldCheckIcon size={28} />,
    },
    {
      icon: <MessageCircleIcon size={28} />,
    },
    {
      icon: <TrendingUpIcon size={28} />,
    },
  ];

  return (
    <section className="py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block text-[13px] font-semibold text-teal uppercase tracking-widest mb-4">
            {t.valueProps.tag}
          </span>
          <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight text-navy-base leading-tight max-w-[600px] mx-auto">
            {isAr ? (
              <>
                {t.valueProps.titlePre}{' '}
                <span className="text-gradient">{t.valueProps.titleHighlight}</span>
              </>
            ) : (
              <>
                {t.valueProps.titlePre}{' '}
                <span className="text-gradient">{t.valueProps.titleHighlight}</span>
              </>
            )}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {t.valueProps.items.map((item, i) => {
            const style = valueStyles[i];
            return (
              <div
                key={i}
                className="group relative rounded-2xl p-8 bg-white border border-border/60 hover:border-teal/20 transition-all duration-300 hover:shadow-card-hover overflow-hidden"
              >
                <div className={`absolute top-0 w-[200px] h-[200px] rounded-full bg-teal/[0.02] blur-3xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
                  isAr ? 'left-0' : 'right-0'
                }`} />
                
                <div className="relative z-10" style={{ textAlign: isAr ? 'right' : 'left' }}>
                  <div className={`w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-teal mb-5 ${
                    isAr ? 'mr-0 ml-auto' : ''
                  }`}>
                    {style.icon}
                  </div>
                  <h3 className="text-[18px] font-semibold text-navy-base mb-2">{item.title}</h3>
                  <p className="text-[15px] text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TargetMatchIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  );
}
