@echo off
chcp 65001 >nul
title BüroBrücke Frontend :5173
set "NODE_DIR=%~dp0node\node-v20.18.0-win-x64"
set "PATH=%NODE_DIR%;%PATH%"
cd /d "%~dp0frontend"
echo.
echo  Frontend laeuft auf http://localhost:5173
echo.
npm run dev
pause
