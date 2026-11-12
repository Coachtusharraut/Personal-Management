import React, { useState } from 'react';
import { 
  CONNECTED_GOAL_HIERARCHY, 
  LIFE_VISION_PILLARS 
} from '../firebase/missionService';
import { 
  Target, 
  Compass, 
  Flag, 
  Calendar, 
  Clock, 
  ArrowDown, 
  Layers, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Heart,
  TrendingUp,
  Brain,
  Smile,
  BookOpen,
  Briefcase
} from 'lucide-react';

const PILLAR_ICONS = {
  mission: Flag,
  health: Heart,
  business: Briefcase,
  wealth: TrendingUp,
  relationships: UsersIcon,
  learning: BookOpen,
  mindset: Brain,
  happiness: Smile
};

function UsersIcon(props) {
  return <Heart {...props} />;
}

export default function GoalHierarchyView({ missionState }) {
  const [activeSection, setActiveSection] = useState('hierarchy'); // 'hierarchy' | 'vision'

  const hierarchy = missionState?.goalHierarchy || CONNECTED_GOAL_HIERARCHY;
  const lifeVision = missionState?.lifeVision || LIFE_VISION_PILLARS;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#070b14] to-[#141b2d] border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              Connected Goal Architecture & Whole-Life Vision
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
              From Lifetime Mission to Daily Action
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Every daily quest connects directly through weekly campaigns, monthly milestones, and annual objectives up to our primary lifetime mission: <span className="text-amber-300 font-semibold">Obesity-Free India</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 self-start sm:self-center">
            <button
              onClick={() => setActiveSection('hierarchy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeSection === 'hierarchy' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              8-Tier Hierarchy
            </button>
            <button
              onClick={() => setActiveSection('vision')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeSection === 'vision' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              8 Life Vision Pillars
            </button>
          </div>
        </div>
      </div>

      {activeSection === 'hierarchy' ? (
        /* 8-Tier Visual Architecture */
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Level 1: Lifetime Mission */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border-2 border-amber-500/60 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Level 1: Lifetime Mission
              </span>
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-500 text-slate-950">
                Primary North Star
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#fdfbf7]">
              {hierarchy.lifetimeMission.title}
            </h2>
            <p className="text-slate-200 text-xs mt-2 leading-relaxed">
              {hierarchy.lifetimeMission.vision}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs text-amber-300 font-semibold">
              <span>Vehicle: {hierarchy.lifetimeMission.primaryVehicle}</span>
              <span>•</span>
              <span>Horizon: {hierarchy.lifetimeMission.targetHorizon}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-amber-500/60 animate-bounce" />
          </div>

          {/* Level 2: 5-Year Direction */}
          <div className="p-5 rounded-3xl bg-[#090f1e] border border-amber-500/30 shadow-xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              Level 2: 5-Year Strategic Direction ({hierarchy.fiveYearDirection.timeframe})
            </span>
            <h3 className="text-base font-bold text-slate-100">{hierarchy.fiveYearDirection.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {hierarchy.fiveYearDirection.strategicPillars.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-600" />
          </div>

          {/* Level 3: Annual Goal */}
          <div className="p-5 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Target className="w-3.5 h-3.5" />
                Level 3: Annual Goal ({hierarchy.annualGoal.year})
              </span>
              <span className="text-xs font-semibold text-blue-300">{hierarchy.annualGoal.progress}% Realized</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">{hierarchy.annualGoal.title}</h3>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${hierarchy.annualGoal.progress}%` }} />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-600" />
          </div>

          {/* Level 4: Quarterly Objective */}
          <div className="p-5 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                Level 4: Quarterly Objective ({hierarchy.quarterlyObjective.quarter})
              </span>
              <span className="text-xs font-semibold text-purple-300">{hierarchy.quarterlyObjective.progress}% Done</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">{hierarchy.quarterlyObjective.title}</h3>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${hierarchy.quarterlyObjective.progress}%` }} />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-600" />
          </div>

          {/* Level 5: Monthly Milestone */}
          <div className="p-5 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Level 5: Monthly Milestone ({hierarchy.monthlyMilestone.month})
              </span>
              <span className="text-xs font-semibold text-emerald-300">{hierarchy.monthlyMilestone.progress}% Achieved</span>
            </div>
            <h3 className="text-sm font-bold text-slate-100">{hierarchy.monthlyMilestone.title}</h3>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${hierarchy.monthlyMilestone.progress}%` }} />
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-slate-600" />
          </div>

          {/* Level 6: Weekly Campaign */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Level 6: Weekly Campaign (12–20 Nov 2026)
              </span>
              <span className="text-xs font-bold text-amber-300">Target: ₹1,00,000</span>
            </div>
            <h3 className="text-sm font-extrabold text-[#fdfbf7]">SPEAK TO IMPACT — ₹1 LAKH CHALLENGE</h3>
            <p className="text-xs text-amber-200/80 italic">"People enjoy listening when I speak. Converting communication into health results & revenue."</p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-amber-500" />
          </div>

          {/* Levels 7 & 8: Daily Quests & Actions */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Levels 7 & 8: Daily Quests & Individual Actions (Executed Today)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-[#090f1e] border border-slate-800 text-slate-200">
                <span className="font-bold text-amber-300 block mb-1">Top 3 Quests</span>
                Focusing all daily energy on highest-impact health consultations, video releases, and personal workouts.
              </div>
              <div className="p-3 rounded-2xl bg-[#090f1e] border border-slate-800 text-slate-200">
                <span className="font-bold text-amber-300 block mb-1">Individual Action Steps</span>
                Granular subtasks, direct time-blocks, and checkable milestones linked to the ₹1L Campaign.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Life Vision: 8 Pillars */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#fdfbf7]">Life Vision: 8 Dimensional Equilibrium</h2>
              <p className="text-xs text-slate-400">ReshapeNation is the primary focus; all other pillars maintain holistic health & fulfillment.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifeVision.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.id] || Target;
              const isPrimary = pillar.priority === 'Primary';

              return (
                <div 
                  key={pillar.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-xl ${
                    isPrimary 
                      ? 'bg-gradient-to-br from-amber-500/15 via-[#090f1e] to-[#141b2d] border-amber-500/50 shadow-amber-500/10' 
                      : 'bg-[#090f1e] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`p-2 rounded-xl ${isPrimary ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isPrimary ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {pillar.priority}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#fdfbf7]">{pillar.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{pillar.status}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-400">Vitality Index</span>
                      <span className={pillar.color || 'text-amber-400'}>{pillar.score}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isPrimary ? 'bg-amber-400' : 'bg-slate-500'}`} 
                        style={{ width: `${pillar.score}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
