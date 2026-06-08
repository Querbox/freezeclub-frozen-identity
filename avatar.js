/* Freezeclub Avatar v7 — Preset-based + overlay/background system
   Customization shifts entirely to shop items (accessories + backgrounds).
   Asset URLs supported for future user-uploaded images. */

const PRESETS = {
  frost: {
    label: "Frost",
    desc: "Klassisch arktisch",
    bodyColor: "blue",   hair: "spiky",  expression: "smile",
  },
  mint: {
    label: "Minze",
    desc: "Verspielt frisch",
    bodyColor: "mint",   hair: "swoosh", expression: "wink",
  },
  aurora: {
    label: "Aurora",
    desc: "Verträumt magisch",
    bodyColor: "lavender", hair: "peaks", expression: "sleepy",
  },
  ember: {
    label: "Ember",
    desc: "Energetisch warm",
    bodyColor: "peach",  hair: "flame",  expression: "sparkle",
  },
};

/* Accessoires render OVER the Frosti — top of head or face.
   Each entry supports either an emoji glyph (placeholder) OR an image URL.
   The slot determines where it sits on the avatar. */
const ACCESSORIES = {
  /* head: hats, crowns, headbands */
  "acc-crown":     { name: "Eis-Krone",         slot: "head", glyph: "👑", price: 600, limited: false },
  "acc-tophat":    { name: "Zylinder",          slot: "head", glyph: "🎩", price: 450, limited: false },
  "acc-beanie":    { name: "Polar-Mütze",       slot: "head", glyph: "🧢", price: 320, limited: false },
  "acc-cap":       { name: "Athletic Cap",      slot: "head", glyph: "🧢", price: 320, limited: false },
  "acc-antlers":   { name: "Geweih",            slot: "head", glyph: "🦌", price: 800, limited: true  },
  /* eyes: glasses */
  "acc-shades":    { name: "Sonnenbrille",      slot: "eyes", glyph: "🕶️", price: 400, limited: false },
  "acc-vr":        { name: "Cyber-Visor",       slot: "eyes", glyph: "🥽", price: 700, limited: true  },
  /* neck: scarves */
  "acc-scarf":     { name: "Frost-Schal",       slot: "neck", glyph: "🧣", price: 350, limited: false },
  "acc-medal":     { name: "Goldmedaille",      slot: "neck", glyph: "🥇", price: 1200, limited: true },
};

/* Backgrounds render BEHIND Frosti in the avatar stage.
   Type can be:
     - gradient: { colors: ["#a","#b"] }
     - image:    { url: "..." }  (for user-uploaded backgrounds later) */
const BACKGROUNDS = {
  "bg-ice":     { name: "Eishöhle",        type: "gradient", colors: ["#c7e4f5", "#e8f3fa"], price: 0,    limited: false },
  "bg-aurora":  { name: "Polarlicht",      type: "gradient", colors: ["#3d2d4f", "#6e5a9d", "#4d8a9c"], price: 800, limited: false },
  "bg-sunset":  { name: "Arctic Sunset",   type: "gradient", colors: ["#f2c189", "#c47a85", "#5a7ba8"], price: 600, limited: false },
  "bg-forest":  { name: "Nordwald",        type: "gradient", colors: ["#1f3d2e", "#4d8568", "#a8c8a0"], price: 700, limited: false },
  "bg-deep":    { name: "Tiefsee",         type: "gradient", colors: ["#0a1f3a", "#1854a8"],            price: 500, limited: false },
  "bg-summit":  { name: "Alpine Summit",   type: "gradient", colors: ["#8a8579", "#cdc4b5", "#e8e4dc"], price: 1400, limited: true },
};

/* ---- Color palette per body color ---- */
const PALETTES = {
  blue:     { top: "#f4faff", mid: "#e0eef9", bottom: "#c8dff0", outline: "#9cc2dd", cheek: "#cfe3ef" },
  mint:     { top: "#f0faf6", mid: "#d4eee5", bottom: "#b8e0d0", outline: "#8dc7b3", cheek: "#c8e4dd" },
  lavender: { top: "#f5f3fa", mid: "#e5e0ef", bottom: "#cdc4dc", outline: "#a99cc4", cheek: "#dccfe2" },
  peach:    { top: "#fdf0e8", mid: "#fae0d0", bottom: "#dde8f2", outline: "#c5a8b0", cheek: "#f5cdbf" },
};

let _uid = 0;
const nextId = () => "av" + (++_uid);

function _shade(hex, amt){
  const c = hex.replace("#","");
  const num = parseInt(c, 16);
  let r = (num >> 16) + amt, g = ((num >> 8) & 0xff) + amt, b = (num & 0xff) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + ((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
}

/* ---- Hair shapes per style ---- */
function hair(style, outline){
  if(style === "spiky"){
    return `<path d="M55,72 L62,42 L70,72 L78,38 L86,72 L96,32 L104,72 L114,38 L122,72 L132,42 L140,72 Z" fill="${outline}" opacity=".12"/>
            <path d="M55,72 L62,42 L70,72 L78,38 L86,72 L96,32 L104,72 L114,38 L122,72 L132,42 L140,72" fill="none" stroke="${outline}" stroke-width="1.8" stroke-linejoin="round" opacity=".85"/>`;
  }
  if(style === "swoosh"){
    return `<path d="M60,76 Q72,42 102,40 Q132,42 144,68 Q132,58 110,56 Q90,58 78,68 Q70,74 60,76 Z" fill="${outline}" opacity=".15"/>
            <path d="M60,76 Q72,42 102,40 Q132,42 144,68" fill="none" stroke="${outline}" stroke-width="1.8" opacity=".85"/>
            <path d="M84,64 Q98,52 116,52" fill="none" stroke="${outline}" stroke-width="1.4" opacity=".5"/>`;
  }
  if(style === "peaks"){
    return `<path d="M58,70 Q70,30 88,68 Q100,30 116,68 Q132,30 142,70 Z" fill="${outline}" opacity=".13"/>
            <path d="M58,70 Q70,30 88,68 Q100,30 116,68 Q132,30 142,70" fill="none" stroke="${outline}" stroke-width="1.8" stroke-linejoin="round" opacity=".85"/>`;
  }
  if(style === "flame"){
    return `<path d="M62,72 L68,26 L78,68 L84,18 L94,66 L100,12 L106,66 L116,18 L122,68 L132,26 L138,72 Z" fill="${outline}" opacity=".14"/>
            <path d="M62,72 L68,26 L78,68 L84,18 L94,66 L100,12 L106,66 L116,18 L122,68 L132,26 L138,72" fill="none" stroke="${outline}" stroke-width="1.6" stroke-linejoin="round" opacity=".85"/>`;
  }
  return "";
}

/* ---- Expression (eyes + mouth + cheeks) ---- */
function expression(type, p){
  const eye = "#0e1b35"; const cheek = p.cheek;
  const lx = 78, rx = 122, cy = 116;
  let eyesSvg = "", mouthSvg = "";
  if(type === "smile"){
    eyesSvg = `<circle cx="${lx}" cy="${cy}" r="3.6" fill="${eye}"/>
               <circle cx="${rx}" cy="${cy}" r="3.6" fill="${eye}"/>
               <circle cx="${lx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>
               <circle cx="${rx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>`;
    mouthSvg = `<path d="M91,132 Q100,138 109,132" fill="none" stroke="${eye}" stroke-width="2.2" stroke-linecap="round"/>`;
  } else if(type === "happy"){
    eyesSvg = `<circle cx="${lx}" cy="${cy}" r="3.6" fill="${eye}"/>
               <circle cx="${rx}" cy="${cy}" r="3.6" fill="${eye}"/>
               <circle cx="${lx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>
               <circle cx="${rx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>`;
    mouthSvg = `<path d="M88,130 Q100,144 112,130 Q100,138 88,130 Z" fill="${eye}"/>`;
  } else if(type === "sparkle"){
    eyesSvg = `<circle cx="${lx}" cy="${cy}" r="4.2" fill="${eye}"/>
               <circle cx="${rx}" cy="${cy}" r="4.2" fill="${eye}"/>
               <path d="M${lx-1},${cy-3} L${lx},${cy-1.5} L${lx+1.5},${cy-3} L${lx},${cy-4.4} Z" fill="#fff"/>
               <path d="M${rx-1},${cy-3} L${rx},${cy-1.5} L${rx+1.5},${cy-3} L${rx},${cy-4.4} Z" fill="#fff"/>
               <circle cx="${lx+1.5}" cy="${cy+2}" r=".8" fill="#fff"/>
               <circle cx="${rx+1.5}" cy="${cy+2}" r=".8" fill="#fff"/>`;
    mouthSvg = `<path d="M88,130 Q100,144 112,130 Q100,140 88,130 Z" fill="${eye}"/>`;
  } else if(type === "wink"){
    eyesSvg = `<circle cx="${lx}" cy="${cy}" r="3.4" fill="${eye}"/>
               <circle cx="${lx-1}" cy="${cy-1.2}" r="1" fill="#fff"/>
               <path d="M${rx-5},${cy} Q${rx},${cy+2.5} ${rx+5},${cy}" fill="none" stroke="${eye}" stroke-width="2.4" stroke-linecap="round"/>`;
    mouthSvg = `<path d="M93,131 Q102,135 110,130" fill="none" stroke="${eye}" stroke-width="2" stroke-linecap="round"/>`;
  } else if(type === "sleepy"){
    eyesSvg = `<path d="M${lx-5},${cy} Q${lx},${cy+2.5} ${lx+5},${cy}" fill="none" stroke="${eye}" stroke-width="2.4" stroke-linecap="round"/>
               <path d="M${rx-5},${cy} Q${rx},${cy+2.5} ${rx+5},${cy}" fill="none" stroke="${eye}" stroke-width="2.4" stroke-linecap="round"/>`;
    mouthSvg = `<path d="M93,132 Q100,138 107,132" fill="none" stroke="${eye}" stroke-width="2" stroke-linecap="round"/>`;
  }
  const cheeksSvg = `<ellipse cx="62" cy="130" rx="8" ry="4.5" fill="${cheek}" opacity=".7"/>
                     <ellipse cx="138" cy="130" rx="8" ry="4.5" fill="${cheek}" opacity=".7"/>`;
  return cheeksSvg + eyesSvg + mouthSvg;
}

/* ---- Accessory overlay (positioned per slot) ---- */
function accessoryOverlay(accId){
  if(!accId) return "";
  const acc = ACCESSORIES[accId];
  if(!acc) return "";
  // Position config per slot (in HTML overlay coordinates)
  const slotConfig = {
    head:  { top: "-12%",  left: "50%",  transform: "translateX(-50%)",  size: "56px" },
    eyes:  { top: "42%",  left: "50%",  transform: "translateX(-50%)",  size: "44px" },
    neck:  { top: "70%",  left: "50%",  transform: "translateX(-50%)",  size: "42px" },
  };
  const pos = slotConfig[acc.slot] || slotConfig.head;
  if(acc.url){
    return `<img class="frosti-accessory" src="${acc.url}" alt="" style="position:absolute;top:${pos.top};left:${pos.left};transform:${pos.transform};width:${pos.size};height:auto;z-index:5;pointer-events:none;"/>`;
  }
  // emoji fallback
  return `<div class="frosti-accessory" style="position:absolute;top:${pos.top};left:${pos.left};transform:${pos.transform};font-size:${pos.size};line-height:1;z-index:5;pointer-events:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.18));">${acc.glyph || ""}</div>`;
}

/* ---- Background renderer (CSS for stage) ---- */
function backgroundCSS(bgId){
  if(!bgId) return null;
  const bg = BACKGROUNDS[bgId];
  if(!bg) return null;
  if(bg.url){
    return `url('${bg.url}') center/cover no-repeat`;
  }
  if(bg.type === "gradient" && bg.colors){
    return `linear-gradient(180deg, ${bg.colors.join(", ")})`;
  }
  return null;
}

/* ---- Compose Frosti SVG (just the character) ---- */
function composeAvatarSVG(presetId, opts){
  const preset = PRESETS[presetId] || PRESETS.frost;
  const palette = PALETTES[preset.bodyColor] || PALETTES.blue;
  const gid = nextId();
  const bodyGradId = `body_${gid}`;
  const shadowId = `shadow_${gid}`;

  const isPeach = preset.bodyColor === "peach";
  const topColor = isPeach ? "#fceadc" : palette.top;
  const midColor = isPeach ? "#f9dccd" : palette.mid;
  const botColor = isPeach ? "#d8e6f0" : palette.bottom;

  // Optional level-based scale for evolution
  const level = (opts && opts.level) || 1;
  const stage = (window.STAGE_INFO || [{scale:1}])[Math.min((window.STAGE_INFO || []).length - 1, Math.max(0, level - 1))] || { scale: 1 };
  const scale = stage.scale || 1;
  const translateY = (1 - scale) * 50;

  return `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" style="position:relative;z-index:2;display:block">
    <defs>
      <linearGradient id="${bodyGradId}" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="${topColor}"/>
        <stop offset=".5" stop-color="${midColor}"/>
        <stop offset="1" stop-color="${botColor}"/>
      </linearGradient>
      <radialGradient id="${shadowId}">
        <stop offset="0" stop-color="${palette.outline}" stop-opacity=".35"/>
        <stop offset="1" stop-color="${palette.outline}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="188" rx="${58*scale}" ry="6" fill="url(#${shadowId})"/>
    <g transform="translate(${100 - 100*scale}, ${translateY}) scale(${scale})">
      <path d="M100,42 C 138,42 168,72 168,114 C 168,156 142,182 100,182 C 58,182 32,156 32,114 C 32,72 62,42 100,42 Z"
            fill="url(#${bodyGradId})" stroke="${palette.outline}" stroke-width="${2/scale}"/>
      <ellipse cx="64" cy="86" rx="22" ry="14" fill="#ffffff" opacity=".7"/>
      <ellipse cx="58" cy="78" rx="8" ry="5" fill="#ffffff" opacity=".95"/>
      ${hair(preset.hair, palette.outline)}
      ${expression(preset.expression, palette)}
    </g>
  </svg>`;
}

/* ---- Render avatar into target (handles SVG + accessory overlay) ---- */
function renderAvatarV2(target, avatar, opts){
  if(!target || !avatar) return;
  const presetId = avatar.preset || "frost";
  const accessoryId = avatar.accessory || (opts && opts.accessory);
  // ensure target is positioned so absolute overlays anchor correctly
  if(target.style){
    target.style.position = target.style.position || "relative";
  }
  target.innerHTML =
    composeAvatarSVG(presetId, opts) +
    accessoryOverlay(accessoryId);
}

/* ---- Apply background to the avatar-stage element ---- */
function applyAvatarBackground(stageEl, bgId){
  if(!stageEl) return;
  const css = backgroundCSS(bgId);
  if(css){
    stageEl.style.background = css;
  } else {
    stageEl.style.background = "";
  }
}

/* ---- Default + helpers ---- */
function defaultAvatar(){
  return { preset: "frost", accessory: null, background: null };
}

const PRESET_IDS = Object.keys(PRESETS);

window.PRESETS = PRESETS;
window.PRESET_IDS = PRESET_IDS;
window.ACCESSORIES = ACCESSORIES;
window.BACKGROUNDS = BACKGROUNDS;
window.defaultAvatar = defaultAvatar;
window.renderAvatarV2 = renderAvatarV2;
window.applyAvatarBackground = applyAvatarBackground;
// Legacy compat (so existing code paths don't crash)
window.AVATAR_PARTS = { preset: PRESET_IDS };
window.PART_LABELS = { preset: "Frosti" };
window.PART_ORDER = ["preset"];
