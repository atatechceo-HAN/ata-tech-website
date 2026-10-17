/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 주요 구축 실적(Reference) 관리자 모드 CRUD 엔진 (admin_reference.js)
 * 
 * [주요 기능]
 * 1. 레퍼런스 실적 카드 동적 렌더링 (Responsive 3열 그리드 카드)
 * 2. 관리자 인증(AdminAuth)과 완벽 연동 (로그인 시 관리자 바 및 각 카드 수정/삭제 활성화)
 * 3. 새로운 구축 실적 등록(Create), 기존 실적 수정(Update), 삭제(Delete)
 * 4. 카테고리 필터 탭(전체, 이커머스, 식음료, 제조) 및 실적 건수 배지 동적 자동 계산
 * 5. 브라우저 로컬 저장소(LocalStorage)를 통한 데이터 영구 보존
 * 6. 언제든 초기 공식 7개 실적으로 되돌릴 수 있는 '기본값 안전 복원' 기능
 * 7. 이미지 확대 팝업(openImageModal) 연동
 * ==============================================================================
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. 상수 정의
    // ==========================================================================
    var STORAGE_KEY_REFERENCES = "ata_company_references_db"; // 로컬스토리지 저장 키
    var currentFilterCategory = "all"; // 현재 활성화된 카테고리 필터 ('all', 'ecommerce', 'food', 'manu')

    // ==========================================================================
    // 2. 초기 기본 레퍼런스 데이터 (공식 7대 구축 실적)
    // ==========================================================================
    var INITIAL_REFERENCES_DATA = [
        {
            id: "ref_c1",
            category: "ecommerce",
            title: "국내 최대 이커머스 C사 메가 허브 터미널",
            imageUrl: "H00_레퍼런스_이커머스_1.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800",
            subBadge: "",
            tags: ["Cross Belt Sorter", "WCS", "텔레스코픽"],
            description: "일 200만 건 이상의 압도적인 물동량을 소화하기 위해 초고속 크로스 벨트 소터 및 자동 상하차 시스템을 구축하여 전국 익일 배송의 핵심 인프라를 완성했습니다.",
            field: "대형 풀필먼트 허브",
            sortOrder: 1
        },
        {
            id: "ref_c2",
            category: "ecommerce",
            title: "글로벌 종합 유통 S사 수도권 풀필먼트 센터",
            imageUrl: "H00_레퍼런스_이커머스_2.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800",
            subBadge: "",
            tags: ["AGV & AMR", "Shuttle AS/RS"],
            description: "다양한 규격의 소비재를 보관 및 피킹하기 위해 셔틀 타입의 자동 창고와 AGV 로봇을 결합하여 G2P(Goods-to-Person) 하이브리드 물류 센터를 구축했습니다.",
            field: "G2P 하이브리드 센터",
            sortOrder: 2
        },
        {
            id: "ref_c3",
            category: "food",
            title: "F&B 전문기업 F사 냉동 자동화 창고",
            imageUrl: "H00_레퍼런스_콜드체인_1.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
            subBadge: "영하 20℃ 냉동창고",
            tags: ["저온형 AS/RS", "콜드체인 특화 WCS"],
            description: "극한의 저온 환경에서도 안정적으로 구동되는 특수 윤활 및 히팅 기술이 적용된 AS/RS 스태커 크레인을 구축하여 작업자의 위험 노출을 최소화했습니다.",
            field: "스마트 저온 물류",
            sortOrder: 3
        },
        {
            id: "ref_c4",
            category: "food",
            title: "대형 마트 M사 신선 물류 허브",
            imageUrl: "H00_레퍼런스_콜드체인_2.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600",
            subBadge: "신선식품 당일배송",
            tags: ["Tilt Tray Sorter", "위생 스테인리스 컨베이어"],
            description: "신선도가 생명인 농축수산물을 산지에서 매장 및 고객에게 빠르게 배송하기 위해 초고속 Tilt Tray Sorter 기반의 분류 라인을 설계했습니다.",
            field: "신선 유통 분류",
            sortOrder: 4
        },
        {
            id: "ref_c5",
            category: "manu",
            title: "글로벌 자동차 H사 공장 조립 라인",
            imageUrl: "H00_레퍼런스_제조_1.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&q=80&w=600",
            subBadge: "완성차 조립 라인",
            tags: ["Heavy Duty 컨베이어", "AGV 이송 시스템"],
            description: "중량물인 자동차 부품(엔진, 섀시 등)을 라인 간 오차 없이 이송하는 Heavy Duty 컨베이어 및 AGV 이송 시스템을 구축했습니다.",
            field: "완성차 부품 이송",
            sortOrder: 5
        },
        {
            id: "ref_c6",
            category: "manu",
            title: "배터리 제조 L사 셀 생산 라인",
            imageUrl: "H00_레퍼런스_제조_2.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=600",
            subBadge: "2차전지 배터리",
            tags: ["클린룸 로봇 팔레타이징", "정밀 롤러 컨베이어"],
            description: "분진 발생을 원천 차단하는 클린룸 특화 로봇 팔레타이징 시스템 및 고정밀 셀 이송 롤러 컨베이어를 성공적으로 설계 및 시공했습니다.",
            field: "클린룸 2차전지 라인",
            sortOrder: 6
        },
        {
            id: "ref_c7",
            category: "manu",
            title: "국내 1위 타이어 K사 물류센터",
            imageUrl: "H00_레퍼런스_제조_3.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600",
            subBadge: "타이어 및 부품",
            tags: ["비전 바코드 인식", "비정형 특화 소터 라인"],
            description: "비정형화된 대형 고무 타이어 화물을 바코드 비전 인식과 결합하여 목적지별로 자동 분류하는 특화 소터 라인을 구축했습니다.",
            field: "비정형 대형물류 자동화",
            sortOrder: 7
        }
    ];

    // ==========================================================================
    // 3. 로컬 저장소 조회 및 저장 유틸리티 함수
    // ==========================================================================

    /**
     * 로컬스토리지에서 레퍼런스 목록을 가져옵니다.
     * 저장된 데이터가 없으면 초기 7대 공식 실적을 저장 후 반환합니다.
     */
    function getReferencesList() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_REFERENCES);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("[ReferenceAdmin] 로컬스토리지 파싱 오류, 초기 데이터로 복구합니다:", e);
        }
        // 기본값 저장 및 반환
        saveReferencesList(INITIAL_REFERENCES_DATA);
        return INITIAL_REFERENCES_DATA.slice();
    }

    /**
     * 레퍼런스 목록을 로컬스토리지에 저장합니다.
     */
    function saveReferencesList(list) {
        try {
            localStorage.setItem(STORAGE_KEY_REFERENCES, JSON.stringify(list));
        } catch (e) {
            console.error("[ReferenceAdmin] 저장 실패:", e);
            alert("저장 공간이 부족하거나 브라우저 오류로 저장하지 못했습니다.");
        }
    }

    /**
     * 초기 기본 공식 실적으로 안전하게 복원합니다.
     */
    function resetReferencesData() {
        if (!confirm("주요 구축 실적 데이터를 최초 기본값(7개 공식 실적)으로 복원하시겠습니까?\n새로 추가하거나 수정한 내용은 모두 초기화됩니다.")) {
            return;
        }
        saveReferencesList(INITIAL_REFERENCES_DATA);
        renderReferencesCards(currentFilterCategory);
        alert("주요 구축 실적이 최초 공식 데이터로 안전하게 복원되었습니다.");
    }

    // ==========================================================================
    // 4. 관리자 권한 확인
    // ==========================================================================
    function isUserAdmin() {
        if (window.AdminAuth && typeof window.AdminAuth.isLoggedIn === 'function') {
            return window.AdminAuth.isLoggedIn();
        }
        try {
            return sessionStorage.getItem("ata_admin_authenticated") === "true";
        } catch (e) {
            return false;
        }
    }

    // ==========================================================================
    // 5. 카테고리 탭 배지 숫자 및 스타일 동기화
    // ==========================================================================
    function updateCategoryTabBadges(list, activeCategory) {
        var countAll = list.length;
        var countEcom = list.filter(function (item) { return item.category === 'ecommerce'; }).length;
        var countFood = list.filter(function (item) { return item.category === 'food'; }).length;
        var countManu = list.filter(function (item) { return item.category === 'manu'; }).length;

        var tabMap = {
            'all': { btn: document.getElementById('ref-tab-all'), count: countAll },
            'ecommerce': { btn: document.getElementById('ref-tab-ecommerce'), count: countEcom },
            'food': { btn: document.getElementById('ref-tab-food'), count: countFood },
            'manu': { btn: document.getElementById('ref-tab-manu'), count: countManu }
        };

        Object.keys(tabMap).forEach(function (catKey) {
            var item = tabMap[catKey];
            var btn = item.btn;
            if (!btn) return;

            // 뱃지 숫자 텍스트 갱신
            var badge = btn.querySelector('.ref-tab-badge');
            if (badge) {
                badge.textContent = item.count;
            }

            // 활성 탭 스타일 업데이트
            if (catKey === activeCategory) {
                btn.className = 'ref-filter-tab px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white ring-2 ring-blue-400 cursor-pointer';
                if (badge) {
                    badge.className = 'ref-tab-badge ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white';
                }
            } else {
                btn.className = 'ref-filter-tab px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 cursor-pointer';
                if (badge) {
                    badge.className = 'ref-tab-badge ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200';
                }
            }
        });
    }

    // ==========================================================================
    // 6. 상단 관리자 컨트롤 바 렌더링
    // ==========================================================================
    function renderReferenceAdminControlBar(isAdmin) {
        var barContainer = document.getElementById('reference-admin-control-bar');
        if (!barContainer) return;

        if (isAdmin) {
            barContainer.innerHTML = [
                '<div class="flex flex-wrap items-center justify-between gap-3 p-4 mb-8 bg-blue-50/90 border border-blue-200 rounded-2xl shadow-sm">',
                '  <div class="flex items-center gap-3">',
                '    <div class="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-200 shadow-sm">',
                '      <i class="fa-solid fa-layer-group"></i>',
                '    </div>',
                '    <div>',
                '      <div class="flex items-center gap-2">',
                '        <h5 class="text-sm font-extrabold text-slate-900">주요 구축 실적 관리자 모드</h5>',
                '        <span class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60 font-semibold">인증됨</span>',
                '      </div>',
                '      <p class="text-xs text-slate-600 mt-0.5">새로운 레퍼런스를 등록하거나 각 실적 카드의 수정/삭제 버튼을 눌러 내용을 편집할 수 있습니다.</p>',
                '    </div>',
                '  </div>',
                '  <div class="flex items-center gap-2">',
                '    <button type="button" onclick="window.ReferenceAdmin.openCreateModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-cyan-500/30 transition-all cursor-pointer">',
                '      <i class="fa-solid fa-plus"></i> 새 레퍼런스 등록',
                '    </button>',
                '    <button type="button" onclick="window.ReferenceAdmin.resetToDefault()" class="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="최초 기본 데이터 복원">',
                '      <i class="fa-solid fa-rotate-left"></i> 기본값 복원',
                '    </button>',
                '    <button type="button" onclick="window.ReferenceAdmin.triggerLogout()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer">',
                '      <i class="fa-solid fa-right-from-bracket"></i> 로그아웃',
                '    </button>',
                '  </div>',
                '</div>'
            ].join('');
            barContainer.classList.remove('hidden');
        } else {
            // 미로그인 상태: 관리자 로그인 링크 노출
            barContainer.innerHTML = [
                '<div class="flex justify-end mb-4">',
                '  <button type="button" onclick="window.ReferenceAdmin.triggerLoginModal()" class="text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-slate-800/60 border border-transparent hover:border-slate-800">',
                '    <i class="fa-solid fa-lock text-[10px]"></i> 관리자 모드',
                '  </button>',
                '</div>'
            ].join('');
            barContainer.classList.remove('hidden');
        }
    }

    // ==========================================================================
    // 7. 레퍼런스 카드 렌더링 (renderReferencesCards)
    // ==========================================================================
    function renderReferencesCards(category) {
        if (category) {
            currentFilterCategory = category;
        } else {
            category = currentFilterCategory;
        }

        var container = document.getElementById('reference-cards-grid');
        if (!container) return;

        var fullList = getReferencesList();
        var isAdmin = isUserAdmin();

        // 현재 활성화된 언어 및 사전 추출
        var curLang = window.currentLanguage || (function () {
            try { return localStorage.getItem('ata_language') || 'ko'; } catch (e) { return 'ko'; }
        })();
        if (curLang === 'zh') curLang = 'cn';
        var dict = (window.i18nData && window.i18nData[curLang]) || {};

        // 상단 관리자 컨트롤 패널 업데이트
        renderReferenceAdminControlBar(isAdmin);

        // 상단 카테고리 탭 뱃지 및 스타일 동기화
        updateCategoryTabBadges(fullList, category);

        // 카테고리 필터링
        var displayList = fullList;
        if (category && category !== 'all') {
            displayList = fullList.filter(function (item) {
                return item.category === category;
            });
        }

        if (displayList.length === 0) {
            container.innerHTML = [
                '<div class="col-span-1 md:col-span-2 lg:col-span-3 p-12 text-center rounded-2xl bg-[#0D1629] border border-slate-800">',
                '  <i class="fa-solid fa-folder-open text-3xl text-slate-600 mb-3 block"></i>',
                '  <p class="text-slate-400 text-sm">해당 카테고리에 등록된 구축 실적이 없습니다.</p>',
                isAdmin ? '  <button type="button" onclick="window.ReferenceAdmin.openCreateModal()" class="mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"><i class="fa-solid fa-plus"></i> 이 카테고리에 새 실적 등록하기</button>' : '',
                '</div>'
            ].join('');
            return;
        }

        var html = '';

        displayList.forEach(function (card) {
            // 카테고리별 배지 스타일 및 라벨 (다국어 지원)
            var catBadgeBg = 'bg-blue-600/90';
            var catIcon = 'fa-cart-shopping';
            var catLabel = dict.ref_badge_ecom || '이커머스 / 유통';

            if (card.category === 'food') {
                catBadgeBg = 'bg-cyan-600/90';
                catIcon = 'fa-snowflake';
                catLabel = dict.ref_badge_food || '식음료 / 콜드체인';
            } else if (card.category === 'manu') {
                catBadgeBg = 'bg-slate-800 border border-slate-700';
                catIcon = 'fa-industry';
                catLabel = dict.ref_badge_manu || '제조 / 자동차';
            }

            var fallbackUrl = card.fallbackUrl || 'https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800';

            // 다국어 텍스트 매핑 (초기 기본 7개 구축 실적의 경우 i18n 번역 우선 적용)
            var displayTitle = (dict[card.id + '_title']) || card.title || '구축 실적';
            var displayDesc = (dict[card.id + '_desc']) || card.description || '';
            var displayField = (dict[card.id + '_field']) || card.field || '물류 자동화';
            var displaySubBadge = (dict[card.id + '_subbadge']) || card.subBadge || '';
            var labelLarger = dict.ref_view_larger || '확대보기';
            var labelField = dict.ref_field_label || '구축 분야';

            html += '<div class="ref-card group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between" data-category="' + card.category + '" id="card-' + card.id + '">';

            // 카드 상단 영역 (관리자 바 + 썸네일 + 본문)
            html += '  <div>';

            // 1. 관리자 모드인 경우: 카드 상단에 수정/삭제 액션 버튼 바 표시
            if (isAdmin) {
                html += '    <div class="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100 text-xs">';
                html += '      <span class="font-bold text-blue-800 flex items-center gap-1.5">';
                html += '        <i class="fa-solid fa-gear text-blue-600"></i> 실적 관리';
                html += '      </span>';
                html += '      <div class="flex items-center gap-1.5">';
                html += '        <button type="button" onclick="window.ReferenceAdmin.openEditModal(\'' + card.id + '\')" class="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer">';
                html += '          <i class="fa-solid fa-pen-to-square"></i> 수정';
                html += '        </button>';
                html += '        <button type="button" onclick="window.ReferenceAdmin.deleteCard(\'' + card.id + '\')" class="px-2.5 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer">';
                html += '          <i class="fa-solid fa-trash-can"></i> 삭제';
                html += '        </button>';
                html += '      </div>';
                html += '    </div>';
            }

            // 2. 썸네일 이미지 영역
            var safeImg = card.imageUrl ? card.imageUrl.replace(/'/g, "\\'") : fallbackUrl;
            var safeTitle = displayTitle ? displayTitle.replace(/'/g, "\\'") : "구축 실적 이미지";

            html += '    <div class="aspect-video bg-slate-950 relative overflow-hidden cursor-pointer" onclick="openImageModal(\'' + safeImg + '\', \'' + safeTitle + '\')">';
            html += '      <img src="' + card.imageUrl + '" onerror="this.onerror=null;this.src=\'' + fallbackUrl + '\';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="' + safeTitle + '">';
            html += '      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>';
            
            // 좌측 상단 카테고리 배지
            var catI18nKey = card.category === 'food' ? 'ref_badge_food' : (card.category === 'manu' ? 'ref_badge_manu' : 'ref_badge_ecom');
            html += '      <span class="absolute top-3 left-3 ' + catBadgeBg + ' text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">';
            html += '        <i class="fa-solid ' + catIcon + ' text-[10px]"></i> <span data-i18n="' + catI18nKey + '">' + catLabel + '</span>';
            html += '      </span>';

            // 우측 하단 확대보기 안내 배지
            html += '      <span class="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">';
            html += '        <i class="fa-solid fa-expand text-[10px]"></i> <span data-i18n="ref_view_larger">' + labelLarger + '</span>';
            html += '      </span>';
            html += '    </div>';

            // 3. 카드 본문 콘텐츠
            html += '    <div class="p-6">';

            // 특화 서브 뱃지가 있을 경우 표시
            if (displaySubBadge && displaySubBadge.trim().length > 0) {
                var subBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                if (card.category === 'food') {
                    subBadgeColor = 'bg-sky-50 text-sky-700 border-sky-200';
                } else if (card.category === 'manu') {
                    subBadgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                }
                var subBadgeI18nAttr = dict[card.id + '_subbadge'] ? ' data-i18n="' + card.id + '_subbadge"' : '';
                html += '      <div class="flex items-center gap-2 mb-2">';
                html += '        <span class="text-xs font-bold px-2 py-0.5 ' + subBadgeColor + ' border rounded"' + subBadgeI18nAttr + '>' + displaySubBadge + '</span>';
                html += '      </div>';
            }

            // 실적 명칭
            var titleI18nAttr = dict[card.id + '_title'] ? ' data-i18n="' + card.id + '_title"' : '';
            html += '      <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer" onclick="openImageModal(\'' + safeImg + '\', \'' + safeTitle + '\')"' + titleI18nAttr + '>';
            html += '        ' + displayTitle;
            html += '      </h3>';

            // 기술 태그 목록
            if (Array.isArray(card.tags) && card.tags.length > 0) {
                html += '      <div class="flex flex-wrap gap-1.5 mb-3">';
                card.tags.forEach(function (tag, tIdx) {
                    if (tag && tag.trim().length > 0) {
                        var tagI18nKey = card.id + '_tag' + (tIdx + 1);
                        var tagText = dict[tagI18nKey] || tag.trim();
                        var tagI18nAttr = dict[tagI18nKey] ? ' data-i18n="' + tagI18nKey + '"' : '';
                        html += '        <span class="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"' + tagI18nAttr + '>' + tagText + '</span>';
                    }
                });
                html += '      </div>';
            }

            // 상세 설명
            var descI18nAttr = dict[card.id + '_desc'] ? ' data-i18n="' + card.id + '_desc"' : '';
            html += '      <p class="text-sm text-slate-700 leading-relaxed"' + descI18nAttr + '>';
            html += '        ' + displayDesc;
            html += '      </p>';
            html += '    </div>';

            html += '  </div>';

            // 4. 카드 하단: 구축 분야
            var fieldI18nAttr = dict[card.id + '_field'] ? ' data-i18n="' + card.id + '_field"' : '';
            html += '  <div class="px-6 py-4 bg-[#0A101D] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">';
            html += '    <span class="font-medium text-slate-500" data-i18n="ref_field_label">' + labelField + '</span>';
            html += '    <span class="font-semibold text-cyan-400"' + fieldI18nAttr + '>' + displayField + '</span>';
            html += '  </div>';

            html += '</div>';
        });

        container.innerHTML = html;
    }

    // ==========================================================================
    // 8. 레퍼런스 등록 및 수정 모달 생성 및 제어
    // ==========================================================================

    /**
     * 레퍼런스 모달 DOM을 동적으로 보장합니다.
     */
    function ensureReferenceEditModal() {
        var existing = document.getElementById('reference-admin-edit-modal');
        if (existing) return existing;

        var modal = document.createElement('div');
        modal.id = 'reference-admin-edit-modal';
        modal.className = 'fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm hidden items-center justify-center p-4';
        modal.onclick = function (e) {
            if (e.target === modal) {
                closeReferenceEditModal();
            }
        };

        modal.innerHTML = [
            '<div class="bg-white border border-slate-200 w-full max-w-2xl max-h-[92vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col" onclick="event.stopPropagation()">',
            '  <!-- 모달 헤더 -->',
            '  <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0A1020] shrink-0">',
            '    <div class="flex items-center gap-2.5">',
            '      <span class="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-800/60 shadow-sm">',
            '        <i class="fa-solid fa-layer-group text-sm"></i>',
            '      </span>',
            '      <div>',
            '        <h3 id="ref-modal-title" class="text-base sm:text-lg font-bold text-white flex items-center gap-2">',
            '          새 레퍼런스 등록하기',
            '        </h3>',
            '        <p class="text-xs text-slate-400">구축 실적 정보 입력 및 실시간 반영</p>',
            '      </div>',
            '    </div>',
            '    <button type="button" onclick="window.ReferenceAdmin.closeEditModal()" class="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 text-lg leading-none cursor-pointer">',
            '      <i class="fa-solid fa-xmark"></i>',
            '    </button>',
            '  </div>',
            '  <!-- 폼 본문 (스크롤) -->',
            '  <form id="ref-edit-form" onsubmit="window.ReferenceAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">',
            '    <input type="hidden" id="ref-edit-id" value="">',
            '    <!-- 1행: 카테고리 구분 & 구축 분야명 (2열) -->',
            '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '      <div>',
            '        <label for="ref-edit-category" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          카테고리 구분 <span class="text-cyan-400">*</span>',
            '        </label>',
            '        <select id="ref-edit-category" required class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer">',
            '          <option value="ecommerce">이커머스 / 유통 (Ecommerce)</option>',
            '          <option value="food">식음료 / 콜드체인 (Food & ColdChain)</option>',
            '          <option value="manu">제조 / 자동차 (Manufacturing & Auto)</option>',
            '        </select>',
            '      </div>',
            '      <div>',
            '        <label for="ref-edit-field" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          구축 분야명 <span class="text-cyan-400">*</span>',
            '        </label>',
            '        <input type="text" id="ref-edit-field" required placeholder="예: 대형 풀필먼트 허브, 스마트 저온 물류" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all">',
            '      </div>',
            '    </div>',
            '    <!-- 2행: 실적 명칭 (제목) -->',
            '    <div>',
            '      <label for="ref-edit-title" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        구축 실적 제목 <span class="text-cyan-400">*</span>',
            '      </label>',
            '      <input type="text" id="ref-edit-title" required placeholder="예: 국내 최대 이커머스 C사 메가 허브 터미널" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-bold">',
            '    </div>',
            '    <!-- 3행: 특화 서브 뱃지 & 정렬 순서 -->',
            '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '      <div>',
            '        <label for="ref-edit-subbadge" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          상단 특화 뱃지 <span class="text-slate-500 font-normal">(선택 사항)</span>',
            '        </label>',
            '        <input type="text" id="ref-edit-subbadge" placeholder="예: 영하 20℃ 냉동창고, 2차전지 배터리" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all">',
            '      </div>',
            '      <div>',
            '        <label for="ref-edit-order" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          정렬 순서 <span class="text-slate-500 font-normal">(숫자가 작을수록 앞에 표시)</span>',
            '        </label>',
            '        <input type="number" id="ref-edit-order" value="1" min="1" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all">',
            '      </div>',
            '    </div>',
            '    <!-- 4행: 대표 이미지 경로/파일명 -->',
            '    <div>',
            '      <label for="ref-edit-image" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        대표 이미지 파일명 또는 웹 이미지 URL <span class="text-cyan-400">*</span>',
            '      </label>',
            '      <input type="text" id="ref-edit-image" required placeholder="예: H00_레퍼런스_이커머스_1.jpg 또는 https://images.unsplash.com/..." class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-xs">',
            '      <p class="text-[11px] text-slate-500 mt-1">프로젝트 폴더 내 이미지 파일명을 적으시거나 외부 이미지 웹 링크(URL)를 입력하실 수 있습니다.</p>',
            '    </div>',
            '    <!-- 5행: 기술 태그 (쉼표로 구분) -->',
            '    <div>',
            '      <label for="ref-edit-tags" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        적용 기술 태그 <span class="text-slate-500 font-normal">(쉼표로 구분하여 여러 개 입력)</span>',
            '      </label>',
            '      <input type="text" id="ref-edit-tags" placeholder="예: Cross Belt Sorter, WCS, 텔레스코픽, AGV" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all">',
            '    </div>',
            '    <!-- 6행: 상세 설명 (Textarea) -->',
            '    <div>',
            '      <label for="ref-edit-desc" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        구축 내용 상세 설명 <span class="text-cyan-400">*</span>',
            '      </label>',
            '      <textarea id="ref-edit-desc" rows="4" required placeholder="구축된 시스템의 규모, 처리 물동량, 도입 효과 등 상세 내용을 입력해 주세요." class="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-y leading-relaxed"></textarea>',
            '    </div>',
            '    <!-- 모달 푸터 버튼 -->',
            '    <div class="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">',
            '      <button type="button" onclick="window.ReferenceAdmin.closeEditModal()" class="bg-slate-800 hover:bg-slate-700 text-slate-700 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer">',
            '        취소',
            '      </button>',
            '      <button type="submit" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer border border-cyan-400/30">',
            '        <i class="fa-solid fa-check"></i>',
            '        <span>레퍼런스 저장 완료</span>',
            '      </button>',
            '    </div>',
            '  </form>',
            '</div>'
        ].join('');

        document.body.appendChild(modal);
        return modal;
    }

    /**
     * 레퍼런스 작성/수정 모달 열기
     */
    function openReferenceEditModal(refId) {
        var modal = ensureReferenceEditModal();
        var titleEl = document.getElementById('ref-modal-title');
        var form = document.getElementById('ref-edit-form');
        if (form) form.reset();

        var idInput = document.getElementById('ref-edit-id');
        var catSelect = document.getElementById('ref-edit-category');
        var fieldInput = document.getElementById('ref-edit-field');
        var titleInput = document.getElementById('ref-edit-title');
        var subbadgeInput = document.getElementById('ref-edit-subbadge');
        var orderInput = document.getElementById('ref-edit-order');
        var imgInput = document.getElementById('ref-edit-image');
        var tagsInput = document.getElementById('ref-edit-tags');
        var descInput = document.getElementById('ref-edit-desc');

        if (refId) {
            // 수정 모드
            var list = getReferencesList();
            var target = null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === refId) {
                    target = list[i];
                    break;
                }
            }

            if (!target) {
                alert("해당 레퍼런스 실적 정보를 찾을 수 없습니다.");
                return;
            }

            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square text-cyan-400"></i> 레퍼런스 실적 수정하기';
            if (idInput) idInput.value = target.id;
            if (catSelect) catSelect.value = target.category || 'ecommerce';
            if (fieldInput) fieldInput.value = target.field || '';
            if (titleInput) titleInput.value = target.title || '';
            if (subbadgeInput) subbadgeInput.value = target.subBadge || '';
            if (orderInput) orderInput.value = target.sortOrder || 1;
            if (imgInput) imgInput.value = target.imageUrl || '';
            if (tagsInput) tagsInput.value = Array.isArray(target.tags) ? target.tags.join(', ') : '';
            if (descInput) descInput.value = target.description || '';
        } else {
            // 신규 등록 모드
            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-plus text-cyan-400"></i> 새 레퍼런스 등록하기';
            if (idInput) idInput.value = "";
            if (catSelect) {
                // 현재 선택된 카테고리가 'all'이 아니면 해당 카테고리를 기본 선택
                catSelect.value = (currentFilterCategory && currentFilterCategory !== 'all') ? currentFilterCategory : 'ecommerce';
            }
            if (orderInput) {
                var currentList = getReferencesList();
                orderInput.value = currentList.length + 1;
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(function () {
            if (titleInput) titleInput.focus();
        }, 100);
    }

    /**
     * 레퍼런스 모달 닫기
     */
    function closeReferenceEditModal() {
        var modal = document.getElementById('reference-admin-edit-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    /**
     * 레퍼런스 폼 제출 처리 (등록 또는 수정 저장)
     */
    function handleReferenceFormSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();

        var idInput = document.getElementById('ref-edit-id');
        var catSelect = document.getElementById('ref-edit-category');
        var fieldInput = document.getElementById('ref-edit-field');
        var titleInput = document.getElementById('ref-edit-title');
        var subbadgeInput = document.getElementById('ref-edit-subbadge');
        var orderInput = document.getElementById('ref-edit-order');
        var imgInput = document.getElementById('ref-edit-image');
        var tagsInput = document.getElementById('ref-edit-tags');
        var descInput = document.getElementById('ref-edit-desc');

        var editId = idInput ? idInput.value.trim() : "";
        var category = catSelect ? catSelect.value : "ecommerce";
        var field = fieldInput ? fieldInput.value.trim() : "";
        var title = titleInput ? titleInput.value.trim() : "";
        var subBadge = subbadgeInput ? subbadgeInput.value.trim() : "";
        var sortOrder = orderInput ? parseInt(orderInput.value, 10) || 1 : 1;
        var imageUrl = imgInput ? imgInput.value.trim() : "";
        var tagsRaw = tagsInput ? tagsInput.value.trim() : "";
        var description = descInput ? descInput.value.trim() : "";

        if (!title) {
            alert("구축 실적 제목을 입력해 주세요.");
            return;
        }
        if (!imageUrl) {
            alert("대표 이미지 경로 또는 웹 URL을 입력해 주세요.");
            return;
        }
        if (!description) {
            alert("구축 내용 상세 설명을 입력해 주세요.");
            return;
        }

        // 태그 분리 및 정리
        var tags = [];
        if (tagsRaw) {
            tags = tagsRaw.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t.length > 0; });
        }

        var list = getReferencesList();

        if (editId) {
            // 기존 실적 수정
            var found = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === editId) {
                    list[i].category = category;
                    list[i].field = field;
                    list[i].title = title;
                    list[i].subBadge = subBadge;
                    list[i].sortOrder = sortOrder;
                    list[i].imageUrl = imageUrl;
                    list[i].tags = tags;
                    list[i].description = description;
                    found = true;
                    break;
                }
            }
            if (!found) {
                alert("수정할 실적을 찾지 못했습니다.");
                return;
            }
        } else {
            // 신규 실적 추가
            var newId = "ref_" + Date.now();
            var newCard = {
                id: newId,
                category: category,
                field: field,
                title: title,
                subBadge: subBadge,
                sortOrder: sortOrder,
                imageUrl: imageUrl,
                fallbackUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800",
                tags: tags,
                description: description
            };
            list.push(newCard);
        }

        // 정렬 순서대로 재정렬
        list.sort(function (a, b) {
            return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

        saveReferencesList(list);
        closeReferenceEditModal();
        renderReferencesCards(currentFilterCategory);
        alert(editId ? "레퍼런스 실적이 성공적으로 수정되었습니다." : "새로운 레퍼런스 실적이 성공적으로 등록되었습니다.");
    }

    /**
     * 레퍼런스 실적 삭제
     */
    function deleteReferenceCard(refId) {
        if (!confirm("이 레퍼런스 실적을 정말 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.")) {
            return;
        }

        var list = getReferencesList();
        var nextList = list.filter(function (item) {
            return item.id !== refId;
        });

        saveReferencesList(nextList);
        renderReferencesCards(currentFilterCategory);
        alert("레퍼런스 실적이 삭제되었습니다.");
    }

    // ==========================================================================
    // 9. 전역 API 노출 (window.ReferenceAdmin)
    // ==========================================================================
    window.ReferenceAdmin = {
        render: renderReferencesCards,
        openCreateModal: function () {
            openReferenceEditModal(null);
        },
        openEditModal: function (refId) {
            openReferenceEditModal(refId);
        },
        closeEditModal: closeReferenceEditModal,
        handleFormSubmit: handleReferenceFormSubmit,
        deleteCard: deleteReferenceCard,
        resetToDefault: resetReferencesData,
        triggerLoginModal: function () {
            if (typeof window.openAdminLoginModal === 'function') {
                window.openAdminLoginModal();
            } else if (typeof window.openAdminModal === 'function') {
                window.openAdminModal();
            } else {
                alert("관리자 로그인은 페이지 하단 관리자 메뉴를 이용해 주세요.");
            }
        },
        triggerLogout: function () {
            if (window.AdminAuth && typeof window.AdminAuth.logout === 'function') {
                window.AdminAuth.logout();
            } else {
                sessionStorage.removeItem("ata_admin_authenticated");
            }
            if (typeof window.refreshAdminUIState === 'function') {
                window.refreshAdminUIState();
            } else {
                renderReferencesCards(currentFilterCategory);
            }
            alert("관리자 세션에서 로그아웃되었습니다.");
        }
    };

    // 기존 filterReference 함수를 ReferenceAdmin과 상호 연동
    var originalFilterReference = window.filterReference;
    window.filterReference = function (category) {
        currentFilterCategory = category || 'all';
        renderReferencesCards(currentFilterCategory);
        if (typeof originalFilterReference === 'function') {
            try {
                originalFilterReference(category);
            } catch (e) {
                // 무시
            }
        }
    };

    // DOM 로드 완료 시 초기 렌더링
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            renderReferencesCards('all');
        });
    } else {
        renderReferencesCards('all');
    }

    // 다른 탭이나 창에서 관리자 상태 또는 레퍼런스 데이터 변경 시 자동 동기화
    window.addEventListener('storage', function (e) {
        if (e.key === 'ata_admin_authenticated' || e.key === STORAGE_KEY_REFERENCES) {
            renderReferencesCards(currentFilterCategory);
        }
    });

    // 다국어 언어 변경 시 레퍼런스 실적 카드도 즉시 해당 언어로 동기화
    window.addEventListener('languageChanged', function (e) {
        renderReferencesCards(currentFilterCategory);
    });

})();
