import * as React from "react";

import { cn } from "@/Components/shadcn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    showErrorMessage?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, showErrorMessage = true, ...props }, ref) => {
    return (
        <>
            <textarea
                className={cn(
                    "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
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
Textarea.displayName = "Textarea";

export { Textarea };
