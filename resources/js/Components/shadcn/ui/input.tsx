import * as React from "react";

import { cn } from "@/Components/shadcn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    showErrorMessage?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, showErrorMessage = true, ...props }, ref) => {
    return (
        <>
            <input
                type={type}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    error ? "border-red-500" : "",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && showErrorMessage && <span className="text-xs text-red-600 dark:text-red-500">{error}</span>}
        </>
    );
});
Input.displayName = "Input";

export { Input };
