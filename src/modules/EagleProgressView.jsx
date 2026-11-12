import React from 'react';
import {Target,Users,Trophy,TrendingUp,ArrowRight,Star,CheckCircle2} from 'lucide-react';

export default function EagleProgressView({teams=[],ibos=[],prospects=[],activities=[],onNavigate}){
 const core=ibos.filter(x=>x.meetingAttended&&x.bookingMade&&x.businessActive);
 const qualified=teams.filter(t=>Number(t.percentage||0)>=3);
 const pct=core.length/60*100;
 const totalConversations=activities.filter(a=>a.type==='conversation').reduce((n,a)=>n+(Number(a.quantity)||1),0);
 const meetingCount=activities.filter(a=>a.type==='meeting_attended').reduce((n,a)=>n+(Number(a.quantity)||1),0);
 const booked=activities.filter(a=>a.type==='meeting_booked').reduce((n,a)=>n+(Number(a.quantity)||1),0);
 return <div className="space-y-4">
  <section className="eagle-progress-hero"><div className="text-5xl">🏔️</div><p className="eagle-mini-label">THE VIEW FROM ABOVE</p><h1>Your Eagle is taking shape.</h1><p>Six wings. Sixty Core IBOs. Six legs at 3%+.</p><div className="eagle-progress-number">{core.length}<span> / 60</span></div><div className="eagle-progress-track"><div style={{width:Math.min(100,pct)+'%'}}/></div><div className="text-right text-[10px] text-amber-100">{Math.round(pct)}% of Core IBO target</div></section>
  <div className="grid grid-cols-3 gap-2"><div className="eagle-progress-stat"><b>{qualified.length}/6</b><small>Legs at 3%+</small></div><div className="eagle-progress-stat"><b>{totalConversations}</b><small>Conversations</small></div><div className="eagle-progress-stat"><b>{booked}</b><small>Bookings</small></div></div>
  <section className="space-y-2"><div className="eagle-section-heading"><div><p>THE SIX WINGS</p><h2>Leg-by-leg progress</h2></div><button onClick={()=>onNavigate('teams')}>Open <ArrowRight size={14}/></button></div>
   <div className="space-y-2">{teams.map((t,i)=>{
    const members=ibos.filter(x=>x.teamId===t.id);
    const count=members.filter(x=>x.meetingAttended&&x.bookingMade&&x.businessActive).length;
    const ok=Number(t.percentage||0)>=3;
    return <article key={t.id} className={'eagle-progress-team team-'+(i+1)}><div className="flex items-center gap-3"><span className="text-2xl">🦅</span><div className="min-w-0 flex-1"><b>{t.name||'Team '+(i+1)}</b><small>{count}/10 Core IBOs · {Number(t.percentage||0).toFixed(1)}%</small></div><span className={'eagle-team-status '+(ok?'ok':'')}>{ok?'3% ✓':'3% target'}</span></div><div className="eagle-progress-track mt-2"><div style={{width:Math.min(100,count*10)+'%'}}/></div></article>;
   })}</div>
  </section>
  <section className="eagle-progress-summary"><div className="text-3xl">🏆</div><div><b>{core.length===60&&qualified.length===6?'EAGLE STRUCTURE BUILT!': 'Keep building, one wing at a time.'}</b><small>{core.length===60&&qualified.length===6?'All six wings have hit their targets.':'You need '+(60-core.length)+' more Core IBOs and '+(6-qualified.length)+' legs at 3%+.'}</small></div></section>
 </div>;
}
