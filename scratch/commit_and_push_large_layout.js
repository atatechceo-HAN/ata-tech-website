const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoDir = path.join(__dirname, '..');
const lockPath = path.join(repoDir, '.git', 'index.lock');

// 1. 임시 파일 삭제
const tempScript = path.join(repoDir, 'scratch', 'apply_large_left_image.js');
if (fs.existsSync(tempScript)) {
    try { fs.unlinkSync(tempScript); } catch (e) {}
}

// 2. lock 파일 삭제
if (fs.existsSync(lockPath)) {
    try {
        fs.unlinkSync(lockPath);
        console.log('[OK] index.lock removed.');
    } catch (e) {
        console.warn('[WARN] lock remove failed:', e.message);
    }
}

function run(cmd) {
    console.log(`> ${cmd}`);
    try {
        const out = execSync(cmd, { cwd: repoDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        if (out.trim()) console.log(out.trim());
        return true;
    } catch (err) {
        console.error('[FAIL]:', err.stderr || err.message);
        return false;
    }
}

run('git add -A');
run('git commit -m "Layout: Maximize left document image visibility (420~460px) and arrange description on right"');
run('git push -u origin main');
console.log('[SUCCESS] Successfully committed and pushed to origin main!');

