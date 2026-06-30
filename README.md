# Inkbranch

Inkbranch is an app-first interactive fiction platform where authors define canon, readers choose paths, and AI renders scenes only inside approved story rules.

This repository is the first foundation phase. It includes:

- Expo React Native mobile shell
- Node.js TypeScript backend
- Shared TypeScript types
- Story core package with runtime and validation utilities
- AI adapter package with a fake local provider
- Architecture and story engine documentation

## Quick Start

```bash
npm install
npm run typecheck
npm run dev:server
npm run dev:mobile
```

The backend defaults to `http://localhost:4000`.

## Phase Limits

This phase intentionally avoids authentication, payments, marketplace features, image generation, publishing tools, production storage, and live AI providers.
