import React, { useEffect, useMemo, useState } from 'react';
import { addItem, updateItem } from '../firebase/firestoreService';
import { useAuth } from '../firebase/auth';
import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw, Link2, Bell, Plus, Clock, CheckCircle2, ExternalLink, Download, ShieldCheck, AlertTriangle } from 'lucide-react';

const pad=n=>String(n).padStart(2,'0');
const todayString=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());};
const dateTimeLocal=(date,time)=>new Date(date+'T'+(time||'09:00')+':00');
const escapeIcs=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
const compactDate=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');

export default function CalendarView({tasks=[]}){
 const {user,requestCalendarAccess,calendarAccessToken,calendarTokenExpiresAt}=useAuth();
 const [month,setMonth]=useState(()=>new Date());
 const [calendarList,setCalendarList]=useState([]);
 const [calendarId,setCalendarId]=useState('primary');
 const [googleEvents,setGoogleEvents]=useState([]);
 const [loading,setLoading]=useState(false);
 const [connecting,setConnecting]=useState(false);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [notificationPermission,setNotificationPermission]=useState(typeof window!=='undefined'&&'Notification'in window?Notification.permission:'unsupported');
 const [newTask,setNewTask]=useState({title:'',date:todayString(),time:'09:00',duration:30,category:'Personal'});
 const [showAdd,setShowAdd]=useState(false);

 const monthStart=useMemo(()=>new Date(month.getFullYear(),month.getMonth(),1),[month]);
 const monthEnd=useMemo(()=>new Date(month.getFullYear(),month.getMonth()+1,0,23,59,59),[month]);
 const monthLabel=month.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
 const upcoming=[...tasks].filter(t=>t.status!=='done'&&(t.dueDate||t.date)).sort((a,b)=>((a.dueDate||a.date)+' '+(a.dueTime||a.startTime||'09:00')).localeCompare((b.dueDate||b.date)+' '+(b.dueTime||b.startTime||'09:00')));

 const fetchCalendars=async(token)=>{
   const r=await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=100',{headers:{Authorization:'Bearer '+token}});
   const j=await r.json();
   if(!r.ok)throw new Error(j?.error?.message||'Google Calendar could not list your calendars.');
   const items=j.items||[];setCalendarList(items);
   const primary=items.find(c=>c.primary)||items[0];
   const id=primary?.id||'primary';setCalendarId(id);return id;
 };
 const fetchEvents=async(token,id=calendarId)=>{
   setLoading(true);setError('');
   try{
     const timeMin=new Date(monthStart.getFullYear(),monthStart.getMonth(),1).toISOString();
     const timeMax=new Date(monthEnd.getFullYear(),monthEnd.getMonth()+1,1).toISOString();
     const url='https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(id)+'/events?singleEvents=true&orderBy=startTime&maxResults=200&timeMin='+encodeURIComponent(timeMin)+'&timeMax='+encodeURIComponent(timeMax);
     const r=await fetch(url,{headers:{Authorization:'Bearer '+token}});
     const j=await r.json();
     if(!r.ok)throw new Error(j?.error?.message||'Could not load Google Calendar events.');
     setGoogleEvents(j.items||[]);
   }catch(e){setError(e.message||'Calendar sync failed.');}
   finally{setLoading(false);}
 };

 const connectGoogle=async()=>{
   setConnecting(true);setError('');setNotice('');
   try{
     const result=await requestCalendarAccess();
     const id=await fetchCalendars(result.accessToken);
     await fetchEvents(result.accessToken,id);
     setNotice('Google Calendar connected for this session. You can now create events from LifeOS tasks.');
   }catch(e){
     const code=e?.code||'';
     setError(code==='auth/unauthorized-domain'
       ?'This app domain is not authorised for Firebase Google sign-in. Add the domain under Firebase Console → Authentication → Settings → Authorised domains.'
       :code==='auth/popup-blocked'
       ?'Your browser blocked the Google permission window. Allow pop-ups for this site and try again.'
       :e.message||'Calendar connection did not complete.');
   }finally{setConnecting(false);}
 };

 useEffect(()=>{if(calendarAccessToken){fetchEvents(calendarAccessToken,calendarId);}/* refresh when month changes */},[month,calendarId,calendarAccessToken]);
 useEffect(()=>{
   if(!calendarAccessToken||!calendarTokenExpiresAt)return;
   const remaining=calendarTokenExpiresAt-Date.now();
   const timer=setTimeout(()=>{setError('Google Calendar permission has expired. Reconnect to sync or create events.');},Math.max(0,remaining));
   return ()=>clearTimeout(timer);
 },[calendarAccessToken,calendarTokenExpiresAt]);

 // In-page due reminders. Background alerts require the app to remain open or a real push service.
 useEffect(()=>{
   if(!('Notification'in window)||Notification.permission!=='granted')return;
   const check=()=>{
     const now=Date.now();
     tasks.filter(t=>t.status!=='done'&&(t.dueDate||t.date)).forEach(t=>{
       const day=t.dueDate||t.date;
       const time=t.dueTime||t.startTime||'09:00';
       const due=dateTimeLocal(day,time).getTime();
       const delta=due-now;
       if(delta>=0&&delta<=10*60*1000){
         const key='lifeos-reminder-'+user?.uid+'-'+t.id+'-'+day+'-'+time;
         if(!localStorage.getItem(key)){
           new Notification('LifeOS · Upcoming quest',{body:(t.title||'Task')+' · due in '+Math.max(0,Math.ceil(delta/60000))+' min',tag:key});
           localStorage.setItem(key,'1');
         }
       }
     });
   };
   check();const timer=setInterval(check,30000);return ()=>clearInterval(timer);
 },[tasks,user?.uid]);

 const createTask=async(e)=>{
   e.preventDefault();if(!user||!newTask.title.trim())return;
   const end=new Date(dateTimeLocal(newTask.date,newTask.time).getTime()+Number(newTask.duration||30)*60000);
   await addItem(user.uid,'tasks',{title:newTask.title.trim(),description:'Created from LifeOS calendar',status:'todo',priority:'high',category:newTask.category,dueDate:newTask.date,dueTime:newTask.time,endTime:pad(end.getHours())+':'+pad(end.getMinutes()),durationMins:Number(newTask.duration||30),subtasks:[]});
   setNewTask({...newTask,title:''});setShowAdd(false);
 };

 const createGoogleEvent=async(task)=>{
   if(!calendarAccessToken){setError('Connect Google Calendar first.');return;}
   const date=task.dueDate||task.date||todayString();
   const time=task.dueTime||task.startTime||'09:00';
   const start=dateTimeLocal(date,time);
   const end=task.endTime?dateTimeLocal(date,task.endTime):new Date(start.getTime()+Number(task.durationMins||30)*60000);
   const body={
     summary:task.title,
     description:(task.description||'LifeOS task')+'\n\nCreated from Coach Tushar Raut LifeOS.',
     start:{dateTime:start.toISOString(),timeZone:'Asia/Kolkata'},
     end:{dateTime:end.toISOString(),timeZone:'Asia/Kolkata'},
     reminders:{useDefault:false,overrides:[{method:'popup',minutes:15}]}
   };
   setLoading(true);setError('');
   try{
     const r=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(calendarId)+'/events',{method:'POST',headers:{Authorization:'Bearer '+calendarAccessToken,'Content-Type':'application/json'},body:JSON.stringify(body)});
     const j=await r.json();
     if(!r.ok)throw new Error(j?.error?.message||'Google Calendar did not accept the event.');
     await updateItem(user.uid,'tasks',task.id,{googleEventId:j.id,googleCalendarId:calendarId,calendarSynced:true});
     await fetchEvents(calendarAccessToken,calendarId);
     setNotice('Added "'+task.title+'" to Google Calendar with a 15-minute pop-up reminder.');
   }catch(e){setError(e.message||'Could not create Google Calendar event.');}
   finally{setLoading(false);}
 };

 const downloadIcs=(task)=>{
   const date=task.dueDate||task.date||todayString();const start=dateTimeLocal(date,task.dueTime||task.startTime||'09:00');
   const end=task.endTime?dateTimeLocal(date,task.endTime):new Date(start.getTime()+Number(task.durationMins||30)*60000);
   const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Coach Tushar Raut//LifeOS//EN','BEGIN:VEVENT','UID:'+task.id+'@coachtusharraut.com','DTSTAMP:'+compactDate(new Date()),'DTSTART:'+compactDate(start),'DTEND:'+compactDate(end),'SUMMARY:'+escapeIcs(task.title),'DESCRIPTION:'+escapeIcs(task.description||'LifeOS task'),'BEGIN:VALARM','TRIGGER:-PT15M','ACTION:DISPLAY','DESCRIPTION:LifeOS reminder','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
   const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=(task.title||'lifeos-task').replace(/[^a-z0-9-]/gi,'-')+'.ics';a.click();URL.revokeObjectURL(url);
 };

 const enableNotifications=async()=>{
   if(!('Notification'in window)){setNotificationPermission('unsupported');return;}
   const p=await Notification.requestPermission();setNotificationPermission(p);
   if(p==='granted'){new Notification('LifeOS reminders are on',{body:'While LifeOS is open, tasks due within 10 minutes will trigger a reminder.'});}
 };

 const dateGroups=upcoming.reduce((acc,t)=>{const d=t.dueDate||t.date||'Unscheduled';(acc[d]||(acc[d]=[])).push(t);return acc;},{});
 const dayEvents=googleEvents.slice().sort((a,b)=>(a.start?.dateTime||a.start?.date||'').localeCompare(b.start?.dateTime||b.start?.date||''));

 return <div className="space-y-7 animate-fadeIn">
  <section className="rounded-[28px] border border-emerald-300/15 bg-gradient-to-br from-[#123042] via-[#0a1728] to-[#101b2c] p-6 sm:p-8">
   <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5"><div><span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-200"><CalendarDays size={14}/> Time is your battlefield</span><h1 className="mt-4 text-3xl sm:text-4xl font-black text-white">One calendar.<br/><span className="text-emerald-200">Clear commitments.</span></h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">Bring your LifeOS tasks into view, connect Google Calendar with your permission, and create real events with native calendar reminders.</p></div><div className="flex flex-col gap-2 min-w-[210px]"><button onClick={connectGoogle} disabled={connecting} className="rounded-xl bg-emerald-300 px-4 py-3 text-xs font-black text-[#071a25] flex items-center justify-center gap-2 disabled:opacity-50"><Link2 size={15}/>{connecting?'Connecting…':calendarAccessToken?'Reconnect Google Calendar':'Connect Google Calendar'}</button><button onClick={enableNotifications} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-bold text-slate-200 flex items-center justify-center gap-2"><Bell size={14}/> {notificationPermission==='granted'?'Browser reminders enabled':'Enable browser reminders'}</button></div></div>
  </section>
  {notice&&<div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-200 flex gap-2"><CheckCircle2 size={15}/>{notice}</div>}
  {error&&<div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs text-rose-200 flex gap-2"><AlertTriangle size={15}/>{error}</div>}
  <section className="rounded-2xl border border-slate-800 bg-[#0c1728] p-4 sm:p-5 space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-white">Calendar connection</h2><p className="text-xs text-slate-400 mt-1">OAuth access is held in memory and expires; reconnect when requested.</p></div><span className={'rounded-full px-3 py-1 text-[10px] font-bold '+(calendarAccessToken?'bg-emerald-400/10 text-emerald-200':'bg-slate-800 text-slate-400')}>{calendarAccessToken?'Connected for this session':'Not connected'}</span></div>
   {calendarAccessToken&&<div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><label className="text-xs text-slate-400">Google calendar<select value={calendarId} onChange={e=>setCalendarId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white">{calendarList.map(c=><option key={c.id} value={c.id}>{c.summary}{c.primary?' · Primary':''}</option>)}</select></label><div className="rounded-xl border border-emerald-300/15 bg-emerald-300/5 p-3 text-xs text-emerald-100 flex items-center gap-2"><ShieldCheck size={16}/> Read events and create events only after your Google consent.</div></div>}
   <p className="text-[11px] leading-relaxed text-slate-500">First-time setup may require enabling the Google Calendar API in the Firebase project’s linked Google Cloud project. If Google reports that the API is disabled or the app is unverified, complete the Google Cloud OAuth / consent-screen setup before retrying. LifeOS does not store your Google access token in Firestore.</p>
  </section>

  <section className="rounded-2xl border border-slate-800 bg-[#0c1728] p-4 sm:p-5">
   <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold text-white">Google Calendar · {monthLabel}</h2><p className="text-xs text-slate-400 mt-1">{dayEvents.length} events loaded in this month</p></div><div className="flex items-center gap-2"><button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))} className="rounded-lg bg-slate-800 p-2 text-slate-300"><ChevronLeft size={16}/></button><button onClick={()=>setMonth(new Date())} className="rounded-lg bg-slate-800 px-3 py-2 text-[11px] font-bold text-slate-300">Today</button><button onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))} className="rounded-lg bg-slate-800 p-2 text-slate-300"><ChevronRight size={16}/></button><button disabled={!calendarAccessToken||loading} onClick={()=>fetchEvents(calendarAccessToken)} className="rounded-lg bg-slate-800 p-2 text-slate-300 disabled:opacity-40"><RefreshCw size={15}/></button></div></div>
   <div className="mt-4 grid grid-cols-7 gap-1 text-center">{['S','M','T','W','T','F','S'].map((d,i)=><div key={i} className="py-2 text-[10px] font-bold text-slate-500">{d}</div>)}
    {Array.from({length:monthStart.getDay()},(_,i)=><div key={'blank'+i} className="min-h-16 rounded-lg bg-slate-950/30"/>)}
    {Array.from({length:monthEnd.getDate()},(_,i)=>{const d=new Date(month.getFullYear(),month.getMonth(),i+1);const ds=d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());const todays=dayEvents.filter(ev=>(ev.start?.dateTime||ev.start?.date||'').slice(0,10)===ds);const local=upcoming.filter(t=>(t.dueDate||t.date)===ds);const isToday=ds===todayString();return <div key={ds} className={'min-h-16 sm:min-h-20 rounded-lg border p-1 text-left '+(isToday?'border-emerald-300/50 bg-emerald-300/5':'border-slate-800 bg-slate-950/40')}><span className={'text-[10px] font-bold '+(isToday?'text-emerald-200':'text-slate-400')}>{i+1}</span>{(todays.length+local.length)>0&&<div className="mt-1 flex flex-wrap gap-0.5">{todays.slice(0,3).map((ev,j)=><span key={ev.id||j} className="h-1.5 w-1.5 rounded-full bg-emerald-300"/>)}{local.slice(0,3).map((t,j)=><span key={t.id||j} className="h-1.5 w-1.5 rounded-full bg-amber-300"/>)}</div>}<p className="mt-1 hidden sm:block text-[8px] leading-tight text-slate-600 line-clamp-2">{todays[0]?.summary||local[0]?.title||''}</p></div>})}
   </div>
   {!calendarAccessToken&&<p className="mt-3 text-xs text-slate-500">Connect Google Calendar to display events here. Your LifeOS tasks remain visible below even before connection.</p>}
  </section>

  <section className="space-y-4">
   <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold text-white">Your upcoming quests</h2><p className="text-xs text-slate-400 mt-1">Create a task with a date and time, then send it to Google Calendar.</p></div><button onClick={()=>setShowAdd(!showAdd)} className="rounded-xl bg-amber-300 px-4 py-2.5 text-xs font-black text-[#091a35] flex items-center gap-2"><Plus size={14}/> Add task</button></div>
   {showAdd&&<form onSubmit={createTask} className="rounded-2xl border border-amber-300/15 bg-[#101b2c] p-4 grid grid-cols-1 sm:grid-cols-4 gap-3"><input required value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} placeholder="What needs to happen?" className="sm:col-span-4 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/><label className="text-xs text-slate-400">Date<input type="date" value={newTask.date} onChange={e=>setNewTask({...newTask,date:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/></label><label className="text-xs text-slate-400">Start time<input type="time" value={newTask.time} onChange={e=>setNewTask({...newTask,time:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/></label><label className="text-xs text-slate-400">Duration (min)<input type="number" min="5" max="480" value={newTask.duration} onChange={e=>setNewTask({...newTask,duration:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white"/></label><label className="text-xs text-slate-400">Category<select value={newTask.category} onChange={e=>setNewTask({...newTask,category:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white">{['Personal','Health','Business','Speaking','Learning','Relationships'].map(x=><option key={x}>{x}</option>)}</select></label><div className="sm:col-span-4 flex justify-end"><button className="rounded-xl bg-amber-300 px-4 py-2 text-xs font-black text-[#091a35]">Save task</button></div></form>}
   {Object.keys(dateGroups).length===0?<div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-xs text-slate-500">No pending dated tasks. Add one to begin scheduling.</div>:Object.entries(dateGroups).map(([date,items])=><div key={date} className="rounded-2xl border border-slate-800 bg-[#0d192b] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-amber-200 mb-3">{date==='Unscheduled'?'Unscheduled':new Date(date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</p><div className="space-y-2">{items.map(task=><div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-950/60 p-3"><div className="min-w-0"><p className="text-xs font-bold text-white">{task.title}</p><p className="mt-1 text-[10px] text-slate-500 flex items-center gap-1"><Clock size={11}/>{task.dueTime||task.startTime||'09:00'} · {task.category||'Task'} {task.calendarSynced?'· Synced':''}</p></div><div className="flex flex-wrap gap-2"><button disabled={!calendarAccessToken||loading||task.calendarSynced} onClick={()=>createGoogleEvent(task)} className="rounded-lg bg-emerald-300/10 border border-emerald-300/15 px-3 py-2 text-[10px] font-bold text-emerald-200 disabled:opacity-35">{task.calendarSynced?'In calendar':'Add to Google Calendar'}</button><button onClick={()=>downloadIcs(task)} className="rounded-lg bg-slate-800 px-3 py-2 text-[10px] font-bold text-slate-300"><Download size={12} className="inline mr-1"/>.ics</button></div></div>)}</div></div>)}
  </section>

  <section className="rounded-2xl border border-slate-800 bg-[#0c1728] p-4"><h2 className="font-extrabold text-white flex items-center gap-2"><Bell size={16} className="text-amber-300"/> Reminder behaviour</h2><div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-slate-950/60 p-3"><p className="font-bold text-emerald-200">Browser reminders</p><p className="mt-1 text-slate-400 leading-relaxed">While this app stays open and notifications are allowed, LifeOS checks for tasks due in the next 10 minutes.</p></div><div className="rounded-xl bg-slate-950/60 p-3"><p className="font-bold text-emerald-200">Google Calendar reminders</p><p className="mt-1 text-slate-400 leading-relaxed">Events created from a task receive a native 15-minute pop-up reminder managed by Google Calendar.</p></div></div><p className="mt-3 text-[10px] text-slate-500">Important: browser-only reminders cannot run after the app is fully closed. Reliable background push requires a deployed service worker plus push-server/VAPID setup.</p></section>
 </div>;
}
