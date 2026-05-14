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
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { analyticsService } from "../../services/analyticsService";
import { taskService } from "../../services/taskService";
import { getDaysUntil, formatShortDate } from "../../utils/dateUtils";
import { addDays, format, startOfWeek } from "date-fns";
import toast from "react-hot-toast";

const DIFFICULTY_HOURS = { Hard: 1.5, Medium: 1, Easy: 0.75 };

// Helper to build out a student's schedule roadmap based on remaining topics
const buildStudentRoadmap = (subjects, examDateStr, hoursPerDay, userOptions = {}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(examDateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  const daysLeft = Math.max(1, Math.ceil((targetDate - today) / 86400000));

  let pendingTopics = [];
  
  // gather everything that isn't finished yet
  subjects.forEach((subj) => {
    (subj.topics || []).forEach((topic) => {
      if (topic.done || topic.status === "COMPLETED") return;
      
      const defaultTime = DIFFICULTY_HOURS[subj.difficulty] || 1;
      pendingTopics.push({
        subjectName: subj.name,
        topicName: topic.name,
        difficulty: subj.difficulty || "Medium",
        durationHours: topic.estimatedHours ? parseFloat(topic.estimatedHours) : defaultTime,
        priority: topic.status === "IN_PROGRESS" ? 0 : 1, // prioritize stuff already started
      });
    });
  });

  if (!pendingTopics.length) return {};

  // sort them based on strategy
  pendingTopics.sort((a, b) => {
    if (userOptions?.priority === "Hard Topics First") {
      const weights = { Hard: 0, Medium: 1, Easy: 2 };
      if (a.difficulty !== b.difficulty) return (weights[a.difficulty] ?? 1) - (weights[b.difficulty] ?? 1);
    }
    
    if (a.priority !== b.priority) return a.priority - b.priority;
    const w = { Hard: 0, Medium: 1, Easy: 2 };
    return (w[a.difficulty] ?? 1) - (w[b.difficulty] ?? 1);
  });

  const generatedPlan = {};
  let currentDayOffset = 0;
  let hoursAccumulated = 0;

  pendingTopics.forEach((t) => {
    let dayStr = format(addDays(today, currentDayOffset), "yyyy-MM-dd");
    
    // move to next day if this topic pushes us over the limit (and we already have stuff today)
    if (hoursAccumulated + t.durationHours > hoursPerDay && (generatedPlan[dayStr] && generatedPlan[dayStr].length > 0)) {
      currentDayOffset = Math.min(currentDayOffset + 1, daysLeft - 1);
      hoursAccumulated = 0;
      dayStr = format(addDays(today, currentDayOffset), "yyyy-MM-dd");
    }

    if (!generatedPlan[dayStr]) generatedPlan[dayStr] = [];

    generatedPlan[dayStr].push({
      id: Date.now() + Math.random(),
      subjectName: t.subjectName,
      topicName: t.topicName,
      durationHours: t.durationHours,
      difficulty: t.difficulty,
      status: "pending",
      isBacklog: false,
    });
    
    hoursAccumulated += t.durationHours;

    if (hoursAccumulated >= hoursPerDay) {
      currentDayOffset = Math.min(currentDayOffset + 1, daysLeft - 1);
      hoursAccumulated = 0;
    }
  });

  return generatedPlan;
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // UI States
  const [loading, setLoading] = useState(true);
  const [showDashboardCalendar, setShowDashboardCalendar] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  
  // Data States
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [totalStudyHours, setTotalStudyHours] = useState("0.0");
  
  // Modal States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  // Form States
  const [newGoal, setNewGoal] = useState({ title: "", targetDays: 10, subjectId: "" });
  const [newTask, setNewTask] = useState({ subjectName: "", topicName: "", durationHours: 1 });
  
  // Optimization Options
  const [genHours, setGenHours] = useState(user?.studyHoursPerDay || 4);
  const [genExamDate, setGenExamDate] = useState(user?.examDate || "");
  const [genStrategy, setGenStrategy] = useState("Balanced");
  const [genPriority, setGenPriority] = useState("Balanced Coverage");
  const [selectedGenSubjects, setSelectedGenSubjects] = useState([]);

  // Calculate local stats
  const subjects = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
  const totalTopicsCount = subjects.reduce((sum, s) => sum + (s.topics ? s.topics.length : 0), 0);
  const completedTopicsCount = subjects.reduce((sum, s) => sum + (s.topics ? s.topics.filter(t => t.status === "COMPLETED" || t.done).length : 0), 0);
  const inProgressTopicsCount = subjects.reduce((sum, s) => sum + (s.topics ? s.topics.filter(t => t.status === "IN_PROGRESS").length : 0), 0);
  const completedTopicsPercent = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;
  
  const activeTopic = subjects.flatMap(s => (s.topics || []).filter(t => t.status === "IN_PROGRESS").map(t => ({ ...t, subjectName: s.name })))[0];

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

  const getGreeting = () => {
    const quotes = [
      { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
      { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
      { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { text: "Your education is a dress rehearsal for a life that is yours to lead.", author: "Nora Ephron" },
      { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" }
    ];
    // Change quote every 24 hours based on date
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return quotes[dayOfYear % quotes.length];
  };

  const dailyQuote = getGreeting();

  const radarData = subjects.map(s => ({
    subject: s.name.length > 12 ? s.name.substring(0, 10) + ".." : s.name,
    score: s.topics ? Math.round((s.topics.filter(t => t.status === "COMPLETED" || t.done).length / s.topics.length) * 100) : 0,
    fullMark: 100
  })).slice(0, 6);

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

  const executeScheduleGeneration = async () => {
    try {
      if (!genExamDate) { toast.error("Please set your exam date."); return; }
      
      const allSubs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
      if (allSubs.length === 0) { toast.error("Please add some subjects first."); return; }

      const subs = selectedGenSubjects.length > 0 
        ? allSubs.filter(s => selectedGenSubjects.includes(String(s.id)))
        : allSubs;

      const plan = buildStudentRoadmap(subs, genExamDate, genHours, { strategy: genStrategy, priority: genPriority });
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
      } catch (err) {
        console.error("Timetable sync error:", err);
      }

      // Update local state without reload
      const todayKey = format(new Date(), "yyyy-MM-dd");
      const updatedTodaysTasks = mergedPlan[todayKey] || [];
      setData(prev => ({
        ...prev,
        todaysTasks: updatedTodaysTasks
      }));

      setShowGenModal(false);
      toast.success("Schedule optimized successfully!");    } catch (err) {
      console.error("Plan generation error:", err);
      toast.error("Failed to generate plan.");
    }
  };

  const handleAddTask = () => {
    if (!newTask.subjectName || !newTask.topicName) { toast.error("Please fill all fields."); return; }
    const todayStr = new Date();
    const offset = todayStr.getTimezoneOffset();
    const todayKey = new Date(todayStr.getTime() - (offset*60*1000)).toISOString().split("T")[0];
    const existingPlan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    const dayTasks = existingPlan[todayKey] || [];
    const taskToAdd = { id: Date.now(), ...newTask, status: "pending", isBacklog: false };
    existingPlan[todayKey] = [...dayTasks, taskToAdd];
    localStorage.setItem("sp_study_plan", JSON.stringify(existingPlan));
    setShowAddTaskModal(false);
    toast.success("Task added!");
    window.location.reload();
  };

  const handleSubtaskToggle = async (task, subtaskId, currentStatus) => {
    try {
      const plan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
      Object.keys(plan).forEach(date => {
        plan[date] = plan[date].map(t => {
          if (t.id === task.id) return { ...t, [`${subtaskId}Completed`]: !currentStatus };
          return t;
        });
      });
      localStorage.setItem("sp_study_plan", JSON.stringify(plan));

      const localSubs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
      const updatedSubs = localSubs.map(s => {
        if (s.name === task.subjectName) {
          const updatedTopics = (s.topics || []).map(topic => {
            if (topic.name === task.topicName || topic.title === task.topicName) {
              return { ...topic, [`${subtaskId}Completed`]: !currentStatus };
            }
            return topic;
          });
          return { ...s, topics: updatedTopics };
        }
        return s;
      });
      localStorage.setItem("sp_subjects", JSON.stringify(updatedSubs));

      const isLocalId = typeof task.id === 'number' && task.id > 1000000000000;
      if (!isLocalId) {
        try { await taskService.updateSubtask(task.id, subtaskId, !currentStatus); } catch (e) {}
      }
      toast.success(`${subtaskId.toUpperCase()} saved!`);
      window.location.reload();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <AnimatedPage>
        <Navbar />
        <div className="p-8"><Skeleton className="w-full h-96 rounded-2xl" /></div>
      </AnimatedPage>
    );
  }

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
      <Navbar title="Student Dashboard" />

      {/* Modals are kept simple for brevity but maintain functional logic */}
      {showGenModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-xl p-10 animate-scale-in">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-[#4A3728]">Generate Study Plan</h2>
                <button onClick={() => setShowGenModal(false)}><X size={20} /></button>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-[#A3A3A3]">Exam Date</label>
                      <input type="date" value={genExamDate} onChange={e => setGenExamDate(e.target.value)} className="w-full p-4 rounded-xl border-[#E6E6E6] border-2 outline-none font-bold text-[14px]" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase text-[#A3A3A3]">Daily Hours</label>
                      <input type="number" value={genHours} onChange={e => setGenHours(e.target.value)} className="w-full p-4 rounded-xl border-[#E6E6E6] border-2 outline-none font-bold text-[14px]" />
                   </div>
                </div>
                <button onClick={executeScheduleGeneration} className="btn-primary w-full !py-5 flex items-center justify-center gap-3">
                   <Zap size={18} /> Generate Plan
                </button>
             </div>
          </div>
        </div>
      )}

      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-[#4A3728]">Add Study Session</h2>
              <button onClick={() => setShowAddTaskModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <select value={newTask.subjectName} onChange={(e) => setNewTask({...newTask, subjectName: e.target.value})} className="w-full p-4 rounded-xl border-2">
                  <option value="">General</option>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              <input type="text" value={newTask.topicName} onChange={(e) => setNewTask({...newTask, topicName: e.target.value})} placeholder="Topic Name" className="w-full p-4 rounded-xl border-2" />
              <button onClick={handleAddTask} className="btn-primary w-full">Add Task</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6 lg:p-10 animate-fade-in max-w-[1400px] mx-auto pb-24">
        
        {/* SaaS Premium Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 className="text-[22px] font-bold text-[#4A3728] tracking-tight leading-tight italic">
              "{dailyQuote.text}"
            </h2>
            <p className="text-[13px] text-[#D4AF37] font-black uppercase tracking-widest mt-2">— {dailyQuote.author}</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => {
                 const allSubs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
                 if (allSubs.length === 0) {
                   toast.error("Please add subjects before generating a plan.");
                   navigate("/subjects");
                   return;
                 }
                 setShowGenModal(true);
               }} 
               className="btn-primary !w-auto px-6 flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
             >
               <Zap size={16} /> Optimise Schedule
             </button>
          </div>
        </div>

        {/* Hero & Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 relative group overflow-hidden rounded-[24px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A3728] to-[#2D1F16] shadow-2xl" />
            <div className="relative p-10 flex flex-col h-full min-h-[300px] justify-between">
              <div>
                <div className="px-3 py-1 bg-[#D4AF37] text-[#4A3728] text-[10px] font-black uppercase tracking-widest rounded-sm w-fit mb-6">Current Focus</div>
                {activeTopic ? (
                  <div className="max-w-xl">
                    <h1 className="text-[36px] font-bold text-white tracking-tight leading-tight mb-2">{activeTopic.topicName}</h1>
                    <p className="text-white/60 text-[16px] font-medium">Part of <span className="text-[#D4AF37]">{activeTopic.subjectName}</span> curriculum</p>
                  </div>
                ) : (
                  <div className="max-w-xl">
                    <h1 className="text-[32px] font-bold text-white tracking-tight leading-tight mb-2">Ready to start?</h1>
                    <p className="text-white/60 text-[15px] font-medium">Select a topic from your plan to begin.</p>
                  </div>
                )}
              </div>
              <div className="mt-8">
                {activeTopic ? (
                  <button onClick={() => navigate("/session", { state: { task: activeTopic } })} className="px-8 py-4 bg-[#D4AF37] text-[#4A3728] rounded-xl font-black text-[14px] flex items-center gap-3 hover:bg-white transition-all shadow-xl">
                    Resume Learning <ArrowRight size={18} />
                  </button>
                ) : (
                  <button onClick={() => document.getElementById('todays-plan')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-black text-[13px] hover:bg-white/20 transition-all">
                    View Plan <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Zap size={220} className="text-white" /></div>
          </div>

          <div className="card !p-8 flex flex-col justify-between">
            <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#D4AF37]" /> Subject Mastery
            </h3>
            <div className="h-[200px] w-full">
              {radarData.length >= 3 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#F1F1F1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fontWeight: 700, fill: '#6B6B6B' }} />
                    <Radar name="Mastery" dataKey="score" stroke="#4A3728" fill="#D4AF37" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-4 bg-gray-50 rounded-xl border border-dashed">
                  <p className="text-[11px] text-[#A3A3A3] italic">Add 3+ subjects to see radar.</p>
                </div>
              )}
            </div>
            <button onClick={() => navigate("/analytics")} className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest mt-4">Full Insights →</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Subjects", value: subjects.length, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Mastery", value: `${completedTopicsPercent}%`, icon: Target, color: "text-green-600", bg: "bg-green-50" },
            { label: "Active", value: inProgressTopicsCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Hours", value: `${totalStudyHours}h`, icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat, i) => (
            <div key={i} className="card !p-6 hover:shadow-lg transition-all group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-[28px] font-bold text-[#4A3728] mt-1 tracking-tighter">{stat.value}</h4>
            </div>
          ))}
        </div>

        {/* Plan Section */}
        <div id="todays-plan" className="card !p-0 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between bg-[#F9FAFB]">
                <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                    <CalendarCheck size={16} /> Today's Learning Path
                </h3>
                <button onClick={() => setShowAddTaskModal(true)} className="text-[12px] font-bold text-[#4A3728] flex items-center gap-1">
                    <Plus size={14} /> Add Session
                </button>
            </div>
            <div className="p-6">
                {(data?.todaysTasks || []).length > 0 ? (
                    <div className="space-y-4">
                        {(data.todaysTasks).map((task, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 border rounded-xl hover:border-[#4A3728] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-[#FAF9F6] text-[#4A3728]'}`}>
                                        {task.status === 'completed' ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}
                                    </div>
                                    <div>
                                        <h4 className={`text-[15px] font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-[#4A3728]'}`}>{task.topicName}</h4>
                                        <p className="text-[12px] text-[#6B6B6B] font-medium">{task.subjectName} • {task.durationHours}h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {['video', 'notes', 'mcqs'].map(st => (
                                        <button 
                                            key={st}
                                            onClick={() => handleSubtaskToggle(task, st, task[`${st}Completed`])}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${task[`${st}Completed`] ? 'bg-[#4A3728] border-[#4A3728] text-white' : 'bg-white text-gray-300 hover:border-[#4A3728]'}`}
                                        >
                                            {st === 'video' ? <Play size={12} fill={task[`${st}Completed`] ? 'white' : 'none'} /> : st === 'notes' ? <FileText size={12} /> : <Target size={12} />}
                                        </button>
                                    ))}
                                    <button onClick={() => navigate("/session", { state: { task } })} className="ml-4 p-2 text-[#4A3728] hover:bg-gray-100 rounded-lg">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-[#F1F1F1] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap size={24} className="text-[#A3A3A3]" />
                        </div>
                        <h3 className="text-[18px] font-bold text-[#4A3728]">No tasks scheduled</h3>
                        <p className="text-[14px] text-[#6B6B6B] mt-1 max-w-xs mx-auto">Generate a new study plan to populate your dashboard with personalized sessions.</p>
                        <button 
                          onClick={() => {
                            const allSubs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
                            if (allSubs.length === 0) {
                              toast.error("Please add subjects first.");
                              navigate("/subjects");
                              return;
                            }
                            setShowGenModal(true);
                          }} 
                          className="mt-6 btn-primary !w-auto px-8"
                        >
                          Generate Now
                        </button>
                    </div>
                )}
            </div>
        </div>

      </div>
    </AnimatedPage>
  );
}
