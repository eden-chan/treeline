"use client";

import { Suspense, useState } from "react";
import { memo } from "react";
import { calculateTimeAgo } from "@src/lib/utils";
import { useRouter } from "next/navigation";
import { Source, SourceGroup } from '@prisma/client';

import { TabsTrigger, TabsList, Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AlignJustify, LayoutGrid, Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createSourceGroupAction, updateSourceAction, updateSourceGroupAction, deleteSourceAction, deleteSourceGroupAction, removeSourceFromGroupAction, addSourceToGroupAction } from '@src/app/actions';
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
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

const DeleteSourceDialog = ({ isOpen, onClose, onConfirm, sourceName }: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	sourceName: string;
}) => (
	<Dialog open={isOpen} onOpenChange={onClose}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete Sapling</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete the sapling "{sourceName}"? This action cannot be undone.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button variant="outline" onClick={onClose}>Cancel</Button>
				<Button variant="destructive" onClick={onConfirm}>Delete</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

const DeleteGroupDialog = ({ isOpen, onClose, onConfirm, groupName }: {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	groupName: string;
}) => (
	<Dialog open={isOpen} onOpenChange={onClose}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete Forest</DialogTitle>
				<DialogDescription>
					Are you sure you want to delete the forest "{groupName}"? This action cannot be undone.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button variant="outline" onClick={onClose}>Cancel</Button>
				<Button variant="destructive" onClick={onConfirm}>Delete</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

const UpdateSourceDialog = ({ source, onClose }: { source: Source, onClose: () => void }) => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update Source</DialogTitle>
			</DialogHeader>
			<form action={async (formData: FormData) => {
				try {
					const title = formData.get('title') as string;
					const description = formData.get('description') as string;
					await updateSourceAction(source.id, title, description);
					toast({ title: "Source updated successfully" });
					onClose();
				} catch (error) {
					toast({
						title: "Failed to update source",
						variant: "destructive",
					});
				}
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
				<DialogTitle>Update Forest</DialogTitle>
			</DialogHeader>
			<form action={async (formData: FormData) => {
				try {
					const title = formData.get('title') as string;
					const description = formData.get('description') as string;
					await updateSourceGroupAction(group.id, title, description);
					toast({ title: "Forest updated successfully" });
					onClose();
				} catch (error) {
					toast({
						title: "Failed to update forest",
						variant: "destructive",
					});
				}
			}}>
				<Input name="title" placeholder="Title" defaultValue={group.title} required />
				<Textarea name="description" placeholder="Description" defaultValue={group.description} required />
				<Button type="submit">Update Forest</Button>
			</form>
		</DialogContent>
	);
};

const CreateGroupDialog = ({ selectedSources, onClose }: { selectedSources: string[], onClose: () => void }) => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Create New Forest</DialogTitle>
			</DialogHeader>
			<form action={async (formData: FormData) => {
				try {
					const title = formData.get('title') as string;
					const description = formData.get('description') as string;
					await createSourceGroupAction(title, description, selectedSources);
					toast({ title: "Forest created successfully" });
					onClose();
				} catch (error) {
					toast({
						title: "Failed to create group",
						variant: "destructive",
					});
				}
			}}>
				<Input name="title" placeholder="Forest Title" required />
				<Textarea name="description" placeholder="Forest Description" required />
				<Button type="submit">Create Forest</Button>
			</form>
		</DialogContent>
	);
};

const AddSourcesDialog = ({
	isOpen,
	onClose,
	group,
	sources,
	selectedSourcesForGroup,
	handleSourceSelect,
	handleAddSourcesToGroup
}: {
	isOpen: boolean;
	onClose: () => void;
	group: SourceGroup;
	sources: Source[];
	selectedSourcesForGroup: Record<string, string[]>;
	handleSourceSelect: (groupId: string, sourceId: string) => void;
	handleAddSourcesToGroup: (groupId: string) => Promise<void>;
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Saplings to Forest: {group.title}</DialogTitle>
				</DialogHeader>
				<ScrollArea className="mt-4 h-[300px] pr-4">
					{sources.filter(source => !group.sourceIDs.includes(source.id)).map((source) => (
						<div key={source.id} className="flex items-center space-x-2 mb-2">
							<Checkbox
								id={`${group.id}-${source.id}`}
								checked={(selectedSourcesForGroup[group.id] || []).includes(source.id)}
								onCheckedChange={() => handleSourceSelect(group.id, source.id)}
							/>
							<label
								htmlFor={`${group.id}-${source.id}`}
								className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={`/pdf?url=${source.source}`}
												className="text-blue-600 hover:underline text-sm font-medium line-clamp-2"
											>
												{source.title}
											</Link>
										</TooltipTrigger>
										<TooltipContent className="w-96 max-h-64 overflow-auto p-2">
											<p className="text-xs">{source.description}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</label>
						</div>
					))}
				</ScrollArea>
				<Button
					className="mt-4"
					onClick={() => {
						handleAddSourcesToGroup(group.id);
						onClose();
					}}
					disabled={!selectedSourcesForGroup[group.id] || selectedSourcesForGroup[group.id]?.length === 0}
				>
					Add Selected Sources
				</Button>
			</DialogContent>
		</Dialog>
	);
};

const ExploreView = ({ sources, sourceGroups }: { sources: Source[], sourceGroups: SourceGroup[] }) => {
	const router = useRouter();
	const [selectedSources, setSelectedSources] = useState<string[]>([]);
	const [isCreatingGroup, setIsCreatingGroup] = useState(false);
	const [updatingSource, setUpdatingSource] = useState<Source | null>(null);
	const [updatingGroup, setUpdatingGroup] = useState<SourceGroup | null>(null);
	const [view, setView] = useState("galleryView");
	const [addSourcesDialogOpen, setAddSourcesDialogOpen] = useState(false);
	const [currentGroup, setCurrentGroup] = useState<SourceGroup | null>(null);
	const [selectedSourcesForGroup, setSelectedSourcesForGroup] = useState<Record<string, string[]>>({});
	const [deletingSource, setDeletingSource] = useState<Source | null>(null);
	const [deletingGroup, setDeletingGroup] = useState<SourceGroup | null>(null);

	const handleSourceSelect = (id: string) => {
		setSelectedSources(prev =>
			prev.includes(id) ? prev.filter(sourceId => sourceId !== id) : [...prev, id]
		);
	};

	const handleSourceClick = (url: string) => {
		router.push(`/pdf?url=${url}`);
	};

	const handleDeleteSource = async (source: Source) => {
		setDeletingSource(source);
	};

	const confirmDeleteSource = async () => {
		if (deletingSource) {
			try {
				await deleteSourceAction(deletingSource.id);
				toast({ title: "Sapling deleted successfully" });
				router.refresh();
			} catch (error) {
				toast({
					title: "Failed to delete source",
					variant: "destructive",
				});
			} finally {
				setDeletingSource(null);
			}
		}
	};

	const handleDeleteGroup = async (group: SourceGroup) => {
		setDeletingGroup(group);
	};

	const confirmDeleteGroup = async () => {
		if (deletingGroup) {
			try {
				await deleteSourceGroupAction(deletingGroup.id);
				toast({ title: "Forest deleted successfully" });
				router.refresh();
			} catch (error) {
				toast({
					title: "Failed to delete Forest",
					variant: "destructive",
				});
			} finally {
				setDeletingGroup(null);
			}
		}
	};
	const handleRemoveSourceFromGroup = async (sourceId: string, groupId: string) => {
		try {
			await removeSourceFromGroupAction(sourceId, groupId);
			toast({ title: "Source removed from group successfully" });
			router.refresh();
		} catch (error) {
			toast({
				title: "Failed to remove sapling from Forest",
				variant: "destructive",
			});
		}
	};

	const handleAddSourceToGroup = async (sourceId: string, groupId: string) => {
		try {
			await addSourceToGroupAction(sourceId, groupId);
			toast({ title: "Sapling added to group successfully" });
			router.refresh();
		} catch (error) {
			toast({
				title: "Failed to add sapling to Forest",
				variant: "destructive",
			});
		}
	};

	const handleSourceSelectForGroup = (groupId: string, sourceId: string) => {
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

	const openAddSourcesDialog = (group: SourceGroup) => {
		setCurrentGroup(group);
		setAddSourcesDialogOpen(true);
	};

	const renderSources = () => {
		if (view === "galleryView") {
			return (
				<div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
					{sources.map((source) => (
						<div
							key={source.id}
							onClick={() => handleSourceClick(source.source)}
							className="p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
						>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href={`/pdf?url=${source.source}`}
											className="text-blue-600 hover:underline text-sm font-medium line-clamp-2"
										>
											{source.title}
										</Link>
									</TooltipTrigger>
									<TooltipContent className="w-96 max-h-64 overflow-auto p-2">
										<p className="text-xs">{source.description}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<div className="mt-2 flex justify-end space-x-1">
								<Button
									onClick={(e) => {
										e.stopPropagation();
										setUpdatingSource(source);
									}}
									className="p-1 h-6 w-6"
									variant="ghost"
								>
									<Edit size={12} />
								</Button>
								<Button
									onClick={(e) => {
										e.stopPropagation();
										setDeletingSource(source);
									}}
									className="p-1 h-6 w-6"
									variant="ghost"
								>
									<Trash size={12} />
								</Button>
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
							className={`mb-6 hover:cursor-pointer ${selectedSources.includes(source.id) ? 'border-2 border-blue-500' : ''}`}
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
									setDeletingSource(source);
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

	const renderGroups = () => (
		<div>
			{sourceGroups.map((group) => (
				<div key={group.id} className="mb-6 p-4 border rounded">
					<h2 className="text-xl font-semibold mb-2">{group.title}</h2>
					<p className="text-gray-600 mb-2">{group.description}</p>
					<div className="flex space-x-2 mb-4">
						<Button onClick={() => setUpdatingGroup(group)}><Edit size={16} /></Button>
						<Button onClick={() => setDeletingGroup(group)}><Trash size={16} /></Button>
					</div>
					<h3 className="text-lg font-medium mb-2">Trees in this Forest:</h3>
					<ul>
						{sources.filter(source => group.sourceIDs.includes(source.id)).map((source) => (
							<li key={source.id} className="flex justify-between items-center mb-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link href={`/pdf?url=${source.source}`} className="text-blue-500 hover:underline">
												{source.title}
											</Link>
										</TooltipTrigger>
										<TooltipContent className="w-72 h-40 overflow-auto">
											<p>{source.description}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<Button onClick={() => handleRemoveSourceFromGroup(source.id, group.id)}>Remove</Button>
							</li>
						))}
					</ul>
					<Button
						className="mt-4"
						onClick={() => openAddSourcesDialog(group)}
					>
						Add Saplings to Forest
					</Button>
				</div>
			))}
		</div>
	);

	return (
		<>
			<div className="mb-4 flex justify-between">
				<Button
					onClick={() => setIsCreatingGroup(true)}
					disabled={selectedSources.length === 0}
				>
					<Plus className="mr-2 h-4 w-4" /> Create Forest
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
			<h2 className="text-2xl font-bold mt-8 mb-4">Forests</h2>
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
			{currentGroup && (
				<AddSourcesDialog
					isOpen={addSourcesDialogOpen}
					onClose={() => setAddSourcesDialogOpen(false)}
					group={currentGroup}
					sources={sources}
					selectedSourcesForGroup={selectedSourcesForGroup}
					handleSourceSelect={handleSourceSelectForGroup}
					handleAddSourcesToGroup={handleAddSourcesToGroup}
				/>
			)}
			<DeleteSourceDialog
				isOpen={!!deletingSource}
				onClose={() => setDeletingSource(null)}
				onConfirm={confirmDeleteSource}
				sourceName={deletingSource?.title || ''}
			/>
			<DeleteGroupDialog
				isOpen={!!deletingGroup}
				onClose={() => setDeletingGroup(null)}
				onConfirm={confirmDeleteGroup}
				groupName={deletingGroup?.title || ''}
			/>
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