import type { Book, Choice, ReaderRun, ScenePackage } from "@inkbranch/types";
import { createNextScenePackage } from "@inkbranch/core";

export interface PlanSceneInput {
  book: Book;
  run: ReaderRun;
  previousChoice?: Choice;
}

export function planNextScene(input: PlanSceneInput): ScenePackage {
  return createNextScenePackage(input);
}
