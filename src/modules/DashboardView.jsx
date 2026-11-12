import React, { useState } from 'react';
import { 
  CheckSquare, 
  Flame, 
  Wallet, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Clock, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import { updateItem, addItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';
import confetti from 'canvas-confetti';

const QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "Focus is a muscle. The more you protect it, the sharper your impact.", author: "Personal OS" },
  { text: "Action precedes motivation. Start small, maintain velocity.", author: "James Clear" },
  { text: "Simplicity is the prerequisite for reliability.", author: "Edsger W. Dijkstra" }
];

export default function DashboardView({ 
  tasks = [], 
  habits = [], 
  expenses = [], 
  goals = [], 
  onNavigate,
  onOpenQuickAdd
}) {
  const { user } = useAuth();
  const [selectedQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculations
  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');
  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'done');

  // Habits calculations
  const todayHabitsDone = habits.filter(h => h.history && h.history[todayStr]).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const habitsPercent = habits.length ? Math.round((todayHabitsDone / habits.length) * 100) : 0;

  // Finance calculations
  const incomeTotal = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + (e.amount || 0), 0);
  const expenseTotal = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + (e.amount || 0), 0);
  const netBalance = incomeTotal - expenseTotal;

  // Goals calculations
  const avgGoalProgress = goals.length 
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length) 
    : 0;

  const handleToggleTask = async (task) => {
    if (!user) return;
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    if (newStatus === 'done') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    }
    await updateItem(user.uid, 'tasks', task.id, { status: newStatus });
  };

  const handleToggleHabitToday = async (habit) => {
    if (!user) return;
    const history = { ...(habit.history || {}) };
    const wasDone = !!history[todayStr];
    
    if (wasDone) {
      delete history[todayStr];
    } else {
      history[todayStr] = true;
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    }

    const newStreak = wasDone ? Math.max(0, (habit.streak || 1) - 1) : (habit.streak || 0) + 1;
    await updateItem(user.uid, 'habits', habit.id, { history, streak: newStreak });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Motivational Spark & Date */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 lg:p-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Daily Executive Briefing</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Welcome to your command center, Tushar.
            </h2>
            <p className="mt-2 text-xs lg:text-sm text-slate-300 italic leading-relaxed">
              "{selectedQuote.text}" — <span className="text-indigo-400 font-medium not-italic">{selectedQuote.author}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('focus')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start 25m Focus</span>
            </button>
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Quick Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tasks */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer glass-card p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tasks Pipeline</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{pendingTasks.length}</span>
            <span className="text-xs text-slate-400">pending ({completedTasks.length} done)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            {urgentTasks.length > 0 ? (
              <span className="text-rose-400 font-medium flex items-center gap-1">
                🔴 {urgentTasks.length} urgent due
              </span>
            ) : (
              <span className="text-emerald-400 font-medium">All priorities clear</span>
            )}
            <span className="text-slate-400 group-hover:text-indigo-400 flex items-center transition">
              View <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Habits Streak */}
        <div 
          onClick={() => onNavigate('habits')}
          className="cursor-pointer glass-card p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Habit Streaks</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{todayHabitsDone} / {habits.length}</span>
            <span className="text-xs text-slate-400">today ({habitsPercent}%)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-medium flex items-center gap-1">
              🔥 {bestStreak} days top streak
            </span>
            <span className="text-slate-400 group-hover:text-amber-400 flex items-center transition">
              Check in <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Finance Net */}
        <div 
          onClick={() => onNavigate('finance')}
          className="cursor-pointer glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Net Cash Flow</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${netBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              In: <span className="text-emerald-400">${incomeTotal.toFixed(0)}</span> | Out: <span className="text-rose-400">${expenseTotal.toFixed(0)}</span>
            </span>
            <span className="text-slate-400 group-hover:text-emerald-400 flex items-center transition">
              Ledger <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Goals Progress */}
        <div 
          onClick={() => onNavigate('goals')}
          className="cursor-pointer glass-card p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Goals Velocity</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{avgGoalProgress}%</span>
            <span className="text-xs text-slate-400">average completion</span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${avgGoalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Today's Priorities & Daily Habit Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Today's Focus Tasks */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Action Focus</h3>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Open Kanban →
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No active tasks. Tap "+ Quick Add" above to schedule tasks.
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                    task.status === 'done'
                      ? 'bg-slate-900/40 border-slate-850/60 opacity-60'
                      : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <button className="flex-shrink-0">
                      {task.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-200'}`}>
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
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono flex-shrink-0">
                    {task.dueDate}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Daily Habits Routine */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Daily Habit Check-in</h3>
            </div>
            <button
              onClick={() => onNavigate('habits')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Full Calendar →
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {habits.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No habits configured. Build your routines in the Habits tab.
              </div>
            ) : (
              habits.map((habit) => {
                const isCompletedToday = !!(habit.history && habit.history[todayStr]);
                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabitToday(habit)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isCompletedToday
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                        isCompletedToday ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isCompletedToday ? '✓' : '•'}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-semibold truncate ${isCompletedToday ? 'text-amber-200' : 'text-slate-200'}`}>
                          {habit.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{habit.description || habit.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-500/20">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        <span>{habit.streak || 0}d</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
