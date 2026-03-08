import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TaskCategory, CATEGORY_CONFIG } from "@/types/task";

interface AddTaskDialogProps {
  onAdd: (title: string, category: TaskCategory, deadline: Date, description?: string) => void;
  defaultDate?: Date;
}

export function AddTaskDialog({ onAdd, defaultDate }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("assignment");
  const [date, setDate] = useState<Date | undefined>(defaultDate);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !date) return;
    onAdd(title.trim(), category, date, description.trim() || undefined);
    setTitle("");
    setCategory("assignment");
    setDate(defaultDate);
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary font-display font-semibold gap-2 shadow-card hover:shadow-card-hover transition-shadow">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Add New Task ✨</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="font-display font-medium">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Math Final Exam" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label className="font-display font-medium">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
              <SelectTrigger className="mt-1.5 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>
                    {cfg.emoji} {cfg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-display font-medium">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full mt-1.5 justify-start rounded-xl font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="font-display font-medium">Description (optional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Notes..." className="mt-1.5 rounded-xl" />
          </div>
          <Button onClick={handleSubmit} disabled={!title.trim() || !date} className="w-full gradient-primary font-display font-semibold rounded-xl">
            Add Task 🎯
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
