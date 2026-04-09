import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';
import { Button } from './Button';

const meta: Meta = {
  title: 'Components/Collapsible',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible open={open} onOpenChange={setOpen} className="w-64 space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">Collapsible section</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {open ? 'Hide' : 'Show'}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-2 px-4">
          <div className="rounded-md border px-4 py-3 text-sm">
            This content is revealed when expanded.
          </div>
          <div className="rounded-md border px-4 py-3 text-sm">
            A second collapsible row.
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};
