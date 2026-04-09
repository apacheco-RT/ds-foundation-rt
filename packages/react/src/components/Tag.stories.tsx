import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj<typeof Tag> = {
  args: { children: 'Default' },
};

export const AllVariants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Tag variant="default">Default</Tag>
      <Tag variant="blue">Blue</Tag>
      <Tag variant="green">Green</Tag>
      <Tag variant="error">Error</Tag>
      <Tag variant="orange">Orange</Tag>
      <Tag variant="purple">Purple</Tag>
    </div>
  ),
};

export const Removable: StoryObj = {
  render: () => (
    <Tag variant="blue" onRemove={() => alert('Removed!')}>
      Removable
    </Tag>
  ),
};
