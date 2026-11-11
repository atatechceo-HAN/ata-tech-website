const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. 특허 그리드 정리
const patentStartTag = '<!-- 특허 4건 카드 그리드 (admin_patent.js 동적 렌더링) -->';
const patentEndTag = '<!-- 하단 지식재산권 보호 공고 및 기술 신뢰성 배너 -->';

const startIndex = content.indexOf(patentStartTag);
const endIndex = content.indexOf(patentEndTag);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    const replacement = `<!-- 특허 4건 카드 그리드 (admin_patent.js 동적 렌더링) -->
            <div id="patent-cards-grid" class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <!-- admin_patent.js 동적 렌더링 영역 -->
            </div>

            `;
    content = before + replacement + after;
    console.log('[OK] patent-cards-grid replaced successfully.');
} else {
    console.error('[ERR] Could not find patent tags:', { startIndex, endIndex });
    process.exit(1);
}

// 2. 한중합자법인 협력사업 그리드 정리
const coopStartTag = '<!-- 3대 핵심 협력 카드 그리드 (admin_china.js 동적 렌더링) -->';
const coopEndTag = '<!-- 5-3. 한중 합자법인 글로벌 네트워크 뷰 -->';

const coopStartIndex = content.indexOf(coopStartTag);
const coopEndIndex = content.indexOf(coopEndTag);

if (coopStartIndex !== -1 && coopEndIndex !== -1) {
    const beforeCoop = content.substring(0, coopStartIndex);
    const afterCoop = content.substring(coopEndIndex);
    const replacementCoop = `<!-- 3대 핵심 협력 카드 그리드 (admin_china.js 동적 렌더링) -->
            <div id="china-coop-cards-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <!-- admin_china.js 동적 렌더링 영역 -->
            </div>
        </div>
    </div>

    `;
    content = beforeCoop + replacementCoop + afterCoop;
    console.log('[OK] china-coop-cards-grid replaced successfully.');
} else {
    console.error('[ERR] Could not find coop tags:', { coopStartIndex, coopEndIndex });
    process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('[SUCCESS] index.html updated successfully!');

