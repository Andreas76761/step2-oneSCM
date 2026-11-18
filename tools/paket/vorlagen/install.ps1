# Abhängigkeiten installieren (nur im Paket ohne node_modules nötig). Braucht Node.js 22.13+ (22 oder 24 LTS) und Zugang zum npm-Registry.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$node = Join-Path $PSScriptRoot 'node\node.exe'
if (Test-Path $node) { $env:Path = (Join-Path $PSScriptRoot 'node') + ';' + $env:Path }
$v = (node -v).TrimStart('v').Split('.')
if ([int]$v[0] -lt 22 -or ([int]$v[0] -eq 22 -and [int]$v[1] -lt 13)) { throw "Node.js $(node -v) ist zu alt – bitte Node.js 22 LTS (mindestens 22.13) oder 24 LTS installieren." }
npm ci --omit=dev --workspace apps/server --include-workspace-root
if ($LASTEXITCODE -ne 0) { throw 'npm ci fehlgeschlagen – Proxy prüfen: npm config set proxy http://<proxy>:<port> und npm config set https-proxy http://<proxy>:<port>' }
Write-Host 'Fertig. Starten mit start.cmd oder .\start.ps1'
