"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, BriefcaseIcon, ClockIcon, MapPinIcon } from "./icons";
import { DOMAIN_LABELS, Mentor, MENTOR_PHOTOS } from "../lib/types";

function FeaturedSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden flex flex-col justify-between">
      <div className="relative h-[200px] shimmer-bg" />
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="h-5 w-24 rounded shimmer-bg mb-2" />
          <div className="h-4 w-32 rounded shimmer-bg mb-4" />
          <div className="flex gap-4">
            <div className="h-4 w-12 rounded shimmer-bg" />
            <div className="h-4 w-16 rounded shimmer-bg" />
          </div>
        </div>
        <div className="h-9 w-full rounded-lg shimmer-bg mt-4" />
      </div>
    </div>
  );
}

export default function FeaturedMentors({ lang = "en" }: { lang?: string }) {
  const isAr = lang === "ar";

  const [featured, setFeatured] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch a sufficient limit of mentors to filter out busy ones
    fetch(`/api/mentors?lang=${lang}&limit=12`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch featured mentors");
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.mentors || [];
        // Get the first 4 available mentors
        const filtered = list
          .filter((m: Mentor) => m.current_mentees < 3)
          .slice(0, 4);
        setFeatured(filtered);
      })
      .catch((err) => {
        console.error("Error fetching featured mentors:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lang]);

  const localCopy = isAr
    ? {
        tag: "الموجهون المميزون",
        titlePre: "تعلم من الأفضل في",
        titleHighlight: "مجالهم وتخصصهم",
        viewAll: "عرض جميع الموجهين",
        available: "متاح",
        yrs: "سنوات",
      }
    : {
        tag: "Featured Mentors",
        titlePre: "Learn from the best in",
        titleHighlight: "their field",
        viewAll: "View all mentors",
        available: "Available",
        yrs: "yrs",
      };

  return (
    <section className="relative py-28 px-6 lg:px-10 bg-surface/50 gradient-mesh">
      <div className="max-w-[1280px] mx-auto">
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 ${
            isAr ? "md:flex-row-reverse text-right" : "text-left"
          }`}
        >
          <div>
            <span className="inline-block text-[13px] font-semibold text-teal uppercase tracking-widest mb-4">
              {localCopy.tag}
            </span>
            <h2 className="text-[36px] md:text-[44px] font-bold tracking-tight text-navy-base leading-tight">
              {isAr ? (
                <>
                  {localCopy.titlePre}{" "}
                  <span className="text-gradient-purple">
                    {localCopy.titleHighlight}
                  </span>
                </>
              ) : (
                <>
                  {localCopy.titlePre}{" "}
                  <span className="text-gradient-purple">
                    {localCopy.titleHighlight}
                  </span>
                </>
              )}
            </h2>
          </div>
          <Link
            href={`/${lang}/mentors`}
            className={`inline-flex items-center gap-2 text-[15px] font-semibold text-navy-base hover:text-teal transition-colors group shrink-0 ${
              isAr ? "flex-row-reverse" : ""
            }`}
          >
            {localCopy.viewAll}
            <ArrowRightIcon
              size={16}
              className={`transition-transform ${
                isAr
                  ? "group-hover:-translate-x-1 rotate-180"
                  : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <FeaturedSkeleton key={i} />
              ))
            : featured.map((mentor) => {
                const photo = MENTOR_PHOTOS[mentor.sex] || "";
                const domainLabel =
                  DOMAIN_LABELS[mentor.domain.toLowerCase()] || mentor.domain;

                return (
                  <div
                    key={mentor.id}
                    className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Photo */}
                    <div className="relative h-[200px] bg-surface overflow-hidden">
                      <Image
                        src={photo}
                        alt={mentor.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className={`absolute top-3 ${isAr ? "right-3" : "left-3"}`}
                      >
                        <span className="glass text-[11px] font-semibold text-navy-base px-3 py-1 rounded-full shadow-sm">
                          {domainLabel}
                        </span>
                      </div>
                      {mentor.current_mentees < 3 && (
                        <div
                          className={`absolute top-3 ${isAr ? "left-3" : "right-3"} flex items-center gap-1.5 glass px-2.5 py-1 rounded-full`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-green" />
                          <span className="text-[11px] font-semibold text-navy-base">
                            {localCopy.available}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div
                      className="p-5 flex-1 flex flex-col justify-between"
                      style={{ textAlign: isAr ? "right" : "left" }}
                    >
                      <div>
                        <h3 className="text-[17px] font-semibold text-navy-base mb-1 leading-tight">
                          {mentor.name}
                        </h3>
                        <p className="text-[13px] text-text-muted mb-4 capitalize">
                          {mentor.domain}
                        </p>

                        <div
                          className={`flex items-center gap-4 text-[13px] text-text-secondary mb-4 ${
                            isAr ? "flex-row-reverse" : ""
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <BriefcaseIcon
                              size={14}
                              className="text-text-muted"
                            />
                            {mentor.years_experience} {localCopy.yrs}
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
                        </div>

                        <div
                          className={`flex flex-wrap gap-1.5 mb-5 ${
                            isAr ? "flex-row-reverse" : ""
                          }`}
                        >
                          {mentor.expertise_areas.slice(0, 2).map((area, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium text-teal bg-teal/[0.06] px-2.5 py-1 rounded-full"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={`/${lang}/mentors`}
                        className="block text-center text-[13px] font-semibold text-navy-base border border-border rounded-lg py-2.5 hover:bg-surface transition-colors"
                      >
                        {isAr ? "عرض الملف الشخصي" : "View Profile"}
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
