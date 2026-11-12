import React, { useState } from 'react';
import { 
  Flame, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Plus, 
  Award, 
  TrendingUp, 
  ArrowUpRight, 
  BookOpen, 
  Heart, 
  Brain, 
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Smile,
  Zap,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_DAILY_QUESTS, INITIAL_EVENING_REFLECTION } from '../firebase/missionService';

export default function DashboardView({ 
  missionState, 
  onSaveMissionState,
  tasks = [], 
  habits = [], 
  expenses = [], 
  goals = [], 
  onNavigate,
  onOpenQuickAdd 
}) {
  const [reflectionInput, setReflectionInput] = useState(
    missionState?.eveningReflection || INITIAL_EVENING_REFLECTION
  );
  const [isReflectionSaved, setIsReflectionSaved] = useState(false);
  const [showAddQuestModal, setShowAddQuestModal] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    category: 'Business Development',
    tier: 'top3',
    priority: 'high',
    durationMins: 30,
    xp: 100
  });

  const dailyQuests = missionState?.dailyQuests || INITIAL_DAILY_QUESTS;
  const campaign = missionState?.campaign;
  const userLevel = missionState?.userLevel || {
    level: 1,
    title: 'Novice Warrior',
    currentXp: 0,
    nextLevelXp: 500,
    streakDays: 0
  };

  // Segregate quests
  const top3Quests = dailyQuests.filter(q => q.tier === 'top3');
  const supportingQuests = dailyQuests.filter(q => q.tier === 'supporting');
  const growthChallenges = dailyQuests.filter(q => q.tier === 'growth_challenge');

  const completedCount = dailyQuests.filter(q => q.completed).length;
  const totalCount = dailyQuests.length;
  const completionPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handle completing a quest
  const handleToggleQuest = (questId) => {
    const targetQuest = dailyQuests.find(q => q.id === questId);
    const willBeCompleted = !targetQuest?.completed;

    const updatedQuests = dailyQuests.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          completed: willBeCompleted,
          status: willBeCompleted ? 'done' : 'todo',
          completedAt: willBeCompleted ? new Date().toISOString() : null
        };
      }
      return q;
    });

    // Award XP
    const xpDelta = willBeCompleted ? (targetQuest?.xp || 50) : -(targetQuest?.xp || 50);
    const updatedLevel = {
      ...userLevel,
      currentXp: Math.max(0, userLevel.currentXp + xpDelta)
    };

    if (willBeCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    onSaveMissionState({
      dailyQuests: updatedQuests,
      userLevel: updatedLevel
    });
  };

  // Add new custom quest
  const handleCreateQuest = (e) => {
    e.preventDefault();
    if (!newQuest.title.trim()) return;

    const questToAdd = {
      id: `quest-${Date.now()}`,
      ...newQuest,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'todo',
      completed: false
    };

    const updated = [questToAdd, ...dailyQuests];
    onSaveMissionState({ dailyQuests: updated });
    setShowAddQuestModal(false);
    setNewQuest({
      title: '',
      description: '',
      category: 'Business Development',
      tier: 'supporting',
      priority: 'high',
      durationMins: 30,
      xp: 100
    });
  };

  // Save evening reflection
  const handleSaveReflection = (e) => {
    e.preventDefault();
    onSaveMissionState({ eveningReflection: reflectionInput });
    setIsReflectionSaved(true);
    setTimeout(() => setIsReflectionSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Heroic Command Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#070b14] to-[#161a2e] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Mission & Campaign Context */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5" />
                Primary Life Mission: Obesity-Free India
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                Platform: ReshapeNation
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#fdfbf7] tracking-tight">
              Daily Mission Board
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Every quest accomplished today is a tangible brick in the <span className="text-amber-300 font-semibold">Obesity-Free India</span> movement. Zero arbitrary busywork—only decisive, measurable forward momentum.
            </p>

            {/* Campaign Callout */}
            {campaign && (
              <div 
                onClick={() => onNavigate('campaign')}
                className="inline-flex items-center gap-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 cursor-pointer transition text-xs"
              >
                <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-200 font-semibold truncate">
                  Active Challenge: <span className="font-bold text-[#fdfbf7]">{campaign.name}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  ₹{(campaign.financials?.collected || 0).toLocaleString('en-IN')} Collected
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </div>
            )}
          </div>

          {/* Right: XP & Gamification Level Card */}
          <div className="p-5 rounded-3xl bg-[#090f1e]/90 border border-amber-500/30 lg:w-72 flex-shrink-0 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950">
                  <Award className="w-4 h-4 stroke-[2.5]" />
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Level {userLevel.level}</span>
                  <span className="text-xs font-black text-amber-300">{userLevel.title}</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-emerald-400" />
                {userLevel.streakDays}d Streak
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>XP Progress</span>
                <span className="text-amber-300">{userLevel.currentXp} / {userLevel.nextLevelXp} XP</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((userLevel.currentXp / userLevel.nextLevelXp) * 100))}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Today's Completion</span>
              <span className="font-bold text-[#fdfbf7]">{completedCount}/{totalCount} Quests ({completionPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Morning Briefing Strip */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sun className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-[#fdfbf7] block">Morning Strategic Briefing</span>
            <span className="text-slate-400">
              Primary Objective: Drive 2 consultations and launch the Visceral Fat video for the ₹1L Campaign.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setShowAddQuestModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            Add Quest
          </button>
        </div>
      </div>

      {/* 3. The Core Three (Top 3 Priority Quests) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-base font-extrabold text-[#fdfbf7] tracking-tight">
              The Core Three: Highest-Leverage Quests
            </h2>
          </div>
          <span className="text-xs text-amber-400 font-semibold">Priority Imperative</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3Quests.map((quest) => (
            <div 
              key={quest.id}
              className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden ${
                quest.completed 
                  ? 'bg-emerald-950/20 border-emerald-500/30' 
                  : 'bg-[#090f1e] border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    quest.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {quest.priority}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400">+{quest.xp} XP</span>
                </div>

                <div>
                  <h3 className={`text-sm font-bold leading-snug transition ${
                    quest.completed ? 'line-through text-slate-400' : 'text-[#fdfbf7]'
                  }`}>
                    {quest.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                    {quest.category}
                  </span>
                  {quest.durationMins && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {quest.durationMins}m
                    </span>
                  )}
                  {quest.startTime && (
                    <span>{quest.startTime} - {quest.endTime}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleToggleQuest(quest.id)}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  quest.completed 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{quest.completed ? 'Completed' : 'Mark Quest Complete'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two-Column Grid: Supporting Quests & Health Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Supporting Quests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#fdfbf7] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              Supporting Quests
            </h2>
            <span className="text-xs text-slate-400">{supportingQuests.length} tasks</span>
          </div>

          <div className="space-y-3">
            {supportingQuests.map((quest) => (
              <div 
                key={quest.id}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  quest.completed 
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-500' 
                    : 'bg-[#090f1e] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleQuest(quest.id)}
                    className="text-slate-400 hover:text-emerald-400 transition"
                  >
                    {quest.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${quest.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {quest.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{quest.category}</span>
                      <span>•</span>
                      <span>+{quest.xp} XP</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  quest.priority === 'high' ? 'bg-amber-500/10 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {quest.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Health & Personal Habits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#fdfbf7] flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-400" />
              Health & Vitality Rituals
            </h2>
            <button 
              onClick={() => onNavigate('habits')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              View All Habits
            </button>
          </div>

          <div className="space-y-3">
            {habits.slice(0, 4).map((habit) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isDoneToday = habit.history && habit.history[todayStr];

              return (
                <div 
                  key={habit.id}
                  className="p-4 rounded-2xl bg-[#090f1e] border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Heart className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{habit.name}</h4>
                      <p className="text-[10px] text-slate-400">{habit.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      {habit.streak || 0}d
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-xl ${
                      isDoneToday ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isDoneToday ? 'Logged' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Meaningful Personal-Growth Challenge */}
      {growthChallenges.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-[#090f1e] border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              Daily Personal-Growth Challenge
            </span>
            <span className="text-xs font-bold text-indigo-300">+{growthChallenges[0].xp} XP</span>
          </div>
          <h3 className="text-sm font-bold text-[#fdfbf7]">{growthChallenges[0].title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{growthChallenges[0].description}</p>
        </div>
      )}

      {/* 6. Evening Reflection Section */}
      <div className="p-6 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Moon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#fdfbf7]">Evening Reflection & Closing Ritual</h3>
              <p className="text-xs text-slate-400">What did I accomplish? What did I learn? What should happen tomorrow?</p>
            </div>
          </div>

          {isReflectionSaved && (
            <span className="text-xs font-bold text-emerald-400 animate-pulse">
              Reflection Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveReflection} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">What did I accomplish today?</label>
            <textarea
              rows={2}
              value={reflectionInput.accomplished}
              onChange={(e) => setReflectionInput({ ...reflectionInput, accomplished: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">What did I learn today?</label>
            <textarea
              rows={2}
              value={reflectionInput.learned}
              onChange={(e) => setReflectionInput({ ...reflectionInput, learned: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">What prevented or slowed progress?</label>
            <textarea
              rows={2}
              value={reflectionInput.preventedProgress}
              onChange={(e) => setReflectionInput({ ...reflectionInput, preventedProgress: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">What should happen tomorrow?</label>
            <textarea
              rows={2}
              value={reflectionInput.tomorrowPriorities}
              onChange={(e) => setReflectionInput({ ...reflectionInput, tomorrowPriorities: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20"
            >
              Save Evening Reflection
            </button>
          </div>
        </form>
      </div>

      {/* Add Custom Quest Modal */}
      {showAddQuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0c1527] border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#fdfbf7]">Create Daily Mission Quest</h3>
            
            <form onSubmit={handleCreateQuest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Quest Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Outreach to 5 gym owners"
                  value={newQuest.title}
                  onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={newQuest.description}
                  onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority Tier</label>
                  <select
                    value={newQuest.tier}
                    onChange={(e) => setNewQuest({ ...newQuest, tier: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="top3">The Core Three (Top 3)</option>
                    <option value="supporting">Supporting Quest</option>
                    <option value="growth_challenge">Personal Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={newQuest.category}
                    onChange={(e) => setNewQuest({ ...newQuest, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="Business Development">Business Development</option>
                    <option value="Speaking & Influence">Speaking & Influence</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Learning">Learning</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    value={newQuest.durationMins}
                    onChange={(e) => setNewQuest({ ...newQuest, durationMins: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">XP Reward</label>
                  <input
                    type="number"
                    value={newQuest.xp}
                    onChange={(e) => setNewQuest({ ...newQuest, xp: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddQuestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Add Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
