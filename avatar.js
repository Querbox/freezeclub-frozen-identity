/* Freezeclub Avatar v5 — Frosti (Snowball mascot) */

const AVATAR_PARTS = {
  bodyColor: ["#e8f3fa", "#d8eaf6", "#c4e0ef", "#a8d0e4", "#e8e8e8"],
  eyes: ["dots", "happy", "sparkle", "sleepy"],
  cheeks: ["frost", "pink", "none"],
  hat: ["none", "beanie", "santa", "headband", "icicles"],
  glasses: ["none", "round", "visor", "shades"],
  cape: ["none", "aurora", "frost", "gold"],
};

const PART_LABELS = {
  bodyColor: "Körperfarbe",
  eyes: "Augen",
  cheeks: "Wangen",
  hat: "Mütze",
  glasses: "Brille",
  cape: "Umhang",
};

const PART_ORDER = ["bodyColor","eyes","cheeks","hat","glasses","cape"];

function defaultAvatar(){
  return {
    bodyColor: AVATAR_PARTS.bodyColor[1],
    eyes: "dots",
    cheeks: "frost",
    hat: "icicles",
    glasses: "none",
    cape: "none",
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

/* ---------- Body & feet ---------- */
function bodyAndFeet(color){
  const dark = _shade(color, -25);
  const darker = _shade(color, -45);
  return `
    <!-- feet -->
    <ellipse cx="80" cy="178" rx="12" ry="6" fill="${darker}"/>
    <ellipse cx="120" cy="178" rx="12" ry="6" fill="${darker}"/>
    <!-- main body -->
    <ellipse cx="100" cy="108" rx="68" ry="66" fill="${color}" stroke="${dark}" stroke-width="2"/>
    <!-- top highlight -->
    <ellipse cx="78" cy="68" rx="22" ry="14" fill="#ffffff" opacity=".55"/>
    <ellipse cx="75" cy="62" rx="10" ry="6" fill="#ffffff" opacity=".8"/>
  `;
}

/* ---------- Eyes ---------- */
function eyes(type){
  // Centered around (100, 108)
  const lx = 84, rx = 116, cy = 108;
  if(type === "happy"){
    return `<path d="M${lx-8},${cy+2} Q${lx},${cy-5} ${lx+8},${cy+2}" fill="none" stroke="#1a2438" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M${rx-8},${cy+2} Q${rx},${cy-5} ${rx+8},${cy+2}" fill="none" stroke="#1a2438" stroke-width="3.5" stroke-linecap="round"/>`;
  }
  if(type === "sparkle"){
    return `<ellipse cx="${lx}" cy="${cy}" rx="6" ry="7.5" fill="#1a2438"/>
            <ellipse cx="${rx}" cy="${cy}" rx="6" ry="7.5" fill="#1a2438"/>
            <ellipse cx="${lx-2}" cy="${cy-3}" rx="2.2" ry="3" fill="#ffffff"/>
            <ellipse cx="${rx-2}" cy="${cy-3}" rx="2.2" ry="3" fill="#ffffff"/>
            <circle cx="${lx+2}" cy="${cy+3}" r="1" fill="#ffffff"/>
            <circle cx="${rx+2}" cy="${cy+3}" r="1" fill="#ffffff"/>`;
  }
  if(type === "sleepy"){
    return `<path d="M${lx-7},${cy} Q${lx},${cy+4} ${lx+7},${cy}" fill="none" stroke="#1a2438" stroke-width="3" stroke-linecap="round"/>
            <path d="M${rx-7},${cy} Q${rx},${cy+4} ${rx+7},${cy}" fill="none" stroke="#1a2438" stroke-width="3" stroke-linecap="round"/>`;
  }
  // dots — clean, simple
  return `<circle cx="${lx}" cy="${cy}" r="4.5" fill="#1a2438"/>
          <circle cx="${rx}" cy="${cy}" r="4.5" fill="#1a2438"/>
          <circle cx="${lx-1}" cy="${cy-1.5}" r="1.4" fill="#ffffff"/>
          <circle cx="${rx-1}" cy="${cy-1.5}" r="1.4" fill="#ffffff"/>`;
}

/* ---------- Mouth (subtle smile) ---------- */
function mouth(){
  return `<path d="M92,124 Q100,131 108,124" fill="none" stroke="#1a2438" stroke-width="2.4" stroke-linecap="round"/>`;
}

/* ---------- Cheeks ---------- */
function cheeks(type){
  if(type === "none") return "";
  const c = type === "pink" ? "#ffb3c1" : "#b8d8e6";
  return `<ellipse cx="68" cy="124" rx="9" ry="5" fill="${c}" opacity=".75"/>
          <ellipse cx="132" cy="124" rx="9" ry="5" fill="${c}" opacity=".75"/>`;
}

/* ---------- Hat ---------- */
function hat(type, bodyColor){
  if(type === "none") return "";
  const dark = _shade(bodyColor, -45);

  if(type === "icicles"){
    // 4 icicle spikes on top, the signature Frosti look
    return `
      <g class="hat-icicles">
        <path d="M70,52 L77,18 L83,52 Z" fill="${_shade(bodyColor, -8)}" stroke="${dark}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M85,48 L93,8 L100,48 Z" fill="${_shade(bodyColor, -12)}" stroke="${dark}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M100,48 L107,8 L115,48 Z" fill="${_shade(bodyColor, -12)}" stroke="${dark}" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M117,52 L123,18 L130,52 Z" fill="${_shade(bodyColor, -8)}" stroke="${dark}" stroke-width="1.6" stroke-linejoin="round"/>
        <!-- subtle highlights on icicles -->
        <line x1="79" y1="22" x2="80" y2="44" stroke="#ffffff" stroke-width="1.2" opacity=".55"/>
        <line x1="95" y1="14" x2="96" y2="42" stroke="#ffffff" stroke-width="1.2" opacity=".55"/>
        <line x1="109" y1="14" x2="110" y2="42" stroke="#ffffff" stroke-width="1.2" opacity=".55"/>
        <line x1="121" y1="22" x2="122" y2="44" stroke="#ffffff" stroke-width="1.2" opacity=".55"/>
      </g>
    `;
  }
  if(type === "beanie"){
    return `
      <path d="M48,58 Q100,18 152,58 L150,72 Q100,52 50,72 Z" fill="#3d6fa5" stroke="#1a2438" stroke-width="2"/>
      <ellipse cx="100" cy="22" rx="14" ry="10" fill="#ffffff"/>
      <line x1="50" y1="72" x2="150" y2="72" stroke="#2d5585" stroke-width="2"/>
    `;
  }
  if(type === "santa"){
    return `
      <path d="M50,60 Q100,22 150,60 L148,72 Q100,54 52,72 Z" fill="#c0392b" stroke="#7a1a14" stroke-width="2"/>
      <line x1="50" y1="72" x2="150" y2="72" stroke="#ffffff" stroke-width="6"/>
      <ellipse cx="148" cy="32" rx="12" ry="10" fill="#ffffff"/>
    `;
  }
  if(type === "headband"){
    return `
      <rect x="42" y="62" width="116" height="14" rx="6" fill="#6ec5d5" stroke="#1a2438" stroke-width="2"/>
      <circle cx="100" cy="69" r="4" fill="#ffffff"/>
      <circle cx="100" cy="69" r="2" fill="#6ec5d5"/>
    `;
  }
  return "";
}

/* ---------- Glasses ---------- */
function glasses(type){
  if(type === "none") return "";
  if(type === "round"){
    return `
      <circle cx="84" cy="108" r="13" fill="none" stroke="#1a2438" stroke-width="2.4"/>
      <circle cx="116" cy="108" r="13" fill="none" stroke="#1a2438" stroke-width="2.4"/>
      <line x1="97" y1="108" x2="103" y2="108" stroke="#1a2438" stroke-width="2.4"/>
      <circle cx="84" cy="106" r="11" fill="#ffffff" opacity=".25"/>
      <circle cx="116" cy="106" r="11" fill="#ffffff" opacity=".25"/>
    `;
  }
  if(type === "visor"){
    return `
      <rect x="60" y="100" width="80" height="20" rx="10" fill="#1a2438" opacity=".9"/>
      <rect x="64" y="105" width="72" height="6" rx="3" fill="#6ec5d5" opacity=".7"/>
      <rect x="68" y="106" width="20" height="3" rx="1" fill="#ffffff" opacity=".5"/>
    `;
  }
  if(type === "shades"){
    return `
      <path d="M64,102 L102,102 Q104,116 84,118 Q66,116 64,102 Z" fill="#1a2438"/>
      <path d="M98,102 L136,102 Q134,116 116,118 Q96,116 98,102 Z" fill="#1a2438"/>
      <line x1="102" y1="106" x2="98" y2="106" stroke="#1a2438" stroke-width="2"/>
      <ellipse cx="72" cy="106" rx="6" ry="3" fill="#ffffff" opacity=".3"/>
      <ellipse cx="124" cy="106" rx="6" ry="3" fill="#ffffff" opacity=".3"/>
    `;
  }
  return "";
}

/* ---------- Cape (behind body) ---------- */
function cape(type){
  if(type === "none") return "";
  const colors = {
    aurora: "#9d77c9",
    frost:  "#7fb5c8",
    gold:   "#d8b160",
  };
  const c = colors[type] || "#7fb5c8";
  const d = _shade(c, -25);
  return `
    <path d="M40,120 Q100,180 160,120 L155,200 Q100,210 45,200 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    ${type === "aurora" ? `<path d="M50,130 Q100,170 150,130 L148,180 Q100,190 52,180 Z" fill="#c4a0ee" opacity=".5"/>` : ''}
    ${type === "gold"   ? `<circle cx="100" cy="195" r="5" fill="#fef0c8"/>` : ''}
  `;
}

/* ---------- Compose ---------- */
function composeAvatarSVG(a, equipped){
  const gid = nextId();
  return `<svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet" style="position:relative;z-index:2;display:block">
    <!-- ground shadow -->
    <ellipse cx="100" cy="188" rx="58" ry="6" fill="#1a2438" opacity=".10"/>

    ${cape(a.cape)}
    ${bodyAndFeet(a.bodyColor)}
    ${cheeks(a.cheeks)}
    ${eyes(a.eyes)}
    ${mouth()}
    ${hat(a.hat, a.bodyColor)}
    ${glasses(a.glasses)}
  </svg>`;
}

function auraOverlay(){ return ""; }

function renderAvatarV2(target, avatar, equipped){
  if(!target || !avatar) return;
  target.innerHTML = composeAvatarSVG(avatar, equipped);
}

window.AVATAR_PARTS = AVATAR_PARTS;
window.PART_LABELS = PART_LABELS;
window.PART_ORDER = PART_ORDER;
window.defaultAvatar = defaultAvatar;
window.renderAvatarV2 = renderAvatarV2;
