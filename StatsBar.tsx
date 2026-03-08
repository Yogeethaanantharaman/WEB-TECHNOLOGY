import { motion } from "framer-motion";
import { Task } from "@/types/task";

interface StatsBarProps {
  tasks: Task[];
}

export function StatsBar({ tasks }: StatsBarProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total", value: total, emoji: "📋" },
    { label: "Done", value: completed, emoji: "✅" },
    { label: "Pending", value: pending, emoji: "⏳" },
    { label: "Progress", value: `${progress}%`, emoji: "📊" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-card border text-center"
        >
          <span className="text-2xl">{s.emoji}</span>
          <p className="font-display font-bold text-xl mt-1">{s.value}</p>
          <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
