# Bassalytics — Build Journal

One entry per decision: what was decided, the alternatives weighed, and why. Going forward, each slice adds at least one entry. Seeded here with the decisions made before Slice 1.

## 2026-09-18 — Project restart as greenfield native React Native and Expo

Decision: build Bassalytics fresh as a native React Native and Expo app. It was never actually started, so no prior code exists.
Alternatives: (a) the original Capacitor plan, wrapping a React web app for mobile; (b) keeping a future web version and learning RN on a separate throwaway app; (c) a hybrid finishing on Capacitor while rebuilding one screen in RN.
Why: React Native is the headline skill the target role tests, and a finished native app is the strongest single portfolio artifact. Greenfield removes the cost the reversal would otherwise carry, since there is no Capacitor code to unwind.

## 2026-09-18 — Learning approach: thin slice, fast

Decision: build one thin vertical slice that touches every tool, then widen. Breadth before depth.
Alternatives: depth-first (master Expo and RN before the data layer); tutorial-driven (follow one end-to-end course).
Why: the target is a specific posting, so being able to speak to every listed tool sooner matters more than deep mastery of one corner first. Thin slices also keep a from-scratch build from stalling.

## 2026-09-18 — Branching model: GitHub Flow

Decision: GitHub Flow. Protected, always-deployable `main`; short-lived `feature/*` branches; PR into `main`. No long-lived develop branch. Any staging surface is a per-PR preview deploy.
Alternatives: a develop-added model (main plus a develop integration branch); full Git Flow (main, develop, feature, release, hotfix).
Why: GitHub Flow is what most web teams use now and covers a solo dev fully. The extra branches in the other models are ceremony without payoff at this scale, kept here only where they would teach something worth the reps.

## 2026-09-18 — Slice 1 data source: Open-Meteo direct, backend later

Decision: Slice 1 calls Open-Meteo directly from the app via TanStack Query. The project's own Express backend arrives in Slice 2, at which point the same query hook repoints to it.
Alternatives: stand the backend up first so Slice 1 exercises the project's own API from the start.
Why: learn the data layer immediately with no backend in the way. TanStack Query behaves the same whether the URL is a third party or the project API, so the frontend lesson is identical, and the backend earns its place once there is real server-side logic (rating, caching) to hold.

## 2026-09-18 — Data-layer split: REST via TanStack Query, GraphQL via Apollo on one slice

Decision: most reads go REST through TanStack Query. One nested slice, the day drill-down plus LLM tips, goes GraphQL through Apollo.
Alternatives: all REST (skip GraphQL, get the Apollo reps elsewhere); all GraphQL (a full GraphQL layer over the backend).
Why: the role lists both TanStack Query and Apollo, and this split reproduces the common real-world pattern of pairing them inside one app. A single nested slice exercises GraphQL without converting the whole backend.

## 2026-09-18 — .gitignore environment pattern

Decision: ignore `.env` and `.env.*`, and re-include `.env.example` with a negation.
Alternatives: `*.env`, the first instinct.
Why: `*.env` misses the dotted variants (`.env.local`, `.env.production`, `.env.development`) that tooling commonly drops keys into, so a real secret could slip through. The broader pattern closes that gap while still committing the one example file that documents which keys the app expects.

## 2026-09-18 — Scaffolded on the official Expo SDK 57 default template

Decision: kept the stock `create-expo-app --template default@sdk-57` output as the base, including its AI-agent scaffolding (`AGENTS.md`, `CLAUDE.md`, `.claude/settings.json`) and the `src/app` routing layout.
Alternatives: strip the agent files for a barer tree; use an SDK 54 project for wider Expo Go compatibility.
Why: the agent scaffolding is Expo's own, points at versioned Expo docs, and wires the Expo skills plugin, so it supports the Phase 2 agentic-workflow goal rather than fighting it. SDK 57 loads in Expo Go on the target device, so the compatibility caveat did not apply. No Phase 1 stack tools are pre-wired, so building them by hand slice by slice is unaffected.

## 2026-09-21 — Testing boundary: Vitest for pure logic, Jest for components later

Decision: Vitest tests pure functions only (conversions, mappers, store logic). Component render tests, if needed, will use jest-expo with React Native Testing Library as a separate runner.
Alternatives: forcing Vitest to render React Native components via a react-native-web alias and jsdom.
Why: Expo's supported test path is Jest via jest-expo. Vitest cannot transform React Native source without heavy config, and the web alias tests the web render rather than the native one. Pure logic is where Vitest is strong, and real RN codebases commonly run both.

## 2026-09-21 — Test scripts: one-shot test, separate watch

Decision: `"test": "vitest run"` and `"test:watch": "vitest"`.
Alternatives: a single `test` script in watch mode.
Why: watch mode never exits, so it would hang any automated gate. A duplicate `test` key in package.json briefly caused the watch script to silently win, since JSON keeps the last duplicate key.

## 2026-09-21 — Fetch Celsius from Open-Meteo, convert client-side

Decision: request Open-Meteo's default Celsius and convert with the tested `cToF` helper on demand.
Alternatives: request Fahrenheit directly via `temperature_unit=fahrenheit`.
Why: one source of truth for the data. Toggling units becomes a client-side calculation with no refetch.

## 2026-09-21 — No Open-Meteo npm package

Decision: call Open-Meteo with the built-in `fetch`.
Alternatives: the official `openmeteo` npm package.
Why: the platform already does this in one call. The package adds a binary-decoding dependency and supply-chain surface for no benefit at this scale.

## 2026-09-21 — Query hook pattern

Decision: data fetching lives in custom hooks in `src/hooks` (first: `useCurrentWeather`). Each hook owns its queryKey and queryFn and returns the `useQuery` result unchanged; components handle loading, error, and success. The queryFn throws on `!res.ok`, the response type attaches at the queryFn's return, and the queryKey includes the coordinates (`['currentWeather', latitude, longitude]`).
Alternatives: calling `useQuery` directly inside screens; a static queryKey.
Why: keeps fetch logic out of screens and makes every data hook the same skeleton. Throwing on bad status is the only way `isError` fires. Coordinate-aware keys make Query refetch automatically when the location changes in Slice 3.

## 2026-09-22 — QueryClient at module scope in the root layout

Decision: `new QueryClient()` is created once at module scope in `src/app/_layout.tsx`, and `QueryClientProvider` wraps the root `<Stack>`.
Alternatives: providing it in `index.tsx`, or creating the client inside a component body.
Why: the layout wraps every route, so sibling screens added later can use queries. Creating the client inside a component would rebuild it every render and wipe the cache.

## 2026-09-22 — Weather code mapping: lookup object with full granularity

Decision: `describeWeatherCodes` uses a `Record<number, string>` lookup with a `?? 'Unknown'` fallback, and keeps Open-Meteo's intensity levels (light, moderate, heavy) as distinct labels.
Alternatives: a switch statement; collapsing ranges into one label per family ("Drizzle", "Rain").
Why: rain intensity matters to anglers, since light rain is often still fishable. With a distinct label per code, a switch loses its only advantage (grouped cases), and a lookup object mirrors the spec table directly.
Known limitation: unmapped codes display "Unknown". The only WMO code not mapped occurs outside the Southeast US, so it is accepted for v0.1.0.

## 2026-09-22 — Client state in Zustand, in its own stores folder

Decision: the temperature unit lives in a Zustand store at `src/stores/useUnitStore.ts`, read in components with one selector per slice.
Alternatives: `useState` in the screen; placing the store in `src/hooks`.
Why: the unit is an app-wide preference that later screens will read. A separate `stores` folder makes the server-state (TanStack Query) versus client-state (Zustand) boundary visible in the file tree. One selector per value keeps re-renders tight and avoids the v5 infinite-loop issue with object selectors.

## 2026-09-22 — Default temperature unit: Fahrenheit

Decision: the unit store initializes to `'F'`.
Alternatives: Celsius, matching the API.
Why: the target users are Southeast US anglers, who think in Fahrenheit.

## 2026-09-22 — Unit toggle: functional now, segmented control at the styling step

Decision: a single `Pressable` shows the rounded temperature with its unit. Visual affordance (a proper C/F segmented control with press feedback) is deferred to the styling slice.
Alternatives: a `Switch`; building the full styled control now.
Why: a Switch models a boolean, but C and F are two equal choices. Styling is deliberately kept out of data-layer slices.

## 2026-09-22 — Test structure convention

Decision: `describe` names the unit under test; each `it` names one behavior. Independent behaviors get separate `it` blocks. Steps of one sequence stay together in a single `it`, such as the unit store's round-trip toggle.
Alternatives: one assertion per test; one `describe` per case.
Why: failure output reads as a sentence pointing to what broke, and dependent steps cannot be split without breaking them.

## Issues:

(1) Dockerized Postgres for local dev, (2) bare Express server with health route, (3) weather served through the project API with the app hook repointed, (4) Postgres schema and forecast caching, (5) USGS water temperature, (6) solunar, (7) rating algorithm.

## 2026-09-22 — Expo dev server over LAN, not tunnel

Decision: run `npx expo start` in LAN mode for daily development.
Alternatives: `--tunnel` via ngrok, the template's default `npm start`.
Why: tunnel mode crashed on an ngrok network call. LAN is faster and has no third-party dependency when the phone and computer share a network. Tunnel is reserved for networks that isolate devices.

## 2026-09-22 — Monorepo with a separate server package

Decision: the Express backend lives in `server/` with its own `package.json`, `tsconfig.json`, and `src/`, alongside the Expo app in the same repo.
Alternatives: a separate backend repository.
Why: one history for the whole app. The app and server are different runtimes (Metro on a phone, Node on a machine), so they keep separate dependency trees.

## 2026-09-22 — Local database: Postgres in Docker, managed Postgres for production

Decision: development uses `postgres:17-alpine` via `docker-compose.yml`, with a named volume, a `pg_isready` healthcheck, and credentials read from `.env`. Production will use a managed host (Neon is the likely choice) at deploy time.
Alternatives: Neon for everything, native local Postgres, Supabase, Aiven, Render's free Postgres.
Why: a disposable, reproducible, offline database with nothing touching source files, plus Docker as a job-relevant skill and a standard dev/prod split. Supabase's built-in auth would bypass the JWT layer this project builds by hand. Render's free database expires.
Lessons: the Postgres image initializes credentials only on first boot against an empty volume, so fixing `.env` afterward requires `docker compose down -v`. A container can be "up" but not "healthy".

## 2026-09-22 — Backend TypeScript: run .ts directly on Node 24, gated by tsc

Decision: the server runs `node --watch src/index.ts` using Node 24's built-in type stripping, with `tsc --noEmit` as a separate `typecheck` script. `server/package.json` sets `"type": "module"`, and the tsconfig enables `strict`, `verbatimModuleSyntax`, and `erasableSyntaxOnly`.
Alternatives: compiling to `dist/` with `tsc` (the car loan calculator's approach); `tsx` or `ts-node` as a runner.
Why: fast save-and-restart loop, no build artifacts, and stack traces that match source line numbers. Type stripping does not type-check, so the separate gate is required. Type-only imports must use `import type`, and non-erasable syntax like `enum` is avoided.

## 2026-09-24 — Own API response shape for current weather

Decision: `GET /api/weather` returns `{ current: { tempC, weatherCode } }`, the project's own contract rather than Open-Meteo's raw payload.
Alternatives: pass Open-Meteo's JSON through unchanged; a flat `{ temperatureC, weatherCode }`.
Why: the app depends only on this API, so changing or combining data providers (Open-Meteo, USGS) does not ripple into the app. Nesting under `current` lets the five-day forecast arrive as a sibling `daily` field later, which is a non-breaking addition rather than a restructure. Field names are camelCase, and the unit is part of the name so the contract is self-documenting.

## 2026-09-24 — Weather code labels stay in the app

Decision: the API sends the raw WMO code; the app formats it with `describeWeatherCodes`.
Alternatives: the server sends the text label.
Why: wording is presentation. Localization or icons later become app changes, not API changes. The server sends facts; the app decides how to show them.

## 2026-09-24 — Server-side Open-Meteo call: constants in code, one error path

Decision: the Open-Meteo base URL is a constant in the server code, with query parameters built by `URLSearchParams`. A non-OK upstream status throws, and a single `catch` responds with `502` and a generic message while logging the real cause.
Alternatives: the full URL in `.env`; responding separately for bad status and network failure.
Why: env vars are for values that are secret or that differ between environments, and this URL is neither. `.env` files do not interpolate `${...}`. `fetch` only throws on network failure, so bad statuses must be checked explicitly. Routing both failures through one `catch` means one error response to maintain.

## 2026-09-24 — App API address via EXPO_PUBLIC_API_URL

Decision: the app reads its API base URL from `EXPO_PUBLIC_API_URL` in the root `.env`, checked inside the queryFn with a clear error if missing.
Alternatives: hardcoding the address in the hook.
Why: the laptop's IP changes per network, and production will use a different URL, so the address is configuration. `EXPO_PUBLIC_` variables are inlined into the bundle at build time, so they are public and never used for secrets. Expo only substitutes them when written literally as `process.env.EXPO_PUBLIC_API_URL`; dynamic lookups like `process.env[key]` return undefined on device. Checking inside the queryFn surfaces a missing value as a query error instead of crashing the app at load.

## 2026-09-24 — Weather queryKey without coordinates, for now

Decision: the key is `['currentWeather']` while the server holds the Lake Higgins coordinates.
Alternatives: keep coordinates in the key; send coordinates from the app as query parameters.
Why: a queryKey should describe the request's inputs. The app no longer sends coordinates, so a key containing them would be misleading. Location returns to the key when it becomes a real input (saved location, Slice 4). Sending coordinates now would add server-side query validation and widen the issue.

## 2026-09-24 — Dev networking for a physical phone

Decision: the phone reaches Metro (8081) and the API (3000) over the local network, using the laptop's current IPv4 address. A Windows Firewall inbound rule allows TCP 8081 and 3000 on Private networks only. On networks with client isolation, the laptop joins the iPhone's Personal Hotspot.
Alternatives: Expo tunnel mode; Expo web for testing.
Why: Windows had no inbound rule for Node, so connections were blocked by default. A port-based rule works regardless of where `node.exe` is installed, and limiting it to Private keeps the ports closed on public and work networks. The work network isolates devices from each other, which no laptop setting can bypass; the hotspot creates a small private network. Tunnel mode only exposes Metro, not the API, and it crashed on an ngrok call.
Lessons: a timeout means traffic is being dropped (firewall or isolation), while a 404 means a server answered but didn't know the path. Test reachability from the phone's browser first, since it separates network problems from Expo Go problems. A missing `$` in a template string produced a literal URL and a 404. "Cannot find native module" errors call for checking the Metro folder, running
