import * as React from "react"
import { cn } from "./utils"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> { }

const Display = React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <h1 ref={ref} className={cn("text-[72px] font-bold leading-[1.1] tracking-tight", className)} {...props} />
    )
)
Display.displayName = "Display"

const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <h1 ref={ref} className={cn("text-[48px] font-bold leading-[1.2] tracking-tight", className)} {...props} />
    )
)
H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <h2 ref={ref} className={cn("text-[36px] font-bold leading-[1.25] tracking-tight", className)} {...props} />
    )
)
H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-[28px] font-semibold leading-[1.3] tracking-tight", className)} {...props} />
    )
)
H3.displayName = "H3"

const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <h4 ref={ref} className={cn("text-[24px] font-semibold leading-[1.35] tracking-tight", className)} {...props} />
    )
)
H4.displayName = "H4"

const H5 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <h5 ref={ref} className={cn("text-[20px] font-semibold leading-[1.4] tracking-tight", className)} {...props} />
    )
)
H5.displayName = "H5"

const BodyLarge = React.forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-[20px] font-normal leading-[1.6]", className)} {...props} />
    )
)
BodyLarge.displayName = "BodyLarge"

const Body = React.forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-[16px] font-normal leading-[1.5]", className)} {...props} />
    )
)
Body.displayName = "Body"

const BodySmall = React.forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <p ref={ref} className={cn("text-[14px] font-normal leading-[1.5]", className)} {...props} />
    )
)
BodySmall.displayName = "BodySmall"

const Caption = React.forwardRef<HTMLSpanElement, TypographyProps>(
    ({ className, ...props }, ref) => (
        <span ref={ref} className={cn("text-[12px] font-normal leading-[1.4] text-muted-foreground", className)} {...props} />
    )
)
Caption.displayName = "Caption"

export {
    Display,
    H1,
    H2,
    H3,
    H4,
    H5,
    BodyLarge,
    Body,
    BodySmall,
    Caption,
}
