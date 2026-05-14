import { useAuthStore } from '../store/useAuthStore';
import { taskService } from "../services/taskService";
import {
  Bell,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Trophy,
  TrendingUp,
  Clock,
  BookOpen,
  Sun,
  Moon,
  LayoutDashboard,
  CalendarDays,
  Target,
  Settings,
  RotateCcw,
  FileText,
  BarChart3,
  Menu,
} from "lucide-react";
import { getDailyQuote } from "../utils/quotes";
import { useThemeStore } from "../store/useThemeStore";
import { useSidebarStore } from "../store/useSidebarStore";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";



const SEARCH_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", type: "Page" },
  { label: "Study Planner", icon: CalendarDays, path: "/planner", type: "Page" },
  { label: "Task Tracking", icon: Target, path: "/tasks", type: "Page" },
  { label: "Mock Tests", icon: FileText, path: "/tests", type: "Page" },
  { label: "Analytics", icon: BarChart3, path: "/analytics", type: "Page" },
  { label: "Settings", icon: Settings, path: "/settings", type: "Page" },
  { label: "Backlog", icon: RotateCcw, path: "/planner/backlog", type: "Page" },
];

const Navbar = ({ title, subtitle }) => {
  const { user } = useAuthStore();
  const { theme: themeMode, setTheme: setThemeMode } = useThemeStore();
  const { toggleSidebar } = useSidebarStore();
  const navigate = useNavigate();

  const avatarUrl = localStorage.getItem("sp_avatar");
  const dailyQuote = getDailyQuote();

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(true);
  const notifRef = useRef(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const filteredSearch =
    searchQuery.trim().length > 0
      ? SEARCH_ITEMS.filter((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : SEARCH_ITEMS.slice(0, 5);

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifs(true);
      const [summary, todayTasks] = await Promise.all([
        taskService.getTaskSummary(),
        taskService.getTasks('today')
      ]);

      const newNotifs = [];

      // 1. Backlog Alert
      if (summary.skipped > 0) {
        newNotifs.push({
          id: 'backlog',
          type: "warning",
          icon: AlertCircle,
          iconColor: "text-amber-600",
          iconBg: "bg-amber-50",
          title: "Backlog Alert",
          message: `You have ${summary.skipped} skipped missions that need recovery.`,
          time: "Action Required",
          unread: true,
        });
      }

      // 2. Daily Goal
      const pendingToday = todayTasks.filter(t => t.status !== 'completed').length;
      if (pendingToday > 0) {
        newNotifs.push({
          id: 'daily',
          type: "info",
          icon: Target,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50",
          title: "Daily Mission Tracker",
          message: `You have ${pendingToday} missions scheduled for deployment today.`,
          time: "Today",
          unread: true,
        });
      } else if (todayTasks.length > 0) {
        newNotifs.push({
          id: 'done',
          type: "success",
          icon: CheckCircle,
          iconColor: "text-green-600",
          iconBg: "bg-green-50",
          title: "Missions Accomplished!",
          message: "All today's study missions have been successfully executed.",
          time: "Just Now",
          unread: true,
        });
      }

      // 3. Mastery Milestone
      if (summary.completionRate > 0) {
        newNotifs.push({
          id: 'mastery',
          type: "success",
          icon: Trophy,
          iconColor: "text-purple-600",
          iconBg: "bg-purple-50",
          title: "Mastery Milestone",
          message: `Your current platform readiness score is ${summary.completionRate}%.`,
          time: "Platform Status",
          unread: false,
        });
      }

      setNotifications(newNotifs);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  const dismissNotif = (id) => setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E6E6E6]">
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button
            className="lg:hidden p-2 rounded-[8px] bg-[#F1F1F1] text-[#6B6B6B] no-print"
            onClick={toggleSidebar}
          >
            <Menu size={18} />
          </button>
          
          <div className="min-w-0 flex-1">
            {title ? (
              <div>
                <h1 className="text-[18px] font-bold text-[#4A3728] tracking-tight hover:scale-[1.02] transition-transform duration-300">{title}</h1>
                {subtitle && <p className="text-[#6B6B6B] text-[13px] font-medium mt-0.5">{subtitle}</p>}
              </div>
            ) : (
              <div className="hidden sm:block">
                <h1 className="text-[14px] font-bold text-[#4A3728] hover:scale-[1.02] transition-transform duration-300">"{dailyQuote.text}"</h1>
                <p className="text-[12px] text-[#6B6B6B] font-medium mt-0.5">— {dailyQuote.author}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="flex items-center gap-2 bg-[#F7F7F5] border border-[#E6E6E6] rounded-[8px] px-3 py-2 w-64 transition-all duration-300 focus-within:w-80 focus-within:border-[#4A3728] hover:scale-[1.02]">
              <Search size={16} className="text-[#6B6B6B]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                className="bg-transparent outline-none text-[13px] text-[#4A3728] placeholder:text-[#6B6B6B] w-full font-medium"
              />
            </div>
            {showSearch && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white border border-[#E6E6E6] rounded-[10px] shadow-xl overflow-hidden z-50">
                {filteredSearch.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { navigate(item.path); setSearchQuery(""); setShowSearch(false); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
                  >
                    <item.icon size={16} className="text-[#6B6B6B]" />
                    <span className="text-[13px] font-bold text-[#4A3728]">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
            className="p-2 text-[#6B6B6B] hover:text-[#4A3728] hover:bg-[#F1F1F1] rounded-[8px] transition-all duration-300 hover:scale-110 no-print"
          >
            {themeMode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div className="relative no-print" ref={notifRef}>
            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2 text-[#6B6B6B] hover:text-[#4A3728] hover:bg-[#F1F1F1] rounded-[8px] transition-all duration-300 hover:scale-110 relative">
              <Bell size={18} />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />}
            </button>

            {showNotifs && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-[#E6E6E6] rounded-[12px] shadow-2xl overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-[#E6E6E6] flex justify-between items-center bg-[#F9FAFB]">
                  <h3 className="font-bold text-[13px] text-[#4A3728] uppercase tracking-wider">Notifications</h3>
                  {unreadCount > 0 && <button onClick={markAllRead} className="text-[11px] font-bold text-[#4A3728] hover:underline">Clear all</button>}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-[#E6E6E6] hover:bg-gray-50 transition-all flex gap-3">
                      <div className={`w-8 h-8 rounded-[6px] ${notif.iconBg} flex items-center justify-center shrink-0`}>
                        <notif.icon size={14} className={notif.iconColor} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-[#4A3728]">{notif.title}</p>
                        <p className="text-[12px] text-[#6B6B6B] font-medium leading-snug mt-0.5">{notif.message}</p>
                        <p className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-widest mt-2">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#E6E6E6] no-print">
            <div className="text-right hidden lg:block">
              <p className="text-[13px] font-bold text-[#4A3728]">{user?.name || "Student"}</p>
              <p className="text-[11px] text-[#6B6B6B] font-bold uppercase tracking-wider">{user?.course || "CS Student"}</p>
            </div>
            <div onClick={() => navigate("/settings")} className="w-8 h-8 rounded-full overflow-hidden cursor-pointer bg-[#4A3728] flex items-center justify-center text-white font-bold text-[12px] transition-all duration-300 hover:scale-110">
              {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
