import { useState } from "react";
import { createPortal } from 'react-dom';


export const NoteIndicator = ({ note, rightmostArea }) => {
    const [isAsteriskHovered, setIsAsteriskHovered] = useState(false);
    const [isQuoteHovered, setIsQuoteHovered] = useState(false);

    if (!rightmostArea) return null;

    const isHovered = isAsteriskHovered || isQuoteHovered;

    return (
        <>
            <span
                className={`z-50 absolute text-blue-500 text-xl font-bold`}
                style={{
                    left: `${rightmostArea.left + rightmostArea.width}%`,
                    top: `${rightmostArea.top}%`,
                    transform: 'translate(8px, -50%)',
                }}
                onMouseEnter={() => setIsAsteriskHovered(true)}
                onMouseLeave={() => setIsAsteriskHovered(false)}
            >
                ¶
            </span>
            {createPortal(
                <span
                    className={`z-40 ${isHovered ? 'block' : 'hidden'
                        } absolute bg-white text-black p-4 rounded shadow-lg text-sm break-all max-w-xs transition-opacity duration-200 overflow-visible`}
                    style={{
                        left: `calc(${rightmostArea.left + rightmostArea.width}% - 308px)`,
                        top: `${rightmostArea.top}%`,
                        transform: 'translateY(-50%)',
                        width: '300px',
                    }}
                    onMouseEnter={() => setIsQuoteHovered(true)}
                    onMouseLeave={() => setIsQuoteHovered(false)}
                >
                    {note.quote}
                </span>,
                document.body
            )}
        </>
    );
};