@echo off
chcp 65001 > nul
echo 1. Terminating existing git processes...
taskkill /F /IM git.exe 2>nul

echo 2. Removing git lock files...
if exist ".git\index.lock" del /f /q ".git\index.lock"
if exist ".git\HEAD.lock" del /f /q ".git\HEAD.lock"
if exist ".git\refs\heads\main.lock" del /f /q ".git\refs\heads\main.lock"

echo 3. Staging modified files...
git add admin_reference.js i18n.js index.html "assets/images/ceo_profile.png"

echo 4. Committing changes...
git commit -m "feat: CEO 인사말 프로필 사진 반영, 한중 합자법인 소개 개정, 레퍼런스 및 i18n 고도화"

echo 5. Pushing to origin main...
git push origin main

echo 6. Verifying latest commit...
git log -1 --oneline

echo === DEPLOY PUSH COMPLETED ===

