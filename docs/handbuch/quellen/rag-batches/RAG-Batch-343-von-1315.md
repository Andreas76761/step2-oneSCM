# Batch 343 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Bereitstellung von oneSCM-Daten in den SC-Datenprodukten**

Im Bereich Reporting wurden die bestehenden Datenprodukte für Service Contracts (SC) erweitert, sodass sie nun auch Daten aus oneSCM enthalten. Bisher waren die Datenprodukte Cost, Revenue und Base SC ausschließlich mit Daten aus den Altanwendungen befüllt, die aus dem einheitlichen Datenmodell (Unified Data Model) stammen. Ziel war es, dass oneSCM-Daten ebenfalls im einheitlichen Datenmodell und in den zugehörigen Datenprodukten zur Verfügung stehen. Das einheitliche Datenmodell enthält damit sowohl die Daten der Altanwendungen als auch die Daten aus oneSCM. Grundlage dafür sind erweiterte Mapping-Dokumente für das einheitliche Datenmodell sowie die jeweiligen Attributlisten der Datenprodukte.

Die Datenprodukte enthalten aktuelle, vollständige und konsistente Daten aus iCON, Sirius, Asset Global und oneSCM im jeweils definierten Format. Für die Altanwendungen werden dabei nur Daten berücksichtigt, die im CostAlternativeReport (iCON) bzw. in den CostReports (Asset, Sirius) abgedeckt sind. Alle Kosten-, Erlös- bzw. Vertragsdaten mit den definierten Datenfeldern werden für alle Märkte und Anwendungen in einer einzigen Einheit bereitgestellt. Die Datenprodukte werden den SPOT-Kolleginnen und -Kollegen zur Verfügung gestellt, beispielsweise über DDX an extollo. Sie lassen sich in mehreren Datenformaten bereitstellen, etwa XML oder CSV.

Für die Erstellung der Datenprodukte sind Benachrichtigungen über Erfolg oder Fehlschlag vorgesehen. Vor dem Schreiben neuer Daten wird jeweils eine Sicherung des Datenprodukts angelegt, sodass es im Fehlerfall aus dem Backup wiederhergestellt werden kann. Für das Cost-Datenprodukt wird zusätzlich ein Batch-Job eingerichtet, der jeweils am 1. des Monats gestartet wird.

Darüber hinaus wurde das Base-SC-Datenprodukt verfeinert. Aufgrund zusätzlicher Anforderungen werden darin weitere Attribute benötigt, die in der zugehörigen Attributliste farblich (blau) markiert sind. Dazu wurde das einheitliche Datenmodell um diese Attribute erweitert und das Base-SC-Datenprodukt so ergänzt, dass die neuen Attribute befüllt werden. Bei einer Delta-Bereitstellung des einheitlichen Datenmodells muss sichergestellt sein, dass die neuen Attribute für den gesamten Datenbestand aktualisiert werden. Das Base-SC-Datenprodukt wird neben den SPOT-Kolleginnen und -Kollegen auch weiteren Abnehmern bereitgestellt.

**Qualitätssicherung**

Im Rahmen der automatisierten Qualitätssicherung wurden die Testszenarien für den Produkterstellungs-Assistenten (alle Schritte) aktualisiert. Außerdem wurden Tests für Verbesserungen bei der Produkterstellung umgesetzt und die Tests für die Erstellung eines kontingentbasierten Kompaktprodukts erweitert.

Nicht umgesetzt wurden die Integration der MIC-VAG-Fahrzeug-API sowie Tests für das Vorschau-Produkt; beide Vorhaben wurden abgebrochen.