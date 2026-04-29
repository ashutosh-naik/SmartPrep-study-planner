import { useAuthStore } from '../../store/useAuthStore';
import { useState, useEffect, useRef } from "react";
import {
  User,
  BookOpen,
  Bell,
  Calendar,
  Save,
  Plus,
  Trash2,
  Sun,
  Moon,
  Camera,
  MapPin,
  Shield,
  Layout
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import { analyticsService } from "../../services/analyticsService";
import {
  STUDY_TIMES,
  BREAK_DURATIONS,
  DIFFICULTY_LEVELS,
} from "../../utils/constants";
import { useThemeStore } from "../../store/useThemeStore";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuthStore();
  const { theme: themeMode, setTheme: setThemeMode } = useThemeStore();
  const [profile, setProfile] = useState({
    name: "", email: "", course: "", year: "", examType: "", examDate: "",
    studyHoursPerDay: 4, preferredStudyTime: "", breakDuration: 15,
  });
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [notifications, setNotifications] = useState({ dailyReminders: true, testNotifications: true, progressReports: false });
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem("sp_avatar") || "");
  const avatarInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Account Details");
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "", showCurrent: false, showNext: false });
  const [pushPerm, setPushPerm] = useState(() => { try { return Notification.permission; } catch { return "default"; } });

  const themeOptions = [
    { value: "light", label: "Light", description: "Bright and professional interface", icon: Sun },
    { value: "dark", label: "Dark", description: "Optimized for low-light focus", icon: Moon },
  ];

  useEffect(() => {
    if (user) setProfile({
      name: user.name || "", email: user.email || "", course: user.course || "",
      year: user.year || "", examType: user.examType || "", examDate: user.examDate || "",
      studyHoursPerDay: user.studyHoursPerDay || 4, preferredStudyTime: user.preferredStudyTime || "",
      breakDuration: user.breakDuration || 15,
    });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await analyticsService.updateProfile(profile);
      toast.success("Profile updated");
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, { name: newSubject.trim(), difficulty: "Medium" }]);
      setNewSubject("");
    }
  };

  return (
    <AnimatedPage>
      <Navbar title="Settings" subtitle="Control your profile and preferences" />
      
      <div className="p-6 lg:p-10 animate-fade-in max-w-[1000px] mx-auto">
        
        {/* Header Action */}
        <div className="flex justify-between items-center mb-10">
           <div>
              <h2 className="text-[24px] font-bold text-[#4A3728] tracking-tight">App Preferences</h2>
              <p className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-1">Manage your account settings</p>
           </div>
           <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform duration-300 shadow-lg">
              <Save size={18} /> {saving ? "Saving..." : "Save All Changes"}
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* Sidebar Links */}
           <div className="lg:col-span-1 space-y-4">
              <div className="card bg-[#F9FAFB] border-[#E6E6E6] sticky top-24">
                 <nav className="space-y-1 p-2">
                    {[
                       { label: "Account Details", icon: User },
                       { label: "Appearance", icon: Layout },
                       { label: "Study Strategy", icon: BookOpen },
                       { label: "Security", icon: Shield },
                    ].map((item, i) => (
                       <button 
                         key={i} 
                         onClick={() => setActiveTab(item.label)}
                         className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-[13px] font-bold transition-all duration-300 hover:scale-105 ${activeTab === item.label ? 'bg-[#4A3728] text-white shadow-md' : 'text-[#6B6B6B] hover:bg-white hover:text-[#4A3728]'}`}
                       >
                          <item.icon size={16} /> {item.label}
                       </button>
                    ))}
                 </nav>
              </div>
           </div>

           {/* Main Content Area */}
           <div className="lg:col-span-2 space-y-10">
              
              {/* Appearance Section */}
              {activeTab === "Appearance" && (
                <section className="space-y-6 animate-fade-in">
                  <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                      <Layout size={18} /> Appearance
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                      {themeOptions.map((opt) => (
                        <button key={opt.value} onClick={() => setThemeMode(opt.value)} className={`p-5 rounded-xl border-2 transition-all text-left hover:scale-105 duration-300 ${themeMode === opt.value ? 'border-[#4A3728] bg-white shadow-lg' : 'border-[#E6E6E6] bg-[#F9FAFB] hover:border-[#4A3728]'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <opt.icon size={18} className={themeMode === opt.value ? 'text-[#4A3728]' : 'text-[#6B6B6B]'} />
                                <span className="text-[14px] font-bold text-[#4A3728]">{opt.label}</span>
                            </div>
                            <p className="text-[11px] font-medium text-[#6B6B6B] leading-relaxed">{opt.description}</p>
                        </button>
                      ))}
                  </div>
                </section>
              )}

              {/* Profile Details */}
              {activeTab === "Account Details" && (
                <section className="space-y-6 animate-fade-in">
                  <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                      <User size={18} /> Profile Details
                  </h3>
                  <div className="card p-8 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center gap-8 mb-10 pb-10 border-b border-[#F1F1F1]">
                        <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                            <div className="w-24 h-24 rounded-full bg-[#4A3728] flex items-center justify-center text-white text-[32px] font-bold overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                                {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : profile.name?.charAt(0)}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={20} className="text-white" />
                            </div>
                            <input ref={avatarInputRef} type="file" className="hidden" accept="image/*" onChange={e => {
                                const reader = new FileReader();
                                reader.onload = (ev) => { setAvatarUrl(ev.target.result); localStorage.setItem("sp_avatar", ev.target.result); };
                                reader.readAsDataURL(e.target.files[0]);
                            }} />
                        </div>
                        <div>
                            <h4 className="text-[20px] font-bold text-[#4A3728]">{profile.name || "Student Name"}</h4>
                            <p className="text-[13px] text-[#6B6B6B] font-medium mt-1">{profile.email || "student@example.com"}</p>
                            <div className="flex gap-2 mt-4">
                                <span className="badge-info">{profile.course || "B.Tech"}</span>
                                <span className="badge-info">{profile.year || "3rd Year"}</span>
                            </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Full Name</label>
                            <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="input-field" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">University</label>
                            <input value={user?.university || ""} className="input-field bg-[#F9FAFB]" disabled />
                        </div>
                      </div>
                  </div>
                </section>
              )}

              {/* Study Plan Preferences */}
              {activeTab === "Study Strategy" && (
                <section className="space-y-6 animate-fade-in">
                  <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                      <BookOpen size={18} /> Study Strategy
                  </h3>
                  <div className="card space-y-8 p-8 hover:shadow-md transition-shadow duration-300">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-[13px] font-bold text-[#4A3728]">Daily Study Goal</label>
                            <span className="text-[14px] font-bold text-[#4A3728]">{profile.studyHoursPerDay} hours</span>
                        </div>
                        <input type="range" min="1" max="12" step="1" value={profile.studyHoursPerDay} onChange={e => setProfile({...profile, studyHoursPerDay: parseInt(e.target.value)})} className="w-full accent-[#4A3728]" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Preferred Session</label>
                            <select value={profile.preferredStudyTime} onChange={e => setProfile({...profile, preferredStudyTime: e.target.value})} className="input-field">
                                {STUDY_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Break Duration</label>
                            <select value={profile.breakDuration} onChange={e => setProfile({...profile, breakDuration: parseInt(e.target.value)})} className="input-field">
                                {BREAK_DURATIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                            </select>
                        </div>
                      </div>
                  </div>
                </section>
              )}

              {/* Security */}
              {activeTab === "Security" && (
                <section className="space-y-6 animate-fade-in">
                  <h3 className="text-[14px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
                      <Shield size={18} /> Security
                  </h3>
                  <div className="card p-8 hover:shadow-md transition-shadow duration-300">
                      <div className="space-y-6 max-w-sm">
                        <div>
                            <label className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">New Password</label>
                            <input type="password" placeholder="Min. 8 characters" className="input-field" />
                        </div>
                        <button className="btn-primary !w-auto !px-6 hover:scale-105 transition-transform duration-300">Update Password</button>
                      </div>
                  </div>
                </section>
              )}

           </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Settings;
