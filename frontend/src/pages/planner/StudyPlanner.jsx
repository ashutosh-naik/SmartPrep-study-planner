import { useAuthStore } from '../../store/useAuthStore';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Clock,
  LayoutGrid,
  Rows3,
  X,
  Zap,
  BookOpen,
  AlertTriangle,
  Play,
  Plus,
  CheckCircle2,
  FileText,
  CheckCircle,
  Target
} from "lucide-react";

import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { plannerService } from "../../services/plannerService";
import { taskService } from "../../services/taskService";
import { timetableService } from "../../services/timetableService";
import {
  formatShortDate,
  getWeekDates,
  getDaysUntil,
  isDateToday,
} from "../../utils/dateUtils";
import {
  addDays,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";
import toast from "react-hot-toast";

const DIFFICULTY_HOURS = { Hard: 1.5, Medium: 1, Easy: 0.75 };

/**
 * Humanized schedule generator.
 * Tries to pack topics into available daily hours until the exam date.
 */
const createStudySchedule = (subjectList, examStr, maxHoursPerDay) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const targetExamDate = new Date(examStr);
  targetExamDate.setHours(0, 0, 0, 0);
  
  const daysRemaining = Math.max(1, Math.ceil((targetExamDate - currentDate) / (1000 * 60 * 60 * 24)));

  const pendingItems = [];
  
  // Collect all unfinished topics across all selected subjects
  subjectList.forEach((subject) => {
    (subject.topics || []).forEach((item) => {
      if (item.done || item.status === "COMPLETED") return;
      
      const estimatedTime = item.estimatedHours ? parseFloat(item.estimatedHours) : (DIFFICULTY_HOURS[subject.difficulty] || 1);
      
      pendingItems.push({
        subjectName: subject.name,
        topicName: item.name,
        difficulty: subject.difficulty || "Medium",
        durationHours: estimatedTime,
        priority: item.status === "IN_PROGRESS" ? 0 : 1, // Start with what's in progress
      });
    });
  });

  if (!pendingItems.length) return {};

  // Sort by priority first, then difficulty
  pendingItems.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const diffWeights = { Hard: 0, Medium: 1, Easy: 2 };
    return (diffWeights[a.difficulty] ?? 1) - (diffWeights[b.difficulty] ?? 1);
  });

  const finalSchedule = {};
  let currentOffset = 0;
  let dailyAccumulatedHours = 0;

  pendingItems.forEach((task) => {
    let targetDayStr = format(addDays(currentDate, currentOffset), "yyyy-MM-dd");
    
    // Shift to next day if we exceed daily limit
    if (dailyAccumulatedHours + task.durationHours > maxHoursPerDay) {
      currentOffset = Math.min(currentOffset + 1, daysRemaining - 1);
      dailyAccumulatedHours = 0;
      targetDayStr = format(addDays(currentDate, currentOffset), "yyyy-MM-dd");
    }

    if (!finalSchedule[targetDayStr]) {
      finalSchedule[targetDayStr] = [];
    }

    finalSchedule[targetDayStr].push({
      id: Date.now() + Math.random(),
      subjectName: task.subjectName,
      topicName: task.topicName,
      durationHours: task.durationHours,
      difficulty: task.difficulty,
      status: "pending",
      isBacklog: false,
    });
    
    dailyAccumulatedHours += task.durationHours;

    if (dailyAccumulatedHours >= maxHoursPerDay) {
      currentOffset = Math.min(currentOffset + 1, daysRemaining - 1);
      dailyAccumulatedHours = 0;
    }
  });

  return finalSchedule;
};

const StudyPlanner = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("week");
  const [monthDate, setMonthDate] = useState(new Date());
  const [showGenModal, setShowGenModal] = useState(false);
  const [genHours, setGenHours] = useState(user?.studyHoursPerDay || 4);
  const [genExamDate, setGenExamDate] = useState(user?.examDate || "");
  const [selectedGenSubjects, setSelectedGenSubjects] = useState([]);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ subjectName: "", topicName: "", durationHours: 1 });

  const subjects = JSON.parse(localStorage.getItem("sp_subjects") || "[]");

  useEffect(() => { setWeekDates(getWeekDates(weekStart)); }, [weekStart]);
  useEffect(() => { fetchDailyTasks(); }, [selectedDate]);

  useEffect(() => {
    if (showGenModal && selectedGenSubjects.length === 0) {
      setSelectedGenSubjects(subjects.map(s => s.id));
    }
  }, [showGenModal, subjects]);

  const fetchDailyTasks = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const localPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
      if (localPlan[dateStr]) {
        setDailyTasks(localPlan[dateStr]);
        setLoading(false);
        return;
      }
      const res = await plannerService.getDailyPlan(dateStr);
      setDailyTasks(res.data && res.data.length > 0 ? res.data : []);
    } catch {
      setDailyTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const executeScheduleGeneration = () => {
    if (!genExamDate) { toast.error("Please set your exam date."); return; }
    if (selectedGenSubjects.length === 0) { toast.error("Please select at least one subject."); return; }

    const subs = subjects.filter((s) => selectedGenSubjects.includes(s.id));
    const newPlan = createStudySchedule(subs, genExamDate, genHours);
    
    if (Object.keys(newPlan).length === 0) { toast.error("No topics found to schedule."); return; }

    const existingPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    const mergedPlan = { ...newPlan };
    
    Object.keys(existingPlan).forEach((dateKey) => {
      const completedTasks = existingPlan[dateKey].filter(t => t.status === "completed");
      if (completedTasks.length > 0) {
        mergedPlan[dateKey] = [...completedTasks, ...(mergedPlan[dateKey] || [])];
      }
    });

    localStorage.setItem("sp_study_plan", JSON.stringify(mergedPlan));
    updateUser({ examDate: genExamDate });
    syncToTimetable(mergedPlan);
    setShowGenModal(false);
    toast.success("Schedule generated!");
    fetchDailyTasks();
  };

  const handleAddTask = () => {
    if (!newTask.subjectName || !newTask.topicName) { toast.error("Please fill all fields."); return; }
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const existingPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    existingPlan[dateStr] = [...(existingPlan[dateStr] || []), { id: Date.now(), ...newTask, status: "pending" }];
    localStorage.setItem("sp_study_plan", JSON.stringify(existingPlan));
    setShowAddTaskModal(false);
    setNewTask({ subjectName: "", topicName: "", durationHours: 1 });
    toast.success("Task added!");
    fetchDailyTasks();
  };

  const syncToTimetable = async (scheduleMap) => {
    try {
      const toastId = toast.loading("Syncing...");
      const currentSlots = await timetableService.getSlots();
      await Promise.all(currentSlots.map(s => timetableService.deleteSlot(s.id)));

      const upcomingSlots = [];
      const baseDate = new Date();
      baseDate.setHours(0,0,0,0);

      for (let i = 0; i < 7; i++) {
        const d = addDays(baseDate, i);
        const dStr = format(d, "yyyy-MM-dd");
        const tasks = scheduleMap[dStr] || [];
        let h = 17;
        tasks.forEach(t => {
          if (t.status === "completed") return;
          const end = h + parseFloat(t.durationHours || 1);
          upcomingSlots.push({
            dayOfWeek: d.getDay() === 0 ? 7 : d.getDay(),
            startTime: `${String(Math.floor(h)).padStart(2,"0")}:00:00`,
            endTime: `${String(Math.floor(end)).padStart(2,"0")}:00:00`,
            subjectName: t.subjectName,
            label: t.topicName,
            color: "#111111"
          });
          h = end;
        });
      }

      for (const s of upcomingSlots) await timetableService.createSlot(s);
      toast.success("Synced!", { id: toastId });
    } catch (err) { toast.error("Sync failed"); }
  };

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));
  const goToday = () => { setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })); setSelectedDate(new Date()); };

  const buildMonthGrid = () => {
    const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
    const end = addDays(startOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 }), 6);
    return eachDayOfInterval({ start, end });
  };

  const fullPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");

  return (
    <AnimatedPage>
      <>
        {/* Modals */}
        {showGenModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
            <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-2xl w-full max-w-lg p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black uppercase tracking-tight">Generate Study Plan</h2>
                <button onClick={() => setShowGenModal(false)}><X size={20} /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3] mb-3 block">Subjects</label>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-1">
                    {subjects.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setSelectedGenSubjects(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${selectedGenSubjects.includes(s.id) ? 'border-[#4A3728] bg-gray-50' : 'border-gray-100'}`}
                      >
                        <p className="text-[13px] font-bold text-[#4A3728]">{s.name}</p>
                        <p className="text-[10px] text-[#6B6B6B]">{s.topics?.length || 0} Topics</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3] mb-3 block">Exam Date</label>
                    <input type="date" value={genExamDate} onChange={e => setGenExamDate(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3] mb-3 block">Daily Goal (Saved): {genHours}h</label>
                    <input type="range" min={1} max={12} step={0.5} value={genHours} onChange={e => setGenHours(Number(e.target.value))} className="w-full accent-[#4A3728]" />
                  </div>
                </div>
                <button onClick={executeScheduleGeneration} className="btn-primary w-full !py-4 flex items-center justify-center gap-2">
                  <Zap size={18} className="text-[var(--accent-gold)]" /> Generate Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-2xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-[#4A3728]">Add Study Session</h2>
                <button onClick={() => setShowAddTaskModal(false)}><X size={20} /></button>
              </div>
              <div className="space-y-6">
                <input type="text" value={newTask.subjectName} onChange={e => setNewTask({...newTask, subjectName: e.target.value})} placeholder="Subject" className="input-field" />
                <input type="text" value={newTask.topicName} onChange={e => setNewTask({...newTask, topicName: e.target.value})} placeholder="Topic" className="input-field" />
                <div className="flex gap-4">
                  <button onClick={handleAddTask} className="btn-primary flex-1">Add</button>
                  <button onClick={() => setShowAddTaskModal(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Navbar title="Study Planner" subtitle="Manage your weekly study routine" />
        <div className="p-6 lg:p-10 animate-fade-in max-w-[1400px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button onClick={prevWeek} className="p-2 hover:bg-white rounded-md border border-transparent hover:border-[#E6E6E6] transition-all"><ChevronLeft size={18} /></button>
                <h3 className="text-[15px] font-bold text-[#4A3728] min-w-[150px] text-center">
                  {viewMode === 'week' ? `${formatShortDate(weekStart)} — ${formatShortDate(addDays(weekStart, 6))}` : format(monthDate, "MMMM yyyy")}
                </h3>
                <button onClick={nextWeek} className="p-2 hover:bg-white rounded-md border border-transparent hover:border-[#E6E6E6] transition-all"><ChevronRight size={18} /></button>
              </div>
              <button onClick={goToday} className="text-[13px] font-bold text-[#6B6B6B] hover:text-[#4A3728]">Today</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex p-1 bg-[#F1F1F1] rounded-[8px]">
                <button onClick={() => setViewMode("week")} className={`px-4 py-1.5 rounded-[6px] text-[12px] font-bold ${viewMode === "week" ? "bg-white text-[#4A3728] shadow-sm" : "text-[#6B6B6B]"}`}>Week</button>
                <button onClick={() => setViewMode("month")} className={`px-4 py-1.5 rounded-[6px] text-[12px] font-bold ${viewMode === "month" ? "bg-white text-[#4A3728] shadow-sm" : "text-[#6B6B6B]"}`}>Month</button>
              </div>
              <button onClick={() => setShowGenModal(true)} className="btn-primary text-[13px] flex items-center gap-2"><CalIcon size={16} /> Generate Plan</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              {viewMode === "week" ? (
                <div className="grid grid-cols-7 gap-4">
                  {weekDates.map((date, idx) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const tasks = fullPlan[dateStr] || [];
                    const isToday = isSameDay(date, new Date());
                    return (
                      <div 
                        key={idx} 
                        className={`min-h-[400px] rounded-xl border transition-all ${isToday ? 'bg-[#FAF9F6] border-[#4A3728] shadow-sm' : 'bg-white border-[#E6E6E6]'}`}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => {
                          if (draggedTask) {
                            const oldPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
                            oldPlan[draggedTask.date] = oldPlan[draggedTask.date].filter(t => t.id !== draggedTask.id);
                            oldPlan[dateStr] = [...(oldPlan[dateStr] || []), { ...draggedTask, date: dateStr }];
                            localStorage.setItem("sp_study_plan", JSON.stringify(oldPlan));
                            setDraggedTask(null);
                            fetchDailyTasks();
                          }
                        }}
                      >
                        <div className={`p-4 border-b ${isToday ? 'border-[#4A3728]/10' : 'border-[#F1F1F1]'}`}>
                          <p className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">{format(date, "EEE")}</p>
                          <p className="text-[18px] font-black text-[#111111]">{format(date, "d")}</p>
                        </div>
                        <div className="p-2 space-y-2">
                          {tasks.map(task => (
                            <div 
                              key={task.id} 
                              draggable
                              onClick={() => navigate("/session", { state: { task: { ...task, date: dateStr }, dateKey: dateStr } })}
                              className={`p-3 rounded-xl border bg-white border-[#E6E6E6] shadow-sm cursor-pointer hover:scale-[1.02] hover:border-[#4A3728] transition-all ${task.status === 'completed' ? 'opacity-50' : ''}`}
                            >
                              <p className="text-[10px] font-black text-[#A3A3A3] uppercase truncate">{task.subjectName}</p>
                              <p className="text-[12px] font-bold text-[#4A3728] truncate">{task.topicName}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {buildMonthGrid().map((date, idx) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const tasks = fullPlan[dateStr] || [];
                    const isToday = isSameDay(date, new Date());
                    const isCurrentMonth = isSameMonth(date, monthDate);
                    return (
                      <div 
                        key={idx} 
                        className={`min-h-[100px] p-2 rounded-lg border transition-all ${!isCurrentMonth ? 'opacity-30' : isToday ? 'border-[#4A3728] bg-gray-50' : 'bg-white border-[#E6E6E6]'}`}
                        onClick={() => { setSelectedDate(date); setViewMode('week'); setWeekStart(startOfWeek(date, { weekStartsOn: 1 })); }}
                      >
                        <p className="text-[12px] font-black">{format(date, "d")}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {tasks.slice(0, 3).map((t, i) => <div key={i} className="w-1 h-1 rounded-full bg-[#4A3728]" />)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-10">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[13px] font-black uppercase tracking-widest">Today's Focus</h3>
                  <button onClick={() => setShowAddTaskModal(true)} className="p-2 bg-[#F1F1F1] rounded-lg text-[#4A3728]"><Plus size={16} /></button>
                </div>
                <div className="space-y-4">
                  {dailyTasks.map(task => (
                    <div key={task.id} className="p-5 rounded-xl border border-[#E6E6E6] bg-white hover:border-[#4A3728] transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div onClick={() => navigate("/session", { state: { task, dateKey: format(selectedDate, "yyyy-MM-dd") } })} className="cursor-pointer">
                          <p className="text-[10px] font-black text-[#A3A3A3] uppercase tracking-widest">{task.subjectName}</p>
                          <h4 className="text-[15px] font-black text-[#4A3728] tracking-tight hover:text-[var(--primary)]">{task.topicName}</h4>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {[
                          { id: 'video', label: 'Watch', icon: Zap, tab: 'overview' },
                          { id: 'notes', label: 'Notes', icon: FileText, tab: 'notes' },
                          { id: 'mcqs', label: 'MCQs', icon: CheckCircle, tab: 'stats' }
                        ].map(st => (
                          <button 
                            key={st.id}
                            onClick={() => navigate("/session", { state: { task, dateKey: format(selectedDate, "yyyy-MM-dd"), initialTab: st.tab } })}
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border bg-gray-50 text-[#6B6B6B] border-gray-100 hover:border-[#4A3728] transition-all hover:bg-white shadow-sm"
                          >
                            <st.icon size={10} />
                            <span className="text-[9px] font-black uppercase">{st.label}</span>
                          </button>
                        ))}
                      </div>
                      {task.status !== 'completed' && (
                        <button onClick={() => navigate("/session", { state: { task } })} className="w-full mt-4 py-2 border border-[#4A3728] text-[#4A3728] rounded-lg text-[11px] font-bold hover:bg-[#4A3728] hover:text-white transition-all">
                          Resume Full Session
                        </button>
                      )}
                    </div>
                  ))}
                  {dailyTasks.length === 0 && (
                    <div className="text-center py-10">
                      <EmptyState title="No tasks" subtitle="Time to recharge." compact />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </AnimatedPage>
  );
};

export default StudyPlanner;
