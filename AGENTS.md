# Repository instructions for agents

This file defines stable working agreements for coding agents. Human-oriented setup lives in
`README.md`.

## Product context

This repository is a **template**. It has no product behaviour on purpose.

A product built from it owns its own context. Read whichever of these exist before changing
behaviour, and prefer them over anything restated here:

- `docs/product.md` — what the product is, who it serves, and its boundaries.
- `DESIGN.md` — the durable design brief the semantic tokens in `apps/web/src/index.css` implement.
- `specs/NNN-*.md` — the numbered specification governing the change in hand, when the product uses them.

None of these ship with the template. Do not create them speculatively, and do not copy their contents
into this file.

## Language

Write source code, identifiers, comments, tests, commit messages, technical documentation, and pull
request titles and descriptions in English. Product-facing copy may use whatever language the product's
specification requires.

## Repository map

- `apps/web` — React app, browser routing, UI and the typed API client.
- `apps/api` — Hono application, local Node entry point, Drizzle and Neon configuration.
- `packages/shared` — Zod transport schemas and inferred boundary types.
- `api` — Vercel serverless entry point for the Hono application.

## Boundaries worth defending

- The web app consumes the API's exported `AppType` through `hono/client`. Keep that boundary instead
  of generating clients or restating request and response types.
- `packages/shared` holds transport contracts only. It must not grow into a second domain layer.
- Nothing may open a database connection at import time. `apps/api/src/db/client.ts` is a factory for
  that reason, so install, tests and builds stay offline.

## Architecture

Start flat. Introduce a domain, application, ports or adapters layer only when real product behaviour
earns it — never in anticipation. The same applies to queues, caches, feature flags and observability.

## Before proposing a change as done

Run `pnpm typecheck`, `pnpm test`, `pnpm lint` and `pnpm build`, and report the actual output.
