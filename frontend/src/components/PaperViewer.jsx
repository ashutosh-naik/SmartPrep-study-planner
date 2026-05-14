import { useRef } from "react";
import { X, Printer, BookOpen, Clock, Award } from "lucide-react";
import { getQuestionsForYear, getFallbackPaper } from "../utils/questionData";

const PaperViewer = ({ paper, onClose }) => {
  const printRef = useRef();

  const data =
    getQuestionsForYear(paper.subjectCode, paper.year) ||
    getFallbackPaper(paper.subjectName, paper.subjectCode, paper.course, paper.semester, paper.year);

  const uniNames = {
    sppu: "Savitribai Phule Pune University (SPPU)",
    mu:   "University of Mumbai (MU)",
    rtmnu:"R.T.M. Nagpur University (RTMNU)",
    srtmu:"S.R.T.M. University (SRTMU)",
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head>
      <title>${data.title} - ${paper.year} Question Paper</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Times New Roman", serif; font-size: 13px; color: #000; background: #fff; padding: 30px; }
        .header { text-align: center; border-bottom: 3px double #000; padding-bottom: 14px; margin-bottom: 14px; }
        .header h1 { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .header h2 { font-size: 14px; font-weight: bold; margin: 6px 0 4px; }
        .header p  { font-size: 12px; }
        .meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin: 10px 0; border-bottom: 1px solid #000; padding-bottom: 8px; }
        .instructions { border: 1px solid #000; padding: 8px 12px; margin: 10px 0; font-size: 12px; }
        .instructions li { margin: 3px 0 3px 18px; }
        .question-block { margin: 18px 0; }
        .q-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 13px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-bottom: 8px; }
        .attempt-note { font-style: italic; font-size: 11px; color: #333; margin-bottom: 8px; }
        .subq { margin: 8px 0 8px 20px; font-size: 12.5px; line-height: 1.6; }
        .subq-marks { float: right; font-weight: bold; }
        @media print { body { padding: 20px; } }
      </style>
    </head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6] bg-[#F9FAFB] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4A3728] rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#4A3728] text-[14px] line-clamp-1">{data.title}</p>
              <p className="text-[11px] text-[#6B6B6B] font-medium">{paper.course} · Sem {paper.semester} · {paper.year} · {paper.subjectCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#4A3728] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#3D2B1F] transition-all hover:scale-105"
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors">
              <X size={18} className="text-[#6B6B6B]" />
            </button>
          </div>
        </div>

        {/* Scrollable Paper */}
        <div className="overflow-y-auto flex-1 p-8 bg-white">
          <div ref={printRef}>
            {/* Paper Header */}
            <div className="header text-center border-b-2 border-black pb-4 mb-4">
              <h1 className="text-[15px] font-bold uppercase tracking-wide">{uniNames[paper.universityId] || "University Examination"}</h1>
              <h2 className="text-[14px] font-bold mt-2">{data.title}</h2>
              <p className="text-[12px] mt-1">{paper.course} — Semester {paper.semester} &nbsp;|&nbsp; Year: {paper.year}</p>
            </div>

            {/* Meta row */}
            <div className="flex justify-between text-[12px] font-bold border-b border-black pb-2 mb-3">
              <span className="flex items-center gap-1"><Clock size={12} /> Duration: {data.duration}</span>
              <span className="flex items-center gap-1"><Award size={12} /> Max. Marks: {data.maxMarks}</span>
            </div>

            {/* Instructions */}
            <div className="border border-black rounded p-3 mb-5 text-[12px]">
              <p className="font-bold mb-1">Instructions to Candidates:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                {data.instructions.map((ins, i) => <li key={i}>{ins}</li>)}
              </ol>
            </div>

            {/* Questions */}
            {data.units.map((unit, ui) => (
              <div key={ui} className="mb-6">
                <div className="flex justify-between items-center border-b border-gray-400 pb-1 mb-2">
                  <span className="font-bold text-[13px]">Q.{ui + 1} — {unit.topic}</span>
                  <span className="font-bold text-[13px]">[{unit.marks} Marks]</span>
                </div>
                <p className="italic text-[11px] text-gray-600 mb-3">{unit.attempt}</p>
                {unit.subquestions.map((sq, si) => (
                  <div key={si} className="subq mb-3 ml-5">
                    <div className="flex justify-between">
                      <span className="font-bold mr-2">({sq.label})</span>
                      <span className="flex-1 leading-relaxed">{sq.text}</span>
                      <span className="ml-4 font-bold whitespace-nowrap">[{sq.marks} M]</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="text-center mt-8 pt-4 border-t border-black text-[12px] font-bold">
              ★ ★ ★ END OF QUESTION PAPER ★ ★ ★
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperViewer;
