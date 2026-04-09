import type { Meta, StoryObj } from '@storybook/react';
import { Segmented } from './Segmented';

const meta: Meta<typeof Segmented> = {
  title: 'Components/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Segmented>;

export const Default: Story = {
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
      { label: 'Quarter', value: 'quarter' },
    ],
    defaultValue: 'week',
  },
};

export const WithDisabled: Story = {
  args: {
    options: [
      { label: 'All', value: 'all' },
      { label: 'Settled', value: 'settled' },
      { label: 'Pending', value: 'pending' },
      { label: 'Overdue', value: 'overdue', disabled: true },
    ],
    defaultValue: 'all',
  },
};

export const EntityFilter: Story = {
  args: {
    options: [
      { label: 'SA', value: 'sa' },
      { label: 'LTD', value: 'ltd' },
      { label: 'INC', value: 'inc' },
      { label: 'BVI', value: 'bvi' },
    ],
    defaultValue: 'sa',
  },
};
