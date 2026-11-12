export function playEagleSound(kind='win'){
  try{
    const AudioContext=window.AudioContext||window.webkitAudioContext;
    if(!AudioContext)return;
    const ctx=new AudioContext();
    const now=ctx.currentTime;
    const notes=kind==='win'?[392,523.25,659.25,783.99]:kind==='miss'?[392,329.63,261.63]:kind==='eagle'?[980,1260,900,1180]:[480,620,530];
    notes.forEach((frequency,index)=>{
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type=kind==='miss'?'triangle':kind==='eagle'?'sawtooth':'sine';
      osc.frequency.setValueAtTime(frequency,now+index*.12);
      gain.gain.setValueAtTime(.0001,now+index*.12);
      gain.gain.exponentialRampToValueAtTime(kind==='win'?.16:kind==='eagle'?.055:.10,now+index*.12+.025);
      gain.gain.exponentialRampToValueAtTime(.0001,now+index*.12+.22);
      osc.connect(gain);gain.connect(ctx.destination);
      osc.start(now+index*.12);osc.stop(now+index*.12+.24);
    });
    if(kind==='win'&&navigator.vibrate)navigator.vibrate([35,25,55]);
    if(kind==='miss'&&navigator.vibrate)navigator.vibrate([45,30,45]);
    window.setTimeout(()=>ctx.close().catch(()=>{}),1000);
  }catch(e){console.warn('LifeOS sound unavailable',e);}
}
export function celebrateEagle(kind='win'){
  playEagleSound(kind);
  if(kind==='win'){
    import('canvas-confetti').then(({default:confetti})=>{
      confetti({particleCount:100,spread:75,startVelocity:42,origin:{y:.65},colors:['#f4cb72','#ffe6a8','#ffffff','#dc8d35']});
      window.setTimeout(()=>confetti({particleCount:45,spread:110,angle:60,origin:{x:0,y:.65},colors:['#f4cb72','#ffffff']}),180);
      window.setTimeout(()=>confetti({particleCount:45,spread:110,angle:120,origin:{x:1,y:.65},colors:['#f4cb72','#ffffff']}),180);
    });
  }
}
