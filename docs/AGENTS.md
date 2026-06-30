# Inkbranch Agent Instructions

Use these instructions for future Codex and development work on Inkbranch.

## Product Boundaries

- Do not turn Inkbranch into a chatbot.
- Preserve the book-first, world-first architecture.
- Keep author canon above generated scene text.
- Keep reader choices committed as run canon.
- Preserve reader freedom by supporting typed custom choices alongside rendered choices.
- Preserve the old library feel across the whole app.
- Do not overbuild before the story loop works.

## Security

- Do not expose API keys.
- Do not put secrets in client code.
- Add `.env.example` files only.
- Keep live provider credentials out of the repository.

## Architecture

- Keep AI behind the provider interface.
- Keep story logic out of mobile UI when possible.
- Keep backend runtime behavior in `server/src/runtime`.
- Keep shared contracts in `packages/types`.
- Keep reusable domain logic in `packages/core`.

## Phase Restrictions

Do not add these until explicitly requested:

- Payments or subscriptions
- Marketplace features
- Creator publishing tools
- Full creator studio
- Authentication
- Image generation
- Public sharing
- Complex admin panels
- Live AI providers
- Production database
- App store deployment
