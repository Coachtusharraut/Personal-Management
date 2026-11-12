import React, { useMemo } from 'react';
import {playEagleSound} from '../utils/eagleEffects';
import { ArrowRight, Plus, Users, MessageCircle, CalendarCheck, TrendingUp, Target, Sparkles } from 'lucide-react';

const EAGLE_ART=(
<svg viewBox="0 0 320 180" className="w-full h-full" role="img" aria-label="Golden eagle with wings spread">
 <defs><linearGradient id="egWing" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#fff1b9"/><stop offset=".48" stopColor="#e8b750"/><stop offset="1" stopColor="#96531b"/></linearGradient><linearGradient id="egBody" x1="0" x2="1"><stop stopColor="#fff7d6"/><stop offset=".7" stopColor="#d99b43"/><stop offset="1" stopColor="#7b431b"/></linearGradient><filter id="egGlow"><feGaussianBlur stdDeviation="4"/></filter></defs>
 <ellipse cx="160" cy="95" rx="126" ry="52" fill="#efb64a" opacity=".12" filter="url(#egGlow)"/>
 <path d="M151 70C117 39 74 26 12 48c27 2 45 12 58 28-25-8-47-6-66 7 37 1 59 14 76 29-21-2-38 5-49 17 37-3 72 1 105 24l24-23 24 23c33-23 68-27 105-24-11-12-28-19-49-17 17-15 39-28 76-29-19-13-41-15-66-7 13-16 31-26 58-28-62-22-105-9-139 22Z" fill="url(#egWing)" stroke="#ffe6a4" strokeWidth="2.3" strokeLinejoin="round"/>
 <g fill="#7f4b22" opacity=".58"><path d="M145 77 30 54l90 40-75-9 89 29-53-1 73 23-20-43Z"/><path d="m175 77 115-23-90 40 75-9-89 29 53-1-73 23 20-43Z"/></g>
 <path d="M135 62c7-22 44-29 57 1l-6 56-27 26-27-26Z" fill="url(#egBody)" stroke="#fff0bd" strokeWidth="2"/>
 <path d="M142 68c7-13 21-19 34-12l-6 26-25 2Z" fill="#fff8dd"/>
 <path d="M158 50c15-18 36-10 39 6-6 17-20 23-34 19l-12-10Z" fill="#fff6d5"/>
 <path d="m186 65 25 8-20 13-10-10Z" fill="#e9a832" stroke="#ffe8a0" strokeWidth="1.5"/>
 <path d="m205 72 7 4-8 4Z" fill="#442515"/>
 <circle cx="179" cy="61" r="3.5" fill="#261a12"/><circle cx="180" cy="60" r="1" fill="#fff"/>
 <path d="M149 129 142 155l16-13 2-13 8 13 14 13-6-26Z" fill="#85501f" stroke="#f9db8f" strokeWidth="1.5"/>
 <path d="m150 143-11 11 12-2 8-7 8 7 12 2-11-11" fill="#d39a3e"/>
</svg>);

export default function DashboardView({teams=[],ibos=[],prospects=[],activities=[],onNavigate,onOpenQuickAdd}){
 const core=ibos.filter(x=>x.meetingAttended&&x.bookingMade&&x.businessActive);
 const totalTalks=activities.filter(x=>x.type==='conversation').reduce((n,x)=>n+(Number(x.quantity)||1),0);
 const qualified=teams.filter(t=>Number(t.percentage||0)>=3).length;
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());
 const todayActivity=activities.filter(a=>(a.date||'')===today);
 const counts=useMemo(()=>[
  {label:'Conversations',value:totalTalks,icon:MessageCircle,tab:'people',color:'gold'},
  {label:'Meetings booked',value:todayActivity.filter(a=>a.type==='meeting_booked').reduce((n,a)=>n+(Number(a.quantity)||1),0),icon:CalendarCheck,tab:'activity',color:'blue'},
  {label:'Core IBOs',value:core.length+'/60',icon:Users,tab:'teams',color:'green'}
 ],[totalTalks,todayActivity,core.length]);
 const teamCores=teams.map(t=>({team:t,count:core.filter(x=>x.teamId===t.id).length})).sort((a,b)=>(a.team.index||0)-(b.team.index||0));
 const greeting=new Date().getHours()<12?'Good morning':new Date().getHours()<17?'Good afternoon':'Good evening';
 const openPeople=prospects.filter(p=>!['converted','parked'].includes(p.stage)).length;

 return <div className="eagle-home space-y-4">
  <section className="eagle-hero">
   <div className="eagle-hero-top"><div><p className="eagle-kicker">{greeting}, Eagle Builder 🪶</p><h1>Let's build<br/><span>your Eagle.</span></h1><p className="eagle-sub">One conversation at a time.</p></div><div className="eagle-art relative"><button type="button" onClick={()=>playEagleSound('eagle')} title="Hear the eagle" aria-label="Play eagle call" className="absolute right-0 top-0 z-10 rounded-full border border-amber-200/30 bg-black/25 px-2 py-1 text-[10px] text-amber-100">🔊</button>{EAGLE_ART}</div></div>
   <div className="eagle-mission-strip"><span>🎯</span><div><b>THE EAGLE STRUCTURE</b><small>6 teams · 10 Core IBOs each · 3%+ per leg</small></div><button onClick={()=>onNavigate('progress')} aria-label="View structure"><ArrowRight size={19}/></button></div>
  </section>

  <section className="eagle-main-progress" onClick={()=>onNavigate('progress')} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&onNavigate('progress')}>
   <div className="flex items-center justify-between gap-2"><div><p className="eagle-mini-label">YOUR EAGLE NETWORK</p><div className="eagle-big-number">{core.length}<span> / 60 Core IBOs</span></div></div><div className="eagle-ring" style={{'--progress':(Math.min(100,core.length/60*100))+'%'}}><div><b>{Math.round(core.length/60*100)}%</b><small>built</small></div></div></div>
   <div className="eagle-progress-track"><div style={{width:Math.min(100,core.length/60*100)+'%'}}/></div>
   <div className="eagle-progress-foot"><span>{qualified}/6 legs at 3%+</span><span>{Math.max(0,60-core.length)} to go</span></div>
  </section>

  <section className="grid grid-cols-3 gap-2">
   {counts.map(({label,value,icon:Icon,tab,color})=><button key={label} onClick={()=>onNavigate(tab)} className={'eagle-metric '+color}><Icon size={19}/><b>{value}</b><small>{label}</small></button>)}
  </section>

  <section className="space-y-2">
   <div className="eagle-section-heading"><div><p>THE SIX WINGS</p><h2>Your 6 teams</h2></div><button onClick={()=>onNavigate('teams')}>View all <ArrowRight size={14}/></button></div>
   <div className="eagle-six-grid">
    {teamCores.map(({team,count},i)=><button key={team.id} onClick={()=>onNavigate('teams',team.id)} className={'eagle-team-chip team-'+(i+1)}>
      <span className="eagle-team-bird">🦅</span><span className="eagle-team-name">{team.name||'Team '+(i+1)}</span><b>{count}/10</b><span className={'eagle-percent '+(Number(team.percentage)>=3?'qualified':'')}>{Number(team.percentage||0).toFixed(1)}% {Number(team.percentage)>=3?'✓':'/ 3%'}</span>
     </button>)}
   </div>
  </section>

  <section className="grid grid-cols-2 gap-2.5">
   <button onClick={()=>onNavigate('people')} className="eagle-action-card"><span className="eagle-action-art">🗣️</span><b>Talk to more people</b><small>{openPeople} in your pipeline</small><ArrowRight size={15}/></button>
   <button onClick={()=>onNavigate('activity')} className="eagle-action-card"><span className="eagle-action-art">📅</span><b>Log today's actions</b><small>{todayActivity.length} activities today</small><ArrowRight size={15}/></button>
  </section>

  <section className="eagle-quote"><span>🪶</span><p><b>Fly high. Build wide. Build deep.</b><small>Every strong wing starts with one person who grows.</small></p><button onClick={()=>onNavigate('wisdom')} aria-label="Eagle wisdom"><ArrowRight size={17}/></button></section>
 </div>;
}
