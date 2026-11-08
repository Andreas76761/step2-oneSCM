# Batch 142 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 20 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Änderungen**

**Zahlungslinks und Kreditkartenhinterlegung nach der Aktivierung**
Nach der Aktivierung eines Vertrags wird der Zahlungslink künftig abhängig von der Zahlungsart erzeugt. Bei Einmalverträgen, sowohl für Gewerbe- als auch für Privatkunden, wird der Link mit Vorautorisierung und Einzug (Preauthorize & Capture) über den vollen Kundenbetrag angelegt. Bei Verträgen von Privatkunden mit monatlicher, vierteljährlicher, halbjährlicher oder jährlicher Zahlung wird der Link mit Vorautorisierung und einem Betrag von 0 erstellt. Dabei wird die Kennzeichnung als Abonnement gesetzt und die CIAM-ID als Kundenreferenz verwendet. Zusätzlich wurde der CFDM-Batch-Job angepasst: Liegt bei einer Rechnung der Rechnungszeitraum ab heute oder später, ist die Kreditkarte aber noch nicht hinterlegt, wird die Rechnung nicht in den Status „Akzeptiert“ versetzt.

**Rechnungsschwelle aus den Markteinstellungen**
Der Schwellenwert für die automatische Akzeptanz von Rechnungen wird in den Markteinstellungen gepflegt. Bei der Erstellung einer Rechnung wird der Nettorechnungswert mit diesem Schwellenwert verglichen, und zwar abhängig von Division und Markt.

**Exporte für CoFiCo und SWT**
Der Dateiname der Exportdateien für CoFiCo und SWT enthielt bisher nur einen Zeitstempel. Lief der Export sehr schnell, konnten in derselben Sekunde zwei Dateien mit identischem Namen entstehen. Der Dateiname enthält daher nun zusätzlich die Division und die Uhrzeit. Das neue Format lautet 1SCM_CountryCode_CompanyCode_SalesOrganization_Division_SAPDebit_YYYYDDMM_HHmmss. Außerdem wurde die Setzung der Processing Number für CoFiCo und SWT korrigiert, und der Export dieser Rechnungen im MPay-Status „Pending“ wurde behoben.

**Harmonisierung der Exporttypen**
Die Exporttypen wurden fachlich überprüft, und die Zuordnung zwischen Produktlinie, Rechnungsart und Exporttyp wurde im System angepasst. Die Exporttypen werden beim oneERP-Export der Rechnungen über die Schnittstelle E169 verwendet. Beispielsweise wird bei PC-Verträgen für die Produktlinie Excellent der Exporttyp FS verwendet, für Compact MTN, für CompactPlus MTNWT, für Advance EXW und für Tire TRS. Bei VAN-Verträgen gelten unter anderem FS für Complete, MTN für Maintenance, MTNWT für MaintenancePlus, MTNEXW für Select Plus, EXW für Extended Warranty und WT für Wear&Tear. Für die Rechnungsarten internationale Schadenabwicklung, Händlerrabatt, Händlerprovision und Vertragsprüfung bleiben die Exporttypen IF, ESUB, ESER und FEA, für Rechnungen ohne weitere Zuordnung RI. Für MBLD PC und MBLD VAN gelten entsprechende Exporttypen mit vorangestelltem „L“, etwa LFS, LMTN, LMTNWT, LEXW, LTRS, LIF, LESER, LFEA und LRI. Bei MBLD VAN kommen LMTNEX, LWT und LESUB hinzu.

**Externe Händlerprovision in der E169**
Die Schnittstelle E169 wurde für externe Händlerprovisionen mit dem Exporttyp ESER entsprechend der fachlichen Anforderung angepasst.

**Anpassungen der Schnittstelle E174 für Verkaufskampagnen**
Für Verkaufskampagnen wurde das Sachkonto aktualisiert. Die Materialnummer in Zeile 40 und die FIN in Zeile 50 bleiben nun leer. Die Retail-IDs in Zeile S(240) wurden angepasst. Zusätzlich soll geprüft werden, ob die Retail-IDs mit der von oneERP bereitgestellten Liste übereinstimmen: 268000 Complete, 268010 Select Plus, 268020 Best Basic, 268030 Extend Plus Anschlussgarantie, 268040 Compact Plus MBC/Comfort VAN, 268050 Internationale Serviceverträge, 268060 Extend Antriebsstranggarantie, 268070 Räder-/Reifenabwicklung und 268080 VAN Wear/Tear.

**Behördenkunden**
Der Ablauf zur Erzeugung von Zahlungsplänen und die zugehörigen Abläufe wurden so erweitert, dass auch Behördenkunden (Governmental Customers) unterstützt werden. Die Erzeugung des Zahlungsplans für diese Kundengruppe wurde geprüft.

**Fehlerbehebungen**
Ein Fehler wurde behoben, bei dem der Rückerstattungsaufruf (Refund) an MPay doppelt ausgelöst wurde. Außerdem wird der Servicestatus auf der Ecosystem-Seite nun korrekt formatiert dargestellt.

**Marktspezifische Anzeige und Prüfungen**
Für den Markt Slowakei wurden Seiten entfernt, die nicht zum slowakischen Markt gehören. Die Sichtbarkeit der Batch-Jobs wurde für Deutschland, Slowakei und Indien geprüft: Jeder Markt zeigt alle marktspezifischen sowie die globalen Batch-Jobs ohne Duplikate an. Zudem wurde die Anpassung des Feldes HTXT2 in der E169 verifiziert.