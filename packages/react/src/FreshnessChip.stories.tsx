import type { Meta, StoryObj } from '@storybook/react';
import { FreshnessChip } from './FreshnessChip';

const now = new Date();
const sevenMinutesAgo = new Date(now.getTime() - 7 * 60 * 1000);
const twentyMinutesAgo = new Date(now.getTime() - 20 * 60 * 1000);

const meta: Meta<typeof FreshnessChip> = {
  title: 'Atoms/FreshnessChip',
  component: FreshnessChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FreshnessChip>;

export const Fresh: Story = {
  args: {
    state: 'fresh',
    timestamp: now,
  },
};

export const Watch: Story = {
  args: {
    state: 'watch',
    timestamp: sevenMinutesAgo,
  },
};

export const Stale: Story = {
  args: {
    state: 'stale',
    timestamp: twentyMinutesAgo,
  },
};

export const StaleWithRefresh: Story = {
  args: {
    state: 'stale',
    timestamp: twentyMinutesAgo,
    onRefresh: () => alert('Refreshing data…'),
  },
};

export const DarkMode: Story = {
  args: {
    state: 'stale',
    timestamp: twentyMinutesAgo,
    onRefresh: () => alert('Refreshing data…'),
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
