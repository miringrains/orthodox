import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[#8C8881] selection:bg-[#EBDCA8] selection:text-[#0B0B0B] h-9 w-full min-w-0 rounded-md border border-[#D1CEC8] dark:border-[#2F2F2F] bg-white dark:bg-[#232323] px-3 py-1 text-base text-[#0B0B0B] dark:text-[#F3F2EE] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#C9A227] focus-visible:ring-[#C9A227]/35 focus-visible:ring-[3px]",
        "aria-invalid:ring-[#6F2D2D]/20 dark:aria-invalid:ring-[#6F2D2D]/40 aria-invalid:border-[#6F2D2D]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
