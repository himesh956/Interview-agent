import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import interviewRoutes from './routes/interview.routes.js';
import { CurriculumRAGService } from './rag/curriculum.rag.js';
import { CoordinatorAgent } from './agents/coordinator.agent.js';
import { EvaluatorAgent } from './agents/evaluator.agent.js';
import { GeneratorAgent } from './agents/generator.agent.js';
import { PlannerAgent } from './agents/planner.agent.js';
import { LLMUtils } from './utils/llm.js';

// server.ts lives at apps/api/src — walk up 3 levels to reach the
// workspace root where the real .env file is, regardless of the
// process's current working directory (turbo runs this from apps/api).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

console.log('OPENROUTER_API_KEY loaded:', process.env.OPENROUTER_API_KEY ? 'YES' : 'NO — .env not found!');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.WEB_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.use('/api/v1/interview', interviewRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

const activeInterviews = new Map<string, CoordinatorAgent>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('start_interview', async (data: { candidateId: string; curriculumId: string }) => {
    try {
      const llmUtils = new LLMUtils();
      const ragService = new CurriculumRAGService();
      await ragService.ingestCurriculum();

      const planner = new PlannerAgent(llmUtils);
      const generator = new GeneratorAgent(llmUtils, ragService);
      const evaluator = new EvaluatorAgent(llmUtils, ragService);
      
      const coordinator = new CoordinatorAgent(planner, generator, evaluator, ragService);
      activeInterviews.set(socket.id, coordinator);

      const initialState = await coordinator.initializeInterview(data.candidateId);
      socket.emit('interview_state', initialState);
    } catch (error) {
      console.error('Error starting interview:', error);
      socket.emit('error', { message: 'Failed to start interview' });
    }
  });

  socket.on('candidate_response', async (data: { response: string }) => {
    try {
      const coordinator = activeInterviews.get(socket.id);
      if (!coordinator) {
        socket.emit('error', { message: 'No active interview found' });
        return;
      }

      socket.emit('thinking', { state: true });
      const newState = await coordinator.handleTurn(data.response);
      socket.emit('interview_state', newState);
      socket.emit('thinking', { state: false });

      if (newState.phase === 'completed') {
        activeInterviews.delete(socket.id);
      }
    } catch (error) {
      console.error('Error processing response:', error);
      socket.emit('error', { message: 'Failed to process response' });
      socket.emit('thinking', { state: false });
    }
  });

  socket.on('disconnect', () => {
    activeInterviews.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Synapse API server running on port ${PORT}`);
}); 