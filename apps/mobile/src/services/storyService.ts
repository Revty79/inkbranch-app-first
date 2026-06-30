import type { ReaderRun, SceneResult } from "@inkbranch/types";
import { inkbranchApi } from "./inkbranchApi";
import type { RunResponse, StorySummary } from "./inkbranchApi";
import { localStoryService } from "./localStoryService";

export const storyService = {
  async getStories(): Promise<StorySummary[]> {
    try {
      return await inkbranchApi.getStories();
    } catch {
      return localStoryService.getStories();
    }
  },

  async startRun(bookId: string): Promise<RunResponse> {
    try {
      return await inkbranchApi.startRun(bookId);
    } catch {
      return localStoryService.startRun(bookId);
    }
  },

  async choose(run: ReaderRun, scene: SceneResult, choiceId: string): Promise<RunResponse> {
    try {
      return await inkbranchApi.choose(run.id, choiceId);
    } catch {
      return localStoryService.choose(run, scene, choiceId);
    }
  }
};
