import type { Meta, StoryObj } from '@storybook/react';
import { InputNumber } from './InputNumber';

const meta: Meta<typeof InputNumber> = {
  title: 'Components/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Default: Story = {
  args: { defaultValue: 0 },
};

export const WithBounds: Story = {
  args: { defaultValue: 5, min: 0, max: 10, step: 1 },
};

export const WithPrecision: Story = {
  args: { defaultValue: 1.5, min: 0, max: 10, step: 0.5, precision: 2 },
};

export const Disabled: Story = {
  args: { defaultValue: 42, disabled: true },
};

export const AtMinBound: Story = {
  args: { defaultValue: 0, min: 0, max: 100 },
};

export const AtMaxBound: Story = {
  args: { defaultValue: 100, min: 0, max: 100 },
};
