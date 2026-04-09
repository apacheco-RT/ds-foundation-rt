import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const transactions = [
  { id: 'TXN-001', amount: '$1,200,000', entity: 'Bitstamp SA → Bitstamp LTD', status: 'Settled' },
  { id: 'TXN-002', amount: '$850,000', entity: 'Bitstamp INC → Bitstamp SA', status: 'Pending' },
  { id: 'TXN-003', amount: '$3,400,000', entity: 'Bitstamp SA → Bitstamp BVI', status: 'Settled' },
  { id: 'TXN-004', amount: '$220,000', entity: 'Bitstamp LTD → Bitstamp INC', status: 'Processing' },
  { id: 'TXN-005', amount: '$7,100,000', entity: 'Bitstamp SA → Bitstamp Asia', status: 'Settled' },
  { id: 'TXN-006', amount: '$560,000', entity: 'Bitstamp BVI → Bitstamp SA', status: 'Pending' },
  { id: 'TXN-007', amount: '$4,900,000', entity: 'Bitstamp INC → Bitstamp LTD', status: 'Settled' },
  { id: 'TXN-008', amount: '$310,000', entity: 'Bitstamp Asia → Bitstamp SA', status: 'Processing' },
];

export const Default: Story = {
  render: () => (
    <ScrollArea style={{ height: '240px', width: '480px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <div style={{ padding: '8px' }}>
        {transactions.map(tx => (
          <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
            <span style={{ fontWeight: 500 }}>{tx.id}</span>
            <span style={{ color: '#64748b' }}>{tx.entity}</span>
            <span style={{ fontWeight: 600 }}>{tx.amount}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
