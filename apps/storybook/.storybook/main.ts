import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const root = path.resolve(__dirname, '..', '..', '..');

const config: StorybookConfig = {
  stories: [
    // Spec MDX files render as Storybook docs
    path.join(root, 'packages/registry/components/**/*.mdx'),
    path.join(root, 'packages/registry/foundations/**/*.mdx'),
    // Stories co-located with components
    path.join(root, 'packages/*/src/**/*.stories.@(ts|tsx)'),
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
