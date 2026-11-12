const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'admin_patent.js');
let code = fs.readFileSync(filePath, 'utf8');

const newRenderCode = `
    // ==========================================================================
    // 4. 프론트엔드 홈페이지 실시간 동적 렌더링 엔진 (좌측 문서 : 우측 설명)
    // ==========================================================================
    function renderFrontend() {
        var data = loadData();

        // 1. 특허 현황 (#patent-cards-grid 또는 #view-patents 내부)
        renderPatentSection(data.filter(function (it) { return it.category === 'patent'; }));

        // 2. 인증 현황 (#cert-quality-grid 또는 #view-cert-quality 내부)
        renderCertSection(data.filter(function (it) { return it.category === 'cert'; }));

        // 3. 수상 내역 (#cert-awards-grid 또는 #view-cert-awards 내부)
        renderAwardSection(data.filter(function (it) { return it.category === 'award'; }));
    }

    /**
     * [특허 현황] 좌우 2열 배치 (좌측: 특허증 클린 뷰어 | 우측: 상세 설명 및 메커니즘)
     */
    function renderPatentSection(items) {
        var container = document.getElementById('patent-cards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var lang = getLang();

        var html = [];
        items.forEach(function (it, idx) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;
            var numStr = it.sortOrder ? (it.sortOrder < 10 ? '0' + it.sortOrder : it.sortOrder) : (idx + 1 < 10 ? '0' + (idx + 1) : idx + 1);

            // 다국어 텍스트 조회
            var title = i18nItem(it.id, 'title', it.title);
            var subtitle = i18nItem(it.id, 'subtitle', it.subtitle || '');
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);

            var badgeText = (it.sortOrder === 4 || it.badge === '핵심원천특허') 
                ? i18nUI('patent_core_badge') + ' ' + numStr 
                : i18nUI('patent_badge') + ' ' + numStr;

            var orgText = (it.organization && it.organization.indexOf('KIPO') !== -1)
                ? i18nUI('org_kipo')
                : (it.organization || i18nUI('org_kipo'));

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch group fade-in appear">');
            
            // ================= [좌측: 특허증 문서 클린 뷰어] =================
            html.push('  <div class="w-full md:w-80 lg:w-96 shrink-0 flex flex-col justify-between bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200 shadow-inner">');
            html.push('    <div class="w-full h-80 sm:h-96 md:h-full min-h-[350px] rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden flex items-center justify-center p-2">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#view=Fit&toolbar=0&navpanes=0&scrollbar=0" class="w-full h-full border-0 bg-white rounded-lg pointer-events-none" title="' + title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + title + '" class="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xs transition-transform duration-300 group-hover:scale-[1.02]">');
            }
            html.push('    </div>');
            html.push('    <div class="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">');
            html.push('      <span class="font-semibold text-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-stamp text-blue-600"></i> ' + i18nUI('patent_copy_label') + '</span>');
            html.push('      <span class="text-blue-600 font-bold">' + i18nUI('patent_exclusive_label') + '</span>');
            html.push('    </div>');
            html.push('  </div>');

            // ================= [우측: 상세 설명 및 3대 메커니즘] =================
            html.push('  <div class="flex-1 min-w-0 flex flex-col justify-between">');
            html.push('    <div>');
            
            // 메타 바 (배지, 등록번호, 등록일자, 기관)
            html.push('      <div class="flex items-center justify-between gap-2 flex-wrap pb-3 mb-3 border-b border-slate-100">');
            html.push('        <div class="flex items-center gap-2 flex-wrap">');
            html.push('          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">');
            html.push('            <i class="fa-solid fa-certificate text-blue-600"></i> ' + badgeText);
            html.push('          </span>');
            html.push('          <span class="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('        </div>');
            html.push('        <div class="flex items-center gap-2 text-xs text-slate-500 font-medium">');
            html.push('          <span><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('          <span class="hidden sm:inline"><i class="fa-solid fa-building-columns mr-1 text-slate-400"></i>' + orgText + '</span>');
            html.push('        </div>');
            html.push('      </div>');

            // 발명의 명칭
            html.push('      <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-snug break-keep mb-2">' + title + '</h3>');
            if (subtitle && subtitle !== title) {
                html.push('      <p class="text-xs sm:text-sm font-semibold text-slate-400 mb-4 tracking-wide break-keep">' + subtitle + '</p>');
            }

            // 상세 기술 해설 (가로 너비 시원하게 사용)
            html.push('      <p class="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line break-keep mb-5">' + description + '</p>');

            // 핵심 메커니즘 박스 (3대 체크리스트)
            if (features && features.length > 0) {
                html.push('      <div class="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5 mb-2">');
                html.push('        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><i class="fa-solid fa-microchip text-blue-600"></i> ' + i18nUI('mechanism_title') + '</div>');
                features.forEach(function (f) {
                    html.push('        <div class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">');
                    html.push('          <i class="fa-solid fa-circle-check text-blue-600 text-xs mt-1 shrink-0"></i>');
                    html.push('          <span class="break-keep">' + f + '</span>');
                    html.push('        </div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            // 우측 하단 메타 바
            html.push('    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">');
            html.push('      <span>대한민국 특허청 정식 등록 공고</span>');
            html.push('      <span class="font-bold text-blue-600">ATA TECH R&D CENTER</span>');
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [인증 현황] 좌우 2열 배치 (좌측: 인증서 클린 뷰어 | 우측: 상세 설명 및 품질 표준)
     */
    function renderCertSection(items) {
        var container = document.getElementById('cert-quality-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            var title = i18nItem(it.id, 'title', it.title);
            var subtitle = i18nItem(it.id, 'subtitle', it.subtitle || '');
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch group fade-in appear">');
            
            // ================= [좌측: 인증서 클린 뷰어] =================
            html.push('  <div class="w-full md:w-80 lg:w-96 shrink-0 flex flex-col justify-between bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200 shadow-inner">');
            html.push('    <div class="w-full h-80 sm:h-96 md:h-full min-h-[320px] rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden flex items-center justify-center p-2">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#view=Fit&toolbar=0&navpanes=0&scrollbar=0" class="w-full h-full border-0 bg-white rounded-lg pointer-events-none" title="' + title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + title + '" class="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xs transition-transform duration-300 group-hover:scale-[1.02]">');
            }
            html.push('    </div>');
            html.push('    <div class="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">');
            html.push('      <span class="font-semibold text-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-award text-emerald-600"></i> 공식 공인 인증서</span>');
            html.push('      <span class="text-emerald-600 font-bold">국제 표준 적합성 승인</span>');
            html.push('    </div>');
            html.push('  </div>');

            // ================= [우측: 상세 설명 및 인증 범위] =================
            html.push('  <div class="flex-1 min-w-0 flex flex-col justify-between">');
            html.push('    <div>');
            
            // 메타 바
            html.push('      <div class="flex items-center justify-between gap-2 flex-wrap pb-3 mb-3 border-b border-slate-100">');
            html.push('        <div class="flex items-center gap-2">');
            html.push('          <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm">' + i18nUI('cert_badge') + '</span>');
            html.push('          <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('        </div>');
            html.push('        <span class="text-xs text-slate-500 font-medium"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('      </div>');

            // 인증 명칭
            html.push('      <h4 class="text-lg sm:text-xl font-black text-slate-900 mb-2 leading-snug group-hover:text-emerald-600 transition-colors break-keep">' + title + '</h4>');
            if (subtitle && subtitle !== title) {
                html.push('      <p class="text-xs font-semibold text-emerald-700 mb-3 break-keep">' + subtitle + '</p>');
            }

            // 상세 설명
            html.push('      <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line break-keep">' + description + '</p>');
            
            // 인증 범위 체크리스트
            if (features && features.length > 0) {
                html.push('      <div class="space-y-1.5 mb-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">');
                html.push('        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><i class="fa-solid fa-check-double text-emerald-600"></i> ' + i18nUI('cert_features_title') + '</div>');
                features.forEach(function (f) {
                    html.push('        <div class="flex items-center gap-2 text-xs text-slate-700"><i class="fa-solid fa-check text-emerald-600 text-[10px]"></i><span class="break-keep">' + f + '</span></div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            // 하단 메타 바
            html.push('    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">');
            html.push('      <span>품질·환경 표준 시스템</span>');
            html.push('      <span class="font-bold text-emerald-600">CERTIFIED EXCELLENCE</span>');
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [수상 및 수료 내역] 좌우 2열 배치 (좌측: 상장 클린 뷰어 | 우측: 상세 공적 및 수상 설명)
     */
    function renderAwardSection(items) {
        var container = document.getElementById('cert-awards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            var title = i18nItem(it.id, 'title', it.title);
            var organization = i18nItem(it.id, 'organization', it.organization || '');
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col md:flex-row gap-6 lg:gap-8 items-stretch group fade-in appear">');
            
            // ================= [좌측: 상장 클린 뷰어] =================
            html.push('  <div class="w-full md:w-80 lg:w-96 shrink-0 flex flex-col justify-between bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200 shadow-inner">');
            html.push('    <div class="w-full h-80 sm:h-96 md:h-full min-h-[320px] rounded-xl bg-white border border-slate-200/80 shadow-sm overflow-hidden flex items-center justify-center p-2">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#view=Fit&toolbar=0&navpanes=0&scrollbar=0" class="w-full h-full border-0 bg-white rounded-lg pointer-events-none" title="' + title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + title + '" class="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-xs transition-transform duration-300 group-hover:scale-[1.02]">');
            }
            html.push('    </div>');
            html.push('    <div class="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">');
            html.push('      <span class="font-semibold text-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-trophy text-amber-500"></i> 공인 표창 및 수료증</span>');
            html.push('      <span class="text-amber-600 font-bold">대외 기술력 인정</span>');
            html.push('    </div>');
            html.push('  </div>');

            // ================= [우측: 상세 공적 및 수상 설명] =================
            html.push('  <div class="flex-1 min-w-0 flex flex-col justify-between">');
            html.push('    <div>');
            
            // 메타 바
            html.push('      <div class="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">');
            html.push('        <span class="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm">' + i18nUI('award_badge') + '</span>');
            html.push('        <span class="text-xs font-medium text-slate-500"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('      </div>');

            // 수상 명칭 및 주관 기관
            html.push('      <h4 class="text-lg sm:text-xl font-black text-slate-900 mb-2 leading-snug group-hover:text-amber-600 transition-colors break-keep">' + title + '</h4>');
            html.push('      <p class="text-xs font-semibold text-slate-500 mb-3"><i class="fa-solid fa-building-columns text-amber-500 mr-1.5"></i>' + organization + '</p>');

            // 공적 설명
            html.push('      <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line break-keep">' + description + '</p>');
            
            // 주요 성과 체크리스트
            if (features && features.length > 0) {
                html.push('      <div class="space-y-1.5 mb-2 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50">');
                html.push('        <div class="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5"><i class="fa-solid fa-award text-amber-600"></i> ' + i18nUI('award_features_title') + '</div>');
                features.forEach(function (f) {
                    html.push('        <div class="flex items-center gap-2 text-xs text-slate-700"><i class="fa-solid fa-award text-amber-600 text-[10px]"></i><span class="break-keep">' + f + '</span></div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            // 하단 메타 바
            html.push('    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">');
            html.push('      <span>정부 및 공공기관 공인 실적</span>');
            html.push('      <span class="font-bold text-amber-600">OFFICIAL COMMENDATION</span>');
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }
`;

const renderStartMarker = 'function renderFrontend() {';
const renderEndMarker = 'window.PatentAdmin = {';

const rStartIndex = code.indexOf(renderStartMarker);
const rEndIndex = code.indexOf(renderEndMarker);

if (rStartIndex !== -1 && rEndIndex !== -1) {
    const before = code.substring(0, rStartIndex);
    const after = code.substring(rEndIndex);
    code = before + newRenderCode.trim() + '\n\n    // 전역 네임스페이스\n    ' + after;
    fs.writeFileSync(filePath, code, 'utf8');
    console.log('[SUCCESS] admin_patent.js left-right layout updated successfully!');
} else {
    console.error('[ERR] Markers not found:', { rStartIndex, rEndIndex });
    process.exit(1);
}

