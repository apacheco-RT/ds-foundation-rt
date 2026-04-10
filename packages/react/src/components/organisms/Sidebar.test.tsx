import { render, screen } from '@testing-library/react'
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from './Sidebar'

describe('Sidebar', () => {
  test('renders sidebar with header, content, footer', () => {
    render(
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>Content</SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  test('SidebarMenuButton renders as button', () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Dashboard</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeInTheDocument()
  })

  test('SidebarMenuButton marks active with aria-current', () => {
    render(<SidebarMenuButton isActive>Active Item</SidebarMenuButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page')
  })

  test('SidebarGroupLabel renders label text', () => {
    render(<SidebarGroupLabel>Settings</SidebarGroupLabel>)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })
})
