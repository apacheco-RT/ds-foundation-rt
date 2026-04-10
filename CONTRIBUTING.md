# Contributing to DS Foundation

## Before you start

Check whether a component already exists in `packages/react/src/components/` before building something new.

---

## Adding a component

### 1. Place it in the right layer

| Layer | Path | When to use |
|---|---|---|
| `atoms/` | `packages/react/src/components/atoms/` | Single HTML element or Radix primitive, no DS composition |
| `molecules/` | `packages/react/src/components/molecules/` | Composes atoms, moderately complex |
| `organisms/` | `packages/react/src/components/organisms/` | Complex, feature-rich, may compose molecules |
| `organisms/` (domain) | Ship as a separate plugin | Domain/product-specific components |

### 2. Implement the component

Use `React.forwardRef` and extend the appropriate HTML interface:

```tsx
import * as React from 'react'
import { cn } from '../utils'

export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ label, className, ...props }, ref) => (
    <div ref={ref} className={cn('bg-ds-surface text-ds-text', className)} {...props}>
      {label}
    </div>
  )
)
MyComponent.displayName = 'MyComponent'

export { MyComponent }
```

Never hardcode visual values — use `--ds-*` semantic tokens or `ds.*` Tailwind classes. See [Token naming rules](#token-naming-rules) below.

### 3. Add a Storybook story

Create `packages/react/src/components/{layer}/MyComponent.stories.tsx` showing all variants and states.

### 4. Export from the barrel

Add the export to `packages/react/src/index.ts` in the correct layer section.

### 5. Write a registry spec (optional but encouraged)

Copy `packages/registry/components/_template.mdx` into `packages/registry/components/my-component.mdx` and fill in the fields. Key fields:
- `id` — kebab-case, matches the component name (e.g. `icon-button`)
- `variants` — list every variant. If it's not in the spec, reviewers will ask why
- `accessibility.role` — ARIA role of the root element
- `accessibility.wcag` — which WCAG criteria apply (minimum: `1.4.3 Contrast`)
- `ai-prompt` — one paragraph describing the component for AI code generation

### 6. Validate

```bash
node scripts/validate-registry.mjs     # 0 errors required (if spec added)
npm run validate:tokens                 # 0 errors required
npm run typecheck                       # 0 errors required
```

### 7. Add a changeset

```bash
npx changeset
# patch — bug fix or internal change
# minor — new component or new prop
# major — breaking change to existing API
```

### 8. Open a PR

CI runs all validators automatically. The PR description should include what layer the component lives in and a link to the Storybook story.

---

## Styling Convention

All components use **Tailwind `ds.*` utility classes exclusively** for color, spacing,
and typography. Inline `style` props are never used for design token values.

Rules:
- Colors: `bg-ds-surface`, `text-ds-text`, `border-ds-border`
- Interactive states must always be declared: `hover:`, `active:`, `focus-visible:`, `disabled:`
- Focus ring pattern: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring focus-visible:ring-offset-2`
- Disabled pattern: `disabled:pointer-events-none disabled:opacity-50`
- Never hardcode colors, sizes, or spacing. If a token doesn't exist, add it to `semantic.css` first.

---

## Testing

Every new component and every modified component requires tests. Use Vitest + React Testing Library.

Run tests: `npm test` (from `packages/react/`)

Requirements:
- Render test (component renders without error)
- Interaction state test for interactive components (click, keyboard)
- Accessibility attribute test (aria-*, role) for components with semantic meaning
- No snapshot tests — test behavior, not markup

---

## Token naming rules

Always use semantic tokens. Never hardcode hex values or pixel values that correspond to a token.

```css
/* Correct */
color: var(--ds-text);
background: var(--ds-surface);
border-color: var(--ds-border);
color: var(--ds-feedback-success);

/* Never do this */
color: #1a1a1a;
background: #ffffff;
border-color: rgba(0,0,0,0.12);
```

Tailwind equivalents are available as `ds.*` classes:

```tsx
<div className="bg-ds-surface text-ds-text border border-ds-border" />
```

Key token groups:

| Group | Examples |
|---|---|
| Surfaces | `--ds-bg`, `--ds-surface`, `--ds-surface-up`, `--ds-sunken` |
| Text | `--ds-text`, `--ds-text-muted`, `--ds-text-disabled`, `--ds-text-inverse` |
| Borders | `--ds-border`, `--ds-border-strong`, `--ds-border-focus` |
| Brand | `--ds-primary`, `--ds-primary-hover`, `--ds-primary-fg`, `--ds-primary-subtle` |
| Feedback | `--ds-feedback-success`, `--ds-feedback-warning`, `--ds-feedback-error`, `--ds-feedback-info` |

The full token reference is in [`packages/tokens/`](./packages/tokens/).

---

## Design principles

Five rules that govern every decision in this system:

1. **Restraint by default** — components are neutral at rest; colour communicates intent, not decoration
2. **Token-first, always** — every visual property comes from a `--ds-*` token, no exceptions
3. **Accessible without configuration** — ARIA, contrast, and keyboard support are built in
4. **Composable, not monolithic** — components do one thing; complex UI is built by combining them
5. **Three themes, one codebase** — light, dark, and wireframe are equal first-class themes; component code never checks which theme is active
