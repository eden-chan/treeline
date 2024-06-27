"use client";

import { Suspense, useState } from "react";
import { memo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import { useRouter } from "next/navigation";
import { Source } from '@prisma/client';

import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlignJustify, LayoutGrid } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PaperCardProps = {
	source: Source;
	onClick: () => void;
};

const PaperCard = ({ source, onClick }: PaperCardProps) => (
	<Card
		className="flex flex-col min-h-[300px] hover:shadow-xl transition duration-200 cursor-pointer"
		onClick={onClick}
	>
		<CardHeader>
			<CardTitle>{source.title}</CardTitle>
		</CardHeader>
		<CardContent className="flex-grow">
			<p className="line-clamp-4">{source.description}</p>
		</CardContent>
		<CardContent className="text-sm text-muted-foreground">
			<p>Updated {calculateTimeAgo(source.uploadedAt)}</p>
		</CardContent>
	</Card>
);

const ExploreGalleryView = ({ sources }: { sources: Source[] }) => {
	const router = useRouter();

	return (
		<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{sources.map((source) => (
				<PaperCard
					key={source.id}
					source={source}
					onClick={() => router.push(`/pdf?url=${source.source}`)}
				/>
			))}
		</div>
	);
};

const ExploreListView = ({ sources }: { sources: Source[] }) => {
	const router = useRouter();

	return (
		<div>
			{sources.map((source) => (
				<article
					key={source.id}
					className="mb-6 hover:cursor-pointer"
					onClick={() => router.push(`/pdf?url=${source.source}`)}
				>
					<h2 className="text-xl font-semibold mb-1">{source.title}</h2>
					<p className="text-gray-600 mb-2">{source.description}</p>
					<p className="text-gray-400 text-sm">
						{calculateTimeAgo(source.uploadedAt)}
					</p>
				</article>
			))}
		</div>
	);
};

const Timeline = memo(({ sources }: { sources: Source[] }) => {
	const [view, setView] = useState("galleryView");

	return (
		<Tabs
			defaultValue="explore"
			className="lg:max-w-7xl w-full px-4 lg:px-8 mx-auto mb-4 lg:mb-10"
		>
			<TabsList className="w-full flex items-center justify-between">
				<TabsTrigger value="explore">Explore</TabsTrigger>
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
			<TabsContent value="explore">
				<Suspense fallback={<h1>🌀 Loading...</h1>}>
					{view === "galleryView" ? (
						<ExploreGalleryView sources={sources} />
					) : (
						<ExploreListView sources={sources} />
					)}
				</Suspense>
			</TabsContent>
		</Tabs>
	);
});

export default Timeline;