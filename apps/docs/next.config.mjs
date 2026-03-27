import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
  search: { codeblocks: true },
});

export default withNextra({
  experimental: { optimizeCss: true },
  transpilePackages: ['@ds/tokens', '@ds/registry'],
  // Token CSS vars are imported in _app or layout — docs site is styled with its own DS
});
