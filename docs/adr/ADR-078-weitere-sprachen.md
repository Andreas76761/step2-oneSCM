# ADR-078 Alle Projektsprachen vollständig beschriftet

**Status:** akzeptiert, umgesetzt in Etappe 26 (erweitert ADR-074, ADR-020)

## Kontext
Seit Etappe 25 erschienen Leseransicht, Druck und Online-Hilfe in fünf Sprachen; Niederländisch, Polnisch, Tschechisch und Portugiesisch fielen auf Englisch zurück, Abschnittstitel übersetzter Kapitel sogar auf Deutsch.

## Entscheidung
- **Beschriftungen** der Leseransicht und des Drucks (Wörterbuch `readerText.ts`) und der Online-Hilfe für alle neun Sprachen des Projekts: de, en, fr, es, it, nl, pl, cs, pt. Englisch bleibt Rückfall nur für unbekannte Sprachcodes.
- **Abschnittstitel** (Zweck, Schrittweise Durchführung, …) übersetzter Kapitel in allen acht Zielsprachen (`SECTION_TITLES`).
- Sprachabhängige Formulierungen ohne Zahl-Grammatik-Fehler: bei Polnisch und Tschechisch Zähltexte als „Bezeichnung: n“; landesübliche Anführungszeichen und Datumsformate je Sprache.
- Die Übersetzungen der Beschriftungen sind fachlich vorbereitet; vor dem produktiven Einsatz sollten Muttersprachler sie gegenlesen.
