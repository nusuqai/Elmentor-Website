export interface Mentor {
  id: string;
  name: string;
  domain: string;
  expertise_areas: string[];
  current_stage: string;
  years_experience: number;
  current_mentees: number;
  availability: string[];
  session_frequency: string;
  communication_channels: string[];
  communication_style: string[];
  personality_tags: string[];
  languages: string[];
  fit_notes: string[];
  is_demo: boolean;
  photo?: string;
}

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string | AgentUiResponse;
  /** Present on user messages that were submitted as question-plan answers */
  questionPlanAnswers?: Array<{ label: string; answer: string }>;
}

/* ─── Question Schema ─────────────────────────────────────────────────── */

export type QuestionType =
  | "free_text"
  | "single_select"
  | "multi_select"
  | "date"
  | "date_range"
  | "number"
  | "range"
  | "boolean";

export interface QuestionOption {
  label: string;
  value: string;
  description: string | null;
}

export interface QuestionSpec {
  id: string;
  type: QuestionType;
  label: string;
  description: string | null;
  required: boolean;
  dependsOn: string[] | null;
  placeholder: string | null;
  multiline: boolean | null;
  options: QuestionOption[] | null;
  allowOther: boolean | null;
  minSelections: number | null;
  maxSelections: number | null;
  minDate: string | null;
  maxDate: string | null;
  minValue: number | null;
  maxValue: number | null;
  step: number | null;
  unit: string | null;
  leftLabel: string | null;
  rightLabel: string | null;
  trueLabel: string | null;
  falseLabel: string | null;
}

export interface QuestionPlan {
  title: string;
  reason: string;
  questions: QuestionSpec[];
}

/* ─── Ranked Matches ──────────────────────────────────────────────────── */

export interface MatchSubscores {
  domainAlignment: number;
  goalCompatibility: number;
  availability: number;
  communicationStyle: number;
  personalityFit: number;
}

export interface RuleCheck {
  ruleId?: string;
  title: string;
  reason: string;
  passed: boolean;
  isDeterministic?: boolean;
  severity: "blocker" | "warning" | "info";
}

export interface RankedMatch {
  mentorId: string;
  /** Primary display name — from schema */
  mentorName: string;
  /** Legacy fallback — some responses still send `name` */
  name?: string;
  band: "excellent" | "recommended" | "pre_alignment" | "rejected";
  score: number;
  summary: string;
  subscores: MatchSubscores;
  ruleChecks: RuleCheck[];
  nextAction?: "approve" | "trial_session" | "pre_alignment_session" | "reject";
}

export interface MatchEvaluation {
  eligible?: boolean;
  band: string;
  nextAction: string;
  score?: number | null;
  trialSessionRequired?: boolean;
  trialRequired?: boolean;
  ruleChecks?: RuleCheck[];
  subscores?: MatchSubscores;
  rematchTriggers?: string[];
  healthReviewCadence?: string;
}

export interface AgentSource {
  id: string;
  title: string | null;
  source: string | null;
  score: number | null;
}

export interface AgentUiResponse {
  text?: string;
  responseLanguage?: "en" | "ar";
  questionPlan?: QuestionPlan;
  rankedMatches?: RankedMatch[];
  matchEvaluation?: MatchEvaluation;
  sources?: AgentSource[];
  followUpQuestions?: string[];
}

/* ─── Static Data ────────────────────────────────────────────────────── */

export const MENTOR_PHOTOS: Record<string, string> = {
  mentor_001: "/mentors/maya.jpg",
  mentor_002: "/mentors/omar.jpg",
  mentor_003: "/mentors/nour.jpg",
  mentor_004: "/mentors/lina.jpg",
  mentor_005: "/mentors/hassan.jpg",
  mentor_006: "/mentors/sara.jpg",
  mentor_007: "/mentors/karim.jpg",
  mentor_008: "/mentors/dalia.jpg",
  mentor_009: "/mentors/yara.jpg",
  mentor_010: "/mentors/tarek.jpg",
  mentor_011: "/mentors/maya.jpg",
  mentor_012: "/mentors/omar.jpg",
  mentor_013: "/mentors/nour.jpg",
  mentor_014: "/mentors/lina.jpg",
  mentor_015: "/mentors/hassan.jpg",
  mentor_016: "/mentors/sara.jpg",
  mentor_017: "/mentors/karim.jpg",
  mentor_018: "/mentors/dalia.jpg",
  mentor_019: "/mentors/yara.jpg",
  mentor_020: "/mentors/tarek.jpg",
  mentor_021: "/mentors/maya.jpg",
  mentor_022: "/mentors/omar.jpg",
  mentor_023: "/mentors/nour.jpg",
  mentor_024: "/mentors/lina.jpg",
  mentor_025: "/mentors/hassan.jpg",
  mentor_026: "/mentors/sara.jpg",
  mentor_027: "/mentors/karim.jpg",
  mentor_028: "/mentors/dalia.jpg",
  mentor_029: "/mentors/yara.jpg",
  mentor_030: "/mentors/tarek.jpg",
};

export const DOMAIN_LABELS: Record<string, string> = {
  "product management": "Product",
  "software engineering": "Engineering",
  "ux design": "Design",
  "growth marketing": "Marketing",
  "data analytics": "Data",
  "human resources": "HR",
  cybersecurity: "Cybersecurity",
  "sales enablement": "Sales",
  "finance and fp&a": "Finance",
  operations: "Operations",
};
