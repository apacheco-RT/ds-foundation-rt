import type { Meta, StoryObj } from '@storybook/react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable';

const meta: Meta = {
  title: 'Components/Resizable',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const HorizontalSplit: StoryObj = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      style={{ width: '600px', height: '300px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={50}>
        <div style={{ padding: '16px', height: '100%', background: '#f8fafc' }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>Transaction List</p>
          <p style={{ fontSize: '13px', color: '#64748b' }}>17,432 intercompany transactions</p>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div style={{ padding: '16px', height: '100%' }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>Settlement Detail</p>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Select a transaction to view details</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const VerticalSplit: StoryObj = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      style={{ width: '500px', height: '400px', border: '1px solid #e2e8f0', borderRadius: '8px' }}
    >
      <ResizablePanel defaultSize={60}>
        <div style={{ padding: '16px', height: '100%', background: '#f8fafc' }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>Payment Queue</p>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Pending approvals: 7</p>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <div style={{ padding: '16px', height: '100%' }}>
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>Audit Log</p>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Last action: 2 minutes ago</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
