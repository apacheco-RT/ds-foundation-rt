import type { Meta, StoryObj } from '@storybook/react';
import { StateBadge } from './StateBadge';

const meta: Meta<typeof StateBadge> = {
  title: 'Atoms/StateBadge',
  component: StateBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    intent: { control: 'select', options: ['info', 'warning', 'success', 'error', 'neutral'] },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof StateBadge>;

export const Info: Story = {
  args: { state: 'Processing', intent: 'info' },
};

export const InfoWithNext: Story = {
  args: { state: 'Processing', intent: 'info', nextState: 'Approval' },
};

export const Warning: Story = {
  args: { state: 'Needs Approval', intent: 'warning' },
};

export const Success: Story = {
  args: { state: 'Approved', intent: 'success', nextState: 'Extract' },
};

export const Error: Story = {
  args: { state: 'Failed', intent: 'error' },
};

export const Neutral: Story = {
  args: { state: 'Void', intent: 'neutral' },
};

export const Small: Story = {
  args: { state: 'Processing', intent: 'info', nextState: 'Approval', size: 'sm' },
};

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <StateBadge state="Processing"     intent="info"    nextState="Approval" />
      <StateBadge state="Needs Approval" intent="warning" nextState="Review" />
      <StateBadge state="Approved"       intent="success" nextState="Extract" />
      <StateBadge state="Failed"         intent="error" />
      <StateBadge state="Void"           intent="neutral" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { state: 'Processing', intent: 'info', nextState: 'Approval' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--ds-color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
