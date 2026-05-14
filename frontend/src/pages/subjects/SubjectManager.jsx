import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Tag,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  X,
  Clock,
  Circle,
  PlayCircle,
  CheckCircle2,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";
import { subjectService } from "../../services/subjectService";

const LS_KEY = "sp_subjects";

const SUBJECT_COLORS = [
  { dot: "bg-[#111111]", border: "border-[#E6E6E6]" },
  { dot: "bg-[#404040]", border: "border-[#E6E6E6]" },
  { dot: "bg-[#737373]", border: "border-[#E6E6E6]" },
  { dot: "bg-[#A3A3A3]", border: "border-[#E6E6E6]" },
];

const DIFFICULTY = ["Easy", "Medium", "Hard"];

const STATUS_STATES = {
  NOT_STARTED: {
    label: "Wait",
    icon: Circle,
    bg: "bg-white",
    text: "text-[#6B6B6B]",
    iconColor: "text-[#D4D4D4]",
    next: "IN_PROGRESS",
  },
  IN_PROGRESS: {
    label: "Active",
    icon: PlayCircle,
    bg: "bg-blue-50",
    text: "text-[#0369A1]",
    iconColor: "text-[#0369A1]",
    next: "COMPLETED",
  },
  COMPLETED: {
    label: "Done",
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-[#4D7C0F]",
    iconColor: "text-[#4D7C0F]",
    next: "NOT_STARTED",
  },
};

function calcProgress(topics) {
  if (!topics || topics.length === 0) return { pct: 0, completed: 0, inProgress: 0, notStarted: 0 };
  const completed  = topics.filter((t) => t.status === "COMPLETED").length;
  const inProgress = topics.filter((t) => t.status === "IN_PROGRESS").length;
  const notStarted = topics.filter((t) => t.status === "NOT_STARTED").length;
  const pct = Math.round((completed / topics.length) * 100);
  return { pct, completed, inProgress, notStarted };
}

function syncLS(subjects) {
  const legacy = subjects.map((s) => ({
    id: s.id,
    name: s.name,
    colorIdx: s.colorIdx ?? 0,
    difficulty: s.difficulty,
    progress: s.progress ?? 0,
    topics: (s.topics || []).map((t) => ({
      id: t.id,
      name: t.name,
      done: t.status === "COMPLETED",
      status: t.status ?? "NOT_STARTED",
      estimatedHours: t.estimatedHours ?? null,
    })),
  }));
  localStorage.setItem(LS_KEY, JSON.stringify(legacy));
}

const SubjectManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiMode, setApiMode] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectColor, setNewSubjectColor] = useState(0);
  const [newSubjectDiff, setNewSubjectDiff] = useState("Medium");
  const [addingTopicTo, setAddingTopicTo] = useState(null);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicHours, setNewTopicHours] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingTopicName, setEditingTopicName] = useState("");
  const [editingTopicHours, setEditingTopicHours] = useState("");

  // Unit States
  const [showAddUnitTo, setShowAddUnitTo] = useState(null);
  const [newUnitTitle, setNewUnitTitle] = useState("");

  const addUnit = async (subjectId) => {
    const title = newUnitTitle.trim();
    if (!title) { toast.error("Enter unit title"); return; }
    
    try {
      await subjectService.createUnit(subjectId, { title });
      toast.success("Unit created");
      setNewUnitTitle("");
      setShowAddUnitTo(null);
      
      // refresh the tree so the new unit shows up
      const updated = await subjectService.getSubjects();
      setSubjects(updated.data);
    } catch (err) {
      console.error("unit creation failed: ", err);
      toast.error("Failed to create unit");
    }
  };

  const addTopicToUnit = async (unitId) => {
    const title = newTopicName.trim();
    if (!title) { toast.error("Enter topic name"); return; }
    
    try {
      // default to 1 hour if they didn't put anything
      const hours = newTopicHours ? parseFloat(newTopicHours) : 1;
      
      await subjectService.addTopicToUnit(unitId, { 
        title, 
        estimatedHours: hours,
        status: 'NOT_STARTED'
      });
      
      toast.success("Topic added to unit");
      setNewTopicName("");
      setNewTopicHours("");
      setAddingTopicTo(null);
      
      // trigger a re-fetch
      const updated = await subjectService.getSubjects();
      setSubjects(updated.data);
    } catch (err) {
      // silent log for debugging
      console.warn("adding topic failed", err);
      toast.error("Failed to add topic");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await subjectService.getSubjects();
        if (res.success && res.data && res.data.length > 0) {
          const withColors = res.data.map((s, i) => ({ ...s, colorIdx: i % SUBJECT_COLORS.length }));
          setSubjects(withColors);
          syncLS(withColors);
          setApiMode(true);
        } else {
           const s = localStorage.getItem(LS_KEY);
           if (s) setSubjects(JSON.parse(s));
        }
      } catch {
        const s = localStorage.getItem(LS_KEY);
        if (s) setSubjects(JSON.parse(s));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback((updated) => {
    setSubjects(updated);
    syncLS(updated);
  }, []);

  const totalTopics = subjects.reduce((a, s) => a + (s.topics?.length ?? 0), 0);
  const completedAll = subjects.reduce((a, s) => a + (s.topics?.filter((t) => t.status === "COMPLETED").length ?? 0), 0);
  const inProgressAll = subjects.reduce((a, s) => a + (s.topics?.filter((t) => t.status === "IN_PROGRESS").length ?? 0), 0);
  const overallPct = totalTopics > 0 ? Math.round((completedAll / totalTopics) * 100) : 0;

  const addSubject = async () => {
    if (!newSubjectName.trim()) { toast.error("Enter a subject name"); return; }
    const optimistic = { id: Date.now(), name: newSubjectName.trim(), colorIdx: newSubjectColor, difficulty: newSubjectDiff, progress: 0, topics: [] };
    persist([...subjects, optimistic]);
    setNewSubjectName("");
    setShowAddSubject(false);
    toast.success("Subject added");
    if (apiMode) {
      try { await subjectService.createSubject({ name: optimistic.name, difficulty: optimistic.difficulty }); } catch { /* no-op */ }
    }
  };

  const deleteSubject = async (id) => {
    if (!confirm("Delete this subject?")) return;
    persist(subjects.filter((s) => s.id !== id));
    toast.success("Subject removed");
    if (apiMode) { try { await subjectService.deleteSubject(id); } catch { /* no-op */ } }
  };

  const saveSubjectName = async (id) => {
    if (!editingName.trim()) return;
    persist(subjects.map((s) => s.id === id ? { ...s, name: editingName.trim() } : s));
    setEditingSubjectId(null);
    if (apiMode) { try { await subjectService.updateSubject(id, { name: editingName.trim() }); } catch { /* no-op */ } }
  };

  const addTopic = async (subjectId) => {
    if (!newTopicName.trim()) { toast.error("Enter a topic name"); return; }
    const hours = newTopicHours ? parseFloat(newTopicHours) : null;
    const newTopic = { id: Date.now(), name: newTopicName.trim(), status: "NOT_STARTED", estimatedHours: hours };
    const updated = subjects.map((s) => s.id === subjectId ? { ...s, topics: [...(s.topics || []), newTopic] } : s);
    persist(updated);
    setAddingTopicTo(null);
    setNewTopicName("");
    setNewTopicHours("");
    if (apiMode) { try { await subjectService.addTopic(subjectId, { name: newTopic.name, estimatedHours: hours, status: "NOT_STARTED" }); } catch { /* no-op */ } }
  };

  const cycleTopicStatus = async (subjectId, topicId) => {
    let nextStatus = "NOT_STARTED";
    const updated = subjects.map((s) => {
      if (s.id !== subjectId) return s;
      const topics = (s.topics || []).map((t) => {
        if (t.id !== topicId) return t;
        nextStatus = STATUS_STATES[t.status ?? "NOT_STARTED"]?.next ?? "NOT_STARTED";
        return { ...t, status: nextStatus };
      });
      const { pct } = calcProgress(topics);
      return { ...s, topics, progress: pct };
    });
    persist(updated);
    if (apiMode) { try { await subjectService.updateTopic(subjectId, topicId, { status: nextStatus }); } catch { /* no-op */ } }
  };

  return (
    <AnimatedPage>
      <Navbar title="Subject Manager" subtitle="Build your complete study curriculum" />

      <div className="p-6 lg:p-10 animate-fade-in max-w-[1200px] mx-auto">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Subjects", value: subjects.length, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Total Topics", value: totalTopics, icon: Tag, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Active", value: inProgressAll, icon: PlayCircle, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Done", value: `${completedAll} (${overallPct}%)`, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
          ].map((stat, i) => (
            <div key={i} className="card flex items-center gap-4 hover:scale-105 transition-all duration-300">
              <div className={`w-10 h-10 rounded-[8px] ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">{stat.label}</p>
                <p className="text-[20px] font-bold text-[#4A3728] leading-none mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <div className="card mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[13px] font-bold text-[#4A3728] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={16} /> Syllabus Progress
            </h3>
            <span className="text-[13px] font-bold text-[#4A3728]">{overallPct}%</span>
          </div>
          <div className="w-full h-[6px] bg-[#F1F1F1] rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-700" style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[18px] font-bold text-[#111111]">Curriculum</h2>
          <button onClick={() => setShowAddSubject(!showAddSubject)} className="btn-primary text-[13px] flex items-center gap-2">
            <Plus size={16} /> New Subject
          </button>
        </div>

        {/* Add Subject Modal Style Form */}
        {showAddSubject && (
          <div className="card mb-10 border-[#111111] border-2 bg-[#F9FAFB] animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[12px] font-bold text-[#111111] uppercase tracking-wider mb-2 block">Subject Name</label>
                <input type="text" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} className="input-field" placeholder="e.g. Operating Systems" />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Difficulty</label>
                <div className="flex gap-2">
                  {DIFFICULTY.map(d => (
                    <button key={d} onClick={() => setNewSubjectDiff(d)} className={`flex-1 py-2 rounded-[8px] text-[12px] font-bold transition-all hover:scale-105 ${
                      newSubjectDiff === d ? 
                      (d === 'Hard' ? 'bg-red-600 text-white' : d === 'Medium' ? 'bg-amber-600 text-white' : 'bg-green-600 text-white') : 
                      "bg-white border border-[#E6E6E6] text-[#6B6B6B]"
                    }`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={addSubject} className="btn-primary">Add Subject</button>
              <button onClick={() => setShowAddSubject(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}

        {/* Subject Cards */}
        <div className="space-y-4">
          {subjects.map((subject) => {
            const isExpanded = expandedId === subject.id;
            const { pct, completed, total } = calcProgress(subject.topics);
            const totalHours = (subject.topics || []).reduce((a, t) => a + (t.estimatedHours || 0), 0);

            return (
              <div key={subject.id} className="card p-0 overflow-hidden group">
                <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : subject.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#4A3728]" />
                    <div>
                      <h3 className="font-bold text-[16px] text-[#4A3728]">{subject.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            subject.difficulty === 'Hard' ? 'bg-red-50 text-red-600 border-red-100' :
                            subject.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-green-50 text-green-600 border-green-100'
                         }`}>{subject.difficulty}</span>
                         <span className="text-[11px] font-bold text-[#A3A3A3] flex items-center gap-1"><Clock size={12} /> {totalHours.toFixed(1)}h</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                       <p className="text-[11px] font-bold text-[#4A3728] uppercase tracking-wider">{completed}/{total} Topics Done</p>
                       <div className="w-32 h-[3px] bg-[#F1F1F1] rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-[#4A3728] transition-all duration-700" style={{ width: `${pct}%` }} />
                       </div>
                    </div>
                    {isExpanded ? <ChevronUp size={18} className="text-[#6B6B6B]" /> : <ChevronDown size={18} className="text-[#6B6B6B]" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-[#F9FAFB] border-t border-[#E6E6E6] p-6 space-y-8">
                    
                    {/* Units & Topics */}
                    {(subject.units || []).length === 0 && (subject.topics || []).length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-[13px] font-medium text-[#6B6B6B]">No syllabus data yet.</p>
                      </div>
                    )}

                    {(subject.units || []).map((unit) => (
                      <div key={unit.id} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-2 mb-4">
                          <h4 className="text-[14px] font-black text-[#4A3728] uppercase tracking-wider">{unit.title}</h4>
                          <button 
                            onClick={() => setAddingTopicTo(unit.id)}
                            className="text-[11px] font-bold text-[#4A3728] hover:underline flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Topic
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {(unit.topics || []).map((topic) => {
                            const s = STATUS_STATES[topic.status || "NOT_STARTED"];
                            return (
                              <div key={topic.id} className="flex items-center justify-between bg-white p-3 rounded-[10px] border border-[#E6E6E6] hover:border-[#4A3728] transition-all group hover:scale-[1.01] duration-300">
                                <div className="flex items-center gap-4">
                                  <button onClick={(e) => { e.stopPropagation(); cycleTopicStatus(subject.id, topic.id); }} className={`${s.iconColor} hover:scale-110 transition-transform`}>
                                    <s.icon size={18} />
                                  </button>
                                  <span className={`text-[13px] font-bold ${topic.status === 'COMPLETED' ? 'text-[#A3A3A3] line-through' : 'text-[#4A3728]'}`}>{topic.title}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                   <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-tighter">{(topic.estimatedHours || 0)}h</span>
                                   <button onClick={(e) => { e.stopPropagation(); deleteTopic(subject.id, topic.id); }} className="text-[#A3A3A3] hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            );
                          })}
                          
                          {addingTopicTo === unit.id && (
                            <div className="bg-white p-4 rounded-xl border border-[var(--primary)] animate-fade-in shadow-sm">
                               <div className="flex gap-2 mb-3">
                                  <input className="input-field flex-1" placeholder="Topic Name" value={newTopicName} onChange={e => setNewTopicName(e.target.value)} autoFocus />
                                  <input type="number" className="input-field w-24" placeholder="Hrs" value={newTopicHours} onChange={e => setNewTopicHours(e.target.value)} />
                               </div>
                               <div className="flex gap-2">
                                  <button onClick={() => addTopicToUnit(unit.id)} className="btn-primary !py-2 !px-4 text-[11px]">Add Topic</button>
                                  <button onClick={() => setAddingTopicTo(null)} className="btn-secondary !py-2 !px-4 text-[11px]">Cancel</button>
                               </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Unit Creation Bar */}
                    <div className="pt-4 flex flex-col gap-4">
                      {showAddUnitTo === subject.id ? (
                        <div className="bg-white p-6 rounded-xl border-2 border-[#4A3728] animate-fade-in">
                           <h5 className="text-[12px] font-bold uppercase tracking-widest text-[#4A3728] mb-4">New Unit</h5>
                           <input 
                             className="input-field mb-4" 
                             placeholder="Unit Title (e.g. Unit 1: Fundamentals)" 
                             value={newUnitTitle} 
                             onChange={e => setNewUnitTitle(e.target.value)} 
                           />
                           <div className="flex gap-3">
                              <button onClick={() => addUnit(subject.id)} className="btn-primary !py-2 !px-6 text-[12px]">Create Unit</button>
                              <button onClick={() => setShowAddUnitTo(null)} className="btn-secondary !py-2 !px-6 text-[12px]">Cancel</button>
                           </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowAddUnitTo(subject.id)}
                          className="w-full py-3 bg-[#4A3728] text-white rounded-xl text-[12px] font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={16} /> Create New Unit
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SubjectManager;
