import { LLMUtils } from '../utils/llm.js';
import { PLANNER_PROMPT } from '../prompts/templates.js';

export class PlannerAgent {
  constructor(private llmUtils: LLMUtils) {}

  async plan(candidateId: string) {
    const mockProfile = {
      candidateId,
      name: 'Alex Doe',
      completedMissions: ['RAG App', 'Agent System'],
      scores: { 'RAG': 85, 'Agents': 70, 'Prompting': 90 },
      weakTopics: ['Agent Memory', 'Scaling'],
      strongTopics: ['Prompt Engineering', 'Vector Search']
    };

    const response = await this.llmUtils.invokeJSON(PLANNER_PROMPT(mockProfile));
    return {
      targetTopics: response.targetTopics || ['RAG', 'Agents', 'Production'],
      initialDifficulty: response.initialDifficulty || 5,
      interviewStrategy: response.interviewStrategy || 'Test core competencies'
    };
  }
}