export const TopicHeatmap = ({ topics }: { topics: string[] }) => {
  const mockTopics = ['RAG', 'Agents', 'Prompting', 'Scaling', 'System Design', 'Security'];
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {mockTopics.map((topic, i) => {
        const isCovered = topics.some(t => t.toLowerCase().includes(topic.toLowerCase()));
        return (
          <div 
            key={i} 
            className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
              isCovered ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-white/5 text-slate-500 border border-white/5'
            }`}
          >
            <span>{topic}</span>
            {isCovered && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
          </div>
        );
      })}
    </div>
  );
};