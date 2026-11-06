@echo off
rem Doppelklick-Start: startet start.ps1, ohne die Ausfuehrungsrichtlinie dauerhaft zu aendern
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
pause
