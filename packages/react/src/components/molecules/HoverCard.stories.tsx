import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';
import { Button } from '../atoms/Button';

const meta: Meta = {
  title: 'Components/HoverCard',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@ds-foundation</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">@ds-foundation</h4>
          <p className="text-sm text-ds-text-muted">
            The design system powering Ripple Treasury UI components.
          </p>
          <div className="flex items-center pt-2">
            <span className="text-xs text-ds-text-muted">Joined January 2025</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
