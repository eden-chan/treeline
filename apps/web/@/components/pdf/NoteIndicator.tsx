import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';

export const NoteIndicator = ({ note, rightmostArea }) => {
    const [isAsteriskHovered, setIsAsteriskHovered] = useState(false);
    const [isQuoteHovered, setIsQuoteHovered] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

    if (!rightmostArea) return null
    useEffect(() => {
        const handleMouseMove = (e) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);


    const isHovered = isAsteriskHovered || isQuoteHovered;

    return (
        <>
            <span
                className="z-50 absolute text-blue-500 text-xl font-bold"
                style={{
                    left: `${rightmostArea.left + rightmostArea.width}%`,
                    top: `${rightmostArea.top}%`,
                    transform: 'translate(8px, -50%)',
                }}
                onMouseEnter={() => setIsAsteriskHovered(true)}
                onMouseLeave={() => setIsAsteriskHovered(false)}
            >
                ¶
                {createPortal(
                    <span
                        className={`z-40 ${isHovered ? 'block' : 'hidden'} absolute bg-white text-black p-4 rounded shadow-lg text-sm break-all max-w-xs transition-opacity duration-200 overflow-visible`}
                        style={{
                            left: `${cursorPosition.x - 10}px `,
                            top: `${cursorPosition.y}px`,
                            transform: 'translateY(-50%)',
                            width: '100%',

                        }}
                        onMouseEnter={() => setIsQuoteHovered(true)}
                        onMouseLeave={() => setTimeout(() => setIsQuoteHovered(false), 2000)}
                    >
                        {note.quote}
                    </span>,
                    document.body
                )}
            </span>
        </>
    );
};