# SP1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shadcn/ui bridge alias layer with a clean `--ds-*` semantic alias system so all components reference design tokens directly via `ds.*` Tailwind utilities.

**Architecture:** Add a z-index token file to `packages/tokens`, create static `semantic.css` / `semantic.dark.css` alias files in `packages/react/src` (replacing `bridge.css`), replace the Tailwind config with `ds.*` colour aliases, and migrate all ~44 component files from bridge class names to `ds.*` equivalents in one scripted pass.

**Tech Stack:** Style Dictionary v4, Tailwind CSS v3, TypeScript, Node.js (migration script)

---

## File Map

| File | Action |
|---|---|
| `packages/tokens/src/primitives/zindex.tokens.json` | Create |
| `packages/tokens/sd.config.mjs` | Modify — add zindex to PRIMITIVES array |
| `packages/react/src/semantic.css` | Create — replaces bridge.css |
| `packages/react/src/semantic.dark.css` | Create — replaces bridge-dark.css |
| `packages/react/src/bridge.css` | Delete |
| `packages/react/src/bridge-dark.css` | Delete |
| `packages/react/tailwind.config.ts` | Replace — ds.* aliases |
| `packages/react/src/styles.css` | Modify — import semantic files, update base layer |
| `packages/react/src/*.tsx` (~44 files) | Migrate — bridge classes → ds.* |
| `scripts/migrate-classes.mjs` | Create then delete — one-off migration script |

---

## Task 1: Add z-index tokens

**Files:**
- Create: `packages/tokens/src/primitives/zindex.tokens.json`
- Modify: `packages/tokens/sd.config.mjs`

- [ ] **Step 1: Create the z-index token file**

Create `packages/tokens/src/primitives/zindex.tokens.json`:

```json
{
  "$schema": "https://www.designtokens.org/schemas/2025.10/format.json",
  "$description": "Z-index scale — 10 layers for stacking context management.",
  "z": {
    "$type": "number",
    "base":     { "$value": 0 },
    "raised":   { "$value": 10 },
    "dropdown": { "$value": 100 },
    "sticky":   { "$value": 200 },
    "overlay":  { "$value": 300 },
    "modal":    { "$value": 400 },
    "popover":  { "$value": 500 },
    "toast":    { "$value": 600 },
    "tooltip":  { "$value": 700 },
    "max":      { "$value": 9999 }
  }
}
```

- [ ] **Step 2: Add zindex to PRIMITIVES in sd.config.mjs**

In `packages/tokens/sd.config.mjs`, find the `PRIMITIVES` constant (around line 130) and add the new file:

```js
const PRIMITIVES = [
  'src/primitives/color.tokens.json',
  'src/primitives/spacing.tokens.json',
  'src/primitives/typography.tokens.json',
  'src/primitives/radius.tokens.json',
  'src/primitives/shadow.tokens.json',
  'src/primitives/motion.tokens.json',
  'src/primitives/grid.tokens.json',
  'src/primitives/zindex.tokens.json',   // ← add this line
];
```

- [ ] **Step 3: Build tokens and verify z-index vars appear**

```bash
cd packages/tokens && npm run build
```

Expected: build succeeds with `✅ Token build complete`. Then verify:

```bash
grep "ds-z-" packages/tokens/build/css/variables.css
```

Expected output:
```
  --ds-z-base: 0;
  --ds-z-raised: 10;
  --ds-z-dropdown: 100;
  --ds-z-sticky: 200;
  --ds-z-overlay: 300;
  --ds-z-modal: 400;
  --ds-z-popover: 500;
  --ds-z-toast: 600;
  --ds-z-tooltip: 700;
  --ds-z-max: 9999;
```

- [ ] **Step 4: Commit**

```bash
cd packages/tokens
git add src/primitives/zindex.tokens.json sd.config.mjs build/
git commit -m "feat(tokens): add z-index primitive token scale (10 layers)"
```

---

## Task 2: Create semantic alias CSS files

**Files:**
- Create: `packages/react/src/semantic.css`
- Create: `packages/react/src/semantic.dark.css`

These files replace `bridge.css` and `bridge-dark.css`. They expose short-form `--ds-*` aliases for component authoring, mapping to the full DTCG-built vars.

> **Important:** The easing tokens from the DTCG build output as bare comma-separated values (e.g. `0,0,0.2,1`) which are not valid CSS for `transition-timing-function`. The semantic.css therefore defines easing values directly using `cubic-bezier()` syntax rather than referencing the DTCG vars.

- [ ] **Step 1: Create semantic.css**

Create `packages/react/src/semantic.css`:

```css
/* packages/react/src/semantic.css
   Semantic aliases: short --ds-* names for component authoring.
   Maps to the full DTCG-built --ds-color-* vars from @ds-foundation/tokens.
   This file is hand-maintained. Do not reference bridge.css vars here. */

:root {
  /* ── Surfaces ───────────────────────────────────────── */
  --ds-bg:              var(--ds-color-surface-page);
  --ds-surface:         var(--ds-color-surface-default);
  --ds-surface-up:      var(--ds-color-surface-raised);
  --ds-overlay:         var(--ds-color-surface-overlay);
  --ds-sunken:          var(--ds-color-surface-sunken);

  /* ── Text ───────────────────────────────────────────── */
  --ds-text:            var(--ds-color-text-primary);
  --ds-text-muted:      var(--ds-color-text-tertiary);
  --ds-text-disabled:   var(--ds-color-text-disabled);
  --ds-text-inverse:    var(--ds-color-text-inverse);

  /* ── Borders ────────────────────────────────────────── */
  --ds-border:          var(--ds-color-border-default);
  --ds-border-strong:   var(--ds-color-border-strong);
  --ds-border-focus:    var(--ds-color-border-focus);

  /* ── Brand ──────────────────────────────────────────── */
  --ds-primary:         var(--ds-color-brand-primary);
  --ds-primary-hover:   var(--ds-color-brand-primary-hover);
  --ds-primary-fg:      var(--ds-color-brand-primary-on);
  --ds-primary-subtle:  var(--ds-color-brand-primary-subtle);

  /* ── Feedback icons (single-value shortcuts) ────────── */
  --ds-success:         var(--ds-color-feedback-success-icon);
  --ds-warning:         var(--ds-color-feedback-warning-icon);
  --ds-danger:          var(--ds-color-feedback-error-icon);
  --ds-info:            var(--ds-color-feedback-info-icon);

  /* ── Feedback semantic sets ─────────────────────────── */
  --ds-feedback-success-bg:     var(--ds-color-feedback-success-bg);
  --ds-feedback-success-text:   var(--ds-color-feedback-success-text);
  --ds-feedback-success-border: var(--ds-color-feedback-success-border);
  --ds-feedback-success-icon:   var(--ds-color-feedback-success-icon);

  --ds-feedback-error-bg:       var(--ds-color-feedback-error-bg);
  --ds-feedback-error-text:     var(--ds-color-feedback-error-text);
  --ds-feedback-error-border:   var(--ds-color-feedback-error-border);
  --ds-feedback-error-icon:     var(--ds-color-feedback-error-icon);

  --ds-feedback-warning-bg:     var(--ds-color-feedback-warning-bg);
  --ds-feedback-warning-text:   var(--ds-color-feedback-warning-text);
  --ds-feedback-warning-border: var(--ds-color-feedback-warning-border);
  --ds-feedback-warning-icon:   var(--ds-color-feedback-warning-icon);

  --ds-feedback-info-bg:        var(--ds-color-feedback-info-bg);
  --ds-feedback-info-text:      var(--ds-color-feedback-info-text);
  --ds-feedback-info-border:    var(--ds-color-feedback-info-border);
  --ds-feedback-info-icon:      var(--ds-color-feedback-info-icon);

  /* ── Easing (cubic-bezier directly — DTCG build outputs bare values) ── */
  --ds-ease-default:    cubic-bezier(0, 0, 0.2, 1);
  --ds-ease-in:         cubic-bezier(0.4, 0, 1, 1);
  --ds-ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ds-ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);
  --ds-ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

- [ ] **Step 2: Create semantic.dark.css**

Create `packages/react/src/semantic.dark.css`:

```css
/* packages/react/src/semantic.dark.css
   Dark theme overrides for semantic aliases.
   Activated by [data-theme="dark"] on <html>. */

[data-theme="dark"] {
  /* ── Surfaces ───────────────────────────────────────── */
  --ds-bg:              var(--ds-color-surface-page);
  --ds-surface:         var(--ds-color-surface-default);
  --ds-surface-up:      var(--ds-color-surface-raised);
  --ds-overlay:         var(--ds-color-surface-overlay);
  --ds-sunken:          var(--ds-color-surface-sunken);

  /* ── Text ───────────────────────────────────────────── */
  --ds-text:            var(--ds-color-text-primary);
  --ds-text-muted:      var(--ds-color-text-tertiary);
  --ds-text-disabled:   var(--ds-color-text-disabled);
  --ds-text-inverse:    var(--ds-color-text-inverse);

  /* ── Borders ────────────────────────────────────────── */
  --ds-border:          var(--ds-color-border-default);
  --ds-border-strong:   var(--ds-color-border-strong);
  --ds-border-focus:    var(--ds-color-border-focus);

  /* ── Brand ──────────────────────────────────────────── */
  --ds-primary:         var(--ds-color-brand-primary);
  --ds-primary-hover:   var(--ds-color-brand-primary-hover);
  --ds-primary-fg:      var(--ds-color-brand-primary-on);
  --ds-primary-subtle:  var(--ds-color-brand-primary-subtle);

  /* ── Feedback icons ─────────────────────────────────── */
  --ds-success:         var(--ds-color-feedback-success-icon);
  --ds-warning:         var(--ds-color-feedback-warning-icon);
  --ds-danger:          var(--ds-color-feedback-error-icon);
  --ds-info:            var(--ds-color-feedback-info-icon);

  /* ── Feedback semantic sets ─────────────────────────── */
  --ds-feedback-success-bg:     var(--ds-color-feedback-success-bg);
  --ds-feedback-success-text:   var(--ds-color-feedback-success-text);
  --ds-feedback-success-border: var(--ds-color-feedback-success-border);
  --ds-feedback-success-icon:   var(--ds-color-feedback-success-icon);

  --ds-feedback-error-bg:       var(--ds-color-feedback-error-bg);
  --ds-feedback-error-text:     var(--ds-color-feedback-error-text);
  --ds-feedback-error-border:   var(--ds-color-feedback-error-border);
  --ds-feedback-error-icon:     var(--ds-color-feedback-error-icon);

  --ds-feedback-warning-bg:     var(--ds-color-feedback-warning-bg);
  --ds-feedback-warning-text:   var(--ds-color-feedback-warning-text);
  --ds-feedback-warning-border: var(--ds-color-feedback-warning-border);
  --ds-feedback-warning-icon:   var(--ds-color-feedback-warning-icon);

  --ds-feedback-info-bg:        var(--ds-color-feedback-info-bg);
  --ds-feedback-info-text:      var(--ds-color-feedback-info-text);
  --ds-feedback-info-border:    var(--ds-color-feedback-info-border);
  --ds-feedback-info-icon:      var(--ds-color-feedback-info-icon);
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/semantic.css packages/react/src/semantic.dark.css
git commit -m "feat(react): add semantic alias CSS files (replaces bridge.css)"
```

---

## Task 3: Replace tailwind.config.ts

**Files:**
- Replace: `packages/react/tailwind.config.ts`

- [ ] **Step 1: Write the new config**

Overwrite `packages/react/tailwind.config.ts` in full:

```ts
// packages/react/tailwind.config.ts
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  // Dark mode fires on [data-theme="dark"] attribute on <html>.
  // This keeps the `dark:` Tailwind variant working without a class toggle.
  darkMode: ['selector', '[data-theme="dark"]'],
  content: {
    // Resolve globs relative to this config file, not process.cwd().
    // Required when PostCSS is invoked from a different CWD.
    relative: true,
    files: ['./src/**/*.{ts,tsx}'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      // ring-offset uses ringOffsetColor, not colors
      ringOffsetColor: {
        'ds-surface': 'var(--ds-surface)',
        'ds-bg':      'var(--ds-bg)',
      },
      colors: {
        ds: {
          bg:               'var(--ds-bg)',
          surface:          'var(--ds-surface)',
          'surface-up':     'var(--ds-surface-up)',
          overlay:          'var(--ds-overlay)',
          sunken:           'var(--ds-sunken)',
          text:             'var(--ds-text)',
          'text-muted':     'var(--ds-text-muted)',
          'text-disabled':  'var(--ds-text-disabled)',
          'text-inverse':   'var(--ds-text-inverse)',
          border:           'var(--ds-border)',
          'border-strong':  'var(--ds-border-strong)',
          'border-focus':   'var(--ds-border-focus)',
          primary:          'var(--ds-primary)',
          'primary-hover':  'var(--ds-primary-hover)',
          'primary-fg':     'var(--ds-primary-fg)',
          'primary-subtle': 'var(--ds-primary-subtle)',
          success:          'var(--ds-success)',
          warning:          'var(--ds-warning)',
          danger:           'var(--ds-danger)',
          info:             'var(--ds-info)',
        },
      },
      boxShadow: {
        'ds-xs':  'var(--ds-shadow-xs)',
        'ds-sm':  'var(--ds-shadow-sm)',
        'ds-md':  'var(--ds-shadow-md)',
        'ds-lg':  'var(--ds-shadow-lg)',
        'ds-xl':  'var(--ds-shadow-xl)',
        'ds-2xl': 'var(--ds-shadow-2xl)',
      },
      transitionDuration: {
        'ds-fast':   '150ms',
        'ds-normal': '200ms',
        'ds-slow':   '300ms',
      },
      transitionTimingFunction: {
        'ds-default': 'var(--ds-ease-default)',
        'ds-in':      'var(--ds-ease-in)',
        'ds-out':     'var(--ds-ease-out)',
        'ds-in-out':  'var(--ds-ease-in-out)',
        'ds-spring':  'var(--ds-ease-spring)',
      },
      borderRadius: {
        lg: 'var(--ds-radius-lg)',
        md: 'var(--ds-radius-md)',
        sm: 'var(--ds-radius-sm)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
```

- [ ] **Step 2: Commit**

```bash
git add packages/react/tailwind.config.ts
git commit -m "feat(react): replace tailwind config with ds.* semantic aliases"
```

---

## Task 4: Update styles.css

**Files:**
- Modify: `packages/react/src/styles.css`

- [ ] **Step 1: Replace the file contents**

Overwrite `packages/react/src/styles.css`:

```css
/* packages/react/src/styles.css
   Load order: token vars → semantic aliases → Tailwind → base overrides */

/* DTCG-built token vars: --ds-color-*, --ds-shadow-*, --ds-motion-*, etc. */
@import "@ds-foundation/tokens/build/css/variables.css";
@import "@ds-foundation/tokens/build/css/variables.dark.css";

/* Semantic aliases: short --ds-* names used by components */
@import "./semantic.css";
@import "./semantic.dark.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-ds-border;
  }

  body {
    @apply bg-ds-bg text-ds-text;
  }
}
```

- [ ] **Step 2: Verify the token package exports its build output**

Check that `packages/tokens/package.json` exports `build/css/`:

```bash
cat packages/tokens/package.json | grep -A 10 '"exports"'
```

If the `exports` field does not include `./build/css/*`, add it. The exports block should include at minimum:

```json
"exports": {
  "./build/css/variables.css": "./build/css/variables.css",
  "./build/css/variables.dark.css": "./build/css/variables.dark.css"
}
```

If exports are already present and include these paths, no change needed.

- [ ] **Step 3: Commit**

```bash
git add packages/react/src/styles.css
git commit -m "feat(react): update styles.css to import semantic aliases directly"
```

---

## Task 5: Migrate component class names

**Files:**
- Create: `scripts/migrate-classes.mjs` (temporary — deleted at end of task)
- Modify: all `packages/react/src/*.tsx` files containing bridge classes

This task uses a Node.js script to do all replacements in one deterministic pass. Run it once, then validate.

- [ ] **Step 1: Create the migration script**

Create `scripts/migrate-classes.mjs` at the repo root:

```js
// scripts/migrate-classes.mjs
// One-shot migration: bridge class names → ds.* semantic class names.
// Run once with: node scripts/migrate-classes.mjs
// Delete this file after running.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const SRC = 'packages/react/src';

// Order matters: more specific patterns first to avoid partial matches.
const REPLACEMENTS = [
  // ── ring-offset (must come before ring-ring) ──
  ['ring-offset-background', 'ring-offset-ds-bg'],

  // ── ring ──
  [/\bring-ring\/(\d+)/g,   (_, n) => `ring-ds-border-focus/${n}`],
  ['ring-ring',              'ring-ds-border-focus'],

  // ── border ──
  ['bg-border',              'bg-ds-border'],
  ['border-destructive',     'border-ds-danger'],
  ['border-ring',            'border-ds-border-focus'],
  ['border-muted-foreground','border-ds-text-muted'],
  ['border-foreground',      'border-ds-text'],
  ['border-primary',         'border-ds-primary'],
  ['border-input',           'border-ds-border'],
  ['border-border',          'border-ds-border'],

  // ── background colours (bg-*) ──
  [/\bbg-destructive\/(\d+)/g, (_, n) => `bg-ds-danger/${n}`],
  ['bg-destructive',         'bg-ds-danger'],
  [/\bbg-primary\/(\d+)/g,   (_, n) => `bg-ds-primary/${n}`],
  ['bg-primary',             'bg-ds-primary'],
  [/\bbg-secondary\/(\d+)/g, (_, n) => `bg-ds-sunken/${n}`],
  ['bg-secondary',           'bg-ds-sunken'],
  [/\bbg-accent\/(\d+)/g,    (_, n) => `bg-ds-primary-subtle/${n}`],
  ['bg-accent',              'bg-ds-primary-subtle'],
  [/\bbg-muted\/(\d+)/g,     (_, n) => `bg-ds-sunken/${n}`],
  ['bg-muted',               'bg-ds-sunken'],
  ['bg-popover',             'bg-ds-surface'],
  ['bg-card',                'bg-ds-surface'],
  ['bg-background',          'bg-ds-bg'],

  // ── text colours (text-*) ──
  ['text-destructive-foreground', 'text-ds-text-inverse'],
  ['text-primary-foreground', 'text-ds-text-inverse'],
  ['text-secondary-foreground','text-ds-text'],
  ['text-card-foreground',   'text-ds-text'],
  ['text-popover-foreground','text-ds-text'],
  ['text-accent-foreground', 'text-ds-primary'],
  ['text-muted-foreground',  'text-ds-text-muted'],
  ['text-foreground',        'text-ds-text'],
  ['text-destructive',       'text-ds-danger'],
  // text-primary is kept intentionally last — only replace if standalone
  // (avoid replacing text-primary-foreground which was handled above)
  ['text-primary',           'text-ds-primary'],

  // ── hover: / focus: prefixed variants ──
  ['hover:bg-accent',        'hover:bg-ds-primary-subtle'],
  ['hover:text-accent-foreground', 'hover:text-ds-primary'],
];

function migrateFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  for (const [from, to] of REPLACEMENTS) {
    if (typeof from === 'string') {
      // Escape special regex chars and replace all occurrences
      const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp(escaped, 'g'), to);
    } else {
      // Already a RegExp
      content = content.replace(from, to);
    }
  }

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`  migrated: ${filePath}`);
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx')) {
      migrateFile(full);
    }
  }
}

console.log('Running class migration...');
walk(SRC);
console.log('Done.');
```

- [ ] **Step 2: Run the migration script**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
node scripts/migrate-classes.mjs
```

Expected: lists each file that was modified, then prints `Done.`

- [ ] **Step 3: Validate — zero bridge class references remain**

```bash
grep -rn "bg-background\|bg-card\|bg-muted\b\|bg-accent\b\|bg-popover\|bg-primary\b\|bg-secondary\b\|bg-destructive\b\|text-foreground\b\|text-muted-foreground\|text-accent-foreground\|text-card-foreground\|text-popover-foreground\|text-primary-foreground\|text-destructive\b\|text-secondary-foreground\|border-border\b\|border-input\b\|ring-ring\b\|ring-offset-background" \
  packages/react/src/ --include="*.tsx"
```

Expected: **no output** (zero matches). If any matches appear, fix them manually before continuing.

- [ ] **Step 4: Delete the migration script**

```bash
rm scripts/migrate-classes.mjs
```

- [ ] **Step 5: Commit the migrated files**

```bash
git add packages/react/src/
git commit -m "feat(react): migrate all components from bridge classes to ds.* semantic tokens"
```

---

## Task 6: Delete bridge files

**Files:**
- Delete: `packages/react/src/bridge.css`
- Delete: `packages/react/src/bridge-dark.css`

- [ ] **Step 1: Verify nothing still imports bridge.css**

```bash
grep -rn "bridge" packages/react/src/ apps/
```

Expected: zero matches (styles.css was already updated in Task 4).

- [ ] **Step 2: Delete the files**

```bash
rm packages/react/src/bridge.css
rm packages/react/src/bridge-dark.css
```

- [ ] **Step 3: Commit**

```bash
git add -u packages/react/src/bridge.css packages/react/src/bridge-dark.css
git commit -m "chore(react): delete bridge.css and bridge-dark.css (replaced by semantic.css)"
```

---

## Task 7: Validate and smoke-test

**Files:** No changes — validation only.

- [ ] **Step 1: TypeScript — zero errors**

```bash
cd packages/react && npx tsc --noEmit
```

Expected: exits with code 0, no output. If errors appear, fix them before continuing.

- [ ] **Step 2: Confirm no var(--background) / var(--foreground) references remain**

```bash
grep -rn "var(--background)\|var(--foreground)\|var(--muted\|var(--ring\|var(--border)\|var(--primary)\|var(--destructive)\|var(--card)\|var(--popover)\|var(--accent)\|var(--secondary)" \
  packages/react/src/ --include="*.tsx" --include="*.css"
```

Expected: zero matches.

- [ ] **Step 3: Docs app builds**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=apps/docs 2>&1 | tail -20
```

Expected: build completes without errors.

- [ ] **Step 4: Update master tracker**

In `docs/superpowers/DS-V1-MASTER.md`, update the SP1 row:

```
| SP1 | Foundation (architecture + tokens) | ✅ | ✅ | ✅ Done |
```

And add the plan path:

```
**Plan:** `docs/superpowers/plans/2026-04-09-sp1-foundation.md` ✅
```

- [ ] **Step 5: Final commit**

```bash
git add docs/superpowers/DS-V1-MASTER.md
git commit -m "docs: mark SP1 Foundation complete in master tracker"
```

---

## Success Criteria Checklist

Before declaring SP1 done, all of the following must be true:

- [ ] `packages/tokens/build/css/variables.css` contains `--ds-z-base` through `--ds-z-max`
- [ ] `packages/react/src/semantic.css` and `semantic.dark.css` exist
- [ ] `packages/react/src/bridge.css` and `bridge-dark.css` do not exist
- [ ] `grep -r "bg-background\|text-foreground\|border-border\|ring-ring\|ring-offset-background" packages/react/src/ --include="*.tsx"` returns zero matches
- [ ] `grep -r "var(--background)\|var(--foreground)\|var(--muted\|var(--ring\|var(--border)" packages/react/src/ --include="*.css"` returns zero matches
- [ ] `cd packages/react && npx tsc --noEmit` exits 0
- [ ] `npm run build --workspace=apps/docs` completes without errors
