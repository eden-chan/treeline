import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: React.RefObject<HTMLTextAreaElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {

    const autoGrow = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current.style.height = "5px";
        ref.current.style.height = ref.current.scrollHeight + "px";
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden resize-none",
          className
        )}
        ref={ref}
        onInput={autoGrow}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea"

export { Textarea }
