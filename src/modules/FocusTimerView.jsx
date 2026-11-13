import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Volume2, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MODES = {
  focus: { label: 'Deep Focus', duration: 25 * 60, color: 'text-indigo-400', border: 'border-indigo-500' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'text-emerald-400', border: 'border-emerald-500' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'text-cyan-400', border: 'border-cyan-500' }
};

export default function FocusTimerView({ isTimerRunning, setIsTimerRunning }) {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tr_focus_sessions') || '[]');
    } catch {
      return [];
    }
  });

  const timerRef = useRef(null);

  // Play a pleasant chime using browser Web Audio API
  const playSoundChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            playSoundChime();
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

            // Record completed session
            const newSession = {
              id: Date.now(),
              type: mode,
              duration: MODES[mode].duration / 60,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toISOString().split('T')[0]
            };
            setCompletedSessions(prevSessions => {
              const updated = [newSession, ...prevSessions].slice(0, 20);
              localStorage.setItem('tr_focus_sessions', JSON.stringify(updated));
              return updated;
            });

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, mode, setIsTimerRunning]);

  const switchMode = (newMode) => {
    setIsTimerRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setTimeLeft(MODES[mode].duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = MODES[mode].duration;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 754 - (754 * progressPercent) / 100;

  const todayStr = new Date().toISOString().split('T')[0];
  const sessionsToday = completedSessions.filter(s => s.date === todayStr && s.type === 'focus').length;
  const focusMinutesToday = sessionsToday * 25;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span>Deep Focus Engine</span>
        </h2>
        <p className="text-xs text-slate-400">
          Shield your attention, enter flow state, and compound cognitive output.
        </p>
      </div>

      {/* Mode Selectors */}
      <div className="flex justify-center">
        <div className="flex items-center p-1.5 bg-slate-900 border border-slate-800 rounded-2xl gap-1">
          <button
            onClick={() => switchMode('focus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mode === 'focus' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Deep Focus (25m)</span>
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break (5m)</span>
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mode === 'longBreak' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Long Break (15m)</span>
          </button>
        </div>
      </div>

      {/* Circular Timer Visual */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* SVG Circular Ring */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
            <circle
              cx="130"
              cy="130"
              r="120"
              className="text-slate-900 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="130"
              cy="130"
              r="120"
              className={`${mode === 'focus' ? 'text-indigo-500' : mode === 'shortBreak' ? 'text-emerald-500' : 'text-cyan-500'} stroke-current transition-all duration-500`}
              strokeWidth="10"
              strokeDasharray="754"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time Display Inside Circle */}
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-mono font-extrabold text-white tracking-tighter">
              {formattedTime}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-widest mt-2 ${MODES[mode].color}`}>
              {MODES[mode].label}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center space-x-4">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`px-8 py-3 rounded-2xl font-bold text-sm flex items-center space-x-2 transition transform active:scale-95 shadow-xl ${
              isTimerRunning 
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isTimerRunning ? 'Pause Session' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition border border-slate-700"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Focus Daily Stats & History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Today's Cognitive Depth</span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{sessionsToday}</span>
            <span className="text-xs text-slate-400">sessions completed ({focusMinutesToday}m deep work)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Recommended target: 4 focus sprints (100 mins) daily for optimal neuro-productivity.
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Flow State Rule</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Eliminate all browser tabs except current task. Put devices on silent. Every interruption costs ~23 minutes of focus recovery.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>Audio cue enabled</span>
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
