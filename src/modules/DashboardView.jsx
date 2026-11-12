import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Plus, ArrowRight, Clock, Circle } from 'lucide-react';
import { INITIAL_DAILY_QUESTS } from '../firebase/missionService';

const MASCOT='https://coachtusharraut.com/wp-content/uploads/2026/11/lifeos-adventurer-mascot-200x300.png';
const tile=[['career','🎯','Goals','Your next summit'],['calendar','🗓️','Plan','Own your time'],['story_forge','📖','Story Forge','Find your voice'],['opportunities','🚀','Opportunities','Find your next door']];
const todayKey=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());

export default function DashboardView({missionState,onSaveMissionState,tasks=[],habits=[],onNavigate}){
 const [showQuestInput,setShowQuestInput]=useState(false);
 const [questTitle,setQuestTitle]=useState('');
 const quests=missionState?.dailyQuests||INITIAL_DAILY_QUESTS;
 const today=todayKey();
 const todayQuests=quests.filter(q=>(!q.dueDate||q.dueDate===today));
 const topQuests=todayQuests.filter(q=>q.tier==='top3').slice(0,3);
 const done=todayQuests.filter(q=>q.completed).length;
 const total=todayQuests.length;
 const level=missionState?.userLevel||{level:1,title:'New Explorer',totalXp:0,currentXp:0,nextLevelXp:500,streakDays:0};
 const totalXp=level.totalXp??level.currentXp??0;
 const habitDone=habits.filter(h=>h.history?.[today]).length;
 const pendingTasks=tasks.filter(t=>t.status!=='done').length;
 const greeting=useMemo(()=>{
  const h=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',hourCycle:'h23'}).format(new Date()));
  return h<12?'Good morning':h<17?'Good afternoon':'Good evening';
 },[]);
 const dateLabel=new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',weekday:'long',day:'numeric',month:'short'}).format(new Date());

 const toggleQuest=(id)=>{
  const target=quests.find(q=>q.id===id);if(!target)return;
  const complete=!target.completed;
  const updated=quests.map(q=>q.id===id?{...q,completed:complete,status:complete?'done':'todo',completedAt:complete?new Date().toISOString():null}:q);
  const delta=complete?(target.xp||50):-(target.xp||50);
  const newTotal=Math.max(0,totalXp+delta);
  const newLevel=Math.floor(newTotal/500)+1;
  const titles=['New Explorer','Steady Builder','Brave Pathfinder','Dharma Warrior','Champion','Legacy Maker','Master Explorer'];
  const yesterday=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date(Date.now()-86400000));
  const last=level.lastQuestDate||'';
  const streak=complete?(last===today?(level.streakDays||0):last===yesterday?(level.streakDays||0)+1:1):(level.streakDays||0);
  onSaveMissionState({dailyQuests:updated,userLevel:{...level,totalXp:newTotal,level:newLevel,title:titles[Math.min(newLevel-1,titles.length-1)],currentXp:newTotal-((newLevel-1)*500),nextLevelXp:500,streakDays:streak,lastQuestDate:complete?today:last}});
  if(complete)confetti({particleCount:35,spread:55,origin:{y:.75}});
 };
 const addQuest=(e)=>{
  e.preventDefault();const title=questTitle.trim();if(!title)return;
  const item={id:'quest-'+Date.now(),title,description:'One small step forward.',category:'Personal Growth',tier:'top3',priority:'high',durationMins:20,xp:75,dueDate:today,status:'todo',completed:false};
  onSaveMissionState({dailyQuests:[item,...quests]});setQuestTitle('');setShowQuestInput(false);
 };

 return <div className="lifeos-home space-y-5 sm:space-y-7 animate-fadeIn">
  <section className="lifeos-hero relative overflow-hidden rounded-[28px] border border-amber-300/20 p-4 sm:p-7">
   <div className="relative z-10 flex items-center gap-2">
    <div className="min-w-0 flex-1">
     <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[.18em] text-amber-200/80">{greeting}, Tushar 👋</p>
     <h1 className="mt-1 text-[26px] sm:text-4xl font-black leading-tight text-white">Ready for a<br className="sm:hidden"/> little progress?</h1>
     <p className="mt-2 text-[11px] sm:text-sm text-slate-300">{dateLabel} · Level {level.level||1} explorer</p>
     <div className="mt-4 max-w-[240px]">
      <div className="flex items-center justify-between text-[10px] font-bold text-amber-100"><span>{totalXp.toLocaleString('en-IN')} XP</span><span>{Math.max(0,500-(level.currentXp||0))} XP to level up</span></div>
      <div className="mt-1.5 h-2 rounded-full bg-black/30 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400" style={{width:Math.min(100,((level.currentXp||0)/500)*100)+'%'}}/></div>
     </div>
    </div>
    <div className="lifeos-mascot-wrap shrink-0">
     <img src={MASCOT} alt="Your LifeOS adventure guide" className="lifeos-mascot" loading="eager"/>
     <span className="lifeos-mascot-spark">✨</span>
    </div>
   </div>
   <div className="relative z-10 mt-4 flex items-center gap-2">
    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-amber-50">🔥 {level.streakDays||0} day streak</span>
    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold text-amber-50">🏆 {level.title||'New Explorer'}</span>
   </div>
  </section>

  <section className="grid grid-cols-3 gap-2.5 sm:gap-4">
   <button onClick={()=>onNavigate('tasks')} className="lifeos-stat-card"><span className="lifeos-stat-icon">✅</span><span className="lifeos-stat-value">{done}/{total}</span><span className="lifeos-stat-label">Quests done</span></button>
   <button onClick={()=>onNavigate('habits')} className="lifeos-stat-card"><span className="lifeos-stat-icon">🌱</span><span className="lifeos-stat-value">{habitDone}/{habits.length}</span><span className="lifeos-stat-label">Habits today</span></button>
   <button onClick={()=>onNavigate('tasks')} className="lifeos-stat-card"><span className="lifeos-stat-icon">📌</span><span className="lifeos-stat-value">{pendingTasks}</span><span className="lifeos-stat-label">To do</span></button>
  </section>

  <section className="space-y-3">
   <div className="flex items-end justify-between gap-2">
    <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-300">Today's adventure</p><h2 className="mt-1 text-lg sm:text-xl font-black text-white">Your Big Three ⚡</h2></div>
    <button onClick={()=>setShowQuestInput(v=>!v)} className="flex min-h-10 items-center gap-1.5 rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-[11px] font-extrabold text-amber-200"><Plus size={15}/> Add</button>
   </div>
   {showQuestInput&&<form onSubmit={addQuest} className="flex gap-2 rounded-2xl border border-amber-300/20 bg-[#101b2c] p-3"><input autoFocus value={questTitle} onChange={e=>setQuestTitle(e.target.value)} placeholder="What is your next small win?" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-white"/><button className="rounded-xl bg-amber-300 px-3 text-xs font-black text-[#091a35]">Save</button></form>}
   {topQuests.length===0?<div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-5 text-center"><span className="text-3xl">🧭</span><p className="mt-2 text-sm font-bold text-white">Your day is wide open!</p><p className="mt-1 text-xs text-slate-400">Add one small win and get moving.</p><button onClick={()=>setShowQuestInput(true)} className="mt-3 rounded-xl bg-amber-300 px-4 py-2 text-xs font-black text-[#091a35]">Create first quest</button></div>:
    <div className="space-y-2.5">{topQuests.map((q,i)=><button key={q.id} onClick={()=>toggleQuest(q.id)} className={'lifeos-quest-card '+(q.completed?'is-done':'')}><span className="lifeos-quest-number">{['1','2','3'][i]}</span><span className="min-w-0 flex-1 text-left"><span className={'block text-[12px] sm:text-sm font-bold leading-snug '+(q.completed?'line-through text-slate-500':'text-white')}>{q.title}</span><span className="mt-1 flex items-center gap-2 text-[10px] text-slate-400"><span>{q.category||'Personal'}</span><span>·</span><span><Clock size={10} className="inline"/> {q.durationMins||20} min</span><span>·</span><span className="text-amber-300">+{q.xp||50} XP</span></span></span><span className={'lifeos-quest-check '+(q.completed?'checked':'')}>{q.completed?<Check size={17}/>:<Circle size={19}/>}</span></button>)}</div>}
  </section>

  <section className="space-y-3">
   <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-amber-300">Your world</p><h2 className="mt-1 text-lg sm:text-xl font-black text-white">Where to next? 🚀</h2></div>
   <div className="grid grid-cols-2 gap-2.5 sm:gap-3">{tile.map(([tab,emoji,title,sub])=><button key={tab} onClick={()=>onNavigate(tab)} className="lifeos-launch-card"><span className="text-2xl sm:text-3xl">{emoji}</span><span className="mt-2 block text-sm font-extrabold text-white">{title}</span><span className="mt-0.5 block text-[10px] text-slate-400">{sub}</span><ArrowRight size={15} className="mt-2 text-amber-300"/></button>)}</div>
  </section>

  <section className="lifeos-cheer flex items-center gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/5 p-3.5">
   <span className="text-2xl">🌟</span><p className="text-xs leading-relaxed text-slate-300"><strong className="text-emerald-200">A little reminder:</strong> You don't need a perfect day. Just one honest step.</p>
  </section>
 </div>;
}
