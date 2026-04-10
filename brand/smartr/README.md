# SmartR Brand Assets

Brand assets for the SmartR product suite. Covers eight product modules with logos in four colour variants and branded background images.

---

## Colours

| Token | Role | Light hex | Dark hex |
|-------|------|-----------|----------|
| `--ds-brand-smartr-coral` | Primary brand colour | `#FF6143` | `#FF7D66` |
| `--ds-brand-smartr-golden` | Accent / gradient end | `#FFD100` | `#FEE523` |

**Brand gradient:**
```css
background: linear-gradient(90deg, var(--ds-brand-smartr-coral) 25%, var(--ds-brand-smartr-golden) 100%);
```

In Tailwind via inline style (gradients are not yet a CSS custom property in the token set):
```tsx
<div style={{ background: 'linear-gradient(90deg, var(--ds-brand-smartr-coral) 25%, var(--ds-brand-smartr-golden) 100%)' }} />
```

---

## Logo variants

Every module ships four colour variants:

| Variant | Filename suffix | Use case |
|---------|----------------|----------|
| `COLOR_BLK` | `_COLOR_BLK` | Full gradient logo on white/light backgrounds |
| `COLOR_WHT` | `_COLOR_WHT` | Full gradient logo on dark/image backgrounds |
| `BLK` | `_BLK` | Single-colour black — on white backgrounds, no colour printing |
| `WHT` | `_WHT` | Single-colour white — on dark or colour-filled backgrounds |

**Default usage:** Use `COLOR_BLK` on light surfaces, `COLOR_WHT` on dark surfaces.

---

## Files

### `logos/svg/` — Production use (32 files)

| Module | Files |
|--------|-------|
| SmartR (main) | `SmartR_BLK.svg`, `SmartR_WHT.svg`, `SmartR_COLOR_BLK.svg`, `SmartR_COLOR_WHT.svg` |
| Analytics | `SmartR_Analytics_BLK.svg` … `SmartR_Analytics_COLOR_WHT.svg` |
| Connectivity | `SmartR_Connectivity_BLK.svg` … `SmartR_Connectivity_COLOR_WHT.svg` |
| Forecast Insights | `SmartR_Forecast_Insights_BLK.svg` … `SmartR_Forecast_Insights_COLOR_WHT.svg` |
| Ledger | `SmartR_Ledger_BLK.svg` … `SmartR_Ledger_COLOR_WHT.svg` |
| Liquidity Scenarios | `SmartR_Liquidity_Scenarios_BLK.svg` … `SmartR_Liquidity_Scenarios_COLOR_WHT.svg` |
| Risk Insights | `SmartR_Risk_Insights_BLK.svg` … `SmartR_Risk_Insights_COLOR_WHT.svg` |
| Risk Management | `SmartR_Risk_Management_BLK.svg` … `SmartR_Risk_Management_COLOR_WHT.svg` |

### `logos/png/` — Raster fallbacks (32 files)

Same naming convention as SVG. Use SVG whenever possible. PNG is for environments that don't support SVG (email, certain presentation tools).

### `backgrounds/` — Branded background images (48 files)

Six background variations per module, numbered 1–6:

```
Background_SmartR_1.png … Background_SmartR_6.png
Background_SmartR_Analytics_1.png … Background_SmartR_Analytics_6.png
Background_SmartR_Connectivity_1.png … (same pattern for each module)
```

Use backgrounds in hero sections, product launch materials, and feature highlight cards.

---

## In React

Import SVG logos directly:

```tsx
import SmartRLogo from '@ds-foundation/react/brand/smartr/logos/svg/SmartR_COLOR_BLK.svg';
```

Or use the `brand/smartr/logos/svg/` path relative to your project root if consuming from the monorepo.

---

## Figma

Import the `.ai` source files (in the original `RGB - Digital/AI/` folder, not committed to this repo) into Figma as frames to rebuild Figma components.

> The `.ai` files contain editable vector art. The SVGs in this repo are the export-ready production versions.

---

## Do not

- Stretch, rotate, or add effects to the logo
- Change the gradient angle or stop positions
- Use `COLOR_BLK` on a non-white/light-grey background
- Replace the gradient with a flat colour
- Use a non-brand font alongside the lockup without approval
