Marktanalyse und technische Spezifikation für ein webbasiertes Classroom-Management-Dashboard auf Cloudflare Pages

Digitale Unterrichtsassistenzsysteme haben sich in den vergangenen Jahren von einer reinen Nischenerscheinung zu einem zentralen Dreh- und Angelpunkt der modernen Unterrichtsorchestrierung entwickelt. Lehrkräfte stehen zunehmend vor der Herausforderung, heterogene Lerngruppen zu steuern, technologische Infrastrukturen zu bedienen und gleichzeitig kognitive Überlastungen bei den Lernenden zu vermeiden. Ein über Beamer oder interaktive Displays projiziertes Dashboard fungiert hierbei als visueller Anker, der organisatorische Abläufe wie Zeitmanagement, Lärmpegelkontrolle und Arbeitsaufträge zentralisiert. Die vorliegende Analyse evaluiert die Marktpotenziale, didaktischen Designprinzipien und funktionalen Anforderungen für ein solches System. Besondere Berücksichtigung findet die technologische Realisierung als Progressive Web App (PWA), die über das Content Delivery Network von Cloudflare Pages bereitgestellt wird, um eine performante, datenschutzkonforme und offline-fähige Lösung für den Bildungssektor zu schaffen.

Marktanalyse und Wettbewerbsumfeld

Der Markt für digitale Bildungsangebote in Deutschland ist stark durch politische Förderinitiativen geprägt. Der DigitalPakt Schule und dessen geplante Neuauflage (DigitalPakt 2.0) haben dazu geführt, dass zehntausende Klassenzimmer mit flächendeckendem WLAN, Beamern und vor allem interaktiven Displays ausgestattet wurden. Diese infrastrukturelle Basis erfordert Softwarelösungen, die plattformunabhängig im Browser funktionieren, da die Endgeräte der Lehrkräfte (oftmals Dienst-iPads oder Windows-Convertibles) stark fragmentiert sind.

Hardwareseitige Markttreiber

Die dominierenden Hardware-Anbieter in deutschen Klassenzimmern, wie Promethean (mit der ActivPanel-Serie) und ViewSonic (mit der ViewBoard-Serie), integrieren zunehmend Android-basierte OPS-Einschubmodule (Open Pluggable Specification), die eine Enterprise Device Licensing Agreement (EDLA) Zertifizierung von Google aufweisen. Diese EDLA-Zertifizierung ermöglicht den direkten Zugriff auf den Google Play Store und vollwertige Chromium-Browser direkt auf der digitalen Tafel. Eine Dashboard-Lösung, die als Web-Applikation konzipiert ist, umgeht somit die oftmals restriktiven Mobile Device Management (MDM) Systeme der Schulträger, da keine lokale Installation einer nativen Applikation erzwungen wird.

Evaluierung etablierter Marktteilnehmer

Der globale Markt für Unterrichts-Dashboards wird von wenigen, aber dominanten Playern angeführt, wobei sich auch zahlreiche Single-Purpose-Tools (wie BouncyBalls für die Lautstärke oder Wheel of Names für Zufallsgeneratoren) im Repertoire von Lehrkräften finden. Ein holistisches Dashboard muss diese isolierten Werkzeuge in einer kohärenten Oberfläche vereinen.

Produktname	Zielmarkt & Modell	Funktionale Stärken	Identifizierte Schwachstellen & Marktlücken
Classroomscreen	Global; Freemium-Modell (Pro-Version ca. 36 EUR/Jahr)	Hoher Bekanntheitsgrad, 26 integrierte Widgets, intuitive Bedienung, keine Registrierung für Basisfunktionen nötig.	Fehlende Speicherfunktion für Layouts in der Gratisversion führt zu hohem Rüstzeitverlust im Schulalltag. Gravierende Datenschutzmängel durch US-Server und Cloudflare-Tracking ohne AV-Vertrag.
La Digitale (Digiscreen)	Europäischer Raum; Open Source (Kostenfrei)	Hoher Datenschutz, Offline-Export von Tafelbildern im DGS-Format, keine Nutzerkonten erforderlich.	Weniger elegante Benutzeroberfläche, Performance-Einbrüche bei intensiver Nutzung vieler paralleler Widgets.
Sabura	International; Fokus auf RTL-Sprachen (Arabisch)	Vollständig kostenfreie Layout-Speicherung, integrierte Votings und Timer.	Geringe Durchdringung im DACH-Raum, reduzierter Widget-Umfang im Vergleich zu Classroomscreen.
Fobizz Klassenräume	DACH-Region; Lizenzmodell für Schulen/Schulträger	DSGVO-konforme KI-Integration, ausgeprägtes Fortbildungsökosystem, Schüler-Zugänge ohne Klarnamen.	Der Fokus liegt primär auf der Bereitstellung von KI-Tools und asynchronen Aufgaben, weniger auf der synchronen Orchestrierung des Beamer-Bildes im Präsenzunterricht. Hohe Kosten für vollumfängliche Flatrates.

Die Analyse offenbart eine deutliche Marktlücke für eine Lösung, die den Funktionsumfang von Classroomscreen mit dem Open-Source- und Datenschutz-Ethos von Digiscreen verbindet. Nutzerbewertungen auf Plattformen wie G2 und in Fachforen (z.B. lehrerforen.de) zeigen eine signifikante Frustration von Lehrkräften, die grundlegende Routinen – wie das tägliche Anlegen von Timern, Arbeitsanweisungen und Gruppenspezifika – nicht speichern können, ohne private finanzielle Mittel für Premium-Abonnements aufzuwenden. Eine Web-App, die das Speichern von Layouts über den lokalen Speicher des Browsers (Local-First-Architektur) kostenfrei anbietet, adressiert diesen Pain Point direkt.

Didaktische und kognitionspsychologische Grundlagen

Ein Dashboard, das via Beamer in einem Klassenzimmer präsentiert wird, stellt nicht lediglich ein administrative Werkzeug dar, sondern ist das visuelle Epizentrum des Unterrichts. Die Gestaltung der Benutzeroberfläche (UI) und der User Experience (UX) muss zwingend wissenschaftlich fundierten Paradigmen folgen, um den Lernprozess optimal zu unterstützen.

Anwendung der Cognitive Load Theory (CLT)

Die in den 1980er Jahren von John Sweller entwickelte Cognitive Load Theory geht von einer stark begrenzten Kapazität des menschlichen Arbeitsgedächtnisses aus. Ein überladenes Klassenzimmer-Display kann zu einer kognitiven Überlastung ("Cognitive Overload") führen, bei der Schüler nicht mehr in der Lage sind, neue Informationen adäquat zu verarbeiten. Die Architektur des Dashboards muss diese Belastung aktiv modulieren.

Kognitive Belastungsart nach Sweller	Definition im schulischen Kontext	Strategien zur Optimierung im Dashboard-Design
Intrinsic Cognitive Load	Die inhärente Schwierigkeit und Komplexität des eigentlichen Lernstoffs.	Das Dashboard kann die intrinsische Last nicht verringern, muss aber sicherstellen, dass Widgets (wie Textfelder für Arbeitsaufträge) den Stoff klar segmentiert und stufenweise präsentieren ("Scaffolding").
Extraneous Cognitive Load	Die irrelevante Belastung, die durch die Art der Präsentation (z.B. schlechtes Layout, Ablenkungen) entsteht.	Zwingende Vermeidung von visuellem Rauschen ("Visual Clutter"). Keine dekorativen Animationen, die vom Ziel ablenken. Integration von Informationen an einem Ort, um den Split-Attention-Effekt (geteilte Aufmerksamkeit zwischen verschiedenen Medienbrüchen) zu verhindern.
Germane Cognitive Load	Die lernförderliche Belastung, die das Gehirn für die eigentliche Schema-Bildung (das Verstehen) aufwendet.	Einsatz klarer, konsistenter visueller Cues (z.B. Arbeitssymbole für Sozialformen), die den Schülern helfen, Erwartungshaltungen sofort zu erfassen, ohne darüber nachdenken zu müssen.

Eine Studie zur visuellen Ablenkung in Klassenzimmern belegt, dass eine Reduktion irrelevanter visueller Reize die Aufmerksamkeitsspanne und Gedächtnisleistung, insbesondere bei neurodivergenten Schülern, signifikant erhöht. Das Dashboard muss demnach einen strikt minimalistischen Ansatz verfolgen, bei dem nur die im jeweiligen Moment benötigten Widgets sichtbar sind.

Barrierefreiheit und Inklusion

Die Heterogenität in modernen Klassenzimmern erfordert eine Software, die unterschiedlichste Bedürfnisse abdeckt. Dies betrifft einerseits die Lesbarkeit für Schüler mit Dyslexie (Lese-Rechtschreib-Schwäche) und andererseits die Bedienbarkeit durch Lehrkräfte an großformatigen interaktiven Tafeln.

Die typografische Gestaltung ist ein kritischer Faktor. Obwohl spezielle Dyslexie-Schriftarten wie OpenDyslexic (welche Buchstaben mit schwereren Unterseiten und breiteren Öffnungen versehen) existieren, zeigen empirische Studien, dass gängige, gut gestaltete serifenlose Schriften wie Arial, Verdana oder Tahoma oftmals eine äquivalente oder gar bessere Lesegeschwindigkeit ermöglichen. Dennoch bietet die Implementierung einer Auswahlmöglichkeit für Schriftarten (inklusive OpenDyslexic) einen hohen psychologischen Mehrwert für betroffene Nutzer, da die Personalisierung das individuelle Leseempfinden stärkt.

Hinsichtlich der Touch-Ergonomie an Displays wie dem Promethean ActivPanel oder ViewSonic ViewBoard müssen die Interaktionsflächen (Touch Targets) entsprechend dimensioniert sein. Die Web Content Accessibility Guidelines (WCAG) fordern eine Mindestgröße von 44x44 CSS-Pixeln für alle interaktiven Elemente (Buttons, Icons). Eine ausreichende Polsterung ("Padding") zwischen den Widgets verhindert versehentliche Fehleingaben, was besonders für Nutzer mit motorischen Einschränkungen oder beim hastigen Bedienen während des Unterrichts essenziell ist. Zudem sollten etablierte Touch-Gesten, wie das Spreizen zweier Finger für den Zoom oder das Zwei-Finger-Tippen für ein Kontextmenü (Rechtsklick), durch das JavaScript der Web-App nativ unterstützt werden, um die Hardware-Möglichkeiten der Multitouch-Displays voll auszuschöpfen.

Funktionale Spezifikation: Must-have und Nice-to-have Features

Basierend auf den identifizierten Marktbedürfnissen und didaktischen Anforderungen lassen sich die Funktionen des Dashboards in zwei Kategorien unterteilen. Die Must-have-Features stellen die Kernorchestrierung sicher, während die Nice-to-have-Features eine Differenzierung zum Wettbewerb ermöglichen.

Must-have Features (Kern-Orchestrierung)

Diese Werkzeuge bilden das Fundament eines jeden Classroom-Management-Dashboards und substituieren traditionelle physische Hilfsmittel.

Feature-Bezeichnung	Didaktischer Nutzen	Technische Umsetzungshinweise & Anforderungen
Visueller Timer & Stoppuhr	Transparentes Zeitmanagement für Arbeitsphasen. Hilft Schülern bei der Selbstregulation.	Darstellbar als klassische Digitaluhr oder als ablaufendes Kreisdiagramm (hohe Fernwirkung). Erfordert eine präzise Taktung via JavaScript requestAnimationFrame, um Hintergrund-Drosselung in inaktiven Browser-Tabs zu vermeiden.
Arbeitssymbole (Sozialformen)	Visualisierung von Verhaltensregeln (z.B. Stillarbeit, Flüstern, Partnerarbeit, Gruppenarbeit).	Nutzung responsiver SVG-Icons. Schnelles Umschalten durch Klick. Die Symbole müssen selbsterklärend und kulturübergreifend verständlich sein.
Zufallsgenerator (Namen & Gruppen)	Objektive Aufrufe von Schülern; effiziente Bildung heterogener Lerngruppen ohne lange Diskussionen.	Listenverwaltung über die lokale IndexedDB. Algorithmus zur fairen Durchmischung (Fisher-Yates Shuffle). Animationseffekte (z.B. Glücksrad) steigern die Aufmerksamkeit.
Text- & Medien-Widget	Darstellung von Lernzielen, stummen Impulsen, Bildern oder YouTube-Videos direkt auf dem Dashboard.	Rich-Text-Editor (WYSIWYG) mit Markdown-Unterstützung. Medien-Uploads sollten lokal im Browser als Base64 oder Objekt-URLs vorgehalten werden, um Serverkosten zu vermeiden.
QR-Code-Generator	Friktionsloses Teilen von Links (z.B. zu LearningApps, Quizlet) für die mobilen Endgeräte der Schülerschaft.	Dynamisches Rendering im Client via HTML5-Canvas. Die Verarbeitung erfolgt zu 100 % im eigenen Browser; es sind keine Netzwerkanfragen an externe Dienste erforderlich.
Layout-Persistenz	Speichern der individuellen Anordnung der Widgets, um Rüstzeiten zu minimieren. Der größte Kritikpunkt an Konkurrenzprodukten.	Serialisierung des Dashboard-Zustands (z.B. via React-Grid-Layout) in ein JSON-Objekt. Persistente Speicherung in der IndexedDB des Browsers.
Layout Ex- und Import	Ermöglicht die Vorbereitung von Unterrichtsstunden am PC und die Weiternutzung im Klassenraum.	Generierung einer JSON-Datei mit dem Dashboard-Zustand, die lokal gespeichert und wieder hochgeladen werden kann.
Unterrichtsphasen-Widget	Transparenz über den Verlauf der Stunde durch eine visuelle Zeitleiste (z.B. Einstieg, Erarbeitung, Sicherung).	Interaktive Timeline-Komponente, in der die aktive Phase per Klick farblich hervorgehoben wird.
Multi-Language Support	Internationale Nutzbarkeit und Barrierefreiheit (DE, EN, FR, ES, NL).	Implementierung über i18n-Bibliotheken. Sprachdateien werden als statische JSON-Assets integriert und die Sprachwahl lokal gespeichert.

Tiefergehende Analyse: Der Lärmpegel-Messer (Noise Meter)

Ein hochgradig nachgefragtes Feature ist die Lautstärke-Ampel, die akustische Unruhe im Raum misst und visuell zurückmeldet, ab wann ein tolerierbarer Schwellenwert überschritten wird. Die Implementierung einer präzisen Lärmmessung im Browser ist jedoch mit erheblichen technischen Hürden verbunden.

Moderne Webbrowser (Chrome, Firefox, Safari) optimieren Audio-Eingänge standardmäßig für Sprach- und Videokonferenzen. Dabei werden Algorithmen wie die automatische Verstärkungsregelung (Automatic Gain Control - AGC), Rauschunterdrückung (Noise Suppression) und Echokompensation (Echo Cancellation) auf das Mikrofonsignal angewendet. Ist die automatische Verstärkungsregelung aktiv, komprimiert der Browser laute Geräusche und verstärkt leise Geräusche, sodass das Signal auf ein "komfortables Sprachniveau" normalisiert wird. Dies führt dazu, dass ein lautes Klassenzimmer (75 dB) und ein leises (55 dB) nahezu identische Ausschläge in der Software generieren, was das Widget nutzlos macht.

Um dies zu umgehen, muss die Anwendung bei der Initialisierung des Audiostroms via navigator.mediaDevices.getUserMedia explizite Constraints übergeben, welche diese Optimierungen deaktivieren (autoGainControl: false, noiseSuppression: false, echoCancellation: false). Für die Berechnung des Schalldruckpegels wird die Web Audio API herangezogen. Anstelle des veralteten und Performance-schädlichen ScriptProcessorNode (welcher auf dem Main-Thread läuft) sollte ein AudioWorkletNode verwendet werden, um die Audiosignale in einem dedizierten Thread in Echtzeit zu analysieren.

Die mathematische Berechnung erfordert die Kalkulation des Root Mean Square (RMS) aus den empfangenen Amplitudendaten des AnalyserNode. Der RMS-Wert wird anschließend logarithmiert, um den digitalen Vollpegel (dBFS - Decibels Full Scale) zu ermitteln. Da dBFS stets negativ ist, muss eine Kalibrierungsschätzung erfolgen, um diesen Wert in einen physikalischen Schalldruckpegel (dB SPL) im positiven Bereich zu konvertieren, der für die Lehrkraft verständlich ist (z.B. Schwellenwert bei 70 dB). Es ist zwingend darauf hinzuweisen, dass die Audiodaten ausschließlich im flüchtigen RAM verarbeitet und zu keinem Zeitpunkt aufgezeichnet oder an Server übertragen werden.

Nice-to-have Features (Innovation, Differenzierung & Fachdidaktik)

Die modulare Architektur erlaubt die nahtlose Ergänzung weiterführender Werkzeuge, die über die grundlegende Klassenraum-Orchestrierung hinausgehen.

Feature-Bezeichnung	Didaktischer Nutzen	Technische Umsetzungshinweise & Architektur
Sitzplan-Ersteller	Visuelle Raumplanung, die direkt auf die lokal gespeicherten Namenslisten zugreift. Verhindert doppelte Datenpflege.	Drag-and-Drop-Schnittstelle im Frontend. Speicherung des Raumgrundrisses und der Zuweisungen als JSON-Objekt in der lokalen IndexedDB.
Morning Board	Bündelung von Datum, Wetter, einem "Wort des Tages" und dem Stundenplan. Unterstützt die Morgenroutine und gibt Orientierung beim Ankommen.	Bereitstellung als vordefiniertes Template-Layout. Externe Wetterdaten können über eine freie API bezogen werden (mit Fallback auf lokale Daten bei fehlendem Internet).
Punkte- & Belohnungssystem (Scoreboard)	Gamification-Ansatz zur Motivation. Punktevergabe an Individuen, Tischgruppen oder "Häuser".	Simples Zähl-Widget, dessen Status (im Gegensatz zur Session) dauerhaft in der IndexedDB gespeichert wird, um Langzeit-Rankings zu ermöglichen.
Digitaler "Hall Pass" (Flurpass)	Tracking von Schülern, die den Raum kurzzeitig verlassen (z.B. Toilette, Sekretariat), inklusive Abwesenheitsdauer.	Kombination aus Namenslisten-Abruf und einer Stoppuhr-Instanz für den jeweiligen Schüler.
Interaktive Mathe-Instrumente	Digitale Lineale, Geodreiecke, Zirkel und Koordinatensysteme. Erhöht den Nutzwert für den MINT-Unterricht enorm.	SVG- oder Canvas-basierte Overlays, die transparent über andere Widgets oder hochgeladene Arbeitsblätter gelegt, rotiert und skaliert werden können.
Sticky Notes & Mind Mapping	Gemeinsames Brainstorming an der digitalen Tafel. Erweiterung der grundlegenden Zeichenfläche.	Implementierung editierbarer Textbox-Komponenten ("Post-its") innerhalb eines flexiblen Canvas-Bereichs.
Interaktives Echtzeit-Feedback	Einholen von "Exit Polls", Live-Quizzes und Stimmungsbildern über die Endgeräte der Schüler.	Serverlösung erforderlich. Nutzung von Cloudflare Workers in Kombination mit Durable Objects und WebSockets für Echtzeit-Datenübertragung.
Cloud-Integration (WebDAV)	Direkter Import von Unterrichtsmaterialien von landeseigenen Schulservern (z.B. IServ, LernSax) auf das Dashboard.	Authentifizierte CORS-Requests an die WebDAV-Schnittstellen der Schulen. Erfordert ggf. Cloudflare Worker als sicheren Proxy.
Digitale Zeichenfläche (Whiteboard)	Direkte Annotationen, Markierungen oder Freihandzeichnungen auf dem Dashboard.	HTML5 Canvas. Für den Einsatz an interaktiven Tafeln muss eine "Palm Rejection" (Handballenerkennung) programmiert werden.

Architektur und Bereitstellung via Cloudflare Pages

Die Entscheidung, die Web-Applikation über Cloudflare Pages bereitzustellen, beeinflusst die technische Architektur fundamental. Cloudflare Pages ist primär für die Auslieferung von statischen Assets und Single Page Applications (SPAs) ausgelegt, die mit Build-Tools wie Vite (React, Vue, Svelte) generiert werden.

Modulare Single-Page-Application (SPA)

Um sicherzustellen, dass die Web-App fortlaufend um neue Features erweitert werden kann, wird eine konsequent modulare Architektur vorausgesetzt. Das Frontend wird als Single-Page-Application (SPA) mit einem modernen Komponenten-Framework (wie React oder Vue) und dem Build-Tool Vite strukturiert. Dies erlaubt es, jedes Feature (Timer, Phasen, QR-Code, Sitzplan, Morning Board) als isoliertes Modul zu entwickeln, das sich nahtlos in das Haupt-Dashboard einfügt.

Deployment, Routing und Performance

Die Bereitstellung erfolgt über eine direkte Integration in ein Git-Repository (z.B. GitHub). Bei jedem "Push" in den Main-Branch triggert Cloudflare automatisch einen Build-Prozess und verteilt die kompilierten Assets (HTML, CSS, JS, Bilder) auf das globale Content Delivery Network (CDN). Auf dem kostenfreien Tarif erlaubt Cloudflare Pages bis zu 500 Builds pro Monat, unbegrenzte Bandbreite und das Hosten von bis zu 20.000 Dateien, wobei jede Datei eine Maximalgröße von 25 Megabyte aufweisen darf.

Für das Routing einer Single Page Application muss die Konfigurationsdatei (wrangler.jsonc oder wrangler.toml) präzise konfiguriert werden. Da clientseitige Router (wie der React Router) Pfade generieren, die nicht physisch auf dem Server existieren, muss das CDN angewiesen werden, bei einem Fehlercode (404) stets die Kernapplikation auszuliefern. Dies geschieht durch das Setzen des Parameters not_found_handling = "single-page-application" in der Konfiguration.
Darüber hinaus optimiert Cloudflare die Auslieferung durch automatische Minifizierung von Code, Brotli-Kompression für textbasierte Assets und optionales Caching von Drittanbieter-Skripten über die Funktion Zaraz, was zu extrem niedrigen Latenzzeiten (unter 50 Millisekunden) und exzellenten Core Web Vitals führt. Dies ist besonders in deutschen Schulen relevant, in denen die Internetbandbreiten häufig defizitär sind.

Local-First Data Storage (Progressive Web App)

Um die Applikation resilient gegen Netzwerkausfälle zu machen und Serverkosten für die Speicherung von Nutzerdaten (wie Dashboard-Layouts) zu vermeiden, muss das System als Local-First-Anwendung konzipiert werden.

Die PWA nutzt hierfür zwei zentrale Browser-Technologien:

1. Cache API via Service Worker: Das grundlegende Gerüst der App (HTML, CSS, JavaScript-Bundles, Icons, Schriften) wird über einen Service Worker im Browser-Cache gespeichert. Eine Cache-First-Strategie sorgt dafür, dass bei einem erneuten Aufruf die Applikation instantan aus dem Cache geladen wird, unabhängig vom Netzwerkstatus. Updates werden im Hintergrund (Stale-While-Revalidate) heruntergeladen und beim nächsten Start angewendet.

2. IndexedDB für strukturierte Daten: Während die veraltete localStorage-API synchron arbeitet, den Main-Thread blockiert und auf 5-10 MB beschränkt ist, bietet die asynchrone IndexedDB eine robuste NoSQL-Datenbank im Browser. Hier werden die Namenslisten der Lehrkräfte, die JSON-strukturierten Layout-Koordinaten der Widgets sowie hochgeladene Hintergrundbilder gespeichert. Zur Abstraktion der komplexen IndexedDB-Aufrufe ist der Einsatz einer Wrapper-Bibliothek wie Dexie.js branchenüblich.

Die Speicherkapazitäten (Quotas) der Browser für die IndexedDB sind für diesen Anwendungsfall mehr als ausreichend. Auf Desktop-Systemen (Chrome, Edge, Firefox) gewähren Browser zwischen 10 % und 80 % des freien Festplattenspeichers als Speicherlimit für eine Herkunft (Origin). Auf mobilen Endgeräten wie dem iPad (iOS Safari), die von Lehrkräften häufig genutzt werden, ist das System restriktiver (historisch oft auf 1 GB oder ca. 60 % der Festplattenkapazität gedeckelt), jedoch für textbasierte JSON-Daten und einige komprimierte Bilddateien absolut unkritisch. Entwickler müssen lediglich QuotaExceededError-Exceptions abfangen und die Nutzer auffordern, alte Daten zu bereinigen, falls die Limits überschritten werden.

Datenschutz und Compliance in der Schule

Der Einsatz von Software in Schulen unterliegt der strengen Aufsicht der jeweiligen Landesdatenschutzbeauftragten. Programme, die personenbezogene Daten (wie Namen, Noten, Verhalten) von Schülern verarbeiten, erfordern in der Regel einen Vertrag zur Auftragsverarbeitung (AVV). Etablierte Marktführer wie Classroomscreen stehen in der Kritik, da sie ohne formelle Verträge operieren, US-amerikanische Infrastruktur (Cloudflare) nutzen, standardmäßig Tracking-Cookies (Google Analytics) implementieren und Daten durch US-Behörden gemäß dem CLOUD Act potenziell abgreifbar sind.

Die vorgeschlagene Architektur auf Cloudflare Pages entschärft diese Problematik durch das Paradigma der Datenvermeidung ("Privacy by Design") radikal. Die gesamte Verarbeitung findet ausschließlich im eigenen Browser statt:

⚬ Vollständige Anonymität der Lehrkraft: Die Nutzung der PWA erfolgt ohne zwingende Registrierung. Die Speicherung der Dashboards und Einstellungen in der lokalen IndexedDB des Endgerätes (Dienst-iPad oder Laptop der Schule) verlagert die datenschutzrechtliche Verantwortung vom Softwareanbieter auf das lokal verwaltete System der Schule.

⚬ Schutz der Schülerdaten: Wenn Lehrkräfte Schülerlisten im System anlegen (für Zufallsgeneratoren, Sitzpläne oder Scoreboards), verlassen diese Namen niemals den Browser. Werden Echtzeit-Features (wie Live-Polls via WebSockets) integriert, sollten diese komplett ohne die Erfassung von IP-Adressen oder Schüler-Klarnamen auskommen (z.B. Nutzung temporärer, anonymer Session-IDs, die nach der Umfrage verworfen werden).

⚬ Audio- und Medien-Datenschutz: Beim Einsatz des Noise Meters (Lautstärke-Ampel) wird das Mikrofonsignal lediglich lokal in Schalldruckpegel umgewandelt. Das Frontend-Design und die Datenschutzerklärung müssen unmissverständlich kommunizieren, dass kein Audio-Streaming an externe Server stattfindet. Ebenso werden QR-Codes lokal auf dem Gerät generiert.

Projektplan und Umsetzung

Um das Projekt effizient und zielgerichtet umzusetzen, erfolgt die Entwicklung schrittweise, beginnend mit einem Minimum Viable Product (MVP) und anschließenden modularen Ausbauphasen.

MVP-Definition

Das MVP ist als rein clientseitige Single-Page-Application (SPA) konzipiert, die als Progressive Web App (PWA) über Cloudflare Pages bereitgestellt wird. Es fokussiert sich auf die Must-have-Features der Kernorchestrierung (Timer, Zufallsgenerator, Phasen-Widget, Lärmpegel-Messer). Die Speicherung von Dashboards und Einstellungen erfolgt aus Datenschutz- und Kostengründen ausschließlich lokal in der IndexedDB des Browsers der Lehrkraft, was die Anwendung offline-fähig macht.

Zentrale User Stories (MVP)

⚬ US 1: Layout-Persistenz & Export. Als Lehrkraft möchte ich, dass mein Dashboard lokal gespeichert wird und ich Konfigurationen als Datei ex- und importieren kann. Akzeptanzkriterien: Automatisches Speichern der Koordinaten in der IndexedDB; JSON-Download/Upload-Funktion.

⚬ US 2: Lärmpegel-Messer (Noise Meter). Als Lehrkraft möchte ich die Lautstärke visualisieren. Akzeptanzkriterien: Lokale Analyse über die Web Audio API ohne Audio-Streaming ins Netzwerk; Deaktivierung der automatischen Verstärkungsregelung im Browser.

⚬ US 3: Multi-Language Support. Als Lehrkraft möchte ich das Dashboard in verschiedenen Sprachen nutzen (DE, EN, FR, ES, NL). Akzeptanzkriterien: UI passt sich automatisch der Systemsprache an; manuelle Umschaltung via Dropdown, deren Auswahl lokal persistiert wird. Text-Strings werden als statische Assets via Cloudflare geladen.

⚬ US 4: Unterrichtsphasen. Als Lehrkraft möchte ich den Verlauf der Stunde visualisieren. Akzeptanzkriterien: Anlage mehrerer benannter Phasen; Hervorhebung der aktuellen Phase per Klick.

⚬ US 5: Bereitstellung & Routing. Als Administrator möchte ich eine performante SPA-Auslieferung. Akzeptanzkriterien: Automatischer Build via Git; SPA-Routing (not_found_handling = "single-page-application") auf Cloudflare Pages.

⚬ US 6: Touch-Ergonomie. Als Lehrkraft möchte ich die App fehlerfrei am interaktiven Display bedienen. Akzeptanzkriterien: Mindestgröße von 44x44 CSS-Pixeln für interaktive Elemente gemäß WCAG.

Meilenstein-Planung

⚬ Phase 1: Setup & Infrastruktur (Woche 1)

	⚬ Initialisierung des modularen Frontend-Frameworks (z.B. Vite mit React/Vue) für den SPA-Betrieb.

	⚬ Einrichtung der Mehrsprachigkeit (i18n) und Git-Integration mit Cloudflare Pages.

⚬ Phase 2: Entwicklung der Core-Widgets (Woche 2-3)

	⚬ Implementierung des Grid-Layout-Systems und Entwicklung der isolierten Widgets (Timer, Text, QR-Code, Phasen, Arbeitssymbole).

⚬ Phase 3: Komplexe Logik & Local Storage (Woche 4-5)

	⚬ Anbindung der IndexedDB zur Speicherung des Grid-Zustands und der JSON-Ex/Import-Funktion.

	⚬ Implementierung des Noise Meters unter Deaktivierung der Browser-Pegelanpassung.

⚬ Phase 4: Testing & MVP-Release (Woche 6)

	⚬ Systemtests auf typischer Schul-Hardware (Windows-Convertibles, iPads, Promethean/ViewSonic Tafeln). Launch des Dashboards über Cloudflare Pages.

⚬ Phase 5: Post-MVP, Klassenraum-Management & Gamification (Woche 7-9)

	⚬ Entwicklung des Sitzplan-Erstellers unter Nutzung bestehender Namenslisten.

	⚬ Aufbau des "Morning Board" Layouts und des lokalen Punkte/Belohnungssystems.

	⚬ Einführung des digitalen "Hall Pass" Trackings.

⚬ Phase 6: Erweiterte Fachdidaktik & Interaktion (Woche 10-12)

	⚬ Integration von interaktiven Mathe-Instrumenten und Sticky Notes für Brainstorming.

	⚬ Konzeption und Anbindung von Cloudflare Workers & WebSockets für Live-Quizzes und Schüler-Feedback.

Strategische Handlungsempfehlungen

Die Marktanalyse bestätigt ein hohes Potenzial für ein webbasiertes Classroom-Management-Dashboard, das sich explizit durch Performance, Kostenfreiheit zentraler Speicherfunktionen und einen konsequenten Local-First-Datenschutz vom Wettbewerb abhebt.

Für die technische und strategische Umsetzung ergeben sich folgende Kernempfehlungen:

1. Fokus auf den PWA-Kern und Modulare Architektur: Die Entwicklung sollte sich im ersten Schritt strikt auf die Single Page Application konzentrieren. Mit React/Vue, Vite und Gridstack.js als technologischem Fundament können die Must-have-Features ressourcenschonend implementiert und via Cloudflare Pages global skaliert werden. Die Möglichkeit, Layouts in der IndexedDB zu sichern und als Datei zu exportieren, ist der entscheidende USP gegenüber der Bezahlversion von Classroomscreen und muss prominent vermarktet werden.

2. Hardware-spezifische Optimierung: Da die Zielumgebung interaktive Displays (Promethean, ViewSonic) und Beamer-Setups umfasst, muss das UI-Design auf großflächige Touch-Ziele (WCAG-Konformität) und kontrastreiche Darstellungen für schlecht abgedunkelte Räume ausgelegt sein. Die Berücksichtigung neurodivergenter Bedürfnisse sowie die integrierte Mehrsprachigkeit demonstrieren pädagogische und internationale Tiefe.

3. Modularer Ausbau: Sobald das statische Fundament etabliert ist, bietet die gewählte SPA-Architektur in Kombination mit dem Cloudflare-Ökosystem eine ideale Basis, um das Dashboard in Phasen systematisch um Gamification-Elemente (Scoreboard), didaktische Werkzeuge (Mathe-Overlays, Sitzpläne) und interaktive Echtzeit-Features zu erweitern, ohne die Basisstruktur anzupassen.




Thoughts
