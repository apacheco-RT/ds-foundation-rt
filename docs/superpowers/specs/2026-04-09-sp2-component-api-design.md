# SP2 — Component API Upgrades Design Spec

**Project:** DS v1 — Unified Design System  
**Sub-project:** SP2 — Component API Upgrades  
**Date:** 2026-04-09  
**Status:** Approved — ready for implementation plan

---

## Goal

Upgrade four core components (Badge, Button, Input/Textarea, Card) with the API improvements identified in DS-Michelangelo. All color values must use `var(--ds-*)` CSS custom properties — no hardcoded hex or palette classes. SystemProps are out of scope (SP4).

---

## Implementation Strategy

**Option B — CVA structure + inline var() for color.**

- CVA handles shape, size, spacing, and typography via Tailwind `ds.*` classes.
- Per-color values (background, text, border) are applied as `style={{ backgroundColor: 'var(--ds-...)', ... }}` — a static lookup table of CSS var references, never raw hex values.
- Tailwind config is not extended for feedback bg/text/border colors; the existing semantic alias vars are sufficient.
- Backwards compatibility: all new props are optional; components with no new props render identically to SP1.

---

## Section 1: Badge

### New API

```tsx
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'subtle' | 'outline';   // default: 'subtle'
  color?:   'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'; // default: 'neutral'
  size?:    'sm' | 'md';                       // default: 'md'
  dot?:     boolean;                           // renders indicator dot before children
}
```

The old `variant` values (`default`, `secondary`, `destructive`, `pink`) are retired. `pink` is deferred pending token support.

### CVA — structure only

```ts
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
);
```

### Color lookup table

Colors applied via `style` prop — no hardcoded values, only `var(--ds-*)` references.

| color | variant | backgroundColor | color (text) | borderColor |
|---|---|---|---|---|
| `primary` | `subtle` | `var(--ds-primary-subtle)` | `var(--ds-primary)` | `var(--ds-primary)` |
| `primary` | `solid` | `var(--ds-primary)` | `var(--ds-primary-fg)` | `var(--ds-primary)` |
| `primary` | `outline` | `transparent` | `var(--ds-primary)` | `var(--ds-primary)` |
| `success` | `subtle` | `var(--ds-feedback-success-bg)` | `var(--ds-feedback-success-text)` | `var(--ds-feedback-success-border)` |
| `success` | `solid` | `var(--ds-feedback-success-icon)` | `var(--ds-text-inverse)` | `var(--ds-feedback-success-icon)` |
| `success` | `outline` | `transparent` | `var(--ds-feedback-success-text)` | `var(--ds-feedback-success-border)` |
| `warning` | `subtle` | `var(--ds-feedback-warning-bg)` | `var(--ds-feedback-warning-text)` | `var(--ds-feedback-warning-border)` |
| `warning` | `solid` | `var(--ds-feedback-warning-icon)` | `var(--ds-text-inverse)` | `var(--ds-feedback-warning-icon)` |
| `warning` | `outline` | `transparent` | `var(--ds-feedback-warning-text)` | `var(--ds-feedback-warning-border)` |
| `danger` | `subtle` | `var(--ds-feedback-error-bg)` | `var(--ds-feedback-error-text)` | `var(--ds-feedback-error-border)` |
| `danger` | `solid` | `var(--ds-feedback-error-icon)` | `var(--ds-text-inverse)` | `var(--ds-feedback-error-icon)` |
| `danger` | `outline` | `transparent` | `var(--ds-feedback-error-text)` | `var(--ds-feedback-error-border)` |
| `info` | `subtle` | `var(--ds-feedback-info-bg)` | `var(--ds-feedback-info-text)` | `var(--ds-feedback-info-border)` |
| `info` | `solid` | `var(--ds-feedback-info-icon)` | `var(--ds-text-inverse)` | `var(--ds-feedback-info-icon)` |
| `info` | `outline` | `transparent` | `var(--ds-feedback-info-text)` | `var(--ds-feedback-info-border)` |
| `neutral` | `subtle` | `var(--ds-bg)` | `var(--ds-text-muted)` | `var(--ds-border)` |
| `neutral` | `solid` | `var(--ds-surface-up)` | `var(--ds-text)` | `var(--ds-surface-up)` |
| `neutral` | `outline` | `transparent` | `var(--ds-text-muted)` | `var(--ds-border)` |

### Dot indicator

When `dot={true}`: render `<span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'currentColor' }} />` before `children`. Color inherits from the text color via `currentColor`.

### File

`packages/react/src/Badge.tsx` — replaced in full.

---

## Section 2: Button

### New API

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:     'solid' | 'outline' | 'ghost' | 'link';                              // default: 'solid'
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';           // default: 'primary'
  size?:        'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';                          // default: 'md'
  isLoading?:   boolean;
  loadingText?: string;
  leftIcon?:    React.ReactElement;
  rightIcon?:   React.ReactElement;
  asChild?:     boolean;
}
```

### Variant rename mapping

Existing usages in the docs app must be updated as part of SP2:

| Old | New |
|---|---|
| `variant="default"` | `variant="solid"` (colorScheme="primary") |
| `variant="destructive"` | `variant="solid" colorScheme="danger"` |
| `variant="secondary"` | `variant="outline" colorScheme="neutral"` |
| `variant="outline"` | `variant="outline"` (colorScheme="primary") |
| `variant="ghost"` | `variant="ghost"` |
| `variant="link"` | `variant="link"` |

### CVA — structure only

```ts
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-ds-bg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        xs:   'h-7 px-2.5 text-xs',
        sm:   'h-8 px-3 text-sm',
        md:   'h-10 px-4 text-sm',
        lg:   'h-11 px-6 text-base',
        xl:   'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { size: 'md' },
  }
);
```

Variant + colorScheme color styles applied via `style` prop.

### Color lookup table — solid variant

| colorScheme | backgroundColor | color (text) | hover |
|---|---|---|---|
| `primary` | `var(--ds-primary)` | `var(--ds-primary-fg)` | `var(--ds-primary-hover)` via `hover:opacity-90` |
| `success` | `var(--ds-feedback-success-icon)` | `var(--ds-text-inverse)` | `hover:opacity-90` |
| `warning` | `var(--ds-feedback-warning-icon)` | `var(--ds-text-inverse)` | `hover:opacity-90` |
| `danger` | `var(--ds-feedback-error-icon)` | `var(--ds-text-inverse)` | `hover:opacity-90` |
| `neutral` | `var(--ds-surface-up)` | `var(--ds-text)` | `hover:opacity-90` |

### Color lookup table — outline variant

| colorScheme | border | color (text) | background |
|---|---|---|---|
| `primary` | `var(--ds-primary)` | `var(--ds-primary)` | `transparent` |
| `success` | `var(--ds-feedback-success-border)` | `var(--ds-feedback-success-text)` | `transparent` |
| `warning` | `var(--ds-feedback-warning-border)` | `var(--ds-feedback-warning-text)` | `transparent` |
| `danger` | `var(--ds-feedback-error-border)` | `var(--ds-feedback-error-text)` | `transparent` |
| `neutral` | `var(--ds-border)` | `var(--ds-text)` | `transparent` |

### Color lookup table — ghost variant

Same as outline but `border: transparent` always. Background on hover: `var(--ds-primary-subtle)` for primary, `var(--ds-surface-up)` for all other colorSchemes.

### link variant

`link` is colorScheme-agnostic: `color: var(--ds-primary)`, no background, no border, underline on hover. `colorScheme` prop ignored when `variant="link"`.

### Loading state

When `isLoading={true}`:
- Render `<Loader2 className="animate-spin w-4 h-4" />` as the leftmost child (replaces `leftIcon` if both provided)
- If `loadingText` is provided: replace button label text with `loadingText`
- Apply `disabled` and `pointer-events-none`
- Button width stays fixed — no layout jump

### Icons

`leftIcon` and `rightIcon` accept any `React.ReactElement`. Each is wrapped:

```tsx
<span className="shrink-0 [&>svg]:w-full [&>svg]:h-full" style={{ width: iconSize, height: iconSize }}>
  {icon}
</span>
```

Icon size by button size:
| size | icon dimensions |
|---|---|
| xs, sm | 14px × 14px |
| md, lg, xl, icon | 16px × 16px |

### File

`packages/react/src/Button.tsx` — replaced in full.  
`apps/docs/` — any story or demo using old variant names updated.

---

## Section 3: Input + Textarea

### New Input API

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:          string;
  helperText?:     string;
  errorText?:      string;
  size?:           'sm' | 'md' | 'lg';  // default: 'md'
  leftAdornment?:  React.ReactNode;
  rightAdornment?: React.ReactNode;
  // required is inherited from InputHTMLAttributes — used to add * to label
}
```

### New Textarea API

```tsx
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:      string;
  helperText?: string;
  errorText?:  string;
  size?:       'sm' | 'md' | 'lg';  // default: 'md'
  // no adornments — not applicable to multiline fields
}
```

### Backwards compatibility

When `label`, `helperText`, `errorText`, `leftAdornment`, and `rightAdornment` are all absent:
- `Input` renders exactly as SP1: a bare `<input>` element with the same class string.
- `Textarea` renders exactly as SP1: a bare `<textarea>` element.
- Zero regressions on existing Form/FormItem/FormLabel usages.

### Composite render structure (Input)

When any composite prop is provided:

```
<div className="flex flex-col gap-1.5 w-full">
  <label className="text-sm font-medium text-ds-text">
    {label}{required && <span className="text-ds-danger ml-0.5">*</span>}
  </label>                                          ← only if label provided
  <div className="relative flex items-center">     ← input row
    <span className="absolute left-3 text-ds-text-muted shrink-0">
      {leftAdornment}                               ← only if provided
    </span>
    <input
      className={cn(inputClasses, errorText && 'border-ds-danger', ...)}
      style={{ paddingLeft: leftAdornment ? '2.5rem' : undefined,
               paddingRight: rightAdornment ? '2.5rem' : undefined }}
    />
    <span className="absolute right-3 text-ds-text-muted shrink-0">
      {rightAdornment}                              ← only if provided
    </span>
  </div>
  <p className={cn('text-xs', errorText ? 'text-ds-danger' : 'text-ds-text-muted')}>
    {errorText ?? helperText}                       ← only if either provided; errorText wins
  </p>
</div>
```

### Size variants

| size | input height | text size | adornment padding |
|---|---|---|---|
| sm | h-8 | text-sm | pl/pr-9 |
| md | h-10 | text-sm | pl/pr-10 |
| lg | h-12 | text-base | pl/pr-11 |

### Composite render structure (Textarea)

Same as Input but without the `relative flex` row — just `<textarea>` directly under the label wrapper. No adornment padding.

### Files

- `packages/react/src/Input.tsx` — replaced in full
- `packages/react/src/Textarea.tsx` — replaced in full

---

## Section 4: Card

All additions are backwards compatible — no existing props change.

### Card root — new props

```tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;  // adds shadow-ds-md
  glass?:    boolean;  // adds backdrop-blur-sm bg-ds-surface/80
}
```

`elevated` and `glass` are independent booleans and can be combined.

### CardHeader — new actions slot

```tsx
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode;  // rendered right-aligned in the header row
}
```

When `actions` is provided, `CardHeader` layout changes from `flex-col` to `flex flex-row items-start justify-between`. Children (CardTitle, CardDescription) are wrapped in a `<div className="flex flex-col space-y-1.5">`. When `actions` is absent, layout is unchanged.

### CardFooter — new align prop

```tsx
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'between';  // default: 'left'
}
```

| align | Tailwind class |
|---|---|
| `left` | `justify-start` (current default) |
| `right` | `justify-end` |
| `between` | `justify-between` |

### CardDivider — new sub-component

```tsx
interface CardDividerProps {
  label?: string;   // optional centered label text
  className?: string;
}
```

Without label: `<div className="border-t border-ds-border my-0" />` (fills the card width, sits between CardContent sections with `-mx-6` to bleed to card edges within `p-6` padding).

With label:
```
<div className="flex items-center gap-3 text-xs text-ds-text-muted">
  <div className="flex-1 border-t border-ds-border" />
  <span>{label}</span>
  <div className="flex-1 border-t border-ds-border" />
</div>
```

### Files

`packages/react/src/Card.tsx` — modified in place (additive).

---

## Files Created / Modified

| File | Action | Notes |
|---|---|---|
| `packages/react/src/Badge.tsx` | Replace | New color/variant/size/dot API |
| `packages/react/src/Button.tsx` | Replace | New colorScheme/size/isLoading/icons |
| `packages/react/src/Input.tsx` | Replace | New label/adornments/error/size |
| `packages/react/src/Textarea.tsx` | Replace | New label/error/size |
| `packages/react/src/Card.tsx` | Modify | elevated/glass, CardHeader actions, CardFooter align, CardDivider |
| `apps/docs/` stories/demos | Modify | Update old Button variant names to new API |

---

## Non-Goals for SP2

- SystemProps (margin, padding, width overrides) — SP4
- Wireframe / Lo-Fi mode on any component — SP3
- Pink Badge color — deferred pending token support
- Button group / segmented button — post-v1
- Input masking, datepicker, or other specialized input types — post-v1
- Card.Body rename from Card.Content — deferred (breaking change, no value yet)

---

## Success Criteria

1. `grep -r "bg-blue-\|bg-green-\|bg-orange-\|bg-purple-\|bg-pink-\|text-blue-\|text-green-" packages/react/src/Badge.tsx packages/react/src/Button.tsx` returns zero matches
2. All Badge color × variant combinations render using only `var(--ds-*)` values
3. Button renders `isLoading` spinner without layout shift
4. Input renders label, adornments, and error text correctly; bare `<input>` usage (no composite props) is unchanged
5. CardDivider renders full-width and bleeds to card edges
6. TypeScript compiles with zero errors (`tsc --noEmit`)
7. Docs app builds without errors
