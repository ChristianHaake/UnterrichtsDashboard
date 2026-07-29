# Marktanalyse und technische Spezifikation für ein webbasiertes Classroom-Management-Dashboard auf Cloudflare Pages

> Konform zum haak3-Webapp-Standard (Version 1.0.0-draft). Abweichungen und
> nicht anwendbare Regeln sind im Abschnitt „Standard-Konformität" dokumentiert.

Digitale Unterrichtsassistenzsysteme haben sich in den vergangenen Jahren von einer reinen Nischenerscheinung zu einem zentralen Dreh- und Angelpunkt der modernen Unterrichtsorchestrierung entwickelt. Lehrkräfte stehen zunehmend vor der Herausforderung, heterogene Lerngruppen zu steuern, technologische Infrastrukturen zu bedienen und gleichzeitig kognitive Überlastungen bei den Lernenden zu vermeiden. Ein über Beamer oder interaktive Displays projiziertes Dashboard fungiert hierbei als visueller Anker, der organisatorische Abläufe wie Zeitmanagement, Lärmpegelkontrolle und Arbeitsaufträge zentralisiert. Die vorliegende Analyse evaluiert die Marktpotenziale, didaktischen Designprinzipien und funktionalen Anforderungen für ein solches System. Besondere Berücksichtigung findet die technologische Realisierung als Progressive Web App (PWA), die über das Content Delivery Network von Cloudflare Pages bereitgestellt wird, um eine performante, datenschutzkonforme und offline-fähige Lösung für den Bildungssektor zu schaffen.

## Marktanalyse und Wettbewerbsumfeld

Der Markt für digitale Bildungsangebote in Deutschland ist stark durch politische Förderinitiativen geprägt. Der DigitalPakt Schule und dessen geplante Neuauflage (DigitalPakt 2.0) haben dazu geführt, dass zehntausende Klassenzimmer mit flächendeckendem WLAN, Beamern und vor allem interaktiven Displays ausgestattet wurden. Diese infrastrukturelle Basis erfordert Softwarelösungen, die plattformunabhängig im Browser funktionieren, da die Endgeräte der Lehrkräfte (oftmals Dienst-iPads oder Windows-Convertibles) stark fragmentiert sind.

### Hardwareseitige Markttreiber

Die dominierenden Hardware-Anbieter in deutschen Klassenzimmern, wie Promethean (mit der ActivPanel-Serie) und ViewSonic (mit der ViewBoard-Serie), integrieren zunehmend Android-basierte OPS-Einschubmodule (Open Pluggable Specification), die eine Enterprise Device Licensing Agreement (EDLA) Zertifizierung von Google aufweisen. Diese EDLA-Zertifizierung ermöglicht den direkten Zugriff auf den Google Play Store und vollwertige Chromium-Browser direkt auf der digitalen Tafel. Eine Dashboard-Lösung, die als Web-Applikation konzipiert ist, umgeht somit die oftmals restriktiven Mobile Device Management (MDM) Systeme der Schulträger, da keine lokale Installation einer nativen Applikation erzwungen wird.

### Evaluierung etablierter Marktteilnehmer

Der globale Markt für Unterrichts-Dashboards wird von wenigen, aber dominanten Playern angeführt, wobei sich auch zahlreiche Single-Purpose-Tools (wie BouncyBalls für die Lautstärke oder Wheel of Names für Zufallsgeneratoren) im Repertoire von Lehrkräften finden. Ein holistisches Dashboard muss diese isolierten Werkzeuge in einer kohärenten Oberfläche vereinen.

| Produktname | Zielmarkt & Modell | Funktionale Stärken | Identifizierte Schwachstellen & Marktlücken |
| --- | --- | --- | --- |
| Classroomscreen | Global; Freemium-Modell (Pro-Version ca. 36 EUR/Jahr) | Hoher Bekanntheitsgrad, 26 integrierte Widgets, intuitive Bedienung, keine Registrierung für Basisfunktionen nötig. | Fehlende Speicherfunktion für Layouts in der Gratisversion führt zu hohem Rüstzeitverlust im Schulalltag. Gravierende Datenschutzmängel durch US-Server und Cloudflare-Tracking ohne AV-Vertrag. |
| La Digitale (Digiscreen) | Europäischer Raum; Open Source (Kostenfrei) | Hoher Datenschutz, Offline-Export von Tafelbildern im DGS-Format, keine Nutzerkonten erforderlich. | Weniger elegante Benutzeroberfläche, Performance-Einbrüche bei intensiver Nutzung vieler paralleler Widgets. |
| Sabura | International; Fokus auf RTL-Sprachen (Arabisch) | Vollständig kostenfreie Layout-Speicherung, integrierte Votings und Timer. | Geringe Durchdringung im DACH-Raum, reduzierter Widget-Umfang im Vergleich zu Classroomscreen. |
| Fobizz Klassenräume | DACH-Region; Lizenzmodell für Schulen/Schulträger | DSGVO-konforme KI-Integration, ausgeprägtes Fortbildungsökosystem, Schüler-Zugänge ohne Klarnamen. | Der Fokus liegt primär auf der Bereitstellung von KI-Tools und asynchronen Aufgaben, weniger auf der synchronen Orchestrierung des Beamer-Bildes im Präsenzunterricht. Hohe Kosten für vollumfängliche Flatrates. |

Die Analyse offenbart eine deutliche Marktlücke für eine Lösung, die den Funktionsumfang von Classroomscreen mit dem Open-Source- und Datenschutz-Ethos von Digiscreen verbindet. Nutzerbewertungen auf Plattformen wie G2 und in Fachforen (z. B. lehrerforen.de) zeigen eine signifikante Frustration von Lehrkräften, die grundlegende Routinen – wie das tägliche Anlegen von Timern, Arbeitsanweisungen und Gruppenspezifika – nicht speichern können, ohne private finanzielle Mittel für Premium-Abonnements aufzuwenden. Eine Web-App, die das Speichern von Layouts über den lokalen Speicher des Browsers (Local-First-Architektur) kostenfrei anbietet, adressiert diesen Pain Point direkt.

## Didaktische und kognitionspsychologische Grundlagen

Ein Dashboard, das via Beamer in einem Klassenzimmer präsentiert wird, stellt nicht lediglich ein administratives Werkzeug dar, sondern ist das visuelle Epizentrum des Unterrichts. Die Gestaltung der Benutzeroberfläche (UI) und der User Experience (UX) muss zwingend wissenschaftlich fundierten Paradigmen folgen, um den Lernprozess optimal zu unterstützen.

### Anwendung der Cognitive Load Theory (CLT)

Die in den 1980er Jahren von John Sweller entwickelte Cognitive Load Theory geht von einer stark begrenzten Kapazität des menschlichen Arbeitsgedächtnisses aus. Ein überladenes Klassenzimmer-Display kann zu einer kognitiven Überlastung („Cognitive Overload") führen, bei der Schüler nicht mehr in der Lage sind, neue Informationen adäquat zu verarbeiten. Die Architektur des Dashboards muss diese Belastung aktiv modulieren.

| Kognitive Belastungsart nach Sweller | Definition im schulischen Kontext | Strategien zur Optimierung im Dashboard-Design |
| --- | --- | --- |
| Intrinsic Cognitive Load | Die inhärente Schwierigkeit und Komplexität des eigentlichen Lernstoffs. | Das Dashboard kann die intrinsische Last nicht verringern, muss aber sicherstellen, dass Widgets (wie Textfelder für Arbeitsaufträge) den Stoff klar segmentiert und stufenweise präsentieren („Scaffolding"). |
| Extraneous Cognitive Load | Die irrelevante Belastung, die durch die Art der Präsentation (z. B. schlechtes Layout, Ablenkungen) entsteht. | Zwingende Vermeidung von visuellem Rauschen („Visual Clutter"). Keine dekorativen Animationen, die vom Ziel ablenken. Integration von Informationen an einem Ort, um den Split-Attention-Effekt zu verhindern. |
| Germane Cognitive Load | Die lernförderliche Belastung, die das Gehirn für die eigentliche Schema-Bildung (das Verstehen) aufwendet. | Einsatz klarer, konsistenter visueller Cues (z. B. Arbeitssymbole für Sozialformen), die den Schülern helfen, Erwartungshaltungen sofort zu erfassen. |

Eine Studie zur visuellen Ablenkung in Klassenzimmern belegt, dass eine Reduktion irrelevanter visueller Reize die Aufmerksamkeitsspanne und Gedächtnisleistung, insbesondere bei neurodivergenten Schülern, signifikant erhöht. Das Dashboard muss demnach einen strikt minimalistischen Ansatz verfolgen, bei dem nur die im jeweiligen Moment benötigten Widgets sichtbar sind. Dieser Minimalismus deckt sich mit der Designdirektion des haak3-Standards: neutraler grauer Arbeitsbereich, weiße Flächen, ein blauer Primärakzent, zurückhaltende Rahmen und Schatten.

### Barrierefreiheit und Inklusion

Die Heterogenität in modernen Klassenzimmern erfordert eine Software, die unterschiedlichste Bedürfnisse abdeckt. Ziel ist **WCAG 2.2 AA für den gesamten Kern-Workflow** (haak3-Standard). Dies betrifft einerseits die Lesbarkeit für Schüler mit Dyslexie (Lese-Rechtschreib-Schwäche) und andererseits die Bedienbarkeit durch Lehrkräfte an großformatigen interaktiven Tafeln.

Die typografische Gestaltung ist ein kritischer Faktor. Obwohl spezielle Dyslexie-Schriftarten wie OpenDyslexic existieren, zeigen empirische Studien, dass gängige, gut gestaltete serifenlose Schriften wie Arial, Verdana oder Tahoma oftmals eine äquivalente oder gar bessere Lesegeschwindigkeit ermöglichen. Der Standard fordert einen **lokalen System-Font-Stack; entfernte Font-Dienste dürfen keine Laufzeitabhängigkeit sein.** Eine optionale Schriftart-Auswahl (inklusive einer lokal gebündelten OpenDyslexic-Variante) bietet dennoch einen hohen psychologischen Mehrwert.

Hinsichtlich der Touch-Ergonomie an Displays wie dem Promethean ActivPanel oder ViewSonic ViewBoard müssen die Interaktionsflächen (Touch Targets) entsprechend dimensioniert sein. Der haak3-Standard fordert **mindestens 40×40 CSS-Pixel, für touch-first-Workflows sind 44×44 CSS-Pixel vorzuziehen** (WCAG 2.2). Da das Dashboard explizit für Multitouch-Displays konzipiert ist, gilt hier durchgehend die 44-px-Vorgabe. Eine ausreichende Polsterung („Padding") zwischen den Widgets verhindert versehentliche Fehleingaben.

Weitere verbindliche Barrierefreiheitsanforderungen aus dem Standard, die im Design von Anfang an mitgeführt werden:

- **Volle Tastaturbedienbarkeit** aller Funktionen; sichtbarer, nicht durch Sticky-UI verdeckter Fokus.
- **Drag-and-Drop benötigt eine Tastatur-Alternative.** Das Grid-Layout und der Sitzplan-Ersteller erhalten daher zusätzlich Verschiebe-Buttons (oben/unten/links/rechts) mit sprechenden Namen; jede Umsortierung wird über eine Live-Region angesagt.
- **`prefers-reduced-motion` wird respektiert.** Aufmerksamkeitsanimationen (z. B. Glücksrad des Zufallsgenerators) reduzieren sich bei aktivierter Einstellung auf einen sofortigen, animationslosen Zustandswechsel.
- **Farbe ist nie das einzige Informationsmerkmal.** Lärmampel und Arbeitssymbole tragen zusätzlich Text-/Icon-/Formkodierung.
- Statusänderungen und asynchrone Fehler (z. B. fehlgeschlagener Import, verweigerte Mikrofonberechtigung) werden über eine Live-Region angekündigt.
- Bedienbarkeit bei 200 % Browser-Zoom.
- Etablierte Touch-Gesten (Zwei-Finger-Zoom, Zwei-Finger-Tippen für Kontextmenü) werden auf Multitouch-Displays unterstützt.

## Funktionale Spezifikation: Must-have und Nice-to-have Features

Basierend auf den identifizierten Marktbedürfnissen und didaktischen Anforderungen lassen sich die Funktionen des Dashboards in zwei Kategorien unterteilen. Die Must-have-Features stellen die Kernorchestrierung sicher, während die Nice-to-have-Features eine Differenzierung zum Wettbewerb ermöglichen.

### Must-have Features (Kern-Orchestrierung)

| Feature-Bezeichnung | Didaktischer Nutzen | Technische Umsetzungshinweise & Anforderungen |
| --- | --- | --- |
| Visueller Timer & Stoppuhr | Transparentes Zeitmanagement für Arbeitsphasen. Hilft Schülern bei der Selbstregulation. | Darstellbar als Digitaluhr oder ablaufendes Kreisdiagramm (hohe Fernwirkung). **Die Zeitrechnung erfolgt über absolute Zeitstempel (`performance.now()` / `Date.now()`) mit Drift-Korrektur, ausgeführt in einem Web Worker, damit der Timer auch bei inaktivem Tab präzise weiterläuft.** `requestAnimationFrame` steuert ausschließlich das visuelle Rendering im sichtbaren Zustand und ist ungeeignet für die Zeitmessung, da es in inaktiven Tabs gedrosselt bzw. pausiert wird. |
| Arbeitssymbole (Sozialformen) | Visualisierung von Verhaltensregeln (z. B. Stillarbeit, Flüstern, Partnerarbeit, Gruppenarbeit). | Responsive SVG-Icons, lokal gebündelt. Schnelles Umschalten per Klick. Symbole selbsterklärend und kulturübergreifend verständlich. Zusätzliches Textlabel je Symbol (Farbe nicht alleiniger Träger). |
| Zufallsgenerator (Namen & Gruppen) | Objektive Aufrufe von Schülern; effiziente Bildung heterogener Lerngruppen. | Listenverwaltung über die lokale IndexedDB. Fisher-Yates-Shuffle für faire Durchmischung. Glücksrad-Animation respektiert `prefers-reduced-motion`. |
| Text- & Medien-Widget | Darstellung von Lernzielen, stummen Impulsen und Bildern direkt auf dem Dashboard. | Editor mit begrenztem, sicherem Markdown-Funktionsumfang; **Roh-HTML wird bei der Darstellung deaktiviert bzw. saniert.** Bilder werden als **Blob** in der IndexedDB gehalten und zur Anzeige als Object-URL referenziert, die nach Gebrauch wieder freigegeben wird (kein Base64-Aufblähen). **Keine externen Einbettungen (z. B. YouTube-iframes):** sie wären eine Laufzeit-/Tracking-Abhängigkeit, brächen den Offline-Betrieb und widersprächen der CSP. Externe Ressourcen werden nur als klar gekennzeichneter Aussteige-Link angeboten. |
| QR-Code-Generator | Friktionsloses Teilen von Links (z. B. zu LearningApps) für Schülergeräte. | Vollständig clientseitiges Rendering via HTML5-Canvas. Keine Netzwerkanfragen an externe Dienste. |
| Layout-Persistenz | Speichern der individuellen Widget-Anordnung; adressiert den größten Kritikpunkt an Konkurrenzprodukten. | Serialisierung des Dashboard-Zustands in ein **versioniertes** JSON-Objekt (`schemaVersion`), Ablage in der IndexedDB unter einem namespaced Key. Autosave ist Wiederherstellungsmechanismus, kein Ersatz für den expliziten Export. |
| Layout Ex- und Import | Vorbereitung am PC, Weiternutzung im Klassenraum. | Download/Upload einer JSON-Datei mit dem Dashboard-Zustand. **Importe gelten als nicht vertrauenswürdige Eingabe:** Laufzeit-Validierung gegen ein Schema, saubere Ablehnung unbekannter/zukünftiger Versionen, bestehender Zustand bleibt bei fehlgeschlagenem Import unverändert. Sanitisierte, sprechende Dateinamen beim Export. |
| Unterrichtsphasen-Widget | Transparenz über den Stundenverlauf (z. B. Einstieg, Erarbeitung, Sicherung). | Interaktive Timeline; aktive Phase per Klick farblich **und** per Text/Marker hervorgehoben. |
| Multi-Language Support | Internationale Nutzbarkeit und Barrierefreiheit (DE, EN, FR, ES, NL). | i18n mit zentralisierten UI-Strings als statische JSON-Assets. Sätze nicht aus nicht-umsortierbaren Fragmenten zusammensetzen. Übersetzungsschlüssel dürfen nicht in die gerenderte UI durchschlagen. Sprachwahl lokal persistiert; aktueller Zustand des Sprachumschalters ist zugänglich exponiert. |
| Reset lokaler Daten | Nutzer muss lokal gespeicherte Daten klar und vollständig zurücksetzen können (Standard-Pflicht). | Sichtbare „Zurücksetzen"-Aktion mit Bestätigung; löscht IndexedDB-Stores und relevante `localStorage`-Keys des Namespace. Unterscheidung zwischen „aktuelles Layout leeren" (New/Reset) und „alle lokalen Daten löschen". |

#### Tiefergehende Analyse: Der Lärmpegel-Messer (Noise Meter)

Ein hochgradig nachgefragtes Feature ist die Lautstärke-Ampel, die akustische Unruhe im Raum misst und visuell zurückmeldet. Die Implementierung im Browser ist mit erheblichen technischen Hürden verbunden; diese sind vor der Zusage als MVP-Feature durch einen frühen Machbarkeits-Spike abzusichern (siehe Meilensteinplanung).

Moderne Webbrowser optimieren Audio-Eingänge standardmäßig für Sprach- und Videokonferenzen. Algorithmen wie die automatische Verstärkungsregelung (Automatic Gain Control – AGC), Rauschunterdrückung (Noise Suppression) und Echokompensation (Echo Cancellation) normalisieren das Signal auf ein „komfortables Sprachniveau". Dadurch erzeugen ein lautes (75 dB) und ein leises Klassenzimmer (55 dB) nahezu identische Ausschläge, was das Widget entwertet.

Zur Umgehung übergibt die Anwendung bei der Initialisierung via `navigator.mediaDevices.getUserMedia` explizite Constraints (`autoGainControl: false`, `noiseSuppression: false`, `echoCancellation: false`). **Wichtige Einschränkung:** Diese Constraints werden nicht von allen Browsern zuverlässig honoriert – insbesondere iOS Safari ignoriert sie häufig. Da Dienst-iPads eine primäre Zielplattform sind, ist die Funktion dort nicht garantiert. Konsequenzen für das Design:

- Das Feature ist als **relativer Lautstärke-Indikator (Ampel)** konzipiert, nicht als kalibriertes Schalldruck-Messgerät.
- **Es wird bewusst kein absoluter dB-SPL-Wert als Messwert ausgewiesen.** Eine Umrechnung von dBFS in physikalische dB SPL wäre ohne gerätespezifische Referenzkalibrierung nicht valide. Der Schwellenwert wird als frei justierbare Empfindlichkeitsstufe („leise / okay / zu laut") modelliert, die die Lehrkraft an ihren Raum anpasst.
- Auf Plattformen, die die Constraints nicht honorieren, kommuniziert die UI die eingeschränkte Aussagekraft und bietet weiterhin einen brauchbaren relativen Ausschlag.

Für die Signalanalyse wird die Web Audio API genutzt. Anstelle des veralteten, den Main-Thread belastenden `ScriptProcessorNode` kommt ein **`AudioWorkletNode`** zum Einsatz, das die Roh-Samples in einem dedizierten Audio-Thread verarbeitet. Der Effektivwert (Root Mean Square, RMS) wird **direkt aus den Zeitbereichs-Samples im Worklet** berechnet (kein zusätzlicher `AnalyserNode` im Messpfad) und logarithmiert (dBFS), anschließend auf die relative Ampelskala abgebildet. Es ist zwingend sicherzustellen und in der UI sowie der Datenschutzerklärung unmissverständlich zu kommunizieren, dass die Audiodaten ausschließlich im flüchtigen RAM verarbeitet und zu keinem Zeitpunkt aufgezeichnet oder an Server übertragen werden.

### Nice-to-have Features (Innovation, Differenzierung & Fachdidaktik)

Die modulare Architektur erlaubt die nahtlose Ergänzung weiterführender Werkzeuge. Externe Laufzeitabhängigkeiten (Wetter-API, WebDAV, Echtzeit-Server) sind bewusst auf diese optionale Ebene beschränkt und müssen ohne Blockieren des Kern-Workflows degradieren.

| Feature-Bezeichnung | Didaktischer Nutzen | Technische Umsetzungshinweise & Architektur |
| --- | --- | --- |
| Sitzplan-Ersteller | Visuelle Raumplanung auf Basis der lokal gespeicherten Namenslisten. Verhindert doppelte Datenpflege. | Drag-and-Drop im Frontend **mit Tastatur-Alternative** (Verschiebe-Buttons, Ansage der Änderung). Speicherung von Raumgrundriss und Zuweisungen als JSON in der IndexedDB. |
| Morning Board | Bündelung von Datum, Wetter, „Wort des Tages" und Stundenplan für die Morgenroutine. | Vordefiniertes Template-Layout. Wetterdaten optional über eine freie API; **Fallback auf lokale/letzte Daten bei fehlendem Netz.** Nutzung und Datenempfänger werden in der Datenschutzerklärung dokumentiert und in der CSP (`connect-src`) freigegeben. |
| Punkte- & Belohnungssystem (Scoreboard) | Gamification zur Motivation; Punktevergabe an Individuen, Tischgruppen oder „Häuser". | Zähl-Widget, dessen Status dauerhaft (versioniert) in der IndexedDB gespeichert wird. |
| Digitaler „Hall Pass" (Flurpass) | Tracking kurz abwesender Schüler (z. B. Toilette), inkl. Abwesenheitsdauer. | Kombination aus Namenslisten-Abruf und einer Stoppuhr-Instanz. |
| Interaktive Mathe-Instrumente | Digitale Lineale, Geodreiecke, Zirkel, Koordinatensysteme für den MINT-Unterricht. | SVG-/Canvas-Overlays, transparent über andere Widgets oder Arbeitsblätter legbar, rotier- und skalierbar. |
| Sticky Notes & Mind Mapping | Gemeinsames Brainstorming an der digitalen Tafel. | Editierbare Textbox-Komponenten („Post-its") in einem flexiblen Canvas-Bereich. |
| Interaktives Echtzeit-Feedback | „Exit Polls", Live-Quizzes und Stimmungsbilder über Schülergeräte. | **Optionale** Serverkomponente: Cloudflare Workers + Durable Objects + WebSockets. Muss ohne IP-Adressen oder Schüler-Klarnamen auskommen (temporäre, anonyme Session-IDs, nach Umfrage verworfen). Hinweis: Durable Objects sind kostenpflichtig; Kostenmodell vor Umsetzung prüfen. Kern-Workflow bleibt ohne dieses Feature voll funktionsfähig. |
| Cloud-Integration (WebDAV) | Import von Unterrichtsmaterialien von Schulservern (z. B. IServ, LernSax). | Authentifizierte CORS-Requests an WebDAV-Schnittstellen, ggf. über einen Cloudflare Worker als Proxy. Datenempfänger in Datenschutzerklärung und CSP abbilden. |
| Digitale Zeichenfläche (Whiteboard) | Direkte Annotationen und Freihandzeichnungen auf dem Dashboard. | HTML5 Canvas. Für interaktive Tafeln „Palm Rejection" (Handballenerkennung). |

## Architektur und Bereitstellung via Cloudflare Pages

Die Entscheidung, die Web-Applikation über Cloudflare Pages bereitzustellen, beeinflusst die technische Architektur fundamental. Cloudflare Pages ist primär für die Auslieferung statischer Assets und Single Page Applications (SPAs) ausgelegt, die mit Build-Tools wie Vite (React, Vue, Svelte) generiert werden.

Der haak3-Standard schreibt React nicht vor; das Framework soll zur Produktkomplexität passen. Angesichts eines dynamischen Grid-Layouts mit vielen interaktiven, zustandsbehafteten Widgets ist ein Komponenten-Framework gerechtfertigt.

### Runtime-Modell (Standard-Pflichten)

- Die App **muss ohne Konto** funktionieren.
- Kern-Workflows (Erstellen/Bearbeiten von Dashboards) **laufen im Browser**.
- Nutzererstellte Inhalte **erfordern keine Serverpersistenz**.
- Netzabhängige Features **degradieren, ohne den Kern-Workflow zu blockieren**.

### Modulare Single-Page-Application (SPA)

Um kontinuierliche Erweiterbarkeit sicherzustellen, wird eine konsequent modulare Architektur vorausgesetzt. Das Frontend wird als SPA mit einem modernen Komponenten-Framework (React oder Vue) und Vite strukturiert. Jedes Feature (Timer, Phasen, QR-Code, Sitzplan, Morning Board) wird als isoliertes Modul entwickelt. Domänendaten, Persistenz, Export-/Import-Logik und UI-Rendering bleiben trennbar; Parsing-, Migrations-, Validierungs- und Export-Funktionen werden als reine Funktionen implementiert.

**Bibliotheks-Festlegung:** Für das verschiebbare/größenveränderbare Grid wird **eine** Bibliothek gewählt. Bei React fällt die Wahl auf `react-grid-layout`; bei einem framework-agnostischen Ansatz auf `Gridstack.js`. Diese Entscheidung wird vor Phase 2 verbindlich fixiert (nicht beide parallel). Für die IndexedDB-Zugriffe wird die Wrapper-Bibliothek `Dexie.js` eingesetzt. Dependencies werden nur aufgenommen, wenn sie relevanten Implementierungs-/Wartungsaufwand ersparen, kompatibel lizenziert und aktiv gepflegt sind.

### Deployment, Routing und Performance

Die Bereitstellung erfolgt über direkte Git-Integration. Bei jedem Push in den Main-Branch triggert Cloudflare automatisch einen Build und verteilt die kompilierten Assets auf das globale CDN. Der kostenfreie Tarif erlaubt (Stand: bei Umsetzung erneut verifizieren, da Cloudflare die Pages- und Workers-Angebote konsolidiert) in der Größenordnung von 500 Builds/Monat, unbegrenzte Bandbreite sowie das Hosten zehntausender Dateien mit einer Maximalgröße pro Datei im zweistelligen MB-Bereich.

Für das SPA-Routing wird eine `wrangler.jsonc` verwendet, die auf das Build-Ausgabeverzeichnis (`dist`) zeigt und `not_found_handling` auf `"single-page-application"` setzt. Damit liefert das CDN bei sonst nicht existierenden Client-Routen die Kernapplikation aus. **Direkte Navigation und Reload müssen für jede öffentliche Route funktionieren** (inkl. der Inhaltsseiten).

Cloudflare optimiert die Auslieferung zusätzlich durch automatische Minifizierung und Brotli-Kompression textbasierter Assets, was niedrige Latenzen und gute Core Web Vitals ermöglicht – relevant für Schulen mit defizitärer Bandbreite. **Der Tag-/Third-Party-Script-Manager Zaraz wird nicht eingesetzt:** Als Local-First-App ohne Drittanbieter-Skripte gibt es nichts zu verwalten, und ein Tag-Manager stünde im Widerspruch zum Tracking-Verbot und zur restriktiven CSP.

### Sicherheits-Header und Content Security Policy

Produktions-Deployments verwenden HTTPS und definieren (über `public/_headers` bzw. Cloudflare-Konfiguration) mindestens:

- `Content-Security-Policy` – restriktiv, spiegelt das tatsächliche Verhalten wider. Da Inhalte lokal bleiben, ist `connect-src` eng gefasst; benötigte optionale Endpunkte (Wetter-API, WebDAV-Proxy, Echtzeit-WebSocket) werden **nur bei aktivem Feature** explizit ergänzt. `frame-ancestors` beschränkt das Einbetten.
- `Referrer-Policy`;
- `X-Content-Type-Options: nosniff`;
- `Permissions-Policy` – erlaubt `microphone` gezielt für den Noise Meter, sperrt nicht benötigte Berechtigungen (Kamera, Geolocation etc.);
- Immutable Caching für fingerprintete Assets, Revalidierung für HTML und Route-Fallbacks;
- Preview-Deployments erhalten `X-Robots-Tag: noindex`.

Die CSP muss das reale Verhalten abbilden; ein pauschales `connect-src 'none'` ist unzulässig, sobald ein optionales Netzfeature aktiv ist.

### Local-First Data Storage (Progressive Web App)

Um die Applikation resilient gegen Netzausfälle zu machen und Serverkosten zu vermeiden, wird das System als Local-First-Anwendung konzipiert. Es nutzt zwei zentrale Browser-Technologien:

1. **Cache API via Service Worker:** Das App-Gerüst (HTML, CSS, JS-Bundles, Icons, lokal gebündelte Schriften) wird gecacht. Eine Cache-First-Strategie lädt die App instantan; Updates werden im Hintergrund (Stale-While-Revalidate) geladen und beim nächsten Start angewendet.
2. **IndexedDB für strukturierte Daten:** Für Namenslisten, JSON-strukturierte Layout-Koordinaten und Bild-Blobs. `localStorage` ist nicht veraltet, aber synchron und klein (ca. 5–10 MB); es wird gemäß Standard nur für kleine Präferenzen und Textkonfiguration (z. B. Sprachwahl, Theme) genutzt. Für alles Umfangreichere dient die asynchrone IndexedDB (via `Dexie.js`).

Die IndexedDB-Speicherkontingente sind für diesen Anwendungsfall reichlich bemessen. Desktop-Browser gewähren typischerweise einen großen Anteil des freien Speichers; mobile Endgeräte (iOS Safari) sind restriktiver, für textbasierte JSON-Daten und einige komprimierte Bilder aber unkritisch. `QuotaExceededError` wird abgefangen und die Nutzer werden zum Bereinigen alter Daten aufgefordert.

**Datensicherheit (Standard-Pflichten):**

- Storage-Keys werden ge-namespaced; persistierte Schemata werden versioniert.
- Importierte/wiederhergestellte Daten werden zur Laufzeit validiert; unbekannte zukünftige Versionen werden sauber abgelehnt.
- Der aktuelle Zustand bleibt bei fehlgeschlagenem Import erhalten (Zustandsersetzung erst nach vollständiger Validierung).
- Es gibt einen klaren Reset lokaler Daten.
- Object-URLs und andere Browser-Ressourcen werden freigegeben.
- Grenzwerte für Dateigröße, Bildabmessungen und Eintragszahl sind explizite Konstanten.
- Dokumentiert wird, was, wo und wie lange gespeichert wird.

## Datenschutz, Inhalts- und Rechtsseiten

Der Einsatz von Software in Schulen unterliegt der strengen Aufsicht der Landesdatenschutzbeauftragten. Etablierte Marktführer wie Classroomscreen stehen in der Kritik, da sie ohne formelle Verträge operieren, US-Infrastruktur nutzen, standardmäßig Tracking-Cookies implementieren und Daten potenziell dem CLOUD Act unterliegen.

Die vorgeschlagene Architektur entschärft dies durch „Privacy by Design" radikal. Die gesamte Verarbeitung findet im eigenen Browser statt:

- **Vollständige Anonymität der Lehrkraft:** Nutzung ohne Registrierung. Speicherung in der lokalen IndexedDB verlagert die datenschutzrechtliche Verantwortung auf das lokal verwaltete Schulsystem.
- **Schutz der Schülerdaten:** Angelegte Schülerlisten verlassen den Browser nicht. Optionale Echtzeit-Features kommen ohne IP-Adressen oder Klarnamen aus (temporäre, anonyme Session-IDs).
- **Audio- und Medien-Datenschutz:** Das Mikrofonsignal wird nur lokal in einen relativen Pegel umgewandelt; kein Audio-Streaming. QR-Codes werden lokal generiert.
- **Keine anwendungsseitige Verhaltensverfolgung, Werbung, Fingerprinting oder Third-Party-Analytics.** Externe CDNs/Remote-Assets sind keine Laufzeitabhängigkeit.

### Pflicht-Inhaltsseiten (haak3-Standard)

Jede Produktions-App **muss** bereitstellen: **Hilfe**, **Datenschutz**, **Impressum**. Eine **Über**-Seite ist empfohlen. Umsetzung:

- Inhalte als Markdown, getrennt von UI-Komponenten, zur Build-Zeit gebündelt; Roh-HTML deaktiviert/saniert.
- Stabile, sprechende Routen; direkte Navigation funktioniert; je Seite genau **ein `h1`** und ein Rückweg zur App.
- Externe Links visuell erkennbar, in neuem Tab mit `rel="noopener noreferrer"`.
- **Datenschutzseite** deckt ab: Betreiber-/Kontaktinfo; Hosting-Provider und Verbindungsdaten; `localStorage`/IndexedDB/Cookies und ihre Zwecke; hochgeladene Dateien und ob sie das Gerät verlassen (nein); Mikrofonnutzung (nur lokal); optionale externe APIs (Wetter/WebDAV/Echtzeit) samt Empfänger; Lösch-/Reset-Verhalten; Datum/Version. Kein „keine Datenübertragung", da der Host zwangsläufig Verbindungsmetadaten erhält – technische Request-Daten und Nutzerinhalte werden unterschieden.
- **Impressum** wird vor Release vom Betreiber vervollständigt und geprüft; Vorlagen/generierter Text sind keine rechtliche Freigabe.
- **Hilfe** erklärt den kürzesten erfolgreichen Workflow, Speichern/Import/Export/Reset, lokale Persistenz und deren Grenzen, unterstützte Dateien/Größen sowie bekannte Browser-/Gerätebeschränkungen (z. B. Noise Meter auf iOS).
- Bei mehrsprachiger UI werden die Pflichtseiten übersetzt; ist eine rechtlich maßgebliche Fassung nur in einer Sprache verfügbar, weist die übersetzte Seite darauf hin.

## Anwendungs-Shell und UI-Muster

Gemäß haak3-Standard erhält die App eine konsistente Shell:

- **Header** mit kompaktem Brand-Mark, App-Name und kurzem funktionalem Tagline; Kommunikation der lokalen Verarbeitung; Sprach-/Lehrkraft-Controls rechts; primäre Workflow-Aktionen getrennt von Identitäts-/Info-Links.
- **Hauptbereich** als Grid-Arbeitsfläche.
- **Footer** mit Links zu **Hilfe, Datenschutz, Impressum und dem öffentlichen Quellcode-Repository** (Icon-und-Label-Link, `target="_blank"`, `rel="noopener noreferrer"`, kein Third-Party-Script). Optional ein Über-Link. Footer-Labels und Reihenfolge bleiben je Sprache konsistent; essenzielle Rechtslinks werden nicht in einem Menü versteckt.
- **Projektaktionen mit konsistenten Verben:** „Neu/Zurücksetzen" leert das aktuelle Layout; „Öffnen/Importieren" lädt eine Datei; „Layout exportieren" erzeugt ein editierbares Backup. Das Ersetzen nicht-leerer Arbeit erfordert eine Bestätigung; fehlgeschlagene Importe lassen das aktuelle Layout intakt.
- **Leere-, Lade- und Fehlerzustände** in klarer Sprache; Validierungsfehler erscheinen nahe dem betroffenen Feld.
- **Design-Tokens:** semantische CSS-Tokens statt verstreuter Rohwerte, auf Basis der Familien-Palette (neutraler grauer Hintergrund, weiße Flächen, ein blauer Primärakzent, konsistente Radien/Schatten). Der Primär-Farbton darf für die Produktidentität angepasst werden, sofern Kontrast und semantische Zustände erhalten bleiben.
- **Responsives Verhalten:** minimale Viewport-Breite 320 px; kein horizontales Seiten-Scrollen; Tests bei 320 px, 390 px, Tablet-Hochformat und Desktop. An interaktiven Tafeln stehen große Touch-Ziele und kontrastreiche Darstellung für schlecht abgedunkelte Räume im Fokus.

## Codequalität, Tests und Verifikation

Der haak3-Standard fordert wartbares TypeScript mit automatisierter Verifikation:

- **Neuer Code in TypeScript mit strikter Typprüfung.**
- **Automatisierte Tests (Pflicht)** für: Persistenz-Serialisierung/-Wiederherstellung; Schema-Migration und ungültige Importe; destruktive Zustandsübergänge (Reset); zentrale Domänentransformationen (z. B. Fisher-Yates-Fairness, Phasenlogik).
- **Browser-Tests (empfohlen, via Playwright)** für: den primären Workflow (Widget anlegen, anordnen, speichern, neu laden); direkte Navigation zu den Inhaltsseiten; Import/Export; Tastaturzugriff auf kritische Controls. Cross-Browser-Läufe und fixierte Locale zur Vermeidung von Flakiness.
- **Vorhersehbare npm-Kommandos:** `dev`, `build`, `test`, `lint`, `typecheck`, `verify`. `verify` läuft in der CI und gated automatisierte Releases. Zusätzlich ein `verify:live`/`smoke:production`-Skript, das erwartete HTTP-Header, CSP und PWA-Assets des Deployments prüft. `npm ci` für reproduzierbare Builds; unterstützte Node-Major-Version pinnen.
- **README** dokumentiert: Produktzweck und Zielgruppe; Live-URL; lokale Verarbeitung/Netzverhalten; Persistenz und Projektdatei-Verhalten; Entwicklungs-/Verifikationskommandos; Deployment-Ziel; Lizenz; bekannte Barrierefreiheits-/Export-Grenzen (z. B. Noise Meter auf iOS).
- Das signifikante serialisierte Format (Dashboard-Layout-JSON) erhält eine eigene versionierte Spezifikation.

## Projektplan und Umsetzung

Die Entwicklung erfolgt schrittweise, beginnend mit einem Minimum Viable Product (MVP) und anschließenden modularen Ausbauphasen.

### MVP-Definition

Das MVP ist eine rein clientseitige SPA, als PWA über Cloudflare Pages bereitgestellt. Fokus auf die Must-have-Features der Kernorchestrierung (Timer, Zufallsgenerator, Phasen-Widget, Arbeitssymbole, Layout-Persistenz mit Ex-/Import, Reset) sowie – abhängig vom Ergebnis des Machbarkeits-Spikes – den Lärmpegel-Messer. Speicherung ausschließlich lokal (IndexedDB), offline-fähig. Die Pflicht-Inhaltsseiten (Hilfe, Datenschutz, Impressum) und die Shell (Header/Footer) sind Teil des MVP, nicht nachgelagert.

### Zentrale User Stories (MVP)

- **US 1 – Layout-Persistenz & Export.** Als Lehrkraft möchte ich, dass mein Dashboard lokal gespeichert wird und ich Konfigurationen als Datei ex- und importieren kann. Akzeptanzkriterien: automatisches Speichern der Koordinaten in der IndexedDB; JSON-Download/-Upload; **exportiertes JSON trägt eine `schemaVersion`; Import validiert zur Laufzeit, lehnt unbekannte/zukünftige Versionen sauber ab und lässt bei Fehler den bestehenden Zustand unverändert.**
- **US 2 – Lärmpegel-Messer (Noise Meter).** Als Lehrkraft möchte ich die Lautstärke als Ampel visualisieren. Akzeptanzkriterien: lokale Analyse über Web Audio API im AudioWorklet ohne Audio-Streaming; Deaktivierung der AGC angefordert; **als relativer Indikator mit justierbarer Schwelle umgesetzt (kein absoluter dB-SPL-Messwert); eingeschränkte Zuverlässigkeit auf iOS wird in der UI kommuniziert.**
- **US 3 – Multi-Language Support.** Als Lehrkraft möchte ich das Dashboard in verschiedenen Sprachen nutzen (DE, EN, FR, ES, NL). Akzeptanzkriterien: UI passt sich der Systemsprache an; manuelle Umschaltung via Dropdown mit zugänglich exponiertem Zustand; Auswahl lokal persistiert; Strings als statische Assets; keine Übersetzungsschlüssel in der UI.
- **US 4 – Unterrichtsphasen.** Als Lehrkraft möchte ich den Stundenverlauf visualisieren. Akzeptanzkriterien: Anlage mehrerer benannter Phasen; Hervorhebung der aktuellen Phase per Klick (Farbe **und** Text/Marker).
- **US 5 – Bereitstellung & Routing.** Als Administrator möchte ich eine performante SPA-Auslieferung. Akzeptanzkriterien: automatischer Build via Git; SPA-Routing (`not_found_handling = "single-page-application"`); gesetzte Sicherheits-Header (CSP inkl. `Permissions-Policy: microphone`, `Referrer-Policy`, `X-Content-Type-Options`, `frame-ancestors`).
- **US 6 – Touch-Ergonomie & Barrierefreiheit.** Als Lehrkraft möchte ich die App fehlerfrei am interaktiven Display und per Tastatur bedienen. Akzeptanzkriterien: interaktive Elemente ≥ 44×44 CSS-Pixel; voller Tastaturzugriff mit sichtbarem Fokus; `prefers-reduced-motion` respektiert.
- **US 7 – Pflicht-Inhaltsseiten & Reset.** Als Lehrkraft möchte ich Hilfe, Datenschutz und Impressum erreichen und meine lokalen Daten zurücksetzen können. Akzeptanzkriterien: erreichbare Routen für Hilfe/Datenschutz/Impressum mit je einem `h1` und Rückweg; Footer verlinkt Hilfe/Datenschutz/Impressum/Repository; sichtbare Reset-Aktion mit Bestätigung, die lokale Daten vollständig löscht.

### Meilenstein-Planung

Die Wochenangaben sind Orientierungswerte für eine kleine Umsetzung; der Noise-Meter-Spike kann die Reihenfolge und den MVP-Umfang beeinflussen.

- **Phase 0: Machbarkeits-Spike Noise Meter (Woche 0–1)**
  - Test von `getUserMedia`-Constraints und AudioWorklet-Pegelmessung auf Ziel-Hardware (Dienst-iPad/iOS Safari, Promethean/ViewSonic, Windows-Convertible). Entscheidung, ob der Noise Meter Teil des MVP wird oder in eine spätere Phase rückt.

- **Phase 1: Setup, Shell & Infrastruktur (Woche 1–2)**
  - Initialisierung des SPA-Frameworks (Vite mit React/Vue), TypeScript strikt, Design-Tokens.
  - App-Shell (Header/Footer), Routing inkl. Pflicht-Inhaltsseiten (Markdown), i18n-Grundgerüst.
  - Git-Integration mit Cloudflare Pages, `wrangler.jsonc`, Sicherheits-Header (`_headers`), CI mit `verify`.

- **Phase 2: Core-Widgets (Woche 3–4)**
  - Grid-Layout-System (festgelegte Bibliothek) und isolierte Widgets: Timer (Worker-basiert), Text/Medien, QR-Code, Phasen, Arbeitssymbole, Zufallsgenerator. Tastatur-Alternative fürs Umsortieren.

- **Phase 3: Persistenz, Datensicherheit & Noise Meter (Woche 5–6)**
  - IndexedDB-Anbindung (Dexie), versioniertes Layout-Schema, JSON-Ex-/Import mit Laufzeit-Validierung, Reset-Funktion.
  - Noise Meter (falls aus Phase 0 bestätigt) als relative Ampel.
  - Automatisierte Tests für Persistenz, Migration, ungültige Importe und Reset.

- **Phase 4: Barrierefreiheit, Tests & MVP-Release (Woche 7)**
  - Tastatur-/Screenreader-Checks, 200%-Zoom, `prefers-reduced-motion`; Browser-Tests des Primär-Workflows; Systemtests auf Ziel-Hardware; Datenschutzseite gegen reales Verhalten abgeglichen; Impressum vom Betreiber freigegeben. Launch über Cloudflare Pages.

- **Phase 5: Post-MVP – Klassenraum-Management & Gamification (Woche 8–10)**
  - Sitzplan-Ersteller (Namenslisten-Wiederverwendung, D&D mit Tastatur-Alternative), Morning Board (Wetter optional mit Fallback), lokales Punkte-/Belohnungssystem, digitaler „Hall Pass".

- **Phase 6: Erweiterte Fachdidaktik & Interaktion (Woche 11–13)**
  - Interaktive Mathe-Instrumente, Sticky Notes, Whiteboard mit Palm Rejection. Optionale Cloudflare Workers + WebSockets für Live-Quizzes/Schüler-Feedback (Kostenmodell und Datenschutz vorab prüfen; Kern bleibt ohne Server funktionsfähig).

## Standard-Konformität (haak3-Webapp-Standard)

Standard-Version: 1.0.0-draft

### Nicht anwendbare Regeln (Scope-Filter)

Das Produkt ist ein Klassenzimmer-Dashboard, kein Dokumentengenerator. Folgende Standard-Teile sind daher nicht bzw. nur eingeschränkt relevant:

- Editor/Preview-Split und A4-/Dokumentvorschau: entfällt.
- Barrierefreiheit exportierter Dokumente (PDF-Textfluss, DOCX-Überschriften/Tabellen): entfällt. **Ausnahme:** Das exportierte Layout-JSON unterliegt weiterhin den Datensicherheits- und Versionierungsregeln.
- „Buy me a coffee"/Support-Link: optional, standardmäßig nicht vorgesehen.

### Offene Exceptions

- Regel: Noise Meter als kalibrierte dB-SPL-Messung.
  - Reason: Browser-Mikrofone sind ohne gerätespezifische Referenz nicht valide kalibrierbar; iOS Safari honoriert AGC-Constraints unzuverlässig.
  - Scope: Feature „Lärmpegel-Messer" – umgesetzt als relativer Indikator statt Messgerät.
  - Review date: nach Phase 0 (Machbarkeits-Spike).

## Strategische Handlungsempfehlungen

Die Marktanalyse bestätigt ein hohes Potenzial für ein webbasiertes Classroom-Management-Dashboard, das sich durch Performance, Kostenfreiheit zentraler Speicherfunktionen und konsequenten Local-First-Datenschutz abhebt.

1. **Fokus auf PWA-Kern und modulare Architektur.** Zuerst strikt auf die SPA konzentrieren. Mit React/Vue, Vite und einer festgelegten Grid-Bibliothek lassen sich die Must-have-Features ressourcenschonend umsetzen und via Cloudflare Pages skalieren. Der USP – Layouts kostenfrei in der IndexedDB sichern und als Datei exportieren – muss prominent vermarktet werden.
2. **Datensicherheit und Rechtssicherheit vor Kosmetik.** Import-Validierung, Schema-Versionierung, Reset, Pflicht-Inhaltsseiten und Sicherheits-Header sind Teil des MVP, nicht optional – sie schützen vor Datenverlust und Rechtsrisiken.
3. **Hardware-spezifische Optimierung.** UI auf großflächige Touch-Ziele (WCAG 2.2), kontrastreiche Darstellung und Tastaturbedienbarkeit auslegen. Neurodivergente Bedürfnisse und Mehrsprachigkeit adressieren pädagogische und internationale Tiefe.
4. **Risikofeature früh absichern.** Der Noise Meter wird vor der MVP-Zusage per Spike auf Ziel-Hardware validiert; sein Status als relativer Indikator wird ehrlich kommuniziert.
5. **Modularer Ausbau.** Auf dem statischen Fundament lassen sich Gamification (Scoreboard), didaktische Werkzeuge (Mathe-Overlays, Sitzpläne) und optionale Echtzeit-Features schrittweise ergänzen, ohne die Basisstruktur anzupassen.
