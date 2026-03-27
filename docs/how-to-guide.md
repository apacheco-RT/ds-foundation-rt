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

**Step 3: Clone and set up your new repo**

```bash
git clone git@github.com:your-org/your-project.git
cd your-project
cp .env.example .env
# Fill in DATABASE_URL, AUTH_SECRET, and optionally DS_MCP_PORT
npm install
npm run dev
```

Your app is now running at http://localhost:3000 with the full design system available.

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

**Start the MCP server** (in the ds-foundation-rt directory, not your project):
```bash
cd path/to/ds-foundation-rt
npm run dev --filter=@ds/mcp-server
# Runs at localhost:3100 by default
```

Set `DS_MCP_PORT` in your project's `.env` if you use a different port.

**Update `.claude/settings.json`** in your project to point to the running server. The template ships with relative paths that work when developing inside the monorepo. For standalone use, update the `args` path to an absolute path or a globally installed server.

Once running, Claude Code can use `get_component`, `list_components`, `resolve_token`, and `validate_component` tools automatically.

---

## 4. Contribute a New Component (Developer)

Built something that should be shared? Here's how to contribute it back.

**Step 1: Create a branch in ds-foundation-rt**
```bash
cd path/to/ds-foundation-rt
git checkout -b feat/my-component
```

**Step 2: Add a registry spec**

Create an MDX file in `packages/registry/src/components/` (copy an existing one as a starting point). The spec must define:
- Component name, description, and status
- All variants and states
- ARIA attributes in the `accessibility.aria` array
- Tailwind class mappings in `adapters.tailwind`
- Token usage (no hardcoded hex values)

**Step 3: Add a Storybook story**

Add a story in `apps/storybook/src/stories/`. The story must show all variants in both light and dark themes.

**Step 4: Validate locally**
```bash
npm run validate:registry  # Checks schema compliance, no hardcoded values, ARIA
npm run build              # Full monorepo build
```

Both must pass before opening a PR.

**Step 5: Add a changeset**
```bash
npx changeset
# Select: @ds/registry (for new components)
# Type: minor (new component = minor bump)
# Summary: "Add MyComponent"
```

**Step 6: Open a PR**

Use the component contribution PR template. The design team will review via the Chromatic preview — no code reading required on their end.

**Step 7: After merge**

CI automatically version-bumps and publishes `@ds/*` packages to GitHub Packages. Update your project:
```bash
npm update @ds/tokens @ds/core @ds/registry
```

---

## 5. Propose a New Component (Designer)

Not a developer? Use the GitHub issue template.

1. Go to https://github.com/apacheco-RT/ds-foundation-rt/issues/new/choose
2. Select **Component Proposal**
3. Fill in: component name, description, Figma link, intended variants, usage context
4. Submit — a developer will pick it up and open a PR

The developer follows the contribution workflow above, referencing your issue.

---

## 6. Review a Component Contribution (Design Team)

When a contribution PR is open:

1. Find the Chromatic link in the PR (posted automatically by CI)
2. Open the Chromatic preview — the component renders in all variants, light and dark
3. Check: correct token usage, pattern consistency, accessibility, fits the library
4. Approve or request changes via the Chromatic UI or PR comments

No code reading required. The CI validates token compliance and ARIA before the PR reaches you.

---

## 7. Update `@ds/*` Packages in an Existing Project

When new tokens or components are published:

```bash
npm update @ds/tokens @ds/core @ds/registry
```

Check the release notes (GitHub Releases) for breaking changes before upgrading major versions. New tokens and components are minor bumps — safe to pull freely.

---

## 8. Token Usage Reference

### Semantic vs Primitive tokens

Always use **semantic tokens** (intent-based names). Never use primitive tokens directly.

| ✅ Use this | ❌ Not this |
|---|---|
| `var(--ds-color-text-primary)` | `var(--ds-color-neutral-900)` |
| `var(--ds-color-surface-default)` | `var(--ds-color-neutral-0)` |
| `var(--ds-spacing-4)` | `16px` |

### Common semantic token groups

**Color — text:**
- `--ds-color-text-primary` — main body text
- `--ds-color-text-secondary` — secondary/muted text
- `--ds-color-text-disabled` — disabled state
- `--ds-color-text-on-brand` — text on brand-colored backgrounds

**Color — surface:**
- `--ds-color-surface-default` — page background
- `--ds-color-surface-raised` — cards, popovers
- `--ds-color-surface-overlay` — modals, drawers

**Color — border:**
- `--ds-color-border-default` — standard borders
- `--ds-color-border-strong` — emphasized borders
- `--ds-color-border-focus` — focus rings

**Color — brand:**
- `--ds-color-brand-primary` — primary brand color
- `--ds-color-brand-secondary` — secondary brand color

**Spacing (T-shirt sizing mapped to rem):**
- `--ds-spacing-1` = 0.25rem | `--ds-spacing-2` = 0.5rem | `--ds-spacing-4` = 1rem
- `--ds-spacing-8` = 2rem | `--ds-spacing-16` = 4rem

---

## Need help?

- Open an issue in this repo for questions about the design system
- Ping the design team in Slack for token usage questions
- Check the registry MDX specs in `packages/registry/src/components/` for component documentation
