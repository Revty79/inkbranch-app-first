import type { ReaderRun, SceneResult } from "@inkbranch/types";
import {
  commitChoiceToRun,
  createReaderRun,
  listStorySummaries,
  resolveChoice
} from "@inkbranch/core";
import { InMemoryStore } from "../db/inMemoryStore";
import { SceneGenerator } from "../generator/sceneGenerator";
import { planNextScene } from "../planner/scenePlanner";
import { assertValidSceneResult } from "../validators/sceneValidator";
import { RuntimeHttpError } from "./errors";

export interface RunResponse {
  run: ReaderRun;
  scene: SceneResult;
}

export interface ChooseInput {
  choiceId?: string;
  customChoiceText?: string;
}

export class StoryRuntimeService {
  constructor(
    private readonly store: InMemoryStore = new InMemoryStore(),
    private readonly generator: SceneGenerator = new SceneGenerator()
  ) {}

  listStories() {
    return listStorySummaries(this.store.listBooks());
  }

  async startRun(bookId?: string): Promise<RunResponse> {
    const book = bookId ? this.store.getBook(bookId) : this.store.listBooks()[0];

    if (!book) {
      throw new RuntimeHttpError("Story not found.", 404);
    }

    const run = createReaderRun(book);
    const scenePackage = planNextScene({ book, run });
    const scene = await this.generator.generate(scenePackage);
    assertValidSceneResult(scene);
    this.store.saveRun(run, scene);

    return { run, scene };
  }

  getRun(runId: string): RunResponse {
    const record = this.store.getRun(runId);

    if (!record) {
      throw new RuntimeHttpError("Run not found.", 404);
    }

    return {
      run: record.run,
      scene: record.scene
    };
  }

  async choose(runId: string, input: ChooseInput): Promise<RunResponse> {
    const record = this.store.getRun(runId);

    if (!record) {
      throw new RuntimeHttpError("Run not found.", 404);
    }

    const choice = resolveChoice(record.scene, record.run, input);

    if (!choice) {
      throw new RuntimeHttpError("Choice not found or custom choice was empty.", 400);
    }

    const book = this.store.getBook(record.bookId);

    if (!book) {
      throw new RuntimeHttpError("Story not found for run.", 404);
    }

    const nextRun = commitChoiceToRun({
      run: record.run,
      choice,
      sceneResult: record.scene
    });
    const scenePackage = planNextScene({
      book,
      run: nextRun,
      previousChoice: choice
    });
    const scene = await this.generator.generate(scenePackage);
    assertValidSceneResult(scene);
    this.store.saveRun(nextRun, scene);

    return {
      run: nextRun,
      scene
    };
  }
}
