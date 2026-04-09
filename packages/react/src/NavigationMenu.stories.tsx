import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './NavigationMenu';

const meta: Meta = {
  title: 'Components/NavigationMenu',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <NavigationMenuLink href="#">
                <div className="font-medium">Introduction</div>
                <p className="text-sm text-muted-foreground">
                  Overview of the design system.
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="font-medium">Installation</div>
                <p className="text-sm text-muted-foreground">
                  How to add ds-foundation to your project.
                </p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[300px]">
              <NavigationMenuLink href="#">Button</NavigationMenuLink>
              <NavigationMenuLink href="#">Dialog</NavigationMenuLink>
              <NavigationMenuLink href="#">Tooltip</NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  ),
};
