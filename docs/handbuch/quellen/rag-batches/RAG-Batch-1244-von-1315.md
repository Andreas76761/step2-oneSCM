# Batch 1244 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Änderungen und Weiterentwicklungen**

**Abgeschlossene Änderung: Regel für die 4-Augen-Freigabe**
Für die 4-Augen-Freigabe gilt nun eine Regel zum Startdatum: Liegt das Freigabedatum vor dem vom Benutzer gewünschten Startdatum, wird das gewünschte Startdatum übernommen. Wählt der Benutzer beispielsweise den 27.02.2026 als Startdatum und erfolgt die Freigabe durch MPC 2 bereits am 25.02.2026, gilt weiterhin der 27.02.2026. Existieren mehrere Entwürfe, etwa Entwurf 2 und Entwurf 3, darf der neueste Entwurf nicht eingereicht werden. Die Schaltfläche zum Einreichen ist dann deaktiviert, und ein Tooltip erläutert den Grund. Eingereicht werden darf ausschließlich der älteste Entwurf.

**Geschlossen: Preise in der Vergangenheit**
Das Produkt muss die Preise zum Zeitpunkt der Vertragserstellung (Datum und Uhrzeit) übermitteln. Hat ein Produkt mehrere Versionen, ist die Version zu senden, die bei der Erstellung des Vertrags gültig war.

**Geplante Weiterentwicklungen (offen)**
Bei der Vertragsgenerierung soll künftig die Modellbezeichnung des Fahrzeugs aus dem Fahrzeugauftrag (AFAB und GO) zurückgegeben werden.

Außerdem soll die Quelle der Kilometerstände samt Datum und Zeitstempel an die Generierung übermittelt werden. Bisher wird die Quelle weder bei der erstmaligen Generierung eines Angebots noch bei der Produktprüfung von der MO-Seite gesendet. Künftig sollen bei der initialen Generierung und bei der Validierung bzw. Produktprüfung von der MO-Seite die Quelle, aus der der Kilometerstand stammt, sowie Datum und Zeitstempel mitgeliefert werden, ähnlich der Kilometerstandshistorie. Ergänzend sollen Kilometerstände aus Vega-Claims alle zwei Wochen abgerufen und an die Generierung in der Tabelle für Fahrzeugkilometerstände übergeben werden.

Stammen Daten aus DSB, sollen in der Antwort an die Generierung zusätzlich der Servicetyp und die Vega-Claim-Nummer enthalten sein. Die Produktverwaltung prüft dabei den Servicetyp: Ist der Servicetyp 12 (Servicevertrag) und die Einstellung „Fahrzeuge zulassen, die ihren ersten Service erreicht haben“ nicht aktiviert, wird der Fehler E3 mit dem Text „Vehicle has a recorded service in DSB.“ angezeigt. Ist die Einstellung aktiviert oder handelt es sich um einen anderen Servicetyp, gilt das Fahrzeug als geeignet. Kilometerstände und Claims mit Servicetyp werden an die Generierung gesendet, die entscheidet, ob ein Vertrag gekündigt werden kann. Eine Kündigung ist nur bei bestimmten Servicetypen ausgeschlossen, im Praxisfall bei Servicetyp 12. Dafür wird der Job SyncServiceHistoryOnVehicles erweitert, damit er Claim-Informationen synchronisiert, die hasClaim-Schnittstelle liefert auch den Servicetyp zurück, und dieser wird in der Datenbank gespeichert. Die bekannten Servicetypen reichen von 00 (Aktionierung) bis 15 (MBV), darunter Mobility, KDM, Warranty, Parts w., OTC, Spec. w., ISP, POW, Lemon, DSA, KULA, Service Contract, Other goods und Fleetsite.

Weitere offene Themen betreffen die Kostenstelle für Management-Verträge, die Kostenaufschlüsselung in der PV-Übersicht sowie die Logik und Tabellenerweiterung der Preismatrix. Ein fehlgeschlagener Fahrzeug-Batchjob in der Produktivumgebung, der auf einen doppelten Schlüssel beim Speichern hinweist, ist ebenfalls offen.

**Im Entwicklungs-Backlog**
In der Produktverwaltung fehlt derzeit ein Tooltip für künftige Entwurfspreisversionen. Dieser soll ergänzt werden.

**Nicht weiterverfolgt**
Die Definition eines Produkt-Blueprints für das Produkt „Excellent“ sowie die Optimierung der Blueprint-Logik und Änderungen an der Produktversion wurden eingestellt und sind nicht Teil des aktuellen Funktionsumfangs.