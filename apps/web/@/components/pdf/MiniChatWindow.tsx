'use client'

import React, { useLayoutEffect, useState, useRef } from 'react';
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { createPortal } from 'react-dom';

type Props = {
    selectedText: string;
    cursorPosition: { x: number; y: number };
    saveHighlight: () => void;
}

export function MiniChatWindow({ selectedText, cursorPosition, saveHighlight }: Props) {
    const { messages, input, handleInputChange, handleSubmit, append } = useChat()
    const portalRef = useRef<HTMLDivElement | null>(null);

    const [, forceUpdate] = useState({});

    useLayoutEffect(() => {
        // Create a new div element for the portal
        const el = document.createElement('div');
        document.body.appendChild(el);
        portalRef.current = el;

        // Force a re-render after a short delay
        const timer = setTimeout(() => forceUpdate({}), 0);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            if (portalRef.current) {
                document.body.removeChild(portalRef.current);
            }
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

    const sendPrompt = (action: 'define' | 'explain' | 'ask') => {
        let prompt = ''
        if (action === 'define') {
            prompt = `Concisely define the following term and why it is important: ${selectedText}`
        } else if (action === 'explain') {
            prompt = `Concisely explain why this is important: ${selectedText}`
        } else if (action === 'ask') {
            prompt = `Here is the context: ${selectedText}\n\nQuestion: ${input}`
        }
        append({ role: 'user', content: prompt })
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleSubmit(e, { options: { body: { prompt: `Here is the context: ${selectedText}\n\nQuestion: ${input}` } } })
    }

    if (!portalRef.current) return null;
    return <>

        {createPortal(
            <div
                className="w-96 bg-white rounded-md shadow-xl z-20 text-base p-4 absolute"
                style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px`, position: 'absolute' }}
            >
                <div className="flex space-x-1 mb-2">
                    <Button onClick={saveHighlight} variant="outline" size="sm">Save Highlight</Button>
                    <Button onClick={() => sendPrompt('define')} variant="outline" size="sm">Define</Button>
                    <Button onClick={() => sendPrompt('explain')} variant="outline" size="sm">Explain</Button>
                    <Button onClick={() => sendPrompt('ask')} variant="outline" size="sm">Ask</Button>
                </div>
                <div className="max-h-40 overflow-y-auto mb-2 text-gray-700">
                    {messages.map(m => (
                        <div key={m.id} className="mb-1">
                            <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
                            {m.content}
                        </div>
                    ))}
                </div>
                <form onSubmit={onSubmit} className="flex">
                    <input
                        className="flex-grow border rounded p-1 text-xs"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question..."
                    />
                    <Button type="submit" variant="outline" size="sm" className="ml-1">Send</Button>
                </form>
            </div>,
            portalRef.current
        )}
    </>
}