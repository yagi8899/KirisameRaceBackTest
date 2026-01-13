@echo off
echo ========================================
echo  Kirisame Race BackTest - Backend
echo ========================================
echo.
echo Starting backend server...
echo.

cd /d "%~dp0backend"

REM 仮想環境をアクティベート
call venv\Scripts\activate.bat

REM Uvicornでサーバー起動
echo Backend server starting on http://0.0.0.0:8000
echo Press Ctrl+C to stop the server
echo.
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
