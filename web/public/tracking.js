/* Marketing tracking, driven by data/site.js (window.SITE), managed from /admin → Site settings.
   Loads GTM / GA4 / Meta Pixel / TikTok Pixel only after cookie consent (if consentRequired). */
(function(){
 var S=window.SITE||{},T=S.tracking||{},KEY="credence_consent",ATTR="credence_attr";
 var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
 window.dataLayer=window.dataLayer||[];

 /* UTM / click-id capture (first touch kept for the session) */
 try{
  var q=new URLSearchParams(location.search),a={};
  ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid","ttclid"].forEach(function(k){if(q.get(k))a[k]=q.get(k)});
  if(Object.keys(a).length||!sessionStorage.getItem(ATTR)){a.referrer=document.referrer||"";a.landing=location.pathname;if(!sessionStorage.getItem(ATTR)||Object.keys(a).length>2)sessionStorage.setItem(ATTR,JSON.stringify(a))}
 }catch(e){}
 window.getAttribution=function(){try{return JSON.parse(sessionStorage.getItem(ATTR)||"{}")}catch(e){return{}}};

 function ready(f){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f()}
 var loaded=false;
 function script(src){var s=document.createElement("script");s.async=true;s.src=src;document.head.appendChild(s)}
 function load(){
  if(loaded)return;loaded=true;
  if(T.gtm){window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});script("https://www.googletagmanager.com/gtm.js?id="+encodeURIComponent(T.gtm))}
  else if(T.ga4){window.gtag=function(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config",T.ga4);script("https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(T.ga4))}
  if(T.metaPixel){
   !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
   fbq("init",T.metaPixel);fbq("track","PageView");
  }
  if(T.tiktokPixel){
   !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify"];ttq.methods.forEach(function(m){ttq[m]=function(){ttq.push([m].concat([].slice.call(arguments)))}});var s=d.createElement("script");s.async=!0;s.src="https://analytics.tiktok.com/i18n/pixel/events.js?sdkid="+encodeURIComponent(T.tiktokPixel)+"&lib="+t;d.head.appendChild(s);ttq.page()}(window,document,"ttq");
  }
 }

 var META={generate_lead:"Lead",whatsapp_click:"Contact",call_click:"Contact",brochure_download:"ViewContent"};
 window.track=function(name,params){
  params=params||{};
  window.dataLayer.push(Object.assign({event:name},params));
  if(window.gtag&&!T.gtm)gtag("event",name,params);
  if(window.fbq)fbq("track",META[name]||"CustomEvent",params);
  if(window.ttq)ttq.track(name,params);
 };

 document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;
  var h=a.getAttribute("href");
  if(h.indexOf("tel:")===0)track("call_click",{number:h.slice(4)});
  else if(h.indexOf("wa.me")>-1)track("whatsapp_click");
  else if(/\.pdf($|\?)/i.test(h))track("brochure_download",{file:h});
 });

 /* WhatsApp floating button */
 if(S.whatsapp){
  var w=document.createElement("a");w.className="wa";w.href="https://wa.me/"+String(S.whatsapp).replace(/\D/g,"");w.target="_blank";w.rel="noopener";w.setAttribute("aria-label","Chat on WhatsApp");w.textContent="WhatsApp";
  ready(function(){document.body.appendChild(w)});
 }

 /* Consent */
 var any=T.gtm||T.ga4||T.metaPixel||T.tiktokPixel;
 if(!any)return;
 var c=store.get(KEY);
 if(S.consentRequired===false||c==="yes")return load();
 if(c==="no")return;
 ready(function(){
  var b=document.createElement("div");b.className="consent";b.setAttribute("role","region");b.setAttribute("aria-label","Cookie consent");
  b.innerHTML='<p>We use cookies to understand how the site is used and to improve our marketing.</p><div><button class="btn" data-v="no">Decline</button><button class="btn dark" data-v="yes">Accept</button></div>';
  b.addEventListener("click",function(e){var v=e.target.dataset&&e.target.dataset.v;if(!v)return;store.set(KEY,v);b.remove();if(v==="yes")load()});
  document.body.appendChild(b);
 });
})();
