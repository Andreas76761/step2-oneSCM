# ADR-025 Mehrstufige Freigabe

**Status:** akzeptiert, umgesetzt in Etappe 9 (erweitert E-12)

## Kontext
E-12 legte eine einstufige Freigabe ohne Ausnahmen fest. Für regulierte Inhalte werden mehrere Prüfungen nacheinander (z. B. Fachprüfung → Redaktion → Compliance), das Vier-Augen-Prinzip und Fristen benötigt.

## Entscheidung
- **Workflow je Projekt** (`projects.approval_workflow`, Migration `015`): bis zu 6 Stufen mit Name, Zuständigen (leer = alle mit Berechtigung `approve`), Mindestanzahl Zustimmungen und optionaler Frist in Tagen; Schalter **Vier-Augen-Prinzip** (Standard an). Ohne Festlegung gilt unverändert die einstufige Freigabe (E-12).
- **Schnappschuss:** Beim Einreichen speichert die Version den Workflow (`generated_chapter_versions.workflow`); spätere Änderungen gelten nur für neue Einreichungen.
- **Ablauf:** `POST /chapter-versions/{id}/approve` verbucht eine Zustimmung in der aktuellen Stufe. Ist die Mindestanzahl erreicht, beginnt die nächste Stufe (neue Frist), nach der letzten Stufe ist die Version freigegeben. Eine Ablehnung in jeder Stufe führt zurück in den Entwurf; Zurückziehen setzt den Workflow zurück. Das Qualitätsgate wird bei jeder Zustimmung geprüft.
- **Vier-Augen-Prinzip:** Die einreichende Person entscheidet nicht; niemand stimmt derselben Einreichung zweimal (in zwei Stufen) zu. Beim Speichern wird geprüft, dass die Stufen zusammen genügend verschiedene Zuständige haben (bipartites Matching) – sonst 400.
- **Gleichzeitige Zustimmungen** werden serialisiert: Die Version wird gesperrt (PostgreSQL `FOR UPDATE`), Stand und Zuständigkeit werden in der Transaktion erneut gelesen.
- **Hinweise** über die bestehende Kollaboration (ADR-019): Systemkommentar am Kapitel mit Benachrichtigung (In-App, Webhook, E-Mail) an die Zuständigen der neuen Stufe, bei Ablehnung an die einreichende Person.
- **Frist und Eskalation:** Stündlicher Hintergrundjob `approval-escalation` meldet überfällige Stufen einmalig an Zuständige und Projektadministration.
- **Offene Entscheidungen** je Person: `GET /approvals/pending`.
- `approvals.stage` und `approvals.final`: Die Analytik (ADR-023) zählt nur abschließende Entscheidungen (Ablehnung oder letzte Zustimmung).

## Konsequenzen
- Bestehende Projekte verhalten sich unverändert; der Workflow wird auf der Seite „Freigabe“ von der Administration gepflegt.
- Ausnahmen (Eilfreigabe, Überspringen von Stufen) sind bewusst nicht vorgesehen.
