# Freezeclub — Frozen Identity

Premium-Loyalty- und Gamification-WebApp für den Freezeclub. Mitglieder erstellen einen digitalen Avatar, sammeln **FrostPoints** bei realen Anwendungen (Kältekammer, Lymphdrainage, 4D-Bodyscan) und schalten kosmetische sowie reale Belohnungen frei.

**Live Demo:** *(nach Aktivierung von GitHub Pages hier eintragen)*

## Features (v0.1 MVP)
- Onboarding mit Avatar-Stil-Auswahl (Arctic / Lab / Athlete)
- Avatar-Rendering inkl. Aura, Gear, Hoodie
- FrostPoints (FP) Engine mit permanentem & Saison-Score
- Level- und Rank-System (Rookie → Legend)
- Check-in via QR-Code + manuelle Service-Buchung
- Item-Shop mit drei Kategorien (Aura, Gear, Environment), Limited Drops
- Achievements & Challenges
- Saison-Leaderboard (Mock-Daten + eigener Eintrag)
- Streak-Mechanik
- Lokale Persistenz via `localStorage`

## Stack
Pure HTML / CSS / Vanilla JS. Keine Build-Tools, keine Abhängigkeiten. Direkt deploybar auf GitHub Pages, Vercel, Netlify oder jedem statischen Hoster.

## Design
Premium, Withings-inspiriert: ruhige Typografie (Inter + Fraunces), kühle Akzentfarbe (Teal), viel Weißraum, dezente Schatten.

## Lokal starten
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Roadmap
- 3D-Avatar (Ready Player Me Integration)
- Shopify-Anbindung (FP als Cashback im Webshop)
- Auto-Check-in über Buchungssystem-API
- Push-Notifications (Web Push)
- Freundessystem & Social-Sharing
- Backend (Supabase) für Multi-Device-Sync

## Konzept
Vollständiges Strategie- und Produktkonzept im Hauptdokument.
