# Inkbranch

Inkbranch is an app-first interactive fiction platform where authors define canon, readers choose paths, and AI renders scenes only inside approved story rules.

This repository is the first playable fake-story vertical slice. It includes:

- Expo React Native mobile shell
- Node.js TypeScript backend
- Shared TypeScript types
- Story core package with runtime and validation utilities
- AI adapter package with a fake local provider backed by a populated story pack
- A playable Saltglass story pack with canon, flags, scene beats, custom choice handling, and endings
- Architecture and story engine documentation

## Quick Start

```bash
npm install
npm run typecheck
npm run dev:server
npm run dev:mobile
```

The backend defaults to `http://localhost:4000`.

## Demo Story

The current playable story is `The Saltglass Letter`, implemented at:

```txt
packages/core/src/sampleStories/saltglass/
```

It includes the first Inkbranch Authoring Standard shape:

- `storyBible`
- `characters`
- `locations`
- `canonRules`
- `requiredEvents`
- `sceneBeats`
- `consequenceFlags`
- `endings`
- `styleGuide`
- `choiceRules`

The fake provider uses this pack to render 10-15 turns of deterministic story progression with changing locations, discoveries, danger, relationships, canon facts, custom choice interpretation, and ending directions.

## Testing the Demo

Start the backend and mobile app:

```bash
npm run dev:server
npm run dev:mobile
```

From the mobile app:

1. Start `The Saltglass Letter`.
2. Choose preset options to follow authored branches.
3. Use `Write your own choice` to test custom input.
4. Try canon-stressing input such as `burn the letter and leave the city forever`.
5. Watch the memory/canon panel for flags, danger, discoveries, and `valid`, `adapted`, or `blocked` choice handling.
6. Use `Start Over` to reset the run.

API smoke test:

```bash
curl http://localhost:4000/stories
curl -X POST http://localhost:4000/runs/start -H "Content-Type: application/json" -d "{\"bookId\":\"book-saltglass-letter\"}"
```

## Phase Limits

This phase intentionally avoids authentication, payments, marketplace features, image generation, publishing tools, production storage, and live AI providers.
