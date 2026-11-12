/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 특허 및 인증 관리자 모드 CRUD & 실시간 렌더링 엔진 (admin_patent.js)
 * 
 * [2026 완성형 리디자인]
 * 1. 특허 현황 카드: 상하 수직 배치(가로 100% 풀 와이드 텍스트)로 글씨 세로 쪼개짐 100% 원천 차단!
 * 2. 양옆 시커먼 검은색 여백 완전 제거: A4 종이 비율 썸네일 & 클린 화이트 프레임
 * 3. 다국어(i18n: 한국어, 영어, 중국어, 일본어) 언어 변경 실시간 동기화 리스너 탑재
 * 4. 관리자 모드: 좌측 65% 대형 글자칸(10줄) + 우측 35% 콤팩트 문서 패널
 * ==============================================================================
 */

(function () {
    'use strict';

    var STORAGE_KEY_PATENT = "ata_patent_cert_db_v1";

    // ==========================================================================
    // 특허 및 인증 전용 4개국어(ko, en, zh, ja) 완벽 번역 사전
    // ==========================================================================
    var PATENT_I18N = {
        ui: {
            patent_badge: { ko: "등록특허", en: "Registered Patent", zh: "授权专利", ja: "登録特許" },
            patent_core_badge: { ko: "핵심원천특허", en: "Core Original Patent", zh: "核心原创专利", ja: "中核独自特許" },
            cert_badge: { ko: "품질·환경인증", en: "Quality Cert", zh: "质量与环境认证", ja: "品質・環境認証" },
            award_badge: { ko: "대외수상·수료", en: "Award & Honors", zh: "获奖荣誉与结业", ja: "受賞・修了歴" },
            mechanism_title: { ko: "핵심 메커니즘 & 원천 기술 경쟁력", en: "Core Mechanism & R&D Competitiveness", zh: "核心技术机制与独家研发优势", ja: "中核メカニズム＆独自技術競争力" },
            cert_features_title: { ko: "주요 인증 범위 & 품질 표준", en: "Certification Scope & Quality Standards", zh: "主要认证范围与质量管理标准", ja: "主要認証範囲＆品質管理基準" },
            award_features_title: { ko: "주요 공적 성과 & 기술 평가", en: "Key Achievements & Technical Evaluation", zh: "主要成果与技术评估", ja: "主要功績＆技術評価" },
            patent_copy_label: { ko: "대한민국 특허청 공인 사본", en: "Official KIPO Registered Copy", zh: "韩国特许厅官方公认证本", ja: "韓国特許庁公認謄本" },
            patent_exclusive_label: { ko: "특허법 제66조 독점 배타권 보유", en: "Exclusive Patent Rights (Article 66)", zh: "依据专利法第66条享有独家排他权", ja: "特許法第66条に基づく独占排他権保有" },
            org_kipo: { ko: "대한민국 특허청 (KIPO)", en: "KIPO (Korean Intellectual Property Office)", zh: "韩国特许厅 (KIPO)", ja: "韓国特許庁 (KIPO)" },
            reg_date: { ko: "등록일자", en: "Reg. Date", zh: "授权日期", ja: "登録日" },
            cert_no: { ko: "인증번호", en: "Cert No.", zh: "认证编号", ja: "認証番号" }
        },
        items: {
            // [1. 특허 4건]
            pat_1: {
                title: { ko: "차세대 택배차량 배송 자동화 시스템", en: "Next-Gen Delivery Vehicle Automation System", zh: "下一代厢式货车配送自动化系统", ja: "次世代配送バン配達自動化システム" },
                subtitle: { ko: "Smart Delivery Vehicle Automation System", en: "Smart Delivery Vehicle Automation System", zh: "智能厢式货车自动化配送系统", ja: "スマート配送車両自動化システム" },
                description: {
                    ko: "택배 배송 차량 내부의 적재함을 모듈화하여 목적지별 화물을 자동으로 이송하고 순차 배출하는 차세대 스마트 모빌리티 물류 특허입니다.\n화물 적재함의 슬라이딩 이송 메커니즘을 통해 상하차 작업자의 동선을 획기적으로 줄이며, 라스트마일 물류 현장의 작업 효율성을 극대화합니다.",
                    en: "A next-generation smart logistics mobility patent that modularizes the cargo compartment inside delivery vans to automatically convey and sequentially discharge cargo by destination.\nThe sliding conveyance mechanism drastically reduces worker movement and maximizes loading/unloading efficiency.",
                    zh: "通过对配送货车内部货厢进行模块化设计，实现按目的地自动移送并顺次排出货物的下一代智慧物流专利。\n滑动输送机构大幅缩短作业人员动线，全面提升末端配送装卸效率。",
                    ja: "配送バン内部の荷台をモジュール化し、配送先ごとの荷物を自動搬送して順次排出する次世代スマートモビリティ物流特許です。\nスライド搬送機構により作業者の動線を劇的に削減し、荷役作業の効率を最大化します。"
                },
                features: {
                    ko: [
                        "차량 내부 적재함 자동 이송 및 슬라이딩 배출 메커니즘",
                        "상하차 작업 시간 60% 이상 단축 및 배송 기사 근골격계 질환 예방",
                        "다양한 규격의 배송 차량(1톤/2.5톤/탑차) 맞춤형 커스텀 장착 지원"
                    ],
                    en: [
                        "Automated in-vehicle cargo conveyance & sliding discharge mechanism",
                        "Reduces loading/unloading time by over 60% and prevents musculoskeletal injury",
                        "Supports custom installation for various vehicle specifications (1T / 2.5T / Box trucks)"
                    ],
                    zh: [
                        "车厢内部装载物自动移送与滑动式分拣排出机械机构",
                        "缩减60%以上装卸工时，有效预防作业人员肌肉骨骼疾病",
                        "支持多种规格配送车辆（1吨/2.5吨/厢式货车）定制化安装"
                    ],
                    ja: [
                        "車両内部荷台の自動搬送およびスライド排出メカニズム",
                        "積み降ろし時間を60%以上短縮し作業者の身体的負荷を予防",
                        "多様な配送車両（1t/2.5t/バン）に合わせたカスタム搭載対応"
                    ]
                }
            },
            pat_2: {
                title: { ko: "인공지능 기반 스마트 체형 교정 및 유지 시스템", en: "AI-based Smart Body Posture Correction & Health System", zh: "基于人工智能的智能体型矫正与维持系统", ja: "人工知能基盤スマート体型矯正および維持システム" },
                subtitle: { ko: "AI-based Body Posture Correction & Health System", en: "AI-based Body Posture Correction & Health System", zh: "人工智能工作姿势追踪与健康系统", ja: "AI作業姿勢追跡・健康管理システム" },
                description: {
                    ko: "비전 AI 카메라 및 압력 센서를 결합하여 사용자의 작업 자세와 체형 밸런스를 실시간 추적하고 인체공학적 피드백을 제공하는 스마트 헬스케어 특허 기술입니다.\n물류센터 현장 근무자의 반복 작업 및 무거운 화물 리프팅 시 발생하는 척추·관절 하중을 예방합니다.",
                    en: "A smart healthcare patent technology combining vision AI cameras and pressure sensors to track worker posture and body balance in real time, delivering ergonomic feedback.\nPrevents spinal and joint strain during repetitive heavy lifting in logistics centers.",
                    zh: "结合视觉AI摄像头与压力传感器，实时追踪作业人员工作姿势与体态平衡，并提供人体工学反馈的智慧健康专利。\n有效预防物流中心重复搬运重物时造成的脊椎与关节劳损。",
                    ja: "ビジョンAIカメラと圧力センサーを融合し、作業姿勢と体型バランスをリアルタイム追跡して人間工学的フィードバックを提供するスマートヘルスケア特許です。\n物流現場の重量物運搬における脊椎・関節の負荷を防止します。"
                },
                features: {
                    ko: [
                        "물류 현장 작업자 작업 자세 및 위험 하중 실시간 AI 추적",
                        "신체 불균형 및 위험 작업 패턴 감지 시 즉각 경고 알림",
                        "작업 안전성 및 작업장 보건 관리 솔루션과 통합 연동"
                    ],
                    en: [
                        "Real-time AI tracking of worker posture and dangerous load points",
                        "Instant alert notification upon detecting body imbalance or hazardous motion",
                        "Seamless integration with workplace safety and occupational health systems"
                    ],
                    zh: [
                        "物流现场作业人员工作姿势与危险负荷实时AI智能追踪",
                        "监测到身体失衡或危险操作动作时即时发出警报提示",
                        "与作业安全管理系统及职业健康保障方案无缝协同"
                    ],
                    ja: [
                        "現場作業者の作業姿勢および危険荷重のリアルタイムAI追跡",
                        "身体バランスの崩れや危険動作検知時の即時警告通知",
                        "作業安全性および労働安全衛生管理システムとの統合連動"
                    ]
                }
            },
            pat_3: {
                title: { ko: "운송 차량 적재물 분류 및 이송 시스템", en: "Vehicle Cargo Sorting & Conveyance System", zh: "运输车辆装载物分拣及输送系统", ja: "運送車両積載物仕分けおよび移送システム" },
                subtitle: { ko: "Vehicle Cargo Sorting & Conveyance System", en: "Vehicle Cargo Sorting & Conveyance System", zh: "干线集装箱高速伸缩输送分拣系统", ja: "幹線トラック伸縮式仕分け搬送システム" },
                description: {
                    ko: "운송 트럭 및 컨테이너 내부 깊숙이 진입하여 화물의 크기, 무게, 바코드를 고속 인식하고 자동 분류하는 텔레스코픽 연동 이송 특허 시스템입니다.\n화물 유입 병목 구간을 해소하고 간선 하차 라인에서 끊김 없는 연속 분류 흐름을 완성합니다.",
                    en: "A patented telescopic conveyance system that penetrates deep into transport trucks and containers to recognize dimensions, weight, and barcodes for automated high-speed sortation.\nEliminates bottle-necks in line-haul unloading lines.",
                    zh: "深入货车及集装箱内部，高速识别货物尺寸、重量与条形码并实现自动分拣的伸缩联动专利系统。\n彻底消除干线卸货瓶颈，实现不间断连续分拣作业。",
                    ja: "トラックやコンテナ深部まで進入し、荷物のサイズ・重量・バーコードを高速認識して自動仕分けを行う伸縮連動搬送特許システムです。\n荷下ろし工程のボトルネックを解消し、連続仕分けフローを実現します。"
                },
                features: {
                    ko: [
                        "다열 컨베이어 기반 고속 화물 피치 제어 및 연속 이송",
                        "비정형 박스 및 연포장 폴리백 화물 걸림 방지 특수 벨트 설계",
                        "간선 하차 라인 병목 현상 완전 해소 및 시간당 4,000+ 개 연속 처리"
                    ],
                    en: [
                        "Multi-row conveyor based high-speed cargo pitch control & continuous conveyance",
                        "Special anti-jam belt design for irregular boxes and polybag packages",
                        "Completely resolves unloading bottlenecks with continuous capacity of 4,000+ PPH"
                    ],
                    zh: [
                        "基于多列输送机的高速货物间距精准控制与连续平稳输送",
                        "针对异形纸箱及软质快递袋防卡阻专用皮带结构设计",
                        "全面破解干线卸货堵塞，实现每小时4,000件以上持续高效吞吐"
                    ],
                    ja: [
                        "多列コンベヤ基盤の高速荷物ピッチ制御および連続搬送",
                        "異形ボックスや袋物の詰まりを防止する特殊ベルト設計",
                        "荷下ろしラインの滞留を完全解消し毎時4,000個以上を連続処理"
                    ]
                }
            },
            pat_4: {
                title: { ko: "컨베이어 물류 분류용 4분할 방향 전환 장치", en: "4-Way Diverting Apparatus for Conveyor Logistics Sortation", zh: "输送机物流分拣用四分割变向转向装置", ja: "コンベヤ物流仕分け用4分割方向転換装置" },
                subtitle: { ko: "4-Directional Transfer & Sorting Switch Device", en: "4-Directional Transfer & Sorting Switch Device", zh: "四分割独立驱动全方位转向分拣核心设备", ja: "4分割独立駆動ポップアップホイール方向転換装置" },
                description: {
                    ko: "(주)에이티에이기술의 대표 독자 원천 기술로, 4개의 팝업 휠 모듈이 독립 구동 및 360도 정밀 서보 각도 제어를 수행하여 화물의 충격을 최소화하면서 직진, 좌·우 90도 분기, 180도 회송을 즉각 수행하는 최첨단 고속 분류 분기 시스템입니다.",
                    en: "ATA Technology's flagship proprietary technology: 4 independent pop-up wheel modules with 360-degree precision servo angle control, executing straight-through, 90-degree lateral diverts, and 180-degree return with zero package shock.",
                    zh: "(株)ATA技术的标志性原创核心技术，4组独立驱动升降轮模块搭载360度精密伺服角度控制，以零冲击实现直行、左右90度高速分流及180度回送。",
                    ja: "株式会社ATA技術の代表的な独自中核技術であり、4組のポップアップホイールモジュールが独立駆動と360度精密サーボ制御を行い、衝撃なく直進・左右90度分岐・180度反転を瞬時に実行します。"
                },
                features: {
                    ko: [
                        "독립 제어 4분할 팝업 휠 기반 0.3초 초고속 분기 응답 속도",
                        "부드러운 화물 방향 전환으로 박스 및 파우치 파손율 0.00% 달성",
                        "기존 물류 라인에 표준 모듈 방식으로 즉시 인라인 삽입 가능"
                    ],
                    en: [
                        "0.3-second ultra-fast divert response based on independently controlled 4-way pop-up wheels",
                        "Achieves 0.00% damage rate for boxes and flexible polybags via gentle directional switching",
                        "Immediate in-line modular plug-in integration into existing conveyor sortation lines"
                    ],
                    zh: [
                        "基于独立控制四分割升降轮的0.3秒超高速分拣响应",
                        "平滑温和的转向机制使包装箱及袋装件破损率达0.00%",
                        "标准模块化结构，可即插即用嵌入现有输送分拣流水线"
                    ],
                    ja: [
                        "独立制御4分割ポップアップホイールによる0.3秒の超高速分岐応答",
                        "滑らかな方向転換により荷物破損率0.00%を達成",
                        "既存の物流ラインに標準モジュールとして即時インライン挿入可能"
                    ]
                }
            },

            // [2. 품질인증 5건]
            cert_iso_9001: {
                title: { ko: "ISO 9001:2015 품질경영시스템 인증", en: "ISO 9001:2015 Quality Management System", zh: "ISO 9001:2015 质量管理体系认证", ja: "ISO 9001:2015 品質マネジメントシステム認証" },
                description: {
                    ko: "물류 자동화 설비 기구 설계, 제어 소프트웨어 개발 및 현장 설치·시운전 전 공정에 대한 국제 품질 표준 적합성을 공인받았습니다.",
                    en: "Certified for compliance with international quality standards across all processes: automated logistics machinery design, control software development, installation, and commissioning.",
                    zh: "在物流自动化设备机构设计、控制软件开发及现场安装调试全流程中获得国际质量管理体系标准化权威认证。",
                    ja: "物流自動化設備の機構設計、制御ソフトウェア開発、据付・試運転の全工程において国際品質規格適合認証を取得。"
                },
                features: {
                    ko: ["국제 표준 규격 준수", "체계적 품질 보증 체계", "고객 만족도 극대화"],
                    en: ["International Standard Compliance", "Systematic QA Framework", "Maximized Customer Satisfaction"],
                    zh: ["严格遵循国际标准规范", "完备的系统化品质保证流程", "全面提升客户信赖与满意度"],
                    ja: ["国際標準規格の徹底遵守", "体系的な品質保証システムの確立", "顧客満足度の最大化"]
                }
            },
            cert_iso_14001: {
                title: { ko: "ISO 14001:2015 환경경영시스템 인증", en: "ISO 14001:2015 Environmental Management System", zh: "ISO 14001:2015 环境管理体系认证", ja: "ISO 14001:2015 環境マネジメントシステム認証" },
                description: {
                    ko: "친환경 고효율 스마트 물류 장비 개발과 제조 과정에서의 탄소 배출 저감, 지속 가능한 친환경 생산 가이드라인을 준수합니다.",
                    en: "Adheres to sustainable eco-friendly manufacturing guidelines and low-carbon operation for high-efficiency smart logistics machinery.",
                    zh: "在环保高效智能物流装备研发制造过程中严格践行节能减排与可持续绿色生产标准。",
                    ja: "環境配慮型高効率スマート物流機器の開発・製造過程における省エネ・低炭素化と持続可能な生産基準を遵守。"
                },
                features: {
                    ko: ["친환경 스마트 설계", "에너지 소비 절감 솔루션", "지속 가능한 제조 공정"],
                    en: ["Eco-friendly Smart Engineering", "Low Energy Consumption Solution", "Sustainable Manufacturing Process"],
                    zh: ["绿色环保智能化工程设计", "低功耗节能降耗解决方案", "可持续发展的标准化制造工艺"],
                    ja: ["環境配慮型スマート設計", "エネルギー消費削減ソリューション", "持続可能な製造プロセス"]
                }
            },
            cert_venture: {
                title: { ko: "혁신성장유형 벤처기업확인서", en: "Venture Enterprise Certification (Innovative Growth)", zh: "创新成长型风险企业认证", ja: "ベンチャー企業確認書（革新成長型）" },
                description: {
                    ko: "기술보증기금 및 벤처기업협회로부터 독자적인 물류 메카트로닉스 원천 기술력과 글로벌 시장 성장 잠재력을 공식 공인받았습니다.",
                    en: "Officially certified by KIBO and KOVA for proprietary logistics mechatronics technology and global growth potential.",
                    zh: "凭借独家物流机电一体化核心技术与全球市场成长潜力，获得韩国技术保证基金及风险企业协会官方认证。",
                    ja: "技術保証基金およびベンチャー企業協会より、独自の物流メカトロニクス技術力と成長可能性を公式認定。"
                },
                features: {
                    ko: ["원천 기술 우수성 공인", "R&D 투자 집중 기업", "글로벌 시장 성장 역량"],
                    en: ["Verified Original Technology", "R&D Intensive Enterprise", "Global Market Growth Capability"],
                    zh: ["原创核心技术卓越性认证", "聚焦研发创新的高精尖企业", "强劲的全球化市场拓展能力"],
                    ja: ["中核独自技術の優秀性認定", "R&D集中投資企業", "グローバル展開への高い成長力"]
                }
            },
            cert_rnd: {
                title: { ko: "기업부설연구소(R&D 센터) 인정서", en: "Corporate R&D Center Accreditation", zh: "企业附属研究所（研发中心）认证", ja: "企業付設研究所（R&Dセンター）認定書" },
                description: {
                    ko: "과학기술정보통신부 산하 한국산업기술진흥협회(KOITA)로부터 독립된 물류 자동화 전문 기술연구소 정식 인가를 획득하였습니다.",
                    en: "Accredited by KOITA under MSIT as an independent specialized logistics automation technology research center.",
                    zh: "获得韩国科技信息通信部下属产业技术振兴协会（KOITA）官方批准成立的独立物流自动化专业技术研究所认证。",
                    ja: "科学技術情報通信部傘下のKOITAより独立した物流自動化専門技術研究所としての正式認可を取得。"
                },
                features: {
                    ko: ["전담 R&D 석박사 연구진", "독자적 제어 알고리즘 개발", "산학연 협력 네트워크"],
                    en: ["Dedicated Masters & PhD Researchers", "Proprietary Algorithm Development", "Industry-Academia Network"],
                    zh: ["高精尖硕博专业研发团队", "自主开发智能控制核心算法", "深度产学研协同创新网络"],
                    ja: ["専門R&D研究チーム配備", "独自制御アルゴリズムの開発", "産学官連携研究ネットワーク"]
                }
            },
            cert_innobiz: {
                title: { ko: "기술혁신형 중소기업(Inno-Biz) 확인서", en: "Inno-Biz Technology Innovation Certification", zh: "技术创新型中小企业 (Inno-Biz) 认证", ja: "技術革新中小企業（Inno-Biz）認証" },
                description: {
                    ko: "중소벤처기업부로부터 기술 경쟁력, R&D 투자 비율, 상용화 성공 실적을 종합 평가받아 기술혁신 선도 기업으로 공식 지정되었습니다.",
                    en: "Designated as an innovative leading enterprise by MSS based on technology competitiveness, R&D ratio, and commercialization achievements.",
                    zh: "经韩国中小风险企业部在技术竞争力、研发投入比及产业化业绩综合评估，正式评定为技术创新领军企业。",
                    ja: "中小ベンチャー企業部より技術競争力・研究開発比率・実用化実績が総合評価され、技術革新企業に指定。"
                },
                features: {
                    ko: ["정부 공인 기술혁신 기업", "상용화 성공 실적 검증", "신뢰성 높은 B2B 파트너"],
                    en: ["Government Verified Tech Leader", "Proven Commercial Deployments", "Trusted B2B Engineering Partner"],
                    zh: ["政府权威背书技术创新企业", "经实战检验的大规模商用落地", "极具信赖度的全球B2B战略伙伴"],
                    ja: ["政府公認の技術革新企業", "商用化実績の厳格な検証", "信頼性の高いB2Bパートナー"]
                }
            },

            // [3. 수상 내역 3건]
            award_1: {
                title: { ko: "강원창조경제혁신센터 표창장", en: "Gangwon Center for Creative Economy Commendation", zh: "江原创新创业经济中心表彰", ja: "江原創造経済革新センター表彰" },
                organization: { ko: "강원창조경제혁신센터", en: "Gangwon Center for Creative Economy", zh: "江原创新创业经济中心", ja: "江原創造経済革新センター" },
                description: {
                    ko: "지역 청년 창업 활성화와 첨단 스마트 물류 솔루션 연구개발에 기여한 공로를 인정받아 센터장 표창을 수상하였습니다.",
                    en: "Awarded Center Director Commendation for contributions to regional startup incubation and innovative smart logistics technology R&D.",
                    zh: "表彰在扶持区域青年创业创新及推动尖端智慧物流设备研发方面的突出贡献。",
                    ja: "地域スタートアップ振興と先端スマート物流ソリューションの研究開発功績が評価され、センター長表彰を受賞。"
                },
                features: {
                    ko: ["물류 자동화 R&D 성과 인정", "지역 기술 창업 생태계 활성화 기여", "기술 실증 우수 모델 선정"],
                    en: ["Logistics Automation R&D Recognition", "Regional Tech Startup Support", "Selected as Model Tech Project"],
                    zh: ["物流自动化研发突破性成果认可", "积极促进区域创新技术生态建设", "入选技术实证示范标杆优秀项目"],
                    ja: ["物流自動化R&Dの成果認知", "地域技術起業エコシステムへの貢献", "技術実証優秀モデルに選定"]
                }
            },
            award_2: {
                title: { ko: "신용보증기금 Start-up NEST 12기 선정", en: "KODIT Start-up NEST 12th Cohort Selection", zh: "信用保证基金 Start-up NEST 12期入选", ja: "信用保証基金 Start-up NEST 第12期選定" },
                organization: { ko: "신용보증기금 (KODIT)", en: "Korea Credit Guarantee Fund (KODIT)", zh: "韩国信用保证基金 (KODIT)", ja: "韓国信用保証基金 (KODIT)" },
                description: {
                    ko: "신용보증기금의 유망 스타트업 육성 플랫폼 'Start-up NEST' 12기 혁신 기업으로 최종 선정되어 금융 및 액셀러레이팅 지원을 받았습니다.",
                    en: "Selected as an innovative enterprise for KODIT's Startup NEST 12th cohort, receiving financial guarantee and growth acceleration support.",
                    zh: "作为高成长潜力企业最终入选韩国信用保证基金旗下的Start-up NEST第12期，获得专项金融与孵化加速扶持。",
                    ja: "信用保証基金の有望スタートアップ育成プログラム「Start-up NEST」第12期に選定され、金融・成長支援を獲得。"
                },
                features: {
                    ko: ["유망 하이테크 스타트업 선정", "신용보증기금 금융 지원 보증", "성장 가속화 액셀러레이팅"],
                    en: ["Selected Promising Hi-Tech Startup", "Financial Guarantee by KODIT", "Accelerated Growth Program"],
                    zh: ["入选极具潜力的硬科技创新企业", "获得信用保证基金政策性金融背书", "全方位商业化成长加速赋能"],
                    ja: ["有望ハイテク企業としての選定", "信用保証基金による金融支援保証", "成長加速アクセラレーション獲得"]
                }
            },
            award_3: {
                title: { ko: "국가연구개발사업 과제기획 전문실무 수료", en: "National R&D Project Planning Practical Course Completion", zh: "国家级研发项目策划实务研修结业", ja: "国家研究開発事業課題企画専門実務修了" },
                organization: { ko: "한국기술개발협회 (KOTERA)", en: "Korea Tech Development Association (KOTERA)", zh: "韩国技术开发协会 (KOTERA)", ja: "韓国技術開発協会 (KOTERA)" },
                description: {
                    ko: "정부 R&D 과제 기획, 특허 전략 수립, 사업화 기술 로드맵 작성을 위한 전문 실무 교육 과정을 성공적으로 수료하였습니다.",
                    en: "Successfully completed intensive practical training on national R&D project planning, patent IP strategy, and technology commercialization.",
                    zh: "顺利结业关于政府级研发课题规划、知识产权专利布局及商业化技术路线图制定的高阶实务培训课程。",
                    ja: "国家R&Dプロジェクト企画、特許戦略立案、事業化ロードマップ策定に関する専門実務課程を修了。"
                },
                features: {
                    ko: ["체계적 국가 R&D 기획 역량", "특허 전략 및 IP 로드맵 수립", "대형 국책 과제 수행 역량 확보"],
                    en: ["Systematic National R&D Planning", "Patent Strategy & IP Roadmapping", "Proven Capacity for Major Grants"],
                    zh: ["系统化国家级研发项目规划能力", "战略级专利布局与IP路线图构建", "具备承接重大国策课题的技术实力"],
                    ja: ["体系的な国家R&D企画能力の獲得", "特許戦略およびIPロードマップ策定", "大型国家プロジェクト遂行能力の確保"]
                }
            }
        }
    };

    /**
     * 현재 언어 코드(ko, en, zh, ja)를 안전하게 반환
     */
    function getLang() {
        var l = (window.currentLanguage || 'ko').toLowerCase();
        if (l === 'cn' || l === 'zh' || l === 'zh-cn') return 'zh';
        if (l === 'ja' || l === 'jp') return 'ja';
        if (l === 'en') return 'en';
        return 'ko';
    }

    /**
     * UI 다국어 텍스트 조회
     */
    function i18nUI(key) {
        var l = getLang();
        if (PATENT_I18N.ui[key] && PATENT_I18N.ui[key][l]) {
            return PATENT_I18N.ui[key][l];
        }
        return (PATENT_I18N.ui[key] && PATENT_I18N.ui[key].ko) ? PATENT_I18N.ui[key].ko : '';
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
        var itemMap = PATENT_I18N.items[id];
        if (itemMap && itemMap[field] && itemMap[field][l]) {
            return itemMap[field][l];
        }
        return fallback;
    }


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
        saveData(INITIAL_PATENT_DATA);
        return INITIAL_PATENT_DATA.slice();
    }

    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY_PATENT, JSON.stringify(data));
        } catch (e) {
            console.error('[PatentAdmin] Save error:', e);
            alert('저장 용량이 부족하거나 브라우저 저장소 접근에 실패했습니다.');
        }
        renderFrontend();
    }

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
    // 관리자 센터 목록 렌더링
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

            html.push('  <div class="flex flex-col sm:flex-row gap-4 pt-3 items-start">');
            
            // 콤팩트 미니 썸네일 (64~80px)
            html.push('    <div class="w-16 h-20 sm:w-20 sm:h-24 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group/thumb shadow-sm flex items-center justify-center self-start mt-0.5">');
            if (isPdf) {
                html.push('      <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 text-slate-600 p-1 text-center">');
                html.push('        <i class="fa-solid fa-file-pdf text-red-500 text-xl mb-0.5"></i>');
                html.push('        <span class="text-[9px] font-bold">PDF 문서</span>');
                html.push('      </div>');
            } else if (item.fileUrl) {
                html.push('      <img src="' + item.fileUrl + '" class="w-full h-full object-cover" onerror="this.src=\'assets/images/no-image.svg\';">');
            } else {
                html.push('      <div class="text-slate-300 text-[10px]">No Doc</div>');
            }
            if (item.fileUrl) {
                html.push('      <a href="' + item.fileUrl + '" target="_blank" class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-bold gap-0.5 text-center p-0.5">');
                html.push('        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i><span>열기</span>');
                html.push('      </a>');
            }
            html.push('    </div>');

            // 우측 시원한 글씨 공간 (90% 이상)
            html.push('    <div class="flex-1 min-w-0 space-y-2">');
            html.push('      <h4 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug break-keep">' + item.title + '</h4>');
            if (item.subtitle) {
                html.push('      <p class="text-xs font-semibold text-slate-400">' + item.subtitle + '</p>');
            }
            html.push('      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line break-keep">' + (item.description || '') + '</p>');
            
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
    // 모달 팝업 입력창 (좌측 65% 대형 글자칸 10줄 + 우측 35% 콤팩트 문서 패널)
    // ==========================================================================
    function ensureModal() {
        var existing = document.getElementById('patent-editor-modal');
        if (existing) return existing;

        var modalHtml = [
            '<div id="patent-editor-modal" class="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-sm hidden items-center justify-center p-2 sm:p-4 md:p-6">',
            '  <div class="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">',
            
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

            '    <form id="patent-editor-form" onsubmit="window.PatentAdmin.handleFormSubmit(event)" class="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">',
            '      <input type="hidden" id="patent-form-id" value="">',
            
            '      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">',
            
            // [좌측 65% 영역: 초대형 글자 입력 공간]
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

            // [우측 35% 영역: 콤팩트 문서 & 속성 패널]
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
            '              <i class="fa-solid fa-file-circle-check text-blue-500 text-2xl mb-1"></i>',
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

        modal.style.display = 'flex';
        modal.style.zIndex = '100050';
        modal.style.display = 'flex';
        modal.style.zIndex = '100050';
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

        var statusEl = document.getElementById('patent-modal-file-status');
        if (statusEl) {
            statusEl.textContent = item.fileUrl ? item.fileUrl.split('/').pop() : '문서 없음';
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeModal() {
        var modal = document.getElementById('patent-editor-modal');
        if (modal) {
            modal.style.display = 'none';
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
            var statusEl = document.getElementById('patent-modal-file-status');
            if (statusEl) statusEl.textContent = file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
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
    // 프론트엔드 실시간 동적 렌더링 - 2026 완성형 (가로 100% 풀 와이드 텍스트)
    // ==========================================================================
    // ==========================================================================
    // 4. 프론트엔드 홈페이지 실시간 동적 렌더링 엔진 (다국어 & 클린 이미지 뷰어)
    // ==========================================================================
    // ==========================================================================
    // 4. 프론트엔드 홈페이지 실시간 동적 렌더링 엔진 (좌측 대형 사진 : 우측 상세 설명)
    // ==========================================================================
    // ==========================================================================
    // 4. 프론트엔드 홈페이지 실시간 동적 렌더링 엔진 (인라인 황금비율: 좌 360px : 우 65%)
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
     * [특허 현황] 완벽한 황금비율 (좌측: 4/12 정밀 문서 뷰어 | 우측: 8/12 넉넉한 65% 상세 설명)
     * - CSS Grid(grid-cols-1 lg:grid-cols-12)를 적용하여 Flexbox 비율 붕괴 및 글씨 쪼개짐 원천 차단
     * - A4 규격(1:1.414) 맞춤 및 FitH 파라미터로 상단 검은색 레터박스 완전 제거
     */
    function renderPatentSection(items) {
        var container = document.getElementById('patent-cards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it, idx) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;
            var numStr = it.sortOrder ? (it.sortOrder < 10 ? '0' + it.sortOrder : it.sortOrder) : (idx + 1 < 10 ? '0' + (idx + 1) : idx + 1);

            // 다국어 텍스트 조회
            var title = i18nItem(it.id, 'title', it.title);
            var subtitle = i18nItem(it.id, 'subtitle', it.subtitle || '');
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);

            var badgeText = (it.sortOrder === 4 || it.badge === '핵심원천특허') 
                ? i18nUI('patent_core_badge') + ' ' + numStr 
                : i18nUI('patent_badge') + ' ' + numStr;

            var orgText = (it.organization && it.organization.indexOf('KIPO') !== -1)
                ? i18nUI('org_kipo')
                : (it.organization || i18nUI('org_kipo'));

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch group fade-in appear">');
            
            // ================= [좌측: 특허증 문서 정밀 뷰어 (Grid 4~5열 고정: 약 380~420px)] =================
            html.push('  <div class="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-slate-50 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-inner">');
            html.push('    <div class="w-full rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center relative group/doc cursor-pointer aspect-[1/1.414] max-h-[560px]" onclick="window.openImageModal ? window.openImageModal(\'' + it.fileUrl + '\', \'' + title.replace(/'/g, "\\'") + '\') : window.open(\'' + it.fileUrl + '\', \'_blank\')">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#view=Fit&toolbar=0&navpanes=0&scrollbar=0" class="pointer-events-none rounded-lg w-full h-full border-0 bg-white" title="' + title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + title + '" class="rounded-lg shadow-xs transition-transform duration-300 group-hover/doc:scale-[1.02] max-w-full max-h-full w-auto h-auto object-contain p-1">');
            }
            html.push('      <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px] rounded-xl">');
            html.push('        <i class="fa-solid fa-magnifying-glass-plus text-cyan-300 text-base"></i> 클릭 시 고화질 원본 크게 보기');
            html.push('      </div>');
            html.push('    </div>');
            html.push('    <div class="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 px-1">');
            html.push('      <span class="font-bold text-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-stamp text-blue-600"></i> ' + i18nUI('patent_copy_label') + '</span>');
            html.push('      <span class="text-blue-600 font-bold">' + i18nUI('patent_exclusive_label') + '</span>');
            html.push('    </div>');
            html.push('  </div>');

            // ================= [우측: 상세 설명 및 3대 메커니즘 (Grid 7~8열: 넉넉한 65% 공간 확보)] =================
            html.push('  <div class="lg:col-span-7 xl:col-span-8 flex flex-col justify-between py-1 min-w-0">');
            html.push('    <div>');
            
            // 메타 바 (배지, 등록번호, 등록일자, 기관)
            html.push('      <div class="flex items-center justify-between gap-2 flex-wrap pb-3.5 mb-4 border-b border-slate-100">');
            html.push('        <div class="flex items-center gap-2 flex-wrap">');
            html.push('          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">');
            html.push('            <i class="fa-solid fa-certificate text-blue-600"></i> ' + badgeText);
            html.push('          </span>');
            html.push('          <span class="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('        </div>');
            html.push('        <div class="flex items-center gap-2.5 text-xs text-slate-500 font-medium">');
            html.push('          <span><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('          <span class="hidden sm:inline"><i class="fa-solid fa-building-columns mr-1 text-slate-400"></i>' + orgText + '</span>');
            html.push('        </div>');
            html.push('      </div>');

            // 발명의 명칭 (절대 세로로 쪼개지지 않고 시원한 가로 헤드라인)
            html.push('      <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-snug break-keep mb-2">' + title + '</h3>');
            if (subtitle && subtitle !== title) {
                html.push('      <p class="text-sm font-semibold text-slate-400 mb-5 tracking-wide break-keep">' + subtitle + '</p>');
            }

            // 상세 기술 해설 (넉넉하고 편안한 줄간격)
            html.push('      <p class="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line break-keep mb-6">' + description + '</p>');

            // 핵심 메커니즘 박스 (3대 체크리스트)
            if (features && features.length > 0) {
                html.push('      <div class="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3 mb-4">');
                html.push('        <div class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2"><i class="fa-solid fa-microchip text-blue-600"></i> ' + i18nUI('mechanism_title') + '</div>');
                features.forEach(function (f) {
                    html.push('        <div class="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">');
                    html.push('          <i class="fa-solid fa-circle-check text-blue-600 text-sm mt-0.5 shrink-0"></i>');
                    html.push('          <span class="break-keep">' + f + '</span>');
                    html.push('        </div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            // 우측 하단 메타 바
            html.push('    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">');
            html.push('      <span>대한민국 특허청 정식 등록 공고</span>');
            html.push('      <span class="font-bold text-blue-600">ATA TECH R&D CENTER</span>');
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [인증 현황] 완벽한 황금비율 (좌측: 4/12 정밀 인증서 뷰어 | 우측: 8/12 넉넉한 65% 상세 설명)
     */
    function renderCertSection(items) {
        var container = document.getElementById('cert-quality-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            var title = i18nItem(it.id, 'title', it.title);
            var subtitle = i18nItem(it.id, 'subtitle', it.subtitle || '');
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch group fade-in appear">');
            
            // ================= [좌측: 인증서 정밀 뷰어 (Grid 4~5열)] =================
            html.push('  <div class="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-slate-50 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-inner">');
            html.push('    <div class="w-full rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center relative group/doc cursor-pointer aspect-[1/1.414] max-h-[560px]" onclick="window.openImageModal ? window.openImageModal(\'' + it.fileUrl + '\', \'' + title.replace(/'/g, "\\'") + '\') : window.open(\'' + it.fileUrl + '\', \'_blank\')">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#view=Fit&toolbar=0&navpanes=0&scrollbar=0" class="pointer-events-none rounded-lg w-full h-full border-0 bg-white" title="' + title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + title + '" class="rounded-lg shadow-xs transition-transform duration-300 group-hover/doc:scale-[1.02] max-w-full max-h-full w-auto h-auto object-contain p-1">');
            }
            html.push('      <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px] rounded-xl">');
            html.push('        <i class="fa-solid fa-magnifying-glass-plus text-emerald-300 text-base"></i> 클릭 시 고화질 원본 크게 보기');
            html.push('      </div>');
            html.push('    </div>');
            html.push('    <div class="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 px-1">');
            html.push('      <span class="font-bold text-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-award text-emerald-600"></i> 공식 공인 인증서</span>');
            html.push('      <span class="text-emerald-600 font-bold">국제 표준 적합성 승인</span>');
            html.push('    </div>');
            html.push('  </div>');

            // ================= [우측: 상세 설명 및 인증 범위 (Grid 7~8열)] =================
            html.push('  <div class="lg:col-span-7 xl:col-span-8 flex flex-col justify-between py-1 min-w-0">');
            html.push('    <div>');
            
            // 메타 바
            html.push('      <div class="flex items-center justify-between gap-2 flex-wrap pb-3.5 mb-4 border-b border-slate-100">');
            html.push('        <div class="flex items-center gap-2">');
            html.push('          <span class="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white shadow-sm">' + i18nUI('cert_badge') + '</span>');
            html.push('          <span class="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">' + (it.regNumber || '') + '</span>');
            html.push('        </div>');
            html.push('        <span class="text-xs text-slate-500 font-medium"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('      </div>');

            // 인증 명칭
            html.push('      <h4 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2 leading-snug group-hover:text-emerald-600 transition-colors break-keep">' + title + '</h4>');
            if (subtitle && subtitle !== title) {
                html.push('      <p class="text-sm font-semibold text-emerald-700 mb-5 break-keep">' + subtitle + '</p>');
            }

            // 상세 설명
            html.push('      <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line break-keep">' + description + '</p>');
            
            // 인증 범위 체크리스트
            if (features && features.length > 0) {
                html.push('      <div class="space-y-3 mb-4 bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80">');
                html.push('        <div class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-2"><i class="fa-solid fa-check-double text-emerald-600"></i> ' + i18nUI('cert_features_title') + '</div>');
                features.forEach(function (f) {
                    html.push('        <div class="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">');
                    html.push('          <i class="fa-solid fa-check text-emerald-600 text-sm mt-0.5 shrink-0"></i>');
                    html.push('          <span class="break-keep">' + f + '</span>');
                    html.push('        </div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            // 하단 메타 바
            html.push('    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">');
            html.push('      <span>품질·환경 표준 시스템</span>');
            html.push('      <span class="font-bold text-emerald-600">CERTIFIED EXCELLENCE</span>');
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    /**
     * [수상 및 수료 내역] 완벽한 황금비율 (좌측: 4/12 정밀 상장 뷰어 | 우측: 8/12 넉넉한 65% 상세 설명)
     */
    function renderAwardSection(items) {
        var container = document.getElementById('cert-awards-grid');
        if (!container) return;

        items.sort(function (a, b) { return (a.sortOrder || 99) - (b.sortOrder || 99); });

        var html = [];
        items.forEach(function (it) {
            var isPdf = (it.fileUrl || '').toLowerCase().indexOf('.pdf') !== -1;

            var title = i18nItem(it.id, 'title', it.title);
            var organization = i18nItem(it.id, 'organization', it.organization || '');
            var description = i18nItem(it.id, 'description', it.description || '');
            var features = i18nItem(it.id, 'features', it.features || []);

            html.push('<div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-2xl hover:border-amber-500 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch group fade-in appear">');
            
            // ================= [좌측: 상장 정밀 뷰어 (Grid 4~5열)] =================
            html.push('  <div class="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-slate-50 rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-inner">');
            html.push('    <div class="w-full rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center relative group/doc cursor-pointer aspect-[1/1.414] max-h-[560px]" onclick="window.openImageModal ? window.openImageModal(\'' + it.fileUrl + '\', \'' + title.replace(/'/g, "\\'") + '\') : window.open(\'' + it.fileUrl + '\', \'_blank\')">');
            if (isPdf) {
                html.push('      <iframe src="' + it.fileUrl + '#view=Fit&toolbar=0&navpanes=0&scrollbar=0" class="pointer-events-none rounded-lg w-full h-full border-0 bg-white" title="' + title + '"></iframe>');
            } else if (it.fileUrl) {
                html.push('      <img src="' + it.fileUrl + '" alt="' + title + '" class="rounded-lg shadow-xs transition-transform duration-300 group-hover/doc:scale-[1.02] max-w-full max-h-full w-auto h-auto object-contain p-1">');
            }
            html.push('      <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-[1px] rounded-xl">');
            html.push('        <i class="fa-solid fa-magnifying-glass-plus text-amber-300 text-base"></i> 클릭 시 고화질 원본 크게 보기');
            html.push('      </div>');
            html.push('    </div>');
            html.push('    <div class="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 px-1">');
            html.push('      <span class="font-bold text-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-trophy text-amber-500"></i> 공인 표창 및 수료증</span>');
            html.push('      <span class="text-amber-600 font-bold">대외 기술력 인정</span>');
            html.push('    </div>');
            html.push('  </div>');

            // ================= [우측: 상세 공적 및 수상 설명 (Grid 7~8열)] =================
            html.push('  <div class="lg:col-span-7 xl:col-span-8 flex flex-col justify-between py-1 min-w-0">');
            html.push('    <div>');
            
            // 메타 바
            html.push('      <div class="flex items-center justify-between gap-2 mb-4 pb-3.5 border-b border-slate-100">');
            html.push('        <span class="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow-sm">' + i18nUI('award_badge') + '</span>');
            html.push('        <span class="text-xs font-medium text-slate-500"><i class="fa-regular fa-calendar-check mr-1 text-slate-400"></i>' + (it.date || '') + '</span>');
            html.push('      </div>');

            // 수상 명칭 및 주관 기관
            html.push('      <h4 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2 leading-snug group-hover:text-amber-600 transition-colors break-keep">' + title + '</h4>');
            html.push('      <p class="text-sm font-semibold text-slate-500 mb-5"><i class="fa-solid fa-building-columns text-amber-500 mr-2"></i>' + organization + '</p>');

            // 공적 설명
            html.push('      <p class="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 whitespace-pre-line break-keep">' + description + '</p>');
            
            // 주요 성과 체크리스트
            if (features && features.length > 0) {
                html.push('      <div class="space-y-3 mb-4 bg-amber-50/50 p-5 sm:p-6 rounded-2xl border border-amber-200/60">');
                html.push('        <div class="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2"><i class="fa-solid fa-award text-amber-600"></i> ' + i18nUI('award_features_title') + '</div>');
                features.forEach(function (f) {
                    html.push('        <div class="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">');
                    html.push('          <i class="fa-solid fa-award text-amber-600 text-sm mt-0.5 shrink-0"></i>');
                    html.push('          <span class="break-keep">' + f + '</span>');
                    html.push('        </div>');
                });
                html.push('      </div>');
            }
            html.push('    </div>');

            // 하단 메타 바
            html.push('    <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">');
            html.push('      <span>정부 및 공공기관 공인 실적</span>');
            html.push('      <span class="font-bold text-amber-600">OFFICIAL COMMENDATION</span>');
            html.push('    </div>');

            html.push('  </div>');
            html.push('</div>');
        });

        container.innerHTML = html.join('');
    }

    // 전역 네임스페이스
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

    // 언어 변경 리스너 연동 (다국어 실시간 동기화)
    window.addEventListener('languageChanged', function () {
        renderFrontend();
    });

    document.addEventListener('DOMContentLoaded', function () {
        renderFrontend();
    });

})();
