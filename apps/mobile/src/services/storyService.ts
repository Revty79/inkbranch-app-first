import type { ReaderRun, SceneResult } from "@inkbranch/types";
import { InkbranchApiError, INKBRANCH_API_URL, inkbranchApi } from "./inkbranchApi";
import type { ChoiceInput, RunResponse, StorySummary } from "./inkbranchApi";
import { localStoryService } from "./localStoryService";

export type StoryEngineMode = "unknown" | "backend" | "fallback";

export interface BackendFailureWarning {
  apiUrl: string;
  route: string;
  usingFallback: boolean;
  message: string;
}

export interface StoryServiceResult<T> {
  data: T;
  mode: StoryEngineMode;
  warning?: BackendFailureWarning;
}

function warningFromError(error: unknown, route: string): BackendFailureWarning {
  if (error instanceof InkbranchApiError) {
    return {
      apiUrl: error.apiUrl,
      route: error.route,
      usingFallback: true,
      message: error.message
    };
  }

  return {
    apiUrl: INKBRANCH_API_URL,
    route,
    usingFallback: true,
    message: error instanceof Error ? error.message : "Unknown backend request failure."
  };
}

export const storyService = {
  async getStories(): Promise<StoryServiceResult<StorySummary[]>> {
    try {
      return {
        data: await inkbranchApi.getStories(),
        mode: "backend"
      };
    } catch (error) {
      return {
        data: await localStoryService.getStories(),
        mode: "fallback",
        warning: warningFromError(error, "/stories")
      };
    }
  },

  async startRun(bookId: string): Promise<StoryServiceResult<RunResponse>> {
    try {
      return {
        data: await inkbranchApi.startRun(bookId),
        mode: "backend"
      };
    } catch (error) {
      return {
        data: await localStoryService.startRun(bookId),
        mode: "fallback",
        warning: warningFromError(error, "/runs/start")
      };
    }
  },

  async choose(run: ReaderRun, scene: SceneResult, input: ChoiceInput): Promise<StoryServiceResult<RunResponse>> {
    const route = `/runs/${run.id}/choose`;

    try {
      return {
        data: await inkbranchApi.choose(run.id, input),
        mode: "backend"
      };
    } catch (error) {
      return {
        data: await localStoryService.choose(run, scene, input),
        mode: "fallback",
        warning: warningFromError(error, route)
      };
    }
  }
};
