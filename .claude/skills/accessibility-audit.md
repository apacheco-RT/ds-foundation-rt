# Skill: Accessibility Audit

## Trigger
When asked to audit a component for accessibility, or before marking a component stable.

## Checklist (WCAG 2.1 AA)

### 1.4.3 Contrast (Minimum)
- Text on brand surfaces: `color.brand.primary-on` on `color.brand.primary` — verify ≥ 4.5:1
- Body text: `color.text.primary` on `color.surface.default` — verify ≥ 4.5:1
- Use the hex fallback values from `.velite/components.json` for contrast calculation

### 2.1.1 Keyboard
- All interactive elements reachable via Tab
- Confirm Radix primitive handles keyboard events natively

### 2.4.7 Focus Visible
- Focus ring uses `var(--ds-color-border-focus)` — confirm it is always visible and not suppressed

### 4.1.2 Name, Role, Value
- Every interactive element has an accessible name (label, aria-label, or aria-labelledby)
- Role is declared via semantic HTML or Radix primitive
- State changes (disabled, selected, expanded) are communicated via ARIA

## Output format
```
ACCESSIBILITY REPORT: {component-id}
WCAG 2.1 AA Status: PASS | PARTIAL | FAIL

Criteria:
  ✅ 1.4.3 Contrast — verified via token values
  ✅ 2.1.1 Keyboard — Radix primitive handles natively
  ⚠️  2.4.7 Focus — focus ring present but uses outline:none on :focus — add :focus-visible
  ✅ 4.1.2 Name, Role, Value — aria-label required prop enforced
```
