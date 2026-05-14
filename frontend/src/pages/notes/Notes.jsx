import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lightbulb,
  Eye,
  Check,
  X,
  Edit3,
  Save,
  FileText,
  Zap
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import toast from "react-hot-toast";
import { noteService } from "../../services/noteService";

const LS_KEY = "sp_notes";

const defaultNotes = [
  {
    id: 1,
    subject: "Data Structures",
    notes: [
      {
        id: 1,
        title: "BST Complexity",
        content: "A Binary Search Tree (BST) is a root-based data structure.",
        flashcard: true,
        question: "What is the average time complexity for BST Search?",
        answer: "O(log n)",
      },
      {
        id: 2,
        title: "Linked Lists",
        content: "Singly linked lists consist of nodes with a value and a next pointer.",
        flashcard: true,
        question: "Which data structure is better for frequent insertions at the beginning?",
        answer: "Linked List (O(1)) vs Array (O(n))",
      },
      {
        id: 7,
        title: "Recursion & Stack",
        content: "Recursion uses the system stack to keep track of function calls.",
        flashcard: true,
        question: "What happens if a recursive function lacks a base case?",
        answer: "Stack Overflow (Infinite recursion consumes all stack memory)",
      },
    ],
  },
  {
    id: 2,
    subject: "Operating Systems",
    notes: [
      {
        id: 3,
        title: "Deadlocks",
        content: "A deadlock is a situation where processes are stuck waiting for each other.",
        flashcard: true,
        question: "What are the 4 necessary conditions for a deadlock?",
        answer: "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
      },
      {
        id: 4,
        title: "Virtual Memory",
        content: "Virtual memory allows the execution of processes that are not completely in memory.",
        flashcard: true,
        question: "What is thrashing in OS?",
        answer: "When the system spends more time paging than executing processes.",
      },
      {
        id: 8,
        title: "Semaphores",
        content: "Semaphores are integer variables used for process synchronization.",
        flashcard: true,
        question: "What is the difference between Binary and Counting Semaphores?",
        answer: "Binary (0 or 1) acts as a Mutex; Counting can take any non-negative value.",
      },
    ],
  },
  {
    id: 3,
    subject: "Networking",
    notes: [
      {
        id: 5,
        title: "OSI Model",
        content: "The Open Systems Interconnection model has 7 layers.",
        flashcard: true,
        question: "Which layer is responsible for routing (IP addresses)?",
        answer: "Network Layer (Layer 3)",
      },
      {
        id: 6,
        title: "TCP vs UDP",
        content: "TCP is connection-oriented, UDP is connectionless.",
        flashcard: true,
        question: "Which protocol is faster for streaming video?",
        answer: "UDP (No handshake or retransmission overhead)",
      },
      {
        id: 9,
        title: "DNS Protocol",
        content: "Domain Name System translates domain names to IP addresses.",
        flashcard: true,
        question: "What port number does DNS typically use?",
        answer: "Port 53 (usually over UDP)",
      },
    ],
  },
  {
    id: 10,
    subject: "Databases (DBMS)",
    notes: [
      {
        id: 11,
        title: "ACID Properties",
        content: "ACID ensures database transactions are processed reliably.",
        flashcard: true,
        question: "What does the 'I' stand for in ACID?",
        answer: "Isolation (Transactions don't interfere with each other)",
      },
      {
        id: 12,
        title: "Normalization",
        content: "Normalization reduces data redundancy and improves data integrity.",
        flashcard: true,
        question: "What is the primary requirement for 1st Normal Form (1NF)?",
        answer: "Atomic values (No repeating groups or arrays in a column)",
      },
    ],
  },
];

const FlashcardModal = ({ notes, subjectName, onClose }) => {
  const cards = notes.filter((n) => n.flashcard && n.question);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ known: 0, unknown: 0 });
  const [done, setDone] = useState(false);

  if (!cards.length) return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl border border-[#E6E6E6] p-8 text-center max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-[#4A3728] mb-2">No flashcards yet</h3>
        <p className="text-[13px] text-[#6B6B6B] mb-6 font-medium">Enable flashcard mode on any note to study it here.</p>
        <button onClick={onClose} className="btn-primary w-full">Got it</button>
      </div>
    </div>
  );

  const current = cards[idx];
  const handleAnswer = async (knew) => {
    const nextKnown = score.known + (knew ? 1 : 0);
    const nextUnknown = score.unknown + (knew ? 0 : 1);
    setScore({ known: nextKnown, unknown: nextUnknown });
    
    if (idx + 1 >= cards.length) { 
       setDone(true); 
       try {
         await noteService.saveFlashcardResult({
            subject: subjectName || "General",
            totalCards: cards.length,
            masteredCards: nextKnown
         });
         toast.success("Progress saved to database");
       } catch (e) {
         console.error("Failed to save flashcard progress", e);
       }
       return; 
    }
    setIdx(i => i + 1);
    setFlipped(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <style>{`
        .flashcard-container { perspective: 1000px; }
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 300px;
          text-align: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flashcard-flipped { transform: rotateY(180deg); }
        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .flashcard-back { transform: rotateY(180deg); background: #F9FAFB; }
      `}</style>
      
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#4A3728] p-8 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-[16px] uppercase tracking-widest">Premium Flashcards</h2>
            <p className="text-white/60 text-[12px] font-bold mt-1">Challenge {idx + 1} of {cards.length}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-12 text-center animate-scale-in">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
               <Check size={40} />
            </div>
            <h3 className="text-[28px] font-bold text-[#4A3728] mb-2 tracking-tight">Session Mastered</h3>
            <p className="text-[14px] text-[#6B6B6B] font-medium mb-10 leading-relaxed px-10">
              You correctly identified <b>{score.known}</b> out of <b>{cards.length}</b> key concepts today. Your active recall is improving!
            </p>
            <div className="flex gap-4">
              <button onClick={() => { setIdx(0); setFlipped(false); setScore({ known: 0, unknown: 0 }); setDone(false); }} className="btn-secondary flex-1 py-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform"><RotateCcw size={18} /> Review Again</button>
              <button onClick={onClose} className="btn-primary flex-1 py-4 shadow-lg hover:scale-105 transition-transform">Complete Session</button>
            </div>
          </div>
        ) : (
          <div className="p-10">
            <div className="h-[8px] bg-[#F1F1F1] rounded-full mb-10 overflow-hidden shadow-inner">
              <div className="h-full bg-[#4A3728] transition-all duration-1000 ease-out" style={{ width: `${((idx + 1) / cards.length) * 100}%` }} />
            </div>

            <div className="flashcard-container mb-10" onClick={() => setFlipped(!flipped)}>
               <div className={`flashcard-inner ${flipped ? 'flashcard-flipped' : ''}`}>
                  <div className="flashcard-front bg-white border-2 border-[#E6E6E6] group hover:border-[#4A3728] transition-all">
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B6B6B] mb-6 flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" /> Challenge Question
                     </span>
                     <p className="text-[22px] font-bold text-[#4A3728] leading-tight px-4">{current.question}</p>
                     <div className="mt-10 flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <RotateCcw size={18} className="text-[#4A3728] animate-spin-slow" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Click to reveal answer</span>
                     </div>
                  </div>
                  <div className="flashcard-back border-2 border-[#4A3728]">
                     <span className="text-[11px] font-bold uppercase tracking-widest text-[#4A3728] mb-6 flex items-center gap-2">
                        <Check size={14} className="text-green-500" /> Verified Answer
                     </span>
                     <p className="text-[22px] font-bold text-[#4A3728] leading-tight px-4">{current.answer}</p>
                     <div className="mt-10 flex flex-col items-center gap-2 opacity-60">
                        <RotateCcw size={18} className="text-[#4A3728]" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">Click to see question</span>
                     </div>
                  </div>
               </div>
            </div>

            {flipped && (
              <div className="flex gap-4 animate-slide-up">
                <button onClick={() => handleAnswer(false)} className="flex-1 py-4 rounded-2xl bg-white border-2 border-[#E6E6E6] text-[#6B6B6B] font-bold text-[14px] hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                   <X size={18} /> Need More Practice
                </button>
                <button onClick={() => handleAnswer(true)} className="flex-1 py-4 rounded-2xl bg-[#4A3728] text-white font-bold text-[14px] hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105">
                   <Check size={18} /> I Mastered This
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Notes = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState(() => {
    try { 
      const s = localStorage.getItem("sp_subjects"); 
      const localNotes = localStorage.getItem(LS_KEY);
      
      if (localNotes) return JSON.parse(localNotes);
      if (!s) return defaultNotes;

      const parsed = JSON.parse(s);
      const mapped = parsed.map(sub => ({
        id: sub.id,
        subject: sub.name || sub.subject,
        notes: sub.topics ? sub.topics.map(t => ({
          id: t.id,
          title: t.name || t.title,
          content: t.notes || "",
          flashcard: !!t.notes,
          question: t.notes ? `What are the key points of ${t.name || t.title}?` : "",
          answer: t.notes || ""
        })).filter(n => n.content) : []
      }));

      // If mapped subjects have no notes, show default samples for guidance
      const total = mapped.reduce((a, s) => a + s.notes.length, 0);
      return total > 0 ? mapped : defaultNotes;
    } catch { return defaultNotes; }
  });
  const [expanded, setExpanded] = useState(null);
  const [flashcardSubject, setFlashcardSubject] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [addingNoteTo, setAddingNoteTo] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", flashcard: false, question: "", answer: "" });
  const [editingNote, setEditingNote] = useState(null);
  const [editNote, setEditNote] = useState({});

  const persist = (data) => { 
    setSubjects(data); 
    // Also update sp_subjects to keep everything interconnected
    const originalSubjects = JSON.parse(localStorage.getItem("sp_subjects") || "[]");
    const updatedGlobal = originalSubjects.map(gs => {
      const match = data.find(d => d.id === gs.id);
      if (match) {
        // We only update notes back to topics here
        const updatedTopics = (gs.topics || []).map(gt => {
          const noteMatch = match.notes.find(n => n.id === gt.id);
          if (noteMatch) return { ...gt, notes: noteMatch.content };
          return gt;
        });
        return { ...gs, topics: updatedTopics };
      }
      return gs;
    });
    localStorage.setItem("sp_subjects", JSON.stringify(updatedGlobal));
    window.dispatchEvent(new Event('storage'));
  };

  const addSubject = () => {
    toast.error("Please add new subjects through the Subject Manager page.");
    navigate("/subjects");
  };

  const addNote = (subjectId) => {
    if (!newNote.title.trim() || !newNote.content.trim()) return toast.error("All fields required");
    persist(subjects.map(s => s.id === subjectId ? { ...s, notes: [...s.notes, { ...newNote, id: Date.now() }] } : s));
    setNewNote({ title: "", content: "", flashcard: false, question: "", answer: "" });
    setAddingNoteTo(null); toast.success("Note saved");
  };

  const deleteNote = (subjectId, noteId) => {
    persist(subjects.map(s => s.id === subjectId ? { ...s, notes: s.notes.filter(n => n.id !== noteId) } : s));
  };

  const saveEdit = (subjectId, noteId) => {
    persist(subjects.map(s => s.id === subjectId ? { ...s, notes: s.notes.map(n => n.id === noteId ? { ...n, ...editNote } : n) } : s));
    setEditingNote(null); toast.success("Note updated");
  };

  const totalNotes = subjects.reduce((a, s) => a + s.notes.length, 0);
  const totalFlashcards = subjects.reduce((a, s) => a + s.notes.filter(n => n.flashcard).length, 0);

  return (
    <AnimatedPage>
      {flashcardSubject && (
        <FlashcardModal 
          notes={flashcardSubject === "all" ? subjects.flatMap(s => s.notes) : subjects.find(s => s.id === flashcardSubject)?.notes || []} 
          subjectName={flashcardSubject === "all" ? "Combined Study" : subjects.find(s => s.id === flashcardSubject)?.subject}
          onClose={() => setFlashcardSubject(null)} 
        />
      )}

      <Navbar title="Notes & Flashcards" subtitle="Organize your study material and review effectively" />
      
      <div className="p-6 lg:p-10 animate-fade-in max-w-[1200px] mx-auto">
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Subjects", value: subjects.length, icon: BookOpen },
            { label: "Total Notes", value: totalNotes, icon: FileText },
            { label: "Flashcards", value: totalFlashcards, icon: Zap },
            { 
              label: "Study Mode", 
              value: totalFlashcards > 0 ? "Ready" : "Inactive", 
              icon: RotateCcw, 
              onClick: totalFlashcards > 0 ? () => setFlashcardSubject("all") : null,
              active: totalFlashcards > 0
            },
          ].map((s, i) => (
            <div key={i} className={`card flex items-center gap-4 ${s.onClick ? 'cursor-pointer border-[#4A3728] bg-[#FAF9F6] shadow-md hover:scale-105 transition-all' : ''}`} onClick={s.onClick}>
              <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${s.active ? 'bg-[#4A3728] text-white animate-pulse' : 'bg-[#F1F1F1] text-[#111111]'}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">{s.label}</p>
                <p className={`text-[20px] font-bold leading-none mt-1 ${s.active ? 'text-[#4A3728]' : 'text-[#4A3728]'}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro-Tip Banner */}
        {totalNotes === 0 && (
          <div className="card mb-10 bg-[var(--primary)] text-white border-none p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb size={120} /></div>
             <div className="relative z-10">
                <h3 className="text-[18px] font-bold mb-2">How it Works</h3>
                <p className="text-[14px] text-white/70 max-w-xl leading-relaxed">
                   SmartPrep uses <b>Active Recall</b> to help you study. When you create a note, check the <b>"Create Flashcard"</b> box. Your notes will automatically turn into a study deck you can review in <b>Study Mode</b>.
                </p>
             </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
           <div className="flex items-center gap-2">
              {subjects.map(s => (
                <button key={s.id} onClick={() => setExpanded(expanded === s.id ? null : s.id)} className={`px-4 py-1.5 rounded-[8px] text-[12px] font-bold transition-all hover:scale-105 duration-300 ${expanded === s.id ? "bg-[#4A3728] text-white shadow-lg" : "bg-white border border-[#E6E6E6] text-[#6B6B6B] hover:border-[#4A3728]"}`}>{s.subject}</button>
              ))}
           </div>
           <button onClick={() => navigate("/subjects")} className="btn-secondary text-[13px] flex items-center gap-2 hover:scale-105 transition-transform duration-300">
             <Plus size={16} /> Manage Subjects
           </button>
        </div>

        {/* Subject List */}
        <div className="space-y-4">
          {subjects.map((subject) => {
            const isOpen = expanded === subject.id;
            const flashCount = subject.notes.filter(n => n.flashcard).length;

            return (
              <div key={subject.id} className={`card p-0 overflow-hidden border-2 transition-all ${isOpen ? 'border-[#4A3728]' : 'border-[#E6E6E6]'}`}>
                <div className="px-6 py-5 flex items-center justify-between cursor-pointer group" onClick={() => setExpanded(isOpen ? null : subject.id)}>
                   <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#111111]" />
                      <div>
                         <h4 className="text-[16px] font-bold text-[#4A3728]">{subject.subject}</h4>
                         <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-0.5">{subject.notes.length} Notes · {flashCount} Flashcards</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <button onClick={(e) => { e.stopPropagation(); setFlashcardSubject(subject.id); }} className="text-[11px] font-bold text-[#4A3728] border border-[#4A3728] px-3 py-1 rounded-[4px] hover:bg-[#4A3728] hover:text-white transition-all uppercase tracking-wider">Review</button>
                      {isOpen ? <ChevronUp size={18} className="text-[#111111]" /> : <ChevronDown size={18} className="text-[#A3A3A3] group-hover:text-[#111111]" />}
                   </div>
                </div>

                {isOpen && (
                  <div className="p-6 bg-[#F9FAFB] border-t border-[#E6E6E6] space-y-4">
                    {subject.notes.map((note) => {
                      const isEditing = editingNote?.noteId === note.id;
                      return (
                        <div key={note.id} className="bg-white border border-[#E6E6E6] rounded-xl p-6 hover:border-[#4A3728] transition-all">
                           {isEditing ? (
                             <div className="space-y-4">
                                <input value={editNote.title} onChange={e => setEditNote({...editNote, title: e.target.value})} className="input-field" placeholder="Title" />
                                <textarea value={editNote.content} onChange={e => setEditNote({...editNote, content: e.target.value})} className="input-field h-32" placeholder="Content" />
                                <div className="flex gap-3">
                                   <button onClick={() => saveEdit(subject.id, note.id)} className="btn-primary !w-auto px-6 py-2 text-[13px]">Save</button>
                                   <button onClick={() => setEditingNote(null)} className="btn-secondary !w-auto px-6 py-2 text-[13px]">Cancel</button>
                                </div>
                             </div>
                           ) : (
                             <>
                               <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                     <h5 className="text-[15px] font-bold text-[#4A3728]">{note.title}</h5>
                                     {note.flashcard && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#4A3728] text-white">Card</span>}
                                  </div>
                                  <div className="flex items-center gap-1">
                                     <button onClick={() => { setEditingNote({ subjectId: subject.id, noteId: note.id }); setEditNote({...note}); }} className="p-2 text-[#A3A3A3] hover:text-[#111111]"><Edit3 size={16} /></button>
                                     <button onClick={() => deleteNote(subject.id, note.id)} className="p-2 text-[#A3A3A3] hover:text-red-500"><Trash2 size={16} /></button>
                                  </div>
                               </div>
                               <p className="text-[14px] text-[#6B6B6B] leading-relaxed whitespace-pre-wrap">{note.content}</p>
                             </>
                           )}
                        </div>
                      );
                    })}
                    
                    {addingNoteTo === subject.id ? (
                       <div className="bg-white border-2 border-dashed border-[#4A3728] rounded-xl p-6 space-y-4">
                          <input value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} className="input-field" placeholder="Note Title" />
                          <textarea value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} className="input-field h-32" placeholder="Start writing..." />
                          <div className="flex items-center gap-4 p-4 bg-[#F9FAFB] rounded-[8px]">
                             <input type="checkbox" checked={newNote.flashcard} onChange={e => setNewNote({...newNote, flashcard: e.target.checked})} className="w-4 h-4 accent-[#111111]" />
                             <span className="text-[13px] font-bold text-[#4A3728]">Create a flashcard for this note</span>
                          </div>
                          {newNote.flashcard && (
                             <div className="space-y-4 pt-2">
                                <input value={newNote.question} onChange={e => setNewNote({...newNote, question: e.target.value})} className="input-field" placeholder="Flashcard Question" />
                                <input value={newNote.answer} onChange={e => setNewNote({...newNote, answer: e.target.value})} className="input-field" placeholder="Flashcard Answer" />
                             </div>
                          )}
                          <div className="flex gap-3 pt-2">
                             <button onClick={() => addNote(subject.id)} className="btn-primary !w-auto px-8">Save Note</button>
                             <button onClick={() => setAddingNoteTo(null)} className="btn-secondary !w-auto px-8">Discard</button>
                          </div>
                       </div>
                    ) : (
                       <button onClick={() => setAddingNoteTo(subject.id)} className="w-full py-4 border-2 border-dashed border-[#E6E6E6] rounded-xl text-[13px] font-bold text-[#6B6B6B] hover:border-[#4A3728] hover:text-[#4A3728] transition-all">
                          + Add New Note
                       </button>
                    )}
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

export default Notes;
