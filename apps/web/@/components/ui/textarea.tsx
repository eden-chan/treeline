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
        console.log(ref.current.scrollHeight, ref.current.style.height)
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[32px] h-[32px] w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden resize-none text-gray-800 text-xs placeholder:italic placeholder:text-xs placeholder:text-slate-400 ",
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
