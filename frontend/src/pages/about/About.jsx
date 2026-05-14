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
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: CalendarDays, title: "Study Planner", desc: "Build daily and weekly plans with visual task mapping." },
  { icon: Layers, title: "Subject Manager", desc: "Organize curriculum into topics with real-time status tracking." },
  { icon: Clock, title: "Pomodoro Timer", desc: "Deep work sessions with automated productivity logging." },
  { icon: CheckCircle2, title: "Task Tracking", desc: "Prioritized daily objectives with smart reminders." },
  { icon: FileText, title: "Mock Assessments", desc: "Timed exam simulations with detailed performance metrics." },
  { icon: BarChart3, title: "Advanced Analytics", desc: "Data-driven insights into your learning velocity and streaks." },
  { icon: Target, title: "Strategic Goals", desc: "Set academic milestones and track your progress path." },
  { icon: CalendarDays, title: "Weekly Timetable", desc: "Structure your recurring schedule for maximum efficiency." },
];

export default function About() {
  return (
    <AnimatedPage>
      <Navbar title="About SmartPrep" subtitle="The engine behind structured academic success" />

      <div className="p-6 lg:p-10 animate-fade-in max-w-[1200px] mx-auto">

        {/* Hero Section */}
        <div className="bg-[#111111] rounded-2xl p-10 sm:p-16 text-white mb-10 shadow-2xl overflow-hidden relative">
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                  <GraduationCap size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-[32px] sm:text-[40px] font-bold tracking-tight leading-none">SmartPrep</h1>
                  <p className="text-[#A3A3A3] font-bold text-[14px] uppercase tracking-widest mt-2">The Ultimate Study Operating System</p>
                </div>
              </div>
              <p className="text-[18px] sm:text-[22px] text-[#D4D4D4] leading-relaxed max-w-3xl font-medium">
                We built SmartPrep to bridge the gap between ambitious goals and actual execution. 
                It's a high-performance workspace designed for <span className="text-white underline decoration-2 underline-offset-4">focus, consistency, and data-driven learning.</span>
              </p>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        </div>

        {/* Core Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
           <div className="card border-[#111111] border-2">
              <h2 className="text-[20px] font-bold text-[#111111] mb-6 flex items-center gap-3 uppercase tracking-tight">
                 <BookOpen size={24} /> The Problem
              </h2>
              <p className="text-[15px] text-[#6B6B6B] leading-relaxed mb-4 font-medium">
                Most students fail not because of a lack of effort, but due to a lack of <span className="text-[#111111] font-bold">visibility.</span> 
                Generic to-do apps don't understand the complexity of a 12-month exam syllabus.
              </p>
              <p className="text-[15px] text-[#6B6B6B] leading-relaxed font-medium">
                SmartPrep turns your abstract goals into a concrete, interactive roadmap. 
                Every minute logged and every topic completed is indexed and analyzed to give you a clear picture of your readiness.
              </p>
           </div>
           <div className="card bg-[#F9FAFB]">
              <h2 className="text-[20px] font-bold text-[#111111] mb-6 flex items-center gap-3 uppercase tracking-tight">
                 <Star size={24} /> Why SmartPrep?
              </h2>
              <ul className="space-y-4">
                 {[
                    "Persistent, database-backed study plans.",
                    "Automated performance forecasting.",
                    "Built-in accountability via personalized streaks.",
                    "Zero-friction task and subject management.",
                 ].map((li, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14px] font-bold text-[#111111]">
                       <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> {li}
                    </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Feature Grid */}
        <div className="mb-12">
           <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider mb-8 text-center">Standard Features</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map((f, i) => (
                 <div key={i} className="card p-6 hover:border-[#111111] transition-all group">
                    <div className="w-10 h-10 rounded-[8px] bg-[#F1F1F1] flex items-center justify-center mb-4 group-hover:bg-[#111111] transition-colors">
                       <f.icon size={18} className="text-[#111111] group-hover:text-white" />
                    </div>
                    <h4 className="text-[14px] font-bold text-[#111111] mb-2">{f.title}</h4>
                    <p className="text-[12px] text-[#6B6B6B] leading-relaxed font-medium">{f.desc}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Tech Stack */}
        <div className="card mb-10 p-10 border-[#E6E6E6]">
           <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider mb-10 text-center">Infrastructure</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                 { label: "Frontend", value: "React 19", sub: "Vite + Tailwind CSS" },
                 { label: "Backend", value: "Spring Boot", sub: "Java 21 + REST API" },
                 { label: "Storage", value: "PostgreSQL", sub: "JPA + Hibernate" },
              ].map((t, i) => (
                 <div key={i} className="text-center p-6 border border-[#F1F1F1] rounded-xl hover:bg-[#F9FAFB] transition-all">
                    <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-2">{t.label}</p>
                    <p className="text-[20px] font-bold text-[#111111] tracking-tight">{t.value}</p>
                    <p className="text-[12px] text-[#A3A3A3] mt-2 font-medium">{t.sub}</p>
                 </div>
              ))}
           </div>
        </div>

        {/* Team Section */}
        <div className="card mb-12 p-10 bg-[#F9FAFB]">
           <h3 className="text-[14px] font-bold text-[#111111] uppercase tracking-wider mb-10 text-center">The Builders</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                 { name: "Sudarshana Zagade", role: "UI/UX & Frontend Architecture", tags: ["Figma", "React", "Animations"] },
                 { name: "Ashutosh Naik", role: "System Design & Backend Infrastructure", tags: ["Java", "Spring", "Database"] },
              ].map((m, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 bg-white border border-[#E6E6E6] rounded-2xl shadow-sm">
                    <div className="w-14 h-14 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold text-[20px] shrink-0">
                       {m.name.charAt(0)}
                    </div>
                    <div>
                       <h4 className="text-[16px] font-bold text-[#111111]">{m.name}</h4>
                       <p className="text-[12px] text-[#6B6B6B] font-bold mt-1 uppercase tracking-tight">{m.role}</p>
                       <div className="flex flex-wrap gap-1.5 mt-3">
                          {m.tags.map(tag => (
                             <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F1F1] text-[#111111] border border-[#E6E6E6]">{tag}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-[#111111] rounded-2xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
           <div>
              <h3 className="text-[20px] font-bold tracking-tight">Ready to optimize your preparation?</h3>
              <p className="text-[#A3A3A3] text-[13px] mt-2 font-medium">Your study dashboard is waiting for your next session.</p>
           </div>
           <Link to="/dashboard" className="px-8 py-3 bg-white text-[#111111] rounded-xl font-bold text-[14px] hover:bg-[#F1F1F1] transition-all flex items-center gap-2">
              Launch Dashboard <ArrowRight size={18} />
           </Link>
        </div>

      </div>
    </AnimatedPage>
  );
}
