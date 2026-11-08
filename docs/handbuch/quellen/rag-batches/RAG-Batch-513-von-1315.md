# Batch 513 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Optimierung der Vertragsverlängerung im Edge Service**

Die vier Edge-Endpunkte für die Vertragsverlängerung werden technisch überarbeitet. Sie betreffen das Erstellen, Bestätigen und Ablehnen eines Anpassungsangebots für langfristige Verträge sowie die kurzfristige Verlängerung. Für Leasingpartner, die Vertragsverlängerungen anbieten und bestätigen, sowie für die Prolongationsabläufe im OneSCM-Frontend ändert sich nichts an der Nutzung: Aufbau von Anfragen und Antworten, Statuscodes und Endpunktpfade bleiben exakt wie bisher. Verbessert wird ausschließlich der Programmcode hinter den Schnittstellen.

Bislang verwenden diese Endpunkte eine ältere Fehler- und Datumsbehandlung, die zum Rest der Schnittstellen nicht passt. Künftig sollen sie den gemeinsamen Konventionen für Fehler, Datumsangaben und Ausfallsicherheit folgen. Dadurch erhalten Partner ein einheitliches Fehlerformat, unabhängig davon, ob sie einen Vertrag anlegen oder verlängern. Die Verlängerungsfunktionen gelten als stabil und klar abgegrenzt, in der bisherigen Historie gab es nur zwei Fehlerkorrekturen. Das Vorhaben hat die niedrigste Priorität im Edge-Umfang und kann zurückgestellt werden, falls an anderer Stelle Kapazität benötigt wird.

Betroffen sind die Endpunkte POST /contract/v1/create-adaptation-offer, PUT /contract/v1/confirm-adaptation-offer, PUT /contract/v1/reject-adaptation-offer und POST /contract/v1/short-term-extension. Sie werden vom Service für die langfristige und vom Service für die kurzfristige Verlängerung bereitgestellt. Das Vorhaben gilt als abgeschlossen, wenn alle vier Endpunkte von der verbesserten Implementierung bedient werden, Anfrage- und Antwortstrukturen unverändert sind und Fehler sowie Datumsangaben den gemeinsamen Konventionen entsprechen.

Die Qualitätssicherung (AQA) prüft antwortbasiert, da der Edge Service keine eigenen Daten hält: Die verbesserte Implementierung läuft parallel zur bisherigen mit derselben Anfrage, und Antworten, Statuscodes und nachgelagerte Aufrufe werden verglichen. Vertragstests legen jede Anfrage- und Antwortstruktur fest, sodass sich die externe Schnittstelle nicht versehentlich ändern kann.

**Optimierung der Produktsuche im Edge Service**

Auch die fünf Edge-Endpunkte für Produkte werden technisch überarbeitet: die allgemeine Suche in zwei API-Versionen, die Produktdetailabfrage sowie die Suchen speziell für Leasing und Online-Vertrieb. Nutzer sind Online-Vertriebs- und Leasingpartner, die verfügbare Produkte und Preise suchen, sowie die Produktauswahlmasken im OneSCM-Frontend. Die externe Schnittstelle bleibt unverändert: Anfrage- und Antwortstrukturen, Statuscodes und Pfade gelten weiter wie bisher.

Die Produktsuche ist der erste Aufruf eines Partners. Schlägt sie fehl oder liefert unklare Fehler, kann nachgelagert nichts weiterlaufen. In der Vergangenheit gab es fünf Fehlerkorrekturen, unter anderem fehlende Angaben zum betroffenen Feld bei Validierungsfehlern und eine fehlerhafte Behandlung der jährlichen Fahrleistung. Zudem war die Prüfung des Datumsformats hier getrennt vom Rest des Services umgesetzt.

Künftig nutzen die fünf Endpunkte die gemeinsamen Konventionen für Fehler und Datumsangaben. Validierungsfehler benennen jedes ungültige Feld im gemeinsamen Fehlerformat, und die Datumsverarbeitung nutzt die gemeinsame Komponente. Dafür werden der Produktservice (EdgeProductServiceImpl, 372 Zeilen) und die beiden vorgelagerten Prüfer für Datumsformat und Division überarbeitet, wobei die produktspezifische Logik von der Abbildung der Anfragen getrennt wird. Die Umsetzung gilt als gut beherrschbar, da die Endpunkte weitgehend Durchleitungen mit Filterung sind und die Struktur durch die jüngste Aufteilung der Produkt-API aktuell ist.

Betroffen sind die Endpunkte POST /product/v1/search, POST /product/v2/search, POST /product/v1/detailed, POST /product/v1/leasing/searches und POST /product/v1/online-sales/searches. Das Vorhaben ist abgeschlossen, wenn alle fünf von der verbesserten Implementierung bedient werden, die Strukturen unverändert bleiben, Validierungsfehler alle ungültigen Felder im gemeinsamen Format ausweisen und die Datumsverarbeitung die gemeinsame Komponente nutzt.

Die Prüfung erfolgt wie bei den Verlängerungen antwortbasiert durch die AQA mit paralleler Ausführung und Vertragstests. Da Suchantworten sehr groß sein können, soll der Vergleich das Verhalten auch mit realistischen Ergebnismengen bestätigen und nicht nur mit kleinen Stichproben.