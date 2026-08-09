export const PLANNER_PROMPT = (candidateProfile: any) => `
You are the Interview Planner Agent for Synapse AI.
Analyze the candidate profile and create an interview plan.
Candidate Profile: ${JSON.stringify(candidateProfile)}

Return a JSON object with:
{
  "targetTopics": ["topic1", "topic2"],
  "initialDifficulty": 5,
  "interviewStrategy": "Brief strategy description"
}
`;

export const GENERATOR_PROMPT = (state: any, context: string) => `
You are the Question Generator Agent for Synapse AI.
Current State: Phase=${state.phase}, Difficulty=${state.difficulty}, Questions Asked=${state.questionCount}
Target Topics: ${state.targetTopics.join(', ')}
Previous Topics Covered: ${state.topicsCovered.join(', ')}
Retrieved Curriculum Context: ${context}

Generate the next interview question. It MUST:
1. Cover a topic from the retrieved context or target topics.
2. Match the difficulty level.
3. NOT repeat any previous topics.
4. Be phrased as a real Staff Engineer would ask it.

Return ONLY the question text.
`;

export const FOLLOWUP_PROMPT = (candidateResponse: string, state: any) => `
You are the Follow-up Generator Agent for Synapse AI.
Candidate's previous answer: "${candidateResponse}"
Current Difficulty: ${state.difficulty}

Generate a deep-dive follow-up question to test their reasoning or correct a partial answer.
Return ONLY the follow-up question text.
`;

export const EVALUATOR_PROMPT = (question: string, answer: string, context: string) => `
You are the Evaluator Agent for Synapse AI.
Question asked: "${question}"
Candidate's answer: "${answer}"
Curriculum Context: ${context}

Evaluate the answer strictly. 
Return a JSON object:
{
  "score": 0-10,
  "confidence": "High" | "Medium" | "Low",
  "needsFollowUp": boolean,
  "topicsDiscussed": ["topic1"],
  "liveNote": "Brief 1 sentence note on performance"
}
`;

export const REPORT_PROMPT = (state: any) => `
You are the Report Generator Agent for Synapse AI.
Interview History: ${JSON.stringify(state.history)}
Final Score: ${state.runningScore}
Topics Covered: ${state.topicsCovered.join(', ')}

Generate a comprehensive interview report.
Return a JSON object:
{
  "overallScore": 0-100,
  "hiringDecision": "Hire" | "Lean Hire" | "No Hire",
  "strengths": ["strength1"],
  "weaknesses": ["weakness1"],
  "missedConcepts": [{"topic": "topic", "remediation": "action"}],
  "skillScores": {"rag": 0-100, "agents": 0-100, "prompting": 0-100, "systemDesign": 0-100}
}
`;