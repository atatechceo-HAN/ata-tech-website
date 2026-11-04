const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.js') || f.endsWith('.html'));

files.forEach(file => {
    try {
        const text = fs.readFileSync(file, 'utf8');
        const lines = text.split('\n');
        lines.forEach((line, idx) => {
            if (line.includes('{count}')) {
                console.log(`${file}:${idx+1}: ${line.trim()}`);
            }
        });
    } catch (e) {}
});

