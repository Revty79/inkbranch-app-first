export type CanonRuleSeverity = "law" | "guideline" | "soft";

export interface CanonRule {
  id: string;
  statement: string;
  severity: CanonRuleSeverity;
  source?: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  traits: string[];
  goals: string[];
  secrets?: string[];
  relationships?: Record<string, string>;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  canonFacts: string[];
}

export interface Viewpoint {
  id: string;
  characterId: string;
  person: "first" | "second" | "third";
  tense: "past" | "present";
  voiceNotes: string[];
}

export interface RequiredEvent {
  id: string;
  title: string;
  description: string;
  chapterHint?: number;
  satisfiedByCanonFact?: string;
}

export interface EndingConstraint {
  id: string;
  description: string;
  requiredCanonFacts: string[];
  forbiddenCanonFacts: string[];
}

export interface World {
  id: string;
  name: string;
  premise: string;
  tone: string[];
  canonRules: CanonRule[];
  characters: Character[];
  locations: Location[];
}

export interface StoryBible {
  id: string;
  worldId: string;
  canonRules: CanonRule[];
  characters: Character[];
  locations: Location[];
  viewpoints: Viewpoint[];
  requiredEvents: RequiredEvent[];
  endingConstraints: EndingConstraint[];
  bannedOutcomes: string[];
}

export interface MemoryUpdate {
  id: string;
  summary: string;
  characterUpdates: string[];
  locationUpdates: string[];
  canonFacts: string[];
  warnings: string[];
  createdAt: string;
}

export interface CanonCommit {
  id: string;
  runId: string;
  choiceId: string;
  summary: string;
  canonFacts: string[];
  memoryUpdates: MemoryUpdate[];
  committedAt: string;
}
