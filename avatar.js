/* Freezeclub Avatar System v2 — Premium Minimal 2.5D */

const AVATAR_PARTS = {
  bodyType: ["slim", "athletic", "robust"],
  skinTone: ["#f5d5b8","#ecc9a8","#e0b894","#d4a378","#c08d65","#a87456","#8e5a3f","#5d3a26"],
  faceShape: ["oval", "round", "square"],
  eyeShape: ["almond", "round", "narrow"],
  eyeColor: ["#3d5a7c","#2d6b4e","#7a5a3f","#4d3a2f","#5a7c9e","#1a1a1a"],
  brow: ["arched", "straight", "thick"],
  nose: ["small", "medium", "wide"],
  mouth: ["neutral", "smile", "subtle"],
  hairStyle: ["short","wavy","bob","long","buzz","pony","curly","bun","undercut"],
  hairColor: ["#1a1410","#3d2d1f","#5d4530","#8a6a45","#c8a572","#d4d4d4","#6b3838","#4a2a4a","#4ee0f0"],
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

function bodyPath(type){
  if(type === "slim")   return "M55,260 C 65,210 95,185 120,185 C 145,185 175,210 185,260 Z";
  if(type === "robust") return "M30,260 C 38,200 78,170 120,170 C 162,170 202,200 210,260 Z";
  return "M42,260 C 52,205 88,178 120,178 C 152,178 188,205 198,260 Z";
}
function headEllipse(shape){
  if(shape === "round")  return { rx: 46, ry: 48, square: false };
  if(shape === "square") return { rx: 44, ry: 50, square: true };
  return { rx: 42, ry: 50, square: false };
}

function hairBack(style, color){
  if(style === "buzz" || style === "short" || style === "undercut") return "";
  if(style === "long")  return '<path d="M70,90 Q60,170 80,200 L160,200 Q180,170 170,90 Z" fill="'+color+'" opacity=".95"/>';
  if(style === "wavy")  return '<path d="M68,95 Q60,150 78,175 L162,175 Q180,150 172,95 Z" fill="'+color+'" opacity=".95"/>';
  if(style === "bob")   return '<path d="M70,90 Q66,130 78,150 L162,150 Q174,130 170,90 Z" fill="'+color+'"/>';
  if(style === "pony")  return '<path d="M76,95 Q74,160 90,200 L100,200 Q90,160 88,95 Z" fill="'+color+'"/>';
  if(style === "curly") return '<path d="M68,90 Q60,150 80,180 L160,180 Q180,150 172,90 Z" fill="'+color+'"/><circle cx="78" cy="170" r="8" fill="'+color+'"/><circle cx="92" cy="178" r="7" fill="'+color+'"/><circle cx="148" cy="178" r="7" fill="'+color+'"/><circle cx="162" cy="170" r="8" fill="'+color+'"/>';
  if(style === "bun")   return '<ellipse cx="120" cy="50" rx="22" ry="18" fill="'+color+'"/>';
  return "";
}

function hairFront(style, color){
  const shade = _shade(color, -20);
  if(style === "buzz")     return '<path d="M78,82 Q120,52 162,82 Q160,72 120,62 Q80,72 78,82 Z" fill="'+color+'" opacity=".85"/>';
  if(style === "short")    return '<path d="M76,88 Q120,52 164,88 Q162,68 120,60 Q78,68 76,88 Z" fill="'+color+'"/><path d="M76,88 Q120,60 164,88" fill="none" stroke="'+shade+'" stroke-width="1" opacity=".4"/>';
  if(style === "wavy")     return '<path d="M74,92 Q90,60 120,60 Q150,60 166,92 Q150,75 120,72 Q90,75 74,92 Z" fill="'+color+'"/><path d="M82,88 Q100,72 120,70" fill="none" stroke="'+shade+'" stroke-width="1.5" opacity=".5"/>';
  if(style === "bob")      return '<path d="M72,90 Q120,52 168,90 Q166,68 120,58 Q74,68 72,90 Z" fill="'+color+'"/>';
  if(style === "long")     return '<path d="M74,92 Q120,52 166,92 Q164,68 120,58 Q76,68 74,92 Z" fill="'+color+'"/>';
  if(style === "pony")     return '<path d="M78,86 Q120,56 162,86 Q160,70 120,62 Q80,70 78,86 Z" fill="'+color+'"/>';
  if(style === "curly")    return '<path d="M72,94 Q120,50 168,94 Q166,72 120,62 Q74,72 72,94 Z" fill="'+color+'"/><circle cx="80" cy="76" r="6" fill="'+color+'"/><circle cx="160" cy="76" r="6" fill="'+color+'"/><circle cx="100" cy="64" r="5" fill="'+color+'"/><circle cx="140" cy="64" r="5" fill="'+color+'"/>';
  if(style === "bun")      return '<path d="M78,90 Q120,58 162,90 Q160,72 120,64 Q80,72 78,90 Z" fill="'+color+'"/>';
  if(style === "undercut") return '<path d="M82,82 Q120,52 158,82 Q156,68 120,60 Q84,68 82,82 Z" fill="'+color+'"/><rect x="78" y="100" width="84" height="14" fill="'+_shade(color,-30)+'" opacity=".6"/>';
  return "";
}

function eyes(shape, color, skin){
  const outline = _shade(skin, -50);
  if(shape === "round"){
    return '<ellipse cx="103" cy="108" rx="6" ry="6" fill="#fff" stroke="'+outline+'" stroke-width=".5"/><ellipse cx="137" cy="108" rx="6" ry="6" fill="#fff" stroke="'+outline+'" stroke-width=".5"/><circle cx="103" cy="109" r="3.2" fill="'+color+'"/><circle cx="137" cy="109" r="3.2" fill="'+color+'"/><circle cx="102" cy="107" r="1.1" fill="#fff"/><circle cx="136" cy="107" r="1.1" fill="#fff"/>';
  }
  if(shape === "narrow"){
    return '<path d="M97,109 Q104,104 110,109 Q104,113 97,109" fill="#fff" stroke="'+outline+'" stroke-width=".5"/><path d="M131,109 Q138,104 144,109 Q138,113 131,109" fill="#fff" stroke="'+outline+'" stroke-width=".5"/><circle cx="104" cy="109" r="2.5" fill="'+color+'"/><circle cx="138" cy="109" r="2.5" fill="'+color+'"/>';
  }
  return '<path d="M96,109 Q104,102 112,109 Q104,114 96,109" fill="#fff" stroke="'+outline+'" stroke-width=".5"/><path d="M129,109 Q137,102 145,109 Q137,114 129,109" fill="#fff" stroke="'+outline+'" stroke-width=".5"/><ellipse cx="104" cy="109" rx="2.8" ry="3.2" fill="'+color+'"/><ellipse cx="137" cy="109" rx="2.8" ry="3.2" fill="'+color+'"/><circle cx="103" cy="108" r="1" fill="#fff"/><circle cx="136" cy="108" r="1" fill="#fff"/>';
}

function brows(type, color){
  const c = _shade(color, -15);
  if(type === "straight") return '<path d="M93,98 L116,97" stroke="'+c+'" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M125,97 L148,98" stroke="'+c+'" stroke-width="3" stroke-linecap="round" fill="none"/>';
  if(type === "thick")    return '<path d="M92,99 Q104,93 116,99" stroke="'+c+'" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M125,99 Q137,93 149,99" stroke="'+c+'" stroke-width="4.5" stroke-linecap="round" fill="none"/>';
  return '<path d="M93,98 Q104,93 116,99" stroke="'+c+'" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M125,99 Q136,93 148,98" stroke="'+c+'" stroke-width="3" stroke-linecap="round" fill="none"/>';
}

function noseEl(type, skin){
  const c = _shade(skin, -28);
  if(type === "small") return '<path d="M120,116 Q119,123 121,127" stroke="'+c+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
  if(type === "wide")  return '<path d="M118,115 Q116,125 119,129 Q121,129 122,128 Q124,125 122,115" stroke="'+c+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
  return '<path d="M119,115 Q117,124 120,128 Q123,124 121,115" stroke="'+c+'" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
}

function mouthEl(type, skin){
  const c = _shade(skin, -38);
  if(type === "neutral") return '<line x1="112" y1="135" x2="128" y2="135" stroke="'+c+'" stroke-width="1.8" stroke-linecap="round"/>';
  if(type === "smile")   return '<path d="M109,133 Q120,143 131,133" stroke="'+c+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  return '<path d="M111,134 Q120,138 129,134" stroke="'+c+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
}

function earsEl(skin){
  const c = _shade(skin, -8);
  return '<ellipse cx="74" cy="110" rx="6" ry="9" fill="'+c+'"/><ellipse cx="166" cy="110" rx="6" ry="9" fill="'+c+'"/>';
}

function gearOverlay(gear){
  if(!gear) return "";
  if(gear === "gear-mask")   return '<path d="M86,124 Q120,152 154,124 L152,144 Q120,162 88,144 Z" fill="#e7ecf2" stroke="#cdd5df" stroke-width=".6"/><line x1="92" y1="136" x2="148" y2="136" stroke="#cdd5df" stroke-width="1"/><circle cx="120" cy="143" r="3" fill="#9fd6e3" opacity=".7"/>';
  if(gear === "gear-visor")  return '<rect x="74" y="96" width="92" height="22" rx="11" fill="#06090f" opacity=".92"/><rect x="78" y="100" width="84" height="6" rx="3" fill="#74e4f4" opacity=".7"/><rect x="82" y="101" width="22" height="3" rx="1" fill="#fff" opacity=".4"/>';
  if(gear === "gear-suit")   return '<path d="M50,260 Q55,210 90,195 L150,195 Q185,210 190,260 Z" fill="#1a253b" stroke="#74e4f4" stroke-width="1" opacity=".95"/><line x1="120" y1="200" x2="120" y2="260" stroke="#74e4f4" stroke-width="1.4" opacity=".7"/><circle cx="120" cy="220" r="2" fill="#74e4f4"/>';
  if(gear === "gear-hoodie") return '<path d="M58,260 C 60,200 90,170 120,170 C 150,170 180,200 182,260 Z" fill="#06090f"/><path d="M68,195 Q120,165 172,195 L168,225 Q120,210 72,225 Z" fill="#0b1320" stroke="#74e4f4" stroke-width=".5" opacity=".8"/>';
  return "";
}

function auraOverlay(aura){
  const map = { "aura-frost": "#a8d8e8", "aura-arctic": "#b8e6f0", "aura-cryo": "#74e4f4" };
  const c = map[aura];
  if(!c) return "";
  return '<div style="position:absolute;inset:5%;border-radius:50%;background:radial-gradient(circle,'+c+'55,transparent 65%);filter:blur(8px);animation:pulse 3.5s ease-in-out infinite;pointer-events:none;"></div>';
}

function composeAvatarSVG(a, equipped){
  const head = headEllipse(a.faceShape);
  const skin = a.skinTone;
  const skinDark = _shade(skin, -18);
  const squareJaw = head.square ? '<path d="M76,128 Q120,158 164,128" fill="url(#skinGrad)"/>' : '';
  return '<svg viewBox="0 0 240 270" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:relative;z-index:2">'
    + '<defs><radialGradient id="skinGrad"><stop offset="0" stop-color="'+skin+'"/><stop offset="1" stop-color="'+skinDark+'"/></radialGradient>'
    + '<linearGradient id="bodyGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3a4a5c"/><stop offset="1" stop-color="#1a253b"/></linearGradient></defs>'
    + '<ellipse cx="120" cy="258" rx="74" ry="8" fill="#000" opacity=".25"/>'
    + '<path d="'+bodyPath(a.bodyType)+'" fill="url(#bodyGrad)"/>'
    + '<rect x="106" y="140" width="28" height="32" rx="6" fill="'+skin+'"/>'
    + earsEl(skin)
    + hairBack(a.hairStyle, a.hairColor)
    + '<ellipse cx="120" cy="105" rx="'+head.rx+'" ry="'+head.ry+'" fill="url(#skinGrad)"/>'
    + squareJaw
    + brows(a.brow, a.hairColor)
    + eyes(a.eyeShape, a.eyeColor, skin)
    + noseEl(a.nose, skin)
    + mouthEl(a.mouth, skin)
    + hairFront(a.hairStyle, a.hairColor)
    + gearOverlay(equipped?.gear)
    + '<circle cx="78" cy="82" r="1.8" fill="#b8e6f0" opacity=".9"/>'
    + '<circle cx="170" cy="92" r="1.4" fill="#b8e6f0" opacity=".8"/>'
    + '<circle cx="160" cy="142" r="1.2" fill="#b8e6f0" opacity=".7"/>'
    + '</svg>';
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
