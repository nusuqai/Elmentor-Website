'use client';

import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import Image from 'next/image';
import { AgentUiResponse, ChatMessage, RankedMatch, DOMAIN_LABELS, MENTOR_PHOTOS } from '../lib/types';
import { CloseIcon, SendIcon, SparkleIcon, BrainIcon, BriefcaseIcon, MapPinIcon } from './icons';

interface AiChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onViewProfile?: (mentorId: string) => void;
  lang?: string;
}

const QUICK_STARTS = [
  "I want to transition from analyst to product manager.",
  "Find me a mentor in backend engineering with capacity available.",
  "I'm a junior designer wanting to build my portfolio who can help?",
  "I'm in fintech and want to grow into a senior strategy role."
];

export default function AiChatPanel({ isOpen, onClose, initialQuery, onViewProfile, lang = 'en' }: AiChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  
  const reactId = useId();
  const sessionId = reactId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'session';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || loading) return;
    
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mcp-session-id': sessionId,
        },
        body: JSON.stringify({ query, topK: 6, lang }),
      });
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data: AgentUiResponse = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([...newMessages, {
        role: 'assistant',
        content: { 
          text: 'Connection error. Make sure the Elmentor server is running on localhost:3000.', 
          questionPlan: undefined, 
          rankedMatches: [], 
          matchEvaluation: undefined 
        } as AgentUiResponse
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, sessionId]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Handle initial query
  useEffect(() => {
    if (isOpen && initialQuery && messages.length === 0) {
      const timer = setTimeout(() => {
        sendMessage(initialQuery);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialQuery, messages.length, sendMessage]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const submitFormAnswers = () => {
    const answerSummary = Object.entries(formAnswers)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
    
    if (answerSummary) {
      sendMessage(`Here are my answers: ${answerSummary}`);
      setFormAnswers({});
    }
  };

  // Helper to format text with basic markdown (bold, newlines)
  const formatText = (text: string) => {
    const lines = text.split('\\n').join('\\n').split('\\n').map((line, i) => (
      <span key={i}>
        {line.split(/\\*\\*(.*?)\\*\\*/g).map((part, j) => 
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        <br />
      </span>
    ));
    return <div className="text-body-standard whitespace-pre-wrap">{lines}</div>;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[999] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[1000] border-l border-light-gray shadow-modal flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="AI Matching Agent Chat"
      >
        {/* Header */}
        <div className="h-[70px] shrink-0 border-b border-light-gray px-[20px] flex items-center justify-between bg-white">
          <div className="flex items-center gap-[12px]">
            <div className="text-teal-accent">
              <SparkleIcon size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-navy-base">AI Matching Agent</span>
              <span className="text-[12px] text-placeholder-gray leading-tight">powered by GPT-4o-mini</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-placeholder-gray hover:text-navy-base p-[8px] transition-colors"
            aria-label="Close chat"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Session Strip */}
        <div className="bg-very-light-gray border-b border-light-gray py-[6px] px-[20px] flex items-center gap-[8px]">
          <span className="bg-teal-accent/10 text-teal-accent text-[10px] font-bold px-[6px] py-[2px] rounded-sm uppercase tracking-wider">
            Session #{sessionId.substring(0,4)}
          </span>
          <span className="text-[12px] text-placeholder-gray flex items-center gap-[4px]">
            <span className="w-[4px] h-[4px] rounded-full bg-success-green block" />
            Context saved
          </span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-[20px] md:p-[24px] flex flex-col gap-[16px]">
          {messages.length === 0 && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-500 mt-[40px]">
              <div className="w-[64px] h-[64px] bg-off-white rounded-full flex items-center justify-center text-teal-accent mb-[24px]">
                <BrainIcon size={32} />
              </div>
              <h3 className="text-[20px] text-navy-base mb-[12px]">Start Your Match</h3>
              <p className="text-[14px] text-text-gray max-w-[280px] mb-[32px]">
                Tell the AI agent your current role, goal, and availability it will find and score your best mentor matches.
              </p>
              
              <div className="flex flex-col gap-[8px] w-full max-w-[320px]">
                {QUICK_STARTS.map((qs, idx) => (
                  <button 
                    key={idx}
                    onClick={() => sendMessage(qs)}
                    className="text-left text-[13px] text-navy-base bg-off-white hover:bg-light-gray border border-light-gray rounded-sm px-[16px] py-[12px] transition-colors"
                  >
                    &ldquo;{qs}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-deep-navy text-white rounded-[12px] rounded-tr-[2px] px-[16px] py-[12px]' 
                    : 'bg-off-white text-text-neutral rounded-[12px] rounded-tl-[2px] p-[16px] flex flex-col gap-[16px] w-full'
                }`}
              >
                {msg.role === 'user' ? (
                  <div className="text-body-standard whitespace-pre-wrap">{msg.content as string}</div>
                ) : (
                  <>
                    {/* Agent Text Response */}
                    {(msg.content as AgentUiResponse).text && (
                      formatText((msg.content as AgentUiResponse).text!)
                    )}

                    {/* Question Plan Form */}
                    {(msg.content as AgentUiResponse).questionPlan && (
                      <div className="bg-white border border-light-gray rounded-sm p-[16px] flex flex-col gap-[16px]">
                        <div className="text-[14px] font-semibold text-navy-base pb-[8px] border-b border-light-gray">
                          {(msg.content as AgentUiResponse).questionPlan!.title}
                        </div>
                        
                        {(msg.content as AgentUiResponse).questionPlan!.questions.map((q) => (
                          <div key={q.id} className="flex flex-col gap-[8px]">
                            <label className="text-[13px] font-semibold text-text-gray">{q.label}</label>
                            
                            {q.type === 'free_text' && (
                              <textarea 
                                className="w-full border border-light-gray rounded-sm p-[8px] text-[14px] focus:outline-none focus:border-teal-accent focus:ring-1 focus:ring-teal-accent min-h-[60px]"
                                onChange={(e) => setFormAnswers({...formAnswers, [q.id]: e.target.value})}
                              />
                            )}
                            
                            {q.type === 'single_select' && q.options && (
                              <div className="flex flex-wrap gap-[8px]">
                                {q.options.map((opt) => {
                                  const label = typeof opt === 'string' ? opt : opt.label;
                                  const val = typeof opt === 'string' ? opt : opt.value;
                                  return (
                                    <button
                                      key={val}
                                      onClick={() => setFormAnswers({...formAnswers, [q.id]: val})}
                                      className={`px-[12px] py-[6px] rounded-full text-[12px] font-semibold transition-colors ${formAnswers[q.id] === val ? 'bg-teal-accent text-white' : 'bg-off-white text-text-gray hover:bg-light-gray'}`}
                                    >
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Additional types would be handled similarly here */}
                          </div>
                        ))}
                        
                        <button 
                          onClick={submitFormAnswers}
                          className="btn-primary w-full mt-[8px]"
                        >
                          Submit Answers
                        </button>
                      </div>
                    )}

                    {/* Ranked Matches */}
                    {(msg.content as AgentUiResponse).rankedMatches && (msg.content as AgentUiResponse).rankedMatches!.length > 0 && (
                      <div className="flex flex-col gap-[12px]">
                        {(msg.content as AgentUiResponse).rankedMatches!.map((match: RankedMatch, mIdx) => {
                          const displayName = lang === 'ar'
                            ? (match.mentor?.name_ar || match.mentorName || match.name || '')
                            : (match.mentor?.name_en || match.mentorName || match.name || '');
                          
                          const parseScore = (val: unknown) => {
                            let n = Number(val);
                            if (isNaN(n)) return 0;
                            if (n > 0 && n <= 1.0) n = n * 100;
                            return Math.round(Math.min(n, 100));
                          };

                          const mentor = match.mentor;
                          const expertiseAreas = mentor
                            ? lang === 'ar'
                              ? mentor.expertise_areas_ar
                              : mentor.expertise_areas_en
                            : undefined;

                          const subscores = match.subscores || {};
                          const matchSummary = match.matchSummary;

                          const subscorebars = [
                            {
                              label: lang === 'ar' ? "توافق المجال" : "Domain Alignment",
                              val: parseScore(subscores.domainAlignment),
                              reason: matchSummary?.domainAlignment,
                            },
                            {
                              label: lang === 'ar' ? "توافق الأهداف" : "Goal Compatibility",
                              val: parseScore(subscores.compatibility ?? subscores.goalCompatibility),
                              reason: matchSummary?.compatibility,
                            },
                            {
                              label: lang === 'ar' ? "توافق المواعيد" : "Availability",
                              val: parseScore(subscores.availability),
                              reason: matchSummary?.availability,
                            },
                            {
                              label: lang === 'ar' ? "أسلوب التواصل" : "Communication Style",
                              val: parseScore(subscores.communicationStyle),
                              reason: matchSummary?.communicationStyle,
                            },
                            {
                              label: lang === 'ar' ? "ملاءمة الشخصية" : "Personality Fit",
                              val: parseScore(subscores.personalityFit),
                              reason: matchSummary?.personalityFit,
                            },
                          ];

                          const bandColors: Record<string, string> = {
                            excellent: 'bg-success-green/10 text-success-green',
                            recommended: 'bg-teal-accent/10 text-teal-accent',
                            pre_alignment: 'bg-purple-accent/10 text-purple-accent',
                            rejected: 'bg-placeholder-gray/10 text-placeholder-gray'
                          };
                          const bandClass = bandColors[match.band] || bandColors.recommended;

                          return (
                            <div key={mIdx} className="bg-white border border-light-gray rounded-sm p-[16px] shadow-sm">
                              {/* Mentor Header Info */}
                              <div className="flex items-start justify-between mb-[12px] gap-2">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-navy-base text-[16px]">{displayName}</span>
                                  <span className={`text-[10px] font-bold uppercase tracking-wide px-[6px] py-[2px] rounded-sm mt-[4px] inline-block w-max ${bandClass}`}>
                                    {match.band.replace('_', ' ')} Match
                                  </span>
                                </div>
                                
                                {/* Score Circle */}
                                <div className="relative w-[48px] h-[48px] rounded-full flex items-center justify-center bg-very-light-gray shrink-0">
                                  <div 
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                      background: `conic-gradient(#077F7F ${match.score}%, transparent 0)`
                                    }}
                                  />
                                  <div className="absolute inset-[3px] bg-white rounded-full" />
                                  <span className="relative z-10 text-[14px] font-bold text-navy-base">{match.score}</span>
                                </div>
                              </div>

                              {/* Mentor Details (Gender photo, domain, location) */}
                              {mentor && (
                                <div className="flex gap-3 items-start border-b border-light-gray pb-[12px] mb-[12px]">
                                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-very-light-gray shrink-0 border border-light-gray">
                                    <Image
                                      src={MENTOR_PHOTOS[mentor.sex]}
                                      alt={displayName}
                                      fill
                                      className="object-cover"
                                      sizes="44px"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-[10px] font-bold text-teal-accent bg-teal-accent/5 border border-teal-accent/10 px-1.5 py-0.5 rounded-full capitalize">
                                        {DOMAIN_LABELS[mentor.domain.toLowerCase()] || mentor.domain}
                                      </span>
                                      <span className="text-[10px] font-semibold text-text-gray flex items-center gap-1">
                                        <BriefcaseIcon size={11} className="text-placeholder-gray shrink-0" />
                                        {mentor.years_experience} {lang === 'ar' ? 'سنوات' : 'yrs'}
                                      </span>
                                      {mentor.location && (
                                        <span className="text-[10px] font-semibold text-text-gray flex items-center gap-1">
                                          <MapPinIcon size={11} className="text-placeholder-gray shrink-0" />
                                          {mentor.location}
                                        </span>
                                      )}
                                    </div>
                                    {/* Localized Stage or Title */}
                                    {(mentor.current_stage_en || mentor.current_stage_ar) && (
                                      <p className="text-[11px] text-placeholder-gray mt-1 leading-tight">
                                        {lang === 'ar' ? mentor.current_stage_ar : mentor.current_stage_en}
                                      </p>
                                    )}
                                    {/* Expertise Areas */}
                                    {expertiseAreas && expertiseAreas.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {expertiseAreas.slice(0, 2).map((area, idx) => (
                                          <span key={idx} className="text-[9px] font-semibold text-text-gray bg-very-light-gray border border-light-gray px-1.5 py-0.5 rounded">
                                            {area}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* General summary fallback if structured is missing */}
                              {!match.matchSummary && match.summary && (
                                <p className="text-[13px] text-text-gray mb-[12px] leading-relaxed">
                                  {match.summary}
                                </p>
                              )}

                              {/* Restructured Subscore rows with scoring reasons */}
                              <div className="flex flex-col gap-3">
                                {subscorebars.map((s, i) => (
                                  <div key={i} className="flex flex-col gap-1 bg-very-light-gray/40 hover:bg-very-light-gray/80 p-2.5 rounded-lg border border-light-gray/40 transition-colors">
                                    <div className="flex justify-between items-center text-[12px]">
                                      <span className="font-bold text-navy-base">{s.label}</span>
                                      <span className="font-bold text-teal-accent tabular-nums text-[13px]">{s.val}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-light-gray rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-teal-accent rounded-full transition-all duration-700"
                                        style={{ width: `${Math.max(s.val, 4)}%` }}
                                      />
                                    </div>
                                    {s.reason && (
                                      <p className="text-[11px] text-text-gray leading-relaxed mt-0.5 border-l-2 border-teal-accent/20 pl-1.5 italic">
                                        {s.reason}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>

                              <button 
                                onClick={() => onViewProfile && onViewProfile(mentor?.id || match.mentorId || '')}
                                className="text-[13px] text-teal-accent font-semibold hover:underline w-full text-center mt-3 pt-3 border-t border-light-gray"
                              >
                                View Full Profile
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Follow up questions (only for assistant messages) */}
              {msg.role === 'assistant' && (msg.content as AgentUiResponse).followUpQuestions && (
                <div className="flex flex-wrap gap-[8px] mt-[12px] ml-[12px]">
                  {(msg.content as AgentUiResponse).followUpQuestions!.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => sendMessage(q)}
                      className="bg-white border border-teal-accent text-teal-accent px-[12px] py-[6px] rounded-full text-[12px] font-semibold hover:bg-teal-accent hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-start">
              <div className="bg-off-white rounded-[12px] rounded-tl-[2px] px-[20px] py-[16px] flex items-center justify-center">
                <div className="dot-pulse">
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-off-white p-[16px] md:p-[20px] border-t border-light-gray flex flex-col gap-[12px]">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your goal or ask about a mentor…"
              className="w-full bg-white border border-light-gray rounded-md py-[12px] pl-[16px] pr-[56px] text-body-standard focus:outline-none focus:border-teal-accent focus:ring-1 focus:ring-teal-accent shadow-sm resize-none"
              rows={1}
              aria-label="Message to Elmentor agent"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || loading}
              className="absolute right-[6px] bottom-[6px] w-[36px] h-[36px] rounded-full bg-deep-navy text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-base transition-colors"
              aria-label="Send message"
            >
              <SendIcon size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
