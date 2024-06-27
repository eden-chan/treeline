"use client";

import { Suspense, useState } from "react";
import { memo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import { useRouter } from "next/navigation";
import { Source, SourceGroup } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlignJustify, LayoutGrid, Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createSourceGroupAction, updateSourceAction, updateSourceGroupAction, deleteSourceAction, deleteSourceGroupAction, removeSourceFromGroupAction, addSourceToGroupAction } from '@src/app/actions';
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
// Import server actions


interface PaperCardProps {
	source: Source;
	isSelected: boolean;
	onSelect: (id: string) => void;
}

const PaperCard = ({ source, isSelected, onSelect }: PaperCardProps) => (
	<Card
		className={`flex flex-col min-h-[300px] hover:shadow-xl transition duration-200 cursor-pointer ${isSelected ? 'border-2 border-blue-500' : ''
			}`}
		onClick={(e) => {
			e.stopPropagation();
			onSelect(source.id);
		}}
	>
		<CardHeader>
			<CardTitle>{source.title}</CardTitle>
		</CardHeader>
		<CardContent className="flex-grow">
			<p className="line-clamp-4">{source.description}</p>
		</CardContent>
		<CardContent className="text-sm text-muted-foreground">
			<p>Updated {calculateTimeAgo(source.uploadedAt)}</p>
			<Link href={`/pdf?url=${source.source}`} className="text-blue-500 hover:underline mt-2 block">
				View PDF
			</Link>
		</CardContent>
	</Card>
);


const UpdateSourceDialog = ({ source, onClose }: { source: Source, onClose: () => void }) => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update Source</DialogTitle>
			</DialogHeader>
			<form action={async (formData: FormData) => {
				const title = formData.get('title') as string;
				const description = formData.get('description') as string;
				await updateSourceAction(source.id, title, description);
				onClose();
			}}>
				<Input name="title" placeholder="Title" defaultValue={source.title} required />
				<Textarea name="description" placeholder="Description" defaultValue={source.description} required />
				<Button type="submit">Update Source</Button>
			</form>
		</DialogContent>
	);
};

const UpdateGroupDialog = ({ group, onClose }: { group: SourceGroup, onClose: () => void }) => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update Group</DialogTitle>
			</DialogHeader>
			<form action={async (formData: FormData) => {
				const title = formData.get('title') as string;
				const description = formData.get('description') as string;
				await updateSourceGroupAction(group.id, title, description);
				onClose();
			}}>
				<Input name="title" placeholder="Title" defaultValue={group.title} required />
				<Textarea name="description" placeholder="Description" defaultValue={group.description} required />
				<Button type="submit">Update Group</Button>
			</form>
		</DialogContent>
	);
};

const CreateGroupDialog = ({ selectedSources, onClose }: { selectedSources: string[], onClose: () => void }) => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Create New Group</DialogTitle>
			</DialogHeader>
			<form action={async (formData: FormData) => {
				const title = formData.get('title') as string;
				const description = formData.get('description') as string;
				await createSourceGroupAction(title, description, selectedSources);
				onClose();
			}}>
				<Input name="title" placeholder="Group Title" required />
				<Textarea name="description" placeholder="Group Description" required />
				<Button type="submit">Create Group</Button>
			</form>
		</DialogContent>
	);
};

const ExploreView = ({ sources, sourceGroups }: { sources: Source[], sourceGroups: SourceGroup[] }) => {
	const router = useRouter();
	const [selectedSources, setSelectedSources] = useState<string[]>([]);
	const [isCreatingGroup, setIsCreatingGroup] = useState(false);
	const [updatingSource, setUpdatingSource] = useState<Source | null>(null);
	const [updatingGroup, setUpdatingGroup] = useState<SourceGroup | null>(null);
	const [view, setView] = useState("galleryView");

	const handleSourceSelect = (id: string) => {
		setSelectedSources(prev =>
			prev.includes(id) ? prev.filter(sourceId => sourceId !== id) : [...prev, id]
		);
	};

	const handleSourceClick = (url: string) => {
		router.push(`/pdf?url=${url}`);
	};

	const handleDeleteSource = async (id: string) => {
		if (confirm("Are you sure you want to delete this source?")) {
			await deleteSourceAction(id);
			router.refresh();
		}
	};

	const handleDeleteGroup = async (id: string) => {
		if (confirm("Are you sure you want to delete this group?")) {
			await deleteSourceGroupAction(id);
			router.refresh();
		}
	};

	const handleRemoveSourceFromGroup = async (sourceId: string, groupId: string) => {
		await removeSourceFromGroupAction(sourceId, groupId);
		router.refresh();
	};

	const handleAddSourceToGroup = async (sourceId: string, groupId: string) => {
		await addSourceToGroupAction(sourceId, groupId);
		router.refresh();
	};


	const renderSources = () => {
		if (view === "galleryView") {
			return (
				<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{sources.map((source) => (
						<div key={source.id} onClick={() => handleSourceClick(source.source)}>
							<PaperCard
								source={source}
								isSelected={selectedSources.includes(source.id)}
								onSelect={handleSourceSelect}
							/>
							<div className="mt-2 flex justify-end space-x-2">
								<Button onClick={(e) => {
									e.stopPropagation();
									setUpdatingSource(source);
								}}><Edit size={16} /></Button>
								<Button onClick={(e) => {
									e.stopPropagation();
									handleDeleteSource(source.id);
								}}><Trash size={16} /></Button>
							</div>
						</div>
					))}
				</div>
			);
		} else {
			return (
				<div>
					{sources.map((source) => (
						<article
							key={source.id}
							className={`mb-6 hover:cursor-pointer ${selectedSources.includes(source.id) ? 'border-2 border-blue-500' : ''
								}`}
							onClick={() => handleSourceClick(source.source)}
						>
							<h2 className="text-xl font-semibold mb-1">{source.title}</h2>
							<p className="text-gray-600 mb-2">{source.description}</p>
							<p className="text-gray-400 text-sm">
								{calculateTimeAgo(source.uploadedAt)}
							</p>
							<div className="mt-2 flex space-x-2">
								<Button onClick={(e) => {
									e.stopPropagation();
									handleSourceSelect(source.id);
								}}>
									{selectedSources.includes(source.id) ? 'Deselect' : 'Select'}
								</Button>
								<Button onClick={(e) => {
									e.stopPropagation();
									setUpdatingSource(source);
								}}><Edit size={16} /></Button>
								<Button onClick={(e) => {
									e.stopPropagation();
									handleDeleteSource(source.id);
								}}><Trash size={16} /></Button>
								<Link href={`/pdf?url=${source.source}`} className="text-blue-500 hover:underline">
									View PDF
								</Link>
							</div>
						</article>
					))}
				</div>
			);
		}
	};

	const renderGroups = () => {
		const [selectedSourcesForGroup, setSelectedSourcesForGroup] = useState<Record<string, string[]>>({});

		const handleSourceSelect = (groupId: string, sourceId: string) => {
			setSelectedSourcesForGroup(prev => {
				const currentSelected = prev[groupId] || [];
				if (currentSelected.includes(sourceId)) {
					return { ...prev, [groupId]: currentSelected.filter(id => id !== sourceId) };
				} else {
					return { ...prev, [groupId]: [...currentSelected, sourceId] };
				}
			});
		};

		const handleAddSourcesToGroup = async (groupId: string) => {
			const sourcesToAdd = selectedSourcesForGroup[groupId] || [];
			for (const sourceId of sourcesToAdd) {
				await handleAddSourceToGroup(sourceId, groupId);
			}
			setSelectedSourcesForGroup(prev => ({ ...prev, [groupId]: [] }));
		};

		return (
			<div>
				{sourceGroups.map((group) => (
					<div key={group.id} className="mb-6 p-4 border rounded">
						<h2 className="text-xl font-semibold mb-2">{group.title}</h2>
						<p className="text-gray-600 mb-2">{group.description}</p>
						<div className="flex space-x-2 mb-4">
							<Button onClick={() => setUpdatingGroup(group)}><Edit size={16} /></Button>
							<Button onClick={() => handleDeleteGroup(group.id)}><Trash size={16} /></Button>
						</div>
						<h3 className="text-lg font-medium mb-2">Sources in this group:</h3>
						<ul>
							{sources.filter(source => group.sourceIDs.includes(source.id)).map((source) => (
								<li key={source.id} className="flex justify-between items-center mb-2">
									<span>{source.title}</span>
									<Button onClick={() => handleRemoveSourceFromGroup(source.id, group.id)}>Remove</Button>
								</li>
							))}
						</ul>
						<div className="mt-4">
							<h4 className="text-md font-medium mb-2">Add sources to group:</h4>
							<div className="max-h-40 overflow-y-auto border rounded p-2">
								{sources.filter(source => !group.sourceIDs.includes(source.id)).map((source) => (
									<div key={source.id} className="flex items-center space-x-2 mb-2">
										<Checkbox
											id={`${group.id}-${source.id}`}
											checked={(selectedSourcesForGroup[group.id] || []).includes(source.id)}
											onCheckedChange={() => handleSourceSelect(group.id, source.id)}
										/>
										<label htmlFor={`${group.id}-${source.id}`}>{source.title}</label>
									</div>
								))}
							</div>
							<Button
								className="mt-2"
								onClick={() => handleAddSourcesToGroup(group.id)}
								disabled={!selectedSourcesForGroup[group.id] || selectedSourcesForGroup?.[group.id]?.length === 0}
							>
								Add Selected Sources
							</Button>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		<>
			<div className="mb-4 flex justify-between">
				<Button
					onClick={() => setIsCreatingGroup(true)}
					disabled={selectedSources.length === 0}
				>
					<Plus className="mr-2 h-4 w-4" /> Create Group
				</Button>
				<div className="flex space-x-2">
					<Button
						variant="outline"
						disabled={view === "galleryView"}
						onClick={() => setView("galleryView")}
					>
						<LayoutGrid />
					</Button>
					<Button
						variant="outline"
						disabled={view === "listView"}
						onClick={() => setView("listView")}
					>
						<AlignJustify />
					</Button>
				</div>
			</div>
			{renderSources()}
			<h2 className="text-2xl font-bold mt-8 mb-4">Source Groups</h2>
			{renderGroups()}
			<Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
				<CreateGroupDialog
					selectedSources={selectedSources}
					onClose={() => {
						setIsCreatingGroup(false);
						setSelectedSources([]);
					}}
				/>
			</Dialog>
			<Dialog open={!!updatingSource} onOpenChange={() => setUpdatingSource(null)}>
				{updatingSource && (
					<UpdateSourceDialog
						source={updatingSource}
						onClose={() => setUpdatingSource(null)}
					/>
				)}
			</Dialog>
			<Dialog open={!!updatingGroup} onOpenChange={() => setUpdatingGroup(null)}>
				{updatingGroup && (
					<UpdateGroupDialog
						group={updatingGroup}
						onClose={() => setUpdatingGroup(null)}
					/>
				)}
			</Dialog>
		</>
	);
};

const Timeline = memo(({ sources, sourceGroups }: { sources: Source[], sourceGroups: SourceGroup[] }) => {
	return (
		<Tabs
			defaultValue="explore"
			className="lg:max-w-7xl w-full px-4 lg:px-8 mx-auto mb-4 lg:mb-10"
		>
			<TabsList className="w-full flex items-center justify-between">
				<TabsTrigger value="explore">Explore</TabsTrigger>
			</TabsList>
			<TabsContent value="explore">
				<Suspense fallback={<h1>🌀 Loading...</h1>}>
					<ExploreView sources={sources} sourceGroups={sourceGroups} />
				</Suspense>
			</TabsContent>
		</Tabs>
	);
});

export default Timeline;