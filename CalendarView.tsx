import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  getTasksForDate: (date: Date) => Task[];
}

export function CalendarView({ tasks, onToggle, onDelete, getTasksForDate }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedTasks = getTasksForDate(selectedDate);

  // Dates that have tasks
  const taskDates = tasks.map((t) => t.deadline);
  const modifiers = { hasTasks: taskDates };
  const modifiersClassNames = { hasTasks: "!font-bold !text-primary relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-primary" };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-2xl shadow-card p-4 border">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => d && setSelectedDate(d)}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="p-0 pointer-events-auto w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
            month: "space-y-4 w-full",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-display font-medium text-xs",
            row: "flex w-full mt-1",
            cell: "w-full text-center text-sm relative p-0",
            day: "h-9 w-full rounded-xl font-medium hover:bg-primary/10 transition-colors",
            day_selected: "!bg-primary !text-primary-foreground hover:!bg-primary",
            day_today: "bg-accent/30 font-bold",
          }}
        />
      </div>

      <div className="bg-card rounded-2xl shadow-card p-4 border">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm">
            {format(selectedDate, "EEEE, MMMM d")}
          </h3>
          {selectedTasks.length > 0 && (
            <span className="text-xs gradient-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
              {selectedTasks.length} task{selectedTasks.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {selectedTasks.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground text-center py-6"
            >
              No tasks for this day 🎉
            </motion.p>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
