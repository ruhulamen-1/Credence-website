const PROJECTS=[
 {name:"Park Snowflake",loc:"Kalabagan, North Dhanmondi",area:"Dhanmondi",addr:"Plot-72, Kalabagan, North Dhanmondi, Dhaka",type:"Apartment",status:"Ongoing",hue:208},
 {name:"Bella Vista",loc:"Dhanmondi",area:"Dhanmondi",addr:"Plot-92, Road-9/A, Dhanmondi, Dhaka",type:"Apartment",status:"Ongoing",hue:28},
 {name:"Helena Sparta",loc:"Banani",area:"Banani",addr:"Plot-39, Road-07, Block-G, Banani, Dhaka",type:"Apartment",status:"Ongoing",hue:190},
 {name:"Arkology",loc:"Gulshan‑1",area:"Gulshan",addr:"Plot-1/B, Road-13, Block-SW(D), Gulshan-1, Dhaka",type:"Apartment",status:"Ongoing",hue:340},
 {name:"Paramount Residences",loc:"Dhaka",area:"Dhanmondi",addr:"Dhaka",type:"Apartment",status:"Completed",hue:240},
 {name:"Platinum",loc:"Dhaka",area:"Dhanmondi",addr:"Dhaka",type:"Apartment",status:"Completed",hue:160},
 {name:"Cynosure",loc:"Dhaka",area:"Dhanmondi",addr:"Dhaka",type:"Apartment",status:"Completed",hue:20}
];
const $=s=>document.querySelector(s);
const NS="http://www.w3.org/2000/svg";
const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};

/* tower illustration */
function tower(svg,hue,floors=15){
 const id="g"+Math.random().toString(36).slice(2,7);
 const d=mk("defs",{},svg);
 let g=mk("linearGradient",{id:id+"a",x1:0,x2:1},d);
 [["0","#2e4f7c"],["0.5","#8fb8e0"],["1","#3a5d8d"]].forEach(([o,c])=>mk("stop",{offset:o,"stop-color":c},g));
 g=mk("linearGradient",{id:id+"b",x1:0,x2:1},d);
 [["0","#c9965f"],["0.5","#f3d9a8"],["1","#b17f4c"]].forEach(([o,c])=>mk("stop",{offset:o,"stop-color":c},g));
 const gr=mk("g",{style:hue===undefined?"":`filter:hue-rotate(${hue-208}deg)`},svg);
 const top=40,fh=(640-top-20)/floors;
 mk("path",{d:"M60 "+top+" L240 "+(top+14)+" L240 620 L60 620Z",fill:`url(#${id}a)`},gr);
 mk("path",{d:"M240 "+(top+14)+" L282 "+(top+34)+" L282 620 L240 620Z",fill:"#26446e",opacity:.9},gr);
 for(let i=0;i<floors;i++){
  const y=top+14*(1-i/floors)+i*fh+fh*.55;
  mk("rect",{x:50,y:y-4,width:200,height:7,rx:3.5,fill:`url(#${id}b)`},gr);
  mk("path",{d:`M250 ${y-4} q22 4 32 ${14*.0+8} v-2 q-10-8-32-8z`,fill:"#d7a96f"},gr);
  mk("rect",{x:64,y:y+5,width:172,height:fh-12,fill:"#fff",opacity:i%3==0?.22:.1},gr);
 }
 mk("rect",{x:60,y:top,width:180,height:580,fill:"url(#"+id+"a)",opacity:.0},gr);
}
tower($("#tower"),208,16);

/* projects */
const grid=$("#grid"),locSel=$("#locSel"),nameSel=$("#nameSel");
[...new Set(PROJECTS.map(p=>p.area))].forEach(a=>locSel.add(new Option(a,a)));
PROJECTS.forEach(p=>nameSel.add(new Option(p.name,p.name)));
PROJECTS.forEach(p=>{
 const c=document.createElement("article");c.className="card reveal";
 const s=mk("svg",{viewBox:"0 0 300 375",role:"img","aria-label":p.name+" illustration"});
 const bg=mk("defs",{},s),lg=mk("linearGradient",{id:"s"+p.name.length+p.hue,x1:0,y1:0,x2:0,y2:1},bg);
 mk("stop",{offset:0,"stop-color":`hsl(${p.hue} 70% 62%)`},lg);mk("stop",{offset:1,"stop-color":`hsl(${p.hue} 60% 94%)`},lg);
 mk("rect",{width:300,height:375,fill:`url(#s${p.name.length+""+p.hue})`},s);
 const inner=mk("svg",{x:60,y:28,width:158,height:337,viewBox:"0 0 300 640"},s);tower(inner,p.hue,12);
 mk("rect",{y:300,width:300,height:75,fill:"#fff",opacity:.55},s);
 c.appendChild(s);
 c.insertAdjacentHTML("beforeend",`<div><h3>${p.name}</h3><p>${p.addr}</p><span class="tag">${p.status} · ${p.type}</span></div>`);
 c._p=p;grid.appendChild(c);
});
function apply(f){
 let n=0;
 [...grid.children].forEach(c=>{
  const p=c._p;
  const ok=(!f.type||p.type===f.type)&&(!f.status||p.status===f.status)&&(!f.loc||p.area===f.loc)&&(!f.name||p.name===f.name);
  c.hidden=!ok;n+=ok;
 });
 $("#count").textContent=n+" project"+(n==1?"":"s")+" shown";
 $("#none").hidden=n>0;
}
apply({});
const form=$("#finder");
const vals=()=>Object.fromEntries(new FormData(form));
form.addEventListener("submit",e=>{e.preventDefault();apply(vals());$("#projects").scrollIntoView({behavior:"smooth"})});
form.addEventListener("change",()=>apply(vals()));
$("#chips").addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 locSel.value=b.dataset.loc;
 document.querySelectorAll("#chips button").forEach(x=>x.classList.toggle("on",x===b&&b.dataset.loc));
 apply(vals());
});
$("#resetAll").onclick=()=>{form.reset();apply({})};

/* intro */
let opened=false;
function open(){
 if(opened)return;opened=true;
 document.body.classList.add("open");
 setTimeout(()=>document.body.classList.remove("locked"),1800);
}
$("#enter").onclick=open;
addEventListener("wheel",open,{passive:true,once:true});
addEventListener("touchmove",open,{passive:true,once:true});
addEventListener("keydown",e=>{if(["ArrowDown","PageDown"," ","Enter"].includes(e.key))open()},{once:true});
if(matchMedia("(prefers-reduced-motion:reduce)").matches)open();

/* nav / menu */
const nav=$("#nav"),menu=$("#menu"),mb=$("#menuBtn");
addEventListener("scroll",()=>nav.classList.toggle("solid",scrollY>60),{passive:true});
const setMenu=o=>{menu.classList.toggle("show",o);mb.setAttribute("aria-expanded",o)};
mb.onclick=()=>setMenu(!menu.classList.contains("show"));
menu.addEventListener("click",e=>e.target.closest("a")&&setMenu(false));
addEventListener("keydown",e=>e.key==="Escape"&&setMenu(false));

/* reveal + counters */
const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(!e.isIntersecting)return;e.target.classList.add("in");io.unobserve(e.target);
 e.target.querySelectorAll("[data-n]").forEach(b=>{
  const t=+b.dataset.n,t0=performance.now();
  (function f(now){const k=Math.min(1,(now-t0)/1400);b.textContent=Math.round(t*(1-Math.pow(1-k,3)));k<1&&requestAnimationFrame(f)})(t0);
 });
}),{threshold:.15});
document.querySelectorAll(".reveal").forEach(e=>io.observe(e));

/* contact form */
$("#contactForm").addEventListener("submit",e=>{
 e.preventDefault();const f=e.target;let ok=true;
 f.querySelectorAll("label").forEach(l=>{
  const i=l.querySelector("input,textarea"),m=l.querySelector("em");
  let msg="";
  if(i.required&&!i.value.trim())msg="Please fill this in.";
  else if(i.type==="email"&&i.value&&!i.checkValidity())msg="Enter a valid email address.";
  l.classList.toggle("bad",!!msg);m.textContent=msg;if(msg)ok=false;
 });
 if(ok){$("#ok").hidden=false;f.reset()}
});
