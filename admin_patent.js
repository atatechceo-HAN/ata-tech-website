/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 특허 및 인증 관리자 모드 CRUD & 실시간 렌더링 엔진 (admin_patent.js)
 * 
 * [주요 기능]
 * 1. 특허(Patent), 품질·환경인증(Certifications), 대외 수상·수료(Awards) 통합 데이터베이스 관리
 * 2. 브라우저 로컬 저장소(LocalStorage) 기반 실시간 데이터 영구 보존 및 동기화
 * 3. 관리자 센터(Admin Hub) 전용 CRUD 인터페이스: 신규 등록, 상세 수정, 삭제, 기본값 안전 복원
 * 4. 인증서/특허증 PDF 및 이미지(JPG/PNG) 파일 로컬 업로드(Base64) 및 경로 지정 지원
 * 5. 실제 사용자 홈페이지(#view-patents, #view-cert-quality, #view-cert-awards) 실시간 동적 렌더링
 * ==============================================================================
 */

(function () {
    'use strict';

    // 1. 로컬 저장소 키
    var STORAGE_KEY_PATENT = "ata_patent_cert_db_v1";

    // 2. 초기 기본 공식 데이터 (특허 4건, 인증 5건, 수상 3건 = 총 12건)
    var INITIAL_PATENT_DATA = [
        // ===================== [1. 특허 현황: 4건] =====================
        {
            id: "pat_1",
            category: "patent",
            title: "차세대 택배차량 배송 자동화 시스템",
            subtitle: "Smart Delivery Vehicle Automation System",
            regNumber: "제 10-2317010 호",
            date: "2021.10.15 등록",
            organization: "대한민국 특허청 (KIPO)",
            badge: "등록특허",
            fileUrl: "docs/1. [특허증]10-2317010.pdf",
            description: "택배 배송 차량 내부의 적재함을 모듈화하여 목적지별 화물을 자동으로 이송하고 순차 배출하는 차세대 스마트 모빌리티 물류 특허입니다.",
            features: [
                "차량 내부 적재함 자동 이송 및 슬라이딩 배출 메커니즘",
                "상하차 작업 시간 60% 이상 단축 및 배송 기사 근골격계 질환 예방",
                "다양한 규격의 배송 차량(1톤/2.5톤/탑차) 맞춤형 커스텀 장착 지원"
            ],
            sortOrder: 1
        },
        {
            id: "pat_2",
            category: "patent",
            title: "인공지능 기반 스마트 체형 교정 및 유지 시스템",
            subtitle: "AI-based Body Posture Correction & Health System",
            regNumber: "제 10-2758800 호",
            date: "2025.01.10 등록",
            organization: "대한민국 특허청 (KIPO)",
            badge: "등록특허",
            fileUrl: "docs/1.[특허증]10-2758800.pdf",
            description: "비전 AI 카메라 및 압력 센서를 결합하여 사용자의 작업 자세와 체형 밸런스를 실시간 추적하고 인체공학적 피드백을 제공하는 스마트 헬스케어 특허 기술입니다.",
            features: [
                "물류 현장 작업자 작업 자세 및 위험 하중 실시간 AI 추적",
                "신체 불균형 및 위험 작업 패턴 감지 시 즉각 경고 알림",
                "작업 안전성 및 작업장 보건 관리 솔루션과 통합 연동"
            ],
            sortOrder: 2
        },
        {
            id: "pat_3",
            category: "patent",
            title: "운송 차량 적재물 분류 및 이송 시스템",
            subtitle: "Vehicle Cargo Sorting & Conveyance System",
            regNumber: "제 10-2782386 호",
            date: "2025.03.05 등록",
            organization: "대한민국 특허청 (KIPO)",
            badge: "등록특허",
            fileUrl: "docs/1.[특허증]10-2782386.pdf",
            description: "운송 트럭 및 컨테이너 내부 깊숙이 진입하여 화물의 크기, 무게, 바코드를 고속 인식하고 자동 분류하는 텔레스코픽 연동 이송 특허 시스템입니다.",
            features: [
                "다열 컨베이어 기반 고속 화물 피치 제어 및 연속 이송",
                "비정형 박스 및 연포장 폴리백 화물 걸림 방지 특수 벨트 설계",
                "간선 하차 라인 병목 현상 완전 해소 및 시간당 4,000+ 개 연속 처리"
            ],
            sortOrder: 3
        },
        {
            id: "pat_4",
            category: "patent",
            title: "컨베이어 물류 분류용 4분할 방향 전환 장치",
            subtitle: "4-Directional Transfer & Sorting Switch Device",
            regNumber: "제 10-2956028 호",
            date: "2026.04.02 등록",
            organization: "대한민국 특허청 (KIPO)",
            badge: "최신원천특허",
            fileUrl: "docs/1.[특허증]10-2956028.pdf",
            description: "고속 주행 중인 화물을 회전 감속 없이 직진, 좌, 우, 반전의 4방향으로 0.15초 이내에 부드럽게 궤적 전환하는 에이티에이기술의 대표 원천 핵심 특허 장치입니다.",
            features: [
                "독자 개발 4분할 롤러 매트릭스 구동 기술로 충격 없는 방향 전환",
                "다양한 중량물(0.2kg ~ 50kg) 및 취급주의 유리/전자제품 완벽 지원",
                "모듈형 설계로 기존 컨베이어 라인 어디든 단 1시간 이내 신속 설치"
            ],
            sortOrder: 4
        },

        // ===================== [2. 인증 현황: 5건] =====================
        {
            id: "cert_1",
            category: "cert",
            title: "ISO 9001 인증서",
            subtitle: "품질경영시스템 (ISO 9001:2015)",
            regNumber: "QMS-2024-ATA",
            date: "2024.08.15",
            organization: "국제표준화기구 (ISO) / ICR 인증원",
            badge: "품질경영",
            fileUrl: "docs/(주)에이티에이기술 ISO 9001.pdf",
            description: "물류 자동화 시스템 및 산업용 기계 엔지니어링의 설계, 개발, 제조, 설치 및 부가 서비스 전 과정에 걸쳐 국제 표준 품질 규격을 충족함을 공식 인증받았습니다.",
            features: [
                "물류 자동화 기기 설계 및 제작 공정의 엄격한 품질 보증 체계",
                "고객 요구사항 100% 충족을 위한 지속적 품질 개선 프로세스 운영"
            ],
            sortOrder: 1
        },
        {
            id: "cert_2",
            category: "cert",
            title: "ISO 14001 인증서",
            subtitle: "환경경영시스템 (ISO 14001:2015)",
            regNumber: "EMS-2024-ATA",
            date: "2024.08.15",
            organization: "국제표준화기구 (ISO) / ICR 인증원",
            badge: "환경경영",
            fileUrl: "docs/(주)에이티에이기술 ISO 14001.pdf",
            description: "친환경 고효율 모터 적용 및 자원 재활용 설계를 통해 제품 제조와 설치 전 과정에서 환경적 영향을 최소화하는 친환경 경영 표준을 인증받았습니다.",
            features: [
                "에너지 고효율 저전력 제어 알고리즘 및 친환경 부품 채택",
                "제조 폐기물 저감 및 글로벌 환경 규제 준수 에코 엔지니어링"
            ],
            sortOrder: 2
        },
        {
            id: "cert_3",
            category: "cert",
            title: "벤처기업확인서",
            subtitle: "혁신성장유형 벤처기업",
            regNumber: "제 2024-0312 호",
            date: "2024.03.12",
            organization: "중소벤처기업진흥공단",
            badge: "벤처기업",
            fileUrl: "docs/벤처기업확인서.pdf",
            description: "기술의 혁신성과 미래 성장 잠재력을 공식 검증받아 기술보증기금 및 중소벤처기업부로부터 벤처기업으로 정식 인증되었습니다.",
            features: [
                "자율주행 물류 솔루션 및 지능형 소터 독자 기술력 인정",
                "지속적인 R&D 투자와 차세대 물류 혁신 스타트업 선정"
            ],
            sortOrder: 3
        },
        {
            id: "cert_4",
            category: "cert",
            title: "창업기업확인서",
            subtitle: "기술기반 창업기업",
            regNumber: "제 2023-0824 호",
            date: "2023.08.24",
            organization: "중소벤처기업부",
            badge: "창업기업",
            fileUrl: "docs/창업기업확인서.pdf",
            description: "물류 메카트로닉스 및 지능형 창고제어(WCS) 소프트웨어 융합 기술을 기반으로 공식 설립된 혁신 기술 기업임을 확인받았습니다.",
            features: [
                "정부 주도 스마트 물류 및 첨단 제조 육성 지원 대상 기업",
                "국내외 대형 물류 인프라 프로젝트 턴키 수행 역량 확보"
            ],
            sortOrder: 4
        },
        {
            id: "cert_5",
            category: "cert",
            title: "연구개발전담부서 인정서",
            subtitle: "기업부설 연구개발전담부서",
            regNumber: "제 2023-RND-1102 호",
            date: "2023.11.02",
            organization: "한국산업기술진흥협회 (KOITA)",
            badge: "R&D연구소",
            fileUrl: "docs/연구개발전담부서인정서.pdf",
            description: "물류 자동화 메카트로닉스 및 비전 AI 화물 인식 기술을 전문적으로 연구개발하는 사내 전담 연구부서의 인프라와 역량을 공식 인정받았습니다.",
            features: [
                "자체 테스트베드 및 3D 시뮬레이션 연구 설비 상시 운용",
                "국내 유수 물류 기업 및 해외 제조사와의 산학연 R&D 프로젝트 주도"
            ],
            sortOrder: 5
        },

        // ===================== [3. 수상 및 수료: 3건] =====================
        {
            id: "award_1",
            category: "award",
            title: "강원창조경제혁신센터 표창",
            subtitle: "스마트 모빌리티 & 로보틱스 우수기업",
            regNumber: "GW-AWD-2024-09",
            date: "2024.09.20",
            organization: "강원창조경제혁신센터장",
            badge: "우수표창",
            fileUrl: "docs/강원창조경제혁신센터.pdf",
            description: "지역 스마트 물류 모빌리티 생태계 활성화 및 혁신 기술 R&D 육성에 기여한 공로를 인정받아 우수 혁신 기업 표창을 수상하였습니다.",
            features: [
                "혁신 물류 로보틱스 상용화 성공 및 지역 청년 일자리 창출 기여"
            ],
            sortOrder: 1
        },
        {
            id: "award_2",
            category: "award",
            title: "인천창조경제혁신센터 수상",
            subtitle: "물류 스타트업 피칭 페스티벌 우수상",
            regNumber: "IC-AWD-2023-11",
            date: "2023.11.15",
            organization: "인천창조경제혁신센터장",
            badge: "우수상",
            fileUrl: "docs/인천창조경제혁신센터-개인자격수상.pdf",
            description: "차세대 택배차량 자동 상하차 시스템의 혁신성과 사업화 타당성을 인정받아 물류 신기술 피칭 대회에서 우수상을 수상하였습니다.",
            features: [
                "국내 대형 풀필먼트 센터 및 라스트마일 물류 현장 실증 테스트 완료"
            ],
            sortOrder: 2
        },
        {
            id: "award_3",
            category: "award",
            title: "RnD 실무교육 수료증",
            subtitle: "첨단 로보틱스 & 메카트로닉스 R&D 전문과정",
            regNumber: "RND-EDU-2023-04",
            date: "2023.04.28",
            organization: "한국로봇산업진흥원",
            badge: "전문수료",
            fileUrl: "docs/RnD 실무교육 수료증.pdf",
            description: "산업용 스마트 로봇 제어 시스템 및 안전 규격 설계 실무 과정을 전원 우수한 성적으로 이수 완료하였습니다.",
            features: [
                "ISO 10218 및 산업용 로봇 안전 규격 설계 표준 완벽 준수"
            ],
            sortOrder: 3
        }
    ];

    /**
     * 로컬 저장소에서 특허/인증 데이터를 안전하게 불러옵니다.
     * 데이터가 없으면 초기 기본 데이터를 저장 후 반환합니다.
     */
    function loadData() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_PATENT);
            if (!raw) {
                saveData(INITIAL_PATENT_DATA);
                return INITIAL_PATENT_DATA.slice();
            }
            var parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                saveData(INITIAL_PATENT_DATA);
                return INITIAL_PATENT_DATA.slice();
            }
            return parsed;
        } catch (e) {
            console.warn('[PatentAdmin] Failed to load from localStorage. Fallback to default.', e);
            return INITIAL_PATENT_DATA.slice();
        }
    }

    /**
     * 로컬 저장소에 데이터를 저장하고, 프론트엔드를 즉시 갱신합니다.
     */
    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY_PATENT, JSON.stringify(data));
        } catch (e) {
            console.error('[PatentAdmin] Storage save error:', e);
            alert('저장 용량이 부족하거나 브라우저 저장소 접근에 실패했습니다.');
        }
        // 프론트엔드 실시간 동기화 호출
        renderFrontend();
    }

    /**
     * 초기 공식 기본 데이터로 완전 복원합니다.
     */
    function resetToDefault() {
        if (!confirm("특허, 인증, 수상 내역 전체를 공식 초기 데이터로 안전 복원하시겠습니까?\n(사용자가 수정한 내용은 초기화됩니다.)")) {
            return;
        }
        saveData(INITIAL_PATENT_DATA.slice());
        alert("공식 초기 기본 데이터로 안전하게 복원되었습니다.");
        if (typeof window.switchAdminHubTab === 'function') {
            window.switchAdminHubTab('patent');
        }
    }

    // ==========================================================================
    // 3. 관리자 센터(Admin Hub) 목록 렌더링
    // ==========================================================================
    var currentFilter = 'all';

    function renderManagerList(container, filter) {
        if (!container) container = document.getElementById('admin-hub-patent-list');
        if (!container) return;

        if (filter !== undefined) currentFilter = filter;
        var data = loadData();

        // 카테고리 필터링
        var filtered = data;
        if (currentFilter !== 'all') {
            filtered = data.filter(function (it) { return it.category === currentFilter; });
        }

        // 정렬
        filtered.sort(function (a, b) {
            return (a.sortOrder || 99) - (b.sortOrder || 99);
        });

        // 탭 버튼 스타일 갱신
        var catTabs = ['all', 'patent', 'cert', 'award'];
        catTabs.forEach(function (cat) {
            var btn = document.getElementById('hub-patent-tab-' + cat);
            if (btn) {
                if (cat === currentFilter) {
                    btn.className = 'px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm transition-all cursor-pointer';
                } else {
                    btn.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer';
                }
            }
        });

        // 카운트 배지 갱신
        var counts = { all: data.length, patent: 0, cert: 0, award: 0 };
        data.forEach(function (it) {
            if (counts[it.category] !== undefined) counts[it.category]++;
        });
        catTabs.forEach(function (cat) {
            var badge = document.getElementById('hub-patent-count-' + cat);
            if (badge) badge.textContent = counts[cat];
        });

        if (filtered.length === 0) {
            container.innerHTML = '<div class="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-medium">등록된 항목이 없습니다. 우측 상단의 [+ 새 항목 등록] 버튼을 눌러보세요.</div>';
            return;
        }

        var html = [];
        filtered.forEach(function (item) {
            var catLabel = item.category === 'patent' ? '특허 현황' : (item.category === 'cert' ? '인증 현황' : '수상/수료');
            var catBadgeClass = item.category === 'patent' ? 'bg-amber-100 text-amber-800 border-amber-300' : (item.category === 'cert' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-indigo-100 text-indigo-800 border-indigo-300');
            var isPdf = (item.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            html.push('<div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-300 transition-all space-y-3">');
            html.push('  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">');
            html.push('    <div class="flex items-center gap-2 flex-wrap">');
            html.push('      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ' + catBadgeClass + '">' + catLabel + '</span>');
            html.push('      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs">' + (item.regNumber || '등록번호 없음') + '</span>');
            html.push('      <span class="text-xs text-slate-400 font-medium"><i class="fa-regular fa-calendar-check mr-1"></i>' + (item.date || '') + '</span>');
            html.push('    </div>');
            html.push('    <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">');
            html.push('      <button type="button" onclick="window.PatentAdmin.openEditModal(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-pen-to-square mr-1"></i>수정</button>');
            html.push('      <button type="button" onclick="window.PatentAdmin.deleteItem(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-trash-can mr-1"></i>삭제</button>');
            html.push('    </div>');
            html.push('  </div>');

            html.push('  <div class="flex flex-col md:flex-row gap-4">');
            // 미디어 썸네일
            html.push('    <div class="w-full md:w-36 h-28 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative group">');
            if (isPdf) {
                html.push('      <div class="text-center p-2">');
                html.push('        <i class="fa-solid fa-file-pdf text-rose-500 text-2xl mb-1"></i>');
                html.push('        <div class="text-[10px] text-slate-500 font-semibold truncate max-w-[120px]">' + (item.fileUrl.split('/').pop()) + '</div>');
                html.push('        <a href="' + item.fileUrl + '" target="_blank" class="mt-1 inline-block text-[10px] text-blue-600 hover:underline">PDF 보기</a>');
                html.push('      </div>');
            } else if (item.fileUrl) {
                html.push('      <img src="' + item.fileUrl + '" alt="' + item.title + '" class="w-full h-full object-cover" onerror="this.src=\'assets/images/no-image.svg\';">');
            } else {
                html.push('      <div class="text-[11px] text-slate-400 font-medium">첨부 문서 없음</div>');
            }
            html.push('    </div>');

            // 본문 내용
            html.push('    <div class="flex-1 min-w-0 space-y-1.5">');
            html.push('      <h4 class="text-base font-bold text-slate-900 tracking-tight">' + item.title + '</h4>');
            if (item.subtitle) {
                html.push('      <p class="text-xs text-slate-500 font-medium">' + item.subtitle + '</p>');
            }
            html.push('      <p class="text-xs text-slate-600 leading-relaxed line-clamp-2">' + (item.description || '상세 설명 없음') + '</p>');
            if (item.features && item.features.length > 0) {
                html.push('      <div class="flex flex-wrap gap-1 pt-1">');
                item.features.forEach(function (f) {
                    html.push('        <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"># ' + f + '</span>');
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
        var existing = document.getElementById('patent-editor-modal');
        if (existing) return existing;

        var modalHtml = [
            '<div id="patent-editor-modal" class="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-4">',
            '  <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">',
            '    <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">',
            '      <div class="flex items-center gap-2.5">',
            '        <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-sm font-bold">',
            '          <i class="fa-solid fa-stamp"></i>',
            '        </span>',
            '        <div>',
            '          <h3 id="patent-modal-title" class="text-base font-bold text-white">특허 및 인증 항목 작성</h3>',
            '          <p class="text-[11px] text-slate-400">특허, 인증서, 수상 내역의 메타데이터와 문서를 편집합니다.</p>',
            '        </div>',
            '      </div>',
            '      <button type="button" onclick="window.PatentAdmin.closeModal()" class="text-slate-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"><i class="fa-solid fa-xmark"></i></button>',
            '    </div>',
            '    <form id="patent-editor-form" onsubmit="window.PatentAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">',
            '      <input type="hidden" id="patent-form-id" value="">',
            '      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">구분 / 카테고리 <span class="text-red-500">*</span></label>',
            '          <select id="patent-form-category" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" required>',
            '            <option value="patent">특허 현황 (Patent)</option>',
            '            <option value="cert">인증 현황 (Quality & Env Cert)</option>',
            '            <option value="award">수상 및 수료 내역 (Awards)</option>',
            '          </select>',
            '        </div>',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">정렬 순서</label>',
            '          <input type="number" id="patent-form-sort" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" value="1" min="1" max="99">',
            '        </div>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">명칭 / 제목 <span class="text-red-500">*</span></label>',
            '        <input type="text" id="patent-form-title" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 컨베이어 물류 분류용 4분할 방향 전환 장치" required>',
            '      </div>',
            '      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">등록 / 출원 / 인증 번호</label>',
            '          <input type="text" id="patent-form-regnumber" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 제 10-2956028 호">',
            '        </div>',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">등록일 / 발급일자</label>',
            '          <input type="text" id="patent-form-date" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 2026.04.02 등록">',
            '        </div>',
            '      </div>',
            '      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">발행 / 등록 기관</label>',
            '          <input type="text" id="patent-form-org" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 대한민국 특허청 (KIPO)">',
            '        </div>',
            '        <div>',
            '          <label class="block text-xs font-bold text-slate-700 mb-1">표시 배지 (선택)</label>',
            '          <input type="text" id="patent-form-badge" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: 등록특허, 품질경영, 우수표창">',
            '        </div>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">상세 설명</label>',
            '        <textarea id="patent-form-desc" rows="3" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 leading-relaxed" placeholder="기술의 개요 및 주요 인증 내용에 대한 상세한 설명을 입력하세요."></textarea>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">주요 특장점 (줄바꿈으로 구분)</label>',
            '        <textarea id="patent-form-features" rows="2.5" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500" placeholder="한 줄에 하나씩 주요 특징을 입력하세요."></textarea>',
            '      </div>',
            '      <div>',
            '        <label class="block text-xs font-bold text-slate-700 mb-1">인증서 / 특허증 파일 (PDF 또는 이미지 경로/업로드)</label>',
            '        <div class="flex items-center gap-2">',
            '          <input type="text" id="patent-form-fileurl" class="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500" placeholder="예: docs/1.[특허증]10-2956028.pdf 또는 이미지 URL">',
            '          <label class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 cursor-pointer shrink-0 transition-colors">',
            '            <i class="fa-solid fa-file-arrow-up mr-1"></i> 파일 선택',
            '            <input type="file" accept=".pdf,image/*" onchange="window.PatentAdmin.handleFileSelect(event)" class="hidden">',
            '          </label>',
            '        </div>',
            '        <p class="text-[10px] text-slate-400 mt-1">※ docs/ 폴더에 위치한 상대경로를 입력하시거나, PC의 PDF/이미지 파일을 직접 업로드하실 수 있습니다.</p>',
            '      </div>',
            '      <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">',
            '        <button type="button" onclick="window.PatentAdmin.closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">취소</button>',
            '        <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all cursor-pointer">저장 완료</button>',
            '      </div>',
            '    </form>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        return document.getElementById('patent-editor-modal');
    }

    function openCreateModal(defaultCategory) {
        var modal = ensureModal();
        document.getElementById('patent-modal-title').textContent = '특허 및 인증 항목 신규 등록';
        document.getElementById('patent-form-id').value = '';
        document.getElementById('patent-form-category').value = defaultCategory || currentFilter === 'all' ? 'patent' : currentFilter;
        document.getElementById('patent-form-sort').value = '1';
        document.getElementById('patent-form-title').value = '';
        document.getElementById('patent-form-regnumber').value = '';
        document.getElementById('patent-form-date').value = '';
        document.getElementById('patent-form-org').value = '';
        document.getElementById('patent-form-badge').value = '';
        document.getElementById('patent-form-desc').value = '';
        document.getElementById('patent-form-features').value = '';
        document.getElementById('patent-form-fileurl').value = '';

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

        document.getElementById('patent-modal-title').textContent = '특허 및 인증 항목 수정 (' + item.title + ')';
        document.getElementById('patent-form-id').value = item.id;
        document.getElementById('patent-form-category').value = item.category || 'patent';
        document.getElementById('patent-form-sort').value = item.sortOrder || '1';
        document.getElementById('patent-form-title').value = item.title || '';
        document.getElementById('patent-form-regnumber').value = item.regNumber || '';
        document.getElementById('patent-form-date').value = item.date || '';
        document.getElementById('patent-form-org').value = item.organization || '';
        document.getElementById('patent-form-badge').value = item.badge || '';
        document.getElementById('patent-form-desc').value = item.description || '';
        document.getElementById('patent-form-features').value = (item.features || []).join('\n');
        document.getElementById('patent-form-fileurl').value = item.fileUrl || '';

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeModal() {
        var modal = document.getElementById('patent-editor-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    function handleFileSelect(e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        // 파일이 10MB 초과시 경고
        if (file.size > 10 * 1024 * 1024) {
            alert('파일 크기가 10MB를 초과하여 업로드할 수 없습니다.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (evt) {
            var input = document.getElementById('patent-form-fileurl');
            if (input) {
                input.value = evt.target.result;
            }
            alert('파일이 로컬 데이터로 안전하게 첨부되었습니다: ' + file.name);
        };
        reader.readAsDataURL(file);
    }

    function handleFormSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();

        var id = document.getElementById('patent-form-id').value;
        var category = document.getElementById('patent-form-category').value;
        var sortOrder = parseInt(document.getElementById('patent-form-sort').value, 10) || 1;
        var title = document.getElementById('patent-form-title').value.trim();
        var regNumber = document.getElementById('patent-form-regnumber').value.trim();
        var date = document.getElementById('patent-form-date').value.trim();
        var organization = document.getElementById('patent-form-org').value.trim();
        var badge = document.getElementById('patent-form-badge').value.trim();
        var description = document.getElementById('patent-form-desc').value.trim();
        var rawFeatures = document.getElementById('patent-form-features').value.trim();
        var fileUrl = document.getElementById('patent-form-fileurl').value.trim();

        if (!title) {
            alert('명칭/제목을 입력해 주세요.');
            return;
        }

        var features = rawFeatures ? rawFeatures.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];

        var data = loadData();

        if (id) {
            // 수정
            var idx = data.findIndex(function (it) { return it.id === id; });
            if (idx !== -1) {
                data[idx] = {
                    id: id,
                    category: category,
                    sortOrder: sortOrder,
                    title: title,
                    regNumber: regNumber,
                    date: date,
                    organization: organization,
                    badge: badge,
                    description: description,
                    features: features,
                    fileUrl: fileUrl
                };
            }
        } else {
            // 신규
            var newId = 'pat_' + Date.now();
            data.push({
                id: newId,
                category: category,
                sortOrder: sortOrder,
                title: title,
                regNumber: regNumber,
                date: date,
                organization: organization,
                badge: badge,
                description: description,
                features: features,
                fileUrl: fileUrl
            });
        }

        saveData(data);
        closeModal();
        alert('특허/인증 데이터가 정상적으로 저장되었습니다!');

        if (typeof window.switchAdminHubTab === 'function') {
            window.switchAdminHubTab('patent');
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
            window.switchAdminHubTab('patent');
        }
    }

    // ==========================================================================
    // 5. 프론트엔드 실시간 동적 렌더링 (#view-patents, #view-cert-quality, #view-cert-awards)
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
     * [특허 현황] 동적 카드 렌더링
     */
    function renderPatentSection(items) {
        var container = document.getElementById('patent-cards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it, idx) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;
            var numStr = it.sortOrder ? (it.sortOrder < 10 ? '0' + it.sortOrder : it.sortOrder) : (idx + 1 < 10 ? '0' + (idx + 1) : idx + 1);

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden fade-in appear">');
            html.push('  <div>');
            // 상단 배지 바
            html.push('    <div class="flex items-center justify-between gap-3 mb-5">');
            html.push('      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">');
            html.push('        <i class="fa-solid fa-certificate text-blue-600"></i> ' + (it.badge || '특허 등록') + ' ' + numStr);
            html.push('      </span>');
            html.push('      <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('    </div>');

            // 특허 명칭 및 영문
            html.push('    <h3 class="text-xl md:text-2xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">' + it.title + '</h3>');
            if (it.subtitle) {
                html.push('    <p class="text-xs font-semibold text-slate-400 mb-4 tracking-wide">' + it.subtitle + '</p>');
            }
            html.push('    <p class="text-slate-600 text-sm leading-relaxed mb-6">' + (it.description || '') + '</p>');

            // 주요 특장점 리스트
            if (it.features && it.features.length > 0) {
                html.push('    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 space-y-2">');
                html.push('      <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">핵심 메커니즘 & R&D 경쟁력</div>');
                it.features.forEach(function (f) {
                    html.push('      <div class="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">');
                    html.push('        <i class="fa-solid fa-check text-blue-600 text-[11px] mt-0.5 shrink-0"></i>');
                    html.push('        <span>' + f + '</span>');
                    html.push('      </div>');
                });
                html.push('    </div>');
            }
            html.push('  </div>');

            // 하단 특허증 뷰어 / 버튼
            html.push('  <div class="pt-4 border-t border-slate-100 space-y-3">');
            if (isPdf) {
                html.push('    <div class="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group/pdf shadow-inner">');
                html.push('      <iframe src="' + it.fileUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit" class="w-full h-full border-0 pointer-events-none" title="' + it.title + '"></iframe>');
                html.push('      <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/pdf:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">');
                html.push('        <a href="' + it.fileUrl + '" target="_blank" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer">');
                html.push('          <i class="fa-solid fa-arrow-up-right-from-square"></i> 특허증 원본 PDF 열기');
                html.push('        </a>');
                html.push('      </div>');
                html.push('    </div>');
            } else if (it.fileUrl) {
                html.push('    <div class="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group/img cursor-pointer" onclick="openImageModal(\'' + it.fileUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\')">');
                html.push('      <img src="' + it.fileUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-cyan-400"></i> 원본 크게 보기');
                html.push('      </div>');
                html.push('    </div>');
            }
            html.push('    <div class="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">');
            html.push('      <span><i class="fa-solid fa-building-columns text-slate-400 mr-1"></i>' + (it.organization || '대한민국 특허청') + '</span>');
            html.push('      <span class="font-semibold text-blue-600">' + (it.date || '') + '</span>');
            html.push('    </div>');
            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [인증 현황] 동적 카드 렌더링
     */
    function renderCertSection(items) {
        var container = document.getElementById('cert-quality-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group fade-in appear">');
            html.push('  <div>');
            html.push('    <div class="flex items-center justify-between gap-2 mb-4">');
            html.push('      <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm">' + (it.badge || '품질인증') + '</span>');
            html.push('      <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('    </div>');
            html.push('    <h4 class="text-xl font-black text-slate-900 mb-2">' + it.title + '</h4>');
            if (it.subtitle) {
                html.push('    <p class="text-xs font-semibold text-emerald-700 mb-3">' + it.subtitle + '</p>');
            }
            html.push('    <p class="text-slate-600 text-sm leading-relaxed mb-6">' + (it.description || '') + '</p>');
            html.push('  </div>');

            html.push('  <div class="space-y-3 pt-4 border-t border-slate-100">');
            if (isPdf) {
                html.push('    <div class="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative group/cert shadow-inner">');
                html.push('      <iframe src="' + it.fileUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit" class="w-full h-full border-0 pointer-events-none" title="' + it.title + '"></iframe>');
                html.push('      <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">');
                html.push('        <a href="' + it.fileUrl + '" target="_blank" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer">');
                html.push('          <i class="fa-solid fa-arrow-up-right-from-square"></i> 원본 인증서 열기');
                html.push('        </a>');
                html.push('      </div>');
                html.push('    </div>');
            } else if (it.fileUrl) {
                html.push('    <div class="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative group/cert cursor-pointer" onclick="openImageModal(\'' + it.fileUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\')">');
                html.push('      <img src="' + it.fileUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/cert:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-emerald-400"></i> 확대보기');
                html.push('      </div>');
                html.push('    </div>');
            }
            html.push('    <div class="flex items-center justify-between text-xs text-slate-500 pt-1">');
            html.push('      <span>' + (it.organization || '국제인증원') + '</span>');
            html.push('      <span class="font-semibold text-emerald-600">' + (it.date || '') + '</span>');
            html.push('    </div>');
            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [수상 및 수료] 동적 카드 렌더링
     */
    function renderAwardSection(items) {
        var container = document.getElementById('cert-awards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between group fade-in appear text-center">');
            html.push('  <div>');
            html.push('    <div class="flex items-center justify-between mb-3">');
            html.push('      <span class="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">' + (it.badge || '수상/표창') + '</span>');
            html.push('      <span class="text-xs text-slate-400">' + (it.date || '') + '</span>');
            html.push('    </div>');
            html.push('    <h3 class="text-lg font-bold text-slate-900 mb-2">' + it.title + '</h3>');
            if (it.subtitle) {
                html.push('    <p class="text-xs text-slate-500 mb-3">' + it.subtitle + '</p>');
            }
            html.push('    <p class="text-xs text-slate-600 leading-relaxed mb-4">' + (it.description || '') + '</p>');
            html.push('  </div>');

            html.push('  <div class="space-y-3 pt-3 border-t border-slate-100">');
            if (isPdf) {
                html.push('    <div class="aspect-[4/3] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group/awd shadow-inner">');
                html.push('      <iframe src="' + it.fileUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit" class="w-full h-full border-0 pointer-events-none" title="' + it.title + '"></iframe>');
                html.push('      <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/awd:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">');
                html.push('        <a href="' + it.fileUrl + '" target="_blank" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 cursor-pointer">');
                html.push('          <i class="fa-solid fa-arrow-up-right-from-square"></i> 원본 보기');
                html.push('        </a>');
                html.push('      </div>');
                html.push('    </div>');
            } else if (it.fileUrl) {
                html.push('    <div class="aspect-[4/3] w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group/awd cursor-pointer" onclick="openImageModal(\'' + it.fileUrl + '\', \'' + it.title.replace(/'/g, "\\'") + '\')">');
                html.push('      <img src="' + it.fileUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/awd:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('    </div>');
            }
            html.push('    <div class="text-[11px] text-slate-400 font-semibold">' + (it.organization || '') + '</div>');
            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    // ==========================================================================
    // 6. 전역 노출 네임스페이스
    // ==========================================================================
    window.PatentAdmin = {
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

    // DOM 로드 완료 시 프론트엔드 자동 렌더링
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFrontend);
    } else {
        renderFrontend();
    }

})();

