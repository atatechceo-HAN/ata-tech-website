/**
 * ==============================================================================
 * 주식회사 에이티에이기술 (ATA TECH) - Google Indexing API 자동화 스크립트
 * 
 * [파일 역할]
 * 이 스크립트는 Google Indexing API를 사용하여 웹사이트의 핵심 정규 페이지(3개)에 대해
 * 구글 검색 로봇(Googlebot)이 즉시 방문하여 크롤링 및 색인(인덱싱)을 생성하도록
 * 공식 API 요청을 전송하는 자동화 도구입니다.
 * 
 * [핵심 개선 사항]
 * - 무거운 외부 패키지(googleapis) 설치 없이 Node.js 기본 내장 모듈(crypto, https)만으로
 *   OAuth2 JWT 전자서명 인증 및 색인 요청이 100% 작동하도록 설계되었습니다.
 * - 윈도우 PowerShell의 npm 실행 정책(PSSecurityException) 오류나 구글 드라이브 동기화
 *   충돌 없이 'node request_indexing.js' 명령어 하나로 즉시 실행됩니다.
 * 
 * [사용 전 준비 사항 (3분 소요)]
 * 1. Google Cloud Console(https://console.cloud.google.com/)에서 프로젝트 생성
 * 2. 'Web Search Indexing API' 사용 설정 활성화
 * 3. 서비스 계정(Service Account) 생성 및 키(JSON) 발급
 *    -> 다운로드한 JSON 파일명을 'service_account.json'으로 변경하여 이 스크립트와 같은 폴더에 복사
 * 4. Google Search Console(https://search.google.com/search-console/) 접속
 *    -> 설정 > 사용자 및 권한 > '사용자 추가'
 *    -> 서비스 계정 이메일(예: your-service-account@project.iam.gserviceaccount.com) 입력 후 권한 '소유자(Owner)' 부여
 * 5. 스크립트 즉시 실행 (별도 npm 패키지 설치 불필요):
 *    node request_indexing.js
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

// 1. 서비스 계정 키 파일 경로 설정
const KEY_FILE_PATH = path.join(__dirname, 'service_account.json');

// 2. 구글 검색엔진에 즉시 크롤링 및 색인 생성을 요청할 핵심 대상 URL 목록
// * W3C 및 Google 웹마스터 가이드라인 준수:
//   해시(#) 프래그먼트가 포함된 내부 앵커 URL은 제외하고,
//   sitemap.xml에 등록된 실제 독립 HTML 문서의 정규화된 Clean URL 3개만 전달합니다.
const TARGET_URLS = [
    'https://ata-tech.co.kr/',                                // 1. 메인 포털 홈 (우선순위 1.0)
    'https://ata-tech.co.kr/popup-wheel-diverter',             // 2. [핵심 설비] 4분할 독립 구동 팝업 휠 방향전환장치 전문관
    'https://ata-tech.co.kr/vehicle-mounted-sorting-system'    // 3. [핵심 설비] 차량 탑재형 화물 분류 시스템 전문관
];

/**
 * 객체를 Base64URL 문자열로 안전하게 인코딩하는 헬퍼 함수
 * (JWT 표준 규격인 RFC 7519에 따라 +, /, = 문자를 URL 안전 문자로 변환합니다)
 */
function toBase64Url(obj) {
    const jsonStr = typeof obj === 'string' ? obj : JSON.stringify(obj);
    return Buffer.from(jsonStr, 'utf8')
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

/**
 * Node.js 내장 https 모듈을 사용하여 HTTPS 요청을 전송하는 Promise 헬퍼 함수
 */
function sendHttpsRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let rawData = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                let parsedData = rawData;
                try {
                    parsedData = JSON.parse(rawData);
                } catch (e) {
                    // JSON이 아닌 응답일 경우 원문 유지
                }
                resolve({
                    status: res.statusCode,
                    data: parsedData
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

/**
 * 서비스 계정 개인키(Private Key)로 Google OAuth2 Access Token을 발급받는 함수
 */
async function getGoogleAccessToken(keyData) {
    const now = Math.floor(Date.now() / 1000);

    // 1. JWT 헤더(Header) 및 페이로드(Payload) 구성
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };

    const payload = {
        iss: keyData.client_email,
        scope: 'https://www.googleapis.com/auth/indexing',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600 // 1시간 유효
    };

    const unsignedToken = `${toBase64Url(header)}.${toBase64Url(payload)}`;

    // 2. RSA-SHA256 알고리즘으로 전자서명 생성
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedToken);
    signer.end();

    const signature = signer
        .sign(keyData.private_key, 'base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const jwtAssertion = `${unsignedToken}.${signature}`;

    // 3. Google OAuth2 토큰 서버에 Access Token 요청
    const postData = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtAssertion
    }).toString();

    const response = await sendHttpsRequest(
        {
            hostname: 'oauth2.googleapis.com',
            path: '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        },
        postData
    );

    if (response.status !== 200 || !response.data.access_token) {
        const errMsg = response.data?.error_description || response.data?.error || JSON.stringify(response.data);
        throw new Error(`OAuth2 토큰 발급 실패 (Status ${response.status}): ${errMsg}`);
    }

    return response.data.access_token;
}

/**
 * Google Indexing API에 단일 URL 색인 업데이트(URL_UPDATED)를 요청하는 함수
 */
async function publishUrlNotification(accessToken, targetUrl) {
    const requestBody = JSON.stringify({
        url: targetUrl,
        type: 'URL_UPDATED' // 페이지가 생성되거나 업데이트되었음을 구글에 통보
    });

    return await sendHttpsRequest(
        {
            hostname: 'indexing.googleapis.com',
            path: '/v3/urlNotifications:publish',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        },
        requestBody
    );
}

/**
 * 메인 실행 함수
 */
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
        console.log('3. 별도의 npm 패키지 설치 없이 "node request_indexing.js" 명령어로 즉시 실행하실 수 있습니다.\n');
        return;
    }

    try {
        // 1. 서비스 계정 JSON 파일 읽기 및 필수 필드 검증
        const keyData = JSON.parse(fs.readFileSync(KEY_FILE_PATH, 'utf8'));
        if (!keyData.client_email || !keyData.private_key) {
            throw new Error('service_account.json 파일 내에 client_email 또는 private_key 항목이 없습니다.');
        }

        // 2. 구글 인증 토큰 획득 (내장 crypto/https 모듈 사용)
        const accessToken = await getGoogleAccessToken(keyData);
        console.log(`✅ [인증 성공] 서비스 계정(${keyData.client_email}) 인증 완료!\n`);

        // 3. 각 대상 URL에 대해 색인 요청 순차 전송
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < TARGET_URLS.length; i++) {
            const targetUrl = TARGET_URLS[i];
            console.log(`[${i + 1}/${TARGET_URLS.length}] 색인 요청 전송 중: ${targetUrl}`);

            try {
                const response = await publishUrlNotification(accessToken, targetUrl);

                if (response.status === 200) {
                    const notifyTime = response.data?.urlNotificationMetadata?.latestUpdate?.notifyTime || '즉시';
                    console.log(`    ↳ 🟢 성공 (Status: 200 OK, 알림 시간: ${notifyTime})`);
                    successCount++;
                } else {
                    const apiError = response.data?.error?.message || JSON.stringify(response.data);
                    console.error(`    ↳ 🔴 실패 (Status: ${response.status}, 원인: ${apiError})`);
                    failCount++;
                }
            } catch (err) {
                console.error(`    ↳ 🔴 요청 오류 (원인: ${err.message})`);
                failCount++;
            }

            // 구글 API 요청 간 0.5초 딜레이 (안전한 Rate Limit 준수)
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        console.log('\n=================================================================');
        console.log('📊 Google Indexing API 색인 요청 완료 결과:');
        console.log(`   - 성공: ${successCount}건`);
        console.log(`   - 실패: ${failCount}건`);
        console.log(`   - 총계: ${TARGET_URLS.length}건`);
        console.log('=================================================================');
        console.log('💡 TIP: 요청 후 구글봇은 보통 수 분 ~ 24시간 이내에 방문하여 색인을 갱신합니다.');
        console.log('       Google Search Console에서 "색인 생성 요청" 및 사이트맵 제출을 함께 해두시면 더욱 효과적입니다.\n');

    } catch (error) {
        console.error('❌ Google Indexing API 실행 중 예외 오류 발생:', error.message);
    }
}

// 스크립트 실행
runGoogleIndexing();
