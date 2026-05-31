'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mentor, MENTOR_PHOTOS } from '../lib/types';
import { CloseIcon, BriefcaseIcon, ClockIcon, GlobeIcon, ArrowRightIcon } from './icons';

interface Props {
  mentor: Mentor | null;
  onClose: () => void;
}

export default function MentorDetailModal({ mentor, onClose }: Props) {
  const [tabState, setTabState] = useState({ mentorId: '', tab: 'Overview' });

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!mentor) return null;

  const photo = MENTOR_PHOTOS[mentor.id] || '';
  const tabs = ['Overview', 'Expertise', 'Schedule'];
  const tab = tabState.mentorId === mentor.id ? tabState.tab : 'Overview';

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-elevated w-full max-w-[640px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative h-[160px] bg-surface shrink-0 overflow-hidden">
          <Image src={photo} alt={mentor.name} fill className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-navy-base transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="px-6 -mt-10 relative z-10 shrink-0">
          <div className="flex items-end gap-4 mb-4">
            <Image
              src={photo}
              alt={mentor.name}
              width={80}
              height={80}
              className="rounded-xl object-cover w-20 h-20 border-4 border-white shadow-card"
            />
            <div className="pb-1">
              <h2 className="text-[24px] font-bold text-navy-base leading-tight">{mentor.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[13px] font-medium text-text-secondary capitalize">{mentor.domain}</span>
                <span className="text-border">|</span>
                {mentor.current_mentees < 3 ? (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-green" /> Available
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-red">
                    <span className="w-1.5 h-1.5 rounded-full bg-red" /> At Capacity
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 border-b border-border shrink-0">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTabState({ mentorId: mentor.id, tab: t })}
              className={`pb-3 text-[14px] font-semibold transition-colors border-b-2 ${
                tab === t
                  ? 'text-navy-base border-navy-base'
                  : 'text-text-muted border-transparent hover:text-text-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {tab === 'Overview' && (
            <div className="flex flex-col gap-5">
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {mentor.name} is an experienced {mentor.domain} professional with{' '}
                {mentor.years_experience} years in the industry. Currently helping
                mentees {mentor.current_stage}.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface rounded-xl p-4 text-center">
                  <BriefcaseIcon size={18} className="text-teal mx-auto mb-2" />
                  <p className="text-[20px] font-bold text-navy-base">{mentor.years_experience}</p>
                  <p className="text-[12px] text-text-muted">Years Exp.</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <ClockIcon size={18} className="text-teal mx-auto mb-2" />
                  <p className="text-[14px] font-bold text-navy-base capitalize">{mentor.session_frequency}</p>
                  <p className="text-[12px] text-text-muted">Sessions</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <GlobeIcon size={18} className="text-teal mx-auto mb-2" />
                  <p className="text-[14px] font-bold text-navy-base">{mentor.languages.join(', ')}</p>
                  <p className="text-[12px] text-text-muted">Languages</p>
                </div>
              </div>

              {mentor.fit_notes.map((note, i) => (
                <div key={i} className="bg-teal/[0.04] border-l-2 border-teal rounded-r-lg p-4">
                  <p className="text-[14px] text-text-secondary italic leading-relaxed">
                    &ldquo;{note}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === 'Expertise' && (
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">Core Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise_areas.map((a, i) => (
                    <span key={i} className="text-[13px] font-medium text-teal bg-teal/[0.06] border border-teal/10 px-3 py-1.5 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">Communication Style</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.communication_style.map((s, i) => (
                    <span key={i} className="text-[13px] font-medium text-text-secondary bg-surface px-3 py-1.5 rounded-full capitalize">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">Personality</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.personality_tags.map((t, i) => (
                    <span key={i} className="text-[13px] font-medium text-text-secondary bg-surface px-3 py-1.5 rounded-full capitalize">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'Schedule' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface rounded-xl p-4">
                  <p className="text-[12px] text-text-muted font-semibold uppercase tracking-wider mb-1">Frequency</p>
                  <p className="text-[15px] text-navy-base font-semibold capitalize">{mentor.session_frequency}</p>
                </div>
                <div className="bg-surface rounded-xl p-4">
                  <p className="text-[12px] text-text-muted font-semibold uppercase tracking-wider mb-1">Channels</p>
                  <p className="text-[15px] text-navy-base font-semibold capitalize">{mentor.communication_channels.join(', ')}</p>
                </div>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">Available Windows</h4>
                <div className="flex flex-col gap-2">
                  {mentor.availability.map((slot, i) => {
                    const parts = slot.split(' ');
                    return (
                      <div key={i} className="flex items-center justify-between bg-surface rounded-lg px-4 py-3">
                        <span className="text-[14px] font-semibold text-navy-base">{parts[0]}</span>
                        <span className="text-[14px] text-text-secondary bg-white px-3 py-1 rounded-md">{parts[1]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-6 border-t border-border flex gap-3">
          <Link
            href={`/chat?mentor=${mentor.name}`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-base text-white text-[14px] font-semibold py-3 rounded-xl hover:bg-deep-navy transition-colors"
            onClick={onClose}
          >
            Get Matched With {mentor.name.split(' ')[0]}
            <ArrowRightIcon size={16} />
          </Link>
          <button
            onClick={onClose}
            className="px-6 text-[14px] font-semibold text-text-secondary border border-border rounded-xl py-3 hover:bg-surface transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
