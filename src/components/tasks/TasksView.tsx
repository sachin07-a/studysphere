import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Calendar, 
  Clock, 
  Sparkles, 
  Tag, 
  Check, 
  LayoutGrid, 
  List,
  AlertCircle,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Task, Priority } from '../../types';

export const TasksView: React.FC = () => {
  const { tasks, subjects, addTask, toggleTask, deleteTask, updateTask } = useStudy();
  
  const [filterCategory, setFilterCategory] = useState<'all' | 'today' | 'upcoming' | 'completed' | 'overdue'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [priority, setPriority] = useState<Priority>('high');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    // Search
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    // Subject Filter
    if (selectedSubjectFilter !== 'all' && task.subjectId !== selectedSubjectFilter) {
      return false;
    }

    // Category Tabs
    if (filterCategory === 'today') {
      return task.dueDate === todayStr || task.completedAt?.startsWith(todayStr);
    }
    if (filterCategory === 'upcoming') {
      return !task.completed && task.dueDate > todayStr;
    }
    if (filterCategory === 'completed') {
      return task.completed;
    }
    if (filterCategory === 'overdue') {
      return !task.completed && task.dueDate < todayStr;
    }
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      subjectId: subjectId || undefined,
      priority,
      dueDate,
      completed: false,
      subtasks: [],
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const nextSubtasks = targetTask.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    updateTask(taskId, { subtasks: nextSubtasks });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-bold">
            ACADEMIC TASK WORKFLOW
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Assignments & Task Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Organize assignments, problem sets, and milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-blue flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 rounded-2xl glass-panel border border-white/10">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, concepts..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['all', 'today', 'upcoming', 'completed', 'overdue'] as const).map((cat) => {
            const count = tasks.filter(t => {
              if (cat === 'today') return t.dueDate === todayStr;
              if (cat === 'upcoming') return !t.completed && t.dueDate > todayStr;
              if (cat === 'completed') return t.completed;
              if (cat === 'overdue') return !t.completed && t.dueDate < todayStr;
              return true;
            }).length;

            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-glow-blue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{cat}</span>
                <span className="ml-1 text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`p-2 rounded-xl transition-colors ${
              viewMode === 'matrix' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
            title="Eisenhower Priority Matrix (2x2)"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content: List View vs Priority Matrix */}
      {viewMode === 'list' ? (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="rounded-3xl glass-panel p-12 text-center border border-white/10">
              <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-200">No tasks found</h3>
              <p className="text-xs text-slate-400 mt-1">All assignments in this view are completed or clear!</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const subject = subjects.find(s => s.id === task.subjectId);
              const isOverdue = !task.completed && task.dueDate < todayStr;
              const hasSubtasks = task.subtasks && task.subtasks.length > 0;
              const completedSubtasks = hasSubtasks ? task.subtasks.filter(st => st.completed).length : 0;

              return (
                <div
                  key={task.id}
                  className={`rounded-2xl p-4 glass-panel border transition-all duration-200 ${
                    task.completed
                      ? 'border-emerald-500/30 opacity-70 bg-emerald-950/10'
                      : isOverdue
                      ? 'border-rose-500/40 bg-rose-950/10'
                      : 'border-white/10 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Checkbox and Content */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          task.completed
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                            : 'border-2 border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/10'
                        }`}
                      >
                        {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className={`text-sm font-bold truncate ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}>
                            {task.title}
                          </h4>

                          {/* Subject Pill */}
                          {subject && (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${subject.color}20`, color: subject.color, border: `1px solid ${subject.color}40` }}
                            >
                              {subject.name}
                            </span>
                          )}

                          {/* Priority Pill */}
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            task.priority === 'high'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : task.priority === 'medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {task.priority}
                          </span>

                          {/* Overdue alert */}
                          {isOverdue && (
                            <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                              <AlertCircle className="w-3 h-3" />
                              <span>Overdue</span>
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress */}
                        {hasSubtasks && (
                          <div className="space-y-1.5 mt-2.5 pt-2.5 border-t border-white/5">
                            <div className="flex justify-between text-[11px] font-mono text-slate-400">
                              <span>Subtasks ({completedSubtasks}/{task.subtasks.length})</span>
                              <span>{Math.round((completedSubtasks / task.subtasks.length) * 100)}%</span>
                            </div>
                            <div className="space-y-1">
                              {task.subtasks.map((st) => (
                                <button
                                  key={st.id}
                                  onClick={() => toggleSubtask(task.id, st.id)}
                                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
                                >
                                  <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                                    st.completed ? 'bg-indigo-500 text-white' : 'border border-slate-600'
                                  }`}>
                                    {st.completed && '✓'}
                                  </div>
                                  <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                    {st.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer Due Date */}
                        <div className="flex items-center gap-3 mt-2.5 text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>Due {task.dueDate === todayStr ? 'Today' : task.dueDate}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Action */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-white/5 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Eisenhower 2x2 Priority Matrix View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Quadrant 1: Urgent & High Priority */}
          <div className="rounded-3xl glass-panel p-5 border border-rose-500/30 bg-rose-950/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                🔥 Urgent & High Impact (Do First)
              </h4>
              <span className="text-xs font-mono text-rose-400">
                {tasks.filter(t => !t.completed && t.priority === 'high').length}
              </span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tasks.filter(t => !t.completed && t.priority === 'high').map(t => (
                <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-slate-200 truncate">{t.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Due {t.dueDate}</p>
                  </div>
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="w-5 h-5 rounded border border-slate-600 hover:border-cyan-400 shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 2: Important Not Urgent */}
          <div className="rounded-3xl glass-panel p-5 border border-indigo-500/30 bg-indigo-950/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                ⚡ Important & Scheduled (Plan)
              </h4>
              <span className="text-xs font-mono text-indigo-400">
                {tasks.filter(t => !t.completed && t.priority === 'medium').length}
              </span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tasks.filter(t => !t.completed && t.priority === 'medium').map(t => (
                <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-slate-200 truncate">{t.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Due {t.dueDate}</p>
                  </div>
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="w-5 h-5 rounded border border-slate-600 hover:border-cyan-400 shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 3: Low Priority / Quick Wins */}
          <div className="rounded-3xl glass-panel p-5 border border-emerald-500/30 bg-emerald-950/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                🌿 Low Effort / Quick Wins
              </h4>
              <span className="text-xs font-mono text-emerald-400">
                {tasks.filter(t => !t.completed && t.priority === 'low').length}
              </span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tasks.filter(t => !t.completed && t.priority === 'low').map(t => (
                <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-slate-200 truncate">{t.title}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Due {t.dueDate}</p>
                  </div>
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="w-5 h-5 rounded border border-slate-600 hover:border-cyan-400 shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Quadrant 4: Completed Archival */}
          <div className="rounded-3xl glass-panel p-5 border border-cyan-500/30 bg-cyan-950/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                ✨ Completed Trophies
              </h4>
              <span className="text-xs font-mono text-cyan-400">
                {tasks.filter(t => t.completed).length}
              </span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tasks.filter(t => t.completed).slice(0, 5).map(t => (
                <div key={t.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between opacity-80">
                  <p className="text-xs font-semibold text-slate-400 line-through truncate">{t.title}</p>
                  <span className="text-xs text-emerald-400 font-bold">✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl glass-panel p-6 border border-white/20 shadow-glass-3d space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Create Academic Task</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete Calculus Problem Set #5"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details, formulas, or links..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="">General</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                  >
                    <option value="high">High Priority 🔥</option>
                    <option value="medium">Medium Priority ⚡</option>
                    <option value="low">Low Priority 🌿</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-glow-blue hover:scale-105 transition-transform"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
