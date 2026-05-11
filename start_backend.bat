@echo off
chcp 65001 >nul
title BüroBrücke – Backend

set SCRIPT_DIR=%~dp0

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   BüroBrücke – Backend              ║
echo  ╚══════════════════════════════════════╝
echo.

cd /d "%SCRIPT_DIR%"

echo [1/2] Pakete installieren / aktualisieren...
python -m pip install -r backend\requirements.txt --quiet --upgrade

echo [2/2] Backend startet auf http://localhost:8000
echo.
python -m uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
pause
