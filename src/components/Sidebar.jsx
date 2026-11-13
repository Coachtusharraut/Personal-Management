import React from 'react';
import {Home,Users,MessageCircle,ClipboardList,TrendingUp,BookOpen,Settings,ChevronRight} from 'lucide-react';
export const NAV_ITEMS=[
 {id:'home',label:'Eagle Home',icon:Home},
 {id:'teams',label:'Six Wings',icon:Users},
 {id:'people',label:'People Pipeline',icon:MessageCircle},
 {id:'activity',label:'Daily Actions',icon:ClipboardList},
 {id:'progress',label:'Eagle Progress',icon:TrendingUp},
 {id:'wisdom',label:'Eagle Wisdom',icon:BookOpen},
 {id:'settings',label:'Settings',icon:Settings}
];
export default function Sidebar({activeTab,onSelectTab}){
 return <aside className="eagle-sidebar hidden md:flex"><div className="eagle-sidebar-brand"><span>🦅</span><div><b>EAGLE STRUCTURE</b><small>LifeOS · Eagle Builder</small></div></div>
  <nav className="mt-5 space-y-1">{NAV_ITEMS.map(item=>{const I=item.icon;return <button key={item.id} onClick={()=>onSelectTab(item.id)} className={'eagle-side-link '+(activeTab===item.id?'active':'')}><I size={18}/><span>{item.label}</span>{activeTab===item.id&&<ChevronRight size={15} className="ml-auto"/>}</button>;})}</nav>
  <div className="mt-auto rounded-2xl border border-amber-300/15 bg-amber-300/5 p-3"><div className="text-2xl">🪶</div><b className="block mt-1 text-xs text-amber-200">6 wings. 60 Core IBOs.</b><small className="mt-1 block text-[10px] leading-relaxed text-slate-400">One strong structure. One person at a time.</small></div>
 </aside>;
}
