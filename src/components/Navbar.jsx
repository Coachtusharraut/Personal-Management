import React,{useEffect,useState} from 'react';
import {Plus,MoreVertical,LogOut,Settings,Download,X} from 'lucide-react';
import {useAuth} from '../firebase/auth';
export default function Navbar({onOpenQuickAdd,onNavigate,activeTab,missionState}){
 const {user,logout}=useAuth();
 const [menu,setMenu]=useState(false);
 const [installPrompt,setInstallPrompt]=useState(null);
 useEffect(()=>{const handler=e=>{e.preventDefault();setInstallPrompt(e)};window.addEventListener('beforeinstallprompt',handler);return()=>window.removeEventListener('beforeinstallprompt',handler)},[]);
 const install=async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice.catch(()=>{});setInstallPrompt(null);}else alert('Android: Chrome ⋮ → Install app / Add to Home screen. iPhone: Safari Share → Add to Home Screen.');};
 return <header className="eagle-topbar">
  <div className="flex min-w-0 items-center gap-2.5"><div className="eagle-brand-mark">🦅</div><div className="min-w-0"><b className="block truncate text-sm font-black tracking-wide text-white">EAGLE STRUCTURE</b><small className="block text-[9px] font-semibold tracking-[.13em] text-amber-200/75">LIFEOS · EAGLE BUILDER</small></div></div>
  <div className="flex items-center gap-2"><button onClick={onOpenQuickAdd} className="eagle-top-add"><Plus size={17}/><span>Log</span></button><div className="relative"><button onClick={()=>setMenu(v=>!v)} className="eagle-menu-button" aria-label="Open menu">{menu?<X size={19}/>:<MoreVertical size={19}/>}</button>{menu&&<div className="eagle-profile-menu"><div className="px-3 py-2 border-b border-white/10"><b className="text-xs text-white">{user?.displayName||'Eagle Builder'}</b><small className="block text-[10px] text-slate-400">{user?.email||''}</small></div><button onClick={()=>{setMenu(false);onNavigate('settings')}}><Settings size={15}/> Settings & backup</button><button onClick={install}><Download size={15}/> Install app</button><button onClick={async()=>{setMenu(false);await logout()}} className="text-rose-300"><LogOut size={15}/> Sign out</button></div>}</div></div>
 </header>;
}
