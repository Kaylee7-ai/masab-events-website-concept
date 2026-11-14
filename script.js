/* ============ EDIT THIS SECTION ============ */
const CONFIG = {
  whatsapp: "233262744322",   // WhatsApp number in international format, no + or spaces
  business: "Masab Events"
};

const SERVICES = [
  { n: "Planning & Coordination", d: "Your day organised from the first idea to the last guest." },
  { n: "Décor", d: "Engagement, church and reception styling." },
  { n: "Wedding Gown", d: "The gown for your big day." },
  { n: "Hair & Makeup", d: "Bridal beauty that lasts all day." },
  { n: "Bridal Accessories", d: "The finishing touches for the bride." },
  { n: "Catering", d: "Buffet or packed meals for your guests." },
  { n: "Beverages", d: "Cocktail, local bar, canned and bottled drinks, wine and champagne." },
  { n: "Cake", d: "A cake made for your celebration." },
  { n: "Dowry Wrapping, Bearing & Ushering", d: "Beautifully wrapped, carried and presented." },
  { n: "Bridal Shower", d: "Including bridal room styling." },
  { n: "Photography & Videography", d: "Memories captured as they happen." },
  { n: "Invitations & Stationery", d: "Cards and printed details that set the tone." },
  { n: "Souvenirs", d: "Keepsakes your guests will remember." },
  { n: "MC & DJ", d: "Music and hosting that keep the energy high." },
  { n: "Pre-wedding & Save-the-date Photos", d: "Photo shoots before the big day." },
  { n: "Other Wedding Needs", d: "Tell us what you need and we’ll take care of it." }
];
const EVENTS = ["Wedding", "Engagement", "Traditional / dowry", "Bridal shower", "Pre-wedding shoot", "Other event"];
/* ============================================ */

const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let event = "Wedding";
let picked = [];

/* ---------- Marquee + services ---------- */
const names = SERVICES.map(s => \`<span>\${s.n}</span>\`).join("");
$("#marquee").innerHTML = names + names;
$("#servicesList").innerHTML = SERVICES.map((s, i) => \`
  <article class="svc reveal">
    <span class="num">\${String(i + 1).padStart(2, "0")}</span>
    <div><h3>\${s.n}</h3><p>\${s.d}</p></div>
    <span class="arrow" aria-hidden="true">↗</span>
  </article>\`).join("");

/* ---------- Planner ---------- */
$("#eventPills").innerHTML = EVENTS.map(e => \`<button type="button" class="pill" data-event="\${e}" aria-pressed="false">\${e}</button>\`).join("");
$("#serviceChips").innerHTML = SERVICES.map(s => \`<button type="button" class="pill" data-svc="\${s.n}" aria-pressed="false">\${s.n}</button>\`).join("");
$("#fDate").min = new Date().toISOString().slice(0, 10);

$("#eventPills").addEventListener("click", e => {
  const b = e.target.closest("[data-event]"); if (!b) return;
  event = b.dataset.event; update();
});
$("#serviceChips").addEventListener("click", e => {
  const b = e.target.closest("[data-svc]"); if (!b) return;
  const v = b.dataset.svc;
  picked = picked.includes(v) ? picked.filter(x => x !== v) : [...picked, v];
  update();
});
["fName", "fDate", "fGuests", "fVenue", "fNotes"].forEach(id => {
  $("#" + id).addEventListener("input", update);
  $("#" + id).addEventListener("change", update);
});

function rows() {
  return [
    ["Event", event],
    ["Date", $("#fDate").value || "To be confirmed"],
    ["Guests", $("#fGuests").value],
    ["Venue", $("#fVenue").value.trim() || "Not decided"],
    ["Services", picked.length ? picked.length + " selected" : "None yet"]
  ];
}
function message() {
  const name = $("#fName").value.trim(), notes = $("#fNotes").value.trim(), r = rows();
  return \`Hello \${CONFIG.business}! I’d like to enquire about planning an event.\\n\\n\` +
    \`• Event: \${r[0][1]}\\n• Date: \${r[1][1]}\\n• Guests: \${r[2][1]}\\n• Venue: \${r[3][1]}\\n\` +
    \`• Services needed: \${picked.length ? picked.join(", ") : "Not sure yet, please advise"}\` +
    (notes ? \`\\n• Notes: \${notes}\` : "") + (name ? \`\\n\\nName: \${name}\` : "") +
    \`\\n\\nPlease let me know availability and pricing. Thank you!\`;
}
function update() {
  $$("[data-event]").forEach(b => b.setAttribute("aria-pressed", b.dataset.event === event));
  $$("[data-svc]").forEach(b => b.setAttribute("aria-pressed", picked.includes(b.dataset.svc)));
  $("#summary").innerHTML = rows().map(([a, b]) => \`<li><span>\${a}</span><span>\${b}</span></li>\`).join("");
  const url = \`https://wa.me/\${CONFIG.whatsapp}?text=\${encodeURIComponent(message())}\`;
  $("#sendWA").href = url; $("#floatWA").href = url;
}

let tt;
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("show"), 2600); }
$("#copyBtn").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(message()); toast("Event details copied"); }
  catch (e) {
    const ta = document.createElement("textarea"); ta.value = message(); document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("Event details copied"); } catch (_) { toast("Couldn’t copy, please try again"); }
    ta.remove();
  }
});

/* ---------- Nav: solid on scroll + mobile menu ---------- */
const nav = $("#nav"), menuBtn = $("#menuBtn"), links = $("#navLinks");
function closeMenu() { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.textContent = "☰"; }
menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open); menuBtn.textContent = open ? "✕" : "☰";
});
links.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });

/* ---------- Hero parallax + nav state (one scroll handler) ---------- */
const heroBg = $("#heroBg");
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("solid", y > 40);
  if (!reduce && y < window.innerHeight * 1.3) heroBg.style.transform = \`translate3d(0, \${y * 0.25}px, 0)\`;
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------- Gallery arrows ---------- */
const track = $("#track");
$("#galPrev").addEventListener("click", () => track.scrollBy({ left: -track.clientWidth * 0.7, behavior: "smooth" }));
$("#galNext").addEventListener("click", () => track.scrollBy({ left: track.clientWidth * 0.7, behavior: "smooth" }));

/* ---------- Scroll reveal ---------- */
const items = $$(".reveal");
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.1 });
  items.forEach(el => io.observe(el));
} else {
  items.forEach(el => el.classList.add("in"));
}

/* ---------- Init ---------- */
update();