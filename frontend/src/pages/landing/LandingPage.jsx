import { useAuthStore } from '../../store/useAuthStore';
import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import {
  CalendarDays,
  BarChart3,
  ArrowRight,
  Star,
  Zap,
  Clock,
  BookOpen,
  Trophy,
  Play,
  GraduationCap,
  Bell,
  RotateCcw,
  FileText,
  CheckCircle2,
  TrendingUp,
  Layers,
  Target,
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";

const REVIEWS = [
  { 
    name: "Aravind S.", 
    role: "IIT-JEE Aspirant", 
    text: "The Backlog Recovery engine is a lifesaver. I missed 4 days during my mocks, and SmartPrep redistributed the topics perfectly without the usual burnout.",
    avatar: "A"
  },
  { 
    name: "Sanya Kapoor", 
    role: "Medical Student (NEET)", 
    text: "The Mission-Based Flow (Watch-Read-Solve) finally gave me a structured way to handle the massive biology syllabus. My mastery score is at 92% now!",
    avatar: "S"
  },
  { 
    name: "Rohan Mehta", 
    role: "GATE Candidate", 
    text: "Most apps are just digital lists. SmartPrep is an actual execution engine. The real-time sync and focus verification keep me incredibly disciplined.",
    avatar: "R"
  },
];

const LandingPage = () => {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const ctaLink = isAuthenticated ? "/dashboard" : "/register";

  const features = [
    { icon: Layers, title: "Mission Control", desc: "Granular topic-level execution. We break your syllabus into 4-step missions: Watch, Read, Solve, and Master." },
    { icon: RotateCcw, title: "Backlog Recovery", desc: "The world's first intelligent rescheduling engine. Missed topics are automatically redistributed to prevent burnout." },
    { icon: Play, title: "Verified Learning", desc: "Automated progress verification based on actual focus-time. Your mastery is backed by data, not just checklists." },
    { icon: BarChart3, title: "Deep Mastery Analytics", desc: "Track subject-wise readiness with radar charts and velocity trends. Know exactly when you're exam-ready." },
    { icon: Target, title: "Adaptive Scheduling", desc: "Your plan evolves with you. Our algorithm adjusts daily loads based on your real-time performance and exam deadline." },
    { icon: Trophy, title: "Elite Habit Loops", desc: "Build sustainable consistency with streak preservation and milestone rewards designed for peak academic performance." },
  ];

  const steps = [
    { num: "01", title: "Map Syllabus", desc: "Input your exam date and topics. SmartPrep generates a high-fidelity roadmap in seconds." },
    { num: "02", title: "Deploy Missions", desc: "Missions are automatically assigned to your daily dashboard based on your focus capacity." },
    { num: "03", title: "Execute & Sync", desc: "Study using integrated videos and notes. Your progress syncs in real-time across all devices." },
    { num: "04", title: "Scale Results", desc: "Watch your Readiness Score climb as you complete missions and recover backlogs efficiently." },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F7F7F5] text-[#4A3728]">
        
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E6E6E6]">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 duration-300">
              <div className="w-9 h-9 bg-[#4A3728] rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap size={20} className="text-[#D4AF37]" />
              </div>
              <span className="text-[18px] font-bold text-[#4A3728] tracking-tight uppercase tracking-tighter">SmartPrep</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-10">
              {['Features', 'How it works', 'Reviews'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#4A3728] transition-all duration-300">{item}</a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#4A3728] transition-all duration-300">Sign In</Link>
              <Link to={ctaLink} className="bg-[#4A3728] text-white py-2.5 px-6 rounded-xl font-bold text-[12px] uppercase tracking-[0.2em] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-[#D4AF37]/20">Get Started</Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6 overflow-hidden relative">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E6E6E6] px-5 py-2.5 rounded-full mb-10 shadow-sm transition-all hover:border-[#D4AF37] group">
              <Zap size={14} className="text-[#D4AF37] group-hover:scale-125 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#4A3728]">Structured Smart Execution</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#4A3728] mb-8 leading-[0.9] flex flex-col">
              Study Smarter.
              <span className="text-[#D4AF37] italic">Engineered Mastery.</span>
            </h1>

            <p className="text-[19px] text-[#6B6B6B] max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Eliminate decision fatigue. SmartPrep transforms your syllabus into high-performance missions with automated backlog recovery and real-time mastery tracking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to={ctaLink} className="bg-[#4A3728] text-white px-10 py-5 rounded-2xl font-bold text-[15px] uppercase tracking-widest flex items-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all border border-[#D4AF37]/30 shadow-lg">
                Build Study Roadmap <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="bg-white text-[#4A3728] px-10 py-5 rounded-2xl font-bold text-[15px] uppercase tracking-widest flex items-center gap-3 border border-[#E6E6E6] hover:bg-[#FAF9F6] transition-all">
                <Play size={16} className="text-[#D4AF37]" fill="currentColor" /> The Method
              </a>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
               {['IIT-JEE', 'NEET', 'CAT', 'UPSC', 'GATE'].map(exam => (
                 <span key={exam} className="text-[14px] font-black tracking-[0.4em] text-[#4A3728]">{exam}</span>
               ))}
            </div>
          </div>

          {/* Dashboard Preview (Upgraded) */}
          <div className="max-w-6xl mx-auto mt-24 relative">
             <div className="card !p-0 overflow-hidden border-[#4A3728] border-[3px] shadow-[0_32px_64px_-12px_rgba(74,55,40,0.2)] relative transition-all duration-700 hover:shadow-[0_48px_80px_-12px_rgba(74,55,40,0.3)] hover:-translate-y-2">
                <div className="bg-[#4A3728] px-5 py-4 flex items-center justify-between">
                   <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#D4AF37]/50" />
                      <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
                      <div className="w-3.5 h-3.5 rounded-full bg-white/10" />
                   </div>
                   <div className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em]">mission-control.smartprep.study</div>
                   <div className="w-10" />
                </div>
                <div className="bg-[#F9FAFB] p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[500px]">
                   {/* Left Col: Missions */}
                   <div className="lg:col-span-8 bg-white border border-[#E6E6E6] rounded-2xl p-8 shadow-sm">
                      <div className="flex justify-between items-center mb-8">
                         <div className="h-7 w-48 bg-[#F1F1F1] rounded-lg animate-pulse" />
                         <div className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded">Recovery Mode Active</div>
                      </div>
                      <div className="space-y-6">
                         {[
                           { t: "Dynamic Programming", sub: "Mastering Sub-problems", p: 70 },
                           { t: "Normal Distribution", sub: "Statistics & Probability", p: 30 },
                           { t: "React Lifecycle", sub: "Web Engineering", p: 0 }
                         ].map((m, i) => (
                            <div key={i} className="p-5 border border-[#F1F1F1] rounded-xl flex items-center justify-between group hover:border-[#D4AF37] transition-all">
                               <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E6E6E6] flex items-center justify-center text-[#4A3728] group-hover:bg-[#4A3728] group-hover:text-white transition-all">
                                     <Play size={18} fill={i === 0 ? "currentColor" : "none"} />
                                  </div>
                                  <div>
                                     <h4 className="text-[15px] font-bold text-[#4A3728]">{m.t}</h4>
                                     <p className="text-[11px] text-[#6B6B6B] font-medium">{m.sub}</p>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  {[1,2,3].map(s => <div key={s} className={`w-3 h-3 rounded-full ${i === 0 && s < 3 ? 'bg-[#D4AF37]' : 'bg-[#E6E6E6]'}`} />)}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                   {/* Right Col: Stats */}
                   <div className="lg:col-span-4 flex flex-col gap-6">
                      <div className="bg-white border border-[#E6E6E6] rounded-2xl p-8 flex-1 flex flex-col items-center justify-center shadow-sm">
                         <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                               <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#F1F1F1]" />
                               <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 * 0.15} className="text-[#D4AF37]" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="text-3xl font-black text-[#4A3728]">85%</span>
                            </div>
                         </div>
                         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A3A3A3] mt-6">Readiness Score</p>
                      </div>
                      <div className="bg-[#4A3728] rounded-2xl p-8 flex-1 flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden group">
                         <TrendingUp size={28} className="mb-4 text-[#D4AF37] group-hover:scale-125 transition-transform" />
                         <p className="text-[24px] font-black tracking-tighter text-white">+14.2%</p>
                         <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mt-1">Weekly Velocity</p>
                         <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Zap size={80} /></div>
                      </div>
                   </div>
                </div>
                
                {/* Floaties */}
                <div className="absolute -left-12 bottom-20 bg-white border-[3px] border-[#4A3728] p-5 rounded-2xl shadow-2xl hidden xl:flex items-center gap-4 transition-all hover:scale-110 hover:-rotate-2 cursor-default z-20">
                   <div className="w-12 h-12 bg-[#FAF9F6] rounded-xl flex items-center justify-center text-[#D4AF37]">
                      <RotateCcw size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-[#A3A3A3] tracking-widest">Backlog Recovery</p>
                      <p className="text-[15px] font-black text-[#4A3728]">5 Topics Optimized</p>
                   </div>
                </div>
             </div>
          </div>
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#4A3728]/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-4">The Infrastructure of Success</p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#4A3728]">Everything Built for Excellence.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((f, i) => (
                <div key={i} className="p-12 rounded-[32px] border border-[#F1F1F1] hover:border-[#D4AF37] transition-all duration-700 group bg-[#FAF9F6] hover:bg-white hover:shadow-2xl">
                  <div className="w-14 h-14 bg-[#4A3728] text-white rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg border-2 border-[#D4AF37]/20">
                    <f.icon size={26} className="text-[#D4AF37]" />
                  </div>
                  <h3 className="text-[18px] font-black text-[#4A3728] mb-4 uppercase tracking-tighter">{f.title}</h3>
                  <p className="text-[15px] text-[#6B6B6B] leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 bg-[#FAF9F6] border-y border-[#E6E6E6] relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-24">The Deployment Roadmap</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 relative">
               <div className="absolute top-12 left-0 w-full h-0.5 bg-[#E6E6E6] hidden md:block" />
               {steps.map((s, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-white border-[3px] border-[#4A3728] rounded-[32px] flex items-center justify-center mb-10 shadow-xl hover:scale-110 hover:-rotate-3 transition-all duration-500 group">
                       <span className="text-[28px] font-black text-[#4A3728] group-hover:text-[#D4AF37] transition-colors">{s.num}</span>
                    </div>
                    <h3 className="text-[15px] font-black text-[#4A3728] uppercase tracking-[0.2em] mb-4">{s.title}</h3>
                    <p className="text-[14px] text-[#6B6B6B] font-medium leading-relaxed max-w-[200px]">{s.desc}</p>
                 </div>
               ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-32 opacity-[0.02] pointer-events-none rotate-12"><GraduationCap size={400} /></div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-4">Elite Success Stories</p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#4A3728]">Trusted by Top Performers.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {REVIEWS.map((r, i) => (
                <div key={i} className="p-10 rounded-[32px] bg-[#FAF9F6] border border-[#F1F1F1] hover:shadow-xl transition-all duration-500">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} size={14} className="text-[#D4AF37]" fill="currentColor" />)}
                  </div>
                  <p className="text-[16px] text-[#4A3728] font-medium leading-relaxed mb-8 italic">"{r.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#4A3728] flex items-center justify-center text-white font-bold text-[18px]">
                      {r.avatar}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-[#4A3728] uppercase tracking-tight">{r.name}</h4>
                      <p className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-widest">{r.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-6 bg-[#4A3728] text-center overflow-hidden relative">
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tighter mb-10 leading-[0.85]">Your Academic Peak.<br /><span className="text-[#D4AF37] italic">Engineered.</span></h2>
            <p className="text-white/60 text-[20px] mb-16 font-medium max-w-xl mx-auto leading-relaxed">
              The new standard of competitive exam preparation. Deploy your personalized schedule and master your syllabus with precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to={ctaLink} className="bg-white text-[#4A3728] px-12 py-6 rounded-2xl font-black text-[16px] uppercase tracking-[0.2em] hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all border-b-4 border-gray-200">Start Your Session</Link>
              <Link to="/login" className="text-white/40 font-black text-[13px] uppercase tracking-[0.3em] hover:text-[#D4AF37] transition-all px-6">Already Registered?</Link>
            </div>
          </div>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)", backgroundSize: "48px 48px" }} />
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-[#E6E6E6] bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="w-11 h-11 bg-[#4A3728] rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12">
                  <GraduationCap size={22} className="text-[#D4AF37]" />
                </div>
                <span className="text-[20px] font-black uppercase tracking-tighter text-[#4A3728]">SmartPrep</span>
              </div>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                {['Features', 'Deployment', 'Auth', 'Privacy'].map(link => (
                  <a key={link} href="#" className="text-[12px] font-black uppercase tracking-[0.3em] text-[#6B6B6B] hover:text-[#4A3728] transition-all duration-300">{link}</a>
                ))}
              </div>
            </div>
            <div className="pt-12 border-t border-[#F1F1F1] flex flex-col sm:flex-row items-center justify-between gap-6">
               <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#A3A3A3]">© 2026 SmartPrep System — Engineered for Excellence</p>
               <div className="flex gap-6 opacity-40">
                  <div className="w-8 h-8 rounded-full bg-[#4A3728]" />
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]" />
               </div>
            </div>
          </div>
        </footer>

      </div>
    </AnimatedPage>
  );
};

export default LandingPage;
