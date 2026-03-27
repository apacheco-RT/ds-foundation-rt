# Skill: Token Resolution

## Trigger
When asked to find the right token for a design intent, or to validate that a token path exists.

## Token path → CSS var mapping
All tokens follow this pattern: `{category}.{subcategory}.{name}` → `var(--ds-{category}-{subcategory}-{name})`

Examples:
- `color.brand.primary`      → `var(--ds-color-brand-primary)`
- `color.text.secondary`     → `var(--ds-color-text-secondary)`
- `color.feedback.error.bg`  → `var(--ds-color-feedback-error-bg)`
- `spacing.4`                → `var(--ds-spacing-4)`
- `radius.md`                → `var(--ds-radius-md)`
- `motion.duration.normal`   → `var(--ds-motion-duration-normal)`
- `font.size.lg`             → `var(--ds-font-size-lg)`
- `z-index.modal`            → `var(--ds-z-index-modal)`
- `component.height.md`      → `var(--ds-component-height-md)`

## Rules
- NEVER use primitive tokens in components. Primitives are `color.blue.600`. Semantic tokens are `color.brand.primary`. Always use semantic.
- If a semantic token doesn't exist for the intent, flag it as a registry gap — do not use a primitive.
- NEVER use hardcoded values for anything that has a token.
