import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'primary', 'warning', 'danger', 'neutral'] },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Neutral: Story = {
  args: { variant: 'neutral', icon: <ChevronIcon /> },
};

export const Info: Story = {
  args: { variant: 'info', icon: <ChevronIcon /> },
};

export const Success: Story = {
  args: { variant: 'success', icon: <ChevronIcon /> },
};

export const Primary: Story = {
  args: { variant: 'primary', icon: <ChevronIcon /> },
};

export const Warning: Story = {
  args: { variant: 'warning', icon: <ChevronIcon /> },
};

export const Danger: Story = {
  args: { variant: 'danger', icon: <ChevronIcon /> },
};

export const WithLabel: Story = {
  args: { variant: 'primary', icon: <ChevronIcon />, children: 'Action', size: 'md' },
};

export const Small: Story = {
  args: { variant: 'info', icon: <ChevronIcon />, size: 'sm' },
};

export const Disabled: Story = {
  args: { variant: 'danger', icon: <ChevronIcon />, disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {(['info', 'success', 'primary', 'warning', 'danger', 'neutral'] as const).map((v) => (
        <IconButton key={v} variant={v} icon={<ChevronIcon />} title={v} />
      ))}
    </div>
  ),
};

export const DarkMode: Story = {
  args: { variant: 'primary', icon: <ChevronIcon /> },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--ds-color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
