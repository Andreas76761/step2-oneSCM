# Batch 205 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Neuerungen und Korrekturen**

**Kopftext für manuell erstellte Rechnungen**

Mitarbeitende der Marktorganisation (MO) und alle Benutzer mit der Berechtigung, Rechnungen manuell anzulegen, können in oneSCM nun bei der Erstellung einen Kopftext (Header Text) erfassen. Bisher ließ sich Text nur auf Ebene der Rechnungsposition hinzufügen. Der Kopftext wird an das Finanzsystem (FI) übermittelt und kann dort auf dem Abrechnungsbeleg gedruckt werden.

Das Feld „Header Text“ steht bei fünf Rechnungsarten zur Verfügung: bei manuellen Rechnungen vom Typ MANU, bei manuell erstellten Händlerrabatten (Typ DD), bei manuell erstellten Händlerprovisionen (Typ SCOM), bei manuell aus dem Admin-Bereich erstellten internationalen Werkstattrechnungen sowie bei Erstattungsrechnungen für Werkstattrechnungen an den Kunden. Für alle Rechnungsarten gelten dieselben Regeln: Die Eingabe ist optional, auf 230 Zeichen begrenzt und unterliegt keiner Zeichenbeschränkung, es sind also alle Zeichenarten zulässig.

Der erfasste Text wird in die Ausgangsdatei an SWT übernommen, und zwar im H-Satz ab Position 66 bis 305. Zusätzlich wird er in der E169-Rechnungsdatei an oneERP im Satz HTXT01 als neue HTXT01-Zeile ausgegeben. Dies gilt jeweils für die genannten Rechnungsarten, etwa für extern manuell erstellte Händlerrabatte und Händlerprovisionen sowie für internationale Werkstattrechnungen und Erstattungsrechnungen.

**Dateiformate und Schnittstellen**

Die Dateistrukturen für den Rechnungsaustausch mit COFICO wurden bearbeitet, sowohl für die eingehenden Rechnungsdateien von COFICO als auch für die ausgehenden Dateien an COFICO. Außerdem können Rechnungsrückmeldungen von SWT nun in oneSCM importiert werden.

Bei der E169-Datei wurde der Text im Feld HTXT06 angepasst: Die neue Signaturangabe gilt nur für Gutschriften, bei Rechnungen bleiben die Felder für die linke und die rechte Unterschrift leer. Als Namen für die Unterschrift sind „gez. i.V. Florian Küchenthal“ und „gez. i.V. Patricia Fernando“ vorgesehen. Darüber hinaus wurden die Materialnummern für die Erzeugung der Dateien E174, E167 und E169 aktualisiert.

**Fehlerbehebungen**

Bei der Erzeugung von Händlerprovisionsrechnungen wird die Produktlinie nun korrekt erfasst. Die Reihenfolge der Buchungsschlüssel in der Datei E167 für oneERP war fehlerhaft und wurde korrigiert. Aufträge vom Typ MB werden nun an E169 NACOS und oneERP exportiert, was zuvor nicht geschah. Zudem wurde die Erzeugung der oneSCM-Rechnungsnummern korrigiert, und das Problem, dass sich E169-Dateien auf der INT-Umgebung nicht importieren ließen, wurde behoben.

**Qualitätssicherung**

Für die automatische Prüfung von Dateien wurde eine Kernlösung bereitgestellt.