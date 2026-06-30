import type { AIProvider, Choice, ScenePackage, SceneResult } from "@inkbranch/types";

const choiceBlueprints: Array<Omit<Choice, "id">> = [
  {
    label: "Inspect the seal",
    intent: "Study the black-sealed letter before moving deeper into the harbor.",
    risk: "low"
  },
  {
    label: "Trust the archivist",
    intent: "Let Orrin guide the next move through official records.",
    risk: "medium"
  },
  {
    label: "Take the lantern path",
    intent: "Avoid the main quay and follow the lighthouse service walk.",
    risk: "high"
  }
];

function buildChoiceId(input: ScenePackage, index: number): string {
  return `${input.id}-choice-${index + 1}`;
}

function summarizePreviousChoice(input: ScenePackage): string {
  if (!input.previousChoice) {
    return "Mara has not committed to a path yet, and the harbor still feels like it is waiting for her first mistake.";
  }

  return `Mara is still carrying the consequence of choosing to ${input.previousChoice.intent.toLowerCase()}`;
}

export class FakeAIProvider implements AIProvider {
  readonly id = "fake-local";
  readonly displayName = "Fake Local Scene Provider";

  async generateScene(input: ScenePackage): Promise<SceneResult> {
    const requiredEvent = input.requiredEvents[0];
    const requiredLine = requiredEvent
      ? `The scene bends toward canon: ${requiredEvent.description}`
      : "The scene keeps pressure on the established canon without adding a new spine event.";
    const canonLine = input.readerCanon.length
      ? `Reader canon already holds: ${input.readerCanon.slice(-2).join(" ")}`
      : "No reader-specific canon has been committed yet.";
    const choices = choiceBlueprints.map((choice, index) => ({
      ...choice,
      id: buildChoiceId(input, index)
    }));

    return {
      chapterTitle: `Chapter ${input.chapterNumber}: A Bell Below the Tide`,
      sceneText: [
        `${summarizePreviousChoice(input)} Saltglass Harbor narrows around the old stair, all wet stone, lamp smoke, and windows shut against the evening bells.`,
        `${requiredLine} Orrin watches the letter in Mara's hand as if the wax could speak first.`,
        `${canonLine} The next choice can change Mara's route, but it cannot change what the letter is or why the city fears it.`
      ].join("\n\n"),
      choices,
      stateChanges: {
        characterUpdates: [`Mara notices that Orrin recognizes the pressure around the seal in scene ${input.sceneNumber}.`],
        locationUpdates: ["Saltglass Harbor is established as watched, narrow, and shaped by lighthouse law."],
        canonFacts: [
          input.sceneNumber === 1 ? "Someone recognized the black seal." : `Mara chose a route through scene ${input.sceneNumber}.`
        ],
        warnings: []
      },
      memoryUpdate: `Scene ${input.sceneNumber} established pressure around the letter and prepared the next reader choice.`
    };
  }
}
