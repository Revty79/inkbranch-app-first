# Architecture

Inkbranch uses an app-first monorepo. The mobile app is the primary user surface, the backend owns the runtime loop, shared packages hold domain contracts, and AI access stays behind a provider interface.

## Workspaces

- `apps/mobile`: Expo React Native shell for reading, choosing, and run history.
- `server`: Node.js TypeScript backend with health, story, run, and choice routes.
- `packages/types`: Shared TypeScript contracts for books, canon, runs, scenes, choices, and AI.
- `packages/core`: Domain constants, sample story data, runtime helpers, and validation utilities.
- `packages/ai`: AI provider interface exports and the fake local provider.
- `docs`: Product doctrine, architecture notes, engine notes, and development guardrails.

## Backend

The backend exposes:

- `GET /health`
- `GET /stories`
- `POST /runs/start`
- `GET /runs/:runId`
- `POST /runs/:runId/choose`

This phase uses an in-memory store. A production database can later replace `server/src/db/inMemoryStore.ts` without changing the mobile reading flow.

## Mobile App

The Expo app keeps screens focused on user experience:

- Home
- Story Select
- Reader
- Run History

The app calls backend services through `src/services`. If the backend is not running, the shell falls back to local placeholder data so the reader UI remains usable during early development.

## AI Boundary

Live providers are not connected in this phase. `packages/ai` exposes `AIProvider` and ships only `FakeAIProvider`. Future providers should implement the same interface:

```ts
generateScene(input: ScenePackage): Promise<SceneResult>
```

The mobile app should not know which provider is used.
