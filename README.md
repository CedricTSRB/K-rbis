# 🎃 Narco City – Kürbissuche 2026

Eine einfache, responsive Webseite für die Kürbissuche in Narco City.

## Funktionen
- Fundortkarten mit Beschreibungen und Screenshots
- Persönliche Abhakliste, die nur im jeweiligen Browser gespeichert wird (`localStorage`)
- Zähler und Fortschrittsbalken
- Suchen und Filtern nach „Alle“, „Noch offen“ oder „Gefunden“
- Screenshots durch Anklicken vergrößern
- Funktioniert ohne Benutzerkonto und ohne Backend auf Desktop und Handy

## Aktuelle Fundorte
1. **Epsilon-Anwesen** – hinten durch die Tür, im großen Raum versteckten Zugang zum Center finden (Screenshot folgt).
2. **Strandpromenade** – vor dem Souvenir-/Hut-Shop beim ICE-CREAM-Schild; auf dem Boden neben einem NPC (Screenshot vorhanden).

## Weitere Kürbisse ergänzen
In `index.html` im Array `PLACES` einen Eintrag hinzufügen:

```js
{
  id: 'neuer-eindeutiger-fundort',
  title: 'Name des Fundortes',
  area: 'Gebiet',
  description: 'Hier beschreibst du den Weg zum Kürbis.',
  image: 'assets/neues-bild.webp'
}
```

Den Screenshot unter `assets/` speichern. Solange kein Bild da ist: `image: null`. Die `id` eines bestehenden Fundortes nicht ändern: Die gespeicherten Häkchen der Besucher beziehen sich auf diese Kennung.

## Website online stellen (GitHub Pages)
Im Repository auf **Settings → Pages** gehen und bei **Build and deployment**:
- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**
- Danach **Save** klicken.

Wenn GitHub Pages die Veröffentlichung abgeschlossen hat, ist die Seite normalerweise hier erreichbar:
https://cedrictsrb.github.io/K-rbis/

**Hinweis:** Dies ist ein inoffizieller Community-Guide und keine offizielle Narco-City-Webseite. Die Häkchen werden nicht zwischen Geräten synchronisiert.
