import type { Book, CanonCommit, Choice, MemoryUpdate, ReaderRun, ScenePackage, SceneResult } from "@inkbranch/types";

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
  choice: Choice;
  sceneResult: SceneResult;
  now?: string;
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(now?: string): string {
  return now ?? new Date().toISOString();
}

export function createReaderRun(book: Book, options: CreateReaderRunOptions = {}): ReaderRun {
  const timestamp = nowIso(options.now);

  return {
    id: options.runId ?? createId("run"),
    bookId: book.id,
    status: "active",
    currentChapter: 1,
    currentSceneId: book.spine.openingSceneId,
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
  const canonFacts = [...input.sceneResult.stateChanges.canonFacts, `Reader chose: ${input.choice.intent}`];
  const memoryUpdate: MemoryUpdate = {
    id: createId("memory"),
    summary: input.sceneResult.memoryUpdate,
    characterUpdates: input.sceneResult.stateChanges.characterUpdates,
    locationUpdates: input.sceneResult.stateChanges.locationUpdates,
    canonFacts,
    warnings: input.sceneResult.stateChanges.warnings,
    createdAt: timestamp
  };
  const canonCommit: CanonCommit = {
    id: createId("commit"),
    runId: input.run.id,
    choiceId: input.choice.id,
    summary: input.choice.intent,
    canonFacts,
    memoryUpdates: [memoryUpdate],
    committedAt: timestamp
  };

  return {
    ...input.run,
    currentChapter: Math.floor(nextChoiceCount / 3) + 1,
    currentSceneId: `scene-${nextChoiceCount + 1}`,
    selectedChoiceIds: [...input.run.selectedChoiceIds, input.choice.id],
    canonCommits: [...input.run.canonCommits, canonCommit],
    memory: [...input.run.memory, memoryUpdate],
    updatedAt: timestamp
  };
}

export function selectChoice(sceneResult: SceneResult, choiceId: string): Choice | undefined {
  return sceneResult.choices.find((choice) => choice.id === choiceId);
}
