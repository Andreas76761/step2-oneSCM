# ADR-054 Leseransicht und Rückmeldungen von Lesern

**Status:** akzeptiert, umgesetzt in Etappe 19

## Kontext
Redakteurinnen und Redakteure sehen Kapitel in Werkstatt und Freigabe – nie so, wie Leser sie nutzen. Ob eine Anleitung wirklich hilft, erfährt man nur von den Lesern selbst.

## Entscheidung
- **Leseransicht** (`/lesen`, Menü „4 Veröffentlichen“): Inhaltsverzeichnis mit Filter, Kapitel in Lesedarstellung (größere Schrift, Abschnitte, Hinweise/Tipps/Warnungen hervorgehoben, Verwaltungsabschnitt und Lückenhinweise ausgeblendet). Nummerierte Schritte lassen sich abhaken (Stand je Browser). Standard ist die jeweils freigegebene Version; „Entwürfe einblenden“ zeigt die neueste Version mit Kennzeichnung.
- **„War dieses Kapitel hilfreich?“** (Ja/Nein, bei Nein optional „Was hat gefehlt?“): `POST /chapters/{id}/feedback` mit Leserecht; eine offene Rückmeldung je Person und Version (erneutes Abstimmen ersetzt sie). Tabelle `chapter_feedback`.
- **Redaktion:** Kritik oder Kommentar erzeugt einen Hinweis (Aufgaben & Hinweise) für Autorin/Autor bzw. Einreichende der neuesten Version. Der Anleitungs-Check zeigt je Kapitel 👍/👎 und offene Rückmeldungen; „Erledigt“ (`PATCH /feedback/{id}`, Bearbeitungsrecht). Die Startseite nennt offene Rückmeldungen.

## Konsequenzen
- Rückmeldungen erfordern eine Anmeldung (keine anonymen Stimmen); für die öffentliche Online-Hilfe (ADR-018) bleibt das Feedback außen vor.
