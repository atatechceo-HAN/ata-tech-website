const fs = require('fs');

let content = fs.readFileSync('i18n.js', 'utf8');

// 1. extendedI18nData.zh 및 cn에 ref_subtitle 누락 보강
const targetZh = `"ref_badge": "PROVEN TRACK RECORD",
        "ref_heading": "主要项目业绩 <span class=\\"text-accent font-normal text-2xl md:text-3xl block sm:inline sm:ml-2\\">(客户案例)</span>",`;

const replacementZh = `"ref_badge": "PROVEN TRACK RECORD",
        "ref_heading": "主要项目业绩 <span class=\\"text-accent font-normal text-2xl md:text-3xl block sm:inline sm:ml-2\\">(客户案例)</span>",
        "ref_subtitle": "全面展示从智能物流制造基地航拍<strong>全景</strong>到<strong>CBS</strong>、<strong>NC CBS</strong>、<strong>NBS</strong>、<strong>摆轮分拣机</strong>、<strong>翻盘分拣机</strong>的实际物流现场运行视频（YouTube剧场）与高清实拍画廊。",`;

if (content.includes(targetZh)) {
    content = content.replace(targetZh, replacementZh);
    console.log('[1] ref_subtitle added to extendedI18nData.zh');
}

// 2. extendedI18nData.ja에도 ref_subtitle 보강
const targetJa = `"ref_badge": "PROVEN TRACK RECORD",
        "ref_heading": "主要プロジェクト実績 <span class=\\"text-accent font-normal text-2xl md:text-3xl block sm:inline sm:ml-2\\">(導入実績)</span>",`;

const replacementJa = `"ref_badge": "PROVEN TRACK RECORD",
        "ref_heading": "主要プロジェクト実績 <span class=\\"text-accent font-normal text-2xl md:text-3xl block sm:inline sm:ml-2\\">(導入実績)</span>",
        "ref_subtitle": "スマート物流製造拠点の空撮<strong>全景</strong>から<strong>CBS</strong>、<strong>NC CBS</strong>、<strong>NBS</strong>、<strong>ホイールソーター</strong>、<strong>ティルトトレイソーター</strong>まで、現場稼働動画（YouTubeシアター）と高解像度フォトギャラリーをご覧いただけます。",`;

if (content.includes(targetJa)) {
    content = content.replace(targetJa, replacementJa);
    console.log('[2] ref_subtitle added to extendedI18nData.ja');
}

// 3. setLanguage 내부에서 cn과 zh의 양방향 완전 동기화 및 텍스트 강제 적용 보장
const oldSetLangSync = `    // [중국어 zh / cn 상호 동기화]
    // cn과 zh를 상호 복사하여 어떤 키를 쓰더라도 100% 동작
    if (i18nData['cn'] || i18nData['zh']) {
        const fullChinese = Object.assign({}, i18nData['cn'] || {}, i18nData['zh'] || {});
        i18nData['cn'] = fullChinese;
        i18nData['zh'] = fullChinese;
    }`;

const newSetLangSync = `    // [중국어 zh / cn 상호 동기화]
    // cn과 zh를 상호 복사하여 어떤 키를 쓰더라도 100% 동작
    if (i18nData['cn'] || i18nData['zh']) {
        const fullChinese = Object.assign({}, i18nData['cn'] || {}, i18nData['zh'] || {});
        i18nData['cn'] = fullChinese;
        i18nData['zh'] = fullChinese;
    }
    if (lang === 'cn') lang = 'zh';`;

if (content.includes(oldSetLangSync)) {
    content = content.replace(oldSetLangSync, newSetLangSync);
    console.log('[3] setLanguage standardized with lang = zh');
}

fs.writeFileSync('i18n.js', content, 'utf8');
console.log('ALL i18n.js changes successfully saved!');

