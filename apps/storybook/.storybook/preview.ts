import type { Preview } from '@storybook/react';
import '@ds-foundation/tokens/css';
import '@ds-foundation/tokens/css/dark';
import '../../../packages/react/src/styles/styles.css';

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: '', color: '#f8fafc' },
        { name: 'dark', class: 'dark', color: '#0f172a', default: false },
        { name: 'wireframe', class: 'wireframe', color: '#e2e8f0', default: false },
      ],
      target: 'html',
      attribute: 'data-theme',
    },
  },
};

export default preview;
