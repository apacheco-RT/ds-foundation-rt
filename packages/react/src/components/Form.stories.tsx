import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';
import { Input } from './Input';
import { Button } from './Button';

const schema = z.object({ email: z.string().email('Invalid email address') });
type FormValues = z.infer<typeof schema>;

function FormDemo() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormDescription>We will never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

function FormWithErrorDemo() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'not-an-email' },
    mode: 'all',
  });
  // Trigger validation on mount
  const { formState } = form;
  void formState.errors;
  form.trigger();
  return (
    <Form {...form}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '320px' }}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

const meta: Meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = { render: () => <FormDemo /> };
export const WithValidationError: StoryObj = { render: () => <FormWithErrorDemo /> };
