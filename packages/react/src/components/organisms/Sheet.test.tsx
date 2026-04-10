import { render, screen } from '@testing-library/react'
import {
  Sheet, SheetContent, SheetHeader, SheetFooter,
  SheetTitle, SheetDescription, SheetTrigger,
} from './Sheet'

describe('Sheet sub-components', () => {
  test('SheetHeader renders children', () => {
    render(<SheetHeader>Header text</SheetHeader>)
    expect(screen.getByText('Header text')).toBeInTheDocument()
  })

  test('SheetFooter renders children', () => {
    render(<SheetFooter>Footer text</SheetFooter>)
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  test('SheetTitle renders when sheet is open', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Sheet Title</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByText('Sheet Title')).toBeInTheDocument()
  })

  test('SheetDescription renders when sheet is open', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>T</SheetTitle>
          <SheetDescription>Sheet desc</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByText('Sheet desc')).toBeInTheDocument()
  })

  test('SheetContent is not in DOM when closed', () => {
    render(
      <Sheet open={false}>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetTitle>Hidden</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  test('SheetContent renders dialog role when open', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Open Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
