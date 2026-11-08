# Batch 1299 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und Plattform**

In der Domäne Architektur wurden mehrere Vorhaben abgeschlossen, die die Grundlage für die Weiterentwicklung und Nutzung von oneSCM verbessern.

Für den Einsatz von KI in oneSCM wurde die Konfiguration vorbereitet. Dazu wurden alle erforderlichen Dateien angelegt, unter anderem Skills und Agenten, Regeln sowie Anweisungen für Copilot. Damit steht eine einheitliche Grundlage für die KI-Unterstützung im System bereit.

Die Dokumentation wurde für mehrere Teams aktualisiert, nämlich für Explorers, M&M, Brabus und Caffeine Overflow. Die Aktualisierungen sind abgeschlossen. Darüber hinaus wurde ein Vorhaben zur Behebung von SonarCloud-Befunden für die Revenue Services abgeschlossen. Zu Inhalt und Umfang dieser Arbeiten liegen keine näheren Angaben vor.

**Market Playground**

Neu ist der sogenannte Market Playground. Er stellt eine eigene Demo- und Testumgebung bereit, die sich wie der deutsche Markt verhält, technisch und datenseitig aber vollständig isoliert bleibt. Er richtet sich an das HQ-Rollout-Team sowie an Marktvertreterinnen und Marktvertreter von Rollout-Kandidaten. Diese können die Fähigkeiten des Systems frühzeitig erkunden und testen, ohne zuvor einen marktspezifischen Tenant einrichten oder Schnittstellen implementieren zu müssen. Sie nutzen dafür die bereits vorhandenen deutschen Schnittstellen. Der Playground dient damit als schneller, aufwandsarmer Einstieg für eine frühe Bewertung und praktische Tests, bevor marktspezifische Anforderungen in einem eigenen Markt-Tenant umgesetzt werden. Er beschleunigt die Markteinführung und ermöglicht eine frühe Validierung sowie die Zustimmung der Beteiligten.

Für den Playground wird ein Markt definiert, der für die Alice-Konfiguration und die GSSN-Anbindung verwendet wird. Dabei handelt es sich um ein Land, das nie oder erst als eines der letzten Länder in oneSCM aufgenommen wird. Aus funktionaler und schnittstellenbezogener Sicht verhält sich der Playground-Markt wie Deutschland. Die Schnittstellenkonfigurationen und die Datenstrukturen für die Kommunikation mit externen Systemen sind identisch, und es wird beispielsweise die deutsche Vega-Tenant-ID verwendet.

Zur klaren Trennung gelten jedoch einige Besonderheiten. Flat Files erhalten eigene Namen und Kennungen und werden an einem dedizierten S3-Speicherort abgelegt. Intern werden alle Daten in einem separaten Tenant gespeichert. Dadurch sind der Playground und der deutsche Tenant technisch und datenseitig voneinander getrennt, während das Verhalten nach außen identisch bleibt.