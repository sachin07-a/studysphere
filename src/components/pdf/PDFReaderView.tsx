import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Save, 
  Layers, 
  BookOpen, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Columns
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface SampleDoc {
  id: string;
  title: string;
  category: string;
  url: string;
}

const SAMPLE_DOCS: SampleDoc[] = [
  {
    id: 'doc_dsa',
    title: 'MIT 6.006: Advanced Algorithms & Data Structures',
    category: 'Computer Science',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/resources/mit6_006f11_lec01.pdf'
  },
  {
    id: 'doc_ai',
    title: 'Attention Is All You Need (Original Transformer Paper)',
    category: 'AI & Machine Learning',
    url: 'https://arxiv.org/pdf/1706.03762.pdf'
  },
  {
    id: 'doc_chem',
    title: 'Organic Chemistry Reaction Mechanisms Compendium',
    category: 'Chemistry & Biology',
    url: 'https://openstax.org/details/books/chemistry-2e'
  }
];

export const PDFReaderView: React.FC = () => {
  const { 
    addNote, 
    addFlashcard, 
    decks, 
    timerMode, 
    timeLeft, 
    isTimerRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer,
    triggerConfetti 
  } = useStudy();

  const [activeDocUrl, setActiveDocUrl] = useState<string>(SAMPLE_DOCS[0].url);
  const [customPdfInput, setCustomPdfInput] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [noteTitle, setNoteTitle] = useState<string>('Lecture Synthesis & Key Theorems');
  const [noteContent, setNoteContent] = useState<string>(
    `# Lecture Notes: Core Theorems & Derivations\n\n- **Key Takeaway 1**: Asymptotic tight bounds provide invariant guarantees.\n- **Formula to remember**: T(n) = aT(n/b) + f(n)\n- **Action item**: Review Master Theorem case 2 before recitation.`
  );
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) return;
    addNote({
      title: noteTitle.trim() || 'Split-Screen Lecture Note',
      content: noteContent,
      category: 'Lecture',
      pinned: false,
      tags: ['PDF Study', 'Lecture Slides']
    });

    setSavedNotification('Saved to Notebook! 📝');
    setTimeout(() => setSavedNotification(null), 2500);
  };

  const handleConvertToFlashcard = () => {
    if (!noteContent.trim() || decks.length === 0) return;
    const lines = noteContent.split('\n').filter(l => l.trim().length > 0);
    const front = noteTitle || 'Lecture Key Concept';
    const back = lines.slice(0, 5).join('\n');

    addFlashcard({
      deckId: decks[0].id,
      front,
      back,
      tags: ['PDF Quick Capture']
    });

    triggerConfetti();
    setSavedNotification(`Converted to flashcard in "${decks[0].title}"! 🧠`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPdfInput.trim()) {
      setActiveDocUrl(customPdfInput.trim());
      setCustomPdfInput('');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            SPLIT-SCREEN WORKSTATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Lecture PDF & Slide Study Reader
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Read textbook chapters and slides side-by-side with an active note scratchpad and focus timer.
          </p>
        </div>

        {/* Document Preset Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {SAMPLE_DOCS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDocUrl(doc.url)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocUrl === doc.url
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-glow-cyan'
                  : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-slate-200'
              }`}
            >
              {doc.category}
            </button>
          ))}
        </div>
      </div>

      {/* Custom PDF Link Form */}
      <form onSubmit={handleLoadCustomUrl} className="flex gap-2">
        <input
          type="url"
          value={customPdfInput}
          onChange={(e) => setCustomPdfInput(e.target.value)}
          placeholder="Paste any PDF URL or open textbook link (e.g. https://.../lecture.pdf)..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all hover:scale-105"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Load Document</span>
        </button>
      </form>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[680px]">
        {/* Left Column (7 cols): Document PDF Frame */}
        <div className="lg:col-span-7 rounded-3xl glass-panel border border-white/10 shadow-glass-3d flex flex-col overflow-hidden bg-slate-950/80">
          {/* Top PDF Controls Bar */}
          <div className="p-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-slate-200 truncate">
                {SAMPLE_DOCS.find(d => d.url === activeDocUrl)?.title || 'Custom Study Document'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(200, prev + 15))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <a
                href={activeDocUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-1"
                title="Open in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Embedded Document Frame */}
          <div className="flex-1 w-full h-[600px] relative bg-slate-950 flex items-center justify-center">
            <iframe
              src={activeDocUrl}
              title="Lecture Document Viewer"
              className="w-full h-full border-0"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left', width: `${(100 / zoomLevel) * 100}%`, height: `${(100 / zoomLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Column (5 cols): Notes Scratchpad & Mini Focus Timer */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-5 sm:p-6 border border-white/10 shadow-glass-3d flex flex-col justify-between space-y-4">
          {/* Top Mini Timer & Notification */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-slate-300">
                  Focus Timer
                </span>
                <span className="text-sm font-extrabold font-mono text-cyan-400">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={resetTimer}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={isTimerRunning ? pauseTimer : startTimer}
                  className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1 transition-all"
                >
                  {isTimerRunning ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isTimerRunning ? 'Pause' : 'Focus'}</span>
                </button>
              </div>
            </div>

            {savedNotification && (
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center animate-in fade-in duration-150">
                {savedNotification}
              </div>
            )}

            {/* Note Title Input */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Note Heading
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Markdown Scratchpad */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Lecture Notes & Markdown Scratchpad
              </label>
              <textarea
                rows={14}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Type formulas, bullet points, question notes while reading..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
            <button
              onClick={handleSaveNote}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-cyan-400" />
              <span>Save to Notes</span>
            </button>

            <button
              onClick={handleConvertToFlashcard}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-purple flex items-center justify-center gap-1.5 transition-all hover:scale-105"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Make Flashcard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
