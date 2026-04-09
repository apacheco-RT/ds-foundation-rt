import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: 'Email address' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Label htmlFor="email">Email address</Label>
      <Label htmlFor="name">Full name</Label>
      <Label htmlFor="disabled" style={{ opacity: 0.5 }}>Disabled field</Label>
    </div>
  ),
};
