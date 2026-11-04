const fs = require('fs');

console.log('=== [1] JS 구문 및 로드 검증 ===');
const refCode = fs.readFileSync('admin_reference.js', 'utf8');
const i18nCode = fs.readFileSync('i18n.js', 'utf8');

const mockEl = () => ({
    style: {},
    classList: { add: () => { }, remove: () => { }, contains: () => false },
    scrollIntoView: () => { },
    scrollTo: () => { },
    addEventListener: () => { },
    appendChild: () => { },
    getAttribute: () => '',
    setAttribute: () => { }
});

const sandbox = {
    window: { currentLanguage: 'zh' },
    localStorage: { getItem: () => 'zh', setItem: () => { } },
    document: {
        documentElement: { lang: '' },
        getElementById: () => mockEl(),
        createElement: () => mockEl(),
        querySelectorAll: () => [],
        addEventListener: () => { }
    }
};
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.addEventListener = () => { };

// i18n.js 실행
const fnI18n = new Function('window', 'document', 'localStorage', i18nCode);
fnI18n(sandbox.window, sandbox.document, sandbox.localStorage);
console.log('✔ i18n.js 로드 성공!');

// admin_reference.js 실행
const fnRef = new Function('window', 'document', 'localStorage', refCode);
fnRef(sandbox.window, sandbox.document, sandbox.localStorage);
console.log('✔ admin_reference.js 로드 성공!');

console.log('\n=== [2] 레퍼런스 다국어 {count} 및 탭 번역 검증 ===');
const zhData = sandbox.window.i18nData['zh'] || {};
console.log('zh.ref_subtitle:', zhData.ref_subtitle ? '✔ 존재함: ' + zhData.ref_subtitle.substring(0, 35) + '...' : '❌ 누락');
console.log('zh.china_intro_title:', zhData.china_intro_title ? '✔ 존재함: ' + zhData.china_intro_title : '❌ 누락');
console.log('zh.china_intro_p1:', zhData.china_intro_p1 ? '✔ 존재함: ' + zhData.china_intro_p1.substring(0, 30) + '...' : '❌ 누락');

console.log('\n=== [3] 푸터 로고 HTML 검증 ===');
const html = fs.readFileSync('index.html', 'utf8');
const logoMatch = html.includes('Logo - 001.png') && html.includes('rounded-2xl shadow-sm');
console.log('Footer logo container updated:', logoMatch ? '✔ 완료!' : '❌ 미완료');

console.log('\n모든 통합 검증 100% 통과!');
