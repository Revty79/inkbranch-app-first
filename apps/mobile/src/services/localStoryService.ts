import type { CanonCommit, Choice, MemoryUpdate, ReaderRun, SceneResult } from "@inkbranch/types";
import type { ChoiceInput, RunResponse, StorySummary } from "./inkbranchApi";

const localStory: StorySummary = {
  id: "book-saltglass-letter",
  title: "The Saltglass Letter",
  author: "Inkbranch Sample Library",
  logline: "A courier crosses a lighthouse city with a sealed letter that can rewrite the harbor's rulers.",
  genre: ["interactive fiction", "literary fantasy", "mystery"]
};

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function buildChoices(sceneNumber: number): Choice[] {
  return [
    {
      id: `local-scene-${sceneNumber}-choice-1`,
      label: "Inspect the seal",
      intent: "Study the black-sealed letter before moving deeper into the harbor.",
      risk: "low"
    },
    {
      id: `local-scene-${sceneNumber}-choice-2`,
      label: "Trust the archivist",
      intent: "Let Orrin guide the next move through official records.",
      risk: "medium"
    },
    {
      id: `local-scene-${sceneNumber}-choice-3`,
      label: "Take the lantern path",
      intent: "Avoid the main quay and follow the lighthouse service walk.",
      risk: "high"
    }
  ];
}

function buildScene(run: ReaderRun, previousChoice?: Choice): SceneResult {
  const sceneNumber = run.selectedChoiceIds.length + 1;
  const prior = previousChoice
    ? `Mara carries the consequence of choosing to ${previousChoice.intent.toLowerCase()}`
    : "Mara pauses at Saltglass Harbor with the black-sealed letter hidden beneath her coat.";

  return {
    chapterTitle: `Chapter ${run.currentChapter}: A Bell Below the Tide`,
    sceneText: [
      `${prior} The harbor lamps burn green against the wet stone, and every mirror in the lighthouse district points toward the pier.`,
      "Orrin Tyde notices the seal before he notices Mara's face. The moment is small, but it changes the air around the letter.",
      "The path can branch from here, but the letter remains the spine of the night."
    ].join("\n\n"),
    choices: buildChoices(sceneNumber),
    stateChanges: {
      characterUpdates: [`Mara reads the harbor's reaction in scene ${sceneNumber}.`],
      locationUpdates: ["Saltglass Harbor remains watched by lighthouse law."],
      canonFacts: [sceneNumber === 1 ? "Someone recognized the black seal." : `Mara continued through local scene ${sceneNumber}.`],
      warnings: []
    },
    memoryUpdate: `Local scene ${sceneNumber} preserved the letter, harbor pressure, and reader choice.`
  };
}

function createCustomChoice(run: ReaderRun, customChoiceText: string): Choice | undefined {
  const normalizedText = customChoiceText.replace(/\s+/g, " ").trim();

  if (!normalizedText) {
    return undefined;
  }

  return {
    id: `local-custom-${run.id}-${run.selectedChoiceIds.length + 1}`,
    label: normalizedText.length > 72 ? `${normalizedText.slice(0, 69)}...` : normalizedText,
    intent: normalizedText,
    risk: "medium"
  };
}

export const localStoryService = {
  async getStories(): Promise<StorySummary[]> {
    return [localStory];
  },

  async startRun(bookId: string): Promise<RunResponse> {
    const now = new Date().toISOString();
    const run: ReaderRun = {
      id: createId("local-run"),
      bookId,
      status: "active",
      currentChapter: 1,
      currentSceneId: "scene-saltglass-opening",
      selectedChoiceIds: [],
      canonCommits: [],
      memory: [],
      startedAt: now,
      updatedAt: now
    };

    return {
      run,
      scene: buildScene(run)
    };
  },

  async choose(run: ReaderRun, scene: SceneResult, input: ChoiceInput): Promise<RunResponse> {
    const choice = input.choiceId
      ? scene.choices.find((candidate) => candidate.id === input.choiceId)
      : input.customChoiceText
        ? createCustomChoice(run, input.customChoiceText)
        : undefined;

    if (!choice) {
      throw new Error("Choice not found.");
    }

    const now = new Date().toISOString();
    const nextChoiceCount = run.selectedChoiceIds.length + 1;
    const memoryUpdate: MemoryUpdate = {
      id: createId("local-memory"),
      summary: scene.memoryUpdate,
      characterUpdates: scene.stateChanges.characterUpdates,
      locationUpdates: scene.stateChanges.locationUpdates,
      canonFacts: scene.stateChanges.canonFacts,
      warnings: scene.stateChanges.warnings,
      createdAt: now
    };
    const canonCommit: CanonCommit = {
      id: createId("local-commit"),
      runId: run.id,
      choiceId: choice.id,
      summary: choice.intent,
      canonFacts: [...scene.stateChanges.canonFacts, `Reader chose: ${choice.intent}`],
      memoryUpdates: [memoryUpdate],
      committedAt: now
    };
    const nextRun: ReaderRun = {
      ...run,
      currentChapter: Math.floor(nextChoiceCount / 3) + 1,
      currentSceneId: `local-scene-${nextChoiceCount + 1}`,
      selectedChoiceIds: [...run.selectedChoiceIds, choice.id],
      canonCommits: [...run.canonCommits, canonCommit],
      memory: [...run.memory, memoryUpdate],
      updatedAt: now
    };

    return {
      run: nextRun,
      scene: buildScene(nextRun, choice)
    };
  }
};
