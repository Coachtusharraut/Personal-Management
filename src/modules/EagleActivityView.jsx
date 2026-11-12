import React,{useMemo,useState} from 'react';
import {Plus,MessageCircle,CalendarCheck,Users,BriefcaseBusiness,Clock,CheckCircle2,Mic2,BookOpen,Filter} from 'lucide-react';

const OPTIONS=[
 ['conversation','Talk / new conversation','🗣️'],
 ['follow_up','Follow-up','📩'],
 ['meeting_booked','Meeting booked','📅'],
 ['meeting_attended','Meeting attended','🤝'],
 ['presentation','Business presentation','🎤'],
 ['business_activity','Business activity / training','⚡'],
 ['team_meeting','Team meeting','👥'],
 ['ibo_added','New IBO added','🪶'],
 ['core_ibo_qualified','Core IBO qualified','🏆']
];
const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date());
export default function EagleActivityView({activities=[],teams=[],onAddActivity}){
 const [form,setForm]=useState({type:'conversation',quantity:1,teamId:'',note:'',date:today()});
 const [show,setShow]=useState(false);
 const [saving,setSaving]=useState(false);
 const daily=activities.filter(a=>(a.date||'')===today());
 const summary=useMemo(()=>[
  ['Talks',daily.filter(a=>a.type==='conversation').reduce((n,a)=>n+(Number(a.quantity)||1),0),'🗣️'],
  ['Follow-ups',daily.filter(a=>a.type==='follow_up').reduce((n,a)=>n+(Number(a.quantity)||1),0),'📩'],
  ['Meetings',daily.filter(a=>['meeting_booked','meeting_attended'].includes(a.type)).reduce((n,a)=>n+(Number(a.quantity)||1),0),'🤝'],
  ['Business actions',daily.filter(a=>['presentation','business_activity','team_meeting'].includes(a.type)).reduce((n,a)=>n+(Number(a.quantity)||1),0),'⚡']
 ],[daily]);
 const save=async(e)=>{e.preventDefault();setSaving(true);try{await onAddActivity({...form,quantity:Number(form.quantity)||1});setForm({...form,quantity:1,note:''});setShow(false);}finally{setSaving(false);}};
 const label=id=>OPTIONS.find(x=>x[0]===id)?.[1]||id;
 const recent=[...activities].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,25);
 return <div className="space-y-4">
  <section className="eagle-page-heading"><span className="eagle-heading-icon">⚡</span><div><p>YOUR DAILY FLIGHT</p><h1>Actions create altitude.</h1><small>Track what you actually do. Every day.</small></div></section>
  <div className="grid grid-cols-2 gap-2.5">{summary.map(([label,value,emoji])=><div key={label} className="eagle-action-stat"><span>{emoji}</span><b>{value}</b><small>{label} today</small></div>)}</div>
  <button onClick={()=>setShow(v=>!v)} className="eagle-primary-button w-full justify-center"><Plus size={17}/> Log an action</button>
  {show&&<form onSubmit={save} className="eagle-form">
   <label className="eagle-form-label">What did you do?</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="eagle-input">{OPTIONS.map(o=><option key={o[0]} value={o[0]}>{o[2]} {o[1]}</option>)}</select>
   <div className="grid grid-cols-2 gap-2"><label className="eagle-form-label">Number<input type="number" min="1" max="9999" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="eagle-input mt-1"/></label><label className="eagle-form-label">Date<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="eagle-input mt-1"/></label></div>
   <label className="eagle-form-label">Which wing?<select value={form.teamId} onChange={e=>setForm({...form,teamId:e.target.value})} className="eagle-input mt-1"><option value="">General / all teams</option>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
   <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Quick note (optional)" className="eagle-input"/>
   <button disabled={saving} className="eagle-primary-button w-full justify-center">{saving?'Saving…':'Save action'}</button>
  </form>}
  <div className="eagle-section-heading"><div><p>RECENT FLIGHT LOG</p><h2>Your activity</h2></div><span className="eagle-count-pill">{activities.length} total</span></div>
  {recent.length===0?<div className="eagle-empty"><span>📓</span><b>Your first action goes here.</b><small>Log your conversations, meetings and follow-ups.</small></div>:<div className="space-y-2">{recent.map(a=><article key={a.id} className="eagle-log-row"><span className="eagle-log-emoji">{OPTIONS.find(o=>o[0]===a.type)?.[2]||'⚡'}</span><div className="min-w-0 flex-1"><b>{label(a.type)}</b><small>{a.note||teams.find(t=>t.id===a.teamId)?.name||'Eagle Structure'}</small><small>{a.date||''} · {a.teamId?teams.find(t=>t.id===a.teamId)?.name||'Team':''}</small></div><strong>×{a.quantity||1}</strong></article>)}</div>}
 </div>;
}
