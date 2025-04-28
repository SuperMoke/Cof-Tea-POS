@echo off
setlocal EnableDelayedExpansion
echo Starting CofTea-POS system...

:: Create temporary files to track process status
set "frontend_status=C:\CofTea-POS\frontend_status.tmp"
set "backend_status=C:\CofTea-POS\backend_status.tmp"
set "printer_status=C:\CofTea-POS\printer_status.tmp"

:: Delete any existing status files
if exist "%frontend_status%" del "%frontend_status%"
if exist "%backend_status%" del "%backend_status%"
if exist "%printer_status%" del "%printer_status%"

:: Start Frontend in a new window
echo Starting Frontend...
start cmd /k "cd /d C:\CofTea-POS && (npm run dev && echo SUCCESS > "%frontend_status%") || (echo FAILED > "%frontend_status%")"

:: Wait for frontend to initialize
echo Waiting for frontend to initialize...
timeout /t 5 /nobreak > nul

:: Check if frontend started successfully
if not exist "%frontend_status%" (
    echo Frontend is still starting up...
) else (
    type "%frontend_status%" | findstr "FAILED" > nul
    if !errorlevel! equ 0 (
        echo Frontend failed to start. Terminating all processes...
        goto :cleanup
    )
)

:: Start Backend (PocketBase) in a new window
echo Starting Backend (PocketBase)...
start cmd /k "cd /d C:\CofTea-POS\pocketbase && (pocketbase serve --http=0.0.0.0:8090 && echo SUCCESS > "%backend_status%") || (echo FAILED > "%backend_status%")"

:: Wait for backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

:: Check if backend started successfully
if not exist "%backend_status%" (
    echo Backend is still starting up...
) else (
    type "%backend_status%" | findstr "FAILED" > nul
    if !errorlevel! equ 0 (
        echo Backend failed to start. Terminating all processes...
        goto :cleanup
    )
)

:: Start Printer Server in a new window
echo Starting Printer Server...
start cmd /k "cd /d C:\CofTea-POS\printer-server && (npm start && echo SUCCESS > "%printer_status%") || (echo FAILED > "%printer_status%")"

:: Wait for printer server to initialize
echo Waiting for printer server to initialize...
timeout /t 5 /nobreak > nul

:: Check if printer server started successfully
if not exist "%printer_status%" (
    echo Printer server is still starting up...
) else (
    type "%printer_status%" | findstr "FAILED" > nul
    if !errorlevel! equ 0 (
        echo Printer server failed to start. Terminating all processes...
        goto :cleanup
    )
)

:: All services appear to be running, launch Brave browser
echo All services are running!
echo Frontend: http://192.168.100.17:3000
echo Backend: http://localhost:8090
echo Printer Server: Running

:: Launch Brave browser with the frontend URL
echo Opening Brave browser...
start brave http://192.168.100.17:3000

echo.
echo Press any key to terminate all processes and exit
pause > nul

:cleanup
:: Terminate all processes
echo Terminating all processes...
taskkill /f /fi "WINDOWTITLE eq C:\CofTea-POS*" > nul 2>&1
taskkill /f /fi "WINDOWTITLE eq C:\CofTea-POS\pocketbase*" > nul 2>&1
taskkill /f /fi "WINDOWTITLE eq C:\CofTea-POS\printer-server*" > nul 2>&1

:: Clean up temporary status files
if exist "%frontend_status%" del "%frontend_status%"
if exist "%backend_status%" del "%backend_status%"
if exist "%printer_status%" del "%printer_status%"

echo Cleanup complete. Press any key to exit.
pause > nul
endlocal