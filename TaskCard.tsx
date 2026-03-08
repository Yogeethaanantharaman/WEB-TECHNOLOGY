import { format, differenceInHours } from "date-fns";
import { motion } from "framer-motion";
import { Check, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, CATEGORY_CONFIG } from "@/types/task";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const hoursLeft = differenceInHours(task.deadline, new Date());
  const isUrgent = hoursLeft <= 72 && hoursLeft > 0 && !task.completed;
  const isOverdue = hoursLeft <= 0 && !task.completed;
  const config = CATEGORY_CONFIG[task.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group relative rounded-2xl p-4 transition-all shadow-card hover:shadow-card-hover bg-card border",
        task.completed && "opacity-60",
        isOverdue && "border-destructive/50 bg-destructive/5",
        isUrgent && !isOverdue && "border-warning/50 bg-warning/5"
      )}
    >
      {(isUrgent || isOverdue) && (
        <div className={cn(
          "absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-display font-bold animate-pulse",
          isOverdue ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"
        )}>
          {isOverdue ? "⚠️ OVERDUE" : `⏰ ${hoursLeft}h left`}
        </div>
      )}

      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            "mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
            task.completed ? "bg-success border-success" : "border-primary/30 hover:border-primary"
          )}
        >
          {task.completed && <Check className="w-3.5 h-3.5 text-success-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium text-primary-foreground", config.colorClass)}>
              {config.emoji} {config.label}
            </span>
          </div>
          <h3 className={cn("font-display font-semibold text-sm", task.completed && "line-through")}>{task.title}</h3>
          {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {format(task.deadline, "MMM d, yyyy")}
          </div>
        </div>

        <button onClick={() => onDelete(task.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
