-- Etappe 38 / M6: Video (MP4) und Untertitel (WebVTT, SRT) einlesen (ADR-090)
-- Neue Formate auch in gespeicherten Importeinstellungen erlauben, sofern dort die frühere Standardliste steht
UPDATE settings SET value = REPLACE(value, '".pptx",".pdf"]', '".pptx",".pdf",".mp4",".vtt",".srt"]')
  WHERE key = 'import' AND value LIKE '%"allowedExtensions":[".md",".markdown",".zip",".html",".htm",".docx",".xml",".csv",".pptx",".pdf"]%';
