import {
  Mentor as LibMentor,
  RankedMatch as LibRankedMatch,
  AgentUiResponse as LibAgentUiResponse,
  QuestionSpec as LibQuestion,
} from "../../lib/types";

export type Mentor = LibMentor;
export type Question = LibQuestion;
export type AgentUiResponse = LibAgentUiResponse;
export type RankedMatch = LibRankedMatch;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string | AgentUiResponse;
};
