import * as React from "react"

import { cn } from "@/lib/utils"

import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { Trash2 } from 'lucide-react';

const HighlightCommentTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {

        return (
            <>
                <div className="invisible group-hover:visible flex items-center">
                    <button
                        className="text-blue-500 hover:text-blue-700 p-0.5 rounded select-none ml-2"
                    >
                        <Trash2 className="cursor-pointer" size={16} />
                    </button>
                </div>
                <Textarea
                    className={cn('',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </>
        );
    }
);
HighlightCommentTextarea.displayName = "HighlightCommentTextarea"

export { HighlightCommentTextarea }
