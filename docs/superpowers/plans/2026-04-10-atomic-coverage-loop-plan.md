# Atomic Coverage Loop — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 100% test coverage, zero TypeScript errors, zero design-system gaps — driven by a scanner script and GitHub issue loop.

**Architecture:** `scripts/scan-gaps.mjs` detects gaps → writes `tickets.md` → creates GH issues → execution loop resolves bottom-up (atoms → molecules → organisms → templates) → exits when scanner = 0 gaps + vitest passes + typecheck passes.

**Tech Stack:** Node.js 20 ESM, `gh` CLI, Vitest, TypeScript strict, React 18 + Radix UI + Tailwind, Brad Frost Atomic Design

---

## Component inventory

**Existing tests (8):** Button, Typography, Kbd, Skeleton, Menubar, Sidebar, AlertDialog, Accordion

**Missing tests — atoms (18):** Alert, AspectRatio, Avatar, Badge, Checkbox, Collapsible, DesignSystemProvider, Input, Label, Progress, RadioGroup, Separator, Slider, Spinner, Switch, Textarea, ThemeToggle, Toggle

**Missing tests — molecules (17):** Breadcrumb, Card, DatePicker, Form, HoverCard, InputNumber, InputOTP, Pagination, Popover, Resizable, ScrollArea, Segmented, Select, Stepper, Tabs, ToggleGroup, Tooltip

**Missing tests — organisms (13):** Calendar, Carousel, Command, ContextMenu, Dialog, Drawer, DropdownMenu, EmptyState, NavigationMenu, Sheet, Sonner, Table, Timeline

**Unimplemented registry specs — atoms (10):** IconButton, CurrencyBadge, Tag, StatusPill, StatusRing, StateBadge, UrgencyBadge, FreshnessChip, BankingWindowDot, MonoAmount

**Unimplemented registry specs — molecules (3):** DetailCard, FormCard, KpiCard

**Templates layer (new — 3):** PageLayout, SidebarLayout, TwoColumnLayout

**Code quality fixes:** Badge (no forwardRef), Dialog/Sheet/Drawer (hardcoded `bg-black/80` → `bg-ds-overlay`)

---

## Conventions

- All components: `React.forwardRef`, `.displayName`, spread `...props` on root element
- Props extend `React.HTMLAttributes<HTMLElement>` (appropriate element)
- Tokens: `var(--ds-*)` or Tailwind `ds.*` classes — never hex, never hardcoded
- Layer rules: atom = single element/Radix primitive, no DS imports; molecule = atoms only; organism = molecules + atoms
- Export all new components from `packages/react/src/index.ts` under the correct `// ── Layer ──` section
- Every closed ticket = one entry in `CHANGELOG.md` under `## [Unreleased]`

---

## Task 1: Scanner script

**Files:**
- Create: `scripts/scan-gaps.mjs`

- [ ] Create `scripts/scan-gaps.mjs`:

```js
#!/usr/bin/env node
// scripts/scan-gaps.mjs
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'fs'
import { join, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const COMPONENTS_ROOT = join(ROOT, 'packages/react/src/components')
const REGISTRY_ROOT = join(ROOT, 'packages/registry/components')
const TICKETS_PATH = join(ROOT, 'tickets.md')
const CHANGELOG_PATH = join(ROOT, 'CHANGELOG.md')

const args = process.argv.slice(2)
const componentFilter = args.includes('--component') ? args[args.indexOf('--component') + 1] : null
const isDryRun = args.includes('--dry-run')
const LAYERS = ['atoms', 'molecules', 'organisms', 'templates']
const FORBIDDEN_IMPORTS = { atom: ['organisms','molecules','templates'], molecule: ['organisms','templates'], organism: ['templates'], template: [] }

function toPascalCase(str) {
  return str.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')
}

function getComponentFiles(layerDir) {
  if (!existsSync(layerDir)) return []
  return readdirSync(layerDir)
    .filter(f => f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.'))
    .map(f => join(layerDir, f))
}

function checkLayerViolations(filePath, layer) {
  const content = readFileSync(filePath, 'utf8')
  const violations = []
  for (const forbidden of FORBIDDEN_IMPORTS[layer] || []) {
    if (content.includes(`/components/${forbidden}/`)) {
      violations.push(`Layer violation: ${layer} imports from ${forbidden}`)
    }
  }
  return violations
}

function getTypeScriptErrors() {
  try {
    execSync(`npx tsc --noEmit -p ${join(ROOT, 'packages/react/tsconfig.json')}`, { encoding: 'utf8', stdio: 'pipe' })
    return {}
  } catch (e) {
    const errorMap = {}
    for (const line of (e.stdout || '').split('\n')) {
      const m = line.match(/^.+\/(\w+)\.tsx?\(\d+,\d+\): error (TS\d+): (.+)$/)
      if (m) {
        if (!errorMap[m[1]]) errorMap[m[1]] = []
        errorMap[m[1]].push(`${m[2]}: ${m[3]}`)
      }
    }
    return errorMap
  }
}

function getUnimplementedSpecs() {
  if (!existsSync(REGISTRY_ROOT)) return []
  return readdirSync(REGISTRY_ROOT)
    .filter(f => f.endsWith('.mdx') && f !== '_template.mdx')
    .flatMap(mdxFile => {
      const content = readFileSync(join(REGISTRY_ROOT, mdxFile), 'utf8')
      const idMatch = content.match(/^id:\s*(.+)$/m)
      if (!idMatch) return []
      const componentName = toPascalCase(idMatch[1].trim())
      const found = LAYERS.some(l => existsSync(join(COMPONENTS_ROOT, l, `${componentName}.tsx`)))
      return found ? [] : [{ componentName, mdxFile, content }]
    })
}

function readExistingIssueNumbers() {
  if (!existsSync(TICKETS_PATH)) return {}
  const map = {}
  for (const m of readFileSync(TICKETS_PATH, 'utf8').matchAll(/### (\w+) \(#(\d+)\)/g)) {
    map[m[1]] = parseInt(m[2])
  }
  return map
}

function ensureGitHubInfra() {
  if (isDryRun) return
  try { execSync('gh api repos/:owner/:repo/milestones --jq \'.[] | select(.title=="Design System Coverage") | .number\' 2>/dev/null | grep -q . || gh api repos/:owner/:repo/milestones -f title="Design System Coverage" -f state="open"') } catch {}
  for (const [name, color, desc] of [
    ['test-coverage','0075ca','Missing .test.tsx file'],
    ['unimplemented','e4e669','Registry spec exists but no component'],
    ['code-quality','d73a4a','forwardRef missing, layer violation, or TS error'],
  ]) {
    try { execSync(`gh label create "${name}" --color "${color}" --description "${desc}" 2>/dev/null || true`) } catch {}
  }
}

function createIssue(componentName, layer, gapTypes, gaps, specContent) {
  if (isDryRun) { console.log(`[dry-run] [${layer}] ${componentName} — ${gapTypes.join(', ')}`); return null }
  const title = `[${layer}] ${componentName} — ${gapTypes.join(', ')}`
  const gapList = gaps.map(g => `- [ ] ${g}`).join('\n')
  const spec = specContent ? `\n## Registry spec\n\`\`\`\n${specContent.slice(0, 600)}\n\`\`\`` : ''
  const body = `## Component: ${componentName} (${layer})\n\n## Gaps\n${gapList}${spec}\n\n## Acceptance criteria\n- [ ] All gaps resolved\n- [ ] \`npx vitest run\` passes\n- [ ] \`npm run typecheck\` passes\n- [ ] \`node scripts/scan-gaps.mjs --component ${componentName}\` → 0 gaps\n- [ ] \`CHANGELOG.md\` updated under \`[Unreleased]\``
  try {
    const milestoneNum = execSync('gh api repos/:owner/:repo/milestones --jq \'.[] | select(.title=="Design System Coverage") | .number\'', { encoding: 'utf8' }).trim()
    const labelArgs = gapTypes.map(l => `--label "${l}"`).join(' ')
    const out = execSync(`gh issue create --title ${JSON.stringify(title)} --body ${JSON.stringify(body)} ${labelArgs} --milestone ${milestoneNum}`, { encoding: 'utf8' })
    const m = out.match(/\/issues\/(\d+)/)
    return m ? parseInt(m[1]) : null
  } catch (e) { console.error(`Failed to create issue for ${componentName}:`, e.message); return null }
}

function closeIssue(n) {
  if (isDryRun || !n) return
  try { execSync(`gh issue close ${n} --comment "All gaps resolved."`) } catch {}
}

async function main() {
  console.log('🔍 Scanning for gaps...\n')
  ensureGitHubInfra()

  const tsErrors = getTypeScriptErrors()
  const unimplementedSpecs = getUnimplementedSpecs()
  const existingIssues = readExistingIssueNumbers()
  const allGaps = []

  // Per-layer scan
  for (const layerPlural of LAYERS) {
    const layer = layerPlural.slice(0, -1)
    for (const filePath of getComponentFiles(join(COMPONENTS_ROOT, layerPlural))) {
      const name = basename(filePath, '.tsx')
      if (componentFilter && name !== componentFilter) continue
      const gaps = []
      const gapTypes = new Set()
      if (!existsSync(filePath.replace('.tsx', '.test.tsx'))) { gaps.push('Missing test file'); gapTypes.add('test-coverage') }
      const content = readFileSync(filePath, 'utf8')
      if (!content.includes('forwardRef')) { gaps.push('Missing React.forwardRef'); gapTypes.add('code-quality') }
      for (const v of checkLayerViolations(filePath, layer)) { gaps.push(v); gapTypes.add('code-quality') }
      for (const e of tsErrors[name] || []) { gaps.push(e); gapTypes.add('code-quality') }
      if (gaps.length) allGaps.push({ name, layer, gapTypes: [...gapTypes], gaps, specContent: null })
    }
  }

  // Unimplemented specs
  for (const { componentName, content } of unimplementedSpecs) {
    if (componentFilter && componentName !== componentFilter) continue
    allGaps.push({ name: componentName, layer: 'unimplemented', gapTypes: ['unimplemented'], gaps: ['No implementation found'], specContent: content })
  }

  // CHANGELOG sentinel
  if (existsSync(CHANGELOG_PATH) && !readFileSync(CHANGELOG_PATH, 'utf8').includes('## [Unreleased]')) {
    allGaps.push({ name: 'CHANGELOG', layer: 'meta', gapTypes: ['code-quality'], gaps: ['Missing [Unreleased] section'], specContent: null })
  }

  // Write tickets.md + sync GH issues
  const byLayer = {}
  for (const g of allGaps) { (byLayer[g.layer] ??= []).push(g) }

  const lines = [`# DS Foundation — Coverage Tickets`, `Generated: ${new Date().toISOString().slice(0,10)} | Open: ${allGaps.length} | Closed: 0`, '']
  for (const layer of ['meta','unimplemented','atom','molecule','organism','template']) {
    const items = byLayer[layer]; if (!items?.length) continue
    lines.push(`## ${layer.charAt(0).toUpperCase() + layer.slice(1)}s`, '')
    for (const item of items) {
      const issueNum = existingIssues[item.name] ?? createIssue(item.name, item.layer, item.gapTypes, item.gaps, item.specContent)
      lines.push(`### ${item.name}${issueNum ? ` (#${issueNum})` : ''} — ${item.gapTypes.join(', ')}`)
      for (const g of item.gaps) lines.push(`- [ ] ${g}`)
      lines.push(`Labels: ${item.gapTypes.join(', ')}`, '')
    }
  }

  if (!isDryRun) writeFileSync(TICKETS_PATH, lines.join('\n'))

  console.log(`\n✅ ${allGaps.length} gaps across ${new Set(allGaps.map(g => g.name)).size} components`)
  if (allGaps.length === 0) console.log('🎉 All gates green — ready to close milestone!')
}

main().catch(console.error)
```

- [ ] Run: `node scripts/scan-gaps.mjs --dry-run`
  Expected: gap list printed, no files written, no GH issues created
- [ ] Commit: `git add scripts/scan-gaps.mjs && git commit -m "feat(scanner): add scan-gaps.mjs scanner script"`

---

## Task 2: GitHub infrastructure + CHANGELOG

**Files:**
- Modify: `CHANGELOG.md`

- [ ] Create GH milestone and labels:
```bash
gh api repos/:owner/:repo/milestones -f title="Design System Coverage" -f state="open"
gh label create "test-coverage" --color "0075ca" --description "Missing .test.tsx file"
gh label create "unimplemented" --color "e4e669" --description "Registry spec exists but no component"
gh label create "code-quality" --color "d73a4a" --description "forwardRef missing, layer violation, or TS error"
```
- [ ] Prepend `## [Unreleased]\n\n` to `CHANGELOG.md` (before `## 0.3.0` line)
- [ ] Commit: `git add CHANGELOG.md && git commit -m "chore: add [Unreleased] section to CHANGELOG + GitHub infra"`

---

## Task 3: First full scanner run

**Files:**
- Generated: `tickets.md`

- [ ] Run: `node scripts/scan-gaps.mjs`
  Expected: `tickets.md` created, GH issues created under "Design System Coverage" milestone
- [ ] Verify: `gh issue list --milestone "Design System Coverage"` shows issues
- [ ] Commit: `git add tickets.md && git commit -m "chore: initial tickets.md from scanner"`

---

## Task 4: IconButton atom

**Files:**
- Create: `packages/react/src/components/atoms/IconButton.tsx`
- Create: `packages/react/src/components/atoms/IconButton.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: 6 variants (info/success/primary/warning/danger/neutral), 2 sizes (sm=24px, md=28px). Neutral at rest — variant color only on hover. `aria-label` required for icon-only. `icon: React.ReactNode`, optional `children` for label text.

- [ ] Write `IconButton.tsx`:
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

type IconButtonVariant = 'info' | 'success' | 'primary' | 'warning' | 'danger' | 'neutral'
type IconButtonSize = 'sm' | 'md'

const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-6 w-6 p-0.5',
        md: 'h-7 w-7 p-1',
      },
      variant: {
        info:    'text-ds-text-muted hover:text-ds-info hover:bg-ds-feedback-info-bg',
        success: 'text-ds-text-muted hover:text-ds-success-text hover:bg-ds-feedback-success-bg',
        primary: 'text-ds-text-muted hover:text-ds-primary hover:bg-ds-primary-subtle',
        warning: 'text-ds-text-muted hover:text-ds-warning-text hover:bg-ds-feedback-warning-bg',
        danger:  'text-ds-text-muted hover:text-ds-danger-text hover:bg-ds-feedback-error-bg',
        neutral: 'text-ds-text-muted hover:text-ds-text hover:bg-ds-surface-up',
      },
    },
    defaultVariants: { size: 'md', variant: 'neutral' },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(iconButtonVariants({ variant, size }), children ? 'gap-1 px-2 w-auto' : '', className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
)
IconButton.displayName = 'IconButton'

export { IconButton }
```

- [ ] Write `IconButton.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconButton } from './IconButton'

const icon = <svg data-testid="icon" />

describe('IconButton', () => {
  test('renders button with icon', () => {
    render(<IconButton icon={icon} aria-label="Delete" />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('renders label text when children provided', () => {
    render(<IconButton icon={icon}>Edit</IconButton>)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  test('calls onClick when clicked', async () => {
    const fn = vi.fn()
    render(<IconButton icon={icon} aria-label="Go" onClick={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('is disabled when disabled prop set', () => {
    render(<IconButton icon={icon} aria-label="Go" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

- [ ] Add to `packages/react/src/index.ts` under `// ── Atoms ──`:
  `export { IconButton, type IconButtonProps } from './components/atoms/IconButton';`
- [ ] Run: `npx vitest run packages/react/src/components/atoms/IconButton.test.tsx`
  Expected: 4 tests pass
- [ ] Run: `npm run typecheck`
  Expected: 0 errors
- [ ] Update `CHANGELOG.md` `[Unreleased]` → `### Added\n- \`IconButton\` — 6-variant icon button atom with aria-label support`
- [ ] Run: `node scripts/scan-gaps.mjs --component IconButton --dry-run`
  Expected: 0 gaps
- [ ] Close GH issue: `gh issue close <N>` (number from tickets.md)
- [ ] Commit: `git add packages/react/src/components/atoms/IconButton.tsx packages/react/src/components/atoms/IconButton.test.tsx packages/react/src/index.ts CHANGELOG.md tickets.md && git commit -m "feat(atoms): add IconButton"`

---

## Task 5: CurrencyBadge atom

**Files:**
- Create: `packages/react/src/components/atoms/CurrencyBadge.tsx`
- Create: `packages/react/src/components/atoms/CurrencyBadge.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `currency: 'USD' | 'EUR' | 'GBP'`. Surface-raised bg, border-default, text-secondary, font-mono tracking-wide. `aria-label="Currency: {currency}"`. Purely informational.

- [ ] Write `CurrencyBadge.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

export interface CurrencyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: 'USD' | 'EUR' | 'GBP'
}

const CurrencyBadge = React.forwardRef<HTMLSpanElement, CurrencyBadgeProps>(
  ({ currency, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={`Currency: ${currency}`}
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold font-mono tracking-wide',
        'bg-ds-surface-up text-ds-text-muted border border-ds-border',
        className
      )}
      {...props}
    >
      {currency}
    </span>
  )
)
CurrencyBadge.displayName = 'CurrencyBadge'

export { CurrencyBadge }
```

- [ ] Write `CurrencyBadge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { CurrencyBadge } from './CurrencyBadge'

describe('CurrencyBadge', () => {
  test.each(['USD', 'EUR', 'GBP'] as const)('renders %s with aria-label', (currency) => {
    render(<CurrencyBadge currency={currency} />)
    expect(screen.getByText(currency)).toBeInTheDocument()
    expect(screen.getByLabelText(`Currency: ${currency}`)).toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 6: Tag atom

**Files:**
- Create: `packages/react/src/components/atoms/Tag.tsx`
- Create: `packages/react/src/components/atoms/Tag.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: variants: default/blue/green/error/orange/purple. Optional `onRemove` (renders `<button aria-label="Remove">`). Optional `icon` leading slot. forwardRef to span.

- [ ] Write `Tag.tsx`:
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "../utils"

const tagVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-ds-surface-up text-ds-text-muted border border-ds-border',
        blue:    'bg-ds-feedback-info-bg text-ds-info-text border border-ds-info-border',
        green:   'bg-ds-feedback-success-bg text-ds-success-text border border-ds-success-border',
        error:   'bg-ds-feedback-error-bg text-ds-danger-text border border-ds-danger-border',
        orange:  'bg-ds-feedback-warning-bg text-ds-warning-text border border-ds-warning-border',
        purple:  'bg-ds-primary-subtle text-ds-primary border border-ds-primary',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void
  icon?: React.ReactNode
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, onRemove, icon, children, ...props }, ref) => (
    <span ref={ref} className={cn(tagVariants({ variant }), className)} {...props}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  )
)
Tag.displayName = 'Tag'

export { Tag }
```

- [ ] Write `Tag.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from './Tag'

describe('Tag', () => {
  test('renders label', () => {
    render(<Tag>Finance</Tag>)
    expect(screen.getByText('Finance')).toBeInTheDocument()
  })

  test('renders remove button when onRemove provided', () => {
    render(<Tag onRemove={vi.fn()}>Finance</Tag>)
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
  })

  test('calls onRemove when remove button clicked', async () => {
    const fn = vi.fn()
    render(<Tag onRemove={fn}>Finance</Tag>)
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('no remove button when onRemove not provided', () => {
    render(<Tag>Finance</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('renders icon slot', () => {
    render(<Tag icon={<svg data-testid="icon" />}>USD</Tag>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 7: StatusPill atom

**Files:**
- Create: `packages/react/src/components/atoms/StatusPill.tsx`
- Create: `packages/react/src/components/atoms/StatusPill.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `status` maps 8 workflow states to colors. `role="status"`, `aria-label="Status: {label}"`.

| status | label | color |
|---|---|---|
| submitted | Submitted | neutral |
| in_payments | In Payments | info |
| first_approval | 1st Approval | info |
| second_approval | 2nd Approval | info |
| sent_to_bank | Sent to Bank | success |
| bank_confirmed | Confirmed ✓ | success |
| failed | Failed | error |
| rejected | Rejected | error |

- [ ] Write `StatusPill.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

type InstructionStatus = 'submitted' | 'in_payments' | 'first_approval' | 'second_approval' | 'sent_to_bank' | 'bank_confirmed' | 'failed' | 'rejected'

const STATUS_CONFIG: Record<InstructionStatus, { label: string; className: string }> = {
  submitted:       { label: 'Submitted',    className: 'bg-ds-surface-up text-ds-text-muted border-ds-border' },
  in_payments:     { label: 'In Payments',  className: 'bg-ds-feedback-info-bg text-ds-info-text border-ds-info-border' },
  first_approval:  { label: '1st Approval', className: 'bg-ds-feedback-info-bg text-ds-info-text border-ds-info-border' },
  second_approval: { label: '2nd Approval', className: 'bg-ds-feedback-info-bg text-ds-info-text border-ds-info-border' },
  sent_to_bank:    { label: 'Sent to Bank', className: 'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border' },
  bank_confirmed:  { label: 'Confirmed ✓',  className: 'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border' },
  failed:          { label: 'Failed',       className: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border' },
  rejected:        { label: 'Rejected',     className: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border' },
}

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: InstructionStatus
}

const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ status, className, ...props }, ref) => {
    const { label, className: colorClass } = STATUS_CONFIG[status]
    return (
      <span
        ref={ref}
        role="status"
        aria-label={`Status: ${label}`}
        className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border', colorClass, className)}
        {...props}
      >
        {label}
      </span>
    )
  }
)
StatusPill.displayName = 'StatusPill'

export { StatusPill, type InstructionStatus }
```

- [ ] Write `StatusPill.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { StatusPill } from './StatusPill'

describe('StatusPill', () => {
  test('renders label for submitted', () => {
    render(<StatusPill status="submitted" />)
    expect(screen.getByText('Submitted')).toBeInTheDocument()
  })

  test('has role=status', () => {
    render(<StatusPill status="in_payments" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('aria-label describes current state', () => {
    render(<StatusPill status="failed" />)
    expect(screen.getByLabelText('Status: Failed')).toBeInTheDocument()
  })

  test('renders bank_confirmed label', () => {
    render(<StatusPill status="bank_confirmed" />)
    expect(screen.getByText('Confirmed ✓')).toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 8: StatusRing atom

**Files:**
- Create: `packages/react/src/components/atoms/StatusRing.tsx`
- Create: `packages/react/src/components/atoms/StatusRing.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `urgency: 'critical'|'watch'|'clear'|'skip'`, `size: 'sm'|'md'` (8/10px), `pulse?: boolean`. `aria-hidden="true"`.

- [ ] Write `StatusRing.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

type Urgency = 'critical' | 'watch' | 'clear' | 'skip'

const URGENCY_COLOR: Record<Urgency, string> = {
  critical: 'bg-ds-danger border-ds-danger',
  watch:    'bg-ds-warning border-ds-warning',
  clear:    'bg-ds-success border-ds-success',
  skip:     'bg-ds-primary border-ds-primary',
}

export interface StatusRingProps extends React.HTMLAttributes<HTMLSpanElement> {
  urgency: Urgency
  size?: 'sm' | 'md'
  pulse?: boolean
}

const StatusRing = React.forwardRef<HTMLSpanElement, StatusRingProps>(
  ({ urgency, size = 'md', pulse = false, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'inline-block rounded-full border-2',
        size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
        URGENCY_COLOR[urgency],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    />
  )
)
StatusRing.displayName = 'StatusRing'

export { StatusRing, type Urgency }
```

- [ ] Write `StatusRing.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { StatusRing } from './StatusRing'

describe('StatusRing', () => {
  test('renders with aria-hidden', () => {
    const { container } = render(<StatusRing urgency="critical" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  test('applies pulse class when pulse=true', () => {
    const { container } = render(<StatusRing urgency="watch" pulse />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  test('does not apply pulse class by default', () => {
    const { container } = render(<StatusRing urgency="critical" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 9: StateBadge atom

**Files:**
- Create: `packages/react/src/components/atoms/StateBadge.tsx`
- Create: `packages/react/src/components/atoms/StateBadge.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `state: string`, `intent: 'info'|'warning'|'success'|'error'|'neutral'`, `nextState?: string`, `size?: 'sm'|'md'`. Optional nextState renders `state → nextState` with `→` aria-hidden. `role="status"`.

- [ ] Write `StateBadge.tsx`:
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../utils"

type StateBadgeIntent = 'info' | 'warning' | 'success' | 'error' | 'neutral'

const stateBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded px-1.5 font-medium',
  {
    variants: {
      size:   { sm: 'py-0.5 text-xs', md: 'py-0.5 text-xs' },
      intent: {
        info:    'bg-ds-feedback-info-bg text-ds-info-text border border-ds-info-border',
        warning: 'bg-ds-feedback-warning-bg text-ds-warning-text border border-ds-warning-border',
        success: 'bg-ds-feedback-success-bg text-ds-success-text border border-ds-success-border',
        error:   'bg-ds-feedback-error-bg text-ds-danger-text border border-ds-danger-border',
        neutral: 'bg-ds-surface-up text-ds-text-muted border border-ds-border',
      },
    },
    defaultVariants: { size: 'md', intent: 'neutral' },
  }
)

export interface StateBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stateBadgeVariants> {
  state: string
  nextState?: string
}

const StateBadge = React.forwardRef<HTMLSpanElement, StateBadgeProps>(
  ({ state, nextState, intent, size, className, ...props }, ref) => {
    const label = nextState ? `${state}, next: ${nextState}` : state
    return (
      <span
        ref={ref}
        role="status"
        aria-label={`Status: ${label}`}
        className={cn(stateBadgeVariants({ intent, size }), className)}
        {...props}
      >
        {state}
        {nextState && (
          <>
            <span aria-hidden="true"> → </span>
            {nextState}
          </>
        )}
      </span>
    )
  }
)
StateBadge.displayName = 'StateBadge'

export { StateBadge, type StateBadgeIntent }
```

- [ ] Write `StateBadge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { StateBadge } from './StateBadge'

describe('StateBadge', () => {
  test('renders state label', () => {
    render(<StateBadge state="Processing" intent="info" />)
    expect(screen.getByText('Processing')).toBeInTheDocument()
  })

  test('has role=status', () => {
    render(<StateBadge state="Failed" intent="error" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  test('renders nextState when provided', () => {
    render(<StateBadge state="Processing" intent="info" nextState="Approval" />)
    expect(screen.getByText('Approval')).toBeInTheDocument()
  })

  test('aria-label includes nextState', () => {
    render(<StateBadge state="Processing" intent="info" nextState="Approval" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Processing, next: Approval')
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 10: UrgencyBadge atom

**Files:**
- Create: `packages/react/src/components/atoms/UrgencyBadge.tsx`
- Create: `packages/react/src/components/atoms/UrgencyBadge.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `urgency: 'critical'|'watch'|'clear'|'skip'`, `label?: string`. Default labels: Critical/Watch/Clear/Skip-node. Colors: critical=error, watch=warning, clear=success, skip=primary-subtle.

- [ ] Write `UrgencyBadge.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

type UrgencyLevel = 'critical' | 'watch' | 'clear' | 'skip'

const DEFAULT_LABELS: Record<UrgencyLevel, string> = {
  critical: 'Critical',
  watch:    'Watch',
  clear:    'Clear',
  skip:     'Skip-node',
}

const URGENCY_CLASS: Record<UrgencyLevel, string> = {
  critical: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border',
  watch:    'bg-ds-feedback-warning-bg text-ds-warning-text border-ds-warning-border',
  clear:    'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border',
  skip:     'bg-ds-primary-subtle text-ds-primary border-ds-primary',
}

export interface UrgencyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  urgency: UrgencyLevel
  label?: string
}

const UrgencyBadge = React.forwardRef<HTMLSpanElement, UrgencyBadgeProps>(
  ({ urgency, label, className, ...props }, ref) => {
    const text = label ?? DEFAULT_LABELS[urgency]
    return (
      <span
        ref={ref}
        aria-label={`Urgency: ${text}`}
        className={cn(
          'inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold border',
          URGENCY_CLASS[urgency],
          className
        )}
        {...props}
      >
        {text}
      </span>
    )
  }
)
UrgencyBadge.displayName = 'UrgencyBadge'

export { UrgencyBadge, type UrgencyLevel }
```

- [ ] Write `UrgencyBadge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { UrgencyBadge } from './UrgencyBadge'

describe('UrgencyBadge', () => {
  test.each([
    ['critical', 'Critical'],
    ['watch', 'Watch'],
    ['clear', 'Clear'],
    ['skip', 'Skip-node'],
  ] as const)('%s renders default label %s', (urgency, label) => {
    render(<UrgencyBadge urgency={urgency} />)
    expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.getByLabelText(`Urgency: ${label}`)).toBeInTheDocument()
  })

  test('uses custom label when provided', () => {
    render(<UrgencyBadge urgency="critical" label="Urgent" />)
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByLabelText('Urgency: Urgent')).toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 11: BankingWindowDot atom

**Files:**
- Create: `packages/react/src/components/atoms/BankingWindowDot.tsx`
- Create: `packages/react/src/components/atoms/BankingWindowDot.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `status: 'open'|'closing'|'closed'`, `size?: number` (default 6). open=success, closing=warning+pulse, closed=text-muted. `aria-hidden="true"`.

- [ ] Write `BankingWindowDot.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

type WindowStatus = 'open' | 'closing' | 'closed'

const STATUS_CLASS: Record<WindowStatus, string> = {
  open:    'bg-ds-success',
  closing: 'bg-ds-warning animate-pulse',
  closed:  'bg-ds-text-muted',
}

export interface BankingWindowDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: WindowStatus
  size?: number
}

const BankingWindowDot = React.forwardRef<HTMLSpanElement, BankingWindowDotProps>(
  ({ status, size = 6, className, style, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn('inline-block rounded-full', STATUS_CLASS[status], className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    />
  )
)
BankingWindowDot.displayName = 'BankingWindowDot'

export { BankingWindowDot, type WindowStatus }
```

- [ ] Write `BankingWindowDot.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { BankingWindowDot } from './BankingWindowDot'

describe('BankingWindowDot', () => {
  test('renders with aria-hidden', () => {
    const { container } = render(<BankingWindowDot status="open" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  test('applies pulse for closing status', () => {
    const { container } = render(<BankingWindowDot status="closing" />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  test('does not pulse when open', () => {
    const { container } = render(<BankingWindowDot status="open" />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })

  test('applies custom size via style', () => {
    const { container } = render(<BankingWindowDot status="open" size={10} />)
    expect((container.firstChild as HTMLElement).style.width).toBe('10px')
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 12: MonoAmount atom

**Files:**
- Create: `packages/react/src/components/atoms/MonoAmount.tsx`
- Create: `packages/react/src/components/atoms/MonoAmount.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `value: number`, `currency: 'USD'|'EUR'|'GBP'`, `size?: 'sm'|'md'|'lg'`, `color?: 'default'|'success'|'warning'|'error'|'muted'|'brand'`, `onProvenanceTap?: () => void`. When interactive: `role="button"`, `tabIndex={0}`, keyboard Enter/Space. Also export `deriveFreshnessState`.

- [ ] Write `MonoAmount.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

type AmountColor = 'default' | 'success' | 'warning' | 'error' | 'muted' | 'brand'
type AmountSize = 'sm' | 'md' | 'lg'
type AmountCurrency = 'USD' | 'EUR' | 'GBP'

const COLOR_CLASS: Record<AmountColor, string> = {
  default: 'text-ds-text',
  success: 'text-ds-success',
  warning: 'text-ds-warning',
  error:   'text-ds-danger',
  muted:   'text-ds-text-muted',
  brand:   'text-ds-primary',
}

const SIZE_CLASS: Record<AmountSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const CURRENCY_SYMBOL: Record<AmountCurrency, string> = { USD: '$', EUR: '€', GBP: '£' }

function formatAmount(value: number, currency: AmountCurrency): string {
  return `${CURRENCY_SYMBOL[currency]}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export interface MonoAmountProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number
  currency: AmountCurrency
  size?: AmountSize
  color?: AmountColor
  onProvenanceTap?: () => void
}

const MonoAmount = React.forwardRef<HTMLSpanElement, MonoAmountProps>(
  ({ value, currency, size = 'md', color = 'default', onProvenanceTap, className, ...props }, ref) => {
    const interactive = !!onProvenanceTap
    const formatted = formatAmount(value, currency)

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onProvenanceTap!()
      }
    }

    return (
      <span
        ref={ref}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `${formatted} — view provenance` : undefined}
        onClick={interactive ? onProvenanceTap : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        className={cn(
          'font-mono tabular-nums',
          SIZE_CLASS[size],
          COLOR_CLASS[color],
          interactive && 'cursor-pointer underline underline-offset-2',
          className
        )}
        {...props}
      >
        {formatted}
      </span>
    )
  }
)
MonoAmount.displayName = 'MonoAmount'

type FreshnessState = 'fresh' | 'watch' | 'stale'
function deriveFreshnessState(lastUpdatedAt: Date): FreshnessState {
  const ageMs = Date.now() - lastUpdatedAt.getTime()
  if (ageMs >= 15 * 60 * 1000) return 'stale'
  if (ageMs >= 5 * 60 * 1000) return 'watch'
  return 'fresh'
}

export { MonoAmount, deriveFreshnessState, type AmountColor, type AmountCurrency, type FreshnessState }
```

- [ ] Write `MonoAmount.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MonoAmount, deriveFreshnessState } from './MonoAmount'

describe('MonoAmount', () => {
  test('formats USD amount', () => {
    render(<MonoAmount value={1250000} currency="USD" />)
    expect(screen.getByText('$1,250,000.00')).toBeInTheDocument()
  })

  test('formats EUR amount', () => {
    render(<MonoAmount value={500} currency="EUR" />)
    expect(screen.getByText('€500.00')).toBeInTheDocument()
  })

  test('not interactive without onProvenanceTap', () => {
    render(<MonoAmount value={100} currency="USD" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('becomes interactive with onProvenanceTap', async () => {
    const fn = vi.fn()
    render(<MonoAmount value={100} currency="USD" onProvenanceTap={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('activates on Enter key when interactive', async () => {
    const fn = vi.fn()
    render(<MonoAmount value={100} currency="USD" onProvenanceTap={fn} />)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('deriveFreshnessState', () => {
  test('fresh when less than 5 minutes old', () => {
    expect(deriveFreshnessState(new Date(Date.now() - 2 * 60 * 1000))).toBe('fresh')
  })
  test('watch when 5–15 minutes old', () => {
    expect(deriveFreshnessState(new Date(Date.now() - 8 * 60 * 1000))).toBe('watch')
  })
  test('stale when 15+ minutes old', () => {
    expect(deriveFreshnessState(new Date(Date.now() - 20 * 60 * 1000))).toBe('stale')
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 13: FreshnessChip atom

**Files:**
- Create: `packages/react/src/components/atoms/FreshnessChip.tsx`
- Create: `packages/react/src/components/atoms/FreshnessChip.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `state: 'fresh'|'watch'|'stale'`, `timestamp: Date`, `onRefresh?: () => void`. fresh=visually hidden (aria-live region stays in DOM), watch=amber, stale=red+optional refresh button.

- [ ] Write `FreshnessChip.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"
import { RefreshCw } from "lucide-react"
import { type FreshnessState } from "./MonoAmount"

function formatRelativeTime(date: Date): string {
  const mins = Math.round((Date.now() - date.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins === 1) return '1 min ago'
  return `${mins} mins ago`
}

export interface FreshnessChipProps extends React.HTMLAttributes<HTMLDivElement> {
  state: FreshnessState
  timestamp: Date
  onRefresh?: () => void
}

const FreshnessChip = React.forwardRef<HTMLDivElement, FreshnessChipProps>(
  ({ state, timestamp, onRefresh, className, ...props }, ref) => (
    <div ref={ref} className={cn('inline-flex items-center gap-1', className)} {...props}>
      {/* aria-live region always in DOM to prevent mount-burst announcements */}
      <span
        role="status"
        aria-live="polite"
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tracking-widest border',
          state === 'fresh' && 'hidden',
          state === 'watch' && 'bg-ds-feedback-warning-bg text-ds-warning-text border-ds-warning-border',
          state === 'stale' && 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border'
        )}
      >
        {state !== 'fresh' && formatRelativeTime(timestamp)}
      </span>
      {state === 'stale' && onRefresh && (
        <button
          type="button"
          aria-label="Refresh data"
          onClick={onRefresh}
          className="text-ds-danger hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ds-border-focus rounded"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  )
)
FreshnessChip.displayName = 'FreshnessChip'

export { FreshnessChip }
```

- [ ] Write `FreshnessChip.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FreshnessChip } from './FreshnessChip'

const watchDate = new Date(Date.now() - 8 * 60 * 1000)
const staleDate = new Date(Date.now() - 20 * 60 * 1000)

describe('FreshnessChip', () => {
  test('hides chip when state=fresh', () => {
    const { container } = render(<FreshnessChip state="fresh" timestamp={new Date()} />)
    expect(container.querySelector('.hidden')).toBeInTheDocument()
  })

  test('shows amber chip when state=watch', () => {
    render(<FreshnessChip state="watch" timestamp={watchDate} />)
    expect(screen.getByRole('status')).not.toHaveClass('hidden')
  })

  test('shows refresh button when stale and onRefresh provided', () => {
    render(<FreshnessChip state="stale" timestamp={staleDate} onRefresh={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Refresh data' })).toBeInTheDocument()
  })

  test('calls onRefresh when refresh clicked', async () => {
    const fn = vi.fn()
    render(<FreshnessChip state="stale" timestamp={staleDate} onRefresh={fn} />)
    await userEvent.click(screen.getByRole('button', { name: 'Refresh data' }))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('no refresh button without onRefresh', () => {
    render(<FreshnessChip state="stale" timestamp={staleDate} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 14: DetailCard molecule

**Files:**
- Create: `packages/react/src/components/molecules/DetailCard.tsx`
- Create: `packages/react/src/components/molecules/DetailCard.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `title: string`, `children`. h4 heading, brand-primary color, uppercase. Rounded border bg-ds-surface p-4. Molecule (no DS atom composition required internally).

- [ ] Write `DetailCard.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

export interface DetailCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
}

const DetailCard = React.forwardRef<HTMLDivElement, DetailCardProps>(
  ({ title, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg bg-ds-surface border border-ds-border p-4', className)}
      {...props}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wider text-ds-primary border-b border-ds-border pb-2 mb-3">
        {title}
      </h4>
      {children}
    </div>
  )
)
DetailCard.displayName = 'DetailCard'

export { DetailCard }
```

- [ ] Write `DetailCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { DetailCard } from './DetailCard'

describe('DetailCard', () => {
  test('renders title as h4', () => {
    render(<DetailCard title="Payment Details"><p>content</p></DetailCard>)
    expect(screen.getByRole('heading', { level: 4, name: 'Payment Details' })).toBeInTheDocument()
  })

  test('renders children', () => {
    render(<DetailCard title="Test"><span>child</span></DetailCard>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts` under `// ── Molecules ──`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 15: FormCard molecule

**Files:**
- Create: `packages/react/src/components/molecules/FormCard.tsx`
- Create: `packages/react/src/components/molecules/FormCard.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `label`, `description?`, `icon?`, `selected?`, `disabled?`, `selectionType: 'radio'|'checkbox'`, `layout: 'tall'|'long'`, `onClick`. `role="button"`, `aria-pressed`, `aria-disabled`, `tabIndex=-1` when disabled. Enter/Space to activate.

- [ ] Write `FormCard.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"
import { Check, Circle } from "lucide-react"

export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: string
  icon?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  selectionType?: 'radio' | 'checkbox'
  layout?: 'tall' | 'long'
  onClick?: () => void
}

const FormCard = React.forwardRef<HTMLDivElement, FormCardProps>(
  ({
    label, description, icon, selected = false, disabled = false,
    selectionType = 'radio', layout = 'tall', onClick, className, ...props
  }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onClick?.()
      }
    }

    const Indicator = selectionType === 'checkbox' ? Check : Circle

    return (
      <div
        ref={ref}
        role="button"
        aria-pressed={selected}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'border rounded-lg p-4 transition-all duration-150 outline-none',
          'focus-visible:ring-4 focus-visible:ring-[#65BEFF] focus-visible:ring-offset-0',
          selected ? 'border-ds-primary bg-ds-primary-subtle' : 'border-ds-border bg-ds-surface',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-ds-primary',
          layout === 'long' ? 'flex items-center gap-3' : 'flex flex-col gap-2',
          className
        )}
        {...props}
      >
        <Indicator
          aria-hidden="true"
          className={cn('w-4 h-4 shrink-0', selected ? 'text-ds-primary' : 'text-ds-border')}
        />
        {icon && <span aria-hidden="true" className="text-ds-text-muted">{icon}</span>}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium text-ds-text">{label}</span>
          {description && <span className="text-xs text-ds-text-muted">{description}</span>}
        </div>
      </div>
    )
  }
)
FormCard.displayName = 'FormCard'

export { FormCard }
```

- [ ] Write `FormCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormCard } from './FormCard'

describe('FormCard', () => {
  test('renders label', () => {
    render(<FormCard label="Credit Card" />)
    expect(screen.getByText('Credit Card')).toBeInTheDocument()
  })

  test('has role=button', () => {
    render(<FormCard label="Option" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('aria-pressed reflects selected state', () => {
    render(<FormCard label="Option" selected />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  test('calls onClick when clicked', async () => {
    const fn = vi.fn()
    render(<FormCard label="Option" onClick={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('does not call onClick when disabled', async () => {
    const fn = vi.fn()
    render(<FormCard label="Option" disabled onClick={fn} />)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).not.toHaveBeenCalled()
  })

  test('activates on Enter key', async () => {
    const fn = vi.fn()
    render(<FormCard label="Option" onClick={fn} />)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('renders description when provided', () => {
    render(<FormCard label="Option" description="Some detail" />)
    expect(screen.getByText('Some detail')).toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 16: KpiCard molecule

**Files:**
- Create: `packages/react/src/components/molecules/KpiCard.tsx`
- Create: `packages/react/src/components/molecules/KpiCard.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: `label`, `value: string|number`, `trend?: { direction: 'up'|'down'|'neutral'; label: string }`, `icon?`. Numbers via `toLocaleString()`. Trend: up=success, down=danger, neutral=neutral.

- [ ] Write `KpiCard.tsx`:
```tsx
import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "../utils"

type TrendDirection = 'up' | 'down' | 'neutral'

const TREND_CONFIG: Record<TrendDirection, { className: string; Icon: React.ElementType }> = {
  up:      { className: 'bg-ds-feedback-success-bg text-ds-success-text border-ds-success-border', Icon: TrendingUp },
  down:    { className: 'bg-ds-feedback-error-bg text-ds-danger-text border-ds-danger-border', Icon: TrendingDown },
  neutral: { className: 'bg-ds-surface-up text-ds-text-muted border-ds-border', Icon: Minus },
}

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  trend?: { direction: TrendDirection; label: string }
  icon?: React.ReactNode
}

const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ label, value, trend, icon, className, ...props }, ref) => {
    const displayValue = typeof value === 'number' ? value.toLocaleString() : value
    return (
      <div
        ref={ref}
        className={cn('border border-ds-border rounded-xl bg-ds-surface p-6 flex flex-col gap-3', className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <span className="text-sm text-ds-text-muted">{label}</span>
          {icon && <span aria-hidden="true" className="text-ds-text-muted">{icon}</span>}
        </div>
        <span className="text-2xl font-semibold text-ds-text">{displayValue}</span>
        {trend && (() => {
          const { className: trendClass, Icon } = TREND_CONFIG[trend.direction]
          return (
            <span className={cn('inline-flex items-center gap-1 self-start rounded px-1.5 py-0.5 text-xs font-medium border', trendClass)}>
              <Icon className="w-3 h-3" aria-hidden="true" />
              {trend.label}
            </span>
          )
        })()}
      </div>
    )
  }
)
KpiCard.displayName = 'KpiCard'

export { KpiCard }
```

- [ ] Write `KpiCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { KpiCard } from './KpiCard'

describe('KpiCard', () => {
  test('renders label and value', () => {
    render(<KpiCard label="Revenue" value="$1,200" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,200')).toBeInTheDocument()
  })

  test('formats number value with toLocaleString', () => {
    render(<KpiCard label="Count" value={4821} />)
    expect(screen.getByText('4,821')).toBeInTheDocument()
  })

  test('renders trend label when provided', () => {
    render(<KpiCard label="Revenue" value="$1,200" trend={{ direction: 'up', label: '+12%' }} />)
    expect(screen.getByText('+12%')).toBeInTheDocument()
  })

  test('renders without trend', () => {
    render(<KpiCard label="Revenue" value="$1,200" />)
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
  })
})
```

- [ ] Export from `index.ts`, run tests, typecheck, update CHANGELOG, close GH issue, commit.

---

## Task 17: Intermediate scanner re-scan

- [ ] Run: `node scripts/scan-gaps.mjs`
  Expected: 13 new domain component issues are now closed; remaining = atom/molecule/organism test-coverage + code-quality gaps
- [ ] Run: `npx vitest run`
  Expected: all 13 new component tests pass plus existing 8
- [ ] Commit tickets.md: `git add tickets.md && git commit -m "chore: update tickets.md after domain component implementation"`

---

## Task 18: Atom tests — batch 1

**Files:** Create test files for Alert, Badge, Input, Checkbox, RadioGroup, Switch, Toggle

Pattern for all: `import { render, screen } from '@testing-library/react'` + `import userEvent from '@testing-library/user-event'`. 3–5 tests per component covering: renders, ARIA, user interaction, disabled state.

- [ ] Write `Alert.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './Alert'

describe('Alert', () => {
  test('has role=alert', () => {
    render(<Alert>message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
  test('renders AlertTitle and AlertDescription', () => {
    render(<Alert><AlertTitle>Title</AlertTitle><AlertDescription>Body</AlertDescription></Alert>)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })
  test('accepts variant prop without error', () => {
    render(<Alert variant="destructive">danger</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
```

- [ ] Write `Badge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  test('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
  test('renders as span', () => {
    const { container } = render(<Badge>Test</Badge>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })
  test('renders dot indicator when dot=true', () => {
    const { container } = render(<Badge dot>Status</Badge>)
    expect(container.querySelectorAll('span').length).toBeGreaterThan(1)
  })
  test('accepts variant and color props', () => {
    render(<Badge variant="solid" color="success">ok</Badge>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
})
```

- [ ] Write `Input.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  test('renders input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
  test('renders label when provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
  test('shows error text when errorText provided', () => {
    render(<Input errorText="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
  test('shows helper text', () => {
    render(<Input helperText="Enter your email" />)
    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })
  test('is disabled when disabled prop set', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
  test('calls onChange on user input', async () => {
    const fn = vi.fn()
    render(<Input onChange={fn} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(fn).toHaveBeenCalled()
  })
})
```

- [ ] Write `Checkbox.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  test('renders checkbox', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
  test('is unchecked by default', () => {
    render(<Checkbox />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })
  test('calls onCheckedChange when clicked', async () => {
    const fn = vi.fn()
    render(<Checkbox onCheckedChange={fn} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(fn).toHaveBeenCalledWith(true)
  })
})
```

- [ ] Write `RadioGroup.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

describe('RadioGroup', () => {
  test('renders radio inputs', () => {
    render(<RadioGroup><RadioGroupItem value="a" /><RadioGroupItem value="b" /></RadioGroup>)
    expect(screen.getAllByRole('radio')).toHaveLength(2)
  })
  test('reflects defaultValue', () => {
    render(<RadioGroup defaultValue="a"><RadioGroupItem value="a" /></RadioGroup>)
    expect(screen.getByRole('radio')).toBeChecked()
  })
})
```

- [ ] Write `Switch.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './Switch'

describe('Switch', () => {
  test('renders switch', () => {
    render(<Switch />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })
  test('calls onCheckedChange when toggled', async () => {
    const fn = vi.fn()
    render(<Switch onCheckedChange={fn} />)
    await userEvent.click(screen.getByRole('switch'))
    expect(fn).toHaveBeenCalledWith(true)
  })
})
```

- [ ] Write `Toggle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  test('renders as button', () => {
    render(<Toggle>Bold</Toggle>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
  test('has aria-pressed', () => {
    render(<Toggle pressed>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })
  test('calls onPressedChange when clicked', async () => {
    const fn = vi.fn()
    render(<Toggle onPressedChange={fn}>Bold</Toggle>)
    await userEvent.click(screen.getByRole('button'))
    expect(fn).toHaveBeenCalled()
  })
})
```

- [ ] Run: `npx vitest run packages/react/src/components/atoms/Alert.test.tsx packages/react/src/components/atoms/Badge.test.tsx packages/react/src/components/atoms/Input.test.tsx packages/react/src/components/atoms/Checkbox.test.tsx packages/react/src/components/atoms/RadioGroup.test.tsx packages/react/src/components/atoms/Switch.test.tsx packages/react/src/components/atoms/Toggle.test.tsx`
  Expected: all pass
- [ ] Update CHANGELOG `[Unreleased]` → `### Added\n- Vitest tests: Alert, Badge, Input, Checkbox, RadioGroup, Switch, Toggle`
- [ ] Commit all 7 test files + CHANGELOG

---

## Task 19: Atom tests — batch 2

**Files:** Avatar, Spinner, Progress, Label, Separator, Collapsible, Slider, Textarea, DesignSystemProvider, ThemeToggle, AspectRatio

- [ ] Write `Avatar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarFallback, AvatarImage } from './Avatar'

describe('Avatar', () => {
  test('renders fallback text', () => {
    render(<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })
})
```

- [ ] Write `Spinner.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  test('renders without crashing', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
```

- [ ] Write `Progress.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  test('renders progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})
```

- [ ] Write `Label.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  test('renders label text', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })
})
```

- [ ] Write `Separator.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Separator } from './Separator'

describe('Separator', () => {
  test('renders separator', () => {
    render(<Separator />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })
  test('horizontal by default', () => {
    render(<Separator />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })
})
```

- [ ] Write `Collapsible.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

describe('Collapsible', () => {
  test('shows content when open', async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    )
    await userEvent.click(screen.getByText('Toggle'))
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })
})
```

- [ ] Write `Slider.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Slider } from './Slider'

describe('Slider', () => {
  test('renders slider', () => {
    render(<Slider defaultValue={[50]} />)
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })
})
```

- [ ] Write `Textarea.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  test('renders textarea', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
  test('is disabled when disabled prop set', () => {
    render(<Textarea disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
  test('accepts user input', async () => {
    render(<Textarea />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })
})
```

- [ ] Write `DesignSystemProvider.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { DesignSystemProvider, useTheme } from './DesignSystemProvider'

function ThemeDisplay() {
  const { theme } = useTheme()
  return <span>{theme}</span>
}

describe('DesignSystemProvider', () => {
  test('renders children', () => {
    render(<DesignSystemProvider><span>child</span></DesignSystemProvider>)
    expect(screen.getByText('child')).toBeInTheDocument()
  })
  test('provides default theme via useTheme', () => {
    render(<DesignSystemProvider><ThemeDisplay /></DesignSystemProvider>)
    expect(screen.getByText('light')).toBeInTheDocument()
  })
})
```

- [ ] Write `ThemeToggle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { DesignSystemProvider } from './DesignSystemProvider'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  test('renders a button', () => {
    render(<DesignSystemProvider><ThemeToggle /></DesignSystemProvider>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

- [ ] Write `AspectRatio.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'

describe('AspectRatio', () => {
  test('renders without crashing', () => {
    const { container } = render(<AspectRatio ratio={16/9}><img alt="" /></AspectRatio>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
```

- [ ] Run all 11 test files, confirm pass, update CHANGELOG, commit.

---

## Task 20: Molecule tests — batch 1

**Files:** Tabs, Card, Breadcrumb, Pagination, Select, ScrollArea, Tooltip (with TooltipProvider), Popover

- [ ] Write `Tabs.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

describe('Tabs', () => {
  test('renders tabs and shows default content', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList><TabsTrigger value="a">Tab A</TabsTrigger><TabsTrigger value="b">Tab B</TabsTrigger></TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    )
    expect(screen.getByText('Content A')).toBeInTheDocument()
  })
  test('switches content on tab click', async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList><TabsTrigger value="a">A</TabsTrigger><TabsTrigger value="b">B</TabsTrigger></TabsList>
        <TabsContent value="a">A content</TabsContent>
        <TabsContent value="b">B content</TabsContent>
      </Tabs>
    )
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('B content')).toBeInTheDocument()
  })
})
```

- [ ] Write `Card.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'

describe('Card', () => {
  test('renders title and content', () => {
    render(<Card><CardHeader><CardTitle>My Card</CardTitle></CardHeader><CardContent>body</CardContent></Card>)
    expect(screen.getByText('My Card')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })
})
```

- [ ] Write `Breadcrumb.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from './Breadcrumb'

describe('Breadcrumb', () => {
  test('renders nav with breadcrumb links', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
```

- [ ] Write `Pagination.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from './Pagination'

describe('Pagination', () => {
  test('renders navigation', () => {
    render(<Pagination><PaginationContent><PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem></PaginationContent></Pagination>)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
```

- [ ] Write `Select.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select'

describe('Select', () => {
  test('renders trigger', () => {
    render(
      <Select>
        <SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
      </Select>
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
})
```

- [ ] Write `ScrollArea.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { ScrollArea } from './ScrollArea'

describe('ScrollArea', () => {
  test('renders children', () => {
    const { getByText } = render(<ScrollArea><p>content</p></ScrollArea>)
    expect(getByText('content')).toBeInTheDocument()
  })
})
```

- [ ] Write `Tooltip.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip'

describe('Tooltip', () => {
  test('shows tooltip content on hover', async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    await userEvent.hover(screen.getByText('Hover me'))
    expect(await screen.findByText('Tip text')).toBeInTheDocument()
  })
})
```

- [ ] Write `Popover.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'

describe('Popover', () => {
  test('shows content on trigger click', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )
    await userEvent.click(screen.getByText('Open'))
    expect(await screen.findByText('Popover body')).toBeInTheDocument()
  })
})
```

- [ ] Run all 8 test files, confirm pass, update CHANGELOG, commit.

---

## Task 21: Molecule tests — batch 2

**Files:** HoverCard, InputNumber, Segmented, ToggleGroup, Stepper, Resizable, InputOTP

- [ ] Write `HoverCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

describe('HoverCard', () => {
  test('renders trigger', () => {
    render(<HoverCard><HoverCardTrigger>Trigger</HoverCardTrigger><HoverCardContent>Info</HoverCardContent></HoverCard>)
    expect(screen.getByText('Trigger')).toBeInTheDocument()
  })
})
```

- [ ] Write `InputNumber.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { InputNumber } from './InputNumber'

describe('InputNumber', () => {
  test('renders a spinbutton', () => {
    render(<InputNumber />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })
  test('is disabled when disabled prop set', () => {
    render(<InputNumber disabled />)
    expect(screen.getByRole('spinbutton')).toBeDisabled()
  })
})
```

- [ ] Write `Segmented.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Segmented } from './Segmented'

describe('Segmented', () => {
  test('renders options', () => {
    render(<Segmented options={['Day', 'Week', 'Month']} value="Day" onChange={vi.fn()} />)
    expect(screen.getByText('Day')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
  })
})
```

- [ ] Write `ToggleGroup.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

describe('ToggleGroup', () => {
  test('renders items', () => {
    render(<ToggleGroup type="single"><ToggleGroupItem value="a">A</ToggleGroupItem></ToggleGroup>)
    expect(screen.getByText('A')).toBeInTheDocument()
  })
})
```

- [ ] Write `Stepper.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Stepper } from './Stepper'

describe('Stepper', () => {
  test('renders steps', () => {
    render(<Stepper steps={['Step 1', 'Step 2', 'Step 3']} currentStep={0} />)
    expect(screen.getByText('Step 1')).toBeInTheDocument()
  })
})
```

- [ ] Write `Resizable.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './Resizable'

describe('Resizable', () => {
  test('renders panels', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel><div>Left</div></ResizablePanel>
        <ResizableHandle />
        <ResizablePanel><div>Right</div></ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(container).toBeInTheDocument()
  })
})
```

- [ ] Write `InputOTP.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './InputOTP'

describe('InputOTP', () => {
  test('renders OTP slots', () => {
    render(<InputOTP maxLength={4}><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /></InputOTPGroup></InputOTP>)
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1)
  })
})
```

- [ ] Run all 7 test files, confirm pass, update CHANGELOG, commit.

---

## Task 22: Molecule tests — Form, DatePicker

- [ ] Write `Form.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './Form'
import { Input } from '../atoms/Input'

function TestForm() {
  const form = useForm<{ email: string }>()
  return (
    <Form {...form}>
      <form>
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  )
}

describe('Form', () => {
  test('renders field with label', () => {
    render(<TestForm />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })
})
```

- [ ] Write `DatePicker.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  test('renders trigger button', () => {
    render(<DatePicker />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

- [ ] Run both, confirm pass, update CHANGELOG, commit.

---

## Task 23: Organism tests — batch 1

**Files:** Dialog, Sheet, Drawer, DropdownMenu, EmptyState, Table

- [ ] Write `Dialog.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from './Dialog'

describe('Dialog', () => {
  test('opens on trigger click', async () => {
    render(<Dialog><DialogTrigger>Open</DialogTrigger><DialogContent><DialogTitle>Title</DialogTitle></DialogContent></Dialog>)
    await userEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
```

- [ ] Write `Sheet.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sheet, SheetTrigger, SheetContent } from './Sheet'

describe('Sheet', () => {
  test('opens on trigger click', async () => {
    render(<Sheet><SheetTrigger>Open</SheetTrigger><SheetContent>Sheet body</SheetContent></Sheet>)
    await userEvent.click(screen.getByText('Open'))
    expect(await screen.findByText('Sheet body')).toBeInTheDocument()
  })
})
```

- [ ] Write `Drawer.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Drawer, DrawerTrigger, DrawerContent } from './Drawer'

describe('Drawer', () => {
  test('opens on trigger click', async () => {
    render(<Drawer><DrawerTrigger>Open</DrawerTrigger><DrawerContent>Drawer body</DrawerContent></Drawer>)
    await userEvent.click(screen.getByText('Open'))
    expect(await screen.findByText('Drawer body')).toBeInTheDocument()
  })
})
```

- [ ] Write `DropdownMenu.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './DropdownMenu'

describe('DropdownMenu', () => {
  test('opens on trigger click', async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent><DropdownMenuItem>Action</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>
    )
    await userEvent.click(screen.getByText('Menu'))
    expect(await screen.findByText('Action')).toBeInTheDocument()
  })
})
```

- [ ] Write `EmptyState.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  test('renders title', () => {
    render(<EmptyState title="No results" />)
    expect(screen.getByText('No results')).toBeInTheDocument()
  })
})
```

- [ ] Write `Table.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table'

describe('Table', () => {
  test('renders table with headers and cells', () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>Alice</TableCell></TableRow></TableBody>
      </Table>
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })
})
```

- [ ] Run all 6 test files, confirm pass, update CHANGELOG, commit.

---

## Task 24: Organism tests — batch 2

**Files:** ContextMenu, Command, NavigationMenu, Timeline, Calendar, Carousel, Sonner

- [ ] Write `ContextMenu.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from './ContextMenu'

describe('ContextMenu', () => {
  test('opens on right-click', async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click me</ContextMenuTrigger>
        <ContextMenuContent><ContextMenuItem>Action</ContextMenuItem></ContextMenuContent>
      </ContextMenu>
    )
    await userEvent.pointer({ target: screen.getByText('Right-click me'), keys: '[MouseRight]' })
    expect(await screen.findByText('Action')).toBeInTheDocument()
  })
})
```

- [ ] Write `Command.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Command, CommandInput, CommandList, CommandItem } from './Command'

describe('Command', () => {
  test('renders input and items', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList><CommandItem>Item 1</CommandItem></CommandList>
      </Command>
    )
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })
})
```

- [ ] Write `NavigationMenu.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from './NavigationMenu'

describe('NavigationMenu', () => {
  test('renders nav with links', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem><NavigationMenuLink href="/">Home</NavigationMenuLink></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
```

- [ ] Write `Timeline.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Timeline } from './Timeline'

describe('Timeline', () => {
  test('renders without crashing', () => {
    const { container } = render(<Timeline items={[{ label: 'Event 1', date: '2026-01-01' }]} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
```

- [ ] Write `Calendar.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Calendar } from './Calendar'

describe('Calendar', () => {
  test('renders a grid', () => {
    render(<Calendar mode="single" />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })
})
```

- [ ] Write `Carousel.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { Carousel, CarouselContent, CarouselItem } from './Carousel'

describe('Carousel', () => {
  test('renders without crashing', () => {
    const { container } = render(<Carousel><CarouselContent><CarouselItem>Slide 1</CarouselItem></CarouselContent></Carousel>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
```

- [ ] Write `Sonner.test.tsx`:
```tsx
import { render } from '@testing-library/react'
import { Toaster } from './Sonner'

describe('Sonner', () => {
  test('renders toaster without crashing', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeInTheDocument()
  })
})
```

- [ ] Run all 7 test files, confirm pass, update CHANGELOG, commit.

---

## Task 25: Code quality — Badge forwardRef

**Files:**
- Modify: `packages/react/src/components/atoms/Badge.tsx`

Badge is currently a plain function with no `React.forwardRef`. The scanner flags this.

- [ ] In `Badge.tsx`, replace the `function Badge(...)` declaration with `React.forwardRef`:
```tsx
// Replace:
function Badge({
  className,
  variant = 'subtle',
  color = 'neutral',
  size = 'md',
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ size, variant, color }), className)}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

// With:
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'subtle', color = 'neutral', size = 'md', dot, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ size, variant, color }), className)}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0 bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
)
```

- [ ] Run: `node scripts/scan-gaps.mjs --component Badge --dry-run`
  Expected: 0 code-quality gaps (forwardRef now present), test-coverage gap still shows if test not yet written
- [ ] Run: `npm run typecheck`
  Expected: 0 errors
- [ ] Update CHANGELOG `[Unreleased]` → `### Fixed\n- \`Badge\` — added React.forwardRef for DOM ref forwarding`
- [ ] Close GH issue for Badge code-quality
- [ ] Commit: `git add packages/react/src/components/atoms/Badge.tsx CHANGELOG.md && git commit -m "fix(atoms): add React.forwardRef to Badge"`

---

## Task 26: Code quality — overlay token in Dialog, Sheet, Drawer

**Files:**
- Modify: `packages/react/src/components/organisms/Dialog.tsx`
- Modify: `packages/react/src/components/organisms/Sheet.tsx`
- Modify: `packages/react/src/components/organisms/Drawer.tsx`

All three use hardcoded `bg-black/80` on the overlay element. Replace with `bg-ds-overlay` (which is `rgba(0,0,0,0.6)` via semantic.css).

- [ ] In `Dialog.tsx`: find the overlay/backdrop element and replace `bg-black/80` → `bg-ds-overlay`
- [ ] In `Sheet.tsx`: same replacement
- [ ] In `Drawer.tsx`: same replacement
- [ ] Run: `npm run typecheck`
  Expected: 0 errors
- [ ] Run: `npx vitest run`
  Expected: all tests still pass
- [ ] Update CHANGELOG → `### Fixed\n- Dialog, Sheet, Drawer — overlay now uses --ds-overlay token instead of hardcoded bg-black/80`
- [ ] Close GH issues for Dialog/Sheet/Drawer code-quality
- [ ] Commit all 3 modified files + CHANGELOG

---

## Task 27: Templates — PageLayout

**Files:**
- Create: `packages/react/src/components/templates/PageLayout.tsx`
- Create: `packages/react/src/components/templates/PageLayout.test.tsx`
- Modify: `packages/react/src/index.ts`

Spec: Slots: `header?`, `sidebar?`, `main`, `footer?`. Pure CSS Grid. Zero DS state, zero business logic. forwardRef to div.

- [ ] Create `packages/react/src/components/templates/` directory
- [ ] Write `PageLayout.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ header, sidebar, footer, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'grid min-h-screen',
        header ? 'grid-rows-[auto_1fr_auto]' : 'grid-rows-[1fr_auto]',
        sidebar ? 'grid-cols-[auto_1fr]' : 'grid-cols-[1fr]',
        className
      )}
      {...props}
    >
      {header && (
        <header className={cn('col-span-full', sidebar ? 'col-span-2' : '')}>
          {header}
        </header>
      )}
      {sidebar && <aside>{sidebar}</aside>}
      <main>{children}</main>
      {footer && (
        <footer className={cn(sidebar ? 'col-span-2' : 'col-span-1')}>
          {footer}
        </footer>
      )}
    </div>
  )
)
PageLayout.displayName = 'PageLayout'

export { PageLayout }
```

- [ ] Write `PageLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { PageLayout } from './PageLayout'

describe('PageLayout', () => {
  test('renders main content', () => {
    render(<PageLayout>Main content</PageLayout>)
    expect(screen.getByText('Main content')).toBeInTheDocument()
  })
  test('renders header slot when provided', () => {
    render(<PageLayout header={<nav>Nav</nav>}>Content</PageLayout>)
    expect(screen.getByText('Nav')).toBeInTheDocument()
  })
  test('renders sidebar slot when provided', () => {
    render(<PageLayout sidebar={<aside>Sidebar</aside>}>Content</PageLayout>)
    expect(screen.getByText('Sidebar')).toBeInTheDocument()
  })
  test('renders footer slot when provided', () => {
    render(<PageLayout footer={<footer>Footer</footer>}>Content</PageLayout>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
```

- [ ] Add to `packages/react/src/index.ts`:
```ts
// ── Templates ──────────────────────────────────
export { PageLayout, type PageLayoutProps } from './components/templates/PageLayout';
```

- [ ] Run tests, typecheck, update CHANGELOG, commit.

---

## Task 28: Templates — SidebarLayout + TwoColumnLayout

**Files:**
- Create: `packages/react/src/components/templates/SidebarLayout.tsx`
- Create: `packages/react/src/components/templates/SidebarLayout.test.tsx`
- Create: `packages/react/src/components/templates/TwoColumnLayout.tsx`
- Create: `packages/react/src/components/templates/TwoColumnLayout.test.tsx`
- Modify: `packages/react/src/index.ts`

- [ ] Write `SidebarLayout.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

export interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode
  sidebarWidth?: string
  children: React.ReactNode
}

const SidebarLayout = React.forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ sidebar, sidebarWidth = '240px', children, className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex min-h-screen', className)}
      style={style}
      {...props}
    >
      <aside style={{ width: sidebarWidth, flexShrink: 0 }}>
        {sidebar}
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
)
SidebarLayout.displayName = 'SidebarLayout'

export { SidebarLayout }
```

- [ ] Write `SidebarLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { SidebarLayout } from './SidebarLayout'

describe('SidebarLayout', () => {
  test('renders sidebar and main content', () => {
    render(<SidebarLayout sidebar={<nav>Nav</nav>}>Content</SidebarLayout>)
    expect(screen.getByText('Nav')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  test('applies custom sidebarWidth', () => {
    const { container } = render(<SidebarLayout sidebar={<nav>Nav</nav>} sidebarWidth="320px">Content</SidebarLayout>)
    const aside = container.querySelector('aside')!
    expect(aside.style.width).toBe('320px')
  })
})
```

- [ ] Write `TwoColumnLayout.tsx`:
```tsx
import * as React from "react"
import { cn } from "../utils"

type ColumnRatio = '1:1' | '1:2' | '2:1'

const RATIO_CLASS: Record<ColumnRatio, string> = {
  '1:1': 'grid-cols-2',
  '1:2': 'grid-cols-[1fr_2fr]',
  '2:1': 'grid-cols-[2fr_1fr]',
}

export interface TwoColumnLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  left: React.ReactNode
  right: React.ReactNode
  ratio?: ColumnRatio
}

const TwoColumnLayout = React.forwardRef<HTMLDivElement, TwoColumnLayoutProps>(
  ({ left, right, ratio = '1:1', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid gap-6', RATIO_CLASS[ratio], className)}
      {...props}
    >
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
)
TwoColumnLayout.displayName = 'TwoColumnLayout'

export { TwoColumnLayout, type ColumnRatio }
```

- [ ] Write `TwoColumnLayout.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { TwoColumnLayout } from './TwoColumnLayout'

describe('TwoColumnLayout', () => {
  test('renders left and right content', () => {
    render(<TwoColumnLayout left={<div>Left</div>} right={<div>Right</div>} />)
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })
  test('accepts ratio prop without error', () => {
    render(<TwoColumnLayout ratio="1:2" left={<div>L</div>} right={<div>R</div>} />)
    expect(screen.getByText('L')).toBeInTheDocument()
  })
})
```

- [ ] Export both from `index.ts` under `// ── Templates ──`
- [ ] Run all 4 template tests, typecheck, update CHANGELOG, commit.

---

## Task 29: Final scanner run + milestone close

- [ ] Run: `node scripts/scan-gaps.mjs`
  Expected: `0 gaps found`
- [ ] Run: `npx vitest run`
  Expected: all tests pass (target: 0 failures)
- [ ] Run: `npm run typecheck`
  Expected: 0 errors
- [ ] If any remaining gaps, fix them before proceeding
- [ ] Close GH milestone:
```bash
gh api repos/:owner/:repo/milestones --jq '.[] | select(.title=="Design System Coverage") | .number' \
  | xargs -I{} gh api repos/:owner/:repo/milestones/{} -X PATCH -f state=closed
```
- [ ] Final commit: `git add tickets.md CHANGELOG.md && git commit -m "chore: close Design System Coverage milestone — all gates green"`
