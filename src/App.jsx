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
  CheckSquare,
  Home,
  ListChecks,
  MoreHorizontal,
  X
} from 'lucide-react';

export default function App() {
  const { user, loading, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
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

  // Ritual reminders are checked while the authenticated LifeOS app is open.
  useEffect(() => {
    if (!user || !missionState?.dailyReminders?.length || !('Notification' in window) || Notification.permission !== 'granted') return;
    const checkRituals = () => {
      const clock = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
      const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
      missionState.dailyReminders.forEach((slot) => {
        const match = String(slot.time || '').match(/([01]\d|2[0-3]):([0-5]\d)/);
        if (!match || clock !== match[0]) return;
        const key = 'lifeos-ritual-' + user.uid + '-' + slot.id + '-' + day;
        if (localStorage.getItem(key)) return;
        try {
          new Notification(slot.slotName || 'LifeOS daily ritual', {
            body: slot.quote || 'Open LifeOS for your next ritual.',
            tag: key,
            icon: '/favicon.ico'
          });
          localStorage.setItem(key, '1');
        } catch (error) {
          console.warn('Ritual notification was not displayed:', error);
        }
      });
    };
    checkRituals();
    const timer = window.setInterval(checkRituals, 20000);
    return () => window.clearInterval(timer);
  }, [missionState?.dailyReminders, user?.uid]);

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
  const mobileTabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Quests', icon: ListChecks },
    { id: 'habits', label: 'Habits', icon: Sparkles },
    { id: 'story_forge', label: 'Story', icon: BookOpen }
  ];
  const moreItems = NAV_ITEMS.filter(item => !['dashboard','tasks','habits','story_forge'].includes(item.id));

  if (loading) return <div className="min-h-screen bg-[#070b14] text-slate-200 grid place-items-center"><div className="text-center"><div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-amber-300/20 border-t-amber-300"/><p className="text-sm font-bold">Securing your LifeOS…</p></div></div>;
  if (!user || isGuest) return <AuthGate />;

  return (
    <div className="min-h-[100dvh] bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 relative">
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
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto pb-[calc(108px+env(safe-area-inset-bottom))] md:pb-12 min-w-0">
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

      {/* Desktop mission assistant */}
      <div className="hidden md:block fixed bottom-6 right-5 z-40">
        <button onClick={() => setIsAiChatOpen(true)} className="flex items-center gap-2.5 rounded-full border-2 border-amber-300 bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-amber-500/20 transition hover:scale-105">
          <Bot className="h-5 w-5"/> My LifeOS Guide
        </button>
      </div>

      {/* Mobile app navigation: four main destinations + one roomy More menu */}
      <nav className="lifeos-bottom-nav md:hidden" aria-label="Main app navigation">
        {mobileTabs.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return <button key={item.id} onClick={() => {setActiveTab(item.id);setShowMoreMenu(false);}} className={'lifeos-tab '+(active?'active':'')} aria-current={active?'page':undefined}>
            <Icon size={22} strokeWidth={active?2.6:2.1}/><span>{item.label}</span>
          </button>;
        })}
        <button onClick={() => setShowMoreMenu(v=>!v)} className={'lifeos-tab '+(showMoreMenu||moreItems.some(x=>x.id===activeTab)?'active':'')} aria-expanded={showMoreMenu}>
          {showMoreMenu?<X size={22}/>:<MoreHorizontal size={22}/>}<span>More</span>
        </button>
      </nav>

      {showMoreMenu && <div className="lifeos-more-overlay md:hidden" onClick={()=>setShowMoreMenu(false)}>
        <section className="lifeos-more-sheet" role="dialog" aria-modal="true" aria-label="More LifeOS sections" onClick={e=>e.stopPropagation()}>
          <div className="lifeos-sheet-handle"/>
          <div className="flex items-center justify-between px-1 pb-3">
            <div><p className="text-[10px] uppercase font-bold tracking-[.16em] text-amber-300">Explore LifeOS</p><h2 className="text-lg font-black text-white">More of your world ✨</h2></div>
            <button onClick={()=>setShowMoreMenu(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-800 text-slate-200" aria-label="Close menu"><X size={19}/></button>
          </div>
          <div className="lifeos-more-grid">
            {moreItems.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>{setActiveTab(item.id);setShowMoreMenu(false);}} className="lifeos-more-item">
              <span className="lifeos-more-icon"><Icon size={21}/></span><span className="min-w-0 text-left"><span className="block text-[12px] font-bold text-white">{item.label}</span><span className="mt-0.5 block text-[9px] text-slate-500">{item.badge||'Open'}</span></span>
            </button>;})}
            <button onClick={()=>{setIsAiChatOpen(true);setShowMoreMenu(false);}} className="lifeos-more-item">
              <span className="lifeos-more-icon text-amber-200"><Bot size={21}/></span><span className="text-left"><span className="block text-[12px] font-bold text-white">LifeOS Guide</span><span className="mt-0.5 block text-[9px] text-slate-500">Talk it through</span></span>
            </button>
          </div>
        </section>
      </div>

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
