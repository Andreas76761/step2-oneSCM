# Batch 761 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management: Neuerungen und Korrekturen**

**Anzeige des Finanzsystems in den Markteinstellungen**

In den Markteinstellungen wird künftig das Finanzsystem des jeweiligen Marktes angezeigt. Bisher war es je Markt fest im System hinterlegt: oneERP für DE, CoFiCo für SK und SWT für IN. Diese Festverdrahtung entfällt. Bei der erstmaligen Konfiguration eines Marktes muss nun verpflichtend genau eines der Finanzsysteme oneERP, SWT oder CoFiCo ausgewählt werden. Die Auswahl wird in der Datenbank gespeichert. Sie finden das Feld „Financial System“ für beide Divisionen unter Market Setting → Market config → External System setting → FI Configuration. Das Feld kann in der Oberfläche nicht bearbeitet werden. Welche weiteren Felder verfügbar sind, hängt vom gewählten Finanzsystem ab: Die bisherigen Felder aus PC/VAN werden nur bei CoFiCo oder SWT angezeigt, bei oneERP wird keines dieser Felder dargestellt.

**DSS-Link in der Vertragsverwaltung erneut senden**

In der Detailansicht eines Vertrags lassen sich unter dem Reiter „Communication“ im Bereich „Emails“ nun DSS-bezogene E-Mails einsehen, drucken und erneut versenden. Das dient als Rückfalllösung, falls Kundinnen oder Kunden die E-Mail nicht erhalten haben oder die Kontaktdaten angepasst werden müssen. Die Funktion steht Nutzern mit der Rolle MO/MPC zur Verfügung und setzt einen aktivierten Vertrag voraus, dem Kundeninformationen mit E-Mail-Adresse und Telefonnummer zugeordnet sind.

Unterstützt werden zwei E-Mail-Typen: die „Long Term Extension DSS Email“ und die „Proposal DSS Email“. Letztere trägt den neuen Namen für die bisherige „DSS Email“, die im Rahmen der Vertragserstellung versendet wurde und früher nur dort verfügbar war.

Beim erneuten Versand öffnet sich ein Fenster mit Vorname, Nachname und Telefonnummer (vorausgefüllt, nicht bearbeitbar) sowie der E-Mail-Adresse (vorausgefüllt, bearbeitbar). Mit „Send Email“ wird ein bestehender DSS-Umschlag (Envelope) storniert und ein neuer erzeugt und versendet, wobei stets die aktuellste E-Mail-Adresse und Telefonnummer verwendet werden. Mit „Cancel“ schließen Sie das Fenster und kehren zur Übersicht der E-Mails zurück. Wird ein DSS-Umschlag gerade zur Unterschrift bereitgehalten und werden die Kontaktdaten zwischenzeitlich geändert, storniert der erneute Versand den bestehenden Umschlag und erstellt einen neuen mit den aktualisierten Daten. Beim Drucken ruft das System die zum Umschlag gehörenden Dokumente ab, zeigt sie in druckbarer Form an und ermöglicht den Ausdruck.

Änderungen an Kontaktdaten im Kundenprofil werden an den Contract-Microservice weitergegeben. Frühere Versionen der Kontaktdaten werden zu Prüfzwecken in der Datenbank gespeichert, sind in der Oberfläche aber nicht sichtbar.

**Weitere Verbesserungen in der Vertragsübersicht und Kommunikation**

Die Übersichtstabelle der Vertragsverwaltung enthält jetzt eine zusätzliche Spalte sowie einen Filter für das Aktivierungsdatum. Im Reiter „Communication“ wurde zudem das Problem behoben, dass beim Hochladen von Dokumenten die Namen der Platzhalter fehlten. Außerdem setzt die Reset-Schaltfläche nach der Suche nach einem Vertrag in MO checks, Proposal Management und Contract Management nun auch die Referenznummer zurück.

**Behobene Fehler**

Korrigiert wurden mehrere Fehler in der Vertragsverwaltung: Bei einer vorzeitigen Abrechnung (Early Settlement) wurden fehlerhafte Werte an das Revenue-System übermittelt. Nach einer ersten Verlängerung konnte keine weitere Verlängerung durchgeführt werden. Bei Verträgen, die aus einem Einmal-Intervall (One Time) verlängert wurden, waren die Preise nicht korrekt. Außerdem funktionierte die Aktualisierung von Zeiten und Erinnerungen in den Markteinstellungen nicht.