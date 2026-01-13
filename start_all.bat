@echo off
echo ========================================
echo  Kirisame Race BackTest - Full Stack
echo ========================================
echo.
echo Starting backend and frontend servers...
echo.
echo Backend: http://0.0.0.0:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to start both servers...
pause

REM 新しいウィンドウでバックエンドを起動
start "Backend Server" cmd /k "%~dp0start_backend.bat"

REM 2秒待機（バックエンドの起動を待つ）
timeout /t 2 /nobreak >nul

REM 新しいウィンドウでフロントエンドを起動
start "Frontend Server" cmd /k "%~dp0start_frontend.bat"

echo.
echo Both servers are starting in separate windows.
echo Close this window or press any key to exit.
pause
