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

> **MCP setup note:** `.claude/settings.json` is pre-configured for use alongside the ds-foundation monorepo (paths are relative to `template/`). If you are using this project standalone (not inside the monorepo), update the `args` and `DS_REGISTRY` paths in `.claude/settings.json` to point to wherever `ds-server` is installed. See `docs/how-to-guide.md` in the source repo for setup instructions.

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
