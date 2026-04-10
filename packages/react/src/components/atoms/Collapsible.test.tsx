import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

describe('Collapsible', () => {
  test('content is not visible by default', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    )
    // jsdom does not compute visibility — check that the text is absent from the document
    // when closed (Radix unmounts CollapsibleContent when closed by default)
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })
  test('shows content when opened', async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>
    )
    await userEvent.click(screen.getByText('Toggle'))
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })
})
