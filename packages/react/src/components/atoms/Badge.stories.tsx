import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Badge', color: 'neutral', variant: 'subtle' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {(['primary', 'success', 'warning', 'danger', 'info', 'neutral'] as const).map(color => (
        <div key={color} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Badge color={color} variant="subtle">{color} subtle</Badge>
          <Badge color={color} variant="solid">{color} solid</Badge>
          <Badge color={color} variant="outline">{color} outline</Badge>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Badge color="success" variant="subtle" dot>With dot</Badge>
        <Badge color="danger" variant="solid" dot>With dot</Badge>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="sm" color="primary">Small</Badge>
      <Badge size="md" color="primary">Medium</Badge>
    </div>
  ),
};
