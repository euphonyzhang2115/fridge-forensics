# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

This repository is an early-stage scaffold, not yet an implemented application. It currently contains:

- `test-key.js` — a standalone connectivity check for the Anthropic API. It reads `ANTHROPIC_API_KEY` from `.env.local` (simple regex parse, no `dotenv` dependency), sends a one-off "say hello" message to `claude-opus-5` via `@anthropic-ai/sdk`, and prints the reply.
- `demo-fridge.jpg` — a sample image, presumably for the intended "fridge forensics" feature (e.g. vision-based analysis of fridge contents), but no code yet reads or processes it.
- `package.json` — only dependency is `@anthropic-ai/sdk`. No test runner, linter, or build tooling is configured (the `npm test` script is the default placeholder).

There is no other application code, no framework, and no directory structure to document yet — the architecture section below will need to be filled in as real functionality is added.

## API architecture

- `/api/analyze` is the only API route in this project. It returns `AnalyzeResponse`, defined in `types.ts`.
- Do not create additional API routes.
- Do not add API SDKs beyond what's already in `package.json`.

(Neither `/api/analyze` nor `types.ts` exist in the repo yet — this section records the intended constraint for when that code is added.)

## Commands

```
node test-key.js   # verify ANTHROPIC_API_KEY in .env.local works
```

There is no configured build, lint, or test command — `npm test` is the unfilled default placeholder.

## Environment

- `ANTHROPIC_API_KEY` is read from `.env.local` (gitignored, alongside `node_modules`). Do not commit real keys.
