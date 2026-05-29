'use client';

import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SendIcon, SparkleIcon, ArrowRightIcon, ChevronDownIcon } from '../components/icons';
import type { AgentUiResponse, ChatMessage, RankedMatch, Mentor } from '../lib/types';
import mentorsData from '../data/mentors/en';

/* ─── Helpers ────────────────────────────────────────────────────────── */

/** Safely convert any value (string, object, array) to a displayable string */
function toStr(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) return val.map(toStr).join(', ');
  if (typeof val === 'object') {
    const o = val as Record<string, unknown>;
    if ('label' in o && typeof o.label === 'string') return o.label;
    if ('text' in o && typeof o.text === 'string') return o.text;
    if ('value' in o && typeof o.value === 'string') return o.value;
    if ('name' in o && typeof o.name === 'string') return o.name;
    // Fallback: format key-value pairs
    return Object.entries(o)
      .map(([k, v]) => `${k}: ${toStr(v)}`)
      .join(', ');
  }
  return String(val);
}

/** Get the key to use for option button identity */
function optKey(opt: unknown): string {
  if (typeof opt === 'string') return opt;
  if (opt && typeof opt === 'object' && 'value' in (opt as Record<string, unknown>))
    return String((opt as Record<string, unknown>).value);
  return toStr(opt);
}

const QUICK_STARTS = [
  'I want to transition from analyst to product manager.',
  'Find me a mentor in backend engineering who is currently available.',
  "I'm a junior designer wanting to build my portfolio - who can help?",
  "I'm in fintech and want to grow into a senior strategy role.",
];

/* ─── Chat Page Content ──────────────────────────────────────────────── */

function ChatPageContent() {
  const searchParams = useSearchParams();
  const mentorParam = searchParams.get('mentor');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const sessionIdRef = useRef('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initDone = useRef(false);

  // Generate session ID only on client to avoid hydration mismatch
  useEffect(() => {
    const id = Math.random().toString(36).slice(2, 10);
    sessionIdRef.current = id;
    setSessionId(id);
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle mentor pre-fill (only once, after sessionId is ready)
  useEffect(() => {
    if (mentorParam && sessionId && !initDone.current) {
      initDone.current = true;
      sendMessage(`I'd like to be matched with ${mentorParam}. Can you help me understand if they're a good fit for me?`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorParam, sessionId]);

  // Focus input
  useEffect(() => {
    if (mounted) {
      setTimeout(() => inputRef.current?.focus(), 600);
    }
  }, [mounted]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || loading) return;

    const updated: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mcp-session-id': sessionIdRef.current,
        },
        body: JSON.stringify({ query, topK: 6 }),
      });

      const data: AgentUiResponse = await res.json();
      setMessages([...updated, { role: 'assistant', content: data }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: {
            text: 'Unable to reach the matching service right now. Please try again in a moment.',
          } as AgentUiResponse,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const submitForm = () => {
    const summary = Object.entries(formAnswers)
      .map(([k, v]) => `${k}: ${v}`)
      .join('. ');
    if (summary) {
      sendMessage(summary);
      setFormAnswers({});
    }
  };

  return (
    <div className={`flex h-screen bg-surface/30 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* ── Sidebar ── */}
      <aside className={`hidden lg:flex flex-col w-[280px] bg-white border-r border-border/60 p-6 transition-transform duration-500 delay-100 ${mounted ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Image src="/logo.png" alt="Elmentor" width={28} height={28} />
          <span className="text-[18px] font-bold text-navy-base">Elmentor</span>
        </Link>

        <div className="mb-8">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
            Current Session
          </p>
          <div className="flex items-center gap-2 bg-teal/[0.06] text-teal px-3 py-2 rounded-lg text-[13px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            {sessionId ? `Session #${sessionId.slice(0, 4)}` : 'Connecting...'}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
            Quick Start
          </p>
          <div className="flex flex-col gap-2">
            {QUICK_STARTS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-left text-[13px] text-text-secondary bg-surface hover:bg-border/40 px-3 py-2.5 rounded-lg transition-colors leading-snug"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Link
            href="/mentors"
            className="flex items-center gap-2 text-[13px] font-medium text-text-muted hover:text-navy-base transition-colors"
          >
            Browse mentors manually
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </aside>

      {/* ── Chat Area ── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Header */}
        <header className="shrink-0 h-[64px] bg-white border-b border-border/60 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Elmentor" width={24} height={24} />
              </Link>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-navy-base">AI Matching Agent</p>
              <p className="text-[12px] text-text-muted">Tell me your goals and I will find your match</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-[13px] font-medium text-text-muted hover:text-navy-base transition-colors"
          >
            Back to home
          </Link>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="max-w-[720px] mx-auto flex flex-col gap-5">
            {messages.length === 0 && !loading && (
              <div className={`flex flex-col items-center justify-center text-center py-20 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-teal mb-6">
                  <SparkleIcon size={32} />
                </div>
                <h2 className="text-[22px] font-bold text-navy-base mb-2">Start Your Match</h2>
                <p className="text-[15px] text-text-secondary max-w-[400px] mb-8 leading-relaxed">
                  Tell me about your current role, career goals, and what you are looking for in a mentor. I will find and score your best matches.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[480px]">
                  {QUICK_STARTS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="text-left text-[13px] text-navy-base bg-white border border-border hover:border-teal/30 hover:shadow-card rounded-xl px-4 py-3 transition-all leading-snug"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex animate-fade-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-navy-base text-white rounded-2xl rounded-br-sm px-5 py-3'
                      : 'bg-white border border-border/60 rounded-2xl rounded-bl-sm px-5 py-4 shadow-card flex flex-col gap-4'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content as string}</p>
                  ) : (
                    <AgentBubble
                      data={msg.content as AgentUiResponse}
                      onSendMessage={sendMessage}
                      formAnswers={formAnswers}
                      setFormAnswers={setFormAnswers}
                      onSubmitForm={submitForm}
                    />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-up">
                <div className="bg-white border border-border/60 rounded-2xl rounded-bl-sm px-5 py-4 shadow-card">
                  <div className="dot-pulse">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className={`shrink-0 bg-white border-t border-border/60 p-4 transition-all duration-500 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-[720px] mx-auto relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe your career goals or ask about a mentor..."
              rows={1}
              className="w-full bg-surface border border-border rounded-xl py-3.5 pl-4 pr-14 text-[15px] text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
              style={{ minHeight: '50px', maxHeight: '120px' }}
              aria-label="Message to Elmentor agent"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="absolute right-2 bottom-2 w-10 h-10 rounded-lg bg-navy-base text-white flex items-center justify-center disabled:opacity-30 hover:bg-deep-navy transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Send message"
            >
              <SendIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Markdown Renderer ──────────────────────────────────────────────── */

function MarkdownText({ content }: { content: string }) {
  return (
    <div className="prose-agent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h3 className="text-[17px] font-bold text-navy-base mt-4 mb-2">{children}</h3>,
          h2: ({ children }) => <h3 className="text-[16px] font-bold text-navy-base mt-4 mb-2">{children}</h3>,
          h3: ({ children }) => <h4 className="text-[15px] font-semibold text-navy-base mt-3 mb-1.5">{children}</h4>,
          h4: ({ children }) => <h5 className="text-[14px] font-semibold text-navy-base mt-2 mb-1">{children}</h5>,
          p: ({ children }) => <p className="text-[14px] text-text-primary leading-relaxed mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-navy-base">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-[14px] text-text-primary leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} className="text-teal hover:underline font-medium" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-surface text-[13px] text-teal px-1.5 py-0.5 rounded font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-surface rounded-lg p-3 overflow-x-auto text-[13px] mb-2">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-teal pl-3 my-2 text-text-secondary italic">{children}</blockquote>
          ),
          hr: () => <hr className="border-border my-3" />,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="w-full text-[13px] border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-surface px-3 py-1.5 text-left font-semibold text-navy-base">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-1.5 text-text-secondary">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/* ─── Agent Bubble Renderer ──────────────────────────────────────────── */

function AgentBubble({
  data,
  onSendMessage,
  formAnswers,
  setFormAnswers,
  onSubmitForm,
}: {
  data: AgentUiResponse;
  onSendMessage: (q: string) => void;
  formAnswers: Record<string, string>;
  setFormAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmitForm: () => void;
}) {
  // Safely extract text — handle cases where text might be object
  const textContent = useMemo(() => {
    if (!data.text) return null;
    if (typeof data.text === 'string') return data.text;
    return toStr(data.text);
  }, [data.text]);

  return (
    <>
      {/* Text — rendered as Markdown */}
      {textContent && <MarkdownText content={textContent} />}

      {/* Question Plan */}
      {data.questionPlan && (
        <div className="bg-surface rounded-xl p-4 flex flex-col gap-4 border border-border/40">
          <p className="text-[14px] font-semibold text-navy-base">{toStr(data.questionPlan.title)}</p>
          {data.questionPlan.questions.map((q) => (
            <div key={q.id} className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-text-secondary">{toStr(q.label)}</label>
              {q.type === 'free_text' && (
                <textarea
                  className="w-full border border-border rounded-lg p-3 text-[14px] focus:outline-none focus:border-teal min-h-[60px] resize-none bg-white"
                  onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                  value={formAnswers[q.id] || ''}
                />
              )}
              {(q.type === 'single_select' || q.type === 'boolean') && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, oi) => {
                    const label = toStr(opt);
                    const key = optKey(opt);
                    return (
                      <button
                        key={`${key}-${oi}`}
                        onClick={() => setFormAnswers({ ...formAnswers, [q.id]: key })}
                        className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                          formAnswers[q.id] === key
                            ? 'bg-teal text-white scale-105'
                            : 'bg-white border border-border text-text-secondary hover:border-teal/30'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
              {q.type === 'multi_select' && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, oi) => {
                    const label = toStr(opt);
                    const key = optKey(opt);
                    const selected = (formAnswers[q.id] || '').split(',').filter(Boolean).includes(key);
                    return (
                      <button
                        key={`${key}-${oi}`}
                        onClick={() => {
                          const current = (formAnswers[q.id] || '').split(',').filter(Boolean);
                          const next = selected ? current.filter(x => x !== key) : [...current, key];
                          setFormAnswers({ ...formAnswers, [q.id]: next.join(',') });
                        }}
                        className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                          selected
                            ? 'bg-teal text-white scale-105'
                            : 'bg-white border border-border text-text-secondary hover:border-teal/30'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}
              {q.type !== 'free_text' && q.type !== 'single_select' && q.type !== 'boolean' && q.type !== 'multi_select' && (
                <input
                  type={q.type === 'number' ? 'number' : 'text'}
                  className="w-full border border-border rounded-lg p-3 text-[14px] focus:outline-none focus:border-teal bg-white"
                  onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                  value={formAnswers[q.id] || ''}
                  placeholder={q.unit ? `Enter ${q.unit}` : 'Enter value'}
                  min={q.min}
                  max={q.max}
                />
              )}
            </div>
          ))}
          <button
            onClick={onSubmitForm}
            className="bg-navy-base text-white text-[14px] font-semibold py-2.5 rounded-lg hover:bg-deep-navy transition-all duration-200 hover:shadow-lg"
          >
            Submit Answers
          </button>
        </div>
      )}

      {/* Ranked Matches */}
      {data.rankedMatches && data.rankedMatches.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.rankedMatches.map((match, i) => (
            <MatchCard key={i} match={match} />
          ))}
        </div>
      )}

      {/* Match Evaluation */}
      {data.matchEvaluation && (
        <div className="bg-surface rounded-xl p-4 border border-border/40">
          <p className="text-[13px] font-semibold text-navy-base mb-1">
            Band: <span className="capitalize">{toStr(data.matchEvaluation.band)}</span>
          </p>
          <p className="text-[13px] text-text-secondary">{toStr(data.matchEvaluation.nextAction)}</p>
        </div>
      )}

      {/* Follow-up Questions */}
      {data.followUpQuestions && data.followUpQuestions.length > 0 && (
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/40">
          <p className="text-[13px] font-semibold text-navy-base">Follow-up Questions:</p>
          <ul className="list-disc pl-5 space-y-1">
            {data.followUpQuestions.map((q, i) => (
              <li key={i} className="text-[14px] text-text-primary leading-relaxed">
                {toStr(q)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

/* ─── Match Card ─────────────────────────────────────────────────────── */

function MatchCard({ match }: { match: RankedMatch }) {
  const [rulesOpen, setRulesOpen] = useState(false);

  const bandColors: Record<string, string> = {
    excellent: 'text-green bg-green/10',
    recommended: 'text-teal bg-teal/10',
    pre_alignment: 'text-purple bg-purple/10',
    rejected: 'text-text-muted bg-surface',
  };

  const bandClass = bandColors[match.band] || bandColors.recommended;

  // Determine display score (0-100)
  const parseScore = (val: any) => {
    let n = Number(val);
    if (isNaN(n)) return 0;
    // If the backend returns a decimal like 0.406, convert to percentage
    if (n > 0 && n <= 1.0) n = n * 100;
    // If it's STILL tiny (e.g., 0.00406), convert again just in case
    if (n > 0 && n < 1.0) n = n * 100;
    return n;
  };

  const rawScore = parseScore(match.score);

  // Fallback to mentorsData if name is missing or if name is actually a raw ID
  let displayName = toStr(match.name);
  const searchId = match.mentorId || displayName;
  
  if (!displayName || displayName === 'undefined' || displayName.includes('mentor_')) {
    const foundMentor = (mentorsData as Mentor[]).find(m => searchId.includes(m.id));
    if (foundMentor) {
      displayName = foundMentor.name;
    } else {
      displayName = searchId || 'Unknown Mentor';
    }
  }

  return (
    <div className="bg-surface rounded-xl p-4 border border-border/40 hover:shadow-card transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[15px] font-semibold text-navy-base">{displayName}</p>
          <span className={`inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mt-1 ${bandClass}`}>
            {String(match.band).replace(/_/g, ' ')}
          </span>
        </div>
        <Link 
          href="/mentors" 
          className="shrink-0 text-[12px] font-semibold text-teal bg-teal/[0.08] hover:bg-teal/[0.15] border border-teal/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          View Profile
        </Link>
      </div>

      {match.summary && (
        <div className="text-[13px] text-text-secondary leading-relaxed mb-3">
          <MarkdownText content={toStr(match.summary)} />
        </div>
      )}

      {/* Subscores */}
      {match.subscores && (
        <div className="grid grid-cols-5 gap-1 mb-3">
          {[
            { label: 'Domain', val: parseScore(match.subscores.domain) },
            { label: 'Goal', val: parseScore(match.subscores.goal) },
            { label: 'Avail', val: parseScore(match.subscores.availability) },
            { label: 'Comm', val: parseScore(match.subscores.communication) },
            { label: 'Fit', val: parseScore(match.subscores.fit) },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-teal rounded-full transition-all duration-500" style={{ width: `${Math.max(s.val, 8)}%` }} />
              </div>
              <span className="text-[10px] text-text-muted mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Rule checks */}
      {match.ruleChecks && match.ruleChecks.length > 0 && (
        <div>
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            className="flex items-center gap-1 text-[12px] font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronDownIcon size={14} className={`transition-transform duration-200 ${rulesOpen ? 'rotate-180' : ''}`} />
            Eligibility Details
          </button>
          {rulesOpen && (
            <div className="mt-2 flex flex-col gap-1 animate-fade-up">
              {match.ruleChecks.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <span className={r.passed ? 'text-green' : 'text-red'}>
                    {r.passed ? '\u2713' : '\u2717'}
                  </span>
                  <span className="text-text-secondary">{toStr(r.rule)}</span>
                  <span className={`text-[10px] font-bold uppercase ${
                    r.severity === 'blocker' ? 'text-red' : r.severity === 'warning' ? 'text-[#F7B731]' : 'text-text-muted'
                  }`}>
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

/* ─── Page Export with Suspense ───────────────────────────────────────── */

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-surface/30">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="Elmentor" width={48} height={48} className="animate-pulse" />
          <div className="dot-pulse"><span /><span /><span /></div>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
