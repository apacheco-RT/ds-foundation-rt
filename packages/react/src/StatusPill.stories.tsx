import type { Meta, StoryObj } from '@storybook/react';
import { StatusPill } from './StatusPill';

const meta: Meta<typeof StatusPill> = {
  title: 'Atoms/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof StatusPill>;

export const Submitted: Story = {
  args: { status: 'submitted' },
};

export const InPayments: Story = {
  args: { status: 'in_payments' },
};

export const SentToBank: Story = {
  args: { status: 'sent_to_bank' },
};

export const BankConfirmed: Story = {
  args: { status: 'bank_confirmed' },
};

export const Failed: Story = {
  args: { status: 'failed' },
};

export const Rejected: Story = {
  args: { status: 'rejected' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {(['submitted', 'in_payments', 'first_approval', 'second_approval', 'sent_to_bank', 'bank_confirmed', 'failed', 'rejected'] as const).map(
        (status) => <StatusPill key={status} status={status} />
      )}
    </div>
  ),
};

export const DarkMode: Story = {
  args: { status: 'in_payments' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
