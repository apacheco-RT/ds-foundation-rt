import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button', variant: 'solid', colorScheme: 'primary', size: 'md' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <Button variant="solid" colorScheme="primary">Solid Primary</Button>
      <Button variant="solid" colorScheme="danger">Solid Danger</Button>
      <Button variant="outline" colorScheme="neutral">Outline Neutral</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllColorSchemes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <Button colorScheme="primary">Primary</Button>
      <Button colorScheme="success">Success</Button>
      <Button colorScheme="warning">Warning</Button>
      <Button colorScheme="danger">Danger</Button>
      <Button colorScheme="neutral">Neutral</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Button size="xs">XSmall</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">XLarge</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { children: 'Submit', isLoading: true, loadingText: 'Submitting…' },
};

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
};
