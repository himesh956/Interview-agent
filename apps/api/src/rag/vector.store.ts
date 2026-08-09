import { Document } from 'langchain/document';
import { VectorStoreRetriever } from 'langchain/vectorstores/base';
import { FaissStore } from 'langchain/vectorstores/faiss';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export interface IVectorStore {
  addDocuments(docs: Document[]): Promise<void>;
  asRetriever(k: number): VectorStoreRetriever;
}

export class FaissVectorStore implements IVectorStore {
  private store: FaissStore;
  constructor(embeddings: OpenAIEmbeddings) {
    this.store = new FaissStore(embeddings, {});
  }
  async addDocuments(docs: Document[]) {
    await this.store.addDocuments(docs);
  }
  asRetriever(k: number) {
    return this.store.asRetriever(k);
  }
}

// RAG Service handles chunking and ingestion of the 31-day curriculum
export class CurriculumRAGService {
  constructor(private vectorStore: IVectorStore) {}

  async ingestCurriculum(curriculumJson: any) {
    // Custom chunking strategy: chunk by Day -> Module -> Topic
    const chunks: Document[] = [];
    curriculumJson.days.forEach((day: any) => {
      day.modules.forEach((mod: any) => {
        chunks.push(new Document({
          pageContent: `Day ${day.day}: ${mod.topic}. Objectives: ${mod.objectives.join(', ')}. Tools: ${mod.tools.join(', ')}`,
          metadata: { day: day.day, topic: mod.topic, hierarchy: mod.conceptHierarchy }
        }));
      });
    });
    await this.vectorStore.addDocuments(chunks);
  }
}