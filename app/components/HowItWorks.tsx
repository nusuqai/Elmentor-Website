import React from 'react';
import Link from 'next/link';
import { SparkleIcon, TargetIcon, CalendarIcon, ArrowRightIcon } from './icons';

export default function HowItWorks() {
  const steps = [
    {
      icon: <TargetIcon size={28} />,
      title: 'Share Your Goals',
      description: 'Tell us about your career stage, where you want to go, and what kind of support you need.',
      gradient: 'from-teal/10 to-teal/[0.02]',
      iconColor: 'text-teal',
    },
    {
      icon: <SparkleIcon size={28} />,
      title: 'We Find Your Match',
      description: 'Our intelligent matching considers your goals, schedule, communication style, and personality for the perfect fit.',
      gradient: 'from-purple/10 to-purple/[0.02]',
      iconColor: 'text-purple',
    },
    {
      icon: <CalendarIcon size={28} />,
      title: 'Start Growing',
      description: 'Begin with a trial session. Once you and your mentor click, your journey of growth takes off.',
      gradient: 'from-navy-base/10 to-navy-base/[0.02]',
      iconColor: 'text-navy-base',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-28 px-6 lg:px-10 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block text-[13px] font-semibold text-purple uppercase tracking-widest mb-4">
            How It Works
          </span>
          <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight text-navy-base leading-tight">
            Three steps to the{' '}
            <span className="text-gradient">right mentor</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-8 border border-border/60 hover:border-border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              {/* Step Number */}
              <div className="absolute top-6 right-6 text-[72px] font-bold text-surface-alt/80 leading-none select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 ${step.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                {step.icon}
              </div>

              <h3 className="text-[20px] font-semibold text-navy-base mb-3 leading-tight">
                {step.title}
              </h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2.5 bg-navy-base text-white text-[15px] font-semibold px-8 py-3.5 rounded-full hover:bg-deep-navy transition-all duration-200 hover:shadow-lg"
          >
            Get Started Now
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
