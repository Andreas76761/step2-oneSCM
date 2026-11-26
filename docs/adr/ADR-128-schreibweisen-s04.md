# ADR-128 Schreibweisen aus S-04: Kulanzfrist, Fahrgestellnummer, FI-Beleg, Belegart, Systemnamen

**Status:** akzeptiert, umgesetzt in Etappe 111. Schließt S-04 aus docs/10 ab. Erweitert ADR-110 (UI-Begriffe in der Terminologie).

## Kontext
Nach ADR-110 blieben in `SYNONYME.csv` acht Zeilen mit Status „offen“:
- die Schreibweise der Systemnamen (Nemesis/NEMESIS, VeDoc/VeDOC, CoFiCo/COFICO, oneERP/One-ERP);
- der deutsche Begriff für „Grace Period“;
- „Status FI-Beleg“ oder „Status FI-Dokument“, „Belegart“ oder „Dokumenttyp“;
- „Chassis Number“: Eine Prüfregel lehnte den Begriff ab, die Whitelist des Releaseletters schützte ihn.

Entscheidung des Auftraggebers vom 08.11.2026:
- „**Kulanzfrist**“ im Fließtext; „Grace Period“ nur in Menüpfaden und als UI-Begriff in Anführungszeichen; „Karenzzeit“ nicht verwenden.
- „**Fahrgestellnummer**“ im deutschen Fließtext; „Chassis Number“ nur in Menüpfaden, als Feldname in Anführungszeichen und in englischen Texten.
- „**Status FI-Beleg**“ und „**Belegart**“ (deutsche SAP-Schreibweise) statt „Status FI-Dokument“ und „Dokumenttyp“.
- Systemnamen **wie in der Oberfläche**.

## Entscheidung
- **Systemnamen:** Die einzige Quelle aus der Oberfläche ist das Navigationsdokument (`Navigation_oneSCM_Version3.docx`, Menü „Nemesis“, „Finance › oneERP Checks“). Danach gilt „**Nemesis**“. Für VeDoc und CoFiCo gibt es keinen Beleg aus der Oberfläche; es gilt die Schreibweise des Systemkatalogs der Gesamtgliederung („**VeDoc**“, „**CoFiCo**“), ebenso „**oneERP**“. Zu vermeiden: NEMESIS, VeDOC, COFICO, One-ERP. Das Label „Systeme › NEMESIS“ heißt jetzt „Nemesis“ (der Katalogabgleich übernimmt das in bestehende Projekte, solange niemand das Label bearbeitet hat).
- **Varianten in Groß-/Kleinschreibung:** Bisher verglich die Terminologie ohne Groß-/Kleinschreibung. Mit „NEMESIS“ als zu vermeidender Variante wäre „Nemesis“ selbst ein Fund gewesen, und die Pflege lehnte den Eintrag ab („Der bevorzugte Begriff darf nicht zugleich zu vermeiden sein“). Jetzt:
  - Eine Variante, die sich vom bevorzugten Begriff nur in Groß-/Kleinschreibung unterscheidet, ist erlaubt; genau gleich bleibt unzulässig.
  - Für solche Varianten ist in Stilprüfung und Analyse jede Schreibweise außer der bevorzugten ein Fund („NEMESIS“, „nemesis“), der bevorzugte Begriff selbst nie (gemeinsame Funktion `avoidMatches`, ergänzt im Code-Review Etappe 112); alle anderen Varianten weiter ohne Groß-/Kleinschreibung.
- **Vorlagen des Arbeitsordners:** `SYNONYME.csv` (alle Zeilen entschieden, „UI-Begriff erlaubt“ bei Kulanzfrist und Fahrgestellnummer), `BEGRIFFE.md`, `GRAMMATIK.md` (G-R4), `CLAUDE.md`, `ENTSCHEIDUNGEN.md`, Agent `sprach-lektor`. Bestehende Arbeitsordner werden beim Abgleich nicht überschrieben; die Redaktion übernimmt die Zeilen dort selbst oder liest die Vorlage über Stammdaten › Glossar ein.

## Begründung
- „Kulanzfrist“ trifft den fachlichen Sinn (Frist, in der Kulanz gewährt wird) und ist im Deutschen geläufig; „Karenzzeit“ ist in Versicherungen anders belegt.
- „Fahrgestellnummer“ verwenden die Demodaten und die bisherigen Kapitel bereits; der Widerspruch Prüfregel ↔ Whitelist löst sich: Im deutschen Text gilt der deutsche Begriff, im englischen Releaseletter bleibt „Chassis Number“.
- Genaue Schreibweise nur bei reinen Groß-/Kleinschreibungs-Varianten: So bleibt die bisherige, nachsichtige Suche für alle übrigen Begriffe („Genehmigung“ am Satzanfang wie im Satz).

## Folgen
- S-04 ist abgeschlossen. Offen bleibt nur U-07 (weitere Sprachen).
- Weicht die Schreibweise von VeDoc oder CoFiCo in der echten Oberfläche ab, genügt eine Zeile in `SYNONYME.csv` bzw. in der Terminologie der App.
