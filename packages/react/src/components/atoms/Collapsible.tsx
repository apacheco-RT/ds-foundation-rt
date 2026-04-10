import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>((props, ref) => <CollapsiblePrimitive.Root ref={ref} {...props} />)
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
