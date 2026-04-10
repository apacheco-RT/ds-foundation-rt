import * as React from "react"
import { cn } from "../utils"

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ header, sidebar, footer, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col min-h-screen", className)}
      {...props}
    >
      {header && <header className="flex-shrink-0">{header}</header>}
      <div className="flex flex-1 overflow-hidden">
        {sidebar && <aside className="flex-shrink-0">{sidebar}</aside>}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      {footer && <footer className="flex-shrink-0">{footer}</footer>}
    </div>
  )
)
PageLayout.displayName = "PageLayout"

export { PageLayout }
