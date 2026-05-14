import { useState, useMemo, useEffect } from "react";
import {
  Search, School, BookOpen, ChevronDown, Calendar,
  Building2, GraduationCap, Filter, FileText, ExternalLink, AlertCircle, Hash
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import RealPaperViewer from "../../components/RealPaperViewer";
import pyqService from "../../services/pyqService";
import { toast } from "react-hot-toast";

const SESSION_STYLES = {
  "APRIL": "bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-100",
  "MAY": "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100",
  "OCTOBER": "bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100",
  "NOVEMBER": "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100",
  "OCT": "bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100",
};

const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const k = item[key];
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});

const Sel = ({ label, icon: Icon, value, onChange, children }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3] flex items-center gap-1">
      {Icon && <Icon size={11} />}{label}
    </label>
    <div className="relative">
      <select value={value} onChange={onChange}
        className="w-full appearance-none p-3.5 pr-9 rounded-xl border-2 border-[#E6E6E6]
                   focus:border-[#4A3728] outline-none font-bold text-[14px] bg-white
                   text-[#4A3728] cursor-pointer transition-all">
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] pointer-events-none" />
    </div>
  </div>
);

const PYQLibrary = () => {
  const [filters, setFilters] = useState({ university: "", course: "", year: "2024", query: "" });
  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [papers, setPapers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState(null);

  const selectedUni = universities.find(u => u.shortName === filters.university);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (filters.university) {
      fetchCourses(filters.university);
    } else {
      setCourses([]);
      setFilters(f => ({ ...f, course: "" }));
    }
  }, [filters.university]);

  const fetchUniversities = async () => {
    try {
      const res = await pyqService.getUniversities();
      setUniversities(res.data);
    } catch (err) {
      console.error("Failed to fetch universities", err);
    }
  };

  const fetchCourses = async (uni) => {
    try {
      const res = await pyqService.getCourses(uni);
      setCourses(res.data);
      if (res.data.length > 0 && !filters.course) {
        setFilters(f => ({ ...f, course: res.data[0].shortName }));
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const handleSearch = async () => {
    if (!filters.university || !filters.course) {
      toast.error("Please select both University and Course");
      return;
    }
    setLoading(true);
    try {
      const res = await pyqService.getPapers(filters.university, filters.course, filters.year);
      setPapers(res.data);
      setSearched(true);
    } catch (err) {
      toast.error("Official server temporarily unavailable");
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  const visible = useMemo(() => {
    let list = papers;
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter(p => p.session.toLowerCase().includes(q));
    }
    return list;
  }, [papers, filters.query]);

  const grouped = useMemo(() => groupBy(visible, "session"), [visible]);

  return (
    <AnimatedPage>
      <Navbar />
      {viewing && <RealPaperViewer paper={viewing} onClose={() => setViewing(null)} />}

      <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-screen">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4A3728] flex items-center justify-center shadow-lg text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#4A3728] tracking-tight uppercase">Official PYQ Library</h1>
              <p className="text-[#6B6B6B] text-[13px] font-bold mt-0.5 uppercase tracking-widest">
                Authenticated Previous Year Question Papers
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-[#E6E6E6] p-8 mb-10 overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
            <Sel label="University" icon={Building2} value={filters.university}
              onChange={e => { setFilters(f => ({ ...f, university: e.target.value, course: "" })); setSearched(false); }}>
              <option value="">Select University</option>
              {universities.map(u => <option key={u.id} value={u.shortName}>{u.shortName} – {u.name}</option>)}
            </Sel>

            <Sel label="Course" icon={BookOpen} value={filters.course}
              onChange={e => { setFilters(f => ({ ...f, course: e.target.value })); setSearched(false); }}>
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.id} value={c.shortName}>{c.shortName} — {c.name}</option>)}
            </Sel>

            <Sel label="Examination Year" icon={Hash} value={filters.year}
              onChange={e => { setFilters(f => ({ ...f, year: e.target.value })); setSearched(false); }}>
              <option value="2025">2025 Papers</option>
              <option value="2024">2024 Papers</option>
              <option value="2023">2023 Papers</option>
              <option value="2022">2022 Papers</option>
            </Sel>

            <button onClick={handleSearch} disabled={loading}
              className="flex items-center justify-center gap-3 bg-[#4A3728] text-white h-[52px] rounded-xl
                         font-black text-[14px] uppercase tracking-widest hover:bg-[#3D2B1F] hover:shadow-xl
                         transition-all active:scale-[0.98] disabled:opacity-50">
              {loading ? (
                <><div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" /> Fetching…</>
              ) : (
                <><Search size={20} /> Search Papers</>
              )}
            </button>
          </div>

          {selectedUni && (
            <div className="mt-6 pt-6 border-t border-[#F1F1F1] flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brown-50 border border-brown-200 text-[11px] font-black text-brown-800 uppercase tracking-widest">
                <Building2 size={12} /> {selectedUni.shortName} Authorized
              </span>
              <span className="text-[12px] text-[#6B6B6B] font-bold">📍 {selectedUni.location}</span>
              <a href={selectedUni.website} target="_blank" rel="noopener noreferrer"
                className="text-[12px] font-bold text-[#4A3728] flex items-center gap-1.5 hover:underline decoration-2 underline-offset-4">
                <ExternalLink size={14} /> Official Portal
              </a>
            </div>
          )}
        </div>

        {searched && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {visible.length > 0 ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-3 bg-white border border-[#E6E6E6] rounded-2xl px-5 py-3 shadow-sm">
                    <Filter size={15} className="text-[#A3A3A3]" />
                    <span className="text-[13px] font-black text-[#4A3728] uppercase tracking-wider">
                      {visible.length} Authenticated Papers for {filters.year}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Object.entries(grouped).map(([sessionName, sessionPapers]) => (
                    <div key={sessionName} className="bg-white rounded-3xl border border-[#E6E6E6] p-8 hover:shadow-xl transition-all group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner
                                          ${SESSION_STYLES[sessionName.split(' ')[0].toUpperCase()] || "bg-gray-100"}`}>
                            <Calendar size={24} />
                          </div>
                          <div>
                            <h3 className="text-[18px] font-black text-[#4A3728] uppercase tracking-tight">{sessionName}</h3>
                            <p className="text-[11px] text-[#A3A3A3] font-bold uppercase tracking-widest">Examination Cycle</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                          Live Source
                        </span>
                      </div>

                      <div className="space-y-4">
                        {sessionPapers.map(paper => (
                          <div key={paper.id} className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#F1F1F1] hover:border-[#4A3728] transition-all bg-[#FBFBFB]">
                            <div className="flex items-center gap-4">
                              <FileText size={20} className="text-[#A3A3A3]" />
                              <div>
                                <p className="text-[14px] font-black text-[#4A3728] uppercase">{paper.course}</p>
                                <p className="text-[11px] text-[#6B6B6B] font-bold uppercase tracking-widest">Official University PDF</p>
                              </div>
                            </div>
                            <button onClick={() => setViewing(paper)}
                              className="px-5 py-2.5 rounded-xl bg-[#4A3728] text-white text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-brown-900/20">
                              View & Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-[#E6E6E6]">
                 <AlertCircle size={60} className="mx-auto text-amber-500 mb-6" />
                 <h3 className="text-xl font-black text-[#4A3728] uppercase tracking-tight mb-2">No Papers Discovered</h3>
                 <p className="text-[#6B6B6B] max-w-md mx-auto text-[14px] font-medium leading-relaxed uppercase tracking-widest">
                   We couldn't find any official PDFs for {filters.course} in {filters.year} on the server.
                 </p>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="text-center py-40">
             <div className="relative inline-block mb-8">
                <School size={100} className="text-[#F1F1F1]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Search size={32} className="text-[#D1D1D1]" />
                </div>
             </div>
             <h3 className="text-xl font-black text-[#4A3728] uppercase tracking-tight mb-3">Initialize Fetching</h3>
             <p className="text-[#6B6B6B] max-w-sm mx-auto text-[14px] font-bold uppercase tracking-widest leading-relaxed">
                Retrieve authenticated papers from official university repositories.
             </p>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default PYQLibrary;
