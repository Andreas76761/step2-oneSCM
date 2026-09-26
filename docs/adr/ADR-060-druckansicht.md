# ADR-060 Druck- und PDF-Ansicht

**Status:** akzeptiert, umgesetzt in Etappe 20 (erweitert ADR-054)

## Entscheidung
- In der Leseransicht **„Kapitel drucken“** (Browserdruck des gezeigten Kapitels) und **„Ganzes Handbuch drucken“** (`/lesen/druck`, optional mit Entwürfen): Inhaltsverzeichnis, je Kapitel eine neue Seite, gleiche Lesedarstellung wie am Bildschirm.
- **Druck-CSS:** Navigation, Schaltflächen, Rückmeldungsbereich und Einführung entfallen; schwarz auf weiß; Schritte mit leeren Kästchen zum Abhaken auf Papier; keine Seitenumbrüche in Listeneinträgen und Hinweisen.
- **PDF:** über „Als PDF speichern“ im Druckdialog des Browsers – ohne zusätzliche Serverkomponente. Der Word-/PDF-Export für die Veröffentlichung (ADR-038) bleibt davon unberührt.
