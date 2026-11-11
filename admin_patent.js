/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 특허 및 인증 관리자 모드 CRUD & 실시간 렌더링 엔진 (admin_patent.js)
 * 
 * [주요 기능 & 2026 황금비율 리디자인]
 * 1. 특허(Patent), 품질·환경인증(Certifications), 대외 수상·수료(Awards) 통합 데이터 관리
 * 2. 사진(PDF/이미지) 대폭 콤팩트화 (30%) + 글씨란 대폭 확장 (70%) 황금비율 적용
 * 3. 가로 분할(Horizontal Split) 카드 레이아웃: 상세 설명, R&D 메커니즘 글씨가 시원하게 노출
 * 4. 관리자 센터(Admin Hub) 전용 CRUD 인터페이스: 상세 설명 textarea 6줄 이상 확대
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
            description: "택배 배송 차량 내부의 적재함을 모듈화하여 목적지별 화물을 자동으로 이송하고 순차 배출하는 차세대 스마트 모빌리티 물류 특허입니다.\n화물 적재함의 슬라이딩 이송 메커니즘을 통해 상하차 작업자의 동선을 획기적으로 줄이며, 라스트마일 물류 현장의 작업 효율성을 극대화합니다.",
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
            description: "비전 AI 카메라 및 압력 센서를 결합하여 사용자의 작업 자세와 체형 밸런스를 실시간 추적하고 인체공학적 피드백을 제공하는 스마트 헬스케어 특허 기술입니다.\n물류센터 현장 근무자의 반복 작업 및 무거운 화물 리프팅 시 발생하는 척추·관절 하중을 예방합니다.",
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
            description: "운송 트럭 및 컨테이너 내부 깊숙이 진입하여 화물의 크기, 무게, 바코드를 고속 인식하고 자동 분류하는 텔레스코픽 연동 이송 특허 시스템입니다.\n화물 유입 병목 구간을 해소하고 간선 하차 라인에서 끊김 없는 연속 분류 흐름을 완성합니다.",
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
            badge: "핵심원천특허",
            fileUrl: "docs/1. [특허증]10-2956028.pdf",
            description: "(주)에이티에이기술의 대표 독자 원천 기술로, 4개의 팝업 휠 모듈이 독립 구동 및 360도 정밀 서보 각도 제어를 수행하여 화물의 충격을 최소화하면서 직진, 좌·우 90도 분기, 180도 회송을 즉각 수행하는 최첨단 고속 분류 분기 시스템입니다.",
            features: [
                "독립 제어 4분할 팝업 휠 기반 0.3초 초고속 분기 응답 속도",
                "부드러운 화물 방향 전환으로 박스 및 파우치 파손율 0.00% 달성",
                "기존 물류 라인에 표준 모듈 방식으로 즉시 인라인 삽입 가능"
            ],
            sortOrder: 4
        },

        // ===================== [2. 품질·환경 인증 현황: 5건] =====================
        {
            id: "cert_iso_9001",
            category: "cert",
            title: "ISO 9001:2015 품질경영시스템 인증",
            subtitle: "Quality Management System Certification",
            regNumber: "인증번호: 22-A-8167-QM",
            date: "2022.09.20 인증",
            organization: "한국국제규격인증원 (KSA)",
            badge: "품질경영",
            fileUrl: "docs/ISO 9001 2015.pdf",
            description: "물류 자동화 설비의 설계, 개발, 제조 및 시운전 설치 전 과정에 걸쳐 국제 표준 품질경영 요구사항을 완벽히 충족함을 공식 인증받았습니다.",
            features: [
                "설계부터 납품까지 전 공정 엄격한 품질 보증 체계",
                "하자 발생률 0%를 목표로 하는 전수 검사 시스템 운영",
                "고객 만족도 피드백 기반 지속적 품질 개선 프로세스"
            ],
            sortOrder: 1
        },
        {
            id: "cert_iso_14001",
            category: "cert",
            title: "ISO 14001:2015 환경경영시스템 인증",
            subtitle: "Environmental Management System Certification",
            regNumber: "인증번호: 22-A-8167-EM",
            date: "2022.09.20 인증",
            organization: "한국국제규격인증원 (KSA)",
            badge: "환경경영",
            fileUrl: "docs/ISO 14001 2015.pdf",
            description: "친환경 저전력 모터 채택, 소음 저감 설계, 재활용 가능한 부품 표준화를 통해 친환경 지속가능 물류 시스템을 구축하고 있습니다.",
            features: [
                "저소음·고효율 IE3/IE4 모터 적용으로 에너지 절감",
                "친환경 생산 공정 및 유해물질 배출 제로화 달성",
                "글로벌 ESG 경영 기준에 부합하는 친환경 설비 라인업"
            ],
            sortOrder: 2
        },
        {
            id: "cert_venture",
            category: "cert",
            title: "벤처기업 확인서 (혁신성장유형)",
            subtitle: "Venture Business Confirmation",
            regNumber: "제 20230915010042 호",
            date: "2023.09.15 확인",
            organization: "중소벤처기업진흥공단 (KOSME)",
            badge: "혁신성장",
            fileUrl: "docs/벤처기업 확인서.pdf",
            description: "스마트 물류 자동화 설비 분야에서의 독보적인 기술력과 지속적인 성장 잠재력을 공식 인정받은 혁신성장유형 벤처기업입니다.",
            features: [
                "기술보증기금 및 중소벤처기업부 공인 우수 기술력",
                "물류 자동화 하드웨어 원천기술 연구개발 역량",
                "스마트 팩토리 및 물류센터 공급망 확장성 검증"
            ],
            sortOrder: 3
        },
        {
            id: "cert_rnd_lab",
            category: "cert",
            title: "기업부설연구소 인정서",
            subtitle: "Corporate R&D Center Certification",
            regNumber: "제 2022114258 호",
            date: "2022.11.10 인정",
            organization: "한국산업기술진흥협회 (KOITA)",
            badge: "기업부설연구소",
            fileUrl: "docs/연구개발전담부서 인정서.pdf",
            description: "스마트 물류 제어 알고리즘 및 차세대 메카트로닉스 설비 개발을 전담하는 ATA 기술연구소를 설립 및 공식 운영하고 있습니다.",
            features: [
                "석·박사급 물류 제어 및 기계설계 전문 연구인력 상주",
                "특허 기술의 상용화 및 양산화 기술 집중 연구",
                "산학연 공동 R&D 프로젝트 및 국책 연구과제 수행"
            ],
            sortOrder: 4
        },
        {
            id: "cert_mainbiz",
            category: "cert",
            title: "경영혁신형 중소기업 (Main-Biz) 확인서",
            subtitle: "Main-Biz (Management Innovation) Confirmation",
            regNumber: "제 240101-01824 호",
            date: "2024.01.15 확인",
            organization: "중소벤처기업부 (MSS)",
            badge: "경영혁신",
            fileUrl: "docs/경영혁신형 중소기업(메인비즈) 확인서.pdf",
            description: "투명하고 체계적인 경영 관리 시스템 및 신성장 동력을 확보한 경영혁신형 강소기업으로 공인받았습니다.",
            features: [
                "체계적인 ERP/WCS 프로젝트 공정 관리 시스템",
                "재무 건전성 및 안정적 글로벌 공급망 확보",
                "고객 중심의 철저한 사후 유지보수 관리 체계 구축"
            ],
            sortOrder: 5
        },

        // ===================== [3. 대외 수상 및 수료 내역: 3건] =====================
        {
            id: "award_1",
            category: "award",
            title: "2023 대한민국 혁신물류기술대상",
            subtitle: "Korea Logistics Technology Innovation Award",
            regNumber: "물류기술 혁신부문 대상",
            date: "2023.11.24 수상",
            organization: "한국물류산업협회 / 물류신문사",
            badge: "정부·기관 수상",
            fileUrl: "docs/화물차량 탑재형_국토교통과학기술진흥원_KAIA.png",
            description: "독자 개발한 '4분할 방향 전환 장치' 및 '차량 탑재형 화물 분류 시스템'으로 국내 물류 인프라 효율 향상에 크게 기여한 공로를 인정받아 대상을 수상하였습니다.",
            features: [
                "국토교통과학기술진흥원(KAIA) 우수 기술 등재",
                "라스트마일 배송 혁신 및 터미널 분류 속도 혁신",
                "물류업계 심사위원단 만장일치 기술성 최고점 획득"
            ],
            sortOrder: 1
        },
        {
            id: "award_2",
            category: "award",
            title: "기술역량 우수기업 인증 (T3 등급)",
            subtitle: "Tech-Credit Bureau T3 Excellent Enterprise",
            regNumber: "기술등급: T3 (상위 1% 우수기술기업)",
            date: "2024.04.10 인증",
            organization: "NICE평가정보 / 기술신용평가 (TCB)",
            badge: "우수기술기업",
            fileUrl: "docs/기술역량 우수기업 인증서.pdf",
            description: "NICE평가정보의 엄격한 기술신용평가 결과, 코스닥 기술특례상장 수준에 준하는 최상위 기술등급인 T3를 획득하여 미래 성장성을 입증받았습니다.",
            features: [
                "중소기업 최상위권의 기술 경쟁력 공식 공인",
                "자체 보유 물류 원천 특허의 높은 시장성 및 권리 강도",
                "국내외 대기업 물류센터 납품 적격성 최우수 평가"
            ],
            sortOrder: 2
        },
        {
            id: "award_3",
            category: "award",
            title: "국가 R&D 실무 및 스마트물류 기술교육 수료",
            subtitle: "National R&D Project & Smart Logistics Training",
            regNumber: "수료증 제 2024-RND-088 호",
            date: "2024.07.18 수료",
            organization: "한국물류시스템연구원",
            badge: "전문교육 수료",
            fileUrl: "docs/RnD 실무교육 수료증.pdf",
            description: "국가 대형 국책 R&D 프로젝트 관리와 첨단 스마트물류 시스템 통합 엔지니어링 실무 교육을 최고 성적으로 이수하였습니다.",
            features: [
                "스마트 물류 표준 프로토콜 및 통신 인터페이스 마스터",
                "대형 프로젝트 위험 관리 및 품질 보증 실무 역량 강화",
                "국가 연구개발 사업 수행 표준 프로세스 정착"
            ],
            sortOrder: 3
        }
    ];

    /**
     * 로컬 저장소에서 특허/인증 데이터를 안전하게 불러옵니다.
     */
    function loadData() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_PATENT);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('[PatentAdmin] LocalStorage load error:', e);
        }
        // 기본값 자동 저장 및 반환
        saveData(INITIAL_PATENT_DATA);
        return INITIAL_PATENT_DATA.slice();
    }

    /**
     * 데이터를 로컬 저장소에 저장하고 프론트엔드에 즉시 동기화합니다.
     */
    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY_PATENT, JSON.stringify(data));
        } catch (e) {
            console.error('[PatentAdmin] Save error:', e);
            alert('저장 용량이 부족하거나 브라우저 저장소 접근에 실패했습니다.');
        }
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
    // 3. 관리자 센터(Admin Hub) 목록 렌더링 - 콤팩트 사진(100px) + 글씨란 대폭 확장
    // ==========================================================================
    var currentFilter = 'all';

    function renderManagerList(container, filter) {
        if (!container) container = document.getElementById('admin-hub-patent-list');
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

            html.push('<div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all">');

            // 상단 메타 바
            html.push('  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">');
            html.push('    <div class="flex items-center gap-2 flex-wrap">');
            html.push('      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ' + catBadgeClass + '">' + catLabel + '</span>');
            html.push('      <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-xs">' + (item.regNumber || '등록번호 없음') + '</span>');
            html.push('      <span class="text-xs text-slate-500 font-medium"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (item.date || '') + '</span>');
            html.push('      <span class="text-xs text-slate-500 font-medium"><i class="fa-solid fa-building-columns mr-1 text-slate-400"></i>' + (item.organization || '') + '</span>');
            html.push('    </div>');
            html.push('    <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">');
            html.push('      <button type="button" onclick="window.PatentAdmin.openEditModal(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-pen-to-square mr-1"></i>수정</button>');
            html.push('      <button type="button" onclick="window.PatentAdmin.deleteItem(\'' + item.id + '\')" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-xs transition-colors cursor-pointer"><i class="fa-solid fa-trash-can mr-1"></i>삭제</button>');
            html.push('    </div>');
            html.push('  </div>');

            // 본문 가로 2열: [좌측 콤팩트 썸네일 (90px)] + [우측 대폭 넓어진 글씨 공간]
            html.push('  <div class="flex flex-col sm:flex-row gap-4 pt-3 items-start">');

            // 콤팩트 썸네일
            html.push('    <div class="w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/thumb shadow-sm">');
            if (isPdf) {
                html.push('      <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 text-slate-600 p-2 text-center">');
                html.push('        <i class="fa-solid fa-file-pdf text-red-500 text-2xl mb-1"></i>');
                html.push('        <span class="text-[10px] font-bold line-clamp-1">PDF 문서</span>');
                html.push('      </div>');
            } else if (item.fileUrl) {
                html.push('      <img src="' + item.fileUrl + '" class="w-full h-full object-cover" onerror="this.src=\'assets/images/no-image.svg\';">');
            } else {
                html.push('      <div class="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Doc</div>');
            }
            if (item.fileUrl) {
                html.push('      <a href="' + item.fileUrl + '" target="_blank" class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 text-center p-1">');
                html.push('        <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i><span>원본 열기</span>');
                html.push('      </a>');
            }
            html.push('    </div>');

            // 우측 시원한 글씨 공간 (전체 폭 80% 이상)
            html.push('    <div class="flex-1 min-w-0 space-y-2">');
            html.push('      <h4 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">' + item.title + '</h4>');
            if (item.subtitle) {
                html.push('      <p class="text-xs font-semibold text-slate-400">' + item.subtitle + '</p>');
            }
            html.push('      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">' + (item.description || '') + '</p>');

            // 특징 리스트
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
    // 4. 모달 팝업 입력창 (상세설명 6줄, 특징 4줄 대폭 확장)
    // ==========================================================================
    function ensureModal() {
        var existing = document.getElementById('patent-editor-modal');
        if (existing) return existing;

        var modalHtml = [
            '<div id="patent-editor-modal" class="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-2 sm:p-4 md:p-6">',
            '  <div class="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">',
            
            // 헤더
            '    <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">',
            '      <div class="flex items-center gap-3">',
            '        <span class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-base font-bold shadow-inner">',
            '          <i class="fa-solid fa-stamp"></i>',
            '        </span>',
            '        <div>',
            '          <h3 id="patent-modal-title" class="text-base sm:text-lg font-bold text-white tracking-wide">특허 및 인증 항목 수정 및 작성</h3>',
            '          <p class="text-xs text-slate-400">광활한 글자 입력창에서 특허 개요와 핵심 R&D 메커니즘을 여유롭게 편집하세요.</p>',
            '        </div>',
            '      </div>',
            '      <button type="button" onclick="window.PatentAdmin.closeModal()" class="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 text-xl transition-colors cursor-pointer"><i class="fa-solid fa-xmark"></i></button>',
            '    </div>',

            // 본문 폼: [좌측 65% 초대형 글자칸] + [우측 35% 콤팩트 문서/설정 패널]
            '    <form id="patent-editor-form" onsubmit="window.PatentAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">',
            '      <input type="hidden" id="patent-form-id" value="">',
            
            '      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">',
            
            // ========================================================
            // [좌측 65% 영역 (lg:col-span-8): 초대형 글자 입력 전용 공간]
            // ========================================================
            '        <div class="lg:col-span-8 space-y-4">',
            
            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">',
            '              <i class="fa-solid fa-heading text-blue-600"></i> 명칭 / 제목 <span class="text-red-500">*</span>',
            '            </label>',
            '            <input type="text" id="patent-form-title" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-bold focus:ring-2 focus:ring-blue-500 text-slate-900 shadow-sm" placeholder="예: 컨베이어 물류 분류용 4분할 방향 전환 장치" required>',
            '          </div>',

            '          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">',
            '            <div>',
            '              <label class="block text-xs font-bold text-slate-700 mb-1">등록 / 출원 / 인증 번호</label>',
            '              <input type="text" id="patent-form-regnumber" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 text-slate-800" placeholder="예: 제 10-2956028 호">',
            '            </div>',
            '            <div>',
            '              <label class="block text-xs font-bold text-slate-700 mb-1">등록일 / 발급일자</label>',
            '              <input type="text" id="patent-form-date" class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 text-slate-800" placeholder="예: 2026.04.02 등록">',
            '            </div>',
            '          </div>',

            '          <div>',
            '            <div class="flex items-center justify-between mb-1.5">',
            '              <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">',
            '                <i class="fa-solid fa-align-left text-blue-600"></i> 상세 설명 (글자칸 대폭 확장: 10줄)',
            '              </label>',
            '              <span class="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">줄바꿈(Enter) 지원</span>',
            '            </div>',
            '            <textarea id="patent-form-desc" rows="10" class="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm sm:text-base font-normal focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-800 custom-scrollbar shadow-inner whitespace-pre-line" placeholder="기술의 개요, 원천 메커니즘, 과제 해결 원리, 인증 효력 등을 길고 자유롭게 서술하세요. 줄바꿈을 지원합니다."></textarea>',
            '          </div>',

            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">',
            '              <i class="fa-solid fa-list-check text-blue-600"></i> 핵심 메커니즘 & R&D 특장점 (한 줄에 하나씩 입력)',
            '            </label>',
            '            <textarea id="patent-form-features" rows="4" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-normal focus:ring-2 focus:ring-blue-500 leading-relaxed custom-scrollbar text-slate-700" placeholder="한 줄에 하나씩 주요 기술 특징을 입력하세요."></textarea>',
            '          </div>',

            '        </div>',

            // ========================================================
            // [우측 35% 영역 (lg:col-span-4): 콤팩트 문서 & 속성 패널]
            // ========================================================
            '        <div class="lg:col-span-4 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">',
            
            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1">구분 / 카테고리 <span class="text-red-500">*</span></label>',
            '            <select id="patent-form-category" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" required>',
            '              <option value="patent">특허 현황 (Patent)</option>',
            '              <option value="cert">인증 현황 (Quality & Env Cert)</option>',
            '              <option value="award">수상 및 수료 내역 (Awards)</option>',
            '            </select>',
            '          </div>',

            '          <div class="grid grid-cols-2 gap-3">',
            '            <div>',
            '              <label class="block text-xs font-bold text-slate-700 mb-1">정렬 순서</label>',
            '              <input type="number" id="patent-form-sort" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" value="1" min="1" max="99">',
            '            </div>',
            '            <div>',
            '              <label class="block text-xs font-bold text-slate-700 mb-1">표시 배지</label>',
            '              <input type="text" id="patent-form-badge" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" placeholder="예: 핵심원천특허">',
            '            </div>',
            '          </div>',

            '          <div>',
            '            <label class="block text-xs font-bold text-slate-700 mb-1">발행 / 등록 기관</label>',
            '            <input type="text" id="patent-form-org" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white" placeholder="예: 대한민국 특허청 (KIPO)">',
            '          </div>',

            // 콤팩트 문서/특허증 업로드 및 미니 미리보기
            '          <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2.5">',
            '            <div class="text-[11px] font-bold text-slate-700 flex items-center justify-between">',
            '              <span class="flex items-center gap-1.5"><i class="fa-solid fa-file-pdf text-red-500"></i> 특허증/인증서 문서</span>',
            '              <span class="text-[10px] text-slate-400">PDF/이미지</span>',
            '            </div>',
            '            <div class="w-full h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex flex-col items-center justify-center shadow-inner text-center p-2">',
            '              <i class="fa-solid fa-file-circle-check text-slate-300 text-2xl mb-1"></i>',
            '              <span class="text-[11px] font-bold text-slate-600 line-clamp-1" id="patent-modal-file-status">문서 경로 입력 또는 파일 선택</span>',
            '            </div>',
            '            <div>',
            '              <input type="text" id="patent-form-fileurl" class="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-mono focus:ring-2 focus:ring-blue-500 mb-2" placeholder="파일 경로 또는 Base64">',
            '              <label class="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold border border-slate-300 hover:border-blue-400 transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm">',
            '                <i class="fa-solid fa-cloud-arrow-up text-blue-600"></i> 내 PC 파일 변경',
            '                <input type="file" class="hidden" accept=".pdf,image/*" onchange="window.PatentAdmin.handleFileSelect(event)">',
            '              </label>',
            '            </div>',
            '          </div>',

            '        </div>',

            '      </div>',

            // 하단 버튼 바
            '      <div class="pt-5 mt-6 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">',
            '        <button type="button" onclick="window.PatentAdmin.closeModal()" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer">취소</button>',
            '        <button type="submit" class="px-7 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"><i class="fa-solid fa-floppy-disk"></i> 저장 완료</button>',
            '      </div>',

            '    </form>',
            '  </div>',
            '</div>'
        ].join('\n');

        var div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div.firstElementChild);
        return document.getElementById('patent-editor-modal');
    }

    function openCreateModal(defaultCategory) {
        var modal = ensureModal();
        document.getElementById('patent-modal-title').textContent = '특허 및 인증 항목 신규 등록';
        document.getElementById('patent-form-id').value = '';
        document.getElementById('patent-form-category').value = defaultCategory || (currentFilter === 'all' ? 'patent' : currentFilter);
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

        if (file.size > 10 * 1024 * 1024) {
            alert('파일 크기가 10MB를 초과하여 업로드할 수 없습니다.');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (evt) {
            var input = document.getElementById('patent-form-fileurl');
            if (input) input.value = evt.target.result;
        };
        reader.readAsDataURL(file);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        var id = document.getElementById('patent-form-id').value;
        var category = document.getElementById('patent-form-category').value;
        var sortOrder = parseInt(document.getElementById('patent-form-sort').value, 10) || 1;
        var title = document.getElementById('patent-form-title').value.trim();
        var regNumber = document.getElementById('patent-form-regnumber').value.trim();
        var date = document.getElementById('patent-form-date').value.trim();
        var organization = document.getElementById('patent-form-org').value.trim();
        var badge = document.getElementById('patent-form-badge').value.trim();
        var description = document.getElementById('patent-form-desc').value.trim();
        var featuresRaw = document.getElementById('patent-form-features').value.trim();
        var fileUrl = document.getElementById('patent-form-fileurl').value.trim();

        if (!title) {
            alert('명칭/제목을 입력해주세요.');
            return;
        }

        var features = featuresRaw ? featuresRaw.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : [];

        var data = loadData();
        if (id) {
            // 수정
            var item = data.find(function (it) { return it.id === id; });
            if (item) {
                item.category = category;
                item.sortOrder = sortOrder;
                item.title = title;
                item.regNumber = regNumber;
                item.date = date;
                item.organization = organization;
                item.badge = badge;
                item.description = description;
                item.features = features;
                if (fileUrl) item.fileUrl = fileUrl;
            }
        } else {
            // 신규 등록
            var newId = 'pat_' + Date.now();
            data.push({
                id: newId,
                category: category,
                sortOrder: sortOrder,
                title: title,
                subtitle: '',
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
    // 5. 프론트엔드 실시간 동적 렌더링 - 2026 황금비율 (글씨 70% : 콤팩트 사진 30%)
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
     * [특허 현황] 가로 분할 황금비율 카드 (글씨 70% : 콤팩트 A4 썸네일 30%)
     */
    function renderPatentSection(items) {
        var container = document.getElementById('patent-cards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it, idx) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;
            var numStr = it.sortOrder ? (it.sortOrder < 10 ? '0' + it.sortOrder : it.sortOrder) : (idx + 1 < 10 ? '0' + (idx + 1) : idx + 1);

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between group relative overflow-hidden fade-in appear">');
            
            // ================= [좌측 영역: 시원한 글씨 중심란 72%] =================
            html.push('  <div class="flex-1 min-w-0 space-y-4">');
            
            // 1. 상단 배지 및 메타 정보 (한 줄로 시원하게 배치)
            html.push('    <div class="flex items-center gap-2.5 flex-wrap">');
            html.push('      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">');
            html.push('        <i class="fa-solid fa-certificate text-blue-600"></i> ' + (it.badge || '등록특허') + ' ' + numStr);
            html.push('      </span>');
            html.push('      <span class="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('      <span class="text-xs text-slate-500 font-medium"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('      <span class="text-xs text-slate-500 font-medium"><i class="fa-solid fa-building-columns mr-1 text-slate-400"></i>' + (it.organization || '대한민국 특허청') + '</span>');
            html.push('    </div>');

            // 2. 특허 명칭 및 영문 부제 (절대 줄바꿈 쪼개짐 없이 크고 시원하게!)
            html.push('    <div>');
            html.push('      <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-snug whitespace-normal break-keep">' + it.title + '</h3>');
            if (it.subtitle) {
                html.push('      <p class="text-xs sm:text-sm font-semibold text-slate-400 mt-1 tracking-wide">' + it.subtitle + '</p>');
            }
            html.push('    </div>');

            // 3. 상세 설명란 (넉넉하고 편안한 글씨 공간)
            html.push('    <p class="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line break-keep">' + (it.description || '') + '</p>');

            // 4. 핵심 메커니즘 & R&D 경쟁력 박스
            if (it.features && it.features.length > 0) {
                html.push('    <div class="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-2">');
                html.push('      <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><i class="fa-solid fa-microchip text-blue-600"></i> 핵심 메커니즘 & 원천 기술력</div>');
                it.features.forEach(function (f) {
                    html.push('      <div class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">');
                    html.push('        <i class="fa-solid fa-circle-check text-blue-600 text-xs mt-1 shrink-0"></i>');
                    html.push('        <span class="break-keep">' + f + '</span>');
                    html.push('      </div>');
                });
                html.push('    </div>');
            }

            // 하단 메타 바
            html.push('    <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">');
            html.push('      <span>주식회사 에이티에이기술 독자 원천 지식재산권</span>');
            html.push('      <span class="font-bold text-blue-600">ATA TECH R&D</span>');
            html.push('    </div>');

            html.push('  </div>');

            // ================= [우측 영역: A4 세로 비율 핏 썸네일 (검은 여백 제로) 28%] =================
            html.push('  <div class="w-full md:w-56 shrink-0 flex flex-col items-center bg-slate-50 rounded-2xl p-3.5 border border-slate-200/90 self-stretch justify-between">');
            html.push('    <div class="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2 px-1">');
            html.push('      <span>공식 특허증 사본</span>');
            html.push('      <span class="text-blue-600"><i class="fa-solid fa-stamp mr-1"></i>KIPO 공인</span>');
            html.push('    </div>');
            
            // A4 완벽 비율 프레임 (가로 180px, 세로 250px - 양옆 검은 여백 원천 차단!)
            html.push('    <div class="w-44 h-60 rounded-xl overflow-hidden border border-slate-200 bg-white relative group/doc shadow-sm flex items-center justify-center mb-3">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#view=FitH&toolbar=0&navpanes=0&scrollbar=0" class="w-full h-full border-0 pointer-events-none bg-white" title="' + it.title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/doc:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
            } else {
                html.push('      <div class="text-slate-400 text-xs">특허증 준비 중</div>');
            }
            if (it.fileUrl) {
                html.push('      <a href="' + it.fileUrl + '" target="_blank" class="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/doc:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px] cursor-pointer">');
                html.push('        <i class="fa-solid fa-arrow-up-right-from-square text-base"></i><span>새 창에서 원본 열기</span>');
                html.push('      </a>');
            }
            html.push('    </div>');

            // 원본 PDF 열기 버튼
            if (it.fileUrl) {
                html.push('    <a href="' + it.fileUrl + '" target="_blank" class="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto">');
                html.push('      <i class="fa-solid fa-file-pdf"></i> 특허증 원본 PDF 열기');
                html.push('    </a>');
            }
            html.push('  </div>');

            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    function renderCertSection(items) {
        var container = document.getElementById('cert-quality-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group fade-in appear">');

            // 상단 글씨란 (충분하고 시원한 텍스트 공간)
            html.push('  <div>');
            html.push('    <div class="flex items-center justify-between gap-2 mb-3">');
            html.push('      <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm">' + (it.badge || '품질인증') + '</span>');
            html.push('      <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('    </div>');
            html.push('    <h4 class="text-lg sm:text-xl font-black text-slate-900 mb-2 leading-snug group-hover:text-emerald-600 transition-colors">' + it.title + '</h4>');
            if (it.subtitle) {
                html.push('    <p class="text-xs font-semibold text-emerald-700 mb-3">' + it.subtitle + '</p>');
            }
            html.push('    <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line">' + (it.description || '') + '</p>');

            if (it.features && it.features.length > 0) {
                html.push('    <div class="space-y-1.5 mb-5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">');
                it.features.forEach(function (f) {
                    html.push('      <div class="flex items-center gap-2 text-xs text-slate-700"><i class="fa-solid fa-check text-emerald-600 text-[10px]"></i><span>' + f + '</span></div>');
                });
                html.push('    </div>');
            }
            html.push('  </div>');

            // 하단 콤팩트 썸네일 (220px 높이로 축소)
            html.push('  <div class="pt-3 border-t border-slate-100 space-y-2 mt-auto">');
            html.push('    <div class="w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group/cert shadow-inner flex items-center justify-center">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit" class="w-full h-full border-0 pointer-events-none" title="' + it.title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/cert:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
            }
            if (it.fileUrl) {
                html.push('      <a href="' + it.fileUrl + '" target="_blank" class="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">');
                html.push('        <i class="fa-solid fa-arrow-up-right-from-square"></i> 원본 인증서 열기');
                html.push('      </a>');
            }
            html.push('    </div>');
            if (it.fileUrl) {
                html.push('    <a href="' + it.fileUrl + '" target="_blank" class="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-emerald-200">');
                html.push('      <i class="fa-solid fa-file-pdf"></i> 원본 열기');
                html.push('    </a>');
            }
            html.push('  </div>');

            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [수상 내역] 콤팩트 상장 프레임 + 공적 설명란 중심 렌더링
     */
    function renderAwardSection(items) {
        var container = document.getElementById('cert-awards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col justify-between group fade-in appear">');

            // 상단 글씨란 (공적 및 상세 설명)
            html.push('  <div>');
            html.push('    <div class="flex items-center justify-between gap-2 mb-3">');
            html.push('      <span class="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm">' + (it.badge || '대외수상') + '</span>');
            html.push('      <span class="text-xs font-medium text-slate-500"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('    </div>');
            html.push('    <h4 class="text-lg sm:text-xl font-black text-slate-900 mb-2 leading-snug group-hover:text-amber-600 transition-colors">' + it.title + '</h4>');
            html.push('    <p class="text-xs font-semibold text-slate-500 mb-3"><i class="fa-solid fa-building-columns text-amber-500 mr-1.5"></i>' + (it.organization || '') + '</p>');
            html.push('    <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line">' + (it.description || '') + '</p>');

            if (it.features && it.features.length > 0) {
                html.push('    <div class="space-y-1.5 mb-5 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50">');
                it.features.forEach(function (f) {
                    html.push('      <div class="flex items-center gap-2 text-xs text-slate-700"><i class="fa-solid fa-award text-amber-600 text-[10px]"></i><span>' + f + '</span></div>');
                });
                html.push('    </div>');
            }
            html.push('  </div>');

            // 하단 콤팩트 상장 프레임 (220px 높이로 축소)
            html.push('  <div class="pt-3 border-t border-slate-100 space-y-2 mt-auto">');
            html.push('    <div class="w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group/award shadow-inner flex items-center justify-center">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=Fit" class="w-full h-full border-0 pointer-events-none" title="' + it.title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + it.title + '" class="w-full h-full object-cover group-hover/award:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
            }
            if (it.fileUrl) {
                html.push('      <a href="' + it.fileUrl + '" target="_blank" class="absolute inset-0 bg-slate-900/50 opacity-0 group-hover/award:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[2px]">');
                html.push('        <i class="fa-solid fa-arrow-up-right-from-square"></i> 원본 상장 열기');
                html.push('      </a>');
            }
            html.push('    </div>');
            if (it.fileUrl) {
                html.push('    <a href="' + it.fileUrl + '" target="_blank" class="w-full py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-amber-200">');
                html.push('      <i class="fa-solid fa-award"></i> 상장 원본 열기');
                html.push('    </a>');
            }
            html.push('  </div>');

            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    // 전역 공개 네임스페이스
    window.PatentAdmin = {
        loadData: loadData,
        saveData: saveData,
        resetToDefault: resetToDefault,
        renderManagerList: renderManagerList,
        renderFrontend: renderFrontend,
        openCreateModal: openCreateModal,
        openEditModal: openEditModal,
        closeModal: closeModal,
        handleFileSelect: handleFileSelect,
        handleFormSubmit: handleFormSubmit,
        deleteItem: deleteItem
    };

    // 초기 실행
    document.addEventListener('DOMContentLoaded', function () {
        renderFrontend();
    });

})();
