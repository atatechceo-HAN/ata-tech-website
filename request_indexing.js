/**
 * ==============================================================================
 * 주식회사 에이티에이기술 (ATA TECH) - Google Indexing API 자동화 스크립트
 * 
 * [파일 역할]
 * 이 스크립트는 Google Indexing API를 사용하여 웹사이트의 핵심 정규 페이지 및
 * 업데이트된 주요 URL에 대해 구글 검색 로봇(Googlebot)이 즉시 방문하여
 * 크롤링 및 색인(인덱싱)을 생성하도록 공식 API 요청을 전송하는 자동화 도구입니다.
 * 
 * [사용 전 준비 사항 (3분 소요)]
 * 1. Google Cloud Console(https://console.cloud.google.com/)에서 프로젝트 생성
 * 2. 'Web Search Indexing API' 사용 설정 활성화
 * 3. 서비스 계정(Service Account) 생성 및 키(JSON) 발급
 *    -> 다운로드한 JSON 파일명을 'service_account.json'으로 변경하여 이 스크립트와 같은 폴더에 복사
 * 4. Google Search Console(https://search.google.com/search-console/) 접속
 *    -> 설정 > 사용자 및 권한 > '사용자 추가'
 *    -> 서비스 계정 이메일(예: your-service-account@project.iam.gserviceaccount.com) 입력 후 권한 '소유자(Owner)' 부여
 * 5. 터미널에서 구글 인증 패키지 설치:
 *    npm install googleapis
 * 6. 스크립트 실행:
 *    node request_indexing.js
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// 1. 서비스 계정 키 파일 경로 설정
const KEY_FILE_PATH = path.join(__dirname, 'service_account.json');

// 2. 구글 검색엔진에 즉시 크롤링 및 색인 생성을 요청할 핵심 대상 URL 목록
// * W3C 규격 준수: 해시(#)가 아닌 실제 독립 HTML 문서 및 정규화된 Clean URL을 전달합니다.
const TARGET_URLS = [
    'https://ata-tech.co.kr/',                                // 1. 메인 포털 홈 (우선순위 1.0)
    'https://ata-tech.co.kr/popup-wheel-diverter',             // 2. [핵심 설비] 4분할 독립 구동 팝업 휠 방향전환장치 전문관
    'https://ata-tech.co.kr/vehicle-mounted-sorting-system',   // 3. [핵심 설비] 차량 탑재형 화물 분류 시스템 전문관
    // 단일 페이지 내 주요 8대 카테고리 (크롤러 신호 전달용 대표 엔드포인트)
    'https://ata-tech.co.kr/#solutions',                      // 4. 스마트 물류 솔루션
    'https://ata-tech.co.kr/#product-lineup',                 // 5. 핵심 장비 제품 라인업
    'https://ata-tech.co.kr/#about',                          // 6. 회사소개 (CEO, 연혁, 비전)
    'https://ata-tech.co.kr/#about-core-tech',                // 7. 핵심 기술 개요 3D 아키텍처
    'https://ata-tech.co.kr/#patents',                        // 8. 특허 및 기술 인증 현황
    'https://ata-tech.co.kr/#reference',                      // 9. 주요 구축 실적 (레퍼런스)
    'https://ata-tech.co.kr/#notice',                         // 10. 공지사항
    'https://ata-tech.co.kr/#contact'                         // 11. 문의하기 및 오시는 길
];

async function runGoogleIndexing() {
    console.log('=================================================================');
    console.log('🚀 주식회사 에이티에이기술 - Google Indexing API 자동화 실행 시작');
    console.log('=================================================================\n');

    // 서비스 계정 키 파일 존재 여부 검사
    if (!fs.existsSync(KEY_FILE_PATH)) {
        console.error('❌ [오류] service_account.json 키 파일이 발견되지 않았습니다.');
        console.log('\n📌 [조치 가이드]');
        console.log('1. Google Cloud Console에서 다운로드한 서비스 계정 키 JSON 파일의 이름을');
        console.log('   "service_account.json" 으로 변경하여 현재 폴더에 넣어주세요.');
        console.log('2. Google Search Console(GSC)의 [설정 > 사용자 및 권한]에서 해당 서비스 계정 이메일을');
        console.log('   "소유자(Owner)" 권한으로 등록했는지 확인해 주세요.');
        console.log('3. "npm install googleapis" 명령어로 필요 패키지를 설치한 후 다시 실행해 주세요.\n');
        return;
    }

    try {
        // 구글 OAuth2 서비스 계정 인증 객체 생성
        const keyData = JSON.parse(fs.readFileSync(KEY_FILE_PATH, 'utf8'));
        const jwtClient = new google.auth.JWT(
            keyData.client_email,
            null,
            keyData.private_key,
            ['https://www.googleapis.com/auth/indexing'],
            null
        );

        // 구글 인증 토큰 획득
        await jwtClient.authorize();
        console.log(`✅ [인증 성공] 서비스 계정(${keyData.client_email}) 인증 완료!\n`);

        const indexing = google.indexing({
            version: 'v3',
            auth: jwtClient
        });

        // 각 대상 URL에 대해 색인 요청 순차 전송
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < TARGET_URLS.length; i++) {
            const targetUrl = TARGET_URLS[i];
            console.log(`[${i + 1}/${TARGET_URLS.length}] 색인 요청 전송 중: ${targetUrl}`);

            try {
                const response = await indexing.urlNotifications.publish({
                    requestBody: {
                        url: targetUrl,
                        type: 'URL_UPDATED' // 페이지가 생성되거나 업데이트되었음을 구글에 통보
                    }
                });

                if (response.status === 200) {
                    console.log(`    ↳ 🟢 성공 (Status: 200 OK, 알림 시간: ${response.data.urlNotificationMetadata?.latestUpdate?.notifyTime || '즉시'})`);
                    successCount++;
                } else {
                    console.log(`    ↳ 🟡 응답 상태: ${response.status}`);
                }
            } catch (err) {
                console.error(`    ↳ 🔴 실패 (원인: ${err.message})`);
                failCount++;
            }

            // 구글 API 요청 간 0.5초 딜레이 (안전한 Rate Limit 준수)
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n=================================================================');
        console.log(`📊 Google Indexing API 색인 요청 완료 결과:`);
        console.log(`   - 성공: ${successCount}건`);
        console.log(`   - 실패: ${failCount}건`);
        console.log(`   - 총계: ${TARGET_URLS.length}건`);
        console.log('=================================================================');
        console.log('💡 TIP: 요청 후 구글봇은 보통 수 분 ~ 24시간 이내에 방문하여 색인을 갱신합니다.');
        console.log('       Google Search Console에서 "색인 생성 유효성 검사(Validate Fix)"를 함께 눌러주시면 더욱 효과적입니다.\n');

    } catch (error) {
        console.error('❌ Google Indexing API 실행 중 예외 오류 발생:', error.message);
    }
}

// 스크립트 실행
runGoogleIndexing();
