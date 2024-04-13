'use client'
import { useState } from 'react'
import { Copy } from "lucide-react"
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

const DEFAULT_PDF_URL = "https://arxiv.org/pdf/1706.03762.pdf"
export function ImportButton() {
    const [link, setLink] = useState(DEFAULT_PDF_URL)
    const router = useRouter()

    const handleEnterOrSubmit = (e) => {
        e.preventDefault()
        router.push(`/pdf?url=${link}`)
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
                            readOnly
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
