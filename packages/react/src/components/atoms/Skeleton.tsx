import { cn } from "../utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-ds-sunken", className)}
      {...props}
    />
  )
}

export { Skeleton }
