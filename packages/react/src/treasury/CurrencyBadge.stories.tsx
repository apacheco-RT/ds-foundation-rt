import type { Meta, StoryObj } from '@storybook/react';
import { CurrencyBadge } from './CurrencyBadge';

const meta: Meta<typeof CurrencyBadge> = {
  title: 'Components/CurrencyBadge',
  component: CurrencyBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CurrencyBadge>;

export const USD: Story = {
  args: { currency: 'USD' },
};

export const EUR: Story = {
  args: { currency: 'EUR' },
};

export const GBP: Story = {
  args: { currency: 'GBP' },
};

export const AllCurrencies: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <CurrencyBadge currency="USD" />
      <CurrencyBadge currency="EUR" />
      <CurrencyBadge currency="GBP" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { currency: 'USD' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
