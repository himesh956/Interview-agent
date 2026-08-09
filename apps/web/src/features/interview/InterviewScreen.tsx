import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiffMeter, ConfidenceMeter, TopicHeatmap } from '../../components/metrics';
import { Card } from '../../components/ui/Card';
import { Loader2, Brain, Sparkles, Send } from 'lucide-react';
import { InterviewState } from '../../types/interview';

interface Props {
  state: InterviewState | null;
  isThinking: boolean;
  sendResponse: (response: string) => void;
}

export const InterviewScreen = ({ state, isThinking, sendResponse }: Props) => {
  const [response, setResponse] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state?.history, isThinking]);

  const handleSubmit = () => {
    if (response.trim() && !isThinking) {
      sendResponse(response);
      setResponse('');
    }
  };

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_400px]">
      {/* Main Chat Area */}
      <div className="flex flex-col h-screen p-8 border-r border-white/5">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-2 flex items-center justify-center">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-white">Synapse AI</h1>
              <p className="text-xs text-slate-500 capitalize">{state.phase} Phase</p>
            </div>
          </div>
          <div className="text-sm font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full">
            {state.questionCount} / 8 Questions
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4 pb-4">
          {state.history.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.role === 'candidate' ? 'bg-white/5' : 'bg-accent/10 border border-accent/20'} p-4 rounded-2xl`}>
                <p className="text-sm text-slate-200">{msg.content}</p>
                {msg.score !== undefined && (
                  <div className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                    Score: {msg.score}/10 • {msg.feedback}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {state.currentQuestion && state.history[state.history.length - 1]?.content !== state.currentQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] bg-accent/10 border border-accent/20 p-4 rounded-2xl">
                <p className="text-sm text-slate-200">{state.currentQuestion}</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-slate-400 pl-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Synapse is analyzing...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 relative">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your technical answer here..."
            className="input-base pr-24"
            rows={4}
            disabled={isThinking}
          />
          <button
            onClick={handleSubmit}
            disabled={isThinking || !response.trim()}
            className="absolute right-4 bottom-4 px-4 py-2 bg-accent text-black rounded-lg font-medium text-sm hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit <Send className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="p-8 space-y-6 hidden lg:block overflow-y-auto h-screen">
        <Card>
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-4">Live Metrics</h3>
          <DiffMeter difficulty={state.difficulty} />
          <div className="mt-4">
            <ConfidenceMeter confidence={state.confidenceLevel} />
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-slate-400">Running Score</span>
              <span className="text-xs font-medium text-accent">{state.runningScore.toFixed(1)}/10</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-4">Curriculum Coverage</h3>
          <TopicHeatmap topics={state.topicsCovered} />
        </Card>

        <Card>
          <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-accent" />
            AI Live Notes
          </h3>
          <ul className="space-y-3 text-xs text-slate-400 max-h-[300px] overflow-y-auto">
            {state.liveNotes.length === 0 ? (
              <li className="text-slate-600">Waiting for candidate responses...</li>
            ) : (
              state.liveNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 pb-2 border-b border-white/5 last:border-0">
                  <div className="w-1 h-1 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                  <span>{note}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </aside>
    </div>
  );
};