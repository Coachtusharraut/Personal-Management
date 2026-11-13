import React, { useState } from 'react';
import { 
  STORY_WORLDS 
} from '../firebase/missionService';
import { 
  BookOpen, 
  Sparkles, 
  Lock, 
  Unlock, 
  ChevronRight, 
  Award, 
  Compass, 
  ShieldCheck, 
  Edit3, 
  CheckCircle2,
  Sword,
  Crown,
  Cpu,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WORLD_ICONS = {
  world_a: Sword,
  world_b: Crown,
  world_c: Cpu,
  world_d: Flame
};

export default function LegacyChroniclesView({ missionState, onSaveMissionState }) {
  const storyWorlds = missionState?.storyWorlds || STORY_WORLDS;
  const [selectedWorldId, setSelectedWorldId] = useState('world_d');
  const [selectedChapterId, setSelectedChapterId] = useState('wd-ch2');
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [choiceResult, setChoiceResult] = useState(null);

  const activeWorld = storyWorlds.find(w => w.id === selectedWorldId) || storyWorlds[0];
  const activeChapter = activeWorld.chapters.find(c => c.id === selectedChapterId) || activeWorld.chapters[0];

  const handleSelectChapter = (ch) => {
    if (ch.status === 'locked') return;
    setSelectedChapterId(ch.id);
    setIsEditingChapter(false);
    setEditedContent(ch.content || '');
    setChoiceResult(null);
  };

  const handleMakeChoice = (choice) => {
    setChoiceResult(choice.consequence);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleSaveEditedChapter = (e) => {
    e.preventDefault();
    const updatedWorlds = storyWorlds.map(w => {
      if (w.id === activeWorld.id) {
        const updatedChapters = w.chapters.map(c => {
          if (c.id === activeChapter.id) {
            return { ...c, content: editedContent };
          }
          return c;
        });
        return { ...w, chapters: updatedChapters };
      }
      return w;
    });

    onSaveMissionState({ storyWorlds: updatedWorlds });
    setIsEditingChapter(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#070b14] to-[#1e142e] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Game Engine: The Legacy Chronicles
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
              Your Real Life is the Hero's Journey
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Every real achievement, completed quest, and closed revenue milestone unlocks new chapters in 4 epic story universes. Make pivotal choices that shape your character's legacy.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center">
            <span className="text-xs font-bold px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>Story Prestige: Level 4</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Story Worlds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {storyWorlds.map((world) => {
          const Icon = WORLD_ICONS[world.id] || BookOpen;
          const isSelected = selectedWorldId === world.id;

          return (
            <button
              key={world.id}
              onClick={() => {
                setSelectedWorldId(world.id);
                const firstUnlocked = world.chapters.find(c => c.status === 'unlocked');
                if (firstUnlocked) {
                  setSelectedChapterId(firstUnlocked.id);
                  setEditedContent(firstUnlocked.content || '');
                  setChoiceResult(null);
                }
              }}
              className={`p-5 rounded-3xl border text-left transition flex flex-col justify-between space-y-4 shadow-xl ${
                isSelected 
                  ? 'bg-gradient-to-br from-amber-500/20 to-[#090f1e] border-amber-500 shadow-amber-500/10' 
                  : 'bg-[#090f1e] border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`p-2 rounded-2xl ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                    <Icon className="w-4 h-4 stroke-[2.5]" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    {world.unlockedChapters}/{world.totalChapters} Unlocked
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#fdfbf7]">{world.title}</h3>
                <p className="text-[11px] text-amber-300/80 font-medium">{world.tagline}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Badge: {world.badge}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Chapter Reader Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Chapters List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {activeWorld.title} Chapters
          </h3>

          <div className="space-y-2">
            {activeWorld.chapters.map((ch) => {
              const isSelected = activeChapter?.id === ch.id;
              const isLocked = ch.status === 'locked';

              return (
                <button
                  key={ch.id}
                  disabled={isLocked}
                  onClick={() => handleSelectChapter(ch)}
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-amber-500/15 border-amber-500/60 shadow-lg' 
                      : isLocked 
                        ? 'bg-slate-900/30 border-slate-800/50 opacity-60 cursor-not-allowed' 
                        : 'bg-[#090f1e] hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className={`p-1.5 rounded-xl text-xs font-bold ${
                      isLocked ? 'bg-slate-800 text-slate-500' : isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-300'
                    }`}>
                      Ch {ch.number}
                    </span>
                    <div className="truncate">
                      <span className={`text-xs font-bold truncate block ${isLocked ? 'text-slate-500' : 'text-slate-200'}`}>
                        {ch.title}
                      </span>
                      {isLocked && (
                        <span className="text-[10px] text-amber-400/80 block truncate">
                          🔒 {ch.unlockRequirement}
                        </span>
                      )}
                    </div>
                  </div>

                  {isLocked ? (
                    <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
                  ) : (
                    <Unlock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Chapter Reader & Decision Box */}
        <div className="lg:col-span-2 space-y-6">
          {activeChapter && activeChapter.status === 'unlocked' ? (
            <div className="rounded-3xl bg-[#090f1e] border border-amber-500/30 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Chapter {activeChapter.number}
                  </span>
                  <h2 className="text-xl font-black text-[#fdfbf7]">
                    {activeChapter.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    {activeChapter.synopsis}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsEditingChapter(!isEditingChapter);
                    setEditedContent(activeChapter.content || '');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 flex-shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingChapter ? 'Cancel' : 'Edit Story'}</span>
                </button>
              </div>

              {isEditingChapter ? (
                /* Chapter Editor */
                <form onSubmit={handleSaveEditedChapter} className="space-y-4">
                  <textarea
                    rows={12}
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed font-serif focus:border-amber-500/60 focus:outline-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingChapter(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
                    >
                      Save Chapter Changes
                    </button>
                  </div>
                </form>
              ) : (
                /* Chapter Reading Pane */
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif whitespace-pre-line space-y-4 max-h-[450px] overflow-y-auto pr-2">
                  {activeChapter.content}
                </div>
              )}

              {/* Interactive Decision Box */}
              {activeChapter.decisionQuestion && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 pt-4">
                  <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Pivotal Character Decision
                  </span>

                  <h4 className="text-xs font-bold text-[#fdfbf7]">
                    {activeChapter.decisionQuestion}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {activeChapter.choices?.map((choice, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleMakeChoice(choice)}
                        className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-400 text-left text-xs font-semibold text-slate-200 transition flex items-start gap-2 group"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                        <span>{choice.text}</span>
                      </button>
                    ))}
                  </div>

                  {choiceResult && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-fadeIn flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{choiceResult}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#090f1e] border border-slate-800 text-center space-y-3">
              <Lock className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">Chapter Currently Locked</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete quests and revenue goals in the real world to unlock this chapter!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
