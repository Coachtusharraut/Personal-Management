import React, { useMemo, useState } from 'react';
import { addItem, updateItem, deleteItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';
import { Target, HeartPulse, Mic2, Brain, BriefcaseBusiness, Wallet, Users, Plane, Plus, Check, ChevronDown, ChevronUp, Trash2, Sparkles, Swords, CalendarDays, ArrowUpRight } from 'lucide-react';

const SUGGESTIONS = [
  { title:'Empower 10,000 engineers to transform their health', category:'Mission & Impact', why:'Turn the Holistic Health for Engineers mission into measurable lives changed.', nextAction:'Define the first 100-person milestone and the channel to reach them.', milestones:['Define the measurable transformation outcome','Create a repeatable 30-day starter pathway','Build the first 100-engineer cohort','Document outcomes and referrals','Scale the system toward 10,000 engineers'] },
  { title:'Build ReshapeNation into a durable coaching ecosystem', category:'Business & Career', why:'Create a service business with excellent client outcomes, systems and ethical growth.', nextAction:'Review the current client journey and identify the biggest drop-off.', milestones:['Clarify flagship offer and ideal client','Document client onboarding and delivery','Build a referral and partner system','Create a repeatable content-to-consultation process','Develop a small reliable delivery team'] },
  { title:'Reach ₹10 lakh/month personal income', category:'Wealth & Finance', why:'A stated long-term financial ambition; set realistic milestones from verified income and margins.', nextAction:'Record current monthly revenue, expenses and personal take-home baseline.', milestones:['Establish verified baseline and runway','Set monthly revenue and margin targets','Build predictable acquisition channels','Increase delivery capacity without lowering quality','Review personal income and savings every month'] },
  { title:'Become an exceptional speaker and storyteller', category:'Speaking & Influence', why:'Develop a voice that teaches, moves people and creates meaningful opportunities.', nextAction:'Record a three-minute story and review clarity, emotion and structure.', milestones:['Build a bank of 20 true personal stories','Practise one short talk every week','Deliver five small-room talks','Collect feedback and refine signature stories','Earn larger stages through consistent proof'] },
  { title:'Master AI, technology and digital health creation', category:'Learning & Innovation', why:'Use engineering thinking and AI to build practical tools that improve health and life.', nextAction:'Choose one small product experiment and define its success test.', milestones:['Maintain a focused learning backlog','Ship one small working prototype','Test it with real users','Measure usefulness and reliability','Build a sustainable product roadmap'] },
  { title:'Build strength, vitality and lifelong health', category:'Health & Fitness', why:'Protect energy and physical capability through training, sleep, recovery and nourishment.', nextAction:'Set a realistic weekly movement and recovery baseline.', milestones:['Set baseline strength and mobility markers','Build a sustainable training rhythm','Improve sleep regularity','Track energy and recovery weekly','Repeat a quarterly health review'] },
  { title:'Deepen relationships, community and contribution', category:'People & Relationships', why:'Create a life that includes presence, trust, generosity and shared experiences.', nextAction:'Schedule one meaningful conversation or family activity.', milestones:['Define the relationships to nurture','Create a recurring connection ritual','Reconnect with mentors and collaborators','Plan meaningful shared experiences'] },
  { title:'Explore the world and build a life of experiences', category:'Experiences & Freedom', why:'Make room for travel, nature, curiosity and time autonomy alongside meaningful work.', nextAction:'Write one experience you want to create this quarter.', milestones:['Create an experiences wish list','Plan one local adventure','Plan one multi-day trip','Protect time for rest and exploration'] }
];

const CATEGORIES=['All','Mission & Impact','Business & Career','Wealth & Finance','Speaking & Influence','Learning & Innovation','Health & Fitness','People & Relationships','Experiences & Freedom'];
const CATEGORY_ICON={'Mission & Impact':Target,'Business & Career':BriefcaseBusiness,'Wealth & Finance':Wallet,'Speaking & Influence':Mic2,'Learning & Innovation':Brain,'Health & Fitness':HeartPulse,'People & Relationships':Users,'Experiences & Freedom':Plane};

function progressOf(goal){const ms=goal.milestones||[];if(ms.length)return Math.round(ms.filter(m=>m.done).length/ms.length*100);return Math.max(0,Math.min(100,Number(goal.progress)||0));}

export default function CareerGrowthView({goals=[],missionState,onAddQuest,onNavigate}){
 const {user}=useAuth();
 const [filter,setFilter]=useState('All');
 const [showCreate,setShowCreate]=useState(false);
 const [expanded,setExpanded]=useState('');
 const [draft,setDraft]=useState({title:'',category:'Business & Career',why:'',targetDate:'',nextAction:''});
 const [actionDraft,setActionDraft]=useState({});
 const xp=missionState?.userLevel?.currentXp||0;
 const level=missionState?.userLevel?.level||1;
 const existingTitles=new Set(goals.map(g=>(g.title||'').toLowerCase()));
 const suggestions=SUGGESTIONS.filter(s=>!existingTitles.has(s.title.toLowerCase()));
 const visible=filter==='All'?goals:goals.filter(g=>g.category===filter);
 const totalProgress=goals.length?Math.round(goals.reduce((n,g)=>n+progressOf(g),0)/goals.length):0;

 const createGoal=async(values)=>{
   if(!user||!values.title.trim())return;
   await addItem(user.uid,'goals',{title:values.title.trim(),category:values.category,why:values.why,targetDate:values.targetDate||'',nextAction:values.nextAction||'',progress:0,status:'active',milestones:[],createdFromSuggestion:false});
 };
 const addSuggestion=async(s)=>{
   await addItem(user.uid,'goals',{title:s.title,category:s.category,why:s.why,nextAction:s.nextAction,targetDate:'',progress:0,status:'active',milestones:s.milestones.map((title,i)=>({id:'m-'+Date.now()+'-'+i,title,done:false})),createdFromSuggestion:true});
 };
 const toggleMilestone=async(goal,milestoneId)=>{
   const milestones=(goal.milestones||[]).map(m=>m.id===milestoneId?{...m,done:!m.done}:m);
   const progress=milestones.length?Math.round(milestones.filter(m=>m.done).length/milestones.length*100):goal.progress||0;
   await updateItem(user.uid,'goals',goal.id,{milestones,progress});
 };
 const saveAction=async(goal)=>{
   await updateItem(user.uid,'goals',goal.id,{nextAction:actionDraft[goal.id]??goal.nextAction??''});
   setExpanded('');
 };
 const createQuest=(goal)=>{
   if(!goal.nextAction)return;
   onAddQuest?.({title:goal.nextAction,description:'Next action for goal: '+goal.title,category:goal.category||'Personal Growth',tier:'top3',priority:'high',durationMins:30,xp:100});
 };

 return <div className="space-y-7 animate-fadeIn">
   <section className="relative overflow-hidden rounded-[28px] border border-amber-400/20 bg-gradient-to-br from-[#172944] via-[#0b1425] to-[#1d1a2b] p-6 sm:p-8">
    <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl"/>
    <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-5">
     <div><span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200"><Swords size={14}/> Your path · Goals & career</span>
      <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-white">Choose the summit.<br/><span className="text-amber-300">Win the next step.</span></h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Connect your lifetime direction to milestones, next actions and daily quests. Suggestions below are editable starting points, not assumptions about your current commitments.</p>
     </div>
     <div className="grid grid-cols-2 gap-2 min-w-[210px]">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400">Warrior level</p><p className="text-3xl font-black text-amber-200">{level}</p></div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-[10px] uppercase tracking-wider text-slate-400">Earned XP</p><p className="text-3xl font-black text-white">{xp.toLocaleString('en-IN')}</p></div>
     </div>
    </div>
   </section>

   <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <div className="glass-card rounded-2xl p-4"><p className="text-xs text-slate-400">Active goals</p><p className="mt-1 text-2xl font-black text-white">{goals.filter(g=>g.status!=='archived').length}</p></div>
    <div className="glass-card rounded-2xl p-4"><p className="text-xs text-slate-400">Average milestone progress</p><p className="mt-1 text-2xl font-black text-amber-300">{totalProgress}%</p><div className="mt-2 h-1.5 rounded-full bg-slate-800"><div className="h-full rounded-full bg-amber-400" style={{width:totalProgress+'%'}}/></div></div>
    <div className="glass-card rounded-2xl p-4"><p className="text-xs text-slate-400">Mission connection</p><p className="mt-1 text-sm font-bold text-emerald-300">Purpose → milestone → quest</p><p className="mt-1 text-[11px] text-slate-500">Turn each goal's next action into today's mission.</p></div>
   </section>

   <section className="rounded-3xl border border-amber-400/15 bg-[#101b2c] p-5 sm:p-6 space-y-4">
    <div className="flex items-center justify-between gap-3"><div><div className="text-xs font-bold uppercase tracking-wider text-amber-300">Daily War Council</div><h2 className="mt-1 text-xl font-black text-white">Decide how today will be won</h2></div><span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-200">3 priorities</span></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
     {['The one mission that moves my future','The brave conversation or action I will not avoid','The practice that protects my health and energy'].map((q,i)=><div key={q} className="rounded-2xl border border-white/10 bg-[#081323] p-3"><p className="text-[10px] uppercase text-slate-500">Council {i+1}</p><p className="mt-1 text-sm font-semibold text-slate-200">{q}</p></div>)}
    </div>
    <p className="text-xs text-slate-400">Pick a goal below and turn its next action into a top-three quest.</p>
   </section>

   <section className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"><div><h2 className="text-xl font-extrabold text-white">Your active goals</h2><p className="text-xs text-slate-400 mt-1">Milestones and progress are stored in your private account.</p></div><button onClick={()=>setShowCreate(!showCreate)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-2.5 text-xs font-extrabold text-[#091a35]"><Plus size={16}/> Create a goal</button></div>
    {showCreate&&<form onSubmit={async e=>{e.preventDefault();await createGoal(draft);setDraft({title:'',category:'Business & Career',why:'',targetDate:'',nextAction:''});setShowCreate(false)}} className="rounded-2xl border border-amber-400/20 bg-[#101b2c] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
     <input required placeholder="Goal title" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} className="sm:col-span-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/>
     <select value={draft.category} onChange={e=>setDraft({...draft,category:e.target.value})} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white">{CATEGORIES.slice(1).map(c=><option key={c}>{c}</option>)}</select>
     <input type="date" value={draft.targetDate} onChange={e=>setDraft({...draft,targetDate:e.target.value})} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/>
     <textarea placeholder="Why does this matter?" value={draft.why} onChange={e=>setDraft({...draft,why:e.target.value})} className="sm:col-span-2 min-h-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/>
     <input placeholder="Next action" value={draft.nextAction} onChange={e=>setDraft({...draft,nextAction:e.target.value})} className="sm:col-span-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/>
     <div className="sm:col-span-2 flex justify-end gap-2"><button type="button" onClick={()=>setShowCreate(false)} className="rounded-xl bg-slate-800 px-4 py-2 text-xs text-slate-300">Cancel</button><button className="rounded-xl bg-amber-300 px-4 py-2 text-xs font-black text-[#091a35]">Save goal</button></div>
    </form>}
    <div className="flex gap-2 overflow-x-auto pb-1">{CATEGORIES.map(c=><button key={c} onClick={()=>setFilter(c)} className={'shrink-0 rounded-full px-3 py-2 text-[11px] font-bold border '+(filter===c?'bg-amber-300 text-[#091a35] border-amber-300':'bg-slate-900 text-slate-400 border-slate-700')}>{c}</button>)}</div>
    {visible.length===0?<div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center"><Target className="mx-auto text-slate-500"/><p className="mt-2 text-sm font-bold text-slate-200">No goals in this view yet</p><p className="mt-1 text-xs text-slate-500">Add one of the suggestions below or create a goal.</p></div>:<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">{visible.map(goal=>{const Icon=CATEGORY_ICON[goal.category]||Target;const progress=progressOf(goal);const isOpen=expanded===goal.id;return <article key={goal.id} className="rounded-3xl border border-slate-800 bg-[#0c1728] p-5 shadow-xl">
      <div className="flex items-start gap-3"><div className="rounded-xl bg-amber-300/10 p-3 text-amber-300"><Icon size={21}/></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{goal.category||'Personal goal'}</p><h3 className="mt-1 text-base font-extrabold text-white">{goal.title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-400">{goal.why||goal.description||'Define why this goal matters to you.'}</p></div><button title="Archive goal" onClick={()=>updateItem(user.uid,'goals',goal.id,{status:goal.status==='archived'?'active':'archived'})} className="rounded-lg p-2 text-slate-500 hover:bg-slate-800 hover:text-white text-[10px]">{goal.status==='archived'?'Restore':'Archive'}</button></div>
      <div className="mt-5"><div className="flex justify-between text-[11px] font-bold"><span className="text-slate-400">Milestone progress</span><span className="text-amber-300">{progress}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all" style={{width:progress+'%'}}/></div></div>
      {!!goal.targetDate&&<p className="mt-3 text-[11px] text-slate-500 flex items-center gap-1"><CalendarDays size={13}/> Target: {new Date(goal.targetDate+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>}
      {goal.nextAction&&<div className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Next action</p><p className="mt-1 text-xs text-slate-200">{goal.nextAction}</p></div>}
      {goal.milestones?.length>0&&<div className="mt-4 space-y-2"><p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Milestones</p>{goal.milestones.map((m,i)=><button key={m.id||i} onClick={()=>toggleMilestone(goal,m.id)} className="flex w-full items-center gap-2 text-left text-xs"><span className={'grid h-5 w-5 place-items-center rounded-md border '+(m.done?'bg-emerald-400 border-emerald-400 text-[#07101e]':'border-slate-600 text-slate-500')}>{m.done?<Check size={13}/>:null}</span><span className={m.done?'text-slate-500 line-through':'text-slate-300'}>{m.title||m.text}</span></button>)}</div>}
      <div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>{setExpanded(isOpen?'':goal.id);setActionDraft({...actionDraft,[goal.id]:goal.nextAction||''})}} className="flex items-center gap-1 rounded-xl bg-slate-800 px-3 py-2 text-[11px] font-bold text-slate-200">{isOpen?'Close editor':'Edit next action'}{isOpen?<ChevronUp size={13}/>:<ChevronDown size={13}/>}</button><button disabled={!goal.nextAction} onClick={()=>createQuest(goal)} className="flex items-center gap-1 rounded-xl bg-amber-300 px-3 py-2 text-[11px] font-black text-[#091a35] disabled:opacity-40"><Sparkles size={13}/> Turn into quest</button><button onClick={()=>{if(confirm('Delete this goal and its milestones?'))deleteItem(user.uid,'goals',goal.id)}} className="ml-auto rounded-xl p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"><Trash2 size={14}/></button></div>
      {isOpen&&<div className="mt-3 flex gap-2"><input value={actionDraft[goal.id]??''} onChange={e=>setActionDraft({...actionDraft,[goal.id]:e.target.value})} placeholder="Write the next visible action…" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"/><button onClick={()=>saveAction(goal)} className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-[#07101e]">Save</button></div>}
    </article>})}</div>}
   </section>

   <section className="space-y-4"><div><h2 className="text-xl font-extrabold text-white">Suggested life tracks</h2><p className="text-xs text-slate-400 mt-1">Choose only the goals that genuinely matter now. Every suggestion can be edited after adding.</p></div><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{suggestions.map(s=>{const Icon=CATEGORY_ICON[s.category]||Target;return <article key={s.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"><div className="flex items-center justify-between"><span className="rounded-xl bg-slate-800 p-2 text-amber-300"><Icon size={17}/></span><span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Starting suggestion</span></div><h3 className="mt-3 text-sm font-bold text-white">{s.title}</h3><p className="mt-2 text-xs text-slate-400 leading-relaxed">{s.why}</p><button onClick={()=>addSuggestion(s)} className="mt-4 flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-[11px] font-bold text-amber-200"><Plus size={13}/> Add this track</button></article>})}</div></section>
 </div>;
}
