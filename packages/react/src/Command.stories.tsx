import type { Meta, StoryObj } from '@storybook/react';
import { Calculator, Calendar, CreditCard, Settings, User } from 'lucide-react';
import {
  Command, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from './Command';

const meta: Meta = {
  title: 'Components/Command',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Command style={{ width: 320, borderRadius: 8, border: '1px solid hsl(var(--border))' }}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            Payments
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
