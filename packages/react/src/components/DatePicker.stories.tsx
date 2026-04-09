import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
      {date && (
        <p style={{ fontSize: 14, color: '#6b7280' }}>
          Selected: {date.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

const meta: Meta = {
  title: 'Components/DatePicker',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = { render: () => <DatePickerDemo /> };

export const WithDefaultValue: StoryObj = {
  render: () => <DatePicker defaultValue={new Date()} placeholder="Prefilled date" />,
};

export const Disabled: StoryObj = {
  render: () => <DatePicker disabled placeholder="Disabled" />,
};
