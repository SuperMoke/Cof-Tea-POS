@echo off
echo Starting CofTea-POS system...

:: Start Frontend in a new window
echo Starting Frontend...
start cmd /k "cd /d C:\CofTea-POS && npm run dev"

:: Wait a moment to ensure frontend starts properly
timeout /t 3 /nobreak

:: Start Backend (PocketBase) in a new window
echo Starting Backend (PocketBase)...
start cmd /k "cd /d C:\CofTea-POS\pocketbase && pocketbase serve --http=0.0.0.0:8090"

:: Wait a moment to ensure backend starts properly
timeout /t 3 /nobreak

:: Start Printer Server in a new window
echo Starting Printer Server...
start cmd /k "cd /d C:\CofTea-POS\printer-server && npm start"

echo All services are starting!
echo Frontend: http://localhost:3000 (or whatever port your frontend uses)
echo Backend: http://localhost:8090
echo Printer Server: Running

:: Keep the main window open to see status
echo.
echo Press any key to close this window (services will continue running)
pause > nul