const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const headStartMarker = '<head>';
const headEndMarker = '<!-- [Tailwind CSS 사전 컴파일 정적 스타일시트] -->';

const startIndex = content.indexOf(headStartMarker);
const endIndex = content.indexOf(headEndMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('[ERR] Could not locate head markers');
    process.exit(1);
}

const newHeadContent = `<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- ======================================================== -->
    <!-- [SEO & GEO 최적화 메타 태그 - B2B 스마트 물류 자동화 전문 기업] -->
    <!-- 구글, 네이버 검색엔진 및 AI 검색(Perplexity, ChatGPT, Gemini) 최적화 -->
    <!-- ======================================================== -->
    <title>주식회사 에이티에이기술 (ATA TECH) | B2B 스마트 물류 자동화 설비 · 화물 분류 시스템 전문 기업</title>
    <meta name="description"
        content="주식회사 에이티에이기술(대표이사 한윤규)은 B2B 물류 자동화 설비 전문 제조 기업입니다. 차량 탑재형 화물 자동 분류 및 이송 시스템(국토부 우수기술), 4분할 방향 전환 장치(특허 제10-2956028호), 내로우 벨트 소터(NBS), 스마트 물류 컨베이어 등 최첨단 물류 센터 풀필먼트 엔지니어링 솔루션을 공급합니다.">
    <meta name="keywords"
        content="주식회사 에이티에이기술, 에이티에이기술, ATA TECH, 한윤규, B2B 물류 자동화, 물류 자동화 설비, 차량 탑재형 화물 자동 분류 및 이송 시스템, 4분할 방향 전환 장치, 내로우 벨트 소터, NBS, 스마트 물류 시스템, 화물 자동 분류 장치, 4분할 독립 구동 팝업 휠, 방향전환장치, 물류 로봇, 풀필먼트 자동화, 휠소터, Wheel Sorter">
    <meta name="author" content="주식회사 에이티에이기술 (ATA TECH Co., Ltd.)">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://ata-tech.co.kr/">

    <!-- ======================================================== -->
    <!-- [Open Graph (오픈 그래프 메타 태그 - B2B SNS/메신저 공유 최적화)] -->
    <!-- 카카오톡, 라인, 슬랙, 링크드인 링크 공유 시 전문 기업 카드 노출 -->
    <!-- ======================================================== -->
    <meta property="og:type" content="website">
    <meta property="og:locale" content="ko_KR">
    <meta property="og:url" content="https://ata-tech.co.kr/">
    <meta property="og:site_name" content="주식회사 에이티에이기술 (ATA TECH)">
    <meta property="og:title" content="주식회사 에이티에이기술 (ATA TECH) | B2B 스마트 물류 자동화 전문 기업">
    <meta property="og:description"
        content="차량 탑재형 화물 자동 분류 및 이송 시스템, 4분할 방향 전환 장치, 내로우 벨트 소터(NBS) 등 독보적 원천 기술을 보유한 B2B 물류 자동화 엔지니어링 선도 기업 (주)에이티에이기술 공식 홈페이지입니다.">
    <meta property="og:image" content="https://ata-tech.co.kr/Logo%20-%20001.png">
    <meta property="og:image:alt" content="주식회사 에이티에이기술 공식 로고">

    <!-- ======================================================== -->
    <!-- [Twitter Card (X / 트위터 전용 메타데이터)] -->
    <!-- ======================================================== -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="주식회사 에이티에이기술 (ATA TECH) | B2B 스마트 물류 자동화 전문 기업">
    <meta name="twitter:description"
        content="차량 탑재형 화물 자동 분류 및 이송 시스템, 4분할 방향 전환 장치, 내로우 벨트 소터(NBS) 등 독보적 원천 기술의 B2B 물류 자동화 솔루션">
    <meta name="twitter:image" content="https://ata-tech.co.kr/Logo%20-%20001.png">

    <!-- ======================================================== -->
    <!-- [포털 웹마스터 소유권 인증 태그] -->
    <!-- ======================================================== -->
    <!-- 구글 서치 콘솔 (Google Search Console) 사이트 소유권 확인 태그 -->
    <meta name="google-site-verification" content="GOOGLE_VERIFICATION_CODE" />
    <!-- 네이버 서치어드바이저 (Naver Search Advisor) 사이트 소유권 확인 태그 (등록 인증값 보존) -->
    <meta name="naver-site-verification" content="9806d8dd6769653a9e987f774fc7b9652f47ebdd" />

    <!-- ======================================================== -->
    <!-- [GEO & AI 검색 엔진 최적화 구조화 데이터 (Schema.org JSON-LD)] -->
    <!-- Organization(기업/대표자/본사주소) 및 3대 핵심 주력장비 Product 스키마 마크업 -->
    <!-- 구글 지식패널, 생성형 AI 검색(SGE/Perplexity/ChatGPT) 공인 출처 인용 연동 -->
    <!-- ======================================================== -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://ata-tech.co.kr/#organization",
          "name": "주식회사 에이티에이기술",
          "legalName": "주식회사 에이티에이기술",
          "alternateName": [
            "(주)에이티에이기술",
            "에이티에이기술",
            "ATA TECH",
            "ATA Technology Co., Ltd."
          ],
          "url": "https://ata-tech.co.kr",
          "logo": {
            "@type": "ImageObject",
            "url": "https://ata-tech.co.kr/Logo%20-%20001.png",
            "caption": "주식회사 에이티에이기술 공식 로고"
          },
          "image": "https://ata-tech.co.kr/Logo%20-%20001.png",
          "email": "atatech.ceo@gmail.com",
          "telephone": "+82-31-8055-8763",
          "founder": {
            "@type": "Person",
            "name": "한윤규",
            "jobTitle": "대표이사"
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "경기도 오산시 수목원로 88번길 35 B동 1402호 (현대테라타워CMC)",
            "addressLocality": "오산시",
            "addressRegion": "경기도",
            "postalCode": "18118",
            "addressCountry": "KR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 37.1593,
            "longitude": 127.0667
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "sales",
              "telephone": "+82-31-8055-8763",
              "email": "atatech.ceo@gmail.com",
              "availableLanguage": ["Korean", "English", "Chinese", "Japanese"]
            },
            {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+82-31-8055-8763",
              "email": "atatech.ceo@gmail.com",
              "availableLanguage": ["Korean", "English", "Chinese", "Japanese"]
            }
          ],
          "description": "주식회사 에이티에이기술(대표 한윤규)은 차량 탑재형 화물 자동 분류 및 이송 시스템, 4분할 방향 전환 장치, 내로우 벨트 소터(NBS) 등 지능형 B2B 스마트 물류 자동화 설비 엔지니어링 선도 기업입니다.",
          "knowsAbout": [
            "B2B 물류 자동화 설비",
            "차량 탑재형 화물 자동 분류 및 이송 시스템",
            "4분할 방향 전환 장치",
            "내로우 벨트 소터 (NBS)",
            "4분할 독립 구동 팝업 휠 방향전환장치",
            "스마트 물류 컨베이어 및 소터 시스템",
            "Wheel Sorter (휠소터)",
            "Cross Belt Sorter (CBS)"
          ],
          "makesOffer": [
            { "@id": "https://ata-tech.co.kr/#product-vehicle-sorting" },
            { "@id": "https://ata-tech.co.kr/#product-4way-diverter" },
            { "@id": "https://ata-tech.co.kr/#product-nbs" }
          ]
        },
        {
          "@type": "Product",
          "@id": "https://ata-tech.co.kr/#product-vehicle-sorting",
          "name": "차량 탑재형 화물 자동 분류 및 이송 시스템",
          "alternateName": "운송 차량 탑재형 화물 자동 분류 이송 장치",
          "image": "https://ata-tech.co.kr/Logo%20-%20001.png",
          "description": "물류 운송 탑차 적재함 내부에서 화물을 자동으로 감지하여 분류 및 하역 지점으로 신속하게 이송하는 혁신 B2B 메카트로닉스 시스템 (국토교통 우수물류신기술)",
          "brand": {
            "@type": "Brand",
            "name": "ATA TECH"
          },
          "manufacturer": {
            "@id": "https://ata-tech.co.kr/#organization"
          },
          "category": "Logistics Automation Machinery > Vehicle-mounted Sorting System",
          "url": "https://ata-tech.co.kr"
        },
        {
          "@type": "Product",
          "@id": "https://ata-tech.co.kr/#product-4way-diverter",
          "name": "4분할 방향 전환 장치",
          "alternateName": "4분할 독립 구동 팝업 휠 방향전환장치 (4-Way Pop-up Wheel Diverter)",
          "image": "https://ata-tech.co.kr/Logo%20-%20001.png",
          "description": "특허 제10-2956028호 기반 4분할 독립 모터 제어 팝업 휠을 적용하여 다양한 규격 화물의 초고속 다방향 분류 및 정밀 이송을 구현하는 차세대 방향전환 설비",
          "brand": {
            "@type": "Brand",
            "name": "ATA TECH"
          },
          "manufacturer": {
            "@id": "https://ata-tech.co.kr/#organization"
          },
          "category": "Logistics Automation Machinery > 4-Way Diverter",
          "url": "https://ata-tech.co.kr"
        },
        {
          "@type": "Product",
          "@id": "https://ata-tech.co.kr/#product-nbs",
          "name": "내로우 벨트 소터",
          "alternateName": "Narrow Belt Sorter (NBS)",
          "image": "https://ata-tech.co.kr/Logo%20-%20001.png",
          "description": "물류 터미널 및 이커머스 풀필먼트 센터에서 중·소형 포장 화물을 고속·정밀 분기하는 모듈형 B2B 내로우 벨트 소팅 자동화 시스템",
          "brand": {
            "@type": "Brand",
            "name": "ATA TECH"
          },
          "manufacturer": {
            "@id": "https://ata-tech.co.kr/#organization"
          },
          "category": "Logistics Automation Machinery > Narrow Belt Sorter",
          "url": "https://ata-tech.co.kr"
        },
        {
          "@type": "WebSite",
          "@id": "https://ata-tech.co.kr/#website",
          "url": "https://ata-tech.co.kr",
          "name": "주식회사 에이티에이기술",
          "description": "B2B 스마트 물류 자동화 설비 · 화물 자동 분류 시스템 전문 솔루션",
          "publisher": {
            "@id": "https://ata-tech.co.kr/#organization"
          },
          "inLanguage": "ko-KR"
        },
        {
          "@type": "ItemList",
          "@id": "https://ata-tech.co.kr/#sitenavigation",
          "name": "주요 네비게이션 및 설비 카테고리",
          "itemListElement": [
            {
              "@type": "SiteNavigationElement",
              "position": 1,
              "name": "4분할 방향전환장치",
              "description": "특허 제10-2956028호 기반 4분할 독립 구동 팝업 휠 방향전환장치 전문관",
              "url": "https://ata-tech.co.kr/popup-wheel-diverter"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 2,
              "name": "차량 탑재 화물분류 시스템",
              "description": "국토교통 우수기술 선정 운송 차량 탑재형 화물 자동 분류 시스템 전문관",
              "url": "https://ata-tech.co.kr/vehicle-mounted-sorting-system"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 3,
              "name": "스마트 물류 솔루션",
              "description": "11대 스마트 물류 자동화 설비 솔루션 라인업",
              "url": "https://ata-tech.co.kr/#solutions"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 4,
              "name": "제품 라인업",
              "description": "NBS, CBS, Wheel Sorter, 셔틀 AS/RS 등 주요 장비 상세 정보",
              "url": "https://ata-tech.co.kr/#product-lineup"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 5,
              "name": "회사소개",
              "description": "주식회사 에이티에이기술 CEO 인사말, 연혁, 기업 비전",
              "url": "https://ata-tech.co.kr/#about"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 6,
              "name": "특허 및 인증",
              "description": "특허 등록 4건 및 ISO 9001/14001, 벤처기업 인증 현황",
              "url": "https://ata-tech.co.kr/#patents"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 7,
              "name": "구축 실적",
              "description": "이커머스, 유통, 콜드체인, 제조 등 산업별 구축 레퍼런스",
              "url": "https://ata-tech.co.kr/#reference"
            },
            {
              "@type": "SiteNavigationElement",
              "position": 8,
              "name": "문의하기 및 오시는 길",
              "description": "물류 자동화 설비 도입 상담 및 기술 견적 문의",
              "url": "https://ata-tech.co.kr/#contact"
            }
          ]
        }
      ]
    }
    </script>

    `;

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

content = before + newHeadContent + after;
fs.writeFileSync(filePath, content, 'utf8');
console.log('[SUCCESS] index.html SEO & GEO optimization applied successfully!');

