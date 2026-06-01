"use client";

import React, {
  useState,
  useRef,
  useEffect,
  Suspense,
  useMemo,
  use,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  SendIcon,
  SparkleIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "../../components/icons";
import type {
  AgentUiResponse,
  ChatMessage,
  RankedMatch,
  Mentor,
  QuestionPlan,
  QuestionSpec,
  QuestionOption,
} from "../../lib/types";
import { translations } from "../../data/translations";

/* ─── Helpers ────────────────────────────────────────────────────────── */

function toStr(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) return val.map(toStr).join(", ");
  if (typeof val === "object") {
    const o = val as Record<string, unknown>;
    if ("label" in o && typeof o.label === "string") return o.label;
    if ("text" in o && typeof o.text === "string") return o.text;
    if ("value" in o && typeof o.value === "string") return o.value;
    if ("name" in o && typeof o.name === "string") return o.name;
    return Object.entries(o)
      .map(([k, v]) => `${k}: ${toStr(v)}`)
      .join(", ");
  }
  return String(val);
}

/** Resolve display label from an option — supports both object and string shapes */
function optLabel(opt: QuestionOption | string): string {
  if (typeof opt === "string") return opt;
  return opt.label;
}

function optValue(opt: QuestionOption | string): string {
  if (typeof opt === "string") return opt;
  return opt.value;
}

/* ─── Markdown Renderer ──────────────────────────────────────────────── */

function MarkdownText({ content }: { content: string }) {
  return (
    <div className="prose-agent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h3 className="text-[17px] font-bold text-navy-base mt-4 mb-2">
              {children}
            </h3>
          ),
          h2: ({ children }) => (
            <h3 className="text-[16px] font-bold text-navy-base mt-4 mb-2">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-[15px] font-semibold text-navy-base mt-3 mb-1.5">
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-[14px] font-semibold text-navy-base mt-2 mb-1">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-[14px] text-text-primary leading-relaxed mb-2 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-navy-base">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[14px] text-text-primary leading-relaxed">
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-teal hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-surface text-[13px] text-teal px-1.5 py-0.5 rounded font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-surface rounded-lg p-3 overflow-x-auto text-[13px] mb-2">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-teal pl-3 my-2 text-text-secondary italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border my-3" />,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="w-full text-[13px] border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-surface px-3 py-1.5 text-left font-semibold text-navy-base">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-1.5 text-text-secondary">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ─── Answers Summary Bubble (user side) ─────────────────────────────── */

function AnswersSummaryBubble({
  answers,
  lang,
}: {
  answers: Array<{ label: string; answer: string }>;
  lang: "en" | "ar";
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-green/20 flex items-center justify-center text-[11px] text-green shrink-0">
          ✓
        </span>
        <span className="text-[12px] font-semibold text-white/80 uppercase tracking-wide">
          {lang === "ar" ? "إجابات مُرسَلة" : "Answers submitted"}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Answer pairs */}
      <div className="flex flex-col gap-2.5">
        {answers.map((a, i) => (
          <div key={i} className="flex flex-col gap-0.5">
            <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider leading-tight">
              {a.label}
            </span>
            <span className="text-[14px] text-white leading-snug">
              {a.answer}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Single Question Field ──────────────────────────────────────────── */

function QuestionField({
  q,
  value,
  onChange,
  disabled,
  lang,
}: {
  q: QuestionSpec;
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  lang: "en" | "ar";
}) {
  const inputBase =
    "w-full border border-border rounded-lg p-3 text-[14px] focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal/20 bg-white transition-colors disabled:bg-surface disabled:text-text-muted disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label */}
      <label className="text-[13px] font-medium text-text-secondary flex items-center gap-1">
        {q.label}
        {q.required && (
          <span className="text-red-400 text-[11px] leading-none">*</span>
        )}
      </label>

      {/* Description */}
      {q.description && (
        <p className="text-[12px] text-text-muted leading-relaxed -mt-0.5">
          {q.description}
        </p>
      )}

      {/* ── free_text ── */}
      {q.type === "free_text" && (
        <textarea
          className={`${inputBase} resize-none`}
          placeholder={
            q.placeholder ||
            (lang === "ar" ? "اكتب إجابتك..." : "Type your answer...")
          }
          rows={q.multiline ? 4 : 2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{ minHeight: q.multiline ? "96px" : "60px" }}
        />
      )}

      {/* ── single_select ── */}
      {q.type === "single_select" && q.options && (
        <div className="flex flex-wrap gap-2">
          {q.options.map((opt) => {
            const label = optLabel(opt);
            const val = optValue(opt);
            const desc =
              typeof opt === "object" && opt !== null ? opt.description : null;
            return (
              <button
                key={val}
                type="button"
                onClick={() => onChange(val)}
                disabled={disabled}
                title={desc || undefined}
                className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                  value === val
                    ? "bg-teal text-white border-teal shadow-sm scale-105"
                    : "bg-white border-border text-text-secondary hover:border-teal/40 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {label}
              </button>
            );
          })}
          {q.allowOther && !disabled && (
            <OtherInput value={value} onChange={onChange} options={q.options} lang={lang} />
          )}
        </div>
      )}

      {/* ── multi_select ── */}
      {q.type === "multi_select" && q.options && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt) => {
              const label = optLabel(opt);
              const val = optValue(opt);
              const selected = (value || "")
                .split(",")
                .filter(Boolean)
                .includes(val);
              const desc =
                typeof opt === "object" && opt !== null ? opt.description : null;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    const current = (value || "").split(",").filter(Boolean);
                    const next = selected
                      ? current.filter((x) => x !== val)
                      : [...current, val];
                    onChange(next.join(","));
                  }}
                  disabled={disabled}
                  title={desc || undefined}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                    selected
                      ? "bg-teal text-white border-teal shadow-sm scale-105"
                      : "bg-white border-border text-text-secondary hover:border-teal/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {q.minSelections != null && q.maxSelections != null && !disabled && (
            <p className="text-[11px] text-text-muted">
              {lang === "ar"
                ? `اختر من ${q.minSelections} إلى ${q.maxSelections}`
                : `Select ${q.minSelections}–${q.maxSelections} options`}
            </p>
          )}
        </div>
      )}

      {/* ── boolean ── */}
      {q.type === "boolean" && (
        <div className="flex gap-2">
          {[
            {
              val: "true",
              label: q.trueLabel || (lang === "ar" ? "نعم" : "Yes"),
            },
            {
              val: "false",
              label: q.falseLabel || (lang === "ar" ? "لا" : "No"),
            },
          ].map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={() => onChange(opt.val)}
              disabled={disabled}
              className={`flex-1 py-2 rounded-lg text-[14px] font-semibold transition-all duration-200 border ${
                value === opt.val
                  ? "bg-teal text-white border-teal shadow-sm scale-[1.02]"
                  : "bg-white border-border text-text-secondary hover:border-teal/40 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* ── date ── */}
      {q.type === "date" && (
        <input
          type="date"
          className={inputBase}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          min={q.minDate || undefined}
          max={q.maxDate || undefined}
        />
      )}

      {/* ── date_range ── */}
      {q.type === "date_range" && (
        <div className="flex gap-3 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[11px] text-text-muted font-medium">
              {lang === "ar" ? "من" : "From"}
            </span>
            <input
              type="date"
              className={inputBase}
              value={value.split("|")[0] || ""}
              onChange={(e) => {
                const [, end] = value.split("|");
                onChange(`${e.target.value}|${end || ""}`);
              }}
              disabled={disabled}
              min={q.minDate || undefined}
              max={q.maxDate || undefined}
            />
          </div>
          <span className="text-text-muted pb-3 text-[16px]">→</span>
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[11px] text-text-muted font-medium">
              {lang === "ar" ? "إلى" : "To"}
            </span>
            <input
              type="date"
              className={inputBase}
              value={value.split("|")[1] || ""}
              onChange={(e) => {
                const [start] = value.split("|");
                onChange(`${start || ""}|${e.target.value}`);
              }}
              disabled={disabled}
              min={q.minDate || undefined}
              max={q.maxDate || undefined}
            />
          </div>
        </div>
      )}

      {/* ── number ── */}
      {q.type === "number" && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={`${inputBase} flex-1`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={
              q.placeholder ||
              (lang === "ar" ? "أدخل رقماً" : "Enter a number")
            }
            min={q.minValue ?? undefined}
            max={q.maxValue ?? undefined}
            step={q.step ?? undefined}
          />
          {q.unit && (
            <span className="text-[13px] text-text-muted font-semibold shrink-0 px-2 py-1 bg-surface border border-border rounded-lg">
              {q.unit}
            </span>
          )}
        </div>
      )}

      {/* ── range ── */}
      {q.type === "range" && (() => {
        const min = q.minValue ?? 0;
        const max = q.maxValue ?? 100;
        const step = q.step ?? 1;
        const current = value ? Number(value) : min;
        return (
          <div className="flex flex-col gap-2 px-1">
            {/* Current value display */}
            <div className="flex items-center justify-center">
              <span className="text-[18px] font-bold text-teal tabular-nums">
                {current}
                {q.unit ? <span className="text-[13px] font-medium text-text-muted ml-1">{q.unit}</span> : null}
              </span>
            </div>
            <input
              type="range"
              className="w-full accent-teal disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              value={current}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
            />
            <div className="flex justify-between text-[11px] text-text-muted">
              <span>{q.leftLabel || min}{q.unit ? ` ${q.unit}` : ""}</span>
              <span>{q.rightLabel || max}{q.unit ? ` ${q.unit}` : ""}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ─── "Other" free-text fallback for single_select ──────────────────── */

function OtherInput({
  value,
  onChange,
  options,
  lang,
}: {
  value: string;
  onChange: (val: string) => void;
  options: QuestionOption[];
  lang: "en" | "ar";
}) {
  const knownValues = options.map((o) => optValue(o));
  const isOtherActive = value && !knownValues.includes(value);
  const [show, setShow] = useState(!!isOtherActive);

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="px-3 py-1.5 rounded-full text-[13px] font-medium border border-dashed border-border text-text-muted hover:border-teal/40 transition-colors"
      >
        {lang === "ar" ? "+ أخرى" : "+ Other"}
      </button>
    );
  }

  return (
    <input
      type="text"
      autoFocus
      placeholder={lang === "ar" ? "اكتب إجابتك..." : "Type your answer..."}
      value={isOtherActive ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 min-w-[140px] border border-teal rounded-full px-3 py-1.5 text-[13px] focus:outline-none bg-white"
    />
  );
}

/* ─── Question Plan Form ─────────────────────────────────────────────── */

function QuestionPlanForm({
  plan,
  formAnswers,
  setFormAnswers,
  onSubmit,
  isAnswered,
  lang,
}: {
  plan: QuestionPlan;
  formAnswers: Record<string, string>;
  setFormAnswers: (answers: Record<string, string>) => void;
  onSubmit: (questions: QuestionSpec[]) => void;
  isAnswered: boolean;
  lang: "en" | "ar";
}) {
  const t = translations[lang];

  /** A question is visible only if all its dependencies have an answer */
  const isVisible = (q: QuestionSpec): boolean => {
    if (!q.dependsOn || q.dependsOn.length === 0) return true;
    return q.dependsOn.every((depId) => !!formAnswers[depId]);
  };

  const visibleQuestions = plan.questions.filter(isVisible);

  const setAnswer = (id: string, val: string) => {
    setFormAnswers({ ...formAnswers, [id]: val });
  };

  return (
    <div
      className={`rounded-xl flex flex-col gap-4 border transition-all duration-300 ${
        isAnswered
          ? "bg-surface/60 border-green/20 opacity-80"
          : "bg-surface border-border/40"
      } p-4`}
    >
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] font-semibold text-navy-base leading-snug">
            {plan.title}
          </p>
          {isAnswered && (
            <span className="shrink-0 text-[11px] font-bold text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              ✓{" "}
              {lang === "ar" ? "تمّت الإجابة" : "Answered"}
            </span>
          )}
        </div>
        {plan.reason && (
          <p className="text-[12px] text-text-muted leading-relaxed border-l-2 border-teal/30 pl-2">
            {plan.reason}
          </p>
        )}
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {visibleQuestions.map((q) => (
          <QuestionField
            key={q.id}
            q={q}
            value={formAnswers[q.id] || ""}
            onChange={(val) => setAnswer(q.id, val)}
            disabled={isAnswered}
            lang={lang}
          />
        ))}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={() => onSubmit(plan.questions)}
        disabled={isAnswered}
        className={`w-full py-2.5 rounded-lg text-[14px] font-semibold transition-all duration-200 ${
          isAnswered
            ? "bg-green/10 text-green border border-green/20 cursor-not-allowed"
            : "bg-navy-base text-white hover:bg-deep-navy hover:shadow-lg active:scale-[0.98]"
        }`}
      >
        {isAnswered
          ? lang === "ar"
            ? "✓ تمّ الإرسال"
            : "✓ Submitted"
          : t.chatPage.submitAnswers}
      </button>
    </div>
  );
}

/* ─── Match Card ─────────────────────────────────────────────────────── */

function MatchCard({ match, lang }: { match: RankedMatch; lang: "en" | "ar" }) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const t = translations[lang];

  const bandColors: Record<string, string> = {
    excellent: "text-green bg-green/10",
    recommended: "text-teal bg-teal/10",
    pre_alignment: "text-purple bg-purple/10",
    rejected: "text-text-muted bg-surface",
  };

  const bandClass = bandColors[match.band] || bandColors.recommended;

  const parseScore = (val: unknown) => {
    let n = Number(val);
    if (isNaN(n)) return 0;
    // Normalise 0–1 fractional scores to 0–100
    if (n > 0 && n <= 1.0) n = n * 100;
    return Math.round(Math.min(n, 100));
  };

  // Prefer mentorName (schema field), fall back to name (legacy)
  let displayName = toStr(match.mentorName || match.name);
  const searchId = match.mentorId || displayName;

  if (
    !displayName ||
    displayName === "undefined" ||
    displayName.includes("mentor_")
  ) {
    const fallbacks: Record<string, string> = {
      mentor_001: lang === "ar" ? "مايا السيد" : "Maya El-Sayed",
      mentor_002: lang === "ar" ? "عمر خالد" : "Omar Khaled",
      mentor_003: lang === "ar" ? "نور حسن" : "Nour Hassan",
      mentor_004: lang === "ar" ? "لينا فوزي" : "Lina Fawzy",
      mentor_005: lang === "ar" ? "حسن عادل" : "Hassan Adel",
      mentor_006: lang === "ar" ? "سارة محمود" : "Sara Mahmoud",
      mentor_007: lang === "ar" ? "كريم يوسف" : "Karim Youssef",
      mentor_008: lang === "ar" ? "داليا ناصر" : "Dalia Nasser",
      mentor_009: lang === "ar" ? "يارا أمين" : "Yara Amin",
      mentor_010: lang === "ar" ? "طارق سالم" : "Tarek Salem"
    };
    displayName = fallbacks[searchId] || searchId || "Unknown Mentor";
  }

  const subscores = match.subscores || {};

  const subscorebars = [
    {
      label: lang === "ar" ? "المجال" : "Domain",
      val: parseScore(subscores.domainAlignment),
    },
    {
      label: lang === "ar" ? "الهدف" : "Goal",
      val: parseScore(subscores.goalCompatibility),
    },
    {
      label: lang === "ar" ? "المتاح" : "Avail",
      val: parseScore(subscores.availability),
    },
    {
      label: lang === "ar" ? "الاتصال" : "Comm",
      val: parseScore(subscores.communicationStyle),
    },
    {
      label: lang === "ar" ? "الملاءمة" : "Fit",
      val: parseScore(subscores.personalityFit),
    },
  ];

  return (
    <div className="bg-white rounded-xl p-4 border border-border/60 hover:shadow-card transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
        <div>
          <p className="text-[15px] font-semibold text-navy-base">
            {displayName}
          </p>
          <span
            className={`inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mt-1 ${bandClass}`}
          >
            {String(match.band).replace(/_/g, " ")}
          </span>
        </div>
        <Link
          href={`/${lang}/mentors`}
          className="shrink-0 text-[12px] font-semibold text-teal bg-teal/[0.08] hover:bg-teal/[0.15] border border-teal/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          {t.chatPage.viewProfileBtn}
        </Link>
      </div>

      {match.summary && (
        <div className="text-[13px] text-text-secondary leading-relaxed mb-3">
          <MarkdownText content={toStr(match.summary)} />
        </div>
      )}

      {/* Subscores */}
      <div className="grid grid-cols-5 gap-1 mb-3">
        {subscorebars.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-700"
                style={{ width: `${Math.max(s.val, 4)}%` }}
              />
            </div>
            <span className="text-[10px] text-text-muted text-center leading-tight">
              {s.label}
            </span>
            <span className="text-[11px] font-semibold text-navy-base">
              {s.val}
            </span>
          </div>
        ))}
      </div>

      {/* Rule checks */}
      {match.ruleChecks && match.ruleChecks.length > 0 && (
        <div>
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            className="flex items-center gap-1 text-[12px] font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronDownIcon
              size={14}
              className={`transition-transform duration-200 ${rulesOpen ? "rotate-180" : ""}`}
            />
            {t.chatPage.eligibilityDetails}
          </button>
          {rulesOpen && (
            <div className="mt-2 flex flex-col gap-1.5 animate-fade-up">
              {match.ruleChecks.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-[12px]">
                  <span
                    className={`shrink-0 mt-0.5 font-bold ${r.passed ? "text-green" : "text-red-400"}`}
                  >
                    {r.passed ? "✓" : "✗"}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-text-secondary font-medium">
                      {toStr(r.title)}
                    </span>
                    {r.reason && (
                      <span className="text-text-muted text-[11px] leading-tight">
                        {toStr(r.reason)}
                      </span>
                    )}
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase ml-auto ${
                      r.severity === "blocker"
                        ? "text-red-400"
                        : r.severity === "warning"
                          ? "text-amber-500"
                          : "text-text-muted"
                    }`}
                  >
                    {r.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Agent Bubble ───────────────────────────────────────────────────── */

function AgentBubble({
  data,
  msgIdx,
  onSendMessage,
  formAnswers,
  setFormAnswers,
  onSubmitForm,
  isAnswered,
  lang,
}: {
  data: AgentUiResponse;
  msgIdx: number;
  onSendMessage: (q: string) => void;
  formAnswers: Record<string, string>;
  setFormAnswers: (answers: Record<string, string>) => void;
  onSubmitForm: (questions: QuestionSpec[]) => void;
  isAnswered: boolean;
  lang: "en" | "ar";
}) {
  const t = translations[lang];

  const textContent = useMemo(() => {
    if (!data.text) return null;
    return typeof data.text === "string" ? data.text : toStr(data.text);
  }, [data.text]);

  return (
    <>
      {/* Text — rendered as Markdown */}
      {textContent && <MarkdownText content={textContent} />}

      {/* Question Plan */}
      {data.questionPlan && (
        <QuestionPlanForm
          plan={data.questionPlan}
          formAnswers={formAnswers}
          setFormAnswers={setFormAnswers}
          onSubmit={onSubmitForm}
          isAnswered={isAnswered}
          lang={lang}
        />
      )}

      {/* Ranked Matches */}
      {data.rankedMatches && data.rankedMatches.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.rankedMatches.map((match, i) => (
            <MatchCard key={i} match={match} lang={lang} />
          ))}
        </div>
      )}

      {/* Match Evaluation */}
      {data.matchEvaluation && (
        <div className="bg-surface rounded-xl p-4 border border-border/40 animate-fade-up">
          <p className="text-[13px] font-semibold text-navy-base mb-1">
            {t.chatPage.band}{" "}
            <span className="capitalize">
              {toStr(data.matchEvaluation.band)}
            </span>
          </p>
          <p className="text-[13px] text-text-secondary">
            {toStr(data.matchEvaluation.nextAction)}
          </p>
        </div>
      )}

      {/* Follow-up Questions — as clickable chips */}
      {data.followUpQuestions && data.followUpQuestions.length > 0 && (
        <div className="flex flex-col gap-2 pt-3 border-t border-border/40">
          <p className="text-[12px] font-semibold text-text-muted uppercase tracking-wide">
            {t.chatPage.followUpQuestions}
          </p>
          <div className="flex flex-col gap-1.5">
            {data.followUpQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSendMessage(toStr(q))}
                className={`text-[13px] text-navy-base bg-white border border-border hover:border-teal/40 hover:text-teal hover:bg-teal/[0.04] rounded-lg px-3 py-2 transition-all duration-150 leading-snug ${
                  lang === "ar" ? "text-right" : "text-left"
                }`}
              >
                {toStr(q)}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Chat Page Content ──────────────────────────────────────────────── */

function ChatPageContent({ lang }: { lang: "en" | "ar" }) {
  const searchParams = useSearchParams();
  const mentorParam = searchParams.get("mentor");
  const t = translations[lang];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  /** Per-agent-message form answers, keyed by message index */
  const [formAnswers, setFormAnswers] = useState<
    Record<number, Record<string, string>>
  >({});

  /** Set of agent-message indices whose question plan has been submitted */
  const [answeredPlanIndices, setAnsweredPlanIndices] = useState<Set<number>>(
    new Set(),
  );

  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const sessionIdRef = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initDone = useRef(false);

  useEffect(() => {
    const id = Math.random().toString(36).slice(2, 10);
    sessionIdRef.current = id;
    setSessionId(id);
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (mentorParam && sessionId && !initDone.current) {
      initDone.current = true;
      const initialPrompt =
        lang === "ar"
          ? `أود مطابقتي مع الموجه ${mentorParam}. هل يمكنك مساعدتي في فهم ما إذا كان مناسباً لي؟`
          : `I'd like to be matched with ${mentorParam}. Can you help me understand if they're a good fit for me?`;
      sendMessage(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorParam, sessionId]);

  useEffect(() => {
    if (mounted) {
      setTimeout(() => inputRef.current?.focus(), 600);
    }
  }, [mounted]);

  /** Send a plain text message */
  const sendMessage = async (query: string) => {
    if (!query.trim() || loading) return;

    const updated: ChatMessage[] = [
      ...messages,
      { role: "user", content: query },
    ];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "mcp-session-id": sessionIdRef.current,
        },
        body: JSON.stringify({ query, topK: 6 }),
      });

      const data: AgentUiResponse = await res.json();
      setMessages([...updated, { role: "assistant", content: data }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: {
            text: t.chatPage.failedToConnect,
          } as AgentUiResponse,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit answers for a specific question plan.
   * `agentMsgIdx` is the index of the assistant message containing the plan.
   */
  const submitQuestionPlan = async (
    agentMsgIdx: number,
    questions: QuestionSpec[],
  ) => {
    const answers = formAnswers[agentMsgIdx] || {};

    // Build pretty label→answer pairs (skip blanks)
    const planAnswers = questions
      .map((q) => ({ label: q.label, answer: toStr(answers[q.id] || "") }))
      .filter((a) => a.answer.trim());

    if (planAnswers.length === 0) return;

    // Raw serialised string sent to the agent
    const query = planAnswers.map((a) => `${a.label}: ${a.answer}`).join(". ");

    // Create user message with the pretty answers attached
    const userMsg: ChatMessage = {
      role: "user",
      content: query,
      questionPlanAnswers: planAnswers,
    };

    const updated: ChatMessage[] = [...messages, userMsg];
    setMessages(updated);

    // Lock the question plan
    setAnsweredPlanIndices((prev) => new Set([...prev, agentMsgIdx]));

    // Clear the answers for this message (no longer needed)
    setFormAnswers((prev) => {
      const next = { ...prev };
      delete next[agentMsgIdx];
      return next;
    });

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "mcp-session-id": sessionIdRef.current,
        },
        body: JSON.stringify({ query, topK: 6 }),
      });

      const data: AgentUiResponse = await res.json();
      setMessages([...updated, { role: "assistant", content: data }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: { text: t.chatPage.failedToConnect } as AgentUiResponse,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className={`flex h-screen bg-surface/30 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      {/* ── Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col w-[280px] bg-white p-6 transition-transform duration-500 delay-100 ${
          lang === "ar" ? "border-l border-r-0" : "border-r border-border/60"
        }`}
      >
        <Link href={`/${lang}`} className="flex items-center gap-2 mb-10">
          <Image src="/logo.png" alt="Elmentor" width={28} height={28} />
          <span className="text-[18px] font-bold text-navy-base">
            {t.nav.logoText}
          </span>
        </Link>

        <div className="mb-8">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
            {t.chatPage.currentSession}
          </p>
          <div className="flex items-center gap-2 bg-teal/[0.06] text-teal px-3 py-2 rounded-lg text-[13px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            {sessionId
              ? `${t.chatPage.currentSession.split(" ")[0]} #${sessionId.slice(0, 4)}`
              : t.chatPage.sessionConnecting}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
            {t.chatPage.quickStartTitle}
          </p>
          <div className="flex flex-col gap-2">
            {t.chatPage.quickStarts.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-left text-[13px] text-text-secondary bg-surface hover:bg-border/40 px-3 py-2.5 rounded-lg transition-colors leading-snug"
                style={{ textAlign: lang === "ar" ? "right" : "left" }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Link
            href={`/${lang}/mentors`}
            className="flex items-center gap-2 text-[13px] font-medium text-text-muted hover:text-navy-base transition-colors"
          >
            {t.chatPage.browseManually}
            <ArrowRightIcon
              size={14}
              className={lang === "ar" ? "rotate-180" : ""}
            />
          </Link>
        </div>
      </aside>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 h-[64px] bg-white border-b border-border/60 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Link href={`/${lang}`} className="flex items-center gap-2">
                <Image src="/logo.png" alt="Elmentor" width={24} height={24} />
              </Link>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-navy-base">
                {t.chatPage.title}
              </p>
              <p className="text-[12px] text-text-muted">
                {t.chatPage.statusText}
              </p>
            </div>
          </div>
          <Link
            href={`/${lang}`}
            className="text-[13px] font-medium text-text-muted hover:text-navy-base transition-colors"
          >
            {t.chatPage.backToHome}
          </Link>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-[720px] mx-auto flex flex-col gap-5">
            {/* Empty state */}
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-up">
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-teal mb-6">
                  <SparkleIcon size={32} />
                </div>
                <h2 className="text-[22px] font-bold text-navy-base mb-2">
                  {t.chatPage.startYourMatch}
                </h2>
                <p className="text-[15px] text-text-secondary max-w-[400px] mb-8 leading-relaxed">
                  {t.chatPage.welcomeText}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[480px]">
                  {t.chatPage.quickStarts.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-left text-[13px] text-navy-base bg-white border border-border hover:border-teal/30 hover:shadow-card rounded-xl px-4 py-3 transition-all leading-snug"
                      style={{ textAlign: lang === "ar" ? "right" : "left" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex animate-fade-up ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    msg.role === "user"
                      ? "max-w-[80%] bg-navy-base text-white rounded-2xl rounded-br-sm px-5 py-3"
                      : "w-full bg-white border border-border/60 rounded-2xl rounded-bl-sm px-5 py-4 shadow-card flex flex-col gap-4"
                  }`}
                >
                  {msg.role === "user" ? (
                    /* ── User bubble ── */
                    msg.questionPlanAnswers ? (
                      <AnswersSummaryBubble
                        answers={msg.questionPlanAnswers}
                        lang={lang}
                      />
                    ) : (
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {msg.content as string}
                      </p>
                    )
                  ) : (
                    /* ── Agent bubble ── */
                    <AgentBubble
                      data={msg.content as AgentUiResponse}
                      msgIdx={idx}
                      onSendMessage={sendMessage}
                      formAnswers={formAnswers[idx] || {}}
                      setFormAnswers={(answers) =>
                        setFormAnswers((prev) => ({ ...prev, [idx]: answers }))
                      }
                      onSubmitForm={(questions) =>
                        submitQuestionPlan(idx, questions)
                      }
                      isAnswered={answeredPlanIndices.has(idx)}
                      lang={lang}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start animate-fade-up">
                <div className="bg-white border border-border/60 rounded-2xl rounded-bl-sm px-5 py-4 shadow-card">
                  <div className="dot-pulse">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 bg-white border-t border-border/60 p-4">
          <div className="max-w-[720px] mx-auto relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={t.chatPage.textareaPlaceholder}
              rows={1}
              className={`w-full bg-surface border border-border rounded-xl py-3.5 pl-4 pr-14 text-[15px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all ${
                lang === "ar" ? "text-right" : "text-left"
              }`}
              style={{ minHeight: "50px", maxHeight: "120px" }}
              aria-label="Message to Elmentor agent"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className={`absolute bottom-2 w-10 h-10 rounded-lg bg-navy-base text-white flex items-center justify-center disabled:opacity-30 hover:bg-deep-navy transition-all duration-200 hover:scale-105 active:scale-95 ${
                lang === "ar" ? "left-2" : "right-2"
              }`}
              aria-label="Send message"
            >
              <SendIcon
                size={18}
                className={lang === "ar" ? "rotate-180" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page Export with Suspense ───────────────────────────────────────── */

export default function ChatPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params) as { lang: "en" | "ar" };

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-surface/30">
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/logo.png"
              alt="Elmentor"
              width={48}
              height={48}
              className="animate-pulse"
            />
            <div className="dot-pulse">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      }
    >
      <ChatPageContent lang={lang} />
    </Suspense>
  );
}
