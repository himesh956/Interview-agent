export interface Message {
  role: 'interviewer' | 'candidate';
  content: string;
  score?: number;
  feedback?: string;
}

export interface InterviewReport {
  overallScore: number;
  hiringDecision: string;
  strengths: string[];
  weaknesses: string[];
  missedConcepts: { topic: string; remediation: string }[];
  skillScores: {
    rag: number;
    agents: number;
    prompting: number;
    systemDesign: number;
  };
}

export interface InterviewState {
  interviewId: string;
  candidateId: string;
  phase: 'greeting' | 'warmup' | 'technical' | 'system_design' | 'reflection' | 'completed';
  history: Message[];
  currentQuestion: string | null;
  questionCount: number;
  difficulty: number;
  runningScore: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  topicsCovered: string[];
  liveNotes: string[];
  targetTopics: string[];
  report?: InterviewReport;
}