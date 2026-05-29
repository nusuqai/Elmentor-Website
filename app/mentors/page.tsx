'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MentorDetailModal from '../components/MentorDetailModal';
import { BriefcaseIcon, ClockIcon, GlobeIcon, ArrowRightIcon } from '../components/icons';
import { Mentor, MENTOR_PHOTOS, DOMAIN_LABELS } from '../lib/types';
import mentorsData from '../data/mentors/en';

const DOMAIN_FILTERS = [
  'All', 'Product', 'Engineering', 'Design', 'Marketing', 'Data',
  'HR', 'Cybersecurity', 'Sales', 'Finance', 'Operations',
];

const EXPERIENCE_FILTERS = [
  { label: 'Any experience', value: 'any' },
  { label: '1-4 years', value: 'junior' },
  { label: '5-8 years', value: 'mid' },
  { label: '9+ years', value: 'senior' },
];

const LANGUAGE_FILTERS = [
  { label: 'Any language', value: 'any' },
  { label: 'English', value: 'English' },
  { label: 'Arabic', value: 'Arabic' },
];

const AVAILABILITY_FILTERS = [
  { label: 'All statuses', value: 'any' },
  { label: 'Available', value: 'available' },
  { label: 'Full', value: 'full' },
];

function domainMatch(mentor: Mentor, filter: string): boolean {
  if (filter === 'All') return true;
  const domainLabel = DOMAIN_LABELS[mentor.domain.toLowerCase()] || mentor.domain;
  return domainLabel.toLowerCase() === filter.toLowerCase();
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
  return mentor.languages.some(l => l.toLowerCase() === filter.toLowerCase());
}

function availMatch(mentor: Mentor, filter: string): boolean {
  if (filter === 'any') return true;
  if (filter === 'available') return mentor.current_mentees < 3;
  if (filter === 'full') return mentor.current_mentees >= 3;
  return true;
}

function MentorsContent() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get('domain');

  const [activeFilter, setActiveFilter] = useState(domainParam || 'All');
  const [experience, setExperience] = useState('any');
  const [language, setLanguage] = useState('any');
  const [availability, setAvailability] = useState('any');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [animating, setAnimating] = useState(false);

  // Apply URL params on mount
  useEffect(() => {
    if (domainParam && DOMAIN_FILTERS.includes(domainParam)) {
      setActiveFilter(domainParam);
    }
  }, [domainParam]);

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
              Browse Mentors
            </h1>
            <p className="text-[17px] text-text-secondary max-w-[520px] mb-8">
              Explore our community of experienced professionals across multiple domains. Find someone who aligns with your career goals.
            </p>

            {/* Domain Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin mb-4">
              {DOMAIN_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => handleDomainFilter(f)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                    activeFilter === f
                      ? 'bg-navy-base text-white shadow-sm'
                      : 'bg-white text-text-secondary border border-border hover:border-navy-base/20 hover:text-navy-base'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Additional Filters Row */}
            <div className="flex flex-wrap gap-3 pb-4">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-medium text-navy-base focus:outline-none focus:border-teal cursor-pointer"
              >
                {EXPERIENCE_FILTERS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-medium text-navy-base focus:outline-none focus:border-teal cursor-pointer"
              >
                {LANGUAGE_FILTERS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="bg-white border border-border rounded-lg px-3 py-2 text-[13px] font-medium text-navy-base focus:outline-none focus:border-teal cursor-pointer"
              >
                {AVAILABILITY_FILTERS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() => { setExperience('any'); setLanguage('any'); setAvailability('any'); }}
                  className="text-[13px] font-medium text-teal hover:text-navy-base transition-colors px-2"
                >
                  Clear filters ({activeFiltersCount})
                </button>
              )}

              <span className="text-[13px] text-text-muted self-center ml-auto">
                {filtered.length} mentor{filtered.length !== 1 ? 's' : ''} found
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
                  className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
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
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <h3 className="text-[18px] font-semibold text-white leading-tight drop-shadow-sm">
                          {mentor.name}
                        </h3>
                        <p className="text-[13px] text-white/80 capitalize">{mentor.domain}</p>
                      </div>
                      {mentor.current_mentees < 3 ? (
                        <span className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green" />
                          <span className="text-[11px] font-semibold text-navy-base">Available</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-red" />
                          <span className="text-[11px] font-semibold text-text-secondary">Full</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-5 text-[13px] text-text-secondary mb-4">
                      <span className="flex items-center gap-1.5">
                        <BriefcaseIcon size={14} className="text-text-muted" />
                        {mentor.years_experience} years
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
                          +{mentor.expertise_areas.length - 3} more
                        </span>
                      )}
                    </div>

                    <p className="text-[13px] text-text-muted leading-relaxed mb-5 line-clamp-2 italic">
                      &ldquo;{mentor.fit_notes[0]}&rdquo;
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        className="flex-1 text-center text-[13px] font-semibold text-navy-base border border-border rounded-lg py-2.5 hover:bg-surface transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                      <Link
                        href={`/chat?mentor=${encodeURIComponent(mentor.name)}`}
                        className="flex-1 text-center text-[13px] font-semibold text-white bg-navy-base rounded-lg py-2.5 hover:bg-deep-navy transition-colors"
                      >
                        Get Matched
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="max-w-[1280px] mx-auto text-center py-20">
              <p className="text-[16px] text-text-muted mb-4">No mentors match your current filters.</p>
              <button
                onClick={() => { setActiveFilter('All'); setExperience('any'); setLanguage('any'); setAvailability('any'); }}
                className="text-[14px] font-semibold text-teal hover:text-navy-base transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />

      <MentorDetailModal
        mentor={selectedMentor}
        onClose={() => setSelectedMentor(null)}
      />
    </>
  );
}

export default function MentorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="dot-pulse"><span /><span /><span /></div>
      </div>
    }>
      <MentorsContent />
    </Suspense>
  );
}
