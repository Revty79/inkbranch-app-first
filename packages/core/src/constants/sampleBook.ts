import type { Book, CanonRule, Character, Location, RequiredEvent, StoryBible, Viewpoint, World } from "@inkbranch/types";

const canonRules: CanonRule[] = [
  {
    id: "rule-author-canon",
    statement: "Author-written facts cannot be contradicted by generated scenes.",
    severity: "law"
  },
  {
    id: "rule-no-free-ai-plot",
    statement: "Generated scenes may vary the path, but not invent a new central plot.",
    severity: "law"
  },
  {
    id: "rule-choice-consequence",
    statement: "Every reader choice should leave a clear canon trace in the run.",
    severity: "guideline"
  }
];

const characters: Character[] = [
  {
    id: "char-mara-vale",
    name: "Mara Vale",
    role: "Reluctant courier of sealed letters",
    traits: ["observant", "guarded", "loyal under pressure"],
    goals: ["deliver the black-sealed letter", "learn why her family name was erased"]
  },
  {
    id: "char-orrin-tyde",
    name: "Orrin Tyde",
    role: "Harbor archivist",
    traits: ["careful", "dry-witted", "afraid of open water"],
    goals: ["protect the tide ledger", "keep Mara alive long enough to read it"]
  },
  {
    id: "char-the-tallow-prince",
    name: "The Tallow Prince",
    role: "Rumored heir behind the lighthouse fires",
    traits: ["patient", "ritualistic", "never seen directly"],
    goals: ["recover the letter before dawn"]
  }
];

const locations: Location[] = [
  {
    id: "loc-saltglass-harbor",
    name: "Saltglass Harbor",
    description: "A cliffside port where lighthouse mirrors are treated like public scripture.",
    canonFacts: ["The harbor bells ring only when a lighthouse mirror breaks."]
  },
  {
    id: "loc-archive-under-pier",
    name: "The Archive Under Pier Nine",
    description: "A dry chamber beneath the tide line, packed with ledgers wrapped in waxed linen.",
    canonFacts: ["Only archivists know the third stair is hollow."]
  }
];

const viewpoints: Viewpoint[] = [
  {
    id: "vp-mara-third-present",
    characterId: "char-mara-vale",
    person: "third",
    tense: "present",
    voiceNotes: ["close, sensory, restrained", "lets implication carry danger"]
  }
];

const requiredEvents: RequiredEvent[] = [
  {
    id: "event-letter-seen",
    title: "The black seal is noticed",
    description: "Mara must realize someone recognizes the seal on her letter.",
    chapterHint: 1,
    satisfiedByCanonFact: "Someone recognized the black seal."
  },
  {
    id: "event-ledger-choice",
    title: "The tide ledger is opened",
    description: "A reader choice must determine whether Mara trusts Orrin with the ledger.",
    chapterHint: 2,
    satisfiedByCanonFact: "The tide ledger was opened."
  }
];

const world: World = {
  id: "world-saltglass",
  name: "Saltglass",
  premise: "A harbor city hides political succession in lighthouse records and courier seals.",
  tone: ["warm gothic", "literary suspense", "intimate stakes"],
  canonRules,
  characters,
  locations
};

const storyBible: StoryBible = {
  id: "bible-saltglass-letter",
  worldId: world.id,
  canonRules,
  characters,
  locations,
  viewpoints,
  requiredEvents,
  endingConstraints: [
    {
      id: "ending-no-random-heir",
      description: "The heir question must resolve through the letter, ledger, and reader canon.",
      requiredCanonFacts: ["The black-sealed letter mattered to the succession."],
      forbiddenCanonFacts: ["A stranger solved the succession without Mara."]
    }
  ],
  bannedOutcomes: [
    "Mara abandons the letter without consequence.",
    "The Tallow Prince explains the entire plot directly."
  ]
};

export const sampleBook: Book = {
  id: "book-saltglass-letter",
  title: "The Saltglass Letter",
  author: "Inkbranch Sample Library",
  logline: "A courier crosses a lighthouse city with a sealed letter that can rewrite the harbor's rulers.",
  genre: ["interactive fiction", "literary fantasy", "mystery"],
  status: "playable",
  world,
  storyBible,
  spine: {
    openingSceneId: "scene-saltglass-opening",
    requiredEvents,
    endingConstraints: storyBible.endingConstraints,
    maxChapters: 6
  }
};

export const sampleBooks: Book[] = [sampleBook];
