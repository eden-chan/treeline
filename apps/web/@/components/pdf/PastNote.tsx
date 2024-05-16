import { useEffect, useRef, useState } from "react";
import { CircleArrowUp, Pencil, Trash2 } from 'lucide-react';
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

    const handleSubmit = () => {
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
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            if (inputRef.current) {
                editHighlight(highlight.id, inputRef.current.value)
            }
        }
    };
    return (
        <span
            className="z-50 absolute text-blue-500 text-xl font-bold group w-[300px] select-none"
            style={{
                left: `${rightmostArea.left + rightmostArea.width}%`,
                top: `${middleHeight ?? rightmostArea.top}%`,
                transform: 'translate(8px, -50%)',
            }}
        >
            <div className="relative">
                <span className="bg-white select-none">¶</span>
                <div className="hidden group-hover:block absolute left-4 top-0">
                    {/* <button
                        className="text-blue-500 hover:text-blue-700 p-0.5 rounded bg-white select-none"
                        onClick={handleEdit}
                    >
                        <Pencil className="cursor-pointer" size={16} />
                    </button> */}
                    <button
                        className="text-blue-500 hover:text-blue-700 p-0.5 rounded bg-white select-none"
                        onClick={handleTrash}
                    >
                        <Trash2 className="cursor-pointer" size={16} />
                    </button>
                </div>
                <div className="hidden group-hover:block absolute bg-white">
                    <Textarea
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="sticky bottom-0 left-0 bg-white z-10">
                        <div className="flex justify-end">
                            <button
                                className="text-blue-500 hover:text-blue-700 font-semibold text-sm select-none"
                                onClick={handleReply}
                            >
                                Reply
                            </button>
                            <button
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-0.5 rounded select-none"
                                onClick={handleSubmit}
                            >
                                <CircleArrowUp className="cursor-pointer" size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </span>

    );
};