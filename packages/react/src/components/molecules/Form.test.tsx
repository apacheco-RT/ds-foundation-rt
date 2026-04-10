import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from './Form'
import { Input } from '../atoms/Input'

function TestForm({ defaultValues = {} }: { defaultValues?: Record<string, string> }) {
  const form = useForm<{ email: string }>({ defaultValues })
  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

describe('Form', () => {
  test('renders field with label', () => {
    render(<TestForm />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  test('renders input', () => {
    render(<TestForm />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  test('renders form description', () => {
    render(<TestForm />)
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
  })

  test('label is associated with input via htmlFor', () => {
    render(<TestForm />)
    const label = screen.getByText('Email')
    const input = screen.getByRole('textbox')
    expect(label.closest('label') ?? label).toHaveAttribute('for', input.id)
  })

  test('input accepts user input', async () => {
    render(<TestForm />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test@example.com')
    expect(input).toHaveValue('test@example.com')
  })
})
