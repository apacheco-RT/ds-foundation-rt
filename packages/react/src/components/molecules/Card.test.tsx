import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
  CardDivider,
} from './Card'

describe('Card', () => {
  test('renders title and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Card</CardTitle>
        </CardHeader>
        <CardContent>body</CardContent>
      </Card>
    )
    expect(screen.getByText('My Card')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  test('renders description and footer', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardFooter>footer</CardFooter>
      </Card>
    )
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getByText('footer')).toBeInTheDocument()
  })

  test('renders CardHeader actions slot', () => {
    render(
      <Card>
        <CardHeader actions={<button>Action</button>}>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  test('renders CardDivider without label', () => {
    const { container } = render(
      <Card>
        <CardDivider />
      </Card>
    )
    const divider = container.querySelector('.border-t')
    expect(divider).toBeInTheDocument()
  })

  test('renders CardDivider with label', () => {
    render(
      <Card>
        <CardDivider label="Section" />
      </Card>
    )
    expect(screen.getByText('Section')).toBeInTheDocument()
  })

  test('elevated prop does not crash', () => {
    const { container } = render(<Card elevated><CardContent>hi</CardContent></Card>)
    expect(container.firstChild).toBeInTheDocument()
  })
})
