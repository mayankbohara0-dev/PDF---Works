@echo off
echo ========================================
echo   PDF-Works - Complete Startup
echo ========================================
echo.
echo Starting both Backend and Frontend...
echo.
echo This will open TWO terminal windows:
echo   1. Backend Server (Port 5000)
echo   2. Frontend Client (Port 5173)
echo.
echo Press Ctrl+C in either window to stop that server.
echo.
pause

cd /d "%~dp0"
start "PDF-Works Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
start "PDF-Works Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Your browser should open automatically.
echo If not, navigate to: http://localhost:5173
echo.
pause
