import React, { useState } from 'react';
import { 
  EXPLORATION_AREAS, 
  INITIAL_EXPLORATION_CARDS, 
  BUSINESS_MODELS 
} from '../firebase/missionService';
import { 
  FlaskConical, 
  Plus, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Layers, 
  Sparkles,
  HeartPulse,
  Users,
  Compass,
  Target,
  Briefcase,
  Home,
  Cpu,
  Award,
  Building2,
  Landmark,
  TrendingUp,
  X,
  Edit3,
  Trash2
} from 'lucide-react';

const ICON_MAP = {
  HeartPulse,
  Users,
  Compass,
  Layers,
  Target,
  Briefcase,
  Home,
  Cpu,
  Award,
  Building2,
  Landmark,
  TrendingUp
};

export default function MissionLabView({ missionState, onSaveMissionState }) {
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' | 'business_models'
  const [editingCard, setEditingCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const explorationCards = missionState?.explorationCards || INITIAL_EXPLORATION_CARDS;

  // Filter cards
  const filteredCards = explorationCards.filter(card => {
    const matchesArea = selectedAreaId === null || card.areaId === selectedAreaId;
    const matchesStatus = statusFilter === 'all' || card.currentStatus === statusFilter;
    return matchesArea && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingCard({
      id: `exp-${Date.now()}`,
      areaId: selectedAreaId || 1,
      title: '',
      idea: '',
      problemBeingSolved: '',
      targetPopulation: '',
      proposedSolution: '',
      hypothesis: '',
      evidenceAndLinks: '',
      costAndResources: '',
      potentialImpact: 'High',
      businessViability: '',
      experimentsToValidate: '',
      currentStatus: 'draft',
      nextDecision: ''
    });
    setIsModalOpen(true);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!editingCard.title.trim()) return;

    const existingIndex = explorationCards.findIndex(c => c.id === editingCard.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...explorationCards];
      updated[existingIndex] = editingCard;
    } else {
      updated = [editingCard, ...explorationCards];
    }

    onSaveMissionState({ explorationCards: updated });
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId) => {
    const updated = explorationCards.filter(c => c.id !== cardId);
    onSaveMissionState({ explorationCards: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#070b14] to-[#141b2d] border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              Permanent Strategic Sandbox
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
              Mission Lab: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">Obesity-Free India</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              ReshapeNation platform exploration headquarters. Discovering high-leverage hypotheses, testing business models, and synthesizing research across 12 strategic frontiers without prematurely narrowing our impact.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab(activeTab === 'cards' ? 'business_models' : 'cards')}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              {activeTab === 'cards' ? 'Compare Business Models' : 'View Exploration Cards'}
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              New Exploration Card
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'cards' ? (
        <>
          {/* 12 Exploration Areas Filter Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                12 Strategic Exploration Areas ({explorationCards.length} Cards Total)
              </h2>
              {selectedAreaId && (
                <button 
                  onClick={() => setSelectedAreaId(null)}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Clear Area Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {EXPLORATION_AREAS.map((area) => {
                const Icon = ICON_MAP[area.icon] || FlaskConical;
                const isSelected = selectedAreaId === area.id;
                const cardCount = explorationCards.filter(c => c.areaId === area.id).length;

                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedAreaId(isSelected ? null : area.id)}
                    className={`p-3 rounded-2xl text-left border transition relative flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10' 
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                        {cardCount}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-200 line-clamp-2 leading-tight">
                      {area.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
              {['all', 'testing', 'validated', 'draft', 'paused'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                    statusFilter === status 
                      ? 'bg-amber-500 text-slate-950 font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Showing <span className="font-semibold text-amber-300">{filteredCards.length}</span> exploration cards
            </div>
          </div>

          {/* Cards Display Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCards.map((card) => {
              const area = EXPLORATION_AREAS.find(a => a.id === card.areaId) || EXPLORATION_AREAS[0];
              const AreaIcon = ICON_MAP[area.icon] || FlaskConical;

              return (
                <div 
                  key={card.id}
                  className="rounded-3xl bg-[#090f1e] border border-slate-800 hover:border-amber-500/40 p-6 transition flex flex-col justify-between shadow-xl relative group"
                >
                  <div className="space-y-4">
                    {/* Card Top Metadata */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AreaIcon className="w-4 h-4" />
                        </span>
                        <span className="text-xs font-semibold text-amber-400/90 tracking-wide">
                          Area {area.id}: {area.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          card.currentStatus === 'validated' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          card.currentStatus === 'testing' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          card.currentStatus === 'draft' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {card.currentStatus}
                        </span>
                        <button
                          onClick={() => { setEditingCard(card); setIsModalOpen(true); }}
                          className="p-1 text-slate-400 hover:text-slate-200 transition"
                          title="Edit Card"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Core Idea */}
                    <div>
                      <h3 className="text-lg font-bold text-[#fdfbf7] group-hover:text-amber-300 transition">
                        {card.title}
                      </h3>
                      <p className="text-xs text-amber-200/80 mt-1 italic font-medium">
                        "{card.idea}"
                      </p>
                    </div>

                    {/* Detailed Spec Grid */}
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Problem Being Solved</span>
                        <p className="text-slate-200">{card.problemBeingSolved}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Population</span>
                          <p className="text-slate-200">{card.targetPopulation}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Proposed Solution</span>
                          <p className="text-slate-200">{card.proposedSolution}</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Hypothesis</span>
                        <p className="text-amber-100 font-medium">{card.hypothesis}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Cost & Resources</span>
                          <span className="text-slate-300">{card.costAndResources || 'Minimal'}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Potential Impact</span>
                          <span className="text-amber-300 font-semibold">{card.potentialImpact}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800">
                          <span className="text-[9px] uppercase font-bold text-slate-500 block">Viability</span>
                          <span className="text-emerald-400 font-medium">{card.businessViability || 'Validated'}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Experiments to Validate</span>
                        <p className="text-slate-200">{card.experimentsToValidate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Next Decision */}
                  <div className="mt-4 pt-3 border-t border-slate-800/90 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-slate-400">Next Action:</span>
                      <span className="font-semibold text-[#fdfbf7] truncate">{card.nextDecision}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">{card.evidenceAndLinks ? 'Sources Cited' : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Business Models Strategic Comparison */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#fdfbf7]">Strategic Business Models Comparison</h2>
              <p className="text-xs text-slate-400">Analyzing unit economics, margins, and operational impact for ReshapeNation.</p>
            </div>
            <button
              onClick={() => setActiveTab('cards')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold"
            >
              Back to Exploration Cards
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUSINESS_MODELS.map((model, idx) => (
              <div 
                key={idx}
                className="rounded-3xl bg-[#090f1e] border border-slate-800 hover:border-amber-500/30 p-6 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-amber-300">{model.name}</h3>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                    {model.ticketSize}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Reach</span>
                    <span className="text-slate-200 font-medium">{model.reach}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Margins</span>
                    <span className="text-emerald-400 font-medium">{model.margins}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Complexity</span>
                    <span className="text-slate-300 font-medium">{model.operationalComplexity}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <span className="text-emerald-400 font-bold">Pros:</span>
                    <span className="text-slate-300">{model.pros}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-rose-400 font-bold">Cons:</span>
                    <span className="text-slate-300">{model.cons}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                    <span className="text-amber-400 font-semibold">Strategic Fit:</span>
                    <span className="text-amber-200 font-bold">{model.strategicFit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exploration Card Modal */}
      {isModalOpen && editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0c1527] border border-amber-500/30 rounded-3xl p-6 max-w-2xl w-full my-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-[#fdfbf7] flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-400" />
                {editingCard.title ? 'Edit Exploration Card' : 'New Strategic Exploration Card'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Exploration Area</label>
                  <select
                    value={editingCard.areaId}
                    onChange={(e) => setEditingCard({ ...editingCard, areaId: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {EXPLORATION_AREAS.map(a => (
                      <option key={a.id} value={a.id}>Area {a.id}: {a.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Status</label>
                  <select
                    value={editingCard.currentStatus}
                    onChange={(e) => setEditingCard({ ...editingCard, currentStatus: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="draft">Draft</option>
                    <option value="testing">Testing</option>
                    <option value="validated">Validated</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Card Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visceral Adiposity & Metabolic Rejuvenation for IT Teams"
                  value={editingCard.title}
                  onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Core Strategic Idea</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize the core premise in one sentence"
                  value={editingCard.idea}
                  onChange={(e) => setEditingCard({ ...editingCard, idea: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Problem Being Solved</label>
                  <textarea
                    rows={2}
                    value={editingCard.problemBeingSolved}
                    onChange={(e) => setEditingCard({ ...editingCard, problemBeingSolved: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Population</label>
                  <textarea
                    rows={2}
                    value={editingCard.targetPopulation}
                    onChange={(e) => setEditingCard({ ...editingCard, targetPopulation: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Hypothesis</label>
                <input
                  type="text"
                  placeholder="If [action/intervention], then [measurable result] because..."
                  value={editingCard.hypothesis}
                  onChange={(e) => setEditingCard({ ...editingCard, hypothesis: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Cost & Resources</label>
                  <input
                    type="text"
                    value={editingCard.costAndResources}
                    onChange={(e) => setEditingCard({ ...editingCard, costAndResources: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Potential Impact</label>
                  <input
                    type="text"
                    value={editingCard.potentialImpact}
                    onChange={(e) => setEditingCard({ ...editingCard, potentialImpact: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Business Viability</label>
                  <input
                    type="text"
                    value={editingCard.businessViability}
                    onChange={(e) => setEditingCard({ ...editingCard, businessViability: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Experiments to Validate</label>
                <input
                  type="text"
                  placeholder="Specific test or sprint to prove or disprove"
                  value={editingCard.experimentsToValidate}
                  onChange={(e) => setEditingCard({ ...editingCard, experimentsToValidate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Next Decision / Immediate Action</label>
                <input
                  type="text"
                  placeholder="What is the next tangible step to take?"
                  value={editingCard.nextDecision}
                  onChange={(e) => setEditingCard({ ...editingCard, nextDecision: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                >
                  Save Exploration Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
