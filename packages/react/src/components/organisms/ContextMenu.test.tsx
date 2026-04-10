import { render, screen, fireEvent } from '@testing-library/react'
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuLabel, ContextMenuItem, ContextMenuSeparator,
} from './ContextMenu'

function renderMenu() {
  return render(
    <ContextMenu>
      <ContextMenuTrigger>Right click me</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

describe('ContextMenu', () => {
  test('renders trigger', () => {
    renderMenu()
    expect(screen.getByText('Right click me')).toBeInTheDocument()
  })

  test('content is not visible before right-click', () => {
    renderMenu()
    expect(screen.queryByText('Copy')).not.toBeInTheDocument()
  })

  test('content renders after right-click', () => {
    renderMenu()
    fireEvent.contextMenu(screen.getByText('Right click me'))
    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.getByText('Paste')).toBeInTheDocument()
  })

  test('label renders in open menu', () => {
    renderMenu()
    fireEvent.contextMenu(screen.getByText('Right click me'))
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })
})
