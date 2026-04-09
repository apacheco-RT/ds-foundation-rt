import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta: Meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tabs defaultValue="account" style={{ width: '400px' }}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings content.</TabsContent>
      <TabsContent value="password">Password settings content.</TabsContent>
    </Tabs>
  ),
};

export const TreasuryView: StoryObj = {
  render: () => (
    <Tabs defaultValue="pending" style={{ width: '560px' }}>
      <TabsList>
        <TabsTrigger value="pending">Pending (7)</TabsTrigger>
        <TabsTrigger value="settled">Settled</TabsTrigger>
        <TabsTrigger value="overdue">Overdue (2)</TabsTrigger>
        <TabsTrigger value="all">All Transactions</TabsTrigger>
      </TabsList>
      <TabsContent value="pending" style={{ padding: '16px 0', fontSize: '13px', color: '#64748b' }}>
        7 transactions awaiting approval. Total exposure: $12.4M
      </TabsContent>
      <TabsContent value="settled" style={{ padding: '16px 0', fontSize: '13px', color: '#64748b' }}>
        1,432 transactions settled this week. Total volume: $48.2M
      </TabsContent>
      <TabsContent value="overdue" style={{ padding: '16px 0', fontSize: '13px', color: '#f97316' }}>
        2 transactions past due date. Immediate action required.
      </TabsContent>
      <TabsContent value="all" style={{ padding: '16px 0', fontSize: '13px', color: '#64748b' }}>
        Showing all 17,432 transactions for the current period.
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: StoryObj = {
  render: () => (
    <Tabs defaultValue="overview" style={{ width: '400px' }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content.</TabsContent>
      <TabsContent value="analytics">Analytics content.</TabsContent>
      <TabsContent value="reports">Reports content (disabled).</TabsContent>
    </Tabs>
  ),
};
