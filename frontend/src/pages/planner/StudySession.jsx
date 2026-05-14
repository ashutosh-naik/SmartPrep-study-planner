import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  HelpCircle,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Pause,
  Eye,
  BookOpen,
  Shield,
  TrendingUp,
  ChevronRight,
  Maximize2,
  Minimize2,
  Save,
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const TOPIC_PLAYLIST_MAP = {
  // Data Structures & Algorithms
  "data structures": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  "algorithms": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  "dsa": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  "arrays": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  "linked list": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  "stacks": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  "trees": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
  "graphs": "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",

  // Operating Systems
  "operating systems": "PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p",
  "os": "PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p",

  // Database Management System
  "database management": "PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y",
  "dbms": "PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y",
  "database": "PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y",
  "sql": "PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y",

  // Computer Networks
  "computer networks": "PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_",
  "cn": "PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_",
  "networking": "PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_",

  // Fallbacks for other common CS topics
  "java": "PLu0W_Vlzh9ZglpW0xSgEw95P6L8t8yB2G",
  "python": "PLGjplmpt1Vt3pIDr8xNNMC4rP06j2yVhF",
  "web development": "PLu0W_Vlzh9ZglpW0xSgEw95P6L8t8yB2G",
};

function findPlaylist(topic = "", subject = "") {
  const t = (topic || "").toLowerCase();
  const s = (subject || "").toLowerCase();
  
  // 1. Check for direct subject matches first (highest priority)
  const subjectMatch = Object.entries(TOPIC_PLAYLIST_MAP).find(([k]) => s.includes(k));
  if (subjectMatch) return subjectMatch[1];

  // 2. Check for topic name matches
  const topicMatch = Object.entries(TOPIC_PLAYLIST_MAP).find(([k]) => t.includes(k));
  if (topicMatch) return topicMatch[1];

  // 3. Global default (DSA)
  return "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz";
}

function fmtTime(s) {
  const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
  return h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

const THRESHOLD = 0.9;

function saveProgress(date, id, patch) {
  // 1. Update Study Plan
  const plan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
  let targetTask = null;
  if (plan[date]) {
    plan[date] = plan[date].map(t => {
      if (t.id === id) {
        targetTask = { ...t, ...patch };
        return targetTask;
      }
      return t;
    });
    localStorage.setItem("sp_study_plan", JSON.stringify(plan));
  }

  // 2. Update Subjects (Interconnectivity)
  if (targetTask) {
    const subjects = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
    const updatedSubjects = subjects.map(s => {
      if (s.name === targetTask.subjectName) {
        const updatedTopics = (s.topics || []).map(topic => {
          if (topic.name === targetTask.topicName || topic.title === targetTask.topicName) {
            return { 
              ...topic, 
              status: patch.status === "completed" ? "COMPLETED" : topic.status,
              done: patch.status === "completed" ? true : topic.done,
              notes: patch.notes || topic.notes,
              watchedSeconds: patch.watchedSeconds || topic.watchedSeconds
            };
          }
          return topic;
        });
        return { ...s, topics: updatedTopics };
      }
      return s;
    });
    localStorage.setItem("sp_subjects", JSON.stringify(updatedSubjects));
    
    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event('storage'));
  }
}

export default function StudySession() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState(state?.task);
  const [dateKey] = useState(state?.dateKey);
  const [dayTasks, setDayTasks] = useState([]);
  const [userNote, setUserNote] = useState("");
  const [activeTab, setActiveTab] = useState(state?.initialTab || "overview");
  const [showCelebration, setShowCelebration] = useState(false);
  const [watchedSec, setWatchedSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const playerRef = useRef(null);
  const prevTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const completionRef = useRef(false);

  const requiredSec = Math.round((task?.durationHours || 1) * 3600);
  const pct = Math.min(100, Math.round((watchedSec / requiredSec) * 100));

  useEffect(() => {
    if (!task) { navigate("/planner"); return; }
    const plan = JSON.parse(localStorage.getItem("sp_study_plan") || "{}");
    if (plan[dateKey]) {
      setDayTasks(plan[dateKey]);
      const s = plan[dateKey].find(t => t.id === task.id);
      if (s) { 
        setWatchedSec(s.watchedSeconds || 0); 
        setIsCompleted(s.status === "completed"); 
        completionRef.current = s.status === "completed"; 
        setUserNote(s.notes || "");
      }
    }
  }, [task, dateKey]);

  // Auto-save logic
  useEffect(() => {
    if (!task || !userNote) return;
    
    setIsSaving(true);
    const timer = setTimeout(() => {
      saveProgress(dateKey, task.id, { notes: userNote });
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [userNote, task, dateKey]);

  useEffect(() => {
    if (window.YT && window.YT.Player) { initPlayer(); return; }
    const t = document.createElement("script"); t.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(t);
    window.onYouTubeIframeAPIReady = initPlayer;
    return () => { window.onYouTubeIframeAPIReady = null; };
  }, []);

  function initPlayer() {
    if (playerRef.current) try { playerRef.current.destroy(); } catch {}
    playerRef.current = new window.YT.Player("yt-player", {
      height: "100%", width: "100%",
      playerVars: { listType: "playlist", list: findPlaylist(task?.topicName, task?.subjectName), autoplay: 1, modestbranding: 1, rel: 0 },
      events: { onStateChange: (e) => {
        if (e.data === 1) { setIsPlaying(true); startTimer(); }
        else { setIsPlaying(false); stopTimer(); }
      }}
    });
  }

  function startTimer() {
    stopTimer();
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const cur = playerRef.current.getCurrentTime();
        if (prevTimeRef.current !== null) {
          const delta = cur - prevTimeRef.current;
          if (delta >= 0.5 && delta <= 2.5) {
            setWatchedSec(p => {
              const n = p + 1;
              if (!completionRef.current && n >= requiredSec * THRESHOLD) { completionRef.current = true; finishSession(n); }
              return n;
            });
          }
        }
        prevTimeRef.current = cur;
      } catch {}
    }, 1000);
  }

  function stopTimer() { if (intervalRef.current) clearInterval(intervalRef.current); }

  const finishSession = useCallback((sec) => {
    stopTimer(); setIsPlaying(false); setIsCompleted(true); setShowCelebration(true);
    saveProgress(dateKey, task.id, { status: "completed", watchedSeconds: sec, completedAt: new Date().toISOString() });
    toast.success("Focus Session Mastered!");
    setTimeout(() => setShowCelebration(false), 4000);
  }, [dateKey, task?.id]);

  return (
    <AnimatedPage>
      <div className="flex flex-col h-screen bg-[#F7F7F5] overflow-hidden">
        
        {/* Header */}
        <div className="h-16 bg-white border-b border-[#E6E6E6] px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/planner")} className="text-[13px] font-bold text-[#6B6B6B] hover:text-[#4A3728] flex items-center gap-2">
              <ArrowLeft size={16} /> Exit
            </button>
            <div className="h-6 w-px bg-[#E6E6E6]" />
            <div>
              <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">{task.subjectName}</p>
              <h1 className="text-[14px] font-bold text-[#4A3728]">{task.topicName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsFocusMode(!isFocusMode)}
               className={`p-2 rounded-lg transition-all ${isFocusMode ? 'bg-[#4A3728] text-white' : 'bg-gray-50 text-gray-400 hover:text-[#4A3728]'}`}
               title="Toggle Focus Mode"
             >
                {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
             </button>
             <div className="px-3 py-1.5 bg-[#F9FAFB] border border-[#E6E6E6] rounded-[6px] text-[12px] font-bold font-mono text-[#4A3728]">
                {fmtTime(watchedSec)} / <span className="text-[#A3A3A3]">{fmtTime(requiredSec)}</span>
             </div>
             {isCompleted ? (
               <div className="badge-neutral !bg-[#4A3728] !text-white !border-[#4A3728] flex items-center gap-2"><CheckCircle2 size={14} /> Completed</div>
             ) : (
               <div className="badge-neutral flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#4A3728] animate-pulse' : 'bg-[#A3A3A3]'}`} />
                 {isPlaying ? 'Active Tracking' : 'Paused'}
               </div>
             )}
          </div>
        </div>

        {/* Global Progress */}
        <div className="h-1 bg-[#F1F1F1] w-full shrink-0">
          <div className="h-full bg-[#4A3728] transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Area */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="w-full bg-black shrink-0 aspect-video max-h-[65vh] relative">
               <div id="yt-player" className="absolute inset-0" />
               {isCompleted && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                       <CheckCircle2 size={48} className="text-white mx-auto mb-4" />
                       <h2 className="text-white text-[24px] font-bold">Focus Session Verified</h2>
                       <p className="text-[#A3A3A3] text-[13px] mt-2 font-medium">Topic marked as completed in your records.</p>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-10 max-w-4xl">
               <div className="flex border-b border-[#E6E6E6] gap-10 mb-8">
                  {['overview', 'notes', 'mcqs', 'pyqs', 'stats'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'border-b-2 border-[#4A3728] text-[#4A3728]' : 'text-[#A3A3A3] hover:text-[#4A3728]'}`}>
                       {t}
                    </button>
                  ))}
               </div>

               {activeTab === 'overview' && (
                 <div className="space-y-10 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="card p-6 border-[#E6E6E6]">
                          <h4 className="text-[12px] font-bold text-[#4A3728] uppercase tracking-widest mb-6 flex items-center gap-2"><HelpCircle size={16} /> Objectives</h4>
                          <ul className="space-y-4">
                             {["Master core theoretical foundations.", "Analyze standard algorithmic approaches.", "Practice practical implementations."].map((li, i) => (
                               <li key={i} className="text-[13px] text-[#6B6B6B] font-medium flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#4A3728] mt-1.5" /> {li}</li>
                             ))}
                          </ul>
                       </div>
                       <div className="card p-6 border-[#E6E6E6] bg-[#F9FAFB]">
                          <h4 className="text-[12px] font-bold text-[#4A3728] uppercase tracking-widest mb-6 flex items-center gap-2"><Shield size={16} /> Study Policy</h4>
                          <p className="text-[12px] text-[#6B6B6B] leading-relaxed font-medium">This session uses strict tracking. Manual completion is disabled. You must watch at least 90% of the allocated session time to verify progress.</p>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'notes' && (
                 <div className="animate-fade-in relative">
                    <textarea 
                      value={userNote} 
                      onChange={e => setUserNote(e.target.value)} 
                      placeholder="Capture key concepts and formulas..." 
                      className="input-field h-64 resize-none mb-4 p-6 text-[15px] leading-relaxed border-2 focus:border-[#4A3728]" 
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                       {isSaving ? (
                         <span className="text-[10px] font-bold text-[#A3A3A3] uppercase tracking-widest animate-pulse">Saving...</span>
                       ) : (
                         <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1">
                           <Save size={10} /> Saved
                         </span>
                       )}
                    </div>
                    <button onClick={() => toast.success("Draft saved to study bank")} className="btn-primary !w-auto px-8">Force Save</button>
                 </div>
               )}

               {activeTab === 'mcqs' && (
                 <div className="animate-fade-in text-center py-12">
                    <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-6">
                       <HelpCircle size={32} className="text-[#4A3728]" />
                    </div>
                    <h3 className="text-[18px] font-bold text-[#4A3728]">Topic-Wise MCQ Practice</h3>
                    <p className="text-[14px] text-[#6B6B6B] mt-2 mb-8 max-w-sm mx-auto">Validate your understanding of <b>{task.topicName}</b> with curated interactive questions.</p>
                    <button onClick={() => navigate("/tests", { state: { filter: task.subjectName } })} className="btn-primary !w-auto px-10">Start Practice</button>
                 </div>
               )}

               {activeTab === 'pyqs' && (
                 <div className="animate-fade-in text-center py-12">
                    <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-6">
                       <GraduationCap size={32} className="text-[#4A3728]" />
                    </div>
                    <h3 className="text-[18px] font-bold text-[#4A3728]">PYQ Archive: {task.subjectName}</h3>
                    <p className="text-[14px] text-[#6B6B6B] mt-2 mb-8 max-w-sm mx-auto">Review questions from the last 10 years of exams relating to this specific module.</p>
                    <button onClick={() => navigate("/pyqs", { state: { subject: task.subjectName } })} className="btn-primary !w-auto px-10">Access Library</button>
                 </div>
               )}

               {activeTab === 'stats' && (
                 <div className="animate-fade-in grid grid-cols-3 gap-6 text-center">
                    <div className="card hover:scale-105 transition-transform duration-300">
                       <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">Session Progress</p>
                       <p className="text-[24px] font-bold text-[#4A3728] mt-2">{pct}%</p>
                    </div>
                    <div className="card hover:scale-105 transition-transform duration-300">
                       <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">Active Time</p>
                       <p className="text-[24px] font-bold text-[#4A3728] mt-2">{fmtTime(watchedSec)}</p>
                    </div>
                    <div className="card hover:scale-105 transition-transform duration-300">
                       <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest">Target Time</p>
                       <p className="text-[24px] font-bold text-[#4A3728] mt-2">{fmtTime(requiredSec)}</p>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          {!isFocusMode && (
            <div className="w-80 bg-white border-l border-[#E6E6E6] p-6 hidden lg:flex flex-col animate-slide-in-right">
               <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-widest mb-6">Today's Curriculum</h3>
               <div className="space-y-3 flex-1 overflow-y-auto">
                  {dayTasks.map(t => (
                    <div key={t.id} className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] duration-300 ${t.id === task.id ? 'border-[#4A3728] bg-[#F9FAFB] shadow-md' : 'border-[#E6E6E6] hover:border-[#4A3728]'}`} onClick={() => setTask(t)}>
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-[#6B6B6B] uppercase">{t.subjectName}</span>
                          {t.status === 'completed' && <CheckCircle2 size={12} className="text-[#4A3728]" />}
                       </div>
                       <p className="text-[13px] font-bold text-[#4A3728]">{t.topicName || t.title}</p>
                       <p className="text-[11px] text-[#A3A3A3] mt-1 font-medium">{t.durationHours} hours</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </div>

        {/* Celebration */}
        {showCelebration && (
           <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center animate-fade-in">
              <div className="text-center max-w-sm">
                 <div className="text-[64px] mb-6">🏆</div>
                 <h2 className="text-[28px] font-bold text-[#4A3728] tracking-tight">Session Mastered</h2>
                 <p className="text-[#6B6B6B] text-[14px] mt-4 font-medium leading-relaxed">
                   You've maintained exceptional focus and completed the session for <b>{task.topicName || task.title}</b>.
                 </p>
                 <button onClick={() => navigate("/planner")} className="btn-primary mt-10 hover:scale-105 transition-transform">Return to Planner</button>
              </div>
           </div>
        )}
      </div>
    </AnimatedPage>
  );
}
