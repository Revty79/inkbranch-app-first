# Story Engine

Inkbranch's engine turns an authored book and a reader run into structured scenes.

## Loop

1. Reader starts a story.
2. Backend creates a `ReaderRun`.
3. Planner creates the next `ScenePackage`.
4. Generator renders a `SceneResult` through the fake provider.
5. Validator checks scene shape.
6. Mobile app displays the scene and three choices.
7. Reader selects a choice.
8. Runtime commits the choice into reader canon.
9. Next scene begins.

## Main Objects

- `Book`: Authored story container with world, story bible, and spine.
- `World`: Canonical setting, tone, characters, locations, and rules.
- `StoryBible`: Canon rules, viewpoints, required events, ending constraints, and banned outcomes.
- `ReaderRun`: A reader-specific path through a book.
- `ScenePackage`: Approved input for generation, including canon, constraints, and current run state.
- `SceneResult`: Structured generated scene output.
- `Choice`: One of exactly three actions available to the reader.
- `CanonCommit`: A committed reader choice and its canon facts.
- `MemoryUpdate`: Run memory derived from a committed scene and choice.

## Validation

Current validation checks:

- `sceneText` exists.
- Exactly three choices are returned.
- Each choice has `id`, `label`, `intent`, and `risk`.
- `memoryUpdate` exists.
- `stateChanges` contains expected arrays.

Later phases can add canon contradiction checks, repetition checks, stronger safety checks, and database-backed run persistence.
