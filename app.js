/* Freezeclub — Frozen Identity (v0.1)
   Premium MVP: Avatar, FrostPoints, Shop, Challenges, Leaderboard */

const STORAGE_KEY = "freezeclub.v1";
const SEASON = { id: "S01", name: "Winter Cryo", daysLeft: 47 };

const SERVICES = [
  { id: "cryo",  name: "Kältekammer",      meta: "3 Min · -85°C",     points: 100 },
  { id: "lymph", name: "Lymphdrainage",    meta: "30 Min",            points: 75 },
  { id: "scan",  name: "4D-Bodyscan",      meta: "10 Min",            points: 150 },
  { id: "combo", name: "Kombi-Session",    meta: "2+ Anwendungen",    points: 230 },
];

const RANKS = [
  { name: "Rookie",    min: 0 },
  { name: "Explorer",  min: 500 },
  { name: "Adept",     min: 1200 },
  { name: "Elite",     min: 2500 },
  { name: "Master",    min: 5000 },
  { name: "Legend",    min: 10000 },
];

const LEVEL_STEP = 500;

const SHOP_ITEMS = [
  { id: "aura-frost",   name: "Frost Aura",        cat: "aura", price: 250,  emoji: "❄️", limited: false },
  { id: "aura-arctic",  name: "Arctic Glow",       cat: "aura", price: 600,  emoji: "✨", limited: false },
  { id: "aura-cryo",    name: "Cryo Crystals",     cat: "aura", price: 1400, emoji: "💎", limited: true  },
  { id: "gear-suit",    name: "Cryo Suit",         cat: "gear", price: 800,  emoji: "🥼", limited: false },
  { id: "gear-mask",    name: "Breath Mask",       cat: "gear", price: 450,  emoji: "😷", limited: false },
  { id: "gear-visor",   name: "Lab Visor",         cat: "gear", price: 700,  emoji: "🥽", limited: false },
  { id: "gear-hoodie",  name: "Recovery Hoodie",   cat: "gear", price: 550,  emoji: "🧊", limited: false },
  { id: "env-cave",     name: "Ice Cave",          cat: "env",  price: 1100, emoji: "🏔️", limited: false },
  { id: "env-lab",      name: "Bio Lab",           cat: "env",  price: 900,  emoji: "🧪", limited: false },
  { id: "env-summit",   name: "Alpine Summit",     cat: "env",  price: 1800, emoji: "⛰️", limited: true  },
];

const ACHIEVEMENTS = [
  { id: "first-freeze",  name: "First Freeze",   desc: "Erster Besuch",       icon: "❄",  test: s => s.visits >= 1 },
  { id: "streak-3",      name: "On Streak",      desc: "3 Tage in Folge",     icon: "🔥", test: s => s.streak >= 3 },
  { id: "ice-veteran",   name: "Ice Veteran",    desc: "10 Kammer-Sessions",  icon: "🥶", test: s => (s.counts.cryo || 0) >= 10 },
  { id: "full-scan",     name: "Full Scan",      desc: "3 Bodyscans",         icon: "📊", test: s => (s.counts.scan || 0) >= 3 },
  { id: "combo-master",  name: "Combo Master",   desc: "5 Kombi-Sessions",    icon: "⚡", test: s => (s.counts.combo || 0) >= 5 },
  { id: "collector",     name: "Collector",      desc: "3 Items im Inventar", icon: "💠", test: s => s.inventory.length >= 3 },
];

const CHALLENGES = [
  { id: "ch-week",    title: "3 Sessions in 7 Tagen",   desc: "Sammle drei beliebige Anwendungen in dieser Woche.", goal: 3,  reward: 250, kind: "visits" },
  { id: "ch-cryo",    title: "Cold Focus",              desc: "Drei Kaltekammer-Sessions diesen Monat.",            goal: 3,  reward: 300, kind: "service", svc: "cryo" },
  { id: "ch-combo",   title: "Combo Hunter",            desc: "Zwei Kombi-Sessions hintereinander.",                goal: 2,  reward: 400, kind: "service", svc: "combo" },
  { id: "ch-scan",    title: "Track your progress",     desc: "Buche einen 4D-Bodyscan.",                           goal: 1,  reward: 200, kind: "service", svc: "scan" },
];

const LEADERBOARD_MOCK = [
  { name: "Marlene K.",  pts: 4280 },
  { name: "Tobias R.",   pts: 3915 },
  { name: "Sophia L.",   pts: 3540 },
  { name: "Lukas B.",    pts: 3120 },
  { name: "Anna P.",     pts: 2780 },
  { name: "David S.",    pts: 2410 },
  { name: "Mira H.",     pts: 2090 },
  { name: "Jonas W.",    pts: 1830 },
  { name: "Pauline G.",  pts: 1640 },
];

/* ---------- Utils ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

/* ---------- State ---------- */
const defaultState = () => ({
  onboarded: false,
  firstName: "",
  goal: "recovery",
  style: "arctic",
  userId: "FZ-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  points: 0,
  seasonPoints: 0,
  totalPoints: 0,
  visits: 0,
  streak: 0,
  lastVisitDate: null,
  counts: {},
  inventory: [],
  equipped: { aura: null, gear: null, env: null },
  challengeProgress: {},
  createdAt: new Date().toISOString(),
});

let state = load();

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  }catch(e){ return defaultState(); }
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

/* ---------- Avatar SVG ---------- */
function renderAvatar(target, opts = {}){
  const style = opts.style || state.style || "arctic";
  const aura = opts.aura || state.equipped.aura;
  const gear = opts.gear || state.equipped.gear;

  const palette = {
    arctic:  { skin: "#e8d6c4", suit: "#3a4a5c", glow: "#9fd6e3" },
    lab:     { skin: "#e6d2bd", suit: "#5b6577", glow: "#bcd1e0" },
    athlete: { skin: "#dcc1aa", suit: "#1a2738", glow: "#7fb4c3" },
  }[style] || { skin: "#e8d6c4", suit: "#3a4a5c", glow: "#9fd6e3" };

  const auraColor = aura === "aura-cryo" ? "#74e4f4" : aura === "aura-arctic" ? "#b8e6f0" : aura === "aura-frost" ? "#a8d8e8" : "transparent";
  const showMask = gear === "gear-mask";
  const showVisor = gear === "gear-visor";
  const hasHoodie = gear === "gear-hoodie";

  target.innerHTML = `
    ${aura ? '<div class="aura-ring" style="background: radial-gradient(circle, '+auraColor+'55, transparent 70%)"></div>' : ''}
    <svg viewBox="0 0 240 240" width="80%" height="80%" xmlns="http://www.w3.org/2000/svg" style="position:relative;z-index:2">
      <defs>
        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
          <stop offset="1" stop-color="${palette.glow}" stop-opacity=".3"/>
        </linearGradient>
        <radialGradient id="skin">
          <stop offset="0" stop-color="${palette.skin}"/>
          <stop offset="1" stop-color="${shade(palette.skin, -18)}"/>
        </radialGradient>
      </defs>
      <path d="M30,240 C 40,180 80,160 120,160 C 160,160 200,180 210,240 Z" fill="${hasHoodie ? '#1a2738' : palette.suit}"/>
      ${hasHoodie ? `<path d="M70,170 Q120,140 170,170 L165,200 Q120,180 75,200 Z" fill="#0b1320" opacity=".4"/>` : ''}
      <rect x="106" y="135" width="28" height="28" rx="6" fill="url(#skin)"/>
      <ellipse cx="120" cy="105" rx="42" ry="48" fill="url(#skin)"/>
      ${hasHoodie
        ? `<path d="M70,95 Q120,40 170,95 Q170,75 120,55 Q70,75 70,95 Z" fill="#0b1320"/>`
        : `<path d="M78,90 Q120,55 162,90 Q160,70 120,62 Q80,70 78,90 Z" fill="#2d3a4d"/>`}
      ${showVisor
        ? `<rect x="78" y="98" width="84" height="18" rx="9" fill="#0b1320" opacity=".85"/>
           <rect x="82" y="100" width="76" height="6" rx="3" fill="${palette.glow}" opacity=".5"/>`
        : `<circle cx="105" cy="108" r="3.5" fill="#0b1320"/>
           <circle cx="135" cy="108" r="3.5" fill="#0b1320"/>`}
      ${!showMask && !showVisor ? `<path d="M120,115 Q118,124 121,128" stroke="${shade(palette.skin,-25)}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` : ''}
      ${showMask
        ? `<path d="M88,125 Q120,150 152,125 L150,140 Q120,158 90,140 Z" fill="#e7ecf2"/>
           <line x1="92" y1="135" x2="148" y2="135" stroke="#cdd5df" stroke-width="1"/>`
        : `<path d="M110,130 Q120,135 130,130" stroke="${shade(palette.skin,-30)}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`}
      <circle cx="78" cy="80" r="2" fill="#fff" opacity=".8"/>
      <circle cx="172" cy="92" r="1.5" fill="#fff" opacity=".7"/>
      <circle cx="92" cy="135" r="1.5" fill="#fff" opacity=".6"/>
    </svg>
  `;
}

function shade(hex, amt){
  const c = hex.replace("#","");
  const num = parseInt(c, 16);
  let r = (num >> 16) + amt; let g = ((num >> 8) & 0xff) + amt; let b = (num & 0xff) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + ((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
}

/* ---------- QR (deterministic visual code) ---------- */
function renderQR(target, text){
  const size = 25;
  const seed = hashString(text);
  let svg = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="#fff"/>`;
  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      const finder = (x<7 && y<7) || (x>=size-7 && y<7) || (x<7 && y>=size-7);
      if(finder){
        const baseX = x<7?0: size-7;
        const baseY = y<7?0: size-7;
        const lx = x-baseX, ly = y-baseY;
        const ring = lx===0||lx===6||ly===0||ly===6;
        const center = lx>=2&&lx<=4&&ly>=2&&ly<=4;
        if(ring || center) svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0b1320"/>`;
        continue;
      }
      const n = (seed * (x+1) * (y+1) * 9301 + 49297) % 233280;
      if((n/233280) > 0.52) svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0b1320"/>`;
    }
  }
  svg += `</svg>`;
  target.innerHTML = svg;
}
function hashString(s){ let h=0; for(let i=0;i<s.length;i++){ h = ((h<<5)-h) + s.charCodeAt(i); h|=0 } return Math.abs(h)||1 }

/* ---------- Rank ---------- */
function rankFor(total){
  let r = RANKS[0];
  for(const x of RANKS) if(total >= x.min) r = x;
  return r;
}

/* ---------- Rendering ---------- */
function renderAll(){
  $("#topPoints").textContent = state.points.toLocaleString("de-DE");
  $("#shopPoints").textContent = state.points.toLocaleString("de-DE");
  $("#greetName").textContent = state.firstName || "Member";
  $("#streakCount").textContent = state.streak;

  const level = Math.floor(state.seasonPoints / LEVEL_STEP) + 1;
  const into = state.seasonPoints % LEVEL_STEP;
  $("#levelNum").textContent = level;
  $("#seasonPoints").textContent = into;
  $("#seasonGoal").textContent = LEVEL_STEP;
  $("#levelFill").style.width = (into/LEVEL_STEP*100) + "%";
  $("#rankLabel").textContent = rankFor(state.totalPoints).name;

  $("#statSeason").textContent = state.seasonPoints.toLocaleString("de-DE");
  $("#statTotal").textContent  = state.totalPoints.toLocaleString("de-DE");
  $("#statVisits").textContent = state.visits;

  renderAvatar($("#avatarStage"));

  $("#userId").textContent = state.userId;
  renderQR($("#qrCode"), state.userId);

  $("#services").innerHTML = SERVICES.map(s => `
    <div class="service">
      <div class="service__info">
        <span class="service__name">${esc(s.name)}</span>
        <span class="service__meta">${esc(s.meta)} · +${s.points} FP</span>
      </div>
      <button class="btn--equip" data-service="${esc(s.id)}">Buchen</button>
    </div>
  `).join("");

  renderShop();

  $("#achievementsList").innerHTML = ACHIEVEMENTS.map(a => {
    const got = a.test(state);
    return `<li class="ach ${got?'':'is-locked'}">
      <span class="ach__icon">${esc(a.icon)}</span>
      <div><div class="ach__name">${esc(a.name)}</div><div class="ach__desc">${esc(a.desc)}</div></div>
    </li>`;
  }).join("");

  $("#challengesList").innerHTML = CHALLENGES.map(c => {
    const prog = state.challengeProgress[c.id] || 0;
    const pct = Math.min(100, prog/c.goal*100);
    const done = prog >= c.goal;
    return `<article class="challenge">
      <div class="challenge__head">
        <div>
          <span class="eyebrow">Challenge</span>
          <h3 class="challenge__title">${esc(c.title)}</h3>
        </div>
        <span class="challenge__reward">+${c.reward} FP</span>
      </div>
      <p class="muted" style="margin:0;font-size:14px">${esc(c.desc)}</p>
      <div class="challenge__progress">
        <div class="progress__bar"><div class="progress__fill" style="width:${pct}%"></div></div>
        <div class="progress__meta"><span>${prog} / ${c.goal}</span><span class="muted">${done?'Abgeschlossen':'Aktiv'}</span></div>
      </div>
    </article>`;
  }).join("");

  const me = { name: (state.firstName || "Du") + " (Du)", pts: state.seasonPoints, me: true };
  const list = [...LEADERBOARD_MOCK, me].sort((a,b)=>b.pts-a.pts).slice(0, 12);
  $("#leaderboardList").innerHTML = list.map((u,i)=>`
    <li class="${u.me?'is-me':''}">
      <span class="rank">${i+1}</span>
      <span class="lb-name">${esc(u.name)}</span>
      <span class="lb-points">${u.pts.toLocaleString("de-DE")} FP</span>
    </li>
  `).join("");
}

let currentFilter = "all";
function renderShop(filter = currentFilter){
  const items = SHOP_ITEMS.filter(i => filter === "all" || i.cat === filter);
  $("#shopGrid").innerHTML = items.map(i => {
    const owned = state.inventory.includes(i.id);
    const equipped = state.equipped[i.cat] === i.id;
    const canBuy = state.points >= i.price;
    return `<article class="item">
      <div class="item__preview ${i.limited?'is-limited':''}">${i.emoji}</div>
      <span class="item__category">${catLabel(i.cat)}</span>
      <span class="item__name">${esc(i.name)}</span>
      <div class="item__footer">
        ${owned
          ? `<span class="price is-owned">Im Inventar</span>
             <button class="btn--equip ${equipped?'is-equipped':''}" data-equip="${esc(i.id)}">${equipped?'Aktiv':'Tragen'}</button>`
          : `<span class="price">${i.price} FP</span>
             <button class="btn--buy" data-buy="${esc(i.id)}" ${canBuy?'':'disabled'}>${canBuy?'Kaufen':'Zu wenig FP'}</button>`}
      </div>
    </article>`;
  }).join("");
}
function catLabel(c){ return { aura:"Aura", gear:"Gear", env:"Environment" }[c] || c }

/* ---------- Actions ---------- */
function bookService(id){
  const svc = SERVICES.find(s=>s.id===id);
  if(!svc) return;
  const pts = svc.points;
  state.points += pts;
  state.seasonPoints += pts;
  state.totalPoints += pts;
  state.visits += 1;
  state.counts[id] = (state.counts[id]||0) + 1;

  const today = new Date().toDateString();
  const last = state.lastVisitDate ? new Date(state.lastVisitDate).toDateString() : null;
  if(last !== today){
    const yest = new Date(Date.now()-86400000).toDateString();
    state.streak = (last === yest) ? state.streak + 1 : 1;
    state.lastVisitDate = new Date().toISOString();
  }

  for(const c of CHALLENGES){
    if(c.kind === "visits") bumpChallenge(c, 1);
    if(c.kind === "service" && c.svc === id) bumpChallenge(c, 1);
  }

  save();
  renderAll();
  toast(`+${pts} FrostPoints für ${svc.name}`);
}

function bumpChallenge(c, by){
  const prev = state.challengeProgress[c.id] || 0;
  const next = prev + by;
  state.challengeProgress[c.id] = next;
  if(prev < c.goal && next >= c.goal){
    state.points += c.reward;
    state.seasonPoints += c.reward;
    state.totalPoints += c.reward;
    setTimeout(() => toast(`Challenge erfüllt: ${c.title} (+${c.reward} FP)`, 3200), 700);
  }
}

function buyItem(id){
  const item = SHOP_ITEMS.find(i=>i.id===id);
  if(!item || state.points < item.price || state.inventory.includes(id)) return;
  state.points -= item.price;
  state.inventory.push(id);
  state.equipped[item.cat] = id;
  save();
  renderAll();
  toast(`${item.name} freigeschaltet`);
}

function equipItem(id){
  const item = SHOP_ITEMS.find(i=>i.id===id);
  if(!item || !state.inventory.includes(id)) return;
  state.equipped[item.cat] = state.equipped[item.cat] === id ? null : id;
  save();
  renderAll();
}

function toast(msg, ms=2200){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(()=>t.classList.remove("is-show"), ms);
}

/* ---------- Tabs ---------- */
function showTab(name){
  $$(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.tab === name));
  $$(".view").forEach(v => v.classList.toggle("is-active", v.id === "view-"+name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Events ---------- */
function bindEvents(){
  $("#onboardingForm").addEventListener("submit", e => {
    e.preventDefault();
    state.firstName = $("#firstName").value.trim() || "Member";
    state.goal = $("#goal").value;
    state.style = $$('input[name="style"]').find(r=>r.checked).value;
    state.onboarded = true;
    state.points = 200;
    state.totalPoints = 200;
    state.seasonPoints = 200;
    save();
    enterApp();
    toast("Willkommen im Freezeclub. +200 FP", 3000);
  });

  $$('input[name="style"]').forEach(r => r.addEventListener("change", () => {
    renderAvatar($("#onboardingAvatar"), { style: $$('input[name="style"]').find(r=>r.checked).value });
  }));

  $$(".tab").forEach(t => t.addEventListener("click", () => showTab(t.dataset.tab)));
  $$("[data-go]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.go)));

  document.addEventListener("click", (e) => {
    const svc = e.target.closest("[data-service]");
    if(svc) bookService(svc.dataset.service);
    const buy = e.target.closest("[data-buy]");
    if(buy) buyItem(buy.dataset.buy);
    const eq = e.target.closest("[data-equip]");
    if(eq) equipItem(eq.dataset.equip);
  });

  $("#shopFilters").addEventListener("click", e => {
    const c = e.target.closest(".chip");
    if(!c) return;
    $$("#shopFilters .chip").forEach(x => x.classList.remove("is-active"));
    c.classList.add("is-active");
    currentFilter = c.dataset.filter;
    renderShop(currentFilter);
  });

  $("#resetBtn").addEventListener("click", () => {
    if(!confirm("Wirklich zurücksetzen? Alle Punkte und Items gehen verloren.")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

/* ---------- Boot ---------- */
function enterApp(){
  $("#screen-onboarding").classList.add("hidden");
  $("#main").classList.remove("hidden");
  renderAll();
}

function boot(){
  bindEvents();
  renderAvatar($("#onboardingAvatar"), { style: state.style });
  if(state.onboarded) enterApp();
}

document.addEventListener("DOMContentLoaded", boot);
