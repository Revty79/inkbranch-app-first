import type { ReaderRun, SceneResult } from "@inkbranch/types";

export const INKBRANCH_API_URL = process.env.EXPO_PUBLIC_INKBRANCH_API_URL ?? "http://localhost:4000";

export class InkbranchApiError extends Error {
  constructor(
    readonly apiUrl: string,
    readonly route: string,
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "InkbranchApiError";
  }
}

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
  let response: Response;

  try {
    response = await fetch(`${INKBRANCH_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network request failed.";
    throw new InkbranchApiError(INKBRANCH_API_URL, path, message);
  }

  if (!response.ok) {
    let body = "";

    try {
      body = await response.text();
    } catch {
      body = "";
    }

    throw new InkbranchApiError(
      INKBRANCH_API_URL,
      path,
      `Inkbranch API request failed with ${response.status}${body ? `: ${body}` : ""}`,
      response.status
    );
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
