# DS v1 — Master Project Tracker

**Goal:** Merge the best of `ds-foundation-rt` and `DS-Michelangelo` into one unified, publishable v1 design system.

**Started:** 2026-04-09

---

## Scope Constraints

- **Storybook is out of scope for v1.** Will be addressed in a later phase. No Storybook tasks, no Storybook references in specs or plans.
- **Base repo:** `ds-foundation-rt` monorepo. All work is additive inside this repo.

## Sub-Projects

Each sub-project follows the full workflow: Brainstorm → Spec → Plan → Implement → Review.

| # | Sub-project | Spec | Plan | Status |
|---|-------------|------|------|--------|
| SP1 | Foundation (architecture + tokens) | — | — | 🔵 In progress |
| SP2 | Component API upgrades | — | — | ⏳ Pending |
| SP3 | Wireframe / Lo-Fi mode | — | — | ⏳ Pending |
| SP4 | Layout primitives (Box / Text / SystemProps) | — | — | ⏳ Pending |
| SP5 | Testing infrastructure | — | — | ⏳ Pending |
| SP6 | Registry & publishing | — | — | ⏳ Pending |

---

## Sub-Project 1 — Foundation

**Scope:** Canonical repo architecture, token format (DTCG vs flat), bridge strategy, expanded token vocabulary.

**Spec:** `docs/superpowers/specs/2026-04-09-sp1-foundation-design.md` ✅ Written — awaiting user review

**Plan:** `docs/superpowers/plans/2026-04-09-sp1-foundation.md` ✅ Written — ready to execute

**Key decisions to make:**
- [ ] Repo: stay in `ds-foundation-rt` monorepo or restructure?
- [ ] Token format: keep DTCG or adopt flat `--ds-*`?
- [ ] Token vocabulary: which tokens to add from Michelangelo (motion, spacing, feedback semantic)?
- [ ] Bridge CSS strategy: keep shadcn/ui semantic alias layer or move to direct `--ds-*`?
- [ ] Package name: `@ds-foundation/react` or `@ripple/meridian` or other?

**Status:** 🔵 Brainstorming

---

## Sub-Project 2 — Component API Upgrades

**Scope:** Card sub-components, Input with label/adornments/error, Button color schemes × variants, Badge token-driven.

**Spec:** _(pending)_
**Plan:** _(pending)_
**Status:** ⏳ Pending SP1

---

## Sub-Project 3 — Wireframe / Lo-Fi Mode

**Scope:** `[data-wireframe]` CSS token overrides, `sketch:` Tailwind variant, `DesignSystemProvider`, `ThemeToggle`.

**Spec:** _(pending)_
**Plan:** _(pending)_
**Status:** ⏳ Pending SP1

---

## Sub-Project 4 — Layout Primitives

**Scope:** `Box`, `Text`, `SystemProps` — polymorphic layout foundation.

**Spec:** _(pending)_
**Plan:** _(pending)_
**Status:** ⏳ Pending SP1

---

## Sub-Project 5 — Testing Infrastructure

**Scope:** Vitest unit tests, Playwright visual/e2e tests, CI integration.

**Spec:** _(pending)_
**Plan:** _(pending)_
**Status:** ⏳ Pending SP1

---

## Sub-Project 6 — Registry & Publishing

**Scope:** Registry MDX consistency, npm publish pipeline, versioning, changelog.

**Spec:** _(pending)_
**Plan:** _(pending)_
**Status:** ⏳ Pending SP5

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-09 | Decompose into 6 sub-projects | Each subsystem is independently testable and committable; avoids one monolithic spec |
| 2026-04-09 | SP1 (Foundation) is first | All other decisions depend on token architecture and repo structure |
| 2026-04-09 | Base repo: ds-foundation-rt monorepo (Option A) | Lowest risk — infrastructure already exists; additive changes only |
| 2026-04-09 | Storybook out of scope for v1 | Not a current requirement; deferred to later phase |
| 2026-04-09 | Token format: Option C — DTCG source → flat `--ds-*` output, no bridge layer | Keeps Figma/tooling sync via DTCG; eliminates bridge.css alias layer that caused token bugs |
| 2026-04-09 | Package name: stay as `@ds-foundation/react`, repo stays `ds-foundation-rt` | Naming not yet agreed; deferred to post-v1 |
| 2026-04-09 | Token vocabulary (v1): motion + easing + feedback semantic + shadows + z-index | Direct component impact; spacing + typography scale deferred to v2 (two-system conflict with Tailwind) |

---

## Key Sources

- `ds-foundation-rt` — `packages/react/src/` (~70 components), `packages/tokens/`, `packages/registry/`, `apps/docs/`
- `DS-Michelangelo` (cloned at `/tmp/DS-Michelangelo`) — Next.js app, flat `--ds-*` tokens, wireframe mode, Box/SystemProps, ~55 shadcn/ui components + custom layer
- Prior consolidation spec: `docs/superpowers/specs/2026-03-27-ds-starter-consolidation-design.md`
- Comparison analysis: session 2026-04-09 (see conversation log)
