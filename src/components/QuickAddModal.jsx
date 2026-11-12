import React, { useState } from 'react';
import { X, CheckSquare, Flame, FileText, Wallet, Target } from 'lucide-react';
import { addItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';

export default function QuickAddModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const [tab, setTab] = useState('task'); // 'task', 'habit', 'note', 'expense'
  
  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskCategory, setTaskCategory] = useState('Engineering');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Habit state
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Health');
  const [habitDesc, setHabitDesc] = useState('');

  // Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Productivity');

  // Expense state
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expType, setExpType] = useState('expense');
  const [expCategory, setExpCategory] = useState('Technology');

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      if (tab === 'task') {
        if (!taskTitle.trim()) return;
        await addItem(user.uid, 'tasks', {
          title: taskTitle.trim(),
          description: '',
          status: 'todo',
          priority: taskPriority,
          category: taskCategory,
          dueDate: taskDueDate,
          subtasks: []
        });
        setTaskTitle('');
      } else if (tab === 'habit') {
        if (!habitName.trim()) return;
        await addItem(user.uid, 'habits', {
          name: habitName.trim(),
          description: habitDesc.trim(),
          category: habitCategory,
          streak: 0,
          targetDays: 7,
          history: {}
        });
        setHabitName('');
        setHabitDesc('');
      } else if (tab === 'note') {
        if (!noteTitle.trim()) return;
        await addItem(user.uid, 'notes', {
          title: noteTitle.trim(),
          content: noteContent.trim(),
          category: noteCategory,
          pinned: false,
          updatedAt: new Date().toISOString()
        });
        setNoteTitle('');
        setNoteContent('');
      } else if (tab === 'expense') {
        if (!expDesc.trim() || !expAmount) return;
        await addItem(user.uid, 'expenses', {
          description: expDesc.trim(),
          amount: parseFloat(expAmount) || 0,
          type: expType,
          category: expCategory,
          date: new Date().toISOString().split('T')[0]
        });
        setExpDesc('');
        setExpAmount('');
      }

      if (onCreated) onCreated(tab);
      onClose();
    } catch (err) {
      console.error('Error in QuickAdd:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-white tracking-tight">Quick Action</span>
            <span className="text-xs text-slate-400">Add to Tushar Raut OS</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Type Tabs */}
        <div className="grid grid-cols-4 p-2 bg-slate-950/60 border-b border-slate-800/80 gap-1">
          <button
            type="button"
            onClick={() => setTab('task')}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              tab === 'task' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('habit')}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              tab === 'habit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Habit</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('note')}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              tab === 'note' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('expense')}
            className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
              tab === 'expense' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Finance</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'task' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Task Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Implement real-time dashboard listeners..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'habit' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Habit Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 30 Minutes of Deep Code Review"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Health">Health</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Mindset">Mindset</option>
                    <option value="Productivity">Productivity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Short trigger/routine"
                    value={habitDesc}
                    onChange={(e) => setHabitDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'note' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Note Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Ideas on Autonomous Agent Architectures"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Productivity">Productivity</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Ideas">Ideas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Content (Markdown supported)</label>
                <textarea
                  rows={3}
                  placeholder="Write your thought, reflection, or snippet..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </>
          )}

          {tab === 'expense' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setExpType('expense')}
                      className={`py-1 text-xs font-semibold rounded-lg ${expType === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpType('income')}
                      className={`py-1 text-xs font-semibold rounded-lg ${expType === 'income' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}
                    >
                      Income
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Firebase hosting & Cloud usage"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Technology">Technology</option>
                  <option value="Health">Health</option>
                  <option value="Income">Income / Retainer</option>
                  <option value="Education">Education</option>
                  <option value="Living">Living & Food</option>
                  <option value="Investments">Investments</option>
                </select>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
