import { useState, useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from '../ui/textarea';

type Props = {
    highlight: any;
    rightmostArea: {
        height: number;
        left: number;
        pageIndex: number;
        top: number;
        width: number;
    } | undefined;
    middleHeight: number | undefined;
    editHighlight: (highlightId: string, text: string) => void;
    deleteHighlight: (highlightId: string) => void;
}
export const PastNote = ({ highlight, rightmostArea, middleHeight, editHighlight, deleteHighlight }: Props) => {
    if (!rightmostArea) return null;

    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = highlight.content;
        }
    }, [highlight.content]);



    const handleEdit = () => {
        if (inputRef.current) {
            editHighlight(highlight.id, inputRef.current.value)
        }
    };

    const handleTrash = () => {
        deleteHighlight(highlight.id)

    };

    const handleReply = () => {
        // Dummy function for handling comment
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            if (inputRef.current) {
                editHighlight(highlight.id, inputRef.current.value)
            }
        }
    };
    return (
        <>
            <span
                className="z-50 absolute text-blue-500 text-xl font-bold group"
                style={{
                    left: `${rightmostArea.left + rightmostArea.width}%`,
                    top: `${middleHeight ?? rightmostArea.top}%`,
                    transform: 'translate(8px, -50%)',
                }}
            >
                <div className="bg-white z-10 py-1">
                    <div className="flex justify-start items-center"> {/* Changed justify-end to justify-start */}
                        <div className="flex items-center space-x-0.5">
                            ¶¶
                            <button
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-0.5 rounded"
                                onClick={handleEdit}
                            >
                                <Pencil className="cursor-pointer" size={16} />
                            </button>
                            <button
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-0.5 rounded"
                                onClick={handleTrash}
                            >
                                <Trash2 className="cursor-pointer" size={16} />
                            </button>
                        </div>
                    </div>
                </div>
                <Textarea ref={inputRef}
                    onKeyDown={handleKeyDown} />
                <div className="sticky bottom-0 left-0 bg-white z-10">
                    <div className="flex justify-end">
                        <button
                            className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                            onClick={handleReply}
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </span >
        </>
    );
};