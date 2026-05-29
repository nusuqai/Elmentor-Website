'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogoMark, SendIcon, SparkleIcon, ArrowRightIcon, ChevronDownIcon } from '../components/icons';
import { AgentUiResponse, ChatMessage, RankedMatch } from '../lib/types';

const QUICK_STARTS = [
  'I want to transition from analyst to product manager.',
  'Find me a mentor in backend engineering who is currently available.',
  'I\'m a junior designer wanting to build my portfolio — who can help?',
  'I\'m in fintech and want to grow into a senior strategy role.',
];

function ChatPageContent() {
  const searchParams = useSearchParams();
  const mentorParam = searchParams.get('mentor');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});

  const sessionId = useRef(Math.random().toString(36).slice(2, 10));
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle mentor pre-fill
  useEffect(() => {
    if (mentorParam && messages.length === 0) {
      sendMessage(`I'd like to be matched with ${mentorParam}. Can you help me understand if they're a good fit?`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorParam]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (query: string) => {
    if (!query.trim() || loading) return;

    const updated: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/elmentor/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mcp-session-id': sessionId.current,
        },
        body: JSON.stringify({ query, topK: 6 }),
      });
      if (!res.ok) throw new Error('Network error');
      const data: AgentUiResponse = await res.json();
      setMessages([...updated, { role: 'assistant', content: data }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: {
            text: 'Unable to reach the matching service. Please make sure the Elmentor server is running.',
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
    <div className="flex h-screen bg-surface/30">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] bg-white border-r border-border/60 p-6">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <LogoMark size={28} />
          <span className="text-[18px] font-bold text-navy-base">Elmentor</span>
        </Link>

        <div className="mb-8">
          <p className="text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-3">
            Current Session
          </p>
          <div className="flex items-center gap-2 bg-teal/[0.06] text-teal px-3 py-2 rounded-lg text-[13px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green" />
            Session #{sessionId.current.slice(0, 4)}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[12px] font-semibold text-text-muted uppercase tracking-wider mb-3">
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <header className="shrink-0 h-[64px] bg-white border-b border-border/60 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <LogoMark size={24} />
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
              <div className="flex flex-col items-center justify-center text-center py-20">
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
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] ${
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
              <div className="flex justify-start">
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
        <div className="shrink-0 bg-white border-t border-border/60 p-4">
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
              className="absolute right-2 bottom-2 w-10 h-10 rounded-lg bg-navy-base text-white flex items-center justify-center disabled:opacity-30 hover:bg-deep-navy transition-colors"
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
  return (
    <>
      {/* Text */}
      {data.text && (
        <div className="text-[15px] text-text-primary leading-relaxed whitespace-pre-wrap">
          {data.text}
        </div>
      )}

      {/* Question Plan */}
      {data.questionPlan && (
        <div className="bg-surface rounded-xl p-4 flex flex-col gap-4 border border-border/40">
          <p className="text-[14px] font-semibold text-navy-base">{data.questionPlan.title}</p>
          {data.questionPlan.questions.map((q) => (
            <div key={q.id} className="flex flex-col gap-2">
              <label className="text-[13px] font-medium text-text-secondary">{q.label}</label>
              {q.type === 'free_text' && (
                <textarea
                  className="w-full border border-border rounded-lg p-3 text-[14px] focus:outline-none focus:border-teal min-h-[60px] resize-none bg-white"
                  onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                  value={formAnswers[q.id] || ''}
                />
              )}
              {(q.type === 'single_select' || q.type === 'boolean') && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFormAnswers({ ...formAnswers, [q.id]: opt })}
                      className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                        formAnswers[q.id] === opt
                          ? 'bg-teal text-white'
                          : 'bg-white border border-border text-text-secondary hover:border-teal/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {q.type === 'multi_select' && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = (formAnswers[q.id] || '').split(',').filter(Boolean).includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          const current = (formAnswers[q.id] || '').split(',').filter(Boolean);
                          const next = selected ? current.filter(x => x !== opt) : [...current, opt];
                          setFormAnswers({ ...formAnswers, [q.id]: next.join(',') });
                        }}
                        className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                          selected
                            ? 'bg-teal text-white'
                            : 'bg-white border border-border text-text-secondary hover:border-teal/30'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={onSubmitForm}
            className="bg-navy-base text-white text-[14px] font-semibold py-2.5 rounded-lg hover:bg-deep-navy transition-colors"
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

      {/* Follow-up Questions */}
      {data.followUpQuestions && data.followUpQuestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {data.followUpQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(q)}
              className="text-[12px] font-medium text-teal bg-teal/[0.06] border border-teal/[0.1] px-3 py-1.5 rounded-full hover:bg-teal/[0.12] transition-colors"
            >
              {q}
            </button>
          ))}
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

  return (
    <div className="bg-surface rounded-xl p-4 border border-border/40">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[15px] font-semibold text-navy-base">{match.name}</p>
          <span className={`inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mt-1 ${bandClass}`}>
            {match.band.replace('_', ' ')}
          </span>
        </div>
        {/* Score circle */}
        <div className="relative w-12 h-12 shrink-0">
          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none" stroke="#077F7F" strokeWidth="3"
              strokeDasharray={`${match.score} ${100 - match.score}`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-navy-base">
            {match.score}
          </span>
        </div>
      </div>

      <p className="text-[13px] text-text-secondary leading-relaxed mb-3">{match.summary}</p>

      {/* Subscores */}
      <div className="grid grid-cols-5 gap-1 mb-3">
        {[
          { label: 'Domain', val: match.subscores.domain },
          { label: 'Goal', val: match.subscores.goal },
          { label: 'Avail', val: match.subscores.availability },
          { label: 'Comm', val: match.subscores.communication },
          { label: 'Fit', val: match.subscores.fit },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${Math.max(s.val, 8)}%` }} />
            </div>
            <span className="text-[10px] text-text-muted mt-1">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Rule checks (collapsed) */}
      {match.ruleChecks && match.ruleChecks.length > 0 && (
        <div>
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            className="flex items-center gap-1 text-[12px] font-medium text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronDownIcon size={14} className={`transition-transform ${rulesOpen ? 'rotate-180' : ''}`} />
            Eligibility Details
          </button>
          {rulesOpen && (
            <div className="mt-2 flex flex-col gap-1">
              {match.ruleChecks.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <span className={r.passed ? 'text-green' : 'text-red'}>
                    {r.passed ? '\u2713' : '\u2717'}
                  </span>
                  <span className="text-text-secondary">{r.rule}</span>
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
        <div className="dot-pulse"><span /><span /><span /></div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
