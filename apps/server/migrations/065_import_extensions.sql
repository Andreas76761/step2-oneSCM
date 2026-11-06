-- Etappe 95 (Code-Review der Etappen 27–41): Importeinstellungen, die vor v0.29 gespeichert wurden, tragen noch die
-- frühere Standardliste bis „.docx“. Die Migrationen 041 und 045 erweitern nur spätere Listen – ohne diese Zeile blieben
-- Jira (.xml, .csv), PowerPoint, PDF, Video und Untertitel dort gesperrt (415).
UPDATE settings SET value = REPLACE(value, '"allowedExtensions":[".md",".markdown",".zip",".html",".htm",".docx"]',
  '"allowedExtensions":[".md",".markdown",".zip",".html",".htm",".docx",".xml",".csv",".pptx",".pdf",".mp4",".vtt",".srt"]')
  WHERE key = 'import' AND value LIKE '%"allowedExtensions":[".md",".markdown",".zip",".html",".htm",".docx"]%';
