import {
  GraduationCap,
  BookOpen,
  Clock,
  Target,
  Users,
  CheckCircle2,
  CalendarDays,
  BarChart3,
  FileText,
  Layers,
  Star,
  ArrowRight,
  RotateCcw,
  Play,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: Layers, title: "Mission Control", desc: "Granular topic-based execution with Watch-Read-Solve tracking." },
  { icon: RotateCcw, title: "Backlog Recovery", desc: "Intelligent auto-rescheduling engine for missed study missions." },
  { icon: Play, title: "Verified Learning", desc: "Automated progress tracking based on actual video watch-time." },
  { icon: Target, title: "Precision Planning", desc: "Topic-based scheduling that respects your daily hour limits." },
  { icon: CheckCircle2, title: "Task Tracking", desc: "Prioritized daily objectives with smart status synchronization." },
  { icon: FileText, title: "Mock Assessments", desc: "Timed exam simulations with detailed performance metrics." },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Data-driven insights into your learning velocity and mastery." },
  { icon: CalendarDays, title: "Weekly Timetable", desc: "Structure your recurring schedule for maximum efficiency." },
];

export default function About() {
  return (
    <AnimatedPage>
      <Navbar title="About SmartPrep" subtitle="The engine behind structured academic success" />

      <div className="p-6 lg:p-10 animate-fade-in max-w-[1200px] mx-auto">

        {/* Hero Section */}
        <div className="bg-[#4A3728] rounded-2xl p-10 sm:p-16 text-white mb-10 shadow-2xl overflow-hidden relative">
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <GraduationCap size={32} className="text-[#D4AF37]" />
                </div>
                <div>
                  <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-none">SmartPrep</h1>
                  <p className="text-[#D4AF37] font-bold text-[14px] uppercase tracking-widest mt-2">Structured Smart Execution Engine</p>
                </div>
              </div>
              <p className="text-[18px] sm:text-[22px] text-[#D4D4D4] leading-relaxed max-w-3xl font-medium">
                SmartPrep isn't just a planner—it's a high-performance execution workspace. 
                We've built the world's first <span className="text-[#D4AF37] underline decoration-2 underline-offset-4">Mission-Based Architecture</span> to ensure every study minute translates into actual mastery.
              </p>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        </div>

        {/* Core Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
           <div className="card border-[#4A3728] border-2">
              <h2 className="text-[20px] font-bold text-[#4A3728] mb-6 flex items-center gap-3 uppercase tracking-tight">
                 <BookOpen size={24} className="text-[#D4AF37]" /> The Philosophy
              </h2>
              <p className="text-[15px] text-[#6B6B6B] leading-relaxed mb-4 font-medium">
                Students fail because of <span className="text-[#4A3728] font-bold">decision fatigue.</span> 
                Most apps tell you "what" to do, but not "how" to finish it. 
              </p>
              <p className="text-[15px] text-[#6B6B6B] leading-relaxed font-medium">
                SmartPrep breaks down every topic into a **Mission Flow**: *Watch (Video) -> Read (Notes) -> Solve (MCQs) -> Master (PYQs)*. 
                Combined with our **Intelligent Backlog Recovery**, you'll never fall behind again.
              </p>
           </div>
           <div className="card bg-[#F9FAFB]">
              <h2 className="text-[20px] font-bold text-[#4A3728] mb-6 flex items-center gap-3 uppercase tracking-tight">
                 <Star size={24} className="text-[#D4AF37]" /> Why Mission-Based?
              </h2>
              <ul className="space-y-4">
                 {[
                    "Topic-Level Granularity: No more vague 'Study Java' tasks.",
                    "Verified Progress: Watch-time tracking for deep accountability.",
                    "Auto-Rescheduling: Smartly shift missed tasks into future slots.",
                    "Data Parity: Full sync between Dashboard and Planner.",
                 ].map((li, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] font-bold text-[#4A3728]">
                       <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-[#D4AF37]" /> {li}
                    </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-12">
           <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider mb-8 text-center">Engine Capabilities</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map((f, i) => (
                 <div key={i} className="card p-6 hover:border-[#4A3728] transition-all group">
                    <div className="w-10 h-10 rounded-[8px] bg-[#F1F1F1] flex items-center justify-center mb-4 group-hover:bg-[#4A3728] transition-colors">
                       <f.icon size={18} className="text-[#4A3728] group-hover:text-white" />
                    </div>
                    <h4 className="text-[14px] font-bold text-[#4A3728] mb-2">{f.title}</h4>
                    <p className="text-[12px] text-[#6B6B6B] leading-relaxed font-medium">{f.desc}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Tech Stack */}
        <div className="card mb-10 p-10 border-[#E6E6E6]">
           <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider mb-10 text-center">The Infrastructure</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 { label: "Frontend", value: "React 19", sub: "Vite + Tailwind CSS" },
                 { label: "Backend", value: "Spring Boot", sub: "Java 21 + REST API" },
                 { label: "Storage", value: "PostgreSQL", sub: "JPA + Hibernate" },
              ].map((t, i) => (
                 <div key={i} className="text-center p-6 border border-[#F1F1F1] rounded-xl hover:bg-[#F9FAFB] transition-all">
                    <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-2">{t.label}</p>
                    <p className="text-[20px] font-bold text-[#4A3728] tracking-tight">{t.value}</p>
                    <p className="text-[12px] text-[#A3A3A3] mt-2 font-medium">{t.sub}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Team Section */}
        <div className="card mb-12 p-10 bg-[#F9FAFB]">
           <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider mb-10 text-center">The Builders</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                 { name: "Sudarshana Zagade", role: "UI/UX & Frontend Architecture", tags: ["Figma", "React", "Animations"] },
                 { name: "Ashutosh Naik", role: "System Design & Backend Infrastructure", tags: ["Java", "Spring", "Database"] },
              ].map((m, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 bg-white border border-[#E6E6E6] rounded-2xl shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-[#4A3728] flex items-center justify-center text-white font-bold text-[20px] shrink-0">
                       {m.name.charAt(0)}
                    </div>
                    <div>
                       <h4 className="text-[16px] font-bold text-[#4A3728]">{m.name}</h4>
                       <p className="text-[12px] text-[#6B6B6B] font-bold mt-1 uppercase tracking-tight">{m.role}</p>
                       <div className="flex flex-wrap gap-1.5 mt-3">
                          {m.tags.map(tag => (
                             <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F1F1] text-[#4A3728] border border-[#E6E6E6]">{tag}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-[#4A3728] rounded-2xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
           <div>
              <h3 className="text-[20px] font-bold tracking-tight">Ready for your next mission?</h3>
              <p className="text-[#D4AF37] text-[13px] mt-2 font-medium">Your study roadmap is synchronized and ready for execution.</p>
           </div>
           <Link to="/dashboard" className="px-8 py-3 bg-white text-[#4A3728] rounded-xl font-bold text-[14px] hover:bg-[#F1F1F1] transition-all flex items-center gap-2">
              Start Mission <ArrowRight size={18} />
           </Link>
        </div>

      </div>
    </AnimatedPage>
  );
}
