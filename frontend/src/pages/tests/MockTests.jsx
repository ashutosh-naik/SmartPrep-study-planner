import { useAuthStore } from '../../store/useAuthStore';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Star,
  Clock,
  FileText,
  Lock,
  ArrowRight,
  ChevronDown,
  Layout
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import { testService } from "../../services/testService";
import { formatMinutes } from "../../utils/calculationUtils";

const MockTests = () => {
  const [tests, setTests] = useState([]);
  const [summary, setSummary] = useState({ total: 0, completed: 0, avgScore: 0, timeSpent: 0 });
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const [testsRes, summaryRes] = await Promise.all([
          testService.getAllTests(),
          testService.getTestSummary(),
        ]);
        setTests(testsRes.data || []);
        setSummary(summaryRes.data || summary);
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    };
    fetchTests();
  }, []);

  const subjects = ["All", ...new Set(tests.map((t) => t.subjectName).filter(Boolean))];
  const allFiltered = activeTab === "All" ? tests : tests.filter((t) => t.subjectName === activeTab);
  const filtered = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  const stats = [
    { label: "Total Tests", value: summary.total, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Completed", value: summary.completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Avg Score", value: `${summary.avgScore}%`, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Time Logged", value: formatMinutes(summary.timeSpent), icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <AnimatedPage>
      <Navbar title="Mock Assessments" subtitle="Validate your knowledge with timed simulations" />
      
      <div className="p-6 lg:p-10 animate-fade-in max-w-[1400px] mx-auto">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s, i) => (
            <div key={i} className="card flex items-center gap-4 hover:scale-105 transition-all duration-300">
              <div className={`w-10 h-10 rounded-[8px] ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">{s.label}</p>
                <p className="text-[20px] font-bold text-[#4A3728] leading-none mt-1">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
           <div className="flex items-center gap-2">
              {subjects.map(s => (
                <button key={s} onClick={() => setActiveTab(s)} className={`px-4 py-1.5 rounded-[8px] text-[12px] font-bold transition-all ${activeTab === s ? "bg-[#111111] text-white" : "bg-white border border-[#E6E6E6] text-[#6B6B6B]"}`}>{s}</button>
              ))}
           </div>
           <p className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider">{allFiltered.length} assessments available</p>
        </div>

        {/* Test Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-[240px] rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((test) => (
              <div key={test.id} className="card group hover:border-[#4A3728] transition-all flex flex-col hover:scale-[1.02] duration-300">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      test.difficulty === 'Hard' ? 'bg-red-50 text-red-600 border-red-100' :
                      test.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {test.difficulty}
                    </span>
                    {test.isLocked && <Lock size={14} className="text-[#A3A3A3]" />}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#4A3728] leading-tight mb-2">{test.title}</h3>
                  <p className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mb-6">{test.subjectName}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1.5">
                      <FileText size={14} className="text-[#A3A3A3]" />
                      <span className="text-[12px] font-bold text-[#4A3728]">{test.totalQuestions} Qs</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#A3A3A3]" />
                      <span className="text-[12px] font-bold text-[#4A3728]">{test.durationMinutes}m</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F1F1F1]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">Status</span>
                    <span className="text-[12px] font-bold text-[#4A3728]">{test.attempted ? `Score: ${test.score}%` : 'Not Attempted'}</span>
                  </div>
                  {test.attempted && (
                    <div className="w-full h-[4px] bg-[#F1F1F1] rounded-full overflow-hidden mb-6">
                      <div className="h-full bg-green-500" style={{ width: `${test.score}%` }} />
                    </div>
                  )}
                  <button onClick={() => navigate(`/tests/${test.id}`)} disabled={test.isLocked} className={`btn-primary w-full text-[13px] flex items-center justify-center gap-2 ${test.isLocked ? '!bg-[#F1F1F1] !text-[#A3A3A3] !border-[#E6E6E6] cursor-not-allowed' : 'hover:scale-105'} transition-all duration-300`}>
                    {test.attempted ? 'Retake Assessment' : 'Start Simulation'} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
           <div className="mt-10 text-center">
              <button onClick={() => setVisibleCount(v => v + 6)} className="btn-secondary text-[13px] inline-flex items-center gap-2">
                 Load More Assessments <ChevronDown size={16} />
              </button>
           </div>
        )}

        {/* Global CTA */}
        <div className="mt-12 card bg-[#4A3728] text-white p-8 hover:scale-[1.01] transition-transform duration-500">
           <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                 <h3 className="text-[18px] font-bold mb-2 tracking-tight">Full Mock Examination</h3>
                 <p className="text-[13px] text-white/60 font-medium leading-relaxed">Simulate a real-world exam environment with 120 questions across all subjects.</p>
              </div>
              <button onClick={() => navigate("/tests/demo")} className="px-6 py-2.5 bg-white text-[#4A3728] rounded-[8px] text-[13px] font-bold hover:bg-[#F1F1F1] transition-all duration-300 hover:scale-110">
                 Launch Exam
              </button>
           </div>
        </div>

      </div>
    </AnimatedPage>
  );
};

export default MockTests;
