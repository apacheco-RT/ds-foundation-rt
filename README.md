# DS Foundation

Design system monorepo for the Ripple Treasury product team. Single source of truth for tokens, components, patterns, and project scaffolding.

## What's in here

| Package | Purpose |
|---|---|
| `@ds-foundation/tokens` | Design tokens — CSS variables, Tailwind preset, JS exports (DTCG 2025.10) |
| `@ds-foundation/core` | Framework-agnostic adapter types and token contracts |
| `@ds-foundation/registry` | Component registry — MDX specs, ARIA requirements, adapter mappings |
| `@ds-foundation/mcp-server` | MCP server — exposes registry and tokens to Claude Code in real time |
| `apps/docs` | Next.js 15 + Nextra documentation site |
| `apps/storybook` | Storybook 8 component development and visual review hub |
| `template/` | Next.js 15 project starter — pre-wired to the design system |

## Quickstart

**Prerequisites:** Node.js 20+, npm 10+

```bash
git clone git@github.com:ds-foundation/ds-foundation-rt.git
cd ds-foundation-rt
npm install
npm run dev
```

## Using packages in a project

**1. Authenticate with GitHub Packages (once per machine):**

```bash
npm login --registry https://npm.pkg.github.com --scope @ds-foundation
# Username: your GitHub username
# Password: GitHub PAT with read:packages scope
```

**2. Add to your project's `.npmrc`:**

```
@ds-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

**3. Install:**

```bash
npm install @ds-foundation/tokens @ds-foundation/core @ds-foundation/registry
```

## Using tokens

All token values are CSS custom properties prefixed `--ds-`:

```css
/* Colors */
color: var(--ds-color-text-primary);
background: var(--ds-color-surface-default);
border-color: var(--ds-color-border-default);

/* Spacing */
padding: var(--ds-spacing-4);   /* 1rem */
gap: var(--ds-spacing-2);       /* 0.5rem */

/* Typography */
font-family: var(--ds-typography-font-family-sans);
font-size: var(--ds-typography-font-size-base);
```

Dark mode: add `data-theme="dark"` to `<html>`. Tokens swap automatically.

**Never hardcode hex values or pixel values that correspond to a token.**

## Tailwind

```css
/* In your globals.css */
@import "@ds-foundation/tokens/tailwind";  /* @theme block */
@import "@ds-foundation/tokens/css";       /* CSS custom properties */
```

## MCP Server (Claude Code)

The MCP server lets Claude Code query the design system registry in real time:

```bash
npm run dev --filter=@ds-foundation/mcp-server
# Runs at localhost:3100
```

Available tools: `get_component`, `list_components`, `resolve_token`, `validate_component`

## Contributing a component

1. Create a branch: `git checkout -b feat/my-component`
2. Add a registry spec: `packages/registry/components/my-component.mdx`
3. Add a Storybook story: `apps/storybook/src/stories/MyComponent.stories.tsx`
4. Validate: `npm run validate:registry && npm run build`
5. Add a changeset: `npx changeset`
6. Open a PR — CI runs validation, Chromatic deploys a visual preview

See `docs/how-to-guide.md` for the full contribution workflow.

## Commands

```bash
npm run dev              # Start all dev servers
npm run build            # Build all packages
npm run typecheck        # TypeScript check across monorepo
npm run validate:tokens  # DTCG 2025.10 compliance check
npm run validate:registry # Registry schema compliance check
npm run build:tokens     # Build tokens package only
npm run build:storybook  # Build Storybook
```

## Tech stack

- **Monorepo:** Turborepo + npm workspaces
- **Tokens:** Style Dictionary v4, DTCG 2025.10 format
- **Components:** Radix UI (headless), Tailwind v4
- **Docs:** Next.js 15 + Nextra
- **Visual review:** Storybook 8 + Chromatic
- **Registry:** Velite MDX pipeline
- **Versioning:** Changesets → GitHub Packages
- **TypeScript:** 5.7 strict

## Published packages

Packages are published to GitHub Packages under the `ds-foundation` org.

Registry: `https://npm.pkg.github.com`
Org: `@ds-foundation`
