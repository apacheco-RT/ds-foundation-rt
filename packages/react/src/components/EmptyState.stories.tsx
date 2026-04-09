import type { Meta, StoryObj } from '@storybook/react';
import { Inbox } from 'lucide-react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj<typeof EmptyState> = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
  },
};

export const WithIcon: StoryObj<typeof EmptyState> = {
  args: {
    icon: <Inbox />,
    title: 'Your inbox is empty',
    description: 'Messages you receive will appear here.',
    action: { label: 'Compose message', onClick: () => alert('Compose!') },
  },
};

export const WithAction: StoryObj<typeof EmptyState> = {
  args: {
    title: 'No transactions',
    description: 'No transactions match your current filters.',
    action: { label: 'Clear filters', onClick: () => alert('Cleared!') },
  },
};
