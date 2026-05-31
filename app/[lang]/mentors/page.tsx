'use client';

import React, { useState, useEffect, Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MentorDetailModal from '../../components/MentorDetailModal';
import { BriefcaseIcon, ClockIcon, GlobeIcon } from '../../components/icons';
import { Mentor, MENTOR_PHOTOS } from '../../lib/types';
import { mentorsEn, mentorsAr } from '../../data/mentors';
import { translations } from '../../data/translations';

const DOMAIN_FILTERS = [
  'All', 'Product', 'Engineering', 'Design', 'Marketing', 'Data',
  'HR', 'Cybersecurity', 'Sales', 'Finance', 'Operations',
];

const DOMAIN_LABELS_AR: Record<string, string> = {
  'all': 'الكل',
  'product': 'المنتجات',
  'engineering': 'الهندسة',
  'design': 'التصميم',
  'marketing': 'التسويق',
  'data': 'البيانات',
  'hr': 'الموارد البشرية',
  'cybersecurity': 'الأمن الرقمي',
  'sales': 'المبيعات',
  'finance': 'المالية',
  'operations': 'العمليات',
};

function domainMatch(mentor: Mentor, filter: string): boolean {
  if (filter === 'All') return true;
  
  const mentorDomain = mentor.domain.toLowerCase();
  
  const matchers: Record<string, string[]> = {
    'Product': ['product management', 'إدارة المنتجات'],
    'Engineering': ['software engineering', 'الهندسة البرمجية', 'الهندسة'],
    'Design': ['ux design', 'تصميم تجربة المستخدم', 'التصميم'],
    'Marketing': ['growth marketing', 'التسويق والنمو', 'التسويق'],
    'Data': ['data analytics', 'تحليل البيانات', 'البيانات'],
    'HR': ['human resources', 'الموارد البشرية'],
    'Cybersecurity': ['cybersecurity', 'الأمن السيبراني', 'أمن المعلومات'],
    'Sales': ['sales enablement', 'تمكين المبيعات', 'المبيعات'],
    'Finance': ['finance and fp&a', 'التمويل والتخطيط والتحليل المالي', 'المالية'],
    'Operations': ['operations', 'العمليات']
  };
  
  const allowed = matchers[filter];
  if (!allowed) return true;
  return allowed.some(a => mentorDomain.includes(a) || a.includes(mentorDomain));
}

function expMatch(mentor: Mentor, filter: string): boolean {
  if (filter === 'any') return true;
  if (filter === 'junior') return mentor.years_experience >= 1 && mentor.years_experience <= 4;
  if (filter === 'mid') return mentor.years_experience >= 5 && mentor.years_experience <= 8;
  if (filter === 'senior') return mentor.years_experience >= 9;
  return true;
}

function langMatch(mentor: Mentor, filter: string): boolean {
  if (filter === 'any') return true;
  const targetLang = filter === 'Arabic' || filter === 'العربية' ? 'arabic' : 'english';
  return mentor.languages.some(l => {
    const lower = l.toLowerCase();
    if (targetLang === 'arabic') return lower === 'arabic' || lower === 'العربية';
    return lower === 'english' || lower === 'الإنجليزية';
  });
}

function availMatch(mentor: Mentor, filter: string): boolean {
  if (filter === 'any') return true;
  if (filter === 'available') return mentor.current_mentees < 3;
  if (filter === 'full') return mentor.current_mentees >= 3;
  return true;
}

function MentorsContent({ lang }: { lang: 'en' | 'ar' }) {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get('domain');
  const t = translations[lang];

  const initialFilter = domainParam && DOMAIN_FILTERS.some(d => d.toLowerCase() === domainParam.toLowerCase())
    ? DOMAIN_FILTERS.find(d => d.toLowerCase() === domainParam.toLowerCase()) || 'All'
    : 'All';

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [experience, setExperience] = useState('any');
  const [language, setLanguage] = useState('any');
  const [availability, setAvailability] = useState('any');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (domainParam) {
      const match = DOMAIN_FILTERS.find(d => d.toLowerCase() === domainParam.toLowerCase());
      if (match) setActiveFilter(match);
    }
  }, [domainParam]);

  const mentorsData = lang === 'ar' ? mentorsAr : mentorsEn;
  const allMentors = mentorsData as Mentor[];
  const filtered = allMentors.filter(m =>
    domainMatch(m, activeFilter) &&
    expMatch(m, experience) &&
    langMatch(m, language) &&
    availMatch(m, availability)
  );

  const handleDomainFilter = (f: string) => {
    if (f === activeFilter) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveFilter(f);
      setAnimating(false);
    }, 150);
  };

  const activeFiltersCount = [experience, language, availability].filter(v => v !== 'any').length;

  return (
    <>
      <Navbar />
      <main className="pt-[80px] min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 lg:px-10 pt-12 pb-4 gradient-mesh">
          <div className="max-w-[1280px] mx-auto">
            <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight text-navy-base mb-3">
              {t.mentorsPage.title}
            </h1>
            <p className="text-[17px] text-text-secondary max-w-[520px] mb-8">
              {t.mentorsPage.subtitle}
            </p>

            {/* Domain Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin mb-4">
              {DOMAIN_FILTERS.map((f) => {
                const label = lang === 'ar' ? (DOMAIN_LABELS_AR[f.toLowerCase()] || f) : f;
                return (
                  <button
                    key={f}
                    onClick={() => handleDomainFilter(f)}
                    className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                      activeFilter === f
                        ? 'bg-navy-base text-white shadow-sm'
                        : 'bg-white text-text-secondary border border-border hover:border-navy-base/20 hover:text-navy-base'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Additional Filters Row */}
            <div className="flex flex-wrap gap-3 pb-4">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-medium text-navy-base focus:outline-none focus:border-teal cursor-pointer"
              >
                {t.mentorsPage.experienceFilters.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-medium text-navy-base focus:outline-none focus:border-teal cursor-pointer"
              >
                {t.mentorsPage.languageFilters.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-medium text-navy-base focus:outline-none focus:border-teal cursor-pointer"
              >
                {t.mentorsPage.availabilityFilters.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() => { setExperience('any'); setLanguage('any'); setAvailability('any'); }}
                  className="text-[13px] font-medium text-teal hover:text-navy-base transition-colors px-2"
                >
                  {t.mentorsPage.clearFilters} ({activeFiltersCount})
                </button>
              )}

              <span className={`text-[13px] text-text-muted self-center ${lang === 'ar' ? 'mr-auto' : 'ml-auto'}`}>
                {filtered.length} {filtered.length === 1 ? t.mentorsPage.foundCount : t.mentorsPage.foundCountPlural}
              </span>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="px-6 lg:px-10 py-8">
          <div className={`max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-150 ${animating ? 'opacity-0' : 'opacity-100'}`}>
            {filtered.map((mentor) => {
              const photo = MENTOR_PHOTOS[mentor.id] || '';
              return (
                <div
                  key={mentor.id}
                  className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* Photo */}
                  <div className="relative h-[220px] bg-surface overflow-hidden">
                    <Image
                      src={photo}
                      alt={mentor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className={`absolute bottom-4 ${lang === 'ar' ? 'left-4 right-4 flex-row-reverse' : 'left-4 right-4'} flex items-end justify-between`}>
                      <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                        <h3 className="text-[18px] font-semibold text-white leading-tight drop-shadow-sm">
                          {mentor.name}
                        </h3>
                        <p className="text-[13px] text-white/80 capitalize">{mentor.domain}</p>
                      </div>
                      {mentor.current_mentees < 3 ? (
                        <span className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green" />
                          <span className="text-[11px] font-semibold text-navy-base">{t.mentorsPage.available}</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-red" />
                          <span className="text-[11px] font-semibold text-text-secondary">{t.mentorsPage.full}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-5 text-[13px] text-text-secondary mb-4 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <BriefcaseIcon size={14} className="text-text-muted" />
                        {mentor.years_experience} {lang === 'ar' ? 'سنوات' : 'years'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ClockIcon size={14} className="text-text-muted" />
                        {mentor.session_frequency}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GlobeIcon size={14} className="text-text-muted" />
                        {mentor.languages.join(', ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.expertise_areas.slice(0, 3).map((area, i) => (
                        <span key={i} className="text-[11px] font-medium text-teal bg-teal/[0.06] border border-teal/[0.08] px-2.5 py-1 rounded-full">
                          {area}
                        </span>
                      ))}
                      {mentor.expertise_areas.length > 3 && (
                        <span className="text-[11px] font-medium text-text-muted px-2 py-1">
                          +{mentor.expertise_areas.length - 3} {lang === 'ar' ? 'أخرى' : 'more'}
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] text-text-muted leading-relaxed mb-5 line-clamp-2 italic">
                      &ldquo;{mentor.fit_notes[0]}&rdquo;
                    </p>

                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        className="flex-1 text-center text-[13px] font-semibold text-navy-base border border-border rounded-lg py-2.5 hover:bg-surface transition-colors cursor-pointer"
                      >
                        {t.mentorsPage.viewProfile}
                      </button>
                      <Link
                        href={`/${lang}/chat?mentor=${encodeURIComponent(mentor.name)}`}
                        className="flex-1 text-center text-[13px] font-semibold text-white bg-navy-base rounded-lg py-2.5 hover:bg-deep-navy transition-colors"
                      >
                        {t.mentorsPage.getMatched}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="max-w-[1280px] mx-auto text-center py-20">
              <p className="text-[16px] text-text-muted mb-4">{t.mentorsPage.noMentors}</p>
              <button
                onClick={() => { setActiveFilter('All'); setExperience('any'); setLanguage('any'); setAvailability('any'); }}
                className="text-[14px] font-semibold text-teal hover:text-navy-base transition-colors cursor-pointer"
              >
                {t.mentorsPage.clearAllFilters}
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer lang={lang} />

      <MentorDetailModal
        mentor={selectedMentor}
        onClose={() => setSelectedMentor(null)}
        lang={lang}
      />
    </>
  );
}

export default function MentorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params) as { lang: 'en' | 'ar' };
  
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="dot-pulse"><span /><span /><span /></div>
      </div>
    }>
      <MentorsContent lang={lang} />
    </Suspense>
  );
}
