/* Freezeclub — Frozen Identity v0.2
   Premium Game UI: animations, level-up, loot reveal, sound, particles */

const STORAGE_KEY = "freezeclub.v2";
const SEASON = { id: "S01", name: "Winter Cryo", daysLeft: 47 };

const SERVICES = [
  { id: "cryo",  name: "Kältekammer",   meta: "3 Min · -85°C",  points: 100, icon: "❄" },
  { id: "lymph", name: "Lymphdrainage", meta: "30 Min",         points: 75,  icon: "≋" },
  { id: "scan",  name: "4D-Bodyscan",   meta: "10 Min",         points: 150, icon: "◉" },
  { id: "combo", name: "Kombi-Session", meta: "2+ Anwendungen", points: 230, icon: "✦" },
];

const RANKS = [
  { name: "Rookie",   min: 0 },
  { name: "Explorer", min: 500 },
  { name: "Adept",    min: 1200 },
  { name: "Elite",    min: 2500 },
  { name: "Master",   min: 5000 },
  { name: "Legend",   min: 10000 },
];

const LEVEL_STEP = 500;

const SHOP_ITEMS = [
  { id: "aura-frost",  name: "Frost Aura",      cat: "aura", price: 250,  emoji: "❄", limited: false },
  { id: "aura-arctic", name: "Arctic Glow",     cat: "aura", price: 600,  emoji: "✨", limited: false },
  { id: "aura-cryo",   name: "Cryo Crystals",   cat: "aura", price: 1400, emoji: "💎", limited: true  },
  { id: "gear-suit",   name: "Cryo Suit",       cat: "gear", price: 800,  emoji: "🥼", limited: false },
  { id: "gear-mask",   name: "Breath Mask",     cat: "gear", price: 450,  emoji: "😷", limited: false },
  { id: "gear-visor",  name: "Lab Visor",       cat: "gear", price: 700,  emoji: "🥽", limited: false },
  { id: "gear-hoodie", name: "Recovery Hoodie", cat: "gear", price: 550,  emoji: "🧊", limited: false },
  { id: "env-cave",    name: "Ice Cave",        cat: "env",  price: 1100, emoji: "🏔", limited: false },
  { id: "env-lab",     name: "Bio Lab",         cat: "env",  price: 900,  emoji: "🧪", limited: false },
  { id: "env-summit",  name: "Alpine Summit",   cat: "env",  price: 1800, emoji: "⛰", limited: true  },
];

const ACHIEVEMENTS = [
  { id: "first-freeze", name: "First Freeze",  desc: "Erster Besuch",       icon: "❄", test: s => s.visits >= 1 },
  { id: "streak-3",     name: "On Streak",     desc: "3 Tage in Folge",     icon: "▲", test: s => s.streak >= 3 },
  { id: "ice-veteran",  name: "Ice Veteran",   desc: "10 Kammer-Sessions",  icon: "✦", test: s => (s.counts.cryo || 0) >= 10 },
  { id: "full-scan",    name: "Full Scan",     desc: "3 Bodyscans",         icon: "◉", test: s => (s.counts.scan || 0) >= 3 },
  { id: "combo-master", name: "Combo Master",  desc: "5 Kombi-Sessions",    icon: "⚡", test: s => (s.counts.combo || 0) >= 5 },
  { id: "collector",    name: "Collector",     desc: "3 Items im Inventar", icon: "◆", test: s => s.inventory.length >= 3 },
];

const CHALLENGES = [
  { id: "ch-week",  title: "Triple Threat",       desc: "Sammle drei beliebige Anwendungen in dieser Woche.", goal: 3, reward: 250, kind: "visits" },
  { id: "ch-cryo",  title: "Cold Focus",          desc: "Drei Kältekammer-Sessions diesen Monat.",            goal: 3, reward: 300, kind: "service", svc: "cryo" },
  { id: "ch-combo", title: "Combo Hunter",        desc: "Zwei Kombi-Sessions hintereinander.",                goal: 2, reward: 400, kind: "service", svc: "combo" },
  { id: "ch-scan",  title: "Body Mapping",        desc: "Buche einen 4D-Bodyscan.",                           goal: 1, reward: 200, kind: "service", svc: "scan" },
];

const LEADERBOARD_MOCK = [
  { name: "Marlene K.", pts: 4280 },
  { name: "Tobias R.",  pts: 3915 },
  { name: "Sophia L.",  pts: 3540 },
  { name: "Lukas B.",   pts: 3120 },
  { name: "Anna P.",    pts: 2780 },
  { name: "David S.",   pts: 2410 },
  { name: "Mira H.",    pts: 2090 },
  { name: "Jonas W.",   pts: 1830 },
  { name: "Pauline G.", pts: 1640 },
];

/* ---------- Utils ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
const sleep = ms => new Promise(r=>setTimeout(r,ms));

/* ---------- State ---------- */
const defaultState = () => ({
  onboarded: false,
  firstName: "", goal: "recovery", style: "arctic",
  userId: "FZ-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  points: 0, seasonPoints: 0, totalPoints: 0,
  visits: 0, streak: 0, lastVisitDate: null,
  level: 1,
  counts: {}, inventory: [],
  equipped: { aura: null, gear: null, env: null },
  challengeProgress: {}, unlockedAchievements: [],
  soundOn: true,
  avatar: window.defaultAvatar ? window.defaultAvatar() : null,
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

/* ---------- Sound (Web Audio synth — no assets) ---------- */
let audioCtx = null;
function ensureAudio(){
  if(!audioCtx){
    try{ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){}
  }
  return audioCtx;
}
function sfx(type){
  if(!state.soundOn) return;
  const ctx = ensureAudio(); if(!ctx) return;
  const now = ctx.currentTime;
  if(type === "point"){
    tone(880, .08, .04, "sine", now);
    tone(1320, .12, .04, "sine", now + .05);
  } else if (type === "buy"){
    tone(523, .1, .05, "triangle", now);
    tone(784, .1, .05, "triangle", now + .08);
    tone(1047, .18, .06, "triangle", now + .16);
  } else if (type === "levelup"){
    [523, 659, 784, 1047, 1319].forEach((f,i) => tone(f, .15, .06, "sine", now + i*.08));
  } else if (type === "click"){
    tone(660, .05, .03, "square", now);
  } else if (type === "achievement"){
    tone(880, .12, .05, "sine", now);
    tone(1175, .12, .05, "sine", now + .1);
    tone(1568, .2, .06, "sine", now + .2);
  }
}
function tone(freq, dur, vol, type, t){
  const ctx = audioCtx; if(!ctx) return;
  const osc = ctx.createOscillator(); const g = ctx.createGain();
  osc.type = type; osc.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + .01);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t); osc.stop(t + dur + .05);
}

/* ---------- Avatar SVG (v2 wrapper) ---------- */
function renderAvatar(target, opts = {}){
  if(window.renderAvatarV2 && state.avatar){
    return window.renderAvatarV2(target, opts.avatar || state.avatar, opts.equipped || state.equipped);
  }
  return _renderAvatarLegacy(target, opts);
}
function _renderAvatarLegacy(target, opts = {}){
  const style = opts.style || state.style || "arctic";
  const aura = opts.aura || state.equipped.aura;
  const gear = opts.gear || state.equipped.gear;

  const palette = {
    arctic:  { skin: "#e8d6c4", suit: "#3a4a5c", glow: "#9fd6e3", hair: "#2d3a4d" },
    lab:     { skin: "#e6d2bd", suit: "#5b6577", glow: "#bcd1e0", hair: "#3d4658" },
    athlete: { skin: "#dcc1aa", suit: "#1a2738", glow: "#7fb4c3", hair: "#1a1f2a" },
  }[style] || { skin: "#e8d6c4", suit: "#3a4a5c", glow: "#9fd6e3", hair: "#2d3a4d" };

  const auraColor = aura === "aura-cryo" ? "#74e4f4" : aura === "aura-arctic" ? "#b8e6f0" : aura === "aura-frost" ? "#a8d8e8" : null;
  const showMask = gear === "gear-mask";
  const showVisor = gear === "gear-visor";
  const hasHoodie = gear === "gear-hoodie";

  target.innerHTML = `
    ${auraColor ? `<div style="position:absolute;inset:5%;border-radius:50%;background:radial-gradient(circle, ${auraColor}55, transparent 65%);filter:blur(6px);animation:pulse 4s ease-in-out infinite"></div>` : ''}
    <svg viewBox="0 0 240 260" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:relative;z-index:2">
      <defs>
        <radialGradient id="skin">
          <stop offset="0" stop-color="${palette.skin}"/>
          <stop offset="1" stop-color="${shade(palette.skin, -22)}"/>
        </radialGradient>
        <linearGradient id="suit" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="${shade(palette.suit, 10)}"/>
          <stop offset="1" stop-color="${shade(palette.suit, -10)}"/>
        </linearGradient>
        <radialGradient id="aura-bg">
          <stop offset="0" stop-color="${palette.glow}" stop-opacity=".25"/>
          <stop offset="1" stop-color="${palette.glow}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="200" rx="80" ry="20" fill="url(#aura-bg)"/>
      <path d="M30,260 C 40,200 75,170 120,170 C 165,170 200,200 210,260 Z" fill="${hasHoodie ? '#0b1320' : 'url(#suit)'}"/>
      ${hasHoodie ? `<path d="M65,190 Q120,160 175,190 L170,225 Q120,205 70,225 Z" fill="#06090f" opacity=".5"/>` : ''}
      <path d="M120,168 L122,165 L120,162 L118,165 Z" fill="${palette.glow}" opacity=".7"/>
      <rect x="105" y="140" width="30" height="32" rx="6" fill="url(#skin)"/>
      <ellipse cx="120" cy="105" rx="44" ry="50" fill="url(#skin)"/>
      ${hasHoodie
        ? `<path d="M68,95 Q120,38 172,95 Q172,72 120,52 Q68,72 68,95 Z" fill="#06090f"/>
           <path d="M68,95 Q120,45 172,95" fill="none" stroke="${palette.glow}" stroke-width="1" opacity=".4"/>`
        : `<path d="M76,90 Q120,52 164,90 Q162,68 120,60 Q78,68 76,90 Z" fill="${palette.hair}"/>`}
      ${showVisor
        ? `<rect x="76" y="96" width="88" height="20" rx="10" fill="#06090f" opacity=".9"/>
           <rect x="80" y="100" width="80" height="6" rx="3" fill="${palette.glow}" opacity=".7"/>
           <rect x="84" y="101" width="20" height="3" rx="1" fill="#fff" opacity=".4"/>`
        : `<ellipse cx="105" cy="108" rx="3.5" ry="4" fill="#06090f"/>
           <ellipse cx="135" cy="108" rx="3.5" ry="4" fill="#06090f"/>
           <ellipse cx="106" cy="107" rx="1" ry="1.2" fill="#fff"/>
           <ellipse cx="136" cy="107" rx="1" ry="1.2" fill="#fff"/>`}
      ${!showMask && !showVisor ? `<path d="M120,116 Q117,125 121,130" stroke="${shade(palette.skin,-30)}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` : ''}
      ${showMask
        ? `<path d="M86,124 Q120,152 154,124 L152,142 Q120,160 88,142 Z" fill="#e7ecf2" stroke="#cdd5df" stroke-width=".5"/>
           <line x1="92" y1="136" x2="148" y2="136" stroke="#cdd5df" stroke-width="1"/>
           <circle cx="120" cy="142" r="3" fill="${palette.glow}" opacity=".6"/>`
        : `<path d="M110,131 Q120,137 130,131" stroke="${shade(palette.skin,-32)}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`}
      <circle cx="78" cy="80" r="2" fill="${palette.glow}" opacity=".9"/>
      <circle cx="172" cy="92" r="1.5" fill="${palette.glow}" opacity=".8"/>
      <circle cx="92" cy="135" r="1.5" fill="${palette.glow}" opacity=".7"/>
      <circle cx="155" cy="140" r="1.2" fill="${palette.glow}" opacity=".6"/>
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

/* ---------- Frost particles ---------- */
function spawnFrostParticles(){
  const stage = $(".avatar-stage");
  if(!stage) return;
  setInterval(() => {
    if(document.hidden) return;
    const p = document.createElement("div");
    p.className = "frost-particle";
    p.style.left = Math.random()*100 + "%";
    p.style.top = Math.random()*100 + "%";
    p.style.opacity = ".6";
    p.style.transition = "all 3s ease-out";
    stage.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${(Math.random()-.5)*40}px, ${-30-Math.random()*40}px)`;
      p.style.opacity = "0";
    });
    setTimeout(() => p.remove(), 3200);
  }, 900);
}

/* ---------- QR ---------- */
function renderQR(target, text){
  const size = 25; const seed = hashString(text);
  let svg = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="#fff"/>`;
  for(let y=0;y<size;y++){
    for(let x=0;x<size;x++){
      const finder = (x<7 && y<7) || (x>=size-7 && y<7) || (x<7 && y>=size-7);
      if(finder){
        const baseX = x<7?0: size-7; const baseY = y<7?0: size-7;
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

/* ---------- Animated counter ---------- */
function animateNumber(el, to, dur=800){
  if(!el) return;
  const from = parseInt((el.textContent||"0").replace(/\D/g,"")) || 0;
  if(from === to){ el.textContent = to.toLocaleString("de-DE"); return; }
  const start = performance.now();
  el.classList.add("is-rolling");
  function step(now){
    const t = Math.min(1, (now-start)/dur);
    const eased = 1 - Math.pow(1-t, 3);
    const v = Math.round(from + (to-from)*eased);
    el.textContent = v.toLocaleString("de-DE");
    if(t<1) requestAnimationFrame(step);
    else setTimeout(()=>el.classList.remove("is-rolling"), 200);
  }
  requestAnimationFrame(step);
}

/* ---------- Rank ---------- */
function rankFor(total){
  let r = RANKS[0];
  for(const x of RANKS) if(total >= x.min) r = x;
  return r;
}

/* ---------- Rendering ---------- */
function renderAll(animate=false){
  if(animate){
    animateNumber($("#topPoints"), state.points);
    animateNumber($("#shopPoints"), state.points);
    animateNumber($("#statSeason"), state.seasonPoints);
    animateNumber($("#statTotal"), state.totalPoints);
    animateNumber($("#statVisits"), state.visits);
  } else {
    $("#topPoints").textContent = state.points.toLocaleString("de-DE");
    $("#shopPoints").textContent = state.points.toLocaleString("de-DE");
    $("#statSeason").textContent = state.seasonPoints.toLocaleString("de-DE");
    $("#statTotal").textContent  = state.totalPoints.toLocaleString("de-DE");
    $("#statVisits").textContent = state.visits;
  }

  $("#greetName").textContent = state.firstName || "Member";
  $("#streakCount").textContent = state.streak;

  const level = Math.floor(state.seasonPoints / LEVEL_STEP) + 1;
  const into = state.seasonPoints % LEVEL_STEP;
  $("#levelNum").textContent = level;
  $("#seasonPoints").textContent = into;
  $("#seasonGoal").textContent = LEVEL_STEP;
  setTimeout(() => $("#levelFill").style.width = (into/LEVEL_STEP*100) + "%", 100);
  $("#rankLabel").textContent = rankFor(state.totalPoints).name;

  renderAvatar($("#avatarStage"));
  renderAvatarMeta();
  $("#userId").textContent = state.userId;
  renderQR($("#qrCode"), state.userId);

  $("#services").innerHTML = SERVICES.map(s => `
    <div class="service">
      <div class="service__info">
        <span class="service__name">${esc(s.icon)} ${esc(s.name)}</span>
        <span class="service__meta">${esc(s.meta)} · <span class="service__pts">+${s.points} FP</span></span>
      </div>
      <button class="btn--buy" data-service="${esc(s.id)}">Check-in</button>
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
    return `<article class="challenge ${done?'is-done':''}">
      <div class="challenge__head">
        <div>
          <span class="eyebrow">${done?'Completed':'Active'}</span>
          <h3 class="challenge__title">${esc(c.title)}</h3>
        </div>
        <span class="challenge__reward">+${c.reward} FP</span>
      </div>
      <p class="muted" style="margin:0;font-size:13px">${esc(c.desc)}</p>
      <div class="challenge__progress">
        <div class="progress__bar"><div class="progress__fill" style="width:${pct}%"></div></div>
        <div class="progress__meta"><span>${prog} / ${c.goal}</span><span class="muted">${done?'✓ Reward eingelöst':'In Progress'}</span></div>
      </div>
    </article>`;
  }).join("");

  const me = { name: (state.firstName || "Du") + " (Du)", pts: state.seasonPoints, me: true };
  const list = [...LEADERBOARD_MOCK, me].sort((a,b)=>b.pts-a.pts).slice(0, 12);
  $("#leaderboardList").innerHTML = list.map((u,i)=>`
    <li class="${u.me?'is-me':''}">
      <span class="rank">${String(i+1).padStart(2,'0')}</span>
      <span class="lb-name">${esc(u.name)}</span>
      <span class="lb-points">${u.pts.toLocaleString("de-DE")} FP</span>
    </li>
  `).join("");

  // sound button state
  $("#soundBtn")?.classList.toggle("is-muted", !state.soundOn);

  renderEditor();
}

/* ---------- Avatar meta (hearts + name tag) ---------- */
function renderAvatarMeta(){
  const hearts = $("#avatarHearts");
  const nameTag = $("#avatarNameTag");
  if(hearts){
    const filled = Math.min(4, Math.max(1, Math.ceil(state.streak / 2) || 1));
    let h = "";
    for(let i=0;i<4;i++) h += `<div class="heart${i<filled?'':' is-empty'}"></div>`;
    hearts.innerHTML = h;
  }
  if(nameTag){
    nameTag.textContent = state.firstName || "Cryo-Self";
  }
}

/* ---------- Avatar Editor ---------- */
function renderEditor(){
  const wrap = $("#editorControls");
  if(!wrap || !state.avatar) return;
  const a = state.avatar;
  const rows = window.PART_ORDER.map(key => {
    const opts = window.AVATAR_PARTS[key];
    const cur = a[key];
    const idx = opts.indexOf(cur);
    const isColor = key.toLowerCase().includes("color") || key === "skinTone";
    const valueDisplay = isColor
      ? `<span class="swatch" style="background:${esc(cur)}"></span>`
      : `<span>${esc(String(cur))}</span>`;
    return `<div class="part-row">
      <span class="part-row__label">${esc(window.PART_LABELS[key])}</span>
      <div class="part-row__value">${valueDisplay}<div class="dim small" style="margin-top:2px">${idx+1} / ${opts.length}</div></div>
      <div class="part-row__nav">
        <button class="nav-btn" data-part="${esc(key)}" data-dir="-1">◀</button>
        <button class="nav-btn" data-part="${esc(key)}" data-dir="1">▶</button>
      </div>
    </div>`;
  }).join("");
  wrap.innerHTML = rows + `
    <div class="editor__actions">
      <button class="btn--randomize" id="randomizeBtn">Zufällig</button>
      <button class="btn--save" id="saveAvatarBtn">Speichern</button>
    </div>
  `;
  const equipped = state.equipped;
  window.renderAvatarV2($("#editorAvatar"), a, equipped);
}

function cycleAvatarPart(key, dir){
  const opts = window.AVATAR_PARTS[key];
  if(!opts) return;
  const cur = state.avatar[key];
  let idx = opts.indexOf(cur);
  if(idx < 0) idx = 0;
  idx = (idx + dir + opts.length) % opts.length;
  state.avatar[key] = opts[idx];
  save();
  sfx("click");
  renderEditor();
  renderAvatar($("#avatarStage"));
}

function randomizeAvatar(){
  const a = {};
  for(const k of window.PART_ORDER){
    const opts = window.AVATAR_PARTS[k];
    a[k] = opts[Math.floor(Math.random()*opts.length)];
  }
  state.avatar = a;
  save();
  sfx("buy");
  renderEditor();
  renderAvatar($("#avatarStage"));
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
          ? `<span class="price is-owned">✓ Owned</span>
             <button class="btn--equip ${equipped?'is-equipped':''}" data-equip="${esc(i.id)}">${equipped?'Equipped':'Equip'}</button>`
          : `<span class="price">${i.price} FP</span>
             <button class="btn--buy" data-buy="${esc(i.id)}" ${canBuy?'':'disabled'}>${canBuy?'Unlock':'Locked'}</button>`}
      </div>
    </article>`;
  }).join("");
}
function catLabel(c){ return { aura:"Aura", gear:"Gear", env:"Environment" }[c] || c }

/* ---------- Actions ---------- */
function bookService(id, evtTarget){
  const svc = SERVICES.find(s=>s.id===id);
  if(!svc) return;
  const pts = svc.points;

  const oldLevel = Math.floor(state.seasonPoints / LEVEL_STEP) + 1;

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

  const newLevel = Math.floor(state.seasonPoints / LEVEL_STEP) + 1;
  const leveledUp = newLevel > oldLevel;

  save();
  if(evtTarget) fpBurst(evtTarget, "+" + pts);
  sfx("point");
  renderAll(true);

  if(leveledUp){
    setTimeout(() => showLevelUp(newLevel), 500);
  }
  checkAchievements();
}

function bumpChallenge(c, by){
  const prev = state.challengeProgress[c.id] || 0;
  const next = prev + by;
  state.challengeProgress[c.id] = next;
  if(prev < c.goal && next >= c.goal){
    state.points += c.reward;
    state.seasonPoints += c.reward;
    state.totalPoints += c.reward;
    setTimeout(() => {
      sfx("achievement");
      toast(`MISSION COMPLETE: ${c.title} · +${c.reward} FP`, 3500);
    }, 900);
  }
}

function checkAchievements(){
  for(const a of ACHIEVEMENTS){
    if(a.test(state) && !state.unlockedAchievements.includes(a.id)){
      state.unlockedAchievements.push(a.id);
      save();
      setTimeout(() => {
        sfx("achievement");
        toast(`ACHIEVEMENT UNLOCKED: ${a.name}`, 3500);
      }, 1400);
    }
  }
}

function buyItem(id){
  const item = SHOP_ITEMS.find(i=>i.id===id);
  if(!item || state.points < item.price || state.inventory.includes(id)) return;
  state.points -= item.price;
  state.inventory.push(id);
  state.equipped[item.cat] = id;
  save();
  sfx("buy");
  showLootReveal(item);
  renderAll(true);
  checkAchievements();
}

function equipItem(id){
  const item = SHOP_ITEMS.find(i=>i.id===id);
  if(!item || !state.inventory.includes(id)) return;
  state.equipped[item.cat] = state.equipped[item.cat] === id ? null : id;
  save();
  sfx("click");
  renderAll();
}

/* ---------- Toast / modal / effects ---------- */
function toast(msg, ms=2400){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(()=>t.classList.remove("is-show"), ms);
}

function showModal({ eyebrow, title, desc, art }){
  $("#modalEyebrow").textContent = eyebrow;
  $("#modalTitle").textContent = title;
  $("#modalDesc").textContent = desc;
  $("#modalArt").textContent = art;
  $("#modal").classList.add("is-show");
}
function hideModal(){ $("#modal").classList.remove("is-show") }

function showLevelUp(level){
  sfx("levelup");
  confetti();
  showModal({
    eyebrow: "LEVEL UP",
    title: "Stufe " + level,
    desc: "Du steigerst deinen Cryo-Rang. Neue Aura-Stufe freigeschaltet.",
    art: "▲"
  });
}

function showLootReveal(item){
  confetti(item.limited ? "epic" : "common");
  showModal({
    eyebrow: item.limited ? "LIMITED DROP" : "ITEM UNLOCKED",
    title: item.name,
    desc: catLabel(item.cat) + " · " + (item.limited ? "Exklusiv für diese Saison" : "Sofort tragbar"),
    art: item.emoji
  });
}

function confetti(kind="common"){
  const wrap = $("#confetti");
  const colors = kind === "epic" ? ["#c084fc","#4ee0f0","#ffd479"] : ["#4ee0f0","#b8e6f0","#ffffff"];
  for(let i=0;i<70;i++){
    const s = document.createElement("span");
    s.style.left = Math.random()*100 + "%";
    s.style.background = colors[i % colors.length];
    s.style.width = (4 + Math.random()*6) + "px";
    s.style.height = (8 + Math.random()*10) + "px";
    s.style.animationDelay = (Math.random()*.4) + "s";
    s.style.animationDuration = (1.8 + Math.random()*1.5) + "s";
    s.style.transform = `rotate(${Math.random()*360}deg)`;
    wrap.appendChild(s);
    setTimeout(() => s.remove(), 3500);
  }
}

function fpBurst(el, text){
  const r = el.getBoundingClientRect();
  const burst = document.createElement("div");
  burst.className = "fp-burst";
  burst.textContent = text;
  burst.style.left = (r.left + r.width/2) + "px";
  burst.style.top = (r.top - 10) + "px";
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 1700);
}

/* ---------- Tabs ---------- */
function showTab(name){
  sfx("click");
  $$(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.tab === name));
  $$(".bnav").forEach(b => b.classList.toggle("is-active", b.dataset.tab === name));
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
    if(!state.avatar) state.avatar = window.defaultAvatar();
    state.points = 200; state.totalPoints = 200; state.seasonPoints = 200;
    save();
    ensureAudio();
    sfx("levelup");
    enterApp();
    setTimeout(() => {
      confetti();
      showModal({ eyebrow: "WELCOME", title: "+200 FrostPoints", desc: "Dein Cryo-Self ist aktiv. Starte deinen ersten Check-in.", art: "◆" });
    }, 400);
  });

  $$('input[name="style"]').forEach(r => r.addEventListener("change", () => {
    sfx("click");
  }));

  $$(".tab, .bnav").forEach(t => t.addEventListener("click", () => showTab(t.dataset.tab)));
  $$("[data-go]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.go)));

  document.addEventListener("click", (e) => {
    const part = e.target.closest("[data-part]");
    if(part){ cycleAvatarPart(part.dataset.part, parseInt(part.dataset.dir,10)); return; }
    if(e.target.id === "randomizeBtn"){ randomizeAvatar(); return; }
    if(e.target.id === "saveAvatarBtn"){ sfx("levelup"); toast("Avatar gespeichert"); return; }
    const svc = e.target.closest("[data-service]");
    if(svc){ bookService(svc.dataset.service, svc); return; }
    const buy = e.target.closest("[data-buy]");
    if(buy && !buy.disabled){ buyItem(buy.dataset.buy); return; }
    const eq = e.target.closest("[data-equip]");
    if(eq){ equipItem(eq.dataset.equip); return; }
  });

  $("#shopFilters").addEventListener("click", e => {
    const c = e.target.closest(".chip");
    if(!c) return;
    sfx("click");
    $$("#shopFilters .chip").forEach(x => x.classList.remove("is-active"));
    c.classList.add("is-active");
    currentFilter = c.dataset.filter;
    renderShop(currentFilter);
  });

  $("#modalClose").addEventListener("click", () => { sfx("click"); hideModal(); });
  $("#modal").addEventListener("click", (e) => { if(e.target.id === "modal") hideModal(); });

  $("#soundBtn").addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    save();
    $("#soundBtn").classList.toggle("is-muted", !state.soundOn);
    if(state.soundOn) sfx("click");
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
  setTimeout(spawnFrostParticles, 500);
}

function boot(){
  bindEvents();
  // Migrate old avatar schema to v4 (chibi)
  if(!state.avatar || !state.avatar.outfit){
    state.avatar = window.defaultAvatar();
    save();
  }
  window.renderAvatarV2($("#onboardingAvatar"), state.avatar, state.equipped);
  if(state.onboarded) enterApp();
}

document.addEventListener("DOMContentLoaded", boot);
