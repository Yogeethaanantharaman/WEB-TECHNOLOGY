import { differenceInHours, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Task, CATEGORY_CONFIG } from "@/types/task";

interface DeadlineAlertsProps {
  tasks: Task[];
}

export function DeadlineAlerts({ tasks }: DeadlineAlertsProps) {
  const now = new Date();
  const urgent = tasks
    .filter((t) => !t.completed && differenceInHours(t.deadline, now) <= 72 && t.deadline >= now)
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  const overdue = tasks.filter((t) => !t.completed && t.deadline < now);

  if (urgent.length === 0 && overdue.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {overdue.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-destructive/10 border border-destructive/30"
          >
            <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center shrink-0 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-destructive-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-display font-semibold text-destructive truncate">{task.title}</p>
              <p className="text-xs text-destructive/70">Overdue — was due {format(task.deadline, "MMM d")}</p>
            </div>
            <span className="text-lg">{CATEGORY_CONFIG[task.category].emoji}</span>
          </motion.div>
        ))}
        {urgent.map((task) => {
          const hrs = differenceInHours(task.deadline, now);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-warning/10 border border-warning/30"
            >
              <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center shrink-0">
                <span className="text-sm">⏰</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-display font-semibold text-foreground truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground">{hrs}h left — due {format(task.deadline, "MMM d")}</p>
              </div>
              <span className="text-lg">{CATEGORY_CONFIG[task.category].emoji}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
