'use client'

import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'

export function SubmitButton({ title = 'Submit' }: { title?: string }) {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" disabled={pending}>
            {title}
        </Button>
    )
}