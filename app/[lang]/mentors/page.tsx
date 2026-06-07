"use client";

import { useState, useEffect, Suspense, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import MentorDetailModal from "../../components/MentorDetailModal";
import { BriefcaseIcon, ClockIcon, GlobeIcon, MapPinIcon } from "../../components/icons";
import { Mentor, MENTOR_PHOTOS } from "../../lib/types";
import { translations } from "../../data/translations";

function MentorSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden flex flex-col">
      <div className="relative h-[220px] shimmer-bg" />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex gap-5 mb-2">
          <div className="h-4 w-12 rounded shimmer-bg" />
          <div className="h-4 w-16 rounded shimmer-bg" />
          <div className="h-4 w-20 rounded shimmer-bg" />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          <div className="h-6 w-16 rounded-full shimmer-bg" />
          <div className="h-6 w-20 rounded-full shimmer-bg" />
          <div className="h-6 w-12 rounded-full shimmer-bg" />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <div className="h-3 w-full rounded shimmer-bg" />
          <div className="h-3 w-5/6 rounded shimmer-bg" />
        </div>
        <div className="flex gap-3 mt-auto">
          <div className="flex-1 h-9 rounded-lg shimmer-bg" />
          <div className="flex-1 h-9 rounded-lg shimmer-bg" />
        </div>
      </div>
    </div>
  );
}

function MentorsContent({ lang }: { lang: "en" | "ar" }) {
  const t = translations[lang];

  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  // Dynamic fetch states
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 9;

  const fetchMentors = async (
    currentOffset: number,
    append: boolean = false,
  ) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        lang,
        offset: currentOffset.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/mentors?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch mentors");

      const data = await res.json();

      if (append) {
        setMentors((prev) => [...prev, ...data.mentors]);
      } else {
        setMentors(data.mentors);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch initial mentors list
  useEffect(() => {
    fetchMentors(0, false);
  }, []);

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchMentors(nextOffset, true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-[80px] min-h-screen bg-white">
        {/* Header */}
        <section className="px-6 lg:px-10 pt-12 pb-6 gradient-mesh">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-[36px] md:text-[48px] font-bold tracking-tight text-navy-base mb-3">
                {t.mentorsPage.title}
              </h1>
              <p className="text-[17px] text-text-secondary max-w-[520px]">
                {t.mentorsPage.subtitle}
              </p>
            </div>

            {!loading && (
              <span className="text-[14px] font-semibold text-navy-base bg-surface px-4 py-2 rounded-full border border-border shadow-sm">
                {total}{" "}
                {total === 1
                  ? t.mentorsPage.foundCount
                  : t.mentorsPage.foundCountPlural}
              </span>
            )}
          </div>
        </section>

        {/* Grid */}
        <section className="px-6 lg:px-10 py-8">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && mentors.length === 0
              ? Array.from({ length: 6 }).map((_, i) => (
                  <MentorSkeleton key={i} />
                ))
              : mentors.map((mentor) => {
                  const photo = MENTOR_PHOTOS[mentor.sex];
                  const name = lang === "ar" ? (mentor.name_ar || mentor.name || "") : (mentor.name_en || mentor.name || "");
                  const expertiseAreas = lang === "ar" ? (mentor.expertise_areas_ar || mentor.expertise_areas || []) : (mentor.expertise_areas_en || mentor.expertise_areas || []);
                  const fitNotes = lang === "ar" ? (mentor.fit_notes_ar || mentor.fit_notes || []) : (mentor.fit_notes_en || mentor.fit_notes || []);

                  return (
                    <div
                      key={mentor.id}
                      className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
                    >
                      {/* Photo */}
                      <div className="relative h-[220px] bg-surface overflow-hidden">
                        <Image
                          src={photo}
                          alt={name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div
                          className={`absolute bottom-4 ${lang === "ar" ? "left-4 right-4 flex-row-reverse" : "left-4 right-4"} flex items-end justify-between`}
                        >
                          <div
                            className={
                              lang === "ar" ? "text-right" : "text-left"
                            }
                          >
                            <h3 className="text-[18px] font-semibold text-white leading-tight drop-shadow-sm">
                              {name}
                            </h3>
                            <p className="text-[13px] text-white/80 capitalize">
                              {mentor.domain}
                            </p>
                          </div>
                          {mentor.current_mentees < 3 ? (
                            <span className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-green" />
                              <span className="text-[11px] font-semibold text-navy-base">
                                {t.mentorsPage.available}
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-red" />
                              <span className="text-[11px] font-semibold text-text-secondary">
                                {t.mentorsPage.full}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-5 text-[13px] text-text-secondary mb-4 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <BriefcaseIcon
                              size={14}
                              className="text-text-muted"
                            />
                            {mentor.years_experience}{" "}
                            {lang === "ar" ? "سنوات" : "years"}
                          </span>
                          {mentor.location ? (
                            <span className="flex items-center gap-1.5">
                              <MapPinIcon size={14} className="text-text-muted" />
                              {mentor.location}
                            </span>
                          ) : mentor.session_frequency ? (
                            <span className="flex items-center gap-1.5">
                              <ClockIcon size={14} className="text-text-muted" />
                              {mentor.session_frequency}
                            </span>
                          ) : null}
                          <span className="flex items-center gap-1.5">
                            <GlobeIcon size={14} className="text-text-muted" />
                            {mentor.languages.join(", ")}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {expertiseAreas.slice(0, 3).map((area, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium text-teal bg-teal/[0.06] border border-teal/[0.08] px-2.5 py-1 rounded-full"
                            >
                              {area}
                            </span>
                          ))}
                          {expertiseAreas.length > 3 && (
                            <span className="text-[11px] font-medium text-text-muted px-2 py-1">
                              +{expertiseAreas.length - 3}{" "}
                              {lang === "ar" ? "أخرى" : "more"}
                            </span>
                          )}
                        </div>

                        {fitNotes.length > 0 && (
                          <p className="text-[13px] text-text-muted leading-relaxed mb-5 line-clamp-2 italic">
                            &ldquo;{fitNotes[0]}&rdquo;
                          </p>
                        )}

                        <div className="flex gap-3 mt-auto">
                          <button
                            onClick={() => setSelectedMentor(mentor)}
                            className="flex-1 text-center text-[13px] font-semibold text-navy-base border border-border rounded-lg py-2.5 hover:bg-surface transition-colors cursor-pointer"
                          >
                            {t.mentorsPage.viewProfile}
                          </button>
                          <Link
                            href={`/${lang}/chat?mentor=${encodeURIComponent(name)}`}
                            className="flex-1 text-center text-[13px] font-semibold text-white bg-navy-base rounded-lg py-2.5 hover:bg-deep-navy transition-colors"
                          >
                            {t.mentorsPage.getMatched}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

            {/* Shimmer skeleton elements for pagination loading */}
            {loadingMore &&
              Array.from({ length: 3 }).map((_, i) => (
                <MentorSkeleton key={`more-${i}`} />
              ))}
          </div>

          {/* No results empty state */}
          {!loading && mentors.length === 0 && (
            <div className="max-w-[1280px] mx-auto text-center py-20">
              <p className="text-[16px] text-text-muted mb-4">
                {t.mentorsPage.noMentors}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-xl border border-border bg-white text-navy-base font-semibold text-[14px] hover:border-navy-base/20 hover:bg-surface active:scale-[0.98] transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {lang === "ar" ? "عرض المزيد من الموجهين" : "Load More Mentors"}
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

export default function MentorsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params) as { lang: "en" | "ar" };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="dot-pulse">
            <span />
            <span />
            <span />
          </div>
        </div>
      }
    >
      <MentorsContent lang={lang} />
    </Suspense>
  );
}
