# Sicherung der Daten (Datenbank und Dateien) als ZIP: .\backup.ps1 [-Ziel sicherung.zip]
param([string]$Ziel = "sicherung-$(Get-Date -Format yyyyMMdd-HHmm).zip")
$ErrorActionPreference = 'Stop'
$node = Join-Path $PSScriptRoot 'node\node.exe'
if (-not (Test-Path $node)) { $node = 'node' }
$env:DATA_DIR = Join-Path $PSScriptRoot 'daten'
& $node (Join-Path $PSScriptRoot 'apps\server\dist\cli.js') backup --out $Ziel
