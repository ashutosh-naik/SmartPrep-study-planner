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
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";

const LandingPage = () => {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const ctaLink = isAuthenticated ? "/dashboard" : "/register";

  const features = [
    { icon: CalendarDays, title: "Dynamic Study Planning", desc: "Builds a personalized daily schedule based on your syllabus and exam date. It auto-adjusts when you fall behind." },
    { icon: BarChart3, title: "Deep Analytics", desc: "Track score trends, subject mastery, and exam readiness with real-time charts. Know exactly where to focus next." },
    { icon: FileText, title: "Mock Test Engine", desc: "Take timed subject-wise mock tests, review your answers, and track improvement over time with detailed result breakdowns." },
    { icon: RotateCcw, title: "Backlog Recovery", desc: "Missed a session? SmartPrep automatically redistributes skipped topics across your remaining schedule — no manual rescheduling." },
    { icon: Bell, title: "Milestone Alerts", desc: "Stay on track with automated reminders and a live countdown to your exam day. Never miss a critical deadline again." },
    { icon: Trophy, title: "Productivity Tracking", desc: "Monitor your focus sessions and daily streaks to build sustainable study habits that lead to consistent results." },
  ];

  const steps = [
    { num: "01", title: "Set Your Exam", desc: "Input your exam date and subjects. SmartPrep maps your entire syllabus in minutes." },
    { num: "02", title: "Generate Plan", desc: "Our algorithm creates a day-by-day schedule optimized for your timeline." },
    { num: "03", title: "Study & Track", desc: "Follow your plan, log focus sessions, and watch your readiness score grow." },
    { num: "04", title: "Crack the Exam", desc: "Enter the exam hall confident and fully prepared for peak performance." },
  ];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F7F7F5] text-[#4A3728]">
        
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E6E6E6]">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 duration-300">
              <div className="w-9 h-9 bg-[#4A3728] rounded-xl flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="text-[18px] font-bold text-[#4A3728] tracking-tight uppercase">SmartPrep</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-10">
              {['Features', 'How it works', 'Reviews'].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[13px] font-bold uppercase tracking-widest text-[#6B6B6B] hover:text-[#4A3728] hover:scale-110 transition-all duration-300">{item}</a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-[13px] font-bold uppercase tracking-widest text-[#6B6B6B] hover:text-[#4A3728] hover:scale-110 transition-all duration-300">Sign In</Link>
              <Link to={ctaLink} className="bg-[#4A3728] text-white py-2.5 px-6 rounded-xl font-bold text-[13px] uppercase tracking-widest hover:scale-105 hover:bg-[#3D2B1F] transition-all duration-300">Get Started</Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E6E6E6] px-4 py-2 rounded-full mb-10 shadow-sm transition-transform hover:scale-105 duration-300">
              <Star size={14} className="text-[#4A3728]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A3728]">Intelligent Exam Preparation</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#4A3728] mb-8 leading-[0.95]">
              Study Smarter.<br />
              <span className="opacity-40">Score Higher.</span>
            </h1>

            <p className="text-[18px] text-[#6B6B6B] max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              SmartPrep creates personalized study paths that adapt to your pace. 
              No manual scheduling, just focused learning driven by deep performance insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ctaLink} className="btn-primary !py-4 !px-10 text-[15px] uppercase tracking-widest flex items-center gap-3">
                Build Your Plan <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-secondary !py-4 !px-10 text-[15px] uppercase tracking-widest flex items-center gap-3">
                <Play size={16} fill="currentColor" /> The Method
              </a>
            </div>

            <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest mt-8">
              Trusted by 50,000+ students from top global universities
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="max-w-5xl mx-auto mt-24">
             <div className="card !p-0 overflow-hidden border-[#4A3728] border-2 shadow-2xl relative transition-transform hover:scale-[1.01] duration-500">
                <div className="bg-[#4A3728] px-4 py-3 flex items-center justify-between">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                   </div>
                   <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">dashboard.smartprep.study</div>
                   <div className="w-10" />
                </div>
                <div className="bg-[#F9FAFB] p-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
                   <div className="bg-white border border-[#E6E6E6] rounded-xl p-6 col-span-2">
                      <div className="h-6 w-48 bg-[#F1F1F1] rounded mb-6" />
                      <div className="space-y-4">
                         {[1,2,3].map(i => (
                           <div key={i} className="flex items-center gap-4 py-3 border-b border-[#F1F1F1] last:border-0">
                              <div className="w-5 h-5 rounded-full border-2 border-[#111111]" />
                              <div className="h-3 w-64 bg-[#F1F1F1] rounded" />
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="flex flex-col gap-6">
                      <div className="bg-white border border-[#E6E6E6] rounded-xl p-6 flex-1 flex flex-col items-center justify-center">
                         <div className="w-24 h-24 rounded-full border-[6px] border-[#111111] flex items-center justify-center font-bold text-2xl">84%</div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-[#A3A3A3] mt-4">Readiness</p>
                      </div>
                      <div className="bg-[#111111] rounded-xl p-6 flex-1 flex flex-col items-center justify-center text-white">
                         <TrendingUp size={24} className="mb-3" />
                         <p className="text-[18px] font-bold">+12%</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Growth</p>
                      </div>
                   </div>
                </div>
                
                {/* Floaties */}
                <div className="absolute -left-10 top-20 bg-white border-2 border-[#4A3728] p-4 rounded-xl shadow-xl hidden lg:flex items-center gap-3 transition-transform hover:scale-110 duration-300">
                   <Zap size={20} className="text-[#4A3728]" />
                   <div>
                      <p className="text-[10px] font-bold uppercase text-[#A3A3A3]">Active Streak</p>
                      <p className="text-[14px] font-bold text-[#4A3728]">24 Days</p>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-24">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A3728] mb-4">Core Ecosystem</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#4A3728]">Everything Built for Excellence.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="p-10 rounded-2xl border border-[#E6E6E6] hover:border-[#4A3728] transition-all duration-500 group">
                  <div className="w-12 h-12 bg-[#4A3728] text-white rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <f.icon size={22} />
                  </div>
                  <h3 className="text-[16px] font-bold text-[#4A3728] mb-3 uppercase tracking-wider">{f.title}</h3>
                  <p className="text-[14px] text-[#6B6B6B] leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 bg-[#F9FAFB] border-y border-[#E6E6E6]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4A3728] mb-20">The Deployment Path</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
               <div className="absolute top-10 left-0 w-full h-[1px] bg-[#E6E6E6] hidden md:block" />
               {steps.map((s, i) => (
                 <div key={i} className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white border-2 border-[#4A3728] rounded-full flex items-center justify-center mb-8 shadow-lg hover:scale-110 transition-transform duration-300">
                       <span className="text-[20px] font-bold text-[#4A3728]">{s.num}</span>
                    </div>
                    <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-widest mb-3">{s.title}</h3>
                    <p className="text-[13px] text-[#6B6B6B] font-medium leading-relaxed px-2">{s.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 bg-[#4A3728] text-center overflow-hidden relative">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-tight">Your Academic Peak.<br />Engineered.</h2>
            <p className="text-[#A3A3A3] text-[18px] mb-12 font-medium max-w-xl mx-auto leading-relaxed">
              Join the new standard of exam preparation. Build your personalized schedule today and take control of your results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ctaLink} className="bg-white text-[#4A3728] px-10 py-5 rounded-2xl font-bold text-[15px] uppercase tracking-widest hover:scale-105 transition-all">Start Your Session</Link>
              <Link to="/login" className="text-white/60 font-bold text-[13px] uppercase tracking-widest hover:text-white transition-colors px-6">Already Registered?</Link>
            </div>
          </div>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-[#E6E6E6] bg-white">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4A3728] rounded-lg flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="text-[14px] font-bold uppercase tracking-widest text-[#4A3728]">SmartPrep</span>
            </div>
            <div className="flex gap-10">
              {['Features', 'Deployment', 'Auth', 'Privacy'].map(link => (
                <a key={link} href="#" className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#4A3728] hover:scale-110 transition-all duration-300">{link}</a>
              ))}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3]">© 2026 SmartPrep System</p>
          </div>
        </footer>

      </div>
    </AnimatedPage>
  );
};

export default LandingPage;
