import React,{useMemo,useState} from 'react';
import {addItem,updateItem,deleteItem} from '../firebase/firestoreService';
import {useAuth} from '../firebase/auth';
import {Search,Plus,MessageCircle,Users,CalendarPlus,ArrowUpRight,Trash2,Phone,Filter,CheckCircle2} from 'lucide-react';

const STAGES=[['conversation','Conversation'],['follow_up','Follow-up'],['meeting_booked','Meeting booked'],['presented','Presented'],['converted','Joined team'],['parked','Parked']];
export default function PeoplePipelineView({prospects=[],teams=[],onAddActivity}){
 const {user}=useAuth();
 const [q,setQ]=useState('');
 const [stage,setStage]=useState('all');
 const [adding,setAdding]=useState(false);
 const [form,setForm]=useState({name:'',phone:'',source:'',teamId:'',notes:''});
 const [busy,setBusy]=useState(false);
 const visible=useMemo(()=>prospects.filter(p=>(stage==='all'||p.stage===stage)&&[p.name,p.phone,p.source,p.notes].some(v=>String(v||'').toLowerCase().includes(q.toLowerCase()))).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')),[prospects,stage,q]);
 const conversations=prospects.length;
 const create=async(e)=>{
  e.preventDefault();if(!form.name.trim())return;setBusy(true);
  try{
   const p=await addItem(user.uid,'prospects',{...form,name:form.name.trim(),stage:'conversation',createdAt:new Date().toISOString(),lastContact:new Date().toISOString().slice(0,10),conversations:1});
   await onAddActivity?.({type:'conversation',quantity:1,note:'First conversation with '+form.name.trim(),prospectId:p.id,teamId:form.teamId||''});
   setForm({name:'',phone:'',source:'',teamId:'',notes:''});setAdding(false);
  }finally{setBusy(false);}
 };
 const updateStage=async(p,next)=>{
  await updateItem(user.uid,'prospects',p.id,{stage:next,lastContact:new Date().toISOString().slice(0,10)});
  if(next==='meeting_booked')await onAddActivity?.({type:'meeting_booked',quantity:1,note:'Meeting booked with '+p.name,prospectId:p.id,teamId:p.teamId||''});
 };
 const logTalk=async(p)=>{
  await updateItem(user.uid,'prospects',p.id,{conversations:(p.conversations||1)+1,lastContact:new Date().toISOString().slice(0,10)});
  await onAddActivity?.({type:'conversation',quantity:1,note:'Follow-up conversation with '+p.name,prospectId:p.id,teamId:p.teamId||''});
 };
 const convert=async(p)=>{
  const teamId=p.teamId||teams[0]?.id;
  if(!teamId){alert('Create your teams first.');return;}
  if(!confirm('Add '+p.name+' as an IBO in '+(teams.find(t=>t.id===teamId)?.name||'the selected team')+'?'))return;
  await addItem(user.uid,'ibos',{name:p.name,phone:p.phone||'',teamId,prospectId:p.id,meetingAttended:false,bookingMade:false,businessActive:false,createdAt:new Date().toISOString()});
  await updateItem(user.uid,'prospects',p.id,{stage:'converted',teamId,convertedAt:new Date().toISOString()});
  await onAddActivity?.({type:'ibo_added',quantity:1,note:p.name+' joined '+(teams.find(t=>t.id===teamId)?.name||'a team'),prospectId:p.id,teamId});
 };
 return <div className="space-y-4">
  <section className="eagle-pipeline-hero"><div className="flex items-center gap-3"><div className="text-4xl">🗣️</div><div><p className="eagle-mini-label">YOUR NETWORK STARTS HERE</p><h1 className="text-2xl font-black">Every conversation counts.</h1><p className="text-xs text-slate-300">No limit. Keep meeting new people.</p></div></div><div className="mt-4 grid grid-cols-3 gap-2"><div><b>{prospects.length}</b><small>People</small></div><div><b>{prospects.filter(p=>p.stage==='meeting_booked').length}</b><small>Meetings</small></div><div><b>{prospects.filter(p=>p.stage==='converted').length}</b><small>Joined</small></div></div></section>
  <div className="flex gap-2"><div className="eagle-search flex-1"><Search size={16}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find a person…"/></div><button onClick={()=>setAdding(v=>!v)} className="eagle-primary-button"><Plus size={17}/> Add</button></div>
  {adding&&<form onSubmit={create} className="eagle-form"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="eagle-input"/><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone (optional)" className="eagle-input"/><input value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="Where did you meet?" className="eagle-input"/><select value={form.teamId} onChange={e=>setForm({...form,teamId:e.target.value})} className="eagle-input"><option value="">Potential team (optional)</option>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="A quick note…" className="eagle-input min-h-16"/><button disabled={busy} className="eagle-primary-button w-full justify-center">{busy?'Saving…':'Save person'}</button></form>}
  <div className="flex gap-2 overflow-x-auto pb-1">{[['all','All'],...STAGES].map(([id,label])=><button key={id} onClick={()=>setStage(id)} className={'eagle-filter '+(stage===id?'active':'')}>{label}</button>)}</div>
  {visible.length===0?<div className="eagle-empty"><span>🦅</span><b>Your network is waiting.</b><small>Add the first person you speak with.</small></div>:
   <div className="space-y-2">{visible.map(p=><article key={p.id} className="eagle-person-card"><div className="flex items-start gap-3"><div className="eagle-ibo-avatar">{p.name?.[0]?.toUpperCase()||'P'}</div><div className="min-w-0 flex-1"><b className="block truncate">{p.name}</b><small className="text-[10px] text-slate-400">{p.source||p.phone||'New contact'} · {p.conversations||1} conversations</small></div><span className="eagle-stage">{STAGES.find(x=>x[0]===p.stage)?.[1]||'Conversation'}</span></div>
    {p.notes&&<p className="mt-2 text-[11px] text-slate-400">{p.notes}</p>}
    <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={()=>logTalk(p)} className="eagle-secondary-button"><MessageCircle size={14}/> Log talk</button><select value={p.stage||'conversation'} onChange={e=>updateStage(p,e.target.value)} className="eagle-select">{STAGES.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></div>
    {p.stage!=='converted'&&p.stage!=='parked'&&<button onClick={()=>convert(p)} className="mt-2 w-full rounded-xl bg-amber-300/10 py-2.5 text-xs font-extrabold text-amber-200"><Users size={14} className="inline mr-1"/> Add as IBO to a team</button>}
    <div className="mt-2 text-right"><button onClick={()=>{if(confirm('Remove this contact?'))deleteItem(user.uid,'prospects',p.id)}} className="text-[10px] text-slate-600 hover:text-rose-300"><Trash2 size={12} className="inline mr-1"/>Remove</button></div>
   </article>)}</div>}
 </div>;
}
