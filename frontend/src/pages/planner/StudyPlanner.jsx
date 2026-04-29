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
import PomodoroTimer from "../../components/PomodoroTimer";

const DIFFICULTY_HOURS = { Hard: 1.5, Medium: 1, Easy: 0.75 };

function generateStudyPlan(subjects, examDateStr, hoursPerDay) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(examDateStr);
  examDate.setHours(0, 0, 0, 0);
  const totalDays = Math.max(1, Math.ceil((examDate - today) / 86400000));

  const allTopics = [];
  subjects.forEach((subj) => {
    subj.topics.forEach((topic) => {
      if (topic.done || topic.status === "COMPLETED") return;
      const fallbackHours = DIFFICULTY_HOURS[subj.difficulty] || 1;
      allTopics.push({
        subjectName: subj.name,
        topicName: topic.name,
        difficulty: subj.difficulty || "Medium",
        durationHours: topic.estimatedHours ? parseFloat(topic.estimatedHours) : fallbackHours,
        priority: topic.status === "IN_PROGRESS" ? 0 : 1,
      });
    });
  });

  if (allTopics.length === 0) return {};

  allTopics.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const dw = { Hard: 0, Medium: 1, Easy: 2 };
    return (dw[a.difficulty] ?? 1) - (dw[b.difficulty] ?? 1);
  });

  const plan = {};
  let dayIdx = 0;
  let dayHours = 0;

  allTopics.forEach((topic) => {
    const dateKey = format(addDays(today, dayIdx), "yyyy-MM-dd");
    if (!plan[dateKey]) plan[dateKey] = [];

    if (dayHours + topic.durationHours > hoursPerDay && plan[dateKey].length > 0) {
      dayIdx = Math.min(dayIdx + 1, totalDays - 1);
      dayHours = 0;
    }

    const finalDate = format(addDays(today, dayIdx), "yyyy-MM-dd");
    if (!plan[finalDate]) plan[finalDate] = [];

    plan[finalDate].push({
      id: Date.now() + Math.random(),
      subjectName: topic.subjectName,
      topicName: topic.topicName,
      durationHours: topic.durationHours,
      difficulty: topic.difficulty,
      status: "pending",
      isBacklog: false,
    });
    dayHours += topic.durationHours;

    if (dayHours >= hoursPerDay) {
      dayIdx = Math.min(dayIdx + 1, totalDays - 1);
      dayHours = 0;
    }
  });

  return plan;
}

const StudyPlanner = () => {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyTasks, setDailyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroTask, setPomodoroTask] = useState("Study Session");
  const [viewMode, setViewMode] = useState("week");
  const [monthDate, setMonthDate] = useState(new Date());
  const [showGenModal, setShowGenModal] = useState(false);
  const [genHours, setGenHours] = useState(user?.studyHoursPerDay || 4);
  const [genExamDate, setGenExamDate] = useState(user?.examDate || "");
  const [hasPlan, setHasPlan] = useState(true);
  const [selectedGenSubjects, setSelectedGenSubjects] = useState([]);
  const [hoveredCalDate, setHoveredCalDate] = useState(null);

  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ subjectName: "", topicName: "", durationHours: 1 });

  useEffect(() => { setWeekDates(getWeekDates(weekStart)); }, [weekStart]);
  useEffect(() => { fetchDailyTasks(); }, [selectedDate]);

  useEffect(() => {
    if (showGenModal) {
      const subs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
      setSelectedGenSubjects(subs.map((s) => s.id));
    }
  }, [showGenModal]);

  const fetchDailyTasks = async () => {
    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const localPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
      if (localPlan[dateStr] && localPlan[dateStr].length > 0) {
        setDailyTasks(localPlan[dateStr]);
        setHasPlan(true);
        setLoading(false);
        return;
      }
      const res = await plannerService.getDailyPlan(dateStr);
      setDailyTasks(res.data && res.data.length > 0 ? res.data : []);
      if (res.data && res.data.length > 0) setHasPlan(true);
    } catch {
      setDailyTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = () => {
    if (!genExamDate) { toast.error("Please set your exam date."); return; }
    if (selectedGenSubjects.length === 0) { toast.error("Please select at least one subject."); return; }

    let subs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
    subs = subs.filter((s) => selectedGenSubjects.includes(s.id));

    const plan = generateStudyPlan(subs, genExamDate, genHours);
    const totalSessions = Object.values(plan).reduce((a, d) => a + d.length, 0);

    if (totalSessions === 0) { toast.error("No topics found to schedule."); return; }

    const existingPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    const mergedPlan = { ...plan };
    Object.keys(existingPlan).forEach((dateKey) => {
      const completedTasks = existingPlan[dateKey].filter(t => t.status === "completed");
      if (completedTasks.length > 0) {
        mergedPlan[dateKey] = [...completedTasks, ...(mergedPlan[dateKey] || [])];
      }
    });

    localStorage.setItem("sp_study_plan", JSON.stringify(mergedPlan));
    setHasPlan(true);
    updateUser({ examDate: genExamDate });
    syncToTimetable(mergedPlan);
    setShowGenModal(false);
    toast.success("Schedule generated successfully!");
    fetchDailyTasks();
  };

  const handleAddTask = () => {
    if (!newTask.subjectName || !newTask.topicName) { toast.error("Please fill all fields."); return; }
    
    const dateStr = selectedDate.toISOString().split("T")[0];
    const existingPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    const dayTasks = existingPlan[dateStr] || [];
    
    const taskToAdd = {
      id: Date.now(),
      ...newTask,
      status: "pending",
      isBacklog: false
    };

    existingPlan[dateStr] = [...dayTasks, taskToAdd];
    localStorage.setItem("sp_study_plan", JSON.stringify(existingPlan));
    
    setShowAddTaskModal(false);
    setNewTask({ subjectName: "", topicName: "", durationHours: 1 });
    toast.success("Task added to schedule!");
    fetchDailyTasks();
  };

  const syncToTimetable = async (plan) => {
    try {
      const toastId = toast.loading("Syncing to Timetable...");
      const existingSlots = await timetableService.getSlots();
      for (const s of existingSlots) await timetableService.deleteSlot(s.id);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newSlots = [];
      for (let i = 0; i < 7; i++) {
        const d = addDays(today, i);
        const dateKey = format(d, "yyyy-MM-dd");
        const dayTasks = plan[dateKey] || [];
        let startHour = 17;
        for (const task of dayTasks) {
          if (task.status === "completed") continue;
          const duration = parseFloat(task.durationHours || 1);
          const endHour = startHour + duration;
          let dayIso = d.getDay();
          if (dayIso === 0) dayIso = 7;

          newSlots.push({
            dayOfWeek: dayIso,
            startTime: `${String(Math.floor(startHour)).padStart(2, "0")}:00:00`,
            endTime: `${String(Math.floor(endHour)).padStart(2, "0")}:00:00`,
            subjectName: task.subjectName,
            color: "#111111",
            label: task.topicName,
          });
          startHour = endHour;
        }
      }
      for (const slot of newSlots) await timetableService.createSlot(slot);
      toast.success("Timetable synced!", { id: toastId });
    } catch (err) { toast.error("Failed to sync timetable."); }
  };

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));
  const goToday = () => { setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 })); setSelectedDate(new Date()); };

  const buildMonthGrid = () => {
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const gridStart = startOfWeek(mStart, { weekStartsOn: 1 });
    const gridEnd = addDays(startOfWeek(mEnd, { weekStartsOn: 1 }), 6);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  };

  const fullPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");

  return (
    <AnimatedPage>
      {showPomodoro && <PomodoroTimer taskName={pomodoroTask} onClose={() => setShowPomodoro(false)} />}

      {/* Generate Schedule Modal */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-2xl w-full max-w-lg p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#4A3728] tracking-tight">Generate Plan</h2>
              <button onClick={() => setShowGenModal(false)} className="text-[#6B6B6B] hover:text-[#4A3728]"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider mb-3 block">Exam Date</label>
                <input type="date" value={genExamDate} onChange={(e) => setGenExamDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider mb-3 block">Daily Study Limit: {genHours}h</label>
                <input type="range" min={1} max={12} step={0.5} value={genHours} onChange={(e) => setGenHours(Number(e.target.value))} className="w-full accent-[#4A3728]" />
              </div>
              <div className="flex gap-4">
                <button onClick={handleGeneratePlan} className="btn-primary flex-1">Create Schedule</button>
                <button onClick={() => setShowGenModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-2xl w-full max-w-md p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#4A3728] tracking-tight">Add Study Session</h2>
              <button onClick={() => setShowAddTaskModal(false)} className="text-[#6B6B6B] hover:text-[#4A3728]"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Subject</label>
                <input 
                  type="text" 
                  value={newTask.subjectName} 
                  onChange={(e) => setNewTask({...newTask, subjectName: e.target.value})} 
                  placeholder="e.g. Mathematics"
                  className="input-field" 
                />
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Topic</label>
                <input 
                  type="text" 
                  value={newTask.topicName} 
                  onChange={(e) => setNewTask({...newTask, topicName: e.target.value})} 
                  placeholder="e.g. Calculus Integration"
                  className="input-field" 
                />
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Duration: {newTask.durationHours}h</label>
                <input 
                  type="range" min={0.5} max={6} step={0.5} 
                  value={newTask.durationHours} 
                  onChange={(e) => setNewTask({...newTask, durationHours: parseFloat(e.target.value)})} 
                  className="w-full accent-[#4A3728]" 
                />
              </div>
              <div className="flex gap-4">
                <button onClick={handleAddTask} className="btn-primary flex-1">Add to Schedule</button>
                <button onClick={() => setShowAddTaskModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navbar title="Study Planner" subtitle="Manage your weekly study routine" />
      <div className="p-6 lg:p-10 animate-fade-in max-w-[1400px] mx-auto">
        
        {/* Controls */}
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
              <button onClick={() => setViewMode("week")} className={`px-4 py-1.5 rounded-[6px] text-[12px] font-bold transition-all ${viewMode === "week" ? "bg-white text-[#4A3728] shadow-sm" : "text-[#6B6B6B]"}`}>Week</button>
              <button onClick={() => setViewMode("month")} className={`px-4 py-1.5 rounded-[6px] text-[12px] font-bold transition-all ${viewMode === "month" ? "bg-white text-[#4A3728] shadow-sm" : "text-[#6B6B6B]"}`}>Month</button>
            </div>
            <button onClick={() => setShowGenModal(true)} className="btn-primary text-[13px] flex items-center gap-2"><CalIcon size={16} /> Generate Plan</button>
          </div>
        </div>

        {/* View Mode Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            {viewMode === "month" ? (
              <div className="card">
                <div className="grid grid-cols-7 mb-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                    <div key={d} className="text-center text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {buildMonthGrid().map((date, i) => {
                    const isToday = isSameDay(date, new Date());
                    const isSelected = isSameDay(date, selectedDate);
                    const hasTasks = !!fullPlan[format(date, "yyyy-MM-dd")];
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded-[8px] border transition-all flex flex-col items-center justify-center gap-1 ${
                          isSelected ? "border-[#4A3728] bg-[#4A3728] text-white shadow-lg" : 
                          isToday ? "border-[#4A3728] text-[#4A3728] bg-gray-50" : 
                          "border-[#E6E6E6] text-[#6B6B6B] hover:border-[#4A3728] hover:text-[#4A3728]"
                        }`}
                      >
                        <span className="text-[14px] font-bold">{format(date, "d")}</span>
                        {hasTasks && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#0369A1]'}`} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {weekDates.map((date, i) => {
                  const isToday = isDateToday(date);
                  const isSelected = isSameDay(date, selectedDate);
                  const dateKey = format(date, "yyyy-MM-dd");
                  const tasks = fullPlan[dateKey] || [];
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`flex items-center justify-between p-5 rounded-xl border transition-all ${
                        isSelected ? "bg-white border-[#4A3728] shadow-md" : "bg-white border-[#E6E6E6] hover:border-[#4A3728]"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="text-left w-12">
                          <p className={`text-[11px] font-bold uppercase tracking-widest ${isSelected ? 'text-[#4A3728]' : 'text-[#6B6B6B]'}`}>{format(date, "EEE")}</p>
                          <p className={`text-[20px] font-bold leading-none mt-1 ${isSelected ? 'text-[#4A3728]' : 'text-[#4A3728]'}`}>{format(date, "d")}</p>
                        </div>
                        <div className="h-8 w-px bg-[#E6E6E6]" />
                        <div className="text-left">
                          <p className="text-[14px] font-bold text-[#4A3728]">{tasks.length} Sessions</p>
                          <p className="text-[12px] text-[#6B6B6B] font-medium">{tasks.reduce((a,t)=>a+(t.durationHours||0),0)}h total study time</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className={isSelected ? 'text-[#4A3728]' : 'text-[#E6E6E6]'} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Daily Detail Side */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h3 className="text-[15px] font-bold text-[#4A3728]">{format(selectedDate, "EEEE")}</h3>
                  <p className="text-[12px] text-[#6B6B6B] font-medium">{format(selectedDate, "MMMM d, yyyy")}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowAddTaskModal(true)} className="p-2 text-[#6B6B6B] hover:text-[#4A3728] transition-transform hover:scale-110 duration-300" title="Add Task"><Plus size={18} /></button>
                  <button onClick={() => setShowPomodoro(true)} className="p-2 text-[#6B6B6B] hover:text-[#4A3728] transition-transform hover:scale-110 duration-300" title="Pomodoro Timer"><Clock size={18} /></button>
                </div>
              </div>

              <div className="space-y-3">
                {dailyTasks.map((task) => (
                  <div key={task.id} className="p-4 border border-[#E6E6E6] rounded-[10px] hover:border-[#4A3728] transition-all group hover:scale-[1.02] duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">{task.subjectName}</span>
                      <span className="badge-info !text-[10px] !px-2 !py-0.5">{task.durationHours}h</span>
                    </div>
                    <p className="text-[14px] font-bold text-[#4A3728] leading-tight mb-4">{task.topicName}</p>
                    {task.status === 'completed' ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 size={14} />
                        <span className="text-[12px] font-bold">Completed</span>
                      </div>
                    ) : (
                      <button onClick={() => navigate("/session", { state: { task } })} className="w-full btn-primary !py-2 text-[12px] flex items-center justify-center gap-2">
                        <Play size={14} fill="currentColor" /> Start Session
                      </button>
                    )}
                  </div>
                ))}
                {dailyTasks.length === 0 && (
                  <div className="text-center py-10">
                    <EmptyState title="No tasks scheduled" subtitle="Time to recharge or plan ahead." compact />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default StudyPlanner;
