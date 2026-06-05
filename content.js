/* Freezeclub Content — Daily Quests & Wissens-Karten */

const DAILY_QUESTS = [
  { id: "dq-water",   title: "2L Wasser trinken",            tip: "Hydration boostet Cryo-Effekt",      reward: 30, icon: "💧", color: "#5b9bd5", cat: "Hydration" },
  { id: "dq-tip",     title: "Wissens-Karte lesen",          tip: "Heute etwas Neues lernen",            reward: 40, icon: "📖", color: "#c084fc", cat: "Wissen" },
  { id: "dq-breath",  title: "5 Min Atemübung",              tip: "Vagus-Nerv aktivieren",               reward: 50, icon: "🌬️", color: "#6ec5d5", cat: "Atemarbeit" },
  { id: "dq-cold",    title: "Kalte Dusche zuhause",         tip: "60 Sek reichen — Mini-Cryo",          reward: 60, icon: "🚿", color: "#4a9aab", cat: "Kälte" },
  { id: "dq-visit",   title: "Im Studio einchecken",         tip: "1 Anwendung diesen Tag",              reward: 100, icon: "🏔️", color: "#5d7e96", cat: "Studio" },
  { id: "dq-mobility",title: "10 Min Mobility",              tip: "Beweglichkeit hält jung",             reward: 35, icon: "🧘", color: "#d4a070", cat: "Recovery" },
  { id: "dq-sleep",   title: "Vor 23 Uhr im Bett",           tip: "Schlaf = beste Recovery",             reward: 45, icon: "😴", color: "#8b7ed8", cat: "Schlaf" },
  { id: "dq-walk",    title: "10.000 Schritte",              tip: "Lymphfluss aktivieren",               reward: 50, icon: "👟", color: "#7ab78e", cat: "Aktivität" },
];

/* ---------- Wissens-Karten (Edukation über Freezeclub) ---------- */
const KNOWLEDGE = [
  {
    id: "kn-cryo-basics",
    title: "Was passiert in der Kältekammer?",
    cat: "Physiologie",
    readTime: "2 Min",
    reward: 50, icon: "❄️", color: "#5b9bd5",
    summary: "Bei −85 °C reagiert dein Körper mit einer kontrollierten Stress-Antwort.",
    body: [
      "Innerhalb von Sekunden zieht sich die Hautdurchblutung zusammen – dein Blut wandert in den Körperkern, um Organe zu schützen.",
      "Nach 3 Minuten verlässt du die Kammer, der Körper öffnet die Gefäße wieder weit (Reaktive Hyperämie). Das spült Stoffwechselprodukte aus, Entzündungsbotenstoffe sinken, Endorphine steigen.",
      "Effekt: weniger Muskelkater, klarer Kopf, besserer Schlaf in der folgenden Nacht."
    ],
  },
  {
    id: "kn-why-85",
    title: "Warum genau −85 °C?",
    cat: "Protokoll",
    readTime: "1 Min",
    reward: 40, icon: "🌡️", color: "#4a9aab",
    summary: "Diese Temperatur löst die volle Reaktion aus – ohne Erfrierungsgefahr.",
    body: [
      "Bei höheren Temperaturen (Eisbad bei 4 °C z. B.) braucht der Körper viel länger, um die gleiche Reaktion auszulösen.",
      "Trockene Kälte unter −80 °C reduziert die Hautoberflächentemperatur auf ca. 5–8 °C in nur 2–3 Minuten – ein Eisbad bräuchte 10–15 Min für denselben Effekt.",
      "Wichtig: Die Luft ist trocken, du frierst paradoxerweise nicht so schnell wie bei nassem Eisbad."
    ],
  },
  {
    id: "kn-lymph",
    title: "Lymphdrainage: was sie wirklich macht",
    cat: "Recovery",
    readTime: "2 Min",
    reward: 50, icon: "≋", color: "#6cb791",
    summary: "Dein zweites Kreislaufsystem braucht Hilfe beim Pumpen.",
    body: [
      "Das Lymphsystem transportiert Abfallstoffe, Immunzellen und Flüssigkeit – hat aber keine eigene Pumpe.",
      "Mechanische Stimulation (Druckwellen / manuelle Drainage) beschleunigt diesen Fluss um das 10-fache.",
      "Resultat: weniger Wassereinlagerungen, sichtbar definiertere Körperkontur, schnellere Recovery zwischen Trainings."
    ],
  },
  {
    id: "kn-4d-scan",
    title: "Was misst der 4D-Bodyscan?",
    cat: "Tracking",
    readTime: "2 Min",
    reward: 60, icon: "◉", color: "#c084fc",
    summary: "Über 250 Datenpunkte in 35 Sekunden — non-invasiv.",
    body: [
      "Der Scanner erfasst Körperzusammensetzung (Fett/Muskel/Wasser), Haltung, Symmetrie und Umfänge millimetergenau.",
      "Im Gegensatz zur Waage zeigt er Verschiebungen: Du nimmst vielleicht nicht ab, baust aber sichtbar Muskel auf und verlierst Fett.",
      "Alle 4–6 Wochen scannen ist optimal — Veränderungen brauchen Zeit, aber sind dann sehr klar messbar."
    ],
  },
  {
    id: "kn-hrv",
    title: "Kälte & HRV: warum Tracker es lieben",
    cat: "Performance",
    readTime: "2 Min",
    reward: 55, icon: "📈", color: "#5d7e96",
    summary: "Regelmäßige Kälte hebt deine Herzraten-Variabilität.",
    body: [
      "HRV ist der wichtigste Marker für Recovery und Stressresistenz. Höher = besser regeneriert.",
      "Studien (Huberman Lab, 2022) zeigen: 2–3× pro Woche Kältereiz erhöht die HRV nachhaltig nach 4 Wochen.",
      "Wer Whoop, Oura oder Apple Watch trägt, sieht den Effekt direkt im Sleep- und Recovery-Score."
    ],
  },
  {
    id: "kn-pre-post",
    title: "Pre- oder Post-Workout?",
    cat: "Protokoll",
    readTime: "1 Min",
    reward: 40, icon: "⚡", color: "#d4a070",
    summary: "Es macht einen großen Unterschied — je nach Ziel.",
    body: [
      "Post-Workout Kälte (innerhalb 1h): maximiert Recovery, reduziert DOMS, ideal für Athleten mit Wettkampf in den nächsten 48h.",
      "Aber: bremst Hypertrophie-Signale. Wer Muskeln aufbauen will, sollte 4–6h Abstand zum Training lassen.",
      "Pre-Workout (morgens): klärt den Kopf, hebt Dopamin um bis zu 250 % für 4–6h — beste Kombi mit Kaffee + Lichttherapie."
    ],
  },
  {
    id: "kn-breath",
    title: "Atemtechnik in der Kammer",
    cat: "Technik",
    readTime: "1 Min",
    reward: 35, icon: "🌬️", color: "#6ec5d5",
    summary: "Wim-Hof-light: lange Ausatmung beruhigt das Nervensystem.",
    body: [
      "Atme 4 Sek ein durch die Nase, halte 2 Sek, atme 6 Sek langsam durch den Mund aus.",
      "Die längere Ausatmung aktiviert den Parasympathikus — du fröstelst weniger, fühlst dich kontrollierter.",
      "Niemals Hyperventilation in der Kammer — Kombination Kälte + Sauerstoffmangel kann Schwindel auslösen."
    ],
  },
  {
    id: "kn-sleep",
    title: "Kälte am Abend = besserer Schlaf",
    cat: "Schlaf",
    readTime: "2 Min",
    reward: 45, icon: "🌙", color: "#8b7ed8",
    summary: "Die Kerntemperatur sinkt 2–3 Stunden danach — perfekt zur Schlafenszeit.",
    body: [
      "Damit du einschlafen kannst, muss deine Kerntemperatur um ca. 1 °C sinken. Das passiert normalerweise gegen 22 Uhr.",
      "Eine Cryo-Session am späten Nachmittag (16–18 Uhr) beschleunigt und vertieft diesen Drop — du schläfst schneller ein und länger durch.",
      "Bonus: Melatonin-Ausschüttung steigt, Stresshormone fallen schneller ab."
    ],
  },
];

window.DAILY_QUESTS = DAILY_QUESTS;
window.KNOWLEDGE = KNOWLEDGE;
