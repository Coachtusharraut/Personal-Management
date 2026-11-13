import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Trash2, 
  Award, 
  Sparkles, 
  Calendar, 
  Check, 
  X,
  TrendingUp,
  Heart
} from 'lucide-react';
import { addItem, updateItem, deleteItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';
import confetti from 'canvas-confetti';

export default function HabitsView({ habits = [] }) {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Health');

  // Compute trailing 7 days
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: i === 6,
      formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });

  const todayStr = days[6].dateStr;

  const handleToggleDay = async (habit, dateStr) => {
    if (!user) return;
    const history = { ...(habit.history || {}) };
    const wasChecked = !!history[dateStr];

    if (wasChecked) {
      delete history[dateStr];
    } else {
      history[dateStr] = true;
      if (dateStr === todayStr) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
      }
    }

    // Recalculate current streak
    let streak = 0;
    let checkDate = new Date();
    while (true) {
      const ds = checkDate.toISOString().split('T')[0];
      if (history[ds]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    await updateItem(user.uid, 'habits', habit.id, { history, streak });
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;

    await addItem(user.uid, 'habits', {
      name: newName.trim(),
      description: newDesc.trim(),
      category: newCategory,
      streak: 0,
      targetDays: 7,
      history: {}
    });

    setNewName('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const handleDeleteHabit = async (habitId) => {
    if (!user) return;
    if (confirm('Delete this habit?')) {
      await deleteItem(user.uid, 'habits', habitId);
    }
  };

  const todayCompletedCount = habits.filter(h => h.history && h.history[todayStr]).length;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const consistencyRate = habits.length ? Math.round((todayCompletedCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Habits & Micro-Routines</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build unshakeable daily consistency. Small compound wins create extraordinary results.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Today's Progress</span>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-white">{todayCompletedCount}/{habits.length}</span>
              <span className="text-xs text-amber-400">({consistencyRate}%)</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Top Active Streak</span>
            <div className="mt-1 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-amber-400">{longestStreak}</span>
              <span className="text-xs text-slate-400">consecutive days</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Daily Streak Status</span>
            <div className="mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                consistencyRate === 100 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}>
                {consistencyRate === 100 ? '⭐ Perfect Day Complete' : 'In Progress'}
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Habits 7-Day Matrix Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 p-4 bg-slate-950/80 border-b border-slate-800 text-xs font-bold text-slate-400">
          <div className="col-span-5 md:col-span-6">HABIT & CATEGORY</div>
          <div className="col-span-2 md:col-span-1 text-center">STREAK</div>
          <div className="col-span-5 md:col-span-5 grid grid-cols-7 gap-1 text-center">
            {days.map((day) => (
              <div 
                key={day.dateStr}
                className={`flex flex-col items-center justify-center p-1 rounded-lg ${
                  day.isToday ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30' : 'text-slate-400'
                }`}
                title={day.formatted}
              >
                <span className="text-[10px] font-mono">{day.dayName}</span>
                <span className="text-[9px] font-bold">{day.dateStr.split('-')[2]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-850">
          {habits.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No habits created yet. Click "+ New Habit" to establish routines.
            </div>
          ) : (
            habits.map((habit) => (
              <div 
                key={habit.id}
                className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-slate-900/40 transition group"
              >
                {/* Habit Info */}
                <div className="col-span-5 md:col-span-6 min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white truncate">{habit.name}</span>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[10px] text-indigo-400 font-medium">{habit.category}</span>
                    {habit.description && (
                      <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
                        • {habit.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="col-span-2 md:col-span-1 text-center">
                  <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{habit.streak || 0}</span>
                  </div>
                </div>

                {/* 7-Day Checkboxes */}
                <div className="col-span-5 md:col-span-5 grid grid-cols-7 gap-1">
                  {days.map((day) => {
                    const isChecked = !!(habit.history && habit.history[day.dateStr]);
                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => handleToggleDay(habit, day.dateStr)}
                        className={`h-8 rounded-xl flex items-center justify-center transition transform active:scale-90 ${
                          isChecked 
                            ? 'bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                            : day.isToday
                              ? 'bg-slate-900 border border-dashed border-indigo-500/40 text-slate-500 hover:border-indigo-400 hover:text-slate-300'
                              : 'bg-slate-900/60 border border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                        }`}
                        title={`${habit.name} on ${day.formatted}: ${isChecked ? 'Completed' : 'Pending'}`}
                      >
                        {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '•'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">New Daily Habit</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 pages..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                >
                  <option value="Health">Health & Fitness</option>
                  <option value="Engineering">Engineering & Coding</option>
                  <option value="Mindset">Mindset & Reading</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description / Cue</label>
                <input
                  type="text"
                  placeholder="e.g. Right after morning coffee..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
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
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20"
                >
                  Establish Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
