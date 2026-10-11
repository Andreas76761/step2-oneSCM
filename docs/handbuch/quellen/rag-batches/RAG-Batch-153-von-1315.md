# Batch 153 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Automatische Stornierung geplanter Rechnungen bei vorzeitiger Kündigung innerhalb der Kulanzfrist**

Wird ein Servicevertrag innerhalb der Kulanzfrist vorzeitig gekündigt, verlieren die zugehörigen geplanten Finanzbelege ihre Gültigkeit. Dies betrifft Händlerrabatte (DD), Händlerprovisionen (SCOM) sowie Kampagnenrabatte (SDAS, CAMP) einschließlich spezieller After-Sales-Kampagnen. Bisher konnten MO-Anwender diese geplanten Rechnungen nicht selbst stornieren. Ohne Automatisierung bestand das Risiko, dass einzelne geplante Belege in die Akzeptanz- oder Exportprozesse gelangen und dadurch Abweichungen im FI-Abgleich entstehen.

Neu ist daher eine sofortige, ereignisgesteuerte Stornierung. Kündigt ein MO-Anwender den Vertrag in der Vertragsverwaltung innerhalb der Kulanzfrist vorzeitig, wird ein Statusänderungsereignis erzeugt, das ein Kennzeichen „innerhalb der Kulanzfrist“ enthält. Revenue Management empfängt dieses Ereignis und prüft, ob die Kündigung tatsächlich innerhalb der Kulanzfrist liegt. Ist dies nicht der Fall, werden keine Rechnungen verändert.

Anschließend ermittelt das System alle mit dem Vertrag verknüpften Rechnungen der Typen DD, SCOM, SDAS und CAMP und beschränkt sich auf diejenigen im Status „PLANNED“. Rechnungen in anderen Status bleiben unverändert. Existieren keine passenden Rechnungen, wird ein Audit-Eintrag „No action – no PLANNED DD/SCOM/SDAS/CAMP invoices“ erfasst und der Vorgang beendet.

Für jede berücksichtigte Rechnung prüft das System, ob gleichzeitig eine andere Verarbeitung läuft, und stellt Idempotenz sicher: Bereits stornierte Rechnungen werden übersprungen. Als einheitlicher Stornierungsgrund wird „Cancelled due to contract termination within grace period“ verwendet. Die Rechnung erhält den Status „CANCELLED“, der Stornierungszeitpunkt wird festgehalten. Zusätzlich wird ein Audit-Datensatz mit Vertragsreferenz, Rechnungsreferenz, Grund und Akteur gespeichert, wobei die Aktion als Systemaktion gekennzeichnet ist.

Nach der Stornierung ist sichergestellt, dass stornierte Rechnungen von den CFDM- und Export-Batches ausgeschlossen werden. Der aktualisierte Status ist in der Rechnungsliste und in den Rechnungsdetails sichtbar, ebenso der Stornierungszeitpunkt und der Stornierungsgrund.

**Weitere Änderungen im Bereich Revenue Management**

Das Feld „Payment Duration“ im Zahlungsbereich des Vertrags sowie das entsprechende Feld im Revenue-Ereignis an Nemesis geben nun die Dauer in Monaten an und nicht mehr die Anzahl der Rechnungen. Beispiel: Bei einer Vertragslaufzeit vom 16.08.2024 bis 15.02.2027 (30 Monate) und einer Zahlungsdauer vom 16.11.2025 bis 15.02.2027 wird im Revenue-Ereignis der Wert 15 übermittelt.

Darüber hinaus wurde behoben, dass das Feld „CreditNoteDate“ im Revenue-Ereignis an Nemesis leer blieb.

Für weitere Themen im Revenue Management befinden sich Prüffälle in Verwendung. Sie betreffen unter anderem die Anzahl der Rechnungen (numberOfInvoices) im Nemesis-Ereignis, die auf Basis der tatsächlich zum Vertrag erzeugten Rechnungen angezeigt werden soll, sowie die Zahlungsmethode in Exportdateien. Diese ist bei MPPI ungleich 0, bei Aftersales-Kampagnen, Sales-Kampagnen sowie internen und externen Händlerrabatten dagegen 0. Außerdem wird in der SWT-Exportdatei die Transaktions-ID statt der Operation-ID gesendet. Weiterhin wird die Product-Line-API für die Verwaltung der Materialnummern verwendet, und es wurde die Behandlung der Altteilesteuer (Old Part Tax) geprüft, wenn mehrere Schäden einschließlich Altteilesteuer in einem Schadenfall enthalten sind.