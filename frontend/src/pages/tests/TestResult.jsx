import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Minus,
  AlertCircle
} from "lucide-react";
import Loader from "../../components/Loader";
import AnimatedPage from "../../components/AnimatedPage";
import { testService } from "../../services/testService";

const TestResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQs, setExpandedQs] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (location.state?.demo && location.state?.result) {
      setResult(location.state.result);
      setLoading(false);
      return;
    }
    const fetchResult = async () => {
      try {
        const res = await testService.getTestResult(id);
        setResult(res.data);
      } catch { navigate("/tests"); }
      finally { setLoading(false); }
    };
    fetchResult();
  }, [id]);

  if (loading) return <Loader text="Analyzing performance data..." />;
  if (!result) return null;

  const percentage = result.percentage || 0;
  const grade = percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "F";
  const passed = percentage >= 50;
  const questions = result.questions || [];
  const displayQs = showAll ? questions : questions.slice(0, 5);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F7F7F5] py-10 px-6">
        <div className="max-w-[800px] mx-auto animate-fade-in">
          
          {/* Main Performance Card */}
          <div className="card !p-0 overflow-hidden mb-8 border-[#111111] border-2">
             <div className="bg-[#111111] p-10 text-center text-white relative">
                <div className="absolute top-6 right-6">
                   <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center font-bold text-[24px]">
                      {grade}
                   </div>
                </div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#A3A3A3] mb-4">Assessment Completed</p>
                <h1 className="text-[24px] font-bold tracking-tight mb-2">{result.testTitle}</h1>
                <p className="text-[14px] text-[#A3A3A3] font-medium">{result.subjectName}</p>
                <div className="mt-10 mb-2">
                   <span className="text-[84px] font-bold leading-none">{percentage}</span>
                   <span className="text-[24px] font-bold text-[#A3A3A3] ml-2">%</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4">
                   <div className={`px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${passed ? 'bg-white text-[#111111]' : 'bg-white/10 text-white'}`}>
                      {passed ? 'Verification Passed' : 'Assessment Failed'}
                   </div>
                </div>
             </div>
             
             <div className="p-10 grid grid-cols-4 gap-4 bg-white text-center">
                {[
                  { label: "Correct", value: result.score, icon: CheckCircle2 },
                  { label: "Accuracy", value: `${percentage}%`, icon: Trophy },
                  { label: "Time taken", value: `${result.timeTakenMinutes}m`, icon: Clock },
                  { label: "Velocity", value: `${Math.round((result.timeTakenMinutes*60)/questions.length)}s/q`, icon: TrendingUp },
                ].map((s, i) => (
                  <div key={i}>
                     <p className="text-[20px] font-bold text-[#111111]">{s.value}</p>
                     <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mt-1">{s.label}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Quick Insights Row */}
          <div className="grid grid-cols-3 gap-6 mb-10">
             {[
               { label: "Ranking Path", value: passed ? "Top 15%" : "Below Mean", desc: "Performance against cohort" },
               { label: "Retention", value: percentage >= 75 ? "High" : "Optimal", desc: "Conceptual understanding" },
               { label: "Status", value: passed ? "On Track" : "Action Required", desc: "Curriculum progress" },
             ].map((ins, i) => (
               <div key={i} className="card bg-white border-[#E6E6E6]">
                  <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1">{ins.label}</p>
                  <p className="text-[16px] font-bold text-[#111111]">{ins.value}</p>
                  <p className="text-[11px] text-[#A3A3A3] font-medium mt-1">{ins.desc}</p>
               </div>
             ))}
          </div>

          {/* Detailed Question Review */}
          <div className="card mb-10 bg-white">
             <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-widest mb-8">Performance Breakdown</h3>
             <div className="space-y-4">
                {displayQs.map((q, i) => {
                  const isCorrect = q.userAnswer === q.correctOption;
                  const expanded = expandedQs.has(i);
                  return (
                    <div key={i} className={`border rounded-xl transition-all overflow-hidden ${isCorrect ? 'border-[#E6E6E6]' : 'border-[#111111]'}`}>
                       <button onClick={() => { const next = new Set(expandedQs); if(next.has(i)) next.delete(i); else next.add(i); setExpandedQs(next); }} className="w-full flex items-center justify-between p-5 text-left bg-[#F9FAFB] hover:bg-[#F1F1F1]">
                          <div className="flex items-center gap-4">
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${isCorrect ? 'bg-[#111111] text-white' : 'bg-white border-[#111111] border text-[#111111]'}`}>
                                {isCorrect ? '✓' : '×'}
                             </div>
                             <p className="text-[14px] font-bold text-[#111111] truncate max-w-[400px]">{q.questionText}</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">{isCorrect ? 'Accurate' : 'Corrected'}</span>
                             {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                       </button>
                       {expanded && (
                         <div className="p-8 space-y-6 bg-white animate-fade-in">
                            <p className="text-[15px] font-medium text-[#111111] leading-relaxed">{q.questionText}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {["A", "B", "C", "D"].map(opt => {
                                 const isCorrectOpt = opt === q.correctOption;
                                 const isUserPick = opt === q.userAnswer;
                                 return (
                                   <div key={opt} className={`p-4 rounded-[8px] text-[13px] font-medium border flex items-center gap-4 ${isCorrectOpt ? 'bg-[#111111] text-white border-[#111111]' : isUserPick ? 'border-[#111111] text-[#111111]' : 'bg-[#F9FAFB] border-[#E6E6E6] text-[#6B6B6B]'}`}>
                                      <span className="font-bold opacity-60">{opt}.</span>
                                      <span className="flex-1">{q[`option${opt}`]}</span>
                                      {isCorrectOpt && <CheckCircle2 size={14} />}
                                      {isUserPick && !isCorrectOpt && <AlertCircle size={14} />}
                                   </div>
                                 );
                               })}
                            </div>
                            {q.explanation && (
                               <div className="mt-4 p-5 bg-[#F9FAFB] rounded-xl border-l-4 border-[#111111] text-[12px] text-[#6B6B6B] leading-relaxed">
                                  <span className="font-bold text-[#111111] block mb-1 uppercase tracking-widest text-[10px]">Technical Rationale</span>
                                  {q.explanation}
                               </div>
                            )}
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
             {questions.length > 5 && (
               <button onClick={() => setShowAll(!showAll)} className="w-full mt-6 pt-6 border-t border-[#F1F1F1] text-[12px] font-bold text-[#111111] uppercase tracking-widest flex items-center justify-center gap-2">
                  {showAll ? 'Collapse History' : `View All ${questions.length} Responses`}
               </button>
             )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4">
             <button onClick={() => navigate("/tests")} className="btn-secondary !py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-[12px] font-bold">
                <ArrowLeft size={16} /> Catalog
             </button>
             <button onClick={() => navigate(`/tests/${id}`)} className="btn-primary !py-4 flex items-center justify-center gap-2 uppercase tracking-widest text-[12px] font-bold">
                <RotateCcw size={16} /> Re-Attempt
             </button>
          </div>

        </div>
      </div>
    </AnimatedPage>
  );
};

export default TestResult;
