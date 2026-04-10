import { render, screen } from '@testing-library/react'
import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from './Table'

function renderTable() {
  return render(
    <Table>
      <TableCaption>Invoice list</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-001</TableCell>
          <TableCell>$100</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>$100</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe('Table', () => {
  test('renders table element', () => {
    renderTable()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  test('renders column headers', () => {
    renderTable()
    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toBeInTheDocument()
  })

  test('renders cell content', () => {
    renderTable()
    expect(screen.getByText('INV-001')).toBeInTheDocument()
    expect(screen.getAllByText('$100').length).toBeGreaterThan(0)
  })

  test('renders caption', () => {
    renderTable()
    expect(screen.getByText('Invoice list')).toBeInTheDocument()
  })

  test('renders footer row', () => {
    renderTable()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  test('Table accepts className', () => {
    const { container } = render(
      <Table className="custom-table">
        <TableBody>
          <TableRow><TableCell>x</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('table')).toHaveClass('custom-table')
  })

  test('TableRow accepts className', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow className="selected-row"><TableCell>x</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('tr')).toHaveClass('selected-row')
  })
})
