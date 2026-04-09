import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-one" id="option-one" />
        <label htmlFor="option-one" style={{ fontSize: '14px', cursor: 'pointer' }}>Option One</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-two" id="option-two" />
        <label htmlFor="option-two" style={{ fontSize: '14px', cursor: 'pointer' }}>Option Two</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-three" id="option-three" />
        <label htmlFor="option-three" style={{ fontSize: '14px', cursor: 'pointer' }}>Option Three</label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one" disabled>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-one" id="d-option-one" />
        <label htmlFor="d-option-one" style={{ fontSize: '14px' }}>Option One</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <RadioGroupItem value="option-two" id="d-option-two" />
        <label htmlFor="d-option-two" style={{ fontSize: '14px' }}>Option Two</label>
      </div>
    </RadioGroup>
  ),
};
