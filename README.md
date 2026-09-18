# Plus Ultra Template

A GitHub Template Repository for the TypeScript web products this stack keeps converging on:
a React SPA and a Hono API sharing Zod contracts, deployed together on Vercel with Neon Postgres.

It is deliberately product-neutral. A fresh copy installs, typechecks, tests, lints, builds and runs
locally with **no external accounts or credentials**, and contains no product behaviour, branding or
speculative architecture — those arrive with the product, not the template.

## Stack

pnpm workspaces · strict TypeScript · React + Vite + React Router · Tailwind CSS + shadcn/ui · Hono ·
Zod · Neon Postgres · Drizzle · Vitest · Biome · GitHub Actions · Vercel

## Using this template

1. **Use this template** on GitHub (or `gh repo create <name> --template MauroCicerchia/plus-ultra-template`).
2. Rename the root `package.json` `name` field to your product.
3. Optionally rename the `@app/*` workspace scope; it is neutral, so nothing forces you to.
4. Replace the neutral screen in `apps/web/src/app.tsx` and the semantic tokens in
   `apps/web/src/index.css` once the product has a design brief.

## Prerequisites

- Node.js 22.12 or newer
- pnpm 11.13.1 (`corepack enable` picks this up from `packageManager`)

## Commands

| Command | Does |
| --- | --- |
| `pnpm install` | Installs every workspace. |
| `pnpm dev` | Starts the web app and the API together. |
| `pnpm build` | Builds every workspace. |
| `pnpm typecheck` | Checks strict TypeScript across the repo. |
| `pnpm test` | Runs Vitest in every workspace. |
| `pnpm lint` | Runs Biome checks. |
| `pnpm format` | Applies Biome-safe formatting and lint fixes. |
| `pnpm db:generate` | Generates a Drizzle migration from the schema. |
| `pnpm db:migrate` | Applies Drizzle migrations. |

The web app runs at `http://localhost:5173` and proxies `/api` to the API at `http://localhost:3000`.
`GET /health` is the only route: the API serves it at `/health`, and the browser reaches it at
`/api/health`.

## Workspaces

- `apps/web` — React browser app, routing, UI and the typed API client.
- `apps/api` — Hono application, local Node entry point, Drizzle and Neon configuration.
- `packages/shared` — Zod transport schemas and the types inferred from them.
- `api` — the Vercel serverless entry point for the Hono application.

## The typed boundary

`apps/api` exports its `AppType`; `apps/web` consumes it through `hono/client`, so route names and
response shapes are checked at compile time. `packages/shared` holds the Zod schema that validates the
same payload at runtime. Renaming an API route fails `pnpm typecheck` in the web app — that is the
boundary working.

## Database

Drizzle is configured for PostgreSQL against Neon, with an intentionally empty schema. Nothing connects
at import time, so install, tests and builds never need a database. Only `pnpm db:generate` and
`pnpm db:migrate` require a connection string.

Two URLs, because they are not interchangeable (see `.env.example`):

- `DATABASE_URL` — the **pooled** Neon connection, used by API runtime queries.
- `DATABASE_URL_UNPOOLED` — the **direct** Neon connection, used by Drizzle migrations, which cannot
  run through a pooler.

## Deployment

`vercel.json` builds the repository from the root: Vercel serves the Vite output from `apps/web/dist`,
routes `/api/*` to the Hono function at `api/[...path].ts`, and falls back to `index.html` for browser
routes. `apps/api/src/server.ts` stays the local Node entry point.

Creating the Vercel and Neon projects, and setting `DATABASE_URL` / `DATABASE_URL_UNPOOLED` as Vercel
environment variables, is left to each product — the template provisions nothing.
