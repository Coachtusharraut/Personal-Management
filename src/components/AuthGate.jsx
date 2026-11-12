import React,{useState} from 'react';
import {useAuth} from '../firebase/auth';
import {ShieldCheck,Chrome} from 'lucide-react';
export default function AuthGate(){
 const {loginWithGoogle}=useAuth();
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const signIn=async()=>{setBusy(true);setError('');try{await loginWithGoogle();}catch(e){setError(e?.code==='auth/unauthorized-domain'?'Add this domain to Firebase Authentication → Settings → Authorised domains.':e?.message||'Google sign-in could not be completed.');}finally{setBusy(false);}};
 return <main className="eagle-login"><div className="eagle-login-card"><div className="eagle-login-bird">🦅</div><p className="eagle-mini-label">COACH TUSHAR RAUT · LIFEOS</p><h1>Build your<br/><span>Eagle Structure.</span></h1><p className="eagle-login-sub">6 teams · 10 Core IBOs each · 3%+ per leg</p><div className="eagle-login-map">{Array.from({length:6},(_,i)=><span key={i}>🦅 <b>{i+1}</b></span>)}</div><button onClick={signIn} disabled={busy} className="eagle-login-button"><Chrome size={19}/>{busy?'Opening Google…':'Continue with Google'}</button>{error&&<p role="alert" className="mt-3 text-xs text-rose-200">{error}</p>}<p className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-400"><ShieldCheck size={14}/> Private to your signed-in owner account</p></div></main>;
}
