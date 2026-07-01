import type { RunResponse } from "../apps/mobile/src/services/inkbranchApi";
import { localStoryService } from "../apps/mobile/src/services/localStoryService";
import { StoryRuntimeService } from "../server/src/runtime/StoryRuntimeService";

const expectedNextChoices = [
  "Question the bell seller",
  "Duck under the fish awning",
  "Follow the guard captain"
];

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function activeFlags(run: RunResponse["run"]): string[] {
  return Object.entries(run.storyState.flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag);
}

function assertOpeningScene(result: RunResponse, label: string) {
  assert(result.run.currentSceneId === "beat-harbor-stair", `${label}: expected run.currentSceneId beat-harbor-stair.`);
  assert(
    result.run.storyState.currentBeatId === "beat-harbor-stair",
    `${label}: expected storyState.currentBeatId beat-harbor-stair.`
  );
  assert(result.scene.storyProgress?.beatId === "beat-harbor-stair", `${label}: expected storyProgress beat-harbor-stair.`);
  assert(result.scene.choices[0]?.label === "Study the black seal", `${label}: expected opening choice Study the black seal.`);
}

function assertMirrorMarketScene(start: RunResponse, next: RunResponse, label: string) {
  assert(next.run.currentSceneId === "beat-mirror-market", `${label}: expected run.currentSceneId beat-mirror-market.`);
  assert(
    next.run.storyState.currentBeatId === "beat-mirror-market",
    `${label}: expected storyState.currentBeatId beat-mirror-market.`
  );
  assert(next.scene.chapterTitle === "Chapter 1: Mirror Market", `${label}: expected Mirror Market chapter title.`);
  assert(next.scene.sceneText !== start.scene.sceneText, `${label}: expected scene text to change.`);
  assert(next.scene.storyProgress?.beatId === "beat-mirror-market", `${label}: expected storyProgress beat-mirror-market.`);
  assert(next.scene.storyProgress?.locationName === "Saltglass Harbor", `${label}: expected Saltglass Harbor location.`);
  assert(activeFlags(next.run).includes("inspectedSeal"), `${label}: expected inspectedSeal flag.`);
  assert(next.run.canonCommits.length === 1, `${label}: expected one canon commit.`);
  assert(next.run.memory.length === 1, `${label}: expected one memory update.`);

  const labels = next.scene.choices.map((choice) => choice.label);
  assert(
    JSON.stringify(labels) === JSON.stringify(expectedNextChoices),
    `${label}: expected Mirror Market choices ${expectedNextChoices.join(", ")} but got ${labels.join(", ")}.`
  );
}

async function checkBackendRuntime() {
  const service = new StoryRuntimeService();
  const start = await service.startRun("book-saltglass-letter");
  assertOpeningScene(start, "backend");
  const next = await service.choose(start.run.id, { choiceId: start.scene.choices[0].id });
  assertMirrorMarketScene(start, next, "backend");
}

async function checkLocalFallbackRuntime() {
  const start = await localStoryService.startRun("book-saltglass-letter");
  assertOpeningScene(start, "local fallback");
  const next = await localStoryService.choose(start.run, start.scene, { choiceId: start.scene.choices[0].id });
  assertMirrorMarketScene(start, next, "local fallback");
}

async function main() {
  await checkBackendRuntime();
  await checkLocalFallbackRuntime();
  console.log("Saltglass progression check passed for backend runtime and local fallback.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
