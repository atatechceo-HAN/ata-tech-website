const { execSync } = require('child_process');

try {
    console.log(execSync('git add admin_reference.js i18n.js index.html', { encoding: 'utf8' }));
    console.log(execSync('git commit -m "fix(reference): fix mobile video playback, touch interaction, i18n translation, and footer logo"', { encoding: 'utf8' }));
    console.log('✔ Git Commit successfully created!');
} catch (e) {
    console.error('Git commit error:', e.stdout || e.message);
}

