import * as React from "react"

import { cn } from "@/lib/utils"

import { Textarea, TextareaProps } from "@/components/ui/textarea";
import { Trash2 } from 'lucide-react';

interface HighlightCommentTextareaProps extends TextareaProps {
    userProfile?: {
        firstName: string;
        lastName: string;
        profilePicture?: string;
    };
    timeAgo?: string;
}

const HighlightCommentTextarea = React.forwardRef<HTMLTextAreaElement, HighlightCommentTextareaProps>(
    ({ className, userProfile, timeAgo, ...props }, ref) => {

        return (
            <>
                <div className="invisible group-hover:visible flex items-center">
                    <button
                        className="text-blue-500 hover:text-blue-700 p-0.5 rounded select-none ml-2"
                    >
                        <Trash2 className="cursor-pointer" size={16} />
                    </button>
                    <span className="text-xs ml-1 select-none self-end">{userProfile?.firstName} {userProfile?.lastName} {timeAgo}</span>
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
