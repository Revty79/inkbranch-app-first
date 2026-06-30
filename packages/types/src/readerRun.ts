import type { CanonCommit, MemoryUpdate } from "./canon";

export type ReaderRunStatus = "active" | "completed" | "abandoned";

export interface ReaderRun {
  id: string;
  bookId: string;
  status: ReaderRunStatus;
  currentChapter: number;
  currentSceneId: string;
  selectedChoiceIds: string[];
  canonCommits: CanonCommit[];
  memory: MemoryUpdate[];
  startedAt: string;
  updatedAt: string;
}
