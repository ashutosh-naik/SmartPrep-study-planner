import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  FileText, 
  CheckCircle2, 
  Target, 
  ChevronLeft, 
  Clock, 
  ExternalLink,
  MessageSquare,
  BookOpen,
  Award
} from 'lucide-react';
import { taskService } from '../../services/taskService';
import Navbar from '../../components/Navbar';
import AnimatedPage from '../../components/AnimatedPage';
import toast from 'react-hot-toast';

const TopicStudyView = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes'); // notes, mcqs, pyqs

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      // Assuming getTasks with a filter or a specific getTaskById exists in service
      // For now, let's find it from the list or add a new service method
      const res = await taskService.getTasks('all');
      const found = res.data.find(t => t.id.toString() === taskId);
      if (found) {
        setTask(found);
      } else {
        toast.error("Task not found");
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error("Failed to load session");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSubtask = async (type, currentStatus) => {
    try {
      await taskService.updateSubtask(taskId, type, !currentStatus);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated`);
      fetchTask();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Focus Mode...</div>;
  if (!task) return null;

  // Helper to extract YouTube ID
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
    else if (url.includes('be/')) videoId = url.split('be/')[1];
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  };

  const embedUrl = getYoutubeEmbedUrl(task.youtubeVideoUrl);

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
        <Navbar />
        
        {/* Study Header */}
        <div className="bg-white border-b border-[#E6E6E6] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} className="text-[#4A3728]" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6B6B6B]">
                  {task.subjectName}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#E6E6E6]" />
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  task.topicDifficulty === 'HARD' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                }`}>
                  {task.topicDifficulty}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#4A3728] tracking-tight">{task.topicName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#6B6B6B]" />
              <span className="text-[13px] font-bold text-[#4A3728]">{task.durationHours}h Session</span>
            </div>
            <div className="h-8 w-px bg-[#E6E6E6]" />
            <div className="flex items-center gap-2">
              <Award size={20} className={task.status === 'completed' ? 'text-green-500' : 'text-gray-300'} />
              <span className="text-[13px] font-bold text-[#4A3728]">
                {task.status === 'completed' ? 'Topic Mastered' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content: Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left: Video Player */}
          <div className="w-[60%] bg-black flex items-center justify-center relative">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center text-white/50">
                <Play size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg font-bold">No video resource attached</p>
                <p className="text-sm">Please update this topic with a YouTube URL</p>
              </div>
            )}
          </div>

          {/* Right: Resources & Checklist */}
          <div className="w-[40%] flex flex-col bg-white border-l border-[#E6E6E6]">
            
            {/* Tabs */}
            <div className="flex border-b border-[#E6E6E6]">
              {[
                { id: 'notes', label: 'Short Notes', icon: FileText },
                { id: 'mcqs', label: 'MCQs', icon: CheckCircle2, hide: task.hasMcqs === false },
                { id: 'pyqs', label: 'PYQs', icon: Target, hide: task.hasPyqs === false },
              ].filter(t => !t.hide).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    activeTab === tab.id 
                      ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]' 
                      : 'text-[#6B6B6B] hover:text-[#4A3728]'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {activeTab === 'notes' && (
                <div className="prose prose-stone max-w-none">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#4A3728]">Syllabus Summary</h3>
                    <button className="text-[11px] font-bold text-[var(--primary)] flex items-center gap-1 hover:underline">
                      <ExternalLink size={12} /> Open Full PDF
                    </button>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-[#4A3728] leading-relaxed">
                    {task.notes || "No notes available for this topic yet. Start by watching the video and summarizing the key points here."}
                  </div>
                </div>
              )}

              {activeTab === 'mcqs' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#4A3728]">Topic Quiz</h3>
                  <p className="text-sm text-[#6B6B6B]">Solve 10 curated MCQs to test your understanding of {task.topicName}.</p>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-4 border border-[#E6E6E6] rounded-xl hover:border-[var(--primary)] cursor-pointer transition-colors">
                        <p className="text-[14px] font-bold text-[#4A3728] mb-2">Practice Set {i}</p>
                        <div className="flex items-center justify-between text-[11px] font-medium text-[#6B6B6B]">
                          <span>10 Questions</span>
                          <span>Est. 15 mins</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pyqs' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-[#4A3728]">University PYQs</h3>
                  <p className="text-sm text-[#6B6B6B]">Exam questions from previous years for {task.topicName}.</p>
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="text-amber-600" />
                      <h4 className="font-bold text-amber-900">SPPU Pattern Focus</h4>
                    </div>
                    <p className="text-[13px] text-amber-800 leading-relaxed">
                      This topic appeared in **April 2023** and **Oct 2022** exams. Focus on "Conceptual Implementation" for 10-mark questions.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Execution Bar */}
            <div className="p-6 bg-gray-50 border-t border-[#E6E6E6]">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#6B6B6B] mb-4">Update Progress</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'video', label: 'Watched Video', icon: Play, checked: task.videoCompleted },
                  { id: 'notes', label: 'Read Notes', icon: FileText, checked: task.notesCompleted },
                  { id: 'mcq', label: 'Solved MCQs', icon: CheckCircle2, checked: task.mcqCompleted, hide: task.hasMcqs === false },
                  { id: 'pyq', label: 'Solved PYQs', icon: Target, checked: task.pyqCompleted, hide: task.hasPyqs === false },
                ].filter(st => !st.hide).map(st => (
                  <button
                    key={st.id}
                    onClick={() => handleToggleSubtask(st.id, st.checked)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      st.checked 
                        ? 'bg-green-600 border-green-600 text-white shadow-lg' 
                        : 'bg-white border-[#E6E6E6] text-[#4A3728] hover:border-[var(--primary)]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${st.checked ? 'bg-white/20' : 'bg-gray-100'}`}>
                      <st.icon size={12} />
                    </div>
                    <span className="text-[12px] font-bold">{st.label}</span>
                  </button>
                ))}
              </div>

              {task.status === 'completed' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 animate-bounce">
                  <CheckCircle2 className="text-green-600" />
                  <p className="text-[13px] font-bold text-green-800 text-center flex-1">
                    Mastery Achieved! This topic is now scheduled for revision in 3 days.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default TopicStudyView;
