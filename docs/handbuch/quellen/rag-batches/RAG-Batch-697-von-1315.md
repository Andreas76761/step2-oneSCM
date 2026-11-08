# Batch 697 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenmanagement: Neuerungen bei Rechnungen**

In allen Rechnungen wurde die Bezeichnung des Feldes „Comments“ in „Internal Comments“ geändert. Damit ist nun auf allen Rechnungen eindeutig erkennbar, dass es sich um interne Kommentare handelt.

Für Kontingentverträge steht außerdem eine neue Kontingentverwaltung bei der manuellen Werkstattrechnung zur Verfügung. Sie verhindert, dass bei der Erstellung von manuellen Werkstattrechnungen (WSIN), SIVECO-Rechnungen oder Kundenerstattungsrechnungen mehr Kontingent verbraucht wird, als im Vertrag vorhanden ist. Bisher gab es bei der Erstellung dieser Rechnungen keine Möglichkeit, verwendetes und verfügbares Kontingent nachzuverfolgen. Dadurch bestand das Risiko ungültiger Kontingentnutzungen und eines späteren Korrekturaufwands.

Unter den Schadenscodes gibt es dafür eine eigene Kontingenttabelle (zu finden unter VEGA Codes, Schadenscodes, Kontingenttabelle). Sie enthält ausschließlich kontingentrelevante Schadenscodes mit dem jeweiligen Schadenstyp sowie einem Feld für die Anzahl der Nutzungen, die eine Kombination verbraucht. Zusätzlich gibt es eine Spalte mit Aktionen. Administratoren können in dieser Tabelle Zeilen hinzufügen und löschen. Ein neuer Schadenscode wird über die Schaltfläche „Create Damage code“ hinzugefügt. Gespeicherte Änderungen gelten sofort, aber nur für Rechnungen, die danach erstellt werden. Bereits erstellte Rechnungen bleiben unverändert.

Bei der Rechnungserstellung wählt der Sachbearbeiter (MO) im Vertrag eine der drei Rechnungsarten aus und erfasst die Angaben auf Kopfebene. Anschließend fügt er Rechnungspositionen hinzu und wählt jeweils eine Kombination aus Schadenscode, Schadenstyp und Deckungscode. Ist diese Kombination in der Kontingenttabelle hinterlegt, wird die Kontingentlogik aktiviert. Es erscheint das Fenster „Contingent Counter Impact“ mit drei Angaben: den im Vertrag enthaltenen Nutzungen (Included), den bereits verbrauchten Nutzungen (Used) und den durch diese Rechnung verbrauchten Nutzungen (To Be Consumed). Letztere werden als Hinweis angezeigt: „1 contingent will be automatically deducted.“ Stehen genügend Nutzungen zur Verfügung, kann die Rechnungsposition erfolgreich angelegt werden.

Ein Beispiel: Sind 4 Nutzungen enthalten und 2 bereits verbraucht, stehen noch 2 zur Verfügung. Wird nun 1 Nutzung hinzugefügt, läuft die Erstellung ohne Fehler durch.

Reicht das Kontingent nicht aus, wird die Rechnungsposition blockiert. Sind etwa 4 Nutzungen enthalten und 3 verbraucht, ist nur noch 1 Nutzung verfügbar. Wird versucht, 2 Nutzungen hinzuzufügen, erscheint die Fehlermeldung „The Number of contingents for this damage code exceeds the number available for this contract.“

Die Prüfung gilt auch über mehrere Positionen hinweg. Sind 4 Nutzungen enthalten und 2 verbraucht, stehen 2 zur Verfügung. Werden in der ersten Position 2 Nutzungen und in der zweiten Position 1 weitere Nutzung erfasst, ergibt das insgesamt 3 Nutzungen und überschreitet das verfügbare Kontingent. Das System blockiert dann die Erstellung der Werkstattrechnung und zeigt dieselbe Fehlermeldung an.

Bei einer Stornierung (Reversal) einer Rechnung ist das Vertragsmanagement zu benachrichtigen. Handelt es sich beim Dokumenttyp um eine Gutschrift, soll das Vertragsmanagement den verbrauchten Kontingentzähler im Vertrag wieder erhöhen.