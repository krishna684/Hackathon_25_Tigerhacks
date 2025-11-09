
export type AgentName = 'Agent₁' | 'Agent₂' | 'Agent₃' | 'Agent₄';
export type AgentRole = 'Interpreter' | 'Refiner' | 'Extractor & Tool User' | 'Aggregator';
export type AgentStatus = 'idle' | 'thinking' | 'refining' | 'calling_tools' | 'done' | 'error';

export interface AgentState {
  name: AgentName;
  role: AgentRole;
  status: AgentStatus;
  output: string | null;
  details?: string;
}

export interface StructuredData {
  text: string;
  image: string;
  news: string;
  paper: string;
  video: string;
}

export interface FinalResponse {
  text: string;
  imageUrl: string;
  news: { title: string; url: string }[];
  papers: { title: string; url: string }[];
  videos: { title: string; url: string }[];
}
