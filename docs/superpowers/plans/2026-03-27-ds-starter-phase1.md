# DS Starter Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn ds-foundation-rt into a fully operational living design system — packages published to GitHub Packages, CI wired, a ready-to-run Next.js 15 project template, and a team onboarding guide.

**Architecture:** Monorepo (Turborepo) publishes `@ds/tokens`, `@ds/core`, and `@ds/registry` to GitHub Packages. A `template/` directory contains a pre-wired Next.js 15 app that consumes those packages. GitHub Actions handles validation, Chromatic preview deploys on PRs, and Changesets-driven publishing on merge to main.

**Tech Stack:** Turborepo, Style Dictionary v4, Velite, Next.js 15, Auth.js, Prisma, Tailwind v4, Storybook 8, Chromatic, Changesets, GitHub Actions, GitHub Packages.

**Spec:** `docs/superpowers/specs/2026-03-27-ds-starter-consolidation-design.md`

---

## File Map

### New files
| Path | Purpose |
|------|---------|
| `.changeset/config.json` | Changesets configuration |
| `.github/workflows/ci.yml` | Validate tokens + registry on every PR |
| `.github/workflows/chromatic.yml` | Deploy Storybook preview to Chromatic on PR |
| `.github/workflows/release.yml` | Changesets version bump + GitHub Packages publish on merge to main |
| `.github/PULL_REQUEST_TEMPLATE/component-contribution.md` | PR template for component contributions |
| `.github/ISSUE_TEMPLATE/component-proposal.yml` | Designer issue template for component proposals |
| `template/package.json` | Next.js 15 app — `@ds/*` as dependencies |
| `template/.npmrc` | GitHub Packages registry config for `@ds` scope |
| `template/.env.example` | DB URL, auth secret, DS_MCP_PORT |
| `template/next.config.mjs` | Next.js config (transpile `@ds/*`) |
| `template/tailwind.config.ts` | Imports `@ds/tokens/tailwind` preset |
| `template/src/app/layout.tsx` | Root layout — imports DS CSS, sets theme |
| `template/src/app/page.tsx` | Starter landing page |
| `template/src/app/globals.css` | CSS entry — `@import "@ds/tokens/css"` |
| `template/src/lib/auth.ts` | Auth.js config stub |
| `template/prisma/schema.prisma` | PostgreSQL schema placeholder |
| `template/CLAUDE.md` | Pre-configured DS rules for Claude Code |
| `template/Skills/component-generation.md` | Copied from `.claude/skills/` |
| `template/Skills/token-resolution.md` | Copied from `.claude/skills/` |
| `template/Skills/registry-validation.md` | Copied from `.claude/skills/` |
| `template/Skills/accessibility-audit.md` | Copied from `.claude/skills/` |
| `template/.claude/settings.json` | MCP server config pointing to `localhost:${DS_MCP_PORT\|3100}` |
| `template/tsconfig.json` | TypeScript config for the template app |
| `docs/how-to-guide.md` | Team onboarding guide |

### Modified files
| Path | Change |
|------|--------|
| `packages/tokens/package.json` | Add `publishConfig` for GitHub Packages |
| `packages/core/package.json` | Add `publishConfig`, fix `exports` to point to `dist/` |
| `packages/registry/package.json` | Add `publishConfig`, add `main`/`exports` fields |
| `packages/tokens/sd.config.mjs` | Fix Tailwind preset `undefined` values bug |
| `package.json` (root) | Add `release` script (`changeset publish`) |

---

## Task 1: Fix Tailwind Preset `undefined` Values

The `packages/tokens/build/tailwind/preset.css` currently outputs `undefined` for all token values. The template depends on this working correctly.

**Files:**
- Modify: `packages/tokens/sd.config.mjs`
- Verify: `packages/tokens/build/tailwind/preset.css`

- [ ] **Step 1: Reproduce the bug**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npm run build:tokens 2>&1 | grep -A2 "tailwind"
head -5 packages/tokens/build/tailwind/preset.css
```

Expected: `--ds-color-neutral-0: undefined;` (the bug)

- [ ] **Step 2: Diagnose — add a one-line log to the format**

In `packages/tokens/sd.config.mjs`, temporarily update the `ds/tailwind/css-theme` format to log the first token's properties:

```js
StyleDictionary.registerFormat({
  name: 'ds/tailwind/css-theme',
  format: ({ dictionary }) => {
    // Debug — remove after fix
    const first = dictionary.allTokens[0];
    console.log('DEBUG first token:', JSON.stringify({ name: first.name, type: first.type, $type: first.$type, value: first.value, $value: first.$value }, null, 2));
    const lines = dictionary.allTokens.map((t) => `  --${t.name}: ${t.value};`);
    return `@theme {\n${lines.join('\n')}\n}\n`;
  },
});
```

Run: `cd packages/tokens && node sd.config.mjs 2>&1 | grep -A15 "DEBUG first token"`

This tells us whether `t.value` is undefined (transforms not setting it) and whether `t.$type` vs `t.type` is the naming SD v4 uses.

- [ ] **Step 3: Identify root cause and fix**

**Root cause:** `ds/color/css` updates `t.$value` (as well as `t.value`) to the oklch string during the transform chain. When `ds/color/hex-fallback` runs next, it reads `t.$value` — which is now the oklch string, not the original DTCG object. The string fails the `typeof v === 'object'` check and falls through to `String(v)`. The Tailwind format reads `t.value` which is whatever `hex-fallback` returned — `String(undefinedOrString)`. For Tailwind tokens, `t.value` may be left as `undefined` if no transform matched.

Fix — update the `ds/tailwind/css-theme` custom format to fall back to `t.$value.hex` when `t.value` is not a string, and update the Tailwind platform to use a `TAILWIND_TRANSFORMS` constant that excludes `ds/color/css` (so `hex-fallback` reads from the unmodified DTCG `$value`):

```js
// Add before the configs array in sd.config.mjs:
const TAILWIND_TRANSFORMS = [
  'ts/resolveMath',
  'ds/dimension/css',
  'ds/color/hex-fallback',  // hex only — exclude ds/color/css so $value stays as DTCG object
  'name/kebab',
];
```

Also update the `ds/tailwind/css-theme` format (replace the temporary debug version):

```js
StyleDictionary.registerFormat({
  name: 'ds/tailwind/css-theme',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((t) => {
      // Prefer t.value (set by transforms); fall back to hex from raw $value for DTCG color objects
      const v = (t.value != null)
        ? t.value
        : (typeof t.$value === 'object' && t.$value !== null && 'hex' in t.$value)
          ? t.$value.hex
          : String(t.$value);
      return `  --${t.name}: ${v};`;
    });
    return `@theme {\n${lines.join('\n')}\n}\n`;
  },
});
```

Update the Tailwind platform config to use `TAILWIND_TRANSFORMS`:

```js
  // Tailwind v4
  {
    ...LOG_CONFIG,
    source: [...PRIMITIVES, 'src/semantic/light/color.tokens.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      tailwind: {
        prefix: 'ds',
        transforms: TAILWIND_TRANSFORMS,
        buildPath: 'build/tailwind/',
        files: [{ destination: 'preset.css', format: 'ds/tailwind/css-theme' }],
      },
    },
  },
```

- [ ] **Step 4: Remove debug code, rebuild, verify**

Remove the debug block added in Step 2, then:

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npm run build:tokens 2>&1 | tail -10
head -10 packages/tokens/build/tailwind/preset.css
```

Expected output — no `undefined`, real hex values:
```
@theme {
  --ds-color-neutral-0: #ffffff;
  --ds-color-neutral-50: #f8fafc;
  ...
}
```

- [ ] **Step 5: Verify full build still passes**

```bash
npm run build 2>&1 | tail -5
```

Expected: all tasks successful (count ≥ 6)

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/sd.config.mjs packages/tokens/build/
git commit -m "fix(tokens): resolve tailwind preset undefined values

Use hex-fallback transform only for Tailwind output — ds/color/css
was converting DTCG color objects to oklch strings before hex-fallback
could extract the hex value.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Initialize Changesets

Changesets is already in `devDependencies`. This task configures it.

**Files:**
- Create: `.changeset/config.json`

- [ ] **Step 1: Initialize Changesets**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npx changeset init
```

Expected: creates `.changeset/config.json` and `.changeset/README.md`

- [ ] **Step 2: Update `.changeset/config.json`**

Replace the generated config with:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": [],
  "___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH": {
    "onlyUpdatePeerDependentsWhenOutOfRange": true
  }
}
```

`"access": "restricted"` — GitHub Packages requires this for scoped packages publishing to a private registry.

- [ ] **Step 3: Verify Changesets CLI works**

```bash
npx changeset status
```

Expected: `No changesets found` (correct — no pending changes yet)

- [ ] **Step 4: Commit**

```bash
git add .changeset/
git commit -m "chore: initialize Changesets for versioning

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Prepare Packages for GitHub Packages Publishing

Fix exports and add `publishConfig` to the three packages that will be published.

**Files:**
- Modify: `packages/tokens/package.json`
- Modify: `packages/core/package.json`
- Modify: `packages/registry/package.json`

- [ ] **Step 1: Update `packages/tokens/package.json`**

Add `publishConfig` (GitHub Packages requires this for scoped packages):

```json
{
  "name": "@ds/tokens",
  "version": "0.1.0",
  "description": "DTCG 2025.10 compliant design token source files and build pipeline",
  "type": "module",
  "main": "./build/js/tokens.js",
  "types": "./build/js/tokens.d.ts",
  "exports": {
    ".": "./build/js/tokens.js",
    "./css": "./build/css/variables.css",
    "./css/dark": "./build/css/variables.dark.css",
    "./scss": "./build/scss/_variables.scss",
    "./tailwind": "./build/tailwind/preset.css",
    "./json": "./build/json/tokens.flat.json"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "files": ["build/"],
  "scripts": {
    "build": "node sd.config.mjs",
    "build:tokens": "node sd.config.mjs",
    "dev": "node sd.config.mjs --watch",
    "clean": "rimraf build",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "style-dictionary": "^4.3.0",
    "@tokens-studio/sd-transforms": "^0.16.0",
    "rimraf": "^6.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Update `packages/core/package.json`**

Fix exports to point to built `dist/` files (not `.ts` source — npm consumers can't import TS directly):

```json
{
  "name": "@ds/core",
  "version": "0.1.0",
  "description": "Framework-agnostic adapter types, token contracts, and utility functions",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./adapter": {
      "import": "./dist/adapter/index.js",
      "types": "./dist/adapter/index.d.ts"
    },
    "./types": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./tokens": {
      "import": "./dist/tokens/index.js",
      "types": "./dist/tokens/index.d.ts"
    }
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "files": ["dist/"],
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf dist"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "rimraf": "^6.0.0"
  }
}
```

Also update `packages/core/tsconfig.json` to confirm `outDir` is `dist`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declarationDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Update `packages/registry/package.json`**

Add `main`, `exports`, `publishConfig`, and `files`:

```json
{
  "name": "@ds/registry",
  "version": "0.1.0",
  "description": "Component registry — JSON schemas, MDX specs, Velite pipeline",
  "type": "module",
  "main": "./registry.json",
  "exports": {
    ".": "./registry.json"
  },
  "publishConfig": {
    "registry": "https://npm.pkg.github.com",
    "access": "restricted"
  },
  "files": ["registry.json", "schemas/"],
  "scripts": {
    "build": "velite build",
    "dev": "velite dev",
    "prepack": "cp .velite/registry.json ./registry.json",
    "typecheck": "tsc --noEmit",
    "clean": "rimraf .velite registry.json"
  },
  "dependencies": {
    "@ds/tokens": "*"
  },
  "devDependencies": {
    "velite": "^0.2.0",
    "typescript": "^5.7.0",
    "rimraf": "^6.0.0",
    "zod": "^3.23.0"
  }
}
```

- [ ] **Step 4: Add root `.npmrc` for GitHub Packages auth**

Create `/Users/apacheco/Documents/Projects/ds-foundation/.npmrc`:

```
@ds:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

- [ ] **Step 5: Verify build still passes with updated package.json files**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npm run build 2>&1 | tail -5
```

Expected: all tasks successful (count ≥ 6)

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/package.json packages/core/package.json \
        packages/registry/package.json packages/core/tsconfig.json .npmrc
git commit -m "chore: prepare packages for GitHub Packages publishing

Add publishConfig, fix core exports to dist/, add registry main/exports,
add files[] arrays, add root .npmrc for @ds scope registry.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 4: GitHub Actions — CI Validate Workflow

Runs on every PR: build tokens, validate tokens, validate registry.

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/` directory**

```bash
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/.github/workflows
```

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  validate:
    name: Validate tokens and registry
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          # No registry-url here — that's only needed in release.yml for publishing

      - name: Install dependencies
        run: npm ci

      - name: Build tokens
        run: npm run build:tokens

      - name: Validate tokens
        run: npm run validate:tokens

      - name: Validate registry
        run: npm run validate:registry

      - name: Full build
        run: npm run build

      - name: Typecheck
        run: npm run typecheck
```

- [ ] **Step 3: Verify the YAML is valid**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npx js-yaml .github/workflows/ci.yml > /dev/null && echo "YAML valid"
```

Expected: `YAML valid`

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add validate workflow for PRs and main branch

Runs token build, validate:tokens, validate:registry, full build,
and typecheck on every PR and push to main.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 5: GitHub Actions — Chromatic Storybook Workflow

Deploys Storybook to Chromatic on every PR so design team can review components visually without reading code.

**Files:**
- Create: `.github/workflows/chromatic.yml`

- [ ] **Step 1: Create `.github/workflows/chromatic.yml`**

```yaml
name: Chromatic

on:
  pull_request:
    branches: [main]

jobs:
  chromatic:
    name: Publish Storybook to Chromatic
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Chromatic needs full history for TurboSnap

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build tokens (Storybook depends on these)
        run: npm run build:tokens

      - name: Publish to Chromatic
        uses: chromaui/action@v11
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          workingDir: apps/storybook
          buildScriptName: build
          onlyChanged: true   # TurboSnap — only test stories affected by the PR
          exitZeroOnChanges: true  # Don't fail CI on visual changes — let design team review
```

> **Prerequisites before this workflow runs:**
> 1. Create a free Chromatic account at https://www.chromatic.com
> 2. Connect the `ds-foundation-rt` GitHub repo
> 3. Copy the project token
> 4. Add it as a GitHub secret: repo Settings → Secrets → `CHROMATIC_PROJECT_TOKEN`

- [ ] **Step 2: Verify YAML is valid**

```bash
npx js-yaml .github/workflows/chromatic.yml > /dev/null && echo "YAML valid"
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/chromatic.yml
git commit -m "ci: add Chromatic Storybook workflow for PR design review

Publishes Storybook to Chromatic on every PR using TurboSnap
(only builds stories affected by the change). Design team
reviews via Chromatic UI without reading code.

Requires CHROMATIC_PROJECT_TOKEN secret — see workflow comments.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 6: GitHub Actions — Release Workflow

Changesets version bump + publish to GitHub Packages on merge to main.

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write       # to create GitHub releases + push version commits
      pull-requests: write  # to create the Changesets version PR
      packages: write       # to publish to GitHub Packages

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          registry-url: https://npm.pkg.github.com
          scope: "@ds"

      - name: Install dependencies
        run: npm ci

      - name: Build all packages
        run: npm run build

      - name: Create Release PR or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npm run release
          title: "chore: version packages"
          commit: "chore: version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: Add `release` script to root `package.json`**

In `package.json`, add to `scripts`:

```json
"release": "changeset publish"
```

- [ ] **Step 3: Verify YAML is valid**

```bash
npx js-yaml .github/workflows/release.yml > /dev/null && echo "YAML valid"
```

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/release.yml package.json
git commit -m "ci: add Changesets release workflow

On merge to main: if changesets are present, opens a version PR.
When version PR is merged, publishes @ds/* packages to GitHub Packages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 7: GitHub Templates — PR Template and Issue Template

**Files:**
- Create: `.github/PULL_REQUEST_TEMPLATE/component-contribution.md`
- Create: `.github/ISSUE_TEMPLATE/component-proposal.yml`

- [ ] **Step 1: Create PR template directory**

```bash
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/.github/PULL_REQUEST_TEMPLATE
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/.github/ISSUE_TEMPLATE
```

- [ ] **Step 2: Create `.github/PULL_REQUEST_TEMPLATE/component-contribution.md`**

```markdown
## Component Contribution

**Closes:** #<!-- issue number if originated from a designer proposal -->

### What this adds
<!-- One sentence: what component or pattern, and what it's used for -->

### Registry spec
- [ ] MDX spec added to `packages/registry/`
- [ ] All variants defined in the spec
- [ ] ARIA attributes listed in the `accessibility.aria` array
- [ ] No hardcoded hex values — all values use `var(--ds-*)` tokens
- [ ] Tailwind adapter mappings included in `adapters.tailwind`

### Storybook
- [ ] Story added to `apps/storybook/`
- [ ] Light and dark theme both checked in the story
- [ ] All variants shown in the story

### Checklist
- [ ] `npm run validate:registry` passes locally
- [ ] `npm run build` passes locally
- [ ] Changeset added (`npx changeset` — choose `minor` for new components)

### Chromatic preview
<!-- Chromatic will post a link here automatically after CI runs -->

### Design notes
<!-- Anything the design team should know when reviewing — edge cases, constraints, open questions -->
```

- [ ] **Step 3: Create `.github/ISSUE_TEMPLATE/component-proposal.yml`**

```yaml
name: Component Proposal
description: Propose a new component or pattern for the design system
title: "[Component]: "
labels: ["component-proposal", "needs-design-review"]
body:
  - type: input
    id: component-name
    attributes:
      label: Component name
      placeholder: e.g. DateRangePicker
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: What does this component do?
      description: Describe the component's purpose and where it's used in the product
    validations:
      required: true

  - type: input
    id: figma-link
    attributes:
      label: Figma link
      description: Link to the Figma frame or component
      placeholder: https://www.figma.com/file/...
    validations:
      required: true

  - type: textarea
    id: variants
    attributes:
      label: Intended variants
      description: List the variants this component needs (e.g. sizes, states, styles)
      placeholder: |
        - Size: sm, md, lg
        - State: default, disabled, error
    validations:
      required: true

  - type: textarea
    id: usage-context
    attributes:
      label: Where is this used?
      description: Which pages, flows, or features use this component?
    validations:
      required: false

  - type: checkboxes
    id: checklist
    attributes:
      label: Before submitting
      options:
        - label: I've checked the registry — this component doesn't already exist
          required: true
        - label: The Figma link is accessible to the team
          required: true
```

- [ ] **Step 4: Commit**

```bash
git add .github/PULL_REQUEST_TEMPLATE/ .github/ISSUE_TEMPLATE/
git commit -m "chore: add PR template and issue template

Component contribution PR template enforces registry checklist.
Designer component proposal issue template captures Figma link,
variants, and usage context.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Build the Next.js 15 Project Template

The largest task. Creates `template/` — a ready-to-run Next.js 15 app pre-wired to `@ds/*` packages.

**Files:** All `template/` files listed in the File Map above.

- [ ] **Step 1: Create template directory structure**

> **Architecture note:** `template/` has its own `package.json` but is **NOT** added to the root `package.json` workspaces array. It is intentionally standalone — it will be used as a GitHub Template, consumed by teams who clone it into a completely separate repo. Turborepo does not manage it. `template/node_modules` must be gitignored.

```bash
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/template/src/app
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/template/src/lib
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/template/prisma
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/template/public
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/template/Skills
mkdir -p /Users/apacheco/Documents/Projects/ds-foundation/template/.claude
```

- [ ] **Step 2: Create `template/package.json`**

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "private": true,
  "description": "Project started from ds-foundation-rt template",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:generate": "prisma generate"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0",
    "@prisma/client": "^6.0.0",
    "@ds/tokens": "^0.1.0",
    "@ds/core": "^0.1.0",
    "@ds/registry": "^0.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "prisma": "^6.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

- [ ] **Step 3: Create `template/.npmrc`**

```
@ds:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

- [ ] **Step 4: Create `template/.env.example`**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/myapp"

# Auth.js — generate with: openssl rand -base64 32
AUTH_SECRET="your-auth-secret-here"

# DS MCP Server port (default: 3100 — change if port is already in use)
DS_MCP_PORT=3100
```

- [ ] **Step 5: Create `template/tsconfig.json`**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

> Note: `"extends": "next"` is intentionally excluded — it requires `next` to be installed. Since `next` is in `dependencies`, running `npm install` after template setup will make it available, but the tsconfig itself is standalone to avoid issues if someone inspects the template before installing.

- [ ] **Step 6: Create `template/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ds/tokens', '@ds/core', '@ds/registry'],
};

export default nextConfig;
```

- [ ] **Step 7: Create `template/tailwind.config.ts`**

With Tailwind v4, configuration is primarily CSS-based. The `tailwind.config.ts` only needs content paths:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
```

- [ ] **Step 8: Create `template/src/app/globals.css`**

```css
/* Import Tailwind v4 */
@import "tailwindcss";

/* Import DS token @theme block — maps @ds/* values to Tailwind utility classes */
@import "@ds/tokens/tailwind";

/* Import DS Foundation design tokens — provides all --ds-* CSS custom properties */
@import "@ds/tokens/css";

/* Dark theme token overrides — activated via data-theme="dark" on <html> */
@import "@ds/tokens/css/dark" layer(theme-dark);

/* Apply dark theme overrides when data-theme="dark" is set on <html> */
@layer theme-dark {
  [data-theme="dark"] {
    /* Dark theme variables are scoped here via the imported dark CSS */
  }
}
```

- [ ] **Step 9: Create `template/src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with DS Foundation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create `template/src/app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main style={{ padding: 'var(--ds-spacing-8)', fontFamily: 'var(--ds-typography-font-family-sans)' }}>
      <h1 style={{ color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-spacing-4)' }}>
        DS Foundation Starter
      </h1>
      <p style={{ color: 'var(--ds-color-text-secondary)' }}>
        Design system tokens are live. Start building.
      </p>
    </main>
  );
}
```

- [ ] **Step 11: Create `template/src/lib/auth.ts`**

```ts
// Auth.js v5 configuration
// Docs: https://authjs.dev/getting-started
import NextAuth from 'next-auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Add providers here:
    // import GitHub from 'next-auth/providers/github'
    // GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET })
  ],
});
```

- [ ] **Step 12: Create `template/prisma/schema.prisma`**

```prisma
// Prisma schema
// Docs: https://www.prisma.io/docs/concepts/components/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Add your models here
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 13: Copy DS skills into `template/Skills/`**

```bash
cp /Users/apacheco/Documents/Projects/ds-foundation/.claude/skills/component-generation.md \
   /Users/apacheco/Documents/Projects/ds-foundation/template/Skills/

cp /Users/apacheco/Documents/Projects/ds-foundation/.claude/skills/token-resolution.md \
   /Users/apacheco/Documents/Projects/ds-foundation/template/Skills/

cp /Users/apacheco/Documents/Projects/ds-foundation/.claude/skills/registry-validation.md \
   /Users/apacheco/Documents/Projects/ds-foundation/template/Skills/

cp /Users/apacheco/Documents/Projects/ds-foundation/.claude/skills/accessibility-audit.md \
   /Users/apacheco/Documents/Projects/ds-foundation/template/Skills/
```

- [ ] **Step 14: Create `template/CLAUDE.md`**

```markdown
# Design System Contract — Project Claude Rules

Generated from: DS Foundation (ds-foundation-rt)
Spec: DTCG 2025.10 | Adapter: Tailwind | Framework: React + Next.js

---

## You are a design system-aware coding agent.

When generating any UI code, you MUST follow these rules without exception.

## Active Configuration
- Adapter: tailwind
- Framework: react (Next.js 15 App Router)
- Token format: css-variables — always use `var(--ds-*)` syntax
- Semantic theme: light (dark via `data-theme="dark"` on `<html>`)
- Primitive layer: Radix UI (headless, accessible)

## Registry
The design system registry defines all approved components, their variants, ARIA requirements, and Tailwind adapter mappings.

- MCP server: `localhost:${DS_MCP_PORT|3100}` — query for live component context
- Skills: `./Skills/` directory contains component-generation, token-resolution, registry-validation, accessibility-audit guides

## Rules
1. **Check the registry first.** Before building any UI element, check if a component exists in the registry via the MCP server (`get_component`) or Skills.
2. **Never hardcode values.** Use only semantic CSS custom properties: `var(--ds-color-brand-primary)`, `var(--ds-spacing-4)`, etc. Never hex, never raw px where tokens exist.
3. **Apply adapter mappings.** For Tailwind: use the class strings from the component's `adapters.tailwind` block.
4. **Implement all variants.** If a component schema defines `variants: [solid, outline, ghost]`, all three must be implemented.
5. **Include all ARIA.** The `accessibility.aria` array in each component schema is mandatory.
6. **Use Radix primitives.** All interactive components (buttons, dialogs, dropdowns, tooltips, menus) must wrap the corresponding Radix UI primitive.
7. **Annotate outputs.** Add a comment at the top of every generated component: `// @ds-component: {id} | @ds-adapter: tailwind | @ds-version: {version}`
8. **Propose before building custom.** If a component doesn't exist in the registry, output a spec stub and wait for confirmation before implementing. Contribute the new component back via a PR to ds-foundation-rt.

## Contribute New Components
Built something that should be shared? Open a PR to the source repo:
https://github.com/apacheco-RT/ds-foundation-rt

Use the component contribution PR template and attach a changeset.
```

- [ ] **Step 15: Create `template/.claude/settings.json`**

```json
{
  "mcpServers": {
    "ds-foundation": {
      "command": "node",
      "args": ["../../mcp/ds-server/src/index.js"],
      "env": {
        "DS_REGISTRY": "../../packages/registry/registry.json"
      }
    }
  }
}
```

> Note: This MCP config assumes the project template is being used alongside the ds-foundation monorepo during development. When the template is used standalone (after GitHub Packages are published), teams will run the MCP server separately and update the path accordingly. The how-to guide covers this.

- [ ] **Step 16: Add template to root `.gitignore`**

Ensure `template/node_modules` is ignored. Check the root `.gitignore` and add if missing:

```bash
grep "template/node_modules" /Users/apacheco/Documents/Projects/ds-foundation/.gitignore \
  || echo "template/node_modules" >> /Users/apacheco/Documents/Projects/ds-foundation/.gitignore
```

- [ ] **Step 17: Smoke-test the template builds**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation/template
npm install --registry https://registry.npmjs.org
npm run build 2>&1 | tail -15
```

Expected: Next.js build completes successfully. If it fails on `@ds/*` packages not found (because they're not published yet), temporarily substitute with local paths for the smoke test:

```bash
# Temporary local resolution for smoke test
npm install --save @ds/tokens@file:../packages/tokens \
                   @ds/core@file:../packages/core \
                   @ds/registry@file:../packages/registry
npm run build
```

- [ ] **Step 18: Commit**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
git add template/ .gitignore
git commit -m "feat: add Next.js 15 project template

Pre-wired with Auth.js, Prisma, Tailwind v4 + @ds/tokens,
CLAUDE.md design system rules, DS skills, and MCP config.

Teams clone this via GitHub Template to start a new project.
Consumes @ds/* from GitHub Packages.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Write Team Onboarding Guide

**Files:**
- Create: `docs/how-to-guide.md`

- [ ] **Step 1: Create `docs/how-to-guide.md`**

```markdown
# DS Foundation — Team How-To Guide

This guide covers everything a team member needs to work with the DS Foundation design system. No prior knowledge required.

---

## What is this repo?

DS Foundation is the single source of truth for how your team builds products. It contains:

- **Design tokens** — all colors, spacing, typography, motion, and shadow values
- **Component registry** — approved components with specs, variants, ARIA requirements, and Tailwind mappings
- **Project template** — a ready-to-run Next.js 15 app pre-wired to the design system
- **Claude Code context** — skills and rules so Claude Code understands the design system

---

## 1. Start a New Project

**Prerequisites:** GitHub account with access to this repo, Node.js 20+, PostgreSQL.

**Step 1: Authenticate with GitHub Packages**

Run once on your machine:
```bash
npm login --registry https://npm.pkg.github.com --scope @ds
# Username: your GitHub username
# Password: a GitHub Personal Access Token with read:packages scope
# Email: your email
```

To create a PAT: GitHub → Settings → Developer settings → Personal access tokens → New token → check `read:packages`.

**Step 2: Use the GitHub Template**

1. Go to https://github.com/apacheco-RT/ds-foundation-rt
2. Click **Use this template** → **Create a new repository**
3. Name your repo, set visibility, click **Create repository**

**Step 3: Clone your new repo**

```bash
git clone git@github.com:your-org/your-project.git
cd your-project
```

**Step 4: Configure environment**

```bash
cp .env.example .env
# Edit .env — add your DATABASE_URL and AUTH_SECRET
# Generate AUTH_SECRET: openssl rand -base64 32
```

**Step 5: Install and run**

```bash
npm install
npm run db:push     # creates DB tables from Prisma schema
npm run dev         # starts at http://localhost:3000
```

You now have a running app with the full design system available.

---

## 2. Using Design Tokens

All token values are available as CSS custom properties prefixed with `--ds-`.

**Colors:**
```css
color: var(--ds-color-text-primary);
background: var(--ds-color-surface-default);
border-color: var(--ds-color-border-default);
```

**Spacing:**
```css
padding: var(--ds-spacing-4);      /* 1rem */
gap: var(--ds-spacing-2);          /* 0.5rem */
margin-bottom: var(--ds-spacing-8); /* 2rem */
```

**Typography:**
```css
font-family: var(--ds-typography-font-family-sans);
font-size: var(--ds-typography-font-size-base);
font-weight: var(--ds-typography-font-weight-semibold);
```

**Rule: never hardcode hex values or pixel values that correspond to a token.** If a token exists for what you need, use it.

**Dark mode:** add `data-theme="dark"` to `<html>`. Token values swap automatically.

---

## 3. Using the MCP Server (Claude Code users)

The MCP server lets Claude Code query the design system registry in real time.

**Start the MCP server:**
```bash
# In the ds-foundation-rt directory (not your project directory):
cd path/to/ds-foundation-rt
npm run dev --filter=@ds/mcp-server
# Runs at localhost:3100 by default
```

Set `DS_MCP_PORT` in your project's `.env` if you use a different port.

Once running, Claude Code can use `get_component`, `list_components`, `resolve_token`, and `validate_component` tools automatically.

---

## 4. Contribute a New Component (Developer)

Built something that should be shared? Here's how to contribute it back.

**Step 1: Create a branch in ds-foundation-rt**

```bash
cd path/to/ds-foundation-rt
git checkout -b feat/component-name
```

**Step 2: Add the registry spec**

Create `packages/registry/components/your-component.mdx`. Use an existing spec as a template. The spec must include:
- `id`, `version`, `status`
- `variants` list
- `accessibility.aria` list
- `adapters.tailwind` class mappings

**Step 3: Add a Storybook story**

Create a story in `apps/storybook/` showing all variants in light and dark themes.

**Step 4: Add a changeset**

```bash
npx changeset
# Select @ds/registry
# Choose: patch (bug fix), minor (new component), major (breaking change)
# Write a one-sentence description
```

**Step 5: Validate locally**

```bash
npm run validate:registry
npm run build
```

Both must pass before opening a PR.

**Step 6: Open a PR**

Push your branch and open a PR. Use the **Component Contribution** PR template. Fill in all checklist items.

CI will run validation automatically. Chromatic will post a preview link for the design team.

---

## 5. Propose a New Component (Designer)

Don't write code? You can still propose components for the design system.

1. Go to https://github.com/apacheco-RT/ds-foundation-rt/issues
2. Click **New issue** → **Component Proposal**
3. Fill in the form: component name, description, Figma link, variants, usage context
4. Submit — a developer will pick it up and build it following the developer contribution path

---

## 6. Review a Component Contribution (Design Team)

When a developer opens a contribution PR:

1. **Click the Chromatic link** in the PR (posted automatically by CI)
2. Review the component in Storybook — check all variants, light and dark themes
3. If it looks right: approve the PR in GitHub
4. If changes are needed: leave comments on the PR

You do not need to read the code to review. Chromatic shows you exactly what will ship.

---

## 7. Update @ds/* Packages in an Existing Project

When new components or tokens are published:

```bash
npm update @ds/tokens @ds/core @ds/registry
```

Check the [CHANGELOG](https://github.com/apacheco-RT/ds-foundation-rt/releases) for what changed. Minor version bumps are safe to pull freely. Major bumps may require changes — read the changelog before upgrading.

---

## 8. Token Reference

| Category | Prefix | Example |
|----------|--------|---------|
| Color — brand | `--ds-color-brand-` | `--ds-color-brand-primary` |
| Color — surface | `--ds-color-surface-` | `--ds-color-surface-default` |
| Color — text | `--ds-color-text-` | `--ds-color-text-secondary` |
| Color — border | `--ds-color-border-` | `--ds-color-border-focus` |
| Color — feedback | `--ds-color-feedback-` | `--ds-color-feedback-error-bg` |
| Spacing | `--ds-spacing-` | `--ds-spacing-4` (= 1rem) |
| Typography — size | `--ds-typography-font-size-` | `--ds-typography-font-size-lg` |
| Typography — weight | `--ds-typography-font-weight-` | `--ds-typography-font-weight-bold` |
| Radius | `--ds-radius-` | `--ds-radius-md` |
| Shadow | `--ds-shadow-` | `--ds-shadow-md` |
| Motion — duration | `--ds-motion-duration-` | `--ds-motion-duration-fast` |
| Motion — easing | `--ds-motion-easing-` | `--ds-motion-easing-standard` |

Full token list: `packages/tokens/build/json/tokens.flat.json`

---

## Troubleshooting

**`npm install` fails with `Not found: @ds/tokens`**
You need to authenticate with GitHub Packages. Run the login command in Section 1, Step 1.

**MCP server not connecting**
Check that the server is running (`npm run dev --filter=@ds/mcp-server` in ds-foundation-rt). Check that `DS_MCP_PORT` in your `.env` matches the port the server started on.

**Token values not showing (all undefined)**
Make sure `@ds/tokens/css` is imported in your `globals.css` before any component CSS.

**Dark mode not working**
Add `data-theme="dark"` to the `<html>` element. The dark theme CSS is scoped to this attribute.
```

- [ ] **Step 2: Verify the guide renders correctly (no broken markdown)**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npx marked docs/how-to-guide.md > /dev/null && echo "Markdown valid"
```

If `marked` is not installed: `npm install -g marked` first, or skip this step and do a visual check.

- [ ] **Step 3: Commit**

```bash
git add docs/how-to-guide.md
git commit -m "docs: add team how-to guide

Covers: start a new project, use tokens, MCP server setup,
contribute components (developer + designer paths), design
team review via Chromatic, updating packages, token reference,
and troubleshooting.

Written for team members with no prior DS knowledge.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Final Verification + Push

- [ ] **Step 1: Full monorepo build passes**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npm run build 2>&1 | tail -5
```

Expected: all tasks successful (count ≥ 6; `template/` is NOT a workspace member so it won't appear here)

- [ ] **Step 2: Validate tokens and registry**

```bash
npm run ci:validate
```

Expected: both scripts exit 0

- [ ] **Step 3: Verify template structure is complete**

```bash
find template/ -type f | sort
```

Expected — all of these present:
```
template/.claude/settings.json
template/.env.example
template/.npmrc
template/CLAUDE.md
template/Skills/accessibility-audit.md
template/Skills/component-generation.md
template/Skills/registry-validation.md
template/Skills/token-resolution.md
template/next.config.mjs
template/package.json
template/prisma/schema.prisma
template/src/app/globals.css
template/src/app/layout.tsx
template/src/app/page.tsx
template/src/lib/auth.ts
template/tailwind.config.ts
template/tsconfig.json
```

- [ ] **Step 4: Verify CI workflows are present and valid**

```bash
ls .github/workflows/
# Expected: ci.yml  chromatic.yml  release.yml

for f in .github/workflows/*.yml; do
  npx js-yaml "$f" > /dev/null && echo "$f: valid"
done
```

- [ ] **Step 5: Check Changesets is configured**

```bash
npx changeset status
```

Expected: `No changesets found` (clean state)

- [ ] **Step 6: Push to GitHub**

```bash
git push
```

- [ ] **Step 7: Create a test changeset to verify the release workflow path**

```bash
npx changeset
# Select: @ds/tokens, @ds/core, @ds/registry (space to select, enter to confirm)
# Type: minor
# Summary: Initial release — token pipeline, adapter types, component registry
git add .changeset/
git commit -m "chore: add initial release changeset

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push
```

After push, the release workflow will open a **Version Packages** PR on GitHub. When that PR is merged, the packages will publish to GitHub Packages for the first time.

---

## What's Next (Phase 2)

Once Phase 1 is verified working:

1. **Merge the Version Packages PR** — publishes `@ds/*` v0.1.0 to GitHub Packages
2. **Test the template end-to-end** — use it to start an actual new project, verify install works with published packages
3. **Set up Chromatic** — create project at chromatic.com, add `CHROMATIC_PROJECT_TOKEN` secret to the repo
4. **Phase 2: Migrate into Starter repo** — `git subtree add` to bring everything into `mlawless-eng/Starter`, update GitHub Template flag, archive ds-foundation-rt
