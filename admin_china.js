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
        // ==========================================================================
    // 한중합자법인 전용 4개국어(ko, en, zh, ja) 완벽 번역 사전
    // ==========================================================================
    var CHINA_I18N = {
        ui: {
            badge_coop_prefix: { ko: "핵심 협력", en: "Core Coop", zh: "核心合作", ja: "中核協業" },
            exclusive_tech_alliance: { ko: "독점 기술 제휴", en: "Exclusive Tech Alliance", zh: "独家技术联盟", ja: "独占技術提携" },
            core_synergy_title: { ko: "핵심 시너지 & 협력 성과", en: "Core Synergy & Outcomes", zh: "核心协同与合作成果", ja: "中核シナジー・協力成果" },
            supply_chain_label: { ko: "한·중 합자 파트너십 독점 공급망", en: "Korea-China JV Exclusive Supply Chain", zh: "中韩合资战略专属供应链", ja: "韓中合弁パートナーシップ独占サプライチェーン" },
            view_full_image: { ko: "원본 크게 보기", en: "View Full Resolution", zh: "查看高清原图", ja: "原寸大で拡大表示" },
            partner_title_tag: { ko: "ATA TECH × GLOBAL OEM", en: "ATA TECH × GLOBAL OEM", zh: "ATA TECH × GLOBAL OEM", ja: "ATA TECH × GLOBAL OEM" },
            annual_capa_label: { ko: "연간 양산 케파 5,000+ 세트", en: "Annual Capacity 5,000+ Sets", zh: "年产能 5,000+ 套", ja: "年間量産キャパ 5,000+ セット" },
            smart_factory_badge: { ko: "스마트 팩토리", en: "Smart Factory", zh: "智能超级工厂", ja: "スマートファクトリー" }
        },
        items: {
            // [3대 상호협력 및 기술제휴]
            china_coop_1: {
                badge: { ko: "핵심 협력 01", en: "Core Coop 01", zh: "核心合作 01", ja: "中核協業 01" },
                title: { ko: "하드웨어-소프트웨어 융합 R&D", en: "HW & SW Fusion Co-development", zh: "软硬件融合联合研发 (R&D)", ja: "ハード・ソフト融合 R&D" },
                subtitle: { ko: "HW & SW Fusion Co-development", en: "Next-gen Autonomous Robotics & WCS Integration", zh: "下一代自主物流机器人与WCS智能集成", ja: "次世代自律型物流ロボティクス＆WCS統合" },
                description: {
                    ko: "제조사의 정밀 하드웨어 제조 역량과 (주)에이티에이기술의 지능형 WCS(창고제어시스템) 및 머신비전 제어 소프트웨어를 완벽하게 일체화하였습니다.\n설비 기구 설계 단계부터 제어 보드 펌웨어를 공동 최적화하여 현장 통신 딜레이를 0.001초 미만으로 단축하고, 다기종 복합 설비 간의 실시간 연동 성능을 극대화합니다.",
                    en: "Perfect integration of the manufacturer's precision hardware manufacturing capabilities with ATA Technology's intelligent WCS and machine vision control software.\nJoint firmware optimization from mechanical design reduces field latency below 0.001s, maximizing multi-equipment synchronization.",
                    zh: "将制造厂商的高精度硬件制造实力与ATA智能WCS（仓库控制系统）及机器视觉软件深度融合。\n从机械机构设计初期即联合优化控制板固件，将现场通信延迟缩短至0.001秒以内，最大化提升多机型复合设备的实时联动性能。",
                    ja: "製造メーカーの高精度ハードウェア製造力とATAテクノロジーの知能型WCSおよびマシンビジョン制御ソフトウェアを完全統合。\n機械設計段階から制御ボードファームウェアを共同最適化し、現場通信遅延を0.001秒未満に短縮、複数設備のリアルタイム連動性能を極大化します。"
                },
                features: {
                    ko: [
                        "한·중 공동 연구진 연간 24회 교차 기술 워크숍 진행",
                        "국내 환경에 특화된 한국형 WCS 표준 통신 프로토콜 내장",
                        "예지보전 IoT 센서 및 실시간 설비 진단 알고리즘 일체화"
                    ],
                    en: [
                        "24 bi-national joint technical workshops held annually",
                        "Embedded standard communication protocol tailored to Korea's logistics environment",
                        "Integrated predictive maintenance IoT sensors and real-time equipment diagnosis algorithms"
                    ],
                    zh: [
                        "中韩联合研发团队每年举办24次交叉技术研讨会",
                        "内置专为韩国本土物流环境定制的标准WCS通信协议",
                        "深度融合预测性维护IoT传感器与设备实时状态诊断算法"
                    ],
                    ja: [
                        "韓中共同研究チームによる年間24回の技術交流ワークショップ開催",
                        "国内環境に特化した標準WCS通信プロトコルを内蔵",
                        "予知保全IoTセンサーおよびリアルタイム設備診断アルゴリズムを一体化"
                    ]
                }
            },
            china_coop_2: {
                badge: { ko: "핵심 협력 02", en: "Core Coop 02", zh: "核心合作 02", ja: "中核協業 02" },
                title: { ko: "국내 대형 풀필먼트 공동 수주 및 구축", en: "Mega Fulfillment Joint Project Execution", zh: "大型履约中心联合承揽与工程落地", ja: "大型フルフィルメント共同受注および構築" },
                subtitle: { ko: "Mega Fulfillment Joint Project Execution", en: "High-speed Turnkey Delivery & Mega Scale Assembly", zh: "高速交钥匙全流程交付与超大规模量产组装", ja: "高速ターンキー納品およびメガスケール組立" },
                description: {
                    ko: "국내 굴지의 이커머스 메가 풀필먼트 센터 및 택배 간선 허브 터미널을 대상으로, 대량 설비 공급과 초고속 턴키 구축을 성공적으로 수행하고 있습니다.\n중국 대량 양산 클러스터를 통해 납기를 40% 이상 단축하고, 가격 경쟁력과 최고 등급의 기계적 내구성을 동시에 고객사에 제공합니다.",
                    en: "Successfully executing turnkey deployment and bulk equipment supply for leading domestic e-commerce fulfillment centers and parcel hub terminals.\nOur mass-production cluster cuts lead times by over 40%, delivering unmatched cost efficiency and industrial-grade durability.",
                    zh: "面向韩国头部电商超级履约中心及快递干线枢纽分拨中心，高效执行大规模设备供应与交钥匙交接落地。\n依托中国大规模量产制造产业集群，将设备交期缩短40%以上，同时为客户提供极具竞争力的价格优势与最高级别的机械耐久性。",
                    ja: "大手Eコマースのメガフルフィルメントセンターおよび宅配幹線ハブターミナル向けに、大量設備供給と超高速ターンキー構築を成功裏に遂行。\n中国の大量量産クラスターにより納期を40%以上短縮し、優れた価格競争力と最高等級의 機械的耐久性を同時に実現します。"
                },
                features: {
                    ko: [
                        "시간당 20,000+ 개 화물 연속 고속 분류 크로스벨트 소터 라인 구축",
                        "원가 절감 효과를 바탕으로 고객사 투자대비회수(ROI) 1.5년 단축",
                        "설계, 제작, 운송, 현장 설치 및 커미셔닝 전 공정 턴키 완벽 수행"
                    ],
                    en: [
                        "Constructed high-speed cross-belt sorter line processing 20,000+ items/hr",
                        "Cost reduction accelerating customer ROI recovery by 1.5 years",
                        "Full turnkey execution: design, fabrication, logistics, on-site installation, and commissioning"
                    ],
                    zh: [
                        "成功打造每小时连续处理20,000+件货物的超高速交叉带分拣线",
                        "基于强大的成本控制优势，帮助客户投资回报周期(ROI)缩短1.5年",
                        "设计、生产、国际物流、现场安装与联合调试全生命周期交钥匙交付"
                    ],
                    ja: [
                        "毎時20,000個以上の連続高速仕分けクロスベルトソーターラインを構築",
                        "原価低減効果により顧客の投資回収期間(ROI)を1.5年短縮",
                        "設計、製作、輸送、現場設置および試運転の全工程を完全ターンキー遂行"
                    ]
                }
            },
            china_coop_3: {
                badge: { ko: "핵심 협력 03", en: "Core Coop 03", zh: "核心合作 03", ja: "中核協業 03" },
                title: { ko: "국내 전용 기술지원 및 A/S 센터 운영", en: "Dedicated Korea Technical Service & Spare Parts Center", zh: "本土化专属技术支持与售后服务(A/S)中心", ja: "国内専用技術サポートおよびA/S센터運営" },
                subtitle: { ko: "Dedicated Korea Technical Service & Spare Parts Center", en: "24/7 Rapid Response, Certified Engineers & Local Stock", zh: "24/7极速应急响应、原厂认证工程师与本土核心备件库", ja: "24/7迅速対応、認定エンジニア常駐＆国内予備部品完備" },
                description: {
                    ko: "(주)에이티에이기술 본사 및 국내 거점에 제조사 공식 인증 엔지니어가 상주하는 24/7 긴급 출동 기술지원 센터와 전용 예비 부품 창고를 운영합니다.\n모든 핵심 예비 부품을 국내에 항시 비축하여 외산 설비의 고질적 문제인 부품 수급 지연을 원천 차단하고, 2시간 이내 현장 출동 대응 체계를 가동합니다.",
                    en: "Operating a 24/7 emergency technical response center and dedicated spare parts warehouse staffed by certified engineers at ATA headquarters and domestic sites.\nEliminates import supply chain delays by stockpiling 100% of critical components domestically, with under-2-hour on-site dispatch.",
                    zh: "在ATA总部及韩国本土核心据点，设立制造厂商官方认证工程师常驻的24/7应急技术支持中心与专属备品备件库。\n所有核心易损件与关键组件100%在韩常态化储备，彻底根除海外设备备件周期长的痛点，建立2小时内现场到达的极速响应机制。",
                    ja: "ATA本社および国内拠点にメーカー公認エンジニアが常駐する24/7緊急出動技術サポートセンターと専用予備部品倉庫を運営。\nすべての核心予備部品を国内に常時備蓄し、海外設備の課題である部品供給遅延を未然に防ぎ、2時間以内の現場到着体制を確立。"
                },
                features: {
                    ko: [
                        "국내 전용 정품 예비 부품 100% 상시 비축 물류센터 운영",
                        "제조사 파견 수석 엔지니어 및 ATA 전문 기술팀 연계 24시간 핫라인",
                        "정기 무상 예방점검 및 분기별 펌웨어 무상 업그레이드 제공"
                    ],
                    en: [
                        "100% genuine spare parts stocked continuously in Korea logistics hub",
                        "24/7 hotline connecting manufacturer chief engineers and ATA specialists",
                        "Regular preventative maintenance and quarterly complimentary firmware upgrades"
                    ],
                    zh: [
                        "建立韩国本土专属正品关键备品备件100%常态化储备中心",
                        "原厂派驻资深首席工程师与ATA技术专家无缝联动的24小时响应专线",
                        "提供定期免费预防性巡检维保与每季度固件控制算法免费升级服务"
                    ],
                    ja: [
                        "国内専用の純正予備部品を100%常時備蓄する物流拠点を運営",
                        "メーカー派遣の首席エンジニアとATA専門チームが連携した24時間ホットライン",
                        "定期無料予防点検および四半期ごとの無償ファームウェアアップデート提供"
                    ]
                }
            },

            // [글로벌 거점 및 제조설비]
            china_fac_hq: {
                badge: { ko: "R&D 본사", en: "Global R&D HQ", zh: "全球研发总部", ja: "R&D本社" },
                title: { ko: "글로벌 R&D 센터 및 본사 통합 시험동", en: "Global R&D Headquarters & Integration Test Tower", zh: "全球R&D研发中心暨总部综合测试塔", ja: "グローバルR&Dセンター＆本社総合試験棟" },
                subtitle: { ko: "Global R&D Headquarters & Integration Test Tower", en: "Global R&D Headquarters & Integration Test Tower", zh: "高标准智能穿梭车30米测试塔与全尺寸循环试验线", ja: "知能型シャトル30mテストタワー＆実物大ループ試験ライン" },
                description: {
                    ko: "120여 명의 로봇공학 및 기계제어 석·박사 연구진이 상주하는 글로벌 R&D 본부입니다. 30m 높이의 지능형 셔틀 테스트 타워와 실물 크기 크로스벨트 루프 테스트베드를 상시 가동하여 극한 환경에서의 신뢰성을 검증합니다.",
                    en: "Global R&D headquarters with 120+ robotics and control specialists. Operating a 30m shuttle test tower and full-scale cross-belt loop testbed.",
                    zh: "汇聚120余位机器人工程与电气控制硕博研发团队的全球研发总部。常态化运行30米高智能穿梭车测试塔与全尺寸交叉带循环实验线，验证极限工况下的工业可靠性。",
                    ja: "120名余りのロボット工学および機械制御専門研究陣が常駐するグローバルR&D本部。30m高の知能型シャトルテストタワーと実物大ループ試験場を常時稼働。"
                },
                features: {
                    ko: [
                        "120+ 석·박사급 스마트 물류 하드웨어 & 로보틱스 전담 연구진",
                        "실제 현장과 동일한 1:1 고속 루프 분류 테스트 라인 운영",
                        "연간 50건 이상의 신규 메커니즘 국제 특허 출원 인큐베이터"
                    ],
                    en: [
                        "120+ dedicated masters & PhD smart logistics robotics engineers",
                        "Operating 1:1 scale high-speed loop sorting verification lines",
                        "Incubator filing over 50 international patents annually"
                    ],
                    zh: [
                        "120+名硕博级智慧物流硬件与机器人核心研发梯队",
                        "建设与实际工况1:1完全一致的高速闭环分拣验证测试线",
                        "年均申请50项以上新型机械机构国际专利的技术孵化中心"
                    ],
                    ja: [
                        "120名以上の修士・博士クラススマート物流ハード＆ロボティクス専任研究員",
                        "実際の現場と同一の1:1高速ループ仕分けテストラインを運営",
                        "年間50件以上の新規メカニズム国際特許を出願するインキュベーター"
                    ]
                }
            },
            china_fac_smart1: {
                badge: { ko: "제1 스마트공장", en: "Smart Factory #1", zh: "第一智能超级工厂", ja: "第1スマート工場" },
                title: { ko: "제1 스마트 제조 메가 팩토리 (첨단 기구가공)", en: "Smart Mega Factory #1 (Precision CNC & Machining)", zh: "第一智能制造超级工厂（高端机械精密加工）", ja: "第1スマート製造メガファクトリー（先端機構加工）" },
                subtitle: { ko: "Smart Mega Factory #1 (Precision CNC & Machining)", en: "Smart Mega Factory #1 (Precision CNC & Machining)", zh: "五轴高精CNC切削中心与自动化机器人焊接线", ja: "5軸超精密CNC切削センター＆ロボット自動溶接ライン" },
                description: {
                    ko: "20,000㎡ 부지에 독일 및 일본산 초정밀 5축 CNC 머시닝 센터와 레이저 자동 절단·절곡 라인을 완비한 제1 제조공장입니다. 소터 프레임과 고정밀 구동 롤러 등 핵심 기구 부품을 오차 0.01mm 이내로 가공 양산합니다.",
                    en: "Precision manufacturing factory on a 20,000㎡ site with German/Japanese 5-axis CNC machining centers and laser cutting lines, fabricating parts within 0.01mm tolerance.",
                    zh: "占地20,000㎡，配备德国及日本超精密五轴CNC加工中心与全自动激光下料折弯线。分拣机机架与核心精密传动部件加工公差严格控制在0.01mm以内。",
                    ja: "20,000㎡의 敷지에 독일・일본산 초정밀 5축 CNC 머시닝 센터와 레이저 자동 절단·절곡 라인을 완비한 제1 제조공장입니다. 소터 프레임과 고정밀 구동 롤러 등 핵심 기구 부품을 오차 0.01mm 이내로 가공 양산합니다."
                },
                features: {
                    ko: [
                        "초정밀 5축 CNC 머시닝 센터 40대 연속 풀가동",
                        "로봇 자동화 용접 라인 구축으로 프레임 뒤틀림 0% 달성",
                        "연간 3,000+ 세트 고속 소터 기구 프레임 양산 능력 확보"
                    ],
                    en: [
                        "40 units of precision 5-axis CNC centers running continuously",
                        "Robotic automated welding lines achieving zero frame distortion",
                        "Secured annual mass production capacity for 3,000+ high-speed sorter frames"
                    ],
                    zh: [
                        "40台高精密五轴CNC加工中心连续满负荷精密作业",
                        "全线引入工业机器人自动焊接系统，实现机械机架零变形",
                        "具备年产3,000+套高速分拣机精密结构件的规模化量产能力"
                    ],
                    ja: [
                        "超精密5軸CNCマシニングセンタ40台を連続フル稼働",
                        "ロボット自動溶接ラインの構築によりフレームの歪み0%を達成",
                        "年間3,000セット以上の高速ソーター機構フレーム量산능력을 확보"
                    ]
                }
            },
            china_fac_smart2: {
                badge: { ko: "제2 스마트공장", en: "Smart Factory #2", zh: "第二智能超级工厂", ja: "第2スマート工場" },
                title: { ko: "제2 스마트 제조 메가 팩토리 (SMT·로봇조립)", en: "Smart Mega Factory #2 (SMT & Robot Assembly)", zh: "第二智能制造超级工厂（SMT贴片与机器人总装）", ja: "第2スマート製造メガファクトリー（SMT・ロボット組立）" },
                subtitle: { ko: "Smart Mega Factory #2 (SMT & Robot Assembly)", en: "Smart Mega Factory #2 (SMT & Robot Assembly)", zh: "万级无尘SMT电子产线与AMR无人叉车柔性总装线", ja: "Class 10,000クリーンSMTライン＆AMR無人フォーク総組立" },
                description: {
                    ko: "클래스 10,000 클린룸 SMT 전자 생산 라인과 AGV/AMR 로봇 무인 자율주행 최종 조립 라인을 갖춘 제2 스마트 팩토리입니다. 메인보드 표면실장부터 광학 센서 캘리브레이션까지 전 공정 스마트 품질 검사를 통과합니다.",
                    en: "Class 10,000 cleanroom SMT production line and AGV/AMR automated assembly line, with smart quality inspection from PCB surface mounting to optical calibration.",
                    zh: "配备万级无尘室SMT表面贴片电子产线与AGV/AMR自主机器人整机柔性装配线。从主板贴片到光学传感器标定均通过数字化全检。",
                    ja: "Class 10,000クリーンルームSMT生産ラインとAGV/AMR無人自律搬送ロボット의 최종 조립 라인을 갖춘 제2 스마트 팩토리입니다. 전 공정 스마트 품질 검사를 통과합니다."
                },
                features: {
                    ko: [
                        "클래스 10,000 클린룸 SMT 고속 표면실장 라인 가동",
                        "AGV/AMR 연간 2,000+ 대 규모 유연 조립 라인 구축",
                        "출고 전 72시간 무중단 번인(Burn-in) 자율주행 에이징 테스트"
                    ],
                    en: [
                        "Operating Class 10,000 cleanroom high-speed SMT lines",
                        "Flexible assembly line with 2,000+ annual AGV/AMR capacity",
                        "72-hour continuous burn-in autonomous navigation aging test prior to dispatch"
                    ],
                    zh: [
                        "投产万级洁净度SMT高速自动化贴片生产线",
                        "具备年产2,000+台AGV/AMR智能机器人的柔性总装线",
                        "出厂前必须通过72小时不间断全负载自主运行老化极限测试"
                    ],
                    ja: [
                        "Class 10,000クリーンルームSMT高速表面実装ラインを稼働",
                        "AGV/AMR年間2,000대 규모의 유연 조립 라인 구축",
                        "출고 전 72시간 무중단 번인 자율주행 에이징 테스트"
                    ]
                }
            }
        }
    };

    /**
     * 현재 사이트 언어 코드 조회 ('ko' | 'en' | 'zh' | 'ja')
     */
    function getLang() {
        var l = window.currentLanguage || 'ko';
        if (l === 'cn') l = 'zh';
        if (!CHINA_I18N || !CHINA_I18N.items) return 'ko';
        return l;
    }

    /**
     * UI 공통 레이블 다국어 조회
     */
    function i18nUI(key) {
        var l = getLang();
        if (CHINA_I18N.ui[key] && CHINA_I18N.ui[key][l]) {
            return CHINA_I18N.ui[key][l];
        }
        return (CHINA_I18N.ui[key] && CHINA_I18N.ui[key].ko) ? CHINA_I18N.ui[key].ko : '';
    }

    /**
     * 아이템별 필드 다국어 조회
     */
    function i18nItem(id, field, fallback) {
        var l = getLang();
        // [Fix 4] 한국어('ko') 모드에서는 사용자가 관리자 모드에서 수정한 최신 데이터(fallback)를 1순위로 즉각 반영!
        if (l === 'ko') {
            return (fallback !== undefined && fallback !== null && fallback !== '') ? fallback : '';
        }
        var itemMap = CHINA_I18N.items[id];
        if (itemMap && itemMap[field] && itemMap[field][l]) {
            return itemMap[field][l];
        }
        return fallback;
    }

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
     * [3대 상호협력 및 기술제휴] 상하 수직형 클린 카드 (가로 100% 풀 와이드 텍스트 + 빈 공간 완전 제거)
     */
    function renderCoopSection(items) {
        var container = document.getElementById('china-coop-cards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var curLang = getLang();
        var isEn = curLang === 'en';

        var html = [];
        items.forEach(function (it, idx) {
            var numStr = it.sortOrder ? (it.sortOrder < 10 ? '0' + it.sortOrder : it.sortOrder) : (idx + 1 < 10 ? '0' + (idx + 1) : idx + 1);

            // 다국어 텍스트 안전 조회
            var title = i18nItem(it.id, 'title', it.title);
            var subtitle = i18nItem(it.id, 'subtitle', it.subtitle || '');
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);
            var badgeText = i18nItem(it.id, 'badge', (i18nUI('badge_coop_prefix') + ' ' + numStr));

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group fade-in appear overflow-hidden">');

            html.push('  <div>');

            // 1. 상단 인포그래픽 썸네일 (16:9 비율로 안정감 있게 꽉 채움)
            if (it.imageUrl) {
                html.push('    <div class="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 relative group/img cursor-pointer border border-slate-200 shadow-inner flex items-center justify-center mb-5" onclick="window.openImageModal ? window.openImageModal(\'' + it.imageUrl + '\', \'' + title.replace(/'/g, "\\'") + '\') : window.open(\'' + it.imageUrl + '\', \'_blank\')">');
                html.push('      <img src="' + it.imageUrl + '" alt="' + title + '" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('      <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">');
                html.push('        <i class="fa-solid fa-magnifying-glass-plus text-cyan-400"></i> ' + i18nUI('view_full_image'));
                html.push('      </div>');
                html.push('    </div>');
            }

            // 2. 상단 배지 바
            html.push('    <div class="flex items-center gap-2 mb-3 flex-wrap">');
            html.push('      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" data-i18n="' + it.id + '_badge">');
            html.push('        <i class="fa-solid fa-handshake text-blue-600"></i> ' + badgeText);
            html.push('      </span>');
            html.push('      <span class="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200" data-i18n="china_exclusive_alliance">' + i18nUI('exclusive_tech_alliance') + '</span>');
            html.push('    </div>');

            // 3. 협력사업 명칭 (가로 100% 온전히 사용 - 절대 글씨가 쪼개지지 않음)
            html.push('    <h3 class="text-lg sm:text-xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors leading-snug break-words [overflow-wrap:anywhere]" data-i18n="' + it.id + '_title">' + title + '</h3>');
            if (subtitle && !isEn) {
                html.push('    <p class="text-xs font-semibold text-slate-400 mb-3 tracking-wide break-words [overflow-wrap:anywhere]" data-i18n="' + it.id + '_subtitle">' + subtitle + '</p>');
            }

            // 4. 상세 설명란 (가로 100% 전체 사용으로 넉넉하고 편안한 읽기)
            html.push('    <p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 whitespace-pre-line break-words [overflow-wrap:anywhere]" data-i18n="' + it.id + '_desc">' + description + '</p>');

            // 5. 핵심 성과 및 제휴 시너지 박스 (하단 빈 공간을 꽉 채워 균형 완성)
            if (features && features.length > 0) {
                html.push('    <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 mb-4">');
                html.push('      <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-blue-600"></i> ' + i18nUI('core_synergy_title') + '</div>');
                features.forEach(function (f, fIdx) {
                    html.push('      <div class="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">');
                    html.push('        <i class="fa-solid fa-check text-blue-600 text-xs mt-0.5 shrink-0"></i>');
                    html.push('        <span class="break-words [overflow-wrap:anywhere]" data-i18n="' + it.id + '_feat_' + (fIdx + 1) + '">' + f + '</span>');
                    html.push('      </div>');
                });
                html.push('    </div>');
            }

            html.push('  </div>');

            // 6. 하단 메타 바
            html.push('  <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">');
            html.push('    <span data-i18n="china_supply_chain_label">' + i18nUI('supply_chain_label') + '</span>');
            html.push('    <span class="font-bold text-blue-600">' + i18nUI('partner_title_tag') + '</span>');
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

        var curLang = getLang();
        var isEn = curLang === 'en';

        var html = [];
        items.forEach(function (it, idx) {
            var numStr = it.sortOrder ? (it.sortOrder < 10 ? '0' + it.sortOrder : it.sortOrder) : (idx + 1 < 10 ? '0' + (idx + 1) : idx + 1);

            // 다국어 조회
            var title = i18nItem(it.id, 'title', it.title);
            var subtitle = i18nItem(it.id, 'subtitle', it.subtitle || '');
            var badgeText = i18nItem(it.id, 'badge', (it.badge || ('거점 ' + numStr)));
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);

            html.push('<div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group fade-in appear">');

            // 1. 아담한 썸네일 사진 (높이 180px 고정)
            if (it.imageUrl) {
                html.push('  <div class="h-48 sm:h-52 w-full bg-slate-100 relative overflow-hidden group/img cursor-pointer" onclick="window.openImageModal ? window.openImageModal(\'' + it.imageUrl + '\', \'' + title.replace(/'/g, "\\'") + '\') : window.open(\'' + it.imageUrl + '\', \'_blank\')">');
                html.push('    <img src="' + it.imageUrl + '" alt="' + title + '" class="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" onerror="this.src=\'assets/images/no-image.svg\';">');
                html.push('    <div class="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">' + badgeText + '</div>');
                html.push('    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px]">');
                html.push('      <i class="fa-solid fa-magnifying-glass-plus text-cyan-400"></i> ' + i18nUI('view_full_image'));
                html.push('    </div>');
                html.push('  </div>');
            }

            // 2. 하단 글씨 공간
            html.push('  <div class="p-6 sm:p-7 space-y-3">');
            html.push('    <h4 class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug break-words [overflow-wrap:anywhere]">' + title + '</h4>');
            if (subtitle && !isEn) {
                html.push('    <p class="text-xs font-semibold text-slate-400 break-words [overflow-wrap:anywhere]">' + subtitle + '</p>');
            }
            html.push('    <p class="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words [overflow-wrap:anywhere]">' + description + '</p>');

            if (features && features.length > 0) {
                html.push('    <div class="space-y-1.5 pt-2 border-t border-slate-100">');
                features.forEach(function (f) {
                    html.push('        <div class="flex items-center gap-2 text-xs text-slate-700"><i class="fa-solid fa-check text-blue-600 text-[10px]"></i><span class="break-words [overflow-wrap:anywhere]">' + f + '</span></div>');
                });
                html.push('    </div>');
            }
            html.push('  </div>');

            html.push('  <div class="px-6 pb-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-auto pt-3">');
            html.push('    <span>' + i18nUI('annual_capa_label') + '</span>');
            html.push('    <span class="text-blue-600 font-bold">' + i18nUI('smart_factory_badge') + '</span>');
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

    // 언어 변경 리스너 연동 (다국어 실시간 동기화)
    window.addEventListener('languageChanged', function () {
        renderFrontend();
    });

    // 초기 실행
    document.addEventListener('DOMContentLoaded', function () {
        renderFrontend();
    });

})();
