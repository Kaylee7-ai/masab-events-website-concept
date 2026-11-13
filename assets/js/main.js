(() => {
 "use strict";
 const year=document.querySelector("[data-year]");if(year)year.textContent=String(new Date().getFullYear());
 const header=document.querySelector(".header");
 const updateHeader=()=>{if(header)header.classList.toggle("is-scrolled",window.scrollY>24)};
 updateHeader();window.addEventListener("scroll",updateHeader,{passive:true});
 const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector(".nav");
 if(toggle&&nav){
  const closeMenu=()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation")};
  toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation")});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeMenu();toggle.focus()}});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
 }
 const hero=document.querySelector(".hero");
 if(hero){
  const scroll=document.createElement("a");scroll.className="hero-scroll";scroll.href="#main-content";scroll.setAttribute("aria-label","Scroll to explore");scroll.innerHTML="<span>Scroll to explore</span>";hero.append(scroll);
 }
 const marquee=document.createElement("div");marquee.className="gold-marquee";marquee.setAttribute("aria-label","Weddings, décor, catering and photography");
 const track=document.createElement("div");track.className="gold-marquee-track";
 const phrase="WEDDINGS  ✦  DÉCOR  ✦  CATERING  ✦  PHOTOGRAPHY  ✦  CELEBRATIONS  ✦  ";
 track.innerHTML="<span>"+phrase+"</span><span aria-hidden='true'>"+phrase+"</span>";marquee.append(track);
 const main=document.querySelector("main"),firstHero=main&&main.querySelector(".hero, .page-hero");
 if(firstHero&&firstHero.nextSibling)firstHero.parentNode.insertBefore(marquee,firstHero.nextSibling);
 const mobileBar=document.createElement("div");mobileBar.className="mobile-action-bar";mobileBar.innerHTML="<a href='tel:+233262744322'>Call the team</a><a href='contact.html'>Enquire now</a>";document.body.append(mobileBar);
 const revealTargets=document.querySelectorAll(".section,.split,.package-card,.steps article,.wedding-point-card,.gallery-card,.contact-note,.form-card,.pillars>div,.coverage,.wedding-story-copy");
 revealTargets.forEach((el,i)=>{el.classList.add("reveal");el.style.transitionDelay=(i%4)*85+"ms"});
 if("IntersectionObserver"in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:"0px 0px -35px 0px"});
  revealTargets.forEach(el=>observer.observe(el));
 }else revealTargets.forEach(el=>el.classList.add("is-visible"));
 const lightbox=document.querySelector("#gallery-lightbox");
 if(lightbox){
  const image=lightbox.querySelector("img"),caption=lightbox.querySelector("p"),close=lightbox.querySelector(".lightbox-close");
  document.querySelectorAll(".gallery-open").forEach(button=>button.addEventListener("click",()=>{image.src=button.dataset.full;image.alt=button.dataset.alt||"Wedding inspiration photograph";caption.textContent=button.dataset.alt||"Wedding inspiration";if(typeof lightbox.showModal==="function")lightbox.showModal()}));
  close.addEventListener("click",()=>lightbox.close());lightbox.addEventListener("click",e=>{if(e.target===lightbox)lightbox.close()});lightbox.addEventListener("close",()=>image.removeAttribute("src"));
 }
 const eventDate=document.querySelector('input[name="date"]');
 if(eventDate){const now=new Date(),localDate=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);eventDate.min=localDate}
 const form=document.querySelector("#enquiry-form");
 if(form)form.addEventListener("submit",event=>{
  event.preventDefault();const status=document.querySelector("#form-status");if(!status||!form.reportValidity())return;
  const data=new FormData(form),selectedServices=data.getAll("services"),value=key=>String(data.get(key)||"").trim()||"Not specified";
  const lines=["MASAB EVENTS — EVENT ENQUIRY PREVIEW","","CONTACT","Name: "+value("name"),"Email: "+value("email"),"Phone: "+value("phone"),"Preferred contact: "+value("contactPreference"),"","EVENT","Type: "+value("eventType"),"Occasion: "+value("eventName"),"Date: "+value("date"),"Date flexible: "+value("dateFlexible"),"Start time: "+value("startTime"),"Duration: "+value("duration"),"Location: "+value("location"),"Venue status: "+value("venueStatus"),"Venue: "+value("venue"),"","GUESTS & VISION","Estimated guests: "+value("guestCount"),"Budget: "+value("budget"),"Style: "+value("style"),"Theme / colours: "+value("theme"),"","SERVICES REQUESTED",selectedServices.length?selectedServices.join(", "):"Not specified","","Wedding / cultural details: "+value("weddingDetails"),"Additional notes: "+value("details")];
  const old=form.querySelector(".enquiry-preview");if(old)old.remove();const preview=document.createElement("pre");preview.className="enquiry-preview";preview.tabIndex=0;preview.setAttribute("aria-label","Your event brief preview");preview.textContent=lines.join("\n");
  const copy=document.createElement("button");copy.type="button";copy.className="button dark copy-brief-button";copy.textContent="Copy event brief";
  copy.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(lines.join("\n"));copy.textContent="Copied"}catch{preview.focus();status.textContent="Select and copy the event brief above. Nothing has been sent or stored."}});
  form.append(preview,copy);status.textContent="Your event brief preview is ready. Nothing has been sent or stored.";status.classList.add("is-active");
 });
})();