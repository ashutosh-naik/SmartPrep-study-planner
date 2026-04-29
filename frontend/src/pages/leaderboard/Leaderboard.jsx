import { useAuthStore } from '../../store/useAuthStore';
import { useState } from "react";
import {
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  Flame,
  Star,
  Trophy as TrophyIcon
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";

const MOCK_STUDENTS = [
  { rank: 1, name: "Priya Sharma", avatar: "P", score: 94, streak: 42, trend: "up", change: 2 },
  { rank: 2, name: "Rahul Verma", avatar: "R", score: 91, streak: 38, trend: "up", change: 1 },
  { rank: 3, name: "Anjali Gupta", avatar: "A", score: 89, streak: 35, trend: "down", change: 1 },
  { rank: 4, name: "Karthik Nair", avatar: "K", score: 87, streak: 30, trend: "up", change: 3 },
  { rank: 5, name: "Sneha Patel", avatar: "S", score: 85, streak: 28, trend: "same", change: 0 },
  { rank: 6, name: "Arjun Singh", avatar: "A", score: 83, streak: 25, trend: "up", change: 2 },
  { rank: 7, name: "Meera Krishnan", avatar: "M", score: 81, streak: 22, trend: "down", change: 2 },
  { rank: 8, name: "Dev Rathi", avatar: "D", score: 79, streak: 20, trend: "up", change: 1 },
  { rank: 9, name: "Ishaan Mehta", avatar: "I", score: 77, streak: 18, trend: "same", change: 0 },
];

const YOU = { rank: 10, name: "Ashu Naik", avatar: "A", score: 75, streak: 21, trend: "up", change: 4, isYou: true };

const Leaderboard = () => {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState("weekly");
  const all = [...MOCK_STUDENTS, { ...YOU, name: user?.name || "Ashu Naik" }];

  const topThree = all.slice(0, 3);
  const rest = all.slice(3);

  return (
    <AnimatedPage>
      <Navbar title="Leaderboard" subtitle="Competitive performance rankings across the platform" />
      
      <div className="p-6 lg:p-10 animate-fade-in max-w-[800px] mx-auto">
        
        {/* Period Selector */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#F1F1F1] p-1 rounded-[10px] flex gap-1">
            {["weekly", "alltime"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-8 py-2 rounded-[8px] text-[12px] font-bold transition-all capitalize ${period === p ? "bg-white text-[#111111] shadow-sm" : "text-[#6B6B6B] hover:text-[#111111]"}`}>
                {p === "weekly" ? "This Week" : "All Time"}
              </button>
            ))}
          </div>
        </div>

        {/* Podium */}
        <div className="flex items-end justify-center gap-6 mb-12 h-64">
           {[topThree[1], topThree[0], topThree[2]].map((s, i) => {
              const heights = ["h-32", "h-48", "h-24"];
              const podiumOrder = [2, 1, 3];
              return (
                 <div key={i} className="flex flex-col items-center flex-1 max-w-[120px]">
                    <div className="w-12 h-12 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold mb-4 shadow-xl border-2 border-white">
                       {s.avatar}
                    </div>
                    <div className={`w-full ${heights[i]} bg-white border-x border-t border-[#E6E6E6] rounded-t-xl flex flex-col items-center justify-center shadow-sm relative`}>
                       <span className="text-[24px] font-bold text-[#111111] leading-none">#{podiumOrder[i]}</span>
                       <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mt-2 tracking-wider truncate px-2 w-full text-center">{s.name.split(' ')[0]}</p>
                       <span className="text-[13px] font-bold text-[#111111] mt-1">{s.score}%</span>
                    </div>
                 </div>
              );
           })}
        </div>

        {/* Your Score Card */}
        <div className="card border-[#111111] border-2 bg-[#F9FAFB] mb-8 animate-pulse-subtle">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[16px]">
                    {YOU.avatar}
                 </div>
                 <div>
                    <h4 className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
                       {user?.name || "Ashu Naik"} <span className="text-[10px] font-bold uppercase bg-[#111111] text-white px-2 py-0.5 rounded-full">You</span>
                    </h4>
                    <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-0.5">Rank #{YOU.rank} · {YOU.streak} Day Streak</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[20px] font-bold text-[#111111]">{YOU.score}%</p>
                 <p className="text-[11px] font-bold text-green-600 flex items-center gap-1 justify-end mt-1">
                    <ArrowUp size={12} /> +4 spots
                 </p>
              </div>
           </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {rest.map((s, i) => (
            <div key={i} className="card flex items-center justify-between py-4 px-6 hover:border-[#111111] transition-all">
               <div className="flex items-center gap-4">
                  <span className="text-[13px] font-bold text-[#A3A3A3] w-6">#{s.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-[#F1F1F1] text-[#111111] flex items-center justify-center font-bold text-[12px]">
                     {s.avatar}
                  </div>
                  <div>
                     <h5 className="text-[14px] font-bold text-[#111111]">{s.name}</h5>
                     <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">{s.streak} Day Streak</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[14px] font-bold text-[#111111]">{s.score}%</p>
                  <div className={`flex items-center gap-1 justify-end text-[10px] font-bold uppercase mt-1 ${s.trend === 'up' ? 'text-green-600' : s.trend === 'down' ? 'text-red-500' : 'text-[#A3A3A3]'}`}>
                     {s.trend === 'up' ? <ArrowUp size={10} /> : s.trend === 'down' ? <ArrowDown size={10} /> : <Minus size={10} />}
                     {s.trend !== 'same' ? `${s.change} spots` : 'No change'}
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 card bg-[#111111] text-white p-8 text-center">
           <TrophyIcon className="mx-auto mb-4 text-[#F1F1F1]" size={32} />
           <h3 className="text-[18px] font-bold mb-2">Climb the Leaderboard</h3>
           <p className="text-[13px] text-[#A3A3A3] font-medium leading-relaxed max-w-md mx-auto">
             Consistent daily study sessions and high mock test scores are the fastest ways to rise. You're only 2% away from the next rank!
           </p>
        </div>

      </div>
    </AnimatedPage>
  );
};

export default Leaderboard;
