import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.RefObject<HTMLTextAreaElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {

    return (
      <textarea
        className={cn(
          "flex min-h-[34px] text-gray-700 disabled:cursor-text disabled:text-gray-700 disabled:opacity-100  w-full rounded-md enabled:border enabled:border-input bg-background px-3 py-2 enabled:ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none  disabled:border-none overflow-hidden resize-none text-xs placeholder:text-xs placeholder:text-slate-400",
          className
        )}
        ref={ref}
        // @ts-ignore
        style={{ 'fieldSizing': "content" }}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea"

export { Textarea }
