# Changelog

All notable changes to this project are documented in this file.
Per-package changelogs are in `packages/*/CHANGELOG.md`.

## [Unreleased]

### Added
- `IconButton` — 6-variant icon button atom with forwardRef and aria-label support
- `CurrencyBadge` — currency denomination pill with aria-label
- `Tag` — coloured label chip with optional remove button and icon slot
- `StatusPill` — payment workflow status badge with role=status
- `StatusRing` — urgency dot indicator (aria-hidden, optional pulse)
- `StateBadge` — workflow state badge with optional next-state transition
- `UrgencyBadge` — urgency level pill (critical/watch/clear/skip)
- `BankingWindowDot` — banking window status dot (open/closing/closed)
- `MonoAmount` — monospace financial amount with optional provenance interaction; exports `deriveFreshnessState`
- `FreshnessChip` — data recency indicator (fresh/watch/stale) with optional refresh button
- `DetailCard` — labelled section card molecule with h4 heading
- `FormCard` — selectable card molecule for radio/checkbox option selection
- `KpiCard` — metric display card molecule with optional trend indicator

## 0.3.0 — 2026-04-09

### Added
- SP3: Wireframe theme (`[data-theme="wireframe"]`), `DesignSystemProvider`, `useTheme`, `ThemeToggle`
- SP3: `sketch:` Tailwind variant for wireframe-specific class overrides
- SP3: Atomic design structure — atoms/molecules/organisms + treasury

### Changed
- Radix UI and all peer deps bundled — consumer install is now a single `npm install @ds-foundation/react`

## 0.2.0 — 2026-04-09

### Added
- SP2: Badge, Button, Input, Textarea, Card API upgrades

## 0.1.0 — 2026-04-09

### Added
- SP1: DTCG token build pipeline, semantic CSS alias layer, dark mode, 59 React components
