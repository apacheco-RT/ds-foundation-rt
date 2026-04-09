import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  args: {
    steps: [
      { label: 'Calculate', description: 'Net obligations', status: 'complete' },
      { label: 'Review', description: 'Approve netting run', status: 'active' },
      { label: 'Submit', description: 'Send to banking portal', status: 'pending' },
    ],
  },
  render: (args) => (
    <div style={{ width: '480px' }}>
      <Stepper {...args} />
    </div>
  ),
};

export const AllComplete: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <Stepper
        steps={[
          { label: 'Calculate', status: 'complete' },
          { label: 'Review', status: 'complete' },
          { label: 'Submit', status: 'complete' },
        ]}
      />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <Stepper
        steps={[
          { label: 'Calculate', description: 'Completed', status: 'complete' },
          { label: 'Validate', description: 'Threshold exceeded', status: 'error' },
          { label: 'Submit', status: 'pending' },
        ]}
      />
    </div>
  ),
};

export const FiveStep: Story = {
  render: () => (
    <div style={{ width: '640px' }}>
      <Stepper
        steps={[
          { label: 'Calculate', status: 'complete' },
          { label: 'Process', status: 'complete' },
          { label: 'Jira', status: 'active' },
          { label: 'Banking Portal', status: 'pending' },
          { label: 'Confirm', status: 'pending' },
        ]}
      />
    </div>
  ),
};
