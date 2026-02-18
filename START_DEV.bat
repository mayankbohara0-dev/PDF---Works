@echo off
REM SwiftPDF - Robust Start Script
REM This script checks the environment and starts both servers in a single window.
REM If one fails, they both close, making errors visible.

echo ========================================
echo   SwiftPDF - Starting Development System
echo ========================================
echo.

REM 1. Run Environment Check
node check-env.js
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Environment check failed!
    echo Please fix the issues above and try again.
    pause
    exit /b 1
)

REM 2. Start Servers Concurrently
echo.
echo [INFO] Starting servers...
echo frontend: http://localhost:5173
echo backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop all servers.
echo.

npm run dev

echo.
echo [INFO] Servers stopped.
pause
