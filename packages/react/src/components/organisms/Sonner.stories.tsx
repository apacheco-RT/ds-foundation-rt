import type { Meta, StoryObj } from '@storybook/react';
import { toast } from 'sonner';
import { Button } from '../atoms/Button';
import { Toaster } from './Sonner';

const meta: Meta = {
  title: 'Components/Sonner',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <>
      <Toaster />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button onClick={() => toast('Event has been created.')}>Default toast</Button>
        <Button variant="outline" onClick={() => toast.success('Payment processed successfully.')}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error('Payment failed. Please retry.')}>
          Error
        </Button>
        <Button variant="outline" onClick={() => toast.warning('Account balance is low.')}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info('System maintenance at 02:00 UTC.')}>
          Info
        </Button>
      </div>
    </>
  ),
};
