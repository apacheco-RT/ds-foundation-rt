import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from './KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: 'Components/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
    label: 'Total Settled',
    value: '$48,200,000',
    trend: { direction: 'up', label: '+12% vs last week' },
  },
};

export const Down: Story = {
  args: {
    label: 'Overdue Obligations',
    value: 14,
    trend: { direction: 'down', label: '-3 from yesterday' },
  },
};

export const Neutral: Story = {
  args: {
    label: 'Pending Approvals',
    value: 7,
    trend: { direction: 'neutral', label: 'No change' },
  },
};

export const Grid: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: '16px' }}>
      <KpiCard label="Total Settled" value="$48.2M" trend={{ direction: 'up', label: '+12% this week' }} />
      <KpiCard label="Pending" value={7} trend={{ direction: 'neutral', label: 'No change' }} />
      <KpiCard label="Overdue" value={2} trend={{ direction: 'down', label: 'Resolved 3' }} />
    </div>
  ),
};
