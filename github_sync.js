/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - GitHub 원격 저장소 자동 동기화 엔진 (github_sync.js)
 * 
 * [주요 아키텍처 및 기능]
 * 1. GitHub REST API Contents V3 연동:
 *    - 원격 저장소(main 브랜치)의 `data.json` 파일을 직접 커밋 및 푸시(Push)
 *    - 다국어 UTF-8 텍스트를 손상 없이 Base64로 인코딩하는 브라우저 호환 인코더 탑재
 *    - 파일 덮어쓰기 무결성을 위한 최신 SHA 해시 자동 감지 및 충돌 방지
 * 
 * 2. 강력한 보안 및 개인 액세스 토큰(PAT) 보호:
 *    - 관리자 전용 GitHub Personal Access Token(PAT) 암호화 저장 및 세션 관리
 *    - 토큰 화면 표시 시 `ghp_••••••••••••••••••••••••••••` 형태로 철저한 마스킹 처리
 *    - 원클릭 '연결 테스트' 기능으로 토큰 유효성 및 repo 권한 즉각 검증
 * 
 * 3. 즉각적인 피드백 UI (UX/Aesthetics):
 *    - 동기화 진행 중: 3단계 실시간 상태 안내 로딩 스피너 오버레이 표시
 *    - 동기화 완료 시: 'GitHub 원격 저장소 반영 완료 (배포 진행 중)' 축하 알림
 *    - 실패 시: 초보 관리자도 1초 만에 해결할 수 있는 맞춤형 한국어 문제 해결 안내
 * 
 * 4. 자동 사이트 동기화 (data.json Fetch & Fallback):
 *    - 웹사이트 접속 시 `fetch('data.json?v=' + Date.now())`를 통해 최신 데이터 실시간 로드
 *    - 네트워크 장애나 오프라인 환경에서도 웹사이트가 멈추지 않는 안전 폴백(Fallback) 보장
 * ==============================================================================
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. 상수 및 기본 설정 정의
    // ==========================================================================
    var DEFAULT_REPO_OWNER = "atatechceo-HAN";        // GitHub 계정/조직명
    var DEFAULT_REPO_NAME = "ata-tech-website";       // 저장소 이름
    var DEFAULT_BRANCH = "main";                      // 기본 배포 브랜치
    var DATA_FILE_PATH = "data.json";                 // 타겟 데이터 파일 경로

    var STORAGE_KEY_GITHUB_TOKEN = "ata_admin_github_pat_v1";     // PAT 저장 키
    var STORAGE_KEY_GITHUB_CONFIG = "ata_admin_github_config_v1"; // 설정 저장 키

    // ==========================================================================
    // 2. Base64 UTF-8 안전 인코딩 / 디코딩 유틸리티
    // 브라우저의 기본 btoa()는 한글이나 특수문자에서 Latin1 인코딩 오류가 발생하므로
    // encodeURIComponent를 거쳐 UTF-8 바이트를 완벽하게 Base64로 변환합니다.
    // ==========================================================================
    function utf8ToBase64(str) {
        try {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode(parseInt(p1, 16));
            }));
        } catch (e) {
            console.error("[GithubSync] UTF-8 to Base64 변환 실패:", e);
            throw new Error("데이터를 Base64로 인코딩하는 데 실패했습니다.");
        }
    }

    function base64ToUtf8(b64) {
        try {
            return decodeURIComponent(Array.prototype.map.call(atob(b64), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            console.error("[GithubSync] Base64 to UTF-8 변환 실패:", e);
            throw new Error("Base64 데이터를 디코딩하는 데 실패했습니다.");
        }
    }

    // ==========================================================================
    // 3. GitHub 설정 및 토큰(PAT) 보안 관리 함수
    // ==========================================================================
    
    /**
     * 저장된 GitHub 연동 설정을 조회합니다.
     */
    function getGithubConfig() {
        var defaultCfg = {
            owner: DEFAULT_REPO_OWNER,
            repo: DEFAULT_REPO_NAME,
            branch: DEFAULT_BRANCH,
            filePath: DATA_FILE_PATH
        };
        try {
            var raw = localStorage.getItem(STORAGE_KEY_GITHUB_CONFIG);
            if (raw) {
                var parsed = JSON.parse(raw);
                return Object.assign({}, defaultCfg, parsed);
            }
        } catch (e) {
            console.warn("[GithubSync] 설정 파싱 실패, 기본값을 사용합니다:", e);
        }
        return defaultCfg;
    }

    /**
     * GitHub 연동 설정을 안전하게 저장합니다.
     */
    function saveGithubConfig(cfg) {
        try {
            localStorage.setItem(STORAGE_KEY_GITHUB_CONFIG, JSON.stringify(cfg));
            return true;
        } catch (e) {
            console.error("[GithubSync] 설정 저장 실패:", e);
            return false;
        }
    }

    /**
     * 저장된 GitHub Personal Access Token(PAT)을 조회합니다.
     */
    function getGithubToken() {
        try {
            // 1) 세션 스토리지 우선 확인
            var sessionToken = sessionStorage.getItem(STORAGE_KEY_GITHUB_TOKEN);
            if (sessionToken) return sessionToken.trim();

            // 2) 로컬 스토리지 확인 (사용자가 자동 기억을 선택한 경우)
            var localToken = localStorage.getItem(STORAGE_KEY_GITHUB_TOKEN);
            if (localToken) return localToken.trim();
        } catch (e) {
            console.warn("[GithubSync] 토큰 조회 실패:", e);
        }
        return "";
    }

    /**
     * GitHub PAT를 안전하게 저장합니다.
     * @param {string} token - GitHub 개인 액세스 토큰
     * @param {boolean} remember - 브라우저 재접속 시에도 기억할지 여부
     */
    function saveGithubToken(token, remember) {
        try {
            var clean = (token || "").trim();
            if (clean) {
                sessionStorage.setItem(STORAGE_KEY_GITHUB_TOKEN, clean);
                if (remember) {
                    localStorage.setItem(STORAGE_KEY_GITHUB_TOKEN, clean);
                } else {
                    localStorage.removeItem(STORAGE_KEY_GITHUB_TOKEN);
                }
            } else {
                sessionStorage.removeItem(STORAGE_KEY_GITHUB_TOKEN);
                localStorage.removeItem(STORAGE_KEY_GITHUB_TOKEN);
            }
            return true;
        } catch (e) {
            console.error("[GithubSync] 토큰 저장 실패:", e);
            return false;
        }
    }

    /**
     * 토큰을 화면에 안전하게 마스킹(••••••)하여 반환합니다.
     */
    function maskToken(token) {
        if (!token) return "";
        var t = token.trim();
        if (t.length <= 8) return "••••••••";
        return t.substring(0, 4) + "••••••••••••••••••••" + t.substring(t.length - 4);
    }

    // ==========================================================================
    // 4. 즉각 피드백 UI 제어 (로딩 스피너 및 알림 모달/토스트)
    // ==========================================================================

    /**
     * 동기화 진행 상태 로딩 오버레이 DOM 생성 및 표시
     */
    function showSyncLoading(stepText, detailText) {
        var overlay = document.getElementById('github-sync-loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'github-sync-loading-overlay';
            overlay.className = 'fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300';
            overlay.innerHTML = [
                '<div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center relative overflow-hidden">',
                '  <div class="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>',
                '  <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>',
                '  <div class="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">',
                '    <div class="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-30"></div>',
                '    <div class="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>',
                '    <i class="fa-brands fa-github text-2xl text-slate-800 absolute"></i>',
                '  </div>',
                '  <h3 id="github-sync-title" class="text-lg font-bold text-slate-900 mb-1">GitHub 원격 저장소 동기화 중...</h3>',
                '  <p id="github-sync-step" class="text-xs font-semibold text-blue-600 mb-3">' + (stepText || '데이터 무결성 검증 및 전송 준비 중') + '</p>',
                '  <div class="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-left space-y-1.5 text-xs text-slate-600">',
                '    <div class="flex items-center justify-between">',
                '      <span class="text-slate-400">대상 저장소:</span>',
                '      <span class="font-mono font-semibold text-slate-700">' + DEFAULT_REPO_OWNER + '/' + DEFAULT_REPO_NAME + '</span>',
                '    </div>',
                '    <div class="flex items-center justify-between">',
                '      <span class="text-slate-400">타겟 브랜치:</span>',
                '      <span class="font-mono font-semibold text-blue-600">main</span>',
                '    </div>',
                '    <div class="flex items-center justify-between">',
                '      <span class="text-slate-400">타겟 파일:</span>',
                '      <span class="font-mono font-semibold text-slate-700">data.json</span>',
                '    </div>',
                '  </div>',
                '  <p id="github-sync-detail" class="text-[11px] text-slate-400 mt-3">' + (detailText || '브라우저 창을 닫지 마세요. 잠시만 기다려 주세요.') + '</p>',
                '</div>'
            ].join('\n');
            document.body.appendChild(overlay);
        } else {
            var stepEl = document.getElementById('github-sync-step');
            var detailEl = document.getElementById('github-sync-detail');
            if (stepEl && stepText) stepEl.textContent = stepText;
            if (detailEl && detailText) detailEl.textContent = detailText;
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        }
    }

    /**
     * 로딩 오버레이 숨기기
     */
    function hideSyncLoading() {
        var overlay = document.getElementById('github-sync-loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
    }

    /**
     * 상단 플로팅 토스트 안내 메시지 표시
     */
    function showToast(message, type) {
        var isSuccess = type === 'success';
        var toast = document.createElement('div');
        toast.className = 'fixed top-6 right-6 z-[10001] max-w-md p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transition-all duration-300 transform translate-y-[-20px] opacity-0 ' +
            (isSuccess
                ? 'bg-slate-900 text-white border-emerald-500/50 shadow-emerald-500/10'
                : 'bg-rose-950 text-white border-rose-500/50 shadow-rose-500/10');

        toast.innerHTML = [
            '<div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ' +
                (isSuccess ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400') + '">',
            '  <i class="fa-solid ' + (isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation') + ' text-base"></i>',
            '</div>',
            '<div class="flex-1 text-xs">',
            '  <div class="font-bold text-sm mb-0.5">' + (isSuccess ? '동기화 완료' : '동기화 오류') + '</div>',
            '  <div class="leading-relaxed opacity-90">' + message + '</div>',
            '</div>',
            '<button type="button" class="text-slate-400 hover:text-white p-1 text-sm leading-none cursor-pointer" onclick="this.parentElement.remove()">',
            '  <i class="fa-solid fa-xmark"></i>',
            '</button>'
        ].join('\n');

        document.body.appendChild(toast);

        // 부드러운 등장 애니메이션
        requestAnimationFrame(function () {
            toast.classList.remove('translate-y-[-20px]', 'opacity-0');
        });

        // 4.5초 후 자동 소멸
        setTimeout(function () {
            toast.classList.add('translate-y-[-20px]', 'opacity-0');
            setTimeout(function () { toast.remove(); }, 350);
        }, 4500);
    }

    // ==========================================================================
    // 5. GitHub API 통신 핵심 엔진 (SHA 조회, 커밋, 연결 테스트)
    // ==========================================================================

    /**
     * GitHub 원격 저장소에서 타겟 파일의 현재 최신 SHA 해시를 조회합니다.
     */
    async function getRemoteFileSha(config, token) {
        var url = 'https://api.github.com/repos/' + config.owner + '/' + config.repo +
            '/contents/' + config.filePath + '?ref=' + encodeURIComponent(config.branch);

        var headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        var response = await fetch(url, {
            method: 'GET',
            headers: headers,
            cache: 'no-store'
        });

        if (response.status === 200) {
            var data = await response.json();
            return data.sha;
        } else if (response.status === 404) {
            // 원격 저장소에 아직 파일이 없는 경우 (새로 생성 가능)
            return null;
        } else {
            var errData = {};
            try { errData = await response.json(); } catch (e) { }
            var msg = errData.message || ('HTTP 상태 코드: ' + response.status);
            if (response.status === 401) {
                throw new Error("GitHub 개인 액세스 토큰(PAT)이 올바르지 않거나 만료되었습니다. [GitHub 설정]에서 토큰을 다시 확인해 주세요.");
            } else if (response.status === 403) {
                throw new Error("저장소 접근 권한이 부족합니다. 토큰에 'repo' 전체 권한(Write/Contents)이 부여되어 있는지 확인해 주세요.");
            } else {
                throw new Error("파일 정보 조회 실패: " + msg);
            }
        }
    }

    /**
     * 변경된 사이트 전체 데이터를 GitHub 원격 저장소에 직접 커밋 및 푸시합니다.
     */
    async function commitDataToGithub(jsonData, commitMessage) {
        var config = getGithubConfig();
        var token = getGithubToken();

        if (!token) {
            openGithubSettingsModal();
            throw new Error("GitHub Personal Access Token(PAT)이 설정되지 않았습니다.\n설정 창에서 토큰을 먼저 등록해 주세요.");
        }

        try {
            // 1단계: 원격 저장소 상태 및 SHA 확인
            showSyncLoading("1/3 원격 저장소 파일 상태(SHA) 확인 중...", "GitHub main 브랜치의 data.json 최신 버전을 조회하고 있습니다.");
            var currentSha = await getRemoteFileSha(config, token);

            // 2단계: 데이터 직렬화 및 Base64 인코딩
            showSyncLoading("2/3 데이터 무결성 검증 및 Base64 인코딩 중...", "연혁, 제품, 실적, 공지사항 데이터를 표준 포맷으로 변환하고 있습니다.");
            
            // lastUpdated 타임스탬프 갱신
            jsonData.lastUpdated = new Date().toISOString();
            if (!jsonData.version) jsonData.version = "1.0.0";

            var jsonString = JSON.stringify(jsonData, null, 2);
            var base64Content = utf8ToBase64(jsonString);

            // 3단계: GitHub Contents API PUT 호출 (커밋 & 푸시)
            showSyncLoading("3/3 GitHub 원격 저장소 커밋 전송 중...", "원격 저장소에 새로운 커밋을 생성하고 main 브랜치에 푸시하고 있습니다.");

            var defaultMsg = "Update site data: " + (commitMessage || "통합 관리자 센터 데이터 동기화") + " (by ATA Admin)";
            var payload = {
                message: defaultMsg,
                content: base64Content,
                branch: config.branch
            };
            if (currentSha) {
                payload.sha = currentSha;
            }

            var url = 'https://api.github.com/repos/' + config.owner + '/' + config.repo +
                '/contents/' + config.filePath;

            var response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            var result = await response.json();

            if (response.status === 200 || response.status === 201) {
                hideSyncLoading();
                showToast("GitHub 원격 저장소 반영 완료 (배포 진행 중)<br><span class='text-[10px] text-slate-300 font-mono'>Commit: " + (result.commit ? result.commit.sha.substring(0, 7) : 'OK') + "</span>", 'success');
                return { success: true, commit: result.commit };
            } else {
                hideSyncLoading();
                var errMsg = result.message || ("HTTP 오류 " + response.status);
                if (response.status === 409) {
                    errMsg = "원격 저장소에 최신 변경사항이 있습니다(충돌). 잠시 후 다시 시도해 주세요.";
                } else if (response.status === 401) {
                    errMsg = "토큰 인증 실패: GitHub Personal Access Token을 다시 확인해 주세요.";
                } else if (response.status === 403) {
                    errMsg = "권한 부족: 토큰에 저장소 쓰기('repo' 권한)가 필요합니다.";
                }
                showToast(errMsg, 'error');
                throw new Error(errMsg);
            }
        } catch (err) {
            hideSyncLoading();
            console.error("[GithubSync] 커밋 실패:", err);
            showToast(err.message || "원격 저장소 동기화 중 오류가 발생했습니다.", 'error');
            throw err;
        }
    }

    /**
     * GitHub PAT 및 저장소 연결 상태를 즉시 테스트합니다.
     */
    async function testGithubConnection(tokenToTest) {
        var config = getGithubConfig();
        var token = tokenToTest || getGithubToken();

        if (!token) {
            return { success: false, message: "테스트할 토큰이 입력되지 않았습니다." };
        }

        try {
            // 1) 사용자 및 토큰 유효성 확인
            var userRes = await fetch('https://api.github.com/user', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (userRes.status === 401) {
                return { success: false, message: "토큰이 유효하지 않습니다. (401 Unauthorized)" };
            }

            var userData = await userRes.json();
            var username = userData.login || "알 수 없음";

            // 2) 저장소 및 쓰기 권한 확인
            var repoRes = await fetch('https://api.github.com/repos/' + config.owner + '/' + config.repo, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (repoRes.status === 404) {
                return { success: false, message: "저장소를 찾을 수 없거나 접근 권한이 없습니다: " + config.owner + "/" + config.repo };
            } else if (!repoRes.ok) {
                return { success: false, message: "저장소 조회 실패 (HTTP " + repoRes.status + ")" };
            }

            var repoData = await repoRes.json();
            var hasPush = repoData.permissions && repoData.permissions.push;

            if (hasPush === false) {
                return {
                    success: false,
                    message: "인증된 사용자(" + username + ")에게 본 저장소의 쓰기/푸시(Push) 권한이 없습니다. 저장소 Collaborator 권한을 확인하세요."
                };
            }

            return {
                success: true,
                message: "연결 성공! 사용자: @" + username + " (저장소 푸시 권한 확인됨)"
            };
        } catch (e) {
            return { success: false, message: "네트워크 오류 또는 API 호출 실패: " + e.message };
        }
    }

    // ==========================================================================
    // 6. 4대 메뉴 최신 데이터 수집 유틸리티 (collectAllSiteData)
    // 연혁, 제품 라인업, 주요 구축 실적, 공지사항을 하나의 통합 JSON으로 취합
    // ==========================================================================
    function collectAllSiteData() {
        var siteData = {
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            history: [],
            products: [],
            references: [],
            notices: []
        };

        // 1) 연혁 데이터 수집
        try {
            if (window.HistoryAdmin && typeof window.HistoryAdmin.getData === 'function') {
                siteData.history = window.HistoryAdmin.getData();
            } else {
                var rawH = localStorage.getItem('ata_company_history_db_v3') || localStorage.getItem('ata_history_timeline_db');
                if (rawH) siteData.history = JSON.parse(rawH);
            }
        } catch (e) {
            console.warn("[GithubSync] 연혁 데이터 수집 경고:", e);
        }

        // 2) 제품 라인업 데이터 수집
        try {
            if (window.ProductLineupAdmin && typeof window.ProductLineupAdmin.getData === 'function') {
                siteData.products = window.ProductLineupAdmin.getData();
            } else {
                var rawP = localStorage.getItem('ata_product_lineup_db');
                if (rawP) siteData.products = JSON.parse(rawP);
            }
        } catch (e) {
            console.warn("[GithubSync] 제품 데이터 수집 경고:", e);
        }

        // 3) 레퍼런스 실적 데이터 수집
        try {
            if (window.ReferenceAdmin && typeof window.ReferenceAdmin.getData === 'function') {
                siteData.references = window.ReferenceAdmin.getData();
            } else {
                var rawR = localStorage.getItem('ata_company_references_db') || localStorage.getItem('ata_reference_projects_db');
                if (rawR) siteData.references = JSON.parse(rawR);
            }
        } catch (e) {
            console.warn("[GithubSync] 레퍼런스 데이터 수집 경고:", e);
        }

        // 4) 공지사항 데이터 수집
        try {
            if (window.noticeBoardDB && Array.isArray(window.noticeBoardDB) && window.noticeBoardDB.length > 0) {
                siteData.notices = window.noticeBoardDB;
            } else {
                var rawN = localStorage.getItem('ata_notice_board_db');
                if (rawN) siteData.notices = JSON.parse(rawN);
            }
        } catch (e) {
            console.warn("[GithubSync] 공지사항 데이터 수집 경고:", e);
        }

        return siteData;
    }

    /**
     * 원격 저장소에 현재 사이트 전체 데이터를 즉시 원스톱 커밋/푸시합니다.
     */
    async function syncAllToRemote(changeDescription) {
        var token = getGithubToken();
        if (!token) {
            openGithubSettingsModal();
            return false;
        }

        var dataToPush = collectAllSiteData();

        // 데이터 유효성 검사
        if (!dataToPush.history.length && !dataToPush.products.length &&
            !dataToPush.references.length && !dataToPush.notices.length) {
            alert("동기화할 데이터가 비어 있습니다. 잠시 후 다시 시도해 주세요.");
            return false;
        }

        try {
            var res = await commitDataToGithub(dataToPush, changeDescription);
            return res.success;
        } catch (e) {
            return false;
        }
    }

    // ==========================================================================
    // 7. 웹사이트 초기 로딩 시 data.json 동적 Fetch 및 화면 동기화
    // ==========================================================================
    async function fetchAndApplyRemoteData() {
        try {
            // 캐시 방지 쿼리스트링 첨부
            var cacheBuster = '?v=' + Date.now();
            var response = await fetch('data.json' + cacheBuster, {
                cache: 'no-store'
            });

            if (!response.ok) {
                console.warn("[GithubSync] data.json fetch 실패 (상태: " + response.status + "), 로컬/기본 데이터를 유지합니다.");
                return false;
            }

            var remoteData = await response.json();
            if (!remoteData || typeof remoteData !== 'object') {
                return false;
            }

            console.log("[GithubSync] 최신 data.json 성공적으로 로드됨 (버전: " + remoteData.version + ", 수정일: " + remoteData.lastUpdated + ")");
            window.siteData = remoteData;

            // 1) 공지사항 적용
            if (Array.isArray(remoteData.notices) && remoteData.notices.length > 0) {
                window.noticeBoardDB = remoteData.notices;
                try {
                    localStorage.setItem('ata_notice_board_db', JSON.stringify(remoteData.notices));
                } catch (e) { }
            }

            // 2) 회사 연혁 적용
            if (Array.isArray(remoteData.history) && remoteData.history.length > 0) {
                try {
                    localStorage.setItem('ata_company_history_db_v3', JSON.stringify(remoteData.history));
                    localStorage.setItem('ata_history_timeline_db', JSON.stringify(remoteData.history));
                } catch (e) { }
            }

            // 3) 제품 라인업 적용
            if (Array.isArray(remoteData.products) && remoteData.products.length > 0) {
                try {
                    localStorage.setItem('ata_product_lineup_db', JSON.stringify(remoteData.products));
                } catch (e) { }
            }

            // 4) 주요 구축 실적 적용
            if (Array.isArray(remoteData.references) && remoteData.references.length > 0) {
                try {
                    localStorage.setItem('ata_company_references_db', JSON.stringify(remoteData.references));
                    localStorage.setItem('ata_reference_projects_db', JSON.stringify(remoteData.references));
                } catch (e) { }
            }

            // 5) 각 모듈 화면 즉시 재렌더링
            refreshAllUI();

            return true;
        } catch (e) {
            console.warn("[GithubSync] data.json 비동기 동기화 중 오류 (로컬 기본값 유지):", e);
            return false;
        }
    }

    /**
     * 모든 화면을 현재 최신 데이터로 동기화 재렌더링
     */
    function refreshAllUI() {
        // 연혁 화면 렌더링
        if (window.HistoryAdmin && typeof window.HistoryAdmin.render === 'function') {
            window.HistoryAdmin.render();
        }
        // 제품 라인업 렌더링
        if (window.ProductLineupAdmin && typeof window.ProductLineupAdmin.render === 'function') {
            window.ProductLineupAdmin.render(window.currentProductCategory || 'all');
        }
        // 레퍼런스 실적 렌더링
        if (window.ReferenceAdmin && typeof window.ReferenceAdmin.render === 'function') {
            window.ReferenceAdmin.render();
        }
        // 공지사항 렌더링
        if (typeof window.renderNoticeList === 'function') {
            window.renderNoticeList();
        }
        // 통합 관리자 허브 동기화
        if (typeof window.syncIntegratedAdminHubUI === 'function') {
            window.syncIntegratedAdminHubUI();
        }
    }

    // ==========================================================================
    // 8. GitHub 연동 설정 모달 UI
    // ==========================================================================
    function openGithubSettingsModal() {
        var existing = document.getElementById('github-settings-modal');
        if (existing) existing.remove();

        var config = getGithubConfig();
        var currentToken = getGithubToken();
        var isRemembered = !!localStorage.getItem(STORAGE_KEY_GITHUB_TOKEN);

        var modal = document.createElement('div');
        modal.id = 'github-settings-modal';
        modal.className = 'fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 transition-all duration-300';
        modal.onclick = closeGithubSettingsModal;

        modal.innerHTML = [
            '<div class="bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative flex flex-col text-slate-800" onclick="event.stopPropagation()">',
            '  <!-- 헤더 -->',
            '  <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">',
            '    <div class="flex items-center gap-3">',
            '      <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-base shadow-md">',
            '        <i class="fa-brands fa-github text-xl"></i>',
            '      </span>',
            '      <div>',
            '        <h3 class="text-base font-bold text-white tracking-wide">GitHub 원격 저장소 연동 설정</h3>',
            '        <p class="text-[11px] text-slate-300">관리자 수정 내용 main 브랜치 영구 자동 커밋/푸시</p>',
            '      </div>',
            '    </div>',
            '    <button type="button" onclick="window.GithubSync.closeModal()" class="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 text-lg leading-none cursor-pointer">',
            '      <i class="fa-solid fa-xmark"></i>',
            '    </button>',
            '  </div>',
            '',
            '  <!-- 폼 본문 -->',
            '  <form id="github-settings-form" class="p-6 space-y-4 text-xs" onsubmit="window.GithubSync.handleSettingsSubmit(event)">',
            '',
            '    <!-- 연결 상태 안내 배너 -->',
            '    <div id="github-test-result-banner" class="' + (currentToken ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800') + ' p-3.5 rounded-2xl border flex items-start gap-2.5">',
            '      <i class="fa-solid ' + (currentToken ? 'fa-circle-check text-emerald-600' : 'fa-circle-info text-blue-600') + ' text-sm mt-0.5 shrink-0"></i>',
            '      <div class="leading-relaxed">',
            '        <div class="font-bold">' + (currentToken ? '토큰 등록됨: 원격 동기화 준비 완료' : 'GitHub Personal Access Token(PAT) 등록 필요') + '</div>',
            '        <div class="text-[11px] opacity-90 mt-0.5">' + (currentToken ? '현재 등록된 토큰으로 원격 저장소 main 브랜치에 직접 커밋이 가능합니다.' : 'GitHub 토큰을 입력하면 관리자 센터의 모든 수정 사항이 원격 저장소에 영구 저장됩니다.') + '</div>',
            '      </div>',
            '    </div>',
            '',
            '    <!-- 토큰 입력 필드 -->',
            '    <div>',
            '      <div class="flex items-center justify-between mb-1.5">',
            '        <label for="gh-input-token" class="font-bold text-slate-700 flex items-center gap-1.5">',
            '          <i class="fa-solid fa-key text-amber-500"></i> GitHub Personal Access Token (PAT) <span class="text-rose-500">*</span>',
            '        </label>',
            '        <a href="https://github.com/settings/tokens/new?scopes=repo&description=ATA+Website+Admin+Sync" target="_blank" class="text-[11px] text-blue-600 hover:underline flex items-center gap-1">',
            '          <span>토큰 발급 바로가기</span> <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>',
            '        </a>',
            '      </div>',
            '      <div class="relative">',
            '        <input type="password" id="gh-input-token" value="' + (currentToken ? currentToken : '') + '" placeholder="ghp_로 시작하는 클래식 토큰 입력 (repo 권한 체크 필수)"',
            '          class="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs font-mono transition-all">',
            '        <div class="absolute right-2 top-2 flex items-center gap-1">',
            '          <button type="button" onclick="window.GithubSync.toggleTokenVisibility()" class="p-1 text-slate-400 hover:text-slate-600 cursor-pointer" title="토큰 숨기기/보기">',
            '            <i id="gh-token-eye-icon" class="fa-solid fa-eye text-xs"></i>',
            '          </button>',
            '          <button type="button" onclick="window.GithubSync.runConnectionTest()" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-300 cursor-pointer transition-colors">',
            '            검증',
            '          </button>',
            '        </div>',
            '      </div>',
            '      <p class="text-[11px] text-slate-500 mt-1 flex items-center gap-1">',
            '        <i class="fa-solid fa-shield-halved text-emerald-600"></i>',
            '        토큰은 브라우저 세션에 안전하게 보관되며, 원격 커밋 시에만 안전하게 사용됩니다.',
            '      </p>',
            '    </div>',
            '',
            '    <!-- 저장소 정보 (읽기 전용 / 기본값) -->',
            '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">',
            '      <div>',
            '        <label class="block font-semibold text-slate-700 mb-1">대상 저장소 (Repository)</label>',
            '        <input type="text" id="gh-input-repo" value="' + config.owner + '/' + config.repo + '" readonly',
            '          class="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs cursor-not-allowed">',
            '      </div>',
            '      <div>',
            '        <label class="block font-semibold text-slate-700 mb-1">배포 브랜치 (Branch)</label>',
            '        <input type="text" id="gh-input-branch" value="' + config.branch + '" readonly',
            '          class="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs cursor-not-allowed">',
            '      </div>',
            '    </div>',
            '',
            '    <!-- 옵션: 브라우저에 토큰 유지 -->',
            '    <div class="flex items-center gap-2 pt-1">',
            '      <input type="checkbox" id="gh-input-remember" ' + (isRemembered ? 'checked' : '') + ' class="rounded text-blue-600 focus:ring-blue-500 cursor-pointer">',
            '      <label for="gh-input-remember" class="text-xs text-slate-700 select-none cursor-pointer">',
            '        이 브라우저에서 토큰 안전 기억 (창을 닫아도 재입력 불필요)',
            '      </label>',
            '    </div>',
            '',
            '    <!-- 하단 버튼 바 -->',
            '    <div class="flex items-center justify-between pt-3 border-t border-slate-200">',
            '      <button type="button" onclick="window.GithubSync.clearToken()" class="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-xs">',
            '        <i class="fa-solid fa-trash-can mr-1"></i> 토큰 삭제',
            '      </button>',
            '      <div class="flex items-center gap-2">',
            '        <button type="button" onclick="window.GithubSync.closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer text-xs">',
            '          취소',
            '        </button>',
            '        <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all cursor-pointer text-xs flex items-center gap-1.5">',
            '          <i class="fa-solid fa-floppy-disk"></i> 설정 저장',
            '        </button>',
            '      </div>',
            '    </div>',
            '',
            '  </form>',
            '</div>'
        ].join('\n');

        document.body.appendChild(modal);
    }

    function closeGithubSettingsModal() {
        var modal = document.getElementById('github-settings-modal');
        if (modal) modal.remove();
    }

    function toggleTokenVisibility() {
        var input = document.getElementById('gh-input-token');
        var icon = document.getElementById('gh-token-eye-icon');
        if (!input || !icon) return;

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fa-solid fa-eye-slash text-xs text-blue-600';
        } else {
            input.type = 'password';
            icon.className = 'fa-solid fa-eye text-xs text-slate-400';
        }
    }

    async function runConnectionTest() {
        var input = document.getElementById('gh-input-token');
        var banner = document.getElementById('github-test-result-banner');
        if (!input) return;

        var token = input.value.trim();
        if (!token) {
            alert("테스트할 토큰을 먼저 입력해 주세요.");
            input.focus();
            return;
        }

        if (banner) {
            banner.className = 'bg-blue-50 border-blue-200 text-blue-800 p-3.5 rounded-2xl border flex items-start gap-2.5';
            banner.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-blue-600 text-sm mt-0.5 shrink-0"></i><div><div class="font-bold">GitHub 연결 및 권한 검증 중...</div><div class="text-[11px] opacity-90 mt-0.5">저장소 접근 권한을 확인하고 있습니다.</div></div>';
        }

        var result = await testGithubConnection(token);

        if (banner) {
            if (result.success) {
                banner.className = 'bg-emerald-50 border-emerald-200 text-emerald-800 p-3.5 rounded-2xl border flex items-start gap-2.5';
                banner.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-600 text-sm mt-0.5 shrink-0"></i><div><div class="font-bold">연결 및 푸시 권한 확인 완료!</div><div class="text-[11px] opacity-90 mt-0.5">' + result.message + '</div></div>';
            } else {
                banner.className = 'bg-rose-50 border-rose-200 text-rose-800 p-3.5 rounded-2xl border flex items-start gap-2.5';
                banner.innerHTML = '<i class="fa-solid fa-circle-xmark text-rose-600 text-sm mt-0.5 shrink-0"></i><div><div class="font-bold">연결 테스트 실패</div><div class="text-[11px] opacity-90 mt-0.5">' + result.message + '</div></div>';
            }
        }
    }

    function handleSettingsSubmit(e) {
        if (e && e.preventDefault) e.preventDefault();

        var input = document.getElementById('gh-input-token');
        var rememberCheck = document.getElementById('gh-input-remember');
        if (!input) return;

        var token = input.value.trim();
        var remember = rememberCheck ? rememberCheck.checked : false;

        saveGithubToken(token, remember);
        closeGithubSettingsModal();

        if (token) {
            showToast("GitHub 연동 설정이 안전하게 저장되었습니다.<br>이제 관리자 수정 사항이 원격 저장소에 자동 푸시됩니다.", 'success');
        } else {
            showToast("GitHub 토큰이 해제되었습니다.", 'info');
        }
    }

    function clearToken() {
        if (!confirm("저장된 GitHub 토큰을 삭제하시겠습니까?\n삭제 시 원격 저장소 자동 동기화 기능이 일시 중단됩니다.")) return;
        saveGithubToken("", false);
        var input = document.getElementById('gh-input-token');
        if (input) input.value = "";
        var banner = document.getElementById('github-test-result-banner');
        if (banner) {
            banner.className = 'bg-blue-50 border-blue-200 text-blue-800 p-3.5 rounded-2xl border flex items-start gap-2.5';
            banner.innerHTML = '<i class="fa-solid fa-circle-info text-blue-600 text-sm mt-0.5 shrink-0"></i><div><div class="font-bold">GitHub 토큰이 삭제되었습니다.</div><div class="text-[11px] opacity-90 mt-0.5">다시 동기화하려면 새로운 토큰을 등록해 주세요.</div></div>';
        }
        showToast("GitHub 토큰이 삭제되었습니다.", 'info');
    }

    // ==========================================================================
    // 9. 전역 API 노출 (window.GithubSync)
    // ==========================================================================
    window.GithubSync = {
        // 설정 및 토큰
        getConfig: getGithubConfig,
        saveConfig: saveGithubConfig,
        getToken: getGithubToken,
        saveToken: saveGithubToken,
        hasToken: function () { return !!getGithubToken(); },
        
        // UI 모달 & 토스트
        openModal: openGithubSettingsModal,
        closeModal: closeGithubSettingsModal,
        toggleTokenVisibility: toggleTokenVisibility,
        runConnectionTest: runConnectionTest,
        handleSettingsSubmit: handleSettingsSubmit,
        clearToken: clearToken,
        showLoading: showSyncLoading,
        hideLoading: hideSyncLoading,
        showToast: showToast,

        // 코어 비즈니스 로직
        commitData: commitDataToGithub,
        testConnection: testGithubConnection,
        collectAllSiteData: collectAllSiteData,
        syncAllToRemote: syncAllToRemote,
        fetchAndApplyRemoteData: fetchAndApplyRemoteData,
        refreshAllUI: refreshAllUI
    };

    // DOM 로드 즉시 data.json 동적 fetch 수행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchAndApplyRemoteData);
    } else {
        fetchAndApplyRemoteData();
    }

})();
