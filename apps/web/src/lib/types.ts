import { Prisma } from "@prisma/client";

export type AnnotatedPdf = Prisma.AnnotatedPdfGetPayload<{
  include: { highlights: true };
}>;

export enum EMBEDDING_TYPE {
  SourceText = "sourceText",
  FactDescriptor = "factDescriptor",
}
