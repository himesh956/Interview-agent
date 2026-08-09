import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { Document } from '@langchain/core/documents';

declare global {
  var ragService: {
    retrieve(query: string, k: number): Promise<Document[]>;
  };
}

export const retrieveCurriculumContext = tool(
  async ({ query, k }) => {
    const docs = await global.ragService.retrieve(query, k);

    return docs.map((d: Document) => d.pageContent).join('\n');
  },
  {
    name: 'retrieve_curriculum_context',
    description:
      'Retrieve specific curriculum topics, learning objectives, and tools based on semantic search.',
    schema: z.object({
      query: z
        .string()
        .describe(
          'The semantic query to search for in the 31-day curriculum'
        ),
      k: z
        .number()
        .default(4)
        .describe('Number of chunks to retrieve'),
    }),
  }
);