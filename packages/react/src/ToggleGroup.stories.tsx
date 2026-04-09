import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['bold']}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="left">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <ToggleGroup type="single" size="sm">
        <ToggleGroupItem value="a">Small A</ToggleGroupItem>
        <ToggleGroupItem value="b">Small B</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="default">
        <ToggleGroupItem value="a">Default A</ToggleGroupItem>
        <ToggleGroupItem value="b">Default B</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="lg">
        <ToggleGroupItem value="a">Large A</ToggleGroupItem>
        <ToggleGroupItem value="b">Large B</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
