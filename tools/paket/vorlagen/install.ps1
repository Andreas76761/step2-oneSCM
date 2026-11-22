# Abhängigkeiten installieren (nur im Paket ohne node_modules nötig). Braucht Node.js 22.15+ (22 oder 24 LTS) und Zugang zum npm-Registry.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$node = Join-Path $PSScriptRoot 'node\node.exe'
if (Test-Path $node) { $env:Path = (Join-Path $PSScriptRoot 'node') + ';' + $env:Path }
$v = (node -v).TrimStart('v').Split('.')
if ([int]$v[0] -lt 22 -or ([int]$v[0] -eq 22 -and [int]$v[1] -lt 15)) { throw "Node.js $(node -v) ist zu alt – bitte Node.js 22 LTS (mindestens 22.15) oder 24 LTS installieren." }
# ohne Installationsskripte: better-sqlite3 (ab 13) bringt die Binärdateien in prebuilds\ mit; sein node-gyp-Leerlauf
# bräuchte sonst Python, Visual Studio Build Tools und die Node-Header aus dem Netz
npm ci --omit=dev --workspace apps/server --include-workspace-root --ignore-scripts
if ($LASTEXITCODE -ne 0) { throw 'npm ci fehlgeschlagen – Proxy prüfen: npm config set proxy http://<proxy>:<port> und npm config set https-proxy http://<proxy>:<port>' }
Write-Host 'Fertig. Starten mit start.cmd oder .\start.ps1'
