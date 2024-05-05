"use client";

import { Suspense, useState } from "react";
import { useMemo, memo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import { PaperCard } from "@src/components/paper-card";
import { useRouter } from "next/navigation";
import { AnnotatedPdfWithRelations } from "@src/lib/types";

import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import {
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectContent,
	Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlignJustify, LayoutGrid } from "lucide-react";
import { ParsedPapers } from "@prisma/client";

export type AnnotatedPdfWithRelationsWithTimestamp =
	AnnotatedPdfWithRelations & {
		timeAgoCalculation: string;
	};

const GalleryView = ({
	articles,
}: {
	articles: AnnotatedPdfWithRelationsWithTimestamp[];
}) => {
	const router = useRouter();
	const [highlightedCardId, setHighlightedCardId] = useState("");

	const handleClick = (cardId: string) => {
		setHighlightedCardId(cardId);
	};

	return (
		<div
			className="grid grid-cols-1 
        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
        gap-4"
		>
			{articles.map((article, index) => {
				const firstHighlight = article.highlights?.[0]?.content || "";
				return (
					<PaperCard
						key={index}
						description={firstHighlight}
						timeAgoCalculation={article.timeAgoCalculation} // Fixed typo from timeAgoCalculation to timeAgoCalculations
						title={firstHighlight.slice(0, 50)}
						highlightCount={article.highlights?.length || 0}
						isHighlighted={highlightedCardId === firstHighlight}
						onClick={() => handleClick(firstHighlight)}
						onDoubleClick={() => {
							router.push(`/pdf?url=${article.source}`);
						}}
					/>
				);
			})}
		</div>
	);
};

const ListView = ({
	articles,
}: {
	articles: AnnotatedPdfWithRelationsWithTimestamp[];
}) => {
	const router = useRouter();
	const [highlightedCardId, setHighlightedCardId] = useState("");

	return (
		<div className="">
			{articles.map((article, index) => {
				const firstHighlight = article.highlights?.[0]?.content || "";
				return (
					<article
						key={index}
						className={`mb-6 hover:cursor-pointer ${highlightedCardId === article.id ? "outline outline-2 outline-primary" : ""}`}
						onClick={() => setHighlightedCardId(article.id)}
						onDoubleClick={() => {
							router.push(`/pdf?url=${article.source}`);
						}}
					>
						<h2 className="text-xl font-semibold mb-1">
							{firstHighlight.slice(0, 50)}{" "}
						</h2>
						<p className="text-gray-600 mb-2">
							{article.timeAgoCalculation} {article.highlights?.length || 0}{" "}
							highlights
						</p>
						<p className="text-gray-500">{firstHighlight}</p>
						<p className="text-gray-400 text-sm mt-2">{article.userId}</p>
					</article>
				);
			})}
		</div>
	);
};

const ExploreGalleryView = ({ articles }: { articles: ParsedPapers[] }) => {
	const router = useRouter();
	const [highlightedCardId, setHighlightedCardId] = useState("");

	const handleClick = (cardId: string) => {
		setHighlightedCardId(cardId);
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{articles.map((article, index) => {
				return (
					<PaperCard
						key={index}
						description={article.abstract}
						timeAgoCalculation={calculateTimeAgo(article.updated)} // set time
						title={article.title}
						highlightCount={1}
						category={article.primary_category}
						isHighlighted={highlightedCardId === article.title}
						onClick={() => handleClick(article.title)}
						onDoubleClick={() => {
							router.push(`/pdf?url=${article.source}`);
						}}
					/>
				);
			})}
		</div>
	);
};

const ExploreListView = ({ articles }: { articles: ParsedPapers[] }) => {
	const router = useRouter();
	const [highlightedCardId, setHighlightedCardId] = useState("");

	return (
		<div className="">
			{articles.map((article, index) => {
				return (
					<article
						key={index}
						className={`mb-6 hover:cursor-pointer ${highlightedCardId === article.title ? "outline outline-2 outline-primary" : ""}`}
						onClick={() => setHighlightedCardId(article.title)}
						onDoubleClick={() => {
							router.push(`/pdf?url=${article.source}`);
						}}
					>
						<h2 className="text-xl font-semibold mb-1">{article.title}</h2>
						<p className="text-gray-600 mb-2">{article.primary_category}</p>
						<p className="text-gray-500">{article.abstract}</p>
						<p className="text-gray-400 text-sm mt-2">
							{calculateTimeAgo(article.updated)}
						</p>
					</article>
				);
			})}
		</div>
	);
};

const Timeline = memo(
	({
		articles,
		parsedPapers,
	}: {
		articles: AnnotatedPdfWithRelations[];
		parsedPapers: ParsedPapers[];
	}) => {
		const memoizedArticles: AnnotatedPdfWithRelationsWithTimestamp[] = useMemo(
			() =>
				articles.map((article) => {
					const timestamp = article.highlights[0]?.node?.timestamp;
					const timeAgoCalculation = calculateTimeAgo(
						timestamp ? new Date(timestamp) : new Date(),
					);
					return { ...article, timeAgoCalculation };
				}),
			[articles],
		);

		const [view, setView] = useState("galleryView");

		return (
			<Tabs defaultValue="explore" className="lg:max-w-7xl mx-auto">
				<TabsList className="w-full flex items-center justify-between bg-white">
					<div className="flex items-center space-x-4">
						<TabsTrigger value="explore"> Explore </TabsTrigger>
						<TabsTrigger value="favorites"> Favorites </TabsTrigger>
						{/* <TabsTrigger value="recentlyViewed"> Recently viewed </TabsTrigger> */}
						{/**/}
						{/* <div className="flex items-center space-x-2"> */}
						{/* 	<Select> */}
						{/* 		<SelectTrigger id="organization" className="min-w-[200px]"> */}
						{/* 			<SelectValue placeholder="All organizations" /> */}
						{/* 		</SelectTrigger> */}
						{/* 		<SelectContent position="popper"> */}
						{/* 			<SelectItem value="org1">Organization 1</SelectItem> */}
						{/* 			<SelectItem value="org2">Organization 2</SelectItem> */}
						{/* 		</SelectContent> */}
						{/* 	</Select> */}
						{/**/}
						{/* 	<Select> */}
						{/* 		<SelectTrigger id="viewed"> */}
						{/* 			<SelectValue placeholder="Last viewed" /> */}
						{/* 		</SelectTrigger> */}
						{/* 		<SelectContent position="popper"> */}
						{/* 			<SelectItem value="today">Today</SelectItem> */}
						{/* 			<SelectItem value="yesterday">Yesterday</SelectItem> */}
						{/* 		</SelectContent> */}
						{/* 	</Select> */}
						{/* </div> */}
					</div>

					<div className="flex space-x-2">
						<Button
							variant="outline"
							disabled={view == "galleryView"}
							onClick={() => setView("galleryView")}
						>
							<LayoutGrid />
						</Button>
						<Button
							variant="outline"
							disabled={view == "listView"}
							onClick={() => setView("listView")}
						>
							<AlignJustify />
						</Button>
					</div>
				</TabsList>
				{/* <TabsContent value="recentlyViewed"> */}
				{/* 	<Suspense fallback={<h1>🌀 Loading...</h1>}> */}
				{/* 		{view === "galleryView" ? ( */}
				{/* 			<GalleryView articles={memoizedArticles} /> */}
				{/* 		) : ( */}
				{/* 			<ListView articles={memoizedArticles} /> */}
				{/* 		)} */}
				{/* 	</Suspense> */}
				{/* </TabsContent> */}
				<TabsContent value="favorites">
					<Suspense fallback={<h1>🌀 Loading...</h1>}>
						{view === "galleryView" ? (
							<ExploreGalleryView articles={parsedPapers} />
						) : (
							<ExploreListView articles={parsedPapers} />
						)}
					</Suspense>
				</TabsContent>
				<TabsContent value="explore">
					<Suspense fallback={<h1>🌀 Loading...</h1>}>
						{view === "galleryView" ? (
							<ExploreGalleryView articles={parsedPapers} />
						) : (
							<ExploreListView articles={parsedPapers} />
						)}
					</Suspense>
				</TabsContent>
			</Tabs>
		);
	},
);

export default Timeline;
