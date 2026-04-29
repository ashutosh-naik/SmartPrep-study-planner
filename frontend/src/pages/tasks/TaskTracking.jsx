import { useEffect, useState, useRef, useCallback } from "react";
import {
  CheckCircle2,
  Clock,
  Plus,
  X,
  Trash2,
  Bell,
  BellOff,
  AlertTriangle,
  Calendar,
  Timer,
  Edit3,
  Check,
  FileText,
  Flame,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Circle,
  ClipboardList,
  BarChart3
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import PomodoroTimer from "../../components/PomodoroTimer";
import { taskService } from "../../services/taskService";
import toast from "react-hot-toast";
import { format, isPast, isToday } from "date-fns";

const PRIORITY_CFG = {
  HIGH:   { label: "High",   color: "text-[#4A3728]", bg: "bg-[#F9FAFB]", border: "border-[#4A3728]", dot: "bg-[#4A3728]", icon: <Circle size={10} className="fill-[#4A3728] text-[#4A3728]" /> },
  MEDIUM: { label: "Medium", color: "text-[#6B6B6B]", bg: "bg-white", border: "border-[#E6E6E6]", dot: "bg-[#6B6B6B]", icon: <Circle size={10} className="fill-[#6B6B6B] text-[#6B6B6B]" /> },
  LOW:    { label: "Low",    color: "text-[#A3A3A3]", bg: "bg-white", border: "border-[#E6E6E6]", dot: "bg-[#D4D4D4]", icon: <Circle size={10} className="fill-[#D4D4D4] text-[#D4D4D4]" /> },
};

const TaskTracking = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(Notification.permission === "granted");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(defaultForm());
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroTask, setPomodoroTask] = useState("Study Session");
  const [showOverdue, setShowOverdue] = useState(true);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const reminderRef = useRef(null);

  useEffect(() => {
    const subs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
    setAvailableSubjects(subs);
  }, []);

  function defaultForm() {
    return { title: "", subjectName: "", priority: "MEDIUM", durationHours: 1, deadline: "", notes: "", scheduledDate: format(new Date(), "yyyy-MM-dd") };
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await taskService.getCustomTasks("all");
        if (res.success && res.data) setTasks(res.data);
      } catch (err) { toast.error("Failed to load tasks"); }
      finally { setLoading(false); }
    })();
  }, []);

  const overdueTasks = tasks.filter((t) => t.status !== "completed" && t.deadline && isPast(new Date(t.deadline)));
  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
    if (filter === "today") return t.scheduledDate === format(new Date(), "yyyy-MM-dd");
    if (filter === "done") return t.status === "completed";
    if (filter === "pending") return t.status !== "completed";
    return true;
  }).sort((a, b) => {
    const pw = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    if (pw[a.priority] !== pw[b.priority]) return pw[a.priority] - pw[b.priority];
    return new Date(a.deadline || 0) - new Date(b.deadline || 0);
  });

  const doneCount = tasks.filter((t) => t.status === "completed").length;
  const completionPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    setTasks(tasks.map((t) => t.id === task.id ? { ...t, status: newStatus } : t));
    try {
      if (newStatus === "completed") await taskService.completeTask(task.id);
      else await taskService.updateCustomTask(task.id, { ...task, status: newStatus });
    } catch {
      setTasks(tasks.map((t) => t.id === task.id ? { ...t, status: task.status } : t));
    }
  };

  const handleDelete = async (id) => {
    try {
      await taskService.deleteCustomTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("Task removed");
    } catch { toast.error("Failed to delete"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { ...form, durationHours: parseFloat(form.durationHours) || 1 };
    try {
      if (editingTask) {
        await taskService.updateCustomTask(editingTask.id, taskData);
        setTasks(tasks.map((t) => t.id === editingTask.id ? { ...t, ...taskData } : t));
      } else {
        const res = await taskService.createCustomTask(taskData);
        if (res.success) setTasks([res.data, ...tasks]);
      }
      setShowModal(false);
      setForm(defaultForm());
    } catch { toast.error("Error saving task"); }
  };

  return (
    <AnimatedPage>
      {showPomodoro && <PomodoroTimer taskName={pomodoroTask} onClose={() => setShowPomodoro(false)} />}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-2xl w-full max-w-lg p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-[#4A3728] tracking-tight">{editingTask ? "Edit Task" : "New Task"}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B6B6B] hover:text-[#4A3728]"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Task Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Finish Chapter 4" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Subject</label>
                  <select 
                    value={form.subjectName} 
                    onChange={e => setForm({ ...form, subjectName: e.target.value })} 
                    className="input-field"
                  >
                    <option value="">General (No Subject)</option>
                    {availableSubjects.map(s => (
                      <option key={s.id || s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="input-field">
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div>
                  <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Duration (h)</label>
                  <input type="number" step="0.5" value={form.durationHours} onChange={e => setForm({ ...form, durationHours: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1 hover:scale-105 transition-transform duration-300">Save Task</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar title="Task Tracking" subtitle="Manage your daily objectives" />

      <div className="p-6 lg:p-10 animate-fade-in max-w-[1200px] mx-auto">
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total", value: tasks.length, icon: FileText },
            { label: "Done", value: doneCount, icon: CheckCircle2 },
            { label: "Pending", value: tasks.length - doneCount, icon: Clock },
            { label: "Overdue", value: overdueTasks.length, icon: AlertTriangle },
          ].map((s, i) => (
            <div key={i} className="card flex items-center gap-4 hover:scale-105 transition-transform duration-300">
              <div className="w-10 h-10 rounded-[8px] bg-[#F9FAFB] border border-[#E6E6E6] flex items-center justify-center shrink-0">
                <s.icon size={18} className="text-[#4A3728]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">{s.label}</p>
                <p className="text-[20px] font-bold text-[#4A3728] leading-none mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="card mb-10 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={16} /> Daily Completion
            </h3>
            <span className="text-[13px] font-bold text-[#4A3728]">{completionPct}%</span>
          </div>
          <div className="w-full h-[6px] bg-[#F1F1F1] rounded-full overflow-hidden">
            <div className="h-full bg-[#4A3728] transition-all duration-700" style={{ width: `${completionPct}%` }} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            {["all", "today", "pending", "done"].map(k => (
              <button key={k} onClick={() => setFilter(k)} className={`px-4 py-1.5 rounded-[8px] text-[12px] font-bold transition-all hover:scale-105 duration-300 ${filter === k ? "bg-[#4A3728] text-white shadow-md" : "bg-white border border-[#E6E6E6] text-[#6B6B6B] hover:text-[#4A3728] hover:border-[#4A3728]"}`}>{k.charAt(0).toUpperCase() + k.slice(1)}</button>
            ))}
          </div>
          <button onClick={() => { setEditingTask(null); setShowModal(true); }} className="btn-primary text-[13px] flex items-center gap-2 hover:scale-105 transition-transform duration-300 shadow-lg">
            <Plus size={16} /> New Task
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const p = PRIORITY_CFG[task.priority] || PRIORITY_CFG.MEDIUM;
            const done = task.status === "completed";
            return (
              <div key={task.id} className={`card p-5 border-2 transition-all flex items-center gap-4 group hover:scale-[1.01] duration-300 ${done ? "opacity-60 border-[#E6E6E6] bg-[#F9FAFB]" : "border-[#E6E6E6] hover:border-[#4A3728] hover:shadow-md"}`}>
                <button onClick={() => handleToggleComplete(task)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${done ? "bg-[#4A3728] border-[#4A3728] text-white" : "border-[#D4D4D4] hover:border-[#4A3728]"}`}>
                  {done && <Check size={12} />}
                </button>
                <div className="flex-1">
                  <h4 className={`text-[15px] font-bold ${done ? "line-through text-[#6B6B6B]" : "text-[#4A3728]"}`}>{task.title || task.topicName}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.bg} ${p.color} border ${p.border}`}>{p.label}</span>
                    <span className="text-[11px] font-bold text-[#A3A3A3] flex items-center gap-1"><Clock size={12} /> {task.durationHours}h</span>
                    {task.subjectName && <span className="text-[11px] font-bold text-[#A3A3A3] flex items-center gap-1">/ {task.subjectName}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setShowPomodoro(true)} className="p-2 text-[#6B6B6B] hover:text-[#4A3728] transition-transform hover:scale-110 duration-300"><Timer size={16} /></button>
                  <button onClick={() => handleDelete(task.id)} className="p-2 text-[#6B6B6B] hover:text-red-500 transition-transform hover:scale-110 duration-300"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
          {filteredTasks.length === 0 && <div className="text-center py-20"><ClipboardList size={40} className="mx-auto text-[#E6E6E6] mb-4" /><p className="text-[#6B6B6B] font-medium">No tasks found.</p></div>}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default TaskTracking;
