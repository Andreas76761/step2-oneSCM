# Batch 1314 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und technische Grundlagen von oneSCM**

Im Bereich Architektur wurden zuletzt mehrere Themen abgeschlossen, die die Stabilität, Sicherheit und Wartbarkeit des Systems betreffen.

**Fehlerbehandlung und Abbruchkonzept**

Für die Fehlerbehandlung wurde ein Konzept erarbeitet, das mehrere Teams betrifft. Es sollte klären, an welchen Stellen die Ausführung von Code abgebrochen werden muss und wo eine Zeitüberschreitungsbehandlung (Timeout) erforderlich ist. Falls nötig, sollten Abbruch und Timeout-Behandlung auch umgesetzt werden. In den Unterlagen wird zudem das Ziel genannt, nicht reagierende Anwendungsteile zu stoppen und erneute Versuche (Retries) zu steuern. Für drei Teams ist diese Arbeit abgeschlossen, eine weitere Variante des Konzepts wurde abgebrochen.

**Authentifizierung, Berechtigungen und Zugriff**

Die Vier-Augen-Authentifizierung wurde fertiggestellt. Für den MPC-Benutzer wurden die Berechtigungen für die MO-Prüfung ergänzt, und zwar in den Ausprägungen Ansicht, Lesen sowie vollständige Bearbeitung (CRUD). Wenn ein Benutzer ohne Rollen oder Berechtigungen in oneSCM navigiert, wird nun eine Fehlerseite angezeigt, die darauf hinweist, dass er nicht autorisiert ist. Zwei Probleme mit dem Admin-Zugang, nämlich die nicht funktionierende Anmeldung als Admin und der fehlende Zugriff des Admin-Benutzers in der Pre-Prod-Umgebung, wurden bearbeitet. Das erste ist geschlossen, das zweite wurde abgebrochen.

**Mehrsprachigkeit und Benutzerdaten**

In der gemeinsamen Bibliothek wurde ein Übersetzungsmechanismus für das Backend umgesetzt. Die Übersetzungen werden in jedem Service selbst gepflegt. Maßgeblich ist der Header „x-lang“: Lautet der Wert „en“, werden Fehlermeldungen auf Englisch zurückgegeben, bei „de“ auf Deutsch. Außerdem enthält die Antwort mit den Benutzerdetails jetzt die externe ID der Organisation.

**IBAN-Validierung**

Die Integration mit der SWIFT-REF-API zur IBAN-Prüfung ist abgeschlossen. Bisher wurde die IBAN nicht validiert. Nun wird die vom Kunden angegebene IBAN geprüft, wenn ein Vertrag erstellt oder die IBAN eines aktiven Vertrags geändert wird. Dabei wird kontrolliert, ob die IBAN existiert. Die von der API gelieferten Daten werden verwendet, um die Finanzdetails vorzubefüllen. Für die Anbindung an oneERP wurde zudem eine Firewall-Freischaltung für die Testumgebung angefragt, damit dort Kunden angelegt werden können.

**Technische Aktualisierungen und Korrekturen**

BOM und Spring Boot wurden für die Services Custom Market, Batch Service, Revenue Management und Cost Management aktualisiert. Für den Configuration Service wurde eine Swagger-Konfiguration ergänzt. Die Marktnummer wurde korrigiert. Der Request Body für Nemesis wurde angepasst, und die AWS-Autokonfiguration wird für das lokale Profil ausgeschlossen. Nicht mehr genutzte End-to-End-Tests wurden entfernt, und die End-to-End-Tests im Bereich Revenue wurden angepasst.

**Qualitätssicherung in der Produktion (geplant)**

Noch im Backlog befindet sich die Definition produktionsspezifischer UI-Tests im Gherkin-Format. Bisher konzentriert sich die automatisierte Testabdeckung überwiegend auf Nicht-Produktionsumgebungen, sodass produktionsspezifische Risiken nicht durchgängig geprüft werden. Ziel ist ein abgesichertes Testset, das nach einem Release das kritische Verhalten in der Produktion validiert. Priorität haben dabei rein lesende Abläufe, da in der Produktion keine Daten angelegt werden dürfen. Die Szenarien sollen in Xray definiert und vom Product Owner sowie vom Business freigegeben werden. Die Tests sollen nach jedem Produktions-Release automatisch laufen, ihre Ergebnisse sollen in Allure einsehbar sein, und die Resultate samt Link zum Report sollen automatisch in Confluence dokumentiert werden.