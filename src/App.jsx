import React,{useEffect,useState} from 'react';
import {useAuth} from './firebase/auth';
import {subscribeCollection,ensureEagleTeams,addItem} from './firebase/firestoreService';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthGate from './components/AuthGate';
import DashboardView from './modules/DashboardView';
import TeamsView from './modules/TeamsView';
import PeoplePipelineView from './modules/PeoplePipelineView';
import EagleActivityView from './modules/EagleActivityView';
import EagleProgressView from './modules/EagleProgressView';
import EagleWisdomView from './modules/EagleWisdomView';
import SettingsView from './modules/SettingsView';
import {Home,Users,MessageCircle,ClipboardList,MoreHorizontal,X,TrendingUp,BookOpen,Settings as SettingsIcon} from 'lucide-react';

export default function App(){
 const {user,loading,isGuest}=useAuth();
 const [activeTab,setActiveTab]=useState('home');
 const [showMore,setShowMore]=useState(false);
 const [teams,setTeams]=useState([]);
 const [ibos,setIbos]=useState([]);
 const [prospects,setProspects]=useState([]);
 const [activities,setActivities]=useState([]);
 const [selectedTeam,setSelectedTeam]=useState('');
 const [booting,setBooting]=useState(true);
 const go=(tab,teamId='')=>{setActiveTab(tab);setSelectedTeam(teamId||'');setShowMore(false);window.scrollTo?.({top:0,behavior:'smooth'});};
 useEffect(()=>{
  if(!user)return;
  setBooting(true);
  const stop=[
   subscribeCollection(user.uid,'teams',setTeams),
   subscribeCollection(user.uid,'ibos',setIbos),
   subscribeCollection(user.uid,'prospects',setProspects),
   subscribeCollection(user.uid,'activities',setActivities)
  ];
  ensureEagleTeams(user.uid).catch(err=>console.error('Could not create the six Eagle wings:',err)).finally(()=>setBooting(false));
  return ()=>stop.forEach(fn=>fn());
 },[user]);
 const logActivity=async(data)=>{
  if(!user)return;
  await addItem(user.uid,'activities',{...data,date:data.date||new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata'}).format(new Date()),createdAt:new Date().toISOString()});
 };
 const mobileTabs=[
  {id:'home',label:'Home',Icon:Home},
  {id:'teams',label:'Teams',Icon:Users},
  {id:'people',label:'People',Icon:MessageCircle},
  {id:'activity',label:'Action',Icon:ClipboardList}
 ];
 const moreItems=[
  {id:'progress',label:'Eagle Progress',sub:'Your six wings',Icon:TrendingUp},
  {id:'wisdom',label:'Eagle Wisdom',sub:'Focus & courage',Icon:BookOpen},
  {id:'settings',label:'Settings & backup',sub:'Your account',Icon:SettingsIcon}
 ];
 if(loading||booting&&user)return <div className="eagle-loading"><div className="eagle-loading-mark">🦅</div><b>Preparing your wings…</b><small>One structure. Six teams.</small></div>;
 if(!user||isGuest)return <AuthGate/>;
 return <div className="eagle-app min-h-[100dvh]">
  <Navbar onOpenQuickAdd={()=>go('activity')} onNavigate={go} activeTab={activeTab}/>
  <div className="eagle-shell">
   <Sidebar activeTab={activeTab} onSelectTab={go}/>
   <main className="eagle-main">
    {activeTab==='home'&&<DashboardView teams={teams} ibos={ibos} prospects={prospects} activities={activities} onNavigate={go}/>}
    {activeTab==='teams'&&<TeamsView teams={teams} ibos={ibos} onAddActivity={logActivity} initialTeamId={selectedTeam}/>}
    {activeTab==='people'&&<PeoplePipelineView prospects={prospects} teams={teams} onAddActivity={logActivity}/>}
    {activeTab==='activity'&&<EagleActivityView activities={activities} teams={teams} onAddActivity={logActivity}/>}
    {activeTab==='progress'&&<EagleProgressView teams={teams} ibos={ibos} prospects={prospects} activities={activities} onNavigate={go}/>}
    {activeTab==='wisdom'&&<EagleWisdomView/>}
    {activeTab==='settings'&&<SettingsView/>}
   </main>
  </div>
  <nav className="eagle-bottom-nav md:hidden" aria-label="App navigation">
   {mobileTabs.map(({id,label,Icon})=><button key={id} onClick={()=>go(id)} className={'eagle-tab '+(activeTab===id?'active':'')}><Icon size={21}/><span>{label}</span></button>)}
   <button onClick={()=>setShowMore(v=>!v)} className={'eagle-tab '+(showMore||moreItems.some(x=>x.id===activeTab)?'active':'')} aria-expanded={showMore}>{showMore?<X size={21}/>:<MoreHorizontal size={21}/>}<span>More</span></button>
  </nav>
  {showMore&&<div className="eagle-more-backdrop md:hidden" onClick={()=>setShowMore(false)}><section className="eagle-more-sheet" role="dialog" aria-modal="true" aria-label="More LifeOS sections" onClick={e=>e.stopPropagation()}><div className="eagle-sheet-handle"/><div className="flex items-center justify-between mb-3"><div><p className="eagle-mini-label">YOUR EAGLE</p><h2 className="text-lg font-black text-white">More to explore</h2></div><button onClick={()=>setShowMore(false)} className="eagle-menu-button"><X size={18}/></button></div><div className="grid grid-cols-1 gap-2">{moreItems.map(({id,label,sub,Icon})=><button key={id} onClick={()=>go(id)} className="eagle-more-item"><span className="eagle-more-icon"><Icon size={20}/></span><span className="text-left"><b>{label}</b><small>{sub}</small></span></button>)}</div></section></div>}
 </div>;
}
