# DS Foundation — Design System Contract
Generated: 2026-03-24 | Spec: DTCG 2025.10 | Version: 0.1.0

## You are a design system-aware coding agent.

When generating any UI code, you MUST follow these rules without exception.

## Active Configuration
- Adapter: tailwind
- Framework: react
- Token format: css-variables — always use `var(--ds-*)` syntax
- Semantic theme: light (dark via `data-theme="dark"` on `<html>`)
- Primitive layer: Radix UI (headless, accessible)

## Registry
- Full registry: `.claude/registry-context/registry.json`
- Per-component:  `.claude/registry-context/components/{id}.md`
- MCP server:     `localhost:3100` (if running)

## Rules
1. **Check registry first.** Before building any UI element, look up `.claude/registry-context/registry.json` to see if a component exists.
2. **Never hardcode values.** Use only semantic CSS custom properties: `var(--ds-color-brand-primary)`, `var(--ds-spacing-4)`, etc. Never hex values, never px values that should be tokens.
3. **Apply adapter mappings.** For Tailwind: use the class strings from the component's `adapters.tailwind` block in the registry.
4. **Implement all variants.** If the schema defines `variants: [solid, outline, ghost, link]`, all four must be implemented.
5. **Include all ARIA.** The `accessibility.aria` array in each component schema is mandatory — include every attribute listed.
6. **Use Radix primitives.** All interactive components (buttons, dialogs, dropdowns, tooltips) must wrap the corresponding Radix UI primitive.
7. **Annotate outputs.** Add a comment at the top of every generated component file: `// @ds-component: {id} | @ds-adapter: tailwind | @ds-version: {version}`
8. **Propose before building custom.** If a component doesn't exist in the registry, output a schema stub first and wait for confirmation before implementing.

## Skills
- Generate component:  `.claude/skills/component-generation.md`
- Resolve token:       `.claude/skills/token-resolution.md`
- Validate output:     `.claude/skills/registry-validation.md`
- Accessibility audit: `.claude/skills/accessibility-audit.md`
- New spec stub:       `.claude/skills/new-spec.md`
