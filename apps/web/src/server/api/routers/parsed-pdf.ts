import { z } from "zod";
import { ParsedPaper } from "@prisma/client";

import { db } from "@src/lib/db";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";

export interface TitleSourcePair {
	title: string;
	source: string;
}

export const parsedPaperRouter = createTRPCRouter({
	startParsingPDF: publicProcedure
		.input(
			z.object({
				source: z.string(),
			}),
		)
		.mutation<any>(async ({ input }) => {
			try {
				console.log(
					`${process.env.PREPROCESSOR_URL}/process_pdf`,
					input.source,
				);
				const response = await fetch(
					`${process.env.PREPROCESSOR_URL}/process_pdf`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ pdf_url: input.source }),
					},
				);
				if (!response.ok) {
					console.error("Failed to process PDF:", response.statusText);
					return null;
				}
				const result = await response.json();
				return result;
			} catch (error) {
				console.error("Failed to fetch: ", error);
				return null;
			}
		}),
	fetchParsedPdf: publicProcedure
		.input(
			z.object({
				source: z.string(),
			}),
		)
		.query<ParsedPaper | null>(async ({ input }) => {
			const whereClause: Record<string, string> = {};
			whereClause["source"] = input.source;
			let result: ParsedPaper | null;
			try {
				result = await db.parsedPaper.findFirst({
					where: whereClause,
				});
			} catch (error) {
				console.error("Failed to fetch parsed paper:", error);
				return null;
			}

			return result;
		}),
	fetchAllParsedPapers: publicProcedure.query<ParsedPaper[]>(async () => {
		let result: ParsedPaper[];
		try {
			result = await db.parsedPaper.findMany();
		} catch (error) {
			console.error("Failed to fetch parsed paper:", error);
			return [];
		}
		return result;
	}),
	fetchAllParsedSources: publicProcedure.query<TitleSourcePair[]>(async () => {
		let result: TitleSourcePair[];
		try {
			let resp = await db.parsedPaper.findMany({
				select: { source: true, title: true },
			});
			result = resp
				.filter((paper) => paper.source !== undefined)
				.map((paper) => {
					return { source: paper.source, title: paper.title };
				});
		} catch (error) {
			console.error("Failed to fetch parsed paper:", error);
			return [];
		}
		return result;
	}),
});
