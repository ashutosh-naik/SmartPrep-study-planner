import { X, Printer, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RealPaperViewer = ({ paper, onClose }) => {
  if (!paper) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#4A3728]/40 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white w-full max-w-6xl h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-[#F1F1F1] flex flex-wrap items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7c2d12] flex items-center justify-center text-white font-bold">
                {paper.university.substring(0,1)}
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-[#4A3728] leading-tight">
                  {paper.course} — {paper.session}
                </h2>
                <p className="text-[12px] text-[#A3A3A3] font-medium uppercase tracking-widest">
                  Official {paper.university} Document Server
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-[#E6E6E6] text-[#6B6B6B] hover:bg-gray-50 transition-all flex items-center gap-2 text-[13px] font-bold">
                <ExternalLink size={16} /> <span className="hidden sm:inline">Official Source</span>
              </a>
              <button onClick={() => window.print()}
                className="p-2.5 rounded-xl border border-[#E6E6E6] text-[#6B6B6B] hover:bg-gray-50 transition-all flex items-center gap-2 text-[13px] font-bold">
                <Printer size={16} /> <span className="hidden sm:inline">Print</span>
              </button>
              <button onClick={onClose}
                className="p-2.5 rounded-xl bg-[#4A3728] text-white hover:bg-[#3D2B1F] transition-all">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* PDF View */}
          <div className="flex-1 bg-gray-100 relative">
             <iframe 
               src={`${paper.pdfUrl}#toolbar=0`} 
               className="w-full h-full border-none"
               title="Question Paper Preview"
             />
          </div>

          {/* Footer Warning */}
          <div className="p-3 bg-amber-50 border-t border-amber-100 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
              Note: This is a combined university PDF. Scroll down to find your specific subject inside.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RealPaperViewer;
