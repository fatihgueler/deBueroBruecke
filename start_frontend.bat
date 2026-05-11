@echo off
chcp 65001 >nul
title BüroBrücke – Frontend

set SCRIPT_DIR=%~dp0
set NODE_DIR=%SCRIPT_DIR%node\node-v20.18.0-win-x64

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   BüroBrücke – Frontend starten      ║
echo  ╚══════════════════════════════════════╝
echo.

:: Node zum PATH hinzufügen
set PATH=%NODE_DIR%;%PATH%

:: node_modules prüfen
if not exist "%SCRIPT_DIR%frontend\node_modules" (
    echo [INFO] npm install wird ausgeführt...
    cd /d "%SCRIPT_DIR%frontend"
    npm install
)

echo.
echo [OK] Frontend startet auf http://localhost:5173
echo.
cd /d "%SCRIPT_DIR%frontend"
npm run dev
pause
