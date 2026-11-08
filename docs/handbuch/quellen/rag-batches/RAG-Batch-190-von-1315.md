# Batch 190 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Release-Hinweise**

**Nicht umgesetzte Vorhaben**

Mehrere geplante Erweiterungen im Bereich Revenue Management wurden abgebrochen und sind daher in dieser Version nicht enthalten.

Dies betrifft zunächst die Abwicklung von Zahlungen über den Zahlungsdienstleister MPay bei langfristigen Vertragsverlängerungen. Geplant war, dass oneSCM Zahlungen per Karte, UPI oder Netbanking verarbeiten kann, wenn Kunden einen Vertrag langfristig verlängern möchten. Diese Funktion steht nicht zur Verfügung.

Ebenfalls abgebrochen wurde eine Financial-Control-Seite für SWT. Sie sollte Benutzern aus den Bereichen MPC und Market Operations helfen, vor dem nächsten Export zu erkennen, wie viele Rechnungen je Schnittstelle an SWT übermittelt werden und ob die Exportdatei alle exportfähigen Rechnungen enthält. Vorgesehen waren im Admin-Bereich auf der Seite „Financial Control“ zwei neue Reiter: „SWT Checks“, um die Summe der an SWT gesendeten Rechnungen mit der Summe in der Rückmeldedatei abzugleichen, sowie „Export Counter / Checks“ mit Suchkriterien und Ergebnisliste. Diese Reiter sind nicht verfügbar.

Nicht realisiert wurde außerdem der Export eines Standard-HSN-Codes für den regulären GST-Satz an SWT. Vorgesehen war, bei einem GST-Satz von 18 % auf einen Servicevertrag den bestätigten HSN-Code 998714 zu übermitteln. Dafür hätte der Datentyp des Feldes anwendungsweit auf alphanumerisch umgestellt und die Länge auf sechs Stellen angepasst werden sollen. Zudem sollte beim Export an das FI-System stets der Wert aus der Steuersatztabelle in den Markteinstellungen verwendet werden. Auch diese Änderung ist nicht enthalten.

Gleiches gilt für die Ermittlung von Steuersätzen und HSN-Codes bei Paketverkäufen. Hintergrund sind die indischen GST-Vorschriften: Wird ein Vertrag eigenständig verkauft, also nicht am selben Tag wie das Fahrzeug, gilt ein GST-Satz von 18 %. Wird er am selben Tag zusammen mit dem Fahrzeug verkauft, gilt der Satz des Fahrzeugs (45 %, 48 % oder 50 %, je nach Konfiguration und weiteren Parametern). Geplant war, den HSN-Code des Fahrzeugs anhand der Fahrzeugkennung aus VX zu beziehen und an SWT zu senden. Wie sich der auf das Fahrzeug angewendete Steuersatz ermitteln lässt, war noch offen. Die Funktion wurde nicht umgesetzt.

Schließlich wurde auch die Übermittlung von Provisionsinformationen an SWT/CofiCo abgebrochen. Bisher wird die Provisionsrechnung als Gutschrift erzeugt und zur Auszahlung an den Händler an SWT gesendet. Das entspricht nicht den indischen GST-Vorschriften, da eine eigenständige Gutschrift keinen Vorgang auslösen darf. Geplant war, die ausgehende Schnittstelle um einen zusätzlichen Rechnungstyp für Provisionen zu erweitern, mit Anpassungen im Kopfsatz der Rechnung bzw. Gutschrift. Diese Erweiterung ist nicht enthalten, die Schnittstelle bleibt unverändert.

**Weitere Änderungen**

Im Bereich Revenue Management wurde ein Fehler behoben: Die Sortierung der Spalten „Amount Old Part Tax Base“ und „Amount Old Part Tax“ funktioniert nun.

Zwei weitere Punkte, die Anpassung des Gültigkeitsbeginns in der Materialverwaltung auf den 01.01.2025 und die Ergänzung der Umgebungseinstellung „one-scm.enviroment“ in der Konfigurationsdatei application.yaml, wurden geschlossen. Für Anwender ergeben sich daraus keine Hinweise.