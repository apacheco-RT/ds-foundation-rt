// @forwardref-exempt: portal-based — Sonner manages its own DOM tree
"use client"

import * as React from "react"
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-ds-bg group-[.toaster]:text-ds-text group-[.toaster]:border-ds-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-ds-text-muted",
          actionButton:
            "group-[.toast]:bg-ds-primary group-[.toast]:text-ds-text-inverse",
          cancelButton:
            "group-[.toast]:bg-ds-sunken group-[.toast]:text-ds-text-muted",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
