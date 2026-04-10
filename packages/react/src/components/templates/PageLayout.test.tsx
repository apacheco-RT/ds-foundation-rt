import { render, screen } from '@testing-library/react'
import { PageLayout } from './PageLayout'

describe('PageLayout', () => {
  test('renders main content', () => {
    render(<PageLayout>Main content</PageLayout>)
    expect(screen.getByRole('main')).toHaveTextContent('Main content')
  })

  test('renders header slot when provided', () => {
    render(<PageLayout header={<div>My Header</div>}>Content</PageLayout>)
    expect(screen.getByRole('banner')).toHaveTextContent('My Header')
  })

  test('omits header when not provided', () => {
    render(<PageLayout>Content</PageLayout>)
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  test('renders sidebar slot when provided', () => {
    render(<PageLayout sidebar={<nav>Nav</nav>}>Content</PageLayout>)
    expect(screen.getByRole('complementary')).toBeInTheDocument()
  })

  test('omits sidebar when not provided', () => {
    render(<PageLayout>Content</PageLayout>)
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  test('renders footer slot when provided', () => {
    render(<PageLayout footer={<div>My Footer</div>}>Content</PageLayout>)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('My Footer')
  })

  test('omits footer when not provided', () => {
    render(<PageLayout>Content</PageLayout>)
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  test('forwards ref to root div', () => {
    const ref = { current: null }
    render(<PageLayout ref={ref}>Content</PageLayout>)
    expect(ref.current).not.toBeNull()
  })
})
