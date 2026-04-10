import { render, screen } from '@testing-library/react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from './Pagination'

describe('Pagination', () => {
  test('renders navigation', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('renders Previous and Next links', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/prev" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(screen.getByText('Previous')).toBeInTheDocument()
    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  test('renders page link with isActive state', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>2</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(screen.getByText('2').closest('a')).toHaveAttribute('aria-current', 'page')
  })

  test('renders ellipsis', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(screen.getByText('More pages')).toBeInTheDocument()
  })
})
