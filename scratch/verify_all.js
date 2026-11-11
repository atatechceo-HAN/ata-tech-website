const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== [통합 문법 및 무결성 검증 시작] ===');

const baseDir = path.join(__dirname, '..');
const jsFiles = ['admin_patent.js', 'admin_china.js', 'app.js', 'admin_modal_resize.js'];

let hasError = false;

// 1. JS 문법 검사 (node -c)
jsFiles.forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (!fs.existsSync(fullPath)) {
        console.log(`[SKIP] ${file} not found`);
        return;
    }
    try {
        execSync(`node -c "${fullPath}"`);
        console.log(`[PASS] ${file} Syntax OK`);
    } catch (e) {
        console.error(`[FAIL] ${file} Syntax Error!`, e.message);
        hasError = true;
    }
});

// 2. index.html 기본 무결성 검사
try {
    const htmlPath = path.join(baseDir, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');

    // 주요 그리드 태그 검사
    if (html.includes('id="patent-cards-grid"') && html.includes('id="china-coop-cards-grid"')) {
        console.log('[PASS] index.html contains both patent-cards-grid and china-coop-cards-grid containers');
    } else {
        console.error('[FAIL] Missing grid container in index.html');
        hasError = true;
    }
} catch (e) {
    console.error('[FAIL] index.html check failed:', e.message);
    hasError = true;
}

if (hasError) {
    console.error('=== [검증 실패: 오류가 발견되었습니다] ===');
    process.exit(1);
} else {
    console.log('=== [모든 검증 완료: 100% 정상 통과] ===');
    process.exit(0);
}
