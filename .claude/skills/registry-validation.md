# Skill: Registry Validation

## Trigger
After any component is generated or modified.

## Protocol
1. Parse the component file for `@ds-component:` annotation to identify registry id
2. Load the component schema from `.claude/registry-context/components/{id}.md`
3. Run checks (see below)
4. Return structured report

## Checks
- **FAIL** — hardcoded hex color values found (`#[0-9a-fA-F]{3,8}`)
- **FAIL** — missing `@ds-component` header annotation
- **FAIL** — Radix primitive not imported or used
- **WARN** — a variant from the schema is not implemented
- **WARN** — a required ARIA attribute from the schema is not present
- **WARN** — component doesn't export named export matching the component id

## Output format
```
VALIDATION REPORT: {component-id} @ {version}
Status: PASS | WARN | FAIL

Issues:
  [FAIL] Hardcoded color #2563eb on line 14 — use var(--ds-color-brand-primary)
  [WARN] Variant "link" not implemented
  [WARN] aria-disabled not present

Next steps: fix FAIL issues before committing. WARN issues should be resolved before marking stable.
```
