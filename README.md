# DS Foundation

Design system for the Ripple Treasury product — tokens, components, brand assets, and theme infrastructure in one place.

## Repository layout

```
ds-foundation/
├── brand/                 Brand assets (logos, backgrounds) organised by product
│   └── smartr/              SmartR suite — 32 logo variants, 48 background images
├── packages/
│   ├── tokens/              Design tokens (DTCG 2025.10) → CSS, Tailwind, JS, SCSS
│   ├── react/               React component library (72 components)
│   ├── core/                Framework-agnostic types and adapter contracts
│   └── registry/            Machine-readable component specs (MDX + Velite)
├── apps/
│   ├── docs/                Documentation site (Next.js + Nextra)
│   └── storybook/           Component development and visual review
├── scripts/                 Token validation, registry build, Figma Code Connect
└── template/                Reference Next.js app consuming the design system
```

### For designers

| You need | Go here |
|----------|---------|
| Logos and brand assets | `brand/smartr/` |
| Colour tokens with hex values | `packages/tokens/src/primitives/color.tokens.json` |
| Semantic colour decisions | `packages/tokens/src/semantic/` |
| Component API and variants | `apps/docs/` or `packages/registry/components/` |
| Design principles | `DESIGN_PRINCIPLES.md` |

### For engineers

| You need | Go here |
|----------|---------|
| Install the React package | `npm install @ds-foundation/react` |
| CSS custom properties (`--ds-*`) | `packages/tokens/build/css/variables.css` |
| Tailwind config | `packages/tokens/build/tailwind/preset.css` |
| JS token constants | `@ds-foundation/tokens` |
| Component source | `packages/react/src/components/` |
| Component docs | `apps/docs/pages/components/` |

## Packages

| Package | Purpose |
|---|---|
| `@ds-foundation/react` | React component library — atoms, molecules, organisms, templates |
| `@ds-foundation/tokens` | Design tokens — CSS custom properties, Tailwind preset, JS exports (DTCG 2025.10) |
| `apps/storybook` | Component development and visual review |
| `apps/docs` | Documentation site |

## Install

```bash
npm install @ds-foundation/react
```

```ts
import { Button, DesignSystemProvider } from '@ds-foundation/react'
import '@ds-foundation/react/styles.css'
```

That's the entire setup. No additional configuration, no peer deps to manage.

## Components

Components are organized into four layers:

```
atoms/       Button, Input, Badge, Checkbox, Kbd, Label, Skeleton, Switch, Spinner, Typography…
             CurrencyBadge, Tag, StatusPill, StatusRing, StateBadge, UrgencyBadge, BankingWindowDot…
molecules/   Card, Form, Select, Tabs, Tooltip, DatePicker, Pagination…
             MonoAmount, FreshnessChip, DetailCard, FormCard, KpiCard…
organisms/   Accordion, AlertDialog, Command, Dialog, Drawer, Menubar, NavigationMenu,
             Sidebar, Table, Timeline, EmptyState…
templates/   PageLayout, SidebarLayout, TwoColumnLayout
```

All components consume `--ds-*` CSS custom properties — they respond to light, dark, and wireframe themes automatically.

## Themes

Wrap your app with `DesignSystemProvider`:

```tsx
import { DesignSystemProvider } from '@ds-foundation/react'

export default function App({ children }) {
  return (
    <DesignSystemProvider defaultTheme="light">
      {children}
    </DesignSystemProvider>
  )
}
```

Available themes: `'light'` | `'dark'` | `'wireframe'`

Theme state persists to `localStorage` automatically.

**ThemeToggle** — drop-in button that cycles through all three themes:

```tsx
import { ThemeToggle } from '@ds-foundation/react'

<ThemeToggle />  // no props required
```

**useTheme** — build a custom toggle:

```tsx
import { useTheme } from '@ds-foundation/react'

function MyToggle() {
  const { theme, setTheme } = useTheme()
  return <button onClick={() => setTheme('dark')}>{theme}</button>
}
```

**Wireframe mode** — brand-neutral palette for prototyping and customer testing. Applied the same way as dark mode:

```tsx
<DesignSystemProvider defaultTheme="wireframe">
  {/* all components render in neutral gray/blue — no Ripple branding */}
</DesignSystemProvider>
```

The `sketch:` Tailwind variant applies wireframe-specific one-off overrides:

```tsx
<div className="bg-ds-surface sketch:border-dashed sketch:border-2">
```

## Tokens

All visual properties come from `--ds-*` semantic tokens. Never hardcode hex values or pixel values that map to a token.

```css
/* Correct */
color: var(--ds-text);
background: var(--ds-surface);
border-color: var(--ds-border);

/* Never do this */
color: #1a1a1a;
```

Key token groups:

| Group | Examples |
|---|---|
| Surfaces | `--ds-bg`, `--ds-surface`, `--ds-surface-up`, `--ds-sunken` |
| Text | `--ds-text`, `--ds-text-muted`, `--ds-text-disabled` |
| Borders | `--ds-border`, `--ds-border-strong`, `--ds-border-focus` |
| Brand | `--ds-primary`, `--ds-primary-hover`, `--ds-primary-fg`, `--ds-primary-subtle` |
| Feedback | `--ds-feedback-success`, `--ds-feedback-warning`, `--ds-feedback-error`, `--ds-feedback-info` |

Dark mode and wireframe mode override these tokens — component code never needs to know which theme is active.

**Tailwind:** tokens are available as `ds.*` utility classes:

```tsx
<div className="bg-ds-surface text-ds-text border border-ds-border rounded-md" />
```

The full token reference — primitive scales, semantic aliases, and dark/wireframe overrides — is in [`packages/tokens/`](./packages/tokens/).

## Development

**Prerequisites:** Node.js 20+, npm 10+

```bash
git clone git@github.com:ds-foundation/ds-foundation-rt.git
cd ds-foundation-rt
npm install
npm run dev
```

| Command | What it does |
|---|---|
| `npm run dev` | Start all dev servers |
| `npm run build` | Build all packages |
| `npm run typecheck` | TypeScript check across monorepo |
| `npm run build:tokens` | Build tokens package only |
| `npm run dev:storybook` | Storybook on localhost:6006 |
| `npm run dev:docs` | Docs on localhost:3000 |

## Adding a component

1. Create the file in the correct layer: `packages/react/src/components/atoms/MyComponent.tsx`
2. Add a Storybook story: `packages/react/src/components/atoms/MyComponent.stories.tsx`
3. Export from the barrel: `packages/react/src/index.ts`
4. Run `npm run typecheck` — zero errors required
5. Add a changeset: `npx changeset`
6. Open a PR

**Layer guide:**
- **atom** — single HTML element or Radix primitive, no DS component composition
- **molecule** — composes atoms, moderately complex
- **organism** — complex, feature-rich, may compose molecules and atoms
- **template** — page-level layout shells; no business logic, slot-based composition

## Publishing

```bash
npx changeset        # record what changed and at what semver bump
npx changeset version  # bump versions + write CHANGELOGs
git add . && git commit -m "chore: version packages"
npm run build
# push + create release PR
```

Packages publish to GitHub Packages under `@ds-foundation`.

**`.npmrc` for consumers:**

```
@ds-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Design Principles

Five rules that govern every component decision in this system — read them before contributing:

1. **Restraint by default** — components are neutral at rest; colour communicates intent, not decoration
2. **Token-first, always** — every visual property comes from a `--ds-*` token; hardcoded values are bugs
3. **Accessible without configuration** — ARIA, contrast, and keyboard support are built in; consumers inherit them
4. **Composable, not monolithic** — components do one thing; complex UI is built by combining them
5. **Three themes, one codebase** — light, dark, and wireframe are equal first-class themes; component code never checks which theme is active

Full rationale with examples: [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

Quick path for adding a component:

1. Pick the right layer: `atoms/` `molecules/` `organisms/`
2. Create `packages/react/src/components/{layer}/MyComponent.tsx` using `React.forwardRef`
3. Add `packages/react/src/components/{layer}/MyComponent.stories.tsx`
4. Export from `packages/react/src/index.ts`
5. Run `npm run typecheck` — zero errors required
6. `npx changeset` → open a PR

Never hardcode hex values — every visual property must come from a `--ds-*` token.

## Known constraints

- **Single barrel export** — `import { Button } from '@ds-foundation/react'` pulls the full bundle. Tree-shaking is not currently supported. For an internal package this is acceptable; revisit if consumers need sub-entry-points.
- **Form-related deps bundled** — `react-hook-form`, `zod`, and `date-fns` are included in the bundle. If your app already uses different form or date libraries, you're shipping both.
- **Storybook stories incomplete** — domain components and templates are missing Storybook stories; stories for the core library exist. Chromatic visual baseline not yet captured.
- **Wireframe palette is hardcoded CSS** — `semantic.wireframe.css` uses hex values rather than token primitives. Intentional for now; updating the wireframe palette means editing the CSS directly.

## Roadmap

Outstanding work — full detail in the [docs Roadmap tab](./apps/docs/pages/roadmap.mdx).

| Status | Item |
|--------|------|
| In PR | Atomic coverage loop — 72 components, 335 tests, 0 TS errors (#76) |
| Next | Accessibility audit — axe-core pass, 0 critical violations |
| Next | Chromatic visual baseline |
| Next | Registry MDX specs for 13 domain components |
| Next | Foundations docs section (colour, spacing, typography, motion) |
| Parked | Storybook stories for domain components and templates |
| Backlog | Tree-shaking / sub-entry-points |
| Backlog | Wireframe token primitives (currently hardcoded CSS) |
| Backlog | Animation tokens (`--ds-duration-*`) |

## Tech stack

- **Monorepo:** Turborepo + npm workspaces
- **Tokens:** Style Dictionary v4, DTCG 2025.10 format
- **Components:** React 18 + Radix UI (headless) + Tailwind CSS v3
- **Build:** tsup (ESM + CJS + types)
- **Docs:** Next.js 15 + Nextra
- **Visual review:** Storybook 8 + Chromatic
- **Versioning:** Changesets → GitHub Packages
- **TypeScript:** 5.7 strict
