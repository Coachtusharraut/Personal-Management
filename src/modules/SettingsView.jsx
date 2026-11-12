import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Download, 
  Upload, 
  ShieldCheck, 
  Cloud, 
  Trash2, 
  Check, 
  ExternalLink,
  Sparkles,
  Database,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { useAuth } from '../firebase/auth';
import { exportAllData, importAllData, INITIAL_DATA } from '../firebase/firestoreService';

export default function SettingsView() {
  const { user, isGuest, loginWithGoogle, logout } = useAuth();
  const [importStatus, setImportStatus] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const handleExportJSON = () => {
    if (!user) return;
    const jsonStr = exportAllData(user.uid);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tusharraut_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const success = importAllData(user.uid, content);
        if (success) {
          setImportStatus('Data successfully restored!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setImportStatus('Invalid JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (!user) return;
    if (confirm('Are you sure you want to reset all data to default template? Current custom changes will be replaced.')) {
      ['tasks', 'habits', 'notes', 'expenses', 'goals'].forEach(col => {
        const key = `tr_mgmt_${user.uid}_${col}`;
        localStorage.setItem(key, JSON.stringify(INITIAL_DATA[col] || []));
      });
      alert('Workspace reset to defaults.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>System Settings & Data Sovereignty</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage user identity, Cloud Firestore security, backups, and display preferences.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-indigo-600/20">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
            ) : (
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-extrabold text-lg text-white">
                TR
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>{user?.displayName || 'Tushar Raut'}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO OWNER
              </span>
            </h3>
            <p className="text-xs text-slate-400">{user?.email || 'tusharraut2001@gmail.com'}</p>
            <p className="text-[11px] text-indigo-400 mt-1">
              Mode: {isGuest ? 'Offline Demo Session' : 'Firebase Cloud Authenticated'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isGuest ? (
            <button
              onClick={loginWithGoogle}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Connect Google</span>
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Firebase Cloud Details */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-850 pb-3">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold">
            <Cloud className="w-4 h-4" />
            <span>Firebase Cloud Infrastructure</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">Firebase Project ID</span>
            <p className="font-mono text-white font-semibold mt-0.5">personal-mgmt-app</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">Database Engine</span>
            <p className="font-mono text-white font-semibold mt-0.5">Cloud Firestore (Multi-region)</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">Primary Hosting Domain</span>
            <p className="font-mono text-indigo-400 font-semibold mt-0.5">tusharraut.web.app</p>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850">
            <span className="text-slate-400 text-[11px]">Offline Persistence</span>
            <p className="font-mono text-emerald-400 font-semibold mt-0.5">IndexedDB Multi-Tab Ready</p>
          </div>
        </div>
      </div>

      {/* Data Sovereignty & Backups */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-white text-xs font-bold border-b border-slate-850 pb-3">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Data Sovereignty & JSON Backups</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Your personal data belongs entirely to you. You can export a full JSON dump of your tasks, habits, notes, finances, and goals at any time, or restore from a previous backup.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition shadow-sm"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export All Data (.json)</span>
          </button>

          <label className="flex items-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition cursor-pointer shadow-sm">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Import / Restore (.json)</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleResetData}
            className="flex items-center space-x-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/20 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset to Template</span>
          </button>
        </div>

        {exportNotice && (
          <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-indigo-400" />
            <span>Backup file downloaded successfully.</span>
          </div>
        )}

        {importStatus && (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
}
