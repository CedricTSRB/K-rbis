/* Halloween experience. No dependencies or external audio. */
(()=>{
'use strict';
const q=id=>document.getElementById(id);
const settings=q('halloween-settings'),enabled=q('halloween-scares-enabled'),frequency=q('halloween-scare-frequency'),atmosphere=q('halloween-atmosphere-enabled'),preview=q('halloween-scare-preview');
const cover=q('halloween-scare'),face=cover.querySelector('.halloween-scare-face'),caption=cover.querySelector('strong');
const keys={enabled:'narco-halloween-scares-enabled',frequency:'narco-halloween-frequency',atmosphere:'narco-halloween-atmosphere'};
const store={get(k,fallback){try{const v=localStorage.getItem(k);return v===null?fallback:v}catch{return fallback}},set(k,v){try{localStorage.setItem(k,String(v))}catch{}}};
enabled.checked=store.get(keys.enabled,'true')!=='false';
frequency.value=['rare','normal','often'].includes(store.get(keys.frequency,'normal'))?store.get(keys.frequency,'normal'):'normal';
atmosphere.checked=store.get(keys.atmosphere,'true')!=='false';
const updateAtmosphere=()=>document.body.classList.toggle('haunt-paused',!atmosphere.checked);
updateAtmosphere();
enabled.addEventListener('change',()=>store.set(keys.enabled,enabled.checked));
frequency.addEventListener('change',()=>store.set(keys.frequency,frequency.value));
atmosphere.addEventListener('change',()=>{store.set(keys.atmosphere,atmosphere.checked);updateAtmosphere()});
q('halloween-settings-open').addEventListener('click',()=>settings.showModal());
q('halloween-settings-close').addEventListener('click',()=>settings.close());
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const variants=[
 {id:'skull',icon:'💀',label:'DU BIST NICHT ALLEIN'},
 {id:'demon',icon:'👹',label:'LAUF!'},
 {id:'ghost',icon:'👻',label:'SIE SIND HIER'},
 {id:'pumpkin',icon:'🎃',label:'SÜSSES ODER SAURES?'},
 {id:'spider',icon:'🕷️',label:'HINTER DIR!'},
 {id:'eyes',icon:'👁️',label:'ICH SEHE DICH'}
];
let last=-1,lastAt=0,closing=null,unlocked=false,audioCtx=null,nextAmbient=null,ambientReady=false;
const random=(min,max)=>Math.random()*(max-min)+min;
const pick=()=>{let i=Math.floor(Math.random()*variants.length);if(i===last)i=(i+1+Math.floor(Math.random()*(variants.length-1)))%variants.length;last=i;return variants[i]};
const canSound=()=>unlocked;
function context(){try{if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=new AC()}if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});return audioCtx}catch{return null}}
function tone(ac,at,opts={}){const osc=ac.createOscillator(),amp=ac.createGain();osc.type=opts.type||'sawtooth';const duration=opts.duration||.5;osc.frequency.setValueAtTime(Math.max(opts.start||300,1),at);osc.frequency.exponentialRampToValueAtTime(Math.max(opts.end||80,1),at+duration);amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(Math.max(opts.gain||.04,.0001),at+.025);amp.gain.exponentialRampToValueAtTime(.0001,at+duration);osc.connect(amp);amp.connect(opts.out||ac.destination);osc.start(at);osc.stop(at+duration+.03)}
function noise(ac,at,duration,gain,filterFreq=600,out=ac.destination){const length=Math.ceil(ac.sampleRate*duration),buffer=ac.createBuffer(1,length,ac.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1);const src=ac.createBufferSource(),filter=ac.createBiquadFilter(),amp=ac.createGain();filter.type='lowpass';filter.frequency.value=filterFreq;amp.gain.setValueAtTime(.0001,at);amp.gain.exponentialRampToValueAtTime(gain,at+.025);amp.gain.exponentialRampToValueAtTime(.0001,at+duration);src.buffer=buffer;src.connect(filter);filter.connect(amp);amp.connect(out);src.start(at);src.stop(at+duration+.02)}
const screamClips = ['Wilhelm_Scream.ogg','NOW_screaming.ogg'].map(name => {
 const clip = document.createElement('audio');
 clip.src = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + name;
 clip.preload = 'auto';
 return clip;
});
let previousScream = -1;
function sound(kind){
 if(!canSound())return;
 let index = Math.floor(Math.random()*screamClips.length);
 if(index===previousScream)index=(index+1)%screamClips.length;
 previousScream=index;
 const clip=screamClips[index];
 try {
   clip.pause();
   clip.currentTime=0;
   clip.volume=.8;
   const playback=clip.play();
   if(playback)playback.catch(()=>fallbackSound(kind));
 }catch(e){fallbackSound(kind)}
}
function fallbackSound(kind){if(!canSound())return;const ac=context();if(!ac)return;const n=ac.currentTime+.015,master=ac.createGain();master.gain.value=0.23;master.connect(ac.destination);
 try{switch(kind){
 case 'skull':tone(ac,n,{start:560,end:55,type:'sawtooth',duration:.72,gain:.35,out:master});noise(ac,n,.55,.18,1300,master);break;
 case 'demon':tone(ac,n,{start:240,end:38,type:'square',duration:.77,gain:.22,out:master});tone(ac,n+.1,{start:740,end:75,duration:.51,gain:.15,out:master});break;
 case 'ghost':tone(ac,n,{start:960,end:110,type:'sine',duration:.78,gain:.32,out:master});tone(ac,n+.13,{start:330,end:80,type:'triangle',duration:.52,gain:.18,out:master});break;
 case 'pumpkin':tone(ac,n,{start:620,end:62,type:'triangle',duration:.32,gain:.3,out:master});tone(ac,n+.22,{start:260,end:40,type:'sawtooth',duration:.47,gain:.2,out:master});break;
 case 'spider':for(let i=0;i<4;i++)tone(ac,n+i*.11,{start:1500-i*120,end:170,type:'square',duration:.15,gain:.11,out:master});break;
 case 'eyes':tone(ac,n,{start:120,end:700,type:'sine',duration:.45,gain:.26,out:master});tone(ac,n+.35,{start:900,end:45,type:'sawtooth',duration:.33,gain:.2,out:master});break;
 }}catch(e){console.warn('Halloween sound:',e)}
 setTimeout(()=>{try{master.disconnect()}catch{}},1700)
}
function show(force=false){
 if(document.hidden||(!force&&!enabled.checked))return;
 if(!force&&Date.now()-lastAt<(frequency.value==='often'?28000:frequency.value==='rare'?95000:56000))return;
 lastAt=Date.now();
 const chosen=pick();cover.className='halloween-scare variant-'+chosen.id;
 face.textContent=chosen.icon;caption.textContent=chosen.label;
 void cover.offsetWidth;cover.classList.add('active');sound(chosen.id);
 clearTimeout(closing);closing=setTimeout(()=>{cover.classList.remove('active');cover.className='halloween-scare'},reduced.matches?950:820);
}
preview.addEventListener('click',()=>{unlocked=true;show(true)});
const probabilities={rare:.1,normal:.23,often:.4};
document.getElementById('cards').addEventListener('click',e=>{
 if(!e.target.closest('[data-zoom]'))return;
 unlocked=true;
 if(Math.random()<probabilities[frequency.value])show()
});
let interacted=false;
document.addEventListener('pointerdown',()=>{unlocked=true;interacted=true},{passive:true});
document.addEventListener('keydown',()=>{unlocked=true;interacted=true});
function ambientSchedule(){clearTimeout(nextAmbient);nextAmbient=setTimeout(()=>{
 if(interacted&&!document.hidden&&enabled.checked&&!settings.open&&!q('lightbox').open&&!q('admin-dialog').open&&Math.random()<(frequency.value==='often'?.4:frequency.value==='rare'?.09:.2))show();
 ambientSchedule();
},random(42000,85000))}
ambientSchedule();
const layer=document.createElement('div');layer.className='haunt-atmosphere';layer.setAttribute('aria-hidden','true');
layer.innerHTML='<div class="haunt-fog"></div><div class="haunt-fog haunt-fog-b"></div><div class="haunt-embers"></div><div class="haunt-shadow"></div>';
document.body.append(layer);
const embers=layer.querySelector('.haunt-embers');
for(let i=0;i<19;i++){const el=document.createElement('span');el.className='haunt-ember';el.style.setProperty('--x',random(3,98).toFixed(1)+'%');el.style.setProperty('--y',random(9,98).toFixed(1)+'%');el.style.setProperty('--size',random(1,3.5).toFixed(1)+'px');el.style.setProperty('--duration',random(5,12).toFixed(1)+'s');el.style.setProperty('--delay',-random(1,14).toFixed(1)+'s');embers.append(el)}
const hero=document.querySelector('.hero');for(let i=0;i<3;i++){const b=document.createElement('span');b.className='haunt-bat';b.textContent='🦇';b.setAttribute('aria-hidden','true');b.style.setProperty('--bat-y',(18+i*19)+'%');b.style.setProperty('--bat-size',(15+i*7)+'px');b.style.setProperty('--bat-speed',(21+i*6)+'s');b.style.setProperty('--bat-delay',(-i*9)+'s');hero.append(b)}
const shadow=layer.querySelector('.haunt-shadow');function shadowLoop(){setTimeout(()=>{if(atmosphere.checked&&!document.hidden&&!reduced.matches){shadow.classList.add('appear');setTimeout(()=>shadow.classList.remove('appear'),3300)}shadowLoop()},random(37000,80000))}shadowLoop();
document.addEventListener('visibilitychange',()=>{if(document.hidden){cover.className='halloween-scare';shadow.classList.remove('appear')}});
})();
