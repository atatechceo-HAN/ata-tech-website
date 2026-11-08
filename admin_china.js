/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 한중합자법인(제조사) 관리자 모드 CRUD & 실시간 렌더링 엔진 (admin_china.js)
 * 
 * [주요 기능]
 * 1. 법인 개요 및 핵심 제조 지표(intro), 3대 상호협력/기술제휴(coop), 제조 거점 및 설비 네트워크(facility) 관리
 * 2. 브라우저 로컬 저장소(LocalStorage) 기반 실시간 데이터 영구 보존 및 동기화
 * 3. 관리자 센터(Admin Hub) 전용 CRUD 인터페이스: 신규 항목 등록, 수정, 삭제, 기본값 안전 복원
 * 4. 제조 공장 전경, R&D 설비, 인포그래픽 고화질 이미지 로컬 업로드(Base64) 및 경로 지정 지원
 * 5. 실제 사용자 홈페이지(#view-xingting-intro, #view-xingting-coop, #view-xingting-global) 실시간 동적 렌더링
 * ==============================================================================
 */

(function () {
    'use strict';

    // 1. 로컬 저장소 키
    var STORAGE_KEY_CHINA = "ata_china_factory_db_v1";

    // 2. 초기 기본 공식 데이터 (개요/지표 5건 + 기술협력 3건 + 거점설비 3건 = 총 11건)
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
            imageUrl: "[ Insert Data ]/중국 지사_제조사/렵력사업/1. 하드웨어-소프트웨어 융합 R&D.png",
            description: "중국 제조사의 검증된 고정밀 하드웨어 메커니즘에 에이티에이기술의 한국형 물류 환경 맞춤형 WCS(관제 소프트웨어) 로직을 심는 차세대 공동 기술 개발을 진행합니다. 독자 임베디드 펌웨어 제어를 통해 반응 속도를 극대화하고 오분류율 0.001% 이하의 완벽한 신뢰성을 실현합니다.",
            features: [
                "한국형 WCS/WMS와 직결되는 초저지연 통신 프로토콜 설계",
                "국내 환경 맞춤형 비정형 택배 박스 및 연포장 비닐백 피칭 알고리즘",
                "정기적인 양국 R&D 엔지니어 교환 파견 및 펌웨어 공동 업그레이드"
            ],
            sortOrder: 1
        },
        {
            id: "china_coop_2",
            category: "coop",
            title: "국내 대형 풀필먼트 공동 수주 및 맞춤 생산",
            subtitle: "Joint Sourcing & Customized Mass Production",
            badge: "핵심 협력 02",
            imageUrl: "[ Insert Data ]/중국 지사_제조사/렵력사업/2. 국내 대형 풀필먼트 공동 수주.png",
            description: "국내 대기업 및 글로벌 이커머스 허브 센터 구축 시, 제조사 직공급 체계를 통해 유통 마진을 대폭 제거하고 납기를 획기적으로 단축하여 고객사 맞춤형 턴키 솔루션을 공급합니다. 프로젝트별 맞춤형 모듈 제작으로 초기 투자비(CAPEX)를 최대 35% 절감합니다.",
            features: [
                "제조사 직결 다이렉트 공급망 구축으로 원가 경쟁력 압도적 우위",
                "초대형 메가 허브 전용 맞춤형 기구 설계 및 최단 납기 보장",
                "사전 3D 레이아웃 시뮬레이션을 통한 설치 오류 제로화"
            ],
            sortOrder: 2
        },
        {
            id: "china_coop_3",
            category: "coop",
            title: "로컬라이징 및 국내 A/S 전담 센터 운영",
            subtitle: "Localization & 24/7 Dedicated CS Center",
            badge: "핵심 협력 03",
            imageUrl: "[ Insert Data ]/중국 지사_제조사/렵력사업/3. 로컬라이징 및 AS 전담 센터.png",
            description: "(주)에이티에이기술 본사가 대한민국 공식 테크니컬 지원 본부로서, 순정 정품 부품의 상시 보유와 24/7 전담 긴급 출동 체계를 가동하여 외산 장비의 유지보수 불안을 완전히 해소합니다.",
            features: [
                "국내 본사 물류센터 내 주요 핵심 모터 및 구동 롤러 부품 100% 상시 재고",
                "24시간 365일 원격 장애 진단 및 2시간 이내 수도권 현장 출동",
                "정기 예방 정비 및 무상 안전 점검 서비스 상시 지원"
            ],
            sortOrder: 3
        },

        // ===================== [3. 글로벌 네트워크 및 거점 설비: facility] =====================
        {
            id: "china_fac_hq",
            category: "facility",
            title: "대한민국 본사 (ATA Technology)",
            subtitle: "HEADQUARTERS & R&D CENTER",
            badge: "본사 R&D 거점",
            imageUrl: "assets/images/korea_hq_building.jpg",
            description: "물류 자동화 WCS/WMS 통합 관제 소프트웨어 독자 개발 및 국내 대형 프로젝트 총괄 엔지니어링, 24시간 전문 기술지원 총괄 본부입니다.",
            location: "경기도 오산시 수목원로 88번길 35 현대테라타워 CMC B동 1402호",
            features: [
                "물류 자동화 WCS / WMS 통합 관제 소프트웨어 독자 개발",
                "국내 대형 프로젝트 턴키(Turnkey) 엔지니어링 및 총괄 시공",
                "24시간 전문 엔지니어 기술지원 및 신속 현장 출동 A/S 센터",
                "하드웨어 현지화(Localization) 커스텀 기술 및 특허 인증"
            ],
            sortOrder: 1
        },
        {
            id: "china_fac_factory",
            category: "facility",
            title: "한중 합자법인 스마트 제조 공장 (제조사)",
            subtitle: "SMART FACTORY & MANUFACTURING HUB",
            badge: "글로벌 제조 거점",
            imageUrl: "assets/images/china_factory_panorama.jpg",
            description: "연간 5,000+ 대 규모의 첨단 소터 및 물류 로봇을 양산하는 대규모 전용 스마트 제조 클러스터로서 엄격한 국제 규격을 만족합니다.",
            location: "첨단 물류 로보틱스 대규모 전용 양산 복합 클러스터",
            features: [
                "연간 5,000+ 대 규모 첨단 소터 및 물류 로봇 양산 라인",
                "유럽 CE 및 ISO 9001 / ISO 14001 국제 표준 품질 규격",
                "글로벌 16개국 직수출 공급망 및 초대형 허브 터미널 납품 실적",
                "자체 정밀 가공 머시닝 센터 및 3단계 전수 신뢰성 테스트 검수"
            ],
            sortOrder: 2
        },
        {
            id: "china_fac_network_map",
            category: "facility",
            title: "글로벌 로보틱스 공급망 네트워크 맵",
            subtitle: "Global Robotics Supply Chain & Deployment Hub",
            badge: "글로벌 공급망",
            imageUrl: "[ Insert Data ]/중국 지사_제조사/글로벌 네트워크/글로벌 네트워크.png",
            description: "대한민국 본사의 첨단 소프트웨어 기술력과 중국 합자법인의 대규모 첨단 제조 양산 단지가 유기적으로 결합되어 전 세계 16개국 이상으로 뻗어나가는 글로벌 스마트 물류 네트워크 지도입니다.",
            features: [
                "전 세계 16개국 이상 대형 허브 터미널 구축 실적",
                "한국-중국-글로벌 직결 실시간 무결점 기술 지원 체계"
            ],
            sortOrder: 3
        }
    ];

    /**
     * 로컬 저장소에서 데이터 불러오기
     */
    function loadData() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_CHINA);
            if (!raw) {
                saveData(INITIAL_CHINA_DATA);
                return INITIAL_CHINA_DATA.slice();
            }
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                saveData(INITIAL_CHINA_DATA);
                return INITIAL_CHINA_DATA.slice();
            }
            return parsed;
        } catch (e) {
            console.warn('[ChinaAdmin] Failed to load data from localStorage. Fallback to default.', e);
            return INITIAL_CHINA_DATA.slice();
        }
    }

    /**
     * 로컬 저장소 저장 & 프론트엔드 실시간 갱신
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
    // 3. 관리자 센터(Admin Hub) 목록 렌더링
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

        // 탭 버튼 스타일 갱신
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
            var catLabel = item.category === 'intro' ? '법인개요·지표' : (item.category === 'coop' ? '기술제휴·협력' : '제조거점·설비');
            var catBadgeClass = item.category === 'intro' ? 'bg-sky-100 text-sky-800 border-sky-300' : (item.category === 'coop' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300');

            html.push('<div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-300 transition-all space-y-3">');
            html.push('  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">');
            html.push('    <div class="flex items-center gap-2 flex-wrap">');
            html.push('      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ' + catBadgeClass + '">' + catLabel + '</span>');
            if (item.badge) {
                html.push('      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs">' + item.badge + '</span>');
            }
            if (item.statValue) {
                html.push('      <span class="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-extrabold text-xs shadow-sm">' + item.statValue + ' (' + (item.statLabel || '') + ')</span>');
            }
            html.push('    </div>');
            html.push('    <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">');
            html.push('      <button type="button" onclick="window.ChinaAdmin.openEditModal(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-pen-to-square mr-1"></i>수정</button>');
            html.push('      <button type="button" onclick="window.ChinaAdmin.deleteItem(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-trash-can mr-1"></i>삭제</button>');
            html.push('    </div>');
            html.push('  </div>');

            html.push('  <div class="flex flex-col md:flex-row gap-4">');
            // 미디어 이미지
            if (item.imageUrl) {
                html.push('    <div class="w-full md:w-36 h-28 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative group cursor-pointer" onclick="openImageModal(\'' + item.imageUrl + '\', \'' + item.title.replace(/'/g, "\\'") + '\')">');
                html.push('      <img src="' + item.imageUrl + '" alt="' + item.title + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus"></i> 확대');
                html.push('      </div>');
                html.push('    </div>');
            }

            // 본문 내용
            html.push('    <div class="flex-1 min-w-0 space-y-1.5">');
            html.push('      <h4 class="text-base font-bold text-slate-900 tracking-tight">' + item.title + '</h4>');
            if (item.subtitle) {
                html.push('      <p class="text-xs text-slate-500 font-medium">' + item.subtitle + '</p>');
            }
            if (item.location) {
                html.push('      <p class="text-xs text-blue-600 font-semibold"><i class="fa-solid fa-location-dot mr-1"></i>' + item.location + '</p>');
            }
            html.push('      <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line line-clamp-2">' + (item.description || '상세 설명 없음') + '</p>');
            if (item.features && item.features.length > 0) {
                html.push('      <div class="flex flex-wrap gap-1 pt-1">');
                item.features.forEach(function (f) {
                    html.push('        <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">✓ ' + f + '</span>');
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
    // 4. 모달(신규 작성 & 수정) 제어
    // ==========================================================================
    function ensureModal() {
        var existing = document.getElementById('china-editor-modal');
        if (existing) return existing;

        var modalHtml = [
            '<div id="china-editor-modal" class="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-4">',
            '  <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">',
            '    <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">',
            '      <div class="flex items-center gap-2.5">',
            '        <span class="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-sm font-bold">',
            '          <i class="fa-solid fa-industry"></i>',
            '        </span>',
            '        <div>',
            '          <h3 id="china-modal-title" class="text-base font-bold text-white">한중합자법인(제조사) 항목 편집</h3>',
            '          <p class="text-[11px] text-slate-400">법인 개요, 핵심 지표, 3대 기술협력, 제조 거점 정보를 관리합니다.</p>',
            '        </div>',
            '      </div>',
            '      <button type="button" onclick="window.ChinaAdmin.closeModal()" class="text-slate-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"><i class="fa-solid fa-xmark"></i></button>',
            '    </div>',
            '    <form id="china-editor-form" onsubmit="window.ChinaAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">',
            '      <input type="hidden" id="china-form-id" value="">',
            '      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">카테고리 구분 <span class="text-red-500">*</span></label>',
            '          <select id="china-form-category" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" required>',
            '            <option value="intro">법인 개요 및 핵심 지표 (Overview/Stats)</option>',
            '            <option value="coop">상호협력 및 3대 기술제휴 (Cooperation)</option>',
            '            <option value="facility">글로벌 거점 및 제조 설비 (Facilities)</option>',
            '          </select>',
            '        </div>',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">정렬 순서</label>',
            '          <input type="number" id="china-form-sort" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" value="1" min="1" max="99">',
            '        </div>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">명칭 / 제목 <span class="text-red-500">*</span></label>',
            '        <input type="text" id="china-form-title" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 하드웨어-소프트웨어 융합 R&D" required>',
            '      </div>',
            '      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">부제목 / 영문 표기</label>',
            '          <input type="text" id="china-form-subtitle" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: HW & SW Fusion Co-development">',
            '        </div>',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">테마 배지 텍스트</label>',
            '          <input type="text" id="china-form-badge" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 핵심 협력 01, GLOBAL SCALE">',
            '        </div>',
            '      </div>',
            '      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">핵심 수치 (지표인 경우)</label>',
            '          <input type="text" id="china-form-statval" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 35,000㎡, 16+, 5,000+">',
            '        </div>',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">수치 설명 라벨</label>',
            '          <input type="text" id="china-form-statlbl" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 글로벌 스마트 양산 부지">',
            '        </div>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">소재지 / 위치 (거점 설비인 경우)</label>',
            '        <input type="text" id="china-form-location" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 경기도 오산시 현대테라타워 CMC / 첨단 물류 로보틱스 양산 복합 클러스터">',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">상세 설명</label>',
            '        <textarea id="china-form-desc" rows="3.5" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 leading-relaxed whitespace-pre-line" placeholder="사업 개요, 협력 모델, 설비 제원 등 상세 내용을 자유롭게 작성하세요 (줄바꿈 지원)."></textarea>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">주요 특장점 / 세부 역량 (줄바꿈으로 구분)</label>',
            '        <textarea id="china-form-features" rows="2.5" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500" placeholder="한 줄에 하나씩 주요 특징을 입력하세요."></textarea>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">대표 이미지 (설비 사진/인포그래픽 경로 또는 직접 업로드)</label>',
            '        <div class="flex items-center gap-2">',
            '          <input type="text" id="china-form-imageurl" class="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: [ Insert Data ]/중국 지사_제조사/렵력사업/1. 하드웨어-소프트웨어 융합 R&D.png">',
            '          <label class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer shrink-0 transition-colors">',
            '            <i class="fa-solid fa-cloud-arrow-up mr-1"></i> 사진 업로드',
            '            <input type="file" accept="image/*" onchange="window.ChinaAdmin.handleFileSelect(event)" class="hidden">',
            '          </label>',
            '        </div>',
            '      </div>',
            '      <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">',
            '        <button type="button" onclick="window.ChinaAdmin.closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">취소</button>',
            '        <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer">저장 완료</button>',
            '      </div>',
            '    </form>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        return document.getElementById('china-editor-modal');
    }

    function openCreateModal(defaultCategory) {
        var modal = ensureModal();
        document.getElementById('china-modal-title').textContent = '한중합자법인 항목 신규 등록';
        document.getElementById('china-form-id').value = '';
        document.getElementById('china-form-category').value = defaultCategory || (currentFilter === 'all' ? 'coop' : currentFilter);
        document.getElementById('china-form-sort').value = '1';
        document.getElementById('china-form-title').value = '';
        document.getElementById('china-form-subtitle').value = '';
        document.getElementById('china-form-badge').value = '';
        document.getElementById('china-form-statval').value = '';
        document.getElementById('china-form-statlbl').value = '';
        document.getElementById('china-form-location').value = '';
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
        document.getElementById('china-form-statval').value = item.statValue || '';
        document.getElementById('china-form-statlbl').value = item.statLabel || '';
        document.getElementById('china-form-location').value = item.location || '';
        document.getElementById('china-form-desc').value = item.description || '';
        document.getElementById('china-form-features').value = (item.features || []).join('\n');
        document.getElementById('china-form-imageurl').value = item.imageUrl || '';

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

    function handleFileSelect(e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        if (file.size > 8 * 1024 * 1024) {
            alert('이미지 크기가 8MB를 초과하여 업로드할 수 없습니다.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (evt) {
            var input = document.getElementById('china-form-imageurl');
            if (input) {
                input.value = evt.target.result;
            }
            alert('이미지가 로컬 데이터로 안전하게 첨부되었습니다: ' + file.name);
        };
        reader.readAsDataURL(file);
    }

    function handleFormSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();

        var id = document.getElementById('china-form-id').value;
        var category = document.getElementById('china-form-category').value;
        var sortOrder = parseInt(document.getElementById('china-form-sort').value, 10) || 1;
        var title = document.getElementById('china-form-title').value.trim();
        var subtitle = document.getElementById('china-form-subtitle').value.trim();
        var badge = document.getElementById('china-form-badge').value.trim();
        var statValue = document.getElementById('china-form-statval').value.trim();
        var statLabel = document.getElementById('china-form-statlbl').value.trim();
        var location = document.getElementById('china-form-location').value.trim();
        var description = document.getElementById('china-form-desc').value.trim();
        var rawFeatures = document.getElementById('china-form-features').value.trim();
        var imageUrl = document.getElementById('china-form-imageurl').value.trim();

        if (!title) {
            alert('명칭/제목을 입력해 주세요.');
            return;
        }

        var features = rawFeatures ? rawFeatures.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];

        var data = loadData();

        if (id) {
            var idx = data.findIndex(function (it) { return it.id === id; });
            if (idx !== -1) {
                data[idx] = {
                    id: id,
                    category: category,
                    sortOrder: sortOrder,
                    title: title,
                    subtitle: subtitle,
                    badge: badge,
                    statValue: statValue,
                    statLabel: statLabel,
                    location: location,
                    description: description,
                    features: features,
                    imageUrl: imageUrl
                };
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
                location: location,
                description: description,
                features: features,
                imageUrl: imageUrl
            });
        }

        saveData(data);
        closeModal();
        alert('한중합자법인 데이터가 정상적으로 저장되었습니다!');

        if (typeof window.switchAdminHubTab === 'function') {
            window.switchAdminHubTab('china');
        }
    }

    function deleteItem(id) {
        var data = loadData();
        var item = data.find(function (it) { return it.id === id; });
        if (!item) return;

        if (!confirm('[' + item.title + ']\n항목을 정말로 삭제하시겠습니까?')) {
            return;
        }

        var next = data.filter(function (it) { return it.id !== id; });
        saveData(next);
        alert('삭제되었습니다.');

        if (typeof window.switchAdminHubTab === 'function') {
            window.switchAdminHubTab('china');
        }
    }

    // ==========================================================================
    // 5. 프론트엔드 실시간 동적 렌더링 (#view-xingting-intro, coop, global)
    // ==========================================================================
    function renderFrontend() {
        var data = loadData();

        // 1. 법인 개요 및 지표 (#china-intro-dynamic-container)
        renderIntroSection(data.filter(function (it) { return it.category === 'intro'; }));

        // 2. 3대 상호협력 및 기술제휴 (#china-coop-cards-grid)
        renderCoopSection(data.filter(function (it) { return it.category === 'coop'; }));

        // 3. 글로벌 거점 및 제조 설비 (#china-global-dynamic-container)
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
                statHtml.push('<div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm text-center">');
                statHtml.push('  <div class="text-3xl sm:text-4xl font-black text-blue-600 mb-1 tracking-tight">' + st.statValue + '</div>');
                statHtml.push('  <div class="text-xs font-bold text-slate-800 mb-1">' + (st.statLabel || st.title) + '</div>');
                if (st.description) {
                    statHtml.push('  <div class="text-[11px] text-slate-500 leading-snug line-clamp-2">' + st.description + '</div>');
                }
                statHtml.push('</div>');
            });
            statsContainer.innerHTML = statHtml.join('');
        }
    }

    /**
     * [3대 상호협력 및 기술제휴] 렌더링
     */
    function renderCoopSection(items) {
        var container = document.getElementById('china-coop-cards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it, idx) {
            var badgeStr = it.badge || ('핵심 협력 0' + (idx + 1));

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group fade-in appear">');
            html.push('  <div>');
            if (it.imageUrl) {
                html.push('    <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-6 relative group/img cursor-pointer border border-slate-200" onclick="openImageModal(\'' + it.imageUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\')">');
                html.push('      <img src="' + it.imageUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-cyan-400"></i> 원본 크게 보기');
                html.push('      </div>');
                html.push('    </div>');
            }
            html.push('    <span class="text-xs font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-full mb-3 inline-block border border-blue-200">' + badgeStr + '</span>');
            html.push('    <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-3 tracking-tight">' + it.title + '</h3>');
            if (it.subtitle) {
                html.push('    <p class="text-xs font-semibold text-slate-400 mb-3">' + it.subtitle + '</p>');
            }
            html.push('    <p class="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">' + (it.description || '') + '</p>');

            if (it.features && it.features.length > 0) {
                html.push('    <div class="space-y-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4">');
                it.features.forEach(function (f) {
                    html.push('      <div class="flex items-start gap-2 text-xs text-slate-700 font-medium">');
                    html.push('        <i class="fa-solid fa-check text-blue-600 mt-0.5 shrink-0"></i>');
                    html.push('        <span>' + f + '</span>');
                    html.push('      </div>');
                });
                html.push('    </div>');
            }
            html.push('  </div>');

            html.push('  <div class="pt-4 border-t border-slate-100 flex items-center justify-end">');
            if (it.imageUrl) {
                html.push('    <button type="button" onclick="openImageModal(\'' + it.imageUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\')" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer">');
                html.push('      <i class="fa-solid fa-expand"></i> 인포그래픽 크게 보기');
                html.push('    </button>');
            }
            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [글로벌 거점 및 제조 설비] 렌더링
     */
    function renderFacilitySection(items) {
        var container = document.getElementById('china-facilities-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group fade-in appear">');
            html.push('  <div>');
            if (it.imageUrl) {
                html.push('    <div class="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 mb-6 relative group/fac cursor-pointer border border-slate-200" onclick="openImageModal(\'' + it.imageUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\')">');
                html.push('      <img src="' + it.imageUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/fac:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/fac:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-cyan-400"></i> 고화질 원본 확대');
                html.push('      </div>');
                html.push('    </div>');
            }
            if (it.badge) {
                html.push('    <span class="text-xs font-black px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full mb-3 inline-block border border-cyan-200">' + it.badge + '</span>');
            }
            html.push('    <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-2 tracking-tight">' + it.title + '</h3>');
            if (it.location) {
                html.push('    <p class="text-xs font-semibold text-blue-600 mb-3"><i class="fa-solid fa-location-dot mr-1"></i>' + it.location + '</p>');
            }
            html.push('    <p class="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">' + (it.description || '') + '</p>');

            if (it.features && it.features.length > 0) {
                html.push('    <div class="space-y-2 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-4">');
                it.features.forEach(function (f) {
                    html.push('      <div class="flex items-start gap-2 text-xs text-slate-700 font-medium">');
                    html.push('        <i class="fa-solid fa-check text-cyan-600 mt-0.5 shrink-0"></i>');
                    html.push('        <span>' + f + '</span>');
                    html.push('      </div>');
                });
                html.push('    </div>');
            }
            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    // ==========================================================================
    // 6. 전역 노출 네임스페이스
    // ==========================================================================
    window.ChinaAdmin = {
        loadData: loadData,
        saveData: saveData,
        resetToDefault: resetToDefault,
        renderManagerList: renderManagerList,
        openCreateModal: openCreateModal,
        openEditModal: openEditModal,
        closeModal: closeModal,
        handleFileSelect: handleFileSelect,
        handleFormSubmit: handleFormSubmit,
        deleteItem: deleteItem,
        renderFrontend: renderFrontend
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFrontend);
    } else {
        renderFrontend();
    }

})();

