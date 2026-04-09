import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const WithValue: Story = {
  args: { defaultValue: 'Hello world' },
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'you@example.com' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
};

export const File: Story = {
  args: { type: 'file' },
};
