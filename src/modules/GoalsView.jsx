import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  X, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { addItem, updateItem, deleteItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';
import confetti from 'canvas-confetti';

export default function GoalsView({ goals = [] }) {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Career & Tech');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [milestoneDraft, setMilestoneDraft] = useState('');
  const [milestones, setMilestones] = useState([]);

  const handleAddMilestoneDraft = () => {
    if (!milestoneDraft.trim()) return;
    setMilestones([...milestones, { text: milestoneDraft.trim(), done: false }]);
    setMilestoneDraft('');
  };

  const handleRemoveMilestoneDraft = (idx) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!user || !title.trim()) return;

    await addItem(user.uid, 'goals', {
      title: title.trim(),
      category,
      targetDate,
      progress: 0,
      milestones
    });

    setTitle('');
    setMilestones([]);
    setShowAddModal(false);
  };

  const handleUpdateProgress = async (goal, newProgress) => {
    if (!user) return;
    const clamped = Math.max(0, Math.min(100, newProgress));
    if (clamped === 100 && goal.progress !== 100) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
    await updateItem(user.uid, 'goals', goal.id, { progress: clamped });
  };

  const handleToggleMilestone = async (goal, idx) => {
    if (!user) return;
    const updated = (goal.milestones || []).map((m, i) => i === idx ? { ...m, done: !m.done } : m);
    // Auto-calculate progress based on milestones if milestones exist
    const completedCount = updated.filter(m => m.done).length;
    const progress = Math.round((completedCount / updated.length) * 100);
    
    if (progress === 100 && goal.progress !== 100) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }

    await updateItem(user.uid, 'goals', goal.id, { milestones: updated, progress });
  };

  const handleDelete = async (id) => {
    if (!user) return;
    if (confirm('Delete this goal?')) {
      await deleteItem(user.uid, 'goals', id);
    }
  };

  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days left` : 'Target reached';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span>Strategic Goals & Milestones</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Life vision, yearly objectives, and quantifiable benchmarks.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition transform active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No goals defined yet. Set your vision by clicking "+ New Goal".
          </div>
        ) : (
          goals.map((goal) => {
            const daysLeft = getDaysRemaining(goal.targetDate);
            const isFinished = goal.progress >= 100;

            return (
              <div 
                key={goal.id}
                className={`glass-card p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isFinished 
                    ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 to-slate-900' 
                    : 'border-slate-800 hover:border-purple-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {goal.category}
                    </span>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-3 leading-snug">
                    {goal.title}
                  </h3>

                  {/* Progress Bar & Slider */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Completion</span>
                      <span className={`font-mono ${isFinished ? 'text-emerald-400 font-bold' : 'text-purple-400'}`}>
                        {goal.progress || 0}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFinished 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        }`}
                        style={{ width: `${goal.progress || 0}%` }}
                      />
                    </div>

                    {/* Progress Slider */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleUpdateProgress(goal, (goal.progress || 0) - 10)}
                        className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
                      >
                        -10%
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress || 0}
                        onChange={(e) => handleUpdateProgress(goal, parseInt(e.target.value))}
                        className="w-28 accent-purple-500 cursor-pointer"
                      />
                      <button
                        onClick={() => handleUpdateProgress(goal, (goal.progress || 0) + 10)}
                        className="px-2 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
                      >
                        +10%
                      </button>
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  {(goal.milestones || []).length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-850 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Milestones
                      </span>
                      {goal.milestones.map((m, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleToggleMilestone(goal, idx)}
                          className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer group"
                        >
                          {m.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 flex-shrink-0" />
                          )}
                          <span className={`text-[11px] ${m.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {m.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="mt-5 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" /> {goal.targetDate}
                  </span>
                  <span className={`font-medium ${isFinished ? 'text-emerald-400' : 'text-purple-300'}`}>
                    {daysLeft}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Define Strategic Goal</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Goal Objective</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Launch AI SaaS platform to 1,000 users"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Career & Tech">Career & Tech</option>
                    <option value="Fitness">Fitness & Health</option>
                    <option value="Financial">Financial Freedom</option>
                    <option value="Personal Growth">Personal Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Milestones draft */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Key Milestones</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Build prototype, secure 10 early users..."
                    value={milestoneDraft}
                    onChange={(e) => setMilestoneDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMilestoneDraft(); } }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestoneDraft}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-xl"
                  >
                    Add
                  </button>
                </div>

                {milestones.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {milestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
                        <span className="text-slate-300">{m.text}</span>
                        <button type="button" onClick={() => handleRemoveMilestoneDraft(i)} className="text-slate-500 hover:text-rose-400">
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
