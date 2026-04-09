// packages/react/tailwind.config.ts
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [animate],
} satisfies Config;
