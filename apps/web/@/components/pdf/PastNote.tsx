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
    editHighlight: (highlightId: string, text: string) => void;
    deleteHighlight: (highlightId: string) => void;
}
export const PastNote = ({ highlight, rightmostArea, editHighlight, deleteHighlight }: Props) => {
    if (!rightmostArea) return null;

    const [isAsteriskHovered, setIsAsteriskHovered] = useState(false);
    const [isQuoteHovered, setIsQuoteHovered] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    const isHovered = isAsteriskHovered || isQuoteHovered;
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = highlight.content;
        }
    }, [highlight.content]);

    const handleAsteriskHover = () => {
        setIsAsteriskHovered(true);
        setInitialPosition(cursorPosition);
    };

    const handleAsteriskLeave = () => {
        setIsAsteriskHovered(false);
    };

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
                className="z-50 absolute text-blue-500 text-xl font-bold"
                style={{
                    left: `${rightmostArea.left + rightmostArea.width}%`,
                    top: `${rightmostArea.top}%`,
                    transform: 'translate(8px, -50%)',
                }}
                onMouseEnter={handleAsteriskHover}
                onMouseLeave={handleAsteriskLeave}
            >
                ¶
                {createPortal(
                    <span
                        className={`z-40 ${isHovered ? 'block' : 'hidden'} absolute bg-white text-black p-1 rounded shadow-lg text-sm break-all max-w-xs transition-opacity duration-200 overflow-visible flex flex-col `}
                        style={{
                            left: `${initialPosition.x - 20}px`,
                            top: `${initialPosition.y + 40}px`,
                            transform: 'translate(16px, -50%)',
                            width: '200px',
                            minHeight: '150px',
                            flexGrow: '1', // Edit: will this flex grow
                        }}
                        onMouseEnter={() => setIsQuoteHovered(true)}
                        onMouseLeave={() => setIsQuoteHovered(false)}
                    >
                        <div className="flex flex-col h-full group">
                            <div className="sticky top-0 left-0 bg-white z-10 py-2">
                                <div className="flex justify-start items-center">
                                    <div className="flex items-center space-x-1">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                            onClick={handleEdit}
                                        >
                                            <Pencil className="m-1 cursor-pointer" size={12}
                                            />
                                        </button>
                                        <button
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                            onClick={handleTrash}
                                        >
                                            <Trash2 className="m-1 cursor-pointer" size={12} />
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
                        </div>
                    </span>,
                    document.body
                )}
            </span>
        </>
    );
};