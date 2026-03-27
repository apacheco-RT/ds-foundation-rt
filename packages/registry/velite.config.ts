import { defineConfig, s } from 'velite';

const AdapterVariantMap = s.record(
  s.object({
    base:      s.string().optional(),
    solid:     s.string().optional(),
    outline:   s.string().optional(),
    ghost:     s.string().optional(),
    link:      s.string().optional(),
    component: s.string().optional(),
    variant:   s.string().optional(),
    class:     s.string().optional(),
  })
);

const ComponentSpec = s.object({
  id:      s.string(),
  type:    s.enum(['component', 'foundation', 'pattern', 'template']),
  version: s.string().regex(/^\d+\.\d+\.\d+$/),
  status:  s.enum(['draft', 'beta', 'stable', 'deprecated']),

  primitive: s.string().optional(),
  variants:  s.array(s.string()).default([]),
  sizes:     s.array(s.string()).default([]),

  adapters: s.object({
    tailwind:  AdapterVariantMap.optional(),
    material:  AdapterVariantMap.optional(),
    bootstrap: AdapterVariantMap.optional(),
  }).default({}),

  frameworks: s.object({
    react:        s.string().optional(),
    angular:      s.string().optional(),
    webcomponent: s.string().optional(),
  }).default({}),

  accessibility: s.object({
    role:  s.string(),
    wcag:  s.array(s.string()),
    aria:  s.array(s.string()),
    notes: s.string().optional(),
  }),

  figma: s.object({
    'node-id':     s.string(),
    'code-connect': s.boolean().default(false),
    'library-key': s.string().optional(),
  }).optional(),

  'ai-prompt': s.string(),

  content: s.mdx(),
});

const FoundationSpec = s.object({
  id:       s.string(),
  type:     s.literal('foundation'),
  category: s.enum(['color', 'typography', 'spacing', 'grid', 'motion', 'radius', 'shadow', 'z-index']),
  version:  s.string(),
  status:   s.enum(['draft', 'beta', 'stable', 'deprecated']),
  'token-count': s.number().optional(),
  'ai-prompt': s.string(),
  figma: s.object({ 'node-id': s.string() }).optional(),
  content: s.mdx(),
});

export default defineConfig({
  root: '.',
  output: {
    data:   '../../.velite',
    assets: '../../apps/docs/public/spec-assets',
    base:   '/spec-assets/',
    clean:  true,
  },
  collections: {
    components: {
      name:    'Component',
      pattern: 'components/**/*.mdx',
      schema:  ComponentSpec,
    },
    foundations: {
      name:    'Foundation',
      pattern: 'foundations/**/*.mdx',
      schema:  FoundationSpec,
    },
  },
});
