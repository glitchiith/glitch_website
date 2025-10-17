import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-md hover:shadow-lg hover:from-neon-blue/80 hover:to-neon-purple/80",
        neon: "bg-gradient-to-r from-neon-green to-neon-pink text-black border-2 border-transparent hover:border-neon-green/50 hover:bg-opacity-90",
        outline: "border-2 border-neon-blue bg-transparent text-neon-blue hover:bg-neon-blue/10 dark:hover:bg-neon-blue/20",
        secondary: "bg-gray-800 text-neon-green hover:bg-gray-700 hover:text-white",
        ghost: "text-neon-blue hover:text-neon-purple hover:bg-neon-blue/10 dark:hover:bg-neon-purple/10",
        link: "text-neon-blue underline-offset-4 hover:underline hover:text-neon-purple",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-8 has-[>svg]:px-5",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }