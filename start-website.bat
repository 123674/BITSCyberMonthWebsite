@echo off
title Cyber Month website (keep this window open)
cd /d "%~dp0"

echo Starting the database...
call npx prisma dev start cybermonth

echo.
echo Starting the website at http://localhost:3000
echo KEEP THIS WINDOW OPEN - closing it stops the website.
echo.
call npm run dev
pause
