'use client'
import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import { createSourceAction } from "@src/app/actions";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState } from "react";

const DEFAULT_PDF_URL = "https://arxiv.org/pdf/1706.03762";

const ARXIV_PREFIX = "https://arxiv.org";
export default function SearchCta() {
	const router = useRouter();
	const [sourceUrl, setSourceUrl] = useState(DEFAULT_PDF_URL);

	const handleCreateSource = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		let pdfUrl = sourceUrl;
		try {
			if (sourceUrl.startsWith(ARXIV_PREFIX)) {
				// replace /abs/ sourceUrl with the /pdf/ url
				pdfUrl = sourceUrl.replace("/abs/", "/pdf/");
			}
			const result = await createSourceAction(pdfUrl);
			if (result?.sourceAlreadyExists) {
				toast({
					title: `Sapling ${result?.title} already exists`, description: result?.description, action: <ToastAction altText="View sapling">
						<Link href={`/pdf/?url=${result.source}`}>
							View sapling
						</Link>
					</ToastAction>
				})
			} else {
				toast({ title: "Sapling planted successfully", description: "Your research is now being cultivated" })
			}
			router.refresh();
			setSourceUrl('');
		} catch (error) {
			console.error("Failed to create source:", error);
			toast({
				title: "Failed to plant sapling",
				description: "See console for details",
				action: <ToastAction altText="Try again">Try again</ToastAction>,
			});
		}
	};

	return (
		<section className="flex grow flex-col items-center justify-center bg-gradient-to-br from-green-700 to-green-500 p-4">
			<div className="mx-auto w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight text-white sm:text-4xl">
						Cultivate knowledge, harvest insights
					</h1>
					<p className="mt-3 text-gray-200 sm:text-lg">
						Plant your research, let ideas flourish, and see connections bloom.
					</p>
				</div>
				<form
					className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800"
					onSubmit={handleCreateSource}
				>
					<div className="space-y-6">
						<div>
							<label
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
								htmlFor="research-link"
							>
								Enter a PDF URL (e.g., arXiv paper)
							</label>
							<div className="mt-3">
								<input
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] focus:ring-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-[#6366F1] dark:focus:ring-[#6366F1] px-4 py-3"
									id="research-topic"
									name="research-topic"
									placeholder={DEFAULT_PDF_URL}
									required
									type="url"
									value={sourceUrl}
									onChange={(e) => setSourceUrl(e.target.value)}
								/>
							</div>
						</div>
					</div>
					<div className="mt-8">
						<button
							className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#6366F1] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] dark:focus:ring-[#6366F1]"
							type="submit"
						>
							Plant Tree
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}