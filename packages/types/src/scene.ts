import type { CanonRule, RequiredEvent, Viewpoint } from "./canon";
import type { Choice } from "./choices";
import type { Book } from "./story";
import type { ReaderRun } from "./readerRun";

export interface SceneConstraints {
  choiceCount: number;
  maxWords: number;
  mustInclude: string[];
  mustAvoid: string[];
}

export interface ScenePackage {
  id: string;
  book: Book;
  run: ReaderRun;
  chapterNumber: number;
  sceneNumber: number;
  viewpoint: Viewpoint;
  canonRules: CanonRule[];
  requiredEvents: RequiredEvent[];
  readerCanon: string[];
  previousChoice?: Choice;
  constraints: SceneConstraints;
}

export interface SceneStateChanges {
  characterUpdates: string[];
  locationUpdates: string[];
  canonFacts: string[];
  warnings: string[];
}

export interface SceneResult {
  chapterTitle: string;
  sceneText: string;
  choices: Choice[];
  stateChanges: SceneStateChanges;
  memoryUpdate: string;
}
