import React, { useMemo, useState } from 'react';
import { addItem, deleteItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';
import { BookOpen, Sword, Shield, Flame, Sparkles, Crown, Mic2, Plus, Trash2, Trophy, ScrollText, Heart, Target } from 'lucide-react';

const CHAPTERS=[
 {title:'The Call to Dharma',threshold:0,world:'Arjuna · The Mahabharata',lesson:'Before the battle begins, the warrior must decide what deserves their effort.',scene:'The chariot stops between two armies. Noise rises on both sides. The question is no longer who is watching; it is what is worth doing.'},
 {title:'The Chariot of Clarity',threshold:150,world:'Krishna · The Bhagavad Gita',lesson:'Clarity turns scattered energy into purposeful action.',scene:'The charioteer does not remove the challenge. He helps the archer see it clearly and choose the next right action.'},
 {title:'The First Battle: Discipline',threshold:500,world:'The Warrior’s Path',lesson:'A promise kept in private builds more strength than applause received in public.',scene:'No crowd is present. The practice ground is quiet. Today’s small repetition is the first arrow released.'},
 {title:'The Bridge of Small Actions',threshold:1200,world:'Rama · The Ramayana',lesson:'A great bridge is built stone by stone, with many hands and steady faith.',scene:'The ocean seems impossible to cross. Each stone is small, yet every contribution moves the mission forward.'},
 {title:'The Return of the Hero',threshold:2500,world:'Bhagavata · Service and wisdom',lesson:'Victory is not merely defeating a shadow; it is returning with greater wisdom and serving others.',scene:'The warrior returns not to boast, but to build, teach and protect what matters.'}
];

const SHADOWS=[
 {id:'procrastination',name:'Procrastination',desc:'The voice that says “later”.',action:'Complete a 15-minute starter task you have been delaying.',icon:'⌛'},
 {id:'distraction',name:'Distraction',desc:'A thousand targets competing for your attention.',action:'Take one 25-minute focus block with notifications off.',icon:'🌀'},
 {id:'fear',name:'Fear of judgment',desc:'The imagined audience that keeps your voice small.',action:'Record and share one honest 60-second idea.',icon:'🎭'},
 {id:'inconsistency',name:'Inconsistency',desc:'The belief that one missed day means the run is over.',action:'Restart with one small repeatable action today.',icon:'🌱'},
 {id:'self-doubt',name:'Self-doubt',desc:'Old conclusions pretending to be permanent facts.',action:'Write one piece of evidence that you have grown, then take the next step.',icon:'🌑'},
 {id:'jp',name:'JP Sir · Echo of doubt',desc:'A remembered voice in your story, not a judgement about the person.',action:'Do one piece of excellent work that meets your own standard.',icon:'🛡️'},
 {id:'grandpa',name:'Grandpa · Echo of doubt',desc:'A remembered voice in your story, not a judgement about the person.',action:'Choose one brave action aligned with the person you want to become.',icon:'🧭'},
 {id:'sourabh',name:'Sourabh · Echo of doubt',desc:'A remembered voice in your story, not a judgement about the person.',action:'Build one visible proof of progress through consistent effort.',icon:'⚔️'}
];

const PROMPTS=[
 'Tell the story of a time you were underestimated—and what you did next.',
 'Explain one health lesson that changed how you live, using a simple Indian-life analogy.',
 'Describe a failure that became a turning point. What did you learn?',
 'Tell a story about a client or person whose small habit created a meaningful change.',
 'Explain a complex idea as if you were speaking to a curious 15-year-old.',
 'Describe a moment when discipline mattered more than motivation.'
];

export default function StoryForgeView({missionState,stories=[],onAddQuest}){
 const {user}=useAuth();
 const xp=missionState?.userLevel?.currentXp||0;
 const [mode,setMode]=useState('journey');
 const [draft,setDraft]=useState({title:'',scene:'',conflict:'',turningPoint:'',lesson:'',audience:'',type:'story'});
 const [saving,setSaving]=useState(false);
 const unlocked=CHAPTERS.filter(c=>xp>=c.threshold);
 const next=CHAPTERS.find(c=>xp<c.threshold);
 const completedQuests=(missionState?.dailyQuests||[]).filter(q=>q.completed).length;

 const saveStory=async(e)=>{
  e.preventDefault();if(!user||!draft.title.trim()||!draft.lesson.trim())return;
  setSaving(true);
  try{await addItem(user.uid,'stories',{...draft,createdAt:new Date().toISOString(),date:new Date().toISOString().slice(0,10)});setDraft({title:'',scene:'',conflict:'',turningPoint:'',lesson:'',audience:'',type:'story'});setMode('vault');}
  finally{setSaving(false);}
 };
 const challenge=(shadow)=>{
  onAddQuest?.({title:shadow.action,description:'Shadow encounter: '+shadow.name+'. Victory is measured by your own action, not by anyone else’s opinion.',category:'Personal Growth',tier:'growth_challenge',priority:'high',durationMins:15,xp:100});
  setMode('journey');
 };
 const usePrompt=(p)=>{setDraft(d=>({...d,title:p,type:'speech'}));setMode('write');};
 const recent=[...stories].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,12);

 return <div className="space-y-7 animate-fadeIn">
  <section className="relative overflow-hidden rounded-[28px] border border-amber-300/20 bg-gradient-to-br from-[#1c2a45] via-[#0a1425] to-[#24172b] p-6 sm:p-8">
   <div className="absolute -right-12 -top-16 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl"/>
   <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-5">
    <div><span className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-200"><ScrollText size={14}/> The Chronicle of Becoming</span>
     <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white">Your life is the story.<br/><span className="text-amber-300">Your actions write it.</span></h1>
     <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">An original, respectful hero’s journey inspired by the Mahabharata, Bhagavad Gita, Ramayana and Bhagavata. Mythic stories offer perspective; your real behaviour determines your progress.</p>
    </div>
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 min-w-[160px]"><p className="text-[10px] uppercase tracking-wider text-slate-400">Your earned XP</p><p className="text-3xl font-black text-amber-200">{xp.toLocaleString('en-IN')}</p><p className="text-[11px] text-slate-400 mt-1">{completedQuests} daily quests completed</p></div>
   </div>
  </section>
  <div className="flex flex-wrap gap-2">{[{id:'journey',label:'Hero’s Journey',icon:BookOpen},{id:'shadows',label:'Shadow Battles',icon:Shield},{id:'write',label:'Story & Speech Forge',icon:Mic2},{id:'vault',label:'My Story Vault',icon:ScrollText}].map(x=>{const I=x.icon;return <button key={x.id} onClick={()=>setMode(x.id)} className={'inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold '+(mode===x.id?'bg-amber-300 text-[#091a35] border-amber-300':'bg-slate-900 text-slate-400 border-slate-700') }><I size={14}/>{x.label}</button>})}</div>

  {mode==='journey'&&<section className="space-y-4">
   <div><h2 className="text-xl font-extrabold text-white">Campaign map</h2><p className="text-xs text-slate-400 mt-1">Chapters unlock through XP earned from actual quests and habits. No progress is pre-awarded.</p></div>
   <div className="relative space-y-3">{CHAPTERS.map((c,i)=>{const open=xp>=c.threshold;return <article key={c.title} className={'relative rounded-2xl border p-5 '+(open?'border-amber-300/25 bg-gradient-to-r from-[#17263b] to-[#101829]':'border-slate-800 bg-slate-900/50 opacity-70')}><div className="flex items-start gap-4"><div className={'grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl '+(open?'bg-amber-300 text-[#091a35]':'bg-slate-800 text-slate-500')}>{open?['🏹','🛞','🔥','🌉','👑'][i]:'🔒'}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">{c.world}</span><span className="text-[10px] text-slate-500">· {c.threshold.toLocaleString('en-IN')} XP to unlock</span></div><h3 className="mt-1 text-base font-extrabold text-white">{i+1}. {c.title}</h3><p className="mt-2 text-xs text-slate-300 leading-relaxed">{open?c.scene:'This chapter opens after you earn more experience through real-world action.'}</p>{open&&<div className="mt-3 rounded-xl bg-emerald-400/5 border border-emerald-400/15 p-3"><p className="text-[10px] uppercase font-bold text-emerald-300">Wisdom to carry</p><p className="mt-1 text-xs text-slate-200">{c.lesson}</p></div>}</div><span className={'text-[10px] font-bold rounded-full px-2 py-1 '+(open?'bg-emerald-400/10 text-emerald-300':'bg-slate-800 text-slate-500')}>{open?'Unlocked':'Locked'}</span></div></article>})}</div>
   {next&&<p className="text-xs text-amber-200/80">Next chapter: {next.title} · {Math.max(0,next.threshold-xp).toLocaleString('en-IN')} XP remaining.</p>}
  </section>}

  {mode==='shadows'&&<section className="space-y-4">
   <div className="rounded-2xl border border-rose-300/15 bg-rose-300/5 p-4"><p className="text-sm font-bold text-rose-200">The enemy is the pattern—not the person.</p><p className="mt-1 text-xs leading-relaxed text-slate-300">JP Sir, Grandpa and Sourabh are included only as remembered voices from your story. LifeOS cannot know their present beliefs or compare your progress with theirs. Every battle is about your own courage, consistency and self-respect—not revenge.</p></div>
   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">{SHADOWS.map(sh=> <article key={sh.id} className="rounded-2xl border border-slate-800 bg-[#0d192b] p-4"><div className="flex items-center justify-between"><span className="text-2xl">{sh.icon}</span><span className="text-[9px] uppercase tracking-wider text-slate-500">Boss encounter</span></div><h3 className="mt-3 text-sm font-extrabold text-white">{sh.name}</h3><p className="mt-1 text-xs text-slate-400">{sh.desc}</p><div className="mt-3 rounded-xl bg-slate-950/70 p-3"><p className="text-[10px] uppercase font-bold text-amber-300">Victory condition</p><p className="mt-1 text-xs text-slate-200">{sh.action}</p></div><button onClick={()=>challenge(sh)} className="mt-3 w-full rounded-xl bg-amber-300 py-2.5 text-xs font-black text-[#091a35] flex items-center justify-center gap-2"><Sword size={14}/> Accept challenge · +100 XP</button></article>)}</div>
  </section>}

  {mode==='write'&&<section className="grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-4">
   <div className="rounded-2xl border border-violet-300/15 bg-violet-300/5 p-5 space-y-3"><div className="flex items-center gap-2 text-violet-200 font-bold"><Mic2 size={17}/> Storytelling practice</div><p className="text-xs text-slate-400">Choose a prompt, then shape it into a clear story with a scene, conflict, turning point and lesson.</p>{PROMPTS.map(p=><button key={p} onClick={()=>usePrompt(p)} className="w-full text-left rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-200 hover:border-violet-300/40">{p}</button>)}</div>
   <form onSubmit={saveStory} className="rounded-2xl border border-slate-800 bg-[#0e1a2b] p-5 space-y-3">
    <div className="flex gap-2"><button type="button" onClick={()=>setDraft({...draft,type:'story'})} className={'rounded-lg px-3 py-2 text-[11px] font-bold '+(draft.type==='story'?'bg-violet-300 text-slate-950':'bg-slate-800 text-slate-300')}>Personal story</button><button type="button" onClick={()=>setDraft({...draft,type:'speech'})} className={'rounded-lg px-3 py-2 text-[11px] font-bold '+(draft.type==='speech'?'bg-violet-300 text-slate-950':'bg-slate-800 text-slate-300')}>Speech practice</button><button type="button" onClick={()=>setDraft({...draft,type:'journal'})} className={'rounded-lg px-3 py-2 text-[11px] font-bold '+(draft.type==='journal'?'bg-violet-300 text-slate-950':'bg-slate-800 text-slate-300')}>Daily reflection</button></div>
    <input required value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} placeholder="Story title / prompt" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/>
    <textarea value={draft.scene} onChange={e=>setDraft({...draft,scene:e.target.value})} placeholder="1. Scene — where were you, what was happening?" className="w-full min-h-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-white"/>
    <textarea value={draft.conflict} onChange={e=>setDraft({...draft,conflict:e.target.value})} placeholder="2. Conflict — what challenge, doubt or obstacle appeared?" className="w-full min-h-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-white"/>
    <textarea value={draft.turningPoint} onChange={e=>setDraft({...draft,turningPoint:e.target.value})} placeholder="3. Turning point — what choice or action changed the direction?" className="w-full min-h-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-white"/>
    <textarea required value={draft.lesson} onChange={e=>setDraft({...draft,lesson:e.target.value})} placeholder="4. Lesson — what should the listener remember?" className="w-full min-h-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-white"/>
    <input value={draft.audience} onChange={e=>setDraft({...draft,audience:e.target.value})} placeholder="Who is this story for? (optional)" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-xs text-white"/>
    <button disabled={saving} className="w-full rounded-xl bg-violet-300 py-3 text-xs font-black text-[#12112a] disabled:opacity-50"><Plus size={14} className="inline mr-2"/>{saving?'Saving…':'Save to My Story Vault'}</button>
   </form>
  </section>}

  {mode==='vault'&&<section className="space-y-4"><div><h2 className="text-xl font-extrabold text-white">My Story Vault</h2><p className="text-xs text-slate-400 mt-1">Your lived experiences become material for talks, coaching, writing and future chapters.</p></div>{recent.length===0?<div className="rounded-2xl border border-dashed border-slate-700 p-9 text-center"><ScrollText className="mx-auto text-slate-500"/><p className="mt-2 text-sm font-bold text-white">Your first story is waiting</p><button onClick={()=>setMode('write')} className="mt-3 rounded-xl bg-violet-300 px-4 py-2 text-xs font-bold text-slate-950">Write your first story</button></div>:<div className="grid grid-cols-1 md:grid-cols-2 gap-3">{recent.map(item=><article key={item.id} className="rounded-2xl border border-slate-800 bg-[#0d192b] p-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-wider text-violet-300 font-bold">{item.type||'story'} · {item.date||''}</span><button onClick={()=>{if(confirm('Delete this story?'))deleteItem(user.uid,'stories',item.id)}} className="text-slate-500 hover:text-rose-300"><Trash2 size={14}/></button></div><h3 className="mt-2 font-bold text-white">{item.title}</h3>{item.scene&&<p className="mt-2 text-xs leading-relaxed text-slate-400">{item.scene}</p>}<div className="mt-3 border-l-2 border-amber-300/60 pl-3"><p className="text-[10px] font-bold uppercase text-amber-300">Lesson</p><p className="mt-1 text-xs text-slate-200">{item.lesson}</p></div></article>)}</div>}</section>}
 </div>;
}
