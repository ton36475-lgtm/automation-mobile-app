# CLAUDE.md

Guidance for AI coding assistants (Claude Code and others) working in this repository.

## What this project actually is

The repo started from a generic **Manus WebDev Expo/tRPC template** (`package.json` name is still
literally `"app-template"`). Since then it has been repurposed at least three times by different
commit batches, and the docs from each pivot were left in place instead of being cleaned up:

1. **Template baseline** — Expo Router app + Express/tRPC backend + Drizzle/MySQL, with Manus OAuth
   wired up. This is the only part that is fully implemented and wired into navigation.
2. **"AI Multi-Tool Master"** (`design.md`, `todo.md`) — a four-tool app (SimilarWeb analytics,
   Video Generator, BGM Prompter, Skill Creator). **Not implemented** — no matching code exists.
3. **"Ghost Claw OS"** (`MODULES-STRUCTURE.md`, `COMPLETION-SUMMARY.md`, `INTEGRATION-GUIDE.md`,
   `MOBILE-APP-SETUP.md`, `k8s/`, `Dockerfile`) — an AI video/story content pipeline with 11
   planned modules (Story Engine, Autocut Studio, Asset Library, Prompt Lab, Render Queue, Review
   Gate, Release Center, Watch Center, Settings, Dashboard, Projects) talking to an external
   "Gemma 4" backend. Only ~6 of the 11 module screens exist as files, and **none of them are
   registered in navigation** (see "Orphaned screens" below).
4. **"Automation System"** (`design-automation.md`, `todo-automation.md`,
   `app/(tabs)/automation-dashboard.tsx`, `lib/automation-api.ts`) — yet another dashboard concept
   (workflows, executions, metrics) for a 5-tab app. Also **not wired into navigation**.

**Do not trust the top-level `.md` planning docs as a description of current behavior** — treat
them as historical/aspirational design notes from different pivots, several of which contradict
each other (different app names, different tab structures, different color systems). When in
doubt, trust the code in `app/`, `server/`, `lib/`, `drizzle/` over any prose doc. If you're asked
to continue this project, ask (or infer from the most recent commits/user request) which pivot —
Ghost Claw OS vs. Automation System vs. something else — is actually the current direction before
building more features on top of either abandoned concept.

### Orphaned screens (exist as files, not reachable in the app)

- `app/(tabs)/automation-dashboard.tsx` — not registered as a `<Tabs.Screen>` in
  `app/(tabs)/_layout.tsx` (only `index` is).
- `app/modules/admin-dashboard/AdminDashboardScreen.tsx`
- `app/modules/asset-library/AssetLibraryScreen.tsx`
- `app/modules/autocut-studio/AutocutStudioScreen.tsx`
- `app/modules/prompt-lab/PromptLabScreen.tsx`
- `app/modules/render-queue/RenderQueueScreen.tsx`
- `app/modules/story-engine/StoryEngineScreen.tsx` (+ a separate `story-engine/page.tsx`)

None of these are imported, linked (`<Link>`/`href`), or `router.push`'d from anywhere in `app/`.
They compile, but a user cannot navigate to them from the running app. If you pick up work in one
of these modules, you will also need to add real routing (a `<Tabs.Screen>` entry or a `Link`)
before the feature is reachable.

## Directory structure

```
app/                        Expo Router file-based routes
  _layout.tsx                Root layout: React Query + tRPC providers, ThemeProvider, Stack
                              with only "(tabs)" and "oauth/callback" registered
  (tabs)/
    _layout.tsx               Tab bar — currently only registers the "index" (Home) tab
    index.tsx                 Home screen (NativeWind starter content)
    automation-dashboard.tsx  Orphaned — see above
  oauth/callback.tsx          Manus OAuth redirect handler
  dev/theme-lab.tsx           Internal theme/color preview screen
  modules/                    Scaffolded "Ghost Claw OS" feature screens — see orphaned list above

components/                 Shared RN components (ScreenContainer, ThemedView, HapticTab, etc.)
components/ui/               Small UI primitives (Collapsible, IconSymbol)

hooks/                       use-auth, use-colors, use-color-scheme(.web)
constants/                   oauth.ts (API base URL resolution), theme.ts, const.ts

lib/
  _core/                      Framework-level: trpc client wiring helpers, auth token storage,
                               manus-runtime (native/web bridge), theme. Avoid modifying.
  trpc.ts                     tRPC React Query client (real, used by app/_layout.tsx)
  theme-provider.tsx           Theme context provider (real, used by app/_layout.tsx)
  utils.ts                     Misc helpers
  gemma4-client.ts             Ghost Claw OS: axios client for a Gemma-4 backend (topic → story
                                generation, prompt optimization, video analysis). Has tests.
  backend-integration.ts       Ghost Claw OS: separate axios + AsyncStorage offline-first client,
                                overlapping responsibility with gemma4-client.ts
  automation-api.ts            Automation System: yet another axios client (workflows, executions,
                                metrics), used only by the orphaned automation-dashboard.tsx
  firebase-service.ts          Push notifications / analytics — no Firebase config or env vars
                                present in the repo; not wired into app/_layout.tsx

server/
  _core/                      Framework-level Express + tRPC bootstrap (index.ts), OAuth, cookies,
                               context, storage proxy, LLM/image-gen/voice helpers, systemRouter.
                               Avoid modifying unless extending framework infra.
  db.ts                        User upsert/lookup query helpers (extend this for new queries)
  routers.ts                   tRPC router — only `system` and `auth` (me/logout) exist; add
                                feature routers here
  storage.ts                    S3-backed file storage helpers (via Forge presigned URLs)
  README.md                    The authoritative guide to the template's backend conventions
                                (auth, db, tRPC, LLM/image/voice helpers, storage, testing patterns)

drizzle/
  schema.ts                    Only the `users` table exists; add app tables here
  relations.ts, migrations/, meta/    Drizzle-kit generated artifacts

shared/
  _core/errors.ts               Framework error types
  types.ts, const.ts             Shared FE/BE types and constants (e.g. COOKIE_NAME)

tests/
  auth.logout.test.ts            Vitest — currently `describe.skip`'d (0 active assertions)
  gemma4-client.test.ts          Vitest — 26 tests against lib/gemma4-client.ts (this is the
                                  source of the "26/26 tests passing" claim in commit messages —
                                  it is not a repo-wide test count)

scripts/
  build-apk.sh                   EAS/keystore-based Android APK build helper
  generate_qr.mjs                 Expo Go QR code generator (`pnpm qr`)
  load-env.js                     Loads .env with system env taking priority (imported by
                                   app.config.ts)
  reset-project.js                Expo template's "reset to blank" script (not run; leftover)

k8s/, Dockerfile                 Deployment manifests for a "ghost-claw-os" Next.js-style service
                                  (health checks at /health and /ready, .next/cache volume,
                                  Firebase secrets). These do NOT match this repo: the actual
                                  server builds to dist/index.js via esbuild (no .next), and its
                                  only health route is GET /api/health. Treat these as stale
                                  boilerplate, not a working deployment path, unless you update
                                  them to match the real build/serve commands first.

android-release.keystore         Committed release signing keystore (see APK-BUILD-GUIDE.md).
                                  Treat as sensitive even though it's in git history already.

Top-level *.md files             Design/planning docs from different pivots (see "What this
                                  project actually is" above) — APK-BUILD-GUIDE.md,
                                  COMPLETION-SUMMARY.md, INTEGRATION-GUIDE.md,
                                  MOBILE-APP-SETUP.md, MODULES-STRUCTURE.md, QUICK-BUILD.md,
                                  design.md, design-automation.md, todo.md, todo-automation.md
```

## Tech stack

- **Expo SDK 54** / **React Native 0.81** / **React 19**, Expo Router v6 (file-based routing)
- **NativeWind v4** (Tailwind CSS v3.4 for RN) — use `className`, not `style`, for most styling;
  theme tokens (e.g. `bg-background`, `text-foreground`, `bg-primary`) come from `theme.config.js`
  and are exposed with no `dark:` prefix needed (dark mode is handled via a `data-theme` attribute
  / `ColorScheme` context, see `lib/theme-provider.tsx` and `hooks/use-colors.ts`)
- **tRPC v11** + **@tanstack/react-query v5** for the typed client/server API layer
  (`lib/trpc.ts` ↔ `server/routers.ts`); transformer (`superjson`) lives inside `httpBatchLink`,
  not at the root client — this is a v11-specific requirement called out in `server/README.md`
- **Drizzle ORM** targeting **MySQL/TiDB** (`drizzle-orm/mysql-core`, `mysql2` driver)
- **Express** backend (`server/_core/index.ts`), bundled for production with **esbuild** to
  `dist/index.js` (not Next.js, despite the Dockerfile/k8s manifests suggesting otherwise)
- **Zod v4** for input validation in tRPC procedures
- **Manus OAuth** for authentication (native: bearer token in `expo-secure-store`; web: HTTP-only
  cookie) — see `hooks/use-auth.ts`, `app/oauth/callback.tsx`, `server/_core/oauth.ts`
- **Vitest** for tests, **ESLint** (`eslint-config-expo` flat config) + **Prettier** for lint/format
- **pnpm** (pinned `packageManager: pnpm@9.12.0`, `.npmrc` sets `node-linker=hoisted`)
- **TypeScript 5.9**, `strict: true`, path aliases `@/*` → repo root, `@shared/*` → `shared/`

## Setup / dev / build / test / lint commands

Dependencies are **not installed** in a fresh checkout of this working copy (no `node_modules/`).
Run `pnpm install` first.

```bash
pnpm install            # install dependencies (pnpm, not npm/yarn)

pnpm dev                # runs both dev:server and dev:metro concurrently
pnpm dev:server         # Express/tRPC API only, via tsx watch (server/_core/index.ts)
pnpm dev:metro          # Expo web dev server only (Metro), port $EXPO_PORT or 8081

pnpm android            # expo start --android
pnpm ios                # expo start --ios
pnpm qr                 # generate a QR code for Expo Go (scripts/generate_qr.mjs)

pnpm build              # esbuild bundle of server/_core/index.ts -> dist/index.js (ESM, Node)
pnpm start              # NODE_ENV=production node dist/index.js (serves the built API only)

pnpm check              # tsc --noEmit (type-check)
pnpm lint               # expo lint (eslint-config-expo flat config)
pnpm format             # prettier --write .
pnpm test               # vitest run

pnpm db:push            # drizzle-kit generate && drizzle-kit migrate (requires DATABASE_URL)
```

There is no `.github/workflows` CI in this repo (a prior commit explicitly removed it — see
`git log` — "Remove CI/CD workflows for initial push"). Nothing runs lint/test/build
automatically on push; run the commands above manually before considering work done.

The API server listens on `process.env.PORT` (default 3000), auto-incrementing to the next free
port up to +19 if busy (`server/_core/index.ts`); the actual bound port is logged to the console,
so check there rather than assuming 3000 if you see a "port busy" message.

## Key conventions

- **Only touch files marked for extension.** Both `server/README.md` and the file layout make a
  hard split between framework-owned code and app code:
  - Extend: `server/db.ts`, `server/routers.ts`, `server/storage.ts`, `drizzle/schema.ts`,
    `lib/trpc.ts` (headers only), `tests/*`.
  - Avoid modifying: anything under a `_core/` directory (`server/_core/`, `lib/_core/`,
    `shared/_core/`) unless you are deliberately changing framework-level infrastructure.
- **tRPC routing**: add feature routers as sub-routers of `appRouter` in `server/routers.ts`; use
  `publicProcedure` for unauthenticated endpoints and `protectedProcedure` for ones requiring a
  logged-in user (`ctx.user` is guaranteed inside `protectedProcedure`). All HTTP routes must be
  reachable under `/api/` for the gateway to route correctly (per the comment in `routers.ts`).
- **Frontend must handle `UNAUTHORIZED`** tRPC errors explicitly (redirect to login) — see the
  pattern in `server/README.md`; there's no global error boundary doing this for you.
- **LLM / image-gen / voice / storage / owner-notification helpers** are pre-wired in
  `server/_core/llm.ts`, `imageGeneration.ts`, `voiceTranscription.ts`, and `server/storage.ts` /
  `notification.ts` — call these only from server-side code (tRPC procedures) so credentials are
  never exposed to the client. Structured LLM output: use `json_schema` only for flat objects, use
  `json_object` for nested arrays/objects (see `server/README.md` for the exact caveat).
- **Styling**: prefer NativeWind `className` over RN `style`; add new design tokens in
  `theme.config.js`/`theme.config.d.ts` (single source of truth consumed by both
  `tailwind.config.js` and `lib/_core/theme.ts`), not by hardcoding hex values in components.
- **Three parallel, overlapping "backend client" layers exist in `lib/`** (`trpc.ts` — the real,
  wired-in one; `gemma4-client.ts`; `backend-integration.ts`; `automation-api.ts`) each with their
  own `axios` instance, retry logic, and base-URL resolution. Before adding a new API call, check
  which of these (if any) is already wired into the screen you're editing rather than introducing
  a fourth client.
- Database access is optional at runtime by design: `server/db.ts`'s `getDb()` returns `null` when
  `DATABASE_URL` is unset, and callers are expected to check for that (see the `if (!db) return []`
  pattern) so local tooling works without a database.

## Environment variables

No `.env.example` is checked in — the variable names below are inferred from `server/_core/env.ts`,
`app.config.ts`/`scripts/load-env.js`, and `lib/automation-api.ts`/`backend-integration.ts`. Do not
print or commit actual secret values.

Server-side (`server/_core/env.ts`):
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MySQL/TiDB connection string (Drizzle) |
| `JWT_SECRET` | Session/cookie signing secret |
| `VITE_APP_ID` | Manus OAuth app ID |
| `OAUTH_SERVER_URL` | Manus OAuth backend URL |
| `OWNER_OPEN_ID` | Owner's Manus OAuth ID (grants `admin` role on upsert) |
| `BUILT_IN_FORGE_API_URL` | Manus Forge API endpoint (LLM/image/voice/storage) |
| `BUILT_IN_FORGE_API_KEY` | Manus Forge API key |
| `PORT` | API server port (default 3000, auto-increments if busy) |
| `NODE_ENV` | `development` / `production` |

Client-side, Expo-exposed (must be prefixed `EXPO_PUBLIC_`):
| Variable | Purpose |
|---|---|
| `EXPO_PUBLIC_APP_ID` | OAuth app ID for the client |
| `EXPO_PUBLIC_API_BASE_URL` | tRPC API base URL (see `constants/oauth.ts`) |
| `EXPO_PUBLIC_OAUTH_PORTAL_URL` | Manus login portal URL |
| `EXPO_PUBLIC_API_URL` | Base URL used by `lib/automation-api.ts` and `lib/backend-integration.ts` (defaults to `http://localhost:8000` / `:3000` respectively — **the two files disagree on the default port**) |

Referenced only in `k8s/deployment.yaml` (not used anywhere in `server/` or `lib/` source — likely
stale/aspirational, part of the "Ghost Claw OS" pivot): `FIREBASE_PROJECT_ID`, `FIREBASE_API_KEY`.

`EXPO_PORT` controls the Metro dev server port for `pnpm dev:metro` (defaults to 8081).

## Gotchas specific to this repo

1. **Docs describe apps that don't exist in code**, or that exist as unreachable screens — see
   "What this project actually is" and "Orphaned screens" above. Always verify against `app/`
   navigation files before assuming a documented feature is live.
2. **`package.json` name is `"app-template"`** — the template was never renamed even though
   `app.config.ts` sets a real product name (`"AI Multi-Tool Master"`) and bundle ID
   (`space.manus.advanced.ai.multi.tool...`).
3. **Dockerfile and `k8s/` manifests don't match the actual app.** They assume a Next.js build
   (`.next`, port 3000 health checks at `/health`/`/ready`, Firebase env vars) but the real build
   is an esbuild bundle to `dist/index.js` whose only health endpoint is `GET /api/health`. Update
   these before relying on them for an actual deployment.
4. **`EXPO_PUBLIC_API_URL` default differs between clients**: `lib/automation-api.ts` defaults to
   `http://localhost:3000`, `lib/backend-integration.ts` defaults to `http://localhost:8000`. Pick
   one and be explicit if you're wiring a screen to either.
5. **`tests/auth.logout.test.ts` is a `describe.skip`** — it documents an intended pattern but
   contributes zero passing assertions; don't rely on it as coverage.
6. **`android-release.keystore` is committed to the repo** (see `APK-BUILD-GUIDE.md`) — be careful
   about ever regenerating/overwriting it, and don't add secrets alongside it.
7. **`scripts/reset-project.js`** is the stock Expo "blank the template" script; it is not part of
   this project's workflow and running it would delete the customized `app/` content.
8. Tailwind is pinned to **v3.4.x** via `nativewind@4` — do not upgrade to Tailwind v4 without
   checking NativeWind compatibility first.
