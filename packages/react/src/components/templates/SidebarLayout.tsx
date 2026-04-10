import * as React from "react"
import { cn } from "../utils"

export interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode
  sidebarWidth?: string
  children: React.ReactNode
}

const SidebarLayout = React.forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ sidebar, sidebarWidth = "16rem", children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-full", className)}
      {...props}
    >
      <aside
        className="flex-shrink-0 overflow-y-auto"
        style={{ width: sidebarWidth }}
      >
        {sidebar}
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
)
SidebarLayout.displayName = "SidebarLayout"

export { SidebarLayout }
