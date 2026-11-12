import React from 'react';
import { 
  LayoutDashboard, 
  Bell,
  Sparkles,
  BookOpen,
  Sword,
  FlaskConical,
  Flame, 
  Layers, 
  CheckSquare, 
  Heart, 
  FileText, 
  Wallet, 
  Timer, 
  Settings,
  ShieldCheck,
  Target,
  BriefcaseBusiness,
  Mic2,
  CalendarDays,
  Compass
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Daily Mission Board', icon: LayoutDashboard, badge: null },
  { id: 'reminders', label: '3x Daily Rituals & Videos', icon: Bell, badge: 'Daily' },
  { id: 'mood', label: 'Mood Sanctuary', icon: Sparkles, badge: 'Oracle' },
  { id: 'chronicles', label: 'Legacy Chronicles', icon: BookOpen, badge: '4 Worlds' },
  { id: 'boss', label: 'Weekly Boss Battle', icon: Sword, badge: 'Leviathan' },
  { id: 'mission_lab', label: 'Mission Lab: Obesity-Free', icon: FlaskConical, badge: 'ReshapeNation' },
  { id: 'campaign', label: 'Speak to Impact ₹1L', icon: Flame, badge: 'Active' },
  { id: 'goal_hierarchy', label: 'Goal Hierarchy & Vision', icon: Layers, badge: null },
  { id: 'career', label: 'Career & Life Goals', icon: BriefcaseBusiness, badge: 'Tracks' },
  { id: 'story_forge', label: 'Story & Speaking Forge', icon: Mic2, badge: 'Chronicle' },
  { id: 'opportunities', label: 'Opportunity Radar', icon: Compass, badge: 'Pipeline' },
  { id: 'calendar', label: 'Calendar & Reminders', icon: CalendarDays, badge: 'Sync' },
  { id: 'tasks', label: 'Tasks & Kanban', icon: CheckSquare, badgeKey: 'tasksCount' },
  { id: 'habits', label: 'Habits & Rituals', icon: Heart, badgeKey: 'habitsCount' },
  { id: 'notes', label: 'Notes & Strategy', icon: FileText, badgeKey: 'notesCount' },
  { id: 'finance', label: 'Finance & Revenue', icon: Wallet, badge: null },
  { id: 'focus', label: 'Focus Timer', icon: Timer, badgeKey: 'focusActive' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

export default function Sidebar({ activeTab, onSelectTab, counts = {}, isTimerRunning }) {
  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16 select-none">
      {/* Brand & Mission Status */}
      <div className="px-6 py-5 border-b border-slate-850">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-500/20 animate-pulse" />
          <span className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">
            Tushar LifeOS
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Gamified Mission Command Centre</p>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          let badgeValue = item.badge || null;
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-amber-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {badgeValue && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight flex-shrink-0 ${
                    isActive 
                      ? 'bg-slate-950/20 text-slate-950' 
                      : item.id === 'campaign'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.id === 'reminders'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : item.id === 'mood'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : item.id === 'boss'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : item.id === 'focus'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
                                : 'bg-slate-800 text-slate-400'
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
        <div className="flex items-center space-x-2 mb-1.5 text-amber-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Obesity-Free India</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          ReshapeNation Platform • Speak to Impact Campaign Active.
        </p>
      </div>
    </aside>
  );
}
