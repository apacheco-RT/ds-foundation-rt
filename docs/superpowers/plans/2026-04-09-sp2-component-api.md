# SP2 — Component API Upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Badge, Button, Input/Textarea, and Card with the component APIs designed in SP2 — composable color/variant system, loading states, adornments, and Card sub-component additions.

**Architecture:** Option B — CVA for structure/size/spacing via Tailwind `ds.*` classes; per-color values applied as `style={{ ... }}` with `var(--ds-*)` CSS custom property references. All color lookup tables are static TypeScript objects. No hardcoded hex values anywhere.

**Tech Stack:** React 18, TypeScript, CVA (class-variance-authority), Radix UI, Lucide React, Tailwind CSS v3

---

## File Map

| File | Action |
|---|---|
| `packages/react/src/Badge.tsx` | Replace entirely |
| `packages/react/src/Button.tsx` | Replace entirely |
| `packages/react/src/Input.tsx` | Replace entirely |
| `packages/react/src/Textarea.tsx` | Replace entirely |
| `packages/react/src/Card.tsx` | Modify — additive props + new CardDivider |
| `packages/react/src/index.ts` | Modify — add CardDivider export |
| `apps/docs/pages/components/button.mdx` | Modify — update old variant names |
| `apps/docs/pages/components/alert.mdx` | Modify — update old variant names |
| `apps/docs/pages/components/badge.mdx` | Modify — update old variant names |

---

## Task 1: Badge

**Files:**
- Replace: `packages/react/src/Badge.tsx`

- [ ] **Step 1: Write the new Badge.tsx**

Overwrite `packages/react/src/Badge.tsx` in full:

```tsx
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "./utils"

type BadgeVariant = 'solid' | 'subtle' | 'outline'
type BadgeColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
type BadgeSize = 'sm' | 'md'

const COLOR_STYLES: Record<BadgeColor, Record<BadgeVariant, React.CSSProperties>> = {
  primary: {
    subtle:  { backgroundColor: 'var(--ds-primary-subtle)', color: 'var(--ds-primary)', borderColor: 'var(--ds-primary)' },
    solid:   { backgroundColor: 'var(--ds-primary)', color: 'var(--ds-primary-fg)', borderColor: 'var(--ds-primary)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-primary)', borderColor: 'var(--ds-primary)' },
  },
  success: {
    subtle:  { backgroundColor: 'var(--ds-feedback-success-bg)', color: 'var(--ds-feedback-success-text)', borderColor: 'var(--ds-feedback-success-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-success-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-success-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-success-text)', borderColor: 'var(--ds-feedback-success-border)' },
  },
  warning: {
    subtle:  { backgroundColor: 'var(--ds-feedback-warning-bg)', color: 'var(--ds-feedback-warning-text)', borderColor: 'var(--ds-feedback-warning-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-warning-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-warning-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-warning-text)', borderColor: 'var(--ds-feedback-warning-border)' },
  },
  danger: {
    subtle:  { backgroundColor: 'var(--ds-feedback-error-bg)', color: 'var(--ds-feedback-error-text)', borderColor: 'var(--ds-feedback-error-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-error-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-error-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-error-text)', borderColor: 'var(--ds-feedback-error-border)' },
  },
  info: {
    subtle:  { backgroundColor: 'var(--ds-feedback-info-bg)', color: 'var(--ds-feedback-info-text)', borderColor: 'var(--ds-feedback-info-border)' },
    solid:   { backgroundColor: 'var(--ds-feedback-info-icon)', color: 'var(--ds-text-inverse)', borderColor: 'var(--ds-feedback-info-icon)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-feedback-info-text)', borderColor: 'var(--ds-feedback-info-border)' },
  },
  neutral: {
    subtle:  { backgroundColor: 'var(--ds-bg)', color: 'var(--ds-text-muted)', borderColor: 'var(--ds-border)' },
    solid:   { backgroundColor: 'var(--ds-surface-up)', color: 'var(--ds-text)', borderColor: 'var(--ds-surface-up)' },
    outline: { backgroundColor: 'transparent', color: 'var(--ds-text-muted)', borderColor: 'var(--ds-border)' },
  },
}

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-medium',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  color?: BadgeColor
  size?: BadgeSize
  dot?: boolean
}

function Badge({
  className,
  variant = 'subtle',
  color = 'neutral',
  size = 'md',
  dot,
  style,
  children,
  ...props
}: BadgeProps) {
  const colorStyle = COLOR_STYLES[color][variant]
  return (
    <span
      className={cn(badgeVariants({ size }), className)}
      style={{ ...colorStyle, ...style }}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: 'currentColor' }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
```

- [ ] **Step 2: Run TypeScript to verify zero errors**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit 2>&1 | head -30
```

Expected: exits 0, zero errors. If errors appear referencing `Badge.tsx`, fix them before continuing.

- [ ] **Step 3: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/Badge.tsx
git commit -m "$(cat <<'EOF'
feat(react): upgrade Badge — color/variant/size/dot API, token-driven colors

Replace hardcoded hex palette classes with var(--ds-*) CSS custom property
lookup table. New props: color (primary/success/warning/danger/info/neutral),
variant (solid/subtle/outline), size (sm/md), dot indicator.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Button

**Files:**
- Replace: `packages/react/src/Button.tsx`
- Modify: `apps/docs/pages/components/button.mdx`
- Modify: `apps/docs/pages/components/alert.mdx`
- Modify: `apps/docs/pages/components/badge.mdx`

- [ ] **Step 1: Write the new Button.tsx**

Overwrite `packages/react/src/Button.tsx` in full:

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Loader2 } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "./utils"

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
type ButtonColorScheme = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon'

// Solid: filled background + contrasting text
const SOLID_STYLES: Record<ButtonColorScheme, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--ds-primary)', color: 'var(--ds-primary-fg)' },
  success: { backgroundColor: 'var(--ds-feedback-success-icon)', color: 'var(--ds-text-inverse)' },
  warning: { backgroundColor: 'var(--ds-feedback-warning-icon)', color: 'var(--ds-text-inverse)' },
  danger:  { backgroundColor: 'var(--ds-feedback-error-icon)', color: 'var(--ds-text-inverse)' },
  neutral: { backgroundColor: 'var(--ds-surface-up)', color: 'var(--ds-text)' },
}

// Outline: transparent background, coloured border + text
const OUTLINE_STYLES: Record<ButtonColorScheme, React.CSSProperties> = {
  primary: { backgroundColor: 'transparent', borderColor: 'var(--ds-primary)', color: 'var(--ds-primary)' },
  success: { backgroundColor: 'transparent', borderColor: 'var(--ds-feedback-success-border)', color: 'var(--ds-feedback-success-text)' },
  warning: { backgroundColor: 'transparent', borderColor: 'var(--ds-feedback-warning-border)', color: 'var(--ds-feedback-warning-text)' },
  danger:  { backgroundColor: 'transparent', borderColor: 'var(--ds-feedback-error-border)', color: 'var(--ds-feedback-error-text)' },
  neutral: { backgroundColor: 'transparent', borderColor: 'var(--ds-border)', color: 'var(--ds-text)' },
}

// Ghost: no border, coloured text, hover bg applied via CSS class
const GHOST_STYLES: Record<ButtonColorScheme, React.CSSProperties> = {
  primary: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-primary)' },
  success: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-feedback-success-text)' },
  warning: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-feedback-warning-text)' },
  danger:  { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-feedback-error-text)' },
  neutral: { backgroundColor: 'transparent', borderColor: 'transparent', color: 'var(--ds-text)' },
}

// Link: always primary colour, no background or border
const LINK_STYLE: React.CSSProperties = {
  backgroundColor: 'transparent',
  borderColor: 'transparent',
  color: 'var(--ds-primary)',
}

// Icon wrapper size by button size tier
const ICON_DIMENSION: Record<ButtonSize, string> = {
  xs: '14px', sm: '14px', md: '16px', lg: '16px', xl: '16px', icon: '16px',
}

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium',
    'ring-offset-ds-bg transition-opacity',
    'hover:opacity-90',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
  ].join(' '),
  {
    variants: {
      size: {
        xs:   'h-7 px-2.5 text-xs',
        sm:   'h-8 px-3 text-sm',
        md:   'h-10 px-4 text-sm',
        lg:   'h-11 px-6 text-base',
        xl:   'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  colorScheme?: ButtonColorScheme
  size?: ButtonSize
  isLoading?: boolean
  loadingText?: string
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'solid',
      colorScheme = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      asChild = false,
      style,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    // Resolve colour style for the active variant
    let colorStyle: React.CSSProperties
    if (variant === 'solid')        colorStyle = SOLID_STYLES[colorScheme]
    else if (variant === 'outline') colorStyle = OUTLINE_STYLES[colorScheme]
    else if (variant === 'ghost')   colorStyle = GHOST_STYLES[colorScheme]
    else                            colorStyle = LINK_STYLE // link

    const iconDim = ICON_DIMENSION[size]

    const wrapIcon = (icon: React.ReactElement) => (
      <span
        className="shrink-0 [&>svg]:w-full [&>svg]:h-full"
        style={{ width: iconDim, height: iconDim }}
        aria-hidden="true"
      >
        {icon}
      </span>
    )

    const leftSlot = isLoading
      ? wrapIcon(<Loader2 className="animate-spin" />)
      : leftIcon
        ? wrapIcon(leftIcon)
        : null

    const rightSlot = !isLoading && rightIcon ? wrapIcon(rightIcon) : null

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ size }),
          variant === 'link' && 'underline-offset-4 hover:underline',
          className
        )}
        style={{ ...colorStyle, ...style }}
        disabled={isLoading || disabled}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {leftSlot}
        {isLoading && loadingText ? loadingText : children}
        {rightSlot}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 2: Update old variant names in the docs app**

First, check what old values appear in each file:

```bash
grep -n 'variant="default"\|variant="destructive"\|variant="secondary"' \
  /Users/apacheco/Documents/GitHub/ds-foundation-rt/apps/docs/pages/components/button.mdx \
  /Users/apacheco/Documents/GitHub/ds-foundation-rt/apps/docs/pages/components/alert.mdx \
  /Users/apacheco/Documents/GitHub/ds-foundation-rt/apps/docs/pages/components/badge.mdx
```

Read each affected MDX file, then apply the substitutions below. Use your Read tool first, then Edit for each replacement.

**Button substitutions** (apply to `button.mdx` and `alert.mdx`):

Run this Node.js one-liner to do the substitutions automatically:

```bash
node -e "
const fs = require('fs');
const files = [
  'apps/docs/pages/components/button.mdx',
  'apps/docs/pages/components/alert.mdx',
];
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  // Order: most specific first
  c = c.replace(/variant=\"destructive\"/g, 'variant=\"solid\" colorScheme=\"danger\"');
  c = c.replace(/variant=\"secondary\"/g, 'variant=\"outline\" colorScheme=\"neutral\"');
  c = c.replace(/variant=\"default\"/g, 'variant=\"solid\"');
  fs.writeFileSync(f, c);
  console.log('updated:', f);
}
"
```

**Badge substitutions** (apply to `badge.mdx`):

```bash
node -e "
const fs = require('fs');
const f = 'apps/docs/pages/components/badge.mdx';
let c = fs.readFileSync(f, 'utf8');
// Order: most specific first to avoid partial matches
c = c.replace(/variant=\"destructive\"/g, 'color=\"danger\" variant=\"subtle\"');
c = c.replace(/variant=\"secondary\"/g, 'color=\"neutral\" variant=\"subtle\"');
c = c.replace(/variant=\"default\"/g, 'color=\"neutral\" variant=\"subtle\"');
c = c.replace(/variant=\"success\"/g, 'color=\"success\" variant=\"subtle\"');
c = c.replace(/variant=\"warning\"/g, 'color=\"warning\" variant=\"subtle\"');
c = c.replace(/variant=\"info\"/g, 'color=\"info\" variant=\"subtle\"');
c = c.replace(/variant=\"outline\"/g, 'color=\"neutral\" variant=\"outline\"');
fs.writeFileSync(f, c);
console.log('updated:', f);
"
```

After running both scripts, verify no old variant values remain:

```bash
grep -n 'variant="default"\|variant="destructive"\|variant="secondary"\|variant="success"\|variant="warning"\|variant="info"' \
  apps/docs/pages/components/button.mdx \
  apps/docs/pages/components/alert.mdx \
  apps/docs/pages/components/badge.mdx
```

Expected: zero matches.

- [ ] **Step 3: Run TypeScript to verify zero errors**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit 2>&1 | head -30
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/Button.tsx \
        apps/docs/pages/components/button.mdx \
        apps/docs/pages/components/alert.mdx \
        apps/docs/pages/components/badge.mdx
git commit -m "$(cat <<'EOF'
feat(react): upgrade Button — colorScheme matrix, loading state, icon slots

New props: colorScheme (primary/success/warning/danger/neutral), isLoading,
loadingText, leftIcon, rightIcon. Expanded size scale (xs/xl added). Variant
renamed: default→solid, destructive→solid+danger, secondary→outline+neutral.
Update docs MDX to use new API.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Input

**Files:**
- Replace: `packages/react/src/Input.tsx`

- [ ] **Step 1: Write the new Input.tsx**

Overwrite `packages/react/src/Input.tsx` in full:

```tsx
import * as React from "react"
import { cn } from "./utils"

type InputSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<InputSize, string> = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

// Extra horizontal padding when adornments are present, by size tier
const LEFT_PADDING: Record<InputSize, string> = {
  sm: 'pl-9', md: 'pl-10', lg: 'pl-11',
}
const RIGHT_PADDING: Record<InputSize, string> = {
  sm: 'pr-9', md: 'pr-10', lg: 'pr-11',
}

const BASE_INPUT =
  'flex w-full rounded-md border border-ds-border bg-ds-bg px-3 py-2 ring-offset-ds-bg ' +
  'file:border-0 file:bg-transparent file:text-sm file:font-medium ' +
  'placeholder:text-ds-text-muted ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorText?: string
  size?: InputSize
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
  // `required` is inherited from InputHTMLAttributes — used to add * to label
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      helperText,
      errorText,
      size = 'md',
      leftAdornment,
      rightAdornment,
      required,
      style,
      ...props
    },
    ref
  ) => {
    const hasError = !!errorText
    const hasComposite = !!(label || helperText || errorText || leftAdornment || rightAdornment)

    const inputEl = (
      <input
        type={type}
        className={cn(
          BASE_INPUT,
          SIZE_CLASSES[size],
          hasError && 'border-ds-danger focus-visible:ring-ds-danger',
          leftAdornment && LEFT_PADDING[size],
          rightAdornment && RIGHT_PADDING[size],
          className
        )}
        ref={ref}
        required={required}
        style={style}
        aria-invalid={hasError || undefined}
        {...props}
      />
    )

    // Bare mode: no composite props — render exactly like before, zero regressions
    if (!hasComposite) {
      return inputEl
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-ds-text">
            {label}
            {required && (
              <span className="text-ds-danger ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAdornment && (
            <span
              className="absolute left-3 flex items-center text-ds-text-muted shrink-0 pointer-events-none"
              aria-hidden="true"
            >
              {leftAdornment}
            </span>
          )}
          {inputEl}
          {rightAdornment && (
            <span
              className="absolute right-3 flex items-center text-ds-text-muted shrink-0 pointer-events-none"
              aria-hidden="true"
            >
              {rightAdornment}
            </span>
          )}
        </div>
        {(helperText || errorText) && (
          <p className={cn('text-xs', hasError ? 'text-ds-danger' : 'text-ds-text-muted')}>
            {errorText ?? helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

- [ ] **Step 2: Run TypeScript to verify zero errors**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit 2>&1 | head -30
```

Expected: exits 0.

- [ ] **Step 3: Verify backwards compatibility — existing Input usages still compile**

```bash
grep -rn "<Input" /Users/apacheco/Documents/GitHub/ds-foundation-rt/apps/docs/ --include="*.tsx" --include="*.mdx" | head -10
```

No changes required here — just confirm existing usages are present. The bare `<Input>` and `<Input className="..." />` patterns work unchanged since all new props are optional.

- [ ] **Step 4: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/Input.tsx
git commit -m "$(cat <<'EOF'
feat(react): upgrade Input — label, adornments, error/helper text, size variants

Additive props: label, helperText, errorText, size (sm/md/lg),
leftAdornment, rightAdornment. Bare <Input> with no composite props
renders identically to before — zero regressions.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Textarea

**Files:**
- Replace: `packages/react/src/Textarea.tsx`

- [ ] **Step 1: Write the new Textarea.tsx**

Overwrite `packages/react/src/Textarea.tsx` in full:

```tsx
import * as React from "react"
import { cn } from "./utils"

type TextareaSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<TextareaSize, string> = {
  sm: 'min-h-[64px] text-sm',
  md: 'min-h-[80px] text-sm',
  lg: 'min-h-[100px] text-base',
}

const BASE_TEXTAREA =
  'flex w-full rounded-md border border-ds-border bg-ds-bg px-3 py-2 ring-offset-ds-bg ' +
  'placeholder:text-ds-text-muted ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  errorText?: string
  size?: TextareaSize
  // `required` is inherited from TextareaHTMLAttributes — used to add * to label
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      size = 'md',
      required,
      ...props
    },
    ref
  ) => {
    const hasError = !!errorText
    const hasComposite = !!(label || helperText || errorText)

    const textareaEl = (
      <textarea
        className={cn(
          BASE_TEXTAREA,
          SIZE_CLASSES[size],
          hasError && 'border-ds-danger focus-visible:ring-ds-danger',
          className
        )}
        ref={ref}
        required={required}
        aria-invalid={hasError || undefined}
        {...props}
      />
    )

    // Bare mode: no composite props — render exactly like before
    if (!hasComposite) {
      return textareaEl
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-ds-text">
            {label}
            {required && (
              <span className="text-ds-danger ml-0.5" aria-hidden="true">*</span>
            )}
          </label>
        )}
        {textareaEl}
        {(helperText || errorText) && (
          <p className={cn('text-xs', hasError ? 'text-ds-danger' : 'text-ds-text-muted')}>
            {errorText ?? helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
```

- [ ] **Step 2: Run TypeScript to verify zero errors**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit 2>&1 | head -30
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/Textarea.tsx
git commit -m "$(cat <<'EOF'
feat(react): upgrade Textarea — label, error/helper text, size variants

Additive props: label, helperText, errorText, size (sm/md/lg). Bare
<Textarea> renders identically to before — zero regressions.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Card

**Files:**
- Modify: `packages/react/src/Card.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] **Step 1: Write the updated Card.tsx**

Overwrite `packages/react/src/Card.tsx` in full:

```tsx
import * as React from "react"
import { cn } from "./utils"

// ── Card root ──────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  glass?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated, glass, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[0.25rem] border bg-ds-surface text-ds-text shadow-sm",
        elevated && "shadow-ds-md",
        glass && "backdrop-blur-sm bg-ds-surface/80",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

// ── CardHeader ─────────────────────────────────────────────────────────────

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        actions ? "flex items-start justify-between p-6" : "flex flex-col space-y-1.5 p-6",
        className
      )}
      {...props}
    >
      {actions ? (
        <>
          <div className="flex flex-col space-y-1.5 min-w-0">{children}</div>
          <div className="flex items-center gap-2 shrink-0 ml-4">{actions}</div>
        </>
      ) : (
        children
      )}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

// ── CardTitle ──────────────────────────────────────────────────────────────

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-ds-text",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ── CardDescription ────────────────────────────────────────────────────────

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-ds-text-muted", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ── CardContent ────────────────────────────────────────────────────────────

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// ── CardFooter ─────────────────────────────────────────────────────────────

const FOOTER_ALIGN = {
  left:    'justify-start',
  right:   'justify-end',
  between: 'justify-between',
} as const

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: keyof typeof FOOTER_ALIGN
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'left', ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", FOOTER_ALIGN[align], className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// ── CardDivider ────────────────────────────────────────────────────────────

interface CardDividerProps {
  label?: string
  className?: string
}

function CardDivider({ label, className }: CardDividerProps) {
  if (label) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-6 text-xs text-ds-text-muted",
          className
        )}
      >
        <div className="flex-1 border-t border-ds-border" />
        <span>{label}</span>
        <div className="flex-1 border-t border-ds-border" />
      </div>
    )
  }
  return (
    <div className={cn("border-t border-ds-border", className)} />
  )
}
CardDivider.displayName = "CardDivider"

// ── Exports ────────────────────────────────────────────────────────────────

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDivider,
}
export type { CardProps, CardHeaderProps, CardFooterProps, CardDividerProps }
```

- [ ] **Step 2: Add CardDivider to index.ts**

In `packages/react/src/index.ts`, find the Card export line:

```ts
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card';
```

Replace it with:

```ts
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardDivider } from './Card';
export type { CardProps, CardHeaderProps, CardFooterProps, CardDividerProps } from './Card';
```

- [ ] **Step 3: Run TypeScript to verify zero errors**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit 2>&1 | head -30
```

Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add packages/react/src/Card.tsx packages/react/src/index.ts
git commit -m "$(cat <<'EOF'
feat(react): upgrade Card — elevated/glass, header actions, footer align, CardDivider

New Card props: elevated (shadow-ds-md), glass (backdrop-blur).
CardHeader: actions slot (right-aligned ReactNode).
CardFooter: align prop (left/right/between).
New CardDivider sub-component with optional centered label.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Validate + update master tracker

**Files:** No component changes — validation only.

- [ ] **Step 1: Zero hardcoded palette classes in Badge and Button**

```bash
grep -rn "bg-blue-\|bg-green-\|bg-orange-\|bg-purple-\|bg-pink-\|text-blue-\|text-green-" \
  /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react/src/Badge.tsx \
  /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react/src/Button.tsx
```

Expected: zero matches (exit code 1).

- [ ] **Step 2: TypeScript — zero errors across all packages**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt/packages/react && npx tsc --noEmit 2>&1 | head -30
```

Expected: exits 0.

- [ ] **Step 3: Docs app builds**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=apps/docs 2>&1 | tail -20
```

Expected: build completes without errors.

- [ ] **Step 4: Verify react package builds**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt && npm run build --workspace=packages/react 2>&1 | tail -10
```

Expected: ESM + CJS + DTS outputs generated.

- [ ] **Step 5: Update master tracker**

In `docs/superpowers/DS-V1-MASTER.md`, update the SP2 row:

```
| SP2 | Component API upgrades | ✅ | ✅ | ✅ Done |
```

And add under Sub-Project 2:

```markdown
**Spec:** `docs/superpowers/specs/2026-04-09-sp2-component-api-design.md` ✅
**Plan:** `docs/superpowers/plans/2026-04-09-sp2-component-api.md` ✅
**Status:** ✅ Complete
```

- [ ] **Step 6: Final commit**

```bash
cd /Users/apacheco/Documents/GitHub/ds-foundation-rt
git add docs/superpowers/DS-V1-MASTER.md
git commit -m "$(cat <<'EOF'
docs: mark SP2 Component API upgrades complete in master tracker

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Success Criteria Checklist

Before declaring SP2 done, all of the following must be true:

- [ ] `grep -r "bg-blue-\|bg-green-\|bg-orange-\|text-blue-" packages/react/src/Badge.tsx packages/react/src/Button.tsx` returns zero matches
- [ ] `packages/react/src/CardDivider` (or CardDivider in Card.tsx) is exported from `index.ts`
- [ ] `cd packages/react && npx tsc --noEmit` exits 0
- [ ] `npm run build --workspace=apps/docs` completes without errors
- [ ] `npm run build --workspace=packages/react` completes without errors
- [ ] Bare `<Input />` (no composite props) renders identically to SP1 output
- [ ] Bare `<Textarea />` (no composite props) renders identically to SP1 output
