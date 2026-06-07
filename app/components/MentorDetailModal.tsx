'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mentor, MENTOR_PHOTOS } from '../lib/types';
import { CloseIcon, BriefcaseIcon, ClockIcon, GlobeIcon, ArrowRightIcon, MapPinIcon } from './icons';
import { translations } from '../data/translations';

interface Props {
  mentor: Mentor | null;
  onClose: () => void;
  lang?: string;
}

export default function MentorDetailModal({ mentor, onClose, lang = 'en' }: Props) {
  const isAr = lang === 'ar';
  const t = translations[isAr ? 'ar' : 'en'];
  const [tab, setTab] = useState(isAr ? 'نظرة عامة' : 'Overview');

  useEffect(() => {
    if (mentor) setTab(isAr ? 'نظرة عامة' : 'Overview');
  }, [mentor, isAr]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  useEffect(() => {
    if (mentor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mentor]);

  if (!mentor) return null;

  const name = isAr ? (mentor.name_ar || mentor.name || '') : (mentor.name_en || mentor.name || '');
  const description = isAr ? (mentor.description_ar || mentor.description || '') : (mentor.description_en || mentor.description || '');
  const currentStage = isAr ? (mentor.current_stage_ar || mentor.current_stage || '') : (mentor.current_stage_en || mentor.current_stage || '');
  const expertiseAreas = isAr ? (mentor.expertise_areas_ar || mentor.expertise_areas || []) : (mentor.expertise_areas_en || mentor.expertise_areas || []);
  const fitNotes = isAr ? (mentor.fit_notes_ar || mentor.fit_notes || []) : (mentor.fit_notes_en || mentor.fit_notes || []);

  const photo = MENTOR_PHOTOS[mentor.sex] || '';
  const tabs = isAr ? ['نظرة عامة', 'الخبرات', 'الجدول والاتصال'] : ['Overview', 'Expertise', 'Schedule'];

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
          <Image src={photo} alt={name} fill className="object-cover opacity-90" sizes="600px" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
          <button
            onClick={onClose}
            className={`absolute top-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-navy-base transition-colors ${
              isAr ? 'left-4' : 'right-4'
            }`}
            aria-label="Close modal"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className={`px-6 -mt-10 relative z-10 shrink-0 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-end gap-4 mb-4 ${isAr ? 'flex-row-reverse' : ''}`}>
            <Image
              src={photo}
              alt={name}
              width={80}
              height={80}
              className="rounded-xl object-cover w-20 h-20 border-4 border-white shadow-card"
            />
            <div className="pb-1">
              <h2 className="text-[24px] font-bold text-navy-base leading-tight">{name}</h2>
              <div className={`flex items-center gap-2 mt-1 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className="text-[13px] font-medium text-text-secondary capitalize">{mentor.domain}</span>
                <span className="text-border">|</span>
                {mentor.current_mentees < 3 ? (
                  <span className={`flex items-center gap-1 text-[12px] font-semibold text-green ${isAr ? 'flex-row-reverse' : ''}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green" /> {t.detailModal.overview.toLowerCase() === 'overview' ? 'Available' : 'متاح'}
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 text-[12px] font-semibold text-red ${isAr ? 'flex-row-reverse' : ''}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red" /> {t.detailModal.atCapacity}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-6 px-6 border-b border-border shrink-0 ${isAr ? 'flex-row-reverse' : ''}`}>
          {tabs.map((tName) => (
            <button
              key={tName}
              onClick={() => setTab(tName)}
              className={`pb-3 text-[14px] font-semibold transition-colors border-b-2 ${
                tab === tName
                  ? 'text-navy-base border-navy-base'
                  : 'text-text-muted border-transparent hover:text-text-secondary'
              }`}
            >
              {tName}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {(tab === 'Overview' || tab === 'نظرة عامة') && (
            <div className="flex flex-col gap-5">
              <p className="text-[15px] text-text-secondary leading-relaxed" style={{ textAlign: isAr ? 'right' : 'left' }}>
                {description ? description : isAr ? (
                  <>
                    {name} {t.detailModal.isExperienced} {mentor.domain} {t.detailModal.professionalWith} {mentor.years_experience} {t.detailModal.yearsInIndustry} {currentStage}.
                  </>
                ) : (
                  <>
                    {name} {t.detailModal.isExperienced} {mentor.domain} {t.detailModal.professionalWith} {mentor.years_experience} {t.detailModal.yearsInIndustry} {currentStage}.
                  </>
                )}
              </p>

              <div className={`grid grid-cols-3 gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <BriefcaseIcon size={18} className="text-teal mx-auto mb-2" />
                  <p className="text-[20px] font-bold text-navy-base">{mentor.years_experience}</p>
                  <p className="text-[12px] text-text-muted">{t.detailModal.yearsExp}</p>
                </div>
                {mentor.location ? (
                  <div className="bg-surface rounded-xl p-4 text-center">
                    <MapPinIcon size={18} className="text-teal mx-auto mb-2" />
                    <p className="text-[14px] font-bold text-navy-base capitalize">{mentor.location}</p>
                    <p className="text-[12px] text-text-muted">{isAr ? 'الموقع' : 'Location'}</p>
                  </div>
                ) : mentor.session_frequency ? (
                  <div className="bg-surface rounded-xl p-4 text-center">
                    <ClockIcon size={18} className="text-teal mx-auto mb-2" />
                    <p className="text-[14px] font-bold text-navy-base capitalize">{mentor.session_frequency}</p>
                    <p className="text-[12px] text-text-muted">{t.detailModal.sessions}</p>
                  </div>
                ) : (
                  <div className="bg-surface rounded-xl p-4 text-center">
                    <MapPinIcon size={18} className="text-teal mx-auto mb-2" />
                    <p className="text-[14px] font-bold text-navy-base capitalize">-</p>
                    <p className="text-[12px] text-text-muted">{isAr ? 'الموقع' : 'Location'}</p>
                  </div>
                )}
                <div className="bg-surface rounded-xl p-4 text-center">
                  <GlobeIcon size={18} className="text-teal mx-auto mb-2" />
                  <p className="text-[14px] font-bold text-navy-base">{mentor.languages.join(', ')}</p>
                  <p className="text-[12px] text-text-muted">{t.detailModal.languages}</p>
                </div>
              </div>

              {fitNotes.map((note, i) => (
                <div key={i} className={`bg-teal/[0.04] p-4 ${
                  isAr ? 'border-r-2 border-teal rounded-l-lg text-right' : 'border-l-2 border-teal rounded-r-lg text-left'
                }`}>
                  <p className="text-[14px] text-text-secondary italic leading-relaxed">
                    &ldquo;{note}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          {(tab === 'Expertise' || tab === 'الخبرات') && (
            <div className={`flex flex-col gap-6 ${isAr ? 'text-right' : 'text-left'}`}>
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">{t.detailModal.coreAreas}</h4>
                <div className={`flex flex-wrap gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  {expertiseAreas.map((a, i) => (
                    <span key={i} className="text-[13px] font-medium text-teal bg-teal/[0.06] border border-teal/10 px-3 py-1.5 rounded-full">{a}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">{t.detailModal.communicationStyle}</h4>
                <div className={`flex flex-wrap gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  {mentor.communication_style.map((s, i) => (
                    <span key={i} className="text-[13px] font-medium text-text-secondary bg-surface px-3 py-1.5 rounded-full capitalize">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">{t.detailModal.personality}</h4>
                <div className={`flex flex-wrap gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  {mentor.personality_tags.map((t, i) => (
                    <span key={i} className="text-[13px] font-medium text-text-secondary bg-surface px-3 py-1.5 rounded-full capitalize">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(tab === 'Schedule' || tab === 'الجدول والاتصال') && (
            <div className={`flex flex-col gap-5 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className={`grid grid-cols-2 gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                {mentor.location ? (
                  <div className="bg-surface rounded-xl p-4">
                    <p className="text-[12px] text-text-muted font-semibold uppercase tracking-wider mb-1">{isAr ? 'الموقع' : 'Location'}</p>
                    <p className="text-[15px] text-navy-base font-semibold capitalize">{mentor.location}</p>
                  </div>
                ) : mentor.session_frequency ? (
                  <div className="bg-surface rounded-xl p-4">
                    <p className="text-[12px] text-text-muted font-semibold uppercase tracking-wider mb-1">{t.detailModal.frequency}</p>
                    <p className="text-[15px] text-navy-base font-semibold capitalize">{mentor.session_frequency}</p>
                  </div>
                ) : null}
                {mentor.languages ? (
                  <div className="bg-surface rounded-xl p-4">
                    <p className="text-[12px] text-text-muted font-semibold uppercase tracking-wider mb-1">{isAr ? 'اللغات' : 'Languages'}</p>
                    <p className="text-[15px] text-navy-base font-semibold capitalize">{mentor.languages.join(', ')}</p>
                  </div>
                ) : mentor.communication_channels ? (
                  <div className="bg-surface rounded-xl p-4">
                    <p className="text-[12px] text-text-muted font-semibold uppercase tracking-wider mb-1">{t.detailModal.channels}</p>
                    <p className="text-[15px] text-navy-base font-semibold capitalize">{mentor.communication_channels.join(', ')}</p>
                  </div>
                ) : null}
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-text-muted uppercase tracking-wider mb-3">{t.detailModal.availableWindows}</h4>
                <div className="flex flex-col gap-2">
                  {mentor.availability.map((slot, i) => {
                    const parts = slot.split(' ');
                    const day = parts[0];
                    const time = parts[1];
                    return (
                      <div key={i} className={`flex items-center justify-between bg-surface rounded-lg px-4 py-3 ${
                        isAr ? 'flex-row-reverse' : ''
                      }`}>
                        <span className="text-[14px] font-semibold text-navy-base">{day}</span>
                        <span className="text-[14px] text-text-secondary bg-white px-3 py-1 rounded-md">{time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`shrink-0 p-6 border-t border-border flex gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
          <Link
            href={`/${lang}/chat?mentor=${encodeURIComponent(name)}`}
            className={`flex-1 inline-flex items-center justify-center gap-2 bg-navy-base text-white text-[14px] font-semibold py-3 rounded-xl hover:bg-deep-navy transition-colors ${
              isAr ? 'flex-row-reverse' : ''
            }`}
            onClick={onClose}
          >
            {t.detailModal.getMatchedWith} {name.split(' ')[0] || ''}
            <ArrowRightIcon size={16} className={isAr ? 'rotate-180' : ''} />
          </Link>
          <button
            onClick={onClose}
            className="px-6 text-[14px] font-semibold text-text-secondary border border-border rounded-xl py-3 hover:bg-surface transition-colors cursor-pointer"
          >
            {t.detailModal.close}
          </button>
        </div>
      </div>
    </div>
  );
}
