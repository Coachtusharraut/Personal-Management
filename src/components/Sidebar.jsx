import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Flame, 
  FileText, 
  Wallet, 
  Target, 
  Timer, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'tasks', label: 'Tasks & Kanban', icon: CheckSquare, badgeKey: 'tasksCount' },
  { id: 'habits', label: 'Habits Tracker', icon: Flame, badgeKey: 'habitsCount' },
  { id: 'notes', label: 'Notes & Journal', icon: FileText, badgeKey: 'notesCount' },
  { id: 'finance', label: 'Finance & Budget', icon: Wallet, badge: null },
  { id: 'goals', label: 'Goals & Vision', icon: Target, badge: null },
  { id: 'focus', label: 'Focus Timer', icon: Timer, badgeKey: 'focusActive' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export default function Sidebar({ activeTab, onSelectTab, counts = {}, isTimerRunning }) {
  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Brand Title Subtitle */}
      <div className="px-6 py-5 border-b border-slate-850">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
            Workspace Hub
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Personal Operating System</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          let badgeValue = null;
          if (item.id === 'tasks' && counts.pendingTasks > 0) {
            badgeValue = counts.pendingTasks;
          } else if (item.id === 'habits' && counts.pendingHabitsToday > 0) {
            badgeValue = `${counts.pendingHabitsToday} due`;
          } else if (item.id === 'focus' && isTimerRunning) {
            badgeValue = 'ACTIVE';
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-500/90 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                <span>{item.label}</span>
              </div>

              {badgeValue && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : item.id === 'focus'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}
                >
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Box */}
      <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-850/80 border border-slate-800">
        <div className="flex items-center space-x-2 mb-1.5 text-indigo-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Firebase Protected</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Cloud Firestore encrypted & user-isolated security rules enabled.
        </p>
      </div>
    </aside>
  );
}
