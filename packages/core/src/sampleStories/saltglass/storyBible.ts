import type { Book, RequiredEvent, StoryBible, Viewpoint, World } from "@inkbranch/types";
import { saltglassCanonRules } from "./canonRules";
import { saltglassCharacters } from "./characters";
import { saltglassLocations } from "./locations";

export const saltglassRequiredEvents: RequiredEvent[] = [
  {
    id: "event-black-seal-recognized",
    title: "The black seal is recognized",
    description: "Someone in Saltglass must recognize the seal before Mara understands its danger.",
    chapterHint: 1,
    satisfiedByCanonFact: "The black seal was recognized in Saltglass Harbor."
  },
  {
    id: "event-drowned-scribe",
    title: "The drowned scribe is named",
    description: "Mara must learn that the letter came from a scribe recorded as drowned.",
    chapterHint: 2,
    satisfiedByCanonFact: "Mara learned about the drowned scribe."
  },
  {
    id: "event-council-secret",
    title: "The council secret surfaces",
    description: "The hidden succession change must become visible before any ending.",
    chapterHint: 4,
    satisfiedByCanonFact: "The council secret was exposed."
  }
];

export const saltglassViewpoints: Viewpoint[] = [
  {
    id: "vp-mara-third-present",
    characterId: "char-mara-vell",
    person: "third",
    tense: "present",
    voiceNotes: ["close to Mara's sensory read", "old-library warmth", "danger carried by implication"]
  }
];

export const saltglassWorld: World = {
  id: "world-saltglass",
  name: "Saltglass",
  premise: "A harbor city hides political succession inside lighthouse law, tide ledgers, and courier seals.",
  tone: ["warm gothic", "literary suspense", "civic mystery"],
  canonRules: saltglassCanonRules,
  characters: saltglassCharacters,
  locations: saltglassLocations
};

export const saltglassStoryBible: StoryBible = {
  id: "bible-saltglass-letter",
  worldId: saltglassWorld.id,
  canonRules: saltglassCanonRules,
  characters: saltglassCharacters,
  locations: saltglassLocations,
  viewpoints: saltglassViewpoints,
  requiredEvents: saltglassRequiredEvents,
  endingConstraints: [
    {
      id: "ending-letter-matters",
      description: "Every ending must resolve through the black-sealed letter and its ledger proof.",
      requiredCanonFacts: ["The black-sealed letter mattered to the succession."],
      forbiddenCanonFacts: ["The letter became irrelevant before the ending."]
    },
    {
      id: "ending-mara-acts",
      description: "Mara's choices must determine the ending direction.",
      requiredCanonFacts: ["Mara chose how the letter entered Saltglass canon."],
      forbiddenCanonFacts: ["A stranger solved the succession without Mara."]
    }
  ],
  bannedOutcomes: [
    "The black-sealed letter is destroyed before the ending.",
    "Mara leaves Saltglass permanently before the story resolves.",
    "The Tallow Prince explains the whole mystery in a monologue."
  ]
};

export const saltglassBook: Book = {
  id: "book-saltglass-letter",
  title: "The Saltglass Letter",
  author: "Inkbranch Sample Library",
  logline: "A courier crosses a lighthouse city with a sealed letter that can rewrite the harbor's rulers.",
  genre: ["interactive fiction", "literary fantasy", "mystery"],
  status: "playable",
  world: saltglassWorld,
  storyBible: saltglassStoryBible,
  spine: {
    openingSceneId: "beat-harbor-stair",
    requiredEvents: saltglassRequiredEvents,
    endingConstraints: saltglassStoryBible.endingConstraints,
    maxChapters: 5
  }
};
