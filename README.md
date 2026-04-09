# DS Foundation

Token-first, registry-driven design system for the Ripple Treasury product team. Ships semantic design tokens, 80+ React components, a component registry with accessibility specs, and an MCP server that makes everything queryable from Claude Code.

**Designers** spec components in the registry and review them in Storybook.  
**Engineers** install packages, consume tokens and components, and use the MCP server for AI-assisted development.

---

## What's in here

| Package | What it gives you |
|---|---|
| `@ds-foundation/tokens` | CSS custom properties (`--ds-*`), Tailwind theme block, SCSS variables, JS exports — DTCG 2025.10 |
| `@ds-foundation/react` | 80+ typed, accessible React components built on those tokens |
| `@ds-foundation/core` | Framework-agnostic token contracts and adapter types |
| `@ds-foundation/registry` | MDX component specs: variants, ARIA requirements, and AI prompts |
| `@ds-foundation/mcp-server` | MCP server — lets Claude Code query the registry and resolve tokens in real time |
| `apps/docs` | Documentation site (Next.js 15 + Nextra) |
| `apps/storybook` | Component development and visual review hub (Storybook 8) |
| `template/` | Next.js 15 starter pre-wired to the full design system |

---

## For designers

### See what exists

Every component has a Storybook story showing all variants and states. PRs automatically publish a live Storybook preview via Chromatic — the link appears in the PR checks.

To browse locally:

```bash
git clone git@github.com:ds-foundation/ds-foundation-rt.git
cd ds-foundation-rt
npm install && npm run dev:storybook
# Opens at http://localhost:6006
```

To browse component specs without running anything, look in `packages/registry/components/` — each `.mdx` file is the canonical spec for one component.

### Figma and tokens

Token values are synced to Figma automatically via the `sync-figma-tokens` CI workflow on every push to `main`. The Figma library stays in sync with the token source — edit tokens here, not in Figma directly.

### Token reference

Tokens are organized by semantic intent — what they're *for*, not what they look like. Never hardcode a color, spacing value, or type size that has a token counterpart.

| Category | What it covers |
|---|---|
| Color / surface | Background fills for containers, cards, and pages |
| Color / text | Text on light or dark surfaces |
| Color / border | Dividers, field outlines, card edges |
| Color / interactive | Primary actions, links, focus rings |
| Color / status | Success, warning, error, and info states |
| Spacing | Layout gaps and padding — 4px base grid |
| Typography | Font choice, size scale, weight, line height |
| Radius | Corner rounding |
| Shadow | Elevation levels for overlays and cards |
| Motion | Animation duration and easing curves |

Dark mode tokens live in a separate file and are scoped to `[data-theme="dark"]`. See the engineer setup below.

### Spec a new component

The registry is spec-first: if a component isn't specced, it doesn't get built. Designers own this step.

1. Copy `packages/registry/components/_template.mdx`
2. Rename it to `my-component.mdx`
3. Fill in the required fields (see below)
4. Run `node scripts/validate-registry.mjs` — fix any errors
5. Open a PR — engineers pick up the implementation from there

**Required fields:**

| Field | What goes here |
|---|---|
| `id` | Kebab-case, matches the component's code name (e.g. `icon-button`) |
| `variants` | Every visual variant — if it's not here, it won't be in code |
| `accessibility.role` | The ARIA role of the root element |
| `accessibility.wcag` | Which WCAG criteria apply (minimum: `1.4.3 Contrast`) |
| `accessibility.aria` | Required attributes that consumers must pass |
| `ai-prompt` | One paragraph describing the component for AI code generation |

---

## For engineers

### Prerequisites

Node.js 20+, npm 10+

### Run locally

```bash
git clone git@github.com:ds-foundation/ds-foundation-rt.git
cd ds-foundation-rt
npm install
npm run dev
```

Storybook at `http://localhost:6006`. Docs at `http://localhost:3000`.

### Install packages in your project

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

**3. Install what you need:**

```bash
# Tokens only (framework-agnostic)
npm install @ds-foundation/tokens

# Tokens + React components
npm install @ds-foundation/tokens @ds-foundation/react

# Full surface (tokens + components + registry + core types)
npm install @ds-foundation/tokens @ds-foundation/react @ds-foundation/core @ds-foundation/registry
```

### Use tokens

**CSS custom properties:**

```css
.my-component {
  color: var(--ds-color-text-primary);
  background: var(--ds-color-surface-default);
  border-color: var(--ds-color-border-default);
  padding: var(--ds-spacing-4);          /* 16px */
  border-radius: var(--ds-radius-md);
  font-size: var(--ds-typography-font-size-base);
}
```

**Dark mode** — import the dark token file and scope it to your theme attribute:

```css
@import "@ds-foundation/tokens/css";           /* --ds-* custom properties (light) */
@import "@ds-foundation/tokens/css/dark";      /* [data-theme="dark"] overrides */
```

Add `data-theme="dark"` to `<html>` to activate the dark theme. Tokens swap automatically.

**Tailwind v4:**

```css
/* globals.css */
@import "tailwindcss";
@import "@ds-foundation/tokens/tailwind";      /* @theme block — tokens as Tailwind utilities */
@import "@ds-foundation/tokens/css";           /* --ds-* custom properties */
@import "@ds-foundation/tokens/css/dark";      /* dark mode overrides */
```

### Use React components

Import from `@ds-foundation/react`. Components use the Radix UI composition pattern — there's no `options` prop shorthand; you compose the pieces directly. This gives you full control over rendering, ARIA attributes, and keyboard behavior.

```tsx
import {
  Button,
  Card, CardContent,
  Input,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@ds-foundation/react";
import "@ds-foundation/react/styles.css";

function Example() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <Input placeholder="Account name" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checking">Checking</SelectItem>
            <SelectItem value="savings">Savings</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="default">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

All variants and props are documented in Storybook. The registry spec for each component lists the full prop surface and ARIA expectations.

### Start a new project from the template

The `template/` directory is a Next.js 15 starter pre-wired to tokens, React components, and the MCP server:

```bash
cp -r template/ ../my-new-project
cd ../my-new-project
cp .env.example .env    # add GITHUB_TOKEN
npm install
npm run dev
```

### MCP server (Claude Code)

The MCP server exposes the full registry to Claude Code. Claude can look up component specs, resolve token values, and validate component usage in real time — without guessing APIs.

**Start the server:**

```bash
npm run dev --filter=@ds-foundation/mcp-server
# Runs at http://localhost:3100
```

**Wire it to Claude Code** (`.claude/settings.json` in your project):

```json
{
  "mcpServers": {
    "ds-foundation": {
      "url": "http://localhost:3100"
    }
  }
}
```

**Available tools:**

| Tool | What it does |
|---|---|
| `get_component` | Full spec: variants, ARIA requirements, token usage |
| `list_components` | All registered components |
| `resolve_token` | Token name → current value in the active theme |
| `validate_component` | Check a component usage against the spec |

---

## Adding a component (end-to-end)

1. **Spec** — create `packages/registry/components/my-component.mdx` (designer step)
2. **Implement** — add `packages/react/src/MyComponent.tsx`, use semantic tokens only
3. **Story** — add `packages/react/src/MyComponent.stories.tsx` alongside the component
4. **Validate:**
   ```bash
   npm run validate:registry && npm run validate:tokens && npm run typecheck
   ```
5. **Changeset:** `npx changeset` (patch / minor / major)
6. **PR** — CI runs all validators; Chromatic publishes a visual diff for review

---

## Commands

```bash
# Development
npm run dev                   # Start all dev servers
npm run dev:storybook         # Storybook only (port 6006)
npm run dev:docs              # Docs only (port 3000)

# Building
npm run build                 # Build all packages
npm run build:tokens          # Tokens only
npm run build:storybook       # Storybook static export

# Validation
npm run typecheck             # TypeScript across the monorepo
npm run validate:tokens       # DTCG 2025.10 compliance
npm run validate:registry     # Registry schema compliance
npm run ci:validate           # Both validators (runs in CI)

# Releasing
npx changeset                 # Stage a changeset before merging
npm run release               # Publish to GitHub Packages (CI only)
npm run clean                 # Remove all build artifacts
```

---

## Tech stack

| Layer | Tools |
|---|---|
| Monorepo | Turborepo + npm workspaces |
| Tokens | Style Dictionary v4, DTCG 2025.10 |
| Components | Radix UI (headless) + Tailwind v4 + React 18+ |
| Docs | Next.js 15 + Nextra |
| Visual review | Storybook 8 + Chromatic |
| Registry | Velite MDX pipeline |
| Versioning | Changesets → GitHub Packages |
| TypeScript | 5.7 strict |
