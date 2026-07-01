import type { CanonCommit, MemoryUpdate } from "./canon";
import type { ReaderChoiceResolution } from "./choices";

export type ReaderRunStatus = "active" | "completed" | "abandoned";

export interface StoryRunState {
  currentBeatId: string;
  currentLocationId: string;
  flags: Record<string, boolean>;
  relationships: Record<string, number>;
  dangerLevel: number;
  discoveries: string[];
  turnCount: number;
  endingDirection?: string;
  completedEndingId?: string;
  lastChoiceResolution?: ReaderChoiceResolution;
}

export interface ReaderRun {
  id: string;
  bookId: string;
  status: ReaderRunStatus;
  currentChapter: number;
  currentSceneId: string;
  storyState: StoryRunState;
  selectedChoiceIds: string[];
  canonCommits: CanonCommit[];
  memory: MemoryUpdate[];
  startedAt: string;
  updatedAt: string;
}
