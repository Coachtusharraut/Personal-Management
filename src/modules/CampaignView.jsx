import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Lightbulb, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  Flame,
  Volume2
} from 'lucide-react';

export default function CampaignView({ missionState, onSaveMissionState }) {
  const [activeTab, setActiveTab] = useState('financials'); // 'financials' | 'activity' | 'learnings' | 'daily_schedule'
  const [newLearningTopic, setNewLearningTopic] = useState('');
  const [learningCategory, setLearningCategory] = useState('topicsAttractingAttention');

  const campaign = missionState?.campaign;
  if (!campaign) return null;

  const { financials, activity, learnings, dailyQuestsSchedule } = campaign;

  // Percentage of Target Collected & Committed
  const target = campaign.targetRevenue || 100000;
  const collectedPct = Math.min(100, Math.round(((financials?.collected || 0) / target) * 100));
  const committedPct = Math.min(100, Math.round((((financials?.collected || 0) + (financials?.committed || 0)) / target) * 100));

  // Activity incrementer helper
  const handleIncrementActivity = (key) => {
    const updated = {
      ...campaign,
      activity: {
        ...activity,
        [key]: (activity[key] || 0) + 1
      }
    };
    onSaveMissionState({ campaign: updated });
  };

  // Financial updater helper
  const handleUpdateFinancial = (key, delta) => {
    const updated = {
      ...campaign,
      financials: {
        ...financials,
        [key]: Math.max(0, (financials[key] || 0) + delta)
      }
    };
    onSaveMissionState({ campaign: updated });
  };

  // Add learning item
  const handleAddLearning = (e) => {
    e.preventDefault();
    if (!newLearningTopic.trim()) return;

    const currentList = learnings[learningCategory] || [];
    const updated = {
      ...campaign,
      learnings: {
        ...learnings,
        [learningCategory]: [newLearningTopic.trim(), ...currentList]
      }
    };
    onSaveMissionState({ campaign: updated });
    setNewLearningTopic('');
  };

  // Approve / Toggle Daily Schedule Quest
  const handleToggleQuestApproval = (dayNum) => {
    const updatedSchedule = dailyQuestsSchedule.map(q => 
      q.day === dayNum ? { ...q, approved: !q.approved } : q
    );
    onSaveMissionState({
      campaign: {
        ...campaign,
        dailyQuestsSchedule: updatedSchedule
      }
    });
  };

  const handleToggleQuestComplete = (dayNum) => {
    const updatedSchedule = dailyQuestsSchedule.map(q => 
      q.day === dayNum ? { ...q, completed: !q.completed } : q
    );
    onSaveMissionState({
      campaign: {
        ...campaign,
        dailyQuestsSchedule: updatedSchedule
      }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Campaign Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1329] via-[#070b14] to-[#16172e] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-amber-500/15 to-yellow-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              Active Weekly Campaign • 12 – 20 November 2026
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Primary: ReshapeNation Business Development
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#fdfbf7] tracking-tight">
                {campaign.name}
              </h1>
              <p className="text-amber-200/90 text-sm mt-2 italic font-medium max-w-3xl leading-relaxed">
                "{campaign.hypothesis}"
              </p>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-xs text-slate-400 uppercase font-semibold">Target Revenue</span>
              <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                ₹{target.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-emerald-400">
                Collected: ₹{(financials?.collected || 0).toLocaleString('en-IN')} ({collectedPct}%)
              </span>
              <span className="text-amber-300">
                Committed + Pipeline: ₹{((financials?.collected || 0) + (financials?.committed || 0) + (financials?.pipeline || 0)).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
              <div 
                className="h-full bg-amber-500/30 rounded-full absolute top-0.5 left-0.5" 
                style={{ width: `${committedPct}%` }}
              />
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full relative z-10 transition-all duration-500 shadow-md shadow-emerald-500/30" 
                style={{ width: `${collectedPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'financials', label: 'Financial Telemetry', icon: DollarSign },
          { id: 'activity', label: 'Activity & Conversion Funnel', icon: TrendingUp },
          { id: 'learnings', label: 'Strategic Learning Repository', icon: Lightbulb },
          { id: 'daily_schedule', label: 'Daily Quest Schedule (12–20 Nov)', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Financial Telemetry */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#090f1e] border border-emerald-500/30 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Real Money Collected</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-emerald-300">
                ₹{(financials?.collected || 0).toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => handleUpdateFinancial('collected', 5000)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                >
                  +₹5,000
                </button>
                <button 
                  onClick={() => handleUpdateFinancial('collected', 15000)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                >
                  +₹15,000
                </button>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#090f1e] border border-amber-500/30 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>Committed (Verbal / Slotted)</span>
                <Award className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-amber-300">
                ₹{(financials?.committed || 0).toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => handleUpdateFinancial('committed', 10000)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold"
                >
                  +₹10,000
                </button>
                <button 
                  onClick={() => handleUpdateFinancial('committed', 25000)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold"
                >
                  +₹25,000
                </button>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#090f1e] border border-rose-500/20 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
                <span>Outstanding Payments</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-rose-300">
                ₹{(financials?.outstanding || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-400">Proposals sent with payment links awaiting completion</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#090f1e] border border-blue-500/20 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>Total Pipeline Potential</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-blue-300">
                ₹{(financials?.pipeline || 0).toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-400">Sum of booked consultations & warm leads</p>
            </div>
          </div>

          {/* Pricing Scenarios Table */}
          <div className="p-6 rounded-3xl bg-[#090f1e] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#fdfbf7]">Pricing Scenarios & Route to ₹1 Lakh</h3>
                <p className="text-xs text-slate-400">Multiple pathways to achieve the campaign target.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Avg Revenue/Client: ₹{(financials?.avgRevenuePerCustomer || 15000).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {financials?.pricingScenarios?.map((scenario, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-300">{scenario.name}</span>
                  <div className="text-base font-extrabold text-slate-100">{scenario.label}</div>
                  <p className="text-[11px] text-slate-400">Unit Price: ₹{scenario.price.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Activity Funnel */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#fdfbf7]">Activity & Conversion Funnel</h3>
              <p className="text-xs text-slate-400">Log every conversation and touchpoint. Click '+' to increment your real-time numbers.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { key: 'conversations', label: '1-on-1 Conversations', color: 'from-amber-500 to-amber-600', icon: MessageSquare },
              { key: 'speakingOpportunities', label: 'Speaking Sessions', color: 'from-yellow-500 to-amber-500', icon: Volume2 },
              { key: 'audienceReached', label: 'Audience Reached', color: 'from-blue-500 to-indigo-500', icon: Users },
              { key: 'contentPublished', label: 'Videos / Posts', color: 'from-purple-500 to-pink-500', icon: TrendingUp },
              { key: 'qualifiedProspects', label: 'Qualified Prospects', color: 'from-cyan-500 to-blue-500', icon: Award },
              { key: 'consultationsBooked', label: 'Consultations Booked', color: 'from-emerald-500 to-teal-500', icon: Calendar },
              { key: 'consultationsCompleted', label: 'Consultations Done', color: 'from-emerald-600 to-emerald-500', icon: CheckCircle2 },
              { key: 'proposalsSent', label: 'Proposals Delivered', color: 'from-amber-600 to-yellow-600', icon: DollarSign },
              { key: 'followUpsDone', label: 'Follow-ups Made', color: 'from-rose-500 to-red-500', icon: Clock }
            ].map((metric) => {
              const Icon = metric.icon;
              const count = activity[metric.key] || 0;

              return (
                <div 
                  key={metric.key}
                  className="p-4 rounded-3xl bg-[#090f1e] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <button
                      onClick={() => handleIncrementActivity(metric.key)}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition"
                      title="Log +1"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#fdfbf7]">{count}</div>
                    <div className="text-[11px] font-semibold text-slate-300 leading-snug mt-1">{metric.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Learning Repository */}
      {activeTab === 'learnings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#fdfbf7]">Campaign Learning & Market Feedback</h3>
              <p className="text-xs text-slate-400">Uncovering customer psychology, questions, objections, and what triggers trust.</p>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddLearning} className="flex items-center gap-2">
              <select
                value={learningCategory}
                onChange={(e) => setLearningCategory(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="topicsAttractingAttention">Topics Attracting Attention</option>
                <option value="questionsPeopleAsk">Questions People Ask</option>
                <option value="commonObjections">Common Objections</option>
                <option value="audiencePainPoints">Audience Pain Points</option>
                <option value="consultationMessagesThatWork">Messages That Convert</option>
                <option value="offersThatConvert">Offers That Convert</option>
              </select>
              <input
                type="text"
                placeholder="Log a new learning insight..."
                value={newLearningTopic}
                onChange={(e) => setNewLearningTopic(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 w-52 sm:w-64"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex-shrink-0"
              >
                Add
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { key: 'topicsAttractingAttention', title: 'Topics That Attract Attention', color: 'border-amber-500/30' },
              { key: 'questionsPeopleAsk', title: 'Questions People Actually Ask', color: 'border-blue-500/30' },
              { key: 'commonObjections', title: 'Common Objections to Neutralize', color: 'border-rose-500/30' },
              { key: 'audiencePainPoints', title: 'Audience Core Pain Points', color: 'border-purple-500/30' },
              { key: 'consultationMessagesThatWork', title: 'Messages Leading to Consultations', color: 'border-emerald-500/30' },
              { key: 'offersThatConvert', title: 'Offers That Generate Conversions', color: 'border-cyan-500/30' }
            ].map((col) => {
              const items = learnings[col.key] || [];
              return (
                <div key={col.key} className={`p-5 rounded-3xl bg-[#090f1e] border ${col.color} space-y-3 shadow-xl`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{col.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {items.length}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs">
                    {items.map((item, idx) => (
                      <li key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-slate-300 leading-relaxed flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Daily Quest Schedule (12–20 Nov 2026) */}
      {activeTab === 'daily_schedule' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#fdfbf7]">Campaign Daily Quest Schedule (12–20 November 2026)</h3>
              <p className="text-xs text-slate-400">Review, approve, and execute the suggested daily sprint to reach ₹1 Lakh.</p>
            </div>
          </div>

          <div className="space-y-3">
            {dailyQuestsSchedule?.map((quest) => (
              <div 
                key={quest.day}
                className={`p-5 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  quest.completed 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : quest.approved 
                      ? 'bg-[#090f1e] border-amber-500/30 shadow-lg' 
                      : 'bg-slate-900/40 border-slate-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-900 border border-slate-800 w-14 flex-shrink-0 text-center">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Day {quest.day}</span>
                    <span className="text-xs font-extrabold text-slate-100">{quest.date.split('-')[2]} Nov</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#fdfbf7]">{quest.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        quest.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {quest.priority}
                      </span>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                        {quest.category}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        +{quest.xp} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{quest.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleQuestApproval(quest.day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      quest.approved 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {quest.approved ? 'Approved' : 'Approve Quest'}
                  </button>

                  <button
                    onClick={() => handleToggleQuestComplete(quest.day)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      quest.completed 
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                        : 'bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{quest.completed ? 'Done' : 'Complete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
