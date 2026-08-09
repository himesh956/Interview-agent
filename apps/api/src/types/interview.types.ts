import { z } from 'zod';

export const MessageSchema = z.object({
  role: z.enum(['interviewer', 'candidate']),
  content: z.string(),
  score: z.number().optional(),
  feedback: z.string().optional()
});

export const InterviewStateSchema = z.object({
  interviewId: z.string(),
  candidateId: z.string(),
  phase: z.enum(['greeting', 'warmup', 'technical', 'system_design', 'reflection', 'completed']),
  history: z.array(MessageSchema),
  currentQuestion: z.string().nullable(),
  questionCount: z.number(),
  difficulty: z.number().min(1).max(10),
  runningScore: z.number(),
  confidenceLevel: z.enum(['High', 'Medium', 'Low']),
  topicsCovered: z.array(z.string()),
  liveNotes: z.array(z.string()),
  targetTopics: z.array(z.string()),
  report: z.any().optional()
});

export type InterviewState = z.infer<typeof InterviewStateSchema>;
export type Message = z.infer<typeof MessageSchema>;

export const CandidateProfileSchema = z.object({
  candidateId: z.string(),
  name: z.string(),
  completedMissions: z.array(z.string()),
  scores: z.record(z.string(), z.number()),
  weakTopics: z.array(z.string()),
  strongTopics: z.array(z.string())
});

export type CandidateProfile = z.infer<typeof CandidateProfileSchema>;