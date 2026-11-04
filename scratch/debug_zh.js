const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const i18nJs = fs.readFileSync('i18n.js', 'utf8');

const matches = [];
const regex = /data-i18n="([^"]+)"/g;
let m;
while ((m = regex.exec(html)) !== null) {
    matches.push(m[1]);
}

console.log('Total data-i18n elements in index.html:', matches.length);

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

const fn = new Function('window', 'document', 'localStorage', i18nJs);
fn(sandbox.window, sandbox.document, sandbox.localStorage);

const zh = sandbox.window.i18nData['zh'];
console.log('zh keys count:', Object.keys(zh).length);
console.log('zh["china_intro_title"] =', zh['china_intro_title']);
console.log('zh["china_intro_p1"] =', zh['china_intro_p1']);
console.log('zh["china_intro_factory_sub"] =', zh['china_intro_factory_sub']);
console.log('zh["ref_subtitle"] =', zh['ref_subtitle']);

// index.html의 data-i18n 키 중 zh에 없는 키들 확인
const missingInZh = matches.filter(k => zh[k] === undefined);
console.log('Missing keys in zh count:', missingInZh.length);
console.log('Sample missing keys in zh:', missingInZh.slice(0, 20));
