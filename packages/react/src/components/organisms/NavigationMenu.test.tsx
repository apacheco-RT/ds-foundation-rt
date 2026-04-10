import { render, screen } from '@testing-library/react'
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuTrigger,
} from './NavigationMenu'

describe('NavigationMenu', () => {
  test('renders navigation landmark', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  test('renders list items', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">About</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">Contact</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  test('renders trigger button', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
    expect(screen.getByText('Products')).toBeInTheDocument()
  })
})
