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
  text?: string;
  image?: string;
}

export interface HighlightContent {
  content: Content;
}


export type Reply = Omit<Comment, 'replies'> 

export interface Comment {
  text: string;
  emoji: string;
  userId: string;
  replies?: Reply[];
}

export interface HighlightCommentSection {
  comments: Comment[];
}

export interface NewHighlight extends HighlightContent, HighlightCommentSection {
  position: ScaledPosition;
  // content 
  //  comments 
}

export interface IHighlight extends NewHighlight {
  id: string;
  userId: string;
  userName: string;
}

export interface ViewportHighlight extends HighlightContent, HighlightCommentSection {
  position: Position;
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



// New Document interface
export interface Document {
  id: string;
  name: string;
  sourceUrl: string; // PDF content
  highlights: IHighlight[];
  comments: Comment[]; // Document-level comment thread
}

export type CommentDraft = Omit<Comment, 'replies'> // text + emoji
export type HighlightDraft = Omit<NewHighlight, 'comments'> // content + position

// Creating a new document 


export interface HighlightMetadata {
    userId: string;
    userName: string;
    documentId?: string;
}

export interface CreateDocumentHighlightDraft  {
    // highlight: HighlightDraft; // content + position
    // comment: CommentDraft; // text + emoji
    highlightDraft: HighlightDraft;
    commentDraft: CommentDraft;
    highlightMetadata: HighlightMetadata;
}

export interface CreateDocumentDraft {
  name: string;
  sourceUrl: string;
}

export interface DocumentWithId extends Document {
  id: string;
}