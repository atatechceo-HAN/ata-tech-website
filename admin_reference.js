/**
 * ============================================================================
 * [파일명]: admin_reference.js
 * [마지막 업데이트]: 2026-10-31
 * [모듈 설명]: 
 *   주식회사 에이티에이기술(ATA Technology) 공식 홈페이지의
 *   '주요 구축 실적 (REFERENCE)' 전용 듀얼 시어터(동영상 시어터 + 이미지 시어터) 시스템입니다.
 *
 * [핵심 UI/UX 구조]:
 *   1. 6대 폴더('전경', 'CBS', 'NC CBS', 'NBS', 'Wheel Sorter', '틸트트레이소터')를 카테고리 탭으로 제공.
 *   2. [동영상 시어터]: 가운데(좌측 메인)에서 대형 영상을 재생하고, 우측에 스크롤 가능한 동영상 썸네일 목록을 배치.
 *   3. [이미지 시어터]: 동영상과 완전히 동일한 스타일로, 가운데(좌측 메인)에 고해상도 이미지를 크게 표시하고
 *      우측에 스크롤 가능한 이미지 썸네일 목록을 배치하여 클릭 즉시 가운데 이미지와 분석 해설이 전환됨.
 *   4. 깜빡임 없는 부분 업데이트(DOM Partial Update)와 다중 경로 폴백(Fallback) 처리로 오류를 원천 차단.
 * ============================================================================
 */

(function () {
    "use strict";

    // ==========================================================================
    // 1. 6대 폴더 순서 및 미디어/분석 멘트 통합 데이터베이스
    // ==========================================================================
    var FOLDER_ORDER = ["전경","CBS","NC CBS","NBS","Wheel Sorter","틸트트레이소터"];

    var REFERENCE_GALLERY_DB = {
    "전경": {
        "id": "전경",
        "title": "전경",
        "subtitle": "스마트 물류 R&D 및 대규모 제조 거점 항공 전경",
        "badge": "MANUFACTURING & R&D CAMPUS",
        "icon": "fa-building-columns",
        "overview": "태양광 루프탑 친환경 발전 설비가 완비된 대규모 스마트 물류 장비 제조·조립 단지 및 R&D 실증 테스트 센터의 드론 항공 촬영 전경입니다. 원자재 정밀 가공부터 대형 소터 라인 가조립, 출고 전 사전 시운전(FAT)까지 원스톱으로 수행하는 핵심 생산 기지입니다.",
        "tags": [
            "스마트 팩토리",
            "대규모 제조 거점",
            "R&D 테스트베드",
            "FAT 사전 시운전"
        ],
        "videoTemplates": [
            {
                "title": "스마트 물류 제조 거점 항공 드론 투어",
                "desc": "대규모 생산 라인과 R&D 실증 센터가 통합된 제조 기지 전경 영상입니다."
            }
        ],
        "photoTemplates": [
            {
                "title": "에이티에이기술 핵심 제조 거점 및 스마트 물류 R&D 단지 항공 전경",
                "desc": "드론 상공에서 촬영한 대규모 제조·조립 공장동 및 본관 전경입니다. 지붕 전체에 구축된 태양광 발전 인프라와 대형 물류 설비 출하를 위한 광폭 도크, 통합 R&D 실증 공간이 체계적으로 배치되어 있습니다."
            }
        ],
        "videoCount": 0,
        "photoCount": 1,
        "videos": [],
        "photos": [
            {
                "id": "전경-pho-1",
                "folder": "전경",
                "index": 1,
                "fileName": "Image_20261028160029_29_105.jpg",
                "src": "assets/reference/전경/Image_20261028160029_29_105.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Conveyors & ADD-Ons.jpg",
                "thumb": "assets/reference/전경/Image_20261028160029_29_105.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Conveyors & ADD-Ons.jpg",
                "clipCode": "전경 현장포토 #01",
                "title": "[전경 #01] 에이티에이기술 핵심 제조 거점 및 스마트 물류 R&D 단지 항공 전경",
                "desc": "드론 상공에서 촬영한 대규모 제조·조립 공장동 및 본관 전경입니다. 지붕 전체에 구축된 태양광 발전 인프라와 대형 물류 설비 출하를 위한 광폭 도크, 통합 R&D 실증 공간이 체계적으로 배치되어 있습니다.",
                "tags": [
                    "스마트 팩토리",
                    "대규모 제조 거점",
                    "R&D 테스트베드",
                    "FAT 사전 시운전"
                ]
            }
        ]
    },
    "CBS": {
        "id": "CBS",
        "title": "CBS",
        "subtitle": "CBS [Cross Belt Sorter] — 루프형·직선형 크로스벨트 소터 구축 현장",
        "badge": "CROSS BELT SORTER",
        "icon": "fa-arrows-rotate",
        "overview": "대형 이커머스 풀필먼트 센터 및 광역 택배 허브 터미널에 구축된 크로스벨트 소터(CBS) 실제 가동 현장입니다. 다열 고속 인덕션(Induction) 자동 투입 라인과 양방향 대용량 마대·스파이럴 슈트가 유기적으로 연동되어 시간당 최대 15,000~20,000개 이상의 정형·비정형 화물을 초정밀 분류합니다.",
        "tags": [
            "Cross Belt Sorter",
            "고속 인덕션 투입",
            "양방향 슈트 분기",
            "풀필먼트 허브"
        ],
        "videoTemplates": [
            {
                "title": "CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다."
            },
            {
                "title": "CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다."
            },
            {
                "title": "CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다."
            },
            {
                "title": "CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다."
            },
            {
                "title": "CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다."
            },
            {
                "title": "CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다."
            },
            {
                "title": "CBS 폴리백·소형 택배 화물 밀착 제어 및 정밀 투입 실증",
                "desc": "마찰력이 낮거나 가벼운 비닐 폴리백 화물도 정전기 방지 및 고마찰 벨트 제어를 통해 미끄러짐 없이 정밀하게 목표 슈트로 안착시키는 모습입니다."
            },
            {
                "title": "CBS 메인 구동부 저소음 서보 제어 및 연속 순환 시운전",
                "desc": "고효율 리니어/서보 구동 메커니즘을 적용하여 고속 가동 시에도 소음과 마모를 최소화하고 24시간 무중단 연속 운전 신뢰성을 검증하는 현장입니다."
            }
        ],
        "photoTemplates": [
            {
                "title": "CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다."
            },
            {
                "title": "CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다."
            },
            {
                "title": "CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다."
            },
            {
                "title": "CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다."
            },
            {
                "title": "CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다."
            },
            {
                "title": "대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다."
            }
        ],
        "videoCount": 54,
        "photoCount": 57,
        "videos": [
            {
                "id": "CBS-vid-1",
                "folder": "CBS",
                "index": 1,
                "fileName": "CBS (1).mp4",
                "src": "assets/reference/CBS/CBS (1).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (1).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (1)",
                "title": "[CBS 영상 #01] CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-2",
                "folder": "CBS",
                "index": 2,
                "fileName": "CBS (2).mp4",
                "src": "assets/reference/CBS/CBS (2).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (2).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (2)",
                "title": "[CBS 영상 #02] CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-3",
                "folder": "CBS",
                "index": 3,
                "fileName": "CBS (4).mp4",
                "src": "assets/reference/CBS/CBS (4).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (4).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (4)",
                "title": "[CBS 영상 #03] CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-4",
                "folder": "CBS",
                "index": 4,
                "fileName": "CBS (5).mp4",
                "src": "assets/reference/CBS/CBS (5).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (4).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (5)",
                "title": "[CBS 영상 #04] CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-5",
                "folder": "CBS",
                "index": 5,
                "fileName": "CBS (6).mp4",
                "src": "assets/reference/CBS/CBS (6).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (7).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (6)",
                "title": "[CBS 영상 #05] CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-6",
                "folder": "CBS",
                "index": 6,
                "fileName": "CBS (7).mp4",
                "src": "assets/reference/CBS/CBS (7).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (7).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (7)",
                "title": "[CBS 영상 #06] CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-7",
                "folder": "CBS",
                "index": 7,
                "fileName": "CBS (8).mp4",
                "src": "assets/reference/CBS/CBS (8).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (11).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (8)",
                "title": "[CBS 영상 #07] CBS 폴리백·소형 택배 화물 밀착 제어 및 정밀 투입 실증",
                "desc": "마찰력이 낮거나 가벼운 비닐 폴리백 화물도 정전기 방지 및 고마찰 벨트 제어를 통해 미끄러짐 없이 정밀하게 목표 슈트로 안착시키는 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-8",
                "folder": "CBS",
                "index": 8,
                "fileName": "CBS (9).mp4",
                "src": "assets/reference/CBS/CBS (9).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (12).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (9)",
                "title": "[CBS 영상 #08] CBS 메인 구동부 저소음 서보 제어 및 연속 순환 시운전",
                "desc": "고효율 리니어/서보 구동 메커니즘을 적용하여 고속 가동 시에도 소음과 마모를 최소화하고 24시간 무중단 연속 운전 신뢰성을 검증하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-9",
                "folder": "CBS",
                "index": 9,
                "fileName": "CBS (10).mp4",
                "src": "assets/reference/CBS/CBS (10).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (10).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (10)",
                "title": "[CBS 영상 #09] CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-10",
                "folder": "CBS",
                "index": 10,
                "fileName": "CBS (11).mp4",
                "src": "assets/reference/CBS/CBS (11).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (11).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (11)",
                "title": "[CBS 영상 #10] CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-11",
                "folder": "CBS",
                "index": 11,
                "fileName": "CBS (12).mp4",
                "src": "assets/reference/CBS/CBS (12).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (12).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (12)",
                "title": "[CBS 영상 #11] CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-12",
                "folder": "CBS",
                "index": 12,
                "fileName": "CBS (13).mp4",
                "src": "assets/reference/CBS/CBS (13).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (13).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (13)",
                "title": "[CBS 영상 #12] CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-13",
                "folder": "CBS",
                "index": 13,
                "fileName": "CBS (14).mp4",
                "src": "assets/reference/CBS/CBS (14).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (14).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (14)",
                "title": "[CBS 영상 #13] CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-14",
                "folder": "CBS",
                "index": 14,
                "fileName": "CBS (15).mp4",
                "src": "assets/reference/CBS/CBS (15).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (15).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (15)",
                "title": "[CBS 영상 #14] CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-15",
                "folder": "CBS",
                "index": 15,
                "fileName": "CBS (16).mp4",
                "src": "assets/reference/CBS/CBS (16).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (16).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (16)",
                "title": "[CBS 영상 #15] CBS 폴리백·소형 택배 화물 밀착 제어 및 정밀 투입 실증",
                "desc": "마찰력이 낮거나 가벼운 비닐 폴리백 화물도 정전기 방지 및 고마찰 벨트 제어를 통해 미끄러짐 없이 정밀하게 목표 슈트로 안착시키는 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-16",
                "folder": "CBS",
                "index": 16,
                "fileName": "CBS (17).mp4",
                "src": "assets/reference/CBS/CBS (17).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (17).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (17)",
                "title": "[CBS 영상 #16] CBS 메인 구동부 저소음 서보 제어 및 연속 순환 시운전",
                "desc": "고효율 리니어/서보 구동 메커니즘을 적용하여 고속 가동 시에도 소음과 마모를 최소화하고 24시간 무중단 연속 운전 신뢰성을 검증하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-17",
                "folder": "CBS",
                "index": 17,
                "fileName": "CBS (18).mp4",
                "src": "assets/reference/CBS/CBS (18).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (18).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (18)",
                "title": "[CBS 영상 #17] CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-18",
                "folder": "CBS",
                "index": 18,
                "fileName": "CBS (19).mp4",
                "src": "assets/reference/CBS/CBS (19).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (19).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (19)",
                "title": "[CBS 영상 #18] CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-19",
                "folder": "CBS",
                "index": 19,
                "fileName": "CBS (20).mp4",
                "src": "assets/reference/CBS/CBS (20).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (20).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (20)",
                "title": "[CBS 영상 #19] CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-20",
                "folder": "CBS",
                "index": 20,
                "fileName": "CBS (21).mp4",
                "src": "assets/reference/CBS/CBS (21).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (21).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (21)",
                "title": "[CBS 영상 #20] CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-21",
                "folder": "CBS",
                "index": 21,
                "fileName": "CBS (22).mp4",
                "src": "assets/reference/CBS/CBS (22).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (22).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (22)",
                "title": "[CBS 영상 #21] CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-22",
                "folder": "CBS",
                "index": 22,
                "fileName": "CBS (23).mp4",
                "src": "assets/reference/CBS/CBS (23).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (23).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (23)",
                "title": "[CBS 영상 #22] CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-23",
                "folder": "CBS",
                "index": 23,
                "fileName": "01b40333cce28724683bca9c8b912a5d.mp4",
                "src": "assets/reference/CBS/01b40333cce28724683bca9c8b912a5d.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/01b40333cce28724683bca9c8b912a5d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #23",
                "title": "[CBS 영상 #23] CBS 폴리백·소형 택배 화물 밀착 제어 및 정밀 투입 실증",
                "desc": "마찰력이 낮거나 가벼운 비닐 폴리백 화물도 정전기 방지 및 고마찰 벨트 제어를 통해 미끄러짐 없이 정밀하게 목표 슈트로 안착시키는 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-24",
                "folder": "CBS",
                "index": 24,
                "fileName": "2ff9531d28bd45fc03381bd8a692e404.mp4",
                "src": "assets/reference/CBS/2ff9531d28bd45fc03381bd8a692e404.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/2ff9531d28bd45fc03381bd8a692e404_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #24",
                "title": "[CBS 영상 #24] CBS 메인 구동부 저소음 서보 제어 및 연속 순환 시운전",
                "desc": "고효율 리니어/서보 구동 메커니즘을 적용하여 고속 가동 시에도 소음과 마모를 최소화하고 24시간 무중단 연속 운전 신뢰성을 검증하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-25",
                "folder": "CBS",
                "index": 25,
                "fileName": "3c6c07a76684c3f3d4978b9a97505980.mp4",
                "src": "assets/reference/CBS/3c6c07a76684c3f3d4978b9a97505980.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/3c6c07a76684c3f3d4978b9a97505980_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #25",
                "title": "[CBS 영상 #25] CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-26",
                "folder": "CBS",
                "index": 26,
                "fileName": "6eb4b5bcf46d25755fe414e009719c54.mp4",
                "src": "assets/reference/CBS/6eb4b5bcf46d25755fe414e009719c54.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/6eb4b5bcf46d25755fe414e009719c54_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #26",
                "title": "[CBS 영상 #26] CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-27",
                "folder": "CBS",
                "index": 27,
                "fileName": "7e85e2c885de63688b4d15cfc5367b54.mp4",
                "src": "assets/reference/CBS/7e85e2c885de63688b4d15cfc5367b54.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/7e85e2c885de63688b4d15cfc5367b54_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #27",
                "title": "[CBS 영상 #27] CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-28",
                "folder": "CBS",
                "index": 28,
                "fileName": "29eb25f1501abbdea5f5c4c2cda9a4ce.mp4",
                "src": "assets/reference/CBS/29eb25f1501abbdea5f5c4c2cda9a4ce.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/CBS (32).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #28",
                "title": "[CBS 영상 #28] CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-29",
                "folder": "CBS",
                "index": 29,
                "fileName": "47f33e193ec71d8b317df4d7f1943a80.mp4",
                "src": "assets/reference/CBS/47f33e193ec71d8b317df4d7f1943a80.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/47f33e193ec71d8b317df4d7f1943a80_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #29",
                "title": "[CBS 영상 #29] CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-30",
                "folder": "CBS",
                "index": 30,
                "fileName": "60da705934839af78196bff8841fd11d.mp4",
                "src": "assets/reference/CBS/60da705934839af78196bff8841fd11d.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/60da705934839af78196bff8841fd11d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #30",
                "title": "[CBS 영상 #30] CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-31",
                "folder": "CBS",
                "index": 31,
                "fileName": "62ec55bf9ffb3e7b065b59e170c25d72.mp4",
                "src": "assets/reference/CBS/62ec55bf9ffb3e7b065b59e170c25d72.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/62ec55bf9ffb3e7b065b59e170c25d72_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #31",
                "title": "[CBS 영상 #31] CBS 폴리백·소형 택배 화물 밀착 제어 및 정밀 투입 실증",
                "desc": "마찰력이 낮거나 가벼운 비닐 폴리백 화물도 정전기 방지 및 고마찰 벨트 제어를 통해 미끄러짐 없이 정밀하게 목표 슈트로 안착시키는 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-32",
                "folder": "CBS",
                "index": 32,
                "fileName": "67f6ac904af1b4d993c01286e1839ad0.mp4",
                "src": "assets/reference/CBS/67f6ac904af1b4d993c01286e1839ad0.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/67f6ac904af1b4d993c01286e1839ad0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #32",
                "title": "[CBS 영상 #32] CBS 메인 구동부 저소음 서보 제어 및 연속 순환 시운전",
                "desc": "고효율 리니어/서보 구동 메커니즘을 적용하여 고속 가동 시에도 소음과 마모를 최소화하고 24시간 무중단 연속 운전 신뢰성을 검증하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-33",
                "folder": "CBS",
                "index": 33,
                "fileName": "88b4e5c050499b1a15e145703477cfdc.mp4",
                "src": "assets/reference/CBS/88b4e5c050499b1a15e145703477cfdc.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/88b4e5c050499b1a15e145703477cfdc_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #33",
                "title": "[CBS 영상 #33] CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-34",
                "folder": "CBS",
                "index": 34,
                "fileName": "1867f10d644de944b105286163a70603.mp4",
                "src": "assets/reference/CBS/1867f10d644de944b105286163a70603.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/1867f10d644de944b105286163a70603_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #34",
                "title": "[CBS 영상 #34] CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-35",
                "folder": "CBS",
                "index": 35,
                "fileName": "2244a443df7700f4cd2bf1406e3d95da.mp4",
                "src": "assets/reference/CBS/2244a443df7700f4cd2bf1406e3d95da.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/2244a443df7700f4cd2bf1406e3d95da_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #35",
                "title": "[CBS 영상 #35] CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-36",
                "folder": "CBS",
                "index": 36,
                "fileName": "3493e305fce0324edd0b47a3296ab8f0.mp4",
                "src": "assets/reference/CBS/3493e305fce0324edd0b47a3296ab8f0.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/3493e305fce0324edd0b47a3296ab8f0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #36",
                "title": "[CBS 영상 #36] CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-37",
                "folder": "CBS",
                "index": 37,
                "fileName": "4237c4dbe1f6e506ff631a1002b0fa59.mp4",
                "src": "assets/reference/CBS/4237c4dbe1f6e506ff631a1002b0fa59.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/42d6c724a9fcaf0b43125cfe296f502d.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #37",
                "title": "[CBS 영상 #37] CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-38",
                "folder": "CBS",
                "index": 38,
                "fileName": "6872d7c9c41244d64199c63e417aa2ad.mp4",
                "src": "assets/reference/CBS/6872d7c9c41244d64199c63e417aa2ad.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/6872d7c9c41244d64199c63e417aa2ad_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #38",
                "title": "[CBS 영상 #38] CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-39",
                "folder": "CBS",
                "index": 39,
                "fileName": "7707fb5252d4d29bba4d81632aedefe4.mp4",
                "src": "assets/reference/CBS/7707fb5252d4d29bba4d81632aedefe4.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/60da705934839af78196bff8841fd11d.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #39",
                "title": "[CBS 영상 #39] CBS 폴리백·소형 택배 화물 밀착 제어 및 정밀 투입 실증",
                "desc": "마찰력이 낮거나 가벼운 비닐 폴리백 화물도 정전기 방지 및 고마찰 벨트 제어를 통해 미끄러짐 없이 정밀하게 목표 슈트로 안착시키는 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-40",
                "folder": "CBS",
                "index": 40,
                "fileName": "07929b815d9c078215f82bd8f1bdab4e.mp4",
                "src": "assets/reference/CBS/07929b815d9c078215f82bd8f1bdab4e.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/07929b815d9c078215f82bd8f1bdab4e.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #40",
                "title": "[CBS 영상 #40] CBS 메인 구동부 저소음 서보 제어 및 연속 순환 시운전",
                "desc": "고효율 리니어/서보 구동 메커니즘을 적용하여 고속 가동 시에도 소음과 마모를 최소화하고 24시간 무중단 연속 운전 신뢰성을 검증하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-41",
                "folder": "CBS",
                "index": 41,
                "fileName": "12206f97a035f5710944e6b99f3da22f.mp4",
                "src": "assets/reference/CBS/12206f97a035f5710944e6b99f3da22f.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/12206f97a035f5710944e6b99f3da22f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #41",
                "title": "[CBS 영상 #41] CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-42",
                "folder": "CBS",
                "index": 42,
                "fileName": "383707fbd79758f3082e323d1cb2f611.mp4",
                "src": "assets/reference/CBS/383707fbd79758f3082e323d1cb2f611.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/88b4e5c050499b1a15e145703477cfdc.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #42",
                "title": "[CBS 영상 #42] CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-43",
                "folder": "CBS",
                "index": 43,
                "fileName": "1593504a1df1d27de867ecd906b68b3a.mp4",
                "src": "assets/reference/CBS/1593504a1df1d27de867ecd906b68b3a.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/1593504a1df1d27de867ecd906b68b3a_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #43",
                "title": "[CBS 영상 #43] CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-44",
                "folder": "CBS",
                "index": 44,
                "fileName": "23386730251b4bfc34910e31d7e9c509.mp4",
                "src": "assets/reference/CBS/23386730251b4bfc34910e31d7e9c509.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/23386730251b4bfc34910e31d7e9c509_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #44",
                "title": "[CBS 영상 #44] CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-45",
                "folder": "CBS",
                "index": 45,
                "fileName": "a198e158182f40ac32cbfe7ef765d760.mp4",
                "src": "assets/reference/CBS/a198e158182f40ac32cbfe7ef765d760.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/a198e158182f40ac32cbfe7ef765d760.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #45",
                "title": "[CBS 영상 #45] CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-46",
                "folder": "CBS",
                "index": 46,
                "fileName": "a5360e6b322992add0a9efd4351f193f.mp4",
                "src": "assets/reference/CBS/a5360e6b322992add0a9efd4351f193f.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/a5360e6b322992add0a9efd4351f193f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #46",
                "title": "[CBS 영상 #46] CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-47",
                "folder": "CBS",
                "index": 47,
                "fileName": "a359073e6e336eff70e900fad2bb74d3.mp4",
                "src": "assets/reference/CBS/a359073e6e336eff70e900fad2bb74d3.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/7976f69887ba1372b61249ff7f90e21b.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #47",
                "title": "[CBS 영상 #47] CBS 폴리백·소형 택배 화물 밀착 제어 및 정밀 투입 실증",
                "desc": "마찰력이 낮거나 가벼운 비닐 폴리백 화물도 정전기 방지 및 고마찰 벨트 제어를 통해 미끄러짐 없이 정밀하게 목표 슈트로 안착시키는 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-48",
                "folder": "CBS",
                "index": 48,
                "fileName": "abb16b741cd8e8f0480041d29f2c874f.mp4",
                "src": "assets/reference/CBS/abb16b741cd8e8f0480041d29f2c874f.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/abb16b741cd8e8f0480041d29f2c874f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #48",
                "title": "[CBS 영상 #48] CBS 메인 구동부 저소음 서보 제어 및 연속 순환 시운전",
                "desc": "고효율 리니어/서보 구동 메커니즘을 적용하여 고속 가동 시에도 소음과 마모를 최소화하고 24시간 무중단 연속 운전 신뢰성을 검증하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-49",
                "folder": "CBS",
                "index": 49,
                "fileName": "b54ddb26f5276c779f332c07c57346c5.mp4",
                "src": "assets/reference/CBS/b54ddb26f5276c779f332c07c57346c5.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/b54ddb26f5276c779f332c07c57346c5_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #49",
                "title": "[CBS 영상 #49] CBS 순환 루프 라인 초고속 연속 분류 가동",
                "desc": "독립 제어되는 크로스벨트 캐리어가 주행 중 정확한 타이밍에 벨트를 구동하여 양측 배출 슈트로 화물을 오차 없이 고속 분기하는 실제 가동 영상입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-50",
                "folder": "CBS",
                "index": 50,
                "fileName": "cb1b87092ff3f000d034372211d10580.mp4",
                "src": "assets/reference/CBS/cb1b87092ff3f000d034372211d10580.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/cb1b87092ff3f000d034372211d10580_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #50",
                "title": "[CBS 영상 #50] CBS 다열 인덕션(Induction) 자동 정렬 및 고속 합류 구간",
                "desc": "복수의 투입 컨베이어에서 진입하는 화물의 간격과 진입 각도를 정밀 제어하여 메인 크로스벨트 소터 캐리어 중앙에 정확히 안착시키는 인덕션 가동 장면입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-51",
                "folder": "CBS",
                "index": 51,
                "fileName": "ce9c62dff9b9d8ca2d7159bcd233c9b0.mp4",
                "src": "assets/reference/CBS/ce9c62dff9b9d8ca2d7159bcd233c9b0.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/ce9c62dff9b9d8ca2d7159bcd233c9b0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #51",
                "title": "[CBS 영상 #51] CBS 곡선(Curve) 주행 구간 및 오렌지 마대 슈트 연속 배출",
                "desc": "고속 순환 루프의 곡선 레일 구간에서도 흔들림 없는 저진동 주행 성능을 유지하며, 하단 집하 마대 슈트로 폴리백과 박스를 연속 배출하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-52",
                "folder": "CBS",
                "index": 52,
                "fileName": "f65c8339e63a4af68c6317986a5195db.mp4",
                "src": "assets/reference/CBS/f65c8339e63a4af68c6317986a5195db.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/f65c8339e63a4af68c6317986a5195db_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #52",
                "title": "[CBS 영상 #52] CBS 양방향 대용량 경사 슈트 및 하부 반출 라인 연동",
                "desc": "소터 상부에서 분기된 화물이 완충 설계된 경사 슈트를 타고 하부 집하 라인으로 파손 없이 부드럽게 슬라이딩 배출되는 공정입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-53",
                "folder": "CBS",
                "index": 53,
                "fileName": "fb2f1b747a7ff1ebda5da2650bc0a754.mp4",
                "src": "assets/reference/CBS/fb2f1b747a7ff1ebda5da2650bc0a754.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/a5360e6b322992add0a9efd4351f193f.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #53",
                "title": "[CBS 영상 #53] CBS 5면 비전 바코드 스캐너 및 실시간 WCS 목적지 할당",
                "desc": "고속 주행하는 캐리어 상단 화물의 바코드와 체적을 실시간 판독하여 최적의 목적지 슈트로 즉시 분기 명령을 하달하는 스마트 제어 구간입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-vid-54",
                "folder": "CBS",
                "index": 54,
                "fileName": "ff729e8756efdca4d8862ab83ff8d047.mp4",
                "src": "assets/reference/CBS/ff729e8756efdca4d8862ab83ff8d047.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.mp4",
                "thumb": "assets/reference/CBS/ff729e8756efdca4d8862ab83ff8d047_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장영상 #54",
                "title": "[CBS 영상 #54] CBS 복층 메자닌(Mezzanine) 구조 대형 물류센터 통합 가동",
                "desc": "공간 활용도를 극대화한 2층 메자닌 상부 소터 라인과 1층 출고 슈트 라인이 유기적으로 결합되어 대량 물동량을 막힘없이 처리하는 현장입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            }
        ],
        "photos": [
            {
                "id": "CBS-pho-1",
                "folder": "CBS",
                "index": 1,
                "fileName": "CBS (1).jpg",
                "src": "assets/reference/CBS/CBS (1).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (1).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (1)",
                "title": "[CBS 사진 #01] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-2",
                "folder": "CBS",
                "index": 2,
                "fileName": "CBS (2).jpg",
                "src": "assets/reference/CBS/CBS (2).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (2).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (2)",
                "title": "[CBS 사진 #02] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-3",
                "folder": "CBS",
                "index": 3,
                "fileName": "CBS (3).jpg",
                "src": "assets/reference/CBS/CBS (3).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (3).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (3)",
                "title": "[CBS 사진 #03] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-4",
                "folder": "CBS",
                "index": 4,
                "fileName": "CBS (4).jpg",
                "src": "assets/reference/CBS/CBS (4).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (4).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (4)",
                "title": "[CBS 사진 #04] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-5",
                "folder": "CBS",
                "index": 5,
                "fileName": "CBS (7).jpg",
                "src": "assets/reference/CBS/CBS (7).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (7).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (7)",
                "title": "[CBS 사진 #05] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-6",
                "folder": "CBS",
                "index": 6,
                "fileName": "CBS (10).jpg",
                "src": "assets/reference/CBS/CBS (10).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (10).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (10)",
                "title": "[CBS 사진 #06] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-7",
                "folder": "CBS",
                "index": 7,
                "fileName": "CBS (11).jpg",
                "src": "assets/reference/CBS/CBS (11).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (11).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (11)",
                "title": "[CBS 사진 #07] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-8",
                "folder": "CBS",
                "index": 8,
                "fileName": "CBS (12).jpg",
                "src": "assets/reference/CBS/CBS (12).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (12).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (12)",
                "title": "[CBS 사진 #08] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-9",
                "folder": "CBS",
                "index": 9,
                "fileName": "CBS (13).jpg",
                "src": "assets/reference/CBS/CBS (13).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (13).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (13)",
                "title": "[CBS 사진 #09] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-10",
                "folder": "CBS",
                "index": 10,
                "fileName": "CBS (14).jpg",
                "src": "assets/reference/CBS/CBS (14).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (14).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (14)",
                "title": "[CBS 사진 #10] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-11",
                "folder": "CBS",
                "index": 11,
                "fileName": "CBS (15).jpg",
                "src": "assets/reference/CBS/CBS (15).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (15).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (15)",
                "title": "[CBS 사진 #11] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-12",
                "folder": "CBS",
                "index": 12,
                "fileName": "CBS (16).jpg",
                "src": "assets/reference/CBS/CBS (16).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (16).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (16)",
                "title": "[CBS 사진 #12] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-13",
                "folder": "CBS",
                "index": 13,
                "fileName": "CBS (17).jpg",
                "src": "assets/reference/CBS/CBS (17).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (17).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (17)",
                "title": "[CBS 사진 #13] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-14",
                "folder": "CBS",
                "index": 14,
                "fileName": "CBS (18).jpg",
                "src": "assets/reference/CBS/CBS (18).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (18).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (18)",
                "title": "[CBS 사진 #14] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-15",
                "folder": "CBS",
                "index": 15,
                "fileName": "CBS (19).jpg",
                "src": "assets/reference/CBS/CBS (19).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (19).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (19)",
                "title": "[CBS 사진 #15] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-16",
                "folder": "CBS",
                "index": 16,
                "fileName": "CBS (20).jpg",
                "src": "assets/reference/CBS/CBS (20).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (20).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (20)",
                "title": "[CBS 사진 #16] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-17",
                "folder": "CBS",
                "index": 17,
                "fileName": "CBS (21).jpg",
                "src": "assets/reference/CBS/CBS (21).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (21).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (21)",
                "title": "[CBS 사진 #17] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-18",
                "folder": "CBS",
                "index": 18,
                "fileName": "CBS (22).jpg",
                "src": "assets/reference/CBS/CBS (22).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (22).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (22)",
                "title": "[CBS 사진 #18] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-19",
                "folder": "CBS",
                "index": 19,
                "fileName": "CBS (23).jpg",
                "src": "assets/reference/CBS/CBS (23).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (23).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (23)",
                "title": "[CBS 사진 #19] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-20",
                "folder": "CBS",
                "index": 20,
                "fileName": "CBS (24).jpg",
                "src": "assets/reference/CBS/CBS (24).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (24).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (24)",
                "title": "[CBS 사진 #20] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-21",
                "folder": "CBS",
                "index": 21,
                "fileName": "CBS (25).jpg",
                "src": "assets/reference/CBS/CBS (25).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (25).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (25)",
                "title": "[CBS 사진 #21] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-22",
                "folder": "CBS",
                "index": 22,
                "fileName": "CBS (26).jpg",
                "src": "assets/reference/CBS/CBS (26).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (26).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (26)",
                "title": "[CBS 사진 #22] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-23",
                "folder": "CBS",
                "index": 23,
                "fileName": "CBS (27).jpg",
                "src": "assets/reference/CBS/CBS (27).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (27).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (27)",
                "title": "[CBS 사진 #23] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-24",
                "folder": "CBS",
                "index": 24,
                "fileName": "CBS (28).jpg",
                "src": "assets/reference/CBS/CBS (28).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (28).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (28)",
                "title": "[CBS 사진 #24] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-25",
                "folder": "CBS",
                "index": 25,
                "fileName": "CBS (29).jpg",
                "src": "assets/reference/CBS/CBS (29).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (29).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (29)",
                "title": "[CBS 사진 #25] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-26",
                "folder": "CBS",
                "index": 26,
                "fileName": "CBS (30).jpg",
                "src": "assets/reference/CBS/CBS (30).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (30).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (30)",
                "title": "[CBS 사진 #26] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-27",
                "folder": "CBS",
                "index": 27,
                "fileName": "CBS (31).jpg",
                "src": "assets/reference/CBS/CBS (31).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (31).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (31)",
                "title": "[CBS 사진 #27] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-28",
                "folder": "CBS",
                "index": 28,
                "fileName": "CBS (32).jpg",
                "src": "assets/reference/CBS/CBS (32).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (32).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (32)",
                "title": "[CBS 사진 #28] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-29",
                "folder": "CBS",
                "index": 29,
                "fileName": "CBS (33).jpg",
                "src": "assets/reference/CBS/CBS (33).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (33).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (33)",
                "title": "[CBS 사진 #29] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-30",
                "folder": "CBS",
                "index": 30,
                "fileName": "CBS (34).jpg",
                "src": "assets/reference/CBS/CBS (34).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (34).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (34)",
                "title": "[CBS 사진 #30] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-31",
                "folder": "CBS",
                "index": 31,
                "fileName": "CBS (36).jpg",
                "src": "assets/reference/CBS/CBS (36).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (36).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (36)",
                "title": "[CBS 사진 #31] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-32",
                "folder": "CBS",
                "index": 32,
                "fileName": "CBS (37).jpg",
                "src": "assets/reference/CBS/CBS (37).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/CBS (37).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS (37)",
                "title": "[CBS 사진 #32] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-33",
                "folder": "CBS",
                "index": 33,
                "fileName": "2b6cf217771de4fd47f3133aba3a8096.jpg",
                "src": "assets/reference/CBS/2b6cf217771de4fd47f3133aba3a8096.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/2b6cf217771de4fd47f3133aba3a8096.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #33",
                "title": "[CBS 사진 #33] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-34",
                "folder": "CBS",
                "index": 34,
                "fileName": "2ff9531d28bd45fc03381bd8a692e404.jpg",
                "src": "assets/reference/CBS/2ff9531d28bd45fc03381bd8a692e404.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/2ff9531d28bd45fc03381bd8a692e404_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #34",
                "title": "[CBS 사진 #34] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-35",
                "folder": "CBS",
                "index": 35,
                "fileName": "3c6c07a76684c3f3d4978b9a97505980.jpg",
                "src": "assets/reference/CBS/3c6c07a76684c3f3d4978b9a97505980.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/3c6c07a76684c3f3d4978b9a97505980_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #35",
                "title": "[CBS 사진 #35] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-36",
                "folder": "CBS",
                "index": 36,
                "fileName": "7e85e2c885de63688b4d15cfc5367b54.jpg",
                "src": "assets/reference/CBS/7e85e2c885de63688b4d15cfc5367b54.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/7e85e2c885de63688b4d15cfc5367b54_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #36",
                "title": "[CBS 사진 #36] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-37",
                "folder": "CBS",
                "index": 37,
                "fileName": "42d6c724a9fcaf0b43125cfe296f502d.jpg",
                "src": "assets/reference/CBS/42d6c724a9fcaf0b43125cfe296f502d.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/42d6c724a9fcaf0b43125cfe296f502d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #37",
                "title": "[CBS 사진 #37] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-38",
                "folder": "CBS",
                "index": 38,
                "fileName": "47f33e193ec71d8b317df4d7f1943a80.jpg",
                "src": "assets/reference/CBS/47f33e193ec71d8b317df4d7f1943a80.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/47f33e193ec71d8b317df4d7f1943a80_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #38",
                "title": "[CBS 사진 #38] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-39",
                "folder": "CBS",
                "index": 39,
                "fileName": "60da705934839af78196bff8841fd11d.jpg",
                "src": "assets/reference/CBS/60da705934839af78196bff8841fd11d.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/60da705934839af78196bff8841fd11d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #39",
                "title": "[CBS 사진 #39] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-40",
                "folder": "CBS",
                "index": 40,
                "fileName": "62ec55bf9ffb3e7b065b59e170c25d72.jpg",
                "src": "assets/reference/CBS/62ec55bf9ffb3e7b065b59e170c25d72.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/62ec55bf9ffb3e7b065b59e170c25d72_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #40",
                "title": "[CBS 사진 #40] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-41",
                "folder": "CBS",
                "index": 41,
                "fileName": "67f6ac904af1b4d993c01286e1839ad0.jpg",
                "src": "assets/reference/CBS/67f6ac904af1b4d993c01286e1839ad0.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/67f6ac904af1b4d993c01286e1839ad0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #41",
                "title": "[CBS 사진 #41] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-42",
                "folder": "CBS",
                "index": 42,
                "fileName": "88b4e5c050499b1a15e145703477cfdc.jpg",
                "src": "assets/reference/CBS/88b4e5c050499b1a15e145703477cfdc.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/88b4e5c050499b1a15e145703477cfdc_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #42",
                "title": "[CBS 사진 #42] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-43",
                "folder": "CBS",
                "index": 43,
                "fileName": "1867f10d644de944b105286163a70603.jpg",
                "src": "assets/reference/CBS/1867f10d644de944b105286163a70603.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/1867f10d644de944b105286163a70603_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #43",
                "title": "[CBS 사진 #43] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-44",
                "folder": "CBS",
                "index": 44,
                "fileName": "2244a443df7700f4cd2bf1406e3d95da.jpg",
                "src": "assets/reference/CBS/2244a443df7700f4cd2bf1406e3d95da.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/2244a443df7700f4cd2bf1406e3d95da_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #44",
                "title": "[CBS 사진 #44] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-45",
                "folder": "CBS",
                "index": 45,
                "fileName": "3493e305fce0324edd0b47a3296ab8f0.jpg",
                "src": "assets/reference/CBS/3493e305fce0324edd0b47a3296ab8f0.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/3493e305fce0324edd0b47a3296ab8f0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #45",
                "title": "[CBS 사진 #45] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-46",
                "folder": "CBS",
                "index": 46,
                "fileName": "07929b815d9c078215f82bd8f1bdab4e.jpg",
                "src": "assets/reference/CBS/07929b815d9c078215f82bd8f1bdab4e.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/07929b815d9c078215f82bd8f1bdab4e.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #46",
                "title": "[CBS 사진 #46] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-47",
                "folder": "CBS",
                "index": 47,
                "fileName": "7976f69887ba1372b61249ff7f90e21b.jpg",
                "src": "assets/reference/CBS/7976f69887ba1372b61249ff7f90e21b.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/7976f69887ba1372b61249ff7f90e21b_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #47",
                "title": "[CBS 사진 #47] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-48",
                "folder": "CBS",
                "index": 48,
                "fileName": "926005b29f6feb06b0c64d437f4c24a0.jpg",
                "src": "assets/reference/CBS/926005b29f6feb06b0c64d437f4c24a0.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/926005b29f6feb06b0c64d437f4c24a0.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #48",
                "title": "[CBS 사진 #48] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-49",
                "folder": "CBS",
                "index": 49,
                "fileName": "1593504a1df1d27de867ecd906b68b3a.jpg",
                "src": "assets/reference/CBS/1593504a1df1d27de867ecd906b68b3a.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/1593504a1df1d27de867ecd906b68b3a_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #49",
                "title": "[CBS 사진 #49] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-50",
                "folder": "CBS",
                "index": 50,
                "fileName": "23386730251b4bfc34910e31d7e9c509.jpg",
                "src": "assets/reference/CBS/23386730251b4bfc34910e31d7e9c509.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/23386730251b4bfc34910e31d7e9c509_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #50",
                "title": "[CBS 사진 #50] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-51",
                "folder": "CBS",
                "index": 51,
                "fileName": "a16b9e2219b873c32272e2bf33f09d34.jpg",
                "src": "assets/reference/CBS/a16b9e2219b873c32272e2bf33f09d34.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/a16b9e2219b873c32272e2bf33f09d34.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #51",
                "title": "[CBS 사진 #51] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-52",
                "folder": "CBS",
                "index": 52,
                "fileName": "a198e158182f40ac32cbfe7ef765d760.jpg",
                "src": "assets/reference/CBS/a198e158182f40ac32cbfe7ef765d760.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/a198e158182f40ac32cbfe7ef765d760.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #52",
                "title": "[CBS 사진 #52] CBS 스파이럴 경사 슈트 및 하부 출고 컨베이어 연계 구조",
                "desc": "상층부 소터에서 분류된 화물이 충격 완화 곡선 슈트를 통해 하층부 패킹·출고 스테이션으로 즉시 연결되는 입체 물류 구조입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-53",
                "folder": "CBS",
                "index": 53,
                "fileName": "a5360e6b322992add0a9efd4351f193f.jpg",
                "src": "assets/reference/CBS/a5360e6b322992add0a9efd4351f193f.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/a5360e6b322992add0a9efd4351f193f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #53",
                "title": "[CBS 사진 #53] CBS 캐리어 셀 유닛 및 정밀 가이드 레일 디테일",
                "desc": "내구성이 뛰어난 모듈형 크로스벨트 캐리어와 정밀 가공된 알루미늄/스틸 트랙이 결합되어 고속 주행 안정성을 보장합니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-54",
                "folder": "CBS",
                "index": 54,
                "fileName": "ce9c62dff9b9d8ca2d7159bcd233c9b0.jpg",
                "src": "assets/reference/CBS/ce9c62dff9b9d8ca2d7159bcd233c9b0.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/ce9c62dff9b9d8ca2d7159bcd233c9b0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #54",
                "title": "[CBS 사진 #54] 대형 풀필먼트 센터 CBS 전체 라인업 및 메자닌 플랫폼",
                "desc": "수백 미터 규모의 대형 물류 터미널 내부를 가로지르는 CBS 메인 라인과 안전 점검용 옐로우 핸드레일 캣워크(Catwalk) 구축 전경입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-55",
                "folder": "CBS",
                "index": 55,
                "fileName": "e7fc8b4e2a54317b5bb0f49d095d832e.jpg",
                "src": "assets/reference/CBS/e7fc8b4e2a54317b5bb0f49d095d832e.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/e7fc8b4e2a54317b5bb0f49d095d832e_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #55",
                "title": "[CBS 사진 #55] CBS 양방향 다단 배출 슈트 및 상부 주행 트랙 전경",
                "desc": "메인 크로스벨트 소터 라인 양측으로 촘촘하게 배치된 대용량 블루·그레이 배출 슈트와 상부 철골 점검 통로가 정교하게 시공된 모습입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-56",
                "folder": "CBS",
                "index": 56,
                "fileName": "e50b034620801b497d73a58e3e636400.jpg",
                "src": "assets/reference/CBS/e50b034620801b497d73a58e3e636400.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/e50b034620801b497d73a58e3e636400_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #56",
                "title": "[CBS 사진 #56] CBS 루프 곡선 구간 및 오렌지 집하 마대 슈트 라인",
                "desc": "곡선부 외측과 내측 공간을 모두 활용하여 집하 마대(Bag) 슈트를 고밀도로 배치함으로써 단위 면적당 분류 목적지 수를 극대화한 설계입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            },
            {
                "id": "CBS-pho-57",
                "folder": "CBS",
                "index": 57,
                "fileName": "f65c8339e63a4af68c6317986a5195db.jpg",
                "src": "assets/reference/CBS/f65c8339e63a4af68c6317986a5195db.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "thumb": "assets/reference/CBS/f65c8339e63a4af68c6317986a5195db_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/CBS.jpg",
                "clipCode": "CBS 현장포토 #57",
                "title": "[CBS 사진 #57] CBS 고속 인덕션 합류 라인 및 제어 패널 구축 현장",
                "desc": "작업자 투입대에서 정렬된 화물이 고속 벨트를 거쳐 메인 소터로 자동 진입하는 인덕션 모듈과 현장 안전 가드 레이아웃입니다.",
                "tags": [
                    "Cross Belt Sorter",
                    "고속 인덕션 투입",
                    "양방향 슈트 분기",
                    "풀필먼트 허브"
                ]
            }
        ]
    },
    "NC CBS": {
        "id": "NC CBS",
        "title": "NC CBS",
        "subtitle": "NC CBS [NC Cross Belt Sorter] — 고밀도 비접촉 제어 크로스벨트 소터",
        "badge": "NARROW-CELL / NON-CONTACT CBS",
        "icon": "fa-bolt-lightning",
        "overview": "초고속 택배 메가 터미널 및 좁은 공간의 상하 복층(Double-Deck) 구조에 최적화된 NC CBS(고밀도 비접촉식 크로스벨트 소터) 현장입니다. 비접촉 전원·통신 제어와 좁은 셀 피치(Narrow-Cell) 설계를 통해 소형·중형 화물의 시간당 처리량을 극대화하고 유지보수 비용을 획기적으로 절감합니다.",
        "tags": [
            "NC CBS",
            "비접촉 급전/통신",
            "복층 고밀도 분류",
            "초고속 택배 터미널"
        ],
        "videoTemplates": [
            {
                "title": "NC CBS 초고속 연속 화물 투입 및 정밀 슈트 분기 가동",
                "desc": "촘촘한 캐리어 간격으로 연속 주행하며 소형 박스와 폴리백을 지정된 슈트로 오차 없이 초고속 타격·배출하는 NC CBS 핵심 가동 영상입니다."
            },
            {
                "title": "NC CBS 상·하 복층 구조 공간 절약형 고속 소팅 라인",
                "desc": "제한된 물류센터 바닥 면적에서 분류 용량을 2배로 확장하기 위해 설계된 고밀도 복층 NC CBS 라인의 연속 순환 운전 모습입니다."
            },
            {
                "title": "NC CBS 다채널 인덕션 연속 동기화 투입 메커니즘",
                "desc": "고속으로 지나가는 캐리어의 빈 셀(Cell) 위치를 실시간 추적하여 인덕션 컨베이어가 화물을 정확한 타이밍에 밀어 넣는 동기화 제어 현장입니다."
            },
            {
                "title": "NC CBS 오버헤드 바코드 비전 판독 및 무정지 고속 분류",
                "desc": "상부 아치형 스캐너 게이트를 통과하는 즉시 화물 정보를 인식하고 수십 개의 세분화된 슈트로 지체 없이 분기하는 모습입니다."
            },
            {
                "title": "NC CBS 경사 마대 슈트 연속 적재 및 대량 물동량 소화",
                "desc": "피크 타임의 쏟아지는 택배 물동량을 정체 없이 양측 마대 슈트로 연속 분산 배출하는 고부하 실증 가동 영상입니다."
            },
            {
                "title": "NC CBS 비접촉 구동 모듈 정밀 제어 및 시운전 테스트",
                "desc": "기계적 마찰 부품을 줄인 비접촉 제어 방식을 통해 저소음·저발열 상태에서 장시간 안정적으로 고속 회전하는 설비 검증 영상입니다."
            }
        ],
        "photoTemplates": [
            {
                "title": "NC CBS 고밀도 셀(Cell) 라인 및 정밀 하부 프레임 구조",
                "desc": "정밀하게 정렬된 NC CBS 캐리어 라인과 견고한 구조용 스틸 프레임, 하부 안전 방호 커버가 일체감 있게 구축된 현장 사진입니다."
            },
            {
                "title": "NC CBS 양방향 밀집형 슈트 및 집하 스테이션 전경",
                "desc": "좁은 간격으로 설계된 다수의 목적지 슈트가 배열되어 권역별·배송지별 세밀한 분류를 수행하는 터미널 내부 모습입니다."
            },
            {
                "title": "NC CBS 인덕션 공급 라인 및 상부 스캐닝 아치 설비",
                "desc": "화물 자동 정렬 컨베이어와 고정밀 바코드 판독 카메라 모듈이 결합된 투입부 엔지니어링 구성입니다."
            },
            {
                "title": "NC CBS 모듈러 프레임 조립 및 정밀 가이드 레일 마감",
                "desc": "현장 유지보수와 확장이 용이하도록 모듈화 설계된 가이드 트랙과 깔끔한 배선·센서 브라켓 마감 디테일입니다."
            }
        ],
        "videoCount": 24,
        "photoCount": 20,
        "videos": [
            {
                "id": "NC CBS-vid-1",
                "folder": "NC CBS",
                "index": 1,
                "fileName": "CBS (3).mp4",
                "src": "assets/reference/NC CBS/CBS (3).mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/3b5bce4584a8c0458490830189e7ef6a.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "CBS (3)",
                "title": "[NC CBS 영상 #01] NC CBS 초고속 연속 화물 투입 및 정밀 슈트 분기 가동",
                "desc": "촘촘한 캐리어 간격으로 연속 주행하며 소형 박스와 폴리백을 지정된 슈트로 오차 없이 초고속 타격·배출하는 NC CBS 핵심 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-2",
                "folder": "NC CBS",
                "index": 2,
                "fileName": "3b5bce4584a8c0458490830189e7ef6a.mp4",
                "src": "assets/reference/NC CBS/3b5bce4584a8c0458490830189e7ef6a.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/3b5bce4584a8c0458490830189e7ef6a_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #02",
                "title": "[NC CBS 영상 #02] NC CBS 상·하 복층 구조 공간 절약형 고속 소팅 라인",
                "desc": "제한된 물류센터 바닥 면적에서 분류 용량을 2배로 확장하기 위해 설계된 고밀도 복층 NC CBS 라인의 연속 순환 운전 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-3",
                "folder": "NC CBS",
                "index": 3,
                "fileName": "6f9f2d179a3280ff68b538ae37e15160.mp4",
                "src": "assets/reference/NC CBS/6f9f2d179a3280ff68b538ae37e15160.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/6f9f2d179a3280ff68b538ae37e15160_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #03",
                "title": "[NC CBS 영상 #03] NC CBS 다채널 인덕션 연속 동기화 투입 메커니즘",
                "desc": "고속으로 지나가는 캐리어의 빈 셀(Cell) 위치를 실시간 추적하여 인덕션 컨베이어가 화물을 정확한 타이밍에 밀어 넣는 동기화 제어 현장입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-4",
                "folder": "NC CBS",
                "index": 4,
                "fileName": "7b2836187c4d7660d62b85a601656754.mp4",
                "src": "assets/reference/NC CBS/7b2836187c4d7660d62b85a601656754.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/7b2836187c4d7660d62b85a601656754_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #04",
                "title": "[NC CBS 영상 #04] NC CBS 오버헤드 바코드 비전 판독 및 무정지 고속 분류",
                "desc": "상부 아치형 스캐너 게이트를 통과하는 즉시 화물 정보를 인식하고 수십 개의 세분화된 슈트로 지체 없이 분기하는 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-5",
                "folder": "NC CBS",
                "index": 5,
                "fileName": "9d9694328c17437cc9a5b05fab039dc7.mp4",
                "src": "assets/reference/NC CBS/9d9694328c17437cc9a5b05fab039dc7.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/9d9694328c17437cc9a5b05fab039dc7_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #05",
                "title": "[NC CBS 영상 #05] NC CBS 경사 마대 슈트 연속 적재 및 대량 물동량 소화",
                "desc": "피크 타임의 쏟아지는 택배 물동량을 정체 없이 양측 마대 슈트로 연속 분산 배출하는 고부하 실증 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-6",
                "folder": "NC CBS",
                "index": 6,
                "fileName": "34b4130a4f19b80f5c138ee587b6821e.mp4",
                "src": "assets/reference/NC CBS/34b4130a4f19b80f5c138ee587b6821e.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/34b4130a4f19b80f5c138ee587b6821e_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #06",
                "title": "[NC CBS 영상 #06] NC CBS 비접촉 구동 모듈 정밀 제어 및 시운전 테스트",
                "desc": "기계적 마찰 부품을 줄인 비접촉 제어 방식을 통해 저소음·저발열 상태에서 장시간 안정적으로 고속 회전하는 설비 검증 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-7",
                "folder": "NC CBS",
                "index": 7,
                "fileName": "237c669ebd51dce526d74b927eb1aeec.mp4",
                "src": "assets/reference/NC CBS/237c669ebd51dce526d74b927eb1aeec.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/237c669ebd51dce526d74b927eb1aeec_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #07",
                "title": "[NC CBS 영상 #07] NC CBS 초고속 연속 화물 투입 및 정밀 슈트 분기 가동",
                "desc": "촘촘한 캐리어 간격으로 연속 주행하며 소형 박스와 폴리백을 지정된 슈트로 오차 없이 초고속 타격·배출하는 NC CBS 핵심 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-8",
                "folder": "NC CBS",
                "index": 8,
                "fileName": "314b72f52ecff09c8932e6734f240c86.mp4",
                "src": "assets/reference/NC CBS/314b72f52ecff09c8932e6734f240c86.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/314b72f52ecff09c8932e6734f240c86_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #08",
                "title": "[NC CBS 영상 #08] NC CBS 상·하 복층 구조 공간 절약형 고속 소팅 라인",
                "desc": "제한된 물류센터 바닥 면적에서 분류 용량을 2배로 확장하기 위해 설계된 고밀도 복층 NC CBS 라인의 연속 순환 운전 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-9",
                "folder": "NC CBS",
                "index": 9,
                "fileName": "31694f942d7b53564e534b669df0a0bf.mp4",
                "src": "assets/reference/NC CBS/31694f942d7b53564e534b669df0a0bf.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/31694f942d7b53564e534b669df0a0bf_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #09",
                "title": "[NC CBS 영상 #09] NC CBS 다채널 인덕션 연속 동기화 투입 메커니즘",
                "desc": "고속으로 지나가는 캐리어의 빈 셀(Cell) 위치를 실시간 추적하여 인덕션 컨베이어가 화물을 정확한 타이밍에 밀어 넣는 동기화 제어 현장입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-10",
                "folder": "NC CBS",
                "index": 10,
                "fileName": "41092a0d4edc46f6cd8b7160b63b3d02.mp4",
                "src": "assets/reference/NC CBS/41092a0d4edc46f6cd8b7160b63b3d02.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/41092a0d4edc46f6cd8b7160b63b3d02_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #10",
                "title": "[NC CBS 영상 #10] NC CBS 오버헤드 바코드 비전 판독 및 무정지 고속 분류",
                "desc": "상부 아치형 스캐너 게이트를 통과하는 즉시 화물 정보를 인식하고 수십 개의 세분화된 슈트로 지체 없이 분기하는 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-11",
                "folder": "NC CBS",
                "index": 11,
                "fileName": "68283c6d9c6636c00b6580b63f3e8db8.mp4",
                "src": "assets/reference/NC CBS/68283c6d9c6636c00b6580b63f3e8db8.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/a37edacfac859c620df9b4c0455357a1.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #11",
                "title": "[NC CBS 영상 #11] NC CBS 경사 마대 슈트 연속 적재 및 대량 물동량 소화",
                "desc": "피크 타임의 쏟아지는 택배 물동량을 정체 없이 양측 마대 슈트로 연속 분산 배출하는 고부하 실증 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-12",
                "folder": "NC CBS",
                "index": 12,
                "fileName": "07970052f53d836064de32c1db35e4af.mp4",
                "src": "assets/reference/NC CBS/07970052f53d836064de32c1db35e4af.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/07970052f53d836064de32c1db35e4af_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #12",
                "title": "[NC CBS 영상 #12] NC CBS 비접촉 구동 모듈 정밀 제어 및 시운전 테스트",
                "desc": "기계적 마찰 부품을 줄인 비접촉 제어 방식을 통해 저소음·저발열 상태에서 장시간 안정적으로 고속 회전하는 설비 검증 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-13",
                "folder": "NC CBS",
                "index": 13,
                "fileName": "a4ad0f75304c10c588146b422273a9d7.mp4",
                "src": "assets/reference/NC CBS/a4ad0f75304c10c588146b422273a9d7.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/a4ad0f75304c10c588146b422273a9d7_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #13",
                "title": "[NC CBS 영상 #13] NC CBS 초고속 연속 화물 투입 및 정밀 슈트 분기 가동",
                "desc": "촘촘한 캐리어 간격으로 연속 주행하며 소형 박스와 폴리백을 지정된 슈트로 오차 없이 초고속 타격·배출하는 NC CBS 핵심 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-14",
                "folder": "NC CBS",
                "index": 14,
                "fileName": "a37edacfac859c620df9b4c0455357a1.mp4",
                "src": "assets/reference/NC CBS/a37edacfac859c620df9b4c0455357a1.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/a37edacfac859c620df9b4c0455357a1_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #14",
                "title": "[NC CBS 영상 #14] NC CBS 상·하 복층 구조 공간 절약형 고속 소팅 라인",
                "desc": "제한된 물류센터 바닥 면적에서 분류 용량을 2배로 확장하기 위해 설계된 고밀도 복층 NC CBS 라인의 연속 순환 운전 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-15",
                "folder": "NC CBS",
                "index": 15,
                "fileName": "b9ed09c256e20094ed42f2c768c3ec8f.mp4",
                "src": "assets/reference/NC CBS/b9ed09c256e20094ed42f2c768c3ec8f.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/b9ed09c256e20094ed42f2c768c3ec8f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #15",
                "title": "[NC CBS 영상 #15] NC CBS 다채널 인덕션 연속 동기화 투입 메커니즘",
                "desc": "고속으로 지나가는 캐리어의 빈 셀(Cell) 위치를 실시간 추적하여 인덕션 컨베이어가 화물을 정확한 타이밍에 밀어 넣는 동기화 제어 현장입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-16",
                "folder": "NC CBS",
                "index": 16,
                "fileName": "c6d1be3427a7fad7e6e6f610e57ea5b2.mp4",
                "src": "assets/reference/NC CBS/c6d1be3427a7fad7e6e6f610e57ea5b2.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/c6d1be3427a7fad7e6e6f610e57ea5b2_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #16",
                "title": "[NC CBS 영상 #16] NC CBS 오버헤드 바코드 비전 판독 및 무정지 고속 분류",
                "desc": "상부 아치형 스캐너 게이트를 통과하는 즉시 화물 정보를 인식하고 수십 개의 세분화된 슈트로 지체 없이 분기하는 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-17",
                "folder": "NC CBS",
                "index": 17,
                "fileName": "d81fce8a3fa6e7bce89f5fad6d18a3ff.mp4",
                "src": "assets/reference/NC CBS/d81fce8a3fa6e7bce89f5fad6d18a3ff.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/d81fce8a3fa6e7bce89f5fad6d18a3ff_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #17",
                "title": "[NC CBS 영상 #17] NC CBS 경사 마대 슈트 연속 적재 및 대량 물동량 소화",
                "desc": "피크 타임의 쏟아지는 택배 물동량을 정체 없이 양측 마대 슈트로 연속 분산 배출하는 고부하 실증 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-18",
                "folder": "NC CBS",
                "index": 18,
                "fileName": "d844bf068cead3a361959044da2207d8.mp4",
                "src": "assets/reference/NC CBS/d844bf068cead3a361959044da2207d8.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/d844bf068cead3a361959044da2207d8_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #18",
                "title": "[NC CBS 영상 #18] NC CBS 비접촉 구동 모듈 정밀 제어 및 시운전 테스트",
                "desc": "기계적 마찰 부품을 줄인 비접촉 제어 방식을 통해 저소음·저발열 상태에서 장시간 안정적으로 고속 회전하는 설비 검증 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-19",
                "folder": "NC CBS",
                "index": 19,
                "fileName": "df49ca11d91e1e6a7c04bf0ad8fff3f9.mp4",
                "src": "assets/reference/NC CBS/df49ca11d91e1e6a7c04bf0ad8fff3f9.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/df49ca11d91e1e6a7c04bf0ad8fff3f9_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #19",
                "title": "[NC CBS 영상 #19] NC CBS 초고속 연속 화물 투입 및 정밀 슈트 분기 가동",
                "desc": "촘촘한 캐리어 간격으로 연속 주행하며 소형 박스와 폴리백을 지정된 슈트로 오차 없이 초고속 타격·배출하는 NC CBS 핵심 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-20",
                "folder": "NC CBS",
                "index": 20,
                "fileName": "e50b034620801b497d73a58e3e636400.mp4",
                "src": "assets/reference/NC CBS/e50b034620801b497d73a58e3e636400.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/f923ad75b87e8090ccaeeb04dacb96ee.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #20",
                "title": "[NC CBS 영상 #20] NC CBS 상·하 복층 구조 공간 절약형 고속 소팅 라인",
                "desc": "제한된 물류센터 바닥 면적에서 분류 용량을 2배로 확장하기 위해 설계된 고밀도 복층 NC CBS 라인의 연속 순환 운전 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-21",
                "folder": "NC CBS",
                "index": 21,
                "fileName": "ea890564626b2c6d1336a4d2ec3a979c.mp4",
                "src": "assets/reference/NC CBS/ea890564626b2c6d1336a4d2ec3a979c.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/ea890564626b2c6d1336a4d2ec3a979c_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #21",
                "title": "[NC CBS 영상 #21] NC CBS 다채널 인덕션 연속 동기화 투입 메커니즘",
                "desc": "고속으로 지나가는 캐리어의 빈 셀(Cell) 위치를 실시간 추적하여 인덕션 컨베이어가 화물을 정확한 타이밍에 밀어 넣는 동기화 제어 현장입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-22",
                "folder": "NC CBS",
                "index": 22,
                "fileName": "ec981c8d21af6b1c101f7fe6fd005980.mp4",
                "src": "assets/reference/NC CBS/ec981c8d21af6b1c101f7fe6fd005980.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/ec981c8d21af6b1c101f7fe6fd005980_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #22",
                "title": "[NC CBS 영상 #22] NC CBS 오버헤드 바코드 비전 판독 및 무정지 고속 분류",
                "desc": "상부 아치형 스캐너 게이트를 통과하는 즉시 화물 정보를 인식하고 수십 개의 세분화된 슈트로 지체 없이 분기하는 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-23",
                "folder": "NC CBS",
                "index": 23,
                "fileName": "f93b5347d1e0b2eea19a762c36b9bbf2.mp4",
                "src": "assets/reference/NC CBS/f93b5347d1e0b2eea19a762c36b9bbf2.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/f93b5347d1e0b2eea19a762c36b9bbf2_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #23",
                "title": "[NC CBS 영상 #23] NC CBS 경사 마대 슈트 연속 적재 및 대량 물동량 소화",
                "desc": "피크 타임의 쏟아지는 택배 물동량을 정체 없이 양측 마대 슈트로 연속 분산 배출하는 고부하 실증 가동 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-vid-24",
                "folder": "NC CBS",
                "index": 24,
                "fileName": "f923ad75b87e8090ccaeeb04dacb96ee.mp4",
                "src": "assets/reference/NC CBS/f923ad75b87e8090ccaeeb04dacb96ee.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.mp4",
                "thumb": "assets/reference/NC CBS/f923ad75b87e8090ccaeeb04dacb96ee_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장영상 #24",
                "title": "[NC CBS 영상 #24] NC CBS 비접촉 구동 모듈 정밀 제어 및 시운전 테스트",
                "desc": "기계적 마찰 부품을 줄인 비접촉 제어 방식을 통해 저소음·저발열 상태에서 장시간 안정적으로 고속 회전하는 설비 검증 영상입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            }
        ],
        "photos": [
            {
                "id": "NC CBS-pho-1",
                "folder": "NC CBS",
                "index": 1,
                "fileName": "3b5bce4584a8c0458490830189e7ef6a.jpg",
                "src": "assets/reference/NC CBS/3b5bce4584a8c0458490830189e7ef6a.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/3b5bce4584a8c0458490830189e7ef6a_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #01",
                "title": "[NC CBS 사진 #01] NC CBS 고밀도 셀(Cell) 라인 및 정밀 하부 프레임 구조",
                "desc": "정밀하게 정렬된 NC CBS 캐리어 라인과 견고한 구조용 스틸 프레임, 하부 안전 방호 커버가 일체감 있게 구축된 현장 사진입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-2",
                "folder": "NC CBS",
                "index": 2,
                "fileName": "6f9f2d179a3280ff68b538ae37e15160.jpg",
                "src": "assets/reference/NC CBS/6f9f2d179a3280ff68b538ae37e15160.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/6f9f2d179a3280ff68b538ae37e15160_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #02",
                "title": "[NC CBS 사진 #02] NC CBS 양방향 밀집형 슈트 및 집하 스테이션 전경",
                "desc": "좁은 간격으로 설계된 다수의 목적지 슈트가 배열되어 권역별·배송지별 세밀한 분류를 수행하는 터미널 내부 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-3",
                "folder": "NC CBS",
                "index": 3,
                "fileName": "7b2836187c4d7660d62b85a601656754.jpg",
                "src": "assets/reference/NC CBS/7b2836187c4d7660d62b85a601656754.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/7b2836187c4d7660d62b85a601656754_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #03",
                "title": "[NC CBS 사진 #03] NC CBS 인덕션 공급 라인 및 상부 스캐닝 아치 설비",
                "desc": "화물 자동 정렬 컨베이어와 고정밀 바코드 판독 카메라 모듈이 결합된 투입부 엔지니어링 구성입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-4",
                "folder": "NC CBS",
                "index": 4,
                "fileName": "9d9694328c17437cc9a5b05fab039dc7.jpg",
                "src": "assets/reference/NC CBS/9d9694328c17437cc9a5b05fab039dc7.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/9d9694328c17437cc9a5b05fab039dc7_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #04",
                "title": "[NC CBS 사진 #04] NC CBS 모듈러 프레임 조립 및 정밀 가이드 레일 마감",
                "desc": "현장 유지보수와 확장이 용이하도록 모듈화 설계된 가이드 트랙과 깔끔한 배선·센서 브라켓 마감 디테일입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-5",
                "folder": "NC CBS",
                "index": 5,
                "fileName": "34b4130a4f19b80f5c138ee587b6821e.jpg",
                "src": "assets/reference/NC CBS/34b4130a4f19b80f5c138ee587b6821e.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/34b4130a4f19b80f5c138ee587b6821e_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #05",
                "title": "[NC CBS 사진 #05] NC CBS 고밀도 셀(Cell) 라인 및 정밀 하부 프레임 구조",
                "desc": "정밀하게 정렬된 NC CBS 캐리어 라인과 견고한 구조용 스틸 프레임, 하부 안전 방호 커버가 일체감 있게 구축된 현장 사진입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-6",
                "folder": "NC CBS",
                "index": 6,
                "fileName": "237c669ebd51dce526d74b927eb1aeec.jpg",
                "src": "assets/reference/NC CBS/237c669ebd51dce526d74b927eb1aeec.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/237c669ebd51dce526d74b927eb1aeec_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #06",
                "title": "[NC CBS 사진 #06] NC CBS 양방향 밀집형 슈트 및 집하 스테이션 전경",
                "desc": "좁은 간격으로 설계된 다수의 목적지 슈트가 배열되어 권역별·배송지별 세밀한 분류를 수행하는 터미널 내부 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-7",
                "folder": "NC CBS",
                "index": 7,
                "fileName": "314b72f52ecff09c8932e6734f240c86.jpg",
                "src": "assets/reference/NC CBS/314b72f52ecff09c8932e6734f240c86.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/314b72f52ecff09c8932e6734f240c86_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #07",
                "title": "[NC CBS 사진 #07] NC CBS 인덕션 공급 라인 및 상부 스캐닝 아치 설비",
                "desc": "화물 자동 정렬 컨베이어와 고정밀 바코드 판독 카메라 모듈이 결합된 투입부 엔지니어링 구성입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-8",
                "folder": "NC CBS",
                "index": 8,
                "fileName": "31694f942d7b53564e534b669df0a0bf.jpg",
                "src": "assets/reference/NC CBS/31694f942d7b53564e534b669df0a0bf.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/31694f942d7b53564e534b669df0a0bf_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #08",
                "title": "[NC CBS 사진 #08] NC CBS 모듈러 프레임 조립 및 정밀 가이드 레일 마감",
                "desc": "현장 유지보수와 확장이 용이하도록 모듈화 설계된 가이드 트랙과 깔끔한 배선·센서 브라켓 마감 디테일입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-9",
                "folder": "NC CBS",
                "index": 9,
                "fileName": "41092a0d4edc46f6cd8b7160b63b3d02.jpg",
                "src": "assets/reference/NC CBS/41092a0d4edc46f6cd8b7160b63b3d02.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/41092a0d4edc46f6cd8b7160b63b3d02_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #09",
                "title": "[NC CBS 사진 #09] NC CBS 고밀도 셀(Cell) 라인 및 정밀 하부 프레임 구조",
                "desc": "정밀하게 정렬된 NC CBS 캐리어 라인과 견고한 구조용 스틸 프레임, 하부 안전 방호 커버가 일체감 있게 구축된 현장 사진입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-10",
                "folder": "NC CBS",
                "index": 10,
                "fileName": "07970052f53d836064de32c1db35e4af.jpg",
                "src": "assets/reference/NC CBS/07970052f53d836064de32c1db35e4af.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/07970052f53d836064de32c1db35e4af_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #10",
                "title": "[NC CBS 사진 #10] NC CBS 양방향 밀집형 슈트 및 집하 스테이션 전경",
                "desc": "좁은 간격으로 설계된 다수의 목적지 슈트가 배열되어 권역별·배송지별 세밀한 분류를 수행하는 터미널 내부 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-11",
                "folder": "NC CBS",
                "index": 11,
                "fileName": "a37edacfac859c620df9b4c0455357a1.jpg",
                "src": "assets/reference/NC CBS/a37edacfac859c620df9b4c0455357a1.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/a37edacfac859c620df9b4c0455357a1_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #11",
                "title": "[NC CBS 사진 #11] NC CBS 인덕션 공급 라인 및 상부 스캐닝 아치 설비",
                "desc": "화물 자동 정렬 컨베이어와 고정밀 바코드 판독 카메라 모듈이 결합된 투입부 엔지니어링 구성입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-12",
                "folder": "NC CBS",
                "index": 12,
                "fileName": "b9ed09c256e20094ed42f2c768c3ec8f.jpg",
                "src": "assets/reference/NC CBS/b9ed09c256e20094ed42f2c768c3ec8f.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/b9ed09c256e20094ed42f2c768c3ec8f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #12",
                "title": "[NC CBS 사진 #12] NC CBS 모듈러 프레임 조립 및 정밀 가이드 레일 마감",
                "desc": "현장 유지보수와 확장이 용이하도록 모듈화 설계된 가이드 트랙과 깔끔한 배선·센서 브라켓 마감 디테일입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-13",
                "folder": "NC CBS",
                "index": 13,
                "fileName": "c6d1be3427a7fad7e6e6f610e57ea5b2.jpg",
                "src": "assets/reference/NC CBS/c6d1be3427a7fad7e6e6f610e57ea5b2.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/c6d1be3427a7fad7e6e6f610e57ea5b2_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #13",
                "title": "[NC CBS 사진 #13] NC CBS 고밀도 셀(Cell) 라인 및 정밀 하부 프레임 구조",
                "desc": "정밀하게 정렬된 NC CBS 캐리어 라인과 견고한 구조용 스틸 프레임, 하부 안전 방호 커버가 일체감 있게 구축된 현장 사진입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-14",
                "folder": "NC CBS",
                "index": 14,
                "fileName": "d81fce8a3fa6e7bce89f5fad6d18a3ff.jpg",
                "src": "assets/reference/NC CBS/d81fce8a3fa6e7bce89f5fad6d18a3ff.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/d81fce8a3fa6e7bce89f5fad6d18a3ff_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #14",
                "title": "[NC CBS 사진 #14] NC CBS 양방향 밀집형 슈트 및 집하 스테이션 전경",
                "desc": "좁은 간격으로 설계된 다수의 목적지 슈트가 배열되어 권역별·배송지별 세밀한 분류를 수행하는 터미널 내부 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-15",
                "folder": "NC CBS",
                "index": 15,
                "fileName": "d844bf068cead3a361959044da2207d8.jpg",
                "src": "assets/reference/NC CBS/d844bf068cead3a361959044da2207d8.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/d844bf068cead3a361959044da2207d8_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #15",
                "title": "[NC CBS 사진 #15] NC CBS 인덕션 공급 라인 및 상부 스캐닝 아치 설비",
                "desc": "화물 자동 정렬 컨베이어와 고정밀 바코드 판독 카메라 모듈이 결합된 투입부 엔지니어링 구성입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-16",
                "folder": "NC CBS",
                "index": 16,
                "fileName": "df49ca11d91e1e6a7c04bf0ad8fff3f9.jpg",
                "src": "assets/reference/NC CBS/df49ca11d91e1e6a7c04bf0ad8fff3f9.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/df49ca11d91e1e6a7c04bf0ad8fff3f9_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #16",
                "title": "[NC CBS 사진 #16] NC CBS 모듈러 프레임 조립 및 정밀 가이드 레일 마감",
                "desc": "현장 유지보수와 확장이 용이하도록 모듈화 설계된 가이드 트랙과 깔끔한 배선·센서 브라켓 마감 디테일입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-17",
                "folder": "NC CBS",
                "index": 17,
                "fileName": "ea890564626b2c6d1336a4d2ec3a979c.jpg",
                "src": "assets/reference/NC CBS/ea890564626b2c6d1336a4d2ec3a979c.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/ea890564626b2c6d1336a4d2ec3a979c_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #17",
                "title": "[NC CBS 사진 #17] NC CBS 고밀도 셀(Cell) 라인 및 정밀 하부 프레임 구조",
                "desc": "정밀하게 정렬된 NC CBS 캐리어 라인과 견고한 구조용 스틸 프레임, 하부 안전 방호 커버가 일체감 있게 구축된 현장 사진입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-18",
                "folder": "NC CBS",
                "index": 18,
                "fileName": "ec981c8d21af6b1c101f7fe6fd005980.jpg",
                "src": "assets/reference/NC CBS/ec981c8d21af6b1c101f7fe6fd005980.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/ec981c8d21af6b1c101f7fe6fd005980_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #18",
                "title": "[NC CBS 사진 #18] NC CBS 양방향 밀집형 슈트 및 집하 스테이션 전경",
                "desc": "좁은 간격으로 설계된 다수의 목적지 슈트가 배열되어 권역별·배송지별 세밀한 분류를 수행하는 터미널 내부 모습입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-19",
                "folder": "NC CBS",
                "index": 19,
                "fileName": "f93b5347d1e0b2eea19a762c36b9bbf2.jpg",
                "src": "assets/reference/NC CBS/f93b5347d1e0b2eea19a762c36b9bbf2.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/f93b5347d1e0b2eea19a762c36b9bbf2_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #19",
                "title": "[NC CBS 사진 #19] NC CBS 인덕션 공급 라인 및 상부 스캐닝 아치 설비",
                "desc": "화물 자동 정렬 컨베이어와 고정밀 바코드 판독 카메라 모듈이 결합된 투입부 엔지니어링 구성입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            },
            {
                "id": "NC CBS-pho-20",
                "folder": "NC CBS",
                "index": 20,
                "fileName": "f923ad75b87e8090ccaeeb04dacb96ee.jpg",
                "src": "assets/reference/NC CBS/f923ad75b87e8090ccaeeb04dacb96ee.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "thumb": "assets/reference/NC CBS/f923ad75b87e8090ccaeeb04dacb96ee_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NC CBS.jpg",
                "clipCode": "NC CBS 현장포토 #20",
                "title": "[NC CBS 사진 #20] NC CBS 모듈러 프레임 조립 및 정밀 가이드 레일 마감",
                "desc": "현장 유지보수와 확장이 용이하도록 모듈화 설계된 가이드 트랙과 깔끔한 배선·센서 브라켓 마감 디테일입니다.",
                "tags": [
                    "NC CBS",
                    "비접촉 급전/통신",
                    "복층 고밀도 분류",
                    "초고속 택배 터미널"
                ]
            }
        ]
    },
    "NBS": {
        "id": "NBS",
        "title": "NBS",
        "subtitle": "NBS [Narrow Belt Sorter] — 내로우 벨트 고속 자동 분류기",
        "badge": "NARROW BELT SORTER",
        "icon": "fa-grip-lines",
        "overview": "직선형 고밀도 레이아웃을 따라 고속 이송되는 내로우 벨트 소터(NBS) 및 중량물 분기 라인 구축 현장입니다. 다수의 좁은 고장력 벨트 사이에 내장된 팝업 롤러/다이빙 모듈이 정형 박스, 스티로폼 보냉 박스, 중대형 화물을 충격 없이 부드럽게 양방향 경사 슈트로 고속 분기합니다.",
        "tags": [
            "Narrow Belt Sorter",
            "직선형 공간최적화",
            "중량 박스/보냉화물",
            "저충격 소프트 분기"
        ],
        "videoTemplates": [
            {
                "title": "NBS 직선형 메인 라인 정형 박스 & 보냉 화물 연속 분기",
                "desc": "길게 뻗은 직선형 내로우 벨트 라인을 따라 이송되던 대형 박스와 백색 스티로폼 화물이 목적지 곡선 슈트로 부드럽게 회전 분기되는 가동 영상입니다."
            },
            {
                "title": "NBS 오렌지 가이드 곡선 슈트 연동 고속 슬라이딩 배출",
                "desc": "고속 분기된 화물이 원심력을 제어하는 오렌지색 곡선 가이드를 따라 하부 라인으로 자세 흐트러짐 없이 안정적으로 합류하는 장면입니다."
            },
            {
                "title": "NBS 다단 경사 슈트 및 1층 출하 컨베이어 직결 운전",
                "desc": "2층 메인 NBS 소터에서 분기된 화물이 대형 경사 슈트를 타고 내려와 1층 출하 라인으로 즉시 연결되는 고효율 물류 프로세스입니다."
            },
            {
                "title": "NBS 고속 팝업 다이버터 모듈 연속 응답성 테스트",
                "desc": "연속으로 진입하는 다양한 크기의 박스를 광전 센서가 즉시 감지하여 분기 각도를 정밀하게 제어하는 현장 시운전 영상입니다."
            },
            {
                "title": "NBS 대규모 물류센터 직선형 풀 라인 가동 스케치",
                "desc": "건물 기둥 간격을 따라 일직선으로 깔끔하게 배치된 NBS 분류 시스템이 공간 낭비 없이 대량 화물을 처리하는 전체 가동 모습입니다."
            }
        ],
        "photoTemplates": [
            {
                "title": "NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다."
            },
            {
                "title": "NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다."
            },
            {
                "title": "NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다."
            },
            {
                "title": "NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다."
            }
        ],
        "videoCount": 15,
        "photoCount": 28,
        "videos": [
            {
                "id": "NBS-vid-1",
                "folder": "NBS",
                "index": 1,
                "fileName": "5f4659d5a2d92be2be75584456d78563.mp4",
                "src": "assets/reference/NBS/5f4659d5a2d92be2be75584456d78563.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/5f4659d5a2d92be2be75584456d78563_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #01",
                "title": "[NBS 영상 #01] NBS 직선형 메인 라인 정형 박스 & 보냉 화물 연속 분기",
                "desc": "길게 뻗은 직선형 내로우 벨트 라인을 따라 이송되던 대형 박스와 백색 스티로폼 화물이 목적지 곡선 슈트로 부드럽게 회전 분기되는 가동 영상입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-2",
                "folder": "NBS",
                "index": 2,
                "fileName": "7af4cdbe82fae1ead7ebc272dc98ef0d.mp4",
                "src": "assets/reference/NBS/7af4cdbe82fae1ead7ebc272dc98ef0d.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/CBS (6).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #02",
                "title": "[NBS 영상 #02] NBS 오렌지 가이드 곡선 슈트 연동 고속 슬라이딩 배출",
                "desc": "고속 분기된 화물이 원심력을 제어하는 오렌지색 곡선 가이드를 따라 하부 라인으로 자세 흐트러짐 없이 안정적으로 합류하는 장면입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-3",
                "folder": "NBS",
                "index": 3,
                "fileName": "8ca23444453f4587727757a4aa336751.mp4",
                "src": "assets/reference/NBS/8ca23444453f4587727757a4aa336751.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/8ca23444453f4587727757a4aa336751_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #03",
                "title": "[NBS 영상 #03] NBS 다단 경사 슈트 및 1층 출하 컨베이어 직결 운전",
                "desc": "2층 메인 NBS 소터에서 분기된 화물이 대형 경사 슈트를 타고 내려와 1층 출하 라인으로 즉시 연결되는 고효율 물류 프로세스입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-4",
                "folder": "NBS",
                "index": 4,
                "fileName": "33d1953697888c08855c1df59cad0719.mp4",
                "src": "assets/reference/NBS/33d1953697888c08855c1df59cad0719.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/33d1953697888c08855c1df59cad0719_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #04",
                "title": "[NBS 영상 #04] NBS 고속 팝업 다이버터 모듈 연속 응답성 테스트",
                "desc": "연속으로 진입하는 다양한 크기의 박스를 광전 센서가 즉시 감지하여 분기 각도를 정밀하게 제어하는 현장 시운전 영상입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-5",
                "folder": "NBS",
                "index": 5,
                "fileName": "57f1212ad2a096905360be5dbe65ea51.mp4",
                "src": "assets/reference/NBS/57f1212ad2a096905360be5dbe65ea51.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/CBS (35).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #05",
                "title": "[NBS 영상 #05] NBS 대규모 물류센터 직선형 풀 라인 가동 스케치",
                "desc": "건물 기둥 간격을 따라 일직선으로 깔끔하게 배치된 NBS 분류 시스템이 공간 낭비 없이 대량 화물을 처리하는 전체 가동 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-6",
                "folder": "NBS",
                "index": 6,
                "fileName": "115c5548f69f78cd1035287dadb8b8ec.mp4",
                "src": "assets/reference/NBS/115c5548f69f78cd1035287dadb8b8ec.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/115c5548f69f78cd1035287dadb8b8ec_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #06",
                "title": "[NBS 영상 #06] NBS 직선형 메인 라인 정형 박스 & 보냉 화물 연속 분기",
                "desc": "길게 뻗은 직선형 내로우 벨트 라인을 따라 이송되던 대형 박스와 백색 스티로폼 화물이 목적지 곡선 슈트로 부드럽게 회전 분기되는 가동 영상입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-7",
                "folder": "NBS",
                "index": 7,
                "fileName": "723fd055531a7b49b55efa6a427c9992.mp4",
                "src": "assets/reference/NBS/723fd055531a7b49b55efa6a427c9992.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/723fd055531a7b49b55efa6a427c9992.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #07",
                "title": "[NBS 영상 #07] NBS 오렌지 가이드 곡선 슈트 연동 고속 슬라이딩 배출",
                "desc": "고속 분기된 화물이 원심력을 제어하는 오렌지색 곡선 가이드를 따라 하부 라인으로 자세 흐트러짐 없이 안정적으로 합류하는 장면입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-8",
                "folder": "NBS",
                "index": 8,
                "fileName": "8335e2bc900c49711922e1c7ef950521.mp4",
                "src": "assets/reference/NBS/8335e2bc900c49711922e1c7ef950521.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/8335e2bc900c49711922e1c7ef950521.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #08",
                "title": "[NBS 영상 #08] NBS 다단 경사 슈트 및 1층 출하 컨베이어 직결 운전",
                "desc": "2층 메인 NBS 소터에서 분기된 화물이 대형 경사 슈트를 타고 내려와 1층 출하 라인으로 즉시 연결되는 고효율 물류 프로세스입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-9",
                "folder": "NBS",
                "index": 9,
                "fileName": "209592a92cd0a21230b78c69ef11903f.mp4",
                "src": "assets/reference/NBS/209592a92cd0a21230b78c69ef11903f.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/209592a92cd0a21230b78c69ef11903f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #09",
                "title": "[NBS 영상 #09] NBS 고속 팝업 다이버터 모듈 연속 응답성 테스트",
                "desc": "연속으로 진입하는 다양한 크기의 박스를 광전 센서가 즉시 감지하여 분기 각도를 정밀하게 제어하는 현장 시운전 영상입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-10",
                "folder": "NBS",
                "index": 10,
                "fileName": "a10029ffc0088c7e7bc6b8aa7d169b04.mp4",
                "src": "assets/reference/NBS/a10029ffc0088c7e7bc6b8aa7d169b04.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/a10029ffc0088c7e7bc6b8aa7d169b04_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #10",
                "title": "[NBS 영상 #10] NBS 대규모 물류센터 직선형 풀 라인 가동 스케치",
                "desc": "건물 기둥 간격을 따라 일직선으로 깔끔하게 배치된 NBS 분류 시스템이 공간 낭비 없이 대량 화물을 처리하는 전체 가동 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-11",
                "folder": "NBS",
                "index": 11,
                "fileName": "b5c701f4f2c61185414c4c88234d1cc0.mp4",
                "src": "assets/reference/NBS/b5c701f4f2c61185414c4c88234d1cc0.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/b5c701f4f2c61185414c4c88234d1cc0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #11",
                "title": "[NBS 영상 #11] NBS 직선형 메인 라인 정형 박스 & 보냉 화물 연속 분기",
                "desc": "길게 뻗은 직선형 내로우 벨트 라인을 따라 이송되던 대형 박스와 백색 스티로폼 화물이 목적지 곡선 슈트로 부드럽게 회전 분기되는 가동 영상입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-12",
                "folder": "NBS",
                "index": 12,
                "fileName": "dc308ab4129b0975a7c7b6314cd2f9f7.mp4",
                "src": "assets/reference/NBS/dc308ab4129b0975a7c7b6314cd2f9f7.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/dc308ab4129b0975a7c7b6314cd2f9f7_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #12",
                "title": "[NBS 영상 #12] NBS 오렌지 가이드 곡선 슈트 연동 고속 슬라이딩 배출",
                "desc": "고속 분기된 화물이 원심력을 제어하는 오렌지색 곡선 가이드를 따라 하부 라인으로 자세 흐트러짐 없이 안정적으로 합류하는 장면입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-13",
                "folder": "NBS",
                "index": 13,
                "fileName": "e7fc8b4e2a54317b5bb0f49d095d832e.mp4",
                "src": "assets/reference/NBS/e7fc8b4e2a54317b5bb0f49d095d832e.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/897d04357e28f46d3fe8b3192e1942a9.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #13",
                "title": "[NBS 영상 #13] NBS 다단 경사 슈트 및 1층 출하 컨베이어 직결 운전",
                "desc": "2층 메인 NBS 소터에서 분기된 화물이 대형 경사 슈트를 타고 내려와 1층 출하 라인으로 즉시 연결되는 고효율 물류 프로세스입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-14",
                "folder": "NBS",
                "index": 14,
                "fileName": "fc37d6799c499cfa0f51a7bc02ffdd7b.mp4",
                "src": "assets/reference/NBS/fc37d6799c499cfa0f51a7bc02ffdd7b.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/fc37d6799c499cfa0f51a7bc02ffdd7b.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #14",
                "title": "[NBS 영상 #14] NBS 고속 팝업 다이버터 모듈 연속 응답성 테스트",
                "desc": "연속으로 진입하는 다양한 크기의 박스를 광전 센서가 즉시 감지하여 분기 각도를 정밀하게 제어하는 현장 시운전 영상입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-vid-15",
                "folder": "NBS",
                "index": 15,
                "fileName": "ff1ad13acc11629abd03123cd12746b5.mp4",
                "src": "assets/reference/NBS/ff1ad13acc11629abd03123cd12746b5.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.mp4",
                "thumb": "assets/reference/NBS/ff1ad13acc11629abd03123cd12746b5_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장영상 #15",
                "title": "[NBS 영상 #15] NBS 대규모 물류센터 직선형 풀 라인 가동 스케치",
                "desc": "건물 기둥 간격을 따라 일직선으로 깔끔하게 배치된 NBS 분류 시스템이 공간 낭비 없이 대량 화물을 처리하는 전체 가동 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            }
        ],
        "photos": [
            {
                "id": "NBS-pho-1",
                "folder": "NBS",
                "index": 1,
                "fileName": "CBS (5).jpg",
                "src": "assets/reference/NBS/CBS (5).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/CBS (5).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "CBS (5)",
                "title": "[NBS 사진 #01] NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-2",
                "folder": "NBS",
                "index": 2,
                "fileName": "CBS (6).jpg",
                "src": "assets/reference/NBS/CBS (6).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/CBS (6).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "CBS (6)",
                "title": "[NBS 사진 #02] NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-3",
                "folder": "NBS",
                "index": 3,
                "fileName": "CBS (8).jpg",
                "src": "assets/reference/NBS/CBS (8).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/CBS (8).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "CBS (8)",
                "title": "[NBS 사진 #03] NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-4",
                "folder": "NBS",
                "index": 4,
                "fileName": "CBS (9).jpg",
                "src": "assets/reference/NBS/CBS (9).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/CBS (9).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "CBS (9)",
                "title": "[NBS 사진 #04] NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-5",
                "folder": "NBS",
                "index": 5,
                "fileName": "CBS (35).jpg",
                "src": "assets/reference/NBS/CBS (35).jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/CBS (35).jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "CBS (35)",
                "title": "[NBS 사진 #05] NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-6",
                "folder": "NBS",
                "index": 6,
                "fileName": "7e4b80292562edf8c13c41d547e95018.jpg",
                "src": "assets/reference/NBS/7e4b80292562edf8c13c41d547e95018.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/7e4b80292562edf8c13c41d547e95018_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #06",
                "title": "[NBS 사진 #06] NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-7",
                "folder": "NBS",
                "index": 7,
                "fileName": "8ca23444453f4587727757a4aa336751.jpg",
                "src": "assets/reference/NBS/8ca23444453f4587727757a4aa336751.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/8ca23444453f4587727757a4aa336751_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #07",
                "title": "[NBS 사진 #07] NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-8",
                "folder": "NBS",
                "index": 8,
                "fileName": "29eb25f1501abbdea5f5c4c2cda9a4ce.jpg",
                "src": "assets/reference/NBS/29eb25f1501abbdea5f5c4c2cda9a4ce.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/29eb25f1501abbdea5f5c4c2cda9a4ce_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #08",
                "title": "[NBS 사진 #08] NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-9",
                "folder": "NBS",
                "index": 9,
                "fileName": "33d1953697888c08855c1df59cad0719.jpg",
                "src": "assets/reference/NBS/33d1953697888c08855c1df59cad0719.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/33d1953697888c08855c1df59cad0719_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #09",
                "title": "[NBS 사진 #09] NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-10",
                "folder": "NBS",
                "index": 10,
                "fileName": "88fc05c084fb41334c823282e5d04149.jpg",
                "src": "assets/reference/NBS/88fc05c084fb41334c823282e5d04149.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/88fc05c084fb41334c823282e5d04149_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #10",
                "title": "[NBS 사진 #10] NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-11",
                "folder": "NBS",
                "index": 11,
                "fileName": "94cdb2a32056479ee62c47827a42dcc9.jpg",
                "src": "assets/reference/NBS/94cdb2a32056479ee62c47827a42dcc9.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/94cdb2a32056479ee62c47827a42dcc9_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #11",
                "title": "[NBS 사진 #11] NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-12",
                "folder": "NBS",
                "index": 12,
                "fileName": "723fd055531a7b49b55efa6a427c9992.jpg",
                "src": "assets/reference/NBS/723fd055531a7b49b55efa6a427c9992.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/723fd055531a7b49b55efa6a427c9992.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #12",
                "title": "[NBS 사진 #12] NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-13",
                "folder": "NBS",
                "index": 13,
                "fileName": "897d04357e28f46d3fe8b3192e1942a9.jpg",
                "src": "assets/reference/NBS/897d04357e28f46d3fe8b3192e1942a9.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/897d04357e28f46d3fe8b3192e1942a9_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #13",
                "title": "[NBS 사진 #13] NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-14",
                "folder": "NBS",
                "index": 14,
                "fileName": "8335e2bc900c49711922e1c7ef950521.jpg",
                "src": "assets/reference/NBS/8335e2bc900c49711922e1c7ef950521.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/8335e2bc900c49711922e1c7ef950521.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #14",
                "title": "[NBS 사진 #14] NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-15",
                "folder": "NBS",
                "index": 15,
                "fileName": "209592a92cd0a21230b78c69ef11903f.jpg",
                "src": "assets/reference/NBS/209592a92cd0a21230b78c69ef11903f.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/209592a92cd0a21230b78c69ef11903f_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #15",
                "title": "[NBS 사진 #15] NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-16",
                "folder": "NBS",
                "index": 16,
                "fileName": "383707fbd79758f3082e323d1cb2f611.jpg",
                "src": "assets/reference/NBS/383707fbd79758f3082e323d1cb2f611.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/383707fbd79758f3082e323d1cb2f611.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #16",
                "title": "[NBS 사진 #16] NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-17",
                "folder": "NBS",
                "index": 17,
                "fileName": "33185076262fa1feadbf7badb98378a0.jpg",
                "src": "assets/reference/NBS/33185076262fa1feadbf7badb98378a0.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/33185076262fa1feadbf7badb98378a0_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #17",
                "title": "[NBS 사진 #17] NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-18",
                "folder": "NBS",
                "index": 18,
                "fileName": "a0d4a47fa404761f2801edb789e4b803.jpg",
                "src": "assets/reference/NBS/a0d4a47fa404761f2801edb789e4b803.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/a0d4a47fa404761f2801edb789e4b803.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #18",
                "title": "[NBS 사진 #18] NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-19",
                "folder": "NBS",
                "index": 19,
                "fileName": "a8bcf565f32c5dd23e06ec5159de0b82.jpg",
                "src": "assets/reference/NBS/a8bcf565f32c5dd23e06ec5159de0b82.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/a8bcf565f32c5dd23e06ec5159de0b82_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #19",
                "title": "[NBS 사진 #19] NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-20",
                "folder": "NBS",
                "index": 20,
                "fileName": "a10029ffc0088c7e7bc6b8aa7d169b04.jpg",
                "src": "assets/reference/NBS/a10029ffc0088c7e7bc6b8aa7d169b04.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/a10029ffc0088c7e7bc6b8aa7d169b04_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #20",
                "title": "[NBS 사진 #20] NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-21",
                "folder": "NBS",
                "index": 21,
                "fileName": "a359073e6e336eff70e900fad2bb74d3.jpg",
                "src": "assets/reference/NBS/a359073e6e336eff70e900fad2bb74d3.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/a359073e6e336eff70e900fad2bb74d3.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #21",
                "title": "[NBS 사진 #21] NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-22",
                "folder": "NBS",
                "index": 22,
                "fileName": "abb16b741cd8e8f0480041d29f2c874f.jpg",
                "src": "assets/reference/NBS/abb16b741cd8e8f0480041d29f2c874f.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/abb16b741cd8e8f0480041d29f2c874f.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #22",
                "title": "[NBS 사진 #22] NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-23",
                "folder": "NBS",
                "index": 23,
                "fileName": "bb3b7891c8363365a786887add3916c1.jpg",
                "src": "assets/reference/NBS/bb3b7891c8363365a786887add3916c1.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/bb3b7891c8363365a786887add3916c1.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #23",
                "title": "[NBS 사진 #23] NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-24",
                "folder": "NBS",
                "index": 24,
                "fileName": "c1420c9b463fb4b6ba799401d71eec45.jpg",
                "src": "assets/reference/NBS/c1420c9b463fb4b6ba799401d71eec45.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/c1420c9b463fb4b6ba799401d71eec45.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #24",
                "title": "[NBS 사진 #24] NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-25",
                "folder": "NBS",
                "index": 25,
                "fileName": "dc308ab4129b0975a7c7b6314cd2f9f7.jpg",
                "src": "assets/reference/NBS/dc308ab4129b0975a7c7b6314cd2f9f7.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/dc308ab4129b0975a7c7b6314cd2f9f7_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #25",
                "title": "[NBS 사진 #25] NBS 직선형 고속 분류 라인 및 오렌지 곡선 슈트 전경",
                "desc": "정형 박스와 스티로폼 보냉 화물이 내로우 벨트 위를 고속 주행하며 우측 대용량 곡선 슈트로 분기되는 실제 현장 모습입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-26",
                "folder": "NBS",
                "index": 26,
                "fileName": "fb2f1b747a7ff1ebda5da2650bc0a754.jpg",
                "src": "assets/reference/NBS/fb2f1b747a7ff1ebda5da2650bc0a754.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/fb2f1b747a7ff1ebda5da2650bc0a754.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #26",
                "title": "[NBS 사진 #26] NBS 상부 메인 소터 라인 및 옐로우 안전 점검 통로",
                "desc": "대형 물류센터 천장 조명 아래 끝없이 뻗은 NBS 직선 라인과 작업자 안전을 위한 옐로우 가드레일이 체계적으로 시공되어 있습니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-27",
                "folder": "NBS",
                "index": 27,
                "fileName": "fc37d6799c499cfa0f51a7bc02ffdd7b.jpg",
                "src": "assets/reference/NBS/fc37d6799c499cfa0f51a7bc02ffdd7b.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/fc37d6799c499cfa0f51a7bc02ffdd7b.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #27",
                "title": "[NBS 사진 #27] NBS 광폭 경사 배출 슈트 및 하부 수취 라인 구조",
                "desc": "대형·중량 화물도 걸림 없이 배출될 수 있도록 광폭으로 설계된 고강도 스틸 슈트와 충격 흡수 가이드 디테일입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            },
            {
                "id": "NBS-pho-28",
                "folder": "NBS",
                "index": 28,
                "fileName": "ff1ad13acc11629abd03123cd12746b5.jpg",
                "src": "assets/reference/NBS/ff1ad13acc11629abd03123cd12746b5.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "thumb": "assets/reference/NBS/ff1ad13acc11629abd03123cd12746b5_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/NBS.jpg",
                "clipCode": "NBS 현장포토 #28",
                "title": "[NBS 사진 #28] NBS 구동 헤드 유닛 및 정밀 장력 제어 컨베이어 모듈",
                "desc": "장시간 고속 운전에도 벨트 사행이나 장력 저하가 발생하지 않도록 정밀 설계된 NBS 구동부 및 프레임 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "직선형 공간최적화",
                    "중량 박스/보냉화물",
                    "저충격 소프트 분기"
                ]
            }
        ]
    },
    "Wheel Sorter": {
        "id": "Wheel Sorter",
        "title": "Wheel Sorter",
        "subtitle": "Wheel Sorter — 다축 독립 구동 팝업 휠 소터 및 매트릭스 분기 설비",
        "badge": "POPUP WHEEL SORTER",
        "icon": "fa-dharmachakra",
        "overview": "고속 컨베이어 라인에 매립된 다축 옐로우·블랙 고마찰 팝업 휠(Pop-up Wheel) 매트릭스가 화물 진입 순간 즉각 상승·조향하여 좌·우·직진 다방향으로 초고속 분기하는 현장 및 시운전 실적입니다. 모듈형 구조로 기존 컨베이어 라인에도 손쉽게 결합할 수 있는 고효율 핵심 분류 장비입니다.",
        "tags": [
            "Popup Wheel Sorter",
            "다축 독립 조향",
            "폴리백/소형박스 특화",
            "모듈형 빠른 설치"
        ],
        "videoTemplates": [
            {
                "title": "Wheel Sorter 고밀도 팝업 휠 매트릭스 폴리백 초고속 분기",
                "desc": "레드 프레임에 장착된 다열 옐로우·블랙 팝업 휠 모듈이 고속 진입하는 백색 폴리백 화물을 원하는 각도로 즉각 튕겨내어 분기하는 현장 가동 영상입니다."
            },
            {
                "title": "Wheel Sorter 10축 독립 구동 서보 조향 메커니즘 실증(FAT)",
                "desc": "다축 휠 모듈이 제어 신호에 맞춰 밀리초(ms) 단위로 정밀하게 좌·우 회전 각도를 전환하며 응답 속도와 내구성을 검증하는 공장 시운전 영상입니다."
            },
            {
                "title": "Wheel Sorter 연속 택배 화물 양방향 논스톱 분류 가동",
                "desc": "짧은 간격으로 연속 투입되는 다양한 규격의 택배 박스와 마대 화물을 병목 현상 없이 좌우 슈트로 번갈아 고속 분류하는 모습입니다."
            },
            {
                "title": "Wheel Sorter 인피드(Infeed) 벨트 연동 및 바코드 스캔 분기",
                "desc": "전단 벨트 컨베이어에서 가속된 화물이 휠 소터 상판에 진입하는 동시에 목적지 방향으로 매끄럽게 방향을 전환하는 정밀 제어 공정입니다."
            },
            {
                "title": "Wheel Sorter 고마찰 우레탄 휠 그립력 및 충격 최소화 검증",
                "desc": "바닥면이 불균일한 연질 폴리백부터 단단한 골판지 박스까지 슬립(미끄러짐) 없이 균일한 속도로 밀어내는 고마찰 휠 기술 실증 영상입니다."
            }
        ],
        "photoTemplates": [
            {
                "title": "Wheel Sorter 다축 옐로우·블랙 팝업 휠 매트릭스 상판 가동 순간",
                "desc": "레드 컬러의 고강성 상판에 촘촘히 배열된 독립 조향 팝업 휠들이 폴리백 화물을 우측 슈트로 고속 분기하는 역동적인 현장 클로즈업입니다."
            },
            {
                "title": "Wheel Sorter 현장 분류 라인 및 양방향 레드 가이드 슈트",
                "desc": "분류 거점마다 설치된 Wheel Sorter 모듈과 화물 이탈을 방지하는 레드 스틸 슈트가 물류센터 메인 라인에 완벽히 통합된 모습입니다."
            },
            {
                "title": "Wheel Sorter 정밀 구동축 및 모듈형 카트리지 내부 구조",
                "desc": "개별 축의 점검과 교체가 간편하도록 설계된 모듈형 휠 어셈블리와 고정밀 서보 링크 메커니즘의 엔지니어링 디테일입니다."
            },
            {
                "title": "Wheel Sorter 출고 전 공장 사전 시운전(FAT) 및 품질 검수",
                "desc": "고객사 현장 반입 전 당사 제조 거점에서 실제 화물을 투입하며 분기 각도, 처리 속도, 센서 동기화를 정밀 테스트하는 장면입니다."
            }
        ],
        "videoCount": 17,
        "photoCount": 20,
        "videos": [
            {
                "id": "Wheel Sorter-vid-1",
                "folder": "Wheel Sorter",
                "index": 1,
                "fileName": "2e2deeb844b41ada550b08730cebb0af.mp4",
                "src": "assets/reference/Wheel Sorter/2e2deeb844b41ada550b08730cebb0af.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/2e2deeb844b41ada550b08730cebb0af_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #01",
                "title": "[Wheel Sorter 영상 #01] Wheel Sorter 고밀도 팝업 휠 매트릭스 폴리백 초고속 분기",
                "desc": "레드 프레임에 장착된 다열 옐로우·블랙 팝업 휠 모듈이 고속 진입하는 백색 폴리백 화물을 원하는 각도로 즉각 튕겨내어 분기하는 현장 가동 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-2",
                "folder": "Wheel Sorter",
                "index": 2,
                "fileName": "3add31a4e16b10c9516fea3ac5389828.mp4",
                "src": "assets/reference/Wheel Sorter/3add31a4e16b10c9516fea3ac5389828.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/3add31a4e16b10c9516fea3ac5389828_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #02",
                "title": "[Wheel Sorter 영상 #02] Wheel Sorter 10축 독립 구동 서보 조향 메커니즘 실증(FAT)",
                "desc": "다축 휠 모듈이 제어 신호에 맞춰 밀리초(ms) 단위로 정밀하게 좌·우 회전 각도를 전환하며 응답 속도와 내구성을 검증하는 공장 시운전 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-3",
                "folder": "Wheel Sorter",
                "index": 3,
                "fileName": "3fba6eb03d423952ae925d41ee505a2d.mp4",
                "src": "assets/reference/Wheel Sorter/3fba6eb03d423952ae925d41ee505a2d.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/3fba6eb03d423952ae925d41ee505a2d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #03",
                "title": "[Wheel Sorter 영상 #03] Wheel Sorter 연속 택배 화물 양방향 논스톱 분류 가동",
                "desc": "짧은 간격으로 연속 투입되는 다양한 규격의 택배 박스와 마대 화물을 병목 현상 없이 좌우 슈트로 번갈아 고속 분류하는 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-4",
                "folder": "Wheel Sorter",
                "index": 4,
                "fileName": "4dc821f857b5456c2e939b1f0798a2bd.mp4",
                "src": "assets/reference/Wheel Sorter/4dc821f857b5456c2e939b1f0798a2bd.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/4dc821f857b5456c2e939b1f0798a2bd_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #04",
                "title": "[Wheel Sorter 영상 #04] Wheel Sorter 인피드(Infeed) 벨트 연동 및 바코드 스캔 분기",
                "desc": "전단 벨트 컨베이어에서 가속된 화물이 휠 소터 상판에 진입하는 동시에 목적지 방향으로 매끄럽게 방향을 전환하는 정밀 제어 공정입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-5",
                "folder": "Wheel Sorter",
                "index": 5,
                "fileName": "5f9f477ebd0e9161333166420c9d8dd6.mp4",
                "src": "assets/reference/Wheel Sorter/5f9f477ebd0e9161333166420c9d8dd6.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/5f9f477ebd0e9161333166420c9d8dd6_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #05",
                "title": "[Wheel Sorter 영상 #05] Wheel Sorter 고마찰 우레탄 휠 그립력 및 충격 최소화 검증",
                "desc": "바닥면이 불균일한 연질 폴리백부터 단단한 골판지 박스까지 슬립(미끄러짐) 없이 균일한 속도로 밀어내는 고마찰 휠 기술 실증 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-6",
                "folder": "Wheel Sorter",
                "index": 6,
                "fileName": "9dead2f88bb260cb0d5bc0648f7d6dbe.mp4",
                "src": "assets/reference/Wheel Sorter/9dead2f88bb260cb0d5bc0648f7d6dbe.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/9dead2f88bb260cb0d5bc0648f7d6dbe_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #06",
                "title": "[Wheel Sorter 영상 #06] Wheel Sorter 고밀도 팝업 휠 매트릭스 폴리백 초고속 분기",
                "desc": "레드 프레임에 장착된 다열 옐로우·블랙 팝업 휠 모듈이 고속 진입하는 백색 폴리백 화물을 원하는 각도로 즉각 튕겨내어 분기하는 현장 가동 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-7",
                "folder": "Wheel Sorter",
                "index": 7,
                "fileName": "55d139e6d20cb1ebfdfea205af334563.mp4",
                "src": "assets/reference/Wheel Sorter/55d139e6d20cb1ebfdfea205af334563.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/55d139e6d20cb1ebfdfea205af334563_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #07",
                "title": "[Wheel Sorter 영상 #07] Wheel Sorter 10축 독립 구동 서보 조향 메커니즘 실증(FAT)",
                "desc": "다축 휠 모듈이 제어 신호에 맞춰 밀리초(ms) 단위로 정밀하게 좌·우 회전 각도를 전환하며 응답 속도와 내구성을 검증하는 공장 시운전 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-8",
                "folder": "Wheel Sorter",
                "index": 8,
                "fileName": "490a8be681c8822474a9f00ff28e9d42.mp4",
                "src": "assets/reference/Wheel Sorter/490a8be681c8822474a9f00ff28e9d42.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/490a8be681c8822474a9f00ff28e9d42_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #08",
                "title": "[Wheel Sorter 영상 #08] Wheel Sorter 연속 택배 화물 양방향 논스톱 분류 가동",
                "desc": "짧은 간격으로 연속 투입되는 다양한 규격의 택배 박스와 마대 화물을 병목 현상 없이 좌우 슈트로 번갈아 고속 분류하는 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-9",
                "folder": "Wheel Sorter",
                "index": 9,
                "fileName": "6646f0a69480b06529c884928fa1a531.mp4",
                "src": "assets/reference/Wheel Sorter/6646f0a69480b06529c884928fa1a531.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/6646f0a69480b06529c884928fa1a531_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #09",
                "title": "[Wheel Sorter 영상 #09] Wheel Sorter 인피드(Infeed) 벨트 연동 및 바코드 스캔 분기",
                "desc": "전단 벨트 컨베이어에서 가속된 화물이 휠 소터 상판에 진입하는 동시에 목적지 방향으로 매끄럽게 방향을 전환하는 정밀 제어 공정입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-10",
                "folder": "Wheel Sorter",
                "index": 10,
                "fileName": "7707fb5252d4d29bba4d81632aedefe4.mp4",
                "src": "assets/reference/Wheel Sorter/7707fb5252d4d29bba4d81632aedefe4.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/7707fb5252d4d29bba4d81632aedefe4_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #10",
                "title": "[Wheel Sorter 영상 #10] Wheel Sorter 고마찰 우레탄 휠 그립력 및 충격 최소화 검증",
                "desc": "바닥면이 불균일한 연질 폴리백부터 단단한 골판지 박스까지 슬립(미끄러짐) 없이 균일한 속도로 밀어내는 고마찰 휠 기술 실증 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-11",
                "folder": "Wheel Sorter",
                "index": 11,
                "fileName": "b2bbdd0bc42dc1fefcce1345d40e25bd.mp4",
                "src": "assets/reference/Wheel Sorter/b2bbdd0bc42dc1fefcce1345d40e25bd.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/b2bbdd0bc42dc1fefcce1345d40e25bd_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #11",
                "title": "[Wheel Sorter 영상 #11] Wheel Sorter 고밀도 팝업 휠 매트릭스 폴리백 초고속 분기",
                "desc": "레드 프레임에 장착된 다열 옐로우·블랙 팝업 휠 모듈이 고속 진입하는 백색 폴리백 화물을 원하는 각도로 즉각 튕겨내어 분기하는 현장 가동 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-12",
                "folder": "Wheel Sorter",
                "index": 12,
                "fileName": "b825ec6ddb91f5b3523c95cf74598745.mp4",
                "src": "assets/reference/Wheel Sorter/b825ec6ddb91f5b3523c95cf74598745.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/b825ec6ddb91f5b3523c95cf74598745_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #12",
                "title": "[Wheel Sorter 영상 #12] Wheel Sorter 10축 독립 구동 서보 조향 메커니즘 실증(FAT)",
                "desc": "다축 휠 모듈이 제어 신호에 맞춰 밀리초(ms) 단위로 정밀하게 좌·우 회전 각도를 전환하며 응답 속도와 내구성을 검증하는 공장 시운전 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-13",
                "folder": "Wheel Sorter",
                "index": 13,
                "fileName": "bf99933c4f063b9a404773d8ebf16088.mp4",
                "src": "assets/reference/Wheel Sorter/bf99933c4f063b9a404773d8ebf16088.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/bf99933c4f063b9a404773d8ebf16088_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #13",
                "title": "[Wheel Sorter 영상 #13] Wheel Sorter 연속 택배 화물 양방향 논스톱 분류 가동",
                "desc": "짧은 간격으로 연속 투입되는 다양한 규격의 택배 박스와 마대 화물을 병목 현상 없이 좌우 슈트로 번갈아 고속 분류하는 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-14",
                "folder": "Wheel Sorter",
                "index": 14,
                "fileName": "bfafd228e5036feb1a51e9b14d348bb3.mp4",
                "src": "assets/reference/Wheel Sorter/bfafd228e5036feb1a51e9b14d348bb3.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/bfafd228e5036feb1a51e9b14d348bb3_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #14",
                "title": "[Wheel Sorter 영상 #14] Wheel Sorter 인피드(Infeed) 벨트 연동 및 바코드 스캔 분기",
                "desc": "전단 벨트 컨베이어에서 가속된 화물이 휠 소터 상판에 진입하는 동시에 목적지 방향으로 매끄럽게 방향을 전환하는 정밀 제어 공정입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-15",
                "folder": "Wheel Sorter",
                "index": 15,
                "fileName": "cfab01aec35365e32f24cfb4abb2a13e.mp4",
                "src": "assets/reference/Wheel Sorter/cfab01aec35365e32f24cfb4abb2a13e.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/cfab01aec35365e32f24cfb4abb2a13e_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #15",
                "title": "[Wheel Sorter 영상 #15] Wheel Sorter 고마찰 우레탄 휠 그립력 및 충격 최소화 검증",
                "desc": "바닥면이 불균일한 연질 폴리백부터 단단한 골판지 박스까지 슬립(미끄러짐) 없이 균일한 속도로 밀어내는 고마찰 휠 기술 실증 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-16",
                "folder": "Wheel Sorter",
                "index": 16,
                "fileName": "d8804faf73f906057f63a108a925d02d.mp4",
                "src": "assets/reference/Wheel Sorter/d8804faf73f906057f63a108a925d02d.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/d8804faf73f906057f63a108a925d02d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #16",
                "title": "[Wheel Sorter 영상 #16] Wheel Sorter 고밀도 팝업 휠 매트릭스 폴리백 초고속 분기",
                "desc": "레드 프레임에 장착된 다열 옐로우·블랙 팝업 휠 모듈이 고속 진입하는 백색 폴리백 화물을 원하는 각도로 즉각 튕겨내어 분기하는 현장 가동 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-vid-17",
                "folder": "Wheel Sorter",
                "index": 17,
                "fileName": "da5d2e7d328ea9749af8510475ced588.mp4",
                "src": "assets/reference/Wheel Sorter/da5d2e7d328ea9749af8510475ced588.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.mp4",
                "thumb": "assets/reference/Wheel Sorter/da5d2e7d328ea9749af8510475ced588_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장영상 #17",
                "title": "[Wheel Sorter 영상 #17] Wheel Sorter 10축 독립 구동 서보 조향 메커니즘 실증(FAT)",
                "desc": "다축 휠 모듈이 제어 신호에 맞춰 밀리초(ms) 단위로 정밀하게 좌·우 회전 각도를 전환하며 응답 속도와 내구성을 검증하는 공장 시운전 영상입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            }
        ],
        "photos": [
            {
                "id": "Wheel Sorter-pho-1",
                "folder": "Wheel Sorter",
                "index": 1,
                "fileName": "2e2deeb844b41ada550b08730cebb0af.jpg",
                "src": "assets/reference/Wheel Sorter/2e2deeb844b41ada550b08730cebb0af.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/2e2deeb844b41ada550b08730cebb0af_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #01",
                "title": "[Wheel Sorter 사진 #01] Wheel Sorter 다축 옐로우·블랙 팝업 휠 매트릭스 상판 가동 순간",
                "desc": "레드 컬러의 고강성 상판에 촘촘히 배열된 독립 조향 팝업 휠들이 폴리백 화물을 우측 슈트로 고속 분기하는 역동적인 현장 클로즈업입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-2",
                "folder": "Wheel Sorter",
                "index": 2,
                "fileName": "3add31a4e16b10c9516fea3ac5389828.jpg",
                "src": "assets/reference/Wheel Sorter/3add31a4e16b10c9516fea3ac5389828.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/3add31a4e16b10c9516fea3ac5389828_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #02",
                "title": "[Wheel Sorter 사진 #02] Wheel Sorter 현장 분류 라인 및 양방향 레드 가이드 슈트",
                "desc": "분류 거점마다 설치된 Wheel Sorter 모듈과 화물 이탈을 방지하는 레드 스틸 슈트가 물류센터 메인 라인에 완벽히 통합된 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-3",
                "folder": "Wheel Sorter",
                "index": 3,
                "fileName": "3fba6eb03d423952ae925d41ee505a2d.jpg",
                "src": "assets/reference/Wheel Sorter/3fba6eb03d423952ae925d41ee505a2d.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/3fba6eb03d423952ae925d41ee505a2d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #03",
                "title": "[Wheel Sorter 사진 #03] Wheel Sorter 정밀 구동축 및 모듈형 카트리지 내부 구조",
                "desc": "개별 축의 점검과 교체가 간편하도록 설계된 모듈형 휠 어셈블리와 고정밀 서보 링크 메커니즘의 엔지니어링 디테일입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-4",
                "folder": "Wheel Sorter",
                "index": 4,
                "fileName": "4dc821f857b5456c2e939b1f0798a2bd.jpg",
                "src": "assets/reference/Wheel Sorter/4dc821f857b5456c2e939b1f0798a2bd.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/4dc821f857b5456c2e939b1f0798a2bd_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #04",
                "title": "[Wheel Sorter 사진 #04] Wheel Sorter 출고 전 공장 사전 시운전(FAT) 및 품질 검수",
                "desc": "고객사 현장 반입 전 당사 제조 거점에서 실제 화물을 투입하며 분기 각도, 처리 속도, 센서 동기화를 정밀 테스트하는 장면입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-5",
                "folder": "Wheel Sorter",
                "index": 5,
                "fileName": "5f9f477ebd0e9161333166420c9d8dd6.jpg",
                "src": "assets/reference/Wheel Sorter/5f9f477ebd0e9161333166420c9d8dd6.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/5f9f477ebd0e9161333166420c9d8dd6_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #05",
                "title": "[Wheel Sorter 사진 #05] Wheel Sorter 다축 옐로우·블랙 팝업 휠 매트릭스 상판 가동 순간",
                "desc": "레드 컬러의 고강성 상판에 촘촘히 배열된 독립 조향 팝업 휠들이 폴리백 화물을 우측 슈트로 고속 분기하는 역동적인 현장 클로즈업입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-6",
                "folder": "Wheel Sorter",
                "index": 6,
                "fileName": "5f4659d5a2d92be2be75584456d78563.jpg",
                "src": "assets/reference/Wheel Sorter/5f4659d5a2d92be2be75584456d78563.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/5f4659d5a2d92be2be75584456d78563.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #06",
                "title": "[Wheel Sorter 사진 #06] Wheel Sorter 현장 분류 라인 및 양방향 레드 가이드 슈트",
                "desc": "분류 거점마다 설치된 Wheel Sorter 모듈과 화물 이탈을 방지하는 레드 스틸 슈트가 물류센터 메인 라인에 완벽히 통합된 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-7",
                "folder": "Wheel Sorter",
                "index": 7,
                "fileName": "6c99dba5b46971f35ba897c2729086cc.jpg",
                "src": "assets/reference/Wheel Sorter/6c99dba5b46971f35ba897c2729086cc.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/6c99dba5b46971f35ba897c2729086cc_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #07",
                "title": "[Wheel Sorter 사진 #07] Wheel Sorter 정밀 구동축 및 모듈형 카트리지 내부 구조",
                "desc": "개별 축의 점검과 교체가 간편하도록 설계된 모듈형 휠 어셈블리와 고정밀 서보 링크 메커니즘의 엔지니어링 디테일입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-8",
                "folder": "Wheel Sorter",
                "index": 8,
                "fileName": "9dead2f88bb260cb0d5bc0648f7d6dbe.jpg",
                "src": "assets/reference/Wheel Sorter/9dead2f88bb260cb0d5bc0648f7d6dbe.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/9dead2f88bb260cb0d5bc0648f7d6dbe_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #08",
                "title": "[Wheel Sorter 사진 #08] Wheel Sorter 출고 전 공장 사전 시운전(FAT) 및 품질 검수",
                "desc": "고객사 현장 반입 전 당사 제조 거점에서 실제 화물을 투입하며 분기 각도, 처리 속도, 센서 동기화를 정밀 테스트하는 장면입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-9",
                "folder": "Wheel Sorter",
                "index": 9,
                "fileName": "55d139e6d20cb1ebfdfea205af334563.jpg",
                "src": "assets/reference/Wheel Sorter/55d139e6d20cb1ebfdfea205af334563.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/55d139e6d20cb1ebfdfea205af334563_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #09",
                "title": "[Wheel Sorter 사진 #09] Wheel Sorter 다축 옐로우·블랙 팝업 휠 매트릭스 상판 가동 순간",
                "desc": "레드 컬러의 고강성 상판에 촘촘히 배열된 독립 조향 팝업 휠들이 폴리백 화물을 우측 슈트로 고속 분기하는 역동적인 현장 클로즈업입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-10",
                "folder": "Wheel Sorter",
                "index": 10,
                "fileName": "490a8be681c8822474a9f00ff28e9d42.jpg",
                "src": "assets/reference/Wheel Sorter/490a8be681c8822474a9f00ff28e9d42.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/490a8be681c8822474a9f00ff28e9d42_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #10",
                "title": "[Wheel Sorter 사진 #10] Wheel Sorter 현장 분류 라인 및 양방향 레드 가이드 슈트",
                "desc": "분류 거점마다 설치된 Wheel Sorter 모듈과 화물 이탈을 방지하는 레드 스틸 슈트가 물류센터 메인 라인에 완벽히 통합된 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-11",
                "folder": "Wheel Sorter",
                "index": 11,
                "fileName": "6646f0a69480b06529c884928fa1a531.jpg",
                "src": "assets/reference/Wheel Sorter/6646f0a69480b06529c884928fa1a531.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/6646f0a69480b06529c884928fa1a531_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #11",
                "title": "[Wheel Sorter 사진 #11] Wheel Sorter 정밀 구동축 및 모듈형 카트리지 내부 구조",
                "desc": "개별 축의 점검과 교체가 간편하도록 설계된 모듈형 휠 어셈블리와 고정밀 서보 링크 메커니즘의 엔지니어링 디테일입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-12",
                "folder": "Wheel Sorter",
                "index": 12,
                "fileName": "7707fb5252d4d29bba4d81632aedefe4.jpg",
                "src": "assets/reference/Wheel Sorter/7707fb5252d4d29bba4d81632aedefe4.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/7707fb5252d4d29bba4d81632aedefe4_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #12",
                "title": "[Wheel Sorter 사진 #12] Wheel Sorter 출고 전 공장 사전 시운전(FAT) 및 품질 검수",
                "desc": "고객사 현장 반입 전 당사 제조 거점에서 실제 화물을 투입하며 분기 각도, 처리 속도, 센서 동기화를 정밀 테스트하는 장면입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-13",
                "folder": "Wheel Sorter",
                "index": 13,
                "fileName": "26227c98e09c83bd39091beaf5d19461.jpg",
                "src": "assets/reference/Wheel Sorter/26227c98e09c83bd39091beaf5d19461.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/26227c98e09c83bd39091beaf5d19461.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #13",
                "title": "[Wheel Sorter 사진 #13] Wheel Sorter 다축 옐로우·블랙 팝업 휠 매트릭스 상판 가동 순간",
                "desc": "레드 컬러의 고강성 상판에 촘촘히 배열된 독립 조향 팝업 휠들이 폴리백 화물을 우측 슈트로 고속 분기하는 역동적인 현장 클로즈업입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-14",
                "folder": "Wheel Sorter",
                "index": 14,
                "fileName": "b2bbdd0bc42dc1fefcce1345d40e25bd.jpg",
                "src": "assets/reference/Wheel Sorter/b2bbdd0bc42dc1fefcce1345d40e25bd.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/b2bbdd0bc42dc1fefcce1345d40e25bd_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #14",
                "title": "[Wheel Sorter 사진 #14] Wheel Sorter 현장 분류 라인 및 양방향 레드 가이드 슈트",
                "desc": "분류 거점마다 설치된 Wheel Sorter 모듈과 화물 이탈을 방지하는 레드 스틸 슈트가 물류센터 메인 라인에 완벽히 통합된 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-15",
                "folder": "Wheel Sorter",
                "index": 15,
                "fileName": "b825ec6ddb91f5b3523c95cf74598745.jpg",
                "src": "assets/reference/Wheel Sorter/b825ec6ddb91f5b3523c95cf74598745.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/b825ec6ddb91f5b3523c95cf74598745_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #15",
                "title": "[Wheel Sorter 사진 #15] Wheel Sorter 정밀 구동축 및 모듈형 카트리지 내부 구조",
                "desc": "개별 축의 점검과 교체가 간편하도록 설계된 모듈형 휠 어셈블리와 고정밀 서보 링크 메커니즘의 엔지니어링 디테일입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-16",
                "folder": "Wheel Sorter",
                "index": 16,
                "fileName": "bf99933c4f063b9a404773d8ebf16088.jpg",
                "src": "assets/reference/Wheel Sorter/bf99933c4f063b9a404773d8ebf16088.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/bf99933c4f063b9a404773d8ebf16088_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #16",
                "title": "[Wheel Sorter 사진 #16] Wheel Sorter 출고 전 공장 사전 시운전(FAT) 및 품질 검수",
                "desc": "고객사 현장 반입 전 당사 제조 거점에서 실제 화물을 투입하며 분기 각도, 처리 속도, 센서 동기화를 정밀 테스트하는 장면입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-17",
                "folder": "Wheel Sorter",
                "index": 17,
                "fileName": "bfafd228e5036feb1a51e9b14d348bb3.jpg",
                "src": "assets/reference/Wheel Sorter/bfafd228e5036feb1a51e9b14d348bb3.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/bfafd228e5036feb1a51e9b14d348bb3_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #17",
                "title": "[Wheel Sorter 사진 #17] Wheel Sorter 다축 옐로우·블랙 팝업 휠 매트릭스 상판 가동 순간",
                "desc": "레드 컬러의 고강성 상판에 촘촘히 배열된 독립 조향 팝업 휠들이 폴리백 화물을 우측 슈트로 고속 분기하는 역동적인 현장 클로즈업입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-18",
                "folder": "Wheel Sorter",
                "index": 18,
                "fileName": "cfab01aec35365e32f24cfb4abb2a13e.jpg",
                "src": "assets/reference/Wheel Sorter/cfab01aec35365e32f24cfb4abb2a13e.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/cfab01aec35365e32f24cfb4abb2a13e_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #18",
                "title": "[Wheel Sorter 사진 #18] Wheel Sorter 현장 분류 라인 및 양방향 레드 가이드 슈트",
                "desc": "분류 거점마다 설치된 Wheel Sorter 모듈과 화물 이탈을 방지하는 레드 스틸 슈트가 물류센터 메인 라인에 완벽히 통합된 모습입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-19",
                "folder": "Wheel Sorter",
                "index": 19,
                "fileName": "d8804faf73f906057f63a108a925d02d.jpg",
                "src": "assets/reference/Wheel Sorter/d8804faf73f906057f63a108a925d02d.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/d8804faf73f906057f63a108a925d02d_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #19",
                "title": "[Wheel Sorter 사진 #19] Wheel Sorter 정밀 구동축 및 모듈형 카트리지 내부 구조",
                "desc": "개별 축의 점검과 교체가 간편하도록 설계된 모듈형 휠 어셈블리와 고정밀 서보 링크 메커니즘의 엔지니어링 디테일입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            },
            {
                "id": "Wheel Sorter-pho-20",
                "folder": "Wheel Sorter",
                "index": 20,
                "fileName": "da5d2e7d328ea9749af8510475ced588.jpg",
                "src": "assets/reference/Wheel Sorter/da5d2e7d328ea9749af8510475ced588.jpg",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "thumb": "assets/reference/Wheel Sorter/da5d2e7d328ea9749af8510475ced588_thumb.jpg",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Wheel Sorter.jpg",
                "clipCode": "Wheel Sorter 현장포토 #20",
                "title": "[Wheel Sorter 사진 #20] Wheel Sorter 출고 전 공장 사전 시운전(FAT) 및 품질 검수",
                "desc": "고객사 현장 반입 전 당사 제조 거점에서 실제 화물을 투입하며 분기 각도, 처리 속도, 센서 동기화를 정밀 테스트하는 장면입니다.",
                "tags": [
                    "Popup Wheel Sorter",
                    "다축 독립 조향",
                    "폴리백/소형박스 특화",
                    "모듈형 빠른 설치"
                ]
            }
        ]
    },
    "틸트트레이소터": {
        "id": "틸트트레이소터",
        "title": "틸트트레이소터",
        "subtitle": "틸트트레이소터 [Tilt Tray Sorter] — 대용량 순환형 틸트트레이 분류 시스템",
        "badge": "TILT TRAY SORTER",
        "icon": "fa-clone",
        "overview": "트랙을 따라 연속 순환하는 독립 트레이(Tray)가 목적지 슈트 상단에서 정밀하게 양방향 틸팅(기울임)되어 화물을 중력 슬라이딩 방식으로 안전하게 배출하는 순환형 자동 분류 시스템입니다. 의류, 폴리백, 서적, 소형 박스는 물론 신선 물류까지 폭넓은 카고 스펙트럼을 자랑합니다.",
        "tags": [
            "Tilt Tray Sorter",
            "양방향 정밀 틸팅",
            "순환형 루프 설계",
            "의류/소형화물/신선물류"
        ],
        "videoTemplates": [
            {
                "title": "틸트트레이소터(Tilt Tray Sorter) 고속 순환 및 정밀 틸팅 시뮬레이션·가동",
                "desc": "순환 트랙을 주행하는 트레이들이 지정된 배출구 위치에서 정확한 각도로 기울어지며 화물을 양측 슈트로 신속하게 분류하는 핵심 메커니즘 영상입니다."
            }
        ],
        "photoTemplates": [
            {
                "title": "틸트트레이소터(Tilt Tray Sorter) 순환 루프 및 다열 슈트 3D 엔지니어링 레이아웃",
                "desc": "고속 자동 투입 인덕션 라인, 순환형 트레이 트랙, 그리고 내·외측에 고밀도로 배치된 다열 배출 슈트의 전체 구조를 한눈에 보여주는 정밀 설계도입니다."
            }
        ],
        "videoCount": 1,
        "photoCount": 1,
        "videos": [
            {
                "id": "틸트트레이소터-vid-1",
                "folder": "틸트트레이소터",
                "index": 1,
                "fileName": "Tilt Tray Sorter.mp4",
                "src": "assets/reference/틸트트레이소터/Tilt Tray Sorter.mp4",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.mp4",
                "thumb": "assets/reference/틸트트레이소터/Tilt Tray Sorter.png",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.png",
                "clipCode": "Tilt Tray Sorter",
                "title": "[틸트트레이소터 영상 #01] 틸트트레이소터(Tilt Tray Sorter) 고속 순환 및 정밀 틸팅 시뮬레이션·가동",
                "desc": "순환 트랙을 주행하는 트레이들이 지정된 배출구 위치에서 정확한 각도로 기울어지며 화물을 양측 슈트로 신속하게 분류하는 핵심 메커니즘 영상입니다.",
                "tags": [
                    "Tilt Tray Sorter",
                    "양방향 정밀 틸팅",
                    "순환형 루프 설계",
                    "의류/소형화물/신선물류"
                ]
            }
        ],
        "photos": [
            {
                "id": "틸트트레이소터-pho-1",
                "folder": "틸트트레이소터",
                "index": 1,
                "fileName": "Tilt Tray Sorter.png",
                "src": "assets/reference/틸트트레이소터/Tilt Tray Sorter.png",
                "fallbackSrc": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.png",
                "thumb": "assets/reference/틸트트레이소터/Tilt Tray Sorter.png",
                "fallbackThumb": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.png",
                "clipCode": "틸트트레이소터 현장포토 #01",
                "title": "[틸트트레이소터 사진 #01] 틸트트레이소터(Tilt Tray Sorter) 순환 루프 및 다열 슈트 3D 엔지니어링 레이아웃",
                "desc": "고속 자동 투입 인덕션 라인, 순환형 트레이 트랙, 그리고 내·외측에 고밀도로 배치된 다열 배출 슈트의 전체 구조를 한눈에 보여주는 정밀 설계도입니다.",
                "tags": [
                    "Tilt Tray Sorter",
                    "양방향 정밀 틸팅",
                    "순환형 루프 설계",
                    "의류/소형화물/신선물류"
                ]
            }
        ]
    }
};

    // ==========================================================================
    // 2. 상태 관리 변수
    // ==========================================================================
    var currentCategory = "all";       // 현재 선택된 폴더 ('all' 또는 6대 폴더명)
    var currentVideoList = [];         // 현재 카테고리의 동영상 배열
    var currentPhotoList = [];         // 현재 카테고리의 이미지 배열
    var currentVideoIndex = 0;         // 가운데 동영상 플레이어에서 현재 재생 중인 인덱스
    var currentPhotoIndex = 0;         // 가운데 이미지 뷰어에서 현재 표시 중인 인덱스
    var autoPlayNextVideo = true;      // 동영상 종료 시 다음 영상 자동 재생 여부
    var photoSlideshowTimer = null;    // 이미지 자동 슬라이드쇼 타이머

    // ==========================================================================
    // 3. 유틸리티 함수 (URL 안전 인코딩 및 무결점 이미지/영상 폴백 처리)
    // ==========================================================================
    function safeUrl(rawPath) {
        if (!rawPath) return "";
        return rawPath.split("/").map(function (segment) {
            return encodeURIComponent(segment);
        }).join("/");
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 이미지 로드 실패 시 원본 경로 -> 폴백 경로 -> 기본 플레이스홀더 순으로 무결점 복구
    window.handleRefImgError = function (imgEl) {
        if (!imgEl) return;
        var rawSrc = imgEl.getAttribute("data-raw-src");
        var fbSrc = imgEl.getAttribute("data-fallback-src");

        if (!imgEl.dataset.triedRaw && rawSrc && imgEl.src.indexOf(rawSrc) === -1) {
            imgEl.dataset.triedRaw = "1";
            imgEl.src = rawSrc;
            return;
        }
        if (!imgEl.dataset.triedDrive && rawSrc && rawSrc.indexOf("assets/reference/") === 0) { imgEl.dataset.triedDrive = "1"; imgEl.src = safeUrl("../../A00. [ 주식회사 에이티에이기술 ]/■ 05. [ 주식회사 에이티에이기술 ] _ 제안서 및 제품소개서/[ Movie & Photo ]/" + rawSrc.substring(17)); return; } if (!imgEl.dataset.triedFallback && fbSrc) {
            imgEl.dataset.triedFallback = "1";
            imgEl.src = safeUrl(fbSrc);
            return;
        }
        imgEl.onerror = null;
        imgEl.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-family='sans-serif' font-size='18' font-weight='bold'%3EATA TECHNOLOGY REFERENCE%3C/text%3E%3C/svg%3E";
    };

    // 비디오 로드 실패 시 인코딩 경로 -> 원본 경로 -> 폴백 경로 순으로 무결점 복구
    window.handleRefVideoError = function (videoEl) {
        if (!videoEl) return;
        var rawSrc = videoEl.getAttribute("data-raw-src");
        var fbSrc = videoEl.getAttribute("data-fallback-src");

        if (!videoEl.dataset.triedRaw && rawSrc) {
            videoEl.dataset.triedRaw = "1";
            videoEl.src = rawSrc;
            videoEl.load();
            return;
        }
        if (!videoEl.dataset.triedDrive && rawSrc && rawSrc.indexOf("assets/reference/") === 0) { videoEl.dataset.triedDrive = "1"; videoEl.src = safeUrl("../../A00. [ 주식회사 에이티에이기술 ]/■ 05. [ 주식회사 에이티에이기술 ] _ 제안서 및 제품소개서/[ Movie & Photo ]/" + rawSrc.substring(17)); videoEl.load(); return; } if (!videoEl.dataset.triedFallback && fbSrc) {
            videoEl.dataset.triedFallback = "1";
            videoEl.src = safeUrl(fbSrc);
            videoEl.load();
            return;
        }
    };


    // ==========================================================================
    // 3-1. 동영상/이미지 시어터 레이아웃 정밀 스타일 주입 (Tailwind 미빌드 환경 완벽 대응)
    // ==========================================================================
    function ensureReferenceTheaterStyles() {
        if (document.getElementById("ref-dual-theater-custom-styles")) return;
        var styleEl = document.createElement("style");
        styleEl.id = "ref-dual-theater-custom-styles";
        styleEl.textContent = [
            "/* 레퍼런스 섹션 내 모든 요소 투명화(opacity:0) 방지 */",
            "#view-reference .fade-in { opacity: 1 !important; transform: translateY(0) !important; }",
            "/* 시어터 외부 다크 컨테이너 */",
            ".ref-theater-shell { background-color: #020617 !important; color: #ffffff !important; border-radius: 1.5rem !important; padding: 1.5rem !important; border: 1px solid #1e293b !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.45) !important; }",
            "/* 2단 그리드: 좌측(가운데) 메인 뷰어 66% / 우측 썸네일 리스트 34% */",
            ".ref-theater-grid { display: grid !important; grid-template-columns: 1fr !important; gap: 1.5rem !important; align-items: stretch !important; }",
            "@media (min-width: 1024px) {",
            "  .ref-theater-grid { grid-template-columns: minmax(0, 66%) minmax(320px, 34%) !important; }",
            "}",
            "/* 좌측(가운데) 메인 컬럼 */",
            ".ref-main-col { display: flex !important; flex-direction: column !important; justify-content: space-between !important; gap: 1rem !important; min-width: 0 !important; }",
            "/* 메인 영상창 & 메인 이미지창 (16:9 고정 비율 및 최대 높이 제한으로 깔끔하게 정리) */",
            ".ref-main-stage { width: 100% !important; aspect-ratio: 16 / 9 !important; height: auto !important; max-height: 500px !important; background-color: #000000 !important; border-radius: 1rem !important; overflow: hidden !important; position: relative !important; border: 1px solid #1e293b !important; display: flex !important; align-items: center !important; justify-content: center !important; }",
            ".ref-main-stage video, .ref-main-stage img { width: 100% !important; height: 100% !important; max-height: 500px !important; object-fit: contain !important; background-color: #000000 !important; display: block !important; }",
            "/* 메인 하단 분석 해설 카드 */",
            ".ref-caption-box { background-color: #0f172a !important; border: 1px solid #1e293b !important; border-radius: 1rem !important; padding: 1.25rem !important; }",
            ".ref-caption-inner { background-color: #020617 !important; border: 1px solid #1e293b !important; border-radius: 0.75rem !important; padding: 0.875rem !important; margin-top: 0.75rem !important; }",
            "/* 우측 썸네일 사이드바 패널 */",
            ".ref-side-col { display: flex !important; flex-direction: column !important; background-color: #0f172a !important; border: 1px solid #1e293b !important; border-radius: 1rem !important; overflow: hidden !important; min-width: 0 !important; max-height: 680px !important; }",
            ".ref-side-header { padding: 1rem 1.25rem !important; background-color: #0f172a !important; border-bottom: 1px solid #1e293b !important; display: flex !important; align-items: center !important; justify-content: space-between !important; flex-shrink: 0 !important; }",
            ".ref-playlist-scroll { padding: 0.75rem !important; overflow-y: auto !important; max-height: 580px !important; display: flex !important; flex-direction: column !important; gap: 0.625rem !important; flex: 1 1 auto !important; }",
            "/* 우측 개별 썸네일 아이템 카드 */",
            ".ref-yt-thumb-item, .ref-photo-thumb-item { display: flex !important; flex-direction: row !important; align-items: center !important; gap: 0.75rem !important; padding: 0.625rem !important; border-radius: 0.75rem !important; cursor: pointer !important; transition: all 0.2s ease !important; }",
            "/* 우측 썸네일 이미지 박스 (128x72px 고정 크기로 절대 깨지지 않게 고정) */",
            ".ref-thumb-media-box { width: 128px !important; min-width: 128px !important; max-width: 128px !important; height: 72px !important; border-radius: 0.5rem !important; overflow: hidden !important; background-color: #020617 !important; position: relative !important; flex-shrink: 0 !important; border: 1px solid #334155 !important; }",
            ".ref-thumb-media-box img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; }"
        ].join("\n");
        document.head.appendChild(styleEl);
    }

    // 선택된 카테고리의 동영상/이미지 배열 반환
    function getFilteredMedia(category) {
        if (!category || category === "all") {
            var allVideos = [];
            var allPhotos = [];
            FOLDER_ORDER.forEach(function (folderName) {
                var folderData = REFERENCE_GALLERY_DB[folderName];
                if (folderData) {
                    allVideos = allVideos.concat(folderData.videos || []);
                    allPhotos = allPhotos.concat(folderData.photos || []);
                }
            });
            return {
                id: "all",
                title: "전체 구축 실적 (All Reference)",
                subtitle: "스마트 물류 제조 거점 전경 및 5대 핵심 소터(CBS · NC CBS · NBS · Wheel Sorter · 틸트트레이소터) 종합 아카이브",
                badge: "ALL LOGISTICS TRACK RECORD",
                icon: "fa-layer-group",
                overview: "주식회사 에이티에이기술의 대규모 스마트 물류 제조 거점 항공 전경부터 CBS, NC CBS, NBS, Wheel Sorter, 틸트트레이소터까지 실제 물류 현장에서 가동 중인 영상과 고화질 사진을 폴더별로 한눈에 확인하실 수 있습니다.",
                tags: ["전경", "CBS", "NC CBS", "NBS", "Wheel Sorter", "틸트트레이소터"],
                videos: allVideos,
                photos: allPhotos
            };
        }

        // 구형 카테고리 코드 호환 매핑
        var mappedCategory = category;
        if (category === "ecommerce") mappedCategory = "CBS";
        else if (category === "food") mappedCategory = "NBS";
        else if (category === "manu") mappedCategory = "Wheel Sorter";

        var target = REFERENCE_GALLERY_DB[mappedCategory] || REFERENCE_GALLERY_DB["CBS"];
        return {
            id: target.id,
            title: target.title,
            subtitle: target.subtitle,
            badge: target.badge,
            icon: target.icon,
            overview: target.overview,
            tags: target.tags || [],
            videos: target.videos || [],
            photos: target.photos || []
        };
    }

    // ==========================================================================
    // 4. 상단 폴더별 카테고리 탭 바 렌더링
    // ==========================================================================
    function renderCategoryTabs() {
        var tabBar = document.getElementById("ref-folder-tabs-bar");
        if (!tabBar) return;

        var totalVideos = 0;
        var totalPhotos = 0;
        FOLDER_ORDER.forEach(function (f) {
            totalVideos += (REFERENCE_GALLERY_DB[f].videoCount || 0);
            totalPhotos += (REFERENCE_GALLERY_DB[f].photoCount || 0);
        });

        var tabsConfig = [
            {
                id: "all",
                label: "전체 보기",
                icon: "fa-layer-group",
                countText: "영상 " + totalVideos + " · 사진 " + totalPhotos
            }
        ];

        FOLDER_ORDER.forEach(function (f) {
            var d = REFERENCE_GALLERY_DB[f];
            var badgeParts = [];
            if (d.videoCount > 0) badgeParts.push("영상 " + d.videoCount);
            if (d.photoCount > 0) badgeParts.push("사진 " + d.photoCount);
            tabsConfig.push({
                id: f,
                label: f,
                icon: d.icon || "fa-folder-open",
                countText: badgeParts.join(" · ")
            });
        });

        var html = [];
        tabsConfig.forEach(function (tab) {
            var isActive = (currentCategory === tab.id);
            var btnClass = isActive
                ? "ref-filter-tab min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white ring-2 ring-blue-400 cursor-pointer active:scale-95"
                : "ref-filter-tab min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm bg-white text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 border border-slate-200 cursor-pointer active:scale-95";
            var badgeClass = isActive
                ? "ref-tab-badge text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/25 text-white"
                : "ref-tab-badge text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200";
            var iconClass = isActive ? "text-white" : "text-blue-500";

            html.push(
                '<button type="button" onclick="window.filterReference(\'' + escapeHtml(tab.id) + '\')" class="' + btnClass + '">',
                '  <i class="fa-solid ' + tab.icon + ' ' + iconClass + ' text-xs"></i>',
                '  <span>' + escapeHtml(tab.label) + '</span>',
                '  <span class="' + badgeClass + '">' + escapeHtml(tab.countText) + '</span>',
                '</button>'
            );
        });

        tabBar.innerHTML = html.join("");
    }

    // ==========================================================================
    // 5. 선택된 폴더의 전문 분석 브리핑 배너 렌더링
    // ==========================================================================
    function renderCategoryBriefing(mediaData) {
        var box = document.getElementById("ref-category-briefing");
        if (!box) return;

        var tagsHtml = (mediaData.tags || []).map(function (t) {
            return '<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><i class="fa-solid fa-check text-[10px] text-blue-500"></i>' + escapeHtml(t) + '</span>';
        }).join("");

        var hasVideos = mediaData.videos && mediaData.videos.length > 0;
        var hasPhotos = mediaData.photos && mediaData.photos.length > 0;

        box.innerHTML = [
            '<div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md relative overflow-hidden">',
            '  <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-50 via-cyan-50/40 to-transparent rounded-bl-full pointer-events-none"></div>',
            '  <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">',
            '    <div class="space-y-3 max-w-4xl">',
            '      <div class="flex flex-wrap items-center gap-2.5">',
            '        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-900 text-cyan-300">',
            '          <i class="fa-solid ' + (mediaData.icon || 'fa-folder-open') + '"></i> ' + escapeHtml(mediaData.badge),
            '        </span>',
            hasVideos ? '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200"><i class="fa-brands fa-youtube"></i> 동영상 ' + mediaData.videos.length + '편</span>' : '',
            hasPhotos ? '<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><i class="fa-solid fa-images"></i> 이미지 ' + mediaData.photos.length + '장</span>' : '',
            '      </div>',
            '      <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">',
            '        ' + escapeHtml(mediaData.subtitle || mediaData.title),
            '      </h3>',
            '      <p class="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">',
            '        ' + escapeHtml(mediaData.overview),
            '      </p>',
            '      <div class="flex flex-wrap gap-2 pt-1">' + tagsHtml + '</div>',
            '    </div>',
            '    <div class="flex sm:flex-row lg:flex-col gap-2.5 shrink-0">',
            hasVideos ? '      <button type="button" onclick="window.ReferenceAdmin.scrollToSection(\'ref-youtube-section\')" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer active:scale-95"><i class="fa-brands fa-youtube text-base"></i> 동영상 시어터 바로가기 (' + mediaData.videos.length + ')</button>' : '',
            hasPhotos ? '      <button type="button" onclick="window.ReferenceAdmin.scrollToSection(\'ref-photo-section\')" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"><i class="fa-solid fa-images text-base"></i> 이미지 시어터 바로가기 (' + mediaData.photos.length + ')</button>' : '',
            '    </div>',
            '  </div>',
            '</div>'
        ].join("");
    }

    // ==========================================================================
    // 6. 섹션 1: 동영상 시어터 (가운데 메인 영상 재생 + 우측 썸네일 리스트 표시)
    // ==========================================================================
    function renderYoutubeSection() {
        var section = document.getElementById("ref-youtube-section");
        if (!section) return;

        if (!currentVideoList || currentVideoList.length === 0) {
            section.innerHTML = "";
            section.classList.add("hidden");
            return;
        }

        section.classList.remove("hidden");
        if (currentVideoIndex < 0 || currentVideoIndex >= currentVideoList.length) {
            currentVideoIndex = 0;
        }

        var activeVid = currentVideoList[currentVideoIndex];
        var videoSrc = safeUrl(activeVid.src);
        var posterSrc = activeVid.thumb ? safeUrl(activeVid.thumb) : "";

        // 우측 동영상 썸네일 목록 생성
        var playlistHtml = currentVideoList.map(function (v, idx) {
            var isPlaying = (idx === currentVideoIndex);
            var itemBg = isPlaying
                ? "bg-blue-950/90 border-cyan-400 ring-2 ring-cyan-400/50 shadow-md"
                : "bg-slate-900/90 hover:bg-slate-800/90 border-slate-800";
            var thumbUrl = v.thumb ? safeUrl(v.thumb) : "";

            return [
                '<div id="ref-yt-playlist-item-' + idx + '" onclick="window.ReferenceAdmin.playVideoAtIndex(' + idx + ')"',
                '     class="ref-yt-thumb-item group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ' + itemBg + '">',
                '  <!-- 썸네일 이미지 박스 -->',
                '  <div class="ref-thumb-media-box w-32 sm:w-36 aspect-video rounded-lg overflow-hidden bg-slate-950 relative shrink-0 border border-slate-700/80">',
                thumbUrl
                    ? '    <img src="' + thumbUrl + '" data-raw-src="' + escapeHtml(v.thumb) + '" data-fallback-src="' + escapeHtml(v.fallbackThumb || '') + '" onerror="window.handleRefImgError(this)" loading="lazy" alt="' + escapeHtml(v.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">'
                    : '    <div class="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500"><i class="fa-solid fa-film text-xl"></i></div>',
                '    <div class="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">',
                isPlaying
                    ? '      <span class="ref-yt-thumb-badge px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1 shadow"><i class="fa-solid fa-volume-high animate-pulse"></i> 재생중</span>'
                    : '      <div class="ref-yt-thumb-badge w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center group-hover:bg-red-600 transition-colors shadow"><i class="fa-solid fa-play text-xs ml-0.5"></i></div>',
                '    </div>',
                '    <span class="absolute bottom-1 right-1 bg-black/85 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#' + String(idx + 1).padStart(2, "0") + '</span>',
                '  </div>',
                '  <!-- 우측 썸네일 텍스트 정보 -->',
                '  <div class="flex-1 min-w-0 py-0.5">',
                '    <div class="flex items-center gap-1.5 mb-1">',
                '      <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-300 border border-red-500/30">' + escapeHtml(v.folder) + '</span>',
                '      <span class="text-[11px] text-slate-400 truncate">' + escapeHtml(v.clipCode) + '</span>',
                '    </div>',
                '    <h5 class="ref-yt-thumb-title text-xs sm:text-[13px] font-bold ' + (isPlaying ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200') + ' line-clamp-2 leading-snug mb-1">' + escapeHtml(v.title) + '</h5>',
                '    <p class="text-[11px] text-slate-400 line-clamp-1">' + escapeHtml(v.desc) + '</p>',
                '  </div>',
                '</div>'
            ].join("");
        }).join("");

        section.innerHTML = [
            '<div class="space-y-5">',
            '  <!-- 섹션 타이틀 헤더 -->',
            '  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">',
            '    <div>',
            '      <div class="inline-flex items-center gap-2 text-red-600 font-extrabold text-xs uppercase tracking-widest mb-1">',
            '        <i class="fa-brands fa-youtube text-base"></i> YOUTUBE STYLE VIDEO THEATER',
            '      </div>',
            '      <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">',
            '        동영상 시어터 <span class="text-base sm:text-lg font-bold text-red-600 ml-1">(총 ' + currentVideoList.length + '편 · 가운데 영상 재생 / 우측 썸네일 선택)</span>',
            '      </h3>',
            '    </div>',
            '    <div class="flex flex-wrap items-center gap-2">',
            '      <button type="button" id="ref-yt-autoplay-btn" onclick="window.ReferenceAdmin.toggleAutoPlay()" class="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ' + (autoPlayNextVideo ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-white text-slate-600 border-slate-300') + '">',
            '        <i class="fa-solid ' + (autoPlayNextVideo ? 'fa-toggle-on text-white' : 'fa-toggle-off') + ' mr-1 text-sm"></i> 연속 자동재생 ' + (autoPlayNextVideo ? 'ON' : 'OFF'),
            '      </button>',
            '      <button type="button" onclick="window.ReferenceAdmin.prevVideo()" class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"><i class="fa-solid fa-backward-step mr-1"></i> 이전 영상</button>',
            '      <button type="button" onclick="window.ReferenceAdmin.nextVideo()" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer">다음 영상 <i class="fa-solid fa-forward-step ml-1"></i></button>',
            '    </div>',
            '  </div>',

            '  <!-- 동영상 시어터 본체 (가운데 8칸: 메인 영상 플레이어 & 해설 / 우측 4칸: 동영상 썸네일 목록) -->',
            '  <div id="ref-yt-theater-box" class="ref-theater-shell bg-slate-950 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl border border-slate-800 text-white">',
            '    <div class="ref-theater-grid grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">',
            '      <!-- [가운데 메인 영역 (8칸)] 비디오 플레이어 및 설비 분석 해설 -->',
            '      <div class="ref-main-col lg:col-span-8 flex flex-col justify-between space-y-4">',
            '        <div class="ref-main-stage w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner flex items-center justify-center">',
            '          <video id="ref-yt-main-video" controls playsinline preload="metadata"',
            posterSrc ? '                 poster="' + posterSrc + '"' : '',
            '                 src="' + videoSrc + '"',
            '                 data-raw-src="' + escapeHtml(activeVid.src) + '"',
            '                 data-fallback-src="' + escapeHtml(activeVid.fallbackSrc || '') + '"',
            '                 onerror="window.handleRefVideoError(this)"',
            '                 class="w-full h-full object-contain bg-black"></video>',
            '        </div>',

            '        <!-- 현재 재생 중인 동영상 제목 및 엔지니어링 분석 해설 -->',
            '        <div class="ref-caption-box bg-slate-900/95 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">',
            '          <div class="flex flex-wrap items-center justify-between gap-2">',
            '            <div class="flex flex-wrap items-center gap-2">',
            '              <span id="ref-yt-active-folder" class="px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white flex items-center gap-1.5">',
            '                <i class="fa-brands fa-youtube"></i> ' + escapeHtml(activeVid.folder),
            '              </span>',
            '              <span id="ref-yt-active-counter" class="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-cyan-300 border border-slate-700">',
            '                영상 순서: ' + (currentVideoIndex + 1) + ' / ' + currentVideoList.length,
            '              </span>',
            '              <span id="ref-yt-active-clip" class="text-xs text-slate-400 font-medium">',
            '                ' + escapeHtml(activeVid.clipCode),
            '              </span>',
            '            </div>',
            '            <div class="flex items-center gap-2">',
            '              <button type="button" onclick="window.ReferenceAdmin.prevVideo()" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"><i class="fa-solid fa-chevron-left mr-1"></i>이전 영상</button>',
            '              <button type="button" onclick="window.ReferenceAdmin.nextVideo()" class="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer">다음 영상<i class="fa-solid fa-chevron-right ml-1"></i></button>',
            '            </div>',
            '          </div>',
            '          <h4 id="ref-yt-active-title" class="text-lg sm:text-xl font-black text-white leading-snug">',
            '            ' + escapeHtml(activeVid.title),
            '          </h4>',
            '          <div class="ref-caption-inner bg-slate-950/90 rounded-xl p-3.5 border border-slate-800/90">',
            '            <div class="text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1.5">',
            '              <i class="fa-solid fa-microchip"></i> 현장 동영상 분석 멘트',
            '            </div>',
            '            <p id="ref-yt-active-desc" class="text-xs sm:text-sm text-slate-200 leading-relaxed">',
            '              ' + escapeHtml(activeVid.desc),
            '            </p>',
            '          </div>',
            '        </div>',
            '      </div>',

            '      <!-- [우측 영역 (4칸)] 동영상 썸네일 재생목록 사이드바 -->',
            '      <div class="ref-side-col lg:col-span-4 flex flex-col bg-slate-900/75 rounded-2xl border border-slate-800 overflow-hidden">',
            '        <div class="ref-side-header p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">',
            '          <div>',
            '            <h4 class="text-sm font-extrabold text-white flex items-center gap-2">',
            '              <i class="fa-solid fa-circle-play text-red-500"></i> 동영상 썸네일 목록',
            '            </h4>',
            '            <p class="text-[11px] text-slate-400 mt-0.5">우측 썸네일을 클릭하면 가운데에서 재생됩니다</p>',
            '          </div>',
            '          <span id="ref-yt-playlist-badge" class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-500/20 text-red-300 border border-red-500/30">',
            '            ' + (currentVideoIndex + 1) + ' / ' + currentVideoList.length,
            '          </span>',
            '        </div>',
            '        <div id="ref-yt-playlist-scroll" class="ref-playlist-scroll p-3 space-y-2.5 max-h-[460px] lg:max-h-[560px] overflow-y-auto custom-scrollbar flex-1">',
            playlistHtml,
            '        </div>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join("");

        bindVideoEndedEvent();
    }

    function bindVideoEndedEvent() {
        var videoEl = document.getElementById("ref-yt-main-video");
        if (videoEl) {
            videoEl.onended = function () {
                if (autoPlayNextVideo && currentVideoList.length > 1) {
                    window.ReferenceAdmin.nextVideo();
                }
            };
        }
    }

    // 깜빡임 없이 가운데 동영상 플레이어와 우측 썸네일 활성 상태만 즉시 갱신
    function updateActiveVideoUI(shouldAutoPlay) {
        if (!currentVideoList || currentVideoList.length === 0) return;
        var activeVid = currentVideoList[currentVideoIndex];
        if (!activeVid) return;

        var videoEl = document.getElementById("ref-yt-main-video");
        if (!videoEl) {
            renderYoutubeSection();
            return;
        }

        // 1) 가운데 비디오 플레이어 소스 및 포스터 교체
        delete videoEl.dataset.triedRaw; delete videoEl.dataset.triedDrive;
        delete videoEl.dataset.triedFallback;
        videoEl.setAttribute("data-raw-src", activeVid.src || "");
        videoEl.setAttribute("data-fallback-src", activeVid.fallbackSrc || "");
        if (activeVid.thumb) {
            videoEl.poster = safeUrl(activeVid.thumb);
        } else {
            videoEl.removeAttribute("poster");
        }
        videoEl.src = safeUrl(activeVid.src);
        videoEl.load();

        if (shouldAutoPlay) {
            var playPromise = videoEl.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {});
            }
        }

        // 2) 가운데 하단 텍스트 정보 교체
        var folderEl = document.getElementById("ref-yt-active-folder");
        var counterEl = document.getElementById("ref-yt-active-counter");
        var clipEl = document.getElementById("ref-yt-active-clip");
        var titleEl = document.getElementById("ref-yt-active-title");
        var descEl = document.getElementById("ref-yt-active-desc");
        var badgeEl = document.getElementById("ref-yt-playlist-badge");

        if (folderEl) folderEl.innerHTML = '<i class="fa-brands fa-youtube"></i> ' + escapeHtml(activeVid.folder);
        if (counterEl) counterEl.textContent = "영상 순서: " + (currentVideoIndex + 1) + " / " + currentVideoList.length;
        if (clipEl) clipEl.textContent = activeVid.clipCode;
        if (titleEl) titleEl.textContent = activeVid.title;
        if (descEl) descEl.textContent = activeVid.desc;
        if (badgeEl) badgeEl.textContent = (currentVideoIndex + 1) + " / " + currentVideoList.length;

        // 3) 우측 썸네일 리스트 하이라이트 업데이트 및 자동 스크롤
        currentVideoList.forEach(function (v, idx) {
            var itemEl = document.getElementById("ref-yt-playlist-item-" + idx);
            if (!itemEl) return;
            var isPlaying = (idx === currentVideoIndex);
            itemEl.className = "ref-yt-thumb-item group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer " + (
                isPlaying
                    ? "bg-blue-950/90 border-cyan-400 ring-2 ring-cyan-400/50 shadow-md"
                    : "bg-slate-900/90 hover:bg-slate-800/90 border-slate-800"
            );
            var tEl = itemEl.querySelector(".ref-yt-thumb-title");
            if (tEl) {
                tEl.className = "ref-yt-thumb-title text-xs sm:text-[13px] font-bold " + (isPlaying ? "text-cyan-300" : "text-white group-hover:text-cyan-200") + " line-clamp-2 leading-snug mb-1";
            }
            var bEl = itemEl.querySelector(".ref-yt-thumb-badge");
            if (bEl) {
                bEl.outerHTML = isPlaying
                    ? '<span class="ref-yt-thumb-badge px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1 shadow"><i class="fa-solid fa-volume-high animate-pulse"></i> 재생중</span>'
                    : '<div class="ref-yt-thumb-badge w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center group-hover:bg-red-600 transition-colors shadow"><i class="fa-solid fa-play text-xs ml-0.5"></i></div>';
            }
        });

        var activeItemEl = document.getElementById("ref-yt-playlist-item-" + currentVideoIndex);
        var scrollContainer = document.getElementById("ref-yt-playlist-scroll");
        if (activeItemEl && scrollContainer) {
            var itemTop = activeItemEl.offsetTop - scrollContainer.offsetTop;
            scrollContainer.scrollTo({
                top: Math.max(0, itemTop - 80),
                behavior: "smooth"
            });
        }
    }

    // ==========================================================================
    // 7. 섹션 2: 이미지 시어터 (동영상과 동일한 스타일! 가운데 메인 사진 + 우측 썸네일 표시)
    // ==========================================================================
    function renderPhotoSection() {
        var section = document.getElementById("ref-photo-section");
        if (!section) return;

        if (!currentPhotoList || currentPhotoList.length === 0) {
            section.innerHTML = "";
            section.classList.add("hidden");
            return;
        }

        section.classList.remove("hidden");
        if (currentPhotoIndex < 0 || currentPhotoIndex >= currentPhotoList.length) {
            currentPhotoIndex = 0;
        }

        var activePhoto = currentPhotoList[currentPhotoIndex];
        var mainImgSrc = safeUrl(activePhoto.src);

        // 우측 이미지 썸네일 목록 생성 (동영상 재생목록과 동일한 스타일)
        var photoPlaylistHtml = currentPhotoList.map(function (p, idx) {
            var isViewing = (idx === currentPhotoIndex);
            var itemBg = isViewing
                ? "bg-blue-950/90 border-cyan-400 ring-2 ring-cyan-400/50 shadow-md"
                : "bg-slate-900/90 hover:bg-slate-800/90 border-slate-800";
            var thumbUrl = safeUrl(p.thumb || p.src);

            return [
                '<div id="ref-photo-playlist-item-' + idx + '" onclick="window.ReferenceAdmin.selectPhotoAtIndex(' + idx + ')"',
                '     class="ref-photo-thumb-item group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ' + itemBg + '">',
                '  <!-- 우측 포토 썸네일 박스 -->',
                '  <div class="ref-thumb-media-box w-32 sm:w-36 aspect-video rounded-lg overflow-hidden bg-slate-950 relative shrink-0 border border-slate-700/80">',
                '    <img src="' + thumbUrl + '" data-raw-src="' + escapeHtml(p.thumb || p.src) + '" data-fallback-src="' + escapeHtml(p.fallbackThumb || p.src) + '" onerror="window.handleRefImgError(this)" loading="lazy" alt="' + escapeHtml(p.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">',
                '    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors flex items-center justify-center">',
                isViewing
                    ? '      <span class="ref-photo-thumb-badge px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1 shadow"><i class="fa-solid fa-eye"></i> 표시중</span>'
                    : '      <div class="ref-photo-thumb-badge w-8 h-8 rounded-full bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-blue-600 transition-all shadow"><i class="fa-solid fa-image text-xs"></i></div>',
                '    </div>',
                '    <span class="absolute bottom-1 right-1 bg-black/85 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#' + String(idx + 1).padStart(2, "0") + '</span>',
                '  </div>',
                '  <!-- 우측 포토 텍스트 정보 -->',
                '  <div class="flex-1 min-w-0 py-0.5">',
                '    <div class="flex items-center gap-1.5 mb-1">',
                '      <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">' + escapeHtml(p.folder) + '</span>',
                '      <span class="text-[11px] text-slate-400 truncate">' + escapeHtml(p.clipCode) + '</span>',
                '    </div>',
                '    <h5 class="ref-photo-thumb-title text-xs sm:text-[13px] font-bold ' + (isViewing ? 'text-cyan-300' : 'text-white group-hover:text-cyan-200') + ' line-clamp-2 leading-snug mb-1">' + escapeHtml(p.title) + '</h5>',
                '    <p class="text-[11px] text-slate-400 line-clamp-1">' + escapeHtml(p.desc) + '</p>',
                '  </div>',
                '</div>'
            ].join("");
        }).join("");

        var isSlideshowRunning = Boolean(photoSlideshowTimer);

        section.innerHTML = [
            '<div class="space-y-5">',
            '  <!-- 이미지 시어터 타이틀 헤더 -->',
            '  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">',
            '    <div>',
            '      <div class="inline-flex items-center gap-2 text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">',
            '        <i class="fa-solid fa-images text-base"></i> YOUTUBE STYLE PHOTO THEATER',
            '      </div>',
            '      <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">',
            '        현장 포토 시어터 <span class="text-base sm:text-lg font-bold text-blue-600 ml-1">(총 ' + currentPhotoList.length + '장 · 가운데 이미지 보기 / 우측 썸네일 선택)</span>',
            '      </h3>',
            '    </div>',
            '    <div class="flex flex-wrap items-center gap-2">',
            '      <button type="button" id="ref-photo-slideshow-btn" onclick="window.ReferenceAdmin.togglePhotoSlideshow()" class="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ' + (isSlideshowRunning ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-300') + '">',
            '        <i class="fa-solid ' + (isSlideshowRunning ? 'fa-pause' : 'fa-play') + ' mr-1"></i> 자동 슬라이드쇼 ' + (isSlideshowRunning ? 'ON' : 'OFF'),
            '      </button>',
            '      <button type="button" onclick="window.ReferenceAdmin.prevPhoto()" class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"><i class="fa-solid fa-backward-step mr-1"></i> 이전 사진</button>',
            '      <button type="button" onclick="window.ReferenceAdmin.nextPhoto()" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer">다음 사진 <i class="fa-solid fa-forward-step ml-1"></i></button>',
            '    </div>',
            '  </div>',

            '  <!-- 이미지 시어터 본체 (동영상과 동일한 2단 구조! 가운데 8칸: 메인 사진 & 분석 멘트 / 우측 4칸: 이미지 썸네일 목록) -->',
            '  <div id="ref-photo-theater-box" class="ref-theater-shell bg-slate-950 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl border border-slate-800 text-white">',
            '    <div class="ref-theater-grid grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">',
            '      <!-- [가운데 메인 영역 (8칸)] 고화질 메인 이미지 뷰어 및 분석 해설 -->',
            '      <div class="ref-main-col lg:col-span-8 flex flex-col justify-between space-y-4">',
            '        <div class="ref-main-stage w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner group flex items-center justify-center">',
            '          <img id="ref-photo-main-img"',
            '               src="' + mainImgSrc + '"',
            '               data-raw-src="' + escapeHtml(activePhoto.src) + '"',
            '               data-fallback-src="' + escapeHtml(activePhoto.fallbackSrc || '') + '"',
            '               onerror="window.handleRefImgError(this)"',
            '               onclick="window.ReferenceAdmin.openLightbox()"',
            '               alt="' + escapeHtml(activePhoto.title) + '"',
            '               class="w-full h-full object-contain bg-black cursor-zoom-in transition-transform duration-300">',
            '          <!-- 좌우 이전/다음 오버레이 화살표 버튼 -->',
            currentPhotoList.length > 1 ? [
                '          <button type="button" onclick="window.ReferenceAdmin.prevPhoto()" title="이전 사진" class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-blue-600 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg">',
                '            <i class="fa-solid fa-chevron-left"></i>',
                '          </button>',
                '          <button type="button" onclick="window.ReferenceAdmin.nextPhoto()" title="다음 사진" class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/65 hover:bg-blue-600 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg">',
                '            <i class="fa-solid fa-chevron-right"></i>',
                '          </button>'
            ].join("") : '',
            '          <!-- 우측 상단 전체화면 라이트박스 확대 버튼 -->',
            '          <button type="button" onclick="window.ReferenceAdmin.openLightbox()" class="absolute top-3 right-3 px-3.5 py-2 rounded-xl bg-black/75 hover:bg-blue-600 text-white text-xs font-bold border border-white/15 flex items-center gap-1.5 transition-all cursor-pointer shadow-lg">',
            '            <i class="fa-solid fa-expand"></i> 전체화면 확대',
            '          </button>',
            '        </div>',

            '        <!-- 현재 표시 중인 이미지 제목 및 엔지니어링 분석 해설 -->',
            '        <div class="ref-caption-box bg-slate-900/95 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">',
            '          <div class="flex flex-wrap items-center justify-between gap-2">',
            '            <div class="flex flex-wrap items-center gap-2">',
            '              <span id="ref-photo-active-folder" class="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white flex items-center gap-1.5">',
            '                <i class="fa-solid fa-camera"></i> ' + escapeHtml(activePhoto.folder),
            '              </span>',
            '              <span id="ref-photo-active-counter" class="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-cyan-300 border border-slate-700">',
            '                사진 순서: ' + (currentPhotoIndex + 1) + ' / ' + currentPhotoList.length,
            '              </span>',
            '              <span id="ref-photo-active-clip" class="text-xs text-slate-400 font-medium">',
            '                ' + escapeHtml(activePhoto.clipCode),
            '              </span>',
            '            </div>',
            '            <div class="flex items-center gap-2">',
            '              <button type="button" onclick="window.ReferenceAdmin.prevPhoto()" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"><i class="fa-solid fa-chevron-left mr-1"></i>이전 사진</button>',
            '              <button type="button" onclick="window.ReferenceAdmin.nextPhoto()" class="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer">다음 사진<i class="fa-solid fa-chevron-right ml-1"></i></button>',
            '            </div>',
            '          </div>',
            '          <h4 id="ref-photo-active-title" class="text-lg sm:text-xl font-black text-white leading-snug">',
            '            ' + escapeHtml(activePhoto.title),
            '          </h4>',
            '          <div class="ref-caption-inner bg-slate-950/90 rounded-xl p-3.5 border border-slate-800/90">',
            '            <div class="text-[11px] font-bold text-cyan-400 mb-1 flex items-center gap-1.5">',
            '              <i class="fa-solid fa-magnifying-glass-chart"></i> 현장 이미지 분석 멘트',
            '            </div>',
            '            <p id="ref-photo-active-desc" class="text-xs sm:text-sm text-slate-200 leading-relaxed">',
            '              ' + escapeHtml(activePhoto.desc),
            '            </p>',
            '          </div>',
            '        </div>',
            '      </div>',

            '      <!-- [우측 영역 (4칸)] 이미지 썸네일 목록 사이드바 -->',
            '      <div class="ref-side-col lg:col-span-4 flex flex-col bg-slate-900/75 rounded-2xl border border-slate-800 overflow-hidden">',
            '        <div class="ref-side-header p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">',
            '          <div>',
            '            <h4 class="text-sm font-extrabold text-white flex items-center gap-2">',
            '              <i class="fa-solid fa-images text-cyan-400"></i> 이미지 썸네일 목록',
            '            </h4>',
            '            <p class="text-[11px] text-slate-400 mt-0.5">우측 썸네일을 클릭하면 가운데에 크게 표시됩니다</p>',
            '          </div>',
            '          <span id="ref-photo-playlist-badge" class="px-2.5 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">',
            '            ' + (currentPhotoIndex + 1) + ' / ' + currentPhotoList.length,
            '          </span>',
            '        </div>',
            '        <div id="ref-photo-playlist-scroll" class="ref-playlist-scroll p-3 space-y-2.5 max-h-[460px] lg:max-h-[560px] overflow-y-auto custom-scrollbar flex-1">',
            photoPlaylistHtml,
            '        </div>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join("");
    }

    // 깜빡임 없이 가운데 메인 이미지와 우측 썸네일 활성 상태만 즉시 갱신
    function updateActivePhotoUI() {
        if (!currentPhotoList || currentPhotoList.length === 0) return;
        var activePhoto = currentPhotoList[currentPhotoIndex];
        if (!activePhoto) return;

        var imgEl = document.getElementById("ref-photo-main-img");
        if (!imgEl) {
            renderPhotoSection();
            return;
        }

        // 1) 가운데 메인 이미지 교체
        delete imgEl.dataset.triedRaw; delete imgEl.dataset.triedDrive;
        delete imgEl.dataset.triedFallback;
        imgEl.setAttribute("data-raw-src", activePhoto.src || "");
        imgEl.setAttribute("data-fallback-src", activePhoto.fallbackSrc || "");
        imgEl.src = safeUrl(activePhoto.src);
        imgEl.alt = activePhoto.title || "";

        // 2) 가운데 하단 텍스트 정보 교체
        var folderEl = document.getElementById("ref-photo-active-folder");
        var counterEl = document.getElementById("ref-photo-active-counter");
        var clipEl = document.getElementById("ref-photo-active-clip");
        var titleEl = document.getElementById("ref-photo-active-title");
        var descEl = document.getElementById("ref-photo-active-desc");
        var badgeEl = document.getElementById("ref-photo-playlist-badge");

        if (folderEl) folderEl.innerHTML = '<i class="fa-solid fa-camera"></i> ' + escapeHtml(activePhoto.folder);
        if (counterEl) counterEl.textContent = "사진 순서: " + (currentPhotoIndex + 1) + " / " + currentPhotoList.length;
        if (clipEl) clipEl.textContent = activePhoto.clipCode;
        if (titleEl) titleEl.textContent = activePhoto.title;
        if (descEl) descEl.textContent = activePhoto.desc;
        if (badgeEl) badgeEl.textContent = (currentPhotoIndex + 1) + " / " + currentPhotoList.length;

        // 3) 우측 이미지 썸네일 리스트 하이라이트 업데이트 및 자동 스크롤
        currentPhotoList.forEach(function (p, idx) {
            var itemEl = document.getElementById("ref-photo-playlist-item-" + idx);
            if (!itemEl) return;
            var isViewing = (idx === currentPhotoIndex);
            itemEl.className = "ref-photo-thumb-item group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer " + (
                isViewing
                    ? "bg-blue-950/90 border-cyan-400 ring-2 ring-cyan-400/50 shadow-md"
                    : "bg-slate-900/90 hover:bg-slate-800/90 border-slate-800"
            );
            var tEl = itemEl.querySelector(".ref-photo-thumb-title");
            if (tEl) {
                tEl.className = "ref-photo-thumb-title text-xs sm:text-[13px] font-bold " + (isViewing ? "text-cyan-300" : "text-white group-hover:text-cyan-200") + " line-clamp-2 leading-snug mb-1";
            }
            var bEl = itemEl.querySelector(".ref-photo-thumb-badge");
            if (bEl) {
                bEl.outerHTML = isViewing
                    ? '<span class="ref-photo-thumb-badge px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-extrabold tracking-wider flex items-center gap-1 shadow"><i class="fa-solid fa-eye"></i> 표시중</span>'
                    : '<div class="ref-photo-thumb-badge w-8 h-8 rounded-full bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-blue-600 transition-all shadow"><i class="fa-solid fa-image text-xs"></i></div>';
            }
        });

        var activeItemEl = document.getElementById("ref-photo-playlist-item-" + currentPhotoIndex);
        var scrollContainer = document.getElementById("ref-photo-playlist-scroll");
        if (activeItemEl && scrollContainer) {
            var itemTop = activeItemEl.offsetTop - scrollContainer.offsetTop;
            scrollContainer.scrollTo({
                top: Math.max(0, itemTop - 80),
                behavior: "smooth"
            });
        }
    }

    // ==========================================================================
    // 8. 풀스크린 고해상도 포토 라이트박스 모달 제어
    // ==========================================================================
    function ensureLightboxModalExists() {
        if (document.getElementById("ref-gallery-lightbox")) return;

        var modal = document.createElement("div");
        modal.id = "ref-gallery-lightbox";
        modal.className = "fixed inset-0 z-[10050] bg-black/95 backdrop-blur-md hidden flex-col justify-between p-4 sm:p-6 select-none";
        modal.innerHTML = [
            '<!-- 상단 바 -->',
            '<div class="flex items-center justify-between max-w-7xl w-full mx-auto text-white z-10">',
            '  <div class="flex items-center gap-2.5">',
            '    <span id="ref-lb-folder" class="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white">폴더</span>',
            '    <span id="ref-lb-counter" class="text-xs sm:text-sm font-bold text-slate-300">1 / 1</span>',
            '  </div>',
            '  <button type="button" onclick="window.ReferenceAdmin.closeLightbox()" class="w-11 h-11 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center text-lg transition-colors cursor-pointer">',
            '    <i class="fa-solid fa-xmark"></i>',
            '  </button>',
            '</div>',

            '<!-- 중앙 이미지 및 좌우 네비게이션 -->',
            '<div class="relative flex-1 flex items-center justify-center max-w-7xl w-full mx-auto my-2 overflow-hidden">',
            '  <button type="button" onclick="window.ReferenceAdmin.prevLightboxPhoto()" class="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-95">',
            '    <i class="fa-solid fa-chevron-left text-base sm:text-lg"></i>',
            '  </button>',
            '  <img id="ref-lb-img" src="" onerror="window.handleRefImgError(this)" alt="고해상도 현장 사진" class="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl border border-white/10 transition-all duration-200">',
            '  <button type="button" onclick="window.ReferenceAdmin.nextLightboxPhoto()" class="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-blue-600 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-95">',
            '    <i class="fa-solid fa-chevron-right text-base sm:text-lg"></i>',
            '  </button>',
            '</div>',

            '<!-- 하단 분석 멘트 캡션 -->',
            '<div class="max-w-4xl w-full mx-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-white z-10">',
            '  <h4 id="ref-lb-title" class="text-base sm:text-lg font-extrabold text-cyan-300 mb-1"></h4>',
            '  <p id="ref-lb-desc" class="text-xs sm:text-sm text-slate-200 leading-relaxed"></p>',
            '</div>'
        ].join("");

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                window.ReferenceAdmin.closeLightbox();
            }
        });

        document.body.appendChild(modal);

        document.addEventListener("keydown", function (e) {
            var lb = document.getElementById("ref-gallery-lightbox");
            if (!lb || lb.classList.contains("hidden")) return;
            if (e.key === "Escape") window.ReferenceAdmin.closeLightbox();
            else if (e.key === "ArrowLeft") window.ReferenceAdmin.prevLightboxPhoto();
            else if (e.key === "ArrowRight") window.ReferenceAdmin.nextLightboxPhoto();
        });
    }

    function updateLightboxContent() {
        ensureLightboxModalExists();
        if (!currentPhotoList || currentPhotoList.length === 0) return;
        if (currentPhotoIndex < 0) currentPhotoIndex = currentPhotoList.length - 1;
        if (currentPhotoIndex >= currentPhotoList.length) currentPhotoIndex = 0;

        var item = currentPhotoList[currentPhotoIndex];
        var imgEl = document.getElementById("ref-lb-img");
        var folderEl = document.getElementById("ref-lb-folder");
        var counterEl = document.getElementById("ref-lb-counter");
        var titleEl = document.getElementById("ref-lb-title");
        var descEl = document.getElementById("ref-lb-desc");

        if (imgEl) {
            delete imgEl.dataset.triedRaw; delete imgEl.dataset.triedDrive;
            delete imgEl.dataset.triedFallback;
            imgEl.setAttribute("data-raw-src", item.src || "");
            imgEl.setAttribute("data-fallback-src", item.fallbackSrc || "");
            imgEl.src = safeUrl(item.src);
        }
        if (folderEl) folderEl.textContent = item.folder;
        if (counterEl) counterEl.textContent = (currentPhotoIndex + 1) + " / " + currentPhotoList.length;
        if (titleEl) titleEl.textContent = item.title;
        if (descEl) descEl.textContent = item.desc;
    }

    // ==========================================================================
    // 9. 전체 레퍼런스 페이지 통합 렌더링 함수
    // ==========================================================================
    function renderReferenceGallery(category) {
        ensureReferenceTheaterStyles();
        if (category) {
            currentCategory = category;
        }

        if (photoSlideshowTimer) {
            clearInterval(photoSlideshowTimer);
            photoSlideshowTimer = null;
        }

        var mediaData = getFilteredMedia(currentCategory);
        currentVideoList = mediaData.videos || [];
        currentPhotoList = mediaData.photos || [];
        currentVideoIndex = 0;
        currentPhotoIndex = 0;

        renderCategoryTabs();
        renderCategoryBriefing(mediaData);
        renderYoutubeSection();
        renderPhotoSection();
    }

    // ==========================================================================
    // 10. 외부 제어 인터페이스 노출 (window.ReferenceAdmin & window.filterReference)
    // ==========================================================================
    window.ReferenceAdmin = {
        render: function (cat) {
            renderReferenceGallery(cat || currentCategory || "all");
        },
        getData: function () {
            return REFERENCE_GALLERY_DB;
        },
        setData: function () {},
        // 동영상 제어 (우측 썸네일 클릭 시 가운데 영상 재생)
        playVideoAtIndex: function (idx) {
            if (!currentVideoList || idx < 0 || idx >= currentVideoList.length) return;
            currentVideoIndex = idx;
            updateActiveVideoUI(true);
        },
        prevVideo: function () {
            if (!currentVideoList || currentVideoList.length === 0) return;
            currentVideoIndex = (currentVideoIndex - 1 + currentVideoList.length) % currentVideoList.length;
            updateActiveVideoUI(true);
        },
        nextVideo: function () {
            if (!currentVideoList || currentVideoList.length === 0) return;
            currentVideoIndex = (currentVideoIndex + 1) % currentVideoList.length;
            updateActiveVideoUI(true);
        },
        toggleAutoPlay: function () {
            autoPlayNextVideo = !autoPlayNextVideo;
            var btn = document.getElementById("ref-yt-autoplay-btn");
            if (btn) {
                btn.className = "px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer " + (autoPlayNextVideo ? "bg-red-600 text-white border-red-600 shadow-sm" : "bg-white text-slate-600 border-slate-300");
                btn.innerHTML = '<i class="fa-solid ' + (autoPlayNextVideo ? 'fa-toggle-on text-white' : 'fa-toggle-off') + ' mr-1 text-sm"></i> 연속 자동재생 ' + (autoPlayNextVideo ? 'ON' : 'OFF');
            }
        },
        // 이미지 제어 (우측 썸네일 클릭 시 가운데 이미지 전환)
        selectPhotoAtIndex: function (idx) {
            if (!currentPhotoList || idx < 0 || idx >= currentPhotoList.length) return;
            currentPhotoIndex = idx;
            updateActivePhotoUI();
        },
        prevPhoto: function () {
            if (!currentPhotoList || currentPhotoList.length === 0) return;
            currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
            updateActivePhotoUI();
        },
        nextPhoto: function () {
            if (!currentPhotoList || currentPhotoList.length === 0) return;
            currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotoList.length;
            updateActivePhotoUI();
        },
        togglePhotoSlideshow: function () {
            if (photoSlideshowTimer) {
                clearInterval(photoSlideshowTimer);
                photoSlideshowTimer = null;
            } else {
                photoSlideshowTimer = setInterval(function () {
                    window.ReferenceAdmin.nextPhoto();
                }, 3500);
            }
            var btn = document.getElementById("ref-photo-slideshow-btn");
            var isRunning = Boolean(photoSlideshowTimer);
            if (btn) {
                btn.className = "px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer " + (isRunning ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-slate-600 border-slate-300");
                btn.innerHTML = '<i class="fa-solid ' + (isRunning ? 'fa-pause' : 'fa-play') + ' mr-1"></i> 자동 슬라이드쇼 ' + (isRunning ? 'ON' : 'OFF');
            }
        },
        openLightbox: function (idx) {
            if (typeof idx === "number") {
                currentPhotoIndex = idx;
                updateActivePhotoUI();
            }
            updateLightboxContent();
            var lb = document.getElementById("ref-gallery-lightbox");
            if (lb) {
                lb.classList.remove("hidden");
                lb.classList.add("flex");
                document.body.style.overflow = "hidden";
            }
        },
        closeLightbox: function () {
            var lb = document.getElementById("ref-gallery-lightbox");
            if (lb) {
                lb.classList.add("hidden");
                lb.classList.remove("flex");
                document.body.style.overflow = "";
            }
        },
        prevLightboxPhoto: function () {
            this.prevPhoto();
            updateLightboxContent();
        },
        nextLightboxPhoto: function () {
            this.nextPhoto();
            updateLightboxContent();
        },
        scrollToSection: function (elementId) {
            var el = document.getElementById(elementId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    window.filterReference = function (category) {
        renderReferenceGallery(category || "all");
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            renderReferenceGallery("all");
        });
    } else {
        renderReferenceGallery("all");
    }
})();
