import React, { useState } from 'react';
import { 
  MOOD_PRESETS 
} from '../firebase/missionService';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Heart, 
  Zap, 
  Coffee, 
  ShieldAlert, 
  Smile, 
  HelpCircle,
  Plus,
  CheckCircle2,
  Youtube,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MoodSanctuaryView({ 
  missionState, 
  onSaveMissionState, 
  onPlayVideo 
}) {
  const [selectedMoodId, setSelectedMoodId] = useState('overwhelmed');
  const [customMoodInput, setCustomMoodInput] = useState('');
  const [customResponse, setCustomResponse] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioOscillator, setAudioOscillator] = useState(null);
  const [questAdded, setQuestAdded] = useState(false);

  const presets = missionState?.moodPresets || MOOD_PRESETS;
  const activePreset = presets.find(p => p.id === selectedMoodId) || presets[0];

  // Web Audio API ambient tone generator for instant focus/calm
  const toggleAmbientSound = (soundType) => {
    if (isPlayingAudio) {
      if (audioOscillator) {
        try {
          audioOscillator.stop();
        } catch {}
      }
      setIsPlayingAudio(false);
      setAudioOscillator(null);
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Frequencies for binaural calm / alpha state
      const freqMap = {
        rain_ambient: 432,
        epic_drums: 216,
        lofi_focus: 528,
        deep_alpha: 432
      };

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqMap[soundType] || 432, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime); // gentle volume

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setAudioOscillator(osc);
      setIsPlayingAudio(true);
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked:', e);
    }
  };

  // Convert rescue quest to live quest
  const handleAddRescueQuest = (quest) => {
    if (!quest) return;

    const dailyQuests = missionState?.dailyQuests || [];
    const newRescueQuest = {
      id: `quest-rescue-${Date.now()}`,
      title: quest.title,
      description: quest.desc || activePreset.tacticalFix,
      category: 'Mindset',
      tier: 'supporting',
      priority: 'urgent',
      durationMins: quest.durationMins || 5,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'todo',
      xp: quest.xp || 75,
      completed: false
    };

    onSaveMissionState({
      dailyQuests: [newRescueQuest, ...dailyQuests]
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });

    setQuestAdded(true);
    setTimeout(() => setQuestAdded(false), 3000);
  };

  // Handle custom mood submission
  const handleCustomMood = (e) => {
    e.preventDefault();
    if (!customMoodInput.trim()) return;

    const text = customMoodInput.trim().toLowerCase();
    let funLine = `Bhai, feeling '${customMoodInput.trim()}' is simply your biological dashboard flagging a momentary state-gap. Even the greatest warriors have moments of calibration. Don't overthink it!`;
    let tacticalFix = `The 3-Minute Physiological Reset: Drink 300ml cold water, stand up, take 5 slow diaphragmatic breaths, and pick one 2-minute quest to execute. Action creates clarity.`;

    if (text.includes('tired') || text.includes('sleep') || text.includes('exhausted')) {
      funLine = `Your battery is at 4% and you're trying to render high-definition thoughts! Take a 15-minute power nap or wash your face with ice-cold water. Honor your biology!`;
      tacticalFix = `15-minute power rest: phone on airplane mode, eye mask on, breathe slow.`;
    } else if (text.includes('angry') || text.includes('frustrat')) {
      funLine = `Anger is high-voltage fire! If you keep it inside, it burns your stomach lining and raises cortisol. If you channel it into the gym or your work, it builds kingdoms!`;
      tacticalFix = `Go do 20 pushups or write an unfiltered raw rant on paper, then rip it to shreds.`;
    }

    setCustomResponse({
      title: customMoodInput.trim(),
      funLine,
      tacticalFix,
      videoId: '30VMIEmA114',
      soundscape: 'deep_alpha',
      rescueQuest: {
        title: `State Shift: Overcome ${customMoodInput.trim()}`,
        desc: tacticalFix,
        durationMins: 5,
        xp: 70
      }
    });
    setCustomMoodInput('');
  };

  const currentDisplay = customResponse || activePreset;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1527] via-[#070b14] to-[#1a152e] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              State Shifter & Mindset Oracle
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] tracking-tight">
              Mood Sanctuary: How Are You Feeling Right Now?
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time physiological diagnosis. Pick what you are feeling to unlock a fun relatable reality-check, a 2-minute tactical reset, background focus audio, and a state-shifting video.
            </p>
          </div>

          {/* Ambient Audio Player Pill */}
          <div className="flex items-center gap-3 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 self-start lg:self-center">
            <button
              onClick={() => toggleAmbientSound(currentDisplay.soundscape || 'deep_alpha')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                isPlayingAudio 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{isPlayingAudio ? 'Stop 432Hz Sound' : 'Play 432Hz Focus Sound'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mood Selector Buttons */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Select Your Current Internal State
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {presets.map((preset) => {
            const isSelected = selectedMoodId === preset.id && !customResponse;
            return (
              <button
                key={preset.id}
                onClick={() => { setSelectedMoodId(preset.id); setCustomResponse(null); }}
                className={`p-3.5 rounded-2xl border transition flex flex-col items-center text-center space-y-1.5 ${
                  isSelected 
                    ? 'bg-amber-500/15 border-amber-500/80 shadow-lg shadow-amber-500/10' 
                    : 'bg-[#090f1e] hover:bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <span className="text-2xl">{preset.emoji}</span>
                <span className="text-xs font-bold text-slate-200">{preset.label}</span>
                <span className="text-[10px] text-slate-400 line-clamp-1">{preset.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Mood Input Bar */}
      <form onSubmit={handleCustomMood} className="flex gap-2">
        <input
          type="text"
          placeholder="Or type exactly how you feel (e.g. 'Feeling guilty after eating sweets', 'Nervous before sales call')..."
          value={customMoodInput}
          onChange={(e) => setCustomMoodInput(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/60 focus:outline-none shadow-inner"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex-shrink-0 shadow-md shadow-amber-500/20"
        >
          Diagnose Me
        </button>
      </form>

      {/* Diagnosis & State Shifter Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#090f1e] to-[#0d1426] border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentDisplay.emoji || '⚡'}</span>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                State Analysis
              </span>
              <h3 className="text-lg font-black text-[#fdfbf7]">
                {currentDisplay.label || currentDisplay.title}
              </h3>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 self-start sm:self-center">
            {currentDisplay.sublabel || 'Intelligent Triage'}
          </span>
        </div>

        {/* 1. Fun Relatable Lines */}
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            The Unvarnished Truth (Brotherly Reality Check)
          </span>
          <p className="text-sm text-amber-100 font-medium leading-relaxed italic">
            "{currentDisplay.funLine}"
          </p>
        </div>

        {/* 2. Tactical 2-Minute Solution & Rescue Quest */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              Immediate 2-Minute Tactical Solution
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-semibold">
              {currentDisplay.tacticalFix}
            </p>

            <div className="pt-3">
              <button
                onClick={() => handleAddRescueQuest(currentDisplay.rescueQuest)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add as 2-Minute Rescue Quest (+{currentDisplay.rescueQuest?.xp || 75} XP)</span>
              </button>

              {questAdded && (
                <p className="text-[11px] font-bold text-emerald-400 mt-2 text-center animate-pulse flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Rescue Quest Added to Your Daily Mission Board!
                </p>
              )}
            </div>
          </div>

          {/* 3. Relatable In-App Video Shifter */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1 mb-1">
                <Youtube className="w-3.5 h-3.5" /> Relatable Video Prescription
              </span>
              <h4 className="text-xs font-bold text-slate-200">
                Shift Your Neurochemistry & Break the Mental Loop
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Handpicked video to ground your thinking and release resistance.
              </p>
            </div>

            <button
              onClick={() => onPlayVideo({
                title: `${currentDisplay.label || currentDisplay.title} - Mindset Shift`,
                videoId: currentDisplay.videoId || '30VMIEmA114',
                desc: currentDisplay.tacticalFix
              })}
              className="py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-red-400" />
              <span>Watch State-Shift Video In-App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
