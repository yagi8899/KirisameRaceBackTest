@echo off
echo ========================================
echo  Kirisame Race BackTest - Frontend
echo ========================================
echo.
echo Starting frontend development server...
echo.

cd /d "%~dp0frontend"

REM npm devサーバー起動
echo Frontend server starting on http://localhost:5174
echo Press Ctrl+C to stop the server
echo.
npm run dev

pause
