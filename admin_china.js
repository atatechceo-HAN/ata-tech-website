/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 한중합자법인(제조사) 관리자 모드 CRUD & 실시간 렌더링 엔진 (admin_china.js)
 * 
 * [주요 기능 & 2026 황금비율 리디자인]
 * 1. 법인 개요(intro), 3대 핵심 기술협력(coop), 글로벌 거점 및 제조설비(facility) 통합 관리
 * 2. 사진 크기 대폭 콤팩트화 (35%) + 글씨란 대폭 확장 (65%) 가로 분할 황금비율 적용
 * 3. 3대 핵심 협력 카드: 가로형 2열(좌측 사진, 우측 풍성한 기술제휴 글씨)
 * 4. 제조 거점 카드: 아담한 썸네일(180px) + 생산 설비 및 케파 상세 설명란 시원하게 확장
 * 5. 관리자 모달: 상세 설명 textarea 7줄 이상 대폭 확장
 * 6. 실제 사용자 홈페이지(#view-xingting-intro, #view-xingting-coop, #view-xingting-global) 실시간 동적 렌더링
 * ==============================================================================
 */

(function () {
    'use strict';

    // 1. 로컬 저장소 키
    var STORAGE_KEY_CHINA = "ata_china_factory_db_v1";

    // 2. 초기 기본 공식 데이터 (개요/지표 5건, 상호협력 3건, 제조거점 3건 = 총 11건)
    var INITIAL_CHINA_DATA = [
        // ===================== [1. 법인 개요 및 핵심 지표: intro] =====================
        {
            id: "china_intro_overview",
            category: "intro",
            title: "글로벌 물류 로보틱스 선도기업, 한중 합자법인 (제조사)",
            subtitle: "GLOBAL PARTNERSHIP & MANUFACTURING BASE",
            badge: "법인 개요",
            imageUrl: "assets/images/china_factory_panorama.jpg",
            description: "한중 합자법인 (제조사)는 전 세계 최고 수준의 자율주행 물류 로봇(AGV/AMR) 및 지능형 셔틀 시스템을 전문적으로 연구·양산하는 글로벌 혁신 기술 제조 거점입니다.\n\n(주)에이티에이기술은 한중 합자법인 (제조사)와의 긴밀한 독점적 전략 파트너십을 통해, 중국의 압도적인 대량 양산 하드웨어 제조 경쟁력과 한국의 정밀한 소프트웨어(WCS) 제어 알고리즘을 융합하여 세계 최고 수준의 가성비와 무결점 성능을 자랑하는 스마트 물류 솔루션을 공급하고 있습니다.",
            features: [
                "대규모 자동화 양산 복합 클러스터 구축",
                "국제 CE 및 ISO 9001/14001 품질 보증",
                "한국형 WCS 관제 알고리즘 최적화 펌웨어 탑재"
            ],
            sortOrder: 1
        },
        {
            id: "china_stat_patent",
            category: "intro",
            title: "보유 핵심 특허",
            badge: "핵심 지표",
            statValue: "16+",
            statLabel: "글로벌 특허 및 IP",
            description: "자율주행 물류 로보틱스, 초고속 4분할 방향전환 소터, 지능형 셔틀 관련 한·중 핵심 지식재산권",
            sortOrder: 2
        },
        {
            id: "china_stat_delivery",
            category: "intro",
            title: "글로벌 공급 실적",
            badge: "핵심 지표",
            statValue: "670+",
            statLabel: "글로벌 프로젝트 구축",
            description: "아시아, 유럽, 북미 등 글로벌 16개국 대형 물류 풀필먼트 및 허브 터미널 성공 납품",
            sortOrder: 3
        },
        {
            id: "china_stat_area",
            category: "intro",
            title: "첨단 제조 양산 단지",
            badge: "핵심 지표",
            statValue: "35,000㎡",
            statLabel: "전용 제조 클러스터",
            description: "정밀 CNC 머시닝 센터, SMT 라인, 3단계 전수 신뢰성 테스트 타워를 구비한 첨단 제조 기지",
            sortOrder: 4
        },
        {
            id: "china_stat_capacity",
            category: "intro",
            title: "연간 생산 케파",
            badge: "핵심 지표",
            statValue: "5,000+",
            statLabel: "세트/년 최대 양산능력",
            description: "Narrow Belt Sorter, Cross Belt Sorter, 4분할 방향전환 롤러 매트릭스 대량 생산 체계",
            sortOrder: 5
        },

        // ===================== [2. 상호협력 및 3대 기술제휴: coop] =====================
        {
            id: "china_coop_1",
            category: "coop",
            title: "하드웨어-소프트웨어 융합 R&D",
            subtitle: "HW & SW Fusion Co-development",
            badge: "핵심 협력 01",
            imageUrl: "assets/images/china_coop_rnd.jpg",
            description: "제조사의 정밀 하드웨어 제조 역량과 (주)에이티에이기술의 지능형 WCS(창고제어시스템) 및 머신비전 제어 소프트웨어를 완벽하게 일체화하였습니다.\n설비 기구 설계 단계부터 제어 보드 펌웨어를 공동 최적화하여 현장 통신 딜레이를 0.001초 미만으로 단축하고, 다기종 복합 설비 간의 실시간 연동 성능을 극대화합니다.",
            features: [
                "한·중 공동 연구진 연간 24회 교차 기술 워크숍 진행",
                "국내 환경에 특화된 한국형 WCS 표준 통신 프로토콜 내장",
                "예지보전 IoT 센서 및 실시간 설비 진단 알고리즘 일체화"
            ],
            sortOrder: 1
        },
        {
            id: "china_coop_2",
            category: "coop",
            title: "국내 대형 풀필먼트 공동 수주 및 구축",
            subtitle: "Mega Fulfillment Joint Project Execution",
            badge: "핵심 협력 02",
            imageUrl: "assets/images/china_coop_project.jpg",
            description: "국내 굴지의 이커머스 메가 풀필먼트 센터 및 택배 간선 허브 터미널을 대상으로, 대량 설비 공급과 초고속 턴키 구축을 성공적으로 수행하고 있습니다.\n중국 대량 양산 클러스터를 통해 납기를 40% 이상 단축하고, 가격 경쟁력과 최고 등급의 기계적 내구성을 동시에 고객사에 제공합니다.",
            features: [
                "시간당 20,000+ 개 화물 연속 고속 분류 크로스벨트 소터 라인 구축",
                "원가 절감 효과를 바탕으로 고객사 투자대비회수(ROI) 1.5년 단축",
                "설계, 제작, 운송, 현장 설치 및 커미셔닝 전 공정 턴키 완벽 수행"
            ],
            sortOrder: 2
        },
        {
            id: "china_coop_3",
            category: "coop",
            title: "국내 전용 기술지원 및 A/S 센터 운영",
            subtitle: "Dedicated Korea Technical Service & Spare Parts Center",
            badge: "핵심 협력 03",
            imageUrl: "assets/images/china_coop_as.jpg",
            description: "(주)에이티에이기술 본사 및 국내 거점에 제조사 공식 인증 엔지니어가 상주하는 24/7 긴급 출동 기술지원 센터와 전용 예비 부품 창고를 운영합니다.\n모든 핵심 예비 부품을 국내에 항시 비축하여 외산 설비의 고질적 문제인 부품 수급 지연을 원천 차단하고, 2시간 이내 현장 출동 대응 체계를 가동합니다.",
            features: [
                "국내 전용 정품 예비 부품 100% 상시 비축 물류센터 운영",
                "제조사 파견 수석 엔지니어 및 ATA 전문 기술팀 연계 24시간 핫라인",
                "정기 무상 예방점검 및 분기별 펌웨어 무상 업그레이드 제공"
            ],
            sortOrder: 3
        },

        // ===================== [3. 글로벌 거점 및 제조 설비: facility] =====================
        {
            id: "china_fac_hq",
            category: "facility",
            title: "글로벌 R&D 센터 및 본사 통합 시험동",
            subtitle: "Global R&D Headquarters & Integration Test Tower",
            badge: "R&D 본사",
            imageUrl: "assets/images/china_hq_tower.jpg",
            description: "120여 명의 로봇공학 및 기계제어 석·박사 연구진이 상주하는 글로벌 R&D 본부입니다. 30m 높이의 지능형 셔틀 테스트 타워와 실물 크기 크로스벨트 루프 테스트베드를 상시 가동하여 극한 환경에서의 신뢰성을 검증합니다.",
            features: [
                "120+ 석·박사급 스마트 물류 하드웨어 & 로보틱스 전담 연구진",
                "실제 현장과 동일한 1:1 고속 루프 분류 테스트 라인 운영",
                "연간 50건 이상의 신규 메커니즘 국제 특허 출원 인큐베이터"
            ],
            sortOrder: 1
        },
        {
            id: "china_fac_smart1",
            category: "facility",
            title: "제1 스마트 제조 메가 팩토리 (첨단 기구가공)",
            subtitle: "Smart Mega Factory #1 (Precision CNC & Machining)",
            badge: "제1 스마트공장",
            imageUrl: "assets/images/china_factory_smart1.jpg",
            description: "20,000㎡ 부지에 독일 및 일본산 초정밀 5축 CNC 머시닝 센터와 레이저 자동 절단·절곡 라인을 완비한 제1 제조공장입니다. 소터 프레임과 고정밀 구동 롤러 등 핵심 기구 부품을 오차 0.01mm 이내로 가공 양산합니다.",
            features: [
                "초정밀 5축 CNC 머시닝 센터 40대 연속 풀가동",
                "로봇 자동화 용접 라인 구축으로 프레임 뒤틀림 0% 달성",
                "연간 3,000+ 세트 고속 소터 기구 프레임 양산 능력 확보"
            ],
            sortOrder: 2
        },
        {
            id: "china_fac_smart2",
            category: "facility",
            title: "제2 자동화 조립 및 품질 전수 검사 센터",
            subtitle: "Automation Assembly & 100% Quality Assurance Center #2",
            badge: "제2 조립공장",
            imageUrl: "assets/images/china_factory_smart2.jpg",
            description: "15,000㎡ 규모의 클린룸 SMT 전자보드 제조 라인과 최종 완제품 에이징(Aging) 테스트 라인이 결합된 제2 제조공장입니다. 출고되는 전 제품을 대상으로 72시간 무중단 연속 부하 테스트를 실시하여 불량률 제로를 실현합니다.",
            features: [
                "무정전 클린 SMT 제어보드 전용 표면실장 양산 라인",
                "전수 72시간 100% 연속 가동 신뢰성 및 발열 검증 시스템",
                "유럽 CE, 북미 UL, 한국 KC 국제 표준 인증 라인"
            ],
            sortOrder: 3
        }
    ];

    /**
     * 로컬 저장소에서 데이터 로드
     */
    function loadData() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_CHINA);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('[ChinaAdmin] LocalStorage load error:', e);
        }
        saveData(INITIAL_CHINA_DATA);
        return INITIAL_CHINA_DATA.slice();
    }

    /**
     * 로컬 저장소에 저장 및 화면 실시간 렌더링 동기화
     */
    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY_CHINA, JSON.stringify(data));
        } catch (e) {
            console.error('[ChinaAdmin] Save error:', e);
            alert('저장 용량이 부족하거나 브라우저 저장소 접근에 실패했습니다.');
        }
        renderFrontend();
    }

    /**
     * 초기 공식 데이터로 안전 복원
     */
    function resetToDefault() {
        if (!confirm("한중합자법인(제조사) 콘텐츠 전체를 공식 초기 데이터로 안전 복원하시겠습니까?\n(사용자가 수정한 내용은 초기화됩니다.)")) {
            return;
        }
        saveData(INITIAL_CHINA_DATA.slice());
        alert("공식 초기 기본 데이터로 안전하게 복원되었습니다.");
        if (typeof window.switchAdminHubTab === 'function') {
            window.switchAdminHubTab('china');
        }
    }

    // ==========================================================================
    // 3. 관리자 센터(Admin Hub) 목록 렌더링 - 콤팩트 사진(90px) + 글씨란 80% 확대
    // ==========================================================================
    var currentFilter = 'all';

    function renderManagerList(container, filter) {
        if (!container) container = document.getElementById('admin-hub-china-list');
        if (!container) return;

        if (filter !== undefined) currentFilter = filter;
        var data = loadData();

        var filtered = data;
        if (currentFilter !== 'all') {
            filtered = data.filter(function (it) { return it.category === currentFilter; });
        }

        filtered.sort(function (a, b) {
            return (a.sortOrder || 99) - (b.sortOrder || 99);
        });

        // 탭 스타일 갱신
        var catTabs = ['all', 'intro', 'coop', 'facility'];
        catTabs.forEach(function (cat) {
            var btn = document.getElementById('hub-china-tab-' + cat);
            if (btn) {
                if (cat === currentFilter) {
                    btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm transition-all cursor-pointer';
                } else {
                    btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer';
                }
            }
        });

        // 카운트 배지 갱신
        var counts = { all: data.length, intro: 0, coop: 0, facility: 0 };
        data.forEach(function (it) {
            if (counts[it.category] !== undefined) counts[it.category]++;
        });
        catTabs.forEach(function (cat) {
            var badge = document.getElementById('hub-china-count-' + cat);
            if (badge) badge.textContent = counts[cat];
        });

        if (filtered.length === 0) {
            container.innerHTML = '<div class="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium">등록된 항목이 없습니다. 우측 상단의 [+ 새 항목 등록] 버튼을 눌러보세요.</div>';
            return;
        }

        var html = [];
        filtered.forEach(function (item) {
            var catLabel = item.category === 'intro' ? '개요/지표' : (item.category === 'coop' ? '3대 상호협력' : '제조 거점');
            var catBadgeClass = item.category === 'intro' ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : (item.category === 'coop' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300');

            html.push('<div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all">');

            // 상단 메타 바
            html.push('  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">');
            html.push('    <div class="flex items-center gap-2 flex-wrap">');
            html.push('      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ' + catBadgeClass + '">' + catLabel + '</span>');
            if (item.badge) {
                html.push('      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs">' + item.badge + '</span>');
            }
            if (item.statValue) {
                html.push('      <span class="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">지표: ' + item.statValue + '</span>');
            }
            html.push('    </div>');
            html.push('    <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">');
            html.push('      <button type="button" onclick="window.ChinaAdmin.openEditModal(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-pen-to-square mr-1"></i>수정</button>');
            html.push('      <button type="button" onclick="window.ChinaAdmin.deleteItem(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-trash-can mr-1"></i>삭제</button>');
            html.push('    </div>');
            html.push('  </div>');

            // 본문 가로 2열: [좌측 콤팩트 썸네일 (90px)] + [우측 대폭 넓어진 글씨 공간]
            html.push('  <div class="flex flex-col sm:flex-row gap-4 pt-3 items-start">');

            // 콤팩트 썸네일
            html.push('    <div class="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/thumb shadow-sm self-start mt-0.5">');
            if (item.imageUrl) {
                html.push('      <img src="' + item.imageUrl + '" class="w-full h-full object-cover" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <a href="' + item.imageUrl + '" target="_blank" class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 text-center p-1">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-xs"></i><span>크게 보기</span>');
                html.push('      </a>');
            } else {
                html.push('      <div class="w-full h-full flex flex-col items-center justify-center text-slate-300 text-[10px] p-2 text-center"><i class="fa-solid fa-image text-xl mb-1"></i>No Image</div>');
            }
            html.push('    </div>');

            // 우측 시원한 글씨 공간 (전체 폭 80% 이상)
            html.push('    <div class="flex-1 min-w-0 space-y-2">');
            html.push('      <h4 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">' + item.title + '</h4>');
            if (item.subtitle) {
                html.push('      <p class="text-xs font-semibold text-slate-400">' + item.subtitle + '</p>');
            }
            html.push('      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">' + (item.description || '') + '</p>');

            if (item.features && item.features.length > 0) {
                html.push('      <div class="flex flex-wrap gap-1.5 pt-1">');
                item.features.forEach(function (f) {
                    html.push('        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/80 text-[11px] font-medium text-slate-700">');
                    html.push('          <i class="fa-solid fa-check text-blue-500 text-[10px]"></i> ' + f);
                    html.push('        </span>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    // ==========================================================================
    // 4. 모달 팝업 입력창 (상세설명 7줄, 특징 4줄 대폭 확장)
    // ==========================================================================
    function ensureModal() {
        var existing = document.getElementById('china-editor-modal');
        if (existing) return existing;

        var modalHtml = [
            '<div id="china-editor-modal" class="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-2 sm:p-4 md:p-6">',
            '  <div class="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">',
            
            // 모달 헤더
            '    <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">',
            '      <div class="flex items-center gap-3">',
            '        <span class="w-9 h-9 rounded-xl bg-blue-500/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center text-base font-bold shadow-inner">',
            '          <i class="fa-solid fa-industry"></i>',
            '        </span>',
            '        <div>',
            '          <h3 id="china-modal-title" class="text-base sm:text-lg font-bold text-white tracking-wide">한중합자법인(제조사) 콘텐츠 수정 및 작성</h3>',
            '          <p class="text-xs text-slate-400">광활한 글자 입력창에서 상세 내용과 기술 협력 성과를 여유롭게 편집하세요.</p>',
            '        </div>',
            '      </div>',
            '      <button type="button" onclick="window.ChinaAdmin.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 text-xl transition-colors cursor-pointer"><i class="fa-solid fa-xmark"></i></button>',
            '    </div>',

            // 모달 본문 폼: [좌측 65% 초대형 글자칸] + [우측 35% 콤팩트 사진/설정 패널]
            '    <form id="china-editor-form" onsubmit="window.ChinaAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">',
            '      <input type="hidden" id="china-form-id" value="">',
            
            '      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">',
            
            // ========================================================
            // [좌측 65% 영역 (lg:col-span-8): 초대형 글자 입력 전용 공간]
            // ========================================================
            '        <div class="lg:col-span-8 space-y-4">',
            
            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">',
            '              <i class="fa-solid fa-heading text-blue-600"></i> 명칭 / 제목 <span class="text-red-500">*</span>',
            '            </label>',
            '            <input type="text" id="china-form-title" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-sm" placeholder="예: 하드웨어-소프트웨어 융합 R&D" required>',
            '          </div>',

            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">',
            '              <i class="fa-solid fa-language text-slate-400"></i> 부제목 / 영문 공식 표기',
            '            </label>',
            '            <input type="text" id="china-form-subtitle" class="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 text-slate-700" placeholder="예: HW & SW Fusion Co-development">',
            '          </div>',

            '          <div>',
            '            <div class="flex items-center justify-between mb-1.5">',
            '              <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">',
            '                <i class="fa-solid fa-align-left text-blue-600"></i> 상세 설명 (글자칸 대폭 확장: 10줄)',
            '              </label>',
            '              <span class="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">줄바꿈(Enter) 지원</span>',
            '            </div>',
            '            <textarea id="china-form-desc" rows="10" class="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm sm:text-base font-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-relaxed text-slate-800 custom-scrollbar shadow-inner whitespace-pre-line" placeholder="사업 개요, 독점 기술 협력 모델, 제조 설비 제원, 기대효과 등 상세 내용을 길고 자유롭게 작성하세요. 줄바꿈을 지원합니다."></textarea>',
            '          </div>',

            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">',
            '              <i class="fa-solid fa-list-check text-blue-600"></i> 주요 특장점 / 세부 역량 (한 줄에 하나씩 입력)',
            '            </label>',
            '            <textarea id="china-form-features" rows="4" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-normal focus:ring-2 focus:ring-blue-500 leading-relaxed custom-scrollbar text-slate-700" placeholder="한 줄에 하나씩 핵심 성과 및 기술 특징을 입력하세요."></textarea>',
            '          </div>',

            '        </div>',

            // ========================================================
            // [우측 35% 영역 (lg:col-span-4): 콤팩트 사진 및 속성 패널]
            // ========================================================
            '        <div class="lg:col-span-4 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">',
            
            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1">카테고리 구분 <span class="text-red-500">*</span></label>',
            '            <select id="china-form-category" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" required>',
            '              <option value="intro">법인 개요 및 핵심 지표 (Overview/Stats)</option>',
            '              <option value="coop">상호협력 및 3대 기술제휴 (Cooperation)</option>',
            '              <option value="facility">글로벌 거점 및 제조 설비 (Facilities)</option>',
            '            </select>',
            '          </div>',

            '          <div class="grid grid-cols-2 gap-3">',
            '            <div>',
            '              <label class="block text-xs font-bold text-slate-700 mb-1">정렬 순서</label>',
            '              <input type="number" id="china-form-sort" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" value="1" min="1" max="99">',
            '            </div>',
            '            <div>',
            '              <label class="block text-xs font-bold text-slate-700 mb-1">표시 배지</label>',
            '              <input type="text" id="china-form-badge" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" placeholder="예: 핵심 협력 01">',
            '            </div>',
            '          </div>',

            '          <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2">',
            '            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1"><i class="fa-solid fa-chart-simple text-blue-500"></i> 개요 핵심 지표 (선택)</div>',
            '            <div class="grid grid-cols-2 gap-2">',
            '              <div>',
            '                <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">수치값</label>',
            '                <input type="text" id="china-form-statvalue" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-black text-blue-600 focus:ring-2 focus:ring-blue-500" placeholder="16+, 670+">',
            '              </div>',
            '              <div>',
            '                <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">지표 라벨</label>',
            '                <input type="text" id="china-form-statlabel" class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500" placeholder="글로벌 특허">',
            '              </div>',
            '            </div>',
            '          </div>',

            // 콤팩트 사진 업로드 및 미니 미리보기
            '          <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">',
            '            <div class="text-[11px] font-bold text-slate-700 flex items-center justify-between">',
            '              <span class="flex items-center gap-1.5"><i class="fa-solid fa-image text-cyan-600"></i> 사진 콤팩트 미리보기</span>',
            '              <span class="text-[10px] text-slate-400">아담한 썸네일</span>',
            '            </div>',
            '            <div id="china-modal-preview-box" class="w-full h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center shadow-inner">',
            '              <img id="china-modal-preview-img" src="" class="w-full h-full object-cover hidden" alt="미리보기">',
            '              <span id="china-modal-preview-placeholder" class="text-xs text-slate-400 flex flex-col items-center gap-1"><i class="fa-solid fa-camera text-slate-300 text-lg"></i>사진 선택 시 표시됨</span>',
            '            </div>',
            '            <div>',
            '              <input type="text" id="china-form-imageurl" oninput="window.ChinaAdmin.updatePreview(this.value)" class="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-mono focus:ring-2 focus:ring-blue-500 mb-2" placeholder="사진 경로 또는 URL">',
            '              <label class="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold border border-slate-300 hover:border-blue-400 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm">',
            '                <i class="fa-solid fa-cloud-arrow-up text-blue-600"></i> 내 PC 사진 파일 변경',
            '                <input type="file" class="hidden" accept="image/*" onchange="window.ChinaAdmin.handleFileSelect(event)">',
            '              </label>',
            '            </div>',
            '          </div>',

            '        </div>',

            '      </div>',

            // 하단 버튼 바
            '      <div class="pt-5 mt-6 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">',
            '        <button type="button" onclick="window.ChinaAdmin.closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer">취소</button>',
            '        <button type="submit" class="px-7 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"><i class="fa-solid fa-floppy-disk"></i> 저장 완료</button>',
            '      </div>',

            '    </form>',
            '  </div>',
            '</div>'
        ].join('\n');

        var div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div.firstElementChild);
        return document.getElementById('china-editor-modal');
    }

    function openCreateModal(defaultCategory) {
        var modal = ensureModal();
        document.getElementById('china-modal-title').textContent = '한중합자법인(제조사) 신규 등록';
        document.getElementById('china-form-id').value = '';
        document.getElementById('china-form-category').value = defaultCategory || (currentFilter === 'all' ? 'coop' : currentFilter);
        document.getElementById('china-form-sort').value = '1';
        document.getElementById('china-form-title').value = '';
        document.getElementById('china-form-subtitle').value = '';
        document.getElementById('china-form-badge').value = '';
        document.getElementById('china-form-statvalue').value = '';
        document.getElementById('china-form-statlabel').value = '';
        document.getElementById('china-form-desc').value = '';
        document.getElementById('china-form-features').value = '';
        document.getElementById('china-form-imageurl').value = '';

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function openEditModal(id) {
        var modal = ensureModal();
        var data = loadData();
        var item = data.find(function (it) { return it.id === id; });
        if (!item) {
            alert('항목을 찾을 수 없습니다.');
            return;
        }

        document.getElementById('china-modal-title').textContent = '한중합자법인 항목 수정 (' + item.title + ')';
        document.getElementById('china-form-id').value = item.id;
        document.getElementById('china-form-category').value = item.category || 'coop';
        document.getElementById('china-form-sort').value = item.sortOrder || '1';
        document.getElementById('china-form-title').value = item.title || '';
        document.getElementById('china-form-subtitle').value = item.subtitle || '';
        document.getElementById('china-form-badge').value = item.badge || '';
        document.getElementById('china-form-statvalue').value = item.statValue || '';
        document.getElementById('china-form-statlabel').value = item.statLabel || '';
        document.getElementById('china-form-desc').value = item.description || '';
        document.getElementById('china-form-features').value = (item.features || []).join('\n');
        document.getElementById('china-form-imageurl').value = item.imageUrl || '';
        updatePreview(item.imageUrl || '');

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeModal() {
        var modal = document.getElementById('china-editor-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    function updatePreview(url) {
        var img = document.getElementById('china-modal-preview-img');
        var placeholder = document.getElementById('china-modal-preview-placeholder');
        if (!img || !placeholder) return;
        if (url) {
            img.src = url;
            img.classList.remove('hidden');
            placeholder.classList.add('hidden');
        } else {
            img.src = '';
            img.classList.add('hidden');
            placeholder.classList.remove('hidden');
        }
    }

    function handleFileSelect(e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('파일 크기가 10MB를 초과하여 업로드할 수 없습니다.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (evt) {
            var input = document.getElementById('china-form-imageurl');
            if (input) input.value = evt.target.result;
            updatePreview(evt.target.result);
        };
        reader.readAsDataURL(file);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        var id = document.getElementById('china-form-id').value;
        var category = document.getElementById('china-form-category').value;
        var sortOrder = parseInt(document.getElementById('china-form-sort').value, 10) || 1;
        var title = document.getElementById('china-form-title').value.trim();
        var subtitle = document.getElementById('china-form-subtitle').value.trim();
        var badge = document.getElementById('china-form-badge').value.trim();
        var statValue = document.getElementById('china-form-statvalue').value.trim();
        var statLabel = document.getElementById('china-form-statlabel').value.trim();
        var description = document.getElementById('china-form-desc').value.trim();
        var featuresRaw = document.getElementById('china-form-features').value.trim();
        var imageUrl = document.getElementById('china-form-imageurl').value.trim();

        if (!title) {
            alert('명칭/제목을 입력해주세요.');
            return;
        }

        var features = featuresRaw ? featuresRaw.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];

        var data = loadData();
        if (id) {
            var item = data.find(function (it) { return it.id === id; });
            if (item) {
                item.category = category;
                item.sortOrder = sortOrder;
                item.title = title;
                item.subtitle = subtitle;
                item.badge = badge;
                item.statValue = statValue;
                item.statLabel = statLabel;
                item.description = description;
                item.features = features;
                if (imageUrl) item.imageUrl = imageUrl;
            }
        } else {
            var newId = 'china_' + Date.now();
            data.push({
                id: newId,
                category: category,
                sortOrder: sortOrder,
                title: title,
                subtitle: subtitle,
                badge: badge,
                statValue: statValue,
                statLabel: statLabel,
                description: description,
                features: features,
                imageUrl: imageUrl
            });
        }

        saveData(data);
        closeModal();
        renderManagerList(null, currentFilter);
        alert('성공적으로 저장되었습니다.');
    }

    function deleteItem(id) {
        var data = loadData();
        var item = data.find(function (it) { return it.id === id; });
        if (!item) return;

        if (!confirm('정말 [' + item.title + '] 항목을 삭제하시겠습니까?')) {
            return;
        }

        var nextData = data.filter(function (it) { return it.id !== id; });
        saveData(nextData);
        renderManagerList(null, currentFilter);
        alert('삭제되었습니다.');
    }

    // ==========================================================================
    // 5. 프론트엔드 실시간 동적 렌더링 - 2026 황금비율 (글씨 65% : 콤팩트 사진 35%)
    // ==========================================================================
    function renderFrontend() {
        var data = loadData();

        // 1. 법인 개요 및 지표 (#china-intro-stats-grid)
        renderIntroSection(data.filter(function (it) { return it.category === 'intro'; }));

        // 2. 3대 상호협력 및 기술제휴 (#china-coop-cards-grid) - 가로 2열 분할 레이아웃
        renderCoopSection(data.filter(function (it) { return it.category === 'coop'; }));

        // 3. 글로벌 거점 및 제조 설비 (#china-facilities-grid)
        renderFacilitySection(data.filter(function (it) { return it.category === 'facility'; }));
    }

    /**
     * [개요 및 핵심 지표] 렌더링
     */
    function renderIntroSection(items) {
        var statsContainer = document.getElementById('china-intro-stats-grid');
        if (statsContainer) {
            var stats = items.filter(function (it) { return it.statValue; });
            stats.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

            var statHtml = [];
            stats.forEach(function (st) {
                statHtml.push('<div class="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-center">');
                statHtml.push('  <div class="text-3xl sm:text-4xl font-black text-blue-600 mb-1.5 tracking-tight">' + st.statValue + '</div>');
                statHtml.push('  <div class="text-xs sm:text-sm font-bold text-slate-800 mb-1">' + (st.statLabel || st.title) + '</div>');
                if (st.description) {
                    statHtml.push('  <div class="text-[11px] sm:text-xs text-slate-500 leading-snug line-clamp-2">' + st.description + '</div>');
                }
                statHtml.push('</div>');
            });
            statsContainer.innerHTML = statHtml.join('');
        }
    }

    /**
     * [3대 상호협력 및 기술제휴] 가로 분할 황금비율 (글씨 65% : 콤팩트 사진 35%)
     */
    function renderCoopSection(items) {
        var container = document.getElementById('china-coop-cards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it, idx) {
            var badgeStr = it.badge || ('핵심 협력 0' + (idx + 1));

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch group fade-in appear">');

            // ================= [좌측: 콤팩트 사진 영역 35%] =================
            html.push('  <div class="w-full lg:w-80 shrink-0 flex flex-col justify-between bg-slate-50 rounded-2xl p-3 border border-slate-200/80">');
            if (it.imageUrl) {
                html.push('    <div class="w-full h-52 sm:h-56 rounded-xl overflow-hidden bg-slate-100 relative group/img cursor-pointer border border-slate-200 shadow-inner flex items-center justify-center mb-2" onclick="window.openImageModal ? window.openImageModal(\'' + it.imageUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\') : window.open(\'' + it.imageUrl + '\', \'_blank\')">');
                html.push('      <img src="' + it.imageUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-cyan-400"></i> 원본 크게 보기');
                html.push('      </div>');
                html.push('    </div>');
            } else {
                html.push('    <div class="w-full h-52 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs">협력 사진 준비 중</div>');
            }
            html.push('    <div class="text-center text-[11px] text-slate-500 font-medium py-1">');
            html.push('      <i class="fa-solid fa-camera text-blue-500 mr-1"></i>제조사 현장 협력 실물 사진');
            html.push('    </div>');
            html.push('  </div>');

            // ================= [우측: 글씨 중심 영역 65%] =================
            html.push('  <div class="flex-1 flex flex-col justify-between min-w-0">');
            html.push('    <div>');

            // 상단 배지
            html.push('      <div class="flex items-center gap-2.5 mb-3 flex-wrap">');
            html.push('        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">');
            html.push('          <i class="fa-solid fa-handshake text-blue-600"></i> ' + badgeStr);
            html.push('        </span>');
            html.push('        <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">독점 기술 제휴</span>');
            html.push('      </div>');

            // 제목 및 영문
            html.push('      <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors leading-snug">' + it.title + '</h3>');
            if (it.subtitle) {
                html.push('      <p class="text-xs font-semibold text-slate-400 mb-4 tracking-wide">' + it.subtitle + '</p>');
            }

            // 시원하게 넓어진 상세 설명란 (줄바꿈 완벽 지원)
            html.push('      <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line">' + (it.description || '') + '</p>');

            // 핵심 성과 및 제휴 특장점 박스
            if (it.features && it.features.length > 0) {
                html.push('      <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2 mb-2">');
                html.push('        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-blue-600"></i> 기술 제휴 핵심 시너지 & 성과</div>');
                it.features.forEach(function (f) {
                    html.push('        <div class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">');
                    html.push('          <i class="fa-solid fa-check text-blue-600 text-xs mt-1 shrink-0"></i>');
                    html.push('          <span>' + f + '</span>');
                    html.push('        </div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            // 우측 하단 메타 바
            html.push('    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">');
            html.push('      <span>한·중 합자 파트너십 독점 공급망</span>');
            html.push('      <span class="font-bold text-blue-600">ATA TECH × GLOBAL OEM</span>');
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [글로벌 거점 및 제조 설비] 콤팩트 썸네일 + 상세 역할 설명 중심 렌더링
     */
    function renderFacilitySection(items) {
        var container = document.getElementById('china-facilities-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            html.push('<div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group fade-in appear">');

            // 상단 콤팩트 사진 (190px 높이로 아담하게)
            html.push('  <div>');
            if (it.imageUrl) {
                html.push('    <div class="h-48 sm:h-52 w-full bg-slate-100 relative overflow-hidden group/img cursor-pointer" onclick="window.openImageModal ? window.openImageModal(\'' + it.imageUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\') : window.open(\'' + it.imageUrl + '\', \'_blank\')">');
                html.push('      <img src="' + it.imageUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">' + (it.badge || '제조거점') + '</div>');
                html.push('      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-cyan-400"></i> 현장 사진 확대');
                html.push('      </div>');
                html.push('    </div>');
            }

            // 하단 대폭 넓어진 글씨 공간
            html.push('    <div class="p-6 sm:p-7 space-y-3">');
            html.push('      <h4 class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">' + it.title + '</h4>');
            if (it.subtitle) {
                html.push('      <p class="text-xs font-semibold text-slate-400">' + it.subtitle + '</p>');
            }
            html.push('      <p class="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">' + (it.description || '') + '</p>');

            if (it.features && it.features.length > 0) {
                html.push('      <div class="space-y-1.5 pt-2 border-t border-slate-100">');
                it.features.forEach(function (f) {
                    html.push('        <div class="flex items-center gap-2 text-xs text-slate-700"><i class="fa-solid fa-check text-blue-600 text-[10px]"></i><span>' + f + '</span></div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');
            html.push('  </div>');

            html.push('  <div class="px-6 pb-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-auto pt-3">');
            html.push('    <span>연간 양산 케파 5,000+ 세트</span>');
            html.push('    <span class="text-blue-600 font-bold">스마트 팩토리</span>');
            html.push('  </div>');

            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    // 전역 공개 네임스페이스
    window.ChinaAdmin = {
        loadData: loadData,
        saveData: saveData,
        resetToDefault: resetToDefault,
        renderManagerList: renderManagerList,
        renderFrontend: renderFrontend,
        openCreateModal: openCreateModal,
        openEditModal: openEditModal,
        closeModal: closeModal,
        handleFileSelect: handleFileSelect,
        updatePreview: updatePreview,
        handleFormSubmit: handleFormSubmit,
        deleteItem: deleteItem
    };

    // 초기 실행
    document.addEventListener('DOMContentLoaded', function () {
        renderFrontend();
    });

})();
