import type { ReaderRun, SceneResult } from "@inkbranch/types";

const API_URL = process.env.EXPO_PUBLIC_INKBRANCH_API_URL ?? "http://localhost:4000";

export interface StorySummary {
  id: string;
  title: string;
  author: string;
  logline: string;
  genre: string[];
}

export interface RunResponse {
  run: ReaderRun;
  scene: SceneResult;
}

export interface ChoiceInput {
  choiceId?: string;
  customChoiceText?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Inkbranch API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const inkbranchApi = {
  async getStories(): Promise<StorySummary[]> {
    const result = await request<{ stories: StorySummary[] }>("/stories");
    return result.stories;
  },

  startRun(bookId: string): Promise<RunResponse> {
    return request<RunResponse>("/runs/start", {
      method: "POST",
      body: JSON.stringify({ bookId })
    });
  },

  choose(runId: string, input: ChoiceInput): Promise<RunResponse> {
    return request<RunResponse>(`/runs/${runId}/choose`, {
      method: "POST",
      body: JSON.stringify(input)
    });
  }
};
