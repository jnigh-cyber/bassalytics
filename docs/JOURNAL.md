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