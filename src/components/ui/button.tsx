import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telstra-blue disabled:opacity-50",
          variant === "primary" &&
            "bg-telstra-blue text-white hover:bg-blue-600",
          variant === "secondary" &&
            "bg-telstra-grey text-telstra-dark hover:bg-gray-200",
          variant === "ghost" && "text-telstra-dark hover:bg-telstra-grey",
          variant === "outline" &&
            "border-2 border-telstra-blue text-telstra-blue hover:bg-blue-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
