# Batch 406 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 47 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation**

Im Bereich „Dokumente und Kommunikation" wurden zahlreiche Funktionen rund um den Versand von Dokumenten, interne Benachrichtigungen und Dokumentvorlagen weiterentwickelt und Fehler behoben.

**Erneuter Versand von Dokumenten und manueller E-Mail-Versand**

Dokumente eines Vertrags können über den Reiter „Kommunikation" erneut per E-Mail versendet werden. Im Dialog „E-Mail senden" richtet sich die Funktion „Alle auswählen" nach den jeweils ausgewählten Anhängen. Mindestens ein Anhang ist erforderlich, andernfalls bleibt die Schaltfläche „E-Mail senden" deaktiviert. Das Anhang-Symbol im Anhang-Dialog leitet bei einem Klick nicht weiter. Nach dem erneuten Versand wird die Benachrichtigungstabelle aktualisiert und zeigt die über diese Funktion versendeten E-Mails an. Behoben wurden außerdem die Fehlermeldung bei der Eingabe eines Leerzeichens im E-Mail-Betreff und die fehlerhafte Darstellung des Betreffs der versendeten E-Mail. Ebenso wurde das Problem gelöst, dass Benutzer der Rolle MPC keine E-Mails manuell aus der Vertragserstellung versenden konnten. Weiterhin geplant ist, dass Benutzer (MPC/MO) Dokumente auf Kundenanfrage per E-Mail erneut senden können. Zudem soll geprüft werden, dass der E-Mail-Text den im Template Management definierten Markt-Header und Markt-Footer enthält.

**Vertragsdokumente und Signatur**

Der Link „follow this link" zum Abschluss der Vertragsunterzeichnung bei der Unterschrift vor Ort öffnet sich künftig in einem neuen Browser-Tab statt im selben Tab. Korrigiert wurden mehrere Punkte bei den Dokumenten: Der Entwurfs-Wasserzeichen-Hinweis fehlte im Vertragsentwurf, der vor der Aktivierung im Reiter „Dokumente" angezeigt wird. Das unterschriebene Vertragsdokument fehlte nach der Aktivierung eines Vertrags mit Unterschrift vor Ort im Reiter „Dokumente". Die DSS-Mail erschien nach der Unterzeichnung durch den Kunden nicht in der Benachrichtigung im Reiter „Kommunikation". Ebenso behoben wurden ein Fehler bei der Auswahl der DSS-Option auf der Übersichtsseite sowie die Tatsache, dass DSS bei der Vertragserstellung nicht standardmäßig ausgewählt war. Außerdem wurde das Problem behoben, dass eine Tabelle in einem Dokument verschoben bzw. auf eine andere Seite aufgeteilt wurde.

**Interne Systembenachrichtigungen**

Der Link zur einzelnen Rechnung in der E-Mail führte zuvor auf eine Seite „nicht gefunden"; dies wurde behoben. Die Benachrichtigungen unterscheiden nun zwischen zugewiesenen und nicht zugewiesenen Rechnungen. Wenn mehrere Rechnungen vorliegen und nur einige zugewiesen sind, wird zusätzlich eine eigene Benachrichtigung für die nicht zugewiesenen Rechnungen angezeigt, sodass diese zugewiesen oder bestehende Zuweisungen aufgehoben werden können. Dies gilt für alle Kombinationen aus einer oder mehreren zugewiesenen und nicht zugewiesenen Benachrichtigungen. Aus einer internen CAS-Benachrichtigung kann zudem direkt zur Kundenvorschau gewechselt werden. Geplant ist, dass MO-/MPC-Benutzer eine Aufgabe einem anderen MO-/MPC-Benutzer zuweisen können; die zugewiesene Person soll dabei auch per E-Mail benachrichtigt werden.

**Überarbeitete Kulanzfrist-Benachrichtigung**

Die interne Benachrichtigung zur Kulanzfrist wurde neu gestaltet. Im Test werden unter anderem folgende Punkte geprüft: Benachrichtigungen werden nach sieben Tagen Inaktivität gelöscht, sofern keine Aktion erfolgt ist. Ein Händler kann eine Kampagne anfragen, woraufhin der MPC-Benutzer benachrichtigt wird. Bei einer einzelnen Benachrichtigung kann die Kampagne direkt auf der jeweiligen Vertragsseite genehmigt werden. Werden mehrere Benachrichtigungen angezeigt, wird der MPC-Benutzer zur Vertragsübersicht geleitet und kann dort mehrere Kampagnen annehmen oder ablehnen. Nach Annahme oder Ablehnung erhält der Händler eine Benachrichtigung über die Entscheidung.

**Mastervorlage zur Änderung des Zahlers**

Für aktive Verträge steht eine E-Mail-Mastervorlage zur Verfügung, die Halter und Zahler über eine Änderung des Zahlers informiert. Im Test wird geprüft, dass die Vorlage jeweils für Halter und Zahler als Entwurf angelegt werden kann und die Daten gespeichert bleiben, dass neue Druckvariablen verwendet werden können, dass eine Test-E-Mail versendet und empfangen wird und dass nach einer Änderung am Vertrag sowohl Zahler als auch Halter eine E-Mail erhalten.

**Dokumente in Mercedes me**

Beim Dokumenten-Upload in Mercedes me wurde geprüft, dass das Dokument an Mercedes me gesendet wird, dass der Status von Mercedes me für den Dokumentenempfang in Ordnung ist und dass der Kunde auf seine Dokumente zugreifen kann.

**Vorlagen und Preisinformationen**

Bei der Datenschutzerklärung wurde das Problem behoben, dass keine Vorlage angelegt werden konnte, wenn der Dokumenttyp „Upload" gewählt war. Ebenso wurde die Ansicht des mit dem Editor erstellten Ergebnisses als Upload-Datei angepasst. Die Schaltfläche „Veröffentlichen" ist deaktiviert, wenn kein Produkt ausgewählt ist. In der Preisinformation wurden dynamische Deckungen im PDF korrigiert. Die Vorlagenverwaltung wurde im Rahmen der automatisierten Qualitätssicherung überarbeitet. Geplant sind eine Vorlage und eine E-Mail für die Preisinformation eines ausgewählten Produkts, mit denen MPC-Benutzer Kunden über die Preise informieren können, sowie eine Vorlage für Preisinformationen beim Produktvergleich.