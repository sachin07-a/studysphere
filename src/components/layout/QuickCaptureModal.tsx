import React, { useState } from 'react';
import { X, CheckSquare, FileText, Sparkles } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Priority } from '../../types';

export const QuickCaptureModal: React.FC = () => {
  const { 
    isQuickCaptureOpen, 
    setIsQuickCaptureOpen, 
    addTask, 
    addNote, 
    subjects 
  } = useStudy();

  const [captureType, setCaptureType] = useState<'task' | 'note'>('task');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('medium');
  const [noteCategory, setNoteCategory] = useState<'Lecture' | 'Summary' | 'Cheatsheet' | 'Idea' | 'Exam Prep'>('Idea');
  const [tagInput, setTagInput] = useState('');

  if (!isQuickCaptureOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (captureType === 'task') {
      addTask({
        title: title.trim(),
        description: content.trim() || undefined,
        subjectId: subjectId || undefined,
        priority,
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        subtasks: [],
      });
    } else {
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      addNote({
        title: title.trim(),
        content: content.trim() || '# ' + title.trim(),
        subjectId: subjectId || undefined,
        category: noteCategory,
        pinned: false,
        tags: tags.length ? tags : ['QuickCapture'],
      });
    }

    // Reset and close
    setTitle('');
    setContent('');
    setTagInput('');
    setIsQuickCaptureOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 shadow-glass-3d border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Quick Capture</h3>
              <p className="text-xs text-slate-400">Capture tasks or flash notes instantly (Ctrl+K)</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickCaptureOpen(false)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Capture Type Switcher */}
        <div className="flex p-1 mt-4 rounded-xl bg-slate-900/80 border border-white/5">
          <button
            type="button"
            onClick={() => setCaptureType('task')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              captureType === 'task'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setCaptureType('note')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              captureType === 'note'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={captureType === 'task' ? "What do you need to accomplish?" : "Note Title..."}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder={captureType === 'task' ? "Optional details, subtasks, or links..." : "Write your thoughts, markdown notes, code snippets..."}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>

          {/* Metadata Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="">General / None</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            {captureType === 'task' ? (
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="high">High Priority 🔥</option>
                  <option value="medium">Medium Priority ⚡</option>
                  <option value="low">Low Priority 🌿</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Summary">Summary</option>
                  <option value="Cheatsheet">Cheatsheet</option>
                  <option value="Idea">Idea</option>
                  <option value="Exam Prep">Exam Prep</option>
                </select>
              </div>
            )}
          </div>

          {captureType === 'note' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. AI, Math, Exam2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsQuickCaptureOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-bold text-white shadow-glow-cyan transition-all transform active:scale-95"
            >
              Save {captureType === 'task' ? 'Task' : 'Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
