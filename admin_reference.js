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
 *   2. [동영상 시어터]: 가운데(좌측 메인)에서 대형 영상을 재생하고, 우측에 스크롤 가능한 '동영상 썸네일 목록'을 배치.
 *   3. [이미지 시어터]: 동영상과 완전히 동일한 스타일로, 가운데(좌측 메인)에 고해상도 이미지를 크게 표시하고
 *      우측에 스크롤 가능한 '이미지 썸네일 목록'을 배치하여 클릭 즉시 가운데 이미지와 분석 해설이 전환됨.
 *   4. 깜빡임 없는 부분 업데이트(DOM Partial Update)와 다중 경로 폴백(Fallback) 처리로 오류를 원천 차단.
 * ============================================================================
 */

(function () {
    "use strict";

    // ==========================================================================
    // 1-1. 레퍼런스 4개국어(KO, EN, ZH, JA) 다국어 번역 사전
    // ==========================================================================
    var REF_I18N = {
        "ko": {
            "total_count_label": "(총 {count}건)",
            "vid_count_label": "영상 {count}",
            "pho_count_label": "사진 {count}",

            "tab_all": "전체 보기",
            "tab_전경": "전경 (캠퍼스)",
            "tab_CBS": "CBS (크로스벨트)",
            "tab_NC_CBS": "NC CBS (수치제어)",
            "tab_NBS": "NBS (내로우벨트)",
            "tab_Wheel_Sorter": "Wheel Sorter (휠소터)",
            "tab_틸트트레이소터": "틸트트레이 소터",
            "cat_title_all": "전체 구축 실적 (All Reference)",
            "cat_sub_all": "스마트 물류 제조 거점 전경 및 5대 핵심 소터 종합 아카이브",
            "cat_desc_all": "주식회사 에이티에이기술의 대규모 스마트 물류 제조 거점 항공 전경부터 CBS, NC CBS, NBS, Wheel Sorter, 틸트트레이소터까지 실제 물류 현장에서 가동 중인 영상과 고화질 사진을 폴더별로 한눈에 확인하실 수 있습니다.",
            "cat_tags_all": "스마트 물류,핵심 설비 5종,통합 레퍼런스,현장 가동 영상,고화질 사진",
            "cat_title_전경": "에이티에이기술 핵심 제조 및 R&D 거점 항공 전경",
            "cat_sub_전경": "태양광 친환경 설비가 완비된 대규모 스마트 물류 제조 단지",
            "cat_desc_전경": "태양광 루프탑 친환경 발전 설비가 완비된 대규모 스마트 물류 장비 제조·조립 단지 및 R&D 실증 테스트 센터의 드론 항공 촬영 전경입니다. 원자재 정밀 가공부터 대형 소터 라인 가조립, 출고 전 사전 시운전(FAT)까지 원스톱으로 수행하는 핵심 생산 기지입니다.",
            "cat_tags_전경": "스마트 팩토리,대규모 제조 거점,R&D 테스트베드,FAT 사전 시운전",
            "cat_title_CBS": "크로스벨트 소터 (Cross Belt Sorter) 현장 구축 실적",
            "cat_sub_CBS": "대규모 메가 허브 터미널 초고속 분류 시스템",
            "cat_desc_CBS": "국내 주요 택배사 및 대형 이커머스 풀필먼트 센터에 구축된 크로스벨트 소터(CBS) 가동 실적입니다. 시간당 수만 건의 화물을 고속·무결점으로 분류하며, 특수 마찰 벨트와 정밀 서보 구동을 통해 최적의 분기 효율을 발휘합니다.",
            "cat_tags_CBS": "초고속 대용량 분류,시간당 수만건 처리,오분류율 0.01% 미만,메가허브 터미널",
            "cat_title_NC_CBS": "NC 크로스벨트 소터 (NC Cross Belt Sorter) 구축 실적",
            "cat_sub_NC_CBS": "고정밀 수치제어 차세대 크로스벨트 분류 시스템",
            "cat_desc_NC_CBS": "소프트웨어 알고리즘과 수치제어 정밀 메커니즘이 결합된 차세대 NC 크로스벨트 소터 실증 가동 영상입니다. 화물 슬립 방지 특수 벨트와 실시간 속도 제어로 흔들림 없는 화물 안정성을 제공합니다.",
            "cat_tags_NC_CBS": "고정밀 수치제어,차세대 CBS,화물 슬립 방지,실시간 예지보전",
            "cat_title_NBS": "내로우벨트 소터 (Narrow Belt Sorter) 구축 실적",
            "cat_sub_NBS": "소형 의류 및 잡화 고속 분기 특화 솔루션",
            "cat_desc_NBS": "작고 가벼운 소형 화물, 의류, 패키지 상품을 신속하고 안전하게 분기하는 좁은 벨트형 고효율 소터 시스템입니다. 협소한 물류센터 공간에도 맞춤형 인라인 배치가 가능합니다.",
            "cat_tags_NBS": "소형 패키지 특화,의류·잡화 분류,공간 절약형 인라인,부드러운 분기 메커니즘",
            "cat_title_Wheel_Sorter": "휠 소터 (Wheel Sorter) 인라인 분기 구축 실적",
            "cat_sub_Wheel_Sorter": "다각도 고속 연속 분기 모듈형 휠 소터",
            "cat_desc_Wheel_Sorter": "컨베이어 라인 상에 배치된 회전 휠의 정밀 각도 제어로 박스 및 파우치 화물을 연속 분기하는 고효율 휠 소터입니다. 30도, 45도, 90도 다방향 분기를 지원합니다.",
            "cat_tags_Wheel_Sorter": "인라인 연속 분기,다각도(30°/45°/90°) 분기,콤팩트 모듈 설계,저소음 고속응답",
            "cat_title_틸트트레이소터": "틸트트레이 소터 (Tilt Tray Sorter) 구축 실적",
            "cat_sub_틸트트레이소터": "화물 손상 없는 부드러운 슬라이딩 경사 분류",
            "cat_desc_틸트트레이소터": "운반 트레이를 정밀하게 기울여 목적지 슈트로 부드럽게 미끄러뜨려 분류하는 틸트 트레이 소터 시스템입니다. 민감하거나 파손 위험이 있는 다양한 규격 화물 분류에 최적화되어 있습니다.",
            "cat_tags_틸트트레이소터": "경사 슬라이딩 분류,화물 파손 방지,다양한 규격 수용,저소음 친환경",
            "all_tab": "전체 보기",
            "video_theater_title": "동영상 시어터",
            "video_theater_sub": "(총 {count}편 · 가운데 영상 재생 / 우측 썸네일 선택)",
            "photo_theater_title": "현장 포토 시어터",
            "photo_theater_sub": "(총 {count}장 · 가운데 이미지 보기 / 우측 썸네일 선택)",
            "autoplay_on": "연속 자동재생 ON",
            "autoplay_off": "연속 자동재생 OFF",
            "slideshow_on": "자동 슬라이드쇼 ON",
            "slideshow_off": "자동 슬라이드쇼 OFF",
            "prev_vid": "이전 영상",
            "next_vid": "다음 영상",
            "prev_pho": "이전 사진",
            "next_pho": "다음 사진",
            "vid_order": "영상 순서: {cur} / {total}",
            "pho_order": "사진 순서: {cur} / {total}",
            "vid_analysis": "현장 동영상 분석 멘트",
            "pho_analysis": "현장 이미지 분석 멘트",
            "vid_playlist": "동영상 썸네일 목록",
            "vid_playlist_sub": "우측 썸네일을 클릭하면 가운데에서 재생됩니다",
            "pho_playlist": "이미지 썸네일 목록",
            "pho_playlist_sub": "우측 썸네일을 클릭하면 가운데에 크게 표시됩니다",
            "playing": "재생중",
            "showing": "표시중",
            "zoom_fullscreen": "전체화면 확대",
            "btn_go_vid": "동영상 시어터 바로가기 ({count})",
            "btn_go_pho": "이미지 시어터 바로가기 ({count})",
            "all_title": "전체 구축 실적 (All Reference)",
            "all_subtitle": "스마트 물류 제조 거점 전경 및 5대 핵심 소터(CBS · NC CBS · NBS · Wheel Sorter · 틸트트레이소터) 종합 아카이브",
            "all_overview": "주식회사 에이티에이기술의 대규모 스마트 물류 제조 거점 항공 전경부터 CBS, NC CBS, NBS, Wheel Sorter, 틸트트레이소터까지 실제 물류 현장에서 가동 중인 영상과 고화질 사진을 폴더별로 한눈에 확인하실 수 있습니다."
        },
        "en": {
            "total_count_label": "(Total {count})",
            "vid_count_label": "Videos {count}",
            "pho_count_label": "Photos {count}",

            "tab_all": "View All",
            "tab_전경": "Campus Panorama",
            "tab_CBS": "CBS (Cross Belt)",
            "tab_NC_CBS": "NC CBS (Numerical Control)",
            "tab_NBS": "NBS (Narrow Belt)",
            "tab_Wheel_Sorter": "Wheel Sorter",
            "tab_틸트트레이소터": "Tilt Tray Sorter",
            "cat_title_all": "All Track Records (All Reference)",
            "cat_sub_all": "Smart Logistics Manufacturing Campus & 5 Core Sorters Archive",
            "cat_desc_all": "Explore comprehensive real-world operational videos and high-definition photography across ATA Technology's smart logistics manufacturing campus and our five core sorter lineups: CBS, NC CBS, NBS, Wheel Sorter, and Tilt Tray Sorter.",
            "cat_tags_all": "Smart Logistics,5 Core Sorters,Integrated Reference,Field Video,HD Photography",
            "cat_title_전경": "ATA Technology Manufacturing & R&D Campus Aerial View",
            "cat_sub_전경": "Eco-friendly Large-scale Logistics Manufacturing Complex",
            "cat_desc_전경": "Drone aerial view of the large-scale logistics equipment manufacturing complex and R&D verification testing center equipped with solar rooftop facilities. A primary base performing one-stop precision fabrication, full-line assembly, and Factory Acceptance Testing (FAT).",
            "cat_tags_전경": "Smart Factory,Manufacturing Campus,R&D Testbed,FAT Testing",
            "cat_title_CBS": "Cross Belt Sorter (CBS) Field Deployments",
            "cat_sub_CBS": "Ultra-High-Speed Mega Hub Terminal Sorting System",
            "cat_desc_CBS": "Proven field deployments of Cross Belt Sorters (CBS) in major domestic logistics and e-commerce fulfillment hubs, handling tens of thousands of parcels per hour with zero defect and near-zero error rates.",
            "cat_tags_CBS": "Ultra High Speed,Mass Capacity,Error Rate <0.01%,Mega Hub Terminal",
            "cat_title_NC_CBS": "NC Cross Belt Sorter Deployments",
            "cat_sub_NC_CBS": "High-Precision Numerically Controlled Sorting System",
            "cat_desc_NC_CBS": "Next-generation numerically controlled Cross Belt Sorter demonstrations uniting real-time software algorithms with high-precision mechanics. Provides unmatched parcel stability and anti-slip belt performance.",
            "cat_tags_NC_CBS": "Numerical Control,Next-Gen CBS,Anti-Slip Belt,Real-Time Monitoring",
            "cat_title_NBS": "Narrow Belt Sorter (NBS) Deployments",
            "cat_sub_NBS": "High-Efficiency Diverter for Small Parcels & Apparel",
            "cat_desc_NBS": "Narrow belt sortation system tailored for fast, gentle diverting of light apparel, small parcels, and fashion merchandise within compact fulfillment center footprints.",
            "cat_tags_NBS": "Small Parcels,Apparel Sorting,Space-Saving In-line,Gentle Diverting",
            "cat_title_Wheel_Sorter": "Wheel Sorter In-Line Diverting Deployments",
            "cat_sub_Wheel_Sorter": "Multi-Angle Continuous Diverting Modular Wheel Sorter",
            "cat_desc_Wheel_Sorter": "High-efficiency wheel sorter continuously diverting carton boxes and polybags through precision angular steering (30°, 45°, 90°) directly in-line with conveyor flows.",
            "cat_tags_Wheel_Sorter": "In-line Diverting,Multi-Angle (30°/45°/90°),Compact Modular,Low Noise",
            "cat_title_틸트트레이소터": "Tilt Tray Sorter Deployments",
            "cat_sub_틸트트레이소터": "Gentle Sliding Tilt Tray Sortation for Fragile Goods",
            "cat_desc_틸트트레이소터": "Tilt Tray Sorter gently sliding packages into destination chutes with smooth tilting mechanisms, safeguarding fragile goods and handling diverse dimensional parcels.",
            "cat_tags_틸트트레이소터": "Smooth Tilting,Zero Damage,Multi-Dimensional,Low Noise",
            "all_tab": "View All",
            "video_theater_title": "Video Theater",
            "video_theater_sub": "(Total {count} clips · Center player / Select playlist on right)",
            "photo_theater_title": "On-Site Photo Theater",
            "photo_theater_sub": "(Total {count} photos · Center viewer / Select gallery on right)",
            "autoplay_on": "Auto-Play ON",
            "autoplay_off": "Auto-Play OFF",
            "slideshow_on": "SlideShow ON",
            "slideshow_off": "SlideShow OFF",
            "prev_vid": "Prev Video",
            "next_vid": "Next Video",
            "prev_pho": "Prev Photo",
            "next_pho": "Next Photo",
            "vid_order": "Video: {cur} / {total}",
            "pho_order": "Photo: {cur} / {total}",
            "vid_analysis": "Engineering Analysis Commentary",
            "pho_analysis": "On-Site System Analysis Commentary",
            "vid_playlist": "Video Playlist",
            "vid_playlist_sub": "Click any thumbnail on the right to play in center",
            "pho_playlist": "Photo Playlist",
            "pho_playlist_sub": "Click any thumbnail on the right to view in center",
            "playing": "PLAYING",
            "showing": "VIEWING",
            "zoom_fullscreen": "Fullscreen Zoom",
            "btn_go_vid": "Jump to Video Theater ({count})",
            "btn_go_pho": "Jump to Photo Theater ({count})",
            "all_title": "Comprehensive Logistics Track Record",
            "all_subtitle": "Aerial View of Smart Manufacturing Base & 5 Core Sorters (CBS, NC CBS, NBS, Wheel Sorter, Tilt Tray Sorter)",
            "all_overview": "Explore ATA Technology's extensive smart logistics manufacturing campus and live operation clips & high-resolution photos of CBS, NC CBS, NBS, Wheel Sorter, and Tilt Tray Sorter systems deployed across global fulfillment centers."
        },
        "zh": {
            "total_count_label": "(共 {count}件)",
            "vid_count_label": "视频 {count}",
            "pho_count_label": "照片 {count}",

            "tab_all": "查看全部",
            "tab_전경": "基地全景 (园区)",
            "tab_CBS": "CBS (交叉带分拣机)",
            "tab_NC_CBS": "NC CBS (数控交叉带)",
            "tab_NBS": "NBS (窄带分拣机)",
            "tab_Wheel_Sorter": "Wheel Sorter (摆轮分拣机)",
            "tab_틸트트레이소터": "翻盘分拣机 (Tilt Tray)",
            "cat_title_all": "全部工程落地实绩 (All Reference)",
            "cat_sub_all": "智慧物流制造基地全景及5大核心分拣机综合档案",
            "cat_desc_all": "全面展示ATA Technology智慧物流智能制造园区航拍全景，以及CBS、NC CBS、NBS、摆轮分拣机、翻盘分拣机在实际物流中心的高清运行视频与现场实拍图片。",
            "cat_tags_all": "智慧物流,5大核心设备,综合实绩,现场运行视频,高清实拍",
            "cat_title_전경": "ATA Technology 制造与研发中心航拍全景",
            "cat_sub_전경": "配备绿色光伏屋顶的大型智慧物流智能制造园区",
            "cat_desc_전경": "航拍展现配备光伏屋顶的大型智慧物流设备制造组装基地与R&D实证测试中心，从原材料精密加工到设备预组装及出厂验收测试(FAT)一站式完成。",
            "cat_tags_전경": "智能工厂,大型制造基地,R&D实证测试,FAT出厂测试",
            "cat_title_CBS": "交叉带分拣机 (Cross Belt Sorter) 现场实绩",
            "cat_sub_CBS": "超大型转运枢纽超高速高效分拣系统",
            "cat_desc_CBS": "国内外大型快递枢纽及电商履行中心交叉带分拣机(CBS)实际运行记录，每小时处理数万件货物，分拣差错率低于0.01%。",
            "cat_tags_CBS": "超高速大容量,时效吞吐数万件,差错率0.01%以下,超级枢纽中心",
            "cat_title_NC_CBS": "NC数控交叉带分拣机落地实绩",
            "cat_sub_NC_CBS": "高精度数控新一代交叉带分拣系统",
            "cat_desc_NC_CBS": "融合数控精密机械与软件算法的新一代NC交叉带分拣机运行展示，特制防滑皮带与动态速度控制确保货物平稳高速转向。",
            "cat_tags_NC_CBS": "高精度数控,新一代CBS,防滑皮带,实时健康预测",
            "cat_title_NBS": "窄带分拣机 (Narrow Belt Sorter) 落地实绩",
            "cat_sub_NBS": "服装服饰与轻型包裹高效分流解决方案",
            "cat_desc_NBS": "专为轻质小件、服装、包裹快速平稳分流研发的窄带高效率分拣机，占地面积小，支持在紧凑型中心灵活内嵌安装。",
            "cat_tags_NBS": "轻小包裹特化,服装杂货分拣,紧凑内嵌式,柔性分流机构",
            "cat_title_Wheel_Sorter": "摆轮分拣机 (Wheel Sorter) 在线分流实绩",
            "cat_sub_Wheel_Sorter": "多角度高速连续分流模块化摆轮分拣机",
            "cat_desc_Wheel_Sorter": "通过转动滚轮的精确角度控制在线连续分流纸箱及软袋包裹，支持30°、45°、90°多向高速分流。",
            "cat_tags_Wheel_Sorter": "在线连续分流,多角度(30°/45°/90°),紧凑模块化,低噪高速响应",
            "cat_title_틸트트레이소터": "翻盘分拣机 (Tilt Tray Sorter) 落地实绩",
            "cat_sub_틸트트레이소터": "平滑倾斜滑行分拣 保护易损货物",
            "cat_desc_틸트트레이소터": "通过承载托盘平滑倾斜使包裹柔和滑入目的地下滑道，有效保护易损贵重货物，适应多种不同规格包裹。",
            "cat_tags_틸트트레이소터": "倾斜滑行分拣,防止货物磕碰,多规格兼容,低噪环保",
            "all_tab": "查看全部",
            "video_theater_title": "视频剧场",
            "video_theater_sub": "(共 {count} 部 · 中间播放 / 右侧缩略图选择)",
            "photo_theater_title": "现场照片剧场",
            "photo_theater_sub": "(共 {count} 张 · 中间展示 / 右侧画廊选择)",
            "autoplay_on": "连续自动播放 开启",
            "autoplay_off": "连续自动播放 关闭",
            "slideshow_on": "自动幻灯片 开启",
            "slideshow_off": "自动幻灯片 关闭",
            "prev_vid": "上一部视频",
            "next_vid": "下一部视频",
            "prev_pho": "上一张照片",
            "next_pho": "下一张照片",
            "vid_order": "视频顺序: {cur} / {total}",
            "pho_order": "照片顺序: {cur} / {total}",
            "vid_analysis": "现场工程分析评注",
            "pho_analysis": "现场系统分析评注",
            "vid_playlist": "视频播放列表",
            "vid_playlist_sub": "点击右侧缩略图即可在中间区域高清播放",
            "pho_playlist": "照片画廊列表",
            "pho_playlist_sub": "点击右侧缩略图即可在中间区域高清浏览",
            "playing": "播放中",
            "showing": "展示中",
            "zoom_fullscreen": "全屏放大",
            "btn_go_vid": "直达视频剧场 ({count})",
            "btn_go_pho": "直达照片剧场 ({count})",
            "all_title": "主要建设业绩综合归档 (All Reference)",
            "all_subtitle": "智能物流制造基地全景及5大核心分拣机（CBS · NC CBS · NBS · 摆轮分拣机 · 斜盘分拣机）实绩",
            "all_overview": "一览ATA技术大规模智能物流设备制造基地航拍全景及全球大型电商分拣中心实际运行的视频与高清现场实拍照片。"
        },
        "ja": {
            "total_count_label": "(計 {count}件)",
            "vid_count_label": "動画 {count}",
            "pho_count_label": "写真 {count}",

            "tab_all": "すべて表示",
            "tab_전경": "拠点全景 (キャンパス)",
            "tab_CBS": "CBS (クロスベルト)",
            "tab_NC_CBS": "NC CBS (数値制御)",
            "tab_NBS": "NBS (ナローベルト)",
            "tab_Wheel_Sorter": "Wheel Sorter (ホイールソーター)",
            "tab_틸트트레이소터": "ティルトトレイソーター",
            "cat_title_all": "導入実績一覧 (All Reference)",
            "cat_sub_all": "スマート物流製造キャンパスおよび5大コアソーター統合アーカイブ",
            "cat_desc_all": "株式会社ATAテクノロジーの大規模スマート物流製造キャンパスの空撮全景から、CBS、NC CBS、NBS、ホイールソーター、ティルトトレイソーターまで、現場稼働動画と高画質写真をご覧いただけます。",
            "cat_tags_all": "スマート物流,5大中核機器,総合実績,現場稼働動画,高解像度写真",
            "cat_title_전경": "ATAテクノロジー 製造・R&D拠点空撮全景",
            "cat_sub_전경": "太陽光発電屋根を備えた大規模スマート物流製造拠点",
            "cat_desc_전경": "太陽光ルーフ発電設備を備えた大規模スマート物流機器製造・組立コンプレックスおよびR&D実証テストセンターの空撮です。精密加工から組立、FAT(出荷前試験)までワンストップで遂行します。",
            "cat_tags_전경": "スマートファクトリー,大規模製造拠点,R&D実証,FAT出荷前試験",
            "cat_title_CBS": "クロスベルトソーター (CBS) 現場導入実績",
            "cat_sub_CBS": "超大型メガハブターミナル超高速仕分けシステム",
            "cat_desc_CBS": "国内外の大手宅配・EC物流センターで稼働するクロスベルトソーター(CBS)の実績です。毎時数万個の荷物を高速・高精度に仕分け、誤仕分け率0.01%以下を実現します。",
            "cat_tags_CBS": "超高速大容量,毎時数万個処理,誤仕分け率0.01%未満,メガハブターミナル",
            "cat_title_NC_CBS": "NCクロスベルトソーター 現場実績",
            "cat_sub_NC_CBS": "高精度数値制御 次世代クロスベルト仕分けシステム",
            "cat_desc_NC_CBS": "数値制御精密メカニズムと制御アルゴリズムを統合した次世代NCクロスベルトソーターの稼働映像です。特殊ベルトにより滑りを防ぎ安定した搬送を実現します。",
            "cat_tags_NC_CBS": "高精度数値制御,次世代CBS,スリップ防止,リアルタイム予兆保全",
            "cat_title_NBS": "ナローベルトソーター (NBS) 現場実績",
            "cat_sub_NBS": "小型アパレル・小包高速仕分け特化ソリューション",
            "cat_desc_NBS": "軽量の小型荷物や衣類、小包を迅速かつ安全に仕分けるナローベルト型ソーターです。省スペースで既存コン베야라인へのインライン設置が可能です。",
            "cat_tags_NBS": "小型パッケージ特化,アパレル仕分け,省スペース設置,ソフト分岐機構",
            "cat_title_Wheel_Sorter": "ホイールソーター インライン仕分け実績",
            "cat_sub_Wheel_Sorter": "多角度高速連続分岐モジュール型ホイールソーター",
            "cat_desc_Wheel_Sorter": "回転ホイールの精密角度制御によりダンボール箱やポリ袋を連続分岐する高効率ソーターです。30度、45度、90度の多方向分岐に対応します。",
            "cat_tags_Wheel_Sorter": "インライン連続分岐,多角度(30°/45°/90°),コンパクト設計,低騒音高速応答",
            "cat_title_틸트트레이소터": "ティルトトレイソーター 現場実績",
            "cat_sub_틸트트레이소터": "荷物を傷めない滑らかなスライド傾斜仕分け",
            "cat_desc_틸트트레이소터": "トレイを傾斜させて仕分けシュートへ滑り込ませるソーターシステムです。デリケートな荷物や多様なサイズの荷物仕分けに最適です。",
            "cat_tags_틸트트레이소터": "傾斜スライド仕分け,破損防止,多彩なサイズ対応,低騒音設計",
            "all_tab": "すべて表示",
            "video_theater_title": "動画シアター",
            "video_theater_sub": "(全 {count} 本 · 中央再生 / 右側サムネイル選択)",
            "photo_theater_title": "現場フォトシアター",
            "photo_theater_sub": "(全 {count} 枚 · 中央拡大 / 右側ギャラリー選択)",
            "autoplay_on": "自動連続再生 ON",
            "autoplay_off": "自動連続再生 OFF",
            "slideshow_on": "スライドショー ON",
            "slideshow_off": "スライドショー OFF",
            "prev_vid": "前の動画",
            "next_vid": "次の動画",
            "prev_pho": "前の写真",
            "next_pho": "次の写真",
            "vid_order": "動画順序: {cur} / {total}",
            "pho_order": "写真順序: {cur} / {total}",
            "vid_analysis": "現場エンジニアリング解説",
            "pho_analysis": "現場システム分析解説",
            "vid_playlist": "動画プレイリスト",
            "vid_playlist_sub": "右側のサムネイルをクリックすると中央で再生されます",
            "pho_playlist": "画像ギャラリー一覧",
            "pho_playlist_sub": "右側のサムネイルをクリックすると中央に大きく表示されます",
            "playing": "再生中",
            "showing": "表示中",
            "zoom_fullscreen": "全画面拡大",
            "btn_go_vid": "動画シアターへ移動 ({count})",
            "btn_go_pho": "画像シアターへ移動 ({count})",
            "all_title": "主要構築実績総合アーカイブ (All Reference)",
            "all_subtitle": "スマート物流製造拠点全景および5大コアソーター（CBS・NC CBS・NBS・ホイールソーター・チルトトレイソーター）",
            "all_overview": "ATAテクノロジーの大規模スマート物流製造拠点のドローン空撮全景から、CBS、NC CBS、NBS、ホイールソーター、チルトトレイソーターの現場実稼働映像と高解像度写真を網羅してご確認いただけます。"
        }
    };

    function getRefLang() {
        var lang = window.currentLanguage || (function () {
            try { return localStorage.getItem('ata_language') || 'ko'; } catch (e) { return 'ko'; }
        })();
        if (lang === 'cn') lang = 'zh';
        return REF_I18N[lang] ? lang : 'ko';
    }

    function tRef(key, params) {
        var lang = getRefLang();
        var str = (REF_I18N[lang] && REF_I18N[lang][key]) || REF_I18N['ko'][key] || key;
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(function (p) {
                str = str.replace(new RegExp('\\\\{' + p + '\\\\}', 'g'), params[p]);
            });
        }
        return str;
    }



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
        "videoTemplates": [],
        "photoTemplates": [],
        "videoCount": 0,
        "photoCount": 1,
        "videos": [],
        "photos": [
            {
                "id": "전경-pho-1",
                "folder": "전경",
                "index": 1,
                "fileName": "전경_1.jpg",
                "src": "assets/reference/전경/전경_1.jpg",
                "fallbackSrc": "[ Insert Data ]/[ Movie & Photo ]/전경/전경_1.jpg",
                "thumb": "assets/reference/전경/전경_1.jpg",
                "fallbackThumb": "assets/reference/전경/전경_1.jpg",
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
        "videoTemplates": [],
        "photoTemplates": [],
        "videoCount": 27,
        "photoCount": 33,
        "videos": [
            {
                "id": "CBS-vid-1",
                "folder": "CBS",
                "index": 1,
                "fileName": "CBS_1.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_1.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_1.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_2.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_2.jpg",
                "clipCode": "CBS 영상 #01",
                "title": "[CBS 영상 #01] CBS 현장 가동 및 고속 분류 실증",
                "desc": "크로스벨트 소터(CBS) 루프 라인 초고속 연속 분류 실가동 영상입니다. 개별 캐리어의 서보 벨트가 목표 슈트 위치에서 정밀 구동되어 화물을 오차 없이 분기합니다.",
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
                "fileName": "CBS_3.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_3.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_3.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_2.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_2.jpg",
                "clipCode": "CBS 영상 #03",
                "title": "[CBS 영상 #03] CBS 현장 가동 및 고속 분류 실증",
                "desc": "다열 인덕션(Induction) 자동 정렬 및 캐리어 중앙 안착 동기화 제어 구간입니다. 화물 간격을 자동 계산하여 소터 캐리어에 무정차 고속 투입합니다.",
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
                "fileName": "CBS_4.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_4.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_4.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_2.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_2.jpg",
                "clipCode": "CBS 영상 #04",
                "title": "[CBS 영상 #04] CBS 현장 가동 및 고속 분류 실증",
                "desc": "양방향 대용량 배출 슈트 및 마대 슈트 인터페이스 가동 장면입니다. 정형 박스부터 비정형 폴리백까지 안전하게 슬라이딩 배출됩니다.",
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
                "fileName": "CBS_7.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_7.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_7.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_5.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_5.jpg",
                "clipCode": "CBS 영상 #07",
                "title": "[CBS 영상 #07] CBS 현장 가동 및 고속 분류 실증",
                "desc": "메인 루프 곡선 주행 및 직선 고속 분류 구간 연속 운전 테스트 영상입니다. 고속 주행 시에도 소음과 진동을 최소화한 메커니즘을 자랑합니다.",
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
                "fileName": "CBS_8.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_8.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_8.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_6.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_6.jpg",
                "clipCode": "CBS 영상 #08",
                "title": "[CBS 영상 #08] CBS 현장 가동 및 고속 분류 실증",
                "desc": "상단 비전 바코드 스캐너(Barcode Scanner) 및 체적 측정기(DWS) 연동 고속 분류 제어 현장입니다.",
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
                "fileName": "CBS_11.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_11.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_11.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_9.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_9.jpg",
                "clipCode": "CBS 영상 #11",
                "title": "[CBS 영상 #11] CBS 현장 가동 및 고속 분류 실증",
                "desc": "풀필먼트 물류센터 실환경에서 대용량 물량을 고속으로 처리하는 크로스벨트 소터 종합 가동 장면입니다.",
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
                "fileName": "CBS_13.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_13.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_13.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_12.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_12.jpg",
                "clipCode": "CBS 영상 #13",
                "title": "[CBS 영상 #13] CBS 현장 가동 및 고속 분류 실증",
                "desc": "크로스벨트 소터(CBS) 루프 라인 초고속 연속 분류 실가동 영상입니다. 개별 캐리어의 서보 벨트가 목표 슈트 위치에서 정밀 구동되어 화물을 오차 없이 분기합니다.",
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
                "fileName": "CBS_14.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_14.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_14.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_12.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_12.jpg",
                "clipCode": "CBS 영상 #14",
                "title": "[CBS 영상 #14] CBS 현장 가동 및 고속 분류 실증",
                "desc": "다열 인덕션(Induction) 자동 정렬 및 캐리어 중앙 안착 동기화 제어 구간입니다. 화물 간격을 자동 계산하여 소터 캐리어에 무정차 고속 투입합니다.",
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
                "fileName": "CBS_18.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_18.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_18.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_16.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_16.jpg",
                "clipCode": "CBS 영상 #18",
                "title": "[CBS 영상 #18] CBS 현장 가동 및 고속 분류 실증",
                "desc": "양방향 대용량 배출 슈트 및 마대 슈트 인터페이스 가동 장면입니다. 정형 박스부터 비정형 폴리백까지 안전하게 슬라이딩 배출됩니다.",
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
                "fileName": "CBS_21.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_21.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_21.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_19.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_19.jpg",
                "clipCode": "CBS 영상 #21",
                "title": "[CBS 영상 #21] CBS 현장 가동 및 고속 분류 실증",
                "desc": "메인 루프 곡선 주행 및 직선 고속 분류 구간 연속 운전 테스트 영상입니다. 고속 주행 시에도 소음과 진동을 최소화한 메커니즘을 자랑합니다.",
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
                "fileName": "CBS_25.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_25.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_25.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_23.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_23.jpg",
                "clipCode": "CBS 영상 #25",
                "title": "[CBS 영상 #25] CBS 현장 가동 및 고속 분류 실증",
                "desc": "상단 비전 바코드 스캐너(Barcode Scanner) 및 체적 측정기(DWS) 연동 고속 분류 제어 현장입니다.",
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
                "fileName": "CBS_27.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_27.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_27.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_26.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_26.jpg",
                "clipCode": "CBS 영상 #27",
                "title": "[CBS 영상 #27] CBS 현장 가동 및 고속 분류 실증",
                "desc": "풀필먼트 물류센터 실환경에서 대용량 물량을 고속으로 처리하는 크로스벨트 소터 종합 가동 장면입니다.",
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
                "fileName": "CBS_28.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_28.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_28.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_26.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_26.jpg",
                "clipCode": "CBS 영상 #28",
                "title": "[CBS 영상 #28] CBS 현장 가동 및 고속 분류 실증",
                "desc": "크로스벨트 소터(CBS) 루프 라인 초고속 연속 분류 실가동 영상입니다. 개별 캐리어의 서보 벨트가 목표 슈트 위치에서 정밀 구동되어 화물을 오차 없이 분기합니다.",
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
                "fileName": "CBS_29.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_29.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_29.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_31.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_31.jpg",
                "clipCode": "CBS 영상 #29",
                "title": "[CBS 영상 #29] CBS 현장 가동 및 고속 분류 실증",
                "desc": "다열 인덕션(Induction) 자동 정렬 및 캐리어 중앙 안착 동기화 제어 구간입니다. 화물 간격을 자동 계산하여 소터 캐리어에 무정차 고속 투입합니다.",
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
                "fileName": "CBS_30.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_30.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_30.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_31.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_31.jpg",
                "clipCode": "CBS 영상 #30",
                "title": "[CBS 영상 #30] CBS 현장 가동 및 고속 분류 실증",
                "desc": "양방향 대용량 배출 슈트 및 마대 슈트 인터페이스 가동 장면입니다. 정형 박스부터 비정형 폴리백까지 안전하게 슬라이딩 배출됩니다.",
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
                "fileName": "CBS_32.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_32.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_32.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_31.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_31.jpg",
                "clipCode": "CBS 영상 #32",
                "title": "[CBS 영상 #32] CBS 현장 가동 및 고속 분류 실증",
                "desc": "메인 루프 곡선 주행 및 직선 고속 분류 구간 연속 운전 테스트 영상입니다. 고속 주행 시에도 소음과 진동을 최소화한 메커니즘을 자랑합니다.",
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
                "fileName": "CBS_35.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_35.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_35.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_33.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_33.jpg",
                "clipCode": "CBS 영상 #35",
                "title": "[CBS 영상 #35] CBS 현장 가동 및 고속 분류 실증",
                "desc": "상단 비전 바코드 스캐너(Barcode Scanner) 및 체적 측정기(DWS) 연동 고속 분류 제어 현장입니다.",
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
                "fileName": "CBS_44.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_44.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_44.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_42.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_42.jpg",
                "clipCode": "CBS 영상 #44",
                "title": "[CBS 영상 #44] CBS 현장 가동 및 고속 분류 실증",
                "desc": "풀필먼트 물류센터 실환경에서 대용량 물량을 고속으로 처리하는 크로스벨트 소터 종합 가동 장면입니다.",
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
                "fileName": "CBS_46.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_46.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_46.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_45.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_45.jpg",
                "clipCode": "CBS 영상 #46",
                "title": "[CBS 영상 #46] CBS 현장 가동 및 고속 분류 실증",
                "desc": "크로스벨트 소터(CBS) 루프 라인 초고속 연속 분류 실가동 영상입니다. 개별 캐리어의 서보 벨트가 목표 슈트 위치에서 정밀 구동되어 화물을 오차 없이 분기합니다.",
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
                "fileName": "CBS_48.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_48.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_48.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_47.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_47.jpg",
                "clipCode": "CBS 영상 #48",
                "title": "[CBS 영상 #48] CBS 현장 가동 및 고속 분류 실증",
                "desc": "다열 인덕션(Induction) 자동 정렬 및 캐리어 중앙 안착 동기화 제어 구간입니다. 화물 간격을 자동 계산하여 소터 캐리어에 무정차 고속 투입합니다.",
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
                "fileName": "CBS_50.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_50.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_50.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_49.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_49.jpg",
                "clipCode": "CBS 영상 #50",
                "title": "[CBS 영상 #50] CBS 현장 가동 및 고속 분류 실증",
                "desc": "양방향 대용량 배출 슈트 및 마대 슈트 인터페이스 가동 장면입니다. 정형 박스부터 비정형 폴리백까지 안전하게 슬라이딩 배출됩니다.",
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
                "fileName": "CBS_51.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_51.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_51.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_49.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_49.jpg",
                "clipCode": "CBS 영상 #51",
                "title": "[CBS 영상 #51] CBS 현장 가동 및 고속 분류 실증",
                "desc": "메인 루프 곡선 주행 및 직선 고속 분류 구간 연속 운전 테스트 영상입니다. 고속 주행 시에도 소음과 진동을 최소화한 메커니즘을 자랑합니다.",
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
                "fileName": "CBS_52.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_52.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_52.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_53.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_53.jpg",
                "clipCode": "CBS 영상 #52",
                "title": "[CBS 영상 #52] CBS 현장 가동 및 고속 분류 실증",
                "desc": "상단 비전 바코드 스캐너(Barcode Scanner) 및 체적 측정기(DWS) 연동 고속 분류 제어 현장입니다.",
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
                "fileName": "CBS_54.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_54.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_54.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_53.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_53.jpg",
                "clipCode": "CBS 영상 #54",
                "title": "[CBS 영상 #54] CBS 현장 가동 및 고속 분류 실증",
                "desc": "풀필먼트 물류센터 실환경에서 대용량 물량을 고속으로 처리하는 크로스벨트 소터 종합 가동 장면입니다.",
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
                "fileName": "CBS_58.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_58.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_58.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_56.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_56.jpg",
                "clipCode": "CBS 영상 #58",
                "title": "[CBS 영상 #58] CBS 현장 가동 및 고속 분류 실증",
                "desc": "크로스벨트 소터(CBS) 루프 라인 초고속 연속 분류 실가동 영상입니다. 개별 캐리어의 서보 벨트가 목표 슈트 위치에서 정밀 구동되어 화물을 오차 없이 분기합니다.",
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
                "fileName": "CBS_59.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_59.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_59.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_57.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_57.jpg",
                "clipCode": "CBS 영상 #59",
                "title": "[CBS 영상 #59] CBS 현장 가동 및 고속 분류 실증",
                "desc": "다열 인덕션(Induction) 자동 정렬 및 캐리어 중앙 안착 동기화 제어 구간입니다. 화물 간격을 자동 계산하여 소터 캐리어에 무정차 고속 투입합니다.",
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
                "fileName": "CBS_60.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_60.mp4",
                "fallbackSrc": "assets/reference/CBS/CBS_60.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_45.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_45.jpg",
                "clipCode": "CBS 영상 #60",
                "title": "[CBS 영상 #60] CBS 현장 가동 및 고속 분류 실증",
                "desc": "양방향 대용량 배출 슈트 및 마대 슈트 인터페이스 가동 장면입니다. 정형 박스부터 비정형 폴리백까지 안전하게 슬라이딩 배출됩니다.",
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
                "fileName": "CBS_2.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_2.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_2.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_2.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_2.jpg",
                "clipCode": "CBS 현장포토 #02",
                "title": "[CBS 사진 #02] CBS 설비 상세 및 라인 구축 전경",
                "desc": "크로스벨트 소터 메인 캐리어 및 구동 벨트 어셈블리 상세 구조입니다. 마모를 최소화한 특수 벨트와 정밀 가이드 레일이 적용되었습니다.",
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
                "fileName": "CBS_5.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_5.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_5.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_5.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_5.jpg",
                "clipCode": "CBS 현장포토 #05",
                "title": "[CBS 사진 #05] CBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 고속 투입 인덕션 라인 정렬 및 동기화 제어 섹션 전경입니다.",
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
                "fileName": "CBS_6.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_6.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_6.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_6.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_6.jpg",
                "clipCode": "CBS 현장포토 #06",
                "title": "[CBS 사진 #06] CBS 설비 상세 및 라인 구축 전경",
                "desc": "소터 하부 메인 드라이브 모터 및 리니어 모터(LSM) 구동부 엔지니어링 디테일입니다.",
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
                "fileName": "CBS_9.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_9.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_9.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_9.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_9.jpg",
                "clipCode": "CBS 현장포토 #09",
                "title": "[CBS 사진 #09] CBS 설비 상세 및 라인 구축 전경",
                "desc": "양방향 슈트 및 자동 만배 감지 센서가 완비된 배출 라인 구조입니다.",
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
                "fileName": "CBS_10.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_10.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_10.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_10.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_10.jpg",
                "clipCode": "CBS 현장포토 #10",
                "title": "[CBS 사진 #10] CBS 설비 상세 및 라인 구축 전경",
                "desc": "중앙 집중식 WCS 관제 시스템과 연동된 통합 전기 배전·제어반 구성입니다.",
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
                "fileName": "CBS_12.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_12.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_12.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_12.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_12.jpg",
                "clipCode": "CBS 현장포토 #12",
                "title": "[CBS 사진 #12] CBS 설비 상세 및 라인 구축 전경",
                "desc": "크로스벨트 소터 메인 캐리어 및 구동 벨트 어셈블리 상세 구조입니다. 마모를 최소화한 특수 벨트와 정밀 가이드 레일이 적용되었습니다.",
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
                "fileName": "CBS_15.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_15.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_15.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_15.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_15.jpg",
                "clipCode": "CBS 현장포토 #15",
                "title": "[CBS 사진 #15] CBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 고속 투입 인덕션 라인 정렬 및 동기화 제어 섹션 전경입니다.",
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
                "fileName": "CBS_16.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_16.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_16.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_16.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_16.jpg",
                "clipCode": "CBS 현장포토 #16",
                "title": "[CBS 사진 #16] CBS 설비 상세 및 라인 구축 전경",
                "desc": "소터 하부 메인 드라이브 모터 및 리니어 모터(LSM) 구동부 엔지니어링 디테일입니다.",
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
                "fileName": "CBS_17.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_17.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_17.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_17.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_17.jpg",
                "clipCode": "CBS 현장포토 #17",
                "title": "[CBS 사진 #17] CBS 설비 상세 및 라인 구축 전경",
                "desc": "양방향 슈트 및 자동 만배 감지 센서가 완비된 배출 라인 구조입니다.",
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
                "fileName": "CBS_19.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_19.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_19.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_19.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_19.jpg",
                "clipCode": "CBS 현장포토 #19",
                "title": "[CBS 사진 #19] CBS 설비 상세 및 라인 구축 전경",
                "desc": "중앙 집중식 WCS 관제 시스템과 연동된 통합 전기 배전·제어반 구성입니다.",
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
                "fileName": "CBS_20.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_20.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_20.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_20.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_20.jpg",
                "clipCode": "CBS 현장포토 #20",
                "title": "[CBS 사진 #20] CBS 설비 상세 및 라인 구축 전경",
                "desc": "크로스벨트 소터 메인 캐리어 및 구동 벨트 어셈블리 상세 구조입니다. 마모를 최소화한 특수 벨트와 정밀 가이드 레일이 적용되었습니다.",
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
                "fileName": "CBS_22.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_22.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_22.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_22.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_22.jpg",
                "clipCode": "CBS 현장포토 #22",
                "title": "[CBS 사진 #22] CBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 고속 투입 인덕션 라인 정렬 및 동기화 제어 섹션 전경입니다.",
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
                "fileName": "CBS_23.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_23.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_23.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_23.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_23.jpg",
                "clipCode": "CBS 현장포토 #23",
                "title": "[CBS 사진 #23] CBS 설비 상세 및 라인 구축 전경",
                "desc": "소터 하부 메인 드라이브 모터 및 리니어 모터(LSM) 구동부 엔지니어링 디테일입니다.",
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
                "fileName": "CBS_24.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_24.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_24.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_24.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_24.jpg",
                "clipCode": "CBS 현장포토 #24",
                "title": "[CBS 사진 #24] CBS 설비 상세 및 라인 구축 전경",
                "desc": "양방향 슈트 및 자동 만배 감지 센서가 완비된 배출 라인 구조입니다.",
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
                "fileName": "CBS_26.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_26.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_26.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_26.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_26.jpg",
                "clipCode": "CBS 현장포토 #26",
                "title": "[CBS 사진 #26] CBS 설비 상세 및 라인 구축 전경",
                "desc": "중앙 집중식 WCS 관제 시스템과 연동된 통합 전기 배전·제어반 구성입니다.",
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
                "fileName": "CBS_31.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_31.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_31.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_31.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_31.jpg",
                "clipCode": "CBS 현장포토 #31",
                "title": "[CBS 사진 #31] CBS 설비 상세 및 라인 구축 전경",
                "desc": "크로스벨트 소터 메인 캐리어 및 구동 벨트 어셈블리 상세 구조입니다. 마모를 최소화한 특수 벨트와 정밀 가이드 레일이 적용되었습니다.",
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
                "fileName": "CBS_33.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_33.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_33.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_33.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_33.jpg",
                "clipCode": "CBS 현장포토 #33",
                "title": "[CBS 사진 #33] CBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 고속 투입 인덕션 라인 정렬 및 동기화 제어 섹션 전경입니다.",
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
                "fileName": "CBS_34.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_34.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_34.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_34.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_34.jpg",
                "clipCode": "CBS 현장포토 #34",
                "title": "[CBS 사진 #34] CBS 설비 상세 및 라인 구축 전경",
                "desc": "소터 하부 메인 드라이브 모터 및 리니어 모터(LSM) 구동부 엔지니어링 디테일입니다.",
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
                "fileName": "CBS_36.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_36.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_36.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_36.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_36.jpg",
                "clipCode": "CBS 현장포토 #36",
                "title": "[CBS 사진 #36] CBS 설비 상세 및 라인 구축 전경",
                "desc": "양방향 슈트 및 자동 만배 감지 센서가 완비된 배출 라인 구조입니다.",
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
                "fileName": "CBS_37.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_37.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_37.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_37.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_37.jpg",
                "clipCode": "CBS 현장포토 #37",
                "title": "[CBS 사진 #37] CBS 설비 상세 및 라인 구축 전경",
                "desc": "중앙 집중식 WCS 관제 시스템과 연동된 통합 전기 배전·제어반 구성입니다.",
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
                "fileName": "CBS_38.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_38.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_38.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_38.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_38.jpg",
                "clipCode": "CBS 현장포토 #38",
                "title": "[CBS 사진 #38] CBS 설비 상세 및 라인 구축 전경",
                "desc": "크로스벨트 소터 메인 캐리어 및 구동 벨트 어셈블리 상세 구조입니다. 마모를 최소화한 특수 벨트와 정밀 가이드 레일이 적용되었습니다.",
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
                "fileName": "CBS_39.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_39.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_39.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_39.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_39.jpg",
                "clipCode": "CBS 현장포토 #39",
                "title": "[CBS 사진 #39] CBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 고속 투입 인덕션 라인 정렬 및 동기화 제어 섹션 전경입니다.",
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
                "fileName": "CBS_40.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_40.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_40.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_40.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_40.jpg",
                "clipCode": "CBS 현장포토 #40",
                "title": "[CBS 사진 #40] CBS 설비 상세 및 라인 구축 전경",
                "desc": "소터 하부 메인 드라이브 모터 및 리니어 모터(LSM) 구동부 엔지니어링 디테일입니다.",
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
                "fileName": "CBS_41.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_41.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_41.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_41.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_41.jpg",
                "clipCode": "CBS 현장포토 #41",
                "title": "[CBS 사진 #41] CBS 설비 상세 및 라인 구축 전경",
                "desc": "양방향 슈트 및 자동 만배 감지 센서가 완비된 배출 라인 구조입니다.",
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
                "fileName": "CBS_42.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_42.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_42.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_42.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_42.jpg",
                "clipCode": "CBS 현장포토 #42",
                "title": "[CBS 사진 #42] CBS 설비 상세 및 라인 구축 전경",
                "desc": "중앙 집중식 WCS 관제 시스템과 연동된 통합 전기 배전·제어반 구성입니다.",
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
                "fileName": "CBS_43.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_43.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_43.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_43.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_43.jpg",
                "clipCode": "CBS 현장포토 #43",
                "title": "[CBS 사진 #43] CBS 설비 상세 및 라인 구축 전경",
                "desc": "크로스벨트 소터 메인 캐리어 및 구동 벨트 어셈블리 상세 구조입니다. 마모를 최소화한 특수 벨트와 정밀 가이드 레일이 적용되었습니다.",
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
                "fileName": "CBS_45.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_45.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_45.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_45.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_45.jpg",
                "clipCode": "CBS 현장포토 #45",
                "title": "[CBS 사진 #45] CBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 고속 투입 인덕션 라인 정렬 및 동기화 제어 섹션 전경입니다.",
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
                "fileName": "CBS_47.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_47.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_47.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_47.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_47.jpg",
                "clipCode": "CBS 현장포토 #47",
                "title": "[CBS 사진 #47] CBS 설비 상세 및 라인 구축 전경",
                "desc": "소터 하부 메인 드라이브 모터 및 리니어 모터(LSM) 구동부 엔지니어링 디테일입니다.",
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
                "fileName": "CBS_49.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_49.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_49.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_49.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_49.jpg",
                "clipCode": "CBS 현장포토 #49",
                "title": "[CBS 사진 #49] CBS 설비 상세 및 라인 구축 전경",
                "desc": "양방향 슈트 및 자동 만배 감지 센서가 완비된 배출 라인 구조입니다.",
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
                "fileName": "CBS_53.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_53.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_53.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_53.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_53.jpg",
                "clipCode": "CBS 현장포토 #53",
                "title": "[CBS 사진 #53] CBS 설비 상세 및 라인 구축 전경",
                "desc": "중앙 집중식 WCS 관제 시스템과 연동된 통합 전기 배전·제어반 구성입니다.",
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
                "fileName": "CBS_55.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_55.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_55.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_55.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_55.jpg",
                "clipCode": "CBS 현장포토 #55",
                "title": "[CBS 사진 #55] CBS 설비 상세 및 라인 구축 전경",
                "desc": "크로스벨트 소터 메인 캐리어 및 구동 벨트 어셈블리 상세 구조입니다. 마모를 최소화한 특수 벨트와 정밀 가이드 레일이 적용되었습니다.",
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
                "fileName": "CBS_56.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_56.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_56.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_56.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_56.jpg",
                "clipCode": "CBS 현장포토 #56",
                "title": "[CBS 사진 #56] CBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 고속 투입 인덕션 라인 정렬 및 동기화 제어 섹션 전경입니다.",
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
                "fileName": "CBS_57.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_57.jpg",
                "fallbackSrc": "assets/reference/CBS/CBS_57.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/CBS/CBS_57.jpg",
                "fallbackThumb": "assets/reference/CBS/CBS_57.jpg",
                "clipCode": "CBS 현장포토 #57",
                "title": "[CBS 사진 #57] CBS 설비 상세 및 라인 구축 전경",
                "desc": "소터 하부 메인 드라이브 모터 및 리니어 모터(LSM) 구동부 엔지니어링 디테일입니다.",
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
        "subtitle": "NC CBS [Narrow Cross Belt Sorter] — 초슬림 협폭 크로스벨트 소터",
        "badge": "NARROW CROSS BELT SORTER",
        "icon": "fa-bolt-lightning",
        "overview": "컴팩트한 설치 면적과 초정밀 협폭 제어를 결합한 NC CBS(Narrow Cross Belt Sorter) 가동 현장입니다. 소형 택배 화물부터 폴리백, 도서, 의류 및 중소형 박스까지 공간 효율을 극대화하여 고밀도로 정밀 분류합니다.",
        "tags": [
            "NC CBS",
            "협폭 크로스벨트",
            "초소형·소형 화물",
            "공간 최적화"
        ],
        "videoTemplates": [],
        "photoTemplates": [],
        "videoCount": 9,
        "photoCount": 16,
        "videos": [
            {
                "id": "NC CBS-vid-1",
                "folder": "NC CBS",
                "index": 1,
                "fileName": "NC CBS_2.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_2.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_2.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_1.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_1.jpg",
                "clipCode": "NC CBS 영상 #02",
                "title": "[NC CBS 영상 #02] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "협폭 크로스벨트 소터(NC CBS) 컴팩트 라인 고속 연속 분류 영상입니다. 좁은 공간에서도 최대의 처리 효율을 발휘합니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-2",
                "folder": "NC CBS",
                "index": 2,
                "fileName": "NC CBS_4.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_4.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_4.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_3.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_3.jpg",
                "clipCode": "NC CBS 영상 #04",
                "title": "[NC CBS 영상 #04] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "소형 화물 및 의류 폴리백의 미끄러짐 없는 초정밀 벨트 분기 실가동 장면입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-3",
                "folder": "NC CBS",
                "index": 3,
                "fileName": "NC CBS_6.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_6.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_6.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_5.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_5.jpg",
                "clipCode": "NC CBS 영상 #06",
                "title": "[NC CBS 영상 #06] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "NC CBS 인덕션 투입 및 고밀도 연속 배출 슈트 연동 제어 현장 영상입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-4",
                "folder": "NC CBS",
                "index": 4,
                "fileName": "NC CBS_12.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_12.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_12.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_10.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_10.jpg",
                "clipCode": "NC CBS 영상 #12",
                "title": "[NC CBS 영상 #12] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "협폭 크로스벨트 소터(NC CBS) 컴팩트 라인 고속 연속 분류 영상입니다. 좁은 공간에서도 최대의 처리 효율을 발휘합니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-5",
                "folder": "NC CBS",
                "index": 5,
                "fileName": "NC CBS_14.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_14.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_14.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_13.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_13.jpg",
                "clipCode": "NC CBS 영상 #14",
                "title": "[NC CBS 영상 #14] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "소형 화물 및 의류 폴리백의 미끄러짐 없는 초정밀 벨트 분기 실가동 장면입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-6",
                "folder": "NC CBS",
                "index": 6,
                "fileName": "NC CBS_15.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_15.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_15.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_13.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_13.jpg",
                "clipCode": "NC CBS 영상 #15",
                "title": "[NC CBS 영상 #15] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "NC CBS 인덕션 투입 및 고밀도 연속 배출 슈트 연동 제어 현장 영상입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-7",
                "folder": "NC CBS",
                "index": 7,
                "fileName": "NC CBS_18.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_18.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_18.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_16.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_16.jpg",
                "clipCode": "NC CBS 영상 #18",
                "title": "[NC CBS 영상 #18] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "협폭 크로스벨트 소터(NC CBS) 컴팩트 라인 고속 연속 분류 영상입니다. 좁은 공간에서도 최대의 처리 효율을 발휘합니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-8",
                "folder": "NC CBS",
                "index": 8,
                "fileName": "NC CBS_21.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_21.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_21.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_19.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_19.jpg",
                "clipCode": "NC CBS 영상 #21",
                "title": "[NC CBS 영상 #21] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "소형 화물 및 의류 폴리백의 미끄러짐 없는 초정밀 벨트 분기 실가동 장면입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-vid-9",
                "folder": "NC CBS",
                "index": 9,
                "fileName": "NC CBS_22.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_22.mp4",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_22.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_20.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_20.jpg",
                "clipCode": "NC CBS 영상 #22",
                "title": "[NC CBS 영상 #22] NC CBS 현장 가동 및 고속 분류 실증",
                "desc": "NC CBS 인덕션 투입 및 고밀도 연속 배출 슈트 연동 제어 현장 영상입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            }
        ],
        "photos": [
            {
                "id": "NC CBS-pho-1",
                "folder": "NC CBS",
                "index": 1,
                "fileName": "NC CBS_1.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_1.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_1.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_1.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_1.jpg",
                "clipCode": "NC CBS 현장포토 #01",
                "title": "[NC CBS 사진 #01] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "NC CBS 협폭 캐리어 구조 및 고밀도 슈트 배치 상세 포토입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-2",
                "folder": "NC CBS",
                "index": 2,
                "fileName": "NC CBS_3.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_3.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_3.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_3.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_3.jpg",
                "clipCode": "NC CBS 현장포토 #03",
                "title": "[NC CBS 사진 #03] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "공간 절약형 프레임 설계와 모듈러 확장 브라켓 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-3",
                "folder": "NC CBS",
                "index": 3,
                "fileName": "NC CBS_5.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_5.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_5.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_5.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_5.jpg",
                "clipCode": "NC CBS 현장포토 #05",
                "title": "[NC CBS 사진 #05] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "센서 및 케이블링이 일체형으로 정밀 빌트인된 협폭 소터 레일 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-4",
                "folder": "NC CBS",
                "index": 4,
                "fileName": "NC CBS_7.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_7.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_7.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_7.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_7.jpg",
                "clipCode": "NC CBS 현장포토 #07",
                "title": "[NC CBS 사진 #07] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "NC CBS 협폭 캐리어 구조 및 고밀도 슈트 배치 상세 포토입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-5",
                "folder": "NC CBS",
                "index": 5,
                "fileName": "NC CBS_8.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_8.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_8.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_8.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_8.jpg",
                "clipCode": "NC CBS 현장포토 #08",
                "title": "[NC CBS 사진 #08] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "공간 절약형 프레임 설계와 모듈러 확장 브라켓 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-6",
                "folder": "NC CBS",
                "index": 6,
                "fileName": "NC CBS_9.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_9.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_9.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_9.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_9.jpg",
                "clipCode": "NC CBS 현장포토 #09",
                "title": "[NC CBS 사진 #09] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "센서 및 케이블링이 일체형으로 정밀 빌트인된 협폭 소터 레일 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-7",
                "folder": "NC CBS",
                "index": 7,
                "fileName": "NC CBS_10.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_10.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_10.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_10.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_10.jpg",
                "clipCode": "NC CBS 현장포토 #10",
                "title": "[NC CBS 사진 #10] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "NC CBS 협폭 캐리어 구조 및 고밀도 슈트 배치 상세 포토입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-8",
                "folder": "NC CBS",
                "index": 8,
                "fileName": "NC CBS_11.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_11.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_11.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_11.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_11.jpg",
                "clipCode": "NC CBS 현장포토 #11",
                "title": "[NC CBS 사진 #11] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "공간 절약형 프레임 설계와 모듈러 확장 브라켓 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-9",
                "folder": "NC CBS",
                "index": 9,
                "fileName": "NC CBS_13.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_13.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_13.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_13.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_13.jpg",
                "clipCode": "NC CBS 현장포토 #13",
                "title": "[NC CBS 사진 #13] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "센서 및 케이블링이 일체형으로 정밀 빌트인된 협폭 소터 레일 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-10",
                "folder": "NC CBS",
                "index": 10,
                "fileName": "NC CBS_16.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_16.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_16.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_16.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_16.jpg",
                "clipCode": "NC CBS 현장포토 #16",
                "title": "[NC CBS 사진 #16] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "NC CBS 협폭 캐리어 구조 및 고밀도 슈트 배치 상세 포토입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-11",
                "folder": "NC CBS",
                "index": 11,
                "fileName": "NC CBS_17.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_17.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_17.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_17.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_17.jpg",
                "clipCode": "NC CBS 현장포토 #17",
                "title": "[NC CBS 사진 #17] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "공간 절약형 프레임 설계와 모듈러 확장 브라켓 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-12",
                "folder": "NC CBS",
                "index": 12,
                "fileName": "NC CBS_19.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_19.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_19.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_19.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_19.jpg",
                "clipCode": "NC CBS 현장포토 #19",
                "title": "[NC CBS 사진 #19] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "센서 및 케이블링이 일체형으로 정밀 빌트인된 협폭 소터 레일 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-13",
                "folder": "NC CBS",
                "index": 13,
                "fileName": "NC CBS_20.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_20.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_20.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_20.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_20.jpg",
                "clipCode": "NC CBS 현장포토 #20",
                "title": "[NC CBS 사진 #20] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "NC CBS 협폭 캐리어 구조 및 고밀도 슈트 배치 상세 포토입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-14",
                "folder": "NC CBS",
                "index": 14,
                "fileName": "NC CBS_23.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_23.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_23.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_23.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_23.jpg",
                "clipCode": "NC CBS 현장포토 #23",
                "title": "[NC CBS 사진 #23] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "공간 절약형 프레임 설계와 모듈러 확장 브라켓 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-15",
                "folder": "NC CBS",
                "index": 15,
                "fileName": "NC CBS_24.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_24.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_24.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_24.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_24.jpg",
                "clipCode": "NC CBS 현장포토 #24",
                "title": "[NC CBS 사진 #24] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "센서 및 케이블링이 일체형으로 정밀 빌트인된 협폭 소터 레일 구조입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            },
            {
                "id": "NC CBS-pho-16",
                "folder": "NC CBS",
                "index": 16,
                "fileName": "NC CBS_25.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_25.jpg",
                "fallbackSrc": "assets/reference/NC CBS/NC CBS_25.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NC CBS/NC CBS_25.jpg",
                "fallbackThumb": "assets/reference/NC CBS/NC CBS_25.jpg",
                "clipCode": "NC CBS 현장포토 #25",
                "title": "[NC CBS 사진 #25] NC CBS 설비 상세 및 라인 구축 전경",
                "desc": "NC CBS 협폭 캐리어 구조 및 고밀도 슈트 배치 상세 포토입니다.",
                "tags": [
                    "NC CBS",
                    "협폭 크로스벨트",
                    "초소형·소형 화물",
                    "공간 최적화"
                ]
            }
        ]
    },
    "NBS": {
        "id": "NBS",
        "title": "NBS",
        "subtitle": "NBS [Narrow Belt Sorter] — 고속 팝업 휠 협폭 벨트 소터",
        "badge": "NARROW BELT SORTER",
        "icon": "fa-grip-lines",
        "overview": "고속 팝업 휠 다방향 분기 메커니즘을 적용한 NBS(Narrow Belt Sorter) 라인입니다. 다양한 중량 및 크기의 화물을 무정차 상태에서 부드럽게 30도/45도/90도로 안전하게 연속 분기합니다.",
        "tags": [
            "Narrow Belt Sorter",
            "팝업 휠 분기",
            "연속 고속 분류",
            "박스/파우치 화물"
        ],
        "videoTemplates": [],
        "photoTemplates": [],
        "videoCount": 8,
        "photoCount": 13,
        "videos": [
            {
                "id": "NBS-vid-1",
                "folder": "NBS",
                "index": 1,
                "fileName": "NBS_1.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_1.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_1.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_2.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_2.jpg",
                "clipCode": "NBS 영상 #01",
                "title": "[NBS 영상 #01] NBS 현장 가동 및 고속 분류 실증",
                "desc": "협폭 벨트 소터(NBS) 팝업 휠 30도/45도 고속 분기 가동 영상입니다. 주행 중인 화물을 감속 없이 부드럽게 전환합니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-vid-2",
                "folder": "NBS",
                "index": 2,
                "fileName": "NBS_3.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_3.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_3.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_2.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_2.jpg",
                "clipCode": "NBS 영상 #03",
                "title": "[NBS 영상 #03] NBS 현장 가동 및 고속 분류 실증",
                "desc": "NBS 연속 투입 라인에서의 다품종 박스 화물 고속 방향 전환 실증 장면입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-vid-3",
                "folder": "NBS",
                "index": 3,
                "fileName": "NBS_6.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_6.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_6.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_4.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_4.jpg",
                "clipCode": "NBS 영상 #06",
                "title": "[NBS 영상 #06] NBS 현장 가동 및 고속 분류 실증",
                "desc": "안정적인 벨트 구동과 서보 조향 팝업 휠의 정밀한 동기화 제어 현장입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-vid-4",
                "folder": "NBS",
                "index": 4,
                "fileName": "NBS_7.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_7.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_7.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_5.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_5.jpg",
                "clipCode": "NBS 영상 #07",
                "title": "[NBS 영상 #07] NBS 현장 가동 및 고속 분류 실증",
                "desc": "협폭 벨트 소터(NBS) 팝업 휠 30도/45도 고속 분기 가동 영상입니다. 주행 중인 화물을 감속 없이 부드럽게 전환합니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-vid-5",
                "folder": "NBS",
                "index": 5,
                "fileName": "NBS_8.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_8.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_8.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_9.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_9.jpg",
                "clipCode": "NBS 영상 #08",
                "title": "[NBS 영상 #08] NBS 현장 가동 및 고속 분류 실증",
                "desc": "NBS 연속 투입 라인에서의 다품종 박스 화물 고속 방향 전환 실증 장면입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-vid-6",
                "folder": "NBS",
                "index": 6,
                "fileName": "NBS_13.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_13.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_13.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_11.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_11.jpg",
                "clipCode": "NBS 영상 #13",
                "title": "[NBS 영상 #13] NBS 현장 가동 및 고속 분류 실증",
                "desc": "안정적인 벨트 구동과 서보 조향 팝업 휠의 정밀한 동기화 제어 현장입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-vid-7",
                "folder": "NBS",
                "index": 7,
                "fileName": "NBS_17.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_17.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_17.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_15.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_15.jpg",
                "clipCode": "NBS 영상 #17",
                "title": "[NBS 영상 #17] NBS 현장 가동 및 고속 분류 실증",
                "desc": "협폭 벨트 소터(NBS) 팝업 휠 30도/45도 고속 분기 가동 영상입니다. 주행 중인 화물을 감속 없이 부드럽게 전환합니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-vid-8",
                "folder": "NBS",
                "index": 8,
                "fileName": "NBS_21.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_21.mp4",
                "fallbackSrc": "assets/reference/NBS/NBS_21.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_19.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_19.jpg",
                "clipCode": "NBS 영상 #21",
                "title": "[NBS 영상 #21] NBS 현장 가동 및 고속 분류 실증",
                "desc": "NBS 연속 투입 라인에서의 다품종 박스 화물 고속 방향 전환 실증 장면입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            }
        ],
        "photos": [
            {
                "id": "NBS-pho-1",
                "folder": "NBS",
                "index": 1,
                "fileName": "NBS_2.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_2.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_2.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_2.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_2.jpg",
                "clipCode": "NBS 현장포토 #02",
                "title": "[NBS 사진 #02] NBS 설비 상세 및 라인 구축 전경",
                "desc": "NBS 팝업 휠 메커니즘 및 롤러 구동부 확대 상세 사진입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-2",
                "folder": "NBS",
                "index": 2,
                "fileName": "NBS_4.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_4.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_4.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_4.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_4.jpg",
                "clipCode": "NBS 현장포토 #04",
                "title": "[NBS 사진 #04] NBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 협폭 벨트와 분기 슈트 간 무간극 연결 인터페이스 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-3",
                "folder": "NBS",
                "index": 3,
                "fileName": "NBS_5.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_5.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_5.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_5.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_5.jpg",
                "clipCode": "NBS 현장포토 #05",
                "title": "[NBS 사진 #05] NBS 설비 상세 및 라인 구축 전경",
                "desc": "유지보수가 용이한 모듈형 탈부착 휠 카트리지 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-4",
                "folder": "NBS",
                "index": 4,
                "fileName": "NBS_9.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_9.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_9.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_9.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_9.jpg",
                "clipCode": "NBS 현장포토 #09",
                "title": "[NBS 사진 #09] NBS 설비 상세 및 라인 구축 전경",
                "desc": "NBS 팝업 휠 메커니즘 및 롤러 구동부 확대 상세 사진입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-5",
                "folder": "NBS",
                "index": 5,
                "fileName": "NBS_10.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_10.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_10.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_10.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_10.jpg",
                "clipCode": "NBS 현장포토 #10",
                "title": "[NBS 사진 #10] NBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 협폭 벨트와 분기 슈트 간 무간극 연결 인터페이스 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-6",
                "folder": "NBS",
                "index": 6,
                "fileName": "NBS_11.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_11.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_11.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_11.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_11.jpg",
                "clipCode": "NBS 현장포토 #11",
                "title": "[NBS 사진 #11] NBS 설비 상세 및 라인 구축 전경",
                "desc": "유지보수가 용이한 모듈형 탈부착 휠 카트리지 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-7",
                "folder": "NBS",
                "index": 7,
                "fileName": "NBS_12.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_12.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_12.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_12.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_12.jpg",
                "clipCode": "NBS 현장포토 #12",
                "title": "[NBS 사진 #12] NBS 설비 상세 및 라인 구축 전경",
                "desc": "NBS 팝업 휠 메커니즘 및 롤러 구동부 확대 상세 사진입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-8",
                "folder": "NBS",
                "index": 8,
                "fileName": "NBS_14.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_14.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_14.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_14.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_14.jpg",
                "clipCode": "NBS 현장포토 #14",
                "title": "[NBS 사진 #14] NBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 협폭 벨트와 분기 슈트 간 무간극 연결 인터페이스 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-9",
                "folder": "NBS",
                "index": 9,
                "fileName": "NBS_15.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_15.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_15.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_15.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_15.jpg",
                "clipCode": "NBS 현장포토 #15",
                "title": "[NBS 사진 #15] NBS 설비 상세 및 라인 구축 전경",
                "desc": "유지보수가 용이한 모듈형 탈부착 휠 카트리지 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-10",
                "folder": "NBS",
                "index": 10,
                "fileName": "NBS_16.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_16.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_16.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_16.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_16.jpg",
                "clipCode": "NBS 현장포토 #16",
                "title": "[NBS 사진 #16] NBS 설비 상세 및 라인 구축 전경",
                "desc": "NBS 팝업 휠 메커니즘 및 롤러 구동부 확대 상세 사진입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-11",
                "folder": "NBS",
                "index": 11,
                "fileName": "NBS_18.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_18.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_18.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_18.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_18.jpg",
                "clipCode": "NBS 현장포토 #18",
                "title": "[NBS 사진 #18] NBS 설비 상세 및 라인 구축 전경",
                "desc": "다열 협폭 벨트와 분기 슈트 간 무간극 연결 인터페이스 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-12",
                "folder": "NBS",
                "index": 12,
                "fileName": "NBS_19.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_19.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_19.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_19.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_19.jpg",
                "clipCode": "NBS 현장포토 #19",
                "title": "[NBS 사진 #19] NBS 설비 상세 및 라인 구축 전경",
                "desc": "유지보수가 용이한 모듈형 탈부착 휠 카트리지 구조입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            },
            {
                "id": "NBS-pho-13",
                "folder": "NBS",
                "index": 13,
                "fileName": "NBS_20.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_20.jpg",
                "fallbackSrc": "assets/reference/NBS/NBS_20.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/NBS/NBS_20.jpg",
                "fallbackThumb": "assets/reference/NBS/NBS_20.jpg",
                "clipCode": "NBS 현장포토 #20",
                "title": "[NBS 사진 #20] NBS 설비 상세 및 라인 구축 전경",
                "desc": "NBS 팝업 휠 메커니즘 및 롤러 구동부 확대 상세 사진입니다.",
                "tags": [
                    "Narrow Belt Sorter",
                    "팝업 휠 분기",
                    "연속 고속 분류",
                    "박스/파우치 화물"
                ]
            }
        ]
    },
    "Wheel Sorter": {
        "id": "Wheel Sorter",
        "title": "Wheel Sorter",
        "subtitle": "Wheel Sorter — 4분할 독립 구동 팝업 휠 고속 방향전환 및 스마트 분류 시스템",
        "badge": "WHEEL SORTER",
        "icon": "fa-dharmachakra",
        "overview": "에이티에이기술의 특허 기술(특허 제10-2956028호 등)이 적용된 4분할 방향 전환장치 및 휠소터 시스템 가동 현장입니다. 독립 구동 롤러와 서보 조향 각도 제어를 통해 화물의 충격 없이 초고속 양방향/다방향 분기 및 인덕션 합류를 완벽하게 구현합니다.",
        "tags": [
            "Wheel Sorter",
            "4분할 방향 전환",
            "특허 제10-2956028호",
            "고속 팝업 휠"
        ],
        "videoTemplates": [],
        "photoTemplates": [],
        "videoCount": 11,
        "photoCount": 13,
        "videos": [
            {
                "id": "Wheel Sorter-vid-1",
                "folder": "Wheel Sorter",
                "index": 1,
                "fileName": "Wheel Sorter_3.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_3.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_3.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_1.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_1.jpg",
                "clipCode": "Wheel Sorter 영상 #03",
                "title": "[Wheel Sorter 영상 #03] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "4분할 독립 구동 팝업 휠 방향전환장치(특허 제10-2956028호) 초고속 양방향 분기 실가동 영상입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-2",
                "folder": "Wheel Sorter",
                "index": 2,
                "fileName": "Wheel Sorter_6.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_6.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_6.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_4.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_4.jpg",
                "clipCode": "Wheel Sorter 영상 #06",
                "title": "[Wheel Sorter 영상 #06] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "화물 크기와 무게에 따라 조향 각도를 실시간 가변 제어하는 지능형 휠소터 분류 장면입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-3",
                "folder": "Wheel Sorter",
                "index": 3,
                "fileName": "Wheel Sorter_8.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_8.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_8.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_7.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_7.jpg",
                "clipCode": "Wheel Sorter 영상 #08",
                "title": "[Wheel Sorter 영상 #08] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "고속 간격 제어 컨베이어와 휠소터가 연동된 스마트 허브 인덕션 라인 가동 영상입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-4",
                "folder": "Wheel Sorter",
                "index": 4,
                "fileName": "Wheel Sorter_10.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_10.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_10.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_9.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_9.jpg",
                "clipCode": "Wheel Sorter 영상 #10",
                "title": "[Wheel Sorter 영상 #10] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "4분할 독립 구동 팝업 휠 방향전환장치(특허 제10-2956028호) 초고속 양방향 분기 실가동 영상입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-5",
                "folder": "Wheel Sorter",
                "index": 5,
                "fileName": "Wheel Sorter_12.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_12.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_12.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_11.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_11.jpg",
                "clipCode": "Wheel Sorter 영상 #12",
                "title": "[Wheel Sorter 영상 #12] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "화물 크기와 무게에 따라 조향 각도를 실시간 가변 제어하는 지능형 휠소터 분류 장면입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-6",
                "folder": "Wheel Sorter",
                "index": 6,
                "fileName": "Wheel Sorter_14.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_14.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_14.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_13.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_13.jpg",
                "clipCode": "Wheel Sorter 영상 #14",
                "title": "[Wheel Sorter 영상 #14] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "고속 간격 제어 컨베이어와 휠소터가 연동된 스마트 허브 인덕션 라인 가동 영상입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-7",
                "folder": "Wheel Sorter",
                "index": 7,
                "fileName": "Wheel Sorter_16.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_16.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_16.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_15.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_15.jpg",
                "clipCode": "Wheel Sorter 영상 #16",
                "title": "[Wheel Sorter 영상 #16] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "4분할 독립 구동 팝업 휠 방향전환장치(특허 제10-2956028호) 초고속 양방향 분기 실가동 영상입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-8",
                "folder": "Wheel Sorter",
                "index": 8,
                "fileName": "Wheel Sorter_18.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_18.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_18.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_17.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_17.jpg",
                "clipCode": "Wheel Sorter 영상 #18",
                "title": "[Wheel Sorter 영상 #18] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "화물 크기와 무게에 따라 조향 각도를 실시간 가변 제어하는 지능형 휠소터 분류 장면입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-9",
                "folder": "Wheel Sorter",
                "index": 9,
                "fileName": "Wheel Sorter_20.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_20.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_20.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_19.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_19.jpg",
                "clipCode": "Wheel Sorter 영상 #20",
                "title": "[Wheel Sorter 영상 #20] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "고속 간격 제어 컨베이어와 휠소터가 연동된 스마트 허브 인덕션 라인 가동 영상입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-10",
                "folder": "Wheel Sorter",
                "index": 10,
                "fileName": "Wheel Sorter_22.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_22.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_22.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_21.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_21.jpg",
                "clipCode": "Wheel Sorter 영상 #22",
                "title": "[Wheel Sorter 영상 #22] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "4분할 독립 구동 팝업 휠 방향전환장치(특허 제10-2956028호) 초고속 양방향 분기 실가동 영상입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-vid-11",
                "folder": "Wheel Sorter",
                "index": 11,
                "fileName": "Wheel Sorter_24.mp4",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_24.mp4",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_24.mp4",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_23.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_23.jpg",
                "clipCode": "Wheel Sorter 영상 #24",
                "title": "[Wheel Sorter 영상 #24] Wheel Sorter 현장 가동 및 고속 분류 실증",
                "desc": "화물 크기와 무게에 따라 조향 각도를 실시간 가변 제어하는 지능형 휠소터 분류 장면입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            }
        ],
        "photos": [
            {
                "id": "Wheel Sorter-pho-1",
                "folder": "Wheel Sorter",
                "index": 1,
                "fileName": "Wheel Sorter_1.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_1.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_1.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_1.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_1.jpg",
                "clipCode": "Wheel Sorter 현장포토 #01",
                "title": "[Wheel Sorter 사진 #01] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "4분할 팝업 휠 내부 모터 및 독립 조향 링크 기구 정밀 클로즈업 사진입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-2",
                "folder": "Wheel Sorter",
                "index": 2,
                "fileName": "Wheel Sorter_2.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_2.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_2.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_2.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_2.jpg",
                "clipCode": "Wheel Sorter 현장포토 #02",
                "title": "[Wheel Sorter 사진 #02] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "특허 기술이 적용된 휠 모듈 프레임 및 내구성 검증 테스트베드 전경입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-3",
                "folder": "Wheel Sorter",
                "index": 3,
                "fileName": "Wheel Sorter_4.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_4.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_4.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_4.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_4.jpg",
                "clipCode": "Wheel Sorter 현장포토 #04",
                "title": "[Wheel Sorter 사진 #04] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "다양한 규격의 박스와 파우치를 완벽하게 이송하는 휠소터 상부 표면 구조입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-4",
                "folder": "Wheel Sorter",
                "index": 4,
                "fileName": "Wheel Sorter_5.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_5.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_5.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_5.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_5.jpg",
                "clipCode": "Wheel Sorter 현장포토 #05",
                "title": "[Wheel Sorter 사진 #05] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "4분할 팝업 휠 내부 모터 및 독립 조향 링크 기구 정밀 클로즈업 사진입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-5",
                "folder": "Wheel Sorter",
                "index": 5,
                "fileName": "Wheel Sorter_7.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_7.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_7.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_7.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_7.jpg",
                "clipCode": "Wheel Sorter 현장포토 #07",
                "title": "[Wheel Sorter 사진 #07] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "특허 기술이 적용된 휠 모듈 프레임 및 내구성 검증 테스트베드 전경입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-6",
                "folder": "Wheel Sorter",
                "index": 6,
                "fileName": "Wheel Sorter_9.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_9.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_9.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_9.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_9.jpg",
                "clipCode": "Wheel Sorter 현장포토 #09",
                "title": "[Wheel Sorter 사진 #09] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "다양한 규격의 박스와 파우치를 완벽하게 이송하는 휠소터 상부 표면 구조입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-7",
                "folder": "Wheel Sorter",
                "index": 7,
                "fileName": "Wheel Sorter_11.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_11.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_11.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_11.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_11.jpg",
                "clipCode": "Wheel Sorter 현장포토 #11",
                "title": "[Wheel Sorter 사진 #11] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "4분할 팝업 휠 내부 모터 및 독립 조향 링크 기구 정밀 클로즈업 사진입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-8",
                "folder": "Wheel Sorter",
                "index": 8,
                "fileName": "Wheel Sorter_13.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_13.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_13.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_13.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_13.jpg",
                "clipCode": "Wheel Sorter 현장포토 #13",
                "title": "[Wheel Sorter 사진 #13] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "특허 기술이 적용된 휠 모듈 프레임 및 내구성 검증 테스트베드 전경입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-9",
                "folder": "Wheel Sorter",
                "index": 9,
                "fileName": "Wheel Sorter_15.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_15.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_15.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_15.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_15.jpg",
                "clipCode": "Wheel Sorter 현장포토 #15",
                "title": "[Wheel Sorter 사진 #15] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "다양한 규격의 박스와 파우치를 완벽하게 이송하는 휠소터 상부 표면 구조입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-10",
                "folder": "Wheel Sorter",
                "index": 10,
                "fileName": "Wheel Sorter_17.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_17.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_17.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_17.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_17.jpg",
                "clipCode": "Wheel Sorter 현장포토 #17",
                "title": "[Wheel Sorter 사진 #17] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "4분할 팝업 휠 내부 모터 및 독립 조향 링크 기구 정밀 클로즈업 사진입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-11",
                "folder": "Wheel Sorter",
                "index": 11,
                "fileName": "Wheel Sorter_19.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_19.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_19.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_19.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_19.jpg",
                "clipCode": "Wheel Sorter 현장포토 #19",
                "title": "[Wheel Sorter 사진 #19] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "특허 기술이 적용된 휠 모듈 프레임 및 내구성 검증 테스트베드 전경입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-12",
                "folder": "Wheel Sorter",
                "index": 12,
                "fileName": "Wheel Sorter_21.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_21.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_21.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_21.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_21.jpg",
                "clipCode": "Wheel Sorter 현장포토 #21",
                "title": "[Wheel Sorter 사진 #21] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "다양한 규격의 박스와 파우치를 완벽하게 이송하는 휠소터 상부 표면 구조입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
                ]
            },
            {
                "id": "Wheel Sorter-pho-13",
                "folder": "Wheel Sorter",
                "index": 13,
                "fileName": "Wheel Sorter_23.jpg",
                "src": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_23.jpg",
                "fallbackSrc": "assets/reference/Wheel Sorter/Wheel Sorter_23.jpg",
                "thumb": "[ Insert Data ]/[ Movie & Photo ]/Wheel Sorter/Wheel Sorter_23.jpg",
                "fallbackThumb": "assets/reference/Wheel Sorter/Wheel Sorter_23.jpg",
                "clipCode": "Wheel Sorter 현장포토 #23",
                "title": "[Wheel Sorter 사진 #23] Wheel Sorter 설비 상세 및 라인 구축 전경",
                "desc": "4분할 팝업 휠 내부 모터 및 독립 조향 링크 기구 정밀 클로즈업 사진입니다.",
                "tags": [
                    "Wheel Sorter",
                    "4분할 방향 전환",
                    "특허 제10-2956028호",
                    "고속 팝업 휠"
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
        "videoTemplates": [],
        "photoTemplates": [],
        "videoCount": 1,
        "photoCount": 1,
        "videos": [
            {
                "id": "틸트트레이소터-vid-1",
                "folder": "틸트트레이소터",
                "index": 1,
                "fileName": "Tilt Tray Sorter.mp4",
                "src": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.mp4",
                "fallbackSrc": "assets/reference/틸트트레이소터/Tilt Tray Sorter.mp4",
                "thumb": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.png",
                "fallbackThumb": "assets/reference/틸트트레이소터/Tilt Tray Sorter.png",
                "clipCode": "틸트트레이소터 영상 #01",
                "title": "[틸트트레이소터 영상 #01] 틸트트레이소터 현장 가동 및 고속 분류 실증",
                "desc": "틸트트레이소터 실제 가동 현장 동영상 #01 입니다.",
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
                "src": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.png",
                "fallbackSrc": "assets/reference/틸트트레이소터/Tilt Tray Sorter.png",
                "thumb": "[ Insert Data ]/SOLUTION/Tilt Tray Sorter.png",
                "fallbackThumb": "assets/reference/틸트트레이소터/Tilt Tray Sorter.png",
                "clipCode": "틸트트레이소터 현장포토 #01",
                "title": "[틸트트레이소터 사진 #01] 틸트트레이소터 설비 상세 및 라인 구축 전경",
                "desc": "틸트트레이소터 고해상도 현장 설비 상세 포토 #01 입니다.",
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
        var rawSrc = imgEl.getAttribute("data-raw-src") || "";
        var fbSrc = imgEl.getAttribute("data-fallback-src") || "";

        if (!imgEl.dataset.triedFallback && fbSrc) {
            imgEl.dataset.triedFallback = "1";
            imgEl.src = safeUrl(fbSrc);
            return;
        }
        if (!imgEl.dataset.triedInsertData && rawSrc.indexOf("assets/reference/") === 0) {
            imgEl.dataset.triedInsertData = "1";
            imgEl.src = safeUrl("[ Insert Data ]/[ Movie & Photo ]/" + rawSrc.substring(17));
            return;
        }
        if (!imgEl.dataset.triedAssets && rawSrc.indexOf("[ Insert Data ]/[ Movie & Photo ]/") === 0) {
            imgEl.dataset.triedAssets = "1";
            imgEl.src = safeUrl("assets/reference/" + rawSrc.substring(34));
            return;
        }
        if (!imgEl.dataset.triedSolution) {
            imgEl.dataset.triedSolution = "1";
            imgEl.src = safeUrl("[ Insert Data ]/SOLUTION/Conveyors & ADD-Ons.jpg");
            return;
        }
        imgEl.onerror = null;
        imgEl.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2338bdf8' font-family='sans-serif' font-size='18' font-weight='bold'%3EATA TECHNOLOGY REFERENCE%3C/text%3E%3C/svg%3E";
    };

    window.handleRefVideoError = function (videoEl) {
        if (!videoEl) return;
        var rawSrc = videoEl.getAttribute("data-raw-src") || "";
        var fbSrc = videoEl.getAttribute("data-fallback-src") || "";

        if (!videoEl.dataset.triedFallback && fbSrc) {
            videoEl.dataset.triedFallback = "1";
            videoEl.src = safeUrl(fbSrc);
            videoEl.volume = 0.1;
            videoEl.load();
            return;
        }
        if (!videoEl.dataset.triedInsertData && rawSrc.indexOf("assets/reference/") === 0) {
            videoEl.dataset.triedInsertData = "1";
            videoEl.src = safeUrl("[ Insert Data ]/[ Movie & Photo ]/" + rawSrc.substring(17));
            videoEl.volume = 0.1;
            videoEl.load();
            return;
        }
        if (!videoEl.dataset.triedAssets && rawSrc.indexOf("[ Insert Data ]/[ Movie & Photo ]/") === 0) {
            videoEl.dataset.triedAssets = "1";
            videoEl.src = safeUrl("assets/reference/" + rawSrc.substring(34));
            videoEl.volume = 0.1;
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
            ".ref-side-col { display: flex !important; flex-direction: column !important; background-color: #0f172a !important; border: 1px solid #1e293b !important; border-radius: 1rem !important; overflow: hidden !important; min-width: 0 !important; max-height: calc(100vh - 120px) !important; position: sticky !important; top: 90px !important; align-self: flex-start !important; z-index: 10 !important; }",
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
                label: tRef("all_tab"),
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
            '      <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center flex-wrap gap-2.5">',
            '        <span>' + tRef("video_theater_title") + '</span>',
            '        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-red-50 text-red-600 border border-red-200 shadow-sm">',
            '          <i class="fa-solid fa-film text-xs"></i> ' + tRef("total_count_label", { count: currentVideoList.length }),
            '        </span>',
            '      </h3>',
            '    </div>',
            '    <div class="flex flex-wrap items-center gap-2">',
            '      <button type="button" id="ref-yt-autoplay-btn" onclick="window.ReferenceAdmin.toggleAutoPlay()" class="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ' + (autoPlayNextVideo ? 'bg-red-600 text-white border-red-600 shadow-sm' : 'bg-white text-slate-600 border-slate-300') + '">',
            '        <i class="fa-solid ' + (autoPlayNextVideo ? 'fa-toggle-on text-white' : 'fa-toggle-off') + ' mr-1 text-sm"></i> ' + (autoPlayNextVideo ? tRef("autoplay_on") : tRef("autoplay_off")),
            '      </button>',
            '      <button type="button" onclick="window.ReferenceAdmin.prevVideo()" class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"><i class="fa-solid fa-backward-step mr-1"></i> ' + tRef("prev_vid") + '</button>',
            '      <button type="button" onclick="window.ReferenceAdmin.nextVideo()" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer">' + tRef("next_vid") + ' <i class="fa-solid fa-forward-step ml-1"></i></button>',
            '    </div>',
            '  </div>',

            '  <!-- 동영상 시어터 본체 (가운데 8칸: 메인 영상 플레이어 & 해설 / 우측 4칸: 동영상 썸네일 목록) -->',
            '  <div id="ref-yt-theater-box" class="ref-theater-shell bg-slate-950 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl border border-slate-800 text-white">',
            '    <div class="ref-theater-grid grid grid-cols-1 md:grid-cols-12 gap-6 items-start">',
            '      <!-- [가운데 메인 영역 (8칸)] 비디오 플레이어 및 설비 분석 해설 -->',
            '      <div class="ref-main-col md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-4">',
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
            '              <i class="fa-solid fa-microchip"></i> ' + tRef("vid_analysis") + '',
            '            </div>',
            '            <p id="ref-yt-active-desc" class="text-xs sm:text-sm text-slate-200 leading-relaxed">',
            '              ' + escapeHtml(activeVid.desc),
            '            </p>',
            '          </div>',
            '        </div>',
            '      </div>',

            '      <!-- [우측 영역 (4칸)] 동영상 썸네일 재생목록 사이드바 -->',
            '      <div class="ref-side-col md:col-span-5 lg:col-span-4 flex flex-col bg-slate-900/75 rounded-2xl border border-slate-800 overflow-hidden">',
            '        <div class="ref-side-header p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">',
            '          <div>',
            '            <h4 class="text-sm font-extrabold text-white flex items-center gap-2">',
            '              <i class="fa-solid fa-circle-play text-red-500"></i> 동영상 썸네일 목록',
            '            </h4>',
            '            <p class="text-[11px] text-slate-400 mt-0.5">' + tRef("vid_playlist_sub") + '</p>',
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

        var vEl = document.getElementById("ref-yt-main-video");
        if (vEl) { vEl.volume = 0.1; } // 초기 로드 기본 음량 10%
        bindVideoEndedEvent();
    }

    function bindVideoEndedEvent() {
        var videoEl = document.getElementById("ref-yt-main-video");
        if (videoEl) {
            videoEl.volume = 0.1;
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
            '      <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center flex-wrap gap-2.5">',
            '        <span>' + tRef("photo_theater_title") + '</span>',
            '        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">',
            '          <i class="fa-solid fa-camera text-xs"></i> ' + tRef("total_count_label", { count: currentPhotoList.length }),
            '        </span>',
            '      </h3>',
            '    </div>',
            '    <div class="flex flex-wrap items-center gap-2">',
            '      <button type="button" id="ref-photo-slideshow-btn" onclick="window.ReferenceAdmin.togglePhotoSlideshow()" class="px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ' + (isSlideshowRunning ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-300') + '">',
            '        <i class="fa-solid ' + (isSlideshowRunning ? 'fa-pause' : 'fa-play') + ' mr-1"></i> ' + (isSlideshowRunning ? tRef("slideshow_on") : tRef("slideshow_off")),
            '      </button>',
            '      <button type="button" onclick="window.ReferenceAdmin.prevPhoto()" class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"><i class="fa-solid fa-backward-step mr-1"></i> ' + tRef("prev_pho") + '</button>',
            '      <button type="button" onclick="window.ReferenceAdmin.nextPhoto()" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer">' + tRef("next_pho") + ' <i class="fa-solid fa-forward-step ml-1"></i></button>',
            '    </div>',
            '  </div>',

            '  <!-- 이미지 시어터 본체 (동영상과 동일한 2단 구조! 가운데 8칸: 메인 사진 & 분석 멘트 / 우측 4칸: 이미지 썸네일 목록) -->',
            '  <div id="ref-photo-theater-box" class="ref-theater-shell bg-slate-950 rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl border border-slate-800 text-white">',
            '    <div class="ref-theater-grid grid grid-cols-1 md:grid-cols-12 gap-6 items-start">',
            '      <!-- [가운데 메인 영역 (8칸)] 고화질 메인 이미지 뷰어 및 분석 해설 -->',
            '      <div class="ref-main-col md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-4">',
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
            '            <i class="fa-solid fa-expand"></i> ' + tRef("zoom_fullscreen") + '',
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
            '              <i class="fa-solid fa-magnifying-glass-chart"></i> ' + tRef("pho_analysis") + '',
            '            </div>',
            '            <p id="ref-photo-active-desc" class="text-xs sm:text-sm text-slate-200 leading-relaxed">',
            '              ' + escapeHtml(activePhoto.desc),
            '            </p>',
            '          </div>',
            '        </div>',
            '      </div>',

            '      <!-- [우측 영역 (4칸)] 이미지 썸네일 목록 사이드바 -->',
            '      <div class="ref-side-col md:col-span-5 lg:col-span-4 flex flex-col bg-slate-900/75 rounded-2xl border border-slate-800 overflow-hidden">',
            '        <div class="ref-side-header p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">',
            '          <div>',
            '            <h4 class="text-sm font-extrabold text-white flex items-center gap-2">',
            '              <i class="fa-solid fa-images text-cyan-400"></i> 이미지 썸네일 목록',
            '            </h4>',
            '            <p class="text-[11px] text-slate-400 mt-0.5">' + tRef("pho_playlist_sub") + '</p>',
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
    
    // ==========================================================================
    // 8-1. 레퍼런스 관리자 CRUD 모달 및 데이터 영구 보존 엔진
    // ==========================================================================
    var STORAGE_KEY_CUSTOM_REF = "ata_reference_gallery_db_v4";

    function loadCustomReferenceData() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY_CUSTOM_REF);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    FOLDER_ORDER.forEach(function (f) {
                        if (parsed[f]) {
                            REFERENCE_GALLERY_DB[f] = parsed[f];
                        }
                    });
                }
            }
        } catch (e) {
            console.warn("[ReferenceAdmin] 커스텀 데이터 로드 실패:", e);
        }
    }

    function saveCustomReferenceData() {
        try {
            localStorage.setItem(STORAGE_KEY_CUSTOM_REF, JSON.stringify(REFERENCE_GALLERY_DB));
            if (window.GithubSync && typeof window.GithubSync.syncAllToRemote === 'function') {
                window.GithubSync.syncAllToRemote("레퍼런스(실적) 관리자 항목 갱신");
            }
        } catch (e) {
            console.error("[ReferenceAdmin] 데이터 저장 실패:", e);
        }
    }

    // 관리자 상단 제어 바 렌더링
    function renderAdminControlBar() {
        var bar = document.getElementById("reference-admin-control-bar");
        if (bar) {
            bar.innerHTML = "";
            bar.style.display = "none";
        }
    }

    // ==========================================================================
    // 9. 관리자 전용 미디어 수정/추가 모달 시스템 (관리자 센터 연동)
    // ==========================================================================
    function ensureEditModalExists() {
        var existing = document.getElementById("ref-media-edit-modal");
        if (existing) return existing;

        var modal = document.createElement("div");
        modal.id = "ref-media-edit-modal";
        modal.className = "fixed inset-0 z-[10060] bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-3 sm:p-4 select-none";
        modal.innerHTML = [
            '<div class="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-800" onclick="event.stopPropagation()">',
            '  <!-- 모달 헤더 -->',
            '  <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">',
            '    <div class="flex items-center gap-2.5">',
            '      <span class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm shadow"><i class="fa-solid fa-pen-to-square"></i></span>',
            '      <h3 id="ref-modal-title" class="text-sm sm:text-base font-extrabold text-white">레퍼런스 미디어 항목 편집</h3>',
            '    </div>',
            '    <button type="button" onclick="window.ReferenceAdmin.closeEditModal()" class="text-slate-400 hover:text-white p-1 text-lg cursor-pointer"><i class="fa-solid fa-xmark"></i></button>',
            '  </div>',
            '  <!-- 모달 폼 본문 -->',
            '  <form id="ref-modal-form" onsubmit="window.ReferenceAdmin.handleFormSubmit(event)" class="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">',
            '    <input type="hidden" id="ref-form-mode" value="create">',
            '    <input type="hidden" id="ref-form-item-id" value="">',
            '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">',
            '      <div>',
            '        <label class="block font-bold text-slate-700 mb-1">대상 폴더 카테고리 <span class="text-rose-500">*</span></label>',
            '        <select id="ref-form-folder" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 text-xs">',
            '          <option value="전경">전경</option>',
            '          <option value="CBS">CBS</option>',
            '          <option value="NC CBS">NC CBS</option>',
            '          <option value="NBS">NBS</option>',
            '          <option value="Wheel Sorter">Wheel Sorter</option>',
            '          <option value="틸트트레이소터">틸트트레이소터</option>',
            '        </select>',
            '      </div>',
            '      <div>',
            '        <label class="block font-bold text-slate-700 mb-1">미디어 유형 <span class="text-rose-500">*</span></label>',
            '        <select id="ref-form-type" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 text-xs">',
            '          <option value="video">동영상 (MP4)</option>',
            '          <option value="photo">현장 사진 (JPG/PNG)</option>',
            '        </select>',
            '      </div>',
            '    </div>',
            '    <div>',
            '      <label class="block font-bold text-slate-700 mb-1">미디어 파일 경로 (src) <span class="text-rose-500">*</span></label>',
            '      <input type="text" id="ref-form-src" required placeholder="예: assets/reference/CBS/CBS (1).mp4" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500">',
            '    </div>',
            '    <div>',
            '      <label class="block font-bold text-slate-700 mb-1">썸네일 이미지 경로 (thumb)</label>',
            '      <input type="text" id="ref-form-thumb" placeholder="예: assets/reference/CBS/CBS (1).jpg" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500">',
            '    </div>',
            '    <div>',
            '      <label class="block font-bold text-slate-700 mb-1">미디어 제목 (Title) <span class="text-rose-500">*</span></label>',
            '      <input type="text" id="ref-form-title" required placeholder="현장 설비 명칭 및 공정 제목" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-blue-500">',
            '    </div>',
            '    <div>',
            '      <label class="block font-bold text-slate-700 mb-1">현장 엔지니어링 분석 해설 (Description) <span class="text-rose-500">*</span></label>',
            '      <textarea id="ref-form-desc" rows="3" required placeholder="설비의 주요 사양, 분류 속도, 현장 특장점 설명" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500"></textarea>',
            '    </div>',
            '    <div>',
            '      <label class="block font-bold text-slate-700 mb-1">검색 태그 (쉼표로 구분)</label>',
            '      <input type="text" id="ref-form-tags" placeholder="스마트 팩토리, 고속 분류, 풀필먼트" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500">',
            '    </div>',
            '    <!-- 하단 액션 버튼 -->',
            '    <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">',
            '      <button type="button" onclick="window.ReferenceAdmin.closeEditModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer">취소</button>',
            '      <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md cursor-pointer flex items-center gap-1.5"><i class="fa-solid fa-check"></i> 저장 완료</button>',
            '    </div>',
            '  </form>',
            '</div>'
        ].join("");

        modal.onclick = function (e) {
            if (e.target === modal) window.ReferenceAdmin.closeEditModal();
        };

        document.body.appendChild(modal);
        return modal;
    }

    function renderReferenceGallery(category) {
        loadCustomReferenceData();
        renderAdminControlBar();
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

        openCreateModal: function () {
            var modal = ensureEditModalExists();
            document.getElementById("ref-modal-title").textContent = "신규 레퍼런스 미디어 등록";
            document.getElementById("ref-form-mode").value = "create";
            document.getElementById("ref-form-item-id").value = "";
            document.getElementById("ref-form-folder").value = currentCategory === "all" ? "CBS" : currentCategory;
            document.getElementById("ref-form-type").value = "video";
            document.getElementById("ref-form-src").value = "";
            document.getElementById("ref-form-thumb").value = "";
            document.getElementById("ref-form-title").value = "";
            document.getElementById("ref-form-desc").value = "";
            document.getElementById("ref-form-tags").value = "";
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        },
        openEditModal: function (id) {
            var modal = ensureEditModalExists();
            var targetItem = null;
            var targetFolder = "";
            var targetType = "";

            FOLDER_ORDER.forEach(function (f) {
                var d = REFERENCE_GALLERY_DB[f];
                (d.videos || []).forEach(function (v) {
                    if (v.id === id) { targetItem = v; targetFolder = f; targetType = "video"; }
                });
                (d.photos || []).forEach(function (p) {
                    if (p.id === id) { targetItem = p; targetFolder = f; targetType = "photo"; }
                });
            });

            if (!targetItem) {
                alert("해당 항목을 찾을 수 없습니다.");
                return;
            }

            document.getElementById("ref-modal-title").textContent = "레퍼런스 미디어 수정 (" + targetItem.clipCode + ")";
            document.getElementById("ref-form-mode").value = "edit";
            document.getElementById("ref-form-item-id").value = targetItem.id;
            document.getElementById("ref-form-folder").value = targetFolder;
            document.getElementById("ref-form-type").value = targetType;
            document.getElementById("ref-form-src").value = targetItem.src || "";
            document.getElementById("ref-form-thumb").value = targetItem.thumb || "";
            document.getElementById("ref-form-title").value = targetItem.title || "";
            document.getElementById("ref-form-desc").value = targetItem.desc || "";
            document.getElementById("ref-form-tags").value = (targetItem.tags || []).join(", ");
            modal.classList.remove("hidden");
            modal.classList.add("flex");
        },
        closeEditModal: function () {
            var modal = document.getElementById("ref-media-edit-modal");
            if (modal) {
                modal.classList.add("hidden");
                modal.classList.remove("flex");
            }
        },
        handleFormSubmit: function (e) {
            if (e && e.preventDefault) e.preventDefault();
            var mode = document.getElementById("ref-form-mode").value;
            var id = document.getElementById("ref-form-item-id").value;
            var folder = document.getElementById("ref-form-folder").value;
            var type = document.getElementById("ref-form-type").value;
            var src = document.getElementById("ref-form-src").value.trim();
            var thumb = document.getElementById("ref-form-thumb").value.trim() || src;
            var title = document.getElementById("ref-form-title").value.trim();
            var desc = document.getElementById("ref-form-desc").value.trim();
            var tags = document.getElementById("ref-form-tags").value.split(",").map(function (s) { return s.trim(); }).filter(Boolean);

            var folderData = REFERENCE_GALLERY_DB[folder];
            if (!folderData) return;

            if (mode === "create") {
                var list = (type === "video") ? (folderData.videos = folderData.videos || []) : (folderData.photos = folderData.photos || []);
                var newIndex = list.length + 1;
                var newItem = {
                    id: folder + "-" + (type === "video" ? "vid" : "pho") + "-" + Date.now(),
                    folder: folder,
                    index: newIndex,
                    fileName: src.split("/").pop(),
                    src: src,
                    thumb: thumb,
                    fallbackSrc: src,
                    fallbackThumb: thumb,
                    clipCode: folder + " " + (type === "video" ? "영상" : "현장포토") + " #" + String(newIndex).padStart(2, "0"),
                    title: title,
                    desc: desc,
                    tags: tags
                };
                list.push(newItem);
                if (type === "video") folderData.videoCount = list.length;
                else folderData.photoCount = list.length;
            } else {
                var found = false;
                ["videos", "photos"].forEach(function (listKey) {
                    (folderData[listKey] || []).forEach(function (item) {
                        if (item.id === id) {
                            item.src = src;
                            item.thumb = thumb;
                            item.title = title;
                            item.desc = desc;
                            item.tags = tags;
                            found = true;
                        }
                    });
                });
            }

            saveCustomReferenceData();
            this.closeEditModal();
            renderReferenceGallery(folder);
            alert("레퍼런스 항목이 성공적으로 저장되었습니다!");
        },
        deleteCard: function (id) {
            if (!confirm("선택한 레퍼런스 항목을 삭제하시겠습니까?")) return;
            var deleted = false;
            FOLDER_ORDER.forEach(function (f) {
                var d = REFERENCE_GALLERY_DB[f];
                if (d.videos) {
                    var vLen = d.videos.length;
                    d.videos = d.videos.filter(function (v) { return v.id !== id; });
                    if (d.videos.length !== vLen) { d.videoCount = d.videos.length; deleted = true; }
                }
                if (d.photos) {
                    var pLen = d.photos.length;
                    d.photos = d.photos.filter(function (p) { return p.id !== id; });
                    if (d.photos.length !== pLen) { d.photoCount = d.photos.length; deleted = true; }
                }
            });
            if (deleted) {
                saveCustomReferenceData();
                renderReferenceGallery(currentCategory);
                alert("항목이 정상적으로 삭제되었습니다.");
            }
        },
        exportJson: function () {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(REFERENCE_GALLERY_DB, null, 2));
            var a = document.createElement("a");
            a.setAttribute("href", dataStr);
            a.setAttribute("download", "ata_reference_backup_" + Date.now() + ".json");
            document.body.appendChild(a);
            a.click();
            a.remove();
        },
        importJson: function () {
            var input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = function (e) {
                var file = e.target.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function (evt) {
                    try {
                        var parsed = JSON.parse(evt.target.result);
                        if (parsed && typeof parsed === "object") {
                            FOLDER_ORDER.forEach(function (f) {
                                if (parsed[f]) REFERENCE_GALLERY_DB[f] = parsed[f];
                            });
                            saveCustomReferenceData();
                            renderReferenceGallery("all");
                            alert("레퍼런스 데이터가 성공적으로 복원되었습니다!");
                        }
                    } catch (err) {
                        alert("올바르지 않은 JSON 파일입니다.");
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        },
        resetToDefault: function () {
            if (confirm("모든 커스텀 레퍼런스 설정을 초기화하고 기본 데이터로 되돌리시겠습니까?")) {
                localStorage.removeItem(STORAGE_KEY_CUSTOM_REF);
                location.reload();
            }
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
