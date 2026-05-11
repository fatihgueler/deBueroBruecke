@echo off
chcp 65001 >nul
title BüroBrücke

echo.
echo  =======================================
echo   BUROBRUCKE wird gestartet...
echo  =======================================
echo.

:: Backend in eigenem Fenster starten
start "Backend" "%~dp0_backend_run.bat"

:: 6 Sekunden warten bis Backend hochgefahren ist
echo Warte auf Backend...
timeout /t 6 /nobreak >nul

:: Frontend in eigenem Fenster starten
start "Frontend" "%~dp0_frontend_run.bat"

:: Weitere 5 Sekunden warten bis Vite bereit ist
echo Warte auf Frontend...
timeout /t 5 /nobreak >nul

:: Browser öffnen
echo Öffne Browser...
start http://localhost:5173

echo.
echo  Fertig! App läuft unter http://localhost:5173
echo  Dieses Fenster kann geschlossen werden.
echo.
timeout /t 3 /nobreak >nul
