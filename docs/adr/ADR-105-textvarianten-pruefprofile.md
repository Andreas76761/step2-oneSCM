# ADR-105 Textvarianten je Kapitel und vier Prüferprofile

**Status:** akzeptiert, umgesetzt in Etappe 52. Umfasst S-05 und W-12 aus docs/10. Erweitert ADR-085 (Quick Guide, One Pager, Lesefassung), ADR-097 (Lesbarkeit), ADR-103 (Kapitelbewertung) und ADR-104 (Änderungsvorschläge).

## Kontext
Zwei Wünsche aus dem Ticket-Cockpit richten sich nach der Zielgruppe:
- **Textvarianten je Kapitel (S-05):** Endanwender, Fachtext und eine Kurzfassung für das Management (etwa ein Viertel der Länge). Bisher gab es Quick Guide, One Pager und Lesefassung im Export, aber keine Kurzfassung und keine Ansicht der Varianten nebeneinander.
- **Vier Prüferprofile (W-12):** fachlich, Redaktion, Compliance, Endanwender mit lokalem Modell. Bisher gab es die Prüfungen einzeln (Evidenz, Stil, Anleitungs-Check, Datenschutz, Lesbarkeit), aber keinen Blick je Prüferrolle.

Beide sind in docs/10 als „optional“ empfohlen. Der Auftraggeber hat „weiter mit der nächsten Etappe“ gewünscht; Punkte mit offener Entscheidung bleiben offen (G-04, weitere Märkte, Schreibweise offener Begriffe, O-09).

## Entscheidung

**Textvarianten (S-05)**
- Drei Fassungen je Kapitelversion, jedes Mal aus dem aktuellen Stand berechnet (nicht gespeichert):
  - **Fachtext:** alle Abschnitte ohne Lücken, mit Rollen, Zuständigkeiten, Geltungsbereich und Quellen- und Freigabestatus.
  - **Endanwender:** Zweck, Voraussetzungen, Schritte, Ergebnis, Hinweise; Warnhinweise aus anderen Abschnitten wandern zu den Hinweisen.
  - **Kurzfassung (Management):** ein Absatz mit etwa einem Viertel der Wörter des Fachtexts.
- Die Kurzfassung entsteht regelbasiert und extraktiv. Sie nimmt der Reihe nach auf:
  1. den ersten Satz des Zwecks (immer),
  2. den ersten Satz des Ergebnisses,
  3. die Warnhinweise („Wichtig: …“),
  4. den Ablauf („Ablauf in 5 Schritten: von … bis …“),
  5. die erste Voraussetzung.

  Jeder Teil kommt nur dazu, solange er ins Budget passt.
- Auf Wunsch schreibt der KI-Dienst die Kurzfassung, mit dem regelbasierten Entwurf als Vorlage. Die regelbasierte Fassung bleibt in drei Fällen:
  - Die KI-Fassung nennt Zahlen oder Kennungen, die nicht im Kapitel stehen.
  - Sie ist länger als 40 % des Fachtexts.
  - Die Antwort ist nicht lesbar.

  Bei einem externen Dienst und möglichen personenbezogenen Daten wird die KI-Fassung gesperrt.
- Jede Variante zeigt ihre Wortzahl und ihren Anteil am Fachtext und lässt sich als Markdown herunterladen. Der Export hat das Ausgabeprofil „Kurzfassung“ (je Kapitel ein Absatz).

**Prüferprofile (W-12)**
- Vier Profile, je mit eigenem Blick. Die Regeln nutzen die vorhandenen Prüfungen:
  - **Fachlich:** Plausibilität je Aussage (Widerspruch hoch, unbelegt und fehlend mittel) und Zahlen oder Kennungen ohne Quelle (hoch).
  - **Redaktion:** Warnungen der Stilprüfung (gering) und offene Punkte des Anleitungs-Checks außer Abkürzungen und Warnhinweis-Schema.
  - **Compliance:**
    - mögliche personenbezogene Daten (hoch);
    - Zusagen wie „garantiert“, „fehlerfrei“, „risikolos“, „rechtssicher“ oder pauschales „immer/nie“ (mittel);
    - folgenreiche Aktionen in den Schritten (löschen, kündigen, endgültig, überschreiben …), wenn das Kapitel keinen Warnhinweis hat (hoch);
    - Warnhinweis-Schema (mittel).
  - **Endanwender:**
    - Sollwerte der Lesbarkeit für Endanwender (mittel);
    - unerklärte Abkürzungen;
    - Sätze über 25 Wörter (mittel);
    - Fachjargon wie Backend, Payload, Queue oder API (gering).
- Wert je Profil: 100 minus 15 je hohem, 7 je mittlerem und 3 je geringem Fund. Ampel wie bei der Kapitelbewertung (grün ab 80, gelb ab 60).
- Auf Wunsch ergänzt der KI-Dienst je Profil Funde (Absatz, Zitat, Mangel, Vorschlag, Schweregrad). Die regelbasierten Funde gehen als bekannt mit, damit er sie nicht wiederholt.
  - Es zählen nur Funde zu Absätzen des Kapitels.
  - Bei einem externen Dienst und möglichen personenbezogenen Daten bleibt es bei den Regeln.
- Jede Prüfung wird je Profil gespeichert (Verlauf der Werte je Kapitelversion). Prüfen erfordert die Berechtigung „Bearbeiten“, Lesen genügt für Ergebnisse.

## Begründung
- Die Varianten nutzen den einen freigegebenen Inhalt; es entstehen keine Abschriften, die auseinanderlaufen.
- Die extraktive Kurzfassung erfindet nichts. Die Prüfung auf neue Zahlen schützt auch die KI-Fassung vor erfundenen Fakten.
- Die Prüferprofile ordnen die vorhandenen Prüfungen nach Rolle, damit Fachbereich, Redaktion, Compliance und eine Testperson aus der Zielgruppe ihre Punkte direkt sehen. Die Daten bleiben lokal.

## Folgen
- Migration 058: `profile_reviews`.
- Neue Schnittstellen:
  - `GET /chapter-versions/{id}/text-variants` und `GET /chapter-versions/{id}/text-variants/{code}/download`;
  - `GET /review-profiles`, `GET`/`POST /chapter-versions/{id}/profile-reviews`;
  - Ausgabeprofil `summary` in `POST /exports`.
- Seiten „Textvarianten“ (Veröffentlichen) und „Prüferprofile“ (Prüfen).
- Grenzen:
  - Die Kurzfassung ist extraktiv; Übergänge zwischen den Sätzen können holprig wirken.
  - Die Liste des Fachjargons und der Zusagen ist fest; ein Begriff, der in oneSCM Teil der Oberfläche ist, kann zu Unrecht gemeldet werden. Die Funde sind Hinweise, keine Sperre.
