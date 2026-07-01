import type {
  Book,
  CanonCommit,
  Choice,
  MemoryUpdate,
  ReaderRun,
  ScenePackage,
  SceneResult,
  StoryRunState
} from "@inkbranch/types";
import type { ResolvedStoryChoice, StoryChoiceEffect } from "../sampleStories/types";
import { getStoryPack, resolveChoiceFromStoryPack } from "../sampleStories/registry";

export interface CreateReaderRunOptions {
  runId?: string;
  now?: string;
}

export interface CreateScenePackageInput {
  book: Book;
  run: ReaderRun;
  previousChoice?: Choice;
}

export interface CommitChoiceInput {
  run: ReaderRun;
  resolvedChoice: ResolvedStoryChoice;
  sceneResult: SceneResult;
  now?: string;
}

export interface ChoiceResolutionInput {
  choiceId?: string;
  customChoiceText?: string;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(now?: string): string {
  return now ?? new Date().toISOString();
}

function createFallbackStoryState(book: Book): StoryRunState {
  return {
    currentBeatId: book.spine.openingSceneId,
    currentLocationId: book.world.locations[0]?.id ?? "unknown",
    flags: {},
    relationships: {},
    dangerLevel: 1,
    discoveries: [],
    turnCount: 0
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function applyEffectToStoryState(
  run: ReaderRun,
  resolvedChoice: ResolvedStoryChoice,
  effect: StoryChoiceEffect
): StoryRunState {
  const previousState = run.storyState;
  const relationships = { ...previousState.relationships };

  Object.entries(effect.relationshipDeltas ?? {}).forEach(([characterId, delta]) => {
    relationships[characterId] = clamp((relationships[characterId] ?? 0) + delta, -3, 3);
  });

  return {
    ...previousState,
    currentBeatId: resolvedChoice.nextBeatId,
    currentLocationId: resolvedChoice.nextLocationId,
    flags: {
      ...previousState.flags,
      ...effect.setFlags
    },
    relationships,
    dangerLevel: clamp(previousState.dangerLevel + (effect.dangerDelta ?? 0), 0, 6),
    discoveries: unique([...previousState.discoveries, ...(effect.discoveries ?? [])]),
    turnCount: previousState.turnCount + 1,
    endingDirection: effect.endingDirection ?? previousState.endingDirection,
    completedEndingId: resolvedChoice.completedEndingId ?? previousState.completedEndingId,
    lastChoiceResolution: resolvedChoice.resolution
  };
}

export function createReaderRun(book: Book, options: CreateReaderRunOptions = {}): ReaderRun {
  const timestamp = nowIso(options.now);
  const storyPack = getStoryPack(book.id);

  return {
    id: options.runId ?? createId("run"),
    bookId: book.id,
    status: "active",
    currentChapter: 1,
    currentSceneId: book.spine.openingSceneId,
    storyState: storyPack?.createInitialState() ?? createFallbackStoryState(book),
    selectedChoiceIds: [],
    canonCommits: [],
    memory: [],
    startedAt: timestamp,
    updatedAt: timestamp
  };
}

export function createNextScenePackage(input: CreateScenePackageInput): ScenePackage {
  const readerCanon = input.run.canonCommits.flatMap((commit) => commit.canonFacts);
  const unsatisfiedRequiredEvents = input.book.storyBible.requiredEvents.filter((event) => {
    if (!event.satisfiedByCanonFact) {
      return true;
    }

    return !readerCanon.includes(event.satisfiedByCanonFact);
  });

  return {
    id: `scene-package-${input.run.id}-${input.run.selectedChoiceIds.length + 1}`,
    book: input.book,
    run: input.run,
    chapterNumber: input.run.currentChapter,
    sceneNumber: input.run.selectedChoiceIds.length + 1,
    viewpoint: input.book.storyBible.viewpoints[0],
    canonRules: input.book.storyBible.canonRules,
    requiredEvents: unsatisfiedRequiredEvents,
    readerCanon,
    previousChoice: input.previousChoice,
    constraints: {
      choiceCount: 3,
      maxWords: 750,
      mustInclude: unsatisfiedRequiredEvents.slice(0, 1).map((event) => event.description),
      mustAvoid: input.book.storyBible.bannedOutcomes
    }
  };
}

export function commitChoiceToRun(input: CommitChoiceInput): ReaderRun {
  const timestamp = nowIso(input.now);
  const nextChoiceCount = input.run.selectedChoiceIds.length + 1;
  const effect = input.resolvedChoice.effects;
  const nextStoryState = applyEffectToStoryState(input.run, input.resolvedChoice, effect);
  const canonFacts = unique([
    ...input.sceneResult.stateChanges.canonFacts,
    ...(effect.canonFacts ?? []),
    `Reader chose: ${input.resolvedChoice.intent}`
  ]);
  const memoryUpdate: MemoryUpdate = {
    id: createId("memory"),
    summary: [input.sceneResult.memoryUpdate, effect.memory].filter(Boolean).join(" "),
    characterUpdates: [...input.sceneResult.stateChanges.characterUpdates, ...(effect.characterUpdates ?? [])],
    locationUpdates: [...input.sceneResult.stateChanges.locationUpdates, ...(effect.locationUpdates ?? [])],
    canonFacts,
    warnings: [
      ...input.sceneResult.stateChanges.warnings,
      ...(effect.warnings ?? []),
      ...input.resolvedChoice.resolution.notes
    ],
    createdAt: timestamp
  };
  const canonCommit: CanonCommit = {
    id: createId("commit"),
    runId: input.run.id,
    choiceId: input.resolvedChoice.choiceId,
    summary: input.resolvedChoice.intent,
    canonFacts,
    memoryUpdates: [memoryUpdate],
    committedAt: timestamp
  };

  return {
    ...input.run,
    status: input.resolvedChoice.completedEndingId ? "completed" : input.run.status,
    currentChapter: Math.min(Math.floor(nextChoiceCount / 3) + 1, 5),
    currentSceneId: input.resolvedChoice.nextBeatId,
    storyState: nextStoryState,
    selectedChoiceIds: [...input.run.selectedChoiceIds, input.resolvedChoice.choiceId],
    canonCommits: [...input.run.canonCommits, canonCommit],
    memory: [...input.run.memory, memoryUpdate],
    updatedAt: timestamp
  };
}

export function selectChoice(sceneResult: SceneResult, choiceId: string): Choice | undefined {
  return sceneResult.choices.find((choice) => choice.id === choiceId);
}

export function createCustomChoice(run: ReaderRun, customChoiceText: string): Choice | undefined {
  const normalizedText = customChoiceText.replace(/\s+/g, " ").trim();

  if (!normalizedText) {
    return undefined;
  }

  const label = normalizedText.length > 72 ? `${normalizedText.slice(0, 69)}...` : normalizedText;

  return {
    id: `custom-${run.id}-${run.selectedChoiceIds.length + 1}`,
    label,
    intent: normalizedText,
    risk: "medium"
  };
}

export function resolveChoice(
  sceneResult: SceneResult,
  run: ReaderRun,
  input: ChoiceResolutionInput
): ResolvedStoryChoice | undefined {
  const storyPackChoice = resolveChoiceFromStoryPack({
    run,
    scene: sceneResult,
    choiceId: input.choiceId,
    customChoiceText: input.customChoiceText
  });

  if (storyPackChoice) {
    return storyPackChoice;
  }

  if (input.choiceId) {
    const choice = selectChoice(sceneResult, input.choiceId);

    if (!choice) {
      return undefined;
    }

    return {
      choiceId: choice.id,
      label: choice.label,
      intent: choice.intent,
      intentKey: "investigation",
      risk: choice.risk,
      nextBeatId: `scene-${run.selectedChoiceIds.length + 2}`,
      nextLocationId: run.storyState.currentLocationId,
      effects: {
        canonFacts: [`Reader chose: ${choice.intent}`],
        memory: choice.intent
      },
      resolution: {
        type: "preset",
        interpretedIntent: choice.intent,
        canonValidity: "valid",
        notes: ["Fallback preset choice resolution."]
      }
    };
  }

  if (input.customChoiceText) {
    const choice = createCustomChoice(run, input.customChoiceText);

    if (!choice) {
      return undefined;
    }

    return {
      choiceId: choice.id,
      label: choice.label,
      intent: choice.intent,
      intentKey: "investigation",
      risk: choice.risk,
      nextBeatId: `scene-${run.selectedChoiceIds.length + 2}`,
      nextLocationId: run.storyState.currentLocationId,
      effects: {
        canonFacts: [`Reader wrote: ${choice.intent}`],
        memory: choice.intent
      },
      resolution: {
        type: "custom",
        originalText: choice.intent,
        interpretedIntent: "custom",
        canonValidity: "valid",
        notes: ["Fallback custom choice resolution."]
      }
    };
  }

  return undefined;
}
