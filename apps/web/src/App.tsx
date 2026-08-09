import { useState } from 'react';
import { InterviewScreen } from './features/interview/InterviewScreen';
import { ReportDashboard } from './features/dashboard/ReportDashboard';
import { useInterviewSocket } from './hooks/useInterviewSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

export default function App() {
  const { state, isThinking, startInterview, sendResponse, connected } = useInterviewSocket();
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    startInterview('cand_123', 'curr_31');
    setStarted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center mb-8 shadow-lg shadow-accent/20"
            >
              <Brain className="w-10 h-10 text-black" />
            </motion.div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Synapse AI</h1>
            <p className="text-slate-400 text-lg max-w-md text-center mb-8">
              The Enterprise AI Engineering Interviewer. Adaptive. Agentic. Uncompromising.
            </p>
            <button onClick={handleStart} className="btn-primary px-8 py-3 text-base" disabled={!connected}>
              <Sparkles className="w-4 h-4" />
              Start Interview
            </button>
            {!connected && <p className="text-red-400 text-sm mt-4">Connecting to server...</p>}
          </motion.div>
        ) : state?.phase === 'completed' && state.report ? (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ReportDashboard report={state.report} />
          </motion.div>
        ) : (
          <motion.div
            key="interview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <InterviewScreen state={state} isThinking={isThinking} sendResponse={sendResponse} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}