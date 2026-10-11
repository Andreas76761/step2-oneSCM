# Batch 517 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Validierung des Vertragsbeginns bei der Vertragsaktivierung**

Wenn ein Leasingvertrag über die oneSCM-API aktiviert wird, kann das aufrufende System ein Vertragsbeginn-Datum mitsenden. Dieses Datum wird nun geprüft: Zulässig ist das heutige Datum oder ein Datum in der Vergangenheit. Ein Datum in der Zukunft wird abgelehnt. In diesem Fall gibt die API die Fehlermeldung „contract start date cannot be in the future“ zurück. Damit ist ausgeschlossen, dass ein Vertrag aktiv ist, dessen Beginn erst in der Zukunft liegt.

Wird die Aktivierung wegen eines zukünftigen Vertragsbeginns abgelehnt, bleibt der Vertrag im Status „Bestätigt“ (Confirmed). Er wird weder automatisch abgelehnt noch in den Status „Wartet auf Aktivierung“ oder „Aktiv“ überführt. Die Prüfung gilt einheitlich für alle Endpunkte und Versionen, über die ein Vertrag unter Angabe des Vertragsbeginns aktiviert werden kann. Alle diese Endpunkte liefern bei einem zukünftigen Datum dieselbe Fehlermeldung und lassen den Vertrag in seinem aktuellen Status.

**Leerzeichen in Kennzeichen bei der Leasing-Aktivierung**

Bisher schlug die Aktivierung eines Vertrags fehl, wenn das übermittelte Kennzeichen ein Leerzeichen enthielt, etwa „AB 1234“. Das ist nun angepasst. Die Änderung betrifft ausschließlich die Leasing-Aktivierungsendpunkte, also PUT /contract/v1/leasing und PUT /contract/v2/leasing sowie die internen Entsprechungen PUT /v1/leasing/status und PUT /v2/leasing/status. Diese Endpunkte akzeptieren nun Kennzeichen mit Leerzeichen.

Vor der Prüfung von Format und Länge sowie vor dem Speichern entfernt oneSCM alle Leerzeichen aus dem Kennzeichen, unabhängig davon, ob sie am Anfang, am Ende oder innerhalb stehen und ob sie einzeln oder mehrfach auftreten. Aus „ AB 1234 “ wird so „AB1234“. Bindestriche bleiben erhalten; entfernt werden nur Leerzeichen.

Die bestehende Format- und Längenprüfung bleibt unverändert und wird auf den von Leerzeichen bereinigten Wert angewendet. Erlaubt sind Buchstaben, Ziffern und höchstens ein Bindestrich, bei maximal 11 Zeichen. Dieses Maximum entspricht der Praxis, etwa bei deutschen Kennzeichen. Ein Kennzeichen, das nach dem Entfernen der Leerzeichen länger als 11 Zeichen ist, wird weiterhin mit der bisherigen Formatfehlermeldung abgelehnt. Ein deutsches Kennzeichen mit Leerzeichen, das bereinigt genau 11 Zeichen lang ist, wird akzeptiert und vollständig mit 11 Zeichen gespeichert.

Der bereinigte Wert wird im weiteren Verlauf überall verwendet, auch beim i155/VEGA-Export. Dieser übernimmt wie bisher nur die ersten 10 Zeichen des Kennzeichens; dafür wird der bereits vorhandene generische Mechanismus zur Kürzung von Feldern genutzt, sodass auf der Exportseite keine Änderung nötig war.

Andere Endpunkte sind von dieser Änderung nicht betroffen. Dazu zählen das Anlegen, Bearbeiten und Übertragen von Verträgen sowie das Erfassen fehlender Fahrzeuginformationen. Ihr bisheriges Verhalten bleibt unverändert, Kennzeichen mit Leerzeichen werden dort also weiterhin wie bisher behandelt.