'use client'
import { useState } from 'react'

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from '@/components/ui/use-toast'

const DEFAULT_PDF_URL = "https://arxiv.org/pdf/1706.03762.pdf"
const arxivLinkPattern = /^https?:\/\/(?:www\.)?arxiv\.org\/pdf\/[0-9]+\.[0-9]+(?:v[0-9]+)?\.pdf$/

export function ImportButton() {
    const [link, setLink] = useState(DEFAULT_PDF_URL)
    const router = useRouter()

    const handleEnterOrSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!arxivLinkPattern.test(link)) {
            toast({
                title: "Error",
                description: `Please add a valid arXiv link. For example: ${DEFAULT_PDF_URL}`,
                variant: 'destructive'
            })
            return;
        }
        try {

            const response = await fetch('/api/preprocess', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pdf_url: link }),
            });
            console.log('response', response)
            router.push(`/pdf?url=${link}`)
        } catch (error) {
            console.error("Failed to fetch: ", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Import</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Import PDF</DialogTitle>
                    <DialogDescription>
                        Import a PDF to your library
                    </DialogDescription>
                </DialogHeader>
                <form className="flex items-center space-x-2" onSubmit={handleEnterOrSubmit}>
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    {/* <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button> */}
                </form>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                            <Button type="button" onClick={handleEnterOrSubmit}>
                                Submit
                            </Button>
                        </>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
