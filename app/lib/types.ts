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

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  role: MessageRole;
  content: string | AgentUiResponse;
}

export interface QuestionPlan {
  title: string;
  questions: Array<{
    id: string;
    type: 'free_text' | 'single_select' | 'multi_select' | 'number' | 'range' | 'boolean' | 'date_range';
    label: string;
    options?: string[];
    unit?: string;
    min?: number;
    max?: number;
  }>;
}

export interface RankedMatch {
  mentorId: string;
  name: string;
  band: 'excellent' | 'recommended' | 'pre_alignment' | 'rejected';
  score: number;
  summary: string;
  subscores: {
    domain: number;
    goal: number;
    availability: number;
    communication: number;
    fit: number;
  };
  ruleChecks: Array<{
    rule: string;
    passed: boolean;
    severity: 'blocker' | 'warning' | 'info';
  }>;
}

export interface MatchEvaluation {
  band: string;
  nextAction: string;
  trialRequired: boolean;
  rematchTriggers?: string[];
  healthReviewCadence?: string;
}

export interface AgentUiResponse {
  text?: string;
  questionPlan?: QuestionPlan;
  rankedMatches?: RankedMatch[];
  matchEvaluation?: MatchEvaluation;
  followUpQuestions?: string[];
  sources?: Array<{
    name: string;
    score: number;
  }>;
}

// Photo mapping for mentor data
export const MENTOR_PHOTOS: Record<string, string> = {
  mentor_001: '/mentors/maya.jpg',
  mentor_002: '/mentors/omar.jpg',
  mentor_003: '/mentors/nour.jpg',
  mentor_004: '/mentors/lina.jpg',
  mentor_005: '/mentors/hassan.jpg',
  mentor_006: '/mentors/sara.jpg',
  mentor_007: '/mentors/karim.jpg',
  mentor_008: '/mentors/dalia.jpg',
  mentor_009: '/mentors/yara.jpg',
  mentor_010: '/mentors/tarek.jpg',
};

export const DOMAIN_LABELS: Record<string, string> = {
  'product management': 'Product',
  'software engineering': 'Engineering',
  'ux design': 'Design',
  'growth marketing': 'Marketing',
  'data analytics': 'Data',
  'human resources': 'HR',
  'cybersecurity': 'Cybersecurity',
  'sales enablement': 'Sales',
  'finance and fp&a': 'Finance',
  'operations': 'Operations',
};
