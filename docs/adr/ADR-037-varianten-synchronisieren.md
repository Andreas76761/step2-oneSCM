# ADR-037 Varianten synchronisieren

**Status:** akzeptiert, umgesetzt in Etappe 13

## Kontext
Markt- und Rollenvarianten entstehen oft aus einer Blueprint-Gliederung. Kommen im Blueprint neue Inhalte oder Kapitel hinzu, müssen sie gezielt in die Varianten übernommen werden – ohne marktspezifische Inhalte der Variante zu überschreiben.

## Entscheidung
- **Abgleich** zweier Gliederungen (`GET /outlines/{ziel}/sync?from={quelle}`): Einträge werden in derselben Gliederungsfamilie über die stabile Kennung (`node_key`), sonst über den Titel zugeordnet (Nummern und Schreibweise ignoriert, Unterkapitel nur unter dem zugeordneten Kapitel, mehrdeutige Titel nicht).
- Je Eintrag: **nur in der Quelle** (übernehmbar – mit Prüfung gegen die Variante des Ziels: Rolle, Sparte, Blueprint/Märkte, aktuelle Revision), **nur im Ziel** (bleibt unverändert, z. B. marktspezifisch), **gemeinsam**; außerdem **fehlende Einträge**. Schnipsel, die im Ziel schon an anderer Stelle hängen, werden nur angezeigt.
- **Übernehmen** (`POST /outlines/{ziel}/sync`): ausgewählte Schnipsel an den zugeordneten Eintrag anhängen; fehlende Einträge anlegen (Kapitel vor Unterkapiteln, Unterkapitel unter dem zugeordneten bzw. mit angelegten Kapitel) samt ausgewählter Schnipsel. Es wird nur ergänzt, nie gelöscht. Ein Vorgang, ein Audit-Eintrag `outline.synced`.
- In der Oberfläche im Draft Manual: „Mit anderer Gliederung abgleichen“, Vorauswahl = passende Schnipsel und alle fehlenden Einträge. Danach erzeugt „Kapitel für Freigabe erzeugen“ (ADR-034) neue Kapitelentwürfe.

## Konsequenzen
- Änderungen am Text eines Schnipsels kommen über neue Quellrevisionen; der Abgleich arbeitet auf Zuordnungen, nicht auf freigegebenen Kapiteltexten.
- Umbenannte Einträge verschiedener Gliederungen werden über den Titel nicht erkannt und erscheinen als „fehlt im Ziel“.
