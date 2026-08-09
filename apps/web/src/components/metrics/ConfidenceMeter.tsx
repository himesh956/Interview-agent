import { motion } from 'framer-motion';

export const ConfidenceMeter = ({ confidence }: { confidence: 'High' | 'Medium' | 'Low' }) => {
  const level = confidence === 'High' ? 3 : confidence === 'Medium' ? 2 : 1;
  const colors = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-slate-400">Confidence</span>
        <span className="text-xs font-medium text-slate-300">{confidence}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-2 flex-1 rounded-full"
            initial={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            animate={{
              backgroundColor: i <= level ? colors[level - 1] : 'rgba(255,255,255,0.05)'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};