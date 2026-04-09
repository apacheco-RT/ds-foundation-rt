import type { Meta, StoryObj } from '@storybook/react';
import { StatusRing } from './StatusRing';

const meta: Meta<typeof StatusRing> = {
  title: 'Components/StatusRing',
  component: StatusRing,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof StatusRing>;

export const Critical: Story = {
  args: { urgency: 'critical' },
};

export const Watch: Story = {
  args: { urgency: 'watch' },
};

export const Clear: Story = {
  args: { urgency: 'clear' },
};

export const Skip: Story = {
  args: { urgency: 'skip' },
};

export const CriticalPulsing: Story = {
  args: { urgency: 'critical', pulse: true },
};

export const SmallSize: Story = {
  args: { urgency: 'watch', size: 'sm' },
};

export const AllUrgencies: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <StatusRing urgency="critical" />
      <StatusRing urgency="watch" />
      <StatusRing urgency="clear" />
      <StatusRing urgency="skip" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { urgency: 'critical', pulse: true },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
