---
description: 작업 시작 전 GitHub 원격 저장소의 최신 코드 내려받기 (Pull)
---
다른 PC에서 작업을 시작하기 전에 C:\Projects\ata-tech-website 폴더를 GitHub 원격 저장소의 최신 상태로 동기화하려고 해. 아래 작업을 순서대로 실행해 줘:

1. 작업 경로 이동: PowerShell에서 Set-Location -LiteralPath "C:\Projects\ata-tech-website" 명령으로 프로젝트 폴더로 이동해 줘.
2. 잠금 파일 정리: Test-Path -LiteralPath ".git\index.lock" 으로 확인해서 파일이 있으면 삭제해 줘.
3. 원격 최신 코드 반영: 편집기 대기 창이 뜨지 않도록 $env:GIT_TERMINAL_PROMPT="0"; git pull --no-rebase --no-edit origin main 명령을 실행해서 직전 PC 작업 내역과 관리자 페이지 수정사항을 내려받아 줘.
4. 동기화 결과 보고: git status 와 git log -n 2 결과를 출력해서 현재 로컬 폴더가 최신 상태인지 보고해 줘.
