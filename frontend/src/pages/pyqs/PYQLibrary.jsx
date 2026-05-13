import { useEffect, useState } from "react";
import { Search, Download, ExternalLink, School, BookOpen, Filter } from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const PYQLibrary = () => {
    const [universities, setUniversities] = useState([]);
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        universityId: "",
        course: "MCA",
        semester: 1
    });

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const res = await axiosInstance.get("/pyqs/universities");
                setUniversities(res.data.data || []);
                if (res.data.data && res.data.data.length > 0) {
                    setFilters(prev => ({ ...prev, universityId: res.data.data[0].id }));
                }
            } catch (err) {
                toast.error("Failed to load universities");
            }
        };
        fetchUniversities();
    }, []);

    const handleSearch = async () => {
        if (!filters.universityId) {
            toast.error("Please select a university");
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/pyqs/search?universityId=${filters.universityId}&course=${filters.course}&semester=${filters.semester}`);
            setPapers(res.data.data || []);
            if (res.data.data.length === 0) {
                toast.error("No papers found for these filters");
            }
        } catch (err) {
            toast.error("Search failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatedPage>
            <Navbar />
            <div className="p-6 lg:p-10 max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-[#4A3728] mb-2">University PYQ Library</h1>
                    <p className="text-[#6B6B6B]">Direct access to official university previous year question papers.</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E6E6E6] p-8 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">University</label>
                            <select 
                                value={filters.universityId} 
                                onChange={e => setFilters({...filters, universityId: e.target.value})}
                                className="w-full p-4 rounded-xl border-[#E6E6E6] border-2 focus:border-[#4A3728] outline-none font-bold text-[14px]"
                            >
                                <option value="">Select University</option>
                                {universities.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">Course</label>
                            <select 
                                value={filters.course} 
                                onChange={e => setFilters({...filters, course: e.target.value})}
                                className="w-full p-4 rounded-xl border-[#E6E6E6] border-2 focus:border-[#4A3728] outline-none font-bold text-[14px]"
                            >
                                <option value="MCA">MCA</option>
                                <option value="B.E.">B.E.</option>
                                <option value="M.Tech">M.Tech</option>
                                <option value="MBA">MBA</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-[#A3A3A3]">Semester</label>
                            <select 
                                value={filters.semester} 
                                onChange={e => setFilters({...filters, semester: parseInt(e.target.value)})}
                                className="w-full p-4 rounded-xl border-[#E6E6E6] border-2 focus:border-[#4A3728] outline-none font-bold text-[14px]"
                            >
                                {[1,2,3,4,5,6,7,8].map(s => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-[#4A3728] text-white p-4 rounded-xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Searching..." : <><Search size={20} /> Search Papers</>}
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papers.map(paper => (
                        <div key={paper.id} className="bg-white rounded-xl border border-[#E6E6E6] p-6 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                    <BookOpen size={20} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                    Year {paper.year}
                                </span>
                            </div>
                            <h3 className="font-bold text-[#4A3728] mb-1 line-clamp-1">{paper.subjectName}</h3>
                            <p className="text-[12px] text-[#6B6B6B] mb-6">{paper.course} - Sem {paper.semester}</p>
                            
                            <div className="flex gap-3">
                                <a 
                                    href={paper.downloadUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#F9FAFB] text-[#4A3728] py-2 rounded-lg text-[12px] font-bold border border-[#E6E6E6] hover:bg-[#4A3728] hover:text-white transition-all"
                                >
                                    <Download size={14} /> Download
                                </a>
                            </div>
                        </div>
                    ))}
                    {!loading && papers.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-[#E6E6E6]">
                            <School size={40} className="mx-auto text-[#A3A3A3] mb-4" />
                            <p className="text-[#6B6B6B] font-medium">Select filters and search to see available papers.</p>
                        </div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default PYQLibrary;
