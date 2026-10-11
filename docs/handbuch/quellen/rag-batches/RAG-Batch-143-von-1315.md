# Batch 143 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen und Korrekturen**

**Globale Batch-Jobs**
Batch-Jobs, die eine Sonderrolle haben und für alle Märkte gelten, werden nun nicht mehr pro Markt dupliziert, sondern mit dem Markt „Global" geführt. Dazu gehören die Jobs für die Elasticsearch-Synchronisation, zum Beispiel für Kunden, gewerbliche Kunden, Verträge, Sonderfälle, Kosten, Erlöse, Fahrzeugdaten und Fahrzeugaufträge, die Synchronisation der Händlerdaten mit GSSN-Daten sowie der Dokumentenmetadaten. Ebenfalls global geführt werden marktunabhängige Jobs wie der CeproImport, die Daten für alle Märkte aktualisieren, unabhängig davon, aus welchem Markt sie gestartet werden. Globale Batch-Jobs werden in allen Märkten angezeigt. Wenn Sie beispielsweise nach allen Batch-Jobs für den Markt SK suchen, sehen Sie sowohl alle globalen Jobs als auch alle Jobs, die speziell dem Markt SK zugeordnet sind.

**Anpassungen für den slowakischen Markt**
Seiten, die für den slowakischen Markt nicht relevant sind, wurden ausgeblendet. Die Materialnummernverwaltung im Bereich Admin ist nur noch für oneERP-Märkte sichtbar. Die Seiten „Old Part Taxes/I156" sowie „Old Part Taxes – Manual" unter Finanzverwaltung > Finanzkontrolle werden nur noch für den Markt DE angezeigt. Ebenso wurde die Funktion zum Erstellen oder Bearbeiten von Werkstattrechnungen im Reiter „Zahlung" eines Vertrags für den slowakischen Markt entfernt.

**Korrekturen bei Rechnungen und Dateien**
Bei Kundenrechnungen wurde ein falscher Mehrwertsteuerwert korrigiert. Die für alte Teilesteuern erzeugte E169-Datei für PTXT01 enthielt zusätzliche Leerzeichen; dies wurde behoben. Außerdem wurde in der E169-Datei für HTXT02 die E-Mail-Adresse angepasst, da sich die bisherige Adresse geändert hatte.

**Stabilität und Verhalten von Batch-Jobs und Verträgen**
Mehrere Fehler im Zusammenhang mit Batch-Jobs und Vertragsprozessen wurden behoben. Der Timer eines Batch-Jobs startete beim Auslösen bei 30 Minuten statt in Echtzeit-Sekunden. Der I155-Job im Vertragsmanagement lief über mehrere Stunden. Der DocumentSignatureStatusJob zeigte den Fehler „jobName is not present" an. Ein Vertrag blieb gesperrt, obwohl alle Rechnungen den Status „bezahlt überfällig" hatten. Zudem mussten Ereignisse erneut ausgelöst werden, weil Zahlungsdauer-Daten fehlten.

**Weitere Prüfungen**
Derzeit in Prüfung befindet sich ein Testfall, der den Ablauf von Vertragserstellung und -aktivierung verifiziert, einschließlich erfolgreicher Zahlungsplan-Erstellung, MPPI-Statuswechsel und Rechnungserstellung. Offen ist noch die Anforderung, dass die Vertragsaktivierung erfolgreich ist, wenn die Zahlungsplan-API den Statuscode 200 zurückgibt.