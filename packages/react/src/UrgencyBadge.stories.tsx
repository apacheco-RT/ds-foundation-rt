import type { Meta, StoryObj } from '@storybook/react';
import { UrgencyBadge } from './UrgencyBadge';

const meta: Meta<typeof UrgencyBadge> = {
  title: 'Atoms/UrgencyBadge',
  component: UrgencyBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof UrgencyBadge>;

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

export const CustomLabel: Story = {
  args: { urgency: 'critical', label: 'Urgent' },
};

export const AllUrgencies: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <UrgencyBadge urgency="critical" />
      <UrgencyBadge urgency="watch" />
      <UrgencyBadge urgency="clear" />
      <UrgencyBadge urgency="skip" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { urgency: 'critical' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
