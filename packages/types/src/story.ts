import type { EndingConstraint, RequiredEvent, StoryBible, World } from "./canon";

export type BookStatus = "draft" | "playable" | "archived";

export interface StorySpine {
  openingSceneId: string;
  requiredEvents: RequiredEvent[];
  endingConstraints: EndingConstraint[];
  maxChapters?: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  logline: string;
  genre: string[];
  status: BookStatus;
  world: World;
  storyBible: StoryBible;
  spine: StorySpine;
}
