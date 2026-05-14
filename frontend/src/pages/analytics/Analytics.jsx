import { useEffect, useState, useRef } from "react";
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  AlertCircle,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  ChevronRight,
  Printer,
  BarChart3
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import { analyticsService } from "../../services/analyticsService";
import toast from "react-hot-toast";

const Analytics = () => {
  const [perf, setPerf] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const dateRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perfRes, readyRes] = await Promise.all([
          analyticsService.getPerformance(),
          analyticsService.getReadiness(),
        ]);
        
        // Sync with local data if available
        const localSubs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
        if (localSubs.length > 0) {
          const subjectScores = localSubs.map(s => ({
            subject: s.name,
            score: s.topics ? Math.round((s.topics.filter(t => t.status === "COMPLETED" || t.done).length / s.topics.length) * 100) : 0
          }));
          const avg = Math.round(subjectScores.reduce((a, b) => a + b.score, 0) / subjectScores.length);
          
          setPerf({
            ...perfRes.data,
            avgScore: avg,
            subjectScores: subjectScores,
            examReadyPercentage: avg // Simple mapping
          });
        } else {
          setPerf(perfRes.data);
        }
        setReadiness(readyRes.data);
      } catch {
        const localSubs = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
        const subjectScores = localSubs.map(s => ({
          subject: s.name,
          score: s.topics ? Math.round((s.topics.filter(t => t.status === "COMPLETED" || t.done).length / s.topics.length) * 100) : 0
        }));
        const avg = subjectScores.length > 0 ? Math.round(subjectScores.reduce((a, b) => a + b.score, 0) / subjectScores.length) : 0;

        // Calculate score trends dynamically from completedAt dates
        const history = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dStr = d.toISOString().split('T')[0];
          
          // Count total completed up to this day
          const completedUpTo = localSubs.reduce((sum, s) => {
            return sum + (s.topics ? s.topics.filter(t => {
              if (t.status !== "COMPLETED" && !t.done) return false;
              if (!t.completedAt) return true; // Assume old completions
              return new Date(t.completedAt) <= d;
            }).length : 0);
          }, 0);
          
          const totalTopics = localSubs.reduce((sum, s) => sum + (s.topics?.length || 0), 0);
          const scoreAtDate = totalTopics > 0 ? Math.round((completedUpTo / totalTopics) * 100) : 0;
          
          history.push({ 
            week: i === 0 ? "Today" : `${i}d ago`, 
            score: scoreAtDate 
          });
        }

        setPerf({
          avgScore: avg,
          improvement: history.length > 1 ? (history[history.length - 1].score - history[0].score) : 0,
          bestScore: Math.max(...subjectScores.map(s => s.score), 0),
          examReadyPercentage: avg,
          scoreTrends: history,
          subjectScores: subjectScores,
        });
        setReadiness({ percentage: avg, topicsCovered: 0, totalTopics: 0, focusAreas: [], daysToExam: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <AnimatedPage>
        <Navbar title="Analytics" />
        <div className="p-8 space-y-8">
           <Skeleton className="w-full h-20 rounded-xl" />
           <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
           </div>
           <Skeleton className="w-full h-64 rounded-xl" />
        </div>
      </AnimatedPage>
    );
  }

  const stats = [
    { label: "Average Score", value: `${perf?.avgScore || 0}%`, icon: Target, trend: "+2.4%" },
    { label: "Improvement", value: `+${perf?.improvement || 0}%`, icon: TrendingUp, trend: "Stable" },
    { label: "Best Performance", value: `${perf?.bestScore || 0}%`, icon: Award, trend: "+5.0%" },
    { label: "Readiness Index", value: `${perf?.examReadyPercentage || 0}%`, icon: Zap, trend: "+8.1%" },
  ];

  const radarData = perf?.subjectScores?.map((s) => ({ subject: s.subject, score: s.score, fullMark: 100 })) || [];
  const sortedSubjects = [...(perf?.subjectScores || [])].sort((a, b) => b.score - a.score);
  const strongest = sortedSubjects[0];
  const weakest = sortedSubjects[sortedSubjects.length - 1];

  return (
    <AnimatedPage>
      <Navbar title="Analytics & Insights" subtitle="Deep dive into your performance metrics" />
      
      <div className="p-6 lg:p-10 animate-fade-in max-w-[1400px] mx-auto">
        
        {/* Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-[24px] font-bold text-[#4A3728] tracking-tight">Performance Summary</h2>
            <p className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-1">Updated as of today</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => window.print()} className="btn-secondary text-[13px] flex items-center gap-2">
               <Printer size={16} /> Print Report
             </button>
             <button className="btn-primary text-[13px] flex items-center gap-2">
               <Download size={16} /> Export Data
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="card group hover:border-[var(--accent-gold)] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${i === 3 ? 'bg-[#059669]/10' : 'bg-[#D4AF37]/10'}`}>
                   <s.icon size={18} className={i === 3 ? 'text-[#059669]' : 'text-[#D4AF37]'} />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.trend.startsWith('+') ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#F1F1F1] text-[#6B6B6B]'}`}>{s.trend}</span>
              </div>
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">{s.label}</p>
              <p className="text-[28px] font-bold text-[var(--primary)] tracking-tighter mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Forecast Banner */}
        <div className="card bg-[var(--primary)] text-white mb-10 p-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-gold)] opacity-5 rounded-full -mr-32 -mt-32" />
           <div className="relative z-10 flex flex-wrap items-center justify-between gap-8">
               <div className="max-w-2xl">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-[var(--accent-gold)] text-[var(--primary)] text-[10px] font-black uppercase tracking-widest rounded-sm">Preparation Status</div>
                    <h3 className="text-[14px] font-bold uppercase tracking-wider text-[#A3A3A3]">Readiness Guide</h3>
                 </div>
                 <p className="text-[20px] text-white leading-relaxed font-semibold">
                   {perf?.avgScore > 70 
                     ? `"You're tracking toward an exceptional success rate. Your velocity is optimal, focus on high-yield PYQs to secure top-tier results."`
                     : `"You're making steady progress. We recommend increasing focus on your weaker subjects to push your Mastery Index above 80%."`
                   }
                 </p>
              </div>
              <div className="text-right border-l border-white/10 pl-10">
                 <p className="text-[64px] font-bold text-[var(--accent-gold)] tracking-tighter leading-none">{perf?.examReadyPercentage || 0}%</p>
                 <p className="text-[11px] font-bold text-[#A3A3A3] uppercase mt-2 tracking-widest">Mastery Index</p>
              </div>
           </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
           <div className="card lg:col-span-2">
              <h3 className="text-[14px] font-bold text-[var(--primary)] uppercase tracking-wider mb-8 flex items-center gap-2">
                <TrendingUp size={16} className="text-[var(--accent-gold)]" /> Learning Velocity
              </h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={perf?.scoreTrends || []}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                       <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#6B6B6B' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#6B6B6B' }} />
                       <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E6E6E6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', backgroundColor: '#fff' }} />
                       <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={4} dot={{ fill: 'var(--accent-gold)', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, stroke: 'var(--primary)', strokeWidth: 3, fill: 'var(--accent-gold)' }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="card">
              <h3 className="text-[14px] font-bold text-[var(--primary)] uppercase tracking-wider mb-8 flex items-center gap-2">
                <BarChart3 size={16} className="text-[var(--accent-gold)]" /> Subject Equilibrium
              </h3>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="70%">
                       <PolarGrid stroke="#F1F1F1" />
                       <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 800, fill: '#1A1A1A' }} />
                       <Radar name="Mastery" dataKey="score" stroke="var(--primary)" fill="var(--accent-gold)" fillOpacity={0.2} strokeWidth={3} />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Focus Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="card">
              <h3 className="text-[14px] font-bold text-[var(--primary)] uppercase tracking-wider mb-8">Study Priority</h3>
               <div className="space-y-6">
                 {(perf?.subjectScores || []).sort((a,b) => a.score - b.score).slice(0, 3).map((t, i) => (
                    <div key={i}>
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[14px] font-bold text-[var(--primary)]">{t.subject}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm text-white ${t.score < 50 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                             {t.score < 50 ? 'Critical' : 'Review'}
                          </span>
                       </div>
                       <div className="w-full h-[8px] bg-[#F1F1F1] rounded-full overflow-hidden">
                          <div className={`h-full ${t.score < 50 ? 'bg-rose-500' : 'bg-amber-500'} transition-all duration-700`} style={{ width: `${t.score}%` }} />
                       </div>
                    </div>
                 ))}
                 {(perf?.subjectScores || []).length === 0 && (
                   <p className="text-[13px] text-gray-400 italic">Add subjects to see optimization priorities.</p>
                 )}
              </div>
           </div>

           <div className="card bg-[var(--primary-dark)] text-white p-10 border-none shadow-xl relative overflow-hidden">
              <div className="absolute bottom-0 right-0 p-4 opacity-10">
                 <Zap size={120} className="text-[var(--accent-gold)]" />
              </div>
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Lightbulb size={24} className="text-[var(--accent-gold)]" />
                 </div>
                 <h3 className="text-[14px] font-bold uppercase tracking-widest">Study Tips</h3>
              </div>
              <ul className="space-y-6">
                 {[
                    "Focus on difficult subjects when you have the most energy.",
                    "Take one full mock test every few days to build confidence.",
                    "Use the Notes & Flashcards section to memorize key formulas.",
                 ].map((tip, i) => (
                    <li key={i} className="flex gap-4 text-[15px] leading-relaxed text-[#A3A3A3] font-medium">
                       <span className="text-[var(--accent-gold)] font-black text-[12px] pt-1">0{i+1}</span>
                       {tip}
                    </li>
                 ))}
              </ul>
           </div>
        </div>

      </div>
    </AnimatedPage>
  );
};

export default Analytics;
