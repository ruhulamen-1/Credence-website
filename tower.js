const NS="http://www.w3.org/2000/svg";
const mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};
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

