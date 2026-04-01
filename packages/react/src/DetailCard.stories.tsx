import type { Meta, StoryObj } from '@storybook/react';
import { DetailCard } from './DetailCard';

const meta: Meta<typeof DetailCard> = {
  title: 'Atoms/DetailCard',
  component: DetailCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof DetailCard>;

export const Default: Story = {
  args: {
    title: 'Payment Details',
    children: (
      <div style={{ fontSize: '0.875rem', color: 'var(--ds-color-text-primary)' }}>
        <div>Amount: $1,250.00</div>
        <div>Currency: USD</div>
      </div>
    ),
  },
};

export const DarkMode: Story = {
  args: { ...Default.args },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--ds-color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};

export const LongTitle: Story = {
  args: {
    title: 'A Very Long Section Title That May Wrap Or Truncate',
    children: (
      <div style={{ fontSize: '0.875rem', color: 'var(--ds-color-text-primary)' }}>
        <div>Content below a long title</div>
      </div>
    ),
  },
};

export const EmptyChildren: Story = {
  args: {
    title: 'Empty Card',
    children: null,
  },
};
