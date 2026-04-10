import type { Meta, StoryObj } from '@storybook/react'
import { Home, Settings, Users, BarChart2, FileText } from 'lucide-react'
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
} from './Sidebar'

const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof Sidebar>

const SidebarDemo = ({ activeItem = 'Dashboard' }: { activeItem?: string }) => (
  <Sidebar>
    <SidebarHeader>
      <span className="text-sm font-bold text-ds-text">Acme Inc</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {[
            { label: 'Dashboard', icon: Home },
            { label: 'Reports', icon: BarChart2 },
            { label: 'Documents', icon: FileText },
          ].map(({ label, icon: Icon }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton isActive={label === activeItem}>
                <Icon className="h-4 w-4" />
                {label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarSeparator />
      <SidebarGroup>
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {[{ label: 'Users', icon: Users }, { label: 'Settings', icon: Settings }].map(({ label, icon: Icon }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton isActive={label === activeItem}>
                  <Icon className="h-4 w-4" />
                  {label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <span className="text-xs text-ds-text-muted">v1.0.0</span>
    </SidebarFooter>
  </Sidebar>
)

export const Default: Story = {
  render: () => <div style={{ height: '400px', display: 'flex' }}><SidebarDemo /></div>,
}

export const WithActiveItem: Story = {
  render: () => <div style={{ height: '400px', display: 'flex' }}><SidebarDemo activeItem="Reports" /></div>,
}
