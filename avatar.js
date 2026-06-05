/* Freezeclub Avatar System v3 — Premium illustration */

const AVATAR_PARTS = {
  bodyType: ["slim", "athletic", "robust"],
  skinTone: ["#f4d4b6","#ecc4a0","#dfac86","#cf9468","#b87a4e","#9a5f3a","#7a4628","#5a3018"],
  faceShape: ["oval", "round", "square"],
  eyeShape: ["almond", "round", "narrow"],
  eyeColor: ["#3a5a78","#2a6b4c","#7a5530","#3d2818","#5780a0","#1a1a1a"],
  brow: ["arched", "straight", "thick"],
  nose: ["small", "medium", "wide"],
  mouth: ["neutral", "smile", "subtle"],
  hairStyle: ["short","wavy","bob","long","buzz","pony","curly","bun","undercut"],
  hairColor: ["#1a1410","#3d2818","#5d3e22","#8a6a3a","#c8a566","#d8d8d8","#6b3838","#3a2a3a","#4ee0f0"],
};

const PART_LABELS = {
  bodyType: "Körper", skinTone: "Hautton", faceShape: "Gesicht",
  eyeShape: "Augen", eyeColor: "Augenfarbe", brow: "Brauen",
  nose: "Nase", mouth: "Mund", hairStyle: "Haarstil", hairColor: "Haarfarbe",
};

const PART_ORDER = ["bodyType","skinTone","faceShape","eyeShape","eyeColor","brow","nose","mouth","hairStyle","hairColor"];

function defaultAvatar(){
  return {
    bodyType: "athletic", skinTone: AVATAR_PARTS.skinTone[2],
    faceShape: "oval", eyeShape: "almond", eyeColor: AVATAR_PARTS.eyeColor[0],
    brow: "arched", nose: "medium", mouth: "subtle",
    hairStyle: "short", hairColor: AVATAR_PARTS.hairColor[1],
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

/* ---------- Coordinates (viewBox 200x260) ---------- */
/* Head center: (100, 95), large head for premium illustration feel */
const HEAD = { cx: 100, cy: 95, rx: 48, ry: 56 };

function bodyPath(type){
  if(type === "slim")   return "M52,260 C 58,210 80,188 100,188 C 120,188 142,210 148,260 Z";
  if(type === "robust") return "M30,260 C 38,200 70,172 100,172 C 130,172 162,200 170,260 Z";
  return "M42,260 C 48,200 75,182 100,182 C 125,182 152,200 158,260 Z";
}

function hairBack(style, color){
  if(style === "buzz" || style === "undercut") return "";
  const c = color, d = _shade(color, -15);
  if(style === "long")  return `<path d="M52,90 Q42,180 62,220 L138,220 Q158,180 148,90 Q145,55 100,42 Q55,55 52,90 Z" fill="${c}"/>
                                <path d="M52,90 Q60,160 70,200" stroke="${d}" stroke-width="1" fill="none" opacity=".4"/>`;
  if(style === "wavy")  return `<path d="M54,92 Q48,160 70,185 L130,185 Q152,160 146,92 Z" fill="${c}"/>`;
  if(style === "bob")   return `<path d="M54,90 Q50,130 65,155 L135,155 Q150,130 146,90 Z" fill="${c}"/>`;
  if(style === "pony")  return `<ellipse cx="100" cy="60" rx="42" ry="22" fill="${c}"/>
                                <path d="M62,90 Q58,170 78,210 L92,210 Q78,170 76,90 Z" fill="${c}"/>`;
  if(style === "curly") return `<path d="M52,85 Q44,165 70,195 L130,195 Q156,165 148,85 Z" fill="${c}"/>
                                <circle cx="58" cy="180" r="10" fill="${c}"/>
                                <circle cx="74" cy="195" r="9" fill="${c}"/>
                                <circle cx="126" cy="195" r="9" fill="${c}"/>
                                <circle cx="142" cy="180" r="10" fill="${c}"/>`;
  if(style === "bun")   return `<ellipse cx="100" cy="42" rx="26" ry="22" fill="${c}"/>
                                <ellipse cx="100" cy="44" rx="22" ry="18" fill="${d}" opacity=".5"/>`;
  return "";
}

function hairFront(style, color){
  const c = color, d = _shade(color, -22);
  const baseTop = `<path d="M55,80 Q100,38 145,80 Q142,55 100,46 Q58,55 55,80 Z" fill="${c}"/>`;
  if(style === "buzz")     return `<path d="M58,82 Q100,52 142,82 Q140,72 100,64 Q60,72 58,82 Z" fill="${c}" opacity=".85"/>`;
  if(style === "short")    return baseTop + `<path d="M55,80 Q100,50 145,80" fill="none" stroke="${d}" stroke-width="1" opacity=".4"/>`;
  if(style === "wavy")     return `<path d="M54,90 Q72,52 100,50 Q128,52 146,90 Q126,65 100,62 Q74,65 54,90 Z" fill="${c}"/>
                                   <path d="M62,82 Q82,62 100,60" stroke="${d}" stroke-width="1.5" fill="none" opacity=".5"/>
                                   <path d="M138,82 Q118,62 100,60" stroke="${d}" stroke-width="1.5" fill="none" opacity=".5"/>`;
  if(style === "bob")      return baseTop;
  if(style === "long")     return baseTop;
  if(style === "pony")     return `<path d="M60,80 Q100,46 140,80 Q138,62 100,52 Q62,62 60,80 Z" fill="${c}"/>`;
  if(style === "curly")    return `<path d="M54,86 Q100,42 146,86 Q142,68 100,54 Q58,68 54,86 Z" fill="${c}"/>
                                   <circle cx="62" cy="68" r="7" fill="${c}"/>
                                   <circle cx="138" cy="68" r="7" fill="${c}"/>
                                   <circle cx="82" cy="54" r="6" fill="${c}"/>
                                   <circle cx="118" cy="54" r="6" fill="${c}"/>`;
  if(style === "bun")      return `<path d="M58,82 Q100,52 142,82 Q140,68 100,58 Q60,68 58,82 Z" fill="${c}"/>`;
  if(style === "undercut") return `<path d="M64,72 Q100,42 136,72 Q134,60 100,52 Q66,60 64,72 Z" fill="${c}"/>
                                   <rect x="58" y="100" width="84" height="18" fill="${_shade(color,-35)}" opacity=".55"/>`;
  return baseTop;
}

/* ---------- Eyes (premium proportions) ---------- */
function eyes(shape, color, skin){
  const stroke = _shade(skin, -55);
  const iris = color;
  const irisDark = _shade(color, -20);
  // Eye positions: left (80, 100), right (120, 100)
  const lx = 80, rx = 120, cy = 100;
  if(shape === "round"){
    return `
      <ellipse cx="${lx}" cy="${cy}" rx="7" ry="7" fill="#fff" stroke="${stroke}" stroke-width=".5"/>
      <ellipse cx="${rx}" cy="${cy}" rx="7" ry="7" fill="#fff" stroke="${stroke}" stroke-width=".5"/>
      <circle cx="${lx}" cy="${cy+.5}" r="3.8" fill="${iris}"/>
      <circle cx="${rx}" cy="${cy+.5}" r="3.8" fill="${iris}"/>
      <circle cx="${lx}" cy="${cy+1}" r="1.6" fill="${irisDark}"/>
      <circle cx="${rx}" cy="${cy+1}" r="1.6" fill="${irisDark}"/>
      <circle cx="${lx-1}" cy="${cy-1}" r="1.2" fill="#fff"/>
      <circle cx="${rx-1}" cy="${cy-1}" r="1.2" fill="#fff"/>
    `;
  }
  if(shape === "narrow"){
    return `
      <path d="M${lx-7},${cy} Q${lx},${cy-3} ${lx+7},${cy} Q${lx},${cy+3} ${lx-7},${cy} Z" fill="#fff" stroke="${stroke}" stroke-width=".5"/>
      <path d="M${rx-7},${cy} Q${rx},${cy-3} ${rx+7},${cy} Q${rx},${cy+3} ${rx-7},${cy} Z" fill="#fff" stroke="${stroke}" stroke-width=".5"/>
      <ellipse cx="${lx}" cy="${cy}" rx="3" ry="2.5" fill="${iris}"/>
      <ellipse cx="${rx}" cy="${cy}" rx="3" ry="2.5" fill="${iris}"/>
      <circle cx="${lx}" cy="${cy}" r="1.2" fill="${irisDark}"/>
      <circle cx="${rx}" cy="${cy}" r="1.2" fill="${irisDark}"/>
    `;
  }
  // almond
  return `
    <path d="M${lx-8},${cy+1} Q${lx},${cy-5} ${lx+8},${cy+1} Q${lx},${cy+4} ${lx-8},${cy+1} Z" fill="#fff" stroke="${stroke}" stroke-width=".5"/>
    <path d="M${rx-8},${cy+1} Q${rx},${cy-5} ${rx+8},${cy+1} Q${rx},${cy+4} ${rx-8},${cy+1} Z" fill="#fff" stroke="${stroke}" stroke-width=".5"/>
    <ellipse cx="${lx}" cy="${cy}" rx="3.2" ry="3.6" fill="${iris}"/>
    <ellipse cx="${rx}" cy="${cy}" rx="3.2" ry="3.6" fill="${iris}"/>
    <circle cx="${lx}" cy="${cy+.5}" r="1.4" fill="${irisDark}"/>
    <circle cx="${rx}" cy="${cy+.5}" r="1.4" fill="${irisDark}"/>
    <circle cx="${lx-1}" cy="${cy-1}" r="1" fill="#fff"/>
    <circle cx="${rx-1}" cy="${cy-1}" r="1" fill="#fff"/>
  `;
}

function brows(type, color){
  const c = _shade(color, -10);
  // Positioned above eyes at y=85
  if(type === "straight") return `<path d="M71,86 L89,84" stroke="${c}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
                                  <path d="M111,84 L129,86" stroke="${c}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
  if(type === "thick")    return `<path d="M70,88 Q80,80 90,86" stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"/>
                                  <path d="M110,86 Q120,80 130,88" stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
  return `<path d="M71,88 Q80,82 90,86" stroke="${c}" stroke-width="3.2" stroke-linecap="round" fill="none"/>
          <path d="M110,86 Q120,82 129,88" stroke="${c}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
}

function noseEl(type, skin){
  const c = _shade(skin, -28);
  // Nose at y=110-122, centered at x=100
  if(type === "small") return `<path d="M100,112 Q99,120 101,124" stroke="${c}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
  if(type === "wide")  return `<path d="M97,112 Q95,122 100,126 Q105,122 103,112" stroke="${c}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
                               <circle cx="98" cy="125" r=".8" fill="${c}" opacity=".5"/>
                               <circle cx="102" cy="125" r=".8" fill="${c}" opacity=".5"/>`;
  return `<path d="M98,112 Q96,122 100,125 Q104,122 102,112" stroke="${c}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`;
}

function mouthEl(type, skin){
  const c = _shade(skin, -42);
  const lipFill = _shade(skin, -25);
  // Mouth at y=137
  if(type === "neutral") return `<path d="M92,137 Q100,140 108,137" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  if(type === "smile")   return `<path d="M88,135 Q100,148 112,135 Q100,142 88,135 Z" fill="${lipFill}" stroke="${c}" stroke-width=".8"/>`;
  return `<path d="M91,136 Q100,141 109,136" stroke="${c}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
}

function earsEl(skin){
  const c = _shade(skin, -8);
  const cd = _shade(skin, -25);
  return `<path d="M52,98 Q46,108 50,120 Q56,122 58,116 Q56,108 54,100 Z" fill="${c}"/>
          <path d="M148,98 Q154,108 150,120 Q144,122 142,116 Q144,108 146,100 Z" fill="${c}"/>
          <ellipse cx="52" cy="112" rx="1.5" ry="2.5" fill="${cd}" opacity=".4"/>
          <ellipse cx="148" cy="112" rx="1.5" ry="2.5" fill="${cd}" opacity=".4"/>`;
}

function gearOverlay(gear){
  if(!gear) return "";
  if(gear === "gear-mask")   return `<path d="M70,122 Q100,150 130,122 L128,144 Q100,162 72,144 Z" fill="#eef2f6" stroke="#c9d2dd" stroke-width=".7"/>
                                     <line x1="76" y1="135" x2="124" y2="135" stroke="#c9d2dd" stroke-width=".8"/>
                                     <circle cx="100" cy="143" r="3" fill="#a8c8d8" opacity=".6"/>`;
  if(gear === "gear-visor")  return `<rect x="58" y="92" width="84" height="22" rx="11" fill="#0a1429" opacity=".94"/>
                                     <rect x="62" y="97" width="76" height="6" rx="3" fill="#7cc4d4" opacity=".55"/>
                                     <rect x="66" y="98" width="20" height="3" rx="1" fill="#fff" opacity=".35"/>`;
  if(gear === "gear-suit")   return `<path d="M40,260 Q44,200 74,188 L126,188 Q156,200 160,260 Z" fill="#1c2638" stroke="#6ec5d5" stroke-width=".8" opacity=".95"/>
                                     <line x1="100" y1="195" x2="100" y2="260" stroke="#6ec5d5" stroke-width="1.2" opacity=".5"/>
                                     <circle cx="100" cy="218" r="2.2" fill="#6ec5d5"/>`;
  if(gear === "gear-hoodie") return `<path d="M40,260 C 44,202 72,178 100,178 C 128,178 156,202 160,260 Z" fill="#0a1429"/>
                                     <path d="M50,200 Q100,168 150,200 L146,228 Q100,212 54,228 Z" fill="#06090f" stroke="#6ec5d5" stroke-width=".5" opacity=".6"/>`;
  return "";
}

function auraOverlay(aura){
  const map = { "aura-frost": "#a8d0e0", "aura-arctic": "#b8d8e6", "aura-cryo": "#6ec5d5" };
  const c = map[aura];
  if(!c) return "";
  return `<div style="position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle,${c}44,transparent 65%);filter:blur(14px);animation:pulse 4s ease-in-out infinite;pointer-events:none;"></div>`;
}

function composeAvatarSVG(a, equipped){
  const head = HEAD;
  const skin = a.skinTone;
  const skinDark = _shade(skin, -16);
  const skinLight = _shade(skin, 14);
  const gid = nextId();
  const skinId = `skin_${gid}`;
  const bodyId = `body_${gid}`;
  const shadowId = `shadow_${gid}`;

  const isSquare = a.faceShape === "square";
  const isRound = a.faceShape === "round";
  const headRx = isRound ? 50 : (isSquare ? 48 : head.rx);
  const headRy = isRound ? 50 : (isSquare ? 55 : head.ry);
  const jawPath = isSquare
    ? `<path d="M${100-headRx+2},${head.cy+headRy-12} Q100,${head.cy+headRy+6} ${100+headRx-2},${head.cy+headRy-12}" fill="url(#${skinId})"/>`
    : '';

  return `<svg viewBox="0 0 200 260" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" style="position:relative;z-index:2;display:block">
    <defs>
      <radialGradient id="${skinId}" cx="40%" cy="35%" r="65%">
        <stop offset="0" stop-color="${skinLight}"/>
        <stop offset=".6" stop-color="${skin}"/>
        <stop offset="1" stop-color="${skinDark}"/>
      </radialGradient>
      <linearGradient id="${bodyId}" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#2a3548"/>
        <stop offset="1" stop-color="#141c2c"/>
      </linearGradient>
      <radialGradient id="${shadowId}">
        <stop offset="0" stop-color="#000" stop-opacity=".35"/>
        <stop offset="1" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <ellipse cx="100" cy="256" rx="62" ry="6" fill="url(#${shadowId})"/>
    <path d="${bodyPath(a.bodyType)}" fill="url(#${bodyId})"/>
    <rect x="88" y="${head.cy+headRy-8}" width="24" height="14" rx="4" fill="${skinDark}"/>
    <rect x="89" y="${head.cy+headRy-10}" width="22" height="12" rx="4" fill="url(#${skinId})"/>

    ${earsEl(skin)}
    ${hairBack(a.hairStyle, a.hairColor)}

    <ellipse cx="${head.cx}" cy="${head.cy}" rx="${headRx}" ry="${headRy}" fill="url(#${skinId})"/>
    ${jawPath}

    ${brows(a.brow, a.hairColor)}
    ${eyes(a.eyeShape, a.eyeColor, skin)}
    ${noseEl(a.nose, skin)}
    ${mouthEl(a.mouth, skin)}

    ${hairFront(a.hairStyle, a.hairColor)}
    ${gearOverlay(equipped?.gear)}

    <circle cx="62" cy="68" r="1.5" fill="#b8d8e6" opacity=".7"/>
    <circle cx="142" cy="78" r="1.2" fill="#b8d8e6" opacity=".6"/>
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
