import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { ChevronDown, ChevronUp, BookOpen, CheckCircle, Youtube } from 'lucide-react';

export const StudyPlannerAccordion = ({ subjects }) => {
  const [expandedSubject, setExpandedSubject] = useState(null);

  const toggleSubject = (id) => {
    setExpandedSubject(prev => prev === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-4">
      {subjects.map(subject => (
        <Card key={subject.id} className="p-0 overflow-hidden">
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => toggleSubject(subject.id)}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: subject.color_hex || '#7c3aed' }}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#0f0a1e]">{subject.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${subject.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#7c6fae]">
                    {subject.progress_percentage}% Complete
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[12px] font-semibold text-[#7c6fae]">
                {subject.topics.filter(t => t.is_completed).length} / {subject.topics.length} Topics
              </span>
              {expandedSubject === subject.id ? (
                <ChevronUp size={20} color="#7c6fae" />
              ) : (
                <ChevronDown size={20} color="#7c6fae" />
              )}
            </div>
          </div>

          {/* Body / Topics */}
          {expandedSubject === subject.id && (
            <div className="border-t border-[#ede9fe] bg-slate-50 p-4 flex flex-col gap-2">
              {subject.topics.length === 0 ? (
                <p className="text-[12px] text-center text-[#7c6fae] py-4">No topics found.</p>
              ) : (
                subject.topics.map(topic => (
                  <div 
                    key={topic.id} 
                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#ede9fe] hover:border-[#ddd6fe] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {topic.is_completed ? (
                        <CheckCircle size={16} color="#059669" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[#ddd6fe]" />
                      )}
                      <span className={`text-[13px] font-medium ${topic.is_completed ? 'text-[#7c6fae] line-through' : 'text-[#0f0a1e]'}`}>
                        {topic.title}
                      </span>
                    </div>
                    {topic.youtube_video_url && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 border-none cursor-pointer">
                        <Youtube size={14} />
                        <span className="text-[10px] font-bold">Watch</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
