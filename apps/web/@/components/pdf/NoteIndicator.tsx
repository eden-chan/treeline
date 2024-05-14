import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";

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
export const NoteIndicator = ({ highlight, rightmostArea, editHighlight, deleteHighlight }: Props) => {
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
    const [inputText, setInputText] = useState(highlight.content);

    const handleAsteriskHover = () => {
        setIsAsteriskHovered(true);
        setInitialPosition(cursorPosition);
    };

    const handleAsteriskLeave = () => {
        setIsAsteriskHovered(false);
    };

    const handleEdit = () => {
        editHighlight(highlight.id, inputText)
        // Dummy function for handling edit
    };

    const handleTrash = () => {
        // Dummy function for handling trash
        deleteHighlight(highlight.id)

    };

    const handleReply = () => {
        // Dummy function for handling comment
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleEdit();

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
                        className={`z-40 ${isHovered ? 'block' : 'hidden'} absolute bg-white text-black p-2 rounded shadow-lg text-sm break-all max-w-xs transition-opacity duration-200 overflow-visible flex flex-col`}
                        style={{
                            left: `${initialPosition.x - 20}px`,
                            top: `${initialPosition.y + 40}px`,
                            transform: 'translate(16px, -50%)',
                            width: '300px',
                            height: '200px',
                            overflowY: 'scroll',
                        }}
                        onMouseEnter={() => setIsQuoteHovered(true)}
                        onMouseLeave={() => setIsQuoteHovered(false)}
                    >
                        <div className="flex flex-col h-full">
                            <div className="sticky top-0 left-0 bg-white z-10 py-2">
                                <div className="flex justify-start items-center">
                                    <div className="flex items-center space-x-1">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                            onClick={handleEdit}
                                        >
                                            <Pencil className="m-1 cursor-pointer" size={16}
                                            />
                                        </button>
                                        <button
                                            className="text-blue-500 hover:text-blue-700 p-1"
                                            onClick={handleTrash}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Input
                                className="text-white bg-slate-600"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                            ></Input>
                            <span className="overflow-auto h-full">{highlight.quote}</span>
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