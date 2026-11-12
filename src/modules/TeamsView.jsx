import React,{useMemo,useState,useEffect} from 'react';
import {addItem,updateItem,deleteItem} from '../firebase/firestoreService';
import {useAuth} from '../firebase/auth';
import {ArrowLeft,Plus,Check,Users,Target,Trash2,ChevronDown,ChevronUp,Star,Save,UserPlus} from 'lucide-react';
import {celebrateEagle} from '../utils/eagleEffects';

export default function TeamsView({teams=[],ibos=[],onAddActivity,initialTeamId=null}){
 const {user}=useAuth();
 const [selected,setSelected]=useState(initialTeamId||'');
 const [showAdd,setShowAdd]=useState(false);
 const [name,setName]=useState('');
 const [phone,setPhone]=useState('');
 const [percentDraft,setPercentDraft]=useState({});
 const [saving,setSaving]=useState(false);
 useEffect(()=>{setSelected(initialTeamId||'');},[initialTeamId]);
 const active=teams.find(t=>t.id===selected);
 const members=ibos.filter(x=>x.teamId===selected);
 const coreCount=members.filter(x=>x.meetingAttended&&x.bookingMade&&x.businessActive).length;
 const totals=useMemo(()=>teams.map(t=>({team:t,members:ibos.filter(x=>x.teamId===t.id),core:ibos.filter(x=>x.teamId===t.id&&x.meetingAttended&&x.bookingMade&&x.businessActive).length})),[teams,ibos]);
 const handleAdd=async(e)=>{
  e.preventDefault();if(!name.trim())return;
  setSaving(true);
  try{await addItem(user.uid,'ibos',{name:name.trim(),phone:phone.trim(),teamId:selected,meetingAttended:false,bookingMade:false,businessActive:false,createdAt:new Date().toISOString()});
   await onAddActivity?.({type:'ibo_added',quantity:1,teamId:selected,note:'Added '+name.trim()+' to '+(active?.name||'team')});
   setName('');setPhone('');setShowAdd(false);
  }finally{setSaving(false);}
 };
 const updateFlag=async(ibo,key,value)=>{
  const after={...ibo,[key]:value};
  const becameCore=after.meetingAttended&&after.bookingMade&&after.businessActive&&! (ibo.meetingAttended&&ibo.bookingMade&&ibo.businessActive);
  const stoppedCore=!after.meetingAttended||!after.bookingMade||!after.businessActive;
  if(becameCore)celebrateEagle('win');
  else if(stoppedCore&&ibo.meetingAttended&&ibo.bookingMade&&ibo.businessActive)celebrateEagle('miss');
  await updateItem(user.uid,'ibos',ibo.id,after);
  if(becameCore)await onAddActivity?.({type:'core_ibo_qualified',quantity:1,teamId:selected,note:after.name+' became a Core IBO'});
 };
 const savePercent=async(team)=>{
  const n=Number(percentDraft[team.id]??team.percentage??0);
  if(n>=3&&Number(team.percentage||0)<3)celebrateEagle('win');
  if(n<3&&Number(team.percentage||0)>=3)celebrateEagle('miss');
  await updateItem(user.uid,'teams',team.id,{percentage:n});
 };
 if(!active)return <div className="space-y-4">
  <div className="eagle-page-heading"><span className="eagle-heading-icon">🪶</span><div><p>THE SIX WINGS</p><h1>Build your teams</h1><small>10 Core IBOs · 3%+ in each leg</small></div></div>
  <div className="grid grid-cols-2 gap-3">{totals.map(({team,core,members},i)=><button key={team.id} onClick={()=>setSelected(team.id)} className={'eagle-team-card team-'+(i+1)}>
   <div className="flex items-center justify-between"><span className="text-3xl">🦅</span><span className={'eagle-percent '+(Number(team.percentage)>=3?'qualified':'')}>{Number(team.percentage||0).toFixed(1)}%</span></div>
   <b>{team.name||'Team '+team.index}</b><div className="mt-2 h-2 rounded-full bg-black/25 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-emerald-300" style={{width:Math.min(100,core/10*100)+'%'}}/></div>
   <div className="mt-1 flex justify-between text-[10px] text-slate-300"><span>{core}/10 Core</span><span>{members.length} IBOs</span></div>
   <span className="mt-3 flex items-center gap-1 text-[10px] font-bold text-amber-200">Open wing <ChevronDown size={13}/></span>
  </button>)}</div>
  <div className="eagle-tip"><Target size={19}/><span>Core IBO = meeting attended + booking made + business activity completed.</span></div>
 </div>;

 return <div className="space-y-4">
  <button onClick={()=>setSelected('')} className="eagle-back"><ArrowLeft size={17}/> All six teams</button>
  <section className="eagle-team-detail">
   <div className="flex items-center justify-between gap-3"><div><p className="eagle-mini-label">YOUR WING</p><h1 className="text-2xl font-black">{active.name}</h1><p className="text-xs text-slate-300">Build the next 10 Core IBOs.</p></div><div className="text-5xl">🦅</div></div>
   <div className="mt-4 flex items-end justify-between"><div><span className="text-4xl font-black">{coreCount}</span><span className="ml-1 text-sm text-slate-300">/ 10 Core IBOs</span></div><span className={'eagle-percent '+(coreCount>=10?'qualified':'')}>{coreCount>=10?'TARGET HIT':'IN PROGRESS'}</span></div>
   <div className="eagle-progress-track mt-2"><div style={{width:Math.min(100,coreCount*10)+'%'}}/></div>
   <div className="mt-4 flex items-center gap-2"><label className="text-xs font-bold text-slate-200">Leg percentage</label><input type="number" min="0" max="100" step=".1" value={percentDraft[active.id]??active.percentage??0} onChange={e=>setPercentDraft({...percentDraft,[active.id]:e.target.value})} className="w-24 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-lg font-black text-white"/><span className="text-sm text-amber-200">%</span><button onClick={()=>savePercent(active)} className="ml-auto rounded-xl bg-amber-300 px-3 py-2 text-xs font-black text-[#1d1a12]"><Save size={14} className="inline mr-1"/> Save</button></div>
   <p className="mt-2 text-[10px] text-slate-400">{Number(active.percentage||0)>=3?'🎉 3%+ achieved in this wing!':'Target: 3%+ to qualify this wing.'}</p>
  </section>
  <div className="flex items-center justify-between"><div><h2 className="text-lg font-black">Your IBOs</h2><p className="text-[10px] text-slate-400">Tick the three actions to qualify Core.</p></div><button onClick={()=>setShowAdd(v=>!v)} className="eagle-primary-button"><UserPlus size={16}/> Add IBO</button></div>
  {showAdd&&<form onSubmit={handleAdd} className="eagle-form"><input required value={name} onChange={e=>setName(e.target.value)} placeholder="IBO name" className="eagle-input"/><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone (optional)" className="eagle-input"/><button disabled={saving} className="eagle-primary-button w-full justify-center">{saving?'Adding…':'Add to this team'}</button></form>}
  {members.length===0?<div className="eagle-empty"><span>🪺</span><b>Your first IBO starts this wing.</b><small>Add the first person when they're ready.</small></div>:
   <div className="space-y-2">{members.map((ibo,i)=>{
    const isCore=ibo.meetingAttended&&ibo.bookingMade&&ibo.businessActive;
    return <article key={ibo.id} className={'eagle-ibo-card '+(isCore?'is-core':'')}>
     <div className="flex items-center gap-3"><div className="eagle-ibo-avatar">{ibo.name?.[0]?.toUpperCase()||'I'}</div><div className="min-w-0 flex-1"><b className="block truncate text-sm">{ibo.name}</b><small className="text-[10px] text-slate-400">{ibo.phone||'Core IBO tracker'}</small></div><span className={'eagle-core-badge '+(isCore?'active':'')}>{isCore?'🦅 CORE':'BUILDING'}</span></div>
     <div className="eagle-ibo-checks">
      <label><input type="checkbox" checked={!!ibo.meetingAttended} onChange={e=>updateFlag(ibo,'meetingAttended',e.target.checked)}/><span>Meeting</span></label>
      <label><input type="checkbox" checked={!!ibo.bookingMade} onChange={e=>updateFlag(ibo,'bookingMade',e.target.checked)}/><span>Booking</span></label>
      <label><input type="checkbox" checked={!!ibo.businessActive} onChange={e=>updateFlag(ibo,'businessActive',e.target.checked)}/><span>Business</span></label>
     </div>
     <div className="flex justify-end"><button onClick={()=>{if(confirm('Remove '+ibo.name+' from this tracker?'))deleteItem(user.uid,'ibos',ibo.id)}} className="text-[10px] text-slate-500 hover:text-rose-300"><Trash2 size={13} className="inline mr-1"/>Remove</button></div>
    </article>
   })}</div>}
 </div>;
}
