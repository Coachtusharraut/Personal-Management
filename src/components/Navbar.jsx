import React, { useEffect, useState } from 'react';
import { Plus, Cloud, User, LogOut, ChevronDown, Download, Smartphone, Settings, X } from 'lucide-react';
import { useAuth } from '../firebase/auth';

const MASCOT='https://coachtusharraut.com/wp-content/uploads/2026/11/lifeos-adventurer-mascot-200x300.png';

export default function Navbar({onOpenQuickAdd,onNavigate,activeTab,missionState}){
 const {user,logout}=useAuth();
 const [time,setTime]=useState(new Date());
 const [showProfileMenu,setShowProfileMenu]=useState(false);
 const [installPrompt,setInstallPrompt]=useState(null);
 const [showInstallHelp,setShowInstallHelp]=useState(false);
 useEffect(()=>{const id=window.setInterval(()=>setTime(new Date()),60000);return()=>window.clearInterval(id);},[]);
 useEffect(()=>{
  const handler=e=>{e.preventDefault();setInstallPrompt(e);};
  window.addEventListener('beforeinstallprompt',handler);
  return()=>window.removeEventListener('beforeinstallprompt',handler);
 },[]);
 const date=time.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
 const handleInstall=async()=>{
  if(installPrompt){
   installPrompt.prompt();
   try{await installPrompt.userChoice;}catch(e){}
   setInstallPrompt(null);
  }else setShowInstallHelp(v=>!v);
 };
 return <header className="lifeos-topbar sticky top-0 z-30 flex h-[60px] sm:h-16 items-center justify-between border-b border-slate-800/80 bg-[#070b14]/95 px-3 sm:px-5 lg:px-8 backdrop-blur-xl">
  <div className="flex min-w-0 items-center gap-2.5">
   <div className="lifeos-brand-avatar"><img src={MASCOT} alt="" /></div>
   <div className="min-w-0">
    <h1 className="truncate text-[14px] sm:text-[15px] font-black tracking-tight text-white">LifeOS <span className="text-amber-300">✦</span></h1>
    <p className="text-[10px] text-slate-400">{date} <span className="hidden sm:inline">· Your little adventure</span></p>
   </div>
  </div>
  <div className="flex shrink-0 items-center gap-2">
   <button onClick={onOpenQuickAdd} aria-label="Quick add" className="lifeos-add-button"><Plus size={21} strokeWidth={2.7}/><span className="hidden sm:inline">Add</span></button>
   <div className="relative">
    <button onClick={()=>setShowProfileMenu(v=>!v)} aria-label="Profile menu" aria-expanded={showProfileMenu} className="lifeos-profile-button">
     {user?.photoURL?<img src={user.photoURL} alt="" className="h-9 w-9 rounded-full object-cover"/>:<span>{(user?.displayName||'T').slice(0,1).toUpperCase()}</span>}
    </button>
    {showProfileMenu&&<div className="absolute right-0 top-12 z-[70] w-64 rounded-2xl border border-slate-700 bg-[#101b2c] p-3 shadow-2xl">
     <div className="flex items-center gap-3 border-b border-slate-700/70 px-2 pb-3">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-300/15 text-amber-200"><User size={18}/></div>
      <div className="min-w-0"><p className="truncate text-xs font-bold text-white">{user?.displayName||'Tushar'}</p><p className="truncate text-[10px] text-slate-400">{user?.email||'Signed in'}</p></div>
     </div>
     <button onClick={()=>{setShowProfileMenu(false);onNavigate('settings');}} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800"><Settings size={16}/> Settings & backup</button>
     <button onClick={handleInstall} className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs font-semibold text-amber-200 hover:bg-slate-800"><Download size={16}/> Install LifeOS</button>
     {showInstallHelp&&<div className="mx-1 mb-2 rounded-xl border border-amber-300/15 bg-amber-300/5 p-3 text-[10px] leading-relaxed text-slate-300"><p className="font-bold text-amber-200">Add to your phone</p><p className="mt-1">Android: open LifeOS directly in Chrome, tap ⋮, then “Install app” or “Add to Home screen”. iPhone: open in Safari, tap Share, then “Add to Home Screen”.</p><button onClick={()=>setShowInstallHelp(false)} className="mt-2 text-amber-200 underline">Got it</button></div>}
     <button onClick={async()=>{setShowProfileMenu(false);await logout();}} className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-xs font-semibold text-rose-300 hover:bg-rose-500/10"><LogOut size={16}/> Sign out</button>
    </div>}
   </div>
  </div>
 </header>;
}
