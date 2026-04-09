import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { Button } from '../atoms/Button';

const meta: Meta = {
  title: 'Components/Popover',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Popover</h4>
          <p className="text-sm text-ds-text-muted">
            This is some popover content. It can contain anything.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
