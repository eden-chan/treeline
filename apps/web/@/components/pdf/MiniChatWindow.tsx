'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'

interface MiniChatWindowProps {
    selectedText: string;
    position: { top: number; left: number };
}

export function MiniChatWindow({ selectedText, position }: MiniChatWindowProps) {
    const { messages, input, handleInputChange, handleSubmit, append } = useChat()

    const sendPrompt = (action: 'define' | 'explain' | 'ask') => {
        let prompt = ''
        if (action === 'define') {
            prompt = `Concisely define the following term and why it is important: ${selectedText}`
        } else if (action === 'explain') {
            prompt = `Concisely explain why this is important: ${selectedText}`
        } else if (action === 'ask') {
            prompt = `Here is the context: ${selectedText}\n\nQuestion: ${input}`
        }
        // handleSubmit(undefined, { options: { body: { prompt } } })
        append({ role: 'user', content: prompt })
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        handleSubmit(e, { options: { body: { prompt: `Here is the context: ${selectedText}\n\nQuestion: ${input}` } } })
    }

    return (
        <div
            className="w-96 bg-white rounded-md shadow-xl z-20 text-base p-4 absolute"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
            <div className="flex space-x-1 mb-2">
                <Button onClick={() => sendPrompt('define')} variant="outline" size="sm">Define</Button>
                <Button onClick={() => sendPrompt('explain')} variant="outline" size="sm">Explain</Button>
                <Button onClick={() => sendPrompt('ask')} variant="outline" size="sm">Ask</Button>
            </div>
            <div className="h-32 overflow-y-auto mb-2 text-gray-700">
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
        </div>
    )
}