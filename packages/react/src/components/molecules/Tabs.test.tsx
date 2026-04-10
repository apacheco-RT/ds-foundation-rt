import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

describe('Tabs', () => {
  test('renders tabs and shows default content', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    )
    expect(screen.getByText('Content A')).toBeInTheDocument()
  })

  test('non-active tab content is not visible by default', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A content</TabsContent>
        <TabsContent value="b">B content</TabsContent>
      </Tabs>
    )
    expect(screen.queryByText('B content')).not.toBeInTheDocument()
  })

  test('switches content on tab click', async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A content</TabsContent>
        <TabsContent value="b">B content</TabsContent>
      </Tabs>
    )
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('B content')).toBeInTheDocument()
    expect(screen.queryByText('A content')).not.toBeInTheDocument()
  })

  test('tab triggers have correct roles', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>
    )
    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })

  test('disabled tab cannot be clicked', async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="b" disabled>B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A content</TabsContent>
        <TabsContent value="b">B content</TabsContent>
      </Tabs>
    )
    const tabB = screen.getByRole('tab', { name: 'B' })
    expect(tabB).toBeDisabled()
  })
})
