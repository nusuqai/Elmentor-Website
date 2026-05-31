'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, CheckCircleIcon, SearchIcon } from './icons';
import { MENTOR_PHOTOS } from '../lib/types';
import { translations } from '../data/translations';

const POPULAR_SEARCHES_LANG = {
  en: [
    { label: 'Product Management', domain: 'Product' },
    { label: 'Data Science', domain: 'Data' },
    { label: 'UX Design', domain: 'Design' },
    { label: 'Career Transition', domain: 'All' },
    { label: 'Engineering', domain: 'Engineering' },
  ],
  ar: [
    { label: 'إدارة المنتجات', domain: 'Product' },
    { label: 'علم البيانات', domain: 'Data' },
    { label: 'تصميم تجربة المستخدم', domain: 'Design' },
    { label: 'التحول المهني', domain: 'All' },
    { label: 'الهندسة البرمجية', domain: 'Engineering' },
  ]
};

const FEATURED_LANG = {
  en: [
    { id: 'mentor_001', name: 'Maya El-Sayed', title: 'Product Manager at Spotify', exp: 8, rating: 4.9, reviews: 124, tags: ['Product Strategy', 'Roadmapping', 'PM Coaching'], badge: 'Top Mentor' },
    { id: 'mentor_002', name: 'Omar Khaled', title: 'Software Engineering Manager', exp: 11, rating: 4.9, reviews: 98, tags: ['Leadership', 'Team Management', 'Career Growth'] },
    { id: 'mentor_004', name: 'Lina Fawzy', title: 'Senior UX Designer', exp: 4, rating: 5.0, reviews: 76, tags: ['UX Strategy', 'Portfolio Review', 'Design Career'] },
  ],
  ar: [
    { id: 'mentor_001', name: 'مايا السيد', title: 'مديرة منتج في سبوتيفاي', exp: 8, rating: 4.9, reviews: 124, tags: ['استراتيجية المنتج', 'خارطة الطريق', 'تدريب PM'], badge: 'أفضل موجه' },
    { id: 'mentor_002', name: 'عمر خالد', title: 'مدير هندسة البرمجيات', exp: 11, rating: 4.9, reviews: 98, tags: ['القيادة', 'إدارة الفرق', 'النمو المهني'] },
    { id: 'mentor_004', name: 'لينا فوزي', title: 'مصممة أولى لتجربة المستخدم', exp: 4, rating: 5.0, reviews: 76, tags: ['استراتيجية UX', 'مراجعة البورتفوليو', 'التصميم المهني'] },
  ]
};

const TESTIMONIALS_LANG = {
  en: [
    { name: 'Salma T.', role: 'Product Manager', quote: 'Maya helped me transition into product management with a clear roadmap and real-world advice.', mentorId: 'mentor_001' },
    { name: 'Ahmed K.', role: 'Engineering Manager', quote: "Omar's guidance was instrumental in my promotion to Engineering Manager.", mentorId: 'mentor_002' },
    { name: 'Nour A.', role: 'UX Designer', quote: "Lina's feedback on my portfolio and interview prep was a game changer.", mentorId: 'mentor_004' },
  ],
  ar: [
    { name: 'سلمى ت.', role: 'مديرة منتج', quote: 'ساعدتني مايا في الانتقال إلى إدارة المنتجات بخارطة طريق واضحة ونصائح واقعية ممتازة.', mentorId: 'mentor_001' },
    { name: 'أحمد ك.', role: 'مدير هندسي', quote: 'كانت توجيهات عمر حاسمة ومحورية للغاية في ترقيتي إلى رتبة مدير هندسة البرمجيات.', mentorId: 'mentor_002' },
    { name: 'نور أ.', role: 'مصممة UX', quote: 'كانت تعليقات لينا على البورتفوليو الخاص بي والاستعداد للمقابلات نقطة تحول حقيقية ومفصلية في مسيرتي.', mentorId: 'mentor_004' },
  ]
};

const GOAL_OPTIONS_LANG = {
  en: [
    { value: 'career-growth', label: 'Career Growth' },
    { value: 'role-transition', label: 'Role Transition' },
    { value: 'technical-skills', label: 'Technical Skills' },
    { value: 'leadership', label: 'Leadership' },
  ],
  ar: [
    { value: 'career-growth', label: 'النمو المهني' },
    { value: 'role-transition', label: 'التحول الوظيفي' },
    { value: 'technical-skills', label: 'المهارات التقنية' },
    { value: 'leadership', label: 'القيادة والإدارة' },
  ]
};

const LEVEL_OPTIONS_LANG = {
  en: [
    { value: 'entry', label: 'Entry-level' },
    { value: 'mid', label: 'Mid-level' },
    { value: 'senior', label: 'Senior' },
    { value: 'director', label: 'Director+' },
  ],
  ar: [
    { value: 'entry', label: 'مبتدئ' },
    { value: 'mid', label: 'متوسط' },
    { value: 'senior', label: 'خبير (سينيور)' },
    { value: 'director', label: 'مدير فما فوق' },
  ]
};

const FORMAT_OPTIONS_LANG = {
  en: [
    { value: 'video', label: 'Video Call' },
    { value: 'async', label: 'Async Chat' },
    { value: 'voice', label: 'Voice Notes' },
  ],
  ar: [
    { value: 'video', label: 'مكالمة فيديو' },
    { value: 'async', label: 'محادثة غير متزامنة' },
    { value: 'voice', label: 'ملاحظات صوتية' },
  ]
};

export default function Hero() {
  const router = useRouter();
  const pathname = usePathname();

  const lang = pathname.startsWith('/ar') ? 'ar' : 'en';
  const t = translations[lang];

  const popularSearches = POPULAR_SEARCHES_LANG[lang];
  const featured = FEATURED_LANG[lang];
  const testimonials = TESTIMONIALS_LANG[lang];
  const goalOptions = GOAL_OPTIONS_LANG[lang];
  const levelOptions = LEVEL_OPTIONS_LANG[lang];
  const formatOptions = FORMAT_OPTIONS_LANG[lang];

  const [goal, setGoal] = useState('career-growth');
  const [level, setLevel] = useState('mid');
  const [format, setFormat] = useState('video');

  const handleFindMatches = () => {
    const params = new URLSearchParams({ goal, level, format });
    router.push(`/${lang}/mentors?${params.toString()}`);
  };

  return (
    <section className="relative bg-white pt-[88px]">
      {/* ─── Main Hero ─── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6 lg:py-16">
        <div className={`flex flex-col lg:flex-row gap-12 lg:gap-16 ${
          lang === 'ar' ? 'lg:flex-row-reverse' : ''
        }`}>
          {/* ═══ LEFT COLUMN ═══ */}
          <div className={`flex-1 flex flex-col justify-center max-w-[560px] ${
            lang === 'ar' ? 'text-right' : 'text-left'
          }`}>
            {/* Headline */}
            <h1 className="text-[44px] md:text-[52px] lg:text-[58px] font-bold leading-[1.08] tracking-tight text-navy-base mb-5">
              {t.hero.headlinePre}
              <br />
              <span className="text-gradient-purple">{t.hero.headlineHighlight}</span>{' '}
              {t.hero.headlinePost}
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] md:text-[18px] leading-[1.65] text-text-secondary max-w-[480px] mb-8">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 mb-10 ${
              lang === 'ar' ? 'sm:flex-row-reverse' : ''
            }`}>
              <Link
                href={`/${lang}/chat`}
                className="inline-flex items-center justify-center gap-2.5 bg-navy-base text-white text-[15px] font-semibold px-7 py-3.5 rounded-full hover:bg-deep-navy transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5"
              >
                {t.hero.findMentorBtn}
                <ArrowRightIcon size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
              </Link>
              <Link
                href={`/${lang}/mentors`}
                className="inline-flex items-center justify-center gap-2 bg-white border border-border text-navy-base text-[15px] font-semibold px-7 py-3.5 rounded-full hover:bg-surface transition-all duration-200"
              >
                {t.hero.browseMentorsBtn}
              </Link>
            </div>

            {/* Trust badges */}
            <div className={`flex flex-wrap gap-x-5 gap-y-2 mb-10 ${
              lang === 'ar' ? 'flex-row-reverse' : ''
            }`}>
              {t.hero.trustBadges.map((item, i) => (
                <div key={i} className={`flex items-center gap-1.5 text-[13px] text-text-secondary ${
                  lang === 'ar' ? 'flex-row-reverse' : ''
                }`}>
                  <CheckCircleIcon size={15} className="text-green shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className={`flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-border/60 ${
              lang === 'ar' ? 'flex-row-reverse' : ''
            }`}>
              {t.hero.stats.map((s, i) => (
                <div key={i} className={lang === 'ar' ? 'text-right' : 'text-left'}>
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
              <h2 className="text-[20px] font-bold text-navy-base mb-1" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                {t.hero.searchCardTitle}
              </h2>
              <p className="text-[14px] text-text-muted mb-5" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                {t.hero.searchCardSubtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="flex flex-col">
                  <span className="text-[11px] text-text-muted font-medium mb-1" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    {t.hero.goalLabel}
                  </span>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className={`bg-surface border border-border rounded-lg px-3 py-2.5 text-[14px] font-medium text-navy-base focus:outline-none focus:border-teal appearance-none cursor-pointer ${
                      lang === 'ar' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {goalOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-text-muted font-medium mb-1" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    {t.hero.levelLabel}
                  </span>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className={`bg-surface border border-border rounded-lg px-3 py-2.5 text-[14px] font-medium text-navy-base focus:outline-none focus:border-teal appearance-none cursor-pointer ${
                      lang === 'ar' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {levelOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-text-muted font-medium mb-1" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    {t.hero.formatLabel}
                  </span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className={`bg-surface border border-border rounded-lg px-3 py-2.5 text-[14px] font-medium text-navy-base focus:outline-none focus:border-teal appearance-none cursor-pointer ${
                      lang === 'ar' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Popular */}
              <div className={`flex items-center gap-2 flex-wrap mb-4 ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}>
                <SearchIcon size={14} className="text-text-muted shrink-0" />
                <span className="text-[12px] text-text-muted font-medium">{t.hero.popularLabel}</span>
                {popularSearches.map((s, i) => (
                  <Link
                    key={i}
                    href={`/${lang}/mentors?domain=${s.domain}`}
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
                {t.hero.findMatchesBtn}
              </button>
            </div>

            {/* ── Featured Mentor Cards ── */}
            <div className="grid grid-cols-3 gap-3">
              {featured.map((m) => (
                <Link
                  key={m.id}
                  href={`/${lang}/mentors`}
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
                      <div className={`absolute top-2 bg-teal text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        lang === 'ar' ? 'right-2' : 'left-2'
                      }`}>
                        {m.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-3" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                    <p className={`text-[13px] font-semibold text-navy-base leading-tight flex items-center gap-1 ${
                      lang === 'ar' ? 'flex-row-reverse' : ''
                    }`}>
                      {m.name}
                      <CheckCircleIcon size={12} className="text-teal shrink-0" />
                    </p>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug truncate">{m.title}</p>
                    <div className={`flex items-center gap-1 mt-2 text-[11px] text-text-secondary ${
                      lang === 'ar' ? 'flex-row-reverse' : ''
                    }`}>
                      <span className="text-[#F7B731]">&#9733;</span>
                      <span className="font-semibold">{m.rating}</span>
                      <span className="text-text-muted">({m.reviews})</span>
                      <span className="text-text-muted mx-1">&#183;</span>
                      <span>{m.exp} {lang === 'ar' ? 'سنة خبرة' : 'yrs exp.'}</span>
                    </div>
                    <div className={`flex flex-wrap gap-1 mt-2 ${
                      lang === 'ar' ? 'flex-row-reverse' : ''
                    }`}>
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
              href={`/${lang}/mentors`}
              className={`self-center inline-flex items-center gap-1.5 text-[14px] font-semibold text-navy-base hover:text-teal transition-colors group ${
                lang === 'ar' ? 'flex-row-reverse' : ''
              }`}
            >
              {t.hero.viewAllMentors}
              <ArrowRightIcon size={14} className={`transition-transform ${
                lang === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'
              }`} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Testimonials Strip ─── */}
      <div className="border-t border-border/40 bg-surface/40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6">
          <div className={`grid md:grid-cols-3 gap-6 items-start ${
            lang === 'ar' ? 'direction-rtl' : ''
          }`}>
            {testimonials.map((t, i) => (
              <div key={i} className={`flex gap-3 ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}>
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
