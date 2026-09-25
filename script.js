/* ==============================================================
   CONTENT — replace every placeholder string/value here. Animation
   logic below reads from this object, so theme swaps stay painless.
   ============================================================= */
const CONTENT = {
  title: "UNTITLED STORY",
  entryCopy: "ENTER THE STORY",
  riddles: ["The path only appears after you leave.", "Bring a light. Leave the map behind."],
  tagline: "A blank page, a distant signal, and a reason to keep going.",
  plot: "When a strange transmission interrupts a quiet life, four unlikely companions take the first step into a landscape that refuses to be explained. This is placeholder copy for your own adventure, mystery, or entirely different kind of story.",
  characters: [
    { name:"The Seeker", initial:"S", color:"#e4ff35", bio:"A patient observer who hears patterns in the noise. Replace this dossier with your character biography, credits, or a short visual description." },
    { name:"The Spark", initial:"E", color:"#f2f2f2", bio:"The restless force that turns a clue into a journey. This is intentionally generic placeholder content, ready for a new world." },
    { name:"The Keeper", initial:"K", color:"#e4ff35", bio:"A guardian of half-finished maps and full-hearted promises. Add your own licensed imagery or muted looping background video here." },
    { name:"The Echo", initial:"O", color:"#f2f2f2", bio:"A voice at the edge of the frame, never quite where expected. Give this space to an ally, a rival, or the place itself." }
  ],
  stats: [
    { icon:"✦", label:"Year imagined", target:2026, suffix:"" }, { icon:"◒", label:"Miles to nowhere", target:428, suffix:" km" },
    { icon:"◌", label:"Signals decoded", target:17, suffix:"" }, { icon:"⌁", label:"Hours after dark", target:86, suffix:"" }, { icon:"↗", label:"Ways forward", target:4, suffix:"" }
  ],
  gallery: ["First transmission","A quiet ridge","No fixed address","Watching the water","Late signal","The way ahead"],
  colors: ["#e4ff35","#f2f2f2","#e4ff35","#f2f2f2","#e4ff35","#f2f2f2"],
  markers: [{x:22,y:31,label:"Signal one"},{x:64,y:23,label:"The crossing"},{x:48,y:56,label:"Old lookout"},{x:78,y:69,label:"Final light"},{x:17,y:78,label:"Home"}]
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const $ = (s, scope = document) => scope.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];

// Content rendering ------------------------------------------------
document.title = `${CONTENT.title} — Movie Tribute Template`;
$("[data-wordmark]").innerHTML = CONTENT.title.replace(" ", " <span>") + "</span>";
$("#entry-copy").textContent = CONTENT.entryCopy;
$("#riddle-one").textContent = CONTENT.riddles[0];
$("#riddle-two").textContent = CONTENT.riddles[1];
$("#tagline").innerHTML = CONTENT.tagline.split(" ").map(word => `<span>${word}</span>`).join(" ");
$("#plot-copy").textContent = CONTENT.plot;

$("#character-grid").innerHTML = CONTENT.characters.map((item, i) => `
  <button class="character-card" type="button" data-index="${i}" style="--card-color:${item.color}" aria-label="Open ${item.name} dossier">
    <span class="character-card__num">0${i + 1}</span><span class="character-card__initial">${item.initial}</span><h3>${item.name}</h3>
  </button>`).join("");
$("#stats-rail").innerHTML = CONTENT.stats.map((item, i) => `<article class="stat"><span class="stat__icon">${item.icon}</span><strong class="stat__number" data-target="${item.target}" data-suffix="${item.suffix}">0${item.suffix}</strong><span class="stat__label">${item.label}</span></article>`).join("");
$("#gallery-grid").innerHTML = CONTENT.gallery.map((caption, i) => `<button class="gallery-item" type="button" data-index="${i}" style="--tile-color:${CONTENT.colors[i]}"><span class="gallery-item__art"></span><span>0${i + 1} / ${caption}</span></button>`).join("");
$("#story-map").insertAdjacentHTML("beforeend", CONTENT.markers.map((marker, i) => `<button class="marker" type="button" style="left:${marker.x}%;top:${marker.y}%" data-label="${marker.label}" aria-label="${marker.label}"></button>`).join(""));

// Phase 1 — Preloader / entry gate -------------------------------
const preloader = $("#preloader");
let entered = false;
function enterSite() {
  if (entered) return;
  entered = true;
  const finish = () => { preloader.style.display = "none"; document.body.classList.add("is-entered"); };
  if (reducedMotion || !window.gsap) { preloader.style.opacity = "0"; finish(); revealHero(); return; }
  gsap.to(preloader, { clipPath:"circle(0% at 50% 50%)", duration:.9, ease:"power4.inOut", onComplete:finish });
  revealHero();
}
function revealHero() {
  if (!window.gsap) { $("#site-header").style.opacity = "1"; return; }
  const tl = gsap.timeline();
  tl.to("#site-header", { opacity:1, y:0, duration:.6, ease:"power3.out" }, .18)
    .from(".hero h1", { opacity:0, scale:.85, duration:.8, ease:"back.out(1.4)" }, .48)
    .from(".hero__tagline span", { opacity:0, y:20, stagger:.08, duration:.45, ease:"power3.out" }, 1.12)
    .from(".scroll-cue", { opacity:0, duration:.4 }, 1.55);
}
if (window.gsap && !reducedMotion) {
  const chars = CONTENT.entryCopy.split("").map(c => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("");
  $("#entry-copy").innerHTML = chars;
  const preTL = gsap.timeline({ onComplete: () => setTimeout(enterSite, 450) });
  preTL.set(".preloader__sigil,.preloader__riddle", { opacity:0 })
    .fromTo("#count", {opacity:0,scale:.8}, {opacity:1,scale:1,duration:.35,ease:"back.out(1.7)"})
    .to("#count", {opacity:0,duration:.2,delay:.4}).call(()=>$("#count").textContent="2")
    .to("#count", {opacity:1,scale:1,duration:.35,ease:"back.out(1.7)"}).to("#count", {opacity:0,duration:.2,delay:.4}).call(()=>$("#count").textContent="3")
    .to("#count", {opacity:1,duration:.35,ease:"back.out(1.7)"})
    .from("#entry-copy span", {opacity:0,y:10,stagger:.03,duration:.25}, "<.1")
    .to(".preloader__sigil", {opacity:1,scale:1,duration:.55,ease:"elastic.out(1, .45)"}, ">.1")
    .to("#riddle-one", {opacity:1,y:0,duration:.5,ease:"power2.out"}, ">.2")
    .to("#riddle-two", {opacity:1,y:0,duration:.5,ease:"power2.out"}, ">.12");
} else { setTimeout(enterSite, 700); }
preloader.addEventListener("click", enterSite);

// Phase 2 — Hero / parallax / audio ------------------------------
const scrollCue = $(".scroll-cue");
window.addEventListener("scroll", () => { if (window.scrollY > 20) { scrollCue.style.opacity = "0"; scrollCue.style.pointerEvents = "none"; } }, {once:true});
if (window.gsap && !reducedMotion) {
  gsap.to(".hero__layer--far", {scale:1.08,duration:20,ease:"none"});
  gsap.to(".scroll-cue i", {y:8,duration:.8,yoyo:true,repeat:-1,ease:"sine.inOut"});
}
if (!isTouch && !reducedMotion) {
  const layers = [[".hero__layer--far",10],[".hero__layer--mid",25],[".hero__layer--near",-12]];
  let targetX=0,targetY=0,currentX=0,currentY=0;
  window.addEventListener("mousemove", e => { targetX=(e.clientX/window.innerWidth-.5)*2; targetY=(e.clientY/window.innerHeight-.5)*2; });
  (function parallax(){ currentX+=(targetX-currentX)*.08; currentY+=(targetY-currentY)*.08; layers.forEach(([selector,power])=>{ const node=$(selector); node.style.translate=`${currentX*power}px ${currentY*power}px`; }); requestAnimationFrame(parallax); })();
}
const audio = $("#ambient-audio"), soundButton = $(".sound-toggle");
soundButton.addEventListener("click", async () => { try { audio.muted = false; await audio.play(); soundButton.setAttribute("aria-pressed","true"); soundButton.setAttribute("aria-label","Turn background sound off"); soundButton.innerHTML="<span aria-hidden='true'>◖◗</span>"; if(window.gsap && !reducedMotion) gsap.fromTo(soundButton,{scale:1},{scale:1.2,duration:.1,yoyo:true,repeat:1}); } catch { soundButton.setAttribute("aria-label","Add a licensed audio source to enable sound"); } });

// Phase 3 — ScrollTrigger sections / cards / stats ---------------
function showDetail(index) {
  const character=CONTENT.characters[index], panel=$("#detail-panel");
  $("#detail-name").textContent=character.name; $("#detail-description").textContent=character.bio; panel.style.setProperty("--detail-color",character.color); panel.style.display="block"; panel.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  if(window.gsap && !reducedMotion) gsap.fromTo(panel,{clipPath:"circle(0% at 50% 50%)"},{clipPath:"circle(150% at 50% 50%)",duration:.6,ease:"power3.inOut"});
}
function closeDetail() { const panel=$("#detail-panel"); const done=()=>{panel.style.display="none";panel.setAttribute("aria-hidden","true");document.body.style.overflow="";}; if(window.gsap && !reducedMotion) gsap.to(panel,{clipPath:"circle(0% at 50% 50%)",duration:.4,ease:"power3.inOut",onComplete:done}); else done(); }
$$(".character-card").forEach(card=>card.addEventListener("click",()=>showDetail(+card.dataset.index))); $(".detail-close").addEventListener("click",closeDetail);
if (window.gsap && window.ScrollTrigger && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  $$(".reveal").forEach(section=>gsap.fromTo(section,{opacity:0,y:40},{opacity:1,y:0,duration:.7,ease:"power2.out",scrollTrigger:{trigger:section,start:"top 80%",once:true}}));
  if (!isTouch) {
    const statTL=gsap.timeline({scrollTrigger:{trigger:".stats",start:"top top",end:"+=1500",pin:true,scrub:1}});
    statTL.from(".stat",{opacity:0,y:50,stagger:.13,duration:.45});
  }
  $$(".stat__number").forEach(number=>ScrollTrigger.create({trigger:".stats",start:"top 55%",once:true,onEnter:()=>{const value={n:0};gsap.to(value,{n:+number.dataset.target,duration:1.5,ease:"power2.out",onUpdate:()=>number.textContent=Math.round(value.n).toLocaleString()+number.dataset.suffix});}}));
  gsap.to(".marker",{scale:1.15,opacity:.5,duration:1,yoyo:true,repeat:-1,stagger:.12,ease:"sine.inOut"});
} else { $$(".reveal").forEach(el=>{el.style.opacity="1";el.style.transform="none";}); $$(".stat__number").forEach(n=>n.textContent=(+n.dataset.target).toLocaleString()+n.dataset.suffix); }

// Phase 4 — Gallery FLIP-style viewer / map ----------------------
let activeGallery=0, sourceTile=null;
function openGallery(index, source) { activeGallery=index; sourceTile=source; const box=$("#lightbox"), color=CONTENT.colors[index]; box.style.setProperty("--lightbox-color",color); $(".lightbox figcaption").textContent=`0${index+1} / ${CONTENT.gallery[index]}`; box.style.display="flex"; box.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; if(window.gsap&&!reducedMotion){const r=source.getBoundingClientRect(), frame=$("#lightbox-frame"); gsap.fromTo(frame,{position:"fixed",left:r.left,top:r.top,width:r.width,height:r.height},{position:"relative",left:0,top:0,width:"min(76vw, 950px)",height:"min(72vh, 720px)",duration:.5,ease:"power3.inOut"}); gsap.fromTo(box,{backgroundColor:"rgba(0,0,0,0)"},{backgroundColor:"rgba(0,0,0,.74)",duration:.3});} }
function closeGallery() { const box=$("#lightbox"), done=()=>{box.style.display="none";box.setAttribute("aria-hidden","true");document.body.style.overflow="";}; if(window.gsap&&!reducedMotion&&sourceTile){const r=sourceTile.getBoundingClientRect(),frame=$("#lightbox-frame");gsap.to(frame,{position:"fixed",left:r.left,top:r.top,width:r.width,height:r.height,duration:.4,ease:"power3.inOut",onComplete:done});}else done(); }
$$(".gallery-item").forEach(tile=>tile.addEventListener("click",()=>openGallery(+tile.dataset.index,tile))); $(".lightbox__close").addEventListener("click",closeGallery); $(".lightbox__next").addEventListener("click",()=>openGallery((activeGallery+1)%CONTENT.gallery.length,$$(".gallery-item")[(activeGallery+1)%CONTENT.gallery.length])); $(".lightbox__prev").addEventListener("click",()=>openGallery((activeGallery-1+CONTENT.gallery.length)%CONTENT.gallery.length,$$(".gallery-item")[(activeGallery-1+CONTENT.gallery.length)%CONTENT.gallery.length]));
$$(".marker").forEach(marker=>marker.addEventListener("click",()=>marker.classList.toggle("is-active")));

// Shared custom cursor ------------------------------------------------
if (!isTouch && !reducedMotion) { const cursor=$(".cursor"); let x=0,y=0,cx=0,cy=0; window.addEventListener("mousemove",e=>{x=e.clientX;y=e.clientY;}); (function move(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;cursor.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(move);})(); $$("a,button").forEach(el=>{el.addEventListener("mouseenter",()=>cursor.classList.add("is-hover"));el.addEventListener("mouseleave",()=>cursor.classList.remove("is-hover"));}); }
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDetail();closeGallery();}});
