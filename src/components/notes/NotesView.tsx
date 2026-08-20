import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Tag, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  Eye,
  Check,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Note } from '../../types';

export const NotesView: React.FC = () => {
  const { notes, subjects, addNote, updateNote, deleteNote, togglePinNote } = useStudy();
  
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isEditing, setIsEditing] = useState(false);
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);

  // Edit draft state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftCategory, setDraftCategory] = useState<Note['category']>('Lecture');
  const [draftSubjectId, setDraftSubjectId] = useState('');

  const activeNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  // Filtering
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (selectedCategory !== 'All' && note.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleStartEdit = () => {
    if (!activeNote) return;
    setDraftTitle(activeNote.title);
    setDraftContent(activeNote.content);
    setDraftCategory(activeNote.category);
    setDraftSubjectId(activeNote.subjectId || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!activeNote || !draftTitle.trim()) return;
    updateNote(activeNote.id, {
      title: draftTitle.trim(),
      content: draftContent,
      category: draftCategory,
      subjectId: draftSubjectId || undefined,
    });
    setIsEditing(false);
  };

  const handleCreateNewNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    addNote({
      title: draftTitle.trim(),
      content: draftContent || '# ' + draftTitle.trim() + '\n\nStart typing notes here...',
      category: draftCategory,
      subjectId: draftSubjectId || undefined,
      pinned: false,
      tags: ['StudyNotes'],
    });

    setDraftTitle('');
    setDraftContent('');
    setIsNewNoteModalOpen(false);
  };

  const categories = ['All', 'Lecture', 'Summary', 'Cheatsheet', 'Idea', 'Exam Prep'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
            KNOWLEDGE CAPTURE & NOTES
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Academic Notes & Cheatsheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Write structured lecture summaries, code snippets, and active recall outlines.
          </p>
        </div>

        <button
          onClick={() => {
            setDraftTitle('');
            setDraftContent('');
            setIsNewNoteModalOpen(true);
          }}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-blue flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Main Grid: Left Notes List Sidebar | Right Note Detail & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Notes Directory */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-5 border border-white/10 shadow-glass-3d space-y-4">
          {/* Search & Categories */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, tags..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-glow-blue'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No notes found.</p>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                const subject = subjects.find(s => s.id === note.subjectId);

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setIsEditing(false);
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-slate-100 shadow-glow-blue'
                        : 'bg-slate-900/60 border-white/5 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold truncate flex-1">{note.title}</h4>
                      {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                      {note.content.replace(/[#*`$]/g, '')}
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-slate-400">{note.category}</span>
                      {subject && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold"
                          style={{ backgroundColor: `${subject.color}20`, color: subject.color }}
                        >
                          {subject.code}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Viewer & Markdown Editor */}
        <div className="lg:col-span-8 rounded-3xl glass-panel p-6 border border-white/10 shadow-glass-3d space-y-6 flex flex-col justify-between min-h-[500px]">
          {activeNote ? (
            <div>
              {/* Note Header & Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
                      {activeNote.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Updated {new Date(activeNote.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {!isEditing ? (
                    <h2 className="text-xl font-extrabold text-slate-100">{activeNote.title}</h2>
                  ) : (
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      className="w-full text-lg font-bold px-3 py-1.5 rounded-xl bg-slate-900/80 border border-indigo-400 text-slate-100"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePinNote(activeNote.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      activeNote.pinned
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white border-white/5'
                    }`}
                    title={activeNote.pinned ? 'Unpin note' : 'Pin note'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  {!isEditing ? (
                    <button
                      onClick={handleStartEdit}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all hover:scale-105"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:scale-105 transition-all"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Save Changes</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-rose-400 border border-white/5 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content Area */}
              <div className="pt-4">
                {!isEditing ? (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line space-y-4">
                    {activeNote.content}
                  </div>
                ) : (
                  <textarea
                    rows={16}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    className="w-full font-mono text-xs p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-100 focus:outline-none focus:border-indigo-400 resize-none leading-relaxed"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              Select or create a note to start writing.
            </div>
          )}

          {/* Tags Footer */}
          {activeNote && activeNote.tags && activeNote.tags.length > 0 && (
            <div className="pt-4 border-t border-white/5 flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {activeNote.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Note Modal */}
      {isNewNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Create Academic Note</h3>
              </div>
              <button
                onClick={() => setIsNewNoteModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms & Shortest Path Notes"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Summary">Summary</option>
                    <option value="Cheatsheet">Cheatsheet</option>
                    <option value="Idea">Idea</option>
                    <option value="Exam Prep">Exam Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={draftSubjectId}
                    onChange={(e) => setDraftSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="">General</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Content (Markdown Supported)</label>
                <textarea
                  rows={6}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="# Formulas, key algorithms, active recall notes..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 resize-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewNoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-glow-blue hover:scale-105 transition-transform"
                >
                  Create Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
