@echo off
echo ================================
echo PDF-Works Quick Setup Script
echo ================================
echo.

REM Check if .env exists in server folder
if not exist "server\.env" (
    echo [1/4] Creating server .env file...
    copy "server\.env.example" "server\.env" >nul 2>&1
    echo       Server .env created! Please edit server\.env with your Supabase credentials.
) else (
    echo [1/4] Server .env already exists.
)

REM Check if .env exists in client folder
if not exist "client\.env" (
    echo [2/4] Creating client .env file...
    copy "client\.env.example" "client\.env" >nul 2>&1
    echo       Client .env created! Please edit client\.env with your Supabase credentials.
) else (
    echo [2/4] Client .env already exists.
)

echo [3/4] Installing server dependencies...
cd server
call npm install
cd ..

echo [4/4] Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo IMPORTANT: Edit the .env files with your Supabase credentials:
echo   - server\.env
echo   - client\.env
echo.
echo To start the application:
echo   1. Open Terminal 1: cd server ^&^& npm run dev
echo   2. Open Terminal 2: cd client ^&^& npm run dev
echo.
echo Or use: npm run dev (if configured in root package.json)
echo.
pause
