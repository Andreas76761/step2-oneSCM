# Batch 1040 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation**

Die Funktion „Contract Generation" richtet sich an Endkunden und Händler. Sie unterstützt dabei, die für ein Fahrzeug verfügbaren Produkte zu visualisieren, Empfehlungen zu personalisieren und die Vertragserstellung zu vereinfachen. Auf diese Weise wird die oft komplexe Auswahl des passenden Produkts erleichtert und ein unkompliziertes Besitzererlebnis unterstützt. Auch Vertriebsmitarbeitende können die verfügbaren Servicevertragsprodukte samt Preisen für ein bestimmtes Fahrzeug oder Fahrzeugmodell einsehen, ein Produkt auswählen und einen Servicevertrag für den Kunden anlegen. Die Funktion wurde in oneSCM neu entwickelt.

Damit andere Systeme (sogenannte konsumierende Systeme) mit oneSCM zusammenarbeiten können, stehen mehrere Schnittstellen (APIs) zur Verfügung.

**Vertrag anlegen**

Über die Schnittstelle zum Anlegen eines Vertrags können konsumierende Systeme in oneSCM einen Servicevertrag erstellen. Der Vertrag wird angelegt, sobald alle Pflichtfelder übermittelt wurden, und erhält zunächst den Status „created". Fehlen Pflichtfelder, enthält die Antwort der Schnittstelle eine Fehlermeldung.

**Vertragsstatus aktualisieren**

Ein Servicevertrag durchläuft bis zu seiner Aktivierung mehrere Status, von denen einige auch durch konsumierende Systeme aktualisiert werden sollen. Dafür gibt es eine Schnittstelle zur Statusänderung, damit der tatsächliche Status eines Vertrags auch in oneSCM abgebildet wird. Folgende Statuswechsel sind möglich: von „created" zu „confirmed", von „created" zu „declined", von „confirmed" zu „active", von „active" zu „suspended" sowie von „suspended" zu „active".

Der Wechsel von „active" zu „terminated" ist derzeit nicht über diese Schnittstelle möglich, da hierfür weitere Datenfelder erforderlich sind, die in der Endpunktdefinition noch nicht enthalten sind. Ob dafür ein eigener Endpunkt vorgesehen wird oder der Statusendpunkt wiederverwendet werden kann, ist noch zu klären.

Statuswechsel, die im Vertragsstatusmodell nicht definiert sind, werden abgelehnt; das konsumierende System erhält in diesen Fällen eine Fehlermeldung. Alle Statusänderungen werden in der Vertragshistorie dokumentiert. Außerdem erhält das System VEGA über die Schnittstelle I155 eine Information über die für VEGA relevanten Statusänderungen, nämlich den Wechsel zu „active" und den Wechsel zu „suspended".

**Vertragsdokumente abrufen**

Konsumierende Systeme können über eine weitere Schnittstelle alle zu einem Servicevertrag gehörenden Dokumente abrufen, um sie den eigenen Anwendern bereitzustellen. Dazu zählen der Vertrag selbst, die Geschäftsbedingungen und das SEPA-Mandat sowie weitere zugehörige Vertragsdokumente. Die Antwort der Schnittstelle enthält einen Link zu den Dokumenten, sodass das konsumierende System direkt auf die Dokumente auf der Dateiablage zugreifen kann; die Dokumente selbst müssen nicht in der Antwort übertragen werden. Zusätzlich wird die Version der Dokumente angegeben.