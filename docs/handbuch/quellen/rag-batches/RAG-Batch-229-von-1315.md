# Batch 229 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 35 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Neuerungen und Korrekturen**

Im Bereich Revenue Management wurden zahlreiche Fehler behoben und Anpassungen vorgenommen, die die Rechnungserstellung, die Verwaltung von Steuern und Werkstattrechnungen sowie die Bedienung der Oberfläche betreffen.

**Rechnungserstellung und Exportdateien**

Mehrere Probleme bei der Erzeugung von Rechnungen wurden gelöst. Kunden- und Händlerrechnungen werden wieder wie vorgesehen generiert. Das gilt auch für Rechnungen mit Händlerrabatt und mit Kampagnenrabatt. Wird bei der Vertragserstellung ein Händlerrabatt angewendet, entstehen keine doppelten Rechnungen mehr. Außerdem erscheint eine Rechnung nun unmittelbar, wenn das Zahlungsintervall von „monatlich“ auf „einmalig“ geändert wird. Der Batch-Job CampInvE174, der zuvor fehlschlug und keine Dateien erzeugte, läuft wieder fehlerfrei.

Für den Export wird nun je Exporttyp eine eigene E169-Datei erzeugt. Der Exporttyp ist Bestandteil des Dateinamens, zum Beispiel SG, EXSUB oder IF. Zusätzlich sollen die neuen Typen FEA und EXTSER berücksichtigt werden. Die Berechnungsformel für den Kontostand wurde angepasst und berücksichtigt nun auch Provisionen. Fehlende Zuordnungen bei der Händlerprovision wurden ergänzt.

**Werkstattrechnungen**

Beim Anlegen einer neuen Werkstattrechnung werden die Code-Abdeckungen nun korrekt abgerufen. Die Felder für Werkstattname und SAP-Daten werden nicht mehr geleert, wenn man in das Feld für die Vega-ID klickt. Im Pop-up zum Erstellen einer Rechnungsposition funktionieren die Schaltflächen „Erstellen“, „Abbrechen“ und „Schließen“ wieder.

**Zahlungsplan und Vertragsprüfung**

Im Zahlungsplan wurden technische Details entfernt, die dort nicht angezeigt werden sollten. Die Bezeichnung „Periodically Payment“ für Kundenzahlungspläne war sprachlich nicht korrekt und wurde in „Periodic Financial Document“ geändert. In der Vertragsprüfung werden Beträge bei Gutschriften nicht mehr mit einem Minuszeichen dargestellt.

**Zugriff und Berechtigungen**

Der Bereich Financial Control ist wieder erreichbar, ein zuvor auftretender Serverfehler (503) beim Aufruf wurde behoben. Der ADMIN-Benutzer hat nun Zugriff auf den Bereich Batch Jobs, und die Daten in den Steuer-Registerkarten der Steuerverwaltung werden auch für ADMIN-Benutzer geladen.

**Schnittstellen zu Nemesis**

Für die Nemesis-Ereignisse wurden Anpassungen vorgenommen. Der Schlüssel der Nemesis-Session-ID wird nun je nach Umgebung für die Anwendungen Customer, Contract, Cost und Revenue angepasst. Für Revenue-Ereignisse sind folgende Änderungen vorgesehen: Die Zguid soll mit führenden Nullen auf insgesamt 30 Stellen geliefert werden. Der Ländercode soll für Deutschland als 20000 statt als DE übermittelt werden. Die FISystemInvoiceNumber soll die Rechnungsnummer aus dem FI-System enthalten, durch die das Ereignis entstanden ist. Beginn und Ende der Zahlung sollen sich aus dem Rechnungszeitraum der ersten bzw. letzten Rechnung des Zahlungsplans ergeben; diese beiden Punkte werden von BRABUS umgesetzt. Zudem ignorieren die Kafka-Listener nun unbekannte Felder.

**Oberflächenanpassungen**

Die Oberfläche wurde im Rahmen der Caffeine-Anpassungen überarbeitet. In der Steuerverwaltungstabelle werden die Werte der Spalte „Name“ nicht mehr als Hyperlinks dargestellt, da sie keine Verlinkung enthalten; die Textfarbe wurde von #008DFC auf #333333 geändert. In der Tabelle der internationalen Werkstattrechnungen wird die einzige verfügbare Aktion, „Löschen“, nun direkt als Hauptaktion angezeigt und nicht mehr unter dem Symbol „…“ gruppiert.

**Hinweis**

Der manuelle Testlauf für Cost Management (E167 Werkstattrechnungen) ist noch offen.