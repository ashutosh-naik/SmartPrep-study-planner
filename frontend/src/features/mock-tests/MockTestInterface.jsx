import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react';

export const MockTestInterface = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});

  const currentQ = questions[currentIndex];

  const handleSelect = (option) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: option }));
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  return (
    <div className="flex gap-6">
      {/* Left: Question Area */}
      <div className="flex-1">
        <Card className="min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between border-b border-[#ede9fe] pb-4 mb-6">
            <h2 className="text-[16px] font-bold text-[#0f0a1e]">Question {currentIndex + 1} of {questions.length}</h2>
            <button 
              onClick={toggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-colors ${
                flagged[currentQ.id] 
                  ? 'bg-[#fef3c7] text-[#92400e]' 
                  : 'bg-slate-100 text-[#7c6fae] hover:bg-slate-200'
              }`}
            >
              <Flag size={12} strokeWidth={flagged[currentQ.id] ? 3 : 2} />
              {flagged[currentQ.id] ? 'Flagged' : 'Flag for review'}
            </button>
          </div>

          <p className="text-[15px] font-medium text-[#0f0a1e] leading-relaxed mb-8">
            {currentQ.content}
          </p>

          <div className="flex flex-col gap-3 mt-auto">
            {currentQ.options.map((option, idx) => (
              <div 
                key={idx}
                onClick={() => handleSelect(option)}
                className={`option cursor-pointer flex items-center gap-3 ${answers[currentQ.id] === option ? 'selected' : ''}`}
              >
                <div className="w-6 h-6 rounded-full border border-[#ddd6fe] flex items-center justify-center text-[10px] font-bold text-[#7c6fae] bg-white">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-[14px] font-medium">{option}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#ede9fe]">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 text-[#7c6fae] font-semibold text-[12px] disabled:opacity-50 hover:bg-slate-200"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button 
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#7c3aed] text-white font-semibold text-[12px] disabled:opacity-50 hover:bg-[#6d28d9]"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </Card>
      </div>

      {/* Right: Navigator */}
      <div className="w-[280px]">
        <Card>
          <h3 className="text-[13px] font-bold text-[#0f0a1e] mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              let bgClass = "bg-[#f5f3ff] text-[#7c6fae]"; // Unanswered
              if (currentIndex === idx) {
                bgClass = "bg-[#7c3aed] text-white"; // Current
              } else if (flagged[q.id]) {
                bgClass = "bg-[#fef3c7] text-[#92400e]"; // Flagged
              } else if (answers[q.id]) {
                bgClass = "bg-[#dcfce7] text-[#166534]"; // Answered
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[13px] font-bold transition-all ${bgClass} hover:opacity-80`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
