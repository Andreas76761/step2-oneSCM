# Batch 1300 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Market Playground**

Für Rollout-Kandidaten steht ein Playground-Markt zur Verfügung, also eine eigene Demo- und Testumgebung. Sie verhält sich wie der deutsche Markt, ist aber technisch und datenseitig davon getrennt. Genutzt wird sie vom HQ-Rollout-Team und von Marktvertretern der Rollout-Kandidaten. Diese können die Fähigkeiten des Systems frühzeitig erkunden und praktisch testen. Dafür müssen sie weder einen marktspezifischen Tenant einrichten noch eigene Schnittstellen implementieren oder konfigurieren, denn die bereits vorhandenen deutschen Schnittstellen werden mitgenutzt. Der Playground bietet damit einen schnellen und aufwandsarmen Einstieg für Bewertung und Tests, bevor marktspezifische Anforderungen in einem eigenen Markt-Tenant umgesetzt werden. Das beschleunigt die Markteinführung und ermöglicht eine frühe Validierung sowie die frühzeitige Zustimmung der Beteiligten.

Als Playground-Markt wird ein Land definiert, das für die Alice-Konfiguration und die GSSN-Anbindung verwendet wird. Dieses Land wird nie oder erst als eines der letzten Länder in oneSCM aufgenommen. Funktional und auf Schnittstellenebene verhält sich der Playground-Markt wie Deutschland. Die Schnittstellenkonfigurationen und Datenstrukturen für die Kommunikation mit externen Systemen sind identisch, und es wird beispielsweise die deutsche Vega-Tenant-ID verwendet.

Zur klaren Trennung gelten jedoch folgende Besonderheiten: Flat Files erhalten eigene Namen und Kennungen und werden an einem dedizierten S3-Speicherort abgelegt. Intern werden alle Daten in einem separaten Tenant gespeichert. So bleibt die technische und datenseitige Isolation vom deutschen Tenant gewährleistet, während das Verhalten nach außen identisch bleibt.

**Weitere Themen**

Zu den Themen „Crowdin Integration – Market translation“ und „Architecture topics PI15“ enthalten die vorliegenden Rohdaten keine inhaltlichen Angaben, die sich für das Benutzerhandbuch verwenden ließen. Sie werden deshalb hier nicht beschrieben.