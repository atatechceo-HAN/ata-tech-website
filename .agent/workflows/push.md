---
description: 작업 종료 시 변경사항 커밋 및 GitHub 원격 저장소 업로드 (Push)
---
현재 PC에서의 작업을 마치고 C:\Projects\ata-tech-website 폴더의 변경사항을 GitHub 원격 저장소에 업로드하려고 해. 아래 작업을 순서대로 실행해 줘:

1. 작업 경로 이동: PowerShell에서 Set-Location -LiteralPath "C:\Projects\ata-tech-website" 명령으로 프로젝트 폴더로 이동해 줘.
2. 잠금 파일 정리: Test-Path -LiteralPath ".git\index.lock" 으로 확인해서 파일이 있으면 삭제해 줘.
3. 변경사항 커밋: git status 로 수정된 파일을 확인한 뒤, 변경사항이 있다면 git add . 실행 후 이번 작업 내용을 요약한 한글 커밋 메시지로 git commit 을 진행해 줘.
4. 원격 병합 및 최종 푸시: 작업 도중 관리자 페이지에서 수정된 내역과 충돌하지 않도록 $env:GIT_TERMINAL_PROMPT="0"; git pull --no-rebase --no-edit origin main 을 먼저 실행한 뒤, 바로 git push origin main 명령으로 원격 저장소 업로드를 완료해 줘.
5. 완료 보고: git status 와 git log -n 2 결과를 출력해서 원격 동기화가 깨끗하게 완료되었는지 보고해 줘.
