/* Freezeclub Avatar v6 — Frosti (Fixed design, soft pastel kawaii)
   Based on reference images. Less fault-prone, stable composition.
   Customization: color, hair, expression only. */

const AVATAR_PARTS = {
  bodyColor: ["blue", "mint", "lavender", "peach"],
  hair: ["spiky", "swoosh", "peaks", "flame"],
  expression: ["smile", "happy", "sparkle", "wink", "sleepy"],
};

const PART_LABELS = {
  bodyColor: "Farbe",
  hair: "Frisur",
  expression: "Ausdruck",
};

const PART_ORDER = ["bodyColor","hair","expression"];

/* Color palette per body color */
const PALETTES = {
  blue:     { top: "#f4faff", mid: "#e0eef9", bottom: "#c8dff0", outline: "#9cc2dd", cheek: "#cfe3ef" },
  mint:     { top: "#f0faf6", mid: "#d4eee5", bottom: "#b8e0d0", outline: "#8dc7b3", cheek: "#c8e4dd" },
  lavender: { top: "#f5f3fa", mid: "#e5e0ef", bottom: "#cdc4dc", outline: "#a99cc4", cheek: "#dccfe2" },
  peach:    { top: "#fdf0e8", mid: "#fae0d0", bottom: "#dde8f2", outline: "#c5a8b0", cheek: "#f5cdbf" },
};

function defaultAvatar(){
  return {
    bodyColor: "blue",
    hair: "spiky",
    expression: "sparkle",
  };
}

let _uid = 0;
const nextId = () => "av" + (++_uid);

/* ---------- Hair styles (drawn at top of head) ---------- */
function hair(style, outline){
  const stroke = outline;
  if(style === "spiky"){
    // Image 1: zigzag spikes pointing downward — sharp pattern
    return `<g class="hair">
      <path d="M55,72 L62,42 L70,72 L78,38 L86,72 L96,32 L104,72 L114,38 L122,72 L132,42 L140,72 Z"
            fill="${stroke}" opacity=".12"/>
      <path d="M55,72 L62,42 L70,72 L78,38 L86,72 L96,32 L104,72 L114,38 L122,72 L132,42 L140,72"
            fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round" opacity=".85"/>
    </g>`;
  }
  if(style === "swoosh"){
    // Image 2: smooth side-swept wave
    return `<g class="hair">
      <path d="M60,76 Q72,42 102,40 Q132,42 144,68 Q132,58 110,56 Q90,58 78,68 Q70,74 60,76 Z"
            fill="${stroke}" opacity=".15"/>
      <path d="M60,76 Q72,42 102,40 Q132,42 144,68" fill="none" stroke="${stroke}" stroke-width="1.8" opacity=".85"/>
      <path d="M84,64 Q98,52 116,52" fill="none" stroke="${stroke}" stroke-width="1.4" opacity=".5"/>
    </g>`;
  }
  if(style === "peaks"){
    // Image 3: rounded mountain peaks
    return `<g class="hair">
      <path d="M58,70 Q70,30 88,68 Q100,30 116,68 Q132,30 142,70 Z"
            fill="${stroke}" opacity=".13"/>
      <path d="M58,70 Q70,30 88,68 Q100,30 116,68 Q132,30 142,70"
            fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round" opacity=".85"/>
    </g>`;
  }
  if(style === "flame"){
    // Image 4: tall narrow flame spikes pointing up
    return `<g class="hair">
      <path d="M62,72 L68,26 L78,68 L84,18 L94,66 L100,12 L106,66 L116,18 L122,68 L132,26 L138,72 Z"
            fill="${stroke}" opacity=".14"/>
      <path d="M62,72 L68,26 L78,68 L84,18 L94,66 L100,12 L106,66 L116,18 L122,68 L132,26 L138,72"
            fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round" opacity=".85"/>
    </g>`;
  }
  return "";
}

/* ---------- Expressions (eyes + mouth + cheeks) ---------- */
function expression(type, p){
  const eye = "#0e1b35";
  const cheek = p.cheek;
  // Eye positions: left (78, 116), right (122, 116)
  const lx = 78, rx = 122, cy = 116;

  let eyesSvg = "";
  let mouthSvg = "";

  if(type === "smile"){
    eyesSvg = `
      <circle cx="${lx}" cy="${cy}" r="3.6" fill="${eye}"/>
      <circle cx="${rx}" cy="${cy}" r="3.6" fill="${eye}"/>
      <circle cx="${lx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>
      <circle cx="${rx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>`;
    mouthSvg = `<path d="M91,132 Q100,138 109,132" fill="none" stroke="${eye}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  else if(type === "happy"){
    // open smile with tongue
    eyesSvg = `
      <circle cx="${lx}" cy="${cy}" r="3.6" fill="${eye}"/>
      <circle cx="${rx}" cy="${cy}" r="3.6" fill="${eye}"/>
      <circle cx="${lx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>
      <circle cx="${rx-1}" cy="${cy-1.2}" r="1.1" fill="#fff"/>`;
    mouthSvg = `<path d="M88,130 Q100,144 112,130 Q100,138 88,130 Z" fill="${eye}"/>
                <ellipse cx="100" cy="138" rx="4" ry="2.5" fill="#5a2a3f" opacity=".7"/>`;
  }
  else if(type === "sparkle"){
    // big eyes with starlike sparkles (image 4)
    eyesSvg = `
      <circle cx="${lx}" cy="${cy}" r="4.2" fill="${eye}"/>
      <circle cx="${rx}" cy="${cy}" r="4.2" fill="${eye}"/>
      <!-- 4-pointed sparkle on each eye -->
      <path d="M${lx-1},${cy-3} L${lx},${cy-1.5} L${lx+1.5},${cy-3} L${lx},${cy-4.4} Z" fill="#fff"/>
      <path d="M${rx-1},${cy-3} L${rx},${cy-1.5} L${rx+1.5},${cy-3} L${rx},${cy-4.4} Z" fill="#fff"/>
      <circle cx="${lx+1.5}" cy="${cy+2}" r=".8" fill="#fff"/>
      <circle cx="${rx+1.5}" cy="${cy+2}" r=".8" fill="#fff"/>`;
    mouthSvg = `<path d="M88,130 Q100,144 112,130 Q100,140 88,130 Z" fill="${eye}"/>`;
  }
  else if(type === "wink"){
    // one eye open, one closed (image 2)
    eyesSvg = `
      <circle cx="${lx}" cy="${cy}" r="3.4" fill="${eye}"/>
      <circle cx="${lx-1}" cy="${cy-1.2}" r="1" fill="#fff"/>
      <path d="M${rx-5},${cy} Q${rx},${cy+2.5} ${rx+5},${cy}" fill="none" stroke="${eye}" stroke-width="2.4" stroke-linecap="round"/>`;
    mouthSvg = `<path d="M93,131 Q102,135 110,130" fill="none" stroke="${eye}" stroke-width="2" stroke-linecap="round"/>`;
  }
  else if(type === "sleepy"){
    // closed crescent eyes (image 3)
    eyesSvg = `
      <path d="M${lx-5},${cy} Q${lx},${cy+2.5} ${lx+5},${cy}" fill="none" stroke="${eye}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${rx-5},${cy} Q${rx},${cy+2.5} ${rx+5},${cy}" fill="none" stroke="${eye}" stroke-width="2.4" stroke-linecap="round"/>`;
    mouthSvg = `<path d="M93,132 Q100,138 107,132" fill="none" stroke="${eye}" stroke-width="2" stroke-linecap="round"/>`;
  }

  const cheeksSvg = `
    <ellipse cx="62" cy="130" rx="8" ry="4.5" fill="${cheek}" opacity=".7"/>
    <ellipse cx="138" cy="130" rx="8" ry="4.5" fill="${cheek}" opacity=".7"/>
  `;

  return cheeksSvg + eyesSvg + mouthSvg;
}

/* ---------- Evolution Stages (tied to level) ----------
   Level 1 → Frostknospe       — small, plain, no hair
   Level 2 → Eiskeim           — small crown begins, base color
   Level 3 → Kristallwächter   — full crown, sparkle frost dots
   Level 4 → Eismeister        — gold accent line, full
   Level 5+ → Polarchampion    — aura ring, full majesty
*/
const STAGE_INFO = [
  { id: 1, name: "Frostknospe",     scale: 0.78, showHair: false, accent: null,    glow: false },
  { id: 2, name: "Eiskeim",         scale: 0.86, showHair: true,  accent: null,    glow: false },
  { id: 3, name: "Kristallwächter", scale: 0.95, showHair: true,  accent: "frost", glow: false },
  { id: 4, name: "Eismeister",      scale: 1.0,  showHair: true,  accent: "gold",  glow: false },
  { id: 5, name: "Polarchampion",   scale: 1.0,  showHair: true,  accent: "gold",  glow: true  },
];

function stageFor(level){
  const idx = Math.max(0, Math.min(STAGE_INFO.length - 1, (level || 1) - 1));
  return STAGE_INFO[idx];
}

function accentDecoration(type){
  if(type === "frost"){
    return `
      <circle cx="44" cy="98" r="2" fill="#a8c8e6" opacity=".7"/>
      <circle cx="156" cy="108" r="1.8" fill="#a8c8e6" opacity=".7"/>
      <path d="M40,80 L46,80 M43,77 L43,83" stroke="#a8c8e6" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M160,138 L166,138 M163,135 L163,141" stroke="#a8c8e6" stroke-width="1.4" stroke-linecap="round"/>
    `;
  }
  if(type === "gold"){
    return `
      <circle cx="44" cy="98" r="2" fill="#e6b85a"/>
      <circle cx="156" cy="108" r="1.8" fill="#e6b85a"/>
      <path d="M100,46 L104,52 L100,58 L96,52 Z" fill="#e6b85a" opacity=".85"/>
      <path d="M40,80 L46,80 M43,77 L43,83" stroke="#e6b85a" stroke-width="1.4" stroke-linecap="round"/>
    `;
  }
  return "";
}

/* ---------- Compose SVG ---------- */
function composeAvatarSVG(a, opts){
  const palette = PALETTES[a.bodyColor] || PALETTES.blue;
  const gid = nextId();
  const bodyGradId = `body_${gid}`;
  const shadowId = `shadow_${gid}`;
  const glowId = `glow_${gid}`;

  const stage = opts && opts.stage ? opts.stage : stageFor(opts && opts.level ? opts.level : 1);
  const showHair = stage.showHair !== false;
  const accent = stage.accent;
  const showGlow = stage.glow;

  const isPeach = a.bodyColor === "peach";
  const topColor = isPeach ? "#fceadc" : palette.top;
  const midColor = isPeach ? "#f9dccd" : palette.mid;
  const botColor = isPeach ? "#d8e6f0" : palette.bottom;

  // scale around the body center
  const scale = stage.scale;
  const translateY = (1 - scale) * 60;

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
      ${showGlow ? `<radialGradient id="${glowId}">
        <stop offset="0" stop-color="#e6b85a" stop-opacity=".35"/>
        <stop offset=".6" stop-color="#fff6d8" stop-opacity=".15"/>
        <stop offset="1" stop-color="#e6b85a" stop-opacity="0"/>
      </radialGradient>` : ''}
    </defs>

    ${showGlow ? `<circle cx="100" cy="112" r="92" fill="url(#${glowId})"/>` : ''}

    <ellipse cx="100" cy="188" rx="${58*scale}" ry="6" fill="url(#${shadowId})"/>

    <g transform="translate(${100 - 100*scale}, ${translateY}) scale(${scale})">
      <path d="M100,42
               C 138,42 168,72 168,114
               C 168,156 142,182 100,182
               C 58,182 32,156 32,114
               C 32,72 62,42 100,42 Z"
            fill="url(#${bodyGradId})"
            stroke="${palette.outline}"
            stroke-width="${2/scale}"/>

      <ellipse cx="64" cy="86" rx="22" ry="14" fill="#ffffff" opacity=".7"/>
      <ellipse cx="58" cy="78" rx="8" ry="5" fill="#ffffff" opacity=".95"/>

      ${showHair ? hair(a.hair, palette.outline) : ''}
      ${expression(a.expression, palette)}
      ${accent ? accentDecoration(accent) : ''}
    </g>
  </svg>`;
}

function renderAvatarV2(target, avatar, opts){
  if(!target || !avatar) return;
  target.innerHTML = composeAvatarSVG(avatar, opts);
}

window.STAGE_INFO = STAGE_INFO;
window.stageFor = stageFor;

window.AVATAR_PARTS = AVATAR_PARTS;
window.PART_LABELS = PART_LABELS;
window.PART_ORDER = PART_ORDER;
window.defaultAvatar = defaultAvatar;
window.renderAvatarV2 = renderAvatarV2;
