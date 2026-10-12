# Batch 1132 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Interne Benachrichtigung bei Preisversionen und Kampagnen zur Freigabe**

Für die Freigabe von Preisversionen und Kampagnen steht künftig eine interne Benachrichtigung zur Verfügung. Sie informiert Marktnutzer, sobald eine neue Preisversion oder Kampagne zur Prüfung und Freigabe bereitsteht. Bisher gab es eine solche Benachrichtigung nur für Sonderfälle und manuelle Rechnungen. Der Ablauf orientiert sich nun an diesen bestehenden Prozessen. Die Funktion richtet sich an Nutzer mit den Rollen MPC und MO.

Reicht ein Benutzer eine Kampagne oder Preisversion zur Prüfung ein, erzeugt das System automatisch eine Benachrichtigung für die Rollen MPC und MO. Diese erscheint am Glockensymbol in der Kategorie „Products and Prices" mit dem Hinweis, dass mehrere Kampagnen bzw. Preisversionen geprüft werden müssen. Ein Klick auf die Benachrichtigung führt direkt zur passenden Seite, also zur Product Overview Page bei Preisversionen oder zur Campaign Overview Page bei Kampagnen. Die Seite ist bereits so gefiltert, dass nur die zu prüfenden Objekte angezeigt werden. Ein blauer Punkt kennzeichnet sie zusätzlich. Dadurch erkennen Nutzer schnell, wo Handlungsbedarf besteht. Nutzer ohne die Rolle MPC oder MO erhalten keine Benachrichtigung.

Lehnt ein Prüfer eine Kampagne oder Preisversion ab, steht ihm ein optionales Kommentarfeld für die Begründung zur Verfügung. Der Kommentar wird gespeichert und in der Historie des jeweiligen Objekts angezeigt. Die Länge des Kommentars ist begrenzt (als Beispiel ist 500 Zeichen genannt). Wird die Grenze überschritten, kann die Ablehnung nicht abgeschickt werden. Nach der Aktion des Prüfers erhält der Einreicher über das Glockensymbol eine Rückmeldung zum Status, also ob die Objekte beispielsweise freigegeben oder abgelehnt wurden. Bearbeitete Objekte verbleiben nicht in der Liste der Benachrichtigungen.

**Kampagnenerweiterung: Auswahl bestimmter Baumuster bzw. Modellcodes aus Clustern**

Beim Anlegen einer Kampagne kann der MPC nun gezielt einzelne Baumuster bzw. Modellcodes aus einem vorhandenen Cluster auswählen. Die Kampagne wird dadurch nur für die ausgewählten Fahrzeuge auf Seiten der Generation angewendet.

Im zweiten Schritt, „Discounted Products and Vehicles", werden dem Nutzer alle Codes und Modellcodes angezeigt, die dem gewählten Cluster zugeordnet sind. Er kann diese einzeln auswählen oder abwählen. Die Kampagne gilt nur für die ausgewählten Codes. Der erste Schritt, das Kampagnen-Setup, bleibt unverändert. Im dritten Schritt, der Kampagnenzusammenfassung, werden vor dem Abschluss ausschließlich die ausgewählten Codes und Modellcodes aufgelistet. An den nachgelagerten Ablauf werden nur diese ausdrücklich ausgewählten Kennungen übergeben. Die Generation wendet die Kampagne ausschließlich auf die empfangenen Fahrzeugkennungen an und ignoriert nicht ausgewählte Codes.

Für bereits bestehende Kampagnen und Cluster werden im Zuge der Migration automatisch alle zugehörigen Modellcodes als ausgewählt markiert.

**Prüfung von OTR-Fahrzeugen: Einzelnes Geschäft für die Generierung**

Bei der Prüfung von OTR-Fahrzeugen ermittelt das System anhand der Deal-ID aus OTR die Anzahl der Fahrzeuge pro Deal. Ist genau ein Fahrzeug vorhanden, ist die Prüfung erfolgreich. Sind es mehr als ein Fahrzeug, erscheint eine Fehlermeldung, und es wird kein Produkt an die Generation gesendet. Sind es null Fahrzeuge, wird ebenfalls ein Fehler mit dem Hinweis ausgegeben, dass dem Deal kein Fahrzeug zugeordnet ist.

**Zahlungsintervalle bei Einzel- und Massenanlage**

Es wird geprüft, dass alle Zahlungsintervalle sowohl bei der Einzelanlage als auch bei der Massenanlage von Verträgen unterstützt werden.