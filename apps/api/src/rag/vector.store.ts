import { Document } from '@langchain/core/documents';
import { VectorStoreRetriever } from '@langchain/core/vectorstores';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { OpenAIEmbeddings } from '@langchain/openai';

export interface IVectorStore {
  addDocuments(docs: Document[]): Promise<void>;
  asRetriever(k: number): VectorStoreRetriever;
}

export class FaissVectorStore implements IVectorStore {
  private store: FaissStore;

  constructor(embeddings: OpenAIEmbeddings) {
    this.store = new FaissStore(embeddings, {});
  }

  async addDocuments(docs: Document[]): Promise<void> {
    await this.store.addDocuments(docs);
  }

  asRetriever(k: number): VectorStoreRetriever {
    return this.store.asRetriever(k);
  }
}

// RAG Service handles chunking and ingestion of the 31-day curriculum
export class CurriculumRAGService {
  constructor(private vectorStore: IVectorStore) {}

  async ingestCurriculum(curriculumJson: any): Promise<void> {
    // Custom chunking strategy: chunk by Day -> Module -> Topic
    const chunks: Document[] = [];

    curriculumJson.days.forEach((day: any) => {
      day.modules.forEach((mod: any) => {
        chunks.push(
          new Document({
            pageContent: `Day ${day.day}: ${mod.topic}. Objectives: ${mod.objectives.join(
              ', '
            )}. Tools: ${mod.tools.join(', ')}`,
            metadata: {
              day: day.day,
              topic: mod.topic,
              hierarchy: mod.conceptHierarchy,
            },
          })
        );
      });
    });

    await this.vectorStore.addDocuments(chunks);
  }
}