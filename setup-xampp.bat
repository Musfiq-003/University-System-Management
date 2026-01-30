@echo off
echo ========================================
echo University Management System - XAMPP Setup
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ✅ .env file created!
    echo.
)

echo Checking XAMPP MySQL connection...
node test-mysql-connection.js
if errorlevel 1 (
    echo.
    echo ❌ Cannot connect to MySQL!
    echo Please make sure XAMPP MySQL is running.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ MySQL connection verified!
echo.
echo Starting the server in a new window...
echo.

start "University Management System - Backend" cmd /k "npm start"

echo.
echo ========================================
echo ✅ Server starting in new window!
echo ========================================
echo.
echo Backend API: http://localhost:3000
echo phpMyAdmin: http://localhost/phpmyadmin
echo.
echo To start frontend:
echo   cd frontend
echo   npm install
echo   npm start
echo.
echo Press any key to test the API...
pause >nul

echo.
echo Testing API...
powershell -Command "Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing | Select-Object -ExpandProperty Content"
echo.
echo ✅ Setup complete!
echo.
pause
