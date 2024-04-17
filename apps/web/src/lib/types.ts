import { AnnotatedPdf, Highlight, CurriculumNode } from "@prisma/client";

export type CurriculumNodeWithRelations = CurriculumNode & {
  children?: CurriculumNodeWithRelations[];
};

export type HighlightWithRelations = Highlight & {
  node?: CurriculumNodeWithRelations | null;
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
