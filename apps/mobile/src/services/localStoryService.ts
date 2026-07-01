import type { Choice, ReaderRun, SceneResult } from "@inkbranch/types";
import {
  assertValidSceneResult,
  commitChoiceToRun,
  createNextScenePackage,
  createReaderRun,
  findBookById,
  listStorySummaries,
  renderSceneFromStoryPack,
  resolveChoice,
  sampleBooks
} from "@inkbranch/core";
import type { ChoiceInput, RunResponse, StorySummary } from "./inkbranchApi";

function renderLocalScene(run: ReaderRun, previousChoice?: Choice): SceneResult {
  const book = findBookById(run.bookId, sampleBooks);

  if (!book) {
    throw new Error(`Local fallback story not found: ${run.bookId}`);
  }

  const scenePackage = createNextScenePackage({
    book,
    run,
    previousChoice
  });
  const scene = renderSceneFromStoryPack(scenePackage);

  if (!scene) {
    throw new Error(`Local fallback could not render scene: ${run.currentSceneId}`);
  }

  assertValidSceneResult(scene);
  return scene;
}

export const localStoryService = {
  async getStories(): Promise<StorySummary[]> {
    return listStorySummaries(sampleBooks);
  },

  async startRun(bookId: string): Promise<RunResponse> {
    const book = findBookById(bookId, sampleBooks);

    if (!book) {
      throw new Error(`Local fallback story not found: ${bookId}`);
    }

    const run = createReaderRun(book);

    return {
      run,
      scene: renderLocalScene(run)
    };
  },

  async choose(run: ReaderRun, scene: SceneResult, input: ChoiceInput): Promise<RunResponse> {
    if (run.status === "completed") {
      throw new Error("Run is already complete. Start a new run to continue.");
    }

    const resolvedChoice = resolveChoice(scene, run, input);

    if (!resolvedChoice) {
      throw new Error("Choice not found or custom choice was empty.");
    }

    const nextRun = commitChoiceToRun({
      run,
      resolvedChoice,
      sceneResult: scene
    });
    const nextScene = renderLocalScene(nextRun, {
      id: resolvedChoice.choiceId,
      label: resolvedChoice.label,
      intent: resolvedChoice.intent,
      risk: resolvedChoice.risk
    });

    return {
      run: nextRun,
      scene: nextScene
    };
  }
};
