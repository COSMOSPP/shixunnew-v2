import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full border border-neutral-border bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-caption focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10 px-4 py-2.5 text-[14px] rounded-[16px]",
        sm: "h-8 px-3 py-1.5 text-[14px] rounded-[12px]",
        md: "h-10 px-4 py-2.5 text-[14px] rounded-[16px]",
        lg: "h-12 px-5 py-3 text-[16px] rounded-[16px]",
      },
      error: {
        true: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
        false: "",
      }
    },
    defaultVariants: {
      size: "default",
      error: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, error, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
