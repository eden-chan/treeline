import { z } from "zod";
import { AnnotatedPdf, User } from "@prisma/client";
import { HighlightArea, RenderHighlightTargetProps } from '@react-pdf-viewer/highlight';
export interface LTWH {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface LTWHP extends LTWH {
	pageNumber?: number;
}

export interface Scaled {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	width: number;
	height: number;
	pageNumber?: number;
}

export interface Position {
	boundingRect: LTWHP;
	rects: Array<LTWHP>;
	pageNumber: number;
}

export interface ScaledPosition {
	boundingRect: Scaled;
	rects: Array<Scaled>;
	pageNumber: number;
	usePdfCoordinates?: boolean;
}

export interface Content {
	text?: string | null;
	image?: string | null;
}

export interface HighlightContent {
	content: Content;
}


export interface NewHighlight extends HighlightContent {
	position: ScaledPosition;
	timestamp: Date;
	comments: Array<Comment>;
}

export interface IHighlight extends NewHighlight {
	id: string;
}

export interface ViewportHighlight extends HighlightContent {
	position: Position;
	comments: Array<Comment>;
}

export interface Viewport {
	convertToPdfPoint: (x: number, y: number) => Array<number>;
	convertToViewportRectangle: (pdfRectangle: Array<number>) => Array<number>;
	width: number;
	height: number;
}

export interface Page {
	node: HTMLElement;
	number: number;
}

export interface PDFHighlightsWithProfile extends AnnotatedPdf {
	userProfilePicture: string;
	firstName: string;
	lastName: string;
}

export interface UserWithProfile extends User {
	imageUrl: string;
}

export const LTWHSchema = z.object({
	left: z.number(),
	top: z.number(),
	width: z.number(),
	height: z.number(),
});

export const LTWHPSchema = LTWHSchema.extend({
	pageNumber: z.number(),
});

export const ScaledSchema = z.object({
	x1: z.number(),
	y1: z.number(),
	x2: z.number(),
	y2: z.number(),
	width: z.number(),
	height: z.number(),
	pageNumber: z.number().or(z.null()),
});

export const PositionSchema = z.object({
	boundingRect: LTWHPSchema,
	rects: z.array(LTWHPSchema),
	pageNumber: z.number(),
});

export const ScaledPositionSchema = z.object({
	boundingRect: ScaledSchema,
	rects: z.array(ScaledSchema),
	pageNumber: z.number(),
	usePdfCoordinates: z.boolean().or(z.null()),
});

export const CommentSchema = z.object({
	text: z.string().or(z.null()),
	timestamp: z.date(),
	userId: z.string(), // who replied or commented
});

export const CurriculumNodeSchemaBase = z.object({
	prompt: z.string().or(z.null()),
	highlightId: z.string().or(z.null()),
	response: z.string().or(z.null()),
	timestamp: z.date(),
});

export const HighlightV2HighlightAreasSchema = z.object({
	height: z.number(),
	left: z.number(),
	pageIndex: z.number(),
	top: z.number(),
	width: z.number(),
});

export const HighlightSchema = z.object({
	highlightAreas: z.array(HighlightV2HighlightAreasSchema),
	quote: z.string(),
	annotatedPdfId: z.string(),
});

export const HighlightWithCurriculumNodeSchema = HighlightSchema.extend({
	node: CurriculumNodeSchemaBase.omit({ highlightId: true })
		.or(z.undefined())
		.or(z.null()),
	comments: z.array(CommentSchema).optional(),
});

export const IHighlightSchema = HighlightSchema.extend({
	id: z.string(),
});

export const UserSchema = z.object({
	id: z.string(),
	email: z.string(),
	first_name: z.string(),
	followers: z.array(z.string()),
	follows: z.array(z.string()),
	handle: z.string(),
	last_name: z.string(),
});


export type LastSelectedArea =  {highlightAreas: 
	RenderHighlightTargetProps['highlightAreas'], 
	selectedText: string
}


export type PaperInfo = {
  title: string;
  description: string;
  date: string;
  authors: string[];
};



export type Source = {
  id: string;
  url: string;
  name: string;
  description: string; 
  date: string;
}

export type NewSource = {
  id: string;
  url: string;
  name: string;
  description: string;
  date: string;
};
export type Collection = {
  id: string;
  title: string;
  description: string;
  sources: Source[];
}


export type Comment = {
  id: string;
  userId: string;
  timestamp: string;
  text: string;
}

export type ProcessedHighlight = {
  id: string;
  text: string;
  highlightAreas: HighlightArea[];
  comments: Comment[];
}
