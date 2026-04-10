import { render, screen } from '@testing-library/react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './Breadcrumb'

describe('Breadcrumb', () => {
  test('renders nav with aria-label', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  test('renders link with href', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/home">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home')
  })

  test('BreadcrumbPage has aria-current=page', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page')
  })

  test('renders separator', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    // Separator has role="presentation" and aria-hidden
    const sep = container.querySelector('[role="presentation"][aria-hidden="true"]')
    expect(sep).toBeInTheDocument()
  })

  test('renders ellipsis', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbEllipsis />
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByText('More')).toBeInTheDocument()
  })
})
