/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 제품 라인업(Product Lineup) 쇼케이스 관리자 엔진 (admin_product.js)
 * 
 * [주요 기능 및 아키텍처]
 * 1. 이미지 중심의 쇼케이스 칸(Image Showcase Card) 동적 그리드 렌더링
 * 2. 6대 카테고리 분류 체계 (전체, 물류 배송 라인, 물류 이송 라인, 물류 분류 라인, 물류 창고 라인, Etc.)
 * 3. 이미지 클릭 시 전체화면 고화질 확대(Lightbox) 모달 팝업 연동
 * 4. 관리자 모드 완벽 연동:
 *    - 카테고리 지정 드롭다운
 *    - 내 컴퓨터에서 직접 사진 파일 선택(업로드 / Base64 자동 변환)
 *    - 이미지 URL/파일명 직접 입력
 *    - 실시간 이미지 미리보기
 *    - 카드별 및 확대 팝업 내 즉시 수정 / 삭제
 * 5. 브라우저 로컬 저장소(LocalStorage: ata_product_lineup_db) 영구 보존
 * 6. 웹-로컬 동기화 기능 (JSON 백업 다운로드, 데이터 가져오기, 소스코드 복사, 기본값 복원)
 * 7. 다국어(i18n: ko, en, zh, ja) 실시간 언어 변경 동기화
 * ==============================================================================
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. 상수 정의
    // ==========================================================================
    var STORAGE_KEY_PRODUCTS = "ata_product_lineup_db"; // 브라우저 로컬 저장소 키
    var STORAGE_VERSION_KEY = "ata_product_lineup_version"; // 데이터 구조 버전 키
    var CURRENT_STORAGE_VERSION = "2.0_image_showcase"; // 신규 이미지 쇼케이스 버전
    var currentFilterCategory = "all"; // 현재 활성화된 카테고리 필터 ('all', 'delivery', 'transfer', 'sorting', 'warehouse', 'etc')

    // ==========================================================================
    // 2. 초기 기본 설비 이미지 데이터 (이미지 중심 쇼케이스 구성)
    // ==========================================================================
    var INITIAL_PRODUCTS_DATA = [
        {
            id: "prod_delivery_1",
            category: "delivery", // 물류 배송 라인
            title: "초고속 텔레스코픽 로더 (Telescopic Loader)",
            description: "트럭 및 컨테이너 내부로 자동 연장되어 상하차 효율을 극대화하는 상하차 자동화 설비",
            imageUrl: "Conveyors & ADD-Ons.jpg",
            fallbackUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800",
            sortOrder: 1
        },
        {
            id: "prod_sorting_1",
            category: "sorting", // 물류 분류 라인
            title: "크로스벨트 소터 (Cross Belt Sorter)",
            description: "시간당 25,000개 이상의 다양한 화물을 고속 정밀 분류하는 최첨단 루프형 분류 시스템",
            imageUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800",
            sortOrder: 2
        },
        {
            id: "prod_sorting_2",
            category: "sorting", // 물류 분류 라인
            title: "틸트트레이 소터 (Tilt Tray Sorter)",
            description: "기울임 트레이 방식으로 의류, 소형 패키지, 도서 등을 안전하고 부드럽게 고속 분류",
            imageUrl: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800",
            sortOrder: 3
        },
        {
            id: "prod_sorting_3",
            category: "sorting", // 물류 분류 라인
            title: "슬라이딩 슈 소터 (Sliding Shoe Sorter)",
            description: "신발 형태의 다이버터가 부드럽게 화물을 밀어내어 중대형 박스를 손상 없이 고속 분기",
            imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800",
            sortOrder: 4
        },
        {
            id: "prod_sorting_4",
            category: "sorting", // 물류 분류 라인
            title: "팝업 휠 소터 (Pop-up Wheel Diverter)",
            description: "컨베이어 라인 중간에 모듈형으로 설치되어 직각 또는 45도 방향으로 고속 분기",
            imageUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800",
            sortOrder: 5
        },
        {
            id: "prod_sorting_5",
            category: "sorting", // 물류 분류 라인
            title: "버티컬 연속 리프터 (Vertical Continuous Lifter)",
            description: "복층 물류센터 간 상하 수직 방향으로 화물을 쉼 없이 고속 연속 이송",
            imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
            sortOrder: 6
        },
        {
            id: "prod_transfer_1",
            category: "transfer", // 물류 이송 라인
            title: "스마트 모듈형 롤러 컨베이어 (MDR Conveyor)",
            description: "구간별 모터 롤러 제어(ZPA)를 통해 무충돌 병목 제어 및 전력 소비를 50% 절감",
            imageUrl: "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&q=80&w=800",
            sortOrder: 7
        },
        {
            id: "prod_transfer_2",
            category: "transfer", // 물류 이송 라인
            title: "자율주행 이송로봇 (AGV & AMR System)",
            description: "SLAM 라이다 내비게이션 기반의 무인 지능형 물류 팔레트 및 대차 이송 로봇 솔루션",
            imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
            sortOrder: 8
        },
        {
            id: "prod_warehouse_1",
            category: "warehouse", // 물류 창고 라인
            title: "스마트 셔틀 입출고 시스템 (Multi-Tier Shuttle AS/RS)",
            description: "고밀도 랙 공간에서 초고속 셔틀 카트와 수직 리프터가 결합된 무인 자동 보관·피킹 시스템",
            imageUrl: "https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&q=80&w=800",
            sortOrder: 9
        },
        {
            id: "prod_warehouse_2",
            category: "warehouse", // 물류 창고 라인
            title: "초고층 팔레트 스태커 크레인 (Pallet Stacker Crane)",
            description: "최대 40m 높이의 대형 물류 랙에 중량물 팔레트를 정밀 자동 적재·인출하는 고하중 크레인",
            imageUrl: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800",
            fallbackUrl: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800",
            sortOrder: 10
        },
        {
            id: "prod_etc_1",
            category: "etc", // Etc. (기타)
            title: "지능형 물류 통합 관제 시스템 (ATA-WCS / WES)",
            description: "물류 장비 전체의 트래픽을 1ms 단위로 최적 제어하는 3D 디지털 트윈 기반 관제 소프트웨어",
            imageUrl: "핵심기술개요.jpg",
            fallbackUrl: "핵심기술개요.png",
            sortOrder: 11
        }
    ];

    // ==========================================================================
    // 3. 로컬 저장소 데이터 조회 및 저장 유틸리티
    // ==========================================================================

    /**
     * 로컬 저장소에서 제품 목록을 가져옵니다.
     * 데이터가 없거나 구버전 데이터인 경우 신규 이미지 쇼케이스 데이터로 자동 마이그레이션합니다.
     */
    function getProductsList() {
        try {
            var currentVer = localStorage.getItem(STORAGE_VERSION_KEY);
            if (currentVer !== CURRENT_STORAGE_VERSION) {
                // 구버전 복잡한 텍스트 카드 데이터 삭제 및 신규 이미지 쇼케이스 데이터로 교체
                saveProductsList(INITIAL_PRODUCTS_DATA);
                localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
                return INITIAL_PRODUCTS_DATA.slice();
            }

            var raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("[ProductAdmin] 로컬스토리지 파싱 오류, 초기 데이터로 복구합니다:", e);
        }
        // 기본값 저장 및 반환
        saveProductsList(INITIAL_PRODUCTS_DATA);
        localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
        return INITIAL_PRODUCTS_DATA.slice();
    }

    /**
     * 제품 목록을 로컬 저장소에 저장합니다.
     */
    function saveProductsList(list) {
        try {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(list));
            localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
        } catch (e) {
            console.error("[ProductAdmin] 저장 실패:", e);
            alert("저장 공간이 부족하거나 브라우저 오류로 저장하지 못했습니다. (이미지 용량이 너무 큰 경우 외부 URL이나 압축된 이미지를 사용해 주세요.)");
        }
    }

    /**
     * 초기 기본 설비 이미지 데이터로 안전 복원합니다.
     */
    function resetProductsData() {
        if (!confirm("제품 라인업 데이터를 최초 기본 설비 이미지 목록으로 복원하시겠습니까?\n새로 추가하거나 수정한 이미지는 초기화됩니다.")) {
            return;
        }
        saveProductsList(INITIAL_PRODUCTS_DATA);
        renderProductCards(currentFilterCategory);
        alert("제품 라인업이 최초 기본 데이터로 안전하게 복원되었습니다.");
    }

    // ==========================================================================
    // 4. 웹-로컬 동기화 유틸리티 (JSON 백업 / 복원 / 코드 복사)
    // ==========================================================================

    /**
     * 현재 제품 라인업 전체 데이터를 JSON 파일로 다운로드합니다.
     */
    function exportProductsToJson() {
        var list = getProductsList();
        var jsonStr = JSON.stringify(list, null, 2);
        var blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        var dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");

        var a = document.createElement("a");
        a.href = url;
        a.download = "ata_products_lineup_backup_" + dateStr + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 보관 중인 JSON 백업 파일을 선택하여 웹사이트에 즉시 동기화(복원)합니다.
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
                    if (confirm("가져온 백업 파일(" + parsed.length + "개 이미지)로 현재 제품 라인업을 교체하시겠습니까?")) {
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
     * 로컬 자바스크립트 파일(INITIAL_PRODUCTS_DATA)에 붙여넣을 수 있도록 클립보드에 코드를 복사합니다.
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
    // 5. 관리자 권한 확인
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
    // 6. 카테고리 메타 정보 헬퍼 함수 (6대 카테고리)
    // ==========================================================================
    function getCategoryMeta(categoryKey) {
        var meta = {
            badgeBg: 'bg-slate-700 text-white',
            badgeBorder: 'border-slate-600',
            icon: 'fa-box',
            label: 'Etc.',
            i18nKey: 'lineup_tab_etc'
        };

        if (categoryKey === 'delivery') {
            meta.badgeBg = 'bg-blue-600 text-white';
            meta.badgeBorder = 'border-blue-400';
            meta.icon = 'fa-truck-fast';
            meta.label = '물류 배송 라인';
            meta.i18nKey = 'lineup_tab_delivery';
        } else if (categoryKey === 'transfer') {
            meta.badgeBg = 'bg-cyan-600 text-white';
            meta.badgeBorder = 'border-cyan-400';
            meta.icon = 'fa-arrows-split-up-and-left';
            meta.label = '물류 이송 라인';
            meta.i18nKey = 'lineup_tab_transfer';
        } else if (categoryKey === 'sorting') {
            meta.badgeBg = 'bg-indigo-600 text-white';
            meta.badgeBorder = 'border-indigo-400';
            meta.icon = 'fa-shuffle';
            meta.label = '물류 분류 라인';
            meta.i18nKey = 'lineup_tab_sorting';
        } else if (categoryKey === 'warehouse') {
            meta.badgeBg = 'bg-emerald-600 text-white';
            meta.badgeBorder = 'border-emerald-400';
            meta.icon = 'fa-warehouse';
            meta.label = '물류 창고 라인';
            meta.i18nKey = 'lineup_tab_warehouse';
        } else if (categoryKey === 'etc') {
            meta.badgeBg = 'bg-slate-800 text-white';
            meta.badgeBorder = 'border-slate-700';
            meta.icon = 'fa-ellipsis-vertical';
            meta.label = 'Etc.';
            meta.i18nKey = 'lineup_tab_etc';
        }

        return meta;
    }

    // ==========================================================================
    // 7. 카테고리 탭 배지 숫자 및 스타일 동기화 (6대 카테고리)
    // ==========================================================================
    function updateCategoryTabBadges(list, activeCategory) {
        var countAll = list.length;
        var countDelivery = list.filter(function (item) { return item.category === 'delivery'; }).length;
        var countTransfer = list.filter(function (item) { return item.category === 'transfer'; }).length;
        var countSorting = list.filter(function (item) { return item.category === 'sorting'; }).length;
        var countWarehouse = list.filter(function (item) { return item.category === 'warehouse'; }).length;
        var countEtc = list.filter(function (item) { return item.category === 'etc'; }).length;

        var tabMap = {
            'all': { btn: document.getElementById('product-tab-all'), count: countAll },
            'delivery': { btn: document.getElementById('product-tab-delivery'), count: countDelivery },
            'transfer': { btn: document.getElementById('product-tab-transfer'), count: countTransfer },
            'sorting': { btn: document.getElementById('product-tab-sorting'), count: countSorting },
            'warehouse': { btn: document.getElementById('product-tab-warehouse'), count: countWarehouse },
            'etc': { btn: document.getElementById('product-tab-etc'), count: countEtc }
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
                    badge.className = 'product-tab-badge ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-bold';
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
    // 8. 상단 관리자 컨트롤 바 렌더링
    // ==========================================================================
    function renderProductAdminControlBar(isAdmin) {
        var barContainer = document.getElementById('product-admin-control-bar');
        if (!barContainer) return;

        if (isAdmin) {
            barContainer.innerHTML = [
                '<div class="flex flex-wrap items-center justify-between gap-3 p-4 mb-8 bg-blue-50/90 border border-blue-200 rounded-2xl shadow-sm">',
                '  <div class="flex items-center gap-3">',
                '    <div class="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-200 shadow-sm">',
                '      <i class="fa-solid fa-images"></i>',
                '    </div>',
                '    <div>',
                '      <div class="flex items-center gap-2">',
                '        <h5 class="text-sm font-extrabold text-slate-900">제품 라인업 관리자 모드</h5>',
                '        <span class="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">인증됨</span>',
                '      </div>',
                '      <p class="text-xs text-slate-600 mt-0.5">내 컴퓨터의 사진을 업로드하거나 카테고리를 지정하여 새 제품 이미지를 등록하고 관리할 수 있습니다.</p>',
                '    </div>',
                '  </div>',
                '  <div class="flex flex-wrap items-center gap-2">',
                '    <button type="button" onclick="window.ProductLineupAdmin.openCreateModal()" class="min-h-[38px] px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer">',
                '      <i class="fa-solid fa-plus"></i> 새 제품 이미지 등록',
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
    // 9. 제품 이미지 쇼케이스 칸(Card) 렌더링
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

        // 현재 언어 사전
        var curLang = window.currentLanguage || (function () {
            try { return localStorage.getItem('ata_language') || 'ko'; } catch (e) { return 'ko'; }
        })();
        if (curLang === 'zh') curLang = 'cn';
        var dict = (window.i18nData && window.i18nData[curLang]) || {};

        // 상단 관리자 컨트롤 바 업데이트
        renderProductAdminControlBar(isAdmin);

        // 상단 6대 카테고리 탭 배지 숫자 및 활성화 스타일 동기화
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
                '  <i class="fa-solid fa-images text-3xl text-slate-300 mb-3 block"></i>',
                '  <p class="text-slate-600 text-sm font-medium">해당 카테고리에 등록된 설비 이미지가 없습니다.</p>',
                isAdmin ? '  <button type="button" onclick="window.ProductLineupAdmin.openCreateModal()" class="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow"><i class="fa-solid fa-plus"></i> 이 카테고리에 새 이미지 등록하기</button>' : '',
                '</div>'
            ].join('');
            return;
        }

        var html = '';

        displayList.forEach(function (card) {
            var meta = getCategoryMeta(card.category);
            var fallbackUrl = card.fallbackUrl || 'https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800';
            var displayTitle = card.title || '설비명';
            var displayDesc = card.description || '';
            var safeImg = card.imageUrl ? card.imageUrl.replace(/'/g, "\\'") : fallbackUrl;
            var safeTitle = displayTitle.replace(/'/g, "\\'");
            var labelLarger = dict.ref_view_larger || '클릭 시 확대';

            html += '<div class="product-showcase-card group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between" data-category="' + card.category + '" id="product-card-' + card.id + '">';

            html += '  <div>';

            // 1. 관리자 모드 액션 바 (수정 / 삭제)
            if (isAdmin) {
                html += '    <div class="flex items-center justify-between px-4 py-2 bg-blue-50 border-b border-blue-100 text-xs">';
                html += '      <span class="font-bold text-blue-800 flex items-center gap-1.5">';
                html += '        <i class="fa-solid fa-gear text-blue-600"></i> 이미지 관리';
                html += '      </span>';
                html += '      <div class="flex items-center gap-1.5">';
                html += '        <button type="button" onclick="event.stopPropagation(); window.ProductLineupAdmin.openEditModal(\'' + card.id + '\')" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer">';
                html += '          <i class="fa-solid fa-pen-to-square"></i> 수정';
                html += '        </button>';
                html += '        <button type="button" onclick="event.stopPropagation(); window.ProductLineupAdmin.deleteCard(\'' + card.id + '\')" class="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm cursor-pointer">';
                html += '          <i class="fa-solid fa-trash-can"></i> 삭제';
                html += '        </button>';
                html += '      </div>';
                html += '    </div>';
            }

            // 2. 고화질 이미지 프레임 (클릭 시 전체화면 확대 팝업 실행)
            html += '    <div class="aspect-[16/10] bg-slate-950 relative overflow-hidden cursor-pointer" onclick="window.ProductLineupAdmin.openLightbox(\'' + card.id + '\')">';
            html += '      <img src="' + card.imageUrl + '" onerror="this.onerror=null;this.src=\'' + fallbackUrl + '\';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" alt="' + safeTitle + '">';
            html += '      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80 group-hover:opacity-50 transition-opacity"></div>';

            // 좌측 상단 카테고리 배지
            html += '      <span class="absolute top-3 left-3 ' + meta.badgeBg + ' text-[11px] font-bold px-3 py-1 rounded-full shadow-md border ' + meta.badgeBorder + ' flex items-center gap-1.5">';
            html += '        <i class="fa-solid ' + meta.icon + ' text-[10px]"></i> <span data-i18n="' + meta.i18nKey + '">' + meta.label + '</span>';
            html += '      </span>';

            // 우측 하단 확대 힌트 배지
            html += '      <span class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md group-hover:bg-blue-600 transition-colors">';
            html += '        <i class="fa-solid fa-up-right-and-down-left-from-center text-[10px]"></i> <span>' + labelLarger + '</span>';
            html += '      </span>';
            html += '    </div>';

            // 3. 카드 하단: 설비 명칭 및 설명
            html += '    <div class="p-5 cursor-pointer" onclick="window.ProductLineupAdmin.openLightbox(\'' + card.id + '\')">';
            html += '      <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-1.5">';
            html += '        ' + displayTitle;
            html += '      </h3>';
            if (displayDesc && displayDesc.trim().length > 0) {
                html += '      <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">';
                html += '        ' + displayDesc;
                html += '      </p>';
            }
            html += '    </div>';

            html += '  </div>';

            html += '</div>';
        });

        container.innerHTML = html;
    }

    // ==========================================================================
    // 10. 전체화면 고화질 이미지 확대(Lightbox) 모달 생성 및 제어
    // ==========================================================================

    /**
     * 이미지 확대 모달 DOM을 보장합니다.
     */
    function ensureImageLightboxModal() {
        var existing = document.getElementById('product-image-lightbox-modal');
        if (existing) return existing;

        var modal = document.createElement('div');
        modal.id = 'product-image-lightbox-modal';
        modal.className = 'fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md hidden items-center justify-center p-3 sm:p-6 transition-all duration-300';
        modal.onclick = function (e) {
            if (e.target === modal || e.target.id === 'lightbox-close-area') {
                closeProductLightbox();
            }
        };

        modal.innerHTML = [
            '<div class="relative w-full max-w-5xl max-h-[95vh] flex flex-col items-center justify-center text-white" onclick="event.stopPropagation()">',
            '  <!-- 상단 컨트롤 헤더 -->',
            '  <div class="w-full flex items-center justify-between pb-3 px-2">',
            '    <div class="flex items-center gap-2.5">',
            '      <span id="lightbox-category-badge" class="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">카테고리</span>',
            '      <h4 id="lightbox-title" class="text-sm sm:text-base font-bold text-white truncate max-w-[280px] sm:max-w-md">설비 이미지</h4>',
            '    </div>',
            '    <div class="flex items-center gap-2">',
            '      <div id="lightbox-admin-actions" class="hidden items-center gap-1.5">',
            '        <button type="button" id="lightbox-btn-edit" class="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 shadow cursor-pointer">',
            '          <i class="fa-solid fa-pen-to-square"></i> 수정',
            '        </button>',
            '        <button type="button" id="lightbox-btn-delete" class="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 shadow cursor-pointer">',
            '          <i class="fa-solid fa-trash-can"></i> 삭제',
            '        </button>',
            '      </div>',
            '      <button type="button" onclick="window.ProductLineupAdmin.closeLightbox()" class="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-base transition-colors cursor-pointer" title="닫기 (ESC)">',
            '        <i class="fa-solid fa-xmark"></i>',
            '      </button>',
            '    </div>',
            '  </div>',
            '  <!-- 고화질 이미지 뷰어 -->',
            '  <div class="relative w-full flex items-center justify-center bg-black/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl p-2">',
            '    <img id="lightbox-image" src="" alt="확대 이미지" class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-inner select-none transition-transform duration-300">',
            '  </div>',
            '  <!-- 하단 상세 설명 캡션 -->',
            '  <div id="lightbox-desc-container" class="w-full text-center mt-3 px-4">',
            '    <p id="lightbox-desc" class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto"></p>',
            '  </div>',
            '</div>'
        ].join('');

        document.body.appendChild(modal);

        // ESC 키 바인딩
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeProductLightbox();
            }
        });

        return modal;
    }

    /**
     * 특정 제품의 고화질 이미지를 전체화면 라이트박스로 오픈합니다.
     */
    function openProductLightbox(productId) {
        var modal = ensureImageLightboxModal();
        var fullList = getProductsList();
        var card = null;

        for (var i = 0; i < fullList.length; i++) {
            if (fullList[i].id === productId) {
                card = fullList[i];
                break;
            }
        }

        if (!card) return;

        var meta = getCategoryMeta(card.category);
        var imgEl = document.getElementById('lightbox-image');
        var titleEl = document.getElementById('lightbox-title');
        var catEl = document.getElementById('lightbox-category-badge');
        var descEl = document.getElementById('lightbox-desc');
        var descContainer = document.getElementById('lightbox-desc-container');
        var adminActionsEl = document.getElementById('lightbox-admin-actions');
        var btnEdit = document.getElementById('lightbox-btn-edit');
        var btnDelete = document.getElementById('lightbox-btn-delete');

        if (imgEl) {
            imgEl.src = card.imageUrl || card.fallbackUrl || '';
            imgEl.alt = card.title || '설비 이미지';
        }
        if (titleEl) {
            titleEl.textContent = card.title || '설비 이미지';
        }
        if (catEl) {
            catEl.className = 'px-3 py-1 rounded-full text-xs font-bold ' + meta.badgeBg;
            catEl.textContent = meta.label;
        }
        if (descEl && descContainer) {
            if (card.description && card.description.trim().length > 0) {
                descEl.textContent = card.description;
                descContainer.classList.remove('hidden');
            } else {
                descContainer.classList.add('hidden');
            }
        }

        // 관리자 액션 바 연동
        if (adminActionsEl && btnEdit && btnDelete) {
            if (isUserAdmin()) {
                adminActionsEl.className = 'flex items-center gap-1.5';
                btnEdit.onclick = function () {
                    closeProductLightbox();
                    openProductEditModal(card.id);
                };
                btnDelete.onclick = function () {
                    closeProductLightbox();
                    deleteProductCard(card.id);
                };
            } else {
                adminActionsEl.className = 'hidden';
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    /**
     * 일반 이미지 URL 및 타이틀을 받는 범용 라이트박스 팝업 (레퍼런스 등 호환 지원)
     */
    function openGenericImageModal(imageUrl, title) {
        var modal = ensureImageLightboxModal();
        var imgEl = document.getElementById('lightbox-image');
        var titleEl = document.getElementById('lightbox-title');
        var catEl = document.getElementById('lightbox-category-badge');
        var descContainer = document.getElementById('lightbox-desc-container');
        var adminActionsEl = document.getElementById('lightbox-admin-actions');

        if (imgEl) imgEl.src = imageUrl || '';
        if (titleEl) titleEl.textContent = title || '이미지 확대보기';
        if (catEl) catEl.textContent = 'IMAGE';
        if (descContainer) descContainer.classList.add('hidden');
        if (adminActionsEl) adminActionsEl.className = 'hidden';

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    /**
     * 라이트박스 모달 닫기
     */
    function closeProductLightbox() {
        var modal = document.getElementById('product-image-lightbox-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        document.body.style.overflow = '';
    }

    // ==========================================================================
    // 11. 관리자 등록 및 수정 모달 (카테고리 지정 + 이미지 파일 업로드/URL)
    // ==========================================================================

    /**
     * 제품 등록/수정 모달 DOM을 보장합니다.
     */
    function ensureProductEditModal() {
        var existing = document.getElementById('product-admin-edit-modal');
        if (existing) return existing;

        var modal = document.createElement('div');
        modal.id = 'product-admin-edit-modal';
        modal.className = 'fixed inset-0 z-[10001] bg-black/80 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4';
        modal.onclick = function (e) {
            if (e.target === modal) {
                closeProductEditModal();
            }
        };

        modal.innerHTML = [
            '<div class="bg-white border border-slate-200 w-full max-w-xl max-h-[92vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col text-slate-800" onclick="event.stopPropagation()">',
            '  <!-- 모달 헤더 -->',
            '  <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">',
            '    <div class="flex items-center gap-2.5">',
            '      <span class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-200 shadow-sm">',
            '        <i class="fa-solid fa-image text-sm"></i>',
            '      </span>',
            '      <div>',
            '        <h3 id="product-modal-title" class="text-base sm:text-lg font-bold text-slate-900">',
            '          새 제품 이미지 등록하기',
            '        </h3>',
            '        <p class="text-xs text-slate-500">카테고리 지정 및 사진 삽입</p>',
            '      </div>',
            '    </div>',
            '    <button type="button" onclick="window.ProductLineupAdmin.closeEditModal()" class="text-slate-400 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-200 text-lg leading-none cursor-pointer">',
            '      <i class="fa-solid fa-xmark"></i>',
            '    </button>',
            '  </div>',
            '  <!-- 폼 본문 (스크롤) -->',
            '  <form id="product-edit-form" onsubmit="window.ProductLineupAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">',
            '    <input type="hidden" id="product-edit-id" value="">',
            '',
            '    <!-- 1. 카테고리 지정 (5대 분류) -->',
            '    <div>',
            '      <label for="product-edit-category" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        카테고리 지정 <span class="text-blue-500">*</span>',
            '      </label>',
            '      <select id="product-edit-category" required class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer">',
            '        <option value="delivery">물류 배송 라인 (Delivery)</option>',
            '        <option value="transfer">물류 이송 라인 (Transfer)</option>',
            '        <option value="sorting">물류 분류 라인 (Sorting)</option>',
            '        <option value="warehouse">물류 창고 라인 (Warehouse)</option>',
            '        <option value="etc">Etc. (기타)</option>',
            '      </select>',
            '    </div>',
            '',
            '    <!-- 2. 제품 / 설비 명칭 -->',
            '    <div>',
            '      <label for="product-edit-title" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        제품 / 설비 명칭 <span class="text-blue-500">*</span>',
            '      </label>',
            '      <input type="text" id="product-edit-title" required placeholder="예: 크로스벨트 소터, 텔레스코픽 로더" class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">',
            '    </div>',
            '',
            '    <!-- 3. 설비 사진 자료 업로드 칸 (드래그 앤 드롭 및 스마트 압축 지원) -->',
            '    <div class="space-y-2">',
            '      <div class="flex items-center justify-between">',
            '        <label class="block text-xs font-bold text-slate-800">',
            '          <i class="fa-solid fa-cloud-arrow-up mr-1 text-blue-600"></i> 설비 사진 자료 업로드 <span class="text-blue-500">*</span>',
            '        </label>',
            '        <span class="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">',
            '          <i class="fa-solid fa-sparkles text-[10px] mr-1"></i>스마트 자동 최적화',
            '        </span>',
            '      </div>',
            '      <!-- 드래그 앤 드롭 & 파일 선택 자료 업로드 영역 (Dropzone) -->',
            '      <div id="product-dropzone" class="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl p-5 text-center transition-all cursor-pointer relative group">',
            '        <input type="file" id="product-edit-file" accept="image/*" class="hidden">',
            '        <!-- 업로드 전 안내 화면 -->',
            '        <div id="product-dropzone-prompt" class="space-y-2">',
            '          <div class="w-12 h-12 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">',
            '            <i class="fa-solid fa-arrow-up-from-bracket"></i>',
            '          </div>',
            '          <div>',
            '            <p class="text-xs sm:text-sm font-bold text-slate-800">',
            '              이곳을 클릭하거나 이미지 파일을 끌어다 놓으세요',
            '            </p>',
            '            <p class="text-[11px] text-slate-500 mt-1">',
            '              JPG, PNG, GIF, WebP 형식 지원 (고화질 자동 압축으로 빠른 로딩 보장)',
            '            </p>',
            '          </div>',
            '          <button type="button" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm pointer-events-none">',
            '            <i class="fa-regular fa-folder-open"></i> 내 컴퓨터에서 사진 찾기',
            '          </button>',
            '        </div>',
            '        <!-- 업로드 후 실시간 미리보기 화면 -->',
            '        <div id="product-dropzone-preview-wrap" class="hidden space-y-3">',
            '          <div class="relative w-full aspect-[16/9] bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-300">',
            '            <img id="product-edit-preview" src="" alt="설비 사진 미리보기" class="w-full h-full object-cover">',
            '            <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[11px]">',
            '              <span id="product-upload-filename" class="truncate max-w-[200px]"><i class="fa-solid fa-image mr-1"></i>선택된 이미지</span>',
            '              <span id="product-upload-status" class="text-emerald-400 font-semibold"><i class="fa-solid fa-check-circle mr-1"></i>업로드 완료</span>',
            '            </div>',
            '          </div>',
            '          <div class="flex items-center justify-center gap-2">',
            '            <button type="button" id="product-btn-reupload" class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 shadow-sm">',
            '              <i class="fa-solid fa-arrows-rotate text-blue-600"></i> 사진 다시 선택',
            '            </button>',
            '            <button type="button" id="product-btn-remove-image" class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1">',
            '              <i class="fa-solid fa-trash-can"></i> 사진 지우기',
            '            </button>',
            '          </div>',
            '        </div>',
            '      </div>',
            '      <!-- 보조 입력: 웹 링크(URL) 직접 입력 아코디언 -->',
            '      <details class="text-[11px] text-slate-600 group">',
            '        <summary class="cursor-pointer hover:text-blue-600 select-none flex items-center gap-1 py-1 font-medium">',
            '          <i class="fa-solid fa-link text-slate-400"></i> <span>또는 웹 이미지 링크(URL) / 파일명 직접 입력하기</span>',
            '        </summary>',
            '        <div class="pt-2">',
            '          <input type="text" id="product-edit-image" placeholder="예: Conveyors & ADD-Ons.jpg 또는 https://images.unsplash.com/..." class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500">',
            '        </div>',
            '      </details>',
            '    </div>',
            '',
            '    <!-- 4. 간단 설명 (선택 사항) -->',
            '    <div>',
            '      <label for="product-edit-desc" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        설비 설명 (선택)',
            '      </label>',
            '      <textarea id="product-edit-desc" rows="2" placeholder="설비의 주요 기능이나 특징을 간략히 적어주세요." class="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"></textarea>',
            '    </div>',
            '',
            '    <!-- 5. 표시 순서 정렬 번호 -->',
            '    <div>',
            '      <label for="product-edit-sort" class="block text-xs font-semibold text-slate-700 mb-1.5">',
            '        정렬 순서 (작은 번호가 먼저 노출됨)',
            '      </label>',
            '      <input type="number" id="product-edit-sort" value="10" min="1" max="999" class="w-28 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500">',
            '    </div>',
            '',
            '    <!-- 하단 버튼 바 -->',
            '    <div class="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">',
            '      <button type="button" onclick="window.ProductLineupAdmin.closeEditModal()" class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer">',
            '        취소',
            '      </button>',
            '      <button type="submit" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5">',
            '        <i class="fa-solid fa-check"></i> <span id="product-btn-submit-text">저장하기</span>',
            '      </button>',
            '    </div>',
            '  </form>',
            '</div>'
        ].join('');

        document.body.appendChild(modal);

        // ======================================================================
        // 자료 업로드 칸 (Dropzone & Smart Image Compressor) 인터랙션 로직
        // ======================================================================
        var dropzone = document.getElementById('product-dropzone');
        var fileInput = document.getElementById('product-edit-file');
        var textInput = document.getElementById('product-edit-image');
        var promptWrap = document.getElementById('product-dropzone-prompt');
        var previewWrap = document.getElementById('product-dropzone-preview-wrap');
        var previewImg = document.getElementById('product-edit-preview');
        var filenameLabel = document.getElementById('product-upload-filename');
        var btnReupload = document.getElementById('product-btn-reupload');
        var btnRemoveImg = document.getElementById('product-btn-remove-image');

        /**
         * 캔버스를 활용하여 고화질 이미지를 자동으로 최적화 압축 후 Base64로 변환합니다.
         * (스마트폰 촬영 10MB 원본 사진도 200~300KB 수준의 고화질로 스마트 압축하여 브라우저 로컬 저장소 안전성 보장)
         */
        function compressAndProcessFile(file) {
            if (!file || !file.type.match(/^image\//i)) {
                alert("이미지 파일(JPG, PNG, GIF, WebP 등)만 업로드할 수 있습니다.");
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    var maxWidth = 1400; // 고화질 최대 너비
                    var quality = 0.85;   // 최적 압축 품질
                    var width = img.width;
                    var height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    var canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // JPEG 압축된 Base64 생성
                    var optimizedUrl = canvas.toDataURL('image/jpeg', quality);
                    
                    textInput.value = optimizedUrl;
                    setPreviewState(optimizedUrl, file.name);
                };
                img.onerror = function () {
                    textInput.value = e.target.result;
                    setPreviewState(e.target.result, file.name);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function setPreviewState(src, name) {
            if (src && src.trim().length > 0) {
                previewImg.src = src;
                if (filenameLabel) {
                    filenameLabel.innerHTML = '<i class="fa-solid fa-image mr-1"></i> ' + (name || '등록된 설비 이미지');
                }
                promptWrap.classList.add('hidden');
                previewWrap.classList.remove('hidden');
            } else {
                previewImg.src = '';
                textInput.value = '';
                if (fileInput) fileInput.value = '';
                previewWrap.classList.add('hidden');
                promptWrap.classList.remove('hidden');
            }
        }

        // 모달 전역 헬퍼에 등록 (열기 시 상태 리셋용)
        modal._setPreviewState = setPreviewState;

        // 드롭존 클릭 시 숨겨진 파일 선택기 열기
        if (dropzone) {
            dropzone.addEventListener('click', function (e) {
                if (e.target.closest('#product-btn-reupload') || e.target.closest('#product-btn-remove-image')) {
                    return;
                }
                if (fileInput) fileInput.click();
            });

            // 드래그 앤 드롭 마우스 이벤트
            ['dragenter', 'dragover'].forEach(function (eventName) {
                dropzone.addEventListener(eventName, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.classList.add('border-blue-600', 'bg-blue-100/70', 'scale-[1.01]');
                });
            });

            ['dragleave', 'drop'].forEach(function (eventName) {
                dropzone.addEventListener(eventName, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.classList.remove('border-blue-600', 'bg-blue-100/70', 'scale-[1.01]');
                });
            });

            dropzone.addEventListener('drop', function (e) {
                if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    compressAndProcessFile(e.dataTransfer.files[0]);
                }
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', function (e) {
                if (e.target.files && e.target.files.length > 0) {
                    compressAndProcessFile(e.target.files[0]);
                }
            });
        }

        if (btnReupload && fileInput) {
            btnReupload.addEventListener('click', function (e) {
                e.stopPropagation();
                fileInput.click();
            });
        }

        if (btnRemoveImg) {
            btnRemoveImg.addEventListener('click', function (e) {
                e.stopPropagation();
                setPreviewState('', '');
            });
        }

        // 보조 웹 URL 입력창과 양방향 연동
        if (textInput) {
            textInput.addEventListener('input', function () {
                var val = textInput.value.trim();
                setPreviewState(val, val ? '외부 웹 링크 사진' : '');
            });
        }

        return modal;
    }

    /**
     * 제품 등록 및 수정 모달 열기
     */
    function openProductEditModal(productId) {
        var modal = ensureProductEditModal();
        var form = document.getElementById('product-edit-form');
        if (!form) return;

        form.reset();
        document.getElementById('product-edit-id').value = '';

        var modalTitle = document.getElementById('product-modal-title');
        var submitText = document.getElementById('product-btn-submit-text');
        if (modal._setPreviewState) {
            modal._setPreviewState('', '');
        }

        if (productId) {
            // 수정 모드
            var fullList = getProductsList();
            var target = null;
            for (var i = 0; i < fullList.length; i++) {
                if (fullList[i].id === productId) {
                    target = fullList[i];
                    break;
                }
            }

            if (!target) {
                alert("수정할 제품 데이터를 찾지 못했습니다.");
                return;
            }

            modalTitle.textContent = "제품 이미지 정보 수정";
            submitText.textContent = "수정사항 저장";

            document.getElementById('product-edit-id').value = target.id;
            document.getElementById('product-edit-category').value = target.category || 'delivery';
            document.getElementById('product-edit-title').value = target.title || '';
            document.getElementById('product-edit-image').value = target.imageUrl || '';
            document.getElementById('product-edit-desc').value = target.description || '';
            document.getElementById('product-edit-sort').value = target.sortOrder || 10;

            if (target.imageUrl && modal._setPreviewState) {
                modal._setPreviewState(target.imageUrl, target.title || '등록된 이미지');
            }
        } else {
            // 신규 등록 모드
            modalTitle.textContent = "새 제품 이미지 등록하기";
            submitText.textContent = "등록 완료";
            document.getElementById('product-edit-category').value = currentFilterCategory !== 'all' ? currentFilterCategory : 'delivery';
            document.getElementById('product-edit-sort').value = getProductsList().length + 1;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    /**
     * 제품 등록 및 수정 모달 닫기
     */
    function closeProductEditModal() {
        var modal = document.getElementById('product-admin-edit-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

    /**
     * 등록/수정 폼 제출 처리
     */
    function handleProductFormSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();

        var editId = document.getElementById('product-edit-id').value;
        var category = document.getElementById('product-edit-category').value;
        var title = document.getElementById('product-edit-title').value.trim();
        var imageUrl = document.getElementById('product-edit-image').value.trim();
        var description = document.getElementById('product-edit-desc').value.trim();
        var sortOrder = parseInt(document.getElementById('product-edit-sort').value, 10) || 10;

        if (!title) {
            alert("제품/설비 명칭을 입력해 주세요.");
            return;
        }

        if (!imageUrl) {
            alert("이미지를 삽입해 주세요. (내 컴퓨터에서 사진을 선택하거나 이미지 URL을 입력해 주세요.)");
            return;
        }

        var list = getProductsList();

        if (editId) {
            // 기존 데이터 수정
            var found = false;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === editId) {
                    list[i].category = category;
                    list[i].title = title;
                    list[i].imageUrl = imageUrl;
                    list[i].description = description;
                    list[i].sortOrder = sortOrder;
                    found = true;
                    break;
                }
            }
            if (!found) {
                alert("수정할 항목을 찾지 못했습니다.");
                return;
            }
        } else {
            // 신규 데이터 추가
            var newId = "prod_" + Date.now();
            var newCard = {
                id: newId,
                category: category,
                title: title,
                imageUrl: imageUrl,
                fallbackUrl: imageUrl,
                description: description,
                sortOrder: sortOrder
            };
            list.push(newCard);
        }

        // 정렬 번호 순 정렬
        list.sort(function (a, b) {
            return (a.sortOrder || 0) - (b.sortOrder || 0);
        });

        saveProductsList(list);
        closeProductEditModal();
        renderProductCards(currentFilterCategory);
        alert(editId ? "제품 이미지가 성공적으로 수정되었습니다." : "새 제품 이미지가 성공적으로 등록되었습니다!");
    }

    /**
     * 제품 이미지 삭제
     */
    function deleteProductCard(productId) {
        if (!confirm("이 제품 이미지를 정말 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.")) {
            return;
        }

        var list = getProductsList();
        var nextList = list.filter(function (item) {
            return item.id !== productId;
        });

        saveProductsList(nextList);
        renderProductCards(currentFilterCategory);
        alert("제품 이미지가 삭제되었습니다.");
    }

    // ==========================================================================
    // 12. 통합 관리자 센터(Integrated Admin Hub) 전용 렌더링 엔진
    // ==========================================================================
    /**
     * 메인 화면의 [통합 관리자 센터] 내부 제품 라인업 탭에 목록 및 관리 도구를 렌더링합니다.
     */
    function renderProductManagerList(containerEl, filterCategory) {
        if (!containerEl) return;
        var fullList = getProductsList();
        var currentCat = filterCategory || 'all';

        var filtered = fullList;
        if (currentCat !== 'all') {
            filtered = fullList.filter(function (item) { return item.category === currentCat; });
        }

        var html = [];
        html.push('<div class="space-y-4">');

        // 상단 카테고리 필터 바 및 등록 버튼
        html.push('  <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">');
        html.push('    <div class="flex flex-wrap items-center gap-1.5">');
        
        var cats = [
            { key: 'all', label: '전체 (' + fullList.length + ')' },
            { key: 'delivery', label: '물류 배송' },
            { key: 'transfer', label: '물류 이송' },
            { key: 'sorting', label: '물류 분류' },
            { key: 'warehouse', label: '물류 창고' },
            { key: 'etc', label: 'Etc.' }
        ];

        cats.forEach(function (c) {
            var activeClass = (c.key === currentCat) ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200';
            html.push('      <button type="button" onclick="window.ProductLineupAdmin.renderManagerList(document.getElementById(\'admin-hub-product-list\'), \'' + c.key + '\')" class="px-3 py-1.5 rounded-xl text-xs transition-all ' + activeClass + ' cursor-pointer">' + c.label + '</button>');
        });

        html.push('    </div>');
        html.push('    <div class="flex items-center gap-2">');
        html.push('      <button type="button" onclick="window.ProductLineupAdmin.openCreateModal()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer">');
        html.push('        <i class="fa-solid fa-cloud-arrow-up"></i> 새 설비 사진 등록');
        html.push('      </button>');
        html.push('    </div>');
        html.push('  </div>');

        // 제품 목록 카드 그리드
        if (filtered.length === 0) {
            html.push('  <div class="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500">');
            html.push('    <i class="fa-regular fa-image text-3xl mb-2 text-slate-400 block"></i>');
            html.push('    <p class="text-xs font-medium">선택된 카테고리에 등록된 설비 이미지가 없습니다.</p>');
            html.push('  </div>');
        } else {
            html.push('  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto custom-scrollbar p-1">');
            filtered.forEach(function (p) {
                var meta = getCategoryMeta(p.category);
                var safeTitle = (p.title || '설비명').replace(/"/g, '&quot;');
                html.push('    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">');
                html.push('      <div class="aspect-[16/10] bg-slate-900 relative overflow-hidden cursor-pointer" onclick="window.ProductLineupAdmin.openLightbox(\'' + p.id + '\')">');
                html.push('        <img src="' + p.imageUrl + '" onerror="this.src=\'Conveyors & ADD-Ons.jpg\'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="' + safeTitle + '">');
                html.push('        <span class="absolute top-2 left-2 ' + meta.badgeBg + ' text-[10px] font-bold px-2 py-0.5 rounded-full shadow border ' + meta.badgeBorder + ' flex items-center gap-1"><i class="fa-solid ' + meta.icon + '"></i> ' + meta.label + '</span>');
                html.push('      </div>');
                html.push('      <div class="p-3.5 flex-1 flex flex-col justify-between">');
                html.push('        <div>');
                html.push('          <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate mb-1">' + (p.title || '설비명') + '</h4>');
                html.push('          <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">' + (p.description || '설명 없음') + '</p>');
                html.push('        </div>');
                html.push('        <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">');
                html.push('          <span class="text-[10px] text-slate-400">정렬: #' + (p.sortOrder || 10) + '</span>');
                html.push('          <div class="flex items-center gap-1.5">');
                html.push('            <button type="button" onclick="window.ProductLineupAdmin.openEditModal(\'' + p.id + '\')" class="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold text-[11px] transition-colors cursor-pointer"><i class="fa-solid fa-pen-to-square"></i> 수정</button>');
                html.push('            <button type="button" onclick="window.ProductLineupAdmin.deleteCard(\'' + p.id + '\'); window.ProductLineupAdmin.renderManagerList(document.getElementById(\'admin-hub-product-list\'), \'' + currentCat + '\');" class="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-semibold text-[11px] transition-colors cursor-pointer"><i class="fa-solid fa-trash-can"></i> 삭제</button>');
                html.push('          </div>');
                html.push('        </div>');
                html.push('      </div>');
                html.push('    </div>');
            });
            html.push('  </div>');
        }

        html.push('</div>');
        containerEl.innerHTML = html.join('');
    }

    // ==========================================================================
    // 13. 전역 API 노출 (window.ProductLineupAdmin & window.openImageModal)
    // ==========================================================================
    window.ProductLineupAdmin = {
        render: renderProductCards,
        renderManagerList: renderProductManagerList,
        getProductsList: getProductsList,
        saveProductsList: saveProductsList,
        openLightbox: openProductLightbox,
        closeLightbox: closeProductLightbox,
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

    // 전역 이미지 확대 모달(Lightbox) 함수로도 등록 (다른 모듈 및 레퍼런스와도 호환)
    window.openImageModal = openGenericImageModal;

    // 카테고리 필터링 글로벌 함수 연동
    window.filterProductLineup = function (category) {
        currentFilterCategory = category || 'all';
        renderProductCards(currentFilterCategory);
    };

    // 초기 DOM 로드 시 자동 렌더링
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            renderProductCards('all');
        });
    } else {
        renderProductCards('all');
    }

    // 다른 탭이나 창에서 관리자 상태 변경 시 자동 동기화
    window.addEventListener('storage', function (e) {
        if (e.key === 'ata_admin_authenticated' || e.key === STORAGE_KEY_PRODUCTS) {
            renderProductCards(currentFilterCategory);
        }
    });

    // 다국어 언어 변경 시 탭 및 배지 실시간 동기화
    window.addEventListener('languageChanged', function () {
        renderProductCards(currentFilterCategory);
    });

})();
