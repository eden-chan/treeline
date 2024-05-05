'use client';

import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

const arxivLinkPattern = /^https?:\/\/(?:www\.)?arxiv\.org\/pdf\/[0-9]+\.[0-9]+(?:v[0-9]+)?\.pdf$/;
const DEFAULT_PDF_URL = 'https://arxiv.org/pdf/1706.03762.pdf';

export default function SearchCta() {
	const router = useRouter();

	async function handleSubmit(formData: FormData) {
		const link = formData.get('research-topic') as string;

		if (!arxivLinkPattern.test(link)) {
			// Handle invalid input, e.g., show an error message
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

			if (response.ok) {
				router.push(`/pdf?url=${link}`);
			} else {
				// Handle error response
				toast({
					title: "Error",
					description: `Oops! Please try again`,
					variant: 'destructive'
				})

			}
		} catch (error) {
			console.error('Failed to fetch: ', error);
		}
	}


	return (
		<section className="flex grow flex-col items-center justify-center bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]">
			<div className="mx-auto w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
						Accelerate Your Learning
					</h1>
					<p className="mt-3 text-gray-200 sm:text-lg">
						Discover what you're curious about and uncover the gaps in your knowledge.
					</p>
				</div>
				<form
					className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800"
					action={handleSubmit}
				>
					<div className="space-y-6">
						<div>
							<label
								className="block text-sm font-medium text-gray-700 dark:text-gray-300"
								htmlFor="research-link"
							>
								What are you curious about?
							</label>
							<div className="mt-3">
								<input
									className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#6366F1] focus:ring-[#6366F1] focus:ring-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:focus:border-[#6366F1] dark:focus:ring-[#6366F1] px-4 py-3"
									id="research-topic"
									name="research-topic"
									placeholder={DEFAULT_PDF_URL}
									required
									type="text"
								/>
							</div>
						</div>
					</div>
					<div className="mt-8">
						<button
							className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#6366F1] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 dark:bg-[#6366F1] dark:hover:bg-[#4F46E5] dark:focus:ring-[#6366F1]"
							type="submit"
						>
							Discover Personalized Learning
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}