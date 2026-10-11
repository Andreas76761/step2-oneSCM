# Batch 385 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation**

Im Bereich Dokumente und Kommunikation wurden mehrere Verbesserungen umgesetzt, die das Signieren von Dokumenten und die Pflege von Vorlagen betreffen.

Die Signatur über DSS ist nun an die im Markt hinterlegte Angebotsgültigkeit gekoppelt. Ein Dokument steht so lange zur Signatur bereit, wie es der in der Marktkonfiguration festgelegten Anzahl von Tagen entspricht. Diese Anzahl von Tagen wird auch in der DSS-E-Mail angezeigt. Nach Ablauf der Angebotsgültigkeit lässt sich das Dokument nicht mehr über DSS signieren. Das gilt sowohl für Vor-Ort- und Fernsignaturen als auch für die Signatur über das Customer Account Center. Für Belgien wurde zudem umgesetzt, dass die DSS-E-Mail erneut ausgelöst werden kann, wenn der DSS-Umschlag abgelaufen ist.

In der Vorlagenverwaltung steht eine neue Druckvariable zur Verfügung. Sie befindet sich auf Produktebene im Bereich der Druckvariablen für Dokumente und Benachrichtigungen und gibt den Preis pro Kilometer aus. Der Wert wird aus dem Vertrag übernommen (Preis pro Kilometer ohne MwSt.). Als Standardwert ist 0,50 € hinterlegt, wobei die Währung aus den Markteinstellungen stammt. Der Standardwert wird in der Vorschau angezeigt. Außerdem lässt sich die Spalte „Sprache“ in der Vorlagenverwaltung jetzt sortieren, was die Bedienung erleichtert.

Darüber hinaus wurden Fehler im Zusammenhang mit SEPA-Dokumenten behoben. Dazu zählen die Darstellung des Datums auf Signaturebene in der Druckoption sowie die Anonymisierung der IBAN auf dem SEPA-Dokument, die dort nicht erfolgen darf.

**Geplant bzw. noch in Arbeit**

Für die Vertragserstellung ist vorgesehen, die Verfügbarkeit der Signaturarten an den Zustand des DSS-Dienstes anzupassen. Ist DSS nicht erreichbar, soll das System dies erkennen. Die Optionen „Vor Ort“ und „DSS-Signatur“ sollen dann deaktiviert und mit einem Hinweistext versehen werden. Als einzige Möglichkeit bleibt „Dokument drucken“. So erfährt der Händler, dass eine Signaturmethode aktuell nicht verfügbar ist und er mit den übrigen fortfahren kann.

Ebenfalls geplant sind eine SEPA-Mandatsvorlage für Privat- und Gewerbekunden im Stil des Mercedes-Benz-Leitfadens inklusive QR-Code und integrierter Signatur sowie entsprechende Prüfungen der Mandatserzeugung bei Verträgen mit Vor-Ort- und DSS-Signatur. Darüber hinaus sind interne Benachrichtigungen vorgesehen, wenn das System den Status eines Vertrags automatisch auf „Suspendiert“ setzt oder sich der Status eines SEPA-Mandats per Batchjob ändert.