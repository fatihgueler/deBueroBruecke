$dir      = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeDir  = Join-Path $dir "node\node-v20.18.0-win-x64"
$backend  = Join-Path $dir "_backend_run.bat"
$frontend = Join-Path $dir "_frontend_run.bat"

Write-Host ""
Write-Host " BueroBruecke wird gestartet..." -ForegroundColor Cyan
Write-Host ""

# 1. Backend starten
Write-Host "[1/3] Backend wird gestartet..." -ForegroundColor Yellow
Start-Process "cmd.exe" -ArgumentList "/k `"$backend`""

# 2. Warten bis Backend bereit
Write-Host "[2/3] Warte auf Backend..." -ForegroundColor Yellow
$ready = $false
for ($i = 1; $i -le 40; $i++) {
    Start-Sleep 1
    try {
        $r = Invoke-WebRequest "http://127.0.0.1:8000/api/health" `
            -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
        if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
    if ($i % 5 -eq 0) { Write-Host "   ...warte ${i}s" }
}

if (-not $ready) {
    Write-Host ""
    Write-Host " FEHLER: Backend konnte nicht gestartet werden." -ForegroundColor Red
    Write-Host " Pruefe das Backend-Fenster auf Fehlermeldungen."
    Read-Host " Enter druecken zum Beenden"
    exit 1
}
Write-Host " Backend bereit!" -ForegroundColor Green

# 3. Frontend starten
Write-Host "[3/3] Frontend wird gestartet..." -ForegroundColor Yellow
Start-Process "cmd.exe" -ArgumentList "/k `"$frontend`""

for ($i = 1; $i -le 25; $i++) {
    Start-Sleep 1
    $conn = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
    if ($conn) { break }
    if ($i % 5 -eq 0) { Write-Host "   ...warte ${i}s" }
}

# 4. Browser öffnen
Start-Sleep 1
Write-Host " Browser wird geöffnet..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host " App laeuft: http://localhost:5173" -ForegroundColor Green
Write-Host " Dieses Fenster kann geschlossen werden."
Write-Host ""
Start-Sleep 4
