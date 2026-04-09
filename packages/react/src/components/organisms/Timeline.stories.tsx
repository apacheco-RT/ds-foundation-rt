import type { Meta, StoryObj } from '@storybook/react';
import { CheckCircle } from 'lucide-react';
import { Timeline } from './Timeline';
import type { TimelineItem } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

const items: TimelineItem[] = [
  { id: '1', title: 'Payment initiated', timestamp: '09:00', status: 'complete', description: 'Wire transfer submitted to bank.' },
  { id: '2', title: 'Awaiting confirmation', timestamp: '09:05', status: 'active', description: 'Waiting for counterparty confirmation.' },
  { id: '3', title: 'Settlement complete', timestamp: '09:30', status: 'default' },
];

const itemsWithIcon: TimelineItem[] = [
  { id: '1', icon: <CheckCircle size={12} />, title: 'Order placed', timestamp: '10:00', status: 'complete' },
  { id: '2', icon: <CheckCircle size={12} />, title: 'Processing', timestamp: '10:15', status: 'active', description: 'Payment is being processed.' },
  { id: '3', title: 'Delivered', status: 'default' },
];

export const Default: StoryObj<typeof Timeline> = {
  args: { items },
};

export const WithIcons: StoryObj<typeof Timeline> = {
  args: { items: itemsWithIcon },
};

export const ErrorState: StoryObj<typeof Timeline> = {
  args: {
    items: [
      { id: '1', title: 'Payment initiated', timestamp: '09:00', status: 'complete' },
      { id: '2', title: 'Failed', timestamp: '09:05', status: 'error', description: 'Insufficient funds.' },
    ],
  },
};
