const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoDir = path.join(__dirname, '..');
const lockPath = path.join(repoDir, '.git', 'index.lock');

console.log('[1/4] Checking index.lock...');
if (fs.existsSync(lockPath)) {
    try {
        fs.unlinkSync(lockPath);
        console.log('[OK] index.lock removed successfully via Node.js fs.');
    } catch (e) {
        console.error('[ERR] Failed to remove index.lock:', e.message);
    }
} else {
    console.log('[INFO] No index.lock found.');
}

function exec(cmd) {
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

console.log('[2/4] Adding changes to Git...');
exec('git add .');

console.log('[3/4] Committing changes...');
exec('git commit -m "특허 UI 개선 및 다국어 번역 누락 수정 완료"');

console.log('[4/4] Pushing to origin main...');
exec('git push -u origin main');

console.log('[DONE] All tasks completed successfully!');
