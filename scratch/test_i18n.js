const fs = require('fs');

const code = fs.readFileSync('i18n.js', 'utf8');

const sandbox = {
    window: {},
    localStorage: {
        getItem: () => 'zh',
        setItem: () => {}
    },
    document: {
        documentElement: { lang: '' },
        querySelectorAll: () => [],
        getElementById: () => null,
        addEventListener: () => {}
    }
};
sandbox.window = sandbox;

try {
    const fn = new Function('window', 'document', 'localStorage', code);
    fn(sandbox.window, sandbox.document, sandbox.localStorage);
    
    console.log('Available langs in window.i18nData:', Object.keys(sandbox.window.i18nData));
    const zh = sandbox.window.i18nData['zh'] || {};
    const cn = sandbox.window.i18nData['cn'] || {};
    
    console.log('zh.china_intro_title:', zh['china_intro_title']);
    console.log('cn.china_intro_title:', cn['china_intro_title']);
    console.log('zh.china_intro_p1:', zh['china_intro_p1']);
    console.log('zh.ref_subtitle:', zh['ref_subtitle']);
} catch (e) {
    console.error('Error running i18n.js:', e);
}
