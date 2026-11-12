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
  Clock
} from 'lucide-react';
import { useAuth } from '../firebase/auth';

export default function Navbar({ onOpenQuickAdd, onNavigate, activeTab }) {
  const { user, isGuest, loginWithGoogle, logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showAuthModal, setShowAuthModal] = useState(false);
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

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Greeting & Current Context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center font-bold text-xs text-white tracking-wider">
              TR
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                {getGreeting()}, <span className="text-indigo-400">Tushar</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="font-mono text-slate-300">{formattedTime}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm shadow-indigo-600/30 transition-all transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* Sync Status Badge */}
        <div 
          title={isGuest ? "Local Storage Mode (Guest)" : "Real-time Cloud Sync Active"}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            isGuest 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}
        >
          {isGuest ? (
            <>
              <CloudOff className="w-3 h-3" />
              <span className="hidden md:inline">Guest Mode</span>
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
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700" 
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                TR
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div 
              className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <div className="px-3 py-2 border-b border-slate-800/80 mb-2">
                <p className="text-xs font-semibold text-white">{user?.displayName || 'Tushar Raut'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'tusharraut2001@gmail.com'}</p>
              </div>

              {isGuest ? (
                <div className="p-2 bg-indigo-950/40 border border-indigo-900/40 rounded-xl mb-2 text-[11px] text-indigo-300">
                  <p className="font-medium mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> Demo / Offline Ready
                  </p>
                  <p className="text-[10px] text-slate-400 mb-2">
                    Connect your Google account for persistent multi-device Firebase cloud sync.
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
                    className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign in with Google
                  </button>
                </div>
              ) : (
                <div className="px-3 py-1.5 text-[11px] text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Firebase Live Connection Active
                </div>
              )}

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigate('settings');
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 rounded-lg transition"
              >
                Profile & Settings
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition flex items-center gap-1.5"
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
