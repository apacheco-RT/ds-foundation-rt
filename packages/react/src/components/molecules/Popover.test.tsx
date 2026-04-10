import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'

describe('Popover', () => {
  test('renders trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )
    expect(screen.getByText('Open')).toBeInTheDocument()
  })

  test('content is not visible by default', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument()
  })

  test('shows content on trigger click', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )
    await userEvent.click(screen.getByText('Open'))
    expect(await screen.findByText('Popover body')).toBeInTheDocument()
  })

  test('closes content on second trigger click', async () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )
    const trigger = screen.getByText('Open')
    await userEvent.click(trigger)
    expect(await screen.findByText('Popover body')).toBeInTheDocument()
    await userEvent.click(trigger)
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument()
  })
})
