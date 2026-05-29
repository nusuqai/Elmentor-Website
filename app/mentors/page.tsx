'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MentorDetailModal from '../components/MentorDetailModal';
import { BriefcaseIcon, ClockIcon, GlobeIcon, ArrowRightIcon, SearchIcon } from '../components/icons';
import { Mentor, MENTOR_PHOTOS, DOMAIN_LABELS } from '../lib/types';
import mentorsData from '../data/mentors/en';

const FILTERS = [
  'All',
  'Product',
  'Engineering',
  'Design',
  'Marketing',
  'Data',
  'HR',
  'Cybersecurity',
  'Sales',
  'Finance',
  'Operations',
];

const filterMatch = (mentor: Mentor, filter: string): boolean => {
  if (filter === 'All') return true;
  const domainLabel = DOMAIN_LABELS[mentor.domain.toLowerCase()] || mentor.domain;
  return domainLabel.toLowerCase() === filter.toLowerCase();
};

export default function MentorsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [animating, setAnimating] = useState(false);

  const allMentors = mentorsData as Mentor[];
  const filtered = allMentors.filter(m => filterMatch(m, activeFilter));

  const handleFilter = (f: string) => {
    if (f === activeFilter) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveFilter(f);
      setAnimating(false);
    }, 150);
  };

  return (
    <>
      <Navbar />
      <main className="pt-[80px] min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 lg:px-10 pt-12 pb-8 gradient-mesh">
          <div className="max-w-[1280px] mx-auto">
            <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight text-navy-base mb-3">
              Browse Mentors
            </h1>
            <p className="text-[17px] text-text-secondary max-w-[520px] mb-8">
              Explore our community of experienced professionals across multiple domains. Find someone who aligns with your career goals.
            </p>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                    activeFilter === f
                      ? 'bg-navy-base text-white shadow-sm'
                      : 'bg-white text-text-secondary border border-border hover:border-navy-base/20 hover:text-navy-base'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="px-6 lg:px-10 py-10">
          <div className={`max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-150 ${animating ? 'opacity-0' : 'opacity-100'}`}>
            {filtered.map((mentor) => {
              const photo = MENTOR_PHOTOS[mentor.id] || '';
              const domainLabel = DOMAIN_LABELS[mentor.domain.toLowerCase()] || mentor.domain;

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
                    {/* Stats */}
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

                    {/* Expertise chips */}
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

                    {/* Fit note */}
                    <p className="text-[13px] text-text-muted leading-relaxed mb-5 line-clamp-2 italic">
                      &ldquo;{mentor.fit_notes[0]}&rdquo;
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        className="flex-1 text-center text-[13px] font-semibold text-navy-base border border-border rounded-lg py-2.5 hover:bg-surface transition-colors"
                      >
                        View Profile
                      </button>
                      <Link
                        href={`/chat?mentor=${mentor.name}`}
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
            <div className="text-center py-20 text-text-muted">
              <p className="text-[16px]">No mentors found for this domain.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Modal */}
      <MentorDetailModal
        mentor={selectedMentor}
        onClose={() => setSelectedMentor(null)}
      />
    </>
  );
}
