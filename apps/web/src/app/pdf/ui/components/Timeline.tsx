"use client";

import { Suspense, useState } from "react";
import { memo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import { PaperCard } from "@src/components/paper-card";
import { useRouter } from "next/navigation";
import { AnnotatedPdfWithRelations } from "@src/lib/types";

import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlignJustify, LayoutGrid } from "lucide-react";
import { AnnotatedPdf, ParsedPaper } from "@prisma/client";

export type AnnotatedPdfWithRelationsWithTimestamp =
	AnnotatedPdfWithRelations & {
		timeAgoCalculation: string;
	};

const ExploreGalleryView = ({ articles }: { articles: ParsedPaper[] }) => {
	const router = useRouter();

	return (
		<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{articles.length > 0 ? (
				articles.map((article, index) => {
					return (
						<PaperCard
							key={index}
							description={article.abstract}
							timeAgoCalculation={calculateTimeAgo(article.updated)} // set time
							title={article.title}
							highlightCount={1}
							category={article.primary_category}
							onClick={() => {
								const pdfUrl = article.source;
								router.push(`/pdf?url=${pdfUrl}`);
							}}
						/>
					);
				})
			) : (
				<div className="w-full" />
			)}
		</div>
	);
};

const ExploreListView = ({ articles }: { articles: ParsedPaper[] }) => {
	const router = useRouter();

	return (
		<div>
			{articles.map((article, index) => {
				return (
					<article
						key={index}
						className={`mb-6 hover:cursor-pointer`}
						onClick={() => {
							const pdfUrl = article.source;
							router.push(`/pdf?url=${pdfUrl}`);
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
		articles: AnnotatedPdf[];
		parsedPapers: ParsedPaper[];
	}) => {
		// const memoizedArticles: AnnotatedPdfWithRelationsWithTimestamp[] = useMemo(
		// 	() =>
		// 		articles.map((article) => {
		// 			const timestamp = article.highlights[0]?.node?.timestamp;
		// 			const timeAgoCalculation = calculateTimeAgo(
		// 				timestamp ? new Date(timestamp) : new Date(),
		// 			);
		// 			return { ...article, timeAgoCalculation };
		// 		}),
		// 	[articles],
		// );

		const [view, setView] = useState("galleryView");

		return (
			<Tabs
				defaultValue="explore"
				className="lg:max-w-7xl w-full px-4 lg:px-8 mx-auto mb-4 lg:mb-10"
			>
				<TabsList className="w-full flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<TabsTrigger value="explore"> Explore </TabsTrigger>
						{/* <TabsTrigger value="favorites"> Favorites </TabsTrigger> */}
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
				<TabsContent value="explore">
					<Suspense fallback={<h1>🌀 Loading...</h1>}>
						{view === "galleryView" ? (
							<ExploreGalleryView articles={parsedPapers} />
						) : (
							<ExploreListView articles={parsedPapers} />
						)}
					</Suspense>
				</TabsContent>
				{/* <TabsContent value="favorites">
					<Suspense fallback={<h1>🌀 Loading...</h1>}>
						{view === "galleryView" ? (
							<ExploreGalleryView articles={parsedPapers} />
						) : (
							<ExploreListView articles={parsedPapers} />
						)}
					</Suspense>
				</TabsContent> */}
			</Tabs>
		);
	},
);

export default Timeline;
