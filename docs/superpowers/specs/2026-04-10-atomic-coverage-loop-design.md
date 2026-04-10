# Atomic Coverage Loop — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Achieve 100% test coverage, zero TypeScript errors, and zero design-system gaps across all components by running a continuous scanner-driven ticketing loop grounded in Brad Frost's Atomic Design methodology.

**Architecture:** A Node.js scanner script detects gaps (missing tests, missing `forwardRef`, layer violations, unimplemented components, TypeScript errors), writes `tickets.md`, creates/updates GitHub issues, and drives an execution loop that resolves each ticket bottom-up through the atomic layers. The loop exits only when the scanner reports zero gaps, all tests pass, and TypeScript is clean.

**Tech Stack:** Node.js (ESM), `gh` CLI, Vitest, TypeScript strict, Brad Frost Atomic Design (atoms → molecules → organisms → templates → pages)

---

## Governing Methodology: Atomic Design (Brad Frost)

Every component decision is governed by these layer rules:

| Layer | Path | Rule |
|---|---|---|
| **Atom** | `components/atoms/` | Single HTML element or Radix primitive. Zero DS component composition. |
| **Molecule** | `components/molecules/` | Composes atoms only. Never composes other molecules or organisms. |
| **Organism** | `components/organisms/` | Composes molecules and/or atoms. Complex, feature-rich. |
| **Template** | `components/templates/` | Layout structure only. No business logic, no DS state. New layer — currently absent. |
| **Page** | Storybook pages only | Specific instances of templates with real content. Lives in Storybook, not the component library. |

Layer violations — a molecule composing a molecule, an atom importing a DS component — are `code-quality` tickets and are resolved before the component above them is touched.

---

## System Components

### 1. Scanner (`scripts/scan-gaps.mjs`)

A Node.js ESM script, run on demand: `node scripts/scan-gaps.mjs`

**Detects:**
- Missing `.test.tsx` file alongside a component → `test-coverage` gap
- Component source missing `React.forwardRef` → `code-quality` gap
- Registry spec (`.mdx`) exists in `packages/registry/components/` but no implementation → `unimplemented` gap
- Component imports from the wrong atomic layer (e.g. molecule importing organism) → `code-quality` gap
- TypeScript errors (parsed from `tsc --noEmit` output) → `code-quality` gap

**Outputs:**
- `tickets.md` at repo root — machine-readable checklist, one section per component, stores GH issue number
- Creates GitHub issues via `gh issue create` with labels and milestone
- Closes resolved issues via `gh issue close` when all gaps for a component are fixed
- Supports `--component <Name>` flag for single-component scan (used during execution loop)
- Supports `--dry-run` flag to preview without writing to GH

**Idempotency:** The script stores GH issue numbers in `tickets.md`. Re-running never creates duplicates — it diffs the current gap list against the stored state and only creates/closes what changed.

### 2. `tickets.md` (generated)

Source of truth for the loop. Format:

```markdown
# DS Foundation — Coverage Tickets
Generated: 2026-04-10 | Open: 62 | Closed: 0

## Atoms

### Button (#12) — code-quality
- [x] Missing React.forwardRef — RESOLVED
Labels: code-quality

### Input (#14) — test-coverage
- [ ] Missing test file
Labels: test-coverage
```

### 3. GitHub Structure

**Milestone:** `Design System Coverage`

**Labels:**
- `test-coverage` — no `.test.tsx` exists
- `unimplemented` — spec exists, no component code
- `code-quality` — forwardRef missing, layer violation, or TS error

**Issue title format:**
```
[atom] Button — code-quality
[molecule] Form — unimplemented
[organism] Dialog — test-coverage
```

**Issue body (generated from scanner):**
```markdown
## Component: <Name> (<layer>)

**Atomic layer:** <layer rule description>

## Gaps
- [ ] Missing test file
- [ ] Missing React.forwardRef

## Registry spec
<contents of .mdx spec if unimplemented — variants, ARIA role, ai-prompt>

## Acceptance criteria
- [ ] All gaps above checked off
- [ ] `npx vitest run` passes
- [ ] `npm run typecheck` passes
- [ ] `node scripts/scan-gaps.mjs --component <Name>` → 0 gaps
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
```

### 4. CHANGELOG.md

Maintained throughout the loop. Format follows Keep a Changelog:

```markdown
## [Unreleased]

### Added
- `Input` — Vitest tests: render, controlled value, disabled state, aria-label

### Fixed
- `Avatar` — added React.forwardRef for DOM ref forwarding
- `Segmented` — corrected atomic layer (molecule, not atom)

### Changed
- `Dialog` — animation classes gated behind useReducedMotion
```

Every closed ticket appends one or more entries before the GH issue closes. The scanner has a sentinel check: if `CHANGELOG.md` has no `[Unreleased]` section, it creates a `code-quality` ticket for it.

---

## Execution Loop

```
1. node scripts/scan-gaps.mjs
   → writes/updates tickets.md
   → creates/updates GitHub issues
   → prints: "N gaps across M components"

2. Pick highest-priority open ticket (atomic bottom-up order):
   Priority 1: unimplemented atoms
   Priority 2: unimplemented molecules/organisms
   Priority 3: test-coverage — atoms, then molecules, then organisms
   Priority 4: code-quality gaps (forwardRef, layer violations, TS errors)

3. Dispatch implementer subagent (subagent-driven-development) with:
   - Full component source
   - Registry spec .mdx content
   - Atomic layer rules for this component
   - Issue body as acceptance criteria

4. Spec compliance review → code quality review (two-stage)

5. Run checks:
   npx vitest run
   npm run typecheck
   node scripts/scan-gaps.mjs --component <Name>

6. All clean →
   - Update CHANGELOG.md
   - Check off items in tickets.md
   - Close GH issue: gh issue close <number>

7. Every 5 tickets → re-run full scanner
   (catches newly revealed gaps, e.g. a molecule test reveals
    a missing atom dependency)

8. Repeat from step 1
```

---

## Exit Condition

Three gates must all be true simultaneously:

```
✓ node scripts/scan-gaps.mjs  →  "0 gaps found"
✓ npx vitest run              →  all tests pass
✓ npm run typecheck           →  0 errors
```

When all three are green, the scanner calls `gh api` to close the `Design System Coverage` milestone.

---

## Templates Layer

When the last organism ticket closes, the scanner creates one additional ticket:

```
[templates] Layer scaffold — unimplemented
```

This ticket implements the `packages/react/src/components/templates/` directory with:
- `PageLayout.tsx` — full-page shell (header slot, sidebar slot, main slot, footer slot)
- `SidebarLayout.tsx` — two-column: fixed sidebar + scrollable content area
- `TwoColumnLayout.tsx` — equal or asymmetric two-column grid

Templates: pure layout (CSS Grid/Flex), zero DS state, zero business logic. Exported from `packages/react/src/index.ts`. Each gets a test (renders correct slot structure) and a Storybook story.

---

## Files Touched

| File | Action |
|---|---|
| `scripts/scan-gaps.mjs` | **Created** — scanner script |
| `tickets.md` | **Generated** — loop source of truth |
| `CHANGELOG.md` | **Updated** — entry per closed ticket |
| `packages/react/src/components/atoms/*.test.tsx` | **Created** — 18 missing test files |
| `packages/react/src/components/molecules/*.test.tsx` | **Created** — 17 missing test files |
| `packages/react/src/components/organisms/*.test.tsx` | **Created** — 12 missing test files |
| `packages/react/src/components/atoms/<domain>*.tsx` | **Created** — ~10 domain atoms (icon-button, currency-badge, tag, status-pill, etc.) |
| `packages/react/src/components/molecules/<domain>*.tsx` | **Created** — ~3 domain molecules (detail-card, form-card, kpi-card) |
| `packages/react/src/components/templates/` | **Created** — new Atomic layer (3 layout components) |
| `packages/react/src/components/templates/*.test.tsx` | **Created** — template tests |
| `packages/react/src/components/**/*.tsx` | **Modified** — forwardRef, layer fixes, TS fixes |
| `packages/react/src/index.ts` | **Modified** — exports for new components and templates |
| `packages/registry/components/*.mdx` | **Modified** — 13 domain components implemented |

---

## Scope Boundaries

**In scope:**
- All 57 implemented components in `packages/react/src/components/`
- 13 domain components defined in registry specs but not yet implemented
- Templates layer scaffold (3 components)
- CHANGELOG.md maintenance
- GitHub milestone + issues

**Out of scope:**
- Visual regression tests (Chromatic/Storybook) — tracked separately
- Storybook story gaps — separate sprint
- Documentation site (`apps/docs`) content — separate sprint
- Performance benchmarks
- Accessibility audits beyond ARIA attribute testing
