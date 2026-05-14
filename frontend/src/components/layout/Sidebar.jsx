import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  CalendarDays, 
  Clock, 
  CheckSquare, 
  CreditCard, 
  FileText, 
  BarChart2, 
  Trophy, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Sidebar = () => {
  const { user, logout } = useAuthStore();

  const navSections = [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={15} strokeWidth={1.8} /> },
        { name: 'Study Planner', path: '/planner', icon: <CalendarDays size={15} strokeWidth={1.8} /> },
        { name: 'Timetable', path: '/timetable', icon: <Clock size={15} strokeWidth={1.8} /> },
        { name: 'Task Tracking', path: '/tasks', icon: <CheckSquare size={15} strokeWidth={1.8} /> },
      ]
    },
    {
      label: 'LEARNING',
      items: [
        { name: 'Subjects', path: '/subjects', icon: <BookOpen size={15} strokeWidth={1.8} /> },
        { name: 'Notes & Flashcards', path: '/notes', icon: <CreditCard size={15} strokeWidth={1.8} /> },
        { name: 'Mock Tests', path: '/mock-tests', icon: <FileText size={15} strokeWidth={1.8} /> },
      ]
    },
    {
      label: 'INSIGHTS',
      items: [
        { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={15} strokeWidth={1.8} /> },

      ]
    }
  ];

  return (
    <div className="relative flex flex-col w-[220px] fixed h-screen bg-[#0f0a1e] text-white">
      {/* Right Edge Gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#2d2460] to-transparent opacity-70" />

      {/* Logo Block */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-8 h-8 flex items-center justify-center rounded-[9px] bg-[#6d28d9]">
          <BookOpen size={18} color="#fff" strokeWidth={2.2} />
        </div>
        <div>
          <h1 className="text-[13px] font-bold text-white tracking-wide">SmartPrep</h1>
          <p className="text-[8px] text-[#4a3d7a] font-bold tracking-[1.2px]">STUDY SMARTER, SCORE HIGHER</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto mt-2 pb-6 custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="mb-4">
            <h3 className="text-[9px] tracking-[1.8px] font-semibold text-[#3d3568] px-[14px] mt-4 mb-1">
              {section.label}
            </h3>
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-[10px] px-[14px] py-[7px] mx-2 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#6d28d938] text-[#c4b5fd] border-l-2 border-[#7c3aed] rounded-l-none pl-[12px]'
                      : 'text-[#6d5fa8] hover:bg-[#ffffff0d] hover:text-[#ffffffbf]'
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom User Card */}
      <div className="mt-auto bg-[#ffffff0a] border border-[#ffffff0f] rounded-[10px] p-[10px] mx-2 mb-3 flex items-center gap-[9px]">
        <div className="w-[28px] h-[28px] rounded-full bg-[#6d28d9] flex items-center justify-center text-[11px] font-bold text-white">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold text-[#e2d9f3] truncate w-[100px]">
            {user?.name || 'User'}
          </p>
          <p className="text-[10px] text-[#4a3d7a]">Student</p>
        </div>
        <button 
          onClick={logout} 
          className="bg-transparent border-none p-1 cursor-pointer hover:bg-[#ffffff1a] rounded transition-colors"
          title="Logout"
        >
          <LogOut size={13} color="#ef4444" />
        </button>
        <button className="bg-transparent border-none p-1 cursor-pointer hover:bg-[#ffffff1a] rounded transition-colors">
          <Settings size={13} color="#3d3568" />
        </button>
      </div>
    </div>
  );
};
