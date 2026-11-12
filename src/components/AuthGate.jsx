import React, { useState } from 'react';
import { ShieldCheck, Swords, Sparkles, Chrome, LockKeyhole } from 'lucide-react';
import { useAuth } from '../firebase/auth';

export default function AuthGate({ loading = false }) {
  const { loginWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const signIn = async () => {
    setBusy(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err?.code === 'auth/unauthorized-domain'
        ? 'This website domain is not yet authorised in Firebase Authentication. Add coachtusharraut.com and your Firebase Hosting domain under Firebase Console → Authentication → Settings → Authorised domains.'
        : err?.message || 'Google sign-in could not be completed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07101e] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="rounded-[30px] border border-amber-300/20 bg-gradient-to-br from-[#12213a] via-[#0a1425] to-[#11172b] p-7 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-300 text-[#091a35] grid place-items-center shadow-lg"><Swords size={25}/></div>
            <div><p className="text-[11px] tracking-[.22em] uppercase text-amber-200 font-bold">Coach Tushar Raut</p><p className="text-xs text-slate-400">Personal Operating System</p></div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200"><ShieldCheck size={14}/> Owner-only workspace</span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.03] mt-5">Your next chapter<br/><span className="text-amber-300">starts with one action.</span></h1>
          <p className="text-slate-300 leading-relaxed mt-5 text-sm sm:text-base">Sign in with the Google account that owns your LifeOS data. Your goals, journal, tasks and story progress are saved to your private account, not to a shared demo profile.</p>
          <button onClick={signIn} disabled={busy || loading} className="mt-8 w-full rounded-2xl bg-amber-300 hover:bg-amber-200 disabled:opacity-60 text-[#091a35] font-extrabold py-4 flex items-center justify-center gap-3 shadow-xl shadow-amber-300/10 transition">
            <Chrome size={19}/>{busy ? 'Connecting securely…' : 'Continue with Google'}
          </button>
          {error && <div role="alert" className="mt-4 p-3 rounded-xl border border-rose-400/25 bg-rose-400/10 text-rose-200 text-xs leading-relaxed">{error}</div>}
          <div className="mt-7 pt-5 border-t border-white/10 flex gap-3 text-xs text-slate-400"><LockKeyhole size={16} className="text-amber-300 shrink-0 mt-0.5"/><p>Only the signed-in Firebase account can read or change its records. Do not share your WordPress page password as a substitute for account sign-in.</p></div>
        </div>
        <p className="text-center mt-5 text-[11px] text-slate-500 flex items-center justify-center gap-2"><Sparkles size={13}/> Dharma · Discipline · Growth</p>
      </div>
    </main>
  );
}
