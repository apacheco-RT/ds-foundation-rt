import type { Preview } from '@storybook/react';
import '@ds/tokens/css';
import '@ds/tokens/css/dark';

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },
    themes: {
      default: 'light',
      list: [
        { name: 'light', class: '', color: '#f8fafc' },
        { name: 'dark', class: 'dark', color: '#0f172a', default: false },
      ],
      target: 'html',
      attribute: 'data-theme',
    },
  },
};

export default preview;
