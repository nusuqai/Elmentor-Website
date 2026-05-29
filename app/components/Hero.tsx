'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, CheckCircleIcon, SearchIcon } from './icons';
import { MENTOR_PHOTOS } from '../lib/types';

const POPULAR_SEARCHES = [
  { label: 'Product Management', domain: 'Product' },
  { label: 'Data Science', domain: 'Data' },
  { label: 'UX Design', domain: 'Design' },
  { label: 'Career Transition', domain: 'All' },
  { label: 'Engineering', domain: 'Engineering' },
];

const FEATURED = [
  { id: 'mentor_001', name: 'Maya El-Sayed', title: 'Product Manager at Spotify', exp: 8, rating: 4.9, reviews: 124, tags: ['Product Strategy', 'Roadmapping', 'PM Coaching'], badge: 'Top Mentor' },
  { id: 'mentor_002', name: 'Omar Khaled', title: 'Software Engineering Manager', exp: 11, rating: 4.9, reviews: 98, tags: ['Leadership', 'Team Management', 'Career Growth'] },
  { id: 'mentor_004', name: 'Lina Fawzy', title: 'Senior UX Designer', exp: 4, rating: 5.0, reviews: 76, tags: ['UX Strategy', 'Portfolio Review', 'Design Career'] },
];

const TESTIMONIALS = [
  { name: 'Salma T.', role: 'Product Manager', quote: 'Maya helped me transition into product management with a clear roadmap and real-world advice.', mentorId: 'mentor_001' },
  { name: 'Ahmed K.', role: 'Engineering Manager', quote: "Omar's guidance was instrumental in my promotion to Engineering Manager.", mentorId: 'mentor_002' },
  { name: 'Nour A.', role: 'UX Designer', quote: "Lina's feedback on my portfolio and interview prep was a game changer.", mentorId: 'mentor_004' },
];

const STATS = [
  { value: '10+', label: 'Expert mentors' },
  { value: '500+', label: 'Mentorship sessions' },
  { value: '4.9/5', label: 'Average rating' },
  { value: '95%', label: 'Would recommend' },
];

const GOAL_OPTIONS = [
  { value: 'career-growth', label: 'Career Growth' },
  { value: 'role-transition', label: 'Role Transition' },
  { value: 'technical-skills', label: 'Technical Skills' },
  { value: 'leadership', label: 'Leadership' },
];

const LEVEL_OPTIONS = [
  { value: 'entry', label: 'Entry-level' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'director', label: 'Director+' },
];

const FORMAT_OPTIONS = [
  { value: 'video', label: 'Video Call' },
  { value: 'async', label: 'Async Chat' },
  { value: 'voice', label: 'Voice Notes' },
];

export default function Hero() {
  const router = useRouter();
  const [goal, setGoal] = useState('career-growth');
  const [level, setLevel] = useState('mid');
  const [format, setFormat] = useState('video');

  const handleFindMatches = () => {
    const params = new URLSearchParams({ goal, level, format });
    router.push(`/mentors?${params.toString()}`);
  };

  return (
    <section className="relative bg-white pt-[88px]">
      {/* ─── Main Hero ─── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* ═══ LEFT COLUMN ═══ */}
          <div className="flex-1 flex flex-col justify-center max-w-[560px]">
            {/* Badge */}

            {/* Headline */}
            <h1 className="text-[44px] md:text-[52px] lg:text-[58px] font-bold leading-[1.08] tracking-tight text-navy-base mb-5">
              Clarity today.
              <br />
              <span className="text-gradient-purple">Confidence</span> tomorrow.
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] md:text-[18px] leading-[1.65] text-text-secondary max-w-[480px] mb-8">
              Connect with vetted professionals who understand your goals and help you take the right steps forward.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2.5 bg-navy-base text-white text-[15px] font-semibold px-7 py-3.5 rounded-full hover:bg-deep-navy transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"
              >
                Find My Mentor
                <ArrowRightIcon size={16} />
              </Link>
              <Link
                href="/mentors"
                className="inline-flex items-center justify-center gap-2 bg-white border border-border text-navy-base text-[15px] font-semibold px-7 py-3.5 rounded-full hover:bg-surface transition-all duration-200"
              >
                Browse Mentors
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mb-10">
              {['Personalized matches', 'Vetted experts', 'Private & secure', 'Flexible scheduling'].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[13px] text-text-secondary">
                  <CheckCircleIcon size={15} className="text-green shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-border/60">
              {STATS.map((s, i) => (
                <div key={i}>
                  <p className="text-[24px] font-bold text-navy-base leading-none">{s.value}</p>
                  <p className="text-[13px] text-text-muted mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="flex-1 flex flex-col gap-6 max-w-[600px]">
            {/* ── Search Card ── */}
            <div className="bg-white rounded-2xl border border-border shadow-card p-6">
              <h2 className="text-[20px] font-bold text-navy-base mb-1">Find your right mentor</h2>
              <p className="text-[14px] text-text-muted mb-5">Tell us about your goals and we will match you with the right expert.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="flex flex-col">
                  <span className="text-[11px] text-text-muted font-medium mb-1">What do you want help with?</span>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-2.5 text-[14px] font-medium text-navy-base focus:outline-none focus:border-teal appearance-none cursor-pointer"
                  >
                    {GOAL_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-text-muted font-medium mb-1">Your experience level</span>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-2.5 text-[14px] font-medium text-navy-base focus:outline-none focus:border-teal appearance-none cursor-pointer"
                  >
                    {LEVEL_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-text-muted font-medium mb-1">Preferred format</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="bg-surface border border-border rounded-lg px-3 py-2.5 text-[14px] font-medium text-navy-base focus:outline-none focus:border-teal appearance-none cursor-pointer"
                  >
                    {FORMAT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Popular */}
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <SearchIcon size={14} className="text-text-muted shrink-0" />
                <span className="text-[12px] text-text-muted font-medium">Popular:</span>
                {POPULAR_SEARCHES.map((s, i) => (
                  <Link
                    key={i}
                    href={`/mentors?domain=${s.domain}`}
                    className="text-[12px] font-medium text-text-secondary hover:text-teal transition-colors"
                  >
                    {s.label}
                  </Link>
                ))}
              </div>

              <button
                onClick={handleFindMatches}
                className="w-full inline-flex items-center justify-center gap-2 bg-navy-base text-white text-[14px] font-semibold py-3 rounded-lg hover:bg-deep-navy transition-colors cursor-pointer"
              >
                Find Matches
              </button>
            </div>

            {/* ── Featured Mentor Cards ── */}
            <div className="grid grid-cols-3 gap-3">
              {FEATURED.map((m) => (
                <Link
                  key={m.id}
                  href="/mentors"
                  className="group bg-white rounded-xl border border-border/60 overflow-hidden hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="relative h-[120px] md:h-[140px] overflow-hidden">
                    <Image
                      src={MENTOR_PHOTOS[m.id]}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 33vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {m.badge && (
                      <div className="absolute top-2 left-2 bg-teal text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {m.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] font-semibold text-navy-base leading-tight flex items-center gap-1">
                      {m.name}
                      <CheckCircleIcon size={12} className="text-teal shrink-0" />
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug truncate">{m.title}</p>
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-text-secondary">
                      <span className="text-[#F7B731]">&#9733;</span>
                      <span className="font-semibold">{m.rating}</span>
                      <span className="text-text-muted">({m.reviews})</span>
                      <span className="text-text-muted mx-1">&#183;</span>
                      <span>{m.exp} yrs exp.</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.tags.slice(0, 2).map((t, j) => (
                        <span key={j} className="text-[9px] font-medium text-text-muted bg-surface px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/mentors"
              className="self-center inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy-base hover:text-teal transition-colors group"
            >
              View all mentors
              <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Testimonials Strip ─── */}
      <div className="border-t border-border/40 bg-surface/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex gap-3">
                <Image
                  src={MENTOR_PHOTOS[t.mentorId]}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-10 h-10 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[13px] text-text-secondary leading-relaxed italic mb-1.5">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-[12px] text-text-muted">
                    <span className="font-semibold text-navy-base">{t.name}</span>
                    {' '}&middot;{' '}{t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
