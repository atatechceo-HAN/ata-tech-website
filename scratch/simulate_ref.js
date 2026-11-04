const fs = require('fs');

const code = fs.readFileSync('admin_reference.js', 'utf8');

const sandbox = {
    window: {
        currentLanguage: 'zh'
    },
    localStorage: {
        getItem: () => 'zh'
    },
    document: {
        getElementById: () => null,
        addEventListener: () => {}
    }
};
sandbox.window.localStorage = sandbox.localStorage;

const fn = new Function('window', 'document', 'localStorage', code);
fn(sandbox.window, sandbox.document, sandbox.localStorage);

console.log('window.ReferenceAdmin exists?', !!sandbox.window.ReferenceAdmin);

