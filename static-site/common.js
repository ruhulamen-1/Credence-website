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
const cf=$("#contactForm");
cf&&cf.addEventListener("submit",async e=>{
 e.preventDefault();const f=e.target;let ok=true;
 f.querySelectorAll("label").forEach(l=>{
  const i=l.querySelector("input,textarea"),m=l.querySelector("em");
  let msg="";
  if(i.required&&!i.value.trim())msg="Please fill this in.";
  else if(i.type==="email"&&i.value&&!i.checkValidity())msg="Enter a valid email address.";
  l.classList.toggle("bad",!!msg);m.textContent=msg;if(msg)ok=false;
 });
 if(!ok)return;
 const out=$("#ok"),btn=f.querySelector("button[type=submit]"),site=window.SITE||{};
 const body={...Object.fromEntries(new FormData(f)),page:location.pathname,...(window.getAttribution?getAttribution():{})};
 const thanks=out.dataset.thanks||(out.dataset.thanks=out.textContent);
 const done=t=>{out.textContent=t;out.className="ok";out.hidden=false};
 if(site.formEndpoint){
  btn.disabled=true;
  try{
   const r=await fetch(site.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(body)});
   if(!r.ok)throw 0;
  }catch(_){out.textContent="We couldn’t send your message. Please call "+(site.hotline||"us")+" or try again.";out.className="ok err";out.hidden=false;btn.disabled=false;return}
  btn.disabled=false;
 }
 done(thanks);f.reset();
 window.track&&track("generate_lead",{page:body.page});
});
