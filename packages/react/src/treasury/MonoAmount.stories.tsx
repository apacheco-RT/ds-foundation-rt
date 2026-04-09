import type { Meta, StoryObj } from '@storybook/react';
import { MonoAmount } from './MonoAmount';

const meta: Meta<typeof MonoAmount> = {
  title: 'Components/MonoAmount',
  component: MonoAmount,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MonoAmount>;

export const Default: Story = {
  args: {
    value: 1250000,
    currency: 'USD',
  },
};

export const Interactive: Story = {
  args: {
    value: 4500000,
    currency: 'EUR',
    onProvenanceTap: () => alert('Provenance tapped'),
  },
};

export const SmallSize: Story = {
  args: {
    value: 99500,
    currency: 'GBP',
    size: 'sm',
    color: 'muted',
  },
};

export const LargeSuccess: Story = {
  args: {
    value: 12000000,
    currency: 'USD',
    size: 'lg',
    color: 'success',
  },
};

export const ErrorState: Story = {
  args: {
    value: 750000,
    currency: 'EUR',
    color: 'error',
  },
};

export const Zero: Story = {
  args: {
    value: 0,
    currency: 'USD',
    color: 'muted',
  },
};

export const DarkMode: Story = {
  args: {
    value: 3200000,
    currency: 'USD',
    color: 'brand',
  },
  parameters: {
    backgrounds: { default: 'dark' },
    docs: { story: { inline: false } },
  },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
