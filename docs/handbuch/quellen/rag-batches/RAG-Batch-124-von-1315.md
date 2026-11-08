# Batch 124 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Im Bereich Revenue Management wurden mehrere Themen bearbeitet, die sich vor allem auf die Abrechnung, die Übermittlung von Ereignissen an Nachbarsysteme und die Marktkonfiguration beziehen.

Abgeschlossen sind zwei Korrekturen. Zum einen lässt sich eine gutschriftsähnliche Belegerstellung, die durch das Stornieren eines Vertrags entsteht, nun akzeptieren: Die gemeldete gutschriftbezogene Einschränkung, bei der eine durch Vertragsstornierung erzeugte Gutschrift nicht akzeptiert werden konnte, ist behoben. Zum anderen können Änderungen in der Marktkonfiguration von Nemesis wieder gespeichert werden, auch wenn der Produktname sehr lang ist. Diese Einschränkung wurde im Backend behoben.

Geschlossen wurden außerdem drei Themen. Dazu gehört das Problem, dass beim Senden von Vertrags-Revenue-Ereignissen an Nemesis der Aufruf des Config Service zufällig mit dem Fehler 401 fehlschlug. Ebenfalls geschlossen wurden das erneute Auslösen (Retrigger) von Revenue- und Contract-Ereignissen in Nemesis sowie die Bereinigung von CAMP-Rechnungen für die Märkte Slowakei und Deutschland in CoFiCo und oneERP.

Mehrere gemeldete Probleme wurden nicht weiterverfolgt und haben den Status „Cancelled“. Sie betreffen folgende Punkte: einen Unterschied zwischen dem an SWT übermittelten Steuersatz und dem auf der Rechnung verwendeten Steuersatz, die Nichtannahme einer erstellten WSIN bei bereits genutzten Kontingentleistungen, den fehlenden Export von MANU und MPPI über e169, einen Fehler bei der Vertragserstellung im Schritt „Payment Plan“ sowie eine fehlende Referenznummer in der CCIN. Auch das Vorhaben zur Verlängerung (Prolongation) von Sonderfallverträgen im Revenue-Bereich wurde abgebrochen. Für dieses Vorhaben liegt lediglich eine nicht ausgefüllte Vorlage ohne inhaltliche Angaben vor.

Offen ist derzeit das Vorhaben zur Einrichtung des Marktes Malaysia im Revenue Management. Auch hierzu sind noch keine inhaltlichen Details wie Zielzustand, Anwendergruppen oder Akzeptanzkriterien dokumentiert.