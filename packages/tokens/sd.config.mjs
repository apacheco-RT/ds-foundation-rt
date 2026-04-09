/**
 * Style Dictionary v4 — DTCG 2025.10 config
 *
 * Token resolution order (last wins on conflict):
 *   primitives → semantic/{theme} → density/{scale}
 *
 * Outputs:
 *   build/css/        CSS custom properties  (--ds-*)
 *   build/css/dark    Dark theme overrides   [data-theme="dark"]
 *   build/scss/       SCSS variables         ($ds-*)
 *   build/js/         ESM object + TS types
 *   build/tailwind/   Tailwind v4 @theme block
 *   build/json/       Resolved flat JSON (for MCP / AI context)
 */

import StyleDictionary from 'style-dictionary';
import { registerTransforms } from '@tokens-studio/sd-transforms';

registerTransforms(StyleDictionary);

// ── Custom transform: DTCG dimension object → CSS value ──────────────────────
StyleDictionary.registerTransform({
  name: 'ds/dimension/css',
  type: 'value',
  filter: (t) => t.$type === 'dimension',
  transform: (t) => {
    const v = t.$value;
    return typeof v === 'object' && v !== null && 'value' in v && 'unit' in v
      ? `${v.value}${v.unit}`
      : String(v);
  },
});

// ── Custom transform: DTCG color object → CSS color() with hex fallback ──────
StyleDictionary.registerTransform({
  name: 'ds/color/css',
  type: 'value',
  filter: (t) => t.$type === 'color',
  transform: (t) => {
    const v = t.$value;
    if (typeof v === 'object' && v !== null && 'colorSpace' in v) {
      const { colorSpace, components, alpha, hex } = v;
      const comps = components.map((c) => (c === 'none' ? 'none' : String(c))).join(' ');
      const alphaStr = alpha !== undefined && alpha !== 1 ? ` / ${alpha}` : '';
      const css = `color(${colorSpace} ${comps}${alphaStr})`;
      return hex ? `/* ${hex} */ ${css}` : css;
    }
    return String(v);
  },
});

// ── Custom transform: color → hex fallback (legacy tool support) ──────────────
StyleDictionary.registerTransform({
  name: 'ds/color/hex-fallback',
  type: 'value',
  filter: (t) => t.$type === 'color',
  transform: (t) => {
    const v = t.$value;
    if (typeof v === 'object' && v !== null) {
      if ('hex' in v && v.hex) return v.hex;
      if (v.colorSpace === 'srgb') {
        const [r, g, b] = v.components.map((c) => Math.round(Number(c) * 255));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }
    return String(v);
  },
});

// ── Custom transform: DTCG duration object → CSS value ───────────────────────
StyleDictionary.registerTransform({
  name: 'ds/duration/css',
  type: 'value',
  filter: (t) => t.$type === 'duration',
  transform: (t) => {
    const v = t.$value;
    return typeof v === 'object' && v !== null && 'value' in v && 'unit' in v
      ? `${v.value}${v.unit}`
      : String(v);
  },
});

// ── Custom transform: DTCG shadow composite object → CSS box-shadow value ─────
StyleDictionary.registerTransform({
  name: 'ds/shadow/css',
  type: 'value',
  filter: (t) => t.$type === 'shadow',
  transform: (t) => {
    const v = t.$value;
    if (typeof v !== 'object' || v === null) return String(v);
    // Handle array of shadow layers
    const layers = Array.isArray(v) ? v : [v];
    return layers
      .map((layer) => {
        const ox = typeof layer.offsetX === 'object' ? `${layer.offsetX.value}${layer.offsetX.unit}` : String(layer.offsetX ?? 0);
        const oy = typeof layer.offsetY === 'object' ? `${layer.offsetY.value}${layer.offsetY.unit}` : String(layer.offsetY ?? 0);
        const blur = typeof layer.blur === 'object' ? `${layer.blur.value}${layer.blur.unit}` : String(layer.blur ?? 0);
        const spread = typeof layer.spread === 'object' ? `${layer.spread.value}${layer.spread.unit}` : String(layer.spread ?? 0);
        const color = layer.color;
        let colorStr = 'transparent';
        if (color && typeof color === 'object') {
          if ('hex' in color && color.hex && color.alpha !== undefined && color.alpha !== 1) {
            // Use rgba when alpha is not 1
            const [r, g, b] = (color.components ?? [0, 0, 0]).map((c) => Math.round(Number(c) * 255));
            colorStr = `rgba(${r},${g},${b},${color.alpha})`;
          } else if ('hex' in color && color.hex) {
            colorStr = color.hex;
          } else if (color.colorSpace === 'srgb' && Array.isArray(color.components)) {
            const [r, g, b] = color.components.map((c) => Math.round(Number(c) * 255));
            const a = color.alpha !== undefined ? color.alpha : 1;
            colorStr = a === 1
              ? `rgb(${r},${g},${b})`
              : `rgba(${r},${g},${b},${a})`;
          }
        } else if (typeof color === 'string') {
          colorStr = color;
        }
        const inset = layer.inset ? 'inset ' : '';
        return `${inset}${ox} ${oy} ${blur} ${spread} ${colorStr}`;
      })
      .join(', ');
  },
});

// ── Custom format: Tailwind v4 @theme block ───────────────────────────────────
StyleDictionary.registerFormat({
  name: 'ds/tailwind/css-theme',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.map((t) => {
      let v = t.value;
      if (v == null) {
        const sv = t.$value;
        if (typeof sv === 'object' && sv !== null) {
          if ('hex' in sv && sv.hex) {
            v = sv.hex;
          } else if (sv.colorSpace === 'srgb' && Array.isArray(sv.components)) {
            const [r, g, b] = sv.components.map((c) => Math.round(Number(c) * 255));
            v = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          } else {
            console.warn(`[ds/tailwind/css-theme] Token "${t.name}" has no hex or sRGB fallback — using String(). Check $value:`, sv);
            v = String(sv);
          }
        } else {
          v = String(sv);
        }
      }
      return `  --${t.name}: ${v};`;
    });
    return `@theme {\n${lines.join('\n')}\n}\n`;
  },
});

// ── Custom format: TypeScript token types ─────────────────────────────────────
StyleDictionary.registerFormat({
  name: 'ds/typescript/types',
  format: ({ dictionary }) => {
    const paths = dictionary.allTokens.map((t) => `  '${t.name}': string;`);
    return [
      '// Auto-generated — do not edit. Run `npm run build:tokens` to regenerate.',
      `// DTCG 2025.10 | Generated: ${new Date().toISOString()}`,
      '',
      'export interface DSTokens {',
      ...paths,
      '}',
      '',
      'export type DSTokenPath = keyof DSTokens;',
      '',
    ].join('\n');
  },
});

const PRIMITIVES = [
  'src/primitives/color.tokens.json',
  'src/primitives/spacing.tokens.json',
  'src/primitives/typography.tokens.json',
  'src/primitives/radius.tokens.json',
  'src/primitives/shadow.tokens.json',
  'src/primitives/motion.tokens.json',
  'src/primitives/grid.tokens.json',
  'src/primitives/zindex.tokens.json',
];

const SHARED_TRANSFORMS = ['ts/resolveMath', 'ds/dimension/css', 'ds/duration/css', 'ds/shadow/css', 'ds/color/css', 'name/kebab'];

const TAILWIND_TRANSFORMS = [
  'ts/resolveMath',
  'ds/dimension/css',
  'ds/duration/css',
  'ds/shadow/css',
  'ds/color/hex-fallback',  // hex only — ds/color/css is excluded so t.value stays unset for colors;
  // the format's own fallback reads hex directly from t.$value
  'name/kebab',
];

// Suppress collisions on DTCG file-level metadata keys ($schema, $description)
// and on $type at group level — these are harmless and expected when merging files.
const LOG_CONFIG = { log: { warnings: 'warn' } };

const configs = [
  // CSS light (default)
  {
    ...LOG_CONFIG,
    source: [...PRIMITIVES, 'src/semantic/light/color.tokens.json', 'src/density/comfortable.tokens.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix: 'ds', transforms: SHARED_TRANSFORMS, buildPath: 'build/css/',
        files: [{
          destination: 'variables.css', format: 'css/variables',
          options: { outputReferences: true, selector: ':root',
            fileHeader: () => ['Auto-generated. Do not edit.', `DTCG 2025.10 | ${new Date().toISOString()}`] },
        }],
      },
    },
  },
  // CSS dark theme
  {
    ...LOG_CONFIG,
    source: [...PRIMITIVES, 'src/semantic/dark/color.tokens.json', 'src/density/comfortable.tokens.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      css: {
        prefix: 'ds', transforms: SHARED_TRANSFORMS, buildPath: 'build/css/',
        files: [{
          destination: 'variables.dark.css', format: 'css/variables',
          options: { outputReferences: true, selector: '[data-theme="dark"]' },
        }],
      },
    },
  },
  // SCSS
  {
    ...LOG_CONFIG,
    source: [...PRIMITIVES, 'src/semantic/light/color.tokens.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      scss: {
        prefix: 'ds',
        transforms: [...SHARED_TRANSFORMS, 'ds/color/hex-fallback'],
        buildPath: 'build/scss/',
        files: [
          { destination: '_variables.scss', format: 'scss/variables', options: { outputReferences: true } },
          { destination: '_maps.scss', format: 'scss/map-deep', options: { outputReferences: true } },
        ],
      },
    },
  },
  // JS + TS types
  {
    ...LOG_CONFIG,
    source: [...PRIMITIVES, 'src/semantic/light/color.tokens.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      js: {
        transforms: [...SHARED_TRANSFORMS.filter(t => t !== 'name/kebab'), 'name/camel', 'ds/color/hex-fallback'],
        buildPath: 'build/js/',
        files: [
          { destination: 'tokens.js', format: 'javascript/es6' },
          { destination: 'tokens.d.ts', format: 'ds/typescript/types' },
        ],
      },
    },
  },
  // Tailwind v4
  {
    ...LOG_CONFIG,
    source: [...PRIMITIVES, 'src/semantic/light/color.tokens.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      tailwind: {
        prefix: 'ds',
        transforms: TAILWIND_TRANSFORMS,
        buildPath: 'build/tailwind/',
        files: [{ destination: 'preset.css', format: 'ds/tailwind/css-theme' }],
      },
    },
  },
  // Flat JSON (for MCP + AI context)
  {
    ...LOG_CONFIG,
    source: [...PRIMITIVES, 'src/semantic/light/color.tokens.json', 'src/density/comfortable.tokens.json'],
    preprocessors: ['tokens-studio'],
    platforms: {
      json: {
        transforms: [...SHARED_TRANSFORMS, 'ds/color/hex-fallback'],
        buildPath: 'build/json/',
        files: [
          { destination: 'tokens.json', format: 'json/nested' },
          { destination: 'tokens.flat.json', format: 'json/flat' },
        ],
      },
    },
  },
];

for (const config of configs) {
  const sd = new StyleDictionary(config);
  await sd.buildAllPlatforms();
}

console.log('\n✅ Token build complete');
console.log('   CSS:      build/css/');
console.log('   SCSS:     build/scss/');
console.log('   JS:       build/js/');
console.log('   Tailwind: build/tailwind/');
console.log('   JSON:     build/json/');
