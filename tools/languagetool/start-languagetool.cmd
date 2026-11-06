@echo off
rem LanguageTool als lokaler Java-Dienst (ADR-108, G-04) - nur auf localhost
cd /d "%~dp0"
if "%LT_PORT%"=="" set LT_PORT=8081
if "%LT_MEMORY%"=="" set LT_MEMORY=1g
if "%LT_JAR%"=="" (set CP=lib\*) else (set CP=%LT_JAR%)
java -Xmx%LT_MEMORY% -cp "%CP%" org.languagetool.server.HTTPServer --port %LT_PORT%
