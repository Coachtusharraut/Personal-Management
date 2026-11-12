import React, { useState, useEffect } from 'react';
import { useAuth } from './firebase/auth';
import { subscribeCollection } from './firebase/firestoreService';
import Navbar from './components/Navbar';
import Sidebar, { NAV_ITEMS } from './components/Sidebar';
import QuickAddModal from './components/QuickAddModal';

import DashboardView from './modules/DashboardView';
import TasksView from './modules/TasksView';
import HabitsView from './modules/HabitsView';
import NotesView from './modules/NotesView';
import FinanceView from './modules/FinanceView';
import GoalsView from './modules/GoalsView';
import FocusTimerView from './modules/FocusTimerView';
import SettingsView from './modules/SettingsView';

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Real-time state collections
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsubTasks = subscribeCollection(user.uid, 'tasks', setTasks);
    const unsubHabits = subscribeCollection(user.uid, 'habits', setHabits);
    const unsubNotes = subscribeCollection(user.uid, 'notes', setNotes);
    const unsubExpenses = subscribeCollection(user.uid, 'expenses', setExpenses);
    const unsubGoals = subscribeCollection(user.uid, 'goals', setGoals);

    return () => {
      unsubTasks();
      unsubHabits();
      unsubNotes();
      unsubExpenses();
      unsubGoals();
    };
  }, [user]);

  // Compute counts for badges
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const pendingHabitsToday = habits.filter(h => !h.history || !h.history[todayStr]).length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar 
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onNavigate={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Content Layout with Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={setActiveTab}
          counts={{ pendingTasks, pendingHabitsToday }}
          isTimerRunning={isTimerRunning}
        />

        {/* Dynamic Module Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView 
              tasks={tasks}
              habits={habits}
              expenses={expenses}
              goals={goals}
              onNavigate={setActiveTab}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'tasks' && <TasksView tasks={tasks} />}
          {activeTab === 'habits' && <HabitsView habits={habits} />}
          {activeTab === 'notes' && <NotesView notes={notes} />}
          {activeTab === 'finance' && <FinanceView expenses={expenses} />}
          {activeTab === 'goals' && <GoalsView goals={goals} />}
          {activeTab === 'focus' && (
            <FocusTimerView 
              isTimerRunning={isTimerRunning} 
              setIsTimerRunning={setIsTimerRunning} 
            />
          )}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition ${
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
        <button
          onClick={() => setActiveTab('focus')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-semibold transition ${
            activeTab === 'focus' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="relative">
            <Timer className="w-5 h-5 mb-0.5" />
            {isTimerRunning && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </span>
          <span>Focus</span>
        </button>
      </nav>

      {/* Quick Add Universal Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onCreated={(type) => {
          if (type === 'task') setActiveTab('tasks');
          if (type === 'habit') setActiveTab('habits');
          if (type === 'note') setActiveTab('notes');
          if (type === 'expense') setActiveTab('finance');
        }}
      />
    </div>
  );
}
