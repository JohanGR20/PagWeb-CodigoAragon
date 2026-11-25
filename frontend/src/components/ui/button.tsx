import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-navy-950 text-cream hover:bg-navy-800",
        gold: "bg-gold-400 text-navy-950 shadow-[0_14px_34px_-14px_rgba(201,162,74,0.85)] hover:bg-gold-300 hover:shadow-[0_18px_40px_-14px_rgba(201,162,74,0.9)]",
        outline:
          "border border-navy-950/15 bg-transparent text-navy-950 hover:border-navy-950/30 hover:bg-navy-950/[0.04]",
        secondary: "bg-sand text-navy-950 hover:bg-gold-200/70",
        ghost: "text-navy-950 hover:bg-navy-950/[0.06]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        whatsapp: "bg-whatsapp text-white shadow-lg shadow-emerald-600/20 hover:bg-[#1ebe5b]",
        light: "bg-white text-navy-950 hover:bg-cream",
        "outline-light":
          "border border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:border-white/35",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-[15px]",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
