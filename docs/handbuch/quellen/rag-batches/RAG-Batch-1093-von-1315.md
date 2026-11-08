# Batch 1093 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Änderungen und Anpassungen**

**Signatur und SEPA-Dokumente**

Wird ein SEPA-Dokument hochgeladen, dessen QR-Code oder Unterschrift nicht lesbar ist, zeigt das Signatur-Fenster nun eine passende Meldung an. Der Titel lautet „Upload SEPA Document“, der Hinweistext „QR Code or Signature not readable. Please retry a different upload type or proceed with caution.“ Zuvor erschien fälschlich eine Meldung zum Service-Vertrag („Upload Service Contract“ und der Hinweis, die Service-Vertragsnummer sei nicht lesbar).

Wird der Signaturprozess erneut angestoßen, erhält der Kunde künftig die ursprünglich für den jeweiligen Vertrag erzeugten Dokumente (vor der Aktivierung). Bisher wurden die auf Vertragsebene verfügbaren Dokumente versendet, die unter Umständen nicht korrekt waren. Außerdem wird das erneute Auslösen der Signatur in der Vertragshistorie erfasst und angezeigt, unabhängig davon, ob zugleich weitere Änderungen vorgenommen wurden. Bisher geschah dies nur, wenn auch Kundendaten geändert wurden.

**Sonderfreigaben**

Bei einer Sonderanfrage genügt künftig die Freigabe durch einen MPC, damit der Händler den Aktivierungsprozess fortsetzen kann. Zuvor waren zwei einzelne MPC-Freigeber erforderlich. Der erste MPC erfasst und konfiguriert die Rabattdetails. Der zweite MPC fungiert bisher lediglich als Freigeber der vom ersten MPC vorgenommenen Rabattkonfiguration.

**Reifenangaben bei begrenzten und unbegrenzten Verträgen**

Die angezeigten Felder zu Reifen richten sich nun nach Fahrzeugart (PC oder Van) und danach, ob der Reifenumfang begrenzt oder unbegrenzt ist:

Beim PC mit begrenztem Umfang werden Reifengröße, Reifentyp, Reifenlieferant, Wetterprofil, Felgen inklusive und Anzahl der Reifen angezeigt. Beim PC mit unbegrenztem Umfang entfällt die Anzahl der Reifen. Beim Van mit begrenztem Umfang werden Radgröße, Reifenlieferant, Wetterprofil, Felgen inklusive und Anzahl der Reifen angezeigt; ein Reifentyp wird nicht angezeigt. Beim Van mit unbegrenztem Umfang entfällt zusätzlich die Anzahl der Reifen.

**Prüfungen durch den MO**

Die Branche wird bei den MO-Prüfungen nun für alle gewerblichen Kundentypen berücksichtigt. Bisher galt dies nur für gewerbliche Kunden, nicht jedoch für Commercial Fleet.

**Marktkonfiguration und Markteinstellungen**

In der Marktkonfiguration unter „General“ im Bereich „Customer“ heißt das Feld „Clearing Group name“ jetzt „Search Profile Name“. Der Tooltip lautet nun: „Define search profile used to interrogate Critical Account System API service“.

In den Markteinstellungen wird der Satz „The following settings will apply throughout the entire market.“ weiterhin auf nahezu allen Registerkarten angezeigt. In den Division-Registerkarten lautet er nun „The following settings will apply for your division throughout the entire market.“

Wird eine Sprache abgewählt, werden die zugehörigen Dokumente weiterhin aus der Auswahl unter Documents bzw. Market Config entfernt. Sie werden jedoch nur per Soft Delete gelöscht und nicht dauerhaft. Wird die Sprache erneut ausgewählt, stellt das System die zuvor entfernten Dokumente automatisch wieder her, sodass sie nicht erneut hochgeladen werden müssen.

**Dokumentvorlagen**

In der deutschen Angebotsvorlage wird das Wort „Monate“ nun korrekt mit großem Anfangsbuchstaben geschrieben.

**Weitere geplante Anpassungen**

Diese Änderungen sind noch nicht abgeschlossen. Sie befinden sich in unterschiedlichen Bearbeitungsständen.

Die Produktkonfiguration liefert künftig das bevorzugte Zahlungsintervall im Payload mit. Dieses wird in der Vertragserstellung und im Vergleich bereits vorausgewählt, um dem Händler Klicks zu ersparen.

Für den Online-Sales-Bereich sollen aus dem Body der Schnittstellen zum Anlegen eines Vertrags und zum Ändern der Konfiguration die Felder zu Verkäufer und Händler entfernt werden. Dies betrifft Vorname und Nachname des Verkäufers, Name und Land des Outlets, Telefonnummer des Verkäufers sowie Name und Adresse des Händlers. Die Verkäuferdaten sollen wie im Retail-Bereich (oneSCM-Frontend) ermittelt werden: Anhand der E-Mail-Adresse werden die relevanten Informationen über ALICE abgerufen und auf Vertragsebene gespeichert. Die Dokumentation wird entsprechend aktualisiert.

In den Markteinstellungen unter „Timers & Reminders“ (beide Divisionen) soll die Aufbewahrungsdauer für geschlossene Verträge bei den Data Deletion Rules künftig in Jahren statt in Tagen konfiguriert werden. Zulässig sind mindestens 1 Jahr und höchstens 99 Jahre. Bisher waren bis zu 999 Tage möglich. Diese Änderung befindet sich im BAT-Test, der derzeit blockiert ist.

Der Inflationsfaktor soll in den Markteinstellungen künftig für bis zu 120 Monate definiert werden können, bisher sind es 96 Monate. Hintergrund ist, dass Van-Produkte eine Laufzeit von bis zu 10 Jahren haben können. Bei einer Produktlaufzeit von mehr als 96 Monaten konnte der Inflationsfaktor bislang in der Preisversion nicht verwendet werden, da er nicht angezeigt oder auswählbar war. Auch wenn es für das 9. und 10. Jahr keine Prognose gibt, legen die Van-Produktverantwortlichen hierfür einen Inflationsfaktor fest.

**Nicht umgesetzte Änderungswünsche**

Folgende Anfragen wurden abgebrochen und nicht umgesetzt: die Anpassung des bevorzugten Zahlungsintervalls in der Produktkonfiguration, das Zurücksetzen der Werte für Kampagnen und Händlerrabatt beim Zurückgehen im Vertragserstellungsprozess (einschließlich einer Option „Don’t add Campaigns“) sowie die Änderung, dass ein von MO oder MPC zugewiesener Händler eine für ihn angelegte Sonderanfrage nach der MPC-Freigabe allein bestätigen kann.