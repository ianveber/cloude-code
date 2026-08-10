// Shared shapes for the Coach agent. Mirrors the athlos-chatbot profile JSON so
// existing profiles port across without a migration.

export type CoachProfileFacts = {
  sport: string;
  level: string;
  goal: string;
  seasonPhase: string;
  equipment: string[];
  daysPerWeek: number | null;
  sessionMinutes: number | null;
  injuries: string[];
};

export type CoachPlan = {
  date: string;
  phase?: string;
  summary?: string;
  markdown?: string;
};

export type CoachFeedback = {
  date: string;
  planDate?: string | null;
  rpe?: number | null;
  completed?: boolean | null;
  pain?: string[];
  notes?: string;
};

export type CoachProfile = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  profile: CoachProfileFacts;
  plans: CoachPlan[];
  feedback: CoachFeedback[];
  /** Free-text facts Coach has learned about this athlete. */
  memoryNotes: string[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/** What the funnel hands over when creating a new athlete. */
export type CoachFunnelInput = Partial<CoachProfileFacts> & { name?: string };
