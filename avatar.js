/* Freezeclub Avatar v4 — Chibi mascot style (BitePal-inspired) */

const AVATAR_PARTS = {
  skinTone: ["#fce4cc","#f4d4b0","#e8bf95","#d5a578","#bc8a5c","#9a6b42","#7a4f2e","#5a3a20"],
  eyeShape: ["sparkle", "round", "happy", "cool"],
  eyeColor: ["#2a3b5c","#1c5a3e","#7a4a20","#2a1810","#4a6a8a","#0a0a0a","#5d4e6e"],
  brow: ["soft", "raised", "thick", "none"],
  mouth: ["smile", "open", "smirk", "ohh", "neutral"],
  blush: ["none", "pink", "frost"],
  hairStyle: ["short","wavy","bob","long","buzz","pony","curly","bun","spiky","topknot"],
  hairColor: ["#1a1410","#3d2818","#5d3e22","#8a6a3a","#c8a566","#e8d8c8","#6b3838","#3a2a3a","#6ec5d5","#b8a0d8"],
  outfit: ["hoodie", "tee", "tank", "puffer", "tracksuit"],
  outfitColor: ["#2a3548","#4a5a72","#1c2a3e","#6ec5d5","#ede4d3","#8a4a4a","#3a5a3a","#6e5a8a"],
};

const PART_LABELS = {
  skinTone: "Hautton", eyeShape: "Augen", eyeColor: "Augenfarbe",
  brow: "Brauen", mouth: "Mund", blush: "Wangen",
  hairStyle: "Haarstil", hairColor: "Haarfarbe",
  outfit: "Outfit", outfitColor: "Outfit-Farbe",
};

const PART_ORDER = ["skinTone","eyeShape","eyeColor","brow","mouth","blush","hairStyle","hairColor","outfit","outfitColor"];

function defaultAvatar(){
  return {
    skinTone: AVATAR_PARTS.skinTone[2],
    eyeShape: "sparkle", eyeColor: AVATAR_PARTS.eyeColor[0],
    brow: "soft", mouth: "smile", blush: "frost",
    hairStyle: "short", hairColor: AVATAR_PARTS.hairColor[1],
    outfit: "hoodie", outfitColor: AVATAR_PARTS.outfitColor[3],
  };
}

function _shade(hex, amt){
  const c = hex.replace("#","");
  const num = parseInt(c, 16);
  let r = (num >> 16) + amt, g = ((num >> 8) & 0xff) + amt, b = (num & 0xff) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + ((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
}

let _uid = 0;
const nextId = () => "av" + (++_uid);

/* ===== Chibi proportions (viewBox 200x230)
   Head dominates: ~60% of canvas. Tiny body. Big eyes. ===== */

/* ---------- Body & outfit ---------- */
function bodyAndOutfit(outfit, color){
  const c = color, d = _shade(color, -18), l = _shade(color, 14);
  // Body base: small rounded torso from y=160 to y=215, arms little stubs
  if(outfit === "hoodie"){
    return `
      <!-- arms -->
      <ellipse cx="55" cy="185" rx="14" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
      <ellipse cx="145" cy="185" rx="14" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
      <!-- body -->
      <path d="M65,165 Q100,158 135,165 L142,220 Q100,228 58,220 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.8"/>
      <!-- hoodie front pocket -->
      <path d="M78,195 L122,195 L118,212 L82,212 Z" fill="${d}" stroke="#0a0a0a" stroke-width="2"/>
      <!-- hood drawstrings -->
      <line x1="90" y1="168" x2="88" y2="185" stroke="${l}" stroke-width="2" stroke-linecap="round"/>
      <line x1="110" y1="168" x2="112" y2="185" stroke="${l}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="88" cy="186" r="2" fill="${l}"/>
      <circle cx="112" cy="186" r="2" fill="${l}"/>
    `;
  }
  if(outfit === "tee"){
    return `
      <ellipse cx="55" cy="185" rx="13" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
      <ellipse cx="145" cy="185" rx="13" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
      <path d="M65,168 Q100,162 135,168 L140,220 Q100,228 60,220 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.8"/>
      <!-- neckline -->
      <path d="M88,168 Q100,178 112,168" fill="none" stroke="#0a0a0a" stroke-width="2"/>
    `;
  }
  if(outfit === "tank"){
    return `
      <!-- bare arms (skin will show) -->
      <ellipse cx="55" cy="188" rx="12" ry="22" fill="${color}" stroke="#0a0a0a" stroke-width="2.5"/>
      <ellipse cx="145" cy="188" rx="12" ry="22" fill="${color}" stroke="#0a0a0a" stroke-width="2.5"/>
      <path d="M72,168 Q100,164 128,168 L138,222 Q100,228 62,222 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.8"/>
      <path d="M88,168 Q100,176 112,168" fill="none" stroke="#0a0a0a" stroke-width="2"/>
    `;
  }
  if(outfit === "puffer"){
    return `
      <ellipse cx="50" cy="185" rx="17" ry="24" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
      <ellipse cx="150" cy="185" rx="17" ry="24" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
      <path d="M58,168 Q100,160 142,168 L148,222 Q100,232 52,222 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.8"/>
      <!-- puffer stripes -->
      <line x1="62" y1="185" x2="138" y2="185" stroke="${d}" stroke-width="1.8"/>
      <line x1="62" y1="200" x2="138" y2="200" stroke="${d}" stroke-width="1.8"/>
      <line x1="62" y1="215" x2="138" y2="215" stroke="${d}" stroke-width="1.8"/>
    `;
  }
  // tracksuit
  return `
    <ellipse cx="55" cy="185" rx="14" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
    <ellipse cx="145" cy="185" rx="14" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
    <path d="M65,168 Q100,162 135,168 L140,222 Q100,228 60,222 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.8"/>
    <!-- white stripes -->
    <line x1="58" y1="170" x2="55" y2="206" stroke="#fff" stroke-width="2"/>
    <line x1="142" y1="170" x2="145" y2="206" stroke="#fff" stroke-width="2"/>
    <line x1="100" y1="170" x2="100" y2="225" stroke="#fff" stroke-width="1.5" opacity=".5"/>
  `;
}

/* ---------- Hair ---------- */
function hairBack(style, color){
  if(style === "buzz") return "";
  const c = color;
  if(style === "long")     return `<path d="M30,90 Q24,180 50,200 L150,200 Q176,180 170,90 Q165,40 100,28 Q35,40 30,90 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "wavy")     return `<path d="M32,95 Q28,160 56,180 L144,180 Q172,160 168,95 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "bob")      return `<path d="M35,90 Q30,130 55,145 L145,145 Q170,130 165,90 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "pony")     return `<ellipse cx="100" cy="40" rx="50" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
                                   <path d="M48,90 Q42,170 65,205 L82,205 Q70,170 65,90 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "curly")    return `<path d="M30,85 Q22,160 56,190 L144,190 Q178,160 170,85 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
                                   <circle cx="40" cy="170" r="12" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>
                                   <circle cx="58" cy="186" r="11" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>
                                   <circle cx="142" cy="186" r="11" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>
                                   <circle cx="160" cy="170" r="12" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>`;
  if(style === "bun")      return `<ellipse cx="100" cy="22" rx="28" ry="22" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "topknot")  return `<ellipse cx="100" cy="18" rx="20" ry="18" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
                                   <ellipse cx="100" cy="14" rx="14" ry="10" fill="${_shade(color,15)}"/>`;
  if(style === "spiky")    return `<path d="M30,80 L46,40 L62,75 L78,30 L94,72 L106,32 L122,70 L138,28 L154,75 L170,40 L170,90 L30,90 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5" stroke-linejoin="round"/>`;
  if(style === "short")    return "";
  return "";
}

function hairFront(style, color){
  if(style === "buzz") return `<path d="M44,82 Q100,52 156,82 Q152,68 100,58 Q48,68 44,82 Z" fill="${color}" opacity=".9"/>`;
  if(style === "topknot" || style === "spiky") return "";
  const c = color;
  const d = _shade(color, -25);
  // Default cute fringe
  if(style === "short") return `<path d="M38,80 Q100,30 162,80 Q156,55 100,42 Q44,55 38,80 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
                                <path d="M45,75 Q70,55 95,60" fill="none" stroke="${d}" stroke-width="1.5" opacity=".5"/>`;
  if(style === "wavy")  return `<path d="M36,88 Q66,42 100,42 Q134,42 164,88 Q138,60 100,58 Q62,60 36,88 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
                                <path d="M50,80 Q75,58 100,55" fill="none" stroke="${d}" stroke-width="1.8" opacity=".5"/>
                                <path d="M150,80 Q125,58 100,55" fill="none" stroke="${d}" stroke-width="1.8" opacity=".5"/>`;
  if(style === "bob")   return `<path d="M35,82 Q100,32 165,82 Q160,55 100,42 Q40,55 35,82 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "long")  return `<path d="M35,84 Q100,32 165,84 Q160,55 100,42 Q40,55 35,84 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "pony")  return `<path d="M42,76 Q100,40 158,76 Q154,58 100,48 Q46,58 42,76 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  if(style === "curly") return `<path d="M36,82 Q100,28 164,82 Q158,58 100,46 Q42,58 36,82 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>
                                <circle cx="48" cy="58" r="9" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>
                                <circle cx="152" cy="58" r="9" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>
                                <circle cx="80" cy="42" r="8" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>
                                <circle cx="120" cy="42" r="8" fill="${c}" stroke="#0a0a0a" stroke-width="2"/>`;
  if(style === "bun")   return `<path d="M40,80 Q100,46 160,80 Q156,62 100,52 Q44,62 40,80 Z" fill="${c}" stroke="#0a0a0a" stroke-width="2.5"/>`;
  return "";
}

/* ---------- Eyes (BIG expressive anime eyes) ---------- */
function eyes(shape, color){
  // Eye centers: left (66, 110), right (134, 110) — BIG and spaced wide for chibi feel
  const lx = 66, rx = 134, cy = 112;
  const irisDark = _shade(color, -25);

  if(shape === "round"){
    return `
      <ellipse cx="${lx}" cy="${cy}" rx="18" ry="20" fill="#fff" stroke="#0a0a0a" stroke-width="3"/>
      <ellipse cx="${rx}" cy="${cy}" rx="18" ry="20" fill="#fff" stroke="#0a0a0a" stroke-width="3"/>
      <ellipse cx="${lx}" cy="${cy+2}" rx="11" ry="13" fill="${color}"/>
      <ellipse cx="${rx}" cy="${cy+2}" rx="11" ry="13" fill="${color}"/>
      <ellipse cx="${lx}" cy="${cy+3}" rx="6" ry="8" fill="${irisDark}"/>
      <ellipse cx="${rx}" cy="${cy+3}" rx="6" ry="8" fill="${irisDark}"/>
      <ellipse cx="${lx-3}" cy="${cy-4}" rx="3" ry="4" fill="#fff"/>
      <ellipse cx="${rx-3}" cy="${cy-4}" rx="3" ry="4" fill="#fff"/>
      <circle cx="${lx+5}" cy="${cy+6}" r="1.5" fill="#fff"/>
      <circle cx="${rx+5}" cy="${cy+6}" r="1.5" fill="#fff"/>
    `;
  }
  if(shape === "sparkle"){
    return `
      <ellipse cx="${lx}" cy="${cy}" rx="17" ry="21" fill="#fff" stroke="#0a0a0a" stroke-width="3"/>
      <ellipse cx="${rx}" cy="${cy}" rx="17" ry="21" fill="#fff" stroke="#0a0a0a" stroke-width="3"/>
      <ellipse cx="${lx}" cy="${cy+3}" rx="11" ry="14" fill="${color}"/>
      <ellipse cx="${rx}" cy="${cy+3}" rx="11" ry="14" fill="${color}"/>
      <ellipse cx="${lx}" cy="${cy+5}" rx="6" ry="9" fill="${irisDark}"/>
      <ellipse cx="${rx}" cy="${cy+5}" rx="6" ry="9" fill="${irisDark}"/>
      <!-- Big sparkle highlight -->
      <ellipse cx="${lx-4}" cy="${cy-6}" rx="4.5" ry="6" fill="#fff"/>
      <ellipse cx="${rx-4}" cy="${cy-6}" rx="4.5" ry="6" fill="#fff"/>
      <!-- Small sparkle -->
      <circle cx="${lx+6}" cy="${cy+8}" r="2" fill="#fff"/>
      <circle cx="${rx+6}" cy="${cy+8}" r="2" fill="#fff"/>
      <!-- Tiny dot -->
      <circle cx="${lx+8}" cy="${cy-3}" r="1.2" fill="#fff" opacity=".7"/>
      <circle cx="${rx+8}" cy="${cy-3}" r="1.2" fill="#fff" opacity=".7"/>
    `;
  }
  if(shape === "happy"){
    // Closed happy eyes — arcs
    return `
      <path d="M${lx-14},${cy+2} Q${lx},${cy-12} ${lx+14},${cy+2}" fill="none" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round"/>
      <path d="M${rx-14},${cy+2} Q${rx},${cy-12} ${rx+14},${cy+2}" fill="none" stroke="#0a0a0a" stroke-width="4" stroke-linecap="round"/>
    `;
  }
  // cool — narrow + sharp
  return `
    <path d="M${lx-15},${cy} Q${lx-5},${cy-7} ${lx+15},${cy-2} Q${lx+5},${cy+6} ${lx-15},${cy} Z" fill="#fff" stroke="#0a0a0a" stroke-width="3"/>
    <path d="M${rx-15},${cy-2} Q${rx-5},${cy-7} ${rx+15},${cy} Q${rx+5},${cy+6} ${rx-15},${cy-2} Z" fill="#fff" stroke="#0a0a0a" stroke-width="3"/>
    <ellipse cx="${lx}" cy="${cy}" rx="6" ry="6" fill="${color}"/>
    <ellipse cx="${rx}" cy="${cy-1}" rx="6" ry="6" fill="${color}"/>
    <circle cx="${lx}" cy="${cy}" r="3" fill="${irisDark}"/>
    <circle cx="${rx}" cy="${cy-1}" r="3" fill="${irisDark}"/>
  `;
}

function brows(type, color){
  const c = "#0a0a0a";
  if(type === "none") return "";
  if(type === "raised")   return `<path d="M48,80 Q60,72 82,82" stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none"/>
                                  <path d="M118,82 Q140,72 152,80" stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
  if(type === "thick")    return `<path d="M50,85 Q66,76 84,85" stroke="${c}" stroke-width="6" stroke-linecap="round" fill="none"/>
                                  <path d="M116,85 Q134,76 150,85" stroke="${c}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  // soft
  return `<path d="M52,86 Q66,80 82,86" stroke="${c}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
          <path d="M118,86 Q134,80 148,86" stroke="${c}" stroke-width="3.5" stroke-linecap="round" fill="none"/>`;
}

function mouth(type, skin){
  const c = "#0a0a0a";
  const tongue = "#ff8a9a";
  // Mouth area around y=145
  if(type === "smile")   return `<path d="M82,142 Q100,156 118,142" stroke="${c}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if(type === "open")    return `<path d="M80,140 Q100,162 120,140 Q100,150 80,140 Z" fill="${c}"/>
                                 <path d="M88,148 Q100,158 112,148 Q100,154 88,148 Z" fill="${tongue}"/>`;
  if(type === "smirk")   return `<path d="M85,144 Q105,150 118,140" stroke="${c}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if(type === "ohh")     return `<ellipse cx="100" cy="146" rx="7" ry="9" fill="${c}"/>
                                 <ellipse cx="100" cy="149" rx="4" ry="5" fill="${tongue}"/>`;
  // neutral
  return `<line x1="92" y1="146" x2="108" y2="146" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
}

function nose(skin){
  // Tiny cute nose
  const c = "#0a0a0a";
  return `<path d="M97,126 Q100,131 103,126" stroke="${c}" stroke-width="2" stroke-linecap="round" fill="none"/>`;
}

function blushEl(type){
  if(type === "none") return "";
  const c = type === "frost" ? "#a8d0e0" : "#ff9aaa";
  const opacity = type === "frost" ? ".7" : ".6";
  return `<ellipse cx="50" cy="130" rx="10" ry="6" fill="${c}" opacity="${opacity}"/>
          <ellipse cx="150" cy="130" rx="10" ry="6" fill="${c}" opacity="${opacity}"/>`;
}

function gearOverlay(gear){
  if(!gear) return "";
  if(gear === "gear-mask")   return `<path d="M55,128 Q100,165 145,128 L142,156 Q100,176 58,156 Z" fill="#eef2f6" stroke="#0a0a0a" stroke-width="2"/>
                                     <line x1="65" y1="142" x2="135" y2="142" stroke="#0a0a0a" stroke-width="1.5" opacity=".4"/>
                                     <circle cx="100" cy="155" r="4" fill="#a8c8d8" opacity=".7"/>`;
  if(gear === "gear-visor")  return `<rect x="38" y="98" width="124" height="28" rx="14" fill="#0a0a0a"/>
                                     <rect x="42" y="104" width="116" height="8" rx="4" fill="#6ec5d5" opacity=".6"/>
                                     <rect x="48" y="105" width="28" height="3.5" rx="1.5" fill="#fff" opacity=".5"/>
                                     <rect x="124" y="105" width="28" height="3.5" rx="1.5" fill="#fff" opacity=".3"/>`;
  return "";
}

function auraOverlay(aura){
  const map = { "aura-frost": "#a8d0e0", "aura-arctic": "#b8d8e6", "aura-cryo": "#6ec5d5" };
  const c = map[aura];
  if(!c) return "";
  return `<div style="position:absolute;inset:5%;border-radius:50%;background:radial-gradient(circle,${c}55,transparent 60%);filter:blur(16px);animation:pulse 3.5s ease-in-out infinite;pointer-events:none;z-index:1"></div>`;
}

/* ---------- Compose ---------- */
function composeAvatarSVG(a, equipped){
  const skin = a.skinTone;
  const skinShadow = _shade(skin, -15);
  const skinLight = _shade(skin, 12);
  const gid = nextId();

  return `<svg viewBox="0 0 200 230" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" style="position:relative;z-index:2;display:block">
    <defs>
      <radialGradient id="skin_${gid}" cx="45%" cy="35%" r="65%">
        <stop offset="0" stop-color="${skinLight}"/>
        <stop offset=".6" stop-color="${skin}"/>
        <stop offset="1" stop-color="${skinShadow}"/>
      </radialGradient>
    </defs>

    <!-- shadow under feet -->
    <ellipse cx="100" cy="225" rx="48" ry="5" fill="#000" opacity=".22"/>

    <!-- body/outfit (drawn FIRST so head sits on top) -->
    <g class="avatar-body">${bodyAndOutfit(a.outfit, a.outfitColor)}</g>

    <!-- neck -->
    <rect x="92" y="150" width="16" height="14" rx="4" fill="${skinShadow}"/>

    <!-- ears -->
    <ellipse cx="30" cy="110" rx="9" ry="13" fill="url(#skin_${gid})" stroke="#0a0a0a" stroke-width="2.5"/>
    <ellipse cx="30" cy="112" rx="3.5" ry="6" fill="${skinShadow}"/>
    <ellipse cx="170" cy="110" rx="9" ry="13" fill="url(#skin_${gid})" stroke="#0a0a0a" stroke-width="2.5"/>
    <ellipse cx="170" cy="112" rx="3.5" ry="6" fill="${skinShadow}"/>

    <!-- hair back -->
    ${hairBack(a.hairStyle, a.hairColor)}

    <!-- HEAD — large round chibi head -->
    <ellipse cx="100" cy="100" rx="62" ry="62" fill="url(#skin_${gid})" stroke="#0a0a0a" stroke-width="3"/>

    <!-- face features -->
    ${brows(a.brow, a.hairColor)}
    ${eyes(a.eyeShape, a.eyeColor)}
    ${nose(skin)}
    ${blushEl(a.blush)}
    ${mouth(a.mouth, skin)}

    <!-- hair front -->
    ${hairFront(a.hairStyle, a.hairColor)}

    <!-- gear over face -->
    ${gearOverlay(equipped?.gear)}

    <!-- frost accents floating around -->
    <g class="frost-deco" opacity=".85">
      <path d="M12,60 L18,60 M15,57 L15,63" stroke="#6ec5d5" stroke-width="2" stroke-linecap="round"/>
      <path d="M185,80 L191,80 M188,77 L188,83" stroke="#6ec5d5" stroke-width="2" stroke-linecap="round"/>
      <circle cx="180" cy="40" r="2.5" fill="#b8d8e6"/>
      <circle cx="20" cy="160" r="2" fill="#b8d8e6"/>
    </g>
  </svg>`;
}

function renderAvatarV2(target, avatar, equipped){
  if(!target || !avatar) return;
  target.innerHTML = auraOverlay(equipped?.aura) + composeAvatarSVG(avatar, equipped);
}

window.AVATAR_PARTS = AVATAR_PARTS;
window.PART_LABELS = PART_LABELS;
window.PART_ORDER = PART_ORDER;
window.defaultAvatar = defaultAvatar;
window.renderAvatarV2 = renderAvatarV2;
