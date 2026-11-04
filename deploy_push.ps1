# 1. 기존 실행 중인 git.exe 강제 종료
Get-Process git -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. .git 내의 모든 .lock 파일 강제 삭제
Get-ChildItem -Path .git -Filter "*.lock" -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

# 3. 변경 파일 스테이징
Write-Host "=== Staging Files ==="
git add admin_reference.js i18n.js index.html assets/images/ceo_profile.png

# 4. 커밋
Write-Host "=== Committing ==="
git commit -m "feat: CEO 인사말 프로필 사진 반영, 한중 합자법인 소개 개정, 레퍼런스 및 i18n 고도화"

# 5. 푸시
Write-Host "=== Pushing to origin main ==="
git push origin main

# 6. 최신 커밋 확인
Write-Host "=== Latest Commit ==="
git log -1 --oneline

