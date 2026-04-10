import { render, screen } from '@testing-library/react'
import { Stepper } from './Stepper'
import type { Step } from './Stepper'

const steps: Step[] = [
  { label: 'Step 1', status: 'complete' },
  { label: 'Step 2', status: 'active' },
  { label: 'Step 3', status: 'pending' },
]

describe('Stepper', () => {
  test('renders all step labels', () => {
    render(<Stepper steps={steps} />)
    expect(screen.getByText('Step 1')).toBeInTheDocument()
    expect(screen.getByText('Step 2')).toBeInTheDocument()
    expect(screen.getByText('Step 3')).toBeInTheDocument()
  })

  test('renders as ordered list', () => {
    render(<Stepper steps={steps} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  test('active step has aria-current=step', () => {
    render(<Stepper steps={steps} />)
    const activeItem = screen.getByRole('listitem', { current: 'step' })
    expect(activeItem).toBeInTheDocument()
  })

  test('renders step descriptions when provided', () => {
    const stepsWithDesc: Step[] = [
      { label: 'Upload', description: 'Upload your file', status: 'complete' },
      { label: 'Review', status: 'active' },
    ]
    render(<Stepper steps={stepsWithDesc} />)
    expect(screen.getByText('Upload your file')).toBeInTheDocument()
  })

  test('error step renders correctly', () => {
    const errorSteps: Step[] = [
      { label: 'Failed Step', status: 'error' },
    ]
    const { container } = render(<Stepper steps={errorSteps} />)
    expect(container.firstChild).toBeInTheDocument()
    expect(screen.getByText('Failed Step')).toBeInTheDocument()
  })
})
