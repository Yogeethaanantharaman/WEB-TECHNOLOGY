import { motion } from "framer-motion";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/contexts/AuthContext";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { StatsBar } from "@/components/StatsBar";
import { DeadlineAlerts } from "@/components/DeadlineAlerts";
import { CalendarView } from "@/components/CalendarView";
import { TaskCard } from "@/components/TaskCard";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { tasks, loading, addTask, toggleTask, deleteTask, getTasksForDate, getUpcomingDeadlines } = useTasks();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const incompleteTasks = tasks.filter((t) => !t.completed).sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-card">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg leading-tight">DeadlineHero</h1>
              <p className="text-xs text-muted-foreground">Never miss a deadline again ⚡</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-2">
            <AddTaskDialog onAdd={addTask} defaultDate={new Date()} />
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="rounded-xl text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        <StatsBar tasks={tasks} />
        <DeadlineAlerts tasks={tasks} />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <CalendarView tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} getTasksForDate={getTasksForDate} />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-card p-4 border">
              <h2 className="font-display font-semibold text-sm mb-3 flex items-center gap-2">
                📌 All Pending Tasks
                {incompleteTasks.length > 0 && (
                  <span className="text-xs gradient-accent text-accent-foreground px-2 py-0.5 rounded-full">
                    {incompleteTasks.length}
                  </span>
                )}
              </h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {incompleteTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">All caught up! 🎊</p>
                  ) : (
                    incompleteTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
