/* Freezeclub — Frozen Identity v3.x
   Premium Game UI: animations, level-up, loot reveal, sound, particles */

// ============================================================
// Bulletproof onboarding event handlers (module-load delegation)
// Attached BEFORE anything else so even if other code fails, clicks work.
// ============================================================
var __onbSlide = 0;
var __onbTotal = 5;

function __onbGoTo(idx){
  idx = Math.max(0, Math.min(__onbTotal - 1, idx));
  __onbSlide = idx;
  document.querySelectorAll(".onb-slide, .slide").forEach(function(s){
    s.classList.toggle("is-active", parseInt(s.dataset.step, 10) === idx);
  });
  document.querySelectorAll(".onb-dots .dot, .onboarding__dots .dot").forEach(function(d, i){
    d.classList.toggle("is-active", i === idx);
  });
  var back = document.getElementById("onboardingBack");
  if(back) back.disabled = idx === 0;
  var next = document.getElementById("onboardingNext");
  if(next) next.textContent = idx === __onbTotal - 1 ? "Frosti aufwecken" : "Weiter";
  var deck = document.getElementById("onboardingDeck");
  if(deck) deck.scrollTop = 0;
}

function completeOnboarding(){
  var firstEl = document.getElementById("firstName");
  var firstName = (firstEl ? firstEl.value : "").trim();
  if(!firstName){
    __onbGoTo(__onbTotal - 1);
    setTimeout(function(){ firstEl && firstEl.focus(); }, 100);
    return;
  }
  if(typeof state === "undefined") return;
  state.firstName = firstName;
  var goalEl = document.getElementById("goal");
  state.goal = goalEl ? goalEl.value : "recovery";
  var chosenGoalEl = document.querySelector(".onb-goal.is-selected, .goal-tile.is-selected");
  if(chosenGoalEl){
    state.weekGoal = parseInt(chosenGoalEl.dataset.weekgoal, 10) || 2;
    state.weekGoalChosen = true;
  }
  state.onboarded = true;
  state.avatar = (window.defaultAvatar ? window.defaultAvatar() : { preset: "frost", accessory: null, background: null });
  state.points = 200; state.totalPoints = 200; state.seasonPoints = 200;
  if(typeof save === "function") save();
  if(typeof ensureAudio === "function") ensureAudio();
  if(typeof sfx === "function") sfx("levelup");
  if(typeof enterApp === "function") enterApp();
  setTimeout(function(){
    if(typeof confetti === "function") confetti();
    if(typeof showModal === "function") showModal({ eyebrow: "Willkommen", title: "+200 Eis-Punkte", desc: "Frosti ist erwacht. Starte deinen ersten Check-in.", art: "❄" });
  }, 400);
}

document.addEventListener("click", function(e){
  // Next button
  if(e.target.closest && e.target.closest("#onboardingNext")){
    e.preventDefault();
    if(__onbSlide === __onbTotal - 1){
      var form = document.getElementById("onboardingForm");
      if(form && form.checkValidity()) completeOnboarding();
      else if(form) form.reportValidity();
      else completeOnboarding();
    } else {
      __onbGoTo(__onbSlide + 1);
    }
    return;
  }
  if(e.target.closest && e.target.closest("#onboardingBack")){
    e.preventDefault();
    __onbGoTo(__onbSlide - 1);
    return;
  }
  if(e.target.closest && e.target.closest("#onboardingSkip")){
    e.preventDefault();
    __onbGoTo(__onbTotal - 1);
    return;
  }
  // Goal tile selection
  var goal = e.target.closest && e.target.closest("[data-weekgoal]");
  if(goal){
    document.querySelectorAll(".onb-goal, .goal-tile").forEach(function(g){ g.classList.remove("is-selected"); });
    goal.classList.add("is-selected");
  }
}, true); // capture phase for highest priority

window.addEventListener("error", function(e){
  console.error("[Freezeclub error]", e.message, "at", e.filename + ":" + e.lineno);
});
// ============================================================

const STORAGE_KEY = "freezeclub.v2";
const SEASON = { id: "S01", name: "Winter Cryo", daysLeft: 47 };

const SERVICES = [
  { id: "cryo",  name: "Kältekammer",   meta: "3 Min · −85 °C",       sub: "Kälte-Schub", points: 100, icon: "❄", from: "#dceaf6", to: "#bfdaef", color: "#1854a8" },
  { id: "lymph", name: "Lymphdrainage", meta: "30 Min Regeneration",  sub: "Regen-Boost", points: 75,  icon: "≋", from: "#dcf0ea", to: "#bfe4d4", color: "#2a8a6e" },
  { id: "scan",  name: "4D-Bodyscan",   meta: "10 Min Tracking",      sub: "Wachstum",    points: 150, icon: "◉", from: "#ebe0f4", to: "#d8c4ea", color: "#7c4fb8" },
  { id: "combo", name: "Kombi-Session", meta: "2+ Anwendungen",       sub: "Booster",     points: 230, icon: "✦", from: "#fdeed1", to: "#f8d99a", color: "#a8631a" },
];

const RANKS = [
  { name: "Frostknospe",      min: 0 },
  { name: "Eiskeim",          min: 200 },
  { name: "Kristallwächter",  min: 500 },
  { name: "Eismeister",       min: 1200 },
  { name: "Polarchampion",    min: 2500 },
  { name: "Cryo-Legende",     min: 5000 },
];

const LEVEL_STEP = 500;

/* ===== Real Products — Cashback model (move2earn-style) =====
   Members spend Eis-Punkte as cashback (100 Pkt = 1 €).
   Each product has a max-discount cap to protect margin.
   Studio services capped at 30–50 %, Webshop products up to 100 %. */
const REAL_PRODUCTS = [
  // Studio services
  { id: "svc-cryo",   cat: "service", name: "Kältekammer Session",      price: 35,  icon: "❄",  maxDiscountPct: 50, desc: "3 Min bei −85 °C" },
  { id: "svc-lymph",  cat: "service", name: "Lymphdrainage 30 Min",     price: 49,  icon: "≋",  maxDiscountPct: 50, desc: "Regeneration & Recovery" },
  { id: "svc-scan",   cat: "service", name: "4D-Bodyscan",              price: 89,  icon: "◉",  maxDiscountPct: 30, desc: "Inkl. Auswertung" },
  { id: "svc-combo",  cat: "service", name: "Kombi-Session",            price: 75,  icon: "✦",  maxDiscountPct: 40, desc: "Kältekammer + Lymphe" },
  { id: "svc-month",  cat: "service", name: "Monatsmitgliedschaft",     price: 199, icon: "★",  maxDiscountPct: 20, desc: "Unbegrenzter Zugang" },
  // Webshop products
  { id: "shop-hoodie",cat: "webshop", name: "Freezeclub Hoodie",        price: 89,  icon: "👕", maxDiscountPct: 50, desc: "Heavyweight, Bio-Baumwolle" },
  { id: "shop-bottle",cat: "webshop", name: "Frost Bottle 750 ml",      price: 29,  icon: "🍶", maxDiscountPct: 100,desc: "Doppelwandig, vakuumisoliert" },
  { id: "shop-supp",  cat: "webshop", name: "Recovery Supplement",      price: 39,  icon: "💊", maxDiscountPct: 50, desc: "Magnesium + Elektrolyte" },
  { id: "shop-towel", cat: "webshop", name: "Premium Handtuch",         price: 19,  icon: "🧖", maxDiscountPct: 100,desc: "Microfiber, Freezeclub-Logo" },
  { id: "shop-tee",   cat: "webshop", name: "Statement T-Shirt",        price: 35,  icon: "👕", maxDiscountPct: 100,desc: "100 % Baumwolle, Unisex" },
];

/* Compute max applicable discount for a product based on user's balance */
function maxDiscountFor(product){
  if(!product) return { points: 0, euro: 0, finalPrice: product?.price ?? 0 };
  const balanceEuro = state.points / POINTS_PER_EURO;
  const productCapEuro = product.price * (product.maxDiscountPct / 100);
  const discountEuro = Math.min(balanceEuro, productCapEuro);
  const points = Math.floor(discountEuro * POINTS_PER_EURO);
  return {
    points,
    euro: Math.floor(discountEuro * 100) / 100,
    finalPrice: Math.max(0, product.price - discountEuro),
    capPct: product.maxDiscountPct,
    capEuro: productCapEuro,
  };
}

function buildShopItems(){
  const items = [];
  const accs = window.ACCESSORIES || {};
  for(const id in accs){
    const a = accs[id];
    items.push({
      id, cat: "accessoire",
      name: a.name, price: a.price ?? 500,
      emoji: a.glyph || "✨",
      limited: !!a.limited,
      preview: "#e6ece8", color: "#1f3d2e",
    });
  }
  const bgs = window.BACKGROUNDS || {};
  for(const id in bgs){
    const b = bgs[id];
    items.push({
      id, cat: "background",
      name: b.name, price: b.price ?? 500,
      emoji: "🖼️",
      preview: b.colors ? b.colors[0] : "#e6ece8",
      colors: b.colors,
      limited: !!b.limited,
      color: "#1f3d2e",
    });
  }
  return items;
}
const SHOP_ITEMS = buildShopItems();

/* ===== Point-to-Euro anchor — shown everywhere ===== */
const POINTS_PER_EURO = 100;
function pointsToEuro(pts){
  return (pts / POINTS_PER_EURO).toFixed(0) + " €";
}

/* ===== Off-Peak Multiplier ===== */
function getOffPeakBonus(){
  const now = new Date();
  const day = now.getDay(); // 0=Sun .. 6=Sat
  const hour = now.getHours();
  // Mo–Mi (1–3) zwischen 10–14 Uhr: 2× Punkte (Auslastungs-Glättung)
  if(day >= 1 && day <= 3 && hour >= 10 && hour < 14){
    return { active: true, multiplier: 2, label: "Off-Peak Bonus", desc: "Mo–Mi 10–14 Uhr · 2× Punkte" };
  }
  // Donnerstag-Vormittag 10-12 = 1.5×
  if(day === 4 && hour >= 10 && hour < 12){
    return { active: true, multiplier: 1.5, label: "Off-Peak Bonus", desc: "Donnerstag-Vormittag · 1,5× Punkte" };
  }
  return { active: false, multiplier: 1 };
}

/* ===== Comeback Detection ===== */
function getComebackStatus(){
  if(!state.lastVisitDate) return null;
  const days = Math.floor((Date.now() - new Date(state.lastVisitDate).getTime()) / 86400000);
  if(days < 14) return null;
  const month = new Date().toISOString().slice(0,7);
  if(state.comebackClaimedMonth === month) return null;
  return { days, code: "WIRVERMISSENDICH", discount: 30 };
}

/* ===== Daily Knowledge Card ===== */
function getDailyArticle(){
  const articles = window.KNOWLEDGE || [];
  if(!articles.length) return null;
  // Deterministic pick: same article all day, rotates daily
  const dayIdx = Math.floor(Date.now() / 86400000);
  return articles[dayIdx % articles.length];
}
function isArticleReadToday(){
  if(!state.lastArticleRead) return false;
  return state.lastArticleRead.date === new Date().toDateString();
}

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
  firstName: "", goal: "recovery",
  userId: "FZ-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  points: 0, seasonPoints: 0, totalPoints: 0,
  visits: 0,
  weekGoal: 2,
  weekVisits: 0,
  weekKey: null,
  weeklyStreak: 0,
  lastVisitDate: null,
  level: 1,
  counts: {}, inventory: [],
  equipped: { accessoire: null, background: null },
  challengeProgress: {}, unlockedAchievements: [],
  soundOn: true,
  avatar: window.defaultAvatar ? window.defaultAvatar() : null,
  // Engagement state
  lastArticleRead: null,          // { date, articleId }
  readArticles: [],
  comebackClaimedMonth: null,
  weekGoalChosen: false,
  createdAt: new Date().toISOString(),
});

function isoWeekKey(d){
  d = d || new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return date.getUTCFullYear() + "-W" + String(weekNo).padStart(2,"0");
}
function prevIsoWeekKey(weekKey){
  const m = /^(\d{4})-W(\d{2})$/.exec(weekKey || "");
  if(!m) return null;
  const year = parseInt(m[1],10), week = parseInt(m[2],10);
  const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
  const dow = simple.getUTCDay() || 7;
  const monday = new Date(simple);
  monday.setUTCDate(simple.getUTCDate() - dow + 1);
  monday.setUTCDate(monday.getUTCDate() - 7);
  return isoWeekKey(monday);
}

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
    const level = opts.level || Math.floor(state.seasonPoints / LEVEL_STEP) + 1;
    const stage = opts.stage || (window.stageFor ? window.stageFor(level) : null);
    // inject equipped accessory if not explicitly provided
    const avatarCopy = Object.assign({}, opts.avatar || state.avatar);
    if(!avatarCopy.accessory && state.equipped) avatarCopy.accessory = state.equipped.accessoire || null;
    window.renderAvatarV2(target, avatarCopy, { level, stage });
    // Apply background to the parent stage (avatar-stage)
    const stageEl = target.closest(".avatar-stage");
    if(stageEl && window.applyAvatarBackground){
      const bg = (state.equipped && state.equipped.background) || null;
      window.applyAvatarBackground(stageEl, bg);
    }
    return;
  }
  return _renderAvatarLegacy(target, opts);
}

function renderEvolutionPath(currentLevel){
  const wrap = document.getElementById("evolutionPath");
  if(!wrap || !window.STAGE_INFO || !state.avatar) return;
  wrap.innerHTML = window.STAGE_INFO.map(stage => {
    const isCurrent = stage.id === currentLevel;
    const isLocked = stage.id > currentLevel;
    return `<div class="evo-stage ${isCurrent?'is-current':''} ${isLocked?'is-locked':''}">
      <div class="evo-stage__art" data-evo-id="${stage.id}"></div>
      <div class="evo-stage__lvl">Lvl ${stage.id}</div>
      <div class="evo-stage__name">${esc(stage.name)}</div>
      ${isLocked ? '<div class="evo-stage__lock">🔒</div>' : ''}
    </div>`;
  }).join("");
  // Render each evolution stage avatar
  window.STAGE_INFO.forEach(stage => {
    const t = wrap.querySelector(`[data-evo-id="${stage.id}"]`);
    if(t) window.renderAvatarV2(t, state.avatar, { level: stage.id, stage });
  });
}

/* ---------- Community Challenge ---------- */
const COMMUNITY = {
  title: "Gemeinsam 1.000 Kältekammer-Minuten",
  goal: 1000,
  progress: 732,
  daysLeft: 8,
  reward: "Limited Polar-Mütze für alle Teilnehmer",
};
function renderCommunityChallenge(){
  const card = document.getElementById("communityCard");
  if(!card) return;
  const pct = Math.min(100, COMMUNITY.progress / COMMUNITY.goal * 100);
  card.innerHTML = `
    <div class="community__head">
      <div>
        <p class="eyebrow eyebrow--light">Community Challenge</p>
        <h3 class="card__title" style="color:#fff">${esc(COMMUNITY.title)}</h3>
      </div>
      <span class="community__time">Noch ${COMMUNITY.daysLeft} Tage</span>
    </div>
    <p class="community__desc">Als Community haben wir bereits <strong>${COMMUNITY.progress}</strong> von ${COMMUNITY.goal} Minuten erreicht. Jeder Besuch zählt!</p>
    <div class="progress">
      <div class="progress__bar"><div class="progress__fill" style="width:${pct}%"></div></div>
      <div class="progress__meta">
        <span>${COMMUNITY.progress} / ${COMMUNITY.goal} Min.</span>
        <span>${Math.round(pct)} %</span>
      </div>
    </div>
    <div class="community__reward">
      <span class="community__reward-icon">🎁</span>
      <span>${esc(COMMUNITY.reward)}</span>
    </div>
  `;
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
  let r = RANKS[0], next = RANKS[1] || RANKS[0];
  for(let i=0;i<RANKS.length;i++){
    if(total >= RANKS[i].min){ r = RANKS[i]; next = RANKS[i+1] || r; }
  }
  return { current: r, next, toNext: Math.max(0, next.min - total) };
}

/* ---------- Rendering ---------- */
function renderAll(animate=false){
  const setNum = (sel, val) => { const el = $(sel); if(!el) return; if(animate) animateNumber(el, val); else el.textContent = val.toLocaleString("de-DE"); };
  setNum("#topPoints", state.points);
  setNum("#shopPoints", state.points);
  setNum("#statSeason", state.seasonPoints);
  setNum("#statTotal", state.totalPoints);
  setNum("#statVisits", state.visits);

  // BIG hero pill: euro value
  const heroPoints = $("#heroPoints");
  if(heroPoints) heroPoints.textContent = pointsToEuro(state.points);

  // Profile view labels
  const profileName = $("#profileName"); if(profileName) profileName.textContent = state.firstName || "Frosti";
  const weekGoalLabel = $("#weekGoalLabel"); if(weekGoalLabel) weekGoalLabel.textContent = state.weekGoal || 2;
  const soundLabel = $("#soundLabel"); if(soundLabel) soundLabel.textContent = state.soundOn === false ? "Stumm" : "Aktiviert";

  renderHomeBanners();
  renderNextReward();
  renderDailyArticle();

  const greetName = $("#greetName"); if(greetName) greetName.textContent = state.firstName || "Frosti";
  const streakCount = $("#streakCount"); if(streakCount) streakCount.textContent = state.weeklyStreak || 0;
  const weekVisits = $("#weekVisits"); if(weekVisits) weekVisits.textContent = state.weekVisits || 0;
  const weekGoal = $("#weekGoal"); if(weekGoal) weekGoal.textContent = state.weekGoal || 2;

  const level = Math.floor(state.seasonPoints / LEVEL_STEP) + 1;
  const into = state.seasonPoints % LEVEL_STEP;
  const levelNum = $("#levelNum"); if(levelNum) levelNum.textContent = level;
  const sp = $("#seasonPoints"); if(sp) sp.textContent = into;
  const sg = $("#seasonGoal"); if(sg) sg.textContent = LEVEL_STEP;
  setTimeout(() => { const f = $("#levelFill"); if(f) f.style.width = (into/LEVEL_STEP*100) + "%" }, 100);
  const rank = rankFor(state.totalPoints);
  $("#rankLabel").textContent = rank.current.name;
  const ptsToNext = $("#ptsToNext"); if(ptsToNext) ptsToNext.textContent = rank.toNext;
  const nextRank = $("#nextRank"); if(nextRank) nextRank.textContent = rank.next.name;
  const avatarName = $("#avatarName"); if(avatarName) avatarName.textContent = state.firstName ? state.firstName : "Frosti";

  const currentLevel = Math.floor(state.seasonPoints / LEVEL_STEP) + 1;
  renderAvatar($("#avatarStage"), { level: currentLevel });
  const profEl = $("#profileAvatar");
  if(profEl) renderAvatar(profEl, { level: currentLevel });
  renderEvolutionPath(currentLevel);
  renderCommunityChallenge();
  renderAvatarMeta();
  $("#userId").textContent = state.userId;
  renderQR($("#qrCode"), state.userId);

  $("#services").innerHTML = SERVICES.map(s => `
    <div class="service">
      <div class="service__info">
        <span class="service__name">${esc(s.icon)} ${esc(s.name)}</span>
        <span class="service__meta">${esc(s.meta)} · <span class="service__pts">+${s.points} Eis-Punkte</span></span>
      </div>
      <button class="btn--buy" data-service="${esc(s.id)}">Buchen</button>
    </div>
  `).join("");

  // Boosters (home card)
  const boosters = $("#boostersList");
  if(boosters){
    boosters.innerHTML = SERVICES.filter(s => s.id !== "combo").map(s => `
      <button class="booster" data-service="${esc(s.id)}" style="--bi-from:${s.from};--bi-to:${s.to};--bi-color:${s.color}">
        <span class="booster__icon">${esc(s.icon)}</span>
        <span class="booster__name">${esc(s.name)}</span>
        <span class="booster__sub">${esc(s.sub)}</span>
        <span class="booster__pts">+${s.points} Punkte</span>
      </button>
    `).join("");
  }

  // Week tracker — weekly goal, Sunday is closed
  const wt = $("#weekTrack");
  if(wt){
    const days = ["Mo","Di","Mi","Do","Fr","Sa","So"];
    const today = new Date();
    const dow = (today.getDay() + 6) % 7;
    const visitsThisWeek = state.weekVisits || 0;
    const goal = state.weekGoal || 2;
    wt.innerHTML = days.map((d,i) => {
      const isClosed = i === 6;
      const isToday = i === dow;
      const filled = !isClosed && i < dow && i < visitsThisWeek;
      return `<div class="day ${filled?'is-done':''} ${isToday?'is-today':''} ${isClosed?'is-closed':''}">
        <span class="day__label">${d}</span>
        <span class="day__dot">
          ${isClosed
            ? '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
            : '<svg class="day__icon" viewBox="0 0 24 24" width="16" height="16"><path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
        </span>
      </div>`;
    }).join("");
  }

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
        <span class="challenge__reward">+${c.reward} Punkte</span>
      </div>
      <p class="muted" style="margin:0;font-size:13px">${esc(c.desc)}</p>
      <div class="challenge__progress">
        <div class="progress__bar"><div class="progress__fill" style="width:${pct}%"></div></div>
        <div class="progress__meta"><span>${prog} / ${c.goal}</span><span class="muted">${done?'✓ Reward eingelöst':'In Progress'}</span></div>
      </div>
    </article>`;
  }).join("");

  const me = { name: (state.firstName || "Du") + " (Du)", pts: state.seasonPoints, me: true };
  const fullList = [...LEADERBOARD_MOCK, me].sort((a,b)=>b.pts-a.pts);
  const myRank = fullList.findIndex(u => u.me) + 1;
  const qaRank = $("#qaRank"); if(qaRank) qaRank.textContent = `Platz ${myRank} von ${fullList.length}`;
  const list = fullList.slice(0, 12);
  $("#leaderboardList").innerHTML = list.map((u,i)=>`
    <li class="${u.me?'is-me':''}">
      <span class="rank">${String(i+1).padStart(2,'0')}</span>
      <span class="lb-name">${esc(u.name)}</span>
      <span class="lb-points">${u.pts.toLocaleString("de-DE")} Pkt</span>
    </li>
  `).join("");

  // sound button state
  $("#soundBtn")?.classList.toggle("is-muted", !state.soundOn);

  renderEditor();
}

/* ---------- Engagement-Banner & Cards ---------- */

function renderHomeBanners(){
  // Off-Peak Banner
  const offEl = $("#offpeakBanner");
  if(offEl){
    const off = getOffPeakBonus();
    if(off.active){
      offEl.classList.remove("hidden");
      offEl.innerHTML = `
        <div class="banner__icon">⚡</div>
        <div class="banner__body">
          <div class="banner__title">${esc(off.label)} aktiv</div>
          <div class="banner__sub">${esc(off.desc)} — buche jetzt für Bonus</div>
        </div>
        <button class="banner__cta" data-go="checkin">Buchen</button>
      `;
    } else {
      offEl.classList.add("hidden");
    }
  }

  // Comeback Banner
  const cbEl = $("#comebackBanner");
  if(cbEl){
    const cb = getComebackStatus();
    if(cb){
      cbEl.classList.remove("hidden");
      cbEl.innerHTML = `
        <div class="banner__icon">💙</div>
        <div class="banner__body">
          <div class="banner__title">Wir vermissen dich</div>
          <div class="banner__sub">${cb.days} Tage nicht da. Dein Comeback-Coupon: <strong>${cb.discount} % Rabatt</strong></div>
          <code class="banner__code">${esc(cb.code)}</code>
        </div>
        <button class="banner__cta" id="claimComeback">Einlösen</button>
      `;
    } else {
      cbEl.classList.add("hidden");
    }
  }
}

function renderNextReward(){
  const el = $("#nextRewardCard");
  if(!el) return;
  // Pick the most attractive product where the user has at least 1 € discount
  const candidates = REAL_PRODUCTS.map(p => {
    const d = maxDiscountFor(p);
    return { p, d };
  }).filter(x => x.d.euro >= 1)
    .sort((a,b) => b.d.euro - a.d.euro); // biggest possible discount first

  // If no eligible discount yet — show goal-gradient toward cheapest service
  if(candidates.length === 0){
    const cheapest = REAL_PRODUCTS.filter(p => p.cat === "service").sort((a,b)=>a.price-b.price)[0];
    if(!cheapest){ el.classList.add("hidden"); return; }
    const targetPoints = 100; // enough for 1 € discount
    const pct = Math.min(100, (state.points / targetPoints) * 100);
    el.classList.remove("hidden");
    el.innerHTML = `
      <header class="card-row">
        <div>
          <p class="eyebrow">Erstes Guthaben</p>
          <h3 class="card__title">Sammle 100 Pkt für 1 € Rabatt</h3>
          <p class="reward-progress__sub">Dann auf jede Anwendung anwendbar</p>
        </div>
        <span class="reward-progress__icon">${esc(cheapest.icon)}</span>
      </header>
      <div class="progress">
        <div class="progress__bar"><div class="progress__fill" style="width:${pct}%;background:var(--brand)"></div></div>
        <div class="progress__meta">
          <span>${state.points.toLocaleString("de-DE")} / ${targetPoints} Pkt</span>
          <span>${Math.max(0, targetPoints - state.points)} Pkt fehlen</span>
        </div>
      </div>
      <button class="btn--cta btn--cta-ghost" data-go="checkin">Punkte sammeln</button>
    `;
    return;
  }

  // Show the BEST currently-redeemable offer
  const best = candidates[0];
  el.classList.remove("hidden");
  el.innerHTML = `
    <header class="card-row">
      <div>
        <p class="eyebrow">Dein Guthaben · ${pointsToEuro(state.points)}</p>
        <h3 class="card__title">${best.d.euro.toFixed(2)} € Rabatt auf ${esc(best.p.name)}</h3>
        <p class="reward-progress__sub">Endpreis ${best.d.finalPrice.toFixed(2)} € · sofort einlösbar</p>
      </div>
      <span class="reward-progress__icon">${esc(best.p.icon)}</span>
    </header>
    <button class="btn--cta" data-redeem="${esc(best.p.id)}">${best.d.euro.toFixed(2)} € einlösen</button>
    <button class="btn--cta btn--cta-ghost" data-go="shop" style="margin-top:6px">Alle Produkte ansehen</button>
  `;
}

function renderDailyArticle(){
  const el = $("#dailyArticleCard");
  if(!el) return;
  const article = getDailyArticle();
  if(!article){ el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  const read = isArticleReadToday();
  el.innerHTML = `
    <header class="card-row">
      <div style="display:flex;align-items:center;gap:10px;flex:1">
        <span class="article__icon" style="background:${esc(article.color)}1a;color:${esc(article.color)}">${esc(article.icon)}</span>
        <div>
          <p class="eyebrow">Wissen heute · ${esc(article.cat)}</p>
          <h3 class="card__title" style="font-size:17px;line-height:1.3">${esc(article.title)}</h3>
        </div>
      </div>
      ${read ? `<span class="badge-done">✓</span>` : `<span class="badge-pts">+${article.reward}</span>`}
    </header>
    <p class="muted" style="font-size:13px;line-height:1.5;margin:6px 0 4px">${esc(article.summary)}</p>
    <button class="btn--cta ${read?'btn--cta-ghost':''}" data-article="${esc(article.id)}">${read ? "Erneut lesen" : `Jetzt lesen · ${article.readTime}`}</button>
  `;
}

function openArticle(articleId){
  const article = (window.KNOWLEDGE || []).find(a => a.id === articleId);
  if(!article) return;
  const wasRead = isArticleReadToday();
  showModal({
    eyebrow: article.cat,
    title: article.title,
    desc: article.body.join("\n\n"),
    art: article.icon,
  });
  if(!wasRead){
    state.points += article.reward;
    state.seasonPoints += article.reward;
    state.totalPoints += article.reward;
    state.lastArticleRead = { date: new Date().toDateString(), articleId };
    if(!state.readArticles.includes(articleId)) state.readArticles.push(articleId);
    save();
    sfx("point");
    setTimeout(() => toast(`+${article.reward} Pkt für die Wissens-Karte`), 800);
    renderAll(true);
  }
}

window.REWARD_LADDER = REWARD_LADDER;

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

/* ---------- Avatar Editor (Preset + Equip) ---------- */
function renderEditor(){
  const wrap = $("#editorControls");
  if(!wrap || !state.avatar) return;
  const a = state.avatar;
  const presets = window.PRESETS || {};
  const equipped = state.equipped || {};

  const presetCards = (window.PRESET_IDS || []).map(id => {
    const p = presets[id];
    const sel = id === a.preset;
    return `<button class="preset-card ${sel?'is-selected':''}" data-preset="${esc(id)}">
      <div class="preset-card__art" data-preset-art="${esc(id)}"></div>
      <div class="preset-card__meta">
        <span class="preset-card__name">${esc(p.label)}</span>
        <span class="preset-card__desc">${esc(p.desc)}</span>
      </div>
      ${sel ? '<span class="preset-card__check" aria-hidden="true">✓</span>' : ''}
    </button>`;
  }).join("");

  const accId = equipped.accessoire;
  const accInfo = accId && window.ACCESSORIES ? window.ACCESSORIES[accId] : null;
  const bgId = equipped.background;
  const bgInfo = bgId && window.BACKGROUNDS ? window.BACKGROUNDS[bgId] : null;

  wrap.innerHTML = `
    <section class="editor-section">
      <h4 class="editor-section__title">Wähle deinen Frosti</h4>
      <p class="editor-section__hint">Vier Persönlichkeiten zur Auswahl. Du kannst jederzeit wechseln.</p>
      <div class="preset-grid">${presetCards}</div>
    </section>

    <section class="editor-section">
      <h4 class="editor-section__title">Accessoire</h4>
      <div class="equip-row ${accInfo?'is-equipped':''}">
        <div class="equip-row__preview">${accInfo ? (accInfo.glyph || "✨") : "—"}</div>
        <div class="equip-row__meta">
          <span class="equip-row__name">${accInfo ? esc(accInfo.name) : "Nichts angelegt"}</span>
          <span class="equip-row__sub">${accInfo ? "Wird über Frosti getragen" : "Im Shop entdecken"}</span>
        </div>
        ${accInfo
          ? `<button class="equip-row__btn" data-unequip="accessoire">Ablegen</button>`
          : `<button class="equip-row__btn" data-go="shop">Shop →</button>`}
      </div>
    </section>

    <section class="editor-section">
      <h4 class="editor-section__title">Hintergrund</h4>
      <div class="equip-row ${bgInfo?'is-equipped':''}">
        <div class="equip-row__preview equip-row__preview--bg" style="${bgInfo && bgInfo.colors ? `background:linear-gradient(135deg,${bgInfo.colors.join(',')});` : ''}">${bgInfo ? "" : "—"}</div>
        <div class="equip-row__meta">
          <span class="equip-row__name">${bgInfo ? esc(bgInfo.name) : "Standard"}</span>
          <span class="equip-row__sub">${bgInfo ? "Aktive Szene" : "Im Shop entdecken"}</span>
        </div>
        ${bgInfo
          ? `<button class="equip-row__btn" data-unequip="background">Ablegen</button>`
          : `<button class="equip-row__btn" data-go="shop">Shop →</button>`}
      </div>
    </section>
  `;

  // Render mini frosti in each preset card
  (window.PRESET_IDS || []).forEach(id => {
    const t = wrap.querySelector(`[data-preset-art="${id}"]`);
    if(t) window.renderAvatarV2(t, { preset: id, accessory: null });
  });

  // Editor stage shows full equipped look
  window.renderAvatarV2($("#editorAvatar"), Object.assign({}, a, { accessory: equipped.accessoire }));
  const editorStage = $("#editorAvatar")?.closest(".avatar-stage");
  if(editorStage && window.applyAvatarBackground) window.applyAvatarBackground(editorStage, equipped.background);
}

function selectPreset(presetId){
  if(!window.PRESETS || !window.PRESETS[presetId]) return;
  state.avatar.preset = presetId;
  save();
  sfx("click");
  renderEditor();
  renderAvatar($("#avatarStage"));
}

function unequipSlot(slot){
  if(!state.equipped) return;
  state.equipped[slot] = null;
  save();
  sfx("click");
  renderEditor();
  renderAvatar($("#avatarStage"));
}

let currentFilter = "all";
let shopMode = "shop";

function renderShop(filter = currentFilter){
  const grid = $("#shopGrid");
  if(!grid) return;

  // Branch 1: Real products (cashback) for 'service'/'webshop'/'all'
  if(filter === "service" || filter === "webshop"){
    const products = REAL_PRODUCTS.filter(p => p.cat === filter);
    grid.innerHTML = `
      <div class="cashback-info">
        <div class="cashback-info__balance">Dein Guthaben: <strong>${pointsToEuro(state.points)}</strong></div>
        <div class="cashback-info__hint">100 Pkt = 1 € Rabatt · einlösbar auf Produkte unten</div>
      </div>
      <div class="cashback-grid">${products.map(renderCashbackCard).join("")}</div>
    `;
    return;
  }

  // Branch 2: Digital items (accessoire/background) — fixed point cost
  if(filter === "accessoire" || filter === "background"){
    let items = SHOP_ITEMS.filter(i => i.cat === filter);
    if(shopMode === "inventory") items = items.filter(i => state.inventory.includes(i.id));
    if(items.length === 0){
      grid.innerHTML = `<div class="shop-empty">
        <div class="shop-empty__icon">${shopMode === 'inventory' ? '📦' : '✨'}</div>
        <p class="shop-empty__text">${shopMode === 'inventory' ? 'Noch keine Items im Inventar.' : 'Keine Items in dieser Kategorie.'}</p>
      </div>`;
      return;
    }
    grid.innerHTML = items.map(renderDigitalCard).join("");
    return;
  }

  // Branch 3: "Alle" — show real products first, then digital
  const realCards = REAL_PRODUCTS.map(renderCashbackCard).join("");
  const digitalItems = SHOP_ITEMS.filter(i => !shopMode === "inventory" ? true : state.inventory.includes(i.id));
  const digitalCards = digitalItems.map(renderDigitalCard).join("");
  grid.innerHTML = `
    <div class="cashback-info">
      <div class="cashback-info__balance">Dein Guthaben: <strong>${pointsToEuro(state.points)}</strong></div>
      <div class="cashback-info__hint">100 Pkt = 1 € · einlösbar auf reale Produkte</div>
    </div>
    <div class="shop-section-title">Anwendungen & Webshop</div>
    <div class="cashback-grid">${realCards}</div>
    <div class="shop-section-title">Avatar-Items</div>
    <div class="shop-grid-digital">${digitalCards}</div>
  `;
}

function renderCashbackCard(p){
  const d = maxDiscountFor(p);
  const hasDiscount = d.euro >= 1;
  const pctApplied = Math.round((d.euro / p.price) * 100);
  return `<article class="cashback-card">
    <div class="cashback-card__head">
      <div class="cashback-card__icon">${esc(p.icon)}</div>
      <div class="cashback-card__meta">
        <div class="cashback-card__name">${esc(p.name)}</div>
        <div class="cashback-card__desc">${esc(p.desc)}</div>
      </div>
    </div>
    <div class="cashback-card__price-row">
      <div class="cashback-card__prices">
        ${hasDiscount
          ? `<span class="cashback-card__original">${p.price.toFixed(0)} €</span>
             <span class="cashback-card__final">${d.finalPrice.toFixed(2)} €</span>`
          : `<span class="cashback-card__final">${p.price.toFixed(0)} €</span>`}
      </div>
      ${hasDiscount
        ? `<span class="cashback-card__pill">−${d.euro.toFixed(2)} € (${pctApplied} %)</span>`
        : `<span class="cashback-card__cap">bis ${p.maxDiscountPct} % Rabatt möglich</span>`}
    </div>
    ${hasDiscount
      ? `<button class="btn--cta cashback-card__btn" data-redeem="${esc(p.id)}">${d.euro.toFixed(2)} € einlösen (${d.points} Pkt)</button>`
      : `<button class="btn--cta btn--cta-ghost cashback-card__btn" disabled>Erst Punkte sammeln</button>`}
  </article>`;
}

function renderDigitalCard(i){
  const owned = state.inventory.includes(i.id);
  const equipped = state.equipped[i.cat] === i.id;
  const canBuy = state.points >= i.price;
  return `<article class="item">
    <div class="item__preview ${i.limited?'is-limited':''}">${i.emoji}</div>
    <span class="item__name">${esc(i.name)}</span>
    <div class="item__footer">
      ${owned
        ? (equipped
            ? `<button class="btn--equip is-equipped" data-equip="${esc(i.id)}">✓ Aktiv</button>`
            : `<button class="btn--equip" data-equip="${esc(i.id)}">Anziehen</button>`)
        : (canBuy
            ? `<button class="btn--buy" data-buy="${esc(i.id)}"><span class="price">${i.price}</span></button>`
            : `<button class="btn--buy" disabled><span class="price">${i.price}</span></button>`)}
    </div>
  </article>`;
}

function catLabel(c){ return { service:"Anwendungen", webshop:"Webshop", accessoire:"Accessoires", background:"Hintergründe" }[c] || c }

/* ===== Redeem cashback discount ===== */
function redeemDiscount(productId){
  const p = REAL_PRODUCTS.find(x => x.id === productId);
  if(!p) return;
  const d = maxDiscountFor(p);
  if(d.points <= 0) return;

  // Deduct points
  state.points -= d.points;
  save();

  // Generate redemption code
  const code = (p.id.toUpperCase().replace(/[-_]/g,"") + "-" + Math.random().toString(36).slice(2,6).toUpperCase());
  state.redemptions = state.redemptions || [];
  state.redemptions.push({ id: productId, code, points: d.points, euro: d.euro, date: new Date().toISOString() });
  save();

  sfx("buy");
  confetti("epic");

  const where = p.cat === "service" ? "an der Rezeption im Studio" : "im Webshop unter shop.freezeclub.de";
  showModal({
    eyebrow: "Rabatt eingelöst",
    title: `${d.euro.toFixed(2)} € Rabatt`,
    desc: `Auf ${p.name}\n\nDein Code:\n${code}\n\nGültig 30 Tage · einzulösen ${where}.\n\nNeuer Preis: ${d.finalPrice.toFixed(2)} € statt ${p.price.toFixed(0)} €.`,
    art: p.icon,
  });

  renderAll(true);
}

window.REAL_PRODUCTS = REAL_PRODUCTS;

/* ---------- Actions ---------- */
function bookService(id, evtTarget){
  const svc = SERVICES.find(s=>s.id===id);
  if(!svc) return;
  const offPeak = getOffPeakBonus();
  const pts = Math.round(svc.points * offPeak.multiplier);

  const oldLevel = Math.floor(state.seasonPoints / LEVEL_STEP) + 1;

  state.points += pts;
  state.seasonPoints += pts;
  state.totalPoints += pts;
  state.visits += 1;
  state.counts[id] = (state.counts[id]||0) + 1;

  // Weekly streak logic (Sundays don't count, weekly goal-based)
  const now = new Date();
  const currentWeek = isoWeekKey(now);
  if(state.weekKey !== currentWeek){
    // Week changed — evaluate previous week's streak result
    if(state.weekKey){
      const prevExpected = prevIsoWeekKey(currentWeek);
      const prevHitGoal = (state.weekKey === prevExpected) && (state.weekVisits >= state.weekGoal);
      state.weeklyStreak = prevHitGoal ? (state.weeklyStreak || 0) + 1 : 0;
    }
    state.weekKey = currentWeek;
    state.weekVisits = 0;
  }
  state.weekVisits += 1;
  state.lastVisitDate = now.toISOString();

  // Bonus when weekly goal first reached
  if(state.weekVisits === state.weekGoal){
    state.points += 100; state.seasonPoints += 100; state.totalPoints += 100;
    setTimeout(() => toast(`Wochenziel erreicht · +100 Bonus`, 3200), 800);
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
  const bonusLabel = offPeak.active ? ` · ${offPeak.multiplier}× Bonus aktiv` : "";
  toast(`+${pts} Punkte · ${svc.name}${bonusLabel}`);
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
      toast(`MISSION COMPLETE: ${c.title} · +${c.reward} Punkte`, 3500);
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
  if(item.cat === "accessoire") state.equipped.accessoire = id;
  else if(item.cat === "background") state.equipped.background = id;
  save();
  sfx("buy");
  if(item.cat === "reward"){
    showRewardClaim(item);
  } else {
    showLootReveal(item);
  }
  renderAll(true);
  checkAchievements();
}

function showRewardClaim(item){
  confetti("epic");
  const code = (item.id.toUpperCase() + "-" + Math.random().toString(36).slice(2,7).toUpperCase());
  showModal({
    eyebrow: "Belohnung eingelöst",
    title: item.name,
    desc: `Zeig diesen Code an der Rezeption oder gib ihn im Webshop ein:\n\n${code}\n\nWert: ${item.realValue || "—"}`,
    art: item.emoji,
  });
}

function equipItem(id){
  const item = SHOP_ITEMS.find(i=>i.id===id);
  if(!item || !state.inventory.includes(id)) return;
  if(item.cat === "accessoire"){
    state.equipped.accessoire = state.equipped.accessoire === id ? null : id;
  } else if(item.cat === "background"){
    state.equipped.background = state.equipped.background === id ? null : id;
  }
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
  // Multi-paragraph aware
  const descEl = $("#modalDesc");
  if(descEl){
    descEl.innerHTML = String(desc || "").split(/\n\n+/).map(p => `<p>${esc(p)}</p>`).join("");
  }
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
  // Backwards-compat: legacy tabs map onto new structure
  if(name === "editor" || name === "challenges") name = "profile";
  sfx("click");
  $$(".tab").forEach(t => t.classList.toggle("is-active", t.dataset.tab === name));
  $$(".bnav").forEach(b => b.classList.toggle("is-active", b.dataset.tab === name));
  $$(".view").forEach(v => v.classList.toggle("is-active", v.id === "view-"+name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Events ---------- */
function bindEvents(){
  // Onboarding nav handled by GLOBAL delegation (see below bindEvents).
  // Form submit binding remains here for redundancy.
  $("#onboardingForm")?.addEventListener("submit", e => {
    e.preventDefault();
    completeOnboarding();
  });


  $$(".tab, .bnav").forEach(t => t.addEventListener("click", () => showTab(t.dataset.tab)));
  $$("[data-go]").forEach(b => b.addEventListener("click", () => showTab(b.dataset.go)));

  document.addEventListener("click", (e) => {
    const part = e.target.closest("[data-part]");
    const article = e.target.closest("[data-article]");
    if(article){ openArticle(article.dataset.article); return; }
    const redeem = e.target.closest("[data-redeem]");
    if(redeem){ redeemDiscount(redeem.dataset.redeem); return; }
    if(e.target.id === "claimComeback"){
      navigator.clipboard?.writeText("WIRVERMISSENDICH");
      toast("Code kopiert: WIRVERMISSENDICH · 30 % Rabatt");
      state.comebackClaimedMonth = new Date().toISOString().slice(0,7);
      save(); renderHomeBanners();
      return;
    }
    const presetCard = e.target.closest("[data-preset]");
    if(presetCard){ selectPreset(presetCard.dataset.preset); return; }
    const unequipBtn = e.target.closest("[data-unequip]");
    if(unequipBtn){ unequipSlot(unequipBtn.dataset.unequip); return; }
    if(part){ /* legacy noop */ return; }
    if(e.target.id === "randomizeBtn"){ return; }
    if(e.target.id === "saveAvatarBtn"){ sfx("levelup"); toast("Avatar gespeichert"); return; }
    const svc = e.target.closest("[data-service]");
    if(svc){ bookService(svc.dataset.service, svc); return; }
    const buy = e.target.closest("[data-buy]");
    if(buy && !buy.disabled){ buyItem(buy.dataset.buy); return; }
    const eq = e.target.closest("[data-equip]");
    if(eq){ equipItem(eq.dataset.equip); return; }
  });

  $("#shopFilters")?.addEventListener("click", e => {
    const c = e.target.closest(".shop-cat");
    if(!c) return;
    sfx("click");
    $$("#shopFilters .shop-cat").forEach(x => x.classList.remove("is-active"));
    c.classList.add("is-active");
    currentFilter = c.dataset.filter;
    renderShop(currentFilter);
  });

  $("#shopToggle")?.addEventListener("click", e => {
    const b = e.target.closest(".shop-toggle__btn");
    if(!b) return;
    sfx("click");
    $$("#shopToggle .shop-toggle__btn").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
    shopMode = b.dataset.tab;
    renderShop(currentFilter);
  });

  $("#modalClose").addEventListener("click", () => { sfx("click"); hideModal(); });
  $("#modal").addEventListener("click", (e) => { if(e.target.id === "modal") hideModal(); });

  $("#soundBtn")?.addEventListener("click", () => {
    state.soundOn = !state.soundOn;
    save();
    if(state.soundOn) sfx("click");
    renderAll();
  });

  $("#weekGoalBtn")?.addEventListener("click", () => {
    const next = ((state.weekGoal || 2) % 4) + 1;
    state.weekGoal = next;
    save();
    sfx("click");
    toast(`Wochenziel: ${next}× pro Woche`);
    renderAll();
  });

  $("#resetBtn")?.addEventListener("click", () => {
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
  setTimeout(maybeShowInstallPrompt, 4000);
}

/* ---- PWA install prompts (Chrome / Edge / iOS-Safari hint) ---- */
let _deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  _deferredInstallPrompt = e;
});

function isStandalone(){
  return window.matchMedia("(display-mode: standalone)").matches ||
         window.navigator.standalone === true;
}
function isIOSSafari(){
  const ua = navigator.userAgent || "";
  const iOS = /iPhone|iPad|iPod/.test(ua);
  const safari = /^((?!chrome|crios|fxios).)*safari/i.test(ua);
  return iOS && safari;
}

function maybeShowInstallPrompt(){
  if(isStandalone()) return;
  if(localStorage.getItem("fc_install_dismissed")) return;

  if(_deferredInstallPrompt){
    showInstallBanner({
      title: "Zur Startseite hinzufügen",
      desc: "Installiere Freezeclub für schnellen Zugriff – kein App Store nötig.",
      cta: "Installieren",
      onCta: async () => {
        _deferredInstallPrompt.prompt();
        await _deferredInstallPrompt.userChoice;
        _deferredInstallPrompt = null;
        dismissInstallBanner(true);
      },
    });
    return;
  }

  if(isIOSSafari()){
    showInstallBanner({
      title: "Frosti aufs iPhone holen",
      desc: "Tippe unten auf Teilen, dann „Zum Home-Bildschirm“.",
      cta: "Verstanden",
      onCta: () => dismissInstallBanner(true),
    });
  }
}

function showInstallBanner({ title, desc, cta, onCta }){
  if(document.getElementById("installBanner")) return;
  const el = document.createElement("div");
  el.id = "installBanner";
  el.className = "install-banner";
  el.innerHTML = `
    <img class="install-banner__icon" src="./icons/icon-192.png" alt="" draggable="false">
    <div class="install-banner__body">
      <div class="install-banner__title">${esc(title)}</div>
      <div class="install-banner__desc">${esc(desc)}</div>
    </div>
    <button class="install-banner__cta" id="installCta">${esc(cta)}</button>
    <button class="install-banner__close" id="installClose" aria-label="Schließen">×</button>
  `;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("is-show"), 50);
  document.getElementById("installCta").addEventListener("click", onCta);
  document.getElementById("installClose").addEventListener("click", () => dismissInstallBanner(true));
}

function dismissInstallBanner(persist){
  const el = document.getElementById("installBanner");
  if(el){
    el.classList.remove("is-show");
    setTimeout(() => el.remove(), 250);
  }
  if(persist) localStorage.setItem("fc_install_dismissed", "1");
}

function boot(){
  bindEvents();
  // Migrate to v7 preset-based avatar
  if(!state.avatar || !state.avatar.preset || !(window.PRESETS || {})[state.avatar.preset]){
    state.avatar = window.defaultAvatar();
    save();
  }
  // Ensure equipped slots match new schema
  if(!state.equipped || (!("accessoire" in state.equipped) && !("background" in state.equipped))){
    state.equipped = { accessoire: null, background: null };
    save();
  }
  // Engagement migrations
  if(state.lastArticleRead === undefined) state.lastArticleRead = null;
  if(!Array.isArray(state.readArticles)) state.readArticles = [];
  if(state.comebackClaimedMonth === undefined) state.comebackClaimedMonth = null;
  if(state.weekGoalChosen === undefined) state.weekGoalChosen = false;
  // Migrate older daily-streak schema to weekly
  if(!state.weekGoal) state.weekGoal = 2;
  if(state.weekKey === undefined) state.weekKey = null;
  if(state.weekVisits === undefined) state.weekVisits = 0;
  if(state.weeklyStreak === undefined) state.weeklyStreak = 0;
  // If a new week started since last load, reset weekly counter without breaking streak
  const currentWeek = isoWeekKey(new Date());
  if(state.weekKey && state.weekKey !== currentWeek){
    const prevExpected = prevIsoWeekKey(currentWeek);
    const hit = (state.weekKey === prevExpected) && (state.weekVisits >= state.weekGoal);
    state.weeklyStreak = hit ? (state.weeklyStreak || 0) + 1 : 0;
    state.weekVisits = 0;
    state.weekKey = currentWeek;
    save();
  }
  // Fallback: always show a Frosti image in onboarding even if renderAvatarV2 unavailable
  var onbAv = document.getElementById("onboardingAvatar");
  if(onbAv){
    try{
      if(window.renderAvatarV2 && state.avatar){
        window.renderAvatarV2(onbAv, state.avatar, { level: 1 });
      } else {
        onbAv.innerHTML = '<img class="frosti-img" src="./assets/avatars/frost-1.png?v=v3.5" alt="Frosti" draggable="false" style="width:100%;height:100%;object-fit:contain">';
      }
    } catch(err){
      onbAv.innerHTML = '<img class="frosti-img" src="./assets/avatars/frost-1.png?v=v3.5" alt="Frosti" draggable="false" style="width:100%;height:100%;object-fit:contain">';
    }
  }
  if(state.onboarded) enterApp();
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", boot);
} else {
  // DOM already parsed (script was loaded after) — run immediately
  boot();
}
