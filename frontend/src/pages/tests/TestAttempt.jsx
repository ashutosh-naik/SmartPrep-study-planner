import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Flag,
  X,
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import { testService } from "../../services/testService";
import toast from "react-hot-toast";

const ADAPTIVE_POOL = {
  EASY: [
    { id: "e1", type: "MCQ", difficulty: "Easy", questionText: "What is the time complexity of accessing an element in an array by index?", optionA: "O(1)", optionB: "O(n)", optionC: "O(log n)", optionD: "O(n^2)", correctOption: "A" },
    { id: "e2", type: "MCQ", difficulty: "Easy", questionText: "Which data structure uses LIFO ordering?", optionA: "Queue", optionB: "Stack", optionC: "Linked List", optionD: "Tree", correctOption: "B" },
    { id: "e3", type: "Theory", difficulty: "Easy", questionText: "Is a linked list stored in contiguous memory locations?", optionA: "Yes", optionB: "No", optionC: "Sometimes", optionD: "Only if sorted", correctOption: "B" },
  ],
  MEDIUM: [
    { id: "m1", type: "MCQ", difficulty: "Medium", questionText: "What is the time complexity of binary search on a sorted array?", optionA: "O(n)", optionB: "O(log n)", optionC: "O(n log n)", optionD: "O(1)", correctOption: "B" },
    { id: "m2", type: "Coding", difficulty: "Medium", questionText: "What will be the output of '5' + 3 in JavaScript?", optionA: "8", optionB: "53", optionC: "NaN", optionD: "Error", correctOption: "B" },
    { id: "m3", type: "MCQ", difficulty: "Medium", questionText: "Which traversal of a BST gives elements in sorted order?", optionA: "Pre-order", optionB: "Post-order", optionC: "In-order", optionD: "Level-order", correctOption: "C" },
  ],
  HARD: [
    { id: "h1", type: "Coding", difficulty: "Hard", questionText: "What is the time complexity of building a heap from an unsorted array of n elements?", optionA: "O(n log n)", optionB: "O(n)", optionC: "O(log n)", optionD: "O(n^2)", correctOption: "B" },
    { id: "h2", type: "MCQ", difficulty: "Hard", questionText: "Which algorithm is used to find the shortest path in a graph with negative weights but no negative cycles?", optionA: "Dijkstra", optionB: "Bellman-Ford", optionC: "Kruskal", optionD: "Prim", correctOption: "B" },
    { id: "h3", type: "Theory", difficulty: "Hard", questionText: "In the context of P vs NP, which of the following is TRUE?", optionA: "P = NP", optionB: "P is a subset of NP", optionC: "NP is a subset of P", optionD: "None of these", correctOption: "B" },
  ]
};

const MOCK_TESTS = {
  default: {
    id: "adaptive",
    title: "Adaptive Simulation — Phase I",
    subjectName: "Adaptive Mastery",
    durationMinutes: 45,
    maxQuestions: 10
  }
};

const TestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [currentQ, setCurrentQ] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("MEDIUM");
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAdaptive, setIsAdaptive] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const initAdaptiveTest = () => {
      const mock = MOCK_TESTS.default;
      setTest(mock);
      setTimeLeft(mock.durationMinutes * 60);
      
      // Initial question (Medium)
      const firstQ = ADAPTIVE_POOL.MEDIUM[Math.floor(Math.random() * ADAPTIVE_POOL.MEDIUM.length)];
      setAdaptiveQuestions([firstQ]);
      setLoading(false);
    };
    initAdaptiveTest();
    return () => clearInterval(timerRef.current);
  }, [id]);

  useEffect(() => {
    if (!test || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [test]);

  const handleNextAdaptive = () => {
    const currentQuestion = adaptiveQuestions[currentQ];
    const userAnswer = answers[currentQuestion.id];
    
    if (!userAnswer) { toast.error("Please answer before proceeding"); return; }
    
    // Determine next difficulty
    let nextDiff = currentDifficulty;
    if (userAnswer === currentQuestion.correctOption) {
      if (currentDifficulty === "EASY") nextDiff = "MEDIUM";
      else if (currentDifficulty === "MEDIUM") nextDiff = "HARD";
    } else {
      if (currentDifficulty === "HARD") nextDiff = "MEDIUM";
      else if (currentDifficulty === "MEDIUM") nextDiff = "EASY";
    }
    
    setCurrentDifficulty(nextDiff);

    // If last question, finish
    if (adaptiveQuestions.length >= test.maxQuestions) {
       setShowConfirm(true);
       return;
    }

    // Select next question from pool (avoid duplicates)
    const usedIds = adaptiveQuestions.map(aq => aq.id);
    const available = ADAPTIVE_POOL[nextDiff].filter(q => !usedIds.includes(q.id));
    
    // Fallback if difficulty exhausted
    let finalNext = available.length > 0 ? available : ADAPTIVE_POOL.MEDIUM.filter(q => !usedIds.includes(q.id));
    
    if (finalNext.length === 0) { setShowConfirm(true); return; }

    const nextQ = finalNext[Math.floor(Math.random() * finalNext.length)];
    setAdaptiveQuestions(prev => [...prev, nextQ]);
    setCurrentQ(v => v + 1);
  };

  const handleSubmit = useCallback(async () => {
    clearInterval(timerRef.current);
    const timeTakenMinutes = Math.max(1, Math.round(((test?.durationMinutes || 45) * 60 - timeLeft) / 60));

    if (isAdaptive) {
      const qs = adaptiveQuestions || [];
      const score = qs.filter(q => answers[q.id] === q.correctOption).length;
      
      // Attempt to save to database if id is a valid UUID
      try {
        if (id !== "adaptive") {
           await testService.submitTest(id, { score, timeTakenMinutes });
        }
      } catch (e) {
        console.error("Failed to save adaptive test score", e);
      }

      navigate(`/tests/${id}/result`, { state: { demo: true, result: { testTitle: test.title, subjectName: test.subjectName, score, totalMarks: qs.length, percentage: Math.round((score/qs.length)*100), questions: qs.map(q => ({...q, userAnswer: answers[q.id]})), timeTakenMinutes } } });
      return;
    }
    try {
      await testService.submitTest(id, { answers, score: Object.keys(answers).length, timeTakenMinutes });
      navigate(`/tests/${id}/result`);
    } catch { toast.error("Submission failed"); }
  }, [answers, id, isAdaptive, navigate, test, timeLeft, adaptiveQuestions]);

  if (loading) return (
    <div className="min-h-screen bg-[#F7F7F5] p-10 max-w-[1000px] mx-auto">
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );

  const questions = adaptiveQuestions || [];
  const q = questions[currentQ];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const answered = Object.keys(answers).length;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
        
        {/* Header HUD */}
        <div className="h-16 bg-white border-b border-[#E6E6E6] px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#4A3728] text-white rounded-[8px] flex items-center justify-center shadow-lg">
                 <BookOpen size={18} />
              </div>
              <div className="hidden sm:block">
                 <h1 className="text-[14px] font-bold text-[#4A3728] leading-none">{test.title}</h1>
                 <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-1">{test.subjectName} · Level {currentQ + 1}</p>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                    currentDifficulty === 'HARD' ? 'bg-red-50 text-red-600 border border-red-100' :
                    currentDifficulty === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    'bg-green-50 text-green-600 border border-green-100'
                 }`}>
                    {currentDifficulty} DIFFICULTY
                 </span>
                 <div className="w-32 h-[6px] bg-[#F1F1F1] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4A3728] transition-all" style={{ width: `${(questions.length / test.maxQuestions) * 100}%` }} />
                 </div>
                 <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">{questions.length}/{test.maxQuestions}</span>
              </div>
              <div className={`px-4 py-1.5 rounded-[6px] border flex items-center gap-2 font-mono text-[14px] font-bold ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-[#F9FAFB] border-[#E6E6E6] text-[#4A3728]'}`}>
                 <Clock size={16} /> {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
              </div>
              <button onClick={() => setShowConfirm(true)} className="btn-primary !w-auto !px-6 !py-2 text-[13px]">Finish Assessment</button>
           </div>
        </div>

        {/* Exam Body */}
        <div className="max-w-[1200px] mx-auto w-full p-6 lg:p-10 flex gap-10 flex-1">
           
           {/* Question Center */}
           <div className="flex-1 space-y-6">
              <div className="card border-[#E6E6E6] hover:shadow-xl transition-shadow duration-500">
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest bg-[#F1F1F1] px-3 py-1 rounded-full">
                         Question {currentQ + 1}
                      </span>
                      <span className="text-[11px] font-bold text-white uppercase tracking-widest bg-[#4A3728] px-3 py-1 rounded-full">
                         {q.type}
                      </span>
                    </div>
                    <button onClick={() => { const n = new Set(flagged); if(n.has(q.id)) n.delete(q.id); else n.add(q.id); setFlagged(n); }} className={`flex items-center gap-2 text-[11px] font-bold uppercase transition-all ${flagged.has(q.id) ? 'text-amber-600' : 'text-[#A3A3A3] hover:text-[#4A3728]'}`}>
                       <Flag size={14} /> {flagged.has(q.id) ? 'Flagged for Review' : 'Flag Question'}
                    </button>
                 </div>

                 <p className="text-[20px] font-bold text-[#4A3728] leading-relaxed mb-10">{q.questionText}</p>

                 <div className="space-y-4">
                    {["A", "B", "C", "D"].map(opt => {
                       const text = q[`option${opt}`];
                       if(!text) return null;
                       const selected = answers[q.id] === opt;
                       return (
                         <button key={opt} onClick={() => setAnswers({...answers, [q.id]: opt})} className={`w-full text-left p-6 rounded-xl border-2 transition-all flex items-center gap-6 group ${selected ? 'border-[#4A3728] bg-[#F9FAFB] shadow-md' : 'border-[#F1F1F1] hover:border-[#4A3728] bg-white'}`}>
                            <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[16px] transition-all ${selected ? 'bg-[#4A3728] text-white shadow-lg' : 'bg-[#F1F1F1] text-[#6B6B6B] group-hover:bg-[#4A3728] group-hover:text-white'}`}>{opt}</span>
                            <span className={`text-[16px] font-medium ${selected ? 'text-[#4A3728] font-bold' : 'text-[#6B6B6B]'}`}>{text}</span>
                            {selected && <CheckCircle2 size={20} className="text-[#4A3728] ml-auto" />}
                         </button>
                       );
                    })}
                 </div>

                 <div className="flex justify-between mt-12 pt-8 border-t border-[#F1F1F1]">
                    <button onClick={() => setCurrentQ(v => Math.max(0, v-1))} disabled={currentQ === 0} className="btn-secondary !w-auto px-8 flex items-center gap-2 hover:scale-105 transition-transform"><ChevronLeft size={16} /> Previous</button>
                    {currentQ < adaptiveQuestions.length - 1 ? (
                      <button onClick={() => setCurrentQ(v => v + 1)} className="btn-primary !w-auto px-10 flex items-center gap-2 hover:scale-105 transition-transform">Next Question <ChevronRight size={16} /></button>
                    ) : (
                      <button onClick={handleNextAdaptive} className="btn-primary !w-auto px-10 flex items-center gap-2 hover:scale-105 transition-transform shadow-lg bg-[#4A3728]">Submit & Get Next <ChevronRight size={16} /></button>
                    )}
                 </div>
              </div>
           </div>

           {/* Question Navigator */}
           <div className="w-64 hidden lg:block">
              <div className="card sticky top-28 border-[#E6E6E6]">
                 <h3 className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-6 text-center">Adaptive Progress</h3>
                 <div className="grid grid-cols-4 gap-2 mb-8">
                    {questions.map((_, i) => {
                       const qId = questions[i].id;
                       const isAns = !!answers[qId];
                       const isFlg = flagged.has(qId);
                       const isCur = i === currentQ;
                       return (
                         <button key={i} onClick={() => setCurrentQ(i)} className={`h-10 rounded-[8px] text-[12px] font-bold transition-all border ${isCur ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-md' : isFlg ? 'border-amber-400 text-amber-600 bg-amber-50' : isAns ? 'bg-[#F1F1F1] text-[#4A3728] border-[#E6E6E6]' : 'text-[#A3A3A3] border-[#E6E6E6] hover:border-[#4A3728]'}`}>
                            {i + 1}
                         </button>
                       );
                    })}
                 </div>
                 <div className="space-y-3 pt-6 border-t border-[#F1F1F1]">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#6B6B6B]">
                       <span>Attempted</span> <span>{answered}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#4A3728]">
                       <span>Difficulty</span> <span>{currentDifficulty}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Submit Modal */}
        {showConfirm && (
           <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
              <div className="card border-[#4A3728] border-2 max-w-md w-full p-10 text-center shadow-2xl">
                 <CheckCircle2 size={48} className="mx-auto mb-6 text-[#4A3728]" />
                 <h2 className="text-[24px] font-bold text-[#4A3728] mb-4">Assessment Complete</h2>
                 <p className="text-[14px] text-[#6B6B6B] font-medium leading-relaxed mb-8">
                    You have finished the adaptive simulation. Your results will determine your next mastery level.
                 </p>
                 <div className="flex flex-col gap-3">
                    <button onClick={handleSubmit} className="btn-primary py-4 hover:scale-105 transition-transform shadow-lg">View Detailed Results</button>
                    <button onClick={() => setShowConfirm(false)} className="btn-secondary py-4">Review Answers</button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </AnimatedPage>
  );
};

export default TestAttempt;
