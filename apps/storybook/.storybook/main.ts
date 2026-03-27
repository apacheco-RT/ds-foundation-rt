import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    // Spec MDX files render as Storybook docs
    '../../packages/registry/components/**/*.mdx',
    '../../packages/registry/foundations/**/*.mdx',
    // Stories co-located with components
    '../../packages/*/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-viewport',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
};

export default config;
