@echo off
REM SwiftPDF - Quick Start Script for Local Development
REM This script starts both the backend and frontend servers

echo ========================================
echo   SwiftPDF - Starting Development Servers
echo ========================================
echo.

REM Check if node_modules exist
if not exist "server\node_modules\" (
    echo [ERROR] Server dependencies not installed!
    echo Please run: cd server ^&^& npm install
    pause
    exit /b 1
)

if not exist "client\node_modules\" (
    echo [ERROR] Client dependencies not installed!
    echo Please run: cd client ^&^& npm install
    pause
    exit /b 1
)

echo [1/2] Starting Backend Server (Port 5000)...
start "SwiftPDF Backend" cmd /k "cd server && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Client (Port 5173)...
start "SwiftPDF Frontend" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in each terminal window to stop servers
echo Close this window to continue...
echo.

REM Wait 5 seconds then open browser
timeout /t 5 /nobreak >nul
start http://localhost:5173

pause
