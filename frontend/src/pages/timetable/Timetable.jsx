import { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Calendar,
  X,
  BookOpen,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import AnimatedPage from "../../components/AnimatedPage";
import { timetableService } from "../../services/timetableService";
import toast from "react-hot-toast";

const DAYS = [
  { label: "Monday", short: "Mon", iso: 1 },
  { label: "Tuesday", short: "Tue", iso: 2 },
  { label: "Wednesday", short: "Wed", iso: 3 },
  { label: "Thursday", short: "Thu", iso: 4 },
  { label: "Friday", short: "Fri", iso: 5 },
  { label: "Saturday", short: "Sat", iso: 6 },
  { label: "Sunday", short: "Sun", iso: 7 },
];

const SLOT_COLORS = [
  "#111111",
  "#262626",
  "#404040",
  "#525252",
  "#737373",
];

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hh = parseInt(h);
  const ampm = hh >= 12 ? "PM" : "AM";
  return `${hh % 12 || 12}:${m} ${ampm}`;
}

export default function Timetable() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectName: "",
    color: SLOT_COLORS[0],
    label: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await timetableService.getSlots();
        setSlots(data || []);
      } catch {
        toast.error("Could not load timetable");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!form.subjectName.trim()) { toast.error("Subject name is required"); return; }
    if (form.startTime >= form.endTime) { toast.error("End time must be after start time"); return; }
    try {
      const saved = await timetableService.createSlot({
        dayOfWeek: parseInt(form.dayOfWeek),
        startTime: form.startTime + ":00",
        endTime: form.endTime + ":00",
        subjectName: form.subjectName.trim(),
        color: form.color,
        label: form.label.trim(),
      });
      setSlots((prev) => [...prev, saved]);
      setShowModal(false);
      setForm({ dayOfWeek: 1, startTime: "09:00", endTime: "10:00", subjectName: "", color: SLOT_COLORS[0], label: "" });
      toast.success("Slot added!");
    } catch { toast.error("Failed to save slot"); }
  };

  const handleDelete = async (id) => {
    try {
      await timetableService.deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slot removed");
    } catch { toast.error("Failed to delete slot"); }
  };

  const todayIso = new Date().getDay() === 0 ? 7 : new Date().getDay();

  const slotsByDay = {};
  DAYS.forEach((d) => { slotsByDay[d.iso] = []; });
  slots.forEach((s) => { if (slotsByDay[s.dayOfWeek]) slotsByDay[s.dayOfWeek].push(s); });

  const totalHoursPerWeek = slots.reduce((acc, s) => {
    const [sh, sm] = (s.startTime || "0:0").split(":").map(Number);
    const [eh, em] = (s.endTime || "0:0").split(":").map(Number);
    return acc + (eh + em / 60) - (sh + sm / 60);
  }, 0);

  return (
    <AnimatedPage>
      <Navbar title="Weekly Timetable" subtitle="Your structured weekly routine" />

      <div className="p-6 lg:p-10 animate-fade-in max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[24px] font-bold text-[#4A3728] tracking-tight">Weekly Schedule</h1>
            <p className="text-[12px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-1">
              {slots.length} Slots · {totalHoursPerWeek.toFixed(1)}h Total / Week
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary text-[13px] flex items-center gap-2">
            <Plus size={16} /> Add New Slot
          </button>
        </div>

        {/* Grid */}
        <div className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-7 min-w-[800px]">
            {/* Headers */}
            {DAYS.map((d) => (
              <div key={d.iso} className={`p-4 text-center border-b border-r border-[#E6E6E6] last:border-r-0 ${d.iso === todayIso ? "bg-[#F9FAFB]" : "bg-white"}`}>
                <p className={`text-[11px] font-bold uppercase tracking-widest ${d.iso === todayIso ? "text-[#4A3728]" : "text-[#6B6B6B]"}`}>{d.short}</p>
                {d.iso === todayIso && <div className="w-1 h-1 rounded-full bg-[#4A3728] mx-auto mt-2" />}
              </div>
            ))}

            {/* Columns */}
            {DAYS.map((d) => (
              <div key={d.iso} className={`min-h-[500px] border-r border-[#E6E6E6] last:border-r-0 p-3 space-y-3 ${d.iso === todayIso ? "bg-[#F9FAFB]/50" : ""}`}>
                {slotsByDay[d.iso].map((slot) => (
                  <div
                    key={slot.id}
                    className="relative group rounded-[8px] p-4 border border-[#E6E6E6] bg-white transition-all hover:border-[#4A3728] hover:shadow-md"
                  >
                    <p className="text-[13px] font-bold text-[#4A3728] truncate">{slot.subjectName}</p>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B6B6B] uppercase tracking-tighter mt-2">
                      <Clock size={12} /> {formatTime(slot.startTime)} — {formatTime(slot.endTime)}
                    </div>
                    {slot.label && <p className="text-[10px] font-medium text-[#A3A3A3] mt-2 truncate">{slot.label}</p>}
                    
                    <button onClick={() => handleDelete(slot.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded-md transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                
                <button onClick={() => { setForm(f => ({ ...f, dayOfWeek: d.iso })); setShowModal(true); }} className="w-full py-3 border border-dashed border-[#E6E6E6] rounded-[8px] text-[11px] font-bold text-[#6B6B6B] hover:text-[#4A3728] hover:border-[#4A3728] transition-all">
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {!loading && slots.length === 0 && (
          <div className="text-center py-20">
            <Calendar size={48} className="text-[#E6E6E6] mx-auto mb-6" />
            <h3 className="text-[18px] font-bold text-[#4A3728]">Plan your week</h3>
            <p className="text-[14px] text-[#6B6B6B] mt-2 max-w-md mx-auto">Build a consistent routine by adding your fixed study blocks here.</p>
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-[#E6E6E6] shadow-2xl w-full max-w-md p-8 animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-[#4A3728] tracking-tight">Add Time Slot</h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B6B6B] hover:text-[#111111]"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Day</label>
                <select value={form.dayOfWeek} onChange={e => setForm(f => ({ ...f, dayOfWeek: e.target.value }))} className="input-field">
                  {DAYS.map(d => <option key={d.iso} value={d.iso}>{d.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Start</label>
                  <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">End</label>
                  <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="input-field" />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-[#4A3728] uppercase tracking-wider mb-2 block">Subject</label>
                <input type="text" value={form.subjectName} onChange={e => setForm(f => ({ ...f, subjectName: e.target.value }))} placeholder="e.g. Mathematics" className="input-field" />
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleSave} className="btn-primary flex-1">Save Slot</button>
                <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}
