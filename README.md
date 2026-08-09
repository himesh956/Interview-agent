# 🧠 Synapse AI

> An adaptive, agentic AI-powered technical interview platform.

Synapse AI simulates a real technical interview using specialized AI agents, Retrieval-Augmented Generation (RAG), adaptive difficulty, real-time communication, and evidence-based candidate evaluation.

**Understand → Plan → Ask → Evaluate → Adapt → Report**

## 🚀 Features

- 🤖 Planner, Generator, Evaluator, Follow-up, and Coordinator agents
- 🧠 Adaptive interview difficulty
- 📚 Curriculum-aware RAG
- ⚡ Real-time interview experience
- 📊 Evidence-based candidate evaluation
- 📄 Final assessment and remediation plan

## 🏗️ Architecture

```text
Candidate
    │
    ▼
┌─────────────────┐
│   Web Client    │
│ React + Vite    │
└────────┬────────┘
         │ API / WebSocket
         ▼
┌─────────────────┐
│   API Server    │
│ Node + Express  │
└────────┬────────┘
         ▼
┌─────────────────────┐
│  Coordinator Agent │
└──────────┬──────────┘
           │
    ┌──────┼──────┐
    ▼      ▼      ▼
 Planner Generator Evaluator
    │      │      │
    └──────┼──────┘
           ▼
      ┌─────────┐
      │   RAG   │
      └────┬────┘
           ▼
      Vector Store
```

## 🔄 Interview Flow

```text
Candidate
   ↓
Create Plan
   ↓
Retrieve Knowledge
   ↓
Generate Question
   ↓
Candidate Answers
   ↓
Evaluate
   ↓
Adapt Difficulty
   ↓
Follow-up / Next Question
   ↓
Final Assessment
```

## 🧩 Agents

### Planner Agent
Determines target topics, initial difficulty, and interview strategy.

### Generator Agent
Generates technical, reasoning, system-design, and production questions.

### Evaluator Agent
Evaluates correctness, depth, reasoning, trade-offs, scalability, reliability, and production readiness.

### Follow-up Agent
Generates targeted questions for incomplete or technically interesting answers.

### Coordinator Agent
Manages interview state, agent execution, question progression, difficulty, phases, and completion.

## 📚 RAG Pipeline

```text
Curriculum
   ↓
Document Processing
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Store
   ↓
Semantic Retrieval
   ↓
Agent Context
```

## 📈 Adaptive Difficulty

| Score | Action |
|---|---|
| 0–4 | Decrease difficulty |
| 5–7 | Maintain difficulty |
| 8–10 | Increase difficulty |

Difficulty remains between **1 and 10**.

## 🎯 Interview Phases

1. **Warm-up** — candidate background and baseline
2. **Technical** — core technical and AI engineering knowledge
3. **System Design** — architecture, scalability, reliability, latency, consistency
4. **Reflection** — engineering decisions and trade-offs
5. **Assessment** — final scoring and report

## 🛠️ Tech Stack

### Backend
- Node.js
- TypeScript
- Express
- Zod
- Socket.IO
- OpenRouter / LLM APIs

### AI
- Agentic architecture
- Retrieval-Augmented Generation
- Embeddings
- Vector search
- Structured LLM outputs

### Frontend
- React
- TypeScript
- Vite

### Tooling
- pnpm
- Turborepo
- Git
- GitHub

## 📁 Project Structure

```text
synapse-ai/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── agents/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── prompts/
│   │   │   ├── rag/
│   │   │   ├── routes/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   ├── features/
│       │   ├── hooks/
│       │   └── types/
│       └── package.json
├── ARCHITECTURE.md
├── PROMPTS.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .env.example
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Git

Check versions:

```bash
node --version
pnpm --version
git --version
```

### Install

```bash
git clone <your-repository-url>
cd synapse-ai
pnpm install
```

### Environment

```bash
cp .env.example .env
```

Configure:

```env
PORT=3001
OPENROUTER_API_KEY=
WEB_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

**Never commit `.env` or expose API keys.**

## ▶️ Development

Start API:

```bash
pnpm --filter @synapse/api dev
```

Build API:

```bash
pnpm --filter @synapse/api build
```

Build workspace:

```bash
pnpm turbo run build
```

Once the frontend is available:

```bash
pnpm dev
```

## 🔌 Current API

### Root

```http
GET /
```

```json
{
  "name": "Synapse AI API",
  "status": "running"
}
```

### Health

```http
GET /health
```

```json
{
  "status": "ok",
  "service": "synapse-api"
}
```

### Start Interview

```http
POST /api/interview/start
```

```json
{
  "candidateId": "candidate-001"
}
```

### Submit Answer

```http
POST /api/interview/answer
```

```json
{
  "interviewId": "interview-001",
  "answer": "Candidate response..."
}
```

## 🧪 Testing

```bash
pnpm --filter @synapse/api build
pnpm turbo run build
curl http://localhost:3001/health
```

## 🧠 Prompt Engineering

The AI system follows:

```text
Retrieve → Reason → Ask → Evaluate → Adapt → Repeat
```

See `PROMPTS.md` for the detailed prompt specification.

## 🔐 Security

- Keep secrets outside source control.
- Use environment variables for credentials.
- Never commit `.env`.
- Never expose API keys in frontend code.
- Evaluate candidates using evidence from their responses.
- Validate API input before processing.

## 🗺️ Development Roadmap

The product is being developed incrementally through 50 logical Git commits.

### Foundation
- Architecture
- Prompt specification
- Environment configuration
- pnpm workspace
- Turborepo
- TypeScript

### Backend
- API scaffold
- Express server
- Health endpoint
- Interview types
- Validation
- Controllers
- Routes

### AI
- LLM provider
- Prompt templates
- Structured responses

### RAG
- Vector store
- Curriculum ingestion
- Semantic retrieval
- Curriculum tools

### Agents
- Planner
- Generator
- Evaluator
- Follow-up
- Coordinator
- Adaptive difficulty
- Interview state machine

### Realtime
- Socket infrastructure
- Sessions
- Events
- Error handling

### Frontend
- React application
- Interview UI
- Socket integration
- Response interaction
- Live metrics

### Reporting
- Dashboard
- Skill assessment
- Summary
- Remediation

### Final
- End-to-end testing
- Production configuration
- Documentation
- Release polish

## 📄 Documentation

| Document | Purpose |
|---|---|
| `README.md` | Project overview and setup |
| `ARCHITECTURE.md` | System architecture |
| `PROMPTS.md` | AI prompt specifications |
| `.env.example` | Environment template |

## 🤝 Development Workflow

```text
Create → Implement → Build → Test → Commit
```

Use Conventional Commits:

```text
feat:
fix:
docs:
chore:
test:
refactor:
```

## 🎯 Project Goal

Synapse AI combines **Agentic AI + RAG + LLMs + Real-time Systems + Adaptive Evaluation** to create an intelligent technical interview platform.

## Status

🚧 **Active Development**

The system is being built incrementally as a 50-commit engineering project.
