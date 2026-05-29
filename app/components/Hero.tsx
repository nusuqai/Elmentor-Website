import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, CheckCircleIcon } from './icons';
import { MENTOR_PHOTOS } from '../lib/types';

export default function Hero() {
  const trustPoints = [
    'Personalized mentor matching',
    'Expert-vetted professionals',
    'Flexible scheduling',
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 gradient-mesh-strong" />
      <div className="absolute top-0 right-0 w-[60%] h-full opacity-[0.04]">
        <Image src="/hero-bg.png" alt="" fill className="object-cover" priority />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 lg:px-10 py-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* ── Left column ── */}
        <div className="flex-1 max-w-[640px]">
          <div className="inline-flex items-center gap-2 bg-teal/[0.08] text-teal px-4 py-1.5 rounded-full text-[13px] font-semibold mb-6 border border-teal/[0.12]">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            Personalized Mentorship
          </div>

          <h1 className="text-[48px] md:text-[56px] lg:text-[64px] font-bold leading-[1.08] tracking-tight text-navy-base mb-6">
            Your Career Growth{' '}
            <br className="hidden md:block" />
            Starts With{' '}
            <span className="text-gradient-purple">
              The Right Mentor
            </span>
          </h1>

          <p className="text-[18px] md:text-[20px] leading-[1.6] text-text-secondary max-w-[520px] mb-10">
            Connect with experienced professionals who understand your goals.
            Get 1-on-1 guidance tailored to where you are and where you want to go.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2.5 bg-navy-base text-white text-[16px] font-semibold px-8 py-4 rounded-full hover:bg-deep-navy transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"
            >
              Find My Mentor
              <ArrowRightIcon size={18} />
            </Link>
            <Link
              href="/mentors"
              className="inline-flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm border border-border text-navy-base text-[16px] font-semibold px-8 py-4 rounded-full hover:bg-white hover:shadow-card transition-all duration-300"
            >
              Browse Mentors
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {trustPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[15px] text-text-secondary">
                <CheckCircleIcon size={18} className="text-green shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column — floating mentor cards ── */}
        <div className="flex-1 relative w-full max-w-[520px] min-h-[440px] hidden lg:flex items-center justify-center">
          {/* Card 1 — top left */}
          <div className="absolute top-4 left-0 glass shadow-glass rounded-xl p-4 w-[240px] animate-float z-10 hover:shadow-glass-hover transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={MENTOR_PHOTOS.mentor_001}
                alt="Maya El-Sayed"
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12"
              />
              <div>
                <p className="text-[14px] font-semibold text-navy-base leading-tight">Maya El-Sayed</p>
                <p className="text-[12px] text-text-muted">Product Management</p>
              </div>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed italic">
              &ldquo;Helped me transition from analyst to PM in 4 months.&rdquo;
            </p>
          </div>

          {/* Card 2 — center right */}
          <div className="absolute top-[140px] right-0 glass shadow-glass rounded-xl p-4 w-[260px] animate-float-delay z-20 hover:shadow-glass-hover transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src={MENTOR_PHOTOS.mentor_002}
                alt="Omar Khaled"
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12"
              />
              <div>
                <p className="text-[14px] font-semibold text-navy-base leading-tight">Omar Khaled</p>
                <p className="text-[12px] text-text-muted">Software Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green" />
              <span className="text-[12px] text-text-secondary">11 years experience</span>
            </div>
          </div>

          {/* Card 3 — bottom left */}
          <div className="absolute bottom-8 left-8 glass shadow-glass rounded-xl p-4 w-[220px] animate-float-delay-2 z-10 hover:shadow-glass-hover transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <Image
                src={MENTOR_PHOTOS.mentor_004}
                alt="Lina Fawzy"
                width={40}
                height={40}
                className="rounded-full object-cover w-10 h-10"
              />
              <div>
                <p className="text-[13px] font-semibold text-navy-base leading-tight">Lina Fawzy</p>
                <p className="text-[11px] text-text-muted">UX Design</p>
              </div>
            </div>
          </div>

          {/* Background decorative circle */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-teal/[0.04] blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* ── Scrolling ticker ── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border/40 bg-white/50 backdrop-blur-sm py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap inline-flex">
          {[...Array(3)].map((_, rep) => (
            <span key={rep} className="inline-flex items-center">
              {[
                'Maya El-Sayed  ·  Product',
                'Omar Khaled  ·  Engineering',
                'Nour Hassan  ·  Marketing',
                'Lina Fawzy  ·  Design',
                'Hassan Adel  ·  Data',
                'Sara Mahmoud  ·  HR',
                'Karim Youssef  ·  Cybersecurity',
                'Dalia Nasser  ·  Sales',
                'Yara Amin  ·  Finance',
                'Tarek Salem  ·  Operations',
              ].map((item, i) => (
                <span key={i} className="text-[13px] text-text-muted font-medium mx-8">{item}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
