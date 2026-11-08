# Batch 374 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation: Neuerungen**

**Dokumente im DSS länger als 10 Jahre aufbewahren**
Bisher werden Dokumente im DSS maximal zehn Jahre gespeichert. Künftig sollen Dokumente im DSS auch über diesen Zeitraum hinaus hochgeladen werden können. Hintergrund ist das Löschkonzept in oneSCM, das den DSGVO-Vorgaben folgt: Ein Vertrag wird zehn Jahre nach dem Ende des Jahres gelöscht, in dem er in oneSCM den Status „Geschlossen" erreicht hat. Die Dokumente sollen dazu vor dem Vertragsende, jeweils zum Jahresende, erneut im DSS hochgeladen werden. Dieses Vorhaben befindet sich derzeit in der Qualitätsprüfung (QG-IT).

**Neue Druckvariablen für Gesamtbeträge**
Für Vertragsangebote und Vertragsbestätigungen stehen neue Druckvariablen im Bereich „Vertrag" zur Verfügung, die sich sowohl in Dokumenten als auch in E-Mails verwenden lassen. Sie geben den Gesamtbetrag des Servicevertrags netto, die darauf entfallende Umsatzsteuer und den Gesamtbetrag brutto aus. Die Werte stammen aus der Vertragsdomäne. Damit sehen Kundinnen und Kunden die Gesamtbeträge des Servicevertrags auch dann, wenn die Zahlung monatlich erfolgt. MPC-Nutzer können die Variablen beim Definieren der Dokumentvorlagen für Angebot und Bestätigung im Bereich „Konditionen" einsetzen. In der Vorschau werden die Werte angezeigt, beispielsweise 4.706,40 (netto), 894,22 (Umsatzsteuer) und 5.600,62 (brutto). Bei einem Servicevertrag mit dem Zahlungsintervall „einmalig" müssen diese Variablen nicht im Dokument erscheinen, da die Information sonst doppelt dargestellt würde. Diese Erweiterung ist abgeschlossen.

**Neue Druckvariablen für Preis pro Kilometer**
Auf Produktebene stehen in Dokumenten und E-Mails zwei neue Druckvariablen bereit: der Preis pro Kilometer bei Mehrkilometern und der Preis pro Kilometer bei Minderkilometern. Die Werte werden aus dem Vertrag übernommen. In der Vorschau wird als Standardwert 0,50 € angezeigt, wobei die Währung aus den Markteinstellungen stammt.

**Neuer Reiter „System Notification" in der Vorlagenverwaltung**
In der Vorlagenverwaltung ist ein neuer Reiter „System Notification" vorgesehen, in dem MPC-, HQ- und Admin-Nutzer E-Mail-Vorlagen für Systembenachrichtigungen erstellen können. Der Reiter bietet einen Bereich „Vorlage suchen" und eine Ergebnistabelle mit denselben Feldern und Funktionen wie im Reiter „E-Mails". Unter der Schaltfläche „Vorlage erstellen" steht ausschließlich „E-Mail erstellen" zur Verfügung; Blöcke, Kopf- und Fußzeilen sind nicht vorgesehen. Die Aktionen zu den Vorlagen (Anzeigen, Bearbeiten, Löschen, Duplizieren) entsprechen denen des Reiters „E-Mails".

Als Pflichtangaben sind der E-Mail-Name (Textfeld, maximal 128 Zeichen), der Markt (Auswahlliste, derzeit mit Deutschland vorbelegt, künftig länderabhängig), das Feld „Verwendet für" (Auswahlliste mit Werten je nach Geschäftsprozess), der Kundentyp sowie das Gültig-ab-Datum zu erfassen. Ab diesem Datum wird die Vorlage für den Geschäftsprozess wirksam. Sind Pflichtfelder nicht ausgefüllt, wird auf das jeweilige Feld hingewiesen. „Als Entwurf speichern" ist dann möglich, „Veröffentlichen" dagegen nicht. Optional können die Division (PC und/oder Van) und die Sprache angegeben werden, die sich nach der Marktrolle des Nutzers richtet. Der Inhalt der E-Mail wird gemäß dem MB-Styleguide für E-Mails erstellt. Dieses Vorhaben ist abgeschlossen.

**Weitere Korrekturen**
Außerdem wurden mehrere Fehler behoben: Vorlagenvariablen werden im Commercial Transfer nun korrekt angezeigt. In der E-Mail „Erinnerung vor Ablauf der Angebotsgültigkeit" werden Kundenname und Kontaktname nun mitgesendet. Das SEPA-Dokument wurde in der Datenbank angepasst. Zudem tritt beim Hochladen neuer Dokumente in den Markteinstellungen kein Fehler „Authorization forbidden" mehr auf.