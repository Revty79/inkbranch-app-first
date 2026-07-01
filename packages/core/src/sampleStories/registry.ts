import type { Book, ScenePackage, SceneResult } from "@inkbranch/types";
import type { ResolveStoryChoiceInput, ResolvedStoryChoice, StoryPack } from "./types";
import { saltglassStoryPack } from "./saltglass";

export const storyPacks: StoryPack[] = [saltglassStoryPack];
export const sampleStoryBooks: Book[] = storyPacks.map((pack) => pack.book);

export function getStoryPack(bookId: string): StoryPack | undefined {
  return storyPacks.find((pack) => pack.book.id === bookId || pack.id === bookId);
}

export function renderSceneFromStoryPack(input: ScenePackage): SceneResult | undefined {
  return getStoryPack(input.book.id)?.renderScene(input);
}

export function resolveChoiceFromStoryPack(input: ResolveStoryChoiceInput): ResolvedStoryChoice | undefined {
  return getStoryPack(input.run.bookId)?.resolveChoice(input);
}
