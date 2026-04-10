import { render, screen } from '@testing-library/react'
import {
  Dialog, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription, DialogTrigger,
} from './Dialog'

describe('Dialog sub-components', () => {
  test('DialogHeader renders children', () => {
    render(<DialogHeader>Header content</DialogHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  test('DialogFooter renders children', () => {
    render(<DialogFooter>Footer content</DialogFooter>)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  test('DialogTitle renders as heading', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>My Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('heading', { name: 'My Title' })).toBeInTheDocument()
  })

  test('DialogDescription renders with text', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>T</DialogTitle>
          <DialogDescription>Some description</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByText('Some description')).toBeInTheDocument()
  })

  test('DialogContent is not rendered when Dialog is closed', () => {
    render(
      <Dialog open={false}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Hidden</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('DialogContent renders when Dialog is open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Open Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
