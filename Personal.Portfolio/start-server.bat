@echo off
title Personal Portfolio - Local Web Server
echo ========================================================
echo   TAMANNAAH BHATIA - PERSONAL PORTFOLIO
echo   Localhost Development Server
echo ========================================================
echo   Opening: http://localhost:8000/
echo   Press Ctrl + C in this terminal window to stop.
echo ========================================================
start http://localhost:8000/
python -m http.server 8000
pause
