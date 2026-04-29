import { useState } from "react";
import {
  Users,
  FileText,
  BarChart3,
  Plus,
  Upload,
  Eye,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";

const MOCK_STUDENTS = [
  { id: 1, name: "Priya Sharma", rollNo: "CS21001", progress: 94, streak: 42, tasksCompleted: 38, testAvg: 89, status: "On Track", lastActive: "2h ago" },
  { id: 2, name: "Rahul Verma", rollNo: "CS21002", progress: 79, streak: 15, tasksCompleted: 28, testAvg: 76, status: "On Track", lastActive: "5h ago" },
  { id: 3, name: "Anjali Gupta", rollNo: "CS21003", progress: 62, streak: 4, tasksCompleted: 19, testAvg: 61, status: "At Risk", lastActive: "1d ago" },
  { id: 4, name: "Karthik Nair", rollNo: "CS21004", progress: 88, streak: 30, tasksCompleted: 35, testAvg: 84, status: "On Track", lastActive: "1h ago" },
  { id: 5, name: "Sneha Patel", rollNo: "CS21005", progress: 45, streak: 2, tasksCompleted: 12, testAvg: 48, status: "Critical", lastActive: "3d ago" },
];

const MOCK_TESTS = [
  { id: 1, title: "Data Structures — Chapter 1", subject: "DSA", questions: 20, duration: 30, attempts: 4, avgScore: 74, created: "2 days ago" },
  { id: 2, title: "Operating Systems Concepts", subject: "OS", questions: 25, duration: 45, attempts: 3, avgScore: 68, created: "5 days ago" },
];

const StatusBadge = ({ status }) => {
  const isGood = status === "On Track";
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${isGood ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#6B6B6B] border-[#E6E6E6]'}`}>
      {status}
    </span>
  );
};

const InstructorPortal = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUpload, setShowUpload] = useState(false);
  const [newTest, setNewTest] = useState({ title: "", subject: "", questions: 20, duration: 30 });

  const avgProgress = Math.round(MOCK_STUDENTS.reduce((a, s) => a + s.progress, 0) / MOCK_STUDENTS.length);
  const atRisk = MOCK_STUDENTS.filter((s) => s.status !== "On Track").length;

  const TABS = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "students", label: "Student Roster", icon: Users },
    { id: "tests", label: "Assessments", icon: FileText },
  ];

  return (
    <AnimatedPage>
      <Navbar title="Instructor Console" subtitle="Administrative management and academic oversight" />
      
      <div className="p-6 lg:p-10 animate-fade-in max-w-[1200px] mx-auto">
        
        {/* Context Header */}
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-4">
              <div className="bg-[#111111] text-white px-4 py-2 rounded-[8px] font-bold text-[12px] flex items-center gap-2 uppercase tracking-widest shadow-lg">
                 <ShieldCheck size={16} /> Faculty Access
              </div>
              <p className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider">Computer Science · Sem VI</p>
           </div>
           <div className="flex items-center gap-2 text-[#6B6B6B]">
              <Clock size={14} /> <span className="text-[11px] font-bold uppercase">Last Sync: Just Now</span>
           </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-[#F1F1F1] p-1 rounded-[10px] mb-10 w-fit">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 px-6 py-2.5 rounded-[8px] text-[12px] font-bold transition-all ${activeTab === t.id ? "bg-white text-[#111111] shadow-sm" : "text-[#6B6B6B] hover:text-[#111111]"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-10">
           
           {activeTab === "overview" && (
             <div className="space-y-10 animate-fade-in">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   {[
                     { label: "Active Cohort", value: MOCK_STUDENTS.length, icon: Users },
                     { label: "Mean Progress", value: `${avgProgress}%`, icon: TrendingUp },
                     { label: "At Risk Count", value: atRisk, icon: AlertCircle },
                     { label: "System Uptime", value: "99.9%", icon: ShieldCheck },
                   ].map((s, i) => (
                     <div key={i} className="card flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[8px] bg-[#F1F1F1] flex items-center justify-center shrink-0">
                           <s.icon size={18} className="text-[#111111]" />
                        </div>
                        <div>
                           <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">{s.label}</p>
                           <p className="text-[20px] font-bold text-[#111111] leading-none mt-1">{s.value}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="card">
                   <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider mb-8">Cohort Syllabus Completion</h3>
                   <div className="space-y-6">
                      {MOCK_STUDENTS.map((s) => (
                        <div key={s.id} className="flex items-center gap-6">
                           <div className="w-32 text-[13px] font-bold text-[#111111] truncate">{s.name}</div>
                           <div className="flex-1 h-[6px] bg-[#F1F1F1] rounded-full overflow-hidden">
                              <div className="h-full bg-[#111111] transition-all duration-1000" style={{ width: `${s.progress}%` }} />
                           </div>
                           <div className="w-10 text-right text-[12px] font-bold text-[#111111]">{s.progress}%</div>
                           <StatusBadge status={s.status} />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {activeTab === "students" && (
             <div className="space-y-4 animate-fade-in">
                {MOCK_STUDENTS.map((s) => (
                  <div key={s.id} className="card hover:border-[#111111] transition-all">
                     <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[18px]">
                              {s.name[0]}
                           </div>
                           <div>
                              <h4 className="text-[16px] font-bold text-[#111111]">{s.name}</h4>
                              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-0.5">{s.rollNo} · Active {s.lastActive}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-12">
                           <div className="text-center">
                              <p className="text-[18px] font-bold text-[#111111]">{s.progress}%</p>
                              <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mt-1">Syllabus</p>
                           </div>
                           <div className="text-center">
                              <p className="text-[18px] font-bold text-[#111111]">{s.testAvg}%</p>
                              <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mt-1">Assessment</p>
                           </div>
                           <StatusBadge status={s.status} />
                           <button className="p-2 text-[#A3A3A3] hover:text-[#111111]"><ChevronRight size={20} /></button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           )}

           {activeTab === "tests" && (
             <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider">Assessment Repository</h3>
                   <button onClick={() => setShowUpload(!showUpload)} className="btn-primary !w-auto !px-6 flex items-center gap-2">
                      <Plus size={18} /> New Test
                   </button>
                </div>

                {showUpload && (
                   <div className="card border-2 border-[#111111] bg-[#F9FAFB] animate-fade-in space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#111111] uppercase tracking-widest">Assessment Title</label>
                            <input className="input-field" placeholder="e.g. Memory Management Unit" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#111111] uppercase tracking-widest">Subject Tag</label>
                            <input className="input-field" placeholder="e.g. OS" />
                         </div>
                      </div>
                      <div className="border-2 border-dashed border-[#E6E6E6] rounded-xl p-10 text-center hover:border-[#111111] transition-all cursor-pointer group">
                         <Upload size={32} className="mx-auto mb-4 text-[#A3A3A3] group-hover:text-[#111111]" />
                         <p className="text-[13px] font-bold text-[#111111]">Deploy Question Bank</p>
                         <p className="text-[11px] text-[#6B6B6B] mt-1">Accepts CSV, JSON, and DOCX formats</p>
                      </div>
                      <div className="flex gap-4">
                         <button onClick={() => { toast.success("Assessment deployed"); setShowUpload(false); }} className="btn-primary !w-auto !px-10">Deploy</button>
                         <button onClick={() => setShowUpload(false)} className="btn-secondary !w-auto !px-10">Discard</button>
                      </div>
                   </div>
                )}

                <div className="space-y-4">
                   {MOCK_TESTS.map((t) => (
                     <div key={t.id} className="card hover:border-[#111111] transition-all">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[#F1F1F1] rounded-[8px] flex items-center justify-center">
                                 <FileText size={18} className="text-[#111111]" />
                              </div>
                              <div>
                                 <h4 className="text-[15px] font-bold text-[#111111]">{t.title}</h4>
                                 <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-0.5">{t.subject} · {t.questions} Qs · {t.duration}m</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-10">
                              <div className="text-center">
                                 <p className="text-[16px] font-bold text-[#111111]">{t.attempts}</p>
                                 <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mt-0.5">Attempts</p>
                              </div>
                              <div className="text-center">
                                 <p className="text-[16px] font-bold text-[#111111]">{t.avgScore}%</p>
                                 <p className="text-[10px] font-bold text-[#A3A3A3] uppercase mt-0.5">Mean Score</p>
                              </div>
                              <button className="btn-secondary text-[12px] !py-2 !px-4 flex items-center gap-2"><Eye size={14} /> Analyze</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

        </div>
      </div>
    </AnimatedPage>
  );
};

export default InstructorPortal;
