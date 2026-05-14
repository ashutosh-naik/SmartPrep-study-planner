import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSidebarStore } from "../store/useSidebarStore";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  CheckSquare,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Layers,
  BookMarked,
  Trophy,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { path: "/dashboard",   label: "Dashboard",          icon: LayoutDashboard },
  { path: "/planner",     label: "Study Planner",      icon: CalendarDays },
  { path: "/timetable",   label: "Timetable",          icon: CalendarClock },
  { path: "/tasks",       label: "Task Tracking",      icon: CheckSquare },
  { path: "/subjects",    label: "Subjects",           icon: Layers },
  { path: "/notes",       label: "Notes & Flashcards", icon: BookMarked },
  { path: "/tests",       label: "Mock Tests",         icon: FileText },
  { path: "/pyqs",        label: "PYQ Library",        icon: GraduationCap },
  { path: "/analytics",   label: "Analytics",          icon: BarChart3 },

  { path: "/about",       label: "About",              icon: Info },
];

/* ─── Shared content for both desktop + mobile ─── */
const SidebarContent = ({ collapsed, onClose }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "S";
  
  const [masteryPercent, setMasteryPercent] = useState(0);

  const calculateMastery = useCallback(() => {
    const subjects = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
    const totalTopics = subjects.reduce((sum, s) => sum + (s.topics ? s.topics.length : 0), 0);
    const completedTopics = subjects.reduce((sum, s) => sum + (s.topics ? s.topics.filter(t => t.status === "COMPLETED" || t.done).length : 0), 0);
    const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    setMasteryPercent(percent);
  }, []);

  useEffect(() => {
    calculateMastery();
    window.addEventListener('storage', calculateMastery);
    return () => window.removeEventListener('storage', calculateMastery);
  }, [calculateMastery]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full py-6 overflow-hidden bg-white border-r border-[#E6E6E6]">

      {/* ── Logo ── */}
      <div 
        onClick={() => { navigate('/dashboard'); onClose?.(); }}
        className={`flex items-center gap-3 px-6 mb-8 cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105 ${collapsed ? "justify-center px-0" : ""}`}
      >
        <div className="w-8 h-8 rounded-[8px] bg-[#4A3728] flex items-center justify-center shrink-0">
          <GraduationCap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-[#4A3728] font-bold text-[15px] tracking-tight">
            SmartPrep
          </span>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : ""}
              onClick={onClose}
              className={[
                "relative flex items-center gap-3 rounded-[12px] transition-all duration-300 group hover:translate-x-1",
                collapsed ? "justify-center w-12 h-12 mx-auto mb-1" : "px-4 py-2.5 w-full",
                isActive
                  ? "bg-[#4A3728] text-white shadow-lg shadow-[#4A3728]/20"
                  : "text-[#6B6B6B] hover:bg-[#FAF9F6] hover:text-[#4A3728]",
              ].join(" ")}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />
              {!collapsed && (
                <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2 py-1 rounded-md text-[11px] font-bold bg-[#4A3728] text-white whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 flex flex-col gap-1 border-t border-[#E6E6E6] mt-4">
        {/* ── Settings ── */}
        <NavLink
          to="/settings"
          title={collapsed ? "Settings" : ""}
          onClick={onClose}
          className={[
            "relative flex items-center gap-3 rounded-[12px] transition-all duration-300 group hover:translate-x-1",
            collapsed ? "justify-center w-12 h-12 mx-auto" : "px-4 py-2.5 w-full",
            location.pathname === "/settings" ? "bg-[#4A3728] text-white shadow-lg shadow-[#4A3728]/20" : "text-[#6B6B6B] hover:bg-[#FAF9F6] hover:text-[#4A3728]",
          ].join(" ")}
        >
          <Settings size={18} strokeWidth={location.pathname === "/settings" ? 2.2 : 1.8} className="shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Settings</span>}
        </NavLink>

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-105"
        >
          <LogOut size={18} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
        </button>
      </div>

        <div className="px-6 py-4 border-t border-[#E6E6E6]">
           <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-[#A3A3A3] uppercase tracking-widest">Global Mastery</span>
              <span className="text-[10px] font-bold text-[#D4AF37]">{masteryPercent}%</span>
           </div>
           <div className="w-full h-[3px] bg-[#F1F1F1] rounded-full overflow-hidden">
              <div className="h-full bg-[#D4AF37] transition-all duration-1000" style={{ width: `${masteryPercent}%` }} />
           </div>
        </div>

      {/* ── User Avatar ── */}
      {!collapsed && (
        <div className="px-6 py-5 flex items-center gap-3 border-t border-[#E6E6E6] bg-[#FAF9F6]/50">
          <div className="w-9 h-9 rounded-xl bg-[#4A3728] flex items-center justify-center text-white text-[13px] font-bold shadow-md border border-[#4A3728]">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="text-[#4A3728] text-[13px] font-bold truncate tracking-tight">{user?.name || "Student"}</p>
            <p className="text-[#D4AF37] text-[9px] truncate uppercase tracking-[0.1em] font-black">Elite Member</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main Sidebar component ─── */
const Sidebar = () => {
  const { collapsed, toggleSidebar } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const width = collapsed ? 72 : 240;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside
        className="fixed left-0 top-0 h-screen z-50 lg:hidden transition-transform duration-300 overflow-hidden shadow-2xl"
        style={{
          width: "240px",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <button className="absolute top-4 right-4 text-gray-400 hover:text-[#4A3728] p-1 z-10" onClick={() => setMobileOpen(false)}>
          <X size={18} />
        </button>
        <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen flex-col z-40 transition-all duration-300"
        style={{ width: `${width}px` }}
      >
        <SidebarContent collapsed={collapsed} />

        {/* ── Collapse toggle ── */}
        <button
          onClick={toggleSidebar}
          className="absolute top-10 -right-3 w-6 h-6 rounded-full bg-white border border-[#E6E6E6] flex items-center justify-center text-[#6B6B6B] hover:text-[#4A3728] hover:border-[#4A3728] transition-all duration-300 hover:scale-110 shadow-sm z-50"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
