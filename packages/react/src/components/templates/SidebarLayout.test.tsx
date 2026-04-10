import { render, screen } from '@testing-library/react'
import { SidebarLayout } from './SidebarLayout'

describe('SidebarLayout', () => {
  test('renders sidebar content', () => {
    render(<SidebarLayout sidebar={<nav>Nav links</nav>}>Main</SidebarLayout>)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('renders main content', () => {
    render(<SidebarLayout sidebar={<nav>Nav</nav>}>Page content</SidebarLayout>)
    expect(screen.getByRole('main')).toHaveTextContent('Page content')
  })

  test('applies default sidebar width', () => {
    const { container } = render(
      <SidebarLayout sidebar={<nav>Nav</nav>}>Content</SidebarLayout>
    )
    const aside = container.querySelector('aside')
    expect(aside?.style.width).toBe('16rem')
  })

  test('applies custom sidebar width', () => {
    const { container } = render(
      <SidebarLayout sidebar={<nav>Nav</nav>} sidebarWidth="20rem">Content</SidebarLayout>
    )
    const aside = container.querySelector('aside')
    expect(aside?.style.width).toBe('20rem')
  })

  test('forwards ref to root div', () => {
    const ref = { current: null }
    render(<SidebarLayout ref={ref} sidebar={<nav>Nav</nav>}>Content</SidebarLayout>)
    expect(ref.current).not.toBeNull()
  })
})
