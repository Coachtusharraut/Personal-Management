import React, { useState, useEffect } from 'react';
import { useAuth } from './firebase/auth';
import { subscribeCollection } from './firebase/firestoreService';
import { subscribeMissionData, saveMissionState } from './firebase/missionService';
import Navbar from './components/Navbar';
import Sidebar, { NAV_ITEMS } from './components/Sidebar';
import QuickAddModal from './components/QuickAddModal';
import YouTubePlayerModal from './components/YouTubePlayerModal';
import MissionAIChatModal from './components/MissionAIChatModal';

import DashboardView from './modules/DashboardView';
import DailyRemindersView from './modules/DailyRemindersView';
import MoodSanctuaryView from './modules/MoodSanctuaryView';
import LegacyChroniclesView from './modules/LegacyChroniclesView';
import BossChallengeView from './modules/BossChallengeView';
import MissionLabView from './modules/MissionLabView';
import CampaignView from './modules/CampaignView';
import GoalHierarchyView from './modules/GoalHierarchyView';
import TasksView from './modules/TasksView';
import HabitsView from './modules/HabitsView';
import NotesView from './modules/NotesView';
import FinanceView from './modules/FinanceView';
import FocusTimerView from './modules/FocusTimerView';
import SettingsView from './modules/SettingsView';
import AuthGate from './components/AuthGate';
import CareerGrowthView from './modules/CareerGrowthView';
import StoryForgeView from './modules/StoryForgeView';
import OpportunitiesView from './modules/OpportunitiesView';
import CalendarView from './modules/CalendarView';

import { 
  Bot, 
  Sparkles, 
  Bell, 
  Flame, 
  FlaskConical, 
  BookOpen, 
  Sword, 
  Layers, 
  Timer,
  CheckSquare
} from 'lucide-react';

export default function App() {
  const { user, loading, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  // Core LifeOS Mission State
  const [missionState, setMissionState] = useState(null);

  // Existing collections state
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stories, setStories] = useState([]);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsubMission = subscribeMissionData(user.uid, setMissionState);
    const unsubTasks = subscribeCollection(user.uid, 'tasks', setTasks);
    const unsubHabits = subscribeCollection(user.uid, 'habits', setHabits);
    const unsubNotes = subscribeCollection(user.uid, 'notes', setNotes);
    const unsubExpenses = subscribeCollection(user.uid, 'expenses', setExpenses);
    const unsubGoals = subscribeCollection(user.uid, 'goals', setGoals);
    const unsubStories = subscribeCollection(user.uid, 'stories', setStories);
    const unsubOpportunities = subscribeCollection(user.uid, 'opportunities', setOpportunities);

    return () => {
      unsubMission();
      unsubTasks();
      unsubHabits();
      unsubNotes();
      unsubExpenses();
      unsubGoals();
      unsubStories();
      unsubOpportunities();
    };
  }, [user]);

  // Handler to persist mission state changes
  const handleSaveMissionState = (updates) => {
    if (!user) return;
    saveMissionState(user.uid, updates);
  };

  // Convert an external insight/video takeaway to a daily quest
  const handleAddQuestFromSource = (questData) => {
    const dailyQuests = missionState?.dailyQuests || [];
    const newQuest = {
      id: `quest-${Date.now()}`,
      title: questData.title,
      description: questData.description || 'Added from LifeOS Growth Station',
      category: questData.category || 'Learning',
      tier: questData.tier || 'supporting',
      priority: questData.priority || 'high',
      durationMins: questData.durationMins || 20,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'todo',
      xp: questData.xp || 75,
      completed: false
    };

    handleSaveMissionState({
      dailyQuests: [newQuest, ...dailyQuests]
    });
  };

  // Compute counts for badges
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const pendingHabitsToday = habits.filter(h => !h.history || !h.history[todayStr]).length;

  if (loading) return <div className="min-h-screen bg-[#070b14] text-slate-200 grid place-items-center"><div className="text-center"><div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-amber-300/20 border-t-amber-300"/><p className="text-sm font-bold">Securing your LifeOS…</p></div></div>;
  if (!user || isGuest) return <AuthGate />;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 relative">
      {/* Top Command Navbar */}
      <Navbar 
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onNavigate={setActiveTab}
        activeTab={activeTab}
        missionState={missionState}
      />

      {/* Main Content Layout with Sidebar */}
      <div className="flex-1 flex max-w-[1680px] w-full mx-auto">
        <Sidebar 
          activeTab={activeTab} 
          onSelectTab={setActiveTab}
          counts={{ pendingTasks, pendingHabitsToday }}
          isTimerRunning={isTimerRunning}
        />

        {/* Dynamic Module Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-32 md:pb-12 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView 
              missionState={missionState}
              onSaveMissionState={handleSaveMissionState}
              tasks={tasks}
              habits={habits}
              expenses={expenses}
              goals={goals}
              onNavigate={setActiveTab}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}

          {activeTab === 'reminders' && (
            <DailyRemindersView 
              missionState={missionState}
              onSaveMissionState={handleSaveMissionState}
              onPlayVideo={(vid) => setActiveVideoModal(vid)}
            />
          )}

          {activeTab === 'mood' && (
            <MoodSanctuaryView 
              missionState={missionState}
              onSaveMissionState={handleSaveMissionState}
              onPlayVideo={(vid) => setActiveVideoModal(vid)}
            />
          )}

          {activeTab === 'chronicles' && (
            <LegacyChroniclesView 
              missionState={missionState}
              onSaveMissionState={handleSaveMissionState}
            />
          )}

          {activeTab === 'boss' && (
            <BossChallengeView 
              missionState={missionState}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'mission_lab' && (
            <MissionLabView 
              missionState={missionState}
              onSaveMissionState={handleSaveMissionState}
            />
          )}

          {activeTab === 'campaign' && (
            <CampaignView 
              missionState={missionState}
              onSaveMissionState={handleSaveMissionState}
            />
          )}

          {activeTab === 'career' && <CareerGrowthView goals={goals} missionState={missionState} onAddQuest={handleAddQuestFromSource} onNavigate={setActiveTab} />}
          {activeTab === 'story_forge' && <StoryForgeView missionState={missionState} stories={stories} tasks={tasks} habits={habits} opportunities={opportunities} onAddQuest={handleAddQuestFromSource} />}
          {activeTab === 'opportunities' && <OpportunitiesView opportunities={opportunities} onAddQuest={handleAddQuestFromSource} />}
          {activeTab === 'calendar' && <CalendarView tasks={tasks} />}

          {activeTab === 'goal_hierarchy' && (
            <GoalHierarchyView 
              missionState={missionState}
            />
          )}

          {activeTab === 'tasks' && <TasksView tasks={tasks} />}
          {activeTab === 'habits' && <HabitsView habits={habits} />}
          {activeTab === 'notes' && <NotesView notes={notes} />}
          {activeTab === 'finance' && <FinanceView expenses={expenses} />}
          {activeTab === 'focus' && (
            <FocusTimerView 
              isTimerRunning={isTimerRunning} 
              setIsTimerRunning={setIsTimerRunning} 
            />
          )}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating Action Button: ASK MY MISSION AI */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-amber-300"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping absolute top-1 right-1" />
          <Bot className="w-5 h-5 stroke-[2.5] text-slate-950 animate-bounce" />
          <span className="tracking-tight">ASK MY MISSION AI</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center gap-1 overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} aria-label={item.label}
              className={`min-w-[62px] flex-shrink-0 flex flex-col items-center justify-center px-1.5 py-1.5 rounded-xl text-[9px] font-bold transition ${isActive ? 'text-amber-300 bg-amber-300/10' : 'text-slate-500 hover:text-slate-200'}`}>
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="max-w-[70px] truncate">{item.label}</span>
            </button>
          );
        })}
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

      {/* YouTube Player Modal */}
      <YouTubePlayerModal 
        isOpen={!!activeVideoModal}
        onClose={() => setActiveVideoModal(null)}
        video={activeVideoModal}
        onAddQuestFromVideo={handleAddQuestFromSource}
      />

      {/* Mission AI Chat Modal */}
      <MissionAIChatModal 
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        missionState={missionState}
        onAddQuest={handleAddQuestFromSource}
      />
    </div>
  );
}
