import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors",
        "placeholder:text-neutral-400",
        "focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0 focus:border-neutral-900",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
        "dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500",
        "dark:focus:ring-neutral-100 dark:focus:border-neutral-100",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
