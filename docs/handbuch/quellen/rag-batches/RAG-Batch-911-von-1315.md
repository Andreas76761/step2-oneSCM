# Batch 911 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenprodukte in der Langzeitverlängerung**

Im Bereich Vertragserstellung (Contract Generation) wird das System so erweitert, dass Reifenprodukte in der Langzeitverlängerung (Long Term Prolongation) berücksichtigt werden. Dies betrifft die Produktvarianten Limited, Unlimited und Complex Product. Diese Erweiterung befindet sich derzeit in der Abnahmetestphase (BAT Testing).

**Vertragserstellung für Commercial-Fleet-Kunden in Sonderfällen**

Für Commercial-Fleet-Kunden wurden automatisierte Qualitätssicherungstests (AQA) für zwei Sonderfälle abgeschlossen. Der erste Fall betrifft die Erstellung eines Vertrags mit neuer Laufzeit und neuer Laufleistung. Der zweite Fall betrifft die Erstellung eines Vertrags, bei dem Rabatte angewendet werden. Beide Szenarien sind fertiggestellt.

**Hinweisbanner bei Systemwartungen und Systemausfällen**

Für oneSCM war ein Hinweisbanner vorgesehen, das Benutzer über geplante und ungeplante Systemausfälle informiert. Das zugehörige Vorhaben wurde geschlossen. Die folgende Beschreibung gibt den dokumentierten Zielzustand wieder.

Bisher erhalten Benutzer keine Informationen über Ausfälle. Künftig sollen alle Rollen über eine Meldung auf der Oberfläche informiert werden. Bei geplanten Ausfällen sollen der erwartete Zeitraum und der Grund angezeigt werden, bei ungeplanten Ausfällen der Hinweis, dass ein Fehler erkannt wurde und an der Behebung gearbeitet wird. Dadurch sollen die Erwartungen der Benutzer gesteuert werden, sodass sie nicht per E-Mail oder Nachricht bei Marktgesellschaften oder der Zentrale nachfragen, warum oneSCM nicht funktioniert.

Als Beispiel dient eine Wartungsmitteilung zum externen System CAS. Die Zentrale erhält eine E-Mail über einen Ausfall und trägt in ein Textfeld einen entsprechenden Hinweis ein, etwa dass das System CAS an einem bestimmten Tag in einem bestimmten Zeitraum nicht verfügbar ist und alle Verträge im Status „WAITING FOR ACTIVATION“ bleiben. Anschließend aktiviert sie die Meldung, und oneSCM zeigt den Text in der gesamten Anwendung an.

Die Konfiguration erfolgt im Admin-Bereich auf einer dafür vorgesehenen Seite. Der Zugriff richtet sich nach den Zugriffsrechten des Admin-Bereichs, und nur Benutzer mit entsprechenden Admin-Berechtigungen dürfen diese Seite sehen. Dort kann die Nachricht entweder für alle Märkte oder für einzelne, per Mehrfachauswahl gewählte Märkte hinterlegt werden. Das Textfeld akzeptiert alphanumerische Zeichen und gängige Sonderzeichen mit maximal 300 Zeichen.

Über einen Schalter (Aktiv/Inaktiv) wird die Meldung ein- oder ausgeschaltet. Ist das Textfeld leer, bleibt der Schalter deaktiviert (ausgegraut) und lässt sich nicht aktivieren. Vor der Aktivierung erscheint ein Bestätigungsdialog. Text kann nur bearbeitet werden, wenn der Schalter deaktiviert ist. Der zuletzt eingegebene Text bleibt im Textfeld erhalten, auch nach der Deaktivierung oder einer Aktualisierung der Seite, sodass er leicht wiederverwendet oder angepasst werden kann.

Ist der Schalter aktiv, erscheint das Banner auf allen Seiten der Anwendung für die ausgewählten Märkte. Es ist in der vom Benutzer gewählten Sprache gehalten und hebt sich optisch vom übrigen Seiteninhalt ab, zum Beispiel durch eine andere Hintergrundfarbe oder ein Warnsymbol. Benutzer, die einem nicht ausgewählten Markt angehören, sehen das Banner nicht.

Folgende Risiken wurden vom Fachbereich zur Kenntnis genommen: Da es keine geplante Endzeit und kein automatisches Ablaufen gibt, kann es vorkommen, dass eine Meldung nach Wiederherstellung des Systems versehentlich aktiv bleibt, was zu Verwirrung führen kann. Eine Nachricht mit 300 Zeichen kann auf kleinen Bildschirmen wichtigen Inhalt nach unten verschieben oder Schaltflächen verdecken. Haben mehrere Administratoren Zugriff, kann einer die Nachricht eines anderen überschreiben, wodurch Informationen verloren gehen.