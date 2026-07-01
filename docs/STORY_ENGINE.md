# Story Engine

Inkbranch's engine turns an authored story pack and a reader run into structured scenes. The current vertical slice uses `The Saltglass Letter` as the first implementation of the Inkbranch Authoring Standard.

## Loop

1. Reader starts a story.
2. Backend creates a `ReaderRun`.
3. Planner creates the next `ScenePackage`.
4. Generator renders a `SceneResult` through the fake provider backed by a story pack.
5. Validator checks scene shape.
6. Mobile app displays the scene, three choices, and a custom choice field.
7. Reader selects a rendered choice or writes their own intent.
8. Runtime resolves the choice, updates flags, commits canon, and advances the beat.
9. Next scene begins.

## Fake Vertical Slice

`packages/core/src/sampleStories/saltglass/` contains the populated fake story pack. It supports at least 10-15 turns of progression through Saltglass Harbor, the Underpier Archive, the Lantern Walk, the Lighthouse Mirror Room, and ending branches.

The fake provider is deterministic. It uses:

- Current scene beat
- Reader run state
- Previous choice resolution
- Canon commits
- Consequence flags
- Location
- Character relationships
- Danger level
- Ending direction

This lets the app test story feel and runtime behavior without live AI calls.

## Story-Pack Contract

A real Inkbranch story pack should include:

- `storyBible`: The story bible, viewpoints, required events, ending constraints, and banned outcomes.
- `characters`: Protagonist and supporting characters with goals and traits.
- `locations`: Important places with canonical facts.
- `canonRules`: Rules the engine must protect.
- `requiredEvents`: Spine events that must surface before endings.
- `sceneBeats`: Deterministic or planned beats with choices, route rules, discoveries, and threats.
- `consequenceFlags`: Named boolean flags that choices can update.
- `endings`: Possible ending directions and their required canon facts.
- `styleGuide`: Prose tone, visual mood, motifs, and things to avoid.
- `choiceRules`: Keyword or intent rules for custom choice interpretation.

Saltglass follows this structure and should be treated as the first example of the authoring standard, not disposable demo content.

## Main Objects

- `Book`: Authored story container with world, story bible, and spine.
- `World`: Canonical setting, tone, characters, locations, and rules.
- `StoryBible`: Canon rules, viewpoints, required events, ending constraints, and banned outcomes.
- `ReaderRun`: A reader-specific path through a book.
- `StoryRunState`: Current beat, location, consequence flags, relationships, danger, discoveries, ending direction, and last choice resolution.
- `ScenePackage`: Approved input for generation, including canon, constraints, and current run state.
- `SceneResult`: Structured generated scene output.
- `Choice`: One of exactly three rendered actions available to the reader, or a reader-written custom intent normalized into the same shape.
- `CanonCommit`: A committed reader choice and its canon facts.
- `MemoryUpdate`: Run memory derived from a committed scene and choice.
- `ReaderChoiceResolution`: Records custom or preset choice interpretation and canon validity.

## Custom Choices

The mobile app sends either a preset choice id or custom choice text. The fake engine interprets custom text by keyword:

- `hide`, `sneak`, `avoid`: stealth intent
- `ask`, `talk`, `trust`: social intent
- `open`, `read`, `inspect`: investigation intent
- `run`, `escape`, `leave`: retreat intent
- `burn`, `destroy`, `attack`: dangerous intent

Each resolved choice records:

- `type`: `preset` or `custom`
- `originalText`: the user's custom text when present
- `interpretedIntent`: the engine's normalized intent
- `canonValidity`: `valid`, `adapted`, or `blocked`
- `notes`: why the engine handled it that way

Canon-breaking input is not blindly accepted. For example, trying to burn the letter damages it, alerts the guard, changes trust, and records `adapted` because the black seal cannot be destroyed before an ending.

## Progression Rules

The deterministic vertical slice chooses the next beat from:

- Current beat id
- Preset choice route
- Custom choice interpreted intent
- Existing flags
- Required event pressure
- Ending direction

Every generated scene should advance at least one visible dimension: location, discovery, threat, character reaction, canon fact, danger, relationship, or ending movement.

## Validation

Current validation checks:

- `sceneText` exists.
- Exactly three choices are returned.
- Each choice has `id`, `label`, `intent`, and `risk`.
- `memoryUpdate` exists.
- `stateChanges` contains expected arrays.

Later phases can add canon contradiction checks, repetition checks, stronger safety checks, and database-backed run persistence.

## Run And Test

```bash
npm install
npm run typecheck
npm run dev:server
npm run dev:mobile
```

Use the Reader screen to test three preset choices, custom typed choices, the memory/canon panel, possible `valid`/`adapted`/`blocked` outcomes, and `Start Over`.
