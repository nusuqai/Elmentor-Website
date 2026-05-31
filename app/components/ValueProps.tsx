import React from 'react';
import { ShieldCheckIcon, MessageCircleIcon, TrendingUpIcon } from './icons';

export default function ValueProps() {
  const values = [
    {
      icon: <TargetMatchIcon />,
      title: 'Precision Matching',
      description: 'We go beyond keywords. Our matching considers your goals, personality, communication style, and schedule to find a mentor who truly fits.',
    },
    {
      icon: <ShieldCheckIcon size={28} />,
      title: 'Vetted Experts',
      description: 'Every mentor is a working professional with real experience. No hobbyists, no resellers just people who have been where you want to go.',
    },
    {
      icon: <MessageCircleIcon size={28} />,
      title: 'Flexible Communication',
      description: 'Video calls, async chat, voice notes your mentorship adapts to your life, not the other way around.',
    },
    {
      icon: <TrendingUpIcon size={28} />,
      title: 'Real Career Growth',
      description: 'Our mentees don\'t just learn they land roles, earn promotions, and build the confidence to lead.',
    },
  ];

  return (
    <section className="py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block text-[13px] font-semibold text-teal uppercase tracking-widest mb-4">
            Why Elmentor
          </span>
          <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight text-navy-base leading-tight max-w-[600px] mx-auto">
            Mentorship that actually{' '}
            <span className="text-gradient">moves the needle</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="group relative rounded-2xl p-8 bg-white border border-border/60 hover:border-teal/20 transition-all duration-300 hover:shadow-card-hover overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-teal/[0.02] blur-3xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-teal mb-5">
                  {v.icon}
                </div>
                <h3 className="text-[18px] font-semibold text-navy-base mb-2">{v.title}</h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">{v.description}</p>
              </div>
            </div>
          ))}
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
