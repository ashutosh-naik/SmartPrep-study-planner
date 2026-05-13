import { useState } from "react";
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
  { path: "/leaderboard", label: "Leaderboard",        icon: Trophy },
  { path: "/about",       label: "About",              icon: Info },
];

/* ─── Shared content for both desktop + mobile ─── */
const SidebarContent = ({ collapsed, onClose }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "S";

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
                "relative flex items-center gap-3 rounded-[8px] transition-all duration-300 group hover:scale-105",
                collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2 w-full",
                isActive
                  ? "bg-[#F1F1F1] text-[#4A3728]"
                  : "text-[#6B6B6B] hover:bg-gray-50 hover:text-[#4A3728]",
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
            "relative flex items-center gap-3 rounded-[8px] transition-all duration-300 group hover:scale-105",
            collapsed ? "justify-center w-10 h-10 mx-auto" : "px-3 py-2 w-full",
            location.pathname === "/settings" ? "bg-[#F1F1F1] text-[#4A3728]" : "text-[#6B6B6B] hover:bg-gray-50 hover:text-[#4A3728]",
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

      {/* ── User Avatar ── */}
      {!collapsed && (
        <div className="px-6 py-4 flex items-center gap-3 border-t border-[#E6E6E6]">
          <div className="w-8 h-8 rounded-full bg-[#F1F1F1] flex items-center justify-center text-[#4A3728] text-[12px] font-bold border border-[#E6E6E6]">
            {avatarLetter}
          </div>
          <div className="min-w-0">
            <p className="text-[#4A3728] text-[12px] font-bold truncate">{user?.name || "Student"}</p>
            <p className="text-[#6B6B6B] text-[10px] truncate uppercase tracking-wider font-bold">Free Plan</p>
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
