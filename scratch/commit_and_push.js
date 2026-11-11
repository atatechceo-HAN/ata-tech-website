const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const lockFile = path.join(rootDir, '.git', 'index.lock');

if (fs.existsSync(lockFile)) {
    try {
        fs.unlinkSync(lockFile);
        console.log('[OK] Removed stale .git/index.lock');
    } catch (e) {
        console.warn('[WARN] Could not remove index.lock:', e.message);
    }
}

function run(cmd) {
    console.log(`> ${cmd}`);
    try {
        const out = execSync(cmd, { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
        console.log(out.trim());
        return true;
    } catch (err) {
        console.error('[EXEC ERROR]:', err.stderr || err.message);
        return false;
    }
}

console.log('=== [Git 커밋 & 푸시 배포 시작] ===');
run('git add index.html');
run('git commit -m "Feat(SEO): Apply B2B logistics SEO & GEO JSON-LD schema markup for ATA TECH"');
run('git push origin main');
console.log('=== [Git 배포 완료] ===');
