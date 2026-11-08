# Batch 1315 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und Sicherheit**

Für die Anmeldung und Zugriffssteuerung wurde in oneSCM eine eigene Sicherheitsarchitektur umgesetzt. Zuvor gab es keine Möglichkeit, einen Benutzer innerhalb von oneSCM zu identifizieren. Nun kommuniziert ein Security Service mit dem Berechtigungssystem Alice. Er wandelt ein externes Zugriffstoken in ein internes oneSCM-Passport-JWT-Token um und ergänzt dieses um Informationen aus Alice, etwa Benutzerdetails und Berechtigungen (Entitlements). Eine zugehörige Client-Bibliothek steuert in allen oneSCM-Services annotationsbasiert die Autorisierung. Dadurch lässt sich der Zugriff auf bestimmte Endpunkte anhand der Benutzerberechtigungen einschränken.

Für Dealer-bezogene Aufgaben wurde die Prüfung erweitert: Neben den passenden Berechtigungen soll künftig auch die Organisations-ID (Outlet-ID) validiert werden. Diese wird vom Security Service bereitgestellt und ist im Sicherheitskontext von oneSCM enthalten. Vorgesehen ist, die betroffenen API-Anfragen und Operationen zu identifizieren und die Anfragen um die Outlet-ID zu ergänzen. Außerdem sollen die Entitäten in der Datenbank die Outlet-ID enthalten, wo nach ihr gefiltert werden muss. Vor jeder Änderung an einem Objekt prüft das System, ob die Outlet-ID im Sicherheitskontext des angemeldeten Benutzers mit der Outlet-ID der Anfrage übereinstimmt. Betroffen sind insbesondere Operationen in den Bereichen Kunden (zum Beispiel Anlegen, Übertragen, Abrufen und Aktualisieren von Kunden, Adressen, Zahlungsdetails und Einwilligungen), Dokumentenverwaltung und Benachrichtigungen. Die manuelle Testausführung zu dieser Validierung ist noch offen.

Ist ein Benutzerkonto keiner Filiale beziehungsweise keinem Markt zugeordnet, erscheint ein Pop-up. Weitere Aktionen sind erst möglich, wenn das Konto entsprechend konfiguriert wurde. Zudem wurde die Berechtigung „is_dealer“ in Alice für einen bestimmten Benutzer berücksichtigt.

Für maschinelle Aufrufe über Kong gab es bisher in jedem Service eine eigene Implementierung zum Abrufen von Sicherheitstokens. Nun steht im Security Service eine Bibliothek bereit, die jeder oneSCM-Service einbinden kann. Sie erstellt Tokens für einen bestimmten externen Service, der Kong (Open API) nutzt, speichert diese zwischen und erneuert abgelaufene Tokens.

**Historie und Datenhaltung**

Bisher gab es in oneSCM keinen globalen Historienservice. Ein neuer Microservice kann nun Änderungen an beliebigen Objekten in oneSCM speichern und auflisten.

Außerdem wurde ein Fehler behoben, bei dem im Batch-Betrieb zu Kundeninformationen ein neuer Eintrag angelegt wurde, statt den bestehenden zu aktualisieren.

**Bedienung und Oberfläche**

Wenn die Sitzung eines Benutzers abläuft, wird er nun in allen Bereichen darüber informiert. Bei der Eingabevalidierung für Mindestzeichenanzahlen wurde das Verhalten angepasst: Eine Fehlermeldung erscheint nicht während der Eingabe, sondern erst, wenn der Benutzer das Feld verlässt und weniger Zeichen als vorgegeben eingegeben hat.

Für Datum, Uhrzeit und Währung ist vorgesehen, die einheitliche Darstellung konfigurierbar zu machen, und zwar pro Kunde und pro Team über ein Admin-Dashboard. Ob dieses als Oberfläche oder im Backend umgesetzt wird, war noch offen.

**Prüfung der USt-IdNr. im B2B-Prozess**

Im B2B-Ablauf erfasst oneSCM Firmenname, Rechtsform, USt-IdNr. und Firmenadresse. Für die USt-IdNr. gilt eine länderspezifische Prüfung; für Deutschland sind das genau 11 alphanumerische Zeichen ohne Leerzeichen, zum Beispiel DE123456789. Bisher prüften die Märkte (Belgien, Frankreich, Schweden, Dänemark) vor der Aktivierung Firmenname, Adresse und USt-IdNr. auf externen Webseiten wie dem VIES-Portal der EU-Kommission. Daher wurde ein Validierungsdienst für die USt-IdNr. innerhalb von oneSCM umgesetzt. Er soll prüfen, ob die USt-IdNr. existiert und gültig ist, und die zugehörigen Angaben zu Firmenname, Rechtsform, Adresse und Steuersätzen liefern. In oneAPI HUB wurde keine passende API gefunden, weshalb externe Angebote wie die VIES-Schnittstelle und Vatify betrachtet wurden.