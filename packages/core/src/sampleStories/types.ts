import type {
  Book,
  CanonRule,
  Character,
  ChoiceRisk,
  EndingConstraint,
  Location,
  ReaderRun,
  RequiredEvent,
  ScenePackage,
  SceneResult,
  StoryBible,
  StoryRunState,
  Viewpoint,
  World
} from "@inkbranch/types";

export type StoryIntentKey =
  | "stealth"
  | "social"
  | "investigation"
  | "retreat"
  | "dangerous"
  | "protect"
  | "reveal"
  | "resolve";

export interface ConsequenceFlagDefinition {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

export interface StyleGuide {
  proseTone: string[];
  visualMood: string[];
  recurringMotifs: string[];
  avoid: string[];
}

export interface ChoiceRule {
  intent: StoryIntentKey;
  keywords: string[];
  description: string;
}

export interface StoryChoiceEffect {
  setFlags?: Record<string, boolean>;
  relationshipDeltas?: Record<string, number>;
  dangerDelta?: number;
  discoveries?: string[];
  canonFacts?: string[];
  characterUpdates?: string[];
  locationUpdates?: string[];
  warnings?: string[];
  memory?: string;
  endingDirection?: string;
}

export interface StoryChoiceDefinition {
  id: string;
  label: string;
  intent: string;
  intentKey: StoryIntentKey;
  risk: ChoiceRisk;
  nextBeatId: string;
  effects: StoryChoiceEffect;
}

export interface SceneBeatVariant {
  flag: string;
  text: string;
}

export interface SceneBeat {
  id: string;
  chapter: number;
  title: string;
  locationId: string;
  summary: string;
  paragraphs: string[];
  variants?: SceneBeatVariant[];
  characterIds: string[];
  discovery?: string;
  threat?: string;
  canonFacts: string[];
  choices: StoryChoiceDefinition[];
  customRoutes: Partial<Record<StoryIntentKey, string>>;
  defaultNextBeatId: string;
  endingId?: string;
}

export interface StoryEnding {
  id: string;
  title: string;
  direction: string;
  locationId: string;
  requiredFlags?: string[];
  paragraphs: string[];
  canonFacts: string[];
}

export interface StoryPack {
  id: string;
  book: Book;
  world: World;
  storyBible: StoryBible;
  characters: Character[];
  locations: Location[];
  canonRules: CanonRule[];
  requiredEvents: RequiredEvent[];
  viewpoints: Viewpoint[];
  endingConstraints: EndingConstraint[];
  sceneBeats: SceneBeat[];
  consequenceFlags: ConsequenceFlagDefinition[];
  endings: StoryEnding[];
  styleGuide: StyleGuide;
  choiceRules: ChoiceRule[];
  createInitialState: () => StoryRunState;
  renderScene: (input: ScenePackage) => SceneResult;
  resolveChoice: (input: ResolveStoryChoiceInput) => ResolvedStoryChoice | undefined;
}

export interface ResolvedStoryChoice {
  choiceId: string;
  label: string;
  intent: string;
  intentKey: StoryIntentKey;
  risk: ChoiceRisk;
  nextBeatId: string;
  nextLocationId: string;
  completedEndingId?: string;
  effects: StoryChoiceEffect;
  resolution: {
    type: "preset" | "custom";
    originalText?: string;
    interpretedIntent: string;
    canonValidity: "valid" | "adapted" | "blocked";
    notes: string[];
  };
}

export interface ResolveStoryChoiceInput {
  run: ReaderRun;
  scene: SceneResult;
  choiceId?: string;
  customChoiceText?: string;
}
