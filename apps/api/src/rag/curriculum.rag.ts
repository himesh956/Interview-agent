import { Document } from '@langchain/core/documents';
import { Embeddings } from '@langchain/core/embeddings';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import path from 'path';
import fs from 'fs';

/**
 * Fully local, zero-dependency, zero-network embeddings.
 * No API key, no model download, no native binaries.
 * Uses a simple hashing-based bag-of-words vector — good enough
 * for matching short curriculum/topic text, and always instant.
 */
class SimpleLocalEmbeddings extends Embeddings {
  private readonly dims = 256;

  constructor() {
    super({});
  }

  private hash(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  private vectorize(text: string): number[] {
    const vec = new Array(this.dims).fill(0);
    const words = text.toLowerCase().match(/[a-z0-9]+/g) || [];
    for (const word of words) {
      const idx = this.hash(word) % this.dims;
      vec[idx] += 1;
    }
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
    return vec.map(v => v / norm);
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    return documents.map(doc => this.vectorize(doc));
  }

  async embedQuery(document: string): Promise<number[]> {
    return this.vectorize(document);
  }
}

export class CurriculumRAGService {
  private embeddings: SimpleLocalEmbeddings;
  private vectorStore: FaissStore | null = null;
  private readonly indexDir = path.resolve(process.cwd(), 'faiss_index');

  constructor() {
    this.embeddings = new SimpleLocalEmbeddings();
  }

  private getMockCurriculum() {
    return {
      days: [
        { day: 1, module: 'Intro to AI Engineering', topic: 'AI Eng Fundamentals', objectives: ['Understand AI lifecycle', 'Setup environment'], tools: ['Python', 'Docker'] },
        { day: 5, module: 'Prompt Engineering', topic: 'Advanced Prompting', objectives: ['Chain of thought', 'Few-shot learning'], tools: ['LangChain'] },
        { day: 12, module: 'RAG Systems', topic: 'Vector Databases & RAG', objectives: ['Embeddings', 'Similarity search', 'Chunking strategies'], tools: ['Pinecone', 'FAISS'] },
        { day: 18, module: 'AI Agents', topic: 'Agentic Workflows', objectives: ['Tool use', 'Planning', 'Memory management'], tools: ['LangGraph', 'CrewAI'] },
        { day: 25, module: 'Production AI', topic: 'Deployment & Scaling', objectives: ['Load balancing', 'Model optimization', 'Monitoring'], tools: ['Kubernetes', 'Ray'] },
        { day: 31, module: 'Capstone', topic: 'Enterprise AI Integration', objectives: ['Security', 'Compliance', 'System design'], tools: ['AWS', 'Azure'] }
      ]
    };
  }

  async ingestCurriculum() {
    if (fs.existsSync(this.indexDir)) {
      this.vectorStore = await FaissStore.load(this.indexDir, this.embeddings);
      return;
    }

    const curriculum = this.getMockCurriculum();
    const chunks: Document[] = [];

    curriculum.days.forEach(day => {
      chunks.push(new Document({
        pageContent: `Day ${day.day}: ${day.module}. Topic: ${day.topic}. Learning Objectives: ${day.objectives.join(', ')}. Tools used: ${day.tools.join(', ')}.`,
        metadata: { day: day.day, topic: day.topic }
      }));
    });

    this.vectorStore = await FaissStore.fromDocuments(chunks, this.embeddings);
    await this.vectorStore.save(this.indexDir);
  }

  async retrieve(query: string, k: number = 4): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized. Call ingestCurriculum first.');
    }
    const retriever = this.vectorStore.asRetriever(k);
    return await retriever.invoke(query);
  }
}