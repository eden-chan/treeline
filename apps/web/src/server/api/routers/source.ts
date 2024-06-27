import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@src/server/api/trpc";
import { db } from "@src/lib/db";
import { Source, SourceGroup } from '@prisma/client';
import ky from 'ky';

const S2_API_KEY = process.env.S2_API_KEY;

interface Author {
  authorId: string;
  name: string;
}

interface Paper {
  title: string;
  authors: Author[];
  abstract: string;
  year: number;
}

const PAPER_FIELDS='title,year,abstract,authors.name'

async function getPaper(paperId: string): Promise<Paper> {
  return ky.get(`https://api.semanticscholar.org/graph/v1/paper/${paperId}`, {
    headers: { 'X-API-KEY': S2_API_KEY },
    searchParams: { fields: PAPER_FIELDS }
  }).json();
}

async function getCitations(paperId: string): Promise<Paper[]> {
  const edges = await getCitationEdges(`https://api.semanticscholar.org/graph/v1/paper/${paperId}/citations`);
  return edges.map(edge => edge.citingPaper);
}

async function getReferences(paperId: string): Promise<Paper[]> {
  const edges = await getCitationEdges(`https://api.semanticscholar.org/graph/v1/paper/${paperId}/references`);
  return edges.map(edge => edge.citedPaper);
}

async function getCitationEdges(url: string): Promise<any[]> {
  const pageSize = 1000;
  let offset = 0;
  const allEdges = [];

  while (true) {
    const page = await ky.get(url, {
      headers: { 'X-API-KEY': S2_API_KEY },
      searchParams: {
        fields: 'title,authors',
        limit: pageSize,
        offset: offset
      }
    }).json<{ data: any[] }>();
    console.log(page)

    allEdges.push(...page.data);

    if (page.data.length < pageSize) {
      break;
    }
    offset += pageSize;
  }

  return allEdges;
}


export const sourceRouter = createTRPCRouter({
  createSource: publicProcedure
    .input(
      z.object({
        source: z.string(),
      }),
    )
    .mutation<Source | null>(async ({ input }) => {
      try {
         const existingSource = await db.source.findUnique({
        where: { source: input.source },
      });

      if (existingSource) {
        console.log("Source already exists:", existingSource);
        return existingSource;
      }

        let paper :Paper | null = null;
        let title =''
        let description =''
        let date = new Date()

        if (input.source.startsWith('https://arxiv.org')) {
            // strip away the code at the end and put arXiv: in front
            const paperId = input.source.split('/pdf/')[1];
            
            paper = await getPaper(`arXiv:${paperId}`);
            // const references = await getReferences(`arXiv:${paperId}`);
            // const citations = await getCitations(`arXiv:${paperId}`);
            // console.log({references, citations})
            title = paper.title 
            description = paper.abstract
            date = new Date(paper.year)
        }

        return await db.source.create({
          data: {
            title: title,
            description: description,
            source: input.source,
            uploadedAt: date,
          },
        });
      } catch (error) {
        console.error("Failed to create source:", error);
        return null;
      }
    }),

    
  
  updateSource: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        source: z.string().optional(),
      }),
    )
    .mutation<Source | null>(async ({ input }) => {
      try {
        return await db.source.update({
          where: { id: input.id },
          data: {
            title: input.title,
            description: input.description,
            source: input.source,
            uploadedAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Failed to update source:", error);
        return null;
      }
    }),

  fetchAllSources: publicProcedure
    .query<Source[]>(async () => {
      return await db.source.findMany();
    }),

  createSourceGroup: publicProcedure
  .input(
    z.object({
      title: z.string(),
      description: z.string(),
      sourceIds: z.array(z.string()),
    }),
  )
  .mutation<SourceGroup | null>(async ({ input }) => {
    try {
      const sourceGroup = await db.sourceGroup.create({
        data: {
          title: input.title,
          description: input.description,
          sources: {
            connect: input.sourceIds.map(id => ({ id })),
          },
        },
        include: {
          sources: true,
        },
      });

      // Update sourceGroupIDs for each source
      await db.source.updateMany({
        where: { id: { in: input.sourceIds } },
        data: {
          sourceGroupIDs: {
            push: sourceGroup.id,
          },
        },
      });
      return sourceGroup;
    } catch (error) {
      console.error("Failed to create source group:", error);
      return null;
    }
  }),

  updateSourceGroup: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation<SourceGroup | null>(async ({ input }) => {
      try {
        return await db.sourceGroup.update({
          where: { id: input.id },
          data: {
            title: input.title,
            description: input.description,
          },
        });
      } catch (error) {
        console.error("Failed to update source group:", error);
        return null;
      }
    }),

 deleteSource: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation<{ success: boolean }>(async ({ input }) => {
      try {
        await db.source.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        console.error("Failed to delete source:", error);
        return { success: false };
      }
    }),

  deleteSourceGroup: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation<{ success: boolean }>(async ({ input }) => {
      try {
        await db.sourceGroup.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        console.error("Failed to delete source group:", error);
        return { success: false };
      }
    }),

  addSourceToGroup: publicProcedure
    .input(
      z.object({
        sourceId: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation<Source | null>(async ({ input }) => {
      try {
        const updatedSource = await db.source.update({
          where: { id: input.sourceId },
          data: {
            sourceGroupIDs: {
              push: input.groupId,
            },
            sourceGroups: {
              connect: { id: input.groupId },
            },
          },
        });

        await db.sourceGroup.update({
          where: { id: input.groupId },
          data: {
            sourceIDs: {
              push: input.sourceId,
            },
            sources: {
              connect: { id: input.sourceId },
            },
          },
        });

        return updatedSource;
      } catch (error) {
        console.error("Failed to add source to group:", error);
        return null;
      }
    }),

  fetchSourcesInGroup: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query<Source[]>(async ({ input }) => {
      return await db.source.findMany({
        where: {
          sourceGroupIDs: {
            hasSome: [input.groupId],
          },
        },
      });
    }),

  fetchGroupsForSource: publicProcedure
    .input(
      z.object({
        sourceId: z.string(),
      }),
    )
    .query<SourceGroup[]>(async ({ input }) => {
      const source = await db.source.findUnique({
        where: { id: input.sourceId },
        include: { sourceGroups: true },
      });
      return source?.sourceGroups || [];
    }),

  removeSourceFromGroup: publicProcedure
    .input(
      z.object({
        sourceId: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation<Source | null>(async ({ input }) => {
      try {
        const source = await db.source.findUnique({
          where: { id: input.sourceId },
        });

        if (!source) {
          throw new Error("Source not found");
        }

        const updatedGroupIds = source.sourceGroupIDs.filter(id => id !== input.groupId);
        
        await db.source.update({
          where: { id: input.sourceId },
          data: {
            sourceGroupIDs: updatedGroupIds,
            sourceGroups: {
              disconnect: { id: input.groupId },
            },
          },
        });

        await db.sourceGroup.update({
          where: { id: input.groupId },
          data: {
            sources: {
              disconnect: { id: input.sourceId },
            },
          },
        });


        return source;
      } catch (error) {
        console.error("Failed to remove source from group:", error);
        return null;
      }
    }),

  findSourcesByGroupName: publicProcedure
    .input(
      z.object({
        groupName: z.string(),
      }),
    )
    .query<Source[]>(async ({ input }) => {
      return await db.source.findMany({
        where: {
          sourceGroups: {
            some: {
              title: {
                contains: input.groupName,
              },
            },
          },
        },
      });
    }),

  fetchAllSourceGroups: publicProcedure
    .query<SourceGroup[]>(async () => {
      return await db.sourceGroup.findMany();
    }),
});