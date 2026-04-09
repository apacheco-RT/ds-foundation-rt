import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1 },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Range: Story = {
  args: { defaultValue: [25, 75], max: 100, step: 1 },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const WithSteps: Story = {
  args: { defaultValue: [5], min: 0, max: 10, step: 1 },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { defaultValue: [40], max: 100, disabled: true },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Slider {...args} />
    </div>
  ),
};
