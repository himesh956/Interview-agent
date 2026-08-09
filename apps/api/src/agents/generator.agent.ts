import { LLMUtils } from '../utils/llm.js';
import { CurriculumRAGService } from '../rag/curriculum.rag.js';
import { GENERATOR_PROMPT, FOLLOWUP_PROMPT } from '../prompts/templates.js';
import { InterviewState } from '../types/interview.types.js';

export class GeneratorAgent {
  constructor(
    private llmUtils: LLMUtils,
    private ragService: CurriculumRAGService
  ) {}

  async generateNextQuestion(state: InterviewState): Promise<string> {
    const query = state.targetTopics.join(' ');
    const context = await this.ragService.retrieve(query, 4);
    const contextStr = context.map(c => c.pageContent).join('\n');
    
    const question = await this.llmUtils.invoke(GENERATOR_PROMPT(state, contextStr));
    return question.trim().replace(/^"|"$/g, '');
  }

  async generateFollowUp(candidateResponse: string, state: InterviewState): Promise<string> {
    const followUp = await this.llmUtils.invoke(FOLLOWUP_PROMPT(candidateResponse, state));
    return followUp.trim().replace(/^"|"$/g, '');
  }
}