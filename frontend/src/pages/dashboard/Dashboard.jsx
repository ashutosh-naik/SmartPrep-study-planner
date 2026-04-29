import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  TrendingUp,
  CalendarDays,
  Clock,
  ArrowRight,
  CalendarCheck,
  FileText,
  BarChart3,
  RotateCcw,
  Plus,
  Flame,
  Star,
  Printer,
  Target,
  CheckCircle2,
  BookOpen,
  Play,
  Calendar as CalIcon,
  X,
  Zap,
} from "lucide-react";


import Navbar from "../../components/Navbar";
import ProgressBar from "../../components/ProgressBar";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import Modal from "../../components/Modal";
import { analyticsService } from "../../services/analyticsService";
import { taskService } from "../../services/taskService";
import { getDaysUntil, formatShortDate } from "../../utils/dateUtils";
import { addDays, format, startOfWeek } from "date-fns";
import toast from "react-hot-toast";

const DIFFICULTY_HOURS = { Hard: 1.5, Medium: 1, Easy: 0.75 };

function generateStudyPlan(subjects, examDateStr, hoursPerDay, userOptions = {}) {
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
    // If Priority is Hard Topics First
    if (userOptions?.priority === "Hard Topics First") {
      const dw = { Hard: 0, Medium: 1, Easy: 2 };
      if (a.difficulty !== b.difficulty) return (dw[a.difficulty] ?? 1) - (dw[b.difficulty] ?? 1);
    }
    
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

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem("sp_streak");
    if (!saved) return { count: 7, lastDate: new Date().toDateString() };
    return JSON.parse(saved);
  });

  const subjects = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
  const totalTopicsCount = subjects.reduce((acc, s) => acc + (s.topics ? s.topics.length : 0), 0);
  const completedTopicsCount = subjects.reduce((acc, s) => acc + (s.topics ? s.topics.filter(t => t.status === "COMPLETED" || t.done).length : 0), 0);
  const inProgressTopicsCount = subjects.reduce((acc, s) => acc + (s.topics ? s.topics.filter(t => t.status === "IN_PROGRESS").length : 0), 0);
  const completedTopicsPercent = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  const [goals, setGoals] = useState([]);
  const [totalStudyHours, setTotalStudyHours] = useState("0.0");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", targetDays: 10, subjectId: "" });
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [showDashboardCalendar, setShowDashboardCalendar] = useState(false);
  
  const [showGenModal, setShowGenModal] = useState(false);
  const [genHours, setGenHours] = useState(user?.studyHoursPerDay || 4);
  const [genExamDate, setGenExamDate] = useState(user?.examDate || "");
  const [genStrategy, setGenStrategy] = useState("Balanced");
  const [genPriority, setGenPriority] = useState("Balanced Coverage");
  const [selectedGenSubjects, setSelectedGenSubjects] = useState([]);
  
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ subjectName: "", topicName: "", durationHours: 1 });


  useEffect(() => {
    const today = new Date().toDateString();
    if (streak.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newCount = streak.lastDate === yesterday ? streak.count + 1 : 1;
      const updated = { count: newCount, lastDate: today };
      setStreak(updated);
      localStorage.setItem("sp_streak", JSON.stringify(updated));
    }
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await analyticsService.getDashboard();
        const localPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
        const todayStr = new Date();
        const offset = todayStr.getTimezoneOffset();
        const todayKey = new Date(todayStr.getTime() - (offset*60*1000)).toISOString().split("T")[0];
        const customTasks = await taskService.getCustomTasks("today");
        const customList = customTasks.data || [];

        const localTodayTasks = localPlan[todayKey] || [];
        setData({
          ...res.data,
          todaysTasks: [...(localTodayTasks.length > 0 ? localTodayTasks : (res.data?.todaysTasks || [])), ...customList]
        });
      } catch (err) {
        const localPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
        const todayStr = new Date();
        const offset = todayStr.getTimezoneOffset();
        const todayKey = new Date(todayStr.getTime() - (offset*60*1000)).toISOString().split("T")[0];
        
        let customList = [];
        try {
          const customRes = await taskService.getCustomTasks("today");
          customList = customRes.data || [];
        } catch { /* Silent */ }

        setData({
          overallProgress: 0,
          daysToExam: getDaysUntil(user?.examDate),
          studyHoursToday: 0,
          backlogCount: 0,
          todaysTasks: [...(localPlan[todayKey] || []), ...customList],
          readinessScore: 0,
          topicsCovered: 0,
          totalTopics: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchGoalsAndLogs = async () => {
        try {
            const { goalService } = await import('../../services/goalService');
            const { pomodoroService } = await import('../../services/pomodoroService');
            const fetchedGoals = await goalService.getGoals();
            setGoals(fetchedGoals);
            const logs = await pomodoroService.getLogs();
            const totalMins = logs.reduce((a, s) => a + (s.durationMinutes || 25), 0);
            setTotalStudyHours((totalMins / 60).toFixed(1));
        } catch { /* Silent fail */ }
    };
    
    fetchDashboard();
    fetchGoalsAndLogs();
  }, [user]);

  const missedTasks = (() => {
    const plan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    const todayStr = new Date().toISOString().split("T")[0];
    const missed = [];
    Object.entries(plan).forEach(([date, tasks]) => {
      if (date < todayStr) {
        tasks.forEach(t => { if (t.status !== "completed") missed.push(t); });
      }
    });
    return missed;
  })();

  const handleRecalibrate = () => {
    if (missedTasks.length === 0) { toast.success("You are on track! No rescheduling needed."); return; }
    
    // Auto-calculate required hours per day to finish on time
    const today = new Date();
    const examDate = new Date(genExamDate);
    const remainingDays = Math.max(1, Math.ceil((examDate - today) / 86400000));
    
    const totalRemainingHours = subjects.reduce((acc, s) => acc + (s.topics ? s.topics.filter(t => !t.done && t.status !== "COMPLETED").reduce((a, t) => a + (t.estimatedHours || 1), 0) : 0), 0);
    const recommendedHours = Math.min(12, Math.max(genHours, Math.ceil(totalRemainingHours / remainingDays)));
    
    setGenHours(recommendedHours);
    handleGeneratePlan(); // Re-run with recommended hours
  };

  const handleGeneratePlan = async () => {
    try {
      if (!genExamDate) { toast.error("Please set your exam date."); return; }
      
      const subs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
      if (subs.length === 0) { toast.error("Please add some subjects first."); return; }

      const plan = generateStudyPlan(subs, genExamDate, genHours, { strategy: genStrategy, priority: genPriority });
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
      
      // Sync to timetable
      try {
        const { timetableService } = await import('../../services/timetableService');
        const existingSlots = await timetableService.getSlots();
        for (const s of existingSlots) await timetableService.deleteSlot(s.id);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newSlots = [];
        for (let i = 0; i < 7; i++) {
          const d = addDays(today, i);
          const dateKey = format(d, "yyyy-MM-dd");
          const dayTasks = mergedPlan[dateKey] || [];
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
              color: "#4A3728",
              label: task.topicName,
            });
            startHour = endHour;
          }
        }
        for (const slot of newSlots) await timetableService.createSlot(slot);
        toast.success("Schedule generated and Timetable synced!");
      } catch (err) {
        console.error("Timetable sync error:", err);
        toast.success("Schedule generated successfully!");
      }

      setShowGenModal(false);
      window.location.reload(); 
    } catch (err) {
      console.error("Plan generation error:", err);
      toast.error("Failed to generate plan. Please check your subjects and topics.");
    }
  };

  const handleAddTask = () => {
    if (!newTask.subjectName || !newTask.topicName) { toast.error("Please fill all fields."); return; }
    
    const todayStr = new Date();
    const offset = todayStr.getTimezoneOffset();
    const todayKey = new Date(todayStr.getTime() - (offset*60*1000)).toISOString().split("T")[0];
    
    const existingPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    const dayTasks = existingPlan[todayKey] || [];
    
    const taskToAdd = {
      id: Date.now(),
      ...newTask,
      status: "pending",
      isBacklog: false
    };

    existingPlan[todayKey] = [...dayTasks, taskToAdd];
    localStorage.setItem("sp_study_plan", JSON.stringify(existingPlan));
    
    setShowAddTaskModal(false);
    setNewTask({ subjectName: "", topicName: "", durationHours: 1 });
    toast.success("Task added to today's schedule!");
    window.location.reload();
  };

  if (loading) {
    return (
      <AnimatedPage>
        <Navbar />
        <div className="p-8"><Skeleton className="w-full h-96 rounded-2xl" /></div>
      </AnimatedPage>
    );
  }

  const kpiCards = [
    { label: "Total Subjects", value: subjects.length, icon: BookOpen, trend: `${subjects.length} added`, link: "/subjects", color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Topics Completed", value: `${completedTopicsPercent}%`, icon: TrendingUp, trend: `${completedTopicsCount}/${totalTopicsCount} done`, color: "text-green-500", bg: "bg-green-50" },
    { label: "In Progress", value: inProgressTopicsCount, icon: Star, trend: "Currently studying", color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Study Hours", value: `${totalStudyHours}h`, icon: Clock, trend: "All-time logged", color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Daily Streak", value: `${streak.count}d`, icon: Flame, trend: "Current streak", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <AnimatedPage>
      <style>{`
        @media print {
          aside, nav, .no-print { display: none !important; }
          main { margin-left: 0 !important; }
          body { background: white !important; }
          .card { box-shadow: none !important; border: 1px solid #E6E6E6 !important; }
        }
      `}</style>
      <Navbar />

      {/* Generate Schedule Modal */}
      {showGenModal && (
        <div className="fixed inset-0 bg-[var(--primary-dark)]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-xl p-10 animate-scale-in relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--accent-gold)]" />
             
             <div className="flex justify-between items-center mb-8">
               <div>
                  <h2 className="text-2xl font-bold text-[var(--primary)] tracking-tight">Generate Study Protocol</h2>
                  <p className="text-[13px] text-[#6B6B6B] font-medium mt-1">Configure your adaptive learning path</p>
               </div>
               <button onClick={() => setShowGenModal(false)} className="w-10 h-10 rounded-full hover:bg-[#F1F1F1] flex items-center justify-center transition-colors">
                  <X size={20} className="text-[#6B6B6B]" />
               </button>
             </div>

             <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">Subject Domain</label>
                      <select value={newTask.subjectName} onChange={e => setNewTask(p => ({ ...p, subjectName: e.target.value }))} className="w-full p-4 rounded-xl border-[#E6E6E6] border-2 focus:border-[var(--primary)] outline-none font-bold text-[14px] bg-[#F9FAFB]">
                         <option value="">All Subjects</option>
                         {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">Target Exam</label>
                      <input type="date" value={genExamDate} onChange={e => setGenExamDate(e.target.value)} className="w-full p-4 rounded-xl border-[#E6E6E6] border-2 focus:border-[var(--primary)] outline-none font-bold text-[14px] bg-[#F9FAFB]" />
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">Strategic Approach</label>
                   <div className="grid grid-cols-2 gap-4">
                      {["Balanced", "Aggressive"].map(opt => (
                         <button key={opt} onClick={() => setGenStrategy(opt)} className={`p-4 rounded-xl border-2 transition-all text-left ${genStrategy === opt ? 'border-[var(--primary)] bg-[var(--primary)] text-white shadow-lg' : 'border-[#E6E6E6] hover:border-[var(--primary)] bg-white text-[#6B6B6B]'}`}>
                            <p className="text-[14px] font-bold">{opt}</p>
                            <p className={`text-[10px] mt-1 font-medium ${genStrategy === opt ? 'text-white/70' : 'text-[#A3A3A3]'}`}>{opt === "Balanced" ? "Spaced intervals for retention" : "High-intensity sprint coverage"}</p>
                         </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">Optimization Priority</label>
                   <div className="flex flex-wrap gap-3">
                      {["Hard Topics First", "Weak Areas", "Balanced"].map(opt => (
                         <button key={opt} onClick={() => setGenPriority(opt)} className={`px-5 py-3 rounded-full border-2 text-[12px] font-black uppercase tracking-wider transition-all ${genPriority === opt ? 'bg-[var(--accent-gold)] border-[var(--accent-gold)] text-[var(--primary)]' : 'bg-white border-[#E6E6E6] text-[#6B6B6B] hover:border-[#111111]'}`}>
                            {opt}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="pt-4 flex gap-4">
                   <button onClick={handleGeneratePlan} className="btn-primary flex-1 !py-5 text-[14px] uppercase tracking-widest font-black flex items-center justify-center gap-3">
                      <Zap size={18} className="text-[var(--accent-gold)]" />
                      Initialize Protocol
                   </button>
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
                  style={{ display: 'none' }} 
                  readOnly
                />
                <select 
                  value={newTask.subjectName} 
                  onChange={(e) => setNewTask({...newTask, subjectName: e.target.value})} 
                  className="input-field"
                >
                  <option value="">General (No Subject)</option>
                  {subjects.map(s => (
                    <option key={s.id || s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
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
                <button onClick={handleAddTask} className="btn-primary flex-1">Add to Today</button>
                <button onClick={() => setShowAddTaskModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 lg:p-10 animate-fade-in max-w-[1400px] mx-auto">
        {/* Welcome Section */}
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
          <div className="flex-1">
            <p className="text-[#6B6B6B] text-[13px] font-bold uppercase tracking-widest mb-2">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 className="text-[28px] font-bold text-[#4A3728] tracking-tight mb-4 transition-transform hover:scale-[1.01] duration-300">Good Morning, {user?.name?.split(' ')[0] || 'Student'}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="badge-warning">
                <CalendarDays size={12} className="mr-1.5" /> {user?.examDate ? getDaysUntil(user.examDate) : (data?.daysToExam || "—")} days to exam
              </span>
              <span className="badge-success">
                <Flame size={12} className="mr-1.5" /> {streak.count} day streak
              </span>
              <span className="badge-info">
                <Clock size={12} className="mr-1.5" /> {user?.studyHoursPerDay || 4}h daily goal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 no-print">
            <button onClick={() => setShowGenModal(true)} className="btn-secondary flex items-center gap-2 text-[13px] hover:scale-105 transition-transform duration-300">
              <Plus size={16} /> Generate Plan
            </button>
            <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-[13px] hover:scale-105 transition-transform duration-300">
              <Printer size={16} /> Export PDF
            </button>
            <Link to="/planner" className="btn-primary flex items-center gap-2 text-[13px]">
              View Schedule <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Adaptive Alert */}
        {missedTasks.length > 0 && (
          <div className="mb-10 bg-[var(--primary)] text-white rounded-2xl p-8 flex items-center justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-gold)] opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                <Zap size={28} className="text-[var(--accent-gold)]" />
              </div>
              <div>
                <h4 className="text-[16px] font-bold tracking-tight">Adaptive Calibration Required</h4>
                <p className="text-[13px] text-white/70 font-medium mt-1">Detected {missedTasks.length} deviations from your protocol. Re-optimize to stay on track.</p>
              </div>
            </div>
            <button onClick={handleRecalibrate} className="px-8 py-3 bg-[var(--accent-gold)] text-[var(--primary)] rounded-xl text-[13px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl relative z-10">
              Recalibrate Now
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            
            {/* KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {kpiCards.map((kpi, i) => (
                <div key={i} className="card p-5 group cursor-pointer hover:scale-105 hover:shadow-md transition-all duration-300" onClick={() => kpi.link && navigate(kpi.link)}>
                  <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color} mb-4 transition-transform group-hover:scale-110`}>
                    <kpi.icon size={20} strokeWidth={2.5} />
                  </div>
                  <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-1">{kpi.label}</p>
                  <p className="text-[24px] font-bold text-[#4A3728] tracking-tighter leading-none">{kpi.value}</p>
                  <p className="text-[10px] text-[#A3A3A3] font-medium mt-2">{kpi.trend}</p>
                </div>
              ))}
            </div>

            {/* Main Section Card */}
            {(() => {
              const todayDate = new Date();
              const offset = todayDate.getTimezoneOffset();
              const todayKey = new Date(todayDate.getTime() - (offset * 60 * 1000)).toISOString().split("T")[0];
              
              // Use the merged todaysTasks from our state (which includes custom tasks and local plan)
              const todaysTasks = data?.todaysTasks || [];

              const subjectPlanMap = {};
              todaysTasks.forEach(task => {
                const subj = task.subjectName || "General";
                if (!subjectPlanMap[subj]) subjectPlanMap[subj] = { topics: [], dates: [todayKey] };
                subjectPlanMap[subj].topics.push({ ...task, scheduledDate: todayKey });
              });

              const subjectEntries = Object.entries(subjectPlanMap);
              const hasPlan = subjectEntries.length > 0;

              const statusConfig = {
                completed:  { label: "Done",  pill: "bg-[#F1F1F1] text-[#444]", border: "border-[#E6E6E6]" },
                in_progress:{ label: "Active", pill: "bg-[#4A3728] text-white", border: "border-[#4A3728]" },
                upcoming:   { label: "Later", pill: "bg-[#F1F1F1] text-[#444]", border: "border-[#E6E6E6]" },
                pending:    { label: "Wait",  pill: "bg-[#F1F1F1] text-[#444]", border: "border-[#E6E6E6]" },
              };

              return (
                <div className="card !p-0 overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#E6E6E6] flex items-center justify-between bg-[#F9FAFB]">
                    <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                      <CalendarDays size={16} /> {showDashboardCalendar ? "Calendar View" : "Today's Plan"}
                    </h3>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setShowAddTaskModal(true)} className="text-[12px] font-bold text-[#4A3728] hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Task
                      </button>
                      <button onClick={() => setShowDashboardCalendar(v => !v)} className="text-[12px] font-bold text-[#4A3728] hover:underline">
                        {showDashboardCalendar ? "Back to list" : "Open Calendar"}
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                  {showDashboardCalendar ? (
                    /* Mini Calendar Placeholder - keeping structure, cleaning visuals */
                    <div className="text-center py-10 text-[#6B6B6B] text-[13px] font-medium italic">
                      Interactive Calendar view enabled. Click specific dates to see topics.
                    </div>
                  ) : hasPlan ? (
                    <div className="space-y-4">
                      {subjectEntries.map(([subjectName, { topics, dates }]) => {
                        const total = topics.length;
                        const completed = topics.filter(t => t.status === "completed").length;
                        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                        const isExpanded = expandedSubjects[subjectName];

                        return (
                          <div key={subjectName} className="border border-[#E6E6E6] rounded-[10px] overflow-hidden">
                            <button
                              onClick={() => setExpandedSubjects(prev => ({ ...prev, [subjectName]: !prev?.[subjectName] }))}
                              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-4 text-left">
                                <div className="w-2 h-2 rounded-full bg-[#4A3728]" />
                                <div>
                                  <p className="font-bold text-[14px] text-[#4A3728]">{subjectName}</p>
                                  <p className="text-[11px] text-[#6B6B6B] font-bold uppercase mt-0.5">{completed}/{total} Topics Completed</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-24 h-[4px] bg-[#E6E6E6] rounded-full overflow-hidden hidden sm:block">
                                  <div className="h-full bg-[#4A3728] transition-all duration-700" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-[11px] font-bold text-[#4A3728] w-8">{pct}%</span>
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="bg-[#F9FAFB] border-t border-[#E6E6E6] p-4 space-y-2">
                                {topics.map((task) => (
                                  <div key={task.id} className="flex items-center justify-between bg-white p-3 rounded-[8px] border border-[#E6E6E6]">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-4 h-4 rounded-full border-2 ${task.status === 'completed' ? 'bg-[#4A3728] border-[#4A3728]' : 'border-[#E6E6E6]'}`} />
                                      <span className={`text-[13px] font-medium ${task.status === 'completed' ? 'text-[#A3A3A3] line-through' : 'text-[#4A3728]'}`}>
                                        {task.title || task.topicName}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-tighter">{(task.durationHours || 0)}h</span>
                                      {task.status !== 'completed' && (
                                        <button onClick={() => navigate("/session", { state: { task } })} className="text-[11px] font-bold text-[#4A3728] border border-[#4A3728] px-3 py-1 rounded-[4px] hover:bg-[#4A3728] hover:text-white transition-all duration-300 hover:scale-105">
                                          Resume
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#6B6B6B] text-[13px] font-medium mb-4">No study plan generated yet.</p>
                      <Link to="/planner" className="btn-primary inline-flex">Get Started</Link>
                    </div>
                  )}
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="space-y-10">
            {/* Readiness Widget */}
            {(() => {
              const readiness = data?.readinessScore || 0;
              return (
                <div className="card flex flex-col items-center text-center p-8 hover:scale-[1.02] transition-transform duration-500">
                  <h3 className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider mb-8">Exam Readiness</h3>
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="#E6E6E6" strokeWidth="6" fill="transparent" />
                      <circle cx="80" cy="80" r="70" stroke="#4A3728" strokeWidth="6" fill="transparent" strokeDasharray="440" strokeDashoffset={440 - (440 * readiness) / 100} strokeLinecap="round" className="transition-all duration-1000" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[32px] font-bold text-[#4A3728] tracking-tighter">{readiness}%</span>
                      <span className="text-[10px] font-bold text-[#6B6B6B] uppercase">Prepared</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#6B6B6B] font-medium leading-relaxed px-4">
                    You are on track for your exam. Complete 5 more topics this week to reach 85% readiness.
                  </p>
                </div>
              );
            })()}

            {/* Quick Goals */}
            <div className="card">
              <h3 className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider mb-6">Weekly Goals</h3>
              <div className="space-y-6">
                {goals.slice(0, 3).map((g, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-bold text-[#4A3728]">{g.title}</span>
                      <span className="text-[11px] font-bold text-[#6B6B6B]">{g.progress || 0}%</span>
                    </div>
                    <div className="w-full h-[4px] bg-[#E6E6E6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4A3728] transition-all duration-700" style={{ width: `${g.progress || 0}%` }} />
                    </div>
                  </div>
                ))}
                {goals.length === 0 && <p className="text-[12px] text-[#6B6B6B] font-medium italic">No goals set for this week.</p>}
                <button onClick={() => setShowGoalModal(true)} className="w-full py-2 border border-dashed border-[#E6E6E6] rounded-[8px] text-[12px] font-bold text-[#6B6B6B] hover:text-[#4A3728] hover:border-[#4A3728] transition-all duration-300 hover:scale-105">
                  + Add Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
