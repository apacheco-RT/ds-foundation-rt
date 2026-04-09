import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar } from './Calendar';

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}

function CalendarRangeDemo() {
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  return (
    <Calendar
      mode="range"
      selected={{ from: range.from, to: range.to }}
      onSelect={(r) => setRange(r ?? {})}
      className="rounded-md border"
    />
  );
}

const meta: Meta = {
  title: 'Components/Calendar',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const SingleSelect: StoryObj = { render: () => <CalendarDemo /> };
export const RangeSelect: StoryObj = { render: () => <CalendarRangeDemo /> };
