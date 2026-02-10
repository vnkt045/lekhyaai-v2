import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-primary-500 text-white hover:bg-primary-600 shadow-pos",
                success: "bg-success-500 text-white hover:bg-success-600 shadow-pos",
                danger: "bg-red-500 text-white hover:bg-red-600 shadow-pos",
                warning: "bg-yellow-500 text-white hover:bg-yellow-600 shadow-pos",
                navy: "bg-navy-600 text-white hover:bg-navy-700 shadow-pos",
                outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
                ghost: "hover:bg-gray-100 text-gray-700",
                link: "text-primary-600 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-6 py-3 text-pos-base",
                sm: "h-10 px-4 py-2 text-pos-sm",
                lg: "h-14 px-8 py-4 text-pos-lg",
                xl: "h-16 px-10 py-5 text-pos-xl",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
