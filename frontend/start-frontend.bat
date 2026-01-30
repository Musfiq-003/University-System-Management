@echo off
cd /d "%~dp0"
echo Starting Frontend Server on Port 3002...
npx http-server build -p 3002 -c-1
pause
