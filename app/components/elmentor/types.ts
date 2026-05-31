import { mentorsEn } from "../../data/mentors";

export type Mentor = (typeof mentorsEn)[number];

export type Question = {
  id?: string;
  key?: string;
  label?: string;
  question?: string;
  type:
    | "free_text"
    | "single_select"
    | "multi_select"
    | "number"
    | "range"
    | "boolean"
    | "date_range";
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
};

export type AgentUiResponse = {
  text?: string;
  questionPlan?: {
    title?: string;
    questions?: Question[];
  } | null;
  rankedMatches?: RankedMatch[];
  matchEvaluation?: {
    band?: string;
    nextAction?: string;
    trialRequired?: boolean;
    rematchTriggers?: string[];
    healthReviewCadence?: string;
  } | null;
  followUpQuestions?: string[];
  sources?: { label?: string; title?: string; score?: number }[] | null;
};

export type RankedMatch = {
  mentorName?: string;
  name?: string;
  band?: string;
  overallScore?: number;
  score?: number;
  summary?: string;
  subscores?: {
    domain?: number;
    goal?: number;
    availability?: number;
    communication?: number;
    personality?: number;
    fit?: number;
  };
  ruleChecks?: {
    rule?: string;
    name?: string;
    passed?: boolean;
    severity?: "blocker" | "warning" | "info" | string;
    reason?: string;
  }[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string | AgentUiResponse;
};
