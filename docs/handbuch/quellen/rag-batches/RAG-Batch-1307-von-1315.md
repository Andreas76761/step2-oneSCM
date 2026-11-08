# Batch 1307 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur: Release-Hinweise**

Im Bereich Architektur wurden mehrere Verbesserungen an der technischen Grundlage von oneSCM umgesetzt. Die Swagger-Dokumentation wurde im Hinblick auf die Antworttypen erweitert. Darüber hinaus wurden Schwachstellen behoben, die durch Black Duck gemeldet wurden, und die Berichte aus SonarQube wurden bereinigt. Auch die Sicherheit wurde adressiert: Der Security Service und das Gateway verarbeiten Sitzungsschlüssel nun als Hashwerte. Zudem wurde die Leistung der lokalen oneSCM-Umgebung verbessert.

Für den Dateiaustausch über den CFT wurde eine Erweiterung vorgenommen. Bisher wurde eine neu eingehende Datei vom File Scanner nur in einen bestimmten Bucket und an einen bestimmten Endpunkt kopiert; eine geteilte Kopie war nicht vorgesehen. Künftig können auf Anforderung gemeinsame Kopien in verschiedene Buckets abgelegt werden. Als Beispiel dient die Datei i131, die bislang vom Vehicle-Management verarbeitet wird und nun zusätzlich dem Data-Capture-Service bereitgestellt werden kann.

In der Benutzeroberfläche wurde die Hauptnavigation entsprechend den Ergebnissen aus dem UX-Stream angepasst. Außerdem wurde die Erfassung von Werkstattrechnungen technisch überarbeitet: Für alle drei Formulare der Seite zur Erstellung einer Werkstattrechnung gibt es nun einen gemeinsamen Formular-Service, der den bisherigen Store ersetzt. Der Ablauf bei der Erstellung einer Werkstattrechnung bleibt dabei unverändert.

Zusätzlich wurde ein Fehler in den Markteinstellungen behoben, bei dem die Versionen der Nutzungsbedingungen nicht korrekt gespeichert wurden. Für die Bereitstellung der kundenorientierten Benutzeroberfläche wurde die CI/CD-Pipeline vorbereitet.