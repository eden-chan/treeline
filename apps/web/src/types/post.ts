import { z } from "zod";

export interface Highlight {
  id: string;
  comment: {
    emoji: string;
    text: string;
  };
  content: {
    image?: string;
    text?: string;
  };
  position: {
    boundingRect: {
      height: number;
      pageNumber?: number;
      width: number;
      x1: number;
      x2: number;
      y1: number;
      y2: number;
    };
    pageNumber: number;
    rects: Array<{
      height: number;
      pageNumber?: number;
      width: number;
      x1: number;
      x2: number;
      y1: number;
      y2: number;
    }>;
  };
}

export const HighlightSchema = z.object({
  comment: z
    .object({
      emoji: z.string(),
      text: z.string(),
    })
    .optional(),
  content: z
    .object({
      image: z.string().optional(),
      text: z.string().optional(),
    })
    .optional(),
  position: z
    .object({
      boundingRect: z
        .object({
          height: z.number(),
          pageNumber: z.number(),
          width: z.number(),
          x1: z.number(),
          x2: z.number(),
          y1: z.number(),
          y2: z.number(),
        })
        .optional(),
      pageNumber: z.number().optional(),
      rects: z
        .array(
          z.object({
            height: z.number(),
            pageNumber: z.number().optional(),
            width: z.number(),
            x1: z.number(),
            x2: z.number(),
            y1: z.number(),
            y2: z.number(),
          })
        )
        .optional(),
    })
    .optional(),
  id: z.string(),
});
