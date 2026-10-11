# Batch 799 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verträge: Transparente Rückmeldung in den MO Checks**

Im Bereich Vertragsmanagement liefert das System nun nachvollziehbare Rückmeldungen zu den Hintergrundprozessen, die durch Aktionen im Vertrag ausgelöst werden. Der Bereich „MO Checks“ enthielt bisher Details zu Problemen, die auf Vertragsebene während der Vertragsaktivierung festgestellt wurden. Er wurde nun um die Aktionen „Vertragsinhaber übertragen“, „Zahler eines Vertrags ändern“ und „Bestehende Verträge verlängern“ erweitert. Dies gilt für B2C- und B2B-Kunden, unabhängig von Produkttyp oder Konfiguration. So können MO und MPC Probleme oder Blockaden, die einen erfolgreichen Abschluss einer Aktion verhindern, schnell erkennen und beheben.

Wird eine dieser Aktionen gestartet, führt das System bestimmte Prüfungen und Prozesse durch, darunter das Abrufen von Informationen aus externen Systemen und das Erfassen von Unterschriften. Schlägt eine Prüfung fehl, wird der Vertrag markiert und im Bereich „MO Checks“ mit detailliertem Status und Hinweisen zur Lösung aufgeführt.

Bei der Übertragung eines Vertrags werden für den neuen Kunden der CAS-Check, der Lastschriftcode, die SAP-Debitorennummer und der FI-Systemstatus geprüft. Der CAS-Check zeigt entweder „Ok“ ohne Begründung, „Nicht Ok“ mit der Begründung „Positive Hit“ oder „Ausstehend“ mit der Begründung „Potential Hit“. Bei Lastschriftcode, SAP-Debitorennummer und FI-Systemstatus erscheint im Fehlerfall der Hinweis „Go to Customer“ als Hyperlink, der direkt zur Kundendetailansicht führt. Zusätzlich wird die Dokumentenunterschrift geprüft. Sie ist entweder „Ok“, „Ausstehend“ mit dem Hinweis, dass die Dokumentenunterschrift in Bearbeitung ist, oder „Nicht Ok“ mit dem Hinweis, das Vertragsdokument zu prüfen. Auch hier führt ein Hyperlink zur Vertragsdetailansicht bzw. zum Reiter „Communication“. Die Prüfung der Dokumentennummer ist in der Spezifikation durchgestrichen und damit offenbar nicht mehr vorgesehen.

Beim Ändern des Zahlers gelten für den neuen Kunden dieselben Prüfungen: CAS-Check, Lastschriftcode, SAP-Debitorennummer und FI-Systemstatus mit den oben beschriebenen Statusmeldungen. Wird SEPA verwendet, wird zusätzlich die Dokumentenunterschrift geprüft, und zwar mit den Status „Ok“, „Ausstehend“ oder „Nicht Ok“ samt Hinweis, das Vertragsdokument zu prüfen.

Bei der Verlängerung bestehender Verträge (Langzeitverlängerung) wird die Dokumentenunterschrift geprüft. Die Statusmeldungen entsprechen denen der anderen Aktionen.

**Weitere Verbesserungen im Vertragsmanagement**

Im Verlauf eines Vertrags wird nun der korrekte Ablaufgrund angezeigt; zuvor wurde im Bereich „History“ ein falscher Grund für das Vertragsende genannt. Außerdem überschreibt der Titel des Angebotsdokuments nicht mehr den Titel des SEPA-Dokuments bei der Dokumentenanforderung.

In der Vertragsprüfung steht in der Spaltenüberschrift der Kilometerleistung nun nicht mehr ein Platzhalter, sondern die tatsächliche Einheit. Bei Vertragsvorschlägen werden Sprache und Land jetzt auch dann korrekt übersetzt, wenn die Sprache Deutsch ist.

Wird über die Schnittstelle i156 ein Schaden in oneSCM importiert und liegt der darin enthaltene Kilometerstand über der geplanten Gesamtlaufleistung des Vertrags, wird der Vertrag wegen Erreichens der geplanten Laufleistung auf „abgelaufen“ gesetzt. Dabei wird im Reiter „Vehicle“ der Abschnitt „Last Known Mileage“ aktualisiert. Zusätzlich wird das Feld „Real Mileage at Contract End“ im Reiter „Contract“ mit dem aus i156 übernommenen Kilometerstand befüllt.