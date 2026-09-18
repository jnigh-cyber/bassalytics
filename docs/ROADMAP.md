# Bassalytics — Roadmap

Bass fishing forecast app for the Southeast US. v0.1.0 targets largemouth bass only. Greenfield native build in React Native and Expo.

This project has two goals at once: ship Bassalytics, and learn a mobile stack tied to a specific role. The slice plan is sequenced so each new tool enters where the app naturally needs it.

## Target stack, and where each piece enters
- TypeScript — from the Expo template, day one
- React Native and Expo (Expo Router) — Phase 0 skeleton, every slice
- TanStack Query — Slice 1 (server state and data fetching)
- Zustand — Slice 1 (client-only state, e.g. a unit toggle)
- Vitest — Slice 1 onward (rides along so Phase 2 has a green safety net)
- Express and Postgres — Slice 2 (own backend)
- Expo Router navigation, real use — Slice 3
- Apollo Client and GraphQL — Slice 5 (one nested slice; the rest stays REST)
- Anthropic API — Slice 5 (LLM fishing tips)

Data sources: Open-Meteo (weather, REST, no key), USGS Water Services (water temperature, REST), solunar (computed), and a self-designed rating algorithm. Resend handles transactional email. Design uses the Bassalytics palette with Zilla Slab and Barlow, loaded in Expo via Google Fonts.

Data-layer split: most reads go REST through TanStack Query; one nested slice (day drill-down plus LLM tips) goes GraphQL through Apollo. This mirrors the real-world pattern of pairing both, inside one app.

## Process
- Branching: GitHub Flow. `main` is production and always deployable. Work happens on short-lived `feature/*` branches that PR into `main`. No long-lived develop branch; any staging surface is a per-PR preview deploy, so the prod and dev split lives in environments, not the branch tree.
- Tracking: a GitHub Project board with columns Backlog, Ready, In progress, In review, Done. Each slice is a milestone; its tasks are issues; each issue rides its own `feature/` branch into a PR that closes it. Conventional commits (`feat:`, `fix:`, `chore:`).
- Gates on every PR: a page-by-page review before merge, and a secrets check so only `.env.example` ever leaves the machine. The real `.env` is gitignored from the first commit.
- Journal: `docs/JOURNAL.md` records one decision per entry with the alternative passed on.

## Phase 0 — Foundation (the rails)
Build: repo with protected `main` and GitHub Flow; the Project board with per-slice milestones; the Expo app skeleton running on a physical phone; hygiene files (`.gitignore`, `.env.example`, `docs/JOURNAL.md`, `docs/ROADMAP.md`).
Note: Open-Meteo needs no API key, so `.env.example` is a near-empty placeholder for now. The secrets discipline is set up before it is load-bearing, which happens in Slice 5.
Done when: the app loads on the phone, the board is live, `main` is protected.

## Phase 1 — Build the core by hand, slice by slice
The judgment-heavy foundation gets built by hand so the learning sticks. Each slice is a milestone.

### Slice 1 — First light
One screen, one hardcoded Southeast lake, today's weather pulled from Open-Meteo directly via TanStack Query. Zustand holds one small piece of client state (a temperature unit toggle). Vitest covers one pure helper.
Sequencing note: the direct Open-Meteo call is transitional. In Slice 2 the same query hook repoints to the project's own Express endpoint; the frontend data layer stays put and only the URL moves. That is the lesson.
Tools introduced: TanStack Query, Zustand, Vitest.

### Slice 2 — Rating engine
Stand up Express and Postgres. Move the weather fetch server-side, add USGS water temperature, solunar data, and the rating algorithm. Cache forecasts in the database. Repoint the Slice 1 hook to the project API.
Why server-side: the rating logic is cacheable, testable, and reusable across clients.

### Slice 3 — Five days plus drill-down
The horizontal scrollable five-day forecast cards, plus the day-detail screen as its own route. Expo Router navigation becomes real work here.

### Slice 4 — Accounts
JWT and bcrypt auth (the same pattern already built for the car loan calculator), one saved location, and onboarding.
RN note: token storage uses `expo-secure-store`, not web `localStorage`. A genuine React Native specific skill.

### Slice 5 — Tips, email, GraphQL
On-demand LLM fishing tips on the drill-down via the Anthropic API, Resend password reset email, and Apollo plus GraphQL on that one nested tips slice while the rest stays REST.
Secrets note: the Anthropic and Resend keys go live here. This is the slice where the `.env` gate earns its keep.

End of Phase 1: the v0.1.0 core works, all seven target tools have been exercised, and the test suite is green.

## Phase 2 — Agentic workflow (additive features)
Precondition: green tests, clear specs, a stable core — which is why Vitest rides along from Slice 1. That suite is the safety net the agents work above.
How it runs: each feature is a written spec plus acceptance criteria on its own branch, implemented by an agent or parallel subagents against green tests, with the review gate owned by hand.
Backlog:
- Multiple saved locations (v0.1.0 caps at one)
- Regions beyond the Southeast
- Species selection beyond largemouth
- A catch log (self-contained CRUD module with its own tests)
- Push notifications for high-rating days via `expo-notifications`
- A rating-weight tuning surface plus a backtest of the algorithm
- Historical rating trends as a read-only chart
- Offline cache with graceful degradation when an API is down