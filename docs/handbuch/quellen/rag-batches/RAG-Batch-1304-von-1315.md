# Batch 1304 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 19 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und Plattform**

Im Bereich Architektur wurden mehrere technische Verbesserungen an der Grundlage des Systems umgesetzt. Die Spring-Boot-Bibliothek wurde auf Version 3.4.3 aktualisiert. Außerdem wurden die C4-Architekturdiagramme überarbeitet, damit sie die aktuellen Systemstrukturen abbilden.

Für die Qualitätssicherung wurde ein neuer Prüfschritt für Vertrags-PDF-Dateien eingeführt. Dabei wird der Anhang heruntergeladen, und anschließend werden die Vertragsdetails sowie der Zahlungsplan validiert. Zusätzlich wurden die Architekturthemen des Programminkrements PI11 abgeschlossen.

**Weitere Architekturthemen**

Mehrere Themen wurden betrachtet, aber geschlossen und nicht umgesetzt. Dazu gehören ein globaler Wiederholungsmechanismus für REST-Aufrufe zwischen Services, die Verringerung von Aufrufen an andere Services (insbesondere an den Vertragsservice), indem bereits vorhandene Daten genutzt werden, sowie die Verlagerung nicht umgebungsspezifischer Konfigurationen aus dem AWS Secrets Manager in die Datei application.yml. Ebenfalls geschlossen wurden eine automatische Versionierung von OpenSearch-Indizes samt Aliasen bei Mapping-Änderungen, Anpassungen des Batch-Job-Frameworks für mehrere Märkte und die Umstellung der API von „New Market“ auf „Market ID“. Die Verschiebung der Steuerkonfiguration auf Marktebene wurde abgebrochen.

**Rollen und Benachrichtigungen**

Ein Vorschlag sah vor, die beiden bisherigen Rollen Admin und HQ PM zu einer Rolle namens „HQ Admin“ zusammenzuführen. Dazu sollten alle Berechtigungen beider Rollen in einer Rolle gebündelt, diese umbenannt und die andere Rolle gelöscht oder deaktiviert werden. Dieses Thema wurde geschlossen. Ebenfalls geschlossen wurde das Vorhaben, einen neuen Typ interner Benachrichtigung für Werkstattrechnungen hinzuzufügen.

**Behobene Fehler**

Behoben wurde ein Problem im Konfigurationsservice, durch das angeschlossene Händler (Affiliated Dealer) in den Umgebungen DEV, INT und PrePROD keinen Zugriff auf das System hatten. Außerdem wurde eine Konsolenfehlermeldung in den Markteinstellungen im Bereich „Dokumente“ beseitigt. Weitere Korrekturen betreffen einen Fall, in dem ein Job eine Ausnahme auslöste, der Status aber weiterhin „Gestartet“ anzeigte, sowie ein Problem beim Anlegen identischer Produktlimits in einem End-to-End-Test, das nur die Entwicklungsumgebung betraf.