import type { Meta, StoryObj } from '@storybook/react';
import { BankingWindowDot } from './BankingWindowDot';

const meta: Meta<typeof BankingWindowDot> = {
  title: 'Atoms/BankingWindowDot',
  component: BankingWindowDot,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof BankingWindowDot>;

export const Open: Story = {
  args: { status: 'open' },
};

export const Closing: Story = {
  args: { status: 'closing' },
};

export const Closed: Story = {
  args: { status: 'closed' },
};

export const LargeSize: Story = {
  args: { status: 'open', size: 10 },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <BankingWindowDot status="open" />
      <BankingWindowDot status="closing" />
      <BankingWindowDot status="closed" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { status: 'open' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
