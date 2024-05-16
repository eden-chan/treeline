import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.RefObject<HTMLTextAreaElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {



    return (
      <textarea
        className={cn(
          "flex min-h-[34px] w-full rounded-md cursor-grab disabled:text-gray-800 disabled:cursor-grab enabled:border enabled:border-input bg-background px-3 py-2 enabled:ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:border-none overflow-hidden resize-none text-gray-800 text-xs placeholder:text-xs placeholder:text-slate-400 ",
          className
        )}
        ref={ref}
        // @ts-ignore
        style={{ 'field-sizing': "content" }}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea"

export { Textarea }
