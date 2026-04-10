# Brand Assets

Production-ready brand assets for all products in the Ripple Treasury design system.

---

## Structure

```
brand/
└── smartr/             SmartR product suite
    ├── logos/
    │   ├── svg/        Production logos (use these)
    │   └── png/        Raster fallbacks
    ├── backgrounds/    Branded background images (48 variations)
    └── README.md       Colour reference, variant guide, usage rules
```

---

## Products

| Folder | Product | Modules |
|--------|---------|---------|
| `smartr/` | SmartR | Analytics, Connectivity, Forecast Insights, Ledger, Liquidity Scenarios, Risk Insights, Risk Management |

---

## Tokens

Brand colours from these assets are available as design tokens:

```css
/* SmartR */
var(--ds-brand-smartr-coral)   /* #FF6143 light / #FF7D66 dark */
var(--ds-brand-smartr-golden)  /* #FFD100 light / #FEE523 dark */
```

Full token reference: [`packages/tokens/src/primitives/color.tokens.json`](../packages/tokens/src/primitives/color.tokens.json)

---

## Adding new brand assets

1. Create a folder: `brand/{product-name}/`
2. Add `logos/svg/`, `logos/png/`, `backgrounds/` subfolders as needed
3. Follow the `{Product}_{MODULE}_{VARIANT}.{ext}` naming convention
4. Add corresponding primitive color tokens in `packages/tokens/src/primitives/color.tokens.json`
5. Wire semantic tokens in `packages/tokens/src/semantic/{light,dark}/color.tokens.json`
6. Write a `README.md` in the product folder documenting colours, variants, and usage rules
