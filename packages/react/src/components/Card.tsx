import * as React from "react"
import { cn } from "./utils"

// ── Card root ──────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  glass?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevated, glass, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[0.25rem] border bg-ds-surface text-ds-text shadow-sm",
        elevated && "shadow-ds-md",
        glass && "backdrop-blur-sm bg-ds-surface/80",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

// ── CardHeader ─────────────────────────────────────────────────────────────

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  actions?: React.ReactNode
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, actions, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        actions ? "flex items-start justify-between p-6" : "flex flex-col space-y-1.5 p-6",
        className
      )}
      {...props}
    >
      {actions ? (
        <>
          <div className="flex flex-col space-y-1.5 min-w-0">{children}</div>
          <div className="flex items-center gap-2 shrink-0 ml-4">{actions}</div>
        </>
      ) : (
        children
      )}
    </div>
  )
)
CardHeader.displayName = "CardHeader"

// ── CardTitle ──────────────────────────────────────────────────────────────

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-ds-text",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ── CardDescription ────────────────────────────────────────────────────────

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-ds-text-muted", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ── CardContent ────────────────────────────────────────────────────────────

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// ── CardFooter ─────────────────────────────────────────────────────────────

const FOOTER_ALIGN = {
  left:    'justify-start',
  right:   'justify-end',
  between: 'justify-between',
} as const

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: keyof typeof FOOTER_ALIGN
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'left', ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", FOOTER_ALIGN[align], className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

// ── CardDivider ────────────────────────────────────────────────────────────

interface CardDividerProps {
  label?: string
  className?: string
}

function CardDivider({ label, className }: CardDividerProps) {
  if (label) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 px-6 text-xs text-ds-text-muted",
          className
        )}
      >
        <div className="flex-1 border-t border-ds-border" />
        <span>{label}</span>
        <div className="flex-1 border-t border-ds-border" />
      </div>
    )
  }
  return (
    <div className={cn("border-t border-ds-border my-0", className)} />
  )
}
CardDivider.displayName = "CardDivider"

// ── Exports ────────────────────────────────────────────────────────────────

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDivider,
}
export type { CardProps, CardHeaderProps, CardFooterProps, CardDividerProps }
