# Design Spec: DS Starter — Living Design System + Project Template

**Date:** 2026-03-27
**Status:** Ready for review
**Author:** Alex Pacheco + Claude

---

## Overview

The goal is to create a single canonical repository — the evolved **Starter** — that serves as the source of truth for how every new project at the team is built. It combines a design system (tokens, components, patterns), a ready-to-run Next.js project template, and a contribution workflow that allows developers and designers to feed new work back into the shared library.

Projects start from this repo and stay connected to it via versioned npm packages. When new components or patterns are approved and merged, every project can update on its own schedule.

---

## Problem Statement

Today there are two disconnected repos with overlapping intent:

- **`ds-foundation-rt`** — a fully scaffolded design system (token pipeline, registry, MCP server, docs, Storybook) with no project template or contribution workflow
- **`mlawless-eng/Starter`** — a Claude Code governance template with rules, an empty Skills directory, and a broken pointer to a design system that doesn't exist yet

Neither is usable on its own. A developer starting a new project has no single place to go, no live connection to a design system, and no established way to contribute new components back.

---

## Design Decision: Consolidate into One Repo

**Recommendation: consolidate.** The Starter repo evolves to absorb ds-foundation's work and gains the project template and contribution infrastructure. `ds-foundation-rt` is retired once the migration is complete.

**Why one repo:**
- The stated goal is a single source of truth — two repos creates two PRs, two CI pipelines, two review locations, and synchronisation overhead
- The team is not large enough to warrant separate ownership of the design system vs. the project template
- No external consumers require a standalone published design system package (yet)
- Simpler mental model: one place to start a project, one place to contribute back

**Phased approach to avoid disruption:**
- **Phase 1** — Build the Next.js template and contribution workflow on top of ds-foundation where it already lives
- **Phase 2** — Migrate everything into the Starter repo; retire ds-foundation-rt

---

## Architecture

### Repository Structure (end state)

```
Starter/  (canonical team repo)
├── packages/
│   ├── tokens/         — Style Dictionary v4 token pipeline (DTCG 2025.10)
│   ├── core/           — Framework-agnostic adapter types and token contracts
│   └── registry/       — Velite MDX pipeline → typed JSON component registry
├── apps/
│   ├── docs/           — Next.js 15 + Nextra documentation site
│   └── storybook/      — Storybook 8 component development and review hub
├── mcp/
│   └── ds-server/      — MCP server exposing registry + tokens to Claude Code
├── template/           — NEW: Next.js 15 project starter (consumed by teams)
├── Skills/             — Claude Code skills (component-gen, token-resolution, etc.)
├── .claude/            — CLAUDE.md workspace rules + registry context snapshot
├── .github/
│   ├── workflows/      — CI: validate, build, publish (Changesets)
│   └── PULL_REQUEST_TEMPLATE/  — Component contribution PR template
├── docs/
│   └── how-to-guide.md — Team onboarding and contribution guide
├── CLAUDE.md           — Master workspace rules
└── turbo.json          — Turborepo build orchestration
```

### Package Registry

**Publishing target:** GitHub Packages under the `@ds` scope. Projects add the following to their `.npmrc` to resolve `@ds/*` packages:

```
@ds:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Auth uses `GITHUB_TOKEN` (available automatically in GitHub Actions; developers authenticate once with `npm login --registry https://npm.pkg.github.com`).

| Package | Contents | Semver policy |
|---------|----------|---------------|
| `@ds/tokens` | CSS variables, Tailwind preset, JS/TS token exports | Minor on new tokens, major on renames |
| `@ds/core` | Adapter types, token contracts | Major on breaking interface changes |
| `@ds/registry` | Component schemas, ARIA specs, adapter mappings | Minor on new components |

### Project Template (`template/`)

A ready-to-run Next.js 15 application with:
- **Auth.js** — authentication wired and configured
- **Prisma** — schema placeholder with PostgreSQL connection
- **Tailwind v4** — pre-configured to import `@ds/tokens` preset
- **CLAUDE.md** — pre-loaded with design system rules (check registry, use `var(--ds-*)` tokens, implement ARIA, wrap Radix primitives)
- **Skills/** — populated with ds-foundation skills (component-generation, token-resolution, registry-validation, accessibility-audit)
- **MCP config** — Claude settings pointing to the MCP server. Port is configurable via `DS_MCP_PORT` env var (default: `3100`). Teams running the MCP server locally must match this port or set the env var.
- **`@ds/tokens`, `@ds/core`, `@ds/registry`** — pre-installed in package.json with `.npmrc` pre-configured for GitHub Packages

---

## Contribution Workflow

### Developer → Design System

1. **Build locally** — Developer creates a new component or pattern in their project
2. **Open PR** — Submits PR to Starter repo adding:
   - Component spec in `packages/registry/` (MDX file: variants, states, ARIA, token usage, Tailwind mappings)
   - Story in `apps/storybook/` for visual review
3. **CI validates automatically** — `validate:registry` runs on PR, checks for hardcoded values, missing ARIA, schema compliance. Fails fast before human review
4. **Chromatic preview deploys** — PR branch auto-deploys Storybook to Chromatic so design team can interact with the component rendered in light/dark modes and density scales, without reading code. Chromatic is already a devDependency in `apps/storybook/`
5. **Design team reviews** — Checks: correct token usage, pattern consistency, accessibility, whether it belongs in the shared library
6. **Merged** — Changesets handles versioning (patch/minor/major based on change type)
7. **Published** — CI publishes updated `@ds/*` packages to GitHub Packages
8. **Projects update** — `npm update @ds/registry` (and other packages as needed) — each project updates on its own schedule

### Designer → Design System (v1: manual with GitHub issue template)

For v1, the designer contribution path is manual. Automated Figma-to-PR generation is post-v1.

1. **Designer files a GitHub issue** using a component proposal template (Name, description, Figma link, intended variants, usage context)
2. **A developer picks it up** and opens the PR as in the developer path above, referencing the issue
3. **Same review flow** from step 4 onward

The `publish-figma-connect.mjs` script in ds-foundation handles Figma Code Connect bindings (keeping Figma components linked to their code counterparts). Full automation of spec generation from Figma is a post-v1 investment.

---

## How Projects Start

1. Use Starter as a **GitHub Template** — one click creates a new repo pre-populated with `template/` contents
2. Clone the new repo
3. Fill in `.env` (database URL, auth secrets, `DS_MCP_PORT` if not using default 3100)
4. Run `npm install && npm run dev`
5. Design system tokens, Claude rules, skills, and MCP config are all present from the first commit

No design system configuration required. Tailwind, tokens, CLAUDE.md, and MCP config are pre-wired.

---

## How Projects Stay Current

Projects consume `@ds/*` as npm dependencies from GitHub Packages. To pull the latest components and tokens:

```bash
npm update @ds/tokens @ds/core @ds/registry
```

Version changes follow semver. Breaking changes (token renames, interface changes) are major bumps — require a deliberate upgrade decision. New components and tokens are minor bumps — safe to pull freely.

---

## Team Onboarding Guide

A `docs/how-to-guide.md` ships as part of the repo covering:
- What this repo is and how it relates to projects
- Step-by-step: start a new project from the template (including GitHub Packages auth setup)
- Step-by-step: contribute a new component (developer path)
- Step-by-step: propose a new component (designer path — GitHub issue template)
- How the design team reviews and approves contributions via Chromatic
- How to update `@ds/*` packages in an existing project
- Token usage reference (`var(--ds-*)`, semantic vs primitive tokens)
- MCP server setup for Claude Code users

Written for team members with no prior knowledge of the system.

---

## CI/CD

| Trigger | Pipeline |
|---------|----------|
| PR opened | `validate:tokens`, `validate:registry`, Chromatic Storybook preview deploy |
| Merge to main | Full build, Changesets version bump, publish to GitHub Packages |
| Scheduled (weekly) | `npm audit`, token drift check |

**Tools:** GitHub Actions, Changesets, Chromatic, Turborepo

---

## Phase Plan

### Phase 1 — Build on ds-foundation-rt (current repo)
- Add `template/` — Next.js 15 app with Auth.js, Prisma, Tailwind + `@ds/tokens`, CLAUDE.md, Skills, `.npmrc` pre-configured for GitHub Packages
- Configure Changesets for versioning
- Add `.github/workflows/` — CI validate, Chromatic deploy, build, publish to GitHub Packages
- Add `.github/PULL_REQUEST_TEMPLATE/` — component contribution PR template
- Add `.github/ISSUE_TEMPLATE/` — component proposal template for designers
- Add `docs/how-to-guide.md`
- Publish initial `@ds/tokens`, `@ds/core`, `@ds/registry` to GitHub Packages
- Wire template's `package.json` to consume published packages

### Phase 2 — Migrate into Starter repo
- Merge ds-foundation-rt history into `mlawless-eng/Starter` using `git subtree add` (preserves full commit history; cleaner than filter-repo for an additive merge of one repo into another)
- Update GitHub Template flag on Starter repo
- Archive ds-foundation-rt with a redirect notice pointing to Starter
- Update all internal references (CLAUDE.md paths, CI env vars, package registry scope)

---

## What Is Explicitly Out of Scope

- Multi-tenant or external-facing package publishing (v1 is internal/GitHub Packages only)
- Automated Figma-to-PR spec generation (v1 designer path is a GitHub issue → developer PR)
- A custom CLI (GitHub Template + npm packages is sufficient for v1)
- White-label token override system (planned in ds-foundation architecture, deferred to post-v1)
- Component implementation code in the registry (v1 contains specs and mappings only — implementation lives in consumer projects or a future `@ds/components` package)

---

## Success Criteria

- A developer with no prior context can start a new project from the template in under 10 minutes, measured by timing the process end-to-end from template click to `npm run dev` serving a page
- A component contribution PR can be reviewed and approved by the design team using only the Chromatic preview and PR description — no code reading required
- All `@ds/*` package consumers can update to the latest components and tokens with a single `npm update` command
- A team member unfamiliar with the system completes the new-project flow using only `docs/how-to-guide.md`, without asking for help — validated by testing with one team member before the guide ships
