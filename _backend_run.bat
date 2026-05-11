@echo off
chcp 65001 >nul
title BüroBrücke Backend :8000
cd /d "%~dp0"
echo Installiere Pakete...
python -m pip install -r backend\requirements.txt -q --upgrade
echo.
echo  Backend laeuft auf http://localhost:8000
echo  API-Doku:  http://localhost:8000/docs
echo.
python -m uvicorn backend.main:app --reload --port 8000 --host 0.0.0.0
pause
