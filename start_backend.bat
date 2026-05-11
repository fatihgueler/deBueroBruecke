@echo off
chcp 65001 >nul
title BüroBrücke – Backend

:: Verzeichnis dieses Scripts (= debuerobruecke/)
set SCRIPT_DIR=%~dp0

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   BüroBrücke – Backend starten       ║
echo  ╚══════════════════════════════════════╝
echo.

:: Python-Venv suchen
set VENV=%SCRIPT_DIR%backend\.venv
if not exist "%VENV%\Scripts\activate.bat" (
    echo [INFO] Virtuelle Umgebung wird erstellt...
    python -m venv "%VENV%"
)

:: Aktivieren
call "%VENV%\Scripts\activate.bat"

:: Abhängigkeiten installieren
echo [INFO] Abhängigkeiten prüfen / installieren...
pip install -r "%SCRIPT_DIR%backend\requirements.txt" --quiet

:: WICHTIG: aus debuerobruecke/ starten, nicht aus backend/
:: (wegen: from backend.xxx import ... in database.py, auth.py usw.)
echo.
echo [OK] Backend startet auf http://localhost:8000
echo [OK] API-Doku: http://localhost:8000/docs
echo.
cd /d "%SCRIPT_DIR%"
python -m uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
pause
