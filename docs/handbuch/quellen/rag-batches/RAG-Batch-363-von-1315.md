# Batch 363 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications – Änderungen und Anpassungen**

Bei den gruppierten internen Benachrichtigungen werden künftig sowohl das Startdatum als auch das Enddatum angezeigt. Dabei spiegeln die Angaben jeweils den frühesten Start und das späteste Ende innerhalb der gruppierten Benachrichtigung wider. Das Datumsformat entspricht den bestehenden Systemstandards.

Auch die Oberfläche wurde überarbeitet: Bisher zeigte oneSCM auf der Startseite je nach Benutzerrolle unterschiedliche Hintergrundbilder. Nun wird für alle Rollen, die sich in oneSCM anmelden, ein einheitliches Hintergrundbild verwendet, und zwar für die Bereiche VAN und PC. Der Stern des Mercedes-Benz-Logos wird durchgängig in einer 2D-Version statt des bisherigen 3D-Modells dargestellt und zentriert angezeigt. Das Navigationsmenü in der Kopfzeile und die Fußzeile mit den Meldungen bleiben unverändert. Größe, Position, Ausrichtung und Wortmarke bleiben bestehen. Alle Änderungen entsprechen dem MB Style Guide.

Außerdem wurde die Sprache der Fehlermeldungen angepasst: Wenn alle Aufrufe fehlschlagen, wurde die Fehlermeldung für den Benutzer bisher auf Deutsch angezeigt. Sie erscheint nun auf Englisch.

Im Bereich der Vorlagen wurde das Template für den kommerziellen Vertrag korrigiert, da dort eine schließende geschweifte Klammer „}“ bei der Variable für den Nachnamen des Kontakts fehlte. Zudem wurde die Frontend-Anpassung zu den Verwendungszwecken der Massenanlage (Mass Creation) abgeschlossen.

**Nicht umgesetzte Vorhaben**

Folgende Vorhaben wurden abgebrochen und sind daher nicht Bestandteil des Release:

Die automatische E-Mail-Benachrichtigung bei fehlgeschlagenen oder abgebrochenen Batchjobs wurde nicht umgesetzt. Geplant war, das 2nd-Level-Support-Team (NPM) per E-Mail zu informieren, sobald ein Batchjob in oneSCM fehlschlägt oder abbricht. Die Fehlererkennung sollte durch das Batch Framework erfolgen und den Benachrichtigungsdienst auslösen. Vorgesehen waren alle Batch-Arten in allen Märkten (u. a. Deutschland, Indien und die Slowakei) sowie konfigurierbare Empfänger. Die E-Mail sollte Batchname, Markt, Zeitpunkt des Fehlers und Ausführungsdauer enthalten. Daher gilt weiterhin: Fehlgeschlagene oder abgebrochene Batches erscheinen mit Admin-Zugriff im Bereich „Batches“, und es erfolgt keine automatische E-Mail-Benachrichtigung. Die Überwachung muss somit weiterhin manuell erfolgen.

Ebenfalls nicht umgesetzt wurde die Korrektur, bei der in der Aktivierungs-E-Mail die Druckvariable für den Nachnamen des Kontakts anstelle des tatsächlichen Wertes angezeigt wurde. Darüber hinaus wurde die Frontend-Anpassung zum Entfernen der Funktion „Dokumente anhängen“ aus dem Zahlungsplan-Setup von Verträgen abgebrochen. Die Funktion bleibt somit unverändert erhalten.