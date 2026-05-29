import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon, BriefcaseIcon, ClockIcon } from './icons';
import { MENTOR_PHOTOS, DOMAIN_LABELS, Mentor } from '../lib/types';
import mentorsData from '../data/mentors/en';

export default function FeaturedMentors() {
  const featured = (mentorsData as Mentor[]).filter(m => m.current_mentees < 3).slice(0, 4);

  return (
    <section className="relative py-28 px-6 lg:px-10 bg-surface/50 gradient-mesh">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="inline-block text-[13px] font-semibold text-teal uppercase tracking-widest mb-4">
              Featured Mentors
            </span>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight text-navy-base leading-tight">
              Learn from the best in{' '}
              <span className="text-gradient-purple">their field</span>
            </h2>
          </div>
          <Link
            href="/mentors"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-navy-base hover:text-teal transition-colors group shrink-0"
          >
            View all mentors
            <ArrowRightIcon size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((mentor) => {
            const photo = MENTOR_PHOTOS[mentor.id] || '';
            const domainLabel = DOMAIN_LABELS[mentor.domain.toLowerCase()] || mentor.domain;

            return (
              <div
                key={mentor.id}
                className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-[200px] bg-surface overflow-hidden">
                  <Image
                    src={photo}
                    alt={mentor.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="glass text-[11px] font-semibold text-navy-base px-3 py-1 rounded-full shadow-sm">
                      {domainLabel}
                    </span>
                  </div>
                  {mentor.current_mentees < 3 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 glass px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green" />
                      <span className="text-[11px] font-semibold text-navy-base">Available</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="text-[17px] font-semibold text-navy-base mb-1 leading-tight">
                    {mentor.name}
                  </h3>
                  <p className="text-[13px] text-text-muted mb-4 capitalize">
                    {mentor.domain}
                  </p>

                  <div className="flex items-center gap-4 text-[13px] text-text-secondary mb-4">
                    <span className="flex items-center gap-1.5">
                      <BriefcaseIcon size={14} className="text-text-muted" />
                      {mentor.years_experience} yrs
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon size={14} className="text-text-muted" />
                      {mentor.session_frequency}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {mentor.expertise_areas.slice(0, 2).map((area, i) => (
                      <span key={i} className="text-[11px] font-medium text-teal bg-teal/[0.06] px-2.5 py-1 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/mentors"
                    className="block text-center text-[13px] font-semibold text-navy-base border border-border rounded-lg py-2.5 hover:bg-surface transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
