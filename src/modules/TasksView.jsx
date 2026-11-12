import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Tag, 
  Kanban, 
  List,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  X
} from 'lucide-react';
import { addItem, updateItem, deleteItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';
import confetti from 'canvas-confetti';

const STATUS_COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'border-slate-700 bg-slate-900/40 text-slate-300' },
  { id: 'in-progress', label: 'In Progress', color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300' },
  { id: 'review', label: 'In Review', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
  { id: 'done', label: 'Completed', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
];

export default function TasksView({ tasks = [] }) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal create state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newCategory, setNewCategory] = useState('Engineering');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  // Subtask expand toggle state per task
  const [expandedTasks, setExpandedTasks] = useState({});

  const toggleExpand = (id) => {
    setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubtaskDraft = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, { id: `st-${Date.now()}`, text: subtaskInput.trim(), completed: false }]);
    setSubtaskInput('');
  };

  const handleRemoveSubtaskDraft = (idx) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    await addItem(user.uid, 'tasks', {
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: 'todo',
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate,
      subtasks
    });

    setNewTitle('');
    setNewDesc('');
    setSubtasks([]);
    setShowAddModal(false);
  };

  const handleStatusChange = async (task, newStatus) => {
    if (!user) return;
    if (newStatus === 'done' && task.status !== 'done') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
    await updateItem(user.uid, 'tasks', task.id, { status: newStatus });
  };

  const handleToggleSubtask = async (task, subtaskId) => {
    if (!user) return;
    const updatedSubtasks = (task.subtasks || []).map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    await updateItem(user.uid, 'tasks', task.id, { subtasks: updatedSubtasks });
  };

  const handleDeleteTask = async (taskId) => {
    if (!user) return;
    if (confirm('Delete this task?')) {
      await deleteItem(user.uid, 'tasks', taskId);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          (task.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <span>Task & Project Pipeline</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize high-impact initiatives, sprint backlogs, and daily checklists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* New Task Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card p-3 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">🔴 Urgent</option>
          <option value="high">🟠 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter(t => (t.status || 'todo') === col.id);
            return (
              <div 
                key={col.id} 
                className="glass-card rounded-2xl border border-slate-800/80 p-4 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white tracking-wide">{col.label}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {colTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-slate-850 rounded-xl flex items-center justify-center text-[11px] text-slate-500">
                      Empty column
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const completedSt = (task.subtasks || []).filter(s => s.completed).length;
                      const totalSt = (task.subtasks || []).length;

                      return (
                        <div
                          key={task.id}
                          className="bg-slate-900 border border-slate-800/90 rounded-2xl p-4 shadow-sm hover:border-indigo-500/40 transition group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              task.priority === 'urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              task.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              task.priority === 'medium' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {task.priority}
                            </span>

                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-xs font-semibold text-white mt-2 leading-snug">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Subtasks Progress */}
                          {totalSt > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                              <button
                                onClick={() => toggleExpand(task.id)}
                                className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200"
                              >
                                <span>Checklist ({completedSt}/{totalSt})</span>
                                {expandedTasks[task.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                              </button>

                              {expandedTasks[task.id] && (
                                <div className="mt-2 space-y-1.5 pl-1">
                                  {task.subtasks.map((st) => (
                                    <div 
                                      key={st.id} 
                                      onClick={() => handleToggleSubtask(task, st.id)}
                                      className="flex items-center space-x-2 text-[11px] text-slate-300 cursor-pointer"
                                    >
                                      {st.completed ? (
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                      ) : (
                                        <Circle className="w-3 h-3 text-slate-600 flex-shrink-0" />
                                      )}
                                      <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                        {st.text}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Footer Info & Move Select */}
                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <div className="flex items-center space-x-1.5 text-slate-400 font-mono">
                              <Calendar className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </div>

                            {/* Status dropdown */}
                            <select
                              value={task.status || 'todo'}
                              onChange={(e) => handleStatusChange(task, e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded-lg px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                            >
                              <option value="todo">To Do</option>
                              <option value="in-progress">In Progress</option>
                              <option value="review">Review</option>
                              <option value="done">Completed</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="glass-card rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No tasks matched your filter.</div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/50 transition group"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <button onClick={() => handleStatusChange(task, task.status === 'done' ? 'todo' : 'done')}>
                    {task.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        task.priority === 'urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        task.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-slate-400">{task.category}</span>
                      <span className="text-[10px] text-slate-500 font-mono">• {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-auto">
                  <select
                    value={task.status || 'todo'}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Completed</option>
                  </select>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create New Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Task title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Add details, links, or notes..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Subtasks Builder */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Checklist Subtasks</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add step / item..."
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtaskDraft(); } }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtaskDraft}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl"
                  >
                    Add
                  </button>
                </div>

                {subtasks.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {subtasks.map((st, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
                        <span className="text-slate-300">{st.text}</span>
                        <button type="button" onClick={() => handleRemoveSubtaskDraft(i)} className="text-slate-500 hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
