import React, { useState } from 'react';
import { 
  Brain, 
  Plus, 
  Play, 
  RotateCw, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Award, 
  Zap, 
  Clock, 
  BookOpen,
  HelpCircle,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { FlashcardDeck, Flashcard } from '../../types';
import { isCardDueToday, ReviewRating } from '../../lib/spacedRepetition';

export const FlashcardsView: React.FC = () => {
  const { 
    decks, 
    flashcards, 
    addDeck, 
    deleteDeck, 
    addFlashcard, 
    deleteFlashcard, 
    reviewFlashcard,
    triggerConfetti 
  } = useStudy();

  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0);

  // Modals
  const [isAddDeckModalOpen, setIsAddDeckModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // New deck form
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('General');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newDeckColor, setNewDeckColor] = useState('#06b6d4');

  // New card form
  const [cardDeckId, setCardDeckId] = useState('');
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [cardTags, setCardTags] = useState('');

  const activeDeck = decks.find(d => d.id === activeDeckId);
  const activeDeckCards = flashcards.filter(c => c.deckId === activeDeckId);
  const reviewCards = activeDeckCards.filter(c => isCardDueToday(c));
  const currentCard = reviewCards[currentCardIndex] || activeDeckCards[currentCardIndex];

  const handleStartReview = (deckId: string) => {
    setActiveDeckId(deckId);
    setIsReviewing(true);
    setCurrentCardIndex(0);
    setIsCardFlipped(false);
    setSessionReviewedCount(0);
  };

  const handleReviewAnswer = (rating: ReviewRating) => {
    if (!currentCard) return;
    reviewFlashcard(currentCard.id, rating);
    setSessionReviewedCount(prev => prev + 1);
    setIsCardFlipped(false);

    if (currentCardIndex + 1 < (reviewCards.length > 0 ? reviewCards.length : activeDeckCards.length)) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      triggerConfetti();
      setIsReviewing(false);
    }
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    addDeck({
      title: newDeckTitle.trim(),
      subjectName: newDeckSubject.trim() || 'General',
      description: newDeckDesc.trim() || 'Spaced repetition flashcard deck.',
      color: newDeckColor
    });

    setNewDeckTitle('');
    setNewDeckDesc('');
    setIsAddDeckModalOpen(false);
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFront.trim() || !cardBack.trim() || !cardDeckId) return;

    addFlashcard({
      deckId: cardDeckId,
      front: cardFront.trim(),
      back: cardBack.trim(),
      tags: cardTags.split(',').map(t => t.trim()).filter(Boolean)
    });

    setCardFront('');
    setCardBack('');
    setCardTags('');
    setIsAddCardModalOpen(false);
  };

  // --- REVIEW MODE VIEW ---
  if (isReviewing && activeDeck) {
    const totalToReview = reviewCards.length > 0 ? reviewCards.length : activeDeckCards.length;
    const progressPercent = totalToReview > 0 ? Math.round(((currentCardIndex) / totalToReview) * 100) : 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6 pb-20 animate-in fade-in duration-200">
        {/* Top Header & Progress */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsReviewing(false)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Decks</span>
          </button>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-cyan-400">
              Card {currentCardIndex + 1} of {totalToReview}
            </span>
            <p className="text-[10px] text-slate-400 font-mono">{activeDeck.title}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 3D Flashcard Container */}
        {currentCard ? (
          <div 
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className={`min-h-[340px] sm:min-h-[400px] rounded-3xl p-8 sm:p-12 border cursor-pointer transition-all duration-500 flex flex-col justify-between select-none relative shadow-glass-3d transform perspective-1000 ${
              isCardFlipped 
                ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-purple-950/70 border-indigo-500/40 shadow-glow-purple'
                : 'bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/40 border-white/15 hover:border-cyan-500/40 shadow-glow-cyan'
            }`}
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                isCardFlipped ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}>
                {isCardFlipped ? 'Answer & Explanation 💡' : 'Question / Concept ❓'}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click to Flip</span>
              </span>
            </div>

            {/* Card Content */}
            <div className="my-auto py-6 text-center">
              <p className="text-lg sm:text-2xl font-bold text-slate-100 leading-relaxed whitespace-pre-line">
                {isCardFlipped ? currentCard.back : currentCard.front}
              </p>
              {currentCard.tags && currentCard.tags.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                  {currentCard.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Ease & Repetition telemetry */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-4 border-t border-white/5">
              <span>Interval: {currentCard.interval}d</span>
              <span>Ease: {currentCard.easeFactor}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-4 rounded-3xl glass-panel p-8">
            <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-100">All Cards Mastered for Today! 🎉</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You reviewed {sessionReviewedCount} cards. The SM-2 spaced repetition engine will schedule your next review session.
            </p>
            <button
              onClick={() => setIsReviewing(false)}
              className="px-6 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
            >
              Return to Decks
            </button>
          </div>
        )}

        {/* Spaced Repetition Quality Rating Controls */}
        {currentCard && isCardFlipped && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <p className="text-center text-xs font-semibold text-slate-400">
              How easily did you recall this answer?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleReviewAnswer(1)}
                className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex flex-col items-center gap-1 transition-all hover:scale-105"
              >
                <span>Again 🔴</span>
                <span className="text-[10px] opacity-75 font-mono">1 Day</span>
              </button>

              <button
                onClick={() => handleReviewAnswer(2)}
                className="p-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center gap-1 transition-all hover:scale-105"
              >
                <span>Hard 🟡</span>
                <span className="text-[10px] opacity-75 font-mono">3 Days</span>
              </button>

              <button
                onClick={() => handleReviewAnswer(3)}
                className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex flex-col items-center gap-1 transition-all hover:scale-105"
              >
                <span>Good 🟢</span>
                <span className="text-[10px] opacity-75 font-mono">6 Days</span>
              </button>

              <button
                onClick={() => handleReviewAnswer(4)}
                className="p-3 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex flex-col items-center gap-1 transition-all hover:scale-105"
              >
                <span>Easy 🔵</span>
                <span className="text-[10px] opacity-75 font-mono">14+ Days</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- DECK LIST VIEW ---
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            ACTIVE RECALL & SPACED REPETITION (SM-2)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Flashcard Knowledge Decks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Retain formulas, theorems, and definitions using neuro-scientific spaced repetition.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (decks.length > 0) setCardDeckId(decks[0].id);
              setIsAddCardModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Flashcard</span>
          </button>

          <button
            onClick={() => setIsAddDeckModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-cyan flex items-center gap-2 transition-all hover:scale-105"
          >
            <Layers className="w-4 h-4" />
            <span>Create Deck</span>
          </button>
        </div>
      </div>

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <div className="rounded-3xl glass-panel p-12 text-center border border-white/10 shadow-glass-3d space-y-4">
          <Brain className="w-12 h-12 text-cyan-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-100">No Flashcard Decks Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create your first deck to start mastering concepts with active recall and spaced intervals.
          </p>
          <button
            onClick={() => setIsAddDeckModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all"
          >
            Create Your First Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const cardsInDeck = flashcards.filter(c => c.deckId === deck.id);
            const dueCards = cardsInDeck.filter(c => isCardDueToday(c));
            const totalCards = cardsInDeck.length;

            return (
              <div
                key={deck.id}
                className="rounded-3xl glass-panel p-6 border border-white/10 hover:border-cyan-500/40 shadow-glass-card hover:shadow-glow-cyan transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span 
                      className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border"
                      style={{ 
                        backgroundColor: `${deck.color}15`, 
                        color: deck.color,
                        borderColor: `${deck.color}35` 
                      }}
                    >
                      {deck.subjectName}
                    </span>

                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                      title="Delete deck"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {deck.description}
                  </p>
                </div>

                <div className="pt-6 space-y-4">
                  {/* Deck Stats Row */}
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono">{totalCards} Cards</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {dueCards.length > 0 ? (
                        <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {dueCards.length} Due Today 🔥
                        </span>
                      ) : (
                        <span className="font-mono text-emerald-400 text-[11px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Up to Date</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Start Review Button */}
                  <button
                    onClick={() => handleStartReview(deck.id)}
                    disabled={totalCards === 0}
                    className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                      totalCards === 0
                        ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-glow-cyan'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{dueCards.length > 0 ? `Review ${dueCards.length} Due Cards` : 'Practice All Cards'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Deck */}
      {isAddDeckModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <form onSubmit={handleCreateDeck} className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Create Flashcard Deck</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDeckModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deck Title</label>
              <input
                type="text"
                required
                value={newDeckTitle}
                onChange={(e) => setNewDeckTitle(e.target.value)}
                placeholder="e.g. Organic Chemistry Reactions"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={newDeckSubject}
                  onChange={(e) => setNewDeckSubject(e.target.value)}
                  placeholder="e.g. Chemistry"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Color</label>
                <div className="flex items-center gap-2 pt-1">
                  {['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewDeckColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${newDeckColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
              <textarea
                rows={2}
                value={newDeckDesc}
                onChange={(e) => setNewDeckDesc(e.target.value)}
                placeholder="Core formulas, mechanism steps, and reaction reagents..."
                className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddDeckModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-glow-cyan hover:scale-105 transition-all"
              >
                Create Deck
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Create Flashcard */}
      {isAddCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <form onSubmit={handleCreateCard} className="w-full max-w-lg rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add New Flashcard</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Deck</label>
              <select
                value={cardDeckId}
                onChange={(e) => setCardDeckId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                {decks.map(d => (
                  <option key={d.id} value={d.id}>{d.title} ({d.subjectName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Front (Question / Prompt)</label>
              <textarea
                rows={3}
                required
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                placeholder="e.g. State Heisenberg's Uncertainty Principle formula."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Back (Answer / Explanation)</label>
              <textarea
                rows={3}
                required
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                placeholder="e.g. Δx * Δp ≥ ℏ / 2"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={cardTags}
                onChange={(e) => setCardTags(e.target.value)}
                placeholder="e.g. Physics, Quantum, Exam2"
                className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddCardModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-glow-cyan hover:scale-105 transition-all"
              >
                Save Flashcard
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
