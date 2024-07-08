// components/MiniChatWindow.tsx
'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'

interface MiniChatWindowProps {
    selectedText: string;
}

export function MiniChatWindow({ selectedText }: MiniChatWindowProps) {
    const [action, setAction] = useState<'define' | 'ask' | 'explain' | null>(null)
    const { messages, input, handleInputChange, handleSubmit } = useChat()

    const getPrompt = () => {
        switch (action) {
            case 'define':
                return `Concisely define the following term and why it is important: ${selectedText}`
            case 'ask':
                return `Here is the context: ${selectedText}\n\nQuestion: ${input}`
            case 'explain':
                return `Concisely explain why this is important: ${selectedText}`
            default:
                return ''
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (action) {
            handleSubmit(e, { prompt: getPrompt() })
        }
    }

    return (
        <div className="w-64 bg-white rounded-md shadow-xl z-20 text-xs p-2">
            <div className="space-y-2 mb-4">
                <button onClick={() => setAction('define')} className="w-full px-2 py-1 bg-blue-500 text-white rounded text-left">
                    Define
                </button>
                <button onClick={() => setAction('ask')} className="w-full px-2 py-1 bg-blue-500 text-white rounded text-left">
                    Ask
                </button>
                <button onClick={() => setAction('explain')} className="w-full px-2 py-1 bg-blue-500 text-white rounded text-left">
                    Explain
                </button>
            </div>
            <div className="h-40 overflow-y-auto mb-4">
                {messages.map(m => (
                    <div key={m.id} className={`mb-2 ${m.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
                        <strong>{m.role === 'user' ? 'You: ' : 'AI: '}</strong>
                        {m.content}
                    </div>
                ))}
            </div>
            <form onSubmit={onSubmit}>
                <input
                    className="w-full border rounded p-2"
                    value={input}
                    onChange={handleInputChange}
                    placeholder={action === 'ask' ? "Ask a question..." : ""}
                />
            </form>
        </div>
    )
}
