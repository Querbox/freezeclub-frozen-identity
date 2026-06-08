# Frosti Avatar-Bilder

Hier kommen die echten Avatar-Bilder rein. Solange ein Bild fehlt, rendert die App automatisch die SVG-Version als Fallback.

## Naming Konvention

```
{preset}-{level}.png
```

- `preset`: `frost`, `mint`, `aurora`, `ember`
- `level`: `1` bis `5` (Frostknospe → Polarchampion)

## Was zu uploaden ist

### Frost (Evolution — du hast diese 4 schon generiert)

| Datei | Stufe | Beschreibung |
|---|---|---|
| `frost-1.png` | Frostknospe (Lvl 1) | Soft Peaks — sanfte Eis-Hügelchen |
| `frost-2.png` | Eiskeim (Lvl 2) | Crystal Spikes — scharfe Kristalle |
| `frost-3.png` | Kristallwächter (Lvl 3) | Krone mit Stern |
| `frost-4.png` | Eismeister (Lvl 4) | Royal Ice Crown |
| `frost-5.png` | Polarchampion (Lvl 5) | (optional, sonst wird `frost-4.png` weiter verwendet) |

### Mint, Aurora, Ember

Für jeden weiteren Charakter dieselben 4 Stufen erstellen:

```
mint-1.png ... mint-4.png
aurora-1.png ... aurora-4.png
ember-1.png ... ember-4.png
```

Wenn nur Stufe 1 existiert, nutzt die App für alle Level dasselbe Bild — höhere Stufen ergänzt du, wenn du Lust hast.

## Bild-Vorgaben

- **Format**: PNG mit transparentem Hintergrund
- **Größe**: 1024×1024 px (quadratisch)
- **Inhalt**: Frosti mittig, mit etwas Abstand zum Rand
- **Schatten**: optional unten dezent, oder gar nicht (die Stage hat schon einen Schatten)

## Wie hochladen?

1. PNGs in diesen Ordner ziehen
2. Commit + Push:
   ```
   git add assets/avatars/*.png
   git commit -m "Add Frosti avatar images"
   git push
   ```
3. GitHub Pages aktualisiert in ~1 Minute, dann sind die Bilder live

Beim nächsten App-Load erkennt die Render-Logik die Bilder automatisch und zeigt sie statt SVG.
