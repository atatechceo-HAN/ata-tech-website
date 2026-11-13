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
    var CURRENT_STORAGE_VERSION = "20261108_v1"; // [동기화] 홈페이지 11대 핵심 솔루션과 100% 일원화 버전 // [동기화] 홈페이지 11대 핵심 솔루션과 100% 일원화 버전 // [긴급 패치] Unsplash 의존성 제거 및 내부 정적 fallback 적용 버전
    var currentFilterCategory = "all"; // 현재 활성화된 카테고리 필터 ('all', 'delivery', 'transfer', 'sorting', 'warehouse', 'etc')
    var currentLightboxCardId = null; // 현재 열려있는 라이트박스 제품 ID 추적

    // ==========================================================================
    // 2. 초기 기본 설비 이미지 데이터 (이미지 중심 쇼케이스 구성)
    // [보안/안전성 강화] 외부 불안정 URL(Unsplash 등) 제거 및 프로젝트 내부 정적 에셋 연동
    // ==========================================================================
    var INITIAL_PRODUCTS_DATA = [
    {
        "id": "prod_delivery_1",
        "category": "delivery",
        "title": "택배차량 배송 자동화 시스템",
        "description": "택배 차량 내 공간 활용도를 극대화하고, 작업자의 상하차 피로도를 줄여주는 차세대 스마트 배송 및 적재 자동화 솔루션입니다. 라스트마일 배송의 효율을 완성합니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/택배차량 배송 자동화 시스템.jpg",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/택배차량 배송 자동화 시스템.mp4",
        "sortOrder": 1,
        "features": [
            "공간 효율성 극대화로 배송 단가 절감",
            "작업자 근골격계 질환 예방 및 상하차 피로도 대폭 감소",
            "라스트마일 배송 시간 단축"
        ]
    },
    {
        "id": "prod_delivery_2",
        "category": "delivery",
        "title": "Telescopic",
        "description": "차량 내부 깊숙한 곳까지 컨베이어 끝단이 신축 연장되어 상하차 작업 효율을 극적으로 끌어올리는 텔레스코픽 설비입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/Telescopic.png",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/Telescopic.mp4",
        "sortOrder": 2,
        "features": [
            "버튼 하나로 길이 자유 연장/축소",
            "작업자 동선 최소화 및 인체공학적 작업 환경 제공",
            "안전 센서 감지 확보"
        ]
    },
    {
        "id": "prod_transfer_1",
        "category": "transfer",
        "title": "Conveyors & ADD-Ons",
        "description": "현장 레이아웃과 화물 특성에 맞춰 롤러, 벨트 등 최적의 맞춤형 구성을 제공하는 컨베이어 및 부가 설비입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/Conveyors & ADD-Ons.jpg",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "",
        "sortOrder": 3,
        "features": [
            "견고한 모듈형 하드웨어 설계",
            "저소음 고효율 모터 적용",
            "유지보수가 간편한 표준 모듈 구조"
        ]
    },
    {
        "id": "prod_transfer_2",
        "category": "transfer",
        "title": "AGV & AMR",
        "description": "소형 물류 로봇을 고밀도로 배치해 단위 공간 내 분류 및 이송 효율을 극적으로 끌어올리는 유연한 자율주행 솔루션입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/AGV & AMR.png",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/AGV & AMR.mp4",
        "sortOrder": 4,
        "features": [
            "고정 인프라 없이 유연한 경로 설정",
            "AI 알고리즘 기반 최적 경로 탐색 및 충돌 회피",
            "야간 무인화 작업 지원"
        ]
    },
    {
        "id": "prod_sorting_1",
        "category": "sorting",
        "title": "CBS [Cross Belt Sorter]",
        "description": "주행 캐리어 상단의 소형 컨베이어 벨트를 통해 화물을 목적지 슈트로 고속 배출하는 대표적인 크로스 벨트 분류 시스템입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/CBS.jpg",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/CBS.mp4",
        "sortOrder": 5,
        "features": [
            "시간당 수만 건의 대용량 고속 분류 처리",
            "다양한 규격 및 이형 화물의 안정적인 이송/배출",
            "정밀 제어로 오분류율 0.01% 미만 실현"
        ]
    },
    {
        "id": "prod_sorting_2",
        "category": "sorting",
        "title": "NC CBS [NC Cross Belt Sorter]",
        "description": "기존 기계적 정밀도와 소프트웨어 로직을 한 단계 업그레이드한 차세대 고속, 고정밀 수치제어 크로스 벨트 분류 시스템입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
        "sortOrder": 6,
        "features": [
            "초고속 환경에서도 흔들림 없는 화물 안정성",
            "특수 마찰 벨트 적용으로 슬립 방지",
            "실시간 데이터 기반 예지 보전 시스템 탑재"
        ]
    },
    {
        "id": "prod_sorting_3",
        "category": "sorting",
        "title": "NBS [Narrow Belt Sorter]",
        "description": "소형 화물을 빠르고 정확하게 분류하기 위해 개발된 좁은 벨트 형태의 고효율 특화형 소터 시스템입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/NBS.jpg",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/NBS.mp4",
        "sortOrder": 7,
        "features": [
            "작고 가벼운 의류/잡화 화물 분류 최적화",
            "설치 면적 최소화로 좁은 물류센터 내 도입 용이",
            "부드러운 분류 메커니즘으로 화물 손상 방지"
        ]
    },
    {
        "id": "prod_sorting_4",
        "category": "sorting",
        "title": "Wheel Sorter",
        "description": "인라인 상에 배치된 회전 휠의 각도를 제어하여 박스 및 파우치 화물을 연속적으로 분기·분류하는 고효율 휠 소터 시스템입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
        "sortOrder": 8,
        "features": [
            "콤팩트한 모듈 구조로 기존 컨베이어 라인에 손쉬운 인라인 삽입",
            "다양한 각도(30°, 45°, 90°)의 다방향 분류 지원",
            "저소음 고속 분기 응답 메커니즘"
        ]
    },
    {
        "id": "prod_sorting_5",
        "category": "sorting",
        "title": "Tilt Tray Sorter",
        "description": "운반 트레이를 기울여 화물을 정해진 슈트 목적지로 미끄러뜨려 분류하는 범용적인 틸트 트레이 시스템입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.png",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.mp4",
        "sortOrder": 9,
        "features": [
            "민감한 화물 파손 손상 최소화",
            "다양한 크기와 형태를 동시에 수용",
            "소음이 적어 작업 환경 개선"
        ]
    },
    {
        "id": "prod_warehouse_1",
        "category": "warehouse",
        "title": "Shuttle AS/RS",
        "description": "선반 사이를 자유로이 움직이는 소형 셔틀이 상품을 적재 및 인출하는 고밀도 자동 보관 시스템입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/shuttle ASRS.png",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/shuttle ASRS.mp4",
        "sortOrder": 10,
        "features": [
            "고속 입출고를 통한 작업 속도 향상",
            "선반 공간 효율 극대화 및 고밀도 보관",
            "모듈식 설계로 시스템 확장 용이"
        ]
    },
    {
        "id": "prod_etc_1",
        "category": "etc",
        "title": "WCS [창고제어시스템]",
        "description": "물류 자동화 솔루션 내 모든 설비 제어, 실시간 모니터링, 관리 통제가 가능한 최상위 통합 관제 시스템입니다.",
        "imageUrl": "[ Insert Data ]/SOLUTION/WCS [창고제어시스템].png",
        "fallbackUrl": "assets/images/no-image.svg",
        "videoUrl": "[ Insert Data ]/SOLUTION/WCS [창고제어시스템].mp4",
        "sortOrder": 11,
        "features": [
            "다기종 설비 통합 실시간 제어",
            "병목 현상 사전 감지 및 트래픽 분산",
            "ERP/WMS 시스템 간의 완벽한 데이터 인터페이스"
        ]
    }
];

    // ==========================================================================
    // 2-2. 11대 핵심 제품 라인업 4개국어(KO, EN, CN, JA) 다국어 번역 데이터베이스
    // ==========================================================================
    var PRODUCT_I18N_MAP = {
    "prod_delivery_1": {
        "title": {
            "ko": "택배차량 배송 자동화 시스템 (NEW)",
            "en": "Delivery Vehicle Automation System (NEW)",
            "cn": "快递物流车辆装卸配送自动化系统 (NEW)",
            "ja": "配送車両 荷役・配送自動化システム (NEW)"
        },
        "desc": {
            "ko": "택배 차량 내 공간 활용도를 극대화하고, 작업자의 상하차 피로도를 줄여주는 차세대 스마트 배송 및 적재 자동화 솔루션입니다. 라스트마일 배송의 효율을 완성합니다.",
            "en": "A next-generation smart delivery and automated loading solution that maximizes cargo space utilization and drastically reduces driver loading/unloading fatigue.",
            "cn": "极大提升货运车辆内部空间利用率，大幅降低作业人员上下车装卸强度的下一代智能配送与自动装载系统，全面赋能最后一公里高效履约。",
            "ja": "宅配車両内の積載スペースを最大限に活用し、作業者の荷役疲労を大幅に低減する次世代スマート配送・自動積載ソリューションです。"
        }
    },
    "prod_delivery_2": {
        "title": {
            "ko": "Telescopic [텔레스코픽 컨베이어]",
            "en": "Telescopic Boom Conveyor",
            "cn": "Telescopic 伸缩皮带输送机",
            "ja": "Telescopic 伸縮式テレスコピックコンベア"
        },
        "desc": {
            "ko": "차량 내부 깊숙한 곳까지 컨베이어 끝단이 신축 연장되어 상하차 작업 효율을 극적으로 끌어올리는 텔레스코픽 설비입니다.",
            "en": "A heavy-duty extendable boom conveyor that stretches deep into trailer interiors, drastically boosting loading and unloading productivity.",
            "cn": "输送末端可自由伸展深入车厢内部最深处，大幅减少人工搬运往返距离、成倍提升卡车装卸效率的重载伸缩机。",
            "ja": "トラックの荷台最奥部までコンベア先端が自在に伸縮し、荷役・荷降ろし作業の効率を劇的に向上させるテレスコピック設備です。"
        }
    },
    "prod_transfer_1": {
        "title": {
            "ko": "Conveyors & ADD-Ons",
            "en": "Conveyors & ADD-Ons",
            "cn": "Conveyors & ADD-Ons 输送机与外围配套装备",
            "ja": "Conveyors & ADD-Ons 各種コンベア＆周辺付帯設備"
        },
        "desc": {
            "ko": "현장 레이아웃과 화물 특성에 맞춰 롤러, 벨트 등 최적의 맞춤형 구성을 제공하는 컨베이어 및 부가 설비입니다.",
            "en": "Tailored conveying and auxiliary equipment providing optimal configurations of rollers, belts, and diverters customized to site layouts.",
            "cn": "针对各类复杂仓储布局与货物流向，提供滚筒、皮带、合流、移载等最优定制组合的输送线与外围辅助系统。",
            "ja": "拠点のレイアウトや貨物特性に合わせ、ローラーやベルトなど最適なカスタム構成を提供する搬送コンベアおよび周辺設備です。"
        }
    },
    "prod_transfer_2": {
        "title": {
            "ko": "AGV & AMR [자율주행 물류 로봇]",
            "en": "AGV & AMR Autonomous Mobile Robots",
            "cn": "AGV & AMR 自主移动物流机器人",
            "ja": "AGV & AMR 自律走行型搬送ロボット"
        },
        "desc": {
            "ko": "소형 물류 로봇을 고밀도로 배치해 단위 공간 내 분류 및 이송 효율을 극적으로 끌어올리는 유연한 자율주행 솔루션입니다.",
            "en": "A flexible robotic fleet solution deploying intelligent mobile robots to dramatically boost sorting, conveying, and warehouse transport efficiency.",
            "cn": "通过群控调度高密度移动搬运机器人，打破传统固定输送线束缚，显著提升柔性搬运、拣选与分拣效率的自主移动机器人系统。",
            "ja": "高性能な自律移動ロボットを配備し、固定コンベアの制約を超えて拠点内の搬送・仕分け効率を飛躍的に高めるフレキシブルロボティクスです。"
        }
    },
    "prod_sorting_1": {
        "title": {
            "ko": "CBS [Cross Belt Sorter]",
            "en": "CBS [Cross Belt Sorter]",
            "cn": "CBS [Cross Belt Sorter] 交叉带分拣机",
            "ja": "CBS [Cross Belt Sorter] クロスベルトソーター"
        },
        "desc": {
            "ko": "주행 캐리어 상단의 소형 컨베이어 벨트를 통해 화물을 목적지 슈트로 고속 배출하는 대표적인 크로스 벨트 분류 시스템입니다.",
            "en": "A leading cross belt sortation system that discharges parcels to destination chutes at high speed via miniature conveyor belts atop moving carriers.",
            "cn": "通过运行小车上方的微型皮带传送带，将货物高速精准卸载至目标格口的代表性交叉带自动分拣系统。",
            "ja": "走行キャリア上部の小型コンベアベルトを通じて荷物を目的のシュートへ高速排出する代表的なクロスベルト仕分けシステムです。"
        }
    },
    "prod_sorting_2": {
        "title": {
            "ko": "NC CBS [NC Cross Belt Sorter]",
            "en": "NC CBS [NC Cross Belt Sorter]",
            "cn": "NC CBS [NC Cross Belt Sorter] 数控高速交叉带分拣机",
            "ja": "NC CBS [NC Cross Belt Sorter] 高速数値制御クロスベルトソーター"
        },
        "desc": {
            "ko": "기존 기계적 정밀도와 소프트웨어 로직을 한 단계 업그레이드한 차세대 고속, 고정밀 수치제어 크로스 벨트 분류 시스템입니다.",
            "en": "A next-generation high-speed numerical-control cross belt sortation system boasting upgraded mechanical precision and smart software algorithms.",
            "cn": "全面升级机械精密传动与软件算法架构的下一代高精度数字控制高速交叉带分拣系统。",
            "ja": "機械的精度と制御ソフトウェアロジックを飛躍的に進化させた、次世代の超高速・高精度数値制御型クロスベルトソーターです。"
        }
    },
    "prod_sorting_3": {
        "title": {
            "ko": "NBS [Narrow Belt Sorter]",
            "en": "NBS [Narrow Belt Sorter]",
            "cn": "NBS [Narrow Belt Sorter] 窄带分拣机",
            "ja": "NBS [Narrow Belt Sorter] ナローベルトソーター"
        },
        "desc": {
            "ko": "소형 화물을 빠르고 정확하게 분류하기 위해 개발된 좁은 벨트 형태의 고효율 특화형 소터 시스템입니다.",
            "en": "A high-efficiency narrow belt sortation system specifically engineered for fast, precise sorting of small to medium parcels and polybags.",
            "cn": "专为轻小件包裹、服装杂货及软包袋装高速精准分流而量身打造的高性价比窄皮带特化型自动分拣系统。",
            "ja": "小型・軽量小包を高速かつ正確に仕分けるために設計された、ナローベルト方式の高効率特化型ソーターシステムです。"
        }
    },
    "prod_sorting_4": {
        "title": {
            "ko": "Wheel Sorter",
            "en": "Wheel Sorter",
            "cn": "Wheel Sorter 智能摆轮分拣机",
            "ja": "Wheel Sorter ホイールソーター (スイングアーム式)"
        },
        "desc": {
            "ko": "인라인 상에 배치된 회전 휠의 각도를 제어하여 박스 및 파우치 화물을 연속적으로 분기·분류하는 고효율 휠 소터 시스템입니다.",
            "en": "A high-efficiency modular wheel sortation system that diverts boxes and parcels continuously by rotating steering wheels in-line.",
            "cn": "通过精密控制内置舵轮单元的转向偏转角度，实现对纸箱、塑料箱及中大件包裹连续分流的高效率摆轮分拣系统。",
            "ja": "コンベア上に配置された回転ホイールの角度をミリ秒単位で制御し、段ボールやケース類を連続的に分岐・仕分ける高効率ホイールソーターです。"
        }
    },
    "prod_sorting_5": {
        "title": {
            "ko": "Tilt Tray Sorter",
            "en": "Tilt Tray Sorter",
            "cn": "Tilt Tray Sorter 翻盘分拣机",
            "ja": "Tilt Tray Sorter チルトトレイソーター"
        },
        "desc": {
            "ko": "운반 트레이를 기울여 화물을 정해진 슈트 목적지로 미끄러뜨려 분류하는 범용적인 틸트 트레이 시스템입니다.",
            "en": "A proven, versatile tilt tray sortation system that gently slides parcels into designated chutes by tilting carrier trays.",
            "cn": "通过翻转倾斜托盘将货物轻柔平稳滑入指定格口滑槽的通用型翻盘式高速自动分拣系统。",
            "ja": "搬送トレイを傾斜させ、荷物を所定のシュートへ滑り込ませて仕分ける高信頼性のチルトトレイ方式ソーターです。"
        }
    },
    "prod_warehouse_1": {
        "title": {
            "ko": "Shuttle AS/RS [고밀도 자동창고]",
            "en": "Shuttle AS/RS High-Density Storage",
            "cn": "Shuttle AS/RS 高密穿梭车立体库系统",
            "ja": "Shuttle AS/RS 高密度シャトル式自動倉庫"
        },
        "desc": {
            "ko": "선반 사이를 자유로이 움직이는 소형 셔틀이 상품을 적재 및 인출하는 고밀도 자동 보관 시스템입니다.",
            "en": "A multi-tier automated storage and retrieval system featuring agile intelligent shuttles traversing rack lanes to deposit and retrieve totes/pallets.",
            "cn": "多层智能穿梭小车在货架深处轨道高速往返穿梭，实现货物高密立体存储与极速出入库的下一代自动化立库系统。",
            "ja": "ラック間をインテリジェントシャトルが縦横無尽に走行し、ケースやトレイを高密度に自動格納・搬出する次世代AS/RSシステムです。"
        }
    },
    "prod_etc_1": {
        "title": {
            "ko": "WCS [창고제어시스템]",
            "en": "WCS [Warehouse Control System]",
            "cn": "WCS [Warehouse Control System] 仓库控制与设备集成调度系统",
            "ja": "WCS [Warehouse Control System] 倉庫制御・統合設備管制システム"
        },
        "desc": {
            "ko": "물류 자동화 솔루션 내 모든 설비 제어, 실시간 모니터링, 관리 통제가 가능한 최상위 통합 관제 시스템입니다.",
            "en": "A master logistics integration software platform providing real-time equipment orchestration, 3D digital-twin monitoring, and complete automation control.",
            "cn": "全面接管并统一调度物流中心所有自动化设备，提供全域数字孪生实时监控与集中管控的最高级中央中枢系统。",
            "ja": "物流拠点内の全自動化設備を一元的に制御・監視し、リアルタイムデータ連携を実現する最上位の統合管制ソフトウェアです。"
        }
    }
};

    /**
     * 현재 활성화된 언어에 맞춰 제품의 다국어 타이틀과 상세 설명을 반환합니다.
     */
    function getLocalizedProduct(card, lang) {
        var curLang = lang || window.currentLanguage || (function () {
            try { return localStorage.getItem('ata_language') || 'ko'; } catch (e) { return 'ko'; }
        })();
        if (curLang === 'zh') curLang = 'cn';

        var title = card.title;
        var desc = card.description;

        // 1. card 자체에 i18n 객체가 직접 정의된 경우
        if (card.title_i18n && card.title_i18n[curLang]) {
            title = card.title_i18n[curLang];
        }
        if (card.desc_i18n && card.desc_i18n[curLang]) {
            desc = card.desc_i18n[curLang];
        }

        // 2. 기본 11대 제품 다국어 매핑 테이블 조회 (로컬스토리지 보존 데이터 완벽 지원)
        if (PRODUCT_I18N_MAP[card.id]) {
            var itemMap = PRODUCT_I18N_MAP[card.id];
            if (itemMap.title && itemMap.title[curLang]) {
                title = itemMap.title[curLang];
            }
            if (itemMap.desc && itemMap.desc[curLang]) {
                desc = itemMap.desc[curLang];
            }
        }

        return {
            title: title || '설비명',
            description: desc || ''
        };
    }

    // ==========================================================================
    // 3. 로컬 저장소 데이터 조회 및 저장 유틸리티
    // ==========================================================================

    /**
     * 로컬 저장소에서 제품 목록을 가져옵니다.
     * 데이터가 없거나 구버전 데이터인 경우 신규 이미지 쇼케이스 데이터로 자동 마이그레이션합니다.
     * [긴급 패치] Unsplash URL이 포함된 구버전 캐시 데이터 발견 시 안전한 내부 에셋으로 자동 정화(Sanitize)합니다.
     */
    function getProductsList() {
        try {
            var currentVer = localStorage.getItem(STORAGE_VERSION_KEY);
            if (currentVer !== CURRENT_STORAGE_VERSION) {
                // 구버전 결함 데이터(Unsplash 포함) 삭제 및 신규 안전 정적 데이터로 즉각 교체
                saveProductsList(INITIAL_PRODUCTS_DATA);
                localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
                return INITIAL_PRODUCTS_DATA.slice();
            }

            var raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // [무한루프 방지 자동 정화] 브라우저에 남아있을 수 있는 모든 Unsplash URL을 안전한 로컬 SVG로 치환
                    var needsSave = false;
                    parsed.forEach(function (item) {
                        if (item.imageUrl && item.imageUrl.indexOf('unsplash.com') !== -1) {
                            item.imageUrl = 'assets/images/no-image.svg';
                            needsSave = true;
                        }
                        if (!item.fallbackUrl || item.fallbackUrl.indexOf('unsplash.com') !== -1) {
                            item.fallbackUrl = 'assets/images/no-image.svg';
                            needsSave = true;
                        }
                    });
                    if (needsSave) {
                        saveProductsList(parsed);
                    }
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
            // [실시간 데이터 일원화 동기화] 1. 메인 솔루션 그리드 즉시 갱신
            if (typeof window.renderSolutionsGrid === 'function') {
                window.renderSolutionsGrid();
            }
            // [실시간 데이터 일원화 동기화] 2. 관리자 허브 내 제품 목록 즉시 갱신
            var hubProductList = document.getElementById('admin-hub-product-list');
            if (hubProductList) {
                renderProductManagerList(hubProductList, currentFilterCategory || 'all');
            }
            // [실시간 데이터 일원화 동기화] 3. 제품 라인업 기존 뷰 즉시 갱신
            renderProductCards(currentFilterCategory);
            // [실시간 데이터 일원화 동기화] 4. 커스텀 이벤트 및 스토리지 브로드캐스트
            window.dispatchEvent(new CustomEvent('productDataChanged', { detail: { products: list } }));
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
            // [무한루프 방지] fallbackUrl이 비어있거나 외부 Unsplash인 경우 항상 안전한 내부 SVG로 처리
            var fallbackUrl = card.fallbackUrl || 'assets/images/no-image.svg';
            if (fallbackUrl.indexOf('unsplash.com') !== -1) {
                fallbackUrl = 'assets/images/no-image.svg';
            }
            var localized = getLocalizedProduct(card, curLang);
            var displayTitle = localized.title || '설비명';
            var displayDesc = localized.description || '';
            var catLabel = (dict && dict[meta.i18nKey]) ? dict[meta.i18nKey] : meta.label;
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
            // [원천 차단] onerror 발생 시 this.onerror=null 및 removeAttribute('onerror')로 무한 재귀 루프를 물리적으로 차단
            html += '    <div class="aspect-[16/10] bg-slate-950 relative overflow-hidden cursor-pointer" onclick="window.ProductLineupAdmin.openLightbox(\'' + card.id + '\')">';
            html += '      <img src="' + card.imageUrl + '" onerror="this.onerror=null; this.removeAttribute(\'onerror\'); this.src=\'' + fallbackUrl + '\';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" alt="' + safeTitle + '">';
            html += '      <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80 group-hover:opacity-50 transition-opacity"></div>';

            // 좌측 상단 카테고리 배지
            html += '      <span class="absolute top-3 left-3 ' + meta.badgeBg + ' text-[11px] font-bold px-3 py-1 rounded-full shadow-md border ' + meta.badgeBorder + ' flex items-center gap-1.5">';
            html += '        <i class="fa-solid ' + meta.icon + ' text-[10px]"></i> <span data-i18n="' + meta.i18nKey + '">' + catLabel + '</span>';
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

        currentLightboxCardId = card.id;

        var curLang = window.currentLanguage || (function () {
            try { return localStorage.getItem('ata_language') || 'ko'; } catch (e) { return 'ko'; }
        })();
        if (curLang === 'zh') curLang = 'cn';
        var dict = (window.i18nData && window.i18nData[curLang]) || (window.i18nData && window.i18nData.ko) || {};

        var localized = getLocalizedProduct(card, curLang);
        var catLabel = (dict && dict[meta.i18nKey]) ? dict[meta.i18nKey] : meta.label;

        if (imgEl) {
            // [라이트박스 모달 이미지 무한루프 방지 핸들러]
            imgEl.onerror = function () {
                this.onerror = null;
                if (typeof this.removeAttribute === 'function') {
                    this.removeAttribute('onerror');
                }
                this.src = 'assets/images/no-image.svg';
            };
            var modalSafeImg = card.imageUrl || card.fallbackUrl || 'assets/images/no-image.svg';
            if (modalSafeImg.indexOf('unsplash.com') !== -1) {
                modalSafeImg = 'assets/images/no-image.svg';
            }
            imgEl.src = modalSafeImg;
            imgEl.alt = localized.title || '설비 이미지';
        }
        if (titleEl) {
            titleEl.textContent = localized.title || '설비 이미지';
        }
        if (catEl) {
            catEl.className = 'px-3 py-1 rounded-full text-xs font-bold ' + meta.badgeBg;
            catEl.textContent = catLabel;
        }
        if (descEl && descContainer) {
            if (localized.description && localized.description.trim().length > 0) {
                descEl.textContent = localized.description;
                descContainer.classList.remove('hidden');
            } else {
                descContainer.classList.add('hidden');
            }
        }

        // 관리자 액션 바 연동
        if (adminActionsEl && btnEdit && btnDelete) {
            if (isUserAdmin()) {
                var editLabel = (dict && dict.common_edit) || (curLang === 'en' ? 'Edit' : (curLang === 'ja' ? '編集' : (curLang === 'cn' ? '编辑' : '수정')));
                var deleteLabel = (dict && dict.common_delete) || (curLang === 'en' ? 'Delete' : (curLang === 'ja' ? '削除' : (curLang === 'cn' ? '删除' : '삭제')));
                btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> ' + editLabel;
                btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i> ' + deleteLabel;
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
        currentLightboxCardId = null;
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
        modal.className = 'fixed inset-0 z-[99999] ata-admin-modal-overlay bg-black/80 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4';
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
            '          <input type="text" id="product-edit-image" placeholder="예: [ Insert Data ]/SOLUTION/CBS.jpg 또는 assets/images/no-image.svg" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500">',
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

        modal.style.display = 'flex';
        modal.style.zIndex = '99999';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        if (typeof window.syncAdminBodyScrollLock === 'function') window.syncAdminBodyScrollLock();
        else document.body.style.overflow = 'hidden';
    }

    /**
     * 제품 등록 및 수정 모달 닫기
     */
    function closeProductEditModal() {
        var modal = document.getElementById('product-admin-edit-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        if (typeof window.syncAdminBodyScrollLock === 'function') window.syncAdminBodyScrollLock();
        else document.body.style.overflow = '';
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
                fallbackUrl: "assets/images/no-image.svg", // [안전성] 신규 생성 시 안전한 정적 에셋을 기본 fallback으로 설정
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
        var hubProdList = document.getElementById('admin-hub-product-list');
        if (hubProdList) {
            renderProductManagerList(hubProdList, currentFilterCategory);
        }

        // GitHub 원격 저장소 동기화 연동
        if (window.GithubSync && typeof window.GithubSync.hasToken === 'function' && window.GithubSync.hasToken()) {
            if (confirm((editId ? "제품 이미지가 수정되었습니다!" : "새 제품 이미지가 등록되었습니다!") + "\n\nGitHub 원격 저장소(main 브랜치)에도 지금 즉시 자동 반영(Push)하시겠습니까?")) {
                window.GithubSync.syncAllToRemote(title + " 제품 라인업 갱신");
            }
        } else {
            alert(editId ? "제품 이미지가 성공적으로 수정되었습니다.\n(다른 기기에서도 영구 유지하려면 관리자 센터의 [GitHub 연동 설정]에서 토큰을 등록해 주세요.)" : "새 제품 이미지가 성공적으로 등록되었습니다!\n(다른 기기에서도 영구 유지하려면 관리자 센터의 [GitHub 연동 설정]에서 토큰을 등록해 주세요.)");
        }
    }

    /**
     * 제품 이미지 삭제
     */
    function deleteProductCard(productId) {
        if (!confirm("이 제품 이미지를 정말 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.")) {
            return;
        }

        var list = getProductsList();
        var targetItem = list.find(function (item) { return item.id === productId; });
        var targetTitle = targetItem ? targetItem.title : "제품";

        var nextList = list.filter(function (item) {
            return item.id !== productId;
        });

        saveProductsList(nextList);
        renderProductCards(currentFilterCategory);

        // GitHub 원격 저장소 동기화 연동
        if (window.GithubSync && typeof window.GithubSync.hasToken === 'function' && window.GithubSync.hasToken()) {
            if (confirm("[" + targetTitle + "] 제품이 삭제되었습니다.\n\nGitHub 원격 저장소(main 브랜치)에도 즉시 반영(Push)하시겠습니까?")) {
                window.GithubSync.syncAllToRemote("[" + targetTitle + "] 제품 라인업 삭제");
            }
        } else {
            alert("제품 이미지가 삭제되었습니다.");
        }
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
                html.push('        <img src="' + p.imageUrl + '" onerror="this.onerror=null; this.removeAttribute(\'onerror\'); this.src=\'assets/images/no-image.svg\';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="' + safeTitle + '">');
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
        getData: getProductsList, // GitHub 동기화 표준 API
        setData: saveProductsList, // GitHub 동기화 표준 API
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

    // 다국어 언어 변경 시 탭 및 배지, 카드, 모달 실시간 동기화
    window.addEventListener('languageChanged', function () {
        renderProductCards(currentFilterCategory);
        if (currentLightboxCardId) {
            var modal = document.getElementById('product-image-lightbox-modal');
            if (modal && !modal.classList.contains('hidden')) {
                openProductLightbox(currentLightboxCardId);
            }
        }
    });

})();
