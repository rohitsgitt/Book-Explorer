@echo off
setlocal

:: Prompt user for scraper
set /p run_scraper=Do you want to run the scraper? (It may take a minute) [y/N]:

:: Get absolute path to current directory
set "ROOT_DIR=%~dp0"

if /I "%run_scraper%"=="y" (
    call :run_service "%ROOT_DIR%scraper"
)

:: Function-like block to launch a service
call :run_service "%ROOT_DIR%frontend"
call :run_service "%ROOT_DIR%backend"


:run_service
start "" cmd /c "cd /d %~1 && npm install && npm start && echo %~nx1 exited successfully. && timeout /t 2 >nul"
exit /b
