import { InterviewState } from '../types/interview.types.js';
import { PlannerAgent } from './planner.agent.js';
import { GeneratorAgent } from './generator.agent.js';
import { EvaluatorAgent } from './evaluator.agent.js';
import { CurriculumRAGService } from '../rag/curriculum.rag.js';
import { REPORT_PROMPT } from '../prompts/templates.js';
import { LLMUtils } from '../utils/llm.js';

export class CoordinatorAgent {
  private state: InterviewState;
  private needsFollowUpFlag = false;
  private llmUtils: LLMUtils;

  constructor(
    private planner: PlannerAgent,
    private generator: GeneratorAgent,
    private evaluator: EvaluatorAgent,
    private ragService: CurriculumRAGService
  ) {
    this.llmUtils = new LLMUtils();
    this.state = {
      interviewId: Math.random().toString(36).substring(7),
      candidateId: '',
      phase: 'greeting',
      history: [],
      currentQuestion: null,
      questionCount: 0,
      difficulty: 5,
      runningScore: 0,
      confidenceLevel: 'Medium',
      topicsCovered: [],
      liveNotes: [],
      targetTopics: []
    };
  }

  async initializeInterview(candidateId: string): Promise<InterviewState> {
    this.state.candidateId = candidateId;
    const plan = await this.planner.plan(candidateId);
    this.state.targetTopics = plan.targetTopics;
    this.state.difficulty = plan.initialDifficulty;
    this.state.currentQuestion = "Hi, I'm Synapse AI, your technical interviewer for today. Let's start with a brief warm-up. Can you explain a recent AI project you've worked on?";
    this.state.phase = 'warmup';
    return this.state;
  }

  async handleTurn(candidateResponse: string): Promise<InterviewState> {
    if (this.state.phase === 'completed') return this.state;

    // 1. Evaluate previous answer (if not the very first response)
    if (this.state.currentQuestion && candidateResponse) {
      const evaluation = await this.evaluator.evaluate(
        this.state.currentQuestion,
        candidateResponse,
        this.state.runningScore
      );
      
      this.state.history.push({
        role: 'candidate',
        content: candidateResponse,
        score: evaluation.score,
        feedback: evaluation.liveNote
      });
      
      this.state.runningScore = evaluation.updatedScore;
      this.state.confidenceLevel = evaluation.confidence;
      this.state.topicsCovered.push(...evaluation.topicsDiscussed);
      this.state.liveNotes.push(evaluation.liveNote);
      this.needsFollowUpFlag = evaluation.needsFollowUp;

      // Adaptive Difficulty
      if (evaluation.score > 8) this.state.difficulty = Math.min(10, this.state.difficulty + 1);
      if (evaluation.score < 5) this.state.difficulty = Math.max(1, this.state.difficulty - 1);
    }

    // 2. Generate Next Question or Follow-up
    if (this.needsFollowUpFlag) {
      this.state.currentQuestion = await this.generator.generateFollowUp(candidateResponse, this.state);
      this.needsFollowUpFlag = false;
    } else {
      this.state.questionCount += 1;
      
      // Phase Transition & Completion
      if (this.state.questionCount > 8) {
        await this.generateReport();
        this.state.phase = 'completed';
        this.state.currentQuestion = null;
        return this.state;
      }

      if (this.state.questionCount >= 3 && this.state.phase === 'warmup') this.state.phase = 'technical';
      if (this.state.questionCount >= 6 && this.state.phase === 'technical') this.state.phase = 'system_design';
      
      this.state.currentQuestion = await this.generator.generateNextQuestion(this.state);
      this.state.history.push({ role: 'interviewer', content: this.state.currentQuestion });
    }

    return this.state;
  }

  private async generateReport() {
    const report = await this.llmUtils.invokeJSON(REPORT_PROMPT(this.state));
    this.state.report = report;
  }
}