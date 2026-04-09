import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: 'Type your message here...' },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Textarea {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: { defaultValue: 'This is some pre-filled content.' },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Textarea {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled textarea', disabled: true },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Textarea {...args} />
    </div>
  ),
};

export const WithRowCount: Story = {
  args: { placeholder: 'Taller textarea...', rows: 8 },
  render: (args) => (
    <div style={{ width: '320px' }}>
      <Textarea {...args} />
    </div>
  ),
};
