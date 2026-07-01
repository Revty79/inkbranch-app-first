import type { Choice, ScenePackage, SceneResult, StoryRunState } from "@inkbranch/types";
import type { SceneBeat, StoryPack } from "../types";
import { saltglassCanonRules } from "./canonRules";
import { saltglassCharacters } from "./characters";
import { saltglassChoiceRules } from "./choiceRules";
import { saltglassConsequenceFlags, saltglassInitialFlags } from "./consequenceFlags";
import { saltglassEndings } from "./endings";
import { saltglassLocations } from "./locations";
import { resolveSaltglassChoice } from "./choiceResolver";
import { saltglassSceneBeats } from "./sceneBeats";
import {
  saltglassBook,
  saltglassRequiredEvents,
  saltglassStoryBible,
  saltglassViewpoints,
  saltglassWorld
} from "./storyBible";
import { saltglassStyleGuide } from "./styleGuide";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getBeat(beatId: string): SceneBeat {
  return saltglassSceneBeats.find((beat) => beat.id === beatId) ?? saltglassSceneBeats[0];
}

function getLocationName(locationId: string): string {
  return saltglassLocations.find((location) => location.id === locationId)?.name ?? "Saltglass";
}

function getActiveFlags(state: StoryRunState): string[] {
  return Object.entries(state.flags)
    .filter(([, enabled]) => enabled)
    .map(([flag]) => flag);
}

function relationshipSummary(state: StoryRunState, characterIds: string[]): string[] {
  return characterIds
    .filter((characterId) => characterId !== "char-mara-vell")
    .map((characterId) => {
      const character = saltglassCharacters.find((candidate) => candidate.id === characterId);
      const score = state.relationships[characterId] ?? 0;
      const stance = score >= 2 ? "ally" : score <= -2 ? "hostile" : score > 0 ? "warming" : score < 0 ? "strained" : "uncertain";

      return `${character?.name ?? characterId}: ${stance}`;
    });
}

function dangerLine(dangerLevel: number): string {
  if (dangerLevel >= 5) {
    return "Danger is severe: every mirror seems to know Mara's name.";
  }

  if (dangerLevel >= 3) {
    return "Danger is rising: the city is beginning to move around the letter.";
  }

  if (dangerLevel <= 0) {
    return "For one narrow moment, Mara has room to think.";
  }

  return "Danger stays close, but it has not yet become a net.";
}

function buildChoice(beat: SceneBeat, choice: SceneBeat["choices"][number]): Choice {
  return {
    id: `${beat.id}::${choice.id}`,
    label: choice.label,
    intent: choice.intent,
    risk: choice.risk,
    metadata: {
      beatId: beat.id,
      intentKey: choice.intentKey,
      nextBeatId: choice.nextBeatId
    }
  };
}

function buildEndingChoices(endingId: string): Choice[] {
  return [
    {
      id: `${endingId}::review-canon`,
      label: "Review the canon",
      intent: "Look back over the run's committed facts.",
      risk: "low"
    },
    {
      id: `${endingId}::start-over`,
      label: "Start another run",
      intent: "Return to the beginning with a clean run.",
      risk: "low"
    },
    {
      id: `${endingId}::close-book`,
      label: "Close the book",
      intent: "Let this ending stand.",
      risk: "low"
    }
  ];
}

function renderEnding(input: ScenePackage): SceneResult | undefined {
  const ending = saltglassEndings.find((candidate) => candidate.id === input.run.currentSceneId);

  if (!ending) {
    return undefined;
  }

  const state = input.run.storyState;
  const activeFlags = getActiveFlags(state);
  const sceneText = [
    ...ending.paragraphs,
    state.lastChoiceResolution
      ? `Last choice: ${state.lastChoiceResolution.interpretedIntent} (${state.lastChoiceResolution.canonValidity}).`
      : "",
    `Canon carried here: ${activeFlags.length ? activeFlags.join(", ") : "no major flags"}`
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    chapterTitle: `Ending: ${ending.title}`,
    sceneText,
    choices: buildEndingChoices(ending.id),
    stateChanges: {
      characterUpdates: ["Mara's run has reached an ending direction."],
      locationUpdates: [`The ending resolves at ${getLocationName(ending.locationId)}.`],
      canonFacts: ending.canonFacts,
      warnings: []
    },
    memoryUpdate: `Ending reached: ${ending.title}.`,
    storyProgress: {
      beatId: ending.id,
      locationId: ending.locationId,
      locationName: getLocationName(ending.locationId),
      dangerLevel: state.dangerLevel,
      turnCount: state.turnCount,
      activeFlags,
      discoveries: state.discoveries,
      relationshipSummary: relationshipSummary(state, ["char-orrin-tyde", "char-sister-elan", "char-captain-maudrin"]),
      canonValidity: state.lastChoiceResolution?.canonValidity
    }
  };
}

export function createSaltglassInitialState(): StoryRunState {
  return {
    currentBeatId: saltglassBook.spine.openingSceneId,
    currentLocationId: "loc-saltglass-harbor",
    flags: { ...saltglassInitialFlags },
    relationships: {
      "char-orrin-tyde": 0,
      "char-sister-elan": 0,
      "char-captain-maudrin": 0
    },
    dangerLevel: 1,
    discoveries: [],
    turnCount: 0
  };
}

export function renderSaltglassScene(input: ScenePackage): SceneResult {
  const ending = renderEnding(input);

  if (ending) {
    return ending;
  }

  const state = input.run.storyState;
  const beat = getBeat(state.currentBeatId || input.run.currentSceneId);
  const activeFlags = getActiveFlags(state);
  const variantParagraphs = beat.variants
    ?.filter((variant) => state.flags[variant.flag])
    .map((variant) => variant.text) ?? [];
  const lastChoiceLine = state.lastChoiceResolution
    ? `The last choice was interpreted as ${state.lastChoiceResolution.interpretedIntent}; canon marked it ${state.lastChoiceResolution.canonValidity}.`
    : "";
  const relationshipLines = relationshipSummary(state, beat.characterIds);
  const progressLine = beat.discovery
    ? `Progress: ${beat.discovery}`
    : `Progress: the route shifts toward ${getLocationName(beat.locationId)}.`;
  const threatLine = beat.threat ? `Threat: ${beat.threat}` : dangerLine(state.dangerLevel);
  const sceneText = [
    ...beat.paragraphs,
    ...variantParagraphs,
    progressLine,
    threatLine,
    dangerLine(state.dangerLevel),
    relationshipLines.length ? `Characters in motion: ${relationshipLines.join("; ")}.` : "",
    lastChoiceLine
  ]
    .filter(Boolean)
    .join("\n\n");

  return {
    chapterTitle: `Chapter ${beat.chapter}: ${beat.title}`,
    sceneText,
    choices: beat.choices.map((choice) => buildChoice(beat, choice)),
    stateChanges: {
      characterUpdates: relationshipLines.length ? relationshipLines : ["Mara's choices continue shaping the run."],
      locationUpdates: [`Current location: ${getLocationName(beat.locationId)}.`],
      canonFacts: beat.canonFacts,
      warnings: state.lastChoiceResolution?.canonValidity === "blocked" ? state.lastChoiceResolution.notes : []
    },
    memoryUpdate: `${beat.summary} ${progressLine}`,
    storyProgress: {
      beatId: beat.id,
      locationId: beat.locationId,
      locationName: getLocationName(beat.locationId),
      dangerLevel: clamp(state.dangerLevel, 0, 6),
      turnCount: state.turnCount,
      activeFlags,
      discoveries: state.discoveries,
      relationshipSummary: relationshipLines,
      canonValidity: state.lastChoiceResolution?.canonValidity
    }
  };
}

export const saltglassStoryPack: StoryPack = {
  id: "saltglass-letter",
  book: saltglassBook,
  world: saltglassWorld,
  storyBible: saltglassStoryBible,
  characters: saltglassCharacters,
  locations: saltglassLocations,
  canonRules: saltglassCanonRules,
  requiredEvents: saltglassRequiredEvents,
  viewpoints: saltglassViewpoints,
  endingConstraints: saltglassStoryBible.endingConstraints,
  sceneBeats: saltglassSceneBeats,
  consequenceFlags: saltglassConsequenceFlags,
  endings: saltglassEndings,
  styleGuide: saltglassStyleGuide,
  choiceRules: saltglassChoiceRules,
  createInitialState: createSaltglassInitialState,
  renderScene: renderSaltglassScene,
  resolveChoice: (input) =>
    resolveSaltglassChoice({
      run: input.run,
      choiceId: input.choiceId,
      customChoiceText: input.customChoiceText
    })
};

export {
  saltglassBook,
  saltglassCanonRules,
  saltglassCharacters,
  saltglassChoiceRules,
  saltglassConsequenceFlags,
  saltglassEndings,
  saltglassLocations,
  saltglassRequiredEvents,
  saltglassSceneBeats,
  saltglassStoryBible,
  saltglassStyleGuide,
  saltglassViewpoints,
  saltglassWorld
};
