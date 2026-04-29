import React from 'react';
import { getDailyQuote } from '../../utils/quotes';
import { Flame, Clock, CalendarDays } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = ({ streak = 0, dailyGoalHours = 4 }) => {
  const quote = getDailyQuote();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      {/* Left: Quote + meta */}
      <div className="flex-1 min-w-0">
        {/* Small greeting tag */}
        <p className="text-xs font-semibold mb-1.5" style={{ color: 'rgb(var(--color-primary-500))' }}>
          ✦ Quote of the Day · {today}
        </p>

        {/* Big rotating motivational quote */}
        <h1
          className="text-lg font-extrabold leading-snug tracking-tight"
          style={{ color: 'rgb(var(--color-text-primary))' }}
        >
          "{quote.text}"
        </h1>

        {/* Author + username sub-line */}
        <p className="mt-1 text-xs" style={{ color: 'rgb(var(--color-text-muted))' }}>
          — {quote.author}
          <span className="mx-2 opacity-40">·</span>
          <span style={{ color: 'rgb(var(--color-text-primary))' }} className="font-medium">
            Keep going, {user?.name?.split(' ')[0] || 'Student'} 💪
          </span>
        </p>
      </div>

      {/* Right: Badges + button */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        {streak > 0 && (
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              background: 'rgb(var(--color-amber-50))',
              color: 'rgb(var(--color-amber-800))',
              border: '1px solid rgb(var(--color-amber-200))',
            }}
          >
            <Flame size={12} strokeWidth={2.5} />
            {streak}-day streak
          </span>
        )}

        <span
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgb(var(--color-primary-50))',
            color: 'rgb(var(--color-primary-700))',
            border: '1px solid rgb(var(--color-primary-200))',
          }}
        >
          <Clock size={12} strokeWidth={2.5} />
          {dailyGoalHours}hrs daily goal
        </span>

        <button
          onClick={() => navigate('/timetable')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgb(var(--color-primary-600)), rgb(var(--color-primary-800)))',
            boxShadow: '0 2px 8px rgb(var(--color-primary-600) / 0.35)',
          }}
        >
          <CalendarDays size={13} strokeWidth={2} />
          View Schedule
        </button>
      </div>
    </div>
  );
};
