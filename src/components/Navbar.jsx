import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Cloud, 
  CloudOff, 
  User, 
  LogOut, 
  LogIn, 
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  Flame,
  FlaskConical
} from 'lucide-react';
import { useAuth } from '../firebase/auth';

export default function Navbar({ onOpenQuickAdd, onNavigate, activeTab, missionState }) {
  const { user, isGuest, loginWithGoogle, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const campaign = missionState?.campaign;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between select-none">
      {/* Left: Brand & Time Context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-[1.5px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-[#070b14] rounded-[14px] flex items-center justify-center font-black text-xs text-amber-300 tracking-wider">
              TR
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-extrabold text-[#fdfbf7] tracking-tight">
                {getGreeting()}, <span className="text-amber-400">Tushar</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                LIFEOS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="font-mono text-slate-300">{formattedTime} IST</span>
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Active Mission & Campaign Pill (Hidden on mobile) */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={() => onNavigate('mission_lab')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-xs font-semibold transition"
        >
          <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
          <span>Obesity-Free India</span>
        </button>

        {campaign && (
          <button
            onClick={() => onNavigate('campaign')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-amber-300 text-xs font-bold transition"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Speak to Impact: ₹{(campaign.financials?.collected || 0).toLocaleString('en-IN')} / ₹1L</span>
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* Sync Status Badge */}
        <div 
          title={isGuest ? "Local Storage Mode (Guest / Offline)" : "Real-time Cloud Firestore Active"}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isGuest 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}
        >
          {isGuest ? (
            <>
              <CloudOff className="w-3 h-3" />
              <span className="hidden md:inline">Local Active</span>
            </>
          ) : (
            <>
              <Cloud className="w-3 h-3 animate-pulse" />
              <span className="hidden md:inline">Cloud Synced</span>
            </>
          )}
        </div>

        {/* User Profile / Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1 rounded-xl hover:bg-slate-800/60 transition border border-transparent hover:border-slate-700/60"
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Tushar'} 
                className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-500/40" 
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                TR
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div 
              className="absolute right-0 mt-2 w-64 bg-[#090f1e] border border-slate-800 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800/80 mb-2">
                <p className="text-xs font-bold text-[#fdfbf7]">{user?.displayName || 'Tushar Raut'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'tusharraut2001@gmail.com'}</p>
              </div>

              {isGuest ? (
                <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl mb-2 text-[11px] text-amber-200">
                  <p className="font-semibold mb-1 flex items-center gap-1 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Offline / Guest Mode
                  </p>
                  <p className="text-[10px] text-slate-400 mb-2">
                    Connect Google Account for continuous multi-device sync and Calendar integration.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        await loginWithGoogle();
                        setShowProfileMenu(false);
                      } catch (e) {
                        alert('Sign-in error: ' + e.message);
                      }
                    }}
                    className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign in with Google
                  </button>
                </div>
              ) : (
                <div className="px-3 py-1.5 text-[11px] text-emerald-400 flex items-center gap-1.5 mb-2 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Firebase Live Connection Active
                </div>
              )}

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigate('settings');
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 rounded-xl transition"
              >
                Profile & Settings
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> {isGuest ? 'Reset Guest Session' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
