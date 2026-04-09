import type { Meta, StoryObj } from '@storybook/react';
import { FormCard } from './FormCard';

const meta: Meta<typeof FormCard> = {
  title: 'Components/FormCard',
  component: FormCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof FormCard>;

export const RadioTall: Story = {
  args: {
    label: 'Wire Transfer',
    description: 'Same-day settlement via SWIFT/CHAPS network',
    selectionType: 'radio',
    layout: 'tall',
    selected: false,
  },
};

export const RadioSelected: Story = {
  args: {
    label: 'Wire Transfer',
    description: 'Same-day settlement via SWIFT/CHAPS network',
    selectionType: 'radio',
    layout: 'tall',
    selected: true,
  },
};

export const CheckboxLong: Story = {
  args: {
    label: 'Include RLUSD settlement',
    description: 'Use RLUSD stablecoin for intercompany netting',
    selectionType: 'checkbox',
    layout: 'long',
    selected: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'ACH Transfer',
    description: 'Not available for amounts over $20M',
    selectionType: 'radio',
    layout: 'tall',
    disabled: true,
    selected: false,
  },
};

export const Group: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', width: '600px' }}>
      <FormCard label="Wire Transfer" description="Same-day via SWIFT" selectionType="radio" layout="tall" selected={true} />
      <FormCard label="ACH Transfer" description="1–3 business days" selectionType="radio" layout="tall" selected={false} />
      <FormCard label="Internal Book Transfer" description="Instant, no fees" selectionType="radio" layout="tall" selected={false} />
    </div>
  ),
};
