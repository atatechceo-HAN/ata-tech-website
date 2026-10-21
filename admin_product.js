/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 스마트 물류 핵심 장비 '제품 라인업' 관리자 모드 CRUD 엔진
 * 파일명: admin_product.js
 * 
 * [주요 기능]
 * 1. 제품 라인업 카드 동적 렌더링 (레퍼런스와 동일한 프리미엄 3열 반응형 그리드)
 * 2. 관리자 인증(AdminAuth: admin / ata2026!)과 완벽 연동 (로그인 시 관리자 바 및 각 카드 수정/삭제 활성화)
 * 3. 새로운 제품 등록(Create), 기존 제품 수정(Update), 삭제(Delete)
 * 4. 카테고리 필터 탭 (전체, 초고속 분류기, 이송&상하차, 스마트 보관&로봇, 통합 관제&제어)
 * 5. 브라우저 로컬 저장소(LocalStorage)를 통한 데이터 영구 보존
 * 6. 웹-로컬 완벽 동기화 유틸리티 (JSON 데이터 백업 다운로드, JSON 복원 업로드, 로컬 JS 소스 복사)
 * 7. 언제든 초기 공식 11대 핵심 제품군으로 되돌릴 수 있는 '기본값 안전 복원' 기능
 * 8. 고화질 이미지 확대 팝업(openImageModal) 및 모바일 완벽 터치 최적화
 * ==============================================================================
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. 상수 정의
    // ==========================================================================
    var STORAGE_KEY_PRODUCTS = "ata_product_lineup_db"; // 로컬스토리지 저장 키
    var currentFilterCategory = "all"; // 현재 활성화된 카테고리 필터 ('all', 'sorter', 'conveyor', 'robot', 'control')

    // ==========================================================================
    // 2. 초기 기본 제품 라인업 데이터 (공식 11대 핵심 솔루션 제품군)
    // ==========================================================================
    var INITIAL_PRODUCTS_DATA = [
        {
            id: "prod_1",
            category: "conveyor",
            title: "택배차량 배송 자동화 시스템",
            imageUrl: "H00_솔루션_1_택배차량배송자동화.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800",
            subBadge: "차세대 배송 혁신 (NEW)",
            tags: ["라스트마일", "차량 내 적재 자동화", "특허 등록"],
            description: "택배 차량 내부 공간 활용을 극대화하고 작업자의 피로도를 대폭 줄이는 차세대 배송·적재·분류 하이브리드 자동화 솔루션입니다.",
            field: "라스트마일 모빌리티",
            sortOrder: 1
        },
        {
            id: "prod_2",
            category: "sorter",
            title: "NBS [Narrow Belt Sorter]",
            imageUrl: "H00_솔루션_2_NBS.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800",
            subBadge: "고효율 직선형 소터",
            tags: ["좁은 공간 최적화", "소형 화물 고속 분류", "모듈형 설계"],
            description: "소형 화물 및 파우치류를 빠르고 정확하게 분류할 수 있도록 설계된 좁은 설치 면적의 고효율 직선형 특화 소터입니다.",
            field: "고속 소형 화물 분류",
            sortOrder: 2
        },
        {
            id: "prod_3",
            category: "sorter",
            title: "CBS [Cross Belt Sorter]",
            imageUrl: "H00_솔루션_3_CBS.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800",
            subBadge: "루프형 대용량 분류",
            tags: ["양방향 크로스 벨트", "초고속 정밀 분류", "시간당 2만개 처리"],
            description: "양방향 크로스 벨트 메커니즘을 적용하여 다양한 규격의 중대형 박스와 파우치를 초고속으로 정밀 분류하는 대표 소터입니다.",
            field: "메가 허브 대용량 분류",
            sortOrder: 3
        },
        {
            id: "prod_4",
            category: "sorter",
            title: "NC CBS [NC Cross Belt Sorter]",
            imageUrl: "H00_솔루션_4_NC_CBS.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=800",
            subBadge: "정밀 수치제어 소터",
            tags: ["비접촉 리니어 모터", "저소음·고내구성", "흔들림 없는 분류"],
            description: "비접촉 리니어 구동 및 첨단 수치제어 기술로 흔들림 없이 초고속 대량 화물을 분류하는 차세대 프리미엄 크로스 벨트 소터입니다.",
            field: "고정밀 클린 물류",
            sortOrder: 4
        },
        {
            id: "prod_5",
            category: "sorter",
            title: "Wheel Sorter",
            imageUrl: "H00_솔루션_5_WheelSorter.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&q=80&w=800",
            subBadge: "다방향 고속 분기",
            tags: ["서보 모터 제어", "다각도 분기 휠", "박스·파우치 겸용"],
            description: "회전 휠의 각도 제어를 통해 다양한 크기의 박스 및 파우치 화물을 유연하고 안전하게 지정 라인으로 분기·분류하는 시스템입니다.",
            field: "다방향 분기 자동화",
            sortOrder: 5
        },
        {
            id: "prod_6",
            category: "sorter",
            title: "Tilt Tray Sorter",
            imageUrl: "H00_솔루션_6_TiltTraySorter.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800",
            subBadge: "파손 방지 경사 소터",
            tags: ["트레이 경사 슬라이딩", "비정형 화물 대응", "정숙 구동"],
            description: "트레이를 부드럽게 기울여 화물 낙하 시 충격과 파손 위험을 최소화한 신선식품, 잡화, 서적 등 다목적 경사 트레이 분류기입니다.",
            field: "신선 유통 & 섬세 화물",
            sortOrder: 6
        },
        {
            id: "prod_7",
            category: "conveyor",
            title: "Conveyors & ADD-Ons",
            imageUrl: "H00_솔루션_7_Conveyors.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
            subBadge: "모듈형 이송 라인",
            tags: ["롤러 & 벨트", "방향전환 턴테이블", "맞춤 확장 모듈"],
            description: "물류센터의 복잡한 레이아웃에 완벽 대응하는 맞춤형 롤러·벨트 컨베이어 라인 및 병목 해소를 위한 부가 확장 장비군입니다.",
            field: "물류센터 기간 이송망",
            sortOrder: 7
        },
        {
            id: "prod_8",
            category: "conveyor",
            title: "Telescopic [신축형 컨베이어]",
            imageUrl: "H00_솔루션_8_Telescopic.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800",
            subBadge: "차량 상하차 자동화",
            tags: ["붐 다단 신축", "도크 상하차 피로도 70% 감소", "인체공학 조작"],
            description: "화물 트럭 및 컨테이너 내부 깊숙이 전동으로 신축 연장되어 상하차 작업 속도를 획기적으로 개선하는 텔레스코픽 컨베이어입니다.",
            field: "도크 하역 & 상하차 자동화",
            sortOrder: 8
        },
        {
            id: "prod_9",
            category: "robot",
            title: "Shuttle AS/RS [다단 셔틀 자동창고]",
            imageUrl: "H00_솔루션_9_ShuttleASRS.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
            subBadge: "초고밀도 자동 보관",
            tags: ["다단 랙 고밀도 보관", "초고속 셔틀 주행", "G2P 피킹 연동"],
            description: "선반 랙 사이를 고속 주행하며 박스를 입출고하는 고밀도 셔틀 자동보관 시스템으로 창고 공간 효율을 200% 이상 증대시킵니다.",
            field: "고밀도 스마트 보관",
            sortOrder: 9
        },
        {
            id: "prod_10",
            category: "robot",
            title: "AGV & AMR [자율이송 물류로봇]",
            imageUrl: "H00_솔루션_10_AGV_AMR.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            subBadge: "무인 지능형 물류 로봇",
            tags: ["SLAM 자율주행", "군집 제어 플릿", "유연한 라인 변경"],
            description: "고정 마그네틱 가이드 없이 자율주행(SLAM) 기술로 최적 경로를 찾아 화물을 운송하는 미래형 스마트 무인 물류 로봇 시스템입니다.",
            field: "물류센터 무인 자율 이송",
            sortOrder: 10
        },
        {
            id: "prod_11",
            category: "control",
            title: "WCS [창고 설비 통합 제어 시스템]",
            imageUrl: "H00_솔루션_11_WCS.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
            subBadge: "스마트 풀필먼트 두뇌",
            tags: ["실시간 트래픽 분산", "3D 디지털 트윈", "WMS/ERP 연동"],
            description: "소터, 컨베이어, 로봇 등 모든 물류 하드웨어 설비의 상태를 실시간 관제하고 화물 흐름을 최적으로 지휘하는 최상위 관제 소프트웨어입니다.",
            field: "스마트 물류 통합 관제",
            sortOrder: 11
        }
    ];

    // ==========================================================================
    // 3. 로컬 저장소 조회 및 저장 유틸리티 함수
    // ==========================================================================

    /**
     * 로컬스토리지에서 제품 목록을 가져옵니다.
     * 데이터가 없으면 초기 11대 공식 제품군을 저장 후 반환합니다.
     */
    function getProductsList() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("[ProductLineupAdmin] 로컬스토리지 파싱 오류, 초기 데이터로 복구합니다:", e);
        }
        saveProductsList(INITIAL_PRODUCTS_DATA);
        return INITIAL_PRODUCTS_DATA.slice();
    }

    /**
     * 제품 목록을 로컬스토리지에 저장합니다.
     */
    function saveProductsList(list) {
        try {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
        } catch (e) {
            console.error("[ProductLineupAdmin] 저장 실패:", e);
            alert("저장 공간이 부족하거나 브라우저 오류로 저장하지 못했습니다.");
        }
    }

    /**
     * 초기 공식 11대 제품군으로 안전하게 복원합니다.
     */
    function resetProductsData() {
        if (!confirm("제품 라인업 데이터를 최초 기본값(11개 공식 제품군)으로 복원하시겠습니까?\n새로 추가하거나 수정한 내용은 모두 초기화됩니다.")) {
            return;
        }
        saveProductsList(INITIAL_PRODUCTS_DATA);
        renderProductCards(currentFilterCategory);
        alert("제품 라인업이 최초 공식 데이터로 안전하게 복원되었습니다.");
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
    // 5. 웹-로컬 동기화 기능 (JSON 내보내기 / 가져오기 / 클립보드 소스 복사)
    // ==========================================================================

    /**
     * 웹에서 수정한 전체 제품 라인업 데이터를 JSON 파일로 다운로드합니다.
     */
    function exportProductsToJson() {
        var list = getProductsList();
        var jsonStr = JSON.stringify(list, null, 2);
        var blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        var dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

        var a = document.createElement("a");
        a.href = url;
        a.download = "ata_product_lineup_backup_" + dateStr + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 로컬에 보관된 JSON 백업 파일을 선택하여 웹사이트에 즉시 동기화(복원)합니다.
     */
    function importProductsFromJson() {
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json,application/json";
        fileInput.onchange = function (e) {
            var file = e.target.files[0];
            if (!file) return;

            var reader = new FileReader();
            reader.onload = function (event) {
                try {
                    var parsed = JSON.parse(event.target.result);
                    if (!Array.isArray(parsed)) {
                        alert("유효하지 않은 제품 라인업 JSON 백업 파일 형식입니다.");
                        return;
                    }
                    if (confirm("가져온 백업 파일(" + parsed.length + "개 제품)로 현재 제품 라인업을 교체하시겠습니까?")) {
                        saveProductsList(parsed);
                        renderProductCards(currentFilterCategory);
                        alert("성공적으로 제품 라인업이 동기화되었습니다!");
                    }
                } catch (err) {
                    alert("JSON 파일을 읽는 도중 오류가 발생했습니다: " + err.message);
                }
            };
            reader.readAsText(file, "utf-8");
        };
        fileInput.click();
    }

    /**
     * 로컬 자바스크립트 소스코드(INITIAL_PRODUCTS_DATA)로 원클릭 붙여넣기할 수 있도록 클립보드에 복사합니다.
     */
    function copyProductsJsCode() {
        var list = getProductsList();
        var code = "var INITIAL_PRODUCTS_DATA = " + JSON.stringify(list, null, 4) + ";";
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(function () {
                alert("현재 제품 라인업 데이터가 자바스크립트 소스 코드 형태로 클립보드에 복사되었습니다!\nadmin_product.js 파일의 INITIAL_PRODUCTS_DATA 부분에 바로 붙여넣으시면 로컬 소스코드와 완벽히 동기화됩니다.");
            }).catch(function () {
                fallbackCopyText(code);
            });
        } else {
            fallbackCopyText(code);
        }
    }

    function fallbackCopyText(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            alert("클립보드에 복사되었습니다! 로컬 소스코드에 붙여넣으세요.");
        } catch (e) {
            prompt("아래 텍스트를 복사하여 로컬 소스코드에 붙여넣으세요:", text);
        }
        document.body.removeChild(textArea);
    }

    // ==========================================================================
    // 6. 카테고리 탭 배지 숫자 및 스타일 동기화
    // ==========================================================================
    function updateCategoryTabBadges(list, activeCategory) {
        var countAll = list.length;
        var countSorter = list.filter(function (item) { return item.category === 'sorter'; }).length;
        var countConveyor = list.filter(function (item) { return item.category === 'conveyor'; }).length;
        var countRobot = list.filter(function (item) { return item.category === 'robot'; }).length;
        var countControl = list.filter(function (item) { return item.category === 'control'; }).length;

        var tabMap = {
            'all': { btn: document.getElementById('product-tab-all'), count: countAll },
            'sorter': { btn: document.getElementById('product-tab-sorter'), count: countSorter },
            'conveyor': { btn: document.getElementById('product-tab-conveyor'), count: countConveyor },
            'robot': { btn: document.getElementById('product-tab-robot'), count: countRobot },
            'control': { btn: document.getElementById('product-tab-control'), count: countControl }
        };

        Object.keys(tabMap).forEach(function (catKey) {
            var item = tabMap[catKey];
            var btn = item.btn;
            if (!btn) return;

            // 뱃지 숫자 텍스트 갱신
            var badge = btn.querySelector('.product-tab-badge');
            if (badge) {
                badge.textContent = item.count;
            }

            // 활성 탭 스타일 업데이트
            if (catKey === activeCategory) {
                btn.className = 'product-filter-tab min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white ring-2 ring-blue-400 cursor-pointer active:scale-95';
                if (badge) {
                    badge.className = 'product-tab-badge ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white';
                }
            } else {
                btn.className = 'product-filter-tab min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 cursor-pointer active:scale-95';
                if (badge) {
                    badge.className = 'product-tab-badge ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200';
                }
            }
        });
    }

    // ==========================================================================
    // 7. 상단 관리자 컨트롤 바 렌더링
    // ==========================================================================
    function renderProductAdminControlBar(isAdmin) {
        var barContainer = document.getElementById('product-admin-control-bar');
        if (!barContainer) return;

        if (isAdmin) {
            barContainer.innerHTML = [
                '<div class="flex flex-wrap items-center justify-between gap-3 p-4 mb-8 bg-blue-50/90 border border-blue-200 rounded-2xl shadow-sm">',
                '  <div class="flex items-center gap-3">',
                '    <div class="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-200 shadow-sm">',
                '      <i class="fa-solid fa-boxes-stacked"></i>',
                '    </div>',
                '    <div>',
                '      <div class="flex items-center gap-2">',
                '        <h5 class="text-sm font-extrabold text-slate-900">제품 라인업 관리자 모드</h5>',
                '        <span class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">인증됨</span>',
                '      </div>',
                '      <p class="text-xs text-slate-600 mt-0.5">신규 제품을 등록하거나, 각 카드의 수정/삭제 버튼을 눌러 내용을 편집할 수 있습니다. 수정한 내용은 브라우저에 영구 저장됩니다.</p>',
                '    </div>',
                '  </div>',
                '  <div class="flex flex-wrap items-center gap-2">',
                '    <button type="button" onclick="window.ProductLineupAdmin.openCreateModal()" class="min-h-[38px] px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer">',
                '      <i class="fa-solid fa-plus"></i> 새 제품 등록',
                '    </button>',
                '    <button type="button" onclick="window.ProductLineupAdmin.exportJson()" class="min-h-[38px] px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="현재 웹에서 수정한 전체 제품 데이터를 JSON 파일로 다운로드">',
                '      <i class="fa-solid fa-download text-blue-600"></i> 백업 다운로드',
                '    </button>',
                '    <button type="button" onclick="window.ProductLineupAdmin.importJson()" class="min-h-[38px] px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="백업된 JSON 파일을 불러와 동기화">',
                '      <i class="fa-solid fa-upload text-cyan-600"></i> 데이터 가져오기',
                '    </button>',
                '    <button type="button" onclick="window.ProductLineupAdmin.copyJsCode()" class="min-h-[38px] px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="로컬 자바스크립트 파일에 붙여넣을 코드 복사">',
                '      <i class="fa-solid fa-copy text-amber-600"></i> 로컬코드 복사',
                '    </button>',
                '    <button type="button" onclick="window.ProductLineupAdmin.resetToDefault()" class="min-h-[38px] px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-colors flex items-center gap-1 cursor-pointer" title="최초 기본 데이터 복원">',
                '      <i class="fa-solid fa-rotate-left text-slate-500"></i> 기본값 복원',
                '    </button>',
                '    <button type="button" onclick="window.ProductLineupAdmin.triggerLogout()" class="min-h-[38px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer">',
                '      <i class="fa-solid fa-right-from-bracket text-red-400"></i> 로그아웃',
                '    </button>',
                '  </div>',
                '</div>'
            ].join('');
            barContainer.classList.remove('hidden');
        } else {
            barContainer.innerHTML = [
                '<div class="flex justify-end mb-4">',
                '  <button type="button" onclick="window.ProductLineupAdmin.triggerLoginModal()" class="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200">',
                '    <i class="fa-solid fa-lock text-[10px]"></i> 관리자 로그인',
                '  </button>',
                '</div>'
            ].join('');
            barContainer.classList.remove('hidden');
        }
    }

    // ==========================================================================
    // 8. 제품 라인업 카드 렌더링 (renderProductCards)
    // ==========================================================================
    function renderProductCards(category) {
        if (category) {
            currentFilterCategory = category;
        } else {
            category = currentFilterCategory;
        }

        var container = document.getElementById('product-lineup-cards-grid');
        if (!container) return;

        var fullList = getProductsList();
        var isAdmin = isUserAdmin();

        // 상단 관리자 컨트롤 패널 업데이트
        renderProductAdminControlBar(isAdmin);

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
                '<div class="col-span-1 md:col-span-2 lg:col-span-3 p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm">',
                '  <i class="fa-solid fa-folder-open text-3xl text-slate-400 mb-3 block"></i>',
                '  <p class="text-slate-600 text-sm font-medium">해당 카테고리에 등록된 제품이 없습니다.</p>',
                isAdmin ? '  <button type="button" onclick="window.ProductLineupAdmin.openCreateModal()" class="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow"><i class="fa-solid fa-plus"></i> 이 카테고리에 새 제품 등록하기</button>' : '',
                '</div>'
            ].join('');
            return;
        }

        var html = '';

        displayList.forEach(function (card) {
            // 카테고리별 배지 스타일 및 라벨
            var catBadgeBg = 'bg-blue-600 text-white';
            var catIcon = 'fa-shuffle';
            var catLabel = '초고속 분류기';

            if (card.category === 'conveyor') {
                catBadgeBg = 'bg-cyan-600 text-white';
                catIcon = 'fa-arrows-split-up-and-left';
                catLabel = '이송 & 상하차';
            } else if (card.category === 'robot') {
                catBadgeBg = 'bg-indigo-600 text-white';
                catIcon = 'fa-robot';
                catLabel = '보관 & 로봇';
            } else if (card.category === 'control') {
                catBadgeBg = 'bg-slate-800 text-white';
                catIcon = 'fa-laptop-code';
                catLabel = '통합 관제 & 제어';
            }

            var fallbackUrl = card.fallbackUrl || 'https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800';
            var displayTitle = card.title || '제품명';
            var displayDesc = card.description || '';
            var displayField = card.field || '물류 자동화';
            var displaySubBadge = card.subBadge || '';

            var safeImg = card.imageUrl ? card.imageUrl.replace(/'/g, "\\'") : fallbackUrl;
            var safeTitle = displayTitle.replace(/'/g, "\\'");

            html += '<div class="product-card group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between" data-category="' + card.category + '" id="product-card-' + card.id + '">';

            // 카드 상단 영역
            html += '  <div>';

            // 1. 관리자 모드인 경우: 카드 상단에 수정/삭제 액션 바
            if (isAdmin) {
                html += '    <div class="flex items-center justify-between px-4 py-2.5 bg-blue-50 border-b border-blue-100 text-xs">';
                html += '      <span class="font-bold text-blue-800 flex items-center gap-1.5">';
                html += '        <i class="fa-solid fa-gear text-blue-600"></i> 제품 관리';
                html += '      </span>';
                html += '      <div class="flex items-center gap-1.5">';
                html += '        <button type="button" onclick="window.ProductLineupAdmin.openEditModal(\'' + card.id + '\')" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer">';
                html += '          <i class="fa-solid fa-pen-to-square"></i> 수정';
                html += '        </button>';
                html += '        <button type="button" onclick="window.ProductLineupAdmin.deleteCard(\'' + card.id + '\')" class="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer">';
                html += '          <i class="fa-solid fa-trash-can"></i> 삭제';
                html += '        </button>';
                html += '      </div>';
                html += '    </div>';
            }

            // 2. 썸네일 이미지 영역 (클릭 시 이미지 확대 팝업)
            html += '    <div class="aspect-video bg-slate-900 relative overflow-hidden cursor-pointer" onclick="openImageModal(\'' + safeImg + '\', \'' + safeTitle + '\')">';
            html += '      <img src="' + card.imageUrl + '" onerror="this.onerror=null;this.src=\'' + fallbackUrl + '\';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="' + safeTitle + '">';
            html += '      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-50 transition-opacity"></div>';

            // 카테고리 배지
            html += '      <span class="absolute top-3 left-3 ' + catBadgeBg + ' text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">';
            html += '        <i class="fa-solid ' + catIcon + ' text-[10px]"></i> <span>' + catLabel + '</span>';
            html += '      </span>';

            // 확대보기 안내
            html += '      <span class="absolute bottom-3 right-3 bg-black/70 backdrop-blur text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">';
            html += '        <i class="fa-solid fa-expand text-[10px]"></i> <span>확대보기</span>';
            html += '      </span>';
            html += '    </div>';

            // 3. 카드 본문 콘텐츠
            html += '    <div class="p-6">';

            // 특화 서브 뱃지가 있을 경우 표시
            if (displaySubBadge && displaySubBadge.trim().length > 0) {
                html += '      <div class="flex items-center gap-2 mb-2">';
                html += '        <span class="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">' + displaySubBadge + '</span>';
                html += '      </div>';
            }

            // 제품 명칭 (제목)
            html += '      <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug cursor-pointer" onclick="openImageModal(\'' + safeImg + '\', \'' + safeTitle + '\')">';
            html += '        ' + displayTitle;
            html += '      </h3>';

            // 기술 태그 목록
            if (Array.isArray(card.tags) && card.tags.length > 0) {
                html += '      <div class="flex flex-wrap gap-1.5 mb-3">';
                card.tags.forEach(function (tag) {
                    if (tag && tag.trim().length > 0) {
                        html += '        <span class="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">' + tag.trim() + '</span>';
                    }
                });
                html += '      </div>';
            }

            // 상세 설명
            html += '      <p class="text-sm text-slate-600 leading-relaxed">';
            html += '        ' + displayDesc;
            html += '      </p>';
            html += '    </div>';

            html += '  </div>';

            // 4. 카드 하단: 적용 분야 / 분야명
            html += '  <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">';
            html += '    <span class="font-medium text-slate-500">핵심 적용 분야</span>';
            html += '    <span class="font-semibold text-blue-600">' + displayField + '</span>';
            html += '  </div>';

            html += '</div>';
        });

        container.innerHTML = html;
    }

    // ==========================================================================
    // 9. 제품 등록 및 수정 모달 생성 및 제어
    // ==========================================================================

    /**
     * 제품 모달 DOM을 동적으로 보장합니다.
     */
    function ensureProductEditModal() {
        var existing = document.getElementById('product-admin-edit-modal');
        if (existing) return existing;

        var modal = document.createElement('div');
        modal.id = 'product-admin-edit-modal';
        modal.className = 'fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-6';
        modal.onclick = function (e) {
            if (e.target === modal) {
                closeProductEditModal();
            }
        };

        modal.innerHTML = [
            '<div class="bg-white border border-slate-200 w-full max-w-2xl max-h-[92vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col text-slate-800" onclick="event.stopPropagation()">',
            '  <!-- 모달 헤더 -->',
            '  <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">',
            '    <div class="flex items-center gap-2.5">',
            '      <span class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm">',
            '        <i class="fa-solid fa-boxes-stacked text-sm"></i>',
            '      </span>',
            '      <div>',
            '        <h3 id="product-modal-title" class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">',
            '          새 제품 등록하기',
            '        </h3>',
            '        <p class="text-xs text-slate-500">제품 라인업 정보 입력 및 실시간 저장</p>',
            '      </div>',
            '    </div>',
            '    <button type="button" onclick="window.ProductLineupAdmin.closeEditModal()" class="text-slate-400 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-200 text-lg leading-none cursor-pointer">',
            '      <i class="fa-solid fa-xmark"></i>',
            '    </button>',
            '  </div>',
            '  <!-- 폼 본문 (스크롤) -->',
            '  <form id="product-edit-form" onsubmit="window.ProductLineupAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">',
            '    <input type="hidden" id="product-edit-id" value="">',
            '    <!-- 1행: 카테고리 & 적용 분야 (2열) -->',
            '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '      <div>',
            '        <label for="product-edit-category" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          카테고리 구분 <span class="text-blue-600">*</span>',
            '        </label>',
            '        <select id="product-edit-category" required class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer">',
            '          <option value="sorter">초고속 분류기 (Sorter)</option>',
            '          <option value="conveyor">이송 & 상하차 (Conveyor & Telescopic)</option>',
            '          <option value="robot">스마트 보관 & 로봇 (Shuttle AS/RS & AGV/AMR)</option>',
            '          <option value="control">통합 관제 & 제어 (WCS / Control Software)</option>',
            '        </select>',
            '      </div>',
            '      <div>',
            '        <label for="product-edit-field" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          핵심 적용 분야 <span class="text-blue-600">*</span>',
            '        </label>',
            '        <input type="text" id="product-edit-field" required placeholder="예: 메가 허브 대용량 분류, 스마트 저온 물류" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">',
            '      </div>',
            '    </div>',
            '    <!-- 2행: 제품 명칭 (제목) -->',
            '    <div>',
            '      <label for="product-edit-title" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        제품 명칭 <span class="text-blue-600">*</span>',
            '      </label>',
            '      <input type="text" id="product-edit-title" required placeholder="예: CBS [Cross Belt Sorter], Wheel Sorter" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold">',
            '    </div>',
            '    <!-- 3행: 특화 뱃지 & 정렬 순서 -->',
            '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
            '      <div>',
            '        <label for="product-edit-subbadge" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          상단 특화 뱃지 <span class="text-slate-400 font-normal">(선택 사항)</span>',
            '        </label>',
            '        <input type="text" id="product-edit-subbadge" placeholder="예: 고효율 직선형 소터, 차세대 배송 혁신 (NEW)" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">',
            '      </div>',
            '      <div>',
            '        <label for="product-edit-order" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '          정렬 순서 <span class="text-slate-400 font-normal">(숫자가 작을수록 앞에 표시)</span>',
            '        </label>',
            '        <input type="number" id="product-edit-order" value="1" min="1" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">',
            '      </div>',
            '    </div>',
            '    <!-- 4행: 대표 이미지 경로/파일명 -->',
            '    <div>',
            '      <label for="product-edit-image" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        대표 이미지 파일명 또는 웹 이미지 URL <span class="text-blue-600">*</span>',
            '      </label>',
            '      <input type="text" id="product-edit-image" required placeholder="예: H00_솔루션_3_CBS.jpg 또는 https://images.unsplash.com/..." class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-xs">',
            '      <p class="text-[11px] text-slate-500 mt-1">프로젝트 폴더 내 이미지 파일명을 적으시거나 외부 웹 링크(URL)를 입력하실 수 있습니다.</p>',
            '    </div>',
            '    <!-- 5행: 핵심 기술 태그 (쉼표로 구분) -->',
            '    <div>',
            '      <label for="product-edit-tags" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        핵심 기술 및 특징 태그 <span class="text-slate-400 font-normal">(쉼표로 구분하여 여러 개 입력)</span>',
            '      </label>',
            '      <input type="text" id="product-edit-tags" placeholder="예: 양방향 크로스 벨트, 초고속 정밀 분류, 모듈형 설계" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">',
            '    </div>',
            '    <!-- 6행: 상세 설명 (Textarea) -->',
            '    <div>',
            '      <label for="product-edit-desc" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        제품 상세 스펙 및 성능 설명 <span class="text-blue-600">*</span>',
            '      </label>',
            '      <textarea id="product-edit-desc" rows="4" required placeholder="제품의 메커니즘, 시간당 처리 물동량, 도입 효과 및 상세 기술 특징을 입력해 주세요." class="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-y leading-relaxed"></textarea>',
            '    </div>',
            '    <!-- 모달 푸터 버튼 -->',
            '    <div class="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">',
            '      <button type="button" onclick="window.ProductLineupAdmin.closeEditModal()" class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer">',
            '        취소',
            '      </button>',
            '      <button type="submit" class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer border border-blue-400/30">',
            '        <i class="fa-solid fa-check"></i>',
            '        <span>제품 저장 완료</span>',
            '      </button>',
            '    </div>',
            '  </form>',
            '</div>'
        ].join('');

        document.body.appendChild(modal);
        return modal;
    }

    /**
     * 제품 작성/수정 모달 열기
     */
    function openProductEditModal(productId) {
        var modal = ensureProductEditModal();
        var titleEl = document.getElementById('product-modal-title');
        var form = document.getElementById('product-edit-form');
        if (form) form.reset();

        var idInput = document.getElementById('product-edit-id');
        var catSelect = document.getElementById('product-edit-category');
        var fieldInput = document.getElementById('product-edit-field');
        var titleInput = document.getElementById('product-edit-title');
        var subbadgeInput = document.getElementById('product-edit-subbadge');
        var orderInput = document.getElementById('product-edit-order');
        var imgInput = document.getElementById('product-edit-image');
        var tagsInput = document.getElementById('product-edit-tags');
        var descInput = document.getElementById('product-edit-desc');

        if (productId) {
            // 수정 모드
            var list = getProductsList();
            var target = null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === productId) {
                    target = list[i];
                    break;
                }
            }

            if (!target) {
                alert("해당 제품 정보를 찾을 수 없습니다.");
                return;
            }

            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-pen-to-square text-blue-600"></i> 제품 정보 수정하기';
            if (idInput) idInput.value = target.id;
            if (catSelect) catSelect.value = target.category || 'sorter';
            if (fieldInput) fieldInput.value = target.field || '';
            if (titleInput) titleInput.value = target.title || '';
            if (subbadgeInput) subbadgeInput.value = target.subBadge || '';
            if (orderInput) orderInput.value = target.sortOrder || 1;
            if (imgInput) imgInput.value = target.imageUrl || '';
            if (tagsInput) tagsInput.value = Array.isArray(target.tags) ? target.tags.join(', ') : '';
            if (descInput) descInput.value = target.description || '';
        } else {
            // 신규 등록 모드
            if (titleEl) titleEl.innerHTML = '<i class="fa-solid fa-plus text-blue-600"></i> 새 제품 등록하기';
            if (idInput) idInput.value = "";
            if (catSelect) {
                catSelect.value = (currentFilterCategory && currentFilterCategory !== 'all') ? currentFilterCategory : 'sorter';
            }
            if (orderInput) {
                var currentList = getProductsList();
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
     * 제품 모달 닫기
     */
    function closeProductEditModal() {
        var modal = document.getElementById('product-admin-edit-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    /**
     * 제품 폼 제출 처리 (등록 또는 수정 저장)
     */
    function handleProductFormSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();

        var idInput = document.getElementById('product-edit-id');
        var catSelect = document.getElementById('product-edit-category');
        var fieldInput = document.getElementById('product-edit-field');
        var titleInput = document.getElementById('product-edit-title');
        var subbadgeInput = document.getElementById('product-edit-subbadge');
        var orderInput = document.getElementById('product-edit-order');
        var imgInput = document.getElementById('product-edit-image');
        var tagsInput = document.getElementById('product-edit-tags');
        var descInput = document.getElementById('product-edit-desc');

        var editId = idInput ? idInput.value.trim() : "";
        var category = catSelect ? catSelect.value : "sorter";
        var field = fieldInput ? fieldInput.value.trim() : "";
        var title = titleInput ? titleInput.value.trim() : "";
        var subBadge = subbadgeInput ? subbadgeInput.value.trim() : "";
        var sortOrder = orderInput ? parseInt(orderInput.value, 10) || 1 : 1;
        var imageUrl = imgInput ? imgInput.value.trim() : "";
        var tagsRaw = tagsInput ? tagsInput.value.trim() : "";
        var description = descInput ? descInput.value.trim() : "";

        if (!title) {
            alert("제품 명칭을 입력해 주세요.");
            return;
        }
        if (!imageUrl) {
            alert("대표 이미지 경로 또는 웹 URL을 입력해 주세요.");
            return;
        }
        if (!description) {
            alert("제품 상세 설명을 입력해 주세요.");
            return;
        }

        // 태그 분리 및 정리
        var tags = [];
        if (tagsRaw) {
            tags = tagsRaw.split(',').map(function (t) { return t.trim(); }).filter(function (t) { return t.length > 0; });
        }

        var list = getProductsList();

        if (editId) {
            // 기존 제품 수정
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
                alert("수정할 제품을 찾지 못했습니다.");
                return;
            }
        } else {
            // 신규 제품 추가
            var newId = "prod_" + Date.now();
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

        saveProductsList(list);
        closeProductEditModal();
        renderProductCards(currentFilterCategory);
        alert(editId ? "제품 정보가 성공적으로 수정되었습니다." : "새로운 제품이 성공적으로 등록되었습니다.");
    }

    /**
     * 제품 삭제
     */
    function deleteProductCard(productId) {
        if (!confirm("이 제품을 정말 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.")) {
            return;
        }

        var list = getProductsList();
        var nextList = list.filter(function (item) {
            return item.id !== productId;
        });

        saveProductsList(nextList);
        renderProductCards(currentFilterCategory);
        alert("제품이 성공적으로 삭제되었습니다.");
    }

    // ==========================================================================
    // 10. 전역 API 노출 (window.ProductLineupAdmin)
    // ==========================================================================
    window.ProductLineupAdmin = {
        render: renderProductCards,
        openCreateModal: function () {
            openProductEditModal(null);
        },
        openEditModal: function (productId) {
            openProductEditModal(productId);
        },
        closeEditModal: closeProductEditModal,
        handleFormSubmit: handleProductFormSubmit,
        deleteCard: deleteProductCard,
        resetToDefault: resetProductsData,
        exportJson: exportProductsToJson,
        importJson: importProductsFromJson,
        copyJsCode: copyProductsJsCode,
        triggerLoginModal: function () {
            if (typeof window.openAdminLoginModal === 'function') {
                window.openAdminLoginModal();
            } else if (typeof window.openAdminModal === 'function') {
                window.openAdminModal();
            } else {
                alert("관리자 로그인은 화면 상단 또는 하단 관리자 메뉴를 이용해 주세요.");
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
                renderProductCards(currentFilterCategory);
            }
            alert("관리자 세션에서 로그아웃되었습니다.");
        }
    };

    // 카테고리 필터링 글로벌 함수
    window.filterProductLineup = function (category) {
        currentFilterCategory = category || 'all';
        renderProductCards(currentFilterCategory);
    };

    // DOM 로드 완료 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            renderProductCards('all');
        });
    } else {
        renderProductCards('all');
    }

    // 다른 탭이나 창에서 관리자 상태 또는 제품 데이터 변경 시 자동 동기화
    window.addEventListener('storage', function (e) {
        if (e.key === 'ata_admin_authenticated' || e.key === STORAGE_KEY_PRODUCTS) {
            renderProductCards(currentFilterCategory);
        }
    });

    // 다국어 언어 변경 시에도 렌더링 유지
    window.addEventListener('languageChanged', function (e) {
        renderProductCards(currentFilterCategory);
    });

})();
