import { motion } from 'framer-motion';

export const DiffMeter = ({ difficulty }: { difficulty: number }) => {
  const percentage = (difficulty / 10) * 100;
  const color = difficulty > 7 ? '#ef4444' : difficulty > 4 ? '#f59e0b' : '#10b981';

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-slate-400">Difficulty</span>
        <span className="text-xs font-medium" style={{ color }}>{difficulty}/10</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};