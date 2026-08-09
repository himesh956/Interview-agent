import { LLMUtils } from '../utils/llm.js';
import { CurriculumRAGService } from '../rag/curriculum.rag.js';
import { EVALUATOR_PROMPT } from '../prompts/templates.js';

export class EvaluatorAgent {
  constructor(
    private llmUtils: LLMUtils,
    private ragService: CurriculumRAGService
  ) {}

  async evaluate(question: string, answer: string, currentScore: number) {
    const context = await this.ragService.retrieve(question, 2);
    const contextStr = context.map(c => c.pageContent).join('\n');
    
    const evaluation = await this.llmUtils.invokeJSON(EVALUATOR_PROMPT(question, answer, contextStr));
    
    const newScore = (currentScore + evaluation.score) / 2;
    
    return {
      score: evaluation.score,
      confidence: evaluation.confidence,
      needsFollowUp: evaluation.needsFollowUp,
      topicsDiscussed: evaluation.topicsDiscussed || [],
      liveNote: evaluation.liveNote || 'No note provided.',
      updatedScore: newScore
    };
  }
}