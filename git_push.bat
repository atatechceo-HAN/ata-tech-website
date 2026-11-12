@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo [1/3] Terminating stuck background git processes...
taskkill /F /IM git.exe /T >nul 2>nul
taskkill /F /IM git-lfs.exe /T >nul 2>nul
timeout /t 1 /nobreak >nul

echo [2/3] Cleaning up lock files...
del /f /q /a .git\*.lock 2>nul
del /f /q /a .git\index.lock 2>nul
del /f /q /a .git\config.lock 2>nul

echo [3/3] Pushing main branch to GitHub...
echo (Uploading LFS media and commits. Please wait...)
git push -u origin main

echo.
echo ==============================================
echo  Execution Complete! Press any key to exit.
echo ==============================================
pause
