# Batch 624 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händlerverwaltung: Erfassung und Pflege von Händlerdaten**

Die Händlerverwaltung wurde überarbeitet, damit Benutzer der Market Operation (MO) Händler und Märkte einfacher registrieren und pflegen können. Neben der manuellen Erfassung steht nun auch ein Dateiupload zur Verfügung, und es greifen Validierungen, die Eingaben und Aktualisierungen erleichtern und absichern.

Für die manuelle Registrierung gibt es einen neuen Dialog „Register Dealership". Die Felder erscheinen in der Reihenfolge GSSN-ID, Vega-ID, SAP-Debitorennummer, Name und Stadt. Sobald die GSSN-ID eingegeben wurde, ruft das System die GSSN-/VEGA-Schnittstelle auf und füllt Name und Stadt automatisch vor. Auch die VEGA-ID wird aus dem Markenkürzel der GSSN-Datei übernommen. Der Benutzer muss somit nur die als manuell gekennzeichneten Felder ausfüllen. Bei Märkten ist der Ländercode eine manuelle Eingabe, die ausschließlich aus Ziffern bestehen und genau fünf Zeichen lang sein muss. Existiert die eingegebene GSSN-ID in GSSN nicht, zeigt das System eine Fehlermeldung, dass der Händler bzw. Markt nicht existiert.

Für Eingaben gelten folgende Prüfregeln: Doppelte Einträge sind nicht erlaubt, die GSSN-ID muss eindeutig sein, die SAP-Debitorennummer dagegen darf mehrfach vorkommen. Alle Pflichtfelder müssen befüllt sein. Bei einem Fehler zeigt das System eine konkrete Fehlermeldung zum jeweiligen Prüfverstoß an.

Alternativ lassen sich mehrere Händler gesammelt per Dateiupload anlegen. Dazu lädt der Benutzer eine Liste mit den vorgegebenen Spalten und Zeilen hoch. Das System prüft Dateiformat und Pflichtangaben sowie auf Duplikate, sowohl innerhalb der Datei als auch gegenüber den bereits in der Tabelle vorhandenen Daten. Treten Fehler auf, erhält der Benutzer die Datei als Excel-Datei zurück, in der die Fehler in den betreffenden Zellen bzw. Zeilen mit Hinweisen zur Ursache markiert sind, sodass er sie gezielt korrigieren kann. Gültige Einträge werden erfolgreich verarbeitet. Im Rahmen des Uploads ist zudem ein Virenscan vorgesehen.

Eine leere Excel-Vorlage mit den korrekten Spalten und dem passenden Format kann heruntergeladen werden. Sie entspricht den Anforderungen des Uploads, und für ihre Verwendung gelten dieselben Validierungsregeln.

In einer zweiten Ausbaustufe soll das System aus GSSN stammende Daten interpretieren und in der passenden Form in der Händlerverwaltungstabelle speichern, damit andere Systeme sie bei Bedarf nutzen können.

**Kundenprüfungen auf der MO-Seite**

Die MO-Seite für Kundenprüfungen wurde angepasst. Dieser Prozess gilt bis Anfang des kommenden Jahres. Danach wird oneSCM mit oneERP integriert, und Lastschriftcode sowie SEPA werden automatisch übernommen.

Die SAP-Nummer wurde aus den MO-Prüfungen vollständig entfernt. Die SEPA-Mandatsprüfung zeigt entweder „OK" oder „PENDING" an. Bei „PENDING" verweist die MO-Prüfung per Link auf die Kundendetailseite. Dort muss der MO-Benutzer den Lastschriftcode manuell eintragen und auf „Update" klicken.

Der Lastschriftcode ist eine alphanumerische Zeichenfolge mit maximal 36 Zeichen. Sobald er eingetragen ist, wechselt der SEPA-Status automatisch auf „ACTIVE". Der Code ist pro Kunde eindeutig, derselbe Lastschriftcode darf nicht bei zwei Kunden existieren. Das Feld „FI-System Bank ID" wird vom System anhand der Anzahl der IBANs des Kunden befüllt, die erste IBAN erhält beispielsweise 001, die zweite 0002 und so weiter.

Sobald Lastschriftcode bzw. SAP-Debitor vollständig sind, muss der Vertrag darüber informiert werden. Das System prüft dann erneut und setzt die MO-Prüfungen auf „OK". SEPA und SAP-Lastschriftcode müssen auf der MO-Seite angezeigt werden.

**Anzeige der SAP-Debitorennummer**

Zudem wurde ein Fehler im Frontend behoben: Die SAP-Debitorennummer wird jetzt auf der Detailseite für Geschäftskunden angezeigt.