/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 회사 연혁 연도별 관리자 모드 CRUD 엔진 (admin_history.js)
 * 
 * [주요 기능]
 * 1. 연도별 연혁 카드 동적 렌더링 (Responsive 3x2 Grid Cards)
 * 2. 관리자 인증(AdminAuth)과 자동 연동 (로그인 시 관리자 툴바 및 수정/삭제 버튼 활성화)
 * 3. 연도별 카드 작성(Create), 수정(Update), 삭제(Delete)
 * 4. 카드 내 세부 마일스톤 항목(월/배지 + 내용) 동적 추가 및 편집
 * 5. 브라우저 로컬 저장소(LocalStorage)를 통한 데이터 영구 보존
 * 6. 언제든 초기 공식 연혁으로 되돌릴 수 있는 '기본값 안전 복원' 기능
 * ==============================================================================
 */

(function () {
    'use strict';

    // 1. 상수 정의
    var STORAGE_KEY_HISTORY = "ata_company_history_db_v3"; // 로컬스토리지 저장 키 (최신 공지사항 동기화 버전)

    // 2. 초기 기본 연혁 데이터 (공식 데이터 - 공지사항 실적 및 인증 내역과 100% 동기화)
    var INITIAL_HISTORY_DATA = [
        {
            id: "hist_2026",
            year: "2026",
            shortYear: "26",
            themeBadge: "NEXT-GEN LOGISTICS & IP",
            themeIcon: "fa-rocket",
            isLatest: true,
            tags: ["#방향전환특허등록", "#웹사이트리뉴얼", "#차량자동화상용화", "#글로벌물류엑스포"],
            items: [
                { id: "item_2026_1", badge: "04월", content: "[컨베이어 물류 분류용 4분할 방향 전환 장치] 특허 등록 (제 10-2956028 호)", i18nKey: "hist_2026_1" },
                { id: "item_2026_2", badge: "03월", content: "공식 웹사이트 리뉴얼 및 4개국어(한국어, 영어, 중국어, 일본어) 글로벌 서비스 오픈", i18nKey: "hist_2026_2" },
                { id: "item_2026_3", badge: "02월", content: "[차세대 택배차량 배송 자동화 시스템] 특허 등록 및 상용화 공급 개시", i18nKey: "hist_2026_3" },
                { id: "item_2026_4", badge: "01월", content: "글로벌 스마트 물류 엑스포(LogiTech Expo 2026) 기술 시연 성료", i18nKey: "hist_2026_4" }
            ]
        },
        {
            id: "hist_2025",
            year: "2025",
            shortYear: "25",
            themeBadge: "GLOBAL & INNOVATION",
            themeIcon: "fa-earth-americas",
            isLatest: false,
            tags: ["#CES2025", "#운송차량특허등록", "#AI특허등록", "#중국지사양산"],
            items: [
                { id: "item_2025_1", badge: "08월", content: "[솔루션] 중국지사·제조사(XingTing) 협력 초고속 4분할 방향전환 소터 양산 본격화", i18nKey: "hist_2025_1" },
                { id: "item_2025_2", badge: "03월", content: "[운송 차량 적재물 분류 및 이송 시스템] 특허 정식 등록 (제 10-2782386 호)", i18nKey: "hist_2025_2" },
                { id: "item_2025_3", badge: "01월", content: "[인공지능 기반 스마트 체형 교정 및 유지 시스템] 특허 등록 (제 10-2758800 호)", i18nKey: "hist_2025_3" },
                { id: "item_2025_4", badge: "01월", content: "세계 최대 전자·IT 전시회 'CES 2025' 라스베이거스 K-스타트업 통합관 참가 성료", i18nKey: "hist_2025_4" }
            ]
        },
        {
            id: "hist_2024",
            year: "2024",
            shortYear: "24",
            themeBadge: "EXPANSION & IP",
            themeIcon: "fa-file-shield",
            isLatest: false,
            tags: ["#ISO9001_14001", "#벤처기업인증", "#연구개발전담부서", "#R&D최우수판정", "#도로공사상생기업"],
            items: [
                { id: "item_2024_1", badge: "11월", content: "ISO 9001 (품질경영시스템) & ISO 14001 (환경경영시스템) 국제표준 공식 인증 획득", i18nKey: "hist_2024_1" },
                { id: "item_2024_2", badge: "11월", content: "[운송 차량 적재물의 분류 및 이송 장치] 특허 출원 (10-2024-0164627)", i18nKey: "hist_2024_2" },
                { id: "item_2024_3", badge: "10월", content: "국가 R&D 연구개발 전문인력 실무 교육과정 수료", i18nKey: "hist_2024_3" },
                { id: "item_2024_4", badge: "09월", content: "한국도로공사 상생협력형 창업·벤처기업 공식 파트너 선정 (2024.09.10)", i18nKey: "hist_2024_4" },
                { id: "item_2024_5", badge: "07월", content: "중소벤처기업부 국가 R&D 지원사업 최종 성과평가 최고등급 [최우수 판정] 획득 (2024.07.20)", i18nKey: "hist_2024_5" },
                { id: "item_2024_6", badge: "06월", content: "중소벤처기업진흥공단 혁신성장유형 '벤처기업확인서' 획득 (2024.06.15)", i18nKey: "hist_2024_6" },
                { id: "item_2024_7", badge: "06월", content: "국토교통 과학기술진흥원(KAIA) 기업지원센터 입주 선정", i18nKey: "hist_2024_7" },
                { id: "item_2024_8", badge: "05월", content: "인천창조경제혁신센터 스마트 물류 창업 공모전 [장려상] 수상 (2024.05.20)", i18nKey: "hist_2024_8" },
                { id: "item_2024_9", badge: "05월", content: "중소벤처기업부 창업기술개발사업 최종 선정", i18nKey: "hist_2024_9" },
                { id: "item_2024_10", badge: "04월", content: "과학기술정보통신부 · KOITA 공식 '연구개발전담부서' 인정 획득 (2024.04.10)", i18nKey: "hist_2024_10" },
                { id: "item_2024_11", badge: "04월", content: "창업진흥원 초기창업패키지 지원사업 선정", i18nKey: "hist_2024_11" },
                { id: "item_2024_12", badge: "03월", content: "[물류장비 4분할 방향전환장치] 및 [AI 스마트 체형교정] 특허 출원", i18nKey: "hist_2024_12" },
                { id: "item_2024_13", badge: "02월", content: "중소벤처기업부 공식 '창업기업확인서' 획득 (2024.02.26)", i18nKey: "hist_2024_13" }
            ]
        },
        {
            id: "hist_2023",
            year: "2023",
            shortYear: "23",
            themeBadge: "R&D & TECH INNOVATION",
            themeIcon: "fa-award",
            isLatest: false,
            tags: ["#창의상수상", "#기술혁신기업", "#창업성장디딤돌", "#독일기술협력"],
            items: [
                { id: "item_2023_1", badge: "11월", content: "강원창조경제혁신센터(원주) 중·장년 기술창업 공모전 [창의상] 수상 (2023.11.15)", i18nKey: "hist_2023_1" },
                { id: "item_2023_2", badge: "선정", content: "중소벤처기업진흥공단 기술혁신 기업 선정", i18nKey: "hist_2023_2" },
                { id: "item_2023_3", badge: "선정", content: "중소벤처기업부 창업성장기술개발사업 디딤돌 지원사업 선정", i18nKey: "hist_2023_3" },
                { id: "item_2023_4", badge: "선정", content: "중소벤처기업부 R&D 기획사업 선정", i18nKey: "hist_2023_4" },
                { id: "item_2023_5", badge: "글로벌", content: "독일 Cellumation社 기술 협력 및 스마트 물류 모듈 도입 추진", i18nKey: "hist_2023_5" }
            ]
        },
        {
            id: "hist_2022",
            year: "2022",
            shortYear: "22",
            themeBadge: "FOUNDATION & INFRA",
            themeIcon: "fa-building-flag",
            isLatest: false,
            tags: ["#법인설립", "#재도전성공패키지", "#스마트물류설계"],
            items: [
                { id: "item_2022_1", badge: "01월", content: "주식회사 에이티에이기술 설립 (ATA Technology Co., Ltd.)", i18nKey: "hist_2022_1" },
                { id: "item_2022_2", badge: "선정", content: "중소벤처기업부 재도전 성공 패키지 일반형 사업 선정 (R&D)", i18nKey: "hist_2022_2" },
                { id: "item_2022_3", badge: "엔지니어링", content: "스마트 물류 자동화 설비 기획 및 엔지니어링 인프라 구축", i18nKey: "hist_2022_3" }
            ]
        },
        {
            id: "hist_before_2021",
            year: "2021 이전",
            shortYear: "~21",
            themeBadge: "ORIGIN & CORE PATENT",
            themeIcon: "fa-lightbulb",
            isLatest: false,
            tags: ["#원천특허등록", "#택배차량자동화", "#물류엔지니어링"],
            items: [
                { id: "item_2021_1", badge: "10월", content: "[탑차 적재물의 자동 분류 및 이송장치] 핵심 원천 특허 등록 (제 10-2317010 호)", i18nKey: "hist_2021_1" },
                { id: "item_2021_2", badge: "출원", content: "[적재물의 자동분류 및 이송장치] 특허 출원 (2020.10)", i18nKey: "hist_2021_2" },
                { id: "item_2021_3", badge: "출원", content: "항공 수화물의 자동분류 택배 배송 시스템 및 그 시스템을 이용한 항공 수화물 택배 배송 방법 특허 출원", i18nKey: "hist_2021_3" },
                { id: "item_2021_4", badge: "사업", content: "대형 물류센터 공정 수립 및 공정 개선 엔지니어링 서비스 사업 수행", i18nKey: "hist_2021_4" }
            ]
        }
    ];

    // ==========================================================================
    // 3. 데이터 저장 및 조회 함수 (LocalStorage)
    // ==========================================================================

    /**
     * 로컬 저장소에서 연혁 카드 목록을 가져옵니다.
     * 없으면 초기 기본 데이터를 저장한 후 반환합니다.
     * (2026년 최신 공식 연혁이 누락되어 있을 경우 자동으로 최상단에 병합 동기화합니다)
     */
    function getHistoryList() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_HISTORY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // 2026년 최신 공식 연혁 누락 시 자동 추가 및 isLatest 플래그 동기화
                    var has2026 = parsed.some(function (c) { return c.year === "2026" || c.id === "hist_2026"; });
                    if (!has2026) {
                        var item2026 = INITIAL_HISTORY_DATA.find(function (c) { return c.id === "hist_2026"; });
                        if (item2026) {
                            parsed.forEach(function (c) { c.isLatest = false; });
                            parsed.unshift(JSON.parse(JSON.stringify(item2026)));
                            saveHistoryList(parsed);
                        }
                    }
                    return parsed;
                }
            }
        } catch (e) {
            console.error("연혁 데이터 로딩 실패:", e);
        }
        // 기본값 저장 후 반환
        saveHistoryList(INITIAL_HISTORY_DATA);
        return JSON.parse(JSON.stringify(INITIAL_HISTORY_DATA));
    }

    /**
     * 연혁 카드 목록을 로컬 저장소에 영구 저장합니다.
     */
    function saveHistoryList(list) {
        try {
            localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(list));
            return true;
        } catch (e) {
            console.error("연혁 데이터 저장 실패:", e);
            return false;
        }
    }

    /**
     * 연혁 데이터를 최초 공식 기본값으로 안전하게 복원합니다.
     */
    function resetHistoryData() {
        if (!confirm("회사 연혁을 최초 공식 기본 데이터로 복원하시겠습니까?\n(직접 추가하거나 수정한 연혁 내용이 초기화됩니다.)")) {
            return;
        }
        saveHistoryList(INITIAL_HISTORY_DATA);
        renderHistoryCards();
        alert("회사 연혁이 최초 기본 데이터로 안전하게 복원되었습니다.");
    }

    // ==========================================================================
    // 4. 관리자 로그인 확인
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
    // 5. 화면 렌더링 함수 (renderHistoryCards)
    // ==========================================================================
    function renderHistoryCards() {
        var container = document.getElementById('history-cards-container');
        if (!container) return;

        var historyList = getHistoryList();
        var isAdmin = isUserAdmin();

        // 상단 관리자 컨트롤 패널 업데이트
        renderAdminControlBar(isAdmin);

        var html = '';

        historyList.forEach(function (card, index) {
            var isHighlight = card.isLatest === true;

            // 카드 스타일 설정 (최신 연도 하이라이트 vs 최신년도 이전 연도 카드 색상 차별화)
            var cardBorderClass = isHighlight
                ? 'border-2 border-blue-500/90 shadow-[0_12px_32px_rgba(2,132,199,0.18)] hover:shadow-[0_18px_45px_rgba(2,132,199,0.28)] bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-white text-slate-900 ring-2 ring-blue-400/25'
                : 'border border-slate-300/80 hover:border-slate-400 shadow-sm hover:shadow-lg bg-gradient-to-br from-slate-100/95 via-slate-50 to-slate-100/70 hover:bg-white text-slate-700';

            var badgeBg = isHighlight
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-200/90 border border-slate-300 text-slate-700 shadow-inner';

            html += '<div class="fade-in group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ' + cardBorderClass + '" id="card-' + card.id + '">';

            // 최신 연도 표시 뱃지
            if (isHighlight) {
                html += '  <div class="absolute -top-3.5 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">';
                html += '    Latest ' + card.year;
                html += '  </div>';
            }

            // 관리자 모드인 경우: 카드 상단에 수정/삭제 액션 버튼 바 표시
            if (isAdmin) {
                html += '  <div class="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20 bg-blue-50 border-b border-blue-100 -mx-3 -mt-3 p-2.5 rounded-t-xl">';
                html += '    <span class="text-xs font-bold text-blue-800 flex items-center gap-1.5">';
                html += '      <i class="fa-solid fa-gear text-blue-600"></i> 관리자 편집';
                html += '    </span>';
                html += '    <div class="flex items-center gap-1.5">';
                html += '      <button type="button" onclick="window.HistoryAdmin.openEditModal(\'' + card.id + '\')" class="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1 shadow-sm">';
                html += '        <i class="fa-solid fa-pen-to-square"></i> 수정';
                html += '      </button>';
                html += '      <button type="button" onclick="window.HistoryAdmin.deleteCard(\'' + card.id + '\')" class="px-2.5 py-1 text-xs font-semibold rounded bg-rose-600/80 hover:bg-rose-500 text-white transition-colors flex items-center gap-1 shadow-sm">';
                html += '        <i class="fa-solid fa-trash-can"></i> 삭제';
                html += '      </button>';
                html += '    </div>';
                html += '  </div>';
            }

            html += '  <div>';
            // 카드 상단: 연도 타이틀 & 테마 칩
            html += '    <div class="flex items-center justify-between border-b ' + (isHighlight ? 'border-blue-200' : 'border-slate-200') + ' pb-4 mb-5">';
            html += '      <div class="flex items-center gap-3">';
            html += '        <div class="w-12 h-12 rounded-xl ' + badgeBg + ' flex items-center justify-center text-xl font-black shadow-inner">';
            html += '          ' + (card.shortYear || card.year.substring(2) || 'ATA');
            html += '        </div>';
            html += '        <div>';
            html += '          <h4 class="text-2xl font-black text-slate-900 tracking-tight">' + card.year + '</h4>';
            html += '          <span class="text-xs ' + (isHighlight ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold') + ' font-medium">' + card.themeBadge + '</span>';
            html += '        </div>';
            html += '      </div>';
            html += '      <div class="w-9 h-9 rounded-lg ' + (isHighlight ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-slate-200/80 text-slate-600 border border-slate-300') + ' flex items-center justify-center group-hover:scale-110 transition-transform">';
            html += '        <i class="fa-solid ' + (card.themeIcon || 'fa-award') + '"></i>';
            html += '      </div>';
            html += '    </div>';

            // 마일스톤 항목 리스트
            html += '    <ul class="space-y-3.5 text-slate-700 text-sm">';
            if (Array.isArray(card.items) && card.items.length > 0) {
                card.items.forEach(function (item) {
                    var itemBadgeStyle = isHighlight
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : 'bg-slate-200/90 text-slate-700 border-slate-300';

                    html += '      <li class="flex items-start gap-2.5">';
                    html += '        <span class="px-2 py-0.5 text-[11px] font-bold rounded ' + itemBadgeStyle + ' border shrink-0 mt-0.5">' + (item.badge || '월') + '</span>';
                    if (item.i18nKey) {
                        html += '        <span class="leading-relaxed font-medium" data-i18n="' + item.i18nKey + '">' + item.content + '</span>';
                    } else {
                        html += '        <span class="leading-relaxed font-medium">' + item.content + '</span>';
                    }
                    html += '      </li>';
                });
            } else {
                html += '      <li class="text-slate-400 text-xs py-2">등록된 세부 연혁이 없습니다.</li>';
            }
            html += '    </ul>';
            html += '  </div>';

            // 카드 하단 태그 영역
            html += '  <div class="mt-6 pt-4 border-t ' + (isHighlight ? 'border-blue-100' : 'border-slate-200') + ' flex flex-wrap gap-1.5">';
            if (Array.isArray(card.tags) && card.tags.length > 0) {
                card.tags.forEach(function (tag) {
                    var tagStyle = isHighlight
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-200/80 text-slate-700 border-slate-300';
                    html += '    <span class="text-[11px] px-2 py-0.5 rounded ' + tagStyle + ' border">' + tag + '</span>';
                });
            }
            html += '  </div>';

            html += '</div>';
        });

        // 마지막 6번째 카드: 미래 로드맵 & 원본 도표 팝업 카드 (3x2 완벽 그리드)
        html += '<div class="fade-in group rounded-2xl p-7 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-xl flex flex-col justify-between">';
        html += '  <div>';
        html += '    <div class="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">';
        html += '      <div class="flex items-center gap-3">';
        html += '        <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white text-xl font-black shadow-lg">';
        html += '          <i class="fa-solid fa-compass-drafting"></i>';
        html += '        </div>';
        html += '        <div>';
        html += '          <h4 class="text-2xl font-black text-slate-900 tracking-tight">ROADMAP</h4>';
        html += '          <span class="text-xs text-blue-600 font-semibold">FUTURE & EXPANSION</span>';
        html += '        </div>';
        html += '      </div>';
        html += '      <div class="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">';
        html += '        <i class="fa-solid fa-arrow-trend-up"></i>';
        html += '      </div>';
        html += '    </div>';
        html += '    <p class="text-slate-600 text-sm leading-relaxed mb-5">';
        html += '      에이티에이기술은 스마트 물류의 혁신 모듈과 AI 헬스케어 기술의 융합을 통해 지속 가능한 미래를 구축하고 글로벌 리더로 도약하고 있습니다.';
        html += '    </p>';
        html += '    <div class="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2 shadow-sm">';
        html += '      <div class="flex items-center gap-2 text-blue-700 font-semibold">';
        html += '        <i class="fa-solid fa-diagram-project"></i> 회사 연혁 종합 도표';
        html += '      </div>';
        html += '      <p class="text-slate-500 leading-normal">';
        html += '        공식 인증 연혁 도표 원본 이미지를 고해상도 팝업으로 직접 확인하실 수 있습니다.';
        html += '      </p>';
        html += '    </div>';
        html += '  </div>';
        html += '  <div class="mt-6 pt-4 border-t border-slate-100">';
        html += '    <button type="button" onclick="openHistoryRoadmapModal()" class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-500 text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">';
        html += '      <i class="fa-solid fa-image"></i> 원본 연혁 로드맵 보기';
        html += '    </button>';
        html += '  </div>';
        html += '</div>';

        container.innerHTML = html;

        // 다국어 스위칭 엔진 적용 (i18n.js 연동)
        if (window.i18n && typeof window.i18n.applyCurrentLang === 'function') {
            window.i18n.applyCurrentLang();
        }
    }

    // ==========================================================================
    // 6. 관리자 컨트롤 패널 바 렌더링
    // ==========================================================================
    function renderAdminControlBar(isAdmin) {
        var barContainer = document.getElementById('history-admin-control-bar');
        if (!barContainer) return;

        if (isAdmin) {
            barContainer.innerHTML = [
                '<div class="flex flex-wrap items-center justify-between gap-3 p-4 mb-8 bg-blue-50/90 border border-blue-200 rounded-2xl shadow-sm">',
                '  <div class="flex items-center gap-3">',
                '    <div class="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-200 shadow-sm">',
                '      <i class="fa-solid fa-shield-halved"></i>',
                '    </div>',
                '    <div>',
                '      <div class="flex items-center gap-2">',
                '        <h5 class="text-sm font-extrabold text-slate-900">회사 연혁 관리자 모드 활성화</h5>',
                '        <span class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold">인증됨</span>',
                '      </div>',
                '      <p class="text-xs text-slate-600 mt-0.5">연도별 카드를 추가하거나 각 카드의 수정/삭제 버튼을 눌러 연혁을 편집할 수 있습니다.</p>',
                '    </div>',
                '  </div>',
                '  <div class="flex items-center gap-2 flex-wrap">',
                '    <button type="button" onclick="window.HistoryAdmin.openCreateModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer">',
                '      <i class="fa-solid fa-plus"></i> 새 연도 카드 추가',
                '    </button>',
                '    <button type="button" onclick="window.HistoryAdmin.syncAllNoticesToHistory()" class="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="공지사항 게시판의 최신 글들을 연혁과 실시간 동기화">',
                '      <i class="fa-solid fa-arrows-rotate text-indigo-600"></i> 공지사항 연혁 동기화',
                '    </button>',
                '    <button type="button" onclick="window.HistoryAdmin.resetToDefault()" class="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="최초 기본 데이터 복원">',
                '      <i class="fa-solid fa-rotate-left"></i> 기본값 복원',
                '    </button>',
                '    <button type="button" onclick="window.HistoryAdmin.triggerLogout()" class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-rose-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer">',
                '      <i class="fa-solid fa-right-from-bracket"></i> 로그아웃',
                '    </button>',
                '  </div>',
                '</div>'
            ].join('');
            barContainer.classList.remove('hidden');
        } else {
            // 미로그인 상태: 관리자 로그인 진입 링크만 은은하게 노출
            barContainer.innerHTML = [
                '<div class="flex justify-end mb-4">',
                '  <button type="button" onclick="window.HistoryAdmin.triggerLoginModal()" class="text-xs text-slate-500 hover:text-cyan-400 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1 rounded-lg hover:bg-slate-800/60 border border-transparent hover:border-slate-800">',
                '    <i class="fa-solid fa-lock text-[10px]"></i> 관리자 모드',
                '  </button>',
                '</div>'
            ].join('');
            barContainer.classList.remove('hidden');
        }
    }

    // ==========================================================================
    // 7. 연도 카드 모달 에디터 (작성 및 수정 폼)
    // ==========================================================================

    /**
     * 연도 카드 생성 또는 수정용 모달 에디터를 엽니다.
     * @param {string|null} cardId - 수정할 카드의 ID (null이면 신규 작성)
     */
    function openHistoryEditModal(cardId) {
        var modal = document.getElementById('history-editor-modal');
        if (!modal) {
            createHistoryEditorModalDOM();
            modal = document.getElementById('history-editor-modal');
        }

        var isEdit = !!cardId;
        var card = null;

        if (isEdit) {
            var list = getHistoryList();
            card = list.find(function (c) { return c.id === cardId; });
            if (!card) {
                alert("해당 연도 카드를 찾을 수 없습니다.");
                return;
            }
        }

        // 모달 타이틀 설정
        document.getElementById('hist-modal-title').textContent = isEdit ? (card.year + '년 연혁 카드 수정') : '새 연도 카드 등록';
        document.getElementById('hist-edit-id').value = isEdit ? card.id : ('hist_' + Date.now());

        // 기본 정보 폼 값 채우기
        document.getElementById('hist-edit-year').value = isEdit ? card.year : new Date().getFullYear();
        document.getElementById('hist-edit-short-year').value = isEdit ? card.shortYear : String(new Date().getFullYear()).substring(2);
        document.getElementById('hist-edit-theme').value = isEdit ? card.themeBadge : 'EXPANSION & INNOVATION';
        document.getElementById('hist-edit-icon').value = isEdit ? card.themeIcon : 'fa-award';
        document.getElementById('hist-edit-is-latest').checked = isEdit ? (card.isLatest === true) : false;
        document.getElementById('hist-edit-tags').value = (isEdit && card.tags) ? card.tags.join(', ') : '#신규사업, #특허출원';

        // 세부 마일스톤 항목 동적 목록 채우기
        renderMilestoneItemInputs(isEdit && card.items ? card.items : [
            { id: 'item_' + Date.now(), badge: '01월', content: '신규 프로젝트 추진 및 특허 출원' }
        ]);

        // 모달 표시
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    /**
     * 모달 닫기
     */
    function closeHistoryEditModal() {
        var modal = document.getElementById('history-editor-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    }

    /**
     * 마일스톤 세부 항목 입력 폼 렌더링
     */
    function renderMilestoneItemInputs(items) {
        var container = document.getElementById('hist-milestones-container');
        if (!container) return;

        var html = '';
        items.forEach(function (item, idx) {
            html += '<div class="milestone-row flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200" data-id="' + (item.id || ('item_' + Date.now() + '_' + idx)) + '">';
            html += '  <input type="text" class="milestone-badge w-20 px-2.5 py-1.5 bg-[#0D1629] border border-slate-700 rounded-lg text-xs font-bold text-cyan-300 text-center focus:border-cyan-400 focus:outline-none" placeholder="01월" value="' + (item.badge || '월') + '">';
            html += '  <input type="text" class="milestone-content flex-1 px-3 py-1.5 bg-[#0D1629] border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none" placeholder="연혁 세부 내용 입력" value="' + (item.content ? item.content.replace(/"/g, '&quot;') : '') + '">';
            html += '  <button type="button" onclick="this.parentElement.remove()" class="w-8 h-8 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 flex items-center justify-center text-xs transition-colors" title="이 항목 삭제">';
            html += '    <i class="fa-solid fa-trash-can"></i>';
            html += '  </button>';
            html += '</div>';
        });

        container.innerHTML = html;
    }

    /**
     * 모달 내 [마일스톤 항목 추가] 버튼 클릭 시 한 줄 추가
     */
    function addMilestoneRow() {
        var container = document.getElementById('hist-milestones-container');
        if (!container) return;

        var div = document.createElement('div');
        div.className = 'milestone-row flex items-center gap-2 p-2 bg-[#080E1A] rounded-xl border border-slate-200';
        div.setAttribute('data-id', 'item_' + Date.now());
        div.innerHTML = [
            '<input type="text" class="milestone-badge w-20 px-2.5 py-1.5 bg-[#0D1629] border border-slate-700 rounded-lg text-xs font-bold text-cyan-300 text-center focus:border-cyan-400 focus:outline-none" placeholder="01월" value="01월">',
            '<input type="text" class="milestone-content flex-1 px-3 py-1.5 bg-[#0D1629] border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none" placeholder="연혁 세부 내용 입력">',
            '<button type="button" onclick="this.parentElement.remove()" class="w-8 h-8 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 flex items-center justify-center text-xs transition-colors" title="이 항목 삭제">',
            '  <i class="fa-solid fa-trash-can"></i>',
            '</button>'
        ].join('');

        container.appendChild(div);
    }

    /**
     * 모달 폼 저장 처리
     */
    function saveHistoryModalData() {
        var cardId = document.getElementById('hist-edit-id').value;
        var year = document.getElementById('hist-edit-year').value.trim();
        var shortYear = document.getElementById('hist-edit-short-year').value.trim();
        var themeBadge = document.getElementById('hist-edit-theme').value.trim();
        var themeIcon = document.getElementById('hist-edit-icon').value.trim();
        var isLatest = document.getElementById('hist-edit-is-latest').checked;
        var tagsRaw = document.getElementById('hist-edit-tags').value;

        if (!year) {
            alert("연도를 입력해 주세요.");
            document.getElementById('hist-edit-year').focus();
            return;
        }

        // 태그 파싱
        var tags = tagsRaw.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t.length > 0; });

        // 마일스톤 항목 수집
        var rows = document.querySelectorAll('#hist-milestones-container .milestone-row');
        var items = [];
        rows.forEach(function (row) {
            var badgeInput = row.querySelector('.milestone-badge');
            var contentInput = row.querySelector('.milestone-content');
            var itemId = row.getAttribute('data-id') || ('item_' + Date.now());

            var badge = badgeInput ? badgeInput.value.trim() : '월';
            var content = contentInput ? contentInput.value.trim() : '';

            if (content) {
                items.push({
                    id: itemId,
                    badge: badge || '월',
                    content: content
                });
            }
        });

        if (items.length === 0) {
            alert("적어도 하나 이상의 연혁 세부 항목을 입력해 주세요.");
            return;
        }

        var list = getHistoryList();
        var existingIdx = list.findIndex(function (c) { return c.id === cardId; });

        // 만약 최신 연도(isLatest)로 설정된 경우 다른 모든 카드의 최신 플래그를 false로 조정
        if (isLatest) {
            list.forEach(function (c) { c.isLatest = false; });
        }

        var newCard = {
            id: cardId,
            year: year,
            shortYear: shortYear || (year.length > 2 ? year.slice(-2) : year),
            themeBadge: themeBadge || 'INNOVATION',
            themeIcon: themeIcon || 'fa-award',
            isLatest: isLatest,
            tags: tags,
            items: items
        };

        if (existingIdx >= 0) {
            // 수정 (Update)
            list[existingIdx] = newCard;
        } else {
            // 신규 추가 (Create) - 최신순 정렬을 위해 맨 앞에 삽입
            list.unshift(newCard);
        }

        saveHistoryList(list);
        closeHistoryEditModal();
        renderHistoryCards();
        alert(year + "년 연혁 카드가 성공적으로 저장되었습니다!");
    }

    /**
     * 연도 카드 삭제
     */
    function deleteHistoryCard(cardId) {
        var list = getHistoryList();
        var card = list.find(function (c) { return c.id === cardId; });
        if (!card) return;

        if (!confirm("[" + card.year + "년] 연혁 카드를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
            return;
        }

        list = list.filter(function (c) { return c.id !== cardId; });
        saveHistoryList(list);
        renderHistoryCards();
        alert("[" + card.year + "년] 카드가 삭제되었습니다.");
    }

    // ==========================================================================
    // 6-1. 공지사항(Notice) <-> 회사 연혁(History) 자동 동기화 엔진
    // ==========================================================================

    /**
     * 특정 공지사항이 이미 연혁 마일스톤에 등록되어 있는지 여부를 검사합니다.
     * @param {string} noticeId - 공지사항 고유 ID
     * @returns {boolean}
     */
    function hasNoticeMilestone(noticeId) {
        if (!noticeId) return false;
        var list = getHistoryList();
        return list.some(function (card) {
            return Array.isArray(card.items) && card.items.some(function (it) {
                return it.noticeId === noticeId || it.id === ("notice_item_" + noticeId);
            });
        });
    }

    /**
     * 공지사항 데이터를 바탕으로 해당 연도 및 월의 회사 연혁 카드에 마일스톤 항목을 자동 추가/동기화합니다.
     * @param {Object} notice - 공지사항 객체 { id, date, title, titleKo, category }
     * @returns {Object} 결과 { success: boolean, year: string, month: string }
     */
    function syncNoticeToHistory(notice) {
        if (!notice) return { success: false, message: "공지사항 데이터가 없습니다." };

        var noticeId = notice.id || ('notice_' + Date.now());
        var dateStr = notice.date || new Date().toISOString().split('T')[0];
        var parts = dateStr.split('-');
        var year = parts[0] || String(new Date().getFullYear());
        var monthNum = parts[1] ? parseInt(parts[1], 10) : (new Date().getMonth() + 1);
        var badgeText = (monthNum < 10 ? '0' + monthNum : '' + monthNum) + '월';

        // 공지 제목 추출 (다국어 객체 또는 문자열 대응)
        var titleText = "";
        if (notice.title && typeof notice.title === 'object') {
            titleText = notice.title.ko || notice.title.en || Object.values(notice.title)[0] || "";
        } else if (notice.titleKo) {
            titleText = notice.titleKo;
        } else if (typeof notice.title === 'string') {
            titleText = notice.title;
        }
        titleText = titleText.trim();
        if (!titleText) return { success: false, message: "공지사항 제목이 비어있습니다." };

        var list = getHistoryList();

        // 1. 혹시 다른 연도나 기존 위치에 남아있던 동일 공지 마일스톤 정리 (날짜 변경 등에 대응)
        list.forEach(function (card) {
            if (Array.isArray(card.items)) {
                card.items = card.items.filter(function (it) {
                    return it.noticeId !== noticeId && it.id !== ("notice_item_" + noticeId);
                });
            }
        });

        // 2. 해당 연도 카드 탐색 (2021년 이전 레거시 카드 포함)
        var targetCard = list.find(function (c) {
            return String(c.year) === String(year) || (parseInt(year, 10) <= 2021 && c.id === "hist_before_2021");
        });

        var noticeItemId = "notice_item_" + noticeId;
        var newMilestone = {
            id: noticeItemId,
            badge: badgeText,
            content: titleText,
            noticeId: noticeId
        };

        if (targetCard) {
            if (!Array.isArray(targetCard.items)) targetCard.items = [];
            // 월 내림차순(최신 월 상단)에 맞추어 적절한 위치에 삽입
            var inserted = false;
            for (var i = 0; i < targetCard.items.length; i++) {
                var itemBadge = targetCard.items[i].badge || '';
                var itemMonth = parseInt(itemBadge, 10);
                if (!isNaN(itemMonth) && monthNum >= itemMonth) {
                    targetCard.items.splice(i, 0, newMilestone);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                targetCard.items.push(newMilestone);
            }
        } else {
            // 해당 연도 카드가 없으면 신규 연도 카드 자동 생성
            var maxYear = 0;
            list.forEach(function (c) {
                var y = parseInt(c.year, 10);
                if (!isNaN(y) && y > maxYear) maxYear = y;
            });
            var isNewLatest = parseInt(year, 10) >= maxYear;
            if (isNewLatest) {
                list.forEach(function (c) { c.isLatest = false; });
            }

            var categoryIcons = {
                patent: "fa-certificate",
                cert: "fa-file-shield",
                award: "fa-award",
                tech: "fa-microchip",
                press: "fa-newspaper",
                notice: "fa-rocket"
            };

            var newCard = {
                id: "hist_" + year,
                year: year,
                shortYear: year.length > 2 ? year.slice(-2) : year,
                themeBadge: (notice.category ? notice.category.toUpperCase() : "INNOVATION") + " & MILESTONES",
                themeIcon: categoryIcons[notice.category] || "fa-award",
                isLatest: isNewLatest,
                tags: ["#" + year + "공지사항", "#스마트물류", "#실적동기화"],
                items: [newMilestone]
            };

            var insertIdx = list.findIndex(function (c) { return parseInt(c.year, 10) < parseInt(year, 10); });
            if (insertIdx >= 0) {
                list.splice(insertIdx, 0, newCard);
            } else {
                list.push(newCard);
            }
        }

        saveHistoryList(list);
        renderHistoryCards();
        return { success: true, year: year, month: badgeText };
    }

    /**
     * 공지사항 삭제 시 연동된 연혁 마일스톤 항목도 동시 삭제
     * @param {string} noticeId - 삭제할 공지사항 고유 ID
     */
    function removeMilestoneByNoticeId(noticeId) {
        if (!noticeId) return false;
        var list = getHistoryList();
        var modified = false;

        list.forEach(function (card) {
            if (Array.isArray(card.items)) {
                var initialLen = card.items.length;
                card.items = card.items.filter(function (it) {
                    return it.noticeId !== noticeId && it.id !== ("notice_item_" + noticeId);
                });
                if (card.items.length < initialLen) {
                    modified = true;
                }
            }
        });

        if (modified) {
            saveHistoryList(list);
            renderHistoryCards();
        }
        return modified;
    }

    /**
     * 공지사항 데이터베이스(window.noticeBoardDB)의 모든 글을 회사 연혁 카드에 일괄 동기화
     */
    function syncAllNoticesToHistory() {
        var notices = window.noticeBoardDB;
        if (!Array.isArray(notices) || notices.length === 0) {
            alert("동기화할 공지사항 데이터가 없습니다.");
            return;
        }

        var count = 0;
        notices.forEach(function (notice) {
            var res = syncNoticeToHistory(notice);
            if (res && res.success) count++;
        });

        alert("총 " + count + "건의 공지사항이 회사 연혁 카드에 성공적으로 동시 적용(동기화)되었습니다.");
    }

    /**
     * 모달 DOM 동적 생성
     */
    function createHistoryEditorModalDOM() {
        if (document.getElementById('history-editor-modal')) return;

        var modal = document.createElement('div');
        modal.id = 'history-editor-modal';
        modal.className = 'fixed inset-0 z-[320] bg-slate-900/60 backdrop-blur-sm hidden items-center justify-center p-4 transition-all duration-300';
        modal.onclick = function (e) {
            if (e.target === modal) closeHistoryEditModal();
        };

        modal.innerHTML = [
            '<div class="relative max-w-2xl w-full bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">',
            '  <!-- 모달 헤더 -->',
            '  <div class="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 text-slate-900">',
            '    <div class="flex items-center gap-2 text-slate-900 font-bold text-base">',
            '      <i class="fa-solid fa-calendar-check text-cyan-400"></i>',
            '      <span id="hist-modal-title">회사 연혁 카드 관리</span>',
            '    </div>',
            '    <button type="button" onclick="window.HistoryAdmin.closeEditModal()" class="text-slate-400 hover:text-slate-700 text-lg w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">',
            '      <i class="fa-solid fa-xmark"></i>',
            '    </button>',
            '  </div>',
            '  <!-- 모달 바디 스크롤 영역 -->',
            '  <div class="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">',
            '    <input type="hidden" id="hist-edit-id">',
            '    <!-- 연도 및 뱃지 입력 그리드 -->',
            '    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">',
            '      <div>',
            '        <label class="block text-xs font-semibold text-slate-700 mb-1.5">연도 표시명 (예: 2026, 2021 이전) *</label>',
            '        <input type="text" id="hist-edit-year" class="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 text-sm" placeholder="2026">',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-semibold text-slate-700 mb-1.5">상단 원형 뱃지 약어 (예: 26, ~21) *</label>',
            '        <input type="text" id="hist-edit-short-year" class="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 text-sm" placeholder="26">',
            '      </div>',
            '    </div>',
            '    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">',
            '      <div>',
            '        <label class="block text-xs font-semibold text-slate-700 mb-1.5">테마 키워드 칩 (예: GLOBAL & AI)</label>',
            '        <input type="text" id="hist-edit-theme" class="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 text-sm" placeholder="EXPANSION & IP">',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-semibold text-slate-700 mb-1.5">폰트어썸 아이콘 (예: fa-rocket, fa-award)</label>',
            '        <input type="text" id="hist-edit-icon" class="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 text-sm" placeholder="fa-rocket">',
            '      </div>',
            '    </div>',
            '    <!-- 최신 연도 하이라이트 체크박스 -->',
            '    <div class="flex items-center gap-2 p-3 bg-[#080E1A] rounded-xl border border-slate-800">',
            '      <input type="checkbox" id="hist-edit-is-latest" class="w-4 h-4 rounded text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-[#0D1629] border-slate-700 cursor-pointer">',
            '      <label for="hist-edit-is-latest" class="text-xs text-slate-700 cursor-pointer">',
            '        <span class="font-bold text-cyan-300">최신 대표 연도로 강조 표시 (Latest Badge & Neon Glow)</span>',
            '        <span class="block text-[11px] text-slate-500">체크하면 카드 테두리에 네온 발광 효과가 적용되고 상단에 Latest 뱃지가 부착됩니다.</span>',
            '      </label>',
            '    </div>',
            '    <!-- 하단 해시태그 -->',
            '    <div>',
            '      <label class="block text-xs font-semibold text-slate-700 mb-1.5">하단 해시태그 (쉼표로 구분)</label>',
            '      <input type="text" id="hist-edit-tags" class="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-xl focus:border-blue-500 focus:outline-none text-slate-900 text-sm" placeholder="#신규사업, #특허출원, #글로벌진출">',
            '    </div>',
            '    <!-- 세부 마일스톤 항목 목록 -->',
            '    <div class="pt-2">',
            '      <div class="flex items-center justify-between mb-2">',
            '        <label class="text-xs font-bold text-slate-200 flex items-center gap-1.5">',
            '          <i class="fa-solid fa-list-check text-cyan-400"></i> 세부 연혁 마일스톤 항목',
            '        </label>',
            '        <button type="button" onclick="window.HistoryAdmin.addMilestoneRow()" class="px-2.5 py-1 text-xs rounded-lg bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-200 transition-colors flex items-center gap-1">',
            '          <i class="fa-solid fa-plus text-[10px]"></i> 항목 추가',
            '        </button>',
            '      </div>',
            '      <div id="hist-milestones-container" class="space-y-2 max-h-56 overflow-y-auto pr-1">',
            '        <!-- 동적 row 렌더링 -->',
            '      </div>',
            '    </div>',
            '  </div>',
            '  <!-- 모달 풋터 -->',
            '  <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">',
            '    <button type="button" onclick="window.HistoryAdmin.closeEditModal()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-700 text-xs font-semibold transition-colors">',
            '      취소',
            '    </button>',
            '    <button type="button" onclick="window.HistoryAdmin.saveModalData()" class="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md hover:shadow-cyan-500/30 transition-all flex items-center gap-1.5">',
            '      <i class="fa-solid fa-check"></i> 연혁 카드 저장',
            '    </button>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(modal);
    }

    // ==========================================================================
    // 7-1. 원본 연혁 로드맵 이미지 팝업 모달
    // ==========================================================================
    function openHistoryRoadmapModal() {
        var modal = document.getElementById('history-roadmap-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'history-roadmap-modal';
            modal.className = 'fixed inset-0 z-[330] bg-black/90 backdrop-blur-md hidden items-center justify-center p-4 transition-all duration-300';
            modal.onclick = function (e) {
                if (e.target === modal) closeHistoryRoadmapModal();
            };
            modal.innerHTML = [
                '<div class="relative max-w-5xl w-full bg-[#0D1629] border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">',
                '  <div class="flex items-center justify-between px-6 py-4 bg-[#090F1C] border-b border-slate-800">',
                '    <div class="flex items-center gap-2.5 text-white font-bold text-base">',
                '      <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm border border-cyan-500/30">',
                '        <i class="fa-solid fa-diagram-project"></i>',
                '      </div>',
                '      <span>(주)에이티에이기술 공식 회사 연혁 로드맵 종합 도표</span>',
                '    </div>',
                '    <div class="flex items-center gap-2">',
                '      <a href="회사 연혁.png" target="_blank" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-700 transition-colors flex items-center gap-1.5 border border-slate-700">',
                '        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> 새 탭에서 원본 보기',
                '      </a>',
                '      <button type="button" onclick="closeHistoryRoadmapModal()" class="text-slate-400 hover:text-white text-lg w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center transition-colors">',
                '        <i class="fa-solid fa-xmark"></i>',
                '      </button>',
                '    </div>',
                '  </div>',
                '  <div class="p-6 overflow-auto bg-slate-50 flex items-center justify-center min-h-[400px]">',
                '    <img src="회사 연혁.png" alt="에이티에이기술 회사 연혁 로드맵" class="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg border border-slate-800">',
                '  </div>',
                '</div>'
            ].join('');
            document.body.appendChild(modal);
        }
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    function closeHistoryRoadmapModal() {
        var modal = document.getElementById('history-roadmap-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    }

    window.openHistoryRoadmapModal = openHistoryRoadmapModal;
    window.closeHistoryRoadmapModal = closeHistoryRoadmapModal;

    // ==========================================================================
    // 8. 전역 API 노출 (window.HistoryAdmin)
    // ==========================================================================
    window.HistoryAdmin = {
        render: renderHistoryCards,
        openCreateModal: function () {
            openHistoryEditModal(null);
        },
        openEditModal: function (cardId) {
            openHistoryEditModal(cardId);
        },
        closeEditModal: closeHistoryEditModal,
        openRoadmapModal: openHistoryRoadmapModal,
        closeRoadmapModal: closeHistoryRoadmapModal,
        addMilestoneRow: addMilestoneRow,
        saveModalData: saveHistoryModalData,
        deleteCard: deleteHistoryCard,
        resetToDefault: resetHistoryData,
        syncNoticeToHistory: syncNoticeToHistory,
        removeMilestoneByNoticeId: removeMilestoneByNoticeId,
        hasNoticeMilestone: hasNoticeMilestone,
        syncAllNoticesToHistory: syncAllNoticesToHistory,
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
            renderHistoryCards();
            alert("관리자 세션에서 로그아웃되었습니다.");
        }
    };

    // DOM 준비 완료 시 초기 렌더링
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderHistoryCards);
    } else {
        renderHistoryCards();
    }

    // 관리자 로그인/로그아웃 이벤트 감지 (다른 탭이나 창에서 변경 시)
    window.addEventListener('storage', function (e) {
        if (e.key === 'ata_admin_authenticated' || e.key === STORAGE_KEY_HISTORY) {
            renderHistoryCards();
        }
    });

})();
