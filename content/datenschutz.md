# Datenschutz

Stand: 2026-07-29

> Vorlage: Der rechtliche Rahmen (Rechtsgrundlagen, Speicherdauer,
> Auftragsverarbeitung, Betroffenenrechte) muss vor Veröffentlichung durch den
> Betreiber geprüft und ergänzt werden. Die Beschreibung des technischen
> Verhaltens unten entspricht dem aktuellen Stand der Anwendung.

## Verantwortlicher

Christian Haake

[Betreiberadresse vor Veröffentlichung ergänzen]

E-Mail: christianhaake@gmail.com

## Grundprinzip: lokale Verarbeitung

Das UnterrichtsDashboard funktioniert ohne Benutzerkonto und ohne Anmeldung.
Alle Inhalte – Widget-Anordnungen, Timer-Einstellungen, Textfelder, Phasen,
QR-Code-Inhalte und Namenslisten des Zufallsgenerators – werden ausschließlich
lokal im Browser des Endgeräts verarbeitet und gespeichert. Diese Daten werden
zu keinem Zeitpunkt an einen Server der Anwendung übertragen.

## Hosting

Die Anwendung wird als statische Web-App über Cloudflare (ud.haak3.de)
ausgeliefert.
Beim Aufruf verarbeitet der Hosting-Anbieter technisch erforderliche
Verbindungsdaten (z. B. IP-Adresse, Zeitpunkt, angeforderte Datei,
Browserangaben), um die Auslieferung zu ermöglichen. Diese technischen
Verbindungsdaten sind von den lokal gespeicherten Nutzerinhalten zu
unterscheiden.

> Zu ergänzen (Betreiber): Rechtsgrundlage, Speicherdauer, Vertrag zur
> Auftragsverarbeitung mit Cloudflare und Link zu deren Datenschutzerklärung.

## Lokale Speicherung

| Speicher | Schlüssel/Name | Zweck |
| --- | --- | --- |
| IndexedDB | Datenbank `unterrichtsdashboard` | Speichert das aktive Dashboard (Widgets, deren Inhalte und die Layout-Koordinaten). Automatisch gesichert. |
| localStorage | `ud:lang` | Speichert die gewählte Oberflächensprache. |

Es werden keine Cookies gesetzt.

## Verarbeitung von Inhalten und Dateien

Eingegebene Texte, Namenslisten und QR-Code-Inhalte verlassen das Gerät nicht.
QR-Codes werden lokal im Browser erzeugt; es erfolgt keine Anfrage an externe
Dienste. Beim Export wird eine JSON-Datei lokal auf dem Gerät erzeugt; beim
Import wird eine vom Nutzer ausgewählte Datei lokal eingelesen.

## Kein Tracking, keine Analyse

Es werden keine Analyse-, Tracking-, Werbe- oder Fingerprinting-Dienste und
keine Drittanbieter-Skripte eingesetzt. Die Content-Security-Policy der
Anwendung lässt ausgehende Verbindungen nur zur eigenen Herkunft und – sofern
das optionale Wetter-Widget (Morning Board) genutzt wird – zu Open-Meteo zu
(siehe nächster Abschnitt). Andere ausgehende Verbindungen werden unterbunden.

## Wetterdaten (Morning Board)

Das optionale Widget „Morning Board" kann aktuelle Wetterdaten anzeigen. Nur
wenn diese Funktion aktiv genutzt wird, sendet der Browser den gesuchten
Ortsnamen bzw. die daraus ermittelten Koordinaten an den Dienst **Open-Meteo**
(`geocoding-api.open-meteo.com` und `api.open-meteo.com`). Übertragen wird
ausschließlich die Ortsanfrage; es werden keine personenbezogenen Daten, keine
Namenslisten und keine Kennungen gesendet. Open-Meteo setzt nach eigenen
Angaben keine Cookies. Wird das Widget nicht verwendet, findet keine solche
Verbindung statt.

## Mikrofon

Die aktuelle Version verwendet kein Mikrofon. Sollte künftig ein
Lärmpegel-Messer ergänzt werden, wird das Mikrofonsignal ausschließlich lokal in
einen relativen Pegel umgewandelt und niemals aufgezeichnet oder übertragen;
diese Erklärung wird dann entsprechend aktualisiert.

## Löschung

Lokal gespeicherte Daten können jederzeit gelöscht werden:

- über die Schaltfläche **Zurücksetzen** im Dashboard (leert die IndexedDB der
  Anwendung);
- über das Löschen der Browserdaten für diese Website (entfernt zusätzlich die
  gespeicherte Sprachwahl).

## Rechte betroffener Personen

> Zu ergänzen (Betreiber): Informationen zu Auskunft, Berichtigung, Löschung,
> Einschränkung, Widerspruch und Beschwerderecht bei einer Aufsichtsbehörde.
