import React from 'react';
import { 
  WEEKLY_BOSS 
} from '../firebase/missionService';
import { 
  Flame, 
  Sword, 
  ShieldAlert, 
  Award, 
  Zap, 
  TrendingUp, 
  CheckCircle2,
  AlertOctagon,
  Heart
} from 'lucide-react';

export default function BossChallengeView({ missionState, onNavigate }) {
  const boss = missionState?.weeklyBoss || WEEKLY_BOSS;
  const campaign = missionState?.campaign;
  const dailyQuests = missionState?.dailyQuests || [];

  // Calculate live dynamic damage dealt from real achievements!
  const revenueCollected = campaign?.financials?.collected || 25000;
  const consultationsCompleted = campaign?.activity?.consultationsCompleted || 5;
  const questsDone = dailyQuests.filter(q => q.completed).length;

  const totalDamageDealt = revenueCollected + (consultationsCompleted * 2500) + (questsDone * 500);
  const remainingHp = Math.max(0, boss.totalHp - totalDamageDealt);
  const hpPercent = Math.round((remainingHp / boss.totalHp) * 100);
  const isDefeated = remainingHp === 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0808] via-[#070b14] to-[#1e0f0f] border border-rose-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              Weekly Epic Boss Challenge
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#fdfbf7] tracking-tight">
              Battle: {boss.name}
            </h1>
            <p className="text-rose-200/90 text-xs sm:text-sm font-medium">
              {boss.title}
            </p>
            <p className="text-slate-300 text-xs max-w-2xl leading-relaxed italic bg-black/40 p-3 rounded-2xl border border-rose-500/20">
              {boss.bossQuote}
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-black/60 border border-rose-500/30 text-center space-y-1 lg:w-64 flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Boss Health</span>
            <div className="text-2xl font-black text-rose-400">
              {remainingHp.toLocaleString('en-IN')} / {boss.totalHp.toLocaleString('en-IN')} HP
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-700 shadow-md shadow-rose-500/30"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-World Combat Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">Rupee Collected Strike</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-[#fdfbf7]">
            {revenueCollected.toLocaleString('en-IN')} HP
          </div>
          <p className="text-xs text-slate-400">
            Every ₹1 collected in Speak to Impact deals 1 HP unavoidable damage to the Leviathan.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400">Consultation Critical Hit</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-[#fdfbf7]">
            {(consultationsCompleted * 2500).toLocaleString('en-IN')} HP
          </div>
          <p className="text-xs text-slate-400">
            {consultationsCompleted} consultations completed × 2,500 HP critical bonus per consultation.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">Daily Quest Execution Burst</span>
            <Sword className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-[#fdfbf7]">
            {(questsDone * 500).toLocaleString('en-IN')} HP
          </div>
          <p className="text-xs text-slate-400">
            {questsDone} daily quests executed × 500 HP steady tactical strikes.
          </p>
        </div>
      </div>

      {/* Rewards & Unlock Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#090f1e] to-yellow-500/10 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-[#fdfbf7]">Boss Defeat Spoils & Unlocks</h3>
          </div>
          <p className="text-xs text-slate-300">
            Slaying the Leviathan by reaching ₹1 Lakh before Nov 20 unlocks the legendary <span className="text-amber-300 font-bold">"{boss.reward.badge}"</span> badge and +{boss.reward.bonusXp} XP.
          </p>
        </div>

        <button
          onClick={() => onNavigate('campaign')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Sword className="w-4 h-4 stroke-[2.5]" />
          <span>Deal More Damage in Campaign</span>
        </button>
      </div>
    </div>
  );
}
