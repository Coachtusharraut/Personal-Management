import React from 'react';
const HEROES=[
 {name:'Garuda',role:'The Eagle',emoji:'🦅',portrait:-1,lesson:'See the whole sky. Keep the mission in view.',color:'gold'},
 {name:'Arjuna',role:'The Focused Archer',emoji:'🏹',portrait:1,lesson:'One target. One clear next action.',color:'blue'},
 {name:'Hanuman',role:'The Devoted Builder',emoji:'🦁',portrait:2,lesson:'Strength is useful when it serves a mission.',color:'orange'},
 {name:'Chanakya',role:'The Strategist',emoji:'🧠',portrait:0,lesson:'Build systems, not dependence on motivation.',color:'purple'},
 {name:'Chhatrapati Shivaji Maharaj',role:'The Fort Builder',emoji:'🏰',portrait:4,lesson:'Strong structures grow fort by fort, team by team.',color:'green'},
 {name:'Rani Lakshmibai',role:'The Courageous Leader',emoji:'🛡️',portrait:3,lesson:'Take the brave step even when the path is difficult.',color:'rose'}
];
export default function EagleWisdomView(){
 return <div className="space-y-4"><section className="eagle-wisdom-hero"><div className="text-5xl">🪶</div><p className="eagle-mini-label">EAGLE CODE</p><div className="eagle-character-row"><span>🦅</span><span>🏹</span><span>🛡️</span><span>🏰</span><span>🦁</span></div><h1>Think high. Build strong.</h1><p>Six reminders for the journey.</p></section>
 <div className="grid grid-cols-2 gap-3">{HEROES.map((h,i)=><article key={h.name} className={'eagle-hero-card '+h.color}><div className={"eagle-hero-avatar "+(h.portrait>=0?"portrait-"+h.portrait:"")}>{h.portrait<0?h.emoji:null}</div><p className="eagle-mini-label">{h.role}</p><h2>{h.name}</h2><small>{h.lesson}</small></article>)}</div>
 <section className="eagle-quote"><span>🦅</span><p><b>Don't chase six teams at once.</b><small>Build one strong leader. Help them build. Then let the wings multiply.</small></p></section>
 <a href="https://www.nps.gov/subjects/sound/sounds-bald-eagle.htm" target="_blank" rel="noreferrer" className="eagle-real-call">🔊 Hear a real bald eagle call <span>↗</span></a>
 </div>;
}
