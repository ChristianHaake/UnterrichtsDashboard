# Hilfe

## Was macht UnterrichtsDashboard?

Das UnterrichtsDashboard ist eine Tafel- und Beamer-Oberfläche für den
Präsenzunterricht. Es bündelt Werkzeuge wie Timer, Arbeitssymbole,
Unterrichtsphasen, Textfelder, QR-Codes und einen Zufallsgenerator in einem
anpassbaren Raster. Es läuft vollständig im Browser, ohne Konto und ohne
Serverspeicherung.

## Schnellstart

1. Füge über die Leiste oben ein Widget hinzu (z. B. **Timer**).
2. Ordne die Widgets per Ziehen an der Titelleiste an – oder nutze die
   Pfeil-Schaltflächen (←↑↓→) am Widget, um sie ohne Maus zu verschieben.
3. Deine Anordnung wird automatisch lokal gespeichert und ist beim nächsten
   Öffnen wieder da.

## Speichern, Exportieren, Importieren

- **Automatisches Speichern:** Änderungen werden fortlaufend lokal im Browser
  (IndexedDB) gesichert.
- **Layout exportieren:** erzeugt eine JSON-Sicherungsdatei auf dem Gerät –
  ideal, um eine Stunde am PC vorzubereiten.
- **Layout importieren:** lädt eine zuvor exportierte Datei. Ist bereits ein
  Dashboard vorhanden, wird vor dem Ersetzen nachgefragt. Schlägt der Import
  fehl (z. B. ungültige Datei), bleibt das aktuelle Dashboard unverändert.

## Daten löschen

Die Schaltfläche **Zurücksetzen** leert das Dashboard und löscht die lokal
gespeicherten Daten der Anwendung. Zusätzliches Löschen der Browserdaten für
diese Website entfernt auch die gespeicherte Sprachwahl.

## Unterstützte Geräte und Grenzen

- Aktuelle Versionen von Chrome, Edge, Firefox und Safari (Desktop, Tablet,
  interaktive Displays).
- Import-/Exportformat: JSON-Dateien der Anwendung.
- Der lokale Speicher ist geräteabhängig begrenzt; für die genannten Inhalte ist
  er unkritisch. Auf iPads (iOS Safari) sind die Kontingente restriktiver.
- Ein Lärmpegel-Messer ist noch nicht enthalten.
