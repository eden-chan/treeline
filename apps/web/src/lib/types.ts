import {
	AnnotatedPdf,
	Comment,
	Highlight,
	CurriculumNode,
} from "@prisma/client";

export enum EMBEDDING_TYPE {
	FactDescriptor = "FactDescriptor",
	SourceText = "SourceText",
}

export type CurriculumNodeWithRelations = CurriculumNode & {
	children?: CurriculumNodeWithRelations[];
};

export type HighlightWithRelations = Highlight & {
	node?: CurriculumNodeWithRelations | null;
	comments: Comment[];
};

export type AnnotatedPdfWithRelations = AnnotatedPdf & {
	highlights: HighlightWithRelations[];
};

export type AnnotatedPdfWithProfile = AnnotatedPdfWithRelations & {
	userProfilePicture: string;
	firstName: string;
	lastName: string;
};
export type UserSearchResult = {
	id: string;
	name: string;
	handle: string;
};

export type UserProfile = {
	firstName: string;
	lastName: string;
	imageUrl: string;
	email: string
};

