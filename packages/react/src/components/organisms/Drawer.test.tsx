import { render, screen } from '@testing-library/react'
import {
  Drawer, DrawerContent, DrawerHeader, DrawerFooter,
  DrawerTitle, DrawerDescription,
} from './Drawer'

describe('Drawer sub-components', () => {
  test('DrawerHeader renders children', () => {
    render(<DrawerHeader>Header text</DrawerHeader>)
    expect(screen.getByText('Header text')).toBeInTheDocument()
  })

  test('DrawerFooter renders children', () => {
    render(<DrawerFooter>Footer text</DrawerFooter>)
    expect(screen.getByText('Footer text')).toBeInTheDocument()
  })

  test('DrawerTitle renders when open', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
    )
    expect(screen.getByText('Drawer Title')).toBeInTheDocument()
  })

  test('DrawerDescription renders when open', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>T</DrawerTitle>
          <DrawerDescription>Drawer description</DrawerDescription>
        </DrawerContent>
      </Drawer>
    )
    expect(screen.getByText('Drawer description')).toBeInTheDocument()
  })

  test('DrawerContent is not in DOM when closed', () => {
    render(
      <Drawer open={false}>
        <DrawerContent>
          <DrawerTitle>Hidden</DrawerTitle>
        </DrawerContent>
      </Drawer>
    )
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  test('DrawerContent renders children when open', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Open Drawer</DrawerTitle>
          <DrawerDescription>Content here</DrawerDescription>
        </DrawerContent>
      </Drawer>
    )
    expect(screen.getByText('Open Drawer')).toBeInTheDocument()
    expect(screen.getByText('Content here')).toBeInTheDocument()
  })
})
