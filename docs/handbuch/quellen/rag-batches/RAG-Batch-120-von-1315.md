# Batch 120 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen und Korrekturen**

In der Finanzverwaltung wurde das Zurücksetzen von Filtern korrigiert: Zuvor wurde das Raster nach dem Zurücksetzen nicht aktualisiert, sodass weiterhin die gefilterten Daten angezeigt wurden. Auch bei den Finanzdokumenten wurden Fehler behoben. Die Anzeige enthielt zuvor eine leere letzte Seite und es fehlte eine Seitennavigation. Außerdem trat bei den Finanzdokumenten die Fehlermeldung „Query did not return a unique result" auf, die nun nicht mehr erscheinen soll.

Bei der Schadencode-Einrichtung wurde ein Fehler im Bearbeitungsdialog behoben: Wenn der Schadencode für nur eine Division bearbeitet wurde, waren die Felder zuvor mit den Angaben beider Divisionen vorbelegt. Nun werden die Angaben der bearbeiteten Division korrekt angezeigt.

Für die Schnittstelle E174 wurde die Zuordnungsregel für das Feld „Materialnummer" aus Segment 2 angepasst. Bei Zeilen vom Typ 40 wird die FIN gefolgt von einem Leerzeichen eingetragen, bei Zeilen vom Typ 50 die Materialnummer.

Im Bereich der Exporte wurde der falsche Exporttyp für DD MBLD korrigiert. Zudem wurde die Anzeige der Exportdatei MBLD_OneERPInvE169EXP angepasst, die zuvor unter dem Job OneERPInvE169EXP dargestellt wurde.

Bei vorzeitiger Vertragsbeendigung innerhalb der Widerrufsfrist werden DD, CAMP, SDAS, SCDAS und SCOM nun ordnungsgemäß storniert. Zuvor blieb diese Stornierung aus.

Hinweis: Zwei weitere Vorgänge wurden nicht umgesetzt und sind daher für Anwender nicht relevant. Dies betrifft die Erstellung von Gutschriften für MPPI mit Rückdatierung bei vorzeitiger Beendigung nach Widerruf sowie den Fehler der Exportdatei MBLD_OneERPInvE169EXP nach Annahme einer internationalen WS-Rechnung. Beide Punkte wurden abgebrochen, das beschriebene Verhalten kann daher weiterhin auftreten.