# oneSCM Handbook Studio starten (Windows). Aufruf: Doppelklick auf start.cmd oder in PowerShell: .\start.ps1 [-Port 3000] [-OhneBeispieldaten]
param([int]$Port = 3000, [switch]$OhneBeispieldaten)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$daten = Join-Path $root 'daten'
# Beim ersten Start: Beispieldaten übernehmen (fiktive Inhalte), sonst leerer Bestand
if (-not (Test-Path $daten)) {
  $beispiel = Join-Path $root 'beispieldaten'
  if ((Test-Path $beispiel) -and -not $OhneBeispieldaten) { Copy-Item $beispiel $daten -Recurse; Write-Host 'Beispieldaten übernommen.' }
  else { New-Item -ItemType Directory $daten | Out-Null }
}
$node = Join-Path $root 'node\node.exe'
if (-not (Test-Path $node)) { $node = 'node' }
try { $v = & $node -v } catch { throw 'Node.js nicht gefunden. Bitte Node.js 22 LTS installieren (https://nodejs.org) oder das Windows-Paket mit Node verwenden.' }
if (-not (Test-Path (Join-Path $root 'node_modules'))) { throw 'Abhängigkeiten fehlen – bitte zuerst .\install.ps1 ausführen.' }
$env:DATA_DIR = $daten
$env:PORT = "$Port"
if (-not $env:AUTH_MODE) { $env:AUTH_MODE = 'demo' }
Write-Host "oneSCM Handbook Studio startet mit Node $v – http://localhost:$Port (Beenden mit Strg+C)"
Start-Job -ScriptBlock { param($p) for ($i = 0; $i -lt 60; $i++) { try { Invoke-WebRequest -UseBasicParsing "http://localhost:$p/api/v1/health" | Out-Null; Start-Process "http://localhost:$p"; break } catch { Start-Sleep 1 } } } -ArgumentList $Port | Out-Null
Set-Location $root
& $node 'apps\server\dist\index.js'
