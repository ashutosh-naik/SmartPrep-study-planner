import { useState, useEffect, useRef } from "react";
import {
  X, Play, Pause, RotateCcw, Coffee, BookOpen, SkipForward,
  Volume2, VolumeX, Settings, Award, TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { pomodoroService } from "../services/pomodoroService";

const MODES = {
  work25: { label: "Focus 25", duration: 25 * 60, kind: "work" },
  work50: { label: "Deep 50", duration: 50 * 60, kind: "work" },
  short: { label: "Break 5", duration: 5 * 60, kind: "break" },
  long: { label: "Break 15", duration: 15 * 60, kind: "break" },
};

function playBeep(type = "done") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(type === "done" ? 880 : 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

const PomodoroTimer = ({ taskName = "Study Session", onClose }) => {
  const [mode, setMode] = useState("work25");
  const [timeLeft, setTimeLeft] = useState(MODES.work25.duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [todayStats, setTodayStats] = useState({ sessions: 0, minutes: 0 });
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const logs = await pomodoroService.getLogs();
        const today = new Date().toDateString();
        const todayLogs = logs.filter(e => new Date(e.completedAt).toDateString() === today);
        setTodayStats({ sessions: todayLogs.length, minutes: todayLogs.reduce((acc, log) => acc + log.durationMinutes, 0) });
      } catch {}
    })();
  }, []);

  const total = MODES[mode].duration;
  const progress = (timeLeft / total) * 100;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const radius = 90;
  const circumf = 2 * Math.PI * radius;
  const dashOffset = circumf - (progress / 100) * circumf;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(intervalRef.current); setRunning(false); handleEnd(); return 0; }
          return t - 1;
        });
      }, 1000);
    } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const handleEnd = () => {
    if (soundOn) playBeep("done");
    if (MODES[mode].kind === "work") {
      const newS = sessions + 1; setSessions(newS);
      const minutes = mode === "work50" ? 50 : 25;
      pomodoroService.createLog({ subjectName: taskName, durationMinutes: minutes, completedAt: new Date().toISOString() })
        .then(() => setTodayStats(p => ({ sessions: p.sessions + 1, minutes: p.minutes + minutes })));
      const next = newS % 4 === 0 ? "long" : "short";
      toast.success(`Focus session mastered! Take a break.`);
      setTimeout(() => switchMode(next), 1200);
    } else {
      toast.success("Ready to focus again?");
      setTimeout(() => switchMode("work25"), 1200);
    }
  };

  const switchMode = (m) => { setRunning(false); setMode(m); setTimeLeft(MODES[m].duration); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md p-4">
      <div className="card !p-0 w-full max-w-sm overflow-hidden border-[#111111] border-2 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="bg-[#111111] p-6 text-white flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3]">Focus Engine</p>
              <h2 className="text-[14px] font-bold truncate mt-1">{taskName}</h2>
           </div>
           <div className="flex gap-2">
              <button onClick={() => setSoundOn(!soundOn)} className="p-2 hover:bg-white/10 rounded-lg transition-all">{soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all"><X size={16} /></button>
           </div>
        </div>

        <div className="p-8">
           {/* Modes */}
           <div className="grid grid-cols-4 gap-2 mb-10">
              {Object.entries(MODES).map(([k, m]) => (
                <button key={k} onClick={() => switchMode(k)} className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${mode === k ? 'bg-[#111111] text-white shadow-lg' : 'bg-[#F1F1F1] text-[#6B6B6B] hover:text-[#111111]'}`}>
                   {m.label.split(' ')[1] || m.label.split(' ')[0]}
                </button>
              ))}
           </div>

           {/* Circle */}
           <div className="flex justify-center mb-10">
              <div className="relative">
                 <svg width="220" height="220" className="-rotate-90">
                    <circle cx="110" cy="110" r={radius} fill="none" stroke="#F1F1F1" strokeWidth="10" />
                    <circle cx="110" cy="110" r={radius} fill="none" stroke="#111111" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumf} strokeDashoffset={dashOffset} className="transition-all duration-1000" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[48px] font-bold text-[#111111] tracking-tighter leading-none">{mins}:{secs}</span>
                    <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mt-2">{MODES[mode].label}</span>
                    <span className="text-[10px] font-bold text-[#A3A3A3] uppercase mt-1">Cycle #{sessions + 1}</span>
                 </div>
              </div>
           </div>

           {/* Controls */}
           <div className="flex items-center justify-center gap-6 mb-10">
              <button onClick={() => setTimeLeft(MODES[mode].duration)} className="p-3 bg-[#F1F1F1] rounded-xl hover:bg-[#E6E6E6] transition-all"><RotateCcw size={20} /></button>
              <button onClick={() => setRunning(!running)} className="w-20 h-20 bg-[#111111] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                 {running ? <Pause size={32} fill="white" /> : <Play size={32} className="ml-1" fill="white" />}
              </button>
              <button onClick={() => switchMode(MODES[mode].kind === 'work' ? 'short' : 'work25')} className="p-3 bg-[#F1F1F1] rounded-xl hover:bg-[#E6E6E6] transition-all"><SkipForward size={20} /></button>
           </div>

           {/* Stats */}
           <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Sessions", value: todayStats.sessions, icon: BookOpen },
                { label: "Minutes", value: todayStats.minutes, icon: TrendingUp },
                { label: "Streak", value: sessions, icon: Award },
              ].map((s, i) => (
                <div key={i} className="bg-[#F9FAFB] border border-[#E6E6E6] rounded-xl p-3 text-center">
                   <p className="text-[18px] font-bold text-[#111111]">{s.value}</p>
                   <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mt-1">{s.label}</p>
                </div>
              ))}
           </div>

           {/* Cycle Tracking */}
           <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < (sessions % 4) ? 'bg-[#111111] scale-125' : 'bg-[#E6E6E6]'}`} />
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default PomodoroTimer;
