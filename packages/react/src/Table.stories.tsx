import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './Table';

const meta: Meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

const invoices = [
  { id: 'INV-001', status: 'Paid', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', amount: '$150.00' },
  { id: 'INV-003', status: 'Overdue', amount: '$75.00' },
];

export const Default: StoryObj = {
  render: () => (
    <Table style={{ minWidth: 400 }}>
      <TableCaption>Recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead style={{ textAlign: 'right' }}>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell>{inv.id}</TableCell>
            <TableCell>{inv.status}</TableCell>
            <TableCell style={{ textAlign: 'right' }}>{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell style={{ textAlign: 'right' }}>$475.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
