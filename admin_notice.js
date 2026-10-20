/**
 * ==============================================================================
 * (주)에이티에이기술 웹사이트 - 공지사항 관리자 인증 및 CRUD 관리 모듈 (admin_notice.js)
 * 
 * [주요 기능]
 * 1. 보안 암호화 (SHA-256): Web Crypto API를 통한 관리자 비밀번호 단방향 암호화
 * 2. 관리자 인증 시스템: 로그인, 세션 유지(SessionStorage), 비밀번호 변경, 로그아웃
 * 3. 공지사항 데이터 영구 보존(LocalStorage): 브라우저 로컬 저장소와 동기화
 * 4. 공지사항 CRUD: 신규 작성(Create), 읽기(Read), 수정(Update), 삭제(Delete)
 * 5. 직관적인 관리자 전용 UI: 에디터 모달, 수정/삭제 퀵 버튼, 관리자 상태 알림 배너
 * ==============================================================================
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. 상수 및 초기 설정 (보안 암호화 해시 포함)
    // ==========================================================================
    // 초기 관리자 아이디: admin
    // 초기 관리자 비밀번호: ata2026! (SHA-256 해시값으로 안전하게 저장됨)
    var DEFAULT_ADMIN_ID = "admin";
    var DEFAULT_PASSWORD_HASH = "74c1796b91e245d1597eb57229e0dc344083ab1fc902bb2f6b85c66c0b02c565";

    var STORAGE_KEY_NOTICES = "ata_notice_board_db";        // 공지사항 데이터 로컬스토리지 키
    var STORAGE_KEY_PW_HASH = "ata_admin_password_hash";   // 관리자 비밀번호 해시 로컬스토리지 키
    var SESSION_KEY_AUTH = "ata_admin_authenticated";      // 관리자 세션 로그인 여부

    // ==========================================================================
    // 2. SHA-256 암호화 함수 (Web Crypto API 기반 표준 암호화)
    // ==========================================================================
    /**
     * 문자열을 SHA-256으로 해시 변환하여 16진수 문자열로 반환하는 안전한 암호화 함수입니다.
     * @param {string} message - 암호화할 원본 비밀번호 문자열
     * @returns {Promise<string>} - 64자리 16진수 해시 문자열
     */
    async function sha256(message) {
        // 브라우저의 Web Crypto API 사용
        if (window.crypto && window.crypto.subtle) {
            var msgBuffer = new TextEncoder().encode(message);
            var hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
            var hashArray = Array.from(new Uint8Array(hashBuffer));
            var hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } else {
            // 구형 환경 폴백 (간이 해시)
            var hash = 0;
            for (var i = 0; i < message.length; i++) {
                hash = ((hash << 5) - hash) + message.charCodeAt(i);
                hash |= 0;
            }
            return String(hash);
        }
    }

    // ==========================================================================
    // 3. 관리자 인증 관리자 (AdminAuth)
    // ==========================================================================
    window.AdminAuth = {
        /**
         * 현재 브라우저 탭 세션에서 관리자로 로그인되어 있는지 확인합니다.
         */
        isLoggedIn: function () {
            try {
                return sessionStorage.getItem(SESSION_KEY_AUTH) === "true";
            } catch (e) {
                return false;
            }
        },

        /**
         * 저장된 비밀번호 해시를 가져옵니다. (없으면 기본 초기 비밀번호 해시 반환)
         */
        getStoredPasswordHash: function () {
            try {
                return localStorage.getItem(STORAGE_KEY_PW_HASH) || DEFAULT_PASSWORD_HASH;
            } catch (e) {
                return DEFAULT_PASSWORD_HASH;
            }
        },

        /**
         * 관리자 로그인을 시도합니다.
         * 입력받은 아이디와 암호화된 비밀번호 해시를 비교하여 일치하면 세션을 생성합니다.
         */
        login: async function (username, password) {
            if (!username || !password) {
                return { success: false, message: "아이디와 비밀번호를 모두 입력해 주세요." };
            }

            if (username.trim() !== DEFAULT_ADMIN_ID) {
                return { success: false, message: "관리자 아이디가 일치하지 않습니다." };
            }

            var inputHash = await sha256(password.trim());
            var storedHash = this.getStoredPasswordHash();

            if (inputHash === storedHash) {
                try {
                    sessionStorage.setItem(SESSION_KEY_AUTH, "true");
                } catch (e) {
                    console.warn("SessionStorage access error:", e);
                }
                // 회사 연혁 관리자 UI 실시간 동기화
                if (window.HistoryAdmin && typeof window.HistoryAdmin.render === 'function') {
                    window.HistoryAdmin.render();
                }
                // 주요 구축 실적(Reference) 관리자 UI 실시간 동기화
                if (window.ReferenceAdmin && typeof window.ReferenceAdmin.render === 'function') {
                    window.ReferenceAdmin.render();
                }
                return { success: true };
            } else {
                return { success: false, message: "비밀번호가 일치하지 않습니다. 다시 확인해 주세요." };
            }
        },

        /**
         * 관리자 로그아웃을 수행합니다.
         */
        logout: function () {
            try {
                sessionStorage.removeItem(SESSION_KEY_AUTH);
            } catch (e) {
                console.warn(e);
            }
            // 회사 연혁 관리자 UI 실시간 동기화
            if (window.HistoryAdmin && typeof window.HistoryAdmin.render === 'function') {
                window.HistoryAdmin.render();
            }
            // 주요 구축 실적(Reference) 관리자 UI 실시간 동기화
            if (window.ReferenceAdmin && typeof window.ReferenceAdmin.render === 'function') {
                window.ReferenceAdmin.render();
            }
        },

        /**
         * 관리자 비밀번호를 안전하게 변경합니다.
         */
        changePassword: async function (currentPassword, newPassword) {
            var currentHash = await sha256(currentPassword.trim());
            var storedHash = this.getStoredPasswordHash();

            if (currentHash !== storedHash) {
                return { success: false, message: "현재 비밀번호가 일치하지 않습니다." };
            }

            if (!newPassword || newPassword.trim().length < 6) {
                return { success: false, message: "새 비밀번호는 최소 6자 이상으로 설정해 주세요." };
            }

            var newHash = await sha256(newPassword.trim());
            try {
                localStorage.setItem(STORAGE_KEY_PW_HASH, newHash);
                return { success: true, message: "비밀번호가 안전하게 변경되었습니다." };
            } catch (e) {
                return { success: false, message: "저장소 오류가 발생했습니다: " + e.message };
            }
        }
    };

    // ==========================================================================
    // 4. 공지사항 데이터 저장소 관리자 (NoticeStore)
    // ==========================================================================
    window.NoticeStore = {
        /**
         * 로컬스토리지에서 공지사항 데이터를 불러와 `window.noticeBoardDB`에 동기화합니다.
         * 만약 로컬스토리지에 기존 데이터가 없으면 초기 DB를 저장하고,
         * 기존 데이터가 있더라도 기본 DB에 새로 추가된 필수 공지사항(특허, 인증, 수상 등)이 누락되지 않도록 지능적으로 병합합니다.
         */
        init: function () {
            try {
                var stored = localStorage.getItem(STORAGE_KEY_NOTICES);
                var defaultDB = (window.noticeBoardDB && Array.isArray(window.noticeBoardDB)) ? window.noticeBoardDB : [];

                // 레거시 묶음 공지 ID 목록 (개별 분리 게시로 대체된 구형 ID 정리)
                var legacyIds = ['notice-patent-core', 'notice-cert-comprehensive', 'notice-awards-honors', 'notice-004'];

                if (stored) {
                    var parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        // 1. 구형 묶음 공지사항 항목 제거
                        parsed = parsed.filter(function (p) {
                            return !legacyIds.includes(p.id);
                        });

                        // [핵심 버그 수정] 관리자가 수정한 공지사항(제목, 본문, 날짜, 고정여부)을 덮어쓰지 않고 최우선 영구 보존
                        // 최초 방문 이후 사용자의 로컬 수정/삭제 상태를 그대로 유지합니다.
                        // 핀 고정(pinned) 우선, 그 후 날짜 내림차순 정렬
                        parsed.sort(function (a, b) {
                            if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                            return (b.date || '').localeCompare(a.date || '');
                        });

                        window.noticeBoardDB = parsed;
                        this.save();
                        return;
                    }
                }

                if (defaultDB.length > 0) {
                    window.noticeBoardDB = defaultDB;
                    this.save();
                }
            } catch (e) {
                console.warn("NoticeStore init error:", e);
            }
        },

        /**
         * 공지사항 데이터를 최초 공식 기본 데이터베이스로 초기화/복원합니다.
         */
        resetToDefault: function () {
            if (!confirm("공지사항 목록을 공식 기본 데이터베이스로 복원하시겠습니까?\n(직접 작성하거나 수정한 사용자 공지사항이 초기화될 수 있습니다.)")) {
                return;
            }
            try {
                localStorage.removeItem(STORAGE_KEY_NOTICES);
                location.reload();
            } catch (e) {
                console.error("공지사항 초기화 실패:", e);
            }
        },

        /**
         * 현재 메모리의 `window.noticeBoardDB`를 로컬스토리지에 영구 저장합니다.
         */
        save: function () {
            try {
                if (window.noticeBoardDB) {
                    localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(window.noticeBoardDB));
                }
            } catch (e) {
                console.error("NoticeStore save error:", e);
            }
        },

        /**
         * 새로운 공지사항을 생성하여 상단에 추가합니다.
         */
        createNotice: function (data) {
            if (!window.noticeBoardDB) window.noticeBoardDB = [];

            // 고유 ID 생성 (notice-타임스탬프)
            var newId = "notice-" + Date.now();
            var todayStr = new Date().toISOString().split('T')[0];

            // 카테고리별 라벨 매핑
            var categoryLabels = {
                notice: { ko: "공지사항", en: "Notice", cn: "官方公告", ja: "お知らせ" },
                patent: { ko: "특허", en: "Patent", cn: "专利", ja: "特許" },
                cert: { ko: "인증", en: "Certification", cn: "资质认证", ja: "認証" },
                award: { ko: "수상 & 실적", en: "Awards & Honors", cn: "荣誉奖项", ja: "受賞・実績" },
                tech: { ko: "기술 & 솔루션", en: "Tech & Solutions", cn: "技术与方案", ja: "技術＆ソリューション" },
                press: { ko: "보도자료 & 행사", en: "Press & Events", cn: "新闻与展会", ja: "報道＆イベント" }
            };

            var defaultBadges = {
                patent: { ko: "특허", en: "PATENT", cn: "专利", ja: "特許" },
                cert: { ko: "인증", en: "CERT", cn: "认证", ja: "認証" },
                award: { ko: "수상", en: "AWARD", cn: "荣誉", ja: "受賞" },
                tech: { ko: "기술", en: "TECH", cn: "技术", ja: "技術" },
                press: { ko: "행사", en: "EVENT", cn: "展会", ja: "展示" },
                notice: { ko: "일반", en: "POST", cn: "普通", ja: "一般" }
            };

            var badgeTexts = data.pinned ? {
                ko: "중요",
                en: "NOTICE",
                cn: "置顶",
                ja: "重要"
            } : (defaultBadges[data.category] || defaultBadges.notice);

            var newNotice = {
                id: newId,
                pinned: !!data.pinned,
                category: data.category || "notice",
                date: data.date || todayStr,
                views: 0,
                badgeText: badgeTexts,
                categoryLabel: categoryLabels[data.category] || categoryLabels.notice,
                title: {
                    ko: data.titleKo || "",
                    en: data.titleEn || data.titleKo || "",
                    cn: data.titleCn || data.titleKo || "",
                    ja: data.titleJa || data.titleKo || ""
                },
                summary: {
                    ko: data.summaryKo || "",
                    en: data.summaryEn || data.summaryKo || "",
                    cn: data.summaryCn || data.summaryKo || "",
                    ja: data.summaryJa || data.summaryKo || ""
                },
                content: {
                    ko: data.contentKo || "",
                    en: data.contentEn || data.contentKo || "",
                    cn: data.contentCn || data.contentKo || "",
                    ja: data.contentJa || data.contentKo || ""
                },
                author: data.author || "주식회사 에이티에이기술 관리자"
            };

            // 목록의 맨 앞에 추가
            window.noticeBoardDB.unshift(newNotice);
            this.save();
            return newNotice;
        },

        /**
         * 기존 공지사항의 내용을 수정합니다.
         */
        updateNotice: function (id, data) {
            if (!window.noticeBoardDB) return null;

            var target = window.noticeBoardDB.find(n => n.id === id);
            if (!target) return null;

            var categoryLabels = {
                notice: { ko: "공지사항", en: "Notice", cn: "官方公告", ja: "お知らせ" },
                patent: { ko: "특허", en: "Patent", cn: "专利", ja: "特許" },
                cert: { ko: "인증", en: "Certification", cn: "资质认证", ja: "認証" },
                award: { ko: "수상 & 실적", en: "Awards & Honors", cn: "荣誉奖项", ja: "受賞・実績" },
                tech: { ko: "기술 & 솔루션", en: "Tech & Solutions", cn: "技术与方案", ja: "技術＆ソリューション" },
                press: { ko: "보도자료 & 행사", en: "Press & Events", cn: "新闻与展会", ja: "報道＆イベント" }
            };

            var defaultBadges = {
                patent: { ko: "특허", en: "PATENT", cn: "专利", ja: "特許" },
                cert: { ko: "인증", en: "CERT", cn: "认证", ja: "認証" },
                award: { ko: "수상", en: "AWARD", cn: "荣誉", ja: "受賞" },
                tech: { ko: "기술", en: "TECH", cn: "技术", ja: "技術" },
                press: { ko: "행사", en: "EVENT", cn: "展会", ja: "展示" },
                notice: { ko: "일반", en: "POST", cn: "普通", ja: "一般" }
            };

            target.pinned = !!data.pinned;
            target.category = data.category || target.category;
            target.categoryLabel = categoryLabels[target.category] || categoryLabels.notice;
            if (data.date) target.date = data.date;
            if (data.author) target.author = data.author;

            target.badgeText = target.pinned ? {
                ko: "중요",
                en: "NOTICE",
                cn: "置顶",
                ja: "重要"
            } : (defaultBadges[target.category] || defaultBadges.notice);

            // 제목 갱신
            if (!target.title) target.title = {};
            target.title.ko = data.titleKo || target.title.ko || "";
            target.title.en = data.titleEn || target.title.ko;
            target.title.cn = data.titleCn || target.title.ko;
            target.title.ja = data.titleJa || target.title.ko;

            // 요약 갱신
            if (!target.summary) target.summary = {};
            target.summary.ko = data.summaryKo || target.summary.ko || "";
            target.summary.en = data.summaryEn || target.summary.ko;
            target.summary.cn = data.summaryCn || target.summary.ko;
            target.summary.ja = data.summaryJa || target.summary.ko;

            // 본문 갱신
            if (!target.content) target.content = {};
            target.content.ko = data.contentKo || target.content.ko || "";
            target.content.en = data.contentEn || target.content.ko;
            target.content.cn = data.contentCn || target.content.ko;
            target.content.ja = data.contentJa || target.content.ko;

            this.save();
            return target;
        },

        /**
         * 공지사항을 삭제합니다.
         */
        deleteNotice: function (id) {
            if (!window.noticeBoardDB) return false;
            var initialLength = window.noticeBoardDB.length;
            window.noticeBoardDB = window.noticeBoardDB.filter(n => n.id !== id);
            var isDeleted = window.noticeBoardDB.length < initialLength;
            if (isDeleted) {
                this.save();
            }
            return isDeleted;
        },

        /**
         * 특정 ID의 공지사항 1건을 조회합니다.
         */
        getNoticeById: function (id) {
            if (!window.noticeBoardDB) return null;
            return window.noticeBoardDB.find(n => n.id === id) || null;
        }
    };

    // ==========================================================================
    // 5. 관리자 UI 인터랙션 및 모달 제어 함수
    // ==========================================================================

    /**
     * 관리자 로그인 모달 열기
     */
    window.openAdminLoginModal = function () {
        var modal = document.getElementById('admin-login-modal');
        var errBox = document.getElementById('admin-login-error');
        if (errBox) {
            errBox.textContent = "";
            errBox.classList.add('hidden');
        }
        var form = document.getElementById('admin-login-form');
        if (form) form.reset();

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(function () {
                var idInput = document.getElementById('admin-login-id');
                if (idInput) idInput.focus();
            }, 100);
        }
    };

    /**
     * 관리자 로그인 모달 닫기 (비밀번호 입력값 및 보기 상태 안전 초기화)
     */
    window.closeAdminLoginModal = function () {
        var modal = document.getElementById('admin-login-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        var pwInput = document.getElementById('admin-login-pw');
        if (pwInput) {
            pwInput.value = '';
            pwInput.type = 'password';
        }
        var icon = document.getElementById('admin-login-pw-toggle-icon');
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
        var errBox = document.getElementById('admin-login-error');
        if (errBox) errBox.classList.add('hidden');
    };

    /**
     * 관리자 로그인 모달의 비밀번호 보이기/숨기기 토글
     */
    window.toggleLoginPasswordVisibility = function () {
        var pwInput = document.getElementById('admin-login-pw');
        var icon = document.getElementById('admin-login-pw-toggle-icon');
        if (!pwInput) return;
        if (pwInput.type === 'password') {
            pwInput.type = 'text';
            if (icon) {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        } else {
            pwInput.type = 'password';
            if (icon) {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        }
    };

    /**
     * 관리자 로그인 폼 제출 처리
     */
    window.handleAdminLoginSubmit = async function (e) {
        if (e && e.preventDefault) e.preventDefault();

        var idInput = document.getElementById('admin-login-id');
        var pwInput = document.getElementById('admin-login-pw');
        var errBox = document.getElementById('admin-login-error');

        var username = idInput ? idInput.value.trim() : "";
        var password = pwInput ? pwInput.value.trim() : "";

        var result = await window.AdminAuth.login(username, password);

        if (result.success) {
            window.closeAdminLoginModal();
            window.refreshAdminUIState();
            alert("관리자 권한으로 성공적으로 로그인되었습니다.\n공지사항 작성, 수정, 삭제 기능이 활성화됩니다.");
        } else {
            if (errBox) {
                errBox.textContent = result.message;
                errBox.classList.remove('hidden');
            } else {
                alert(result.message);
            }
        }
    };

    /**
     * 관리자 로그아웃 실행
     */
    window.handleAdminLogout = function () {
        if (confirm("관리자 계정에서 로그아웃하시겠습니까?")) {
            window.AdminAuth.logout();
            window.refreshAdminUIState();
            alert("로그아웃되었습니다.");
        }
    };

    /**
     * 비밀번호 변경 모달 열기
     */
    window.openChangePasswordModal = function () {
        var modal = document.getElementById('admin-password-modal');
        var errBox = document.getElementById('admin-password-error');
        if (errBox) {
            errBox.textContent = "";
            errBox.classList.add('hidden');
        }
        var form = document.getElementById('admin-password-form');
        if (form) form.reset();

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    /**
     * 비밀번호 변경 모달 닫기
     */
    window.closeChangePasswordModal = function () {
        var modal = document.getElementById('admin-password-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    };

    /**
     * 비밀번호 변경 폼 제출 처리
     */
    window.handleChangePasswordSubmit = async function (e) {
        if (e && e.preventDefault) e.preventDefault();

        var oldPw = document.getElementById('admin-old-pw').value;
        var newPw = document.getElementById('admin-new-pw').value;
        var newPwConfirm = document.getElementById('admin-new-pw-confirm').value;
        var errBox = document.getElementById('admin-password-error');

        if (newPw !== newPwConfirm) {
            if (errBox) {
                errBox.textContent = "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.";
                errBox.classList.remove('hidden');
            }
            return;
        }

        var res = await window.AdminAuth.changePassword(oldPw, newPw);
        if (res.success) {
            alert(res.message);
            window.closeChangePasswordModal();
        } else {
            if (errBox) {
                errBox.textContent = res.message;
                errBox.classList.remove('hidden');
            } else {
                alert(res.message);
            }
        }
    };

    // ==========================================================================
    // 6. 공지사항 작성 & 수정 에디터 모달 제어
    // ==========================================================================
    var currentEditingNoticeId = null;

    /**
     * 공지사항 작성 또는 수정 모달 열기
     * @param {string|null} noticeId - 수정 시 공지 ID 전달, 신규 작성 시 null 또는 비움
     */
    window.openNoticeEditor = function (noticeId) {
        if (!window.AdminAuth.isLoggedIn()) {
            alert("관리자 로그인이 필요한 기능입니다.");
            window.openAdminLoginModal();
            return;
        }

        currentEditingNoticeId = noticeId || null;
        var modal = document.getElementById('notice-editor-modal');
        var modalTitle = document.getElementById('notice-editor-modal-title');
        var form = document.getElementById('notice-editor-form');

        if (form) form.reset();

        var todayStr = new Date().toISOString().split('T')[0];
        var dateInput = document.getElementById('notice-edit-date');
        if (dateInput) dateInput.value = todayStr;

        if (noticeId) {
            // 수정 모드: 기존 데이터 로드
            if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square text-cyan-400 mr-2"></i>공지사항 수정하기';
            var item = window.NoticeStore.getNoticeById(noticeId);
            if (item) {
                document.getElementById('notice-edit-category').value = item.category || 'notice';
                document.getElementById('notice-edit-pinned').checked = !!item.pinned;
                document.getElementById('notice-edit-date').value = item.date || todayStr;
                document.getElementById('notice-edit-author').value = item.author || "주식회사 에이티에이기술 관리자";
                document.getElementById('notice-edit-title-ko').value = (item.title && item.title.ko) || "";
                document.getElementById('notice-edit-summary-ko').value = (item.summary && item.summary.ko) || "";

                // 본문 HTML을 텍스트 줄바꿈 형태로 보기 좋게 변환 (간이 변환)
                var rawContent = (item.content && item.content.ko) || "";
                var cleanContent = rawContent
                    .replace(/<br\s*[\/]?>/gi, "\n")
                    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
                    .replace(/<[^>]+>/g, ""); // 태그 제거 후 텍스트만 추출하거나 원본 유지
                document.getElementById('notice-edit-content-ko').value = cleanContent || rawContent;
            }

            // 회사 연혁 동시 등록 체크박스 상태 (기존 연혁 연동 여부 확인)
            var syncHistoryCheckbox = document.getElementById('notice-edit-sync-history');
            if (syncHistoryCheckbox) {
                var isLinked = false;
                if (window.HistoryAdmin && typeof window.HistoryAdmin.hasNoticeMilestone === 'function') {
                    isLinked = window.HistoryAdmin.hasNoticeMilestone(noticeId);
                }
                syncHistoryCheckbox.checked = isLinked;
            }
        } else {
            // 신규 작성 모드
            if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-plus-circle text-cyan-400 mr-2"></i>새 공지사항 등록하기';
            document.getElementById('notice-edit-category').value = 'notice';
            document.getElementById('notice-edit-pinned').checked = false;
            document.getElementById('notice-edit-author').value = "주식회사 에이티에이기술 관리자";

            // 신규 등록 시 기본적으로 회사 연혁 동시 등록 체크
            var syncHistoryCheckboxNew = document.getElementById('notice-edit-sync-history');
            if (syncHistoryCheckboxNew) {
                syncHistoryCheckboxNew.checked = true;
            }
        }

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    /**
     * 공지사항 에디터 모달 닫기
     */
    window.closeNoticeEditor = function () {
        var modal = document.getElementById('notice-editor-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        currentEditingNoticeId = null;
    };

    /**
     * 공지사항 저장 (신규 등록 또는 수정 완료 + 회사 연혁 동시 자동 반영)
     */
    window.handleNoticeEditorSubmit = function (e) {
        if (e && e.preventDefault) e.preventDefault();

        var category = document.getElementById('notice-edit-category').value;
        var pinned = document.getElementById('notice-edit-pinned').checked;
        var date = document.getElementById('notice-edit-date').value;
        var author = document.getElementById('notice-edit-author').value.trim();
        var titleKo = document.getElementById('notice-edit-title-ko').value.trim();
        var summaryKo = document.getElementById('notice-edit-summary-ko').value.trim();
        var rawContent = document.getElementById('notice-edit-content-ko').value.trim();

        // 회사 연혁 동시 등록 체크박스 상태
        var syncToHistory = false;
        var syncHistoryCheckbox = document.getElementById('notice-edit-sync-history');
        if (syncHistoryCheckbox) {
            syncToHistory = syncHistoryCheckbox.checked;
        }

        if (!titleKo) {
            alert("공지사항 제목을 입력해 주세요.");
            return;
        }

        if (!rawContent) {
            alert("공지사항 상세 본문 내용을 입력해 주세요.");
            return;
        }

        // 입력된 본문 텍스트를 문단(<p>) 형태의 HTML로 자동 변환하여 정돈
        var paragraphs = rawContent.split(/\n\s*\n/);
        var formattedContentHtml = paragraphs.map(function (p) {
            var lineWithBreaks = p.trim().replace(/\n/g, '<br>');
            return '<p class="mb-4 text-base leading-relaxed text-slate-700">' + lineWithBreaks + '</p>';
        }).join('');

        var noticePayload = {
            category: category,
            pinned: pinned,
            date: date,
            author: author || "주식회사 에이티에이기술 관리자",
            titleKo: titleKo,
            summaryKo: summaryKo || (titleKo.substring(0, 80) + '...'),
            contentKo: formattedContentHtml
        };

        var historySyncRes = null;

        if (currentEditingNoticeId) {
            // 기존 공지 수정
            var updatedNotice = window.NoticeStore.updateNotice(currentEditingNoticeId, noticePayload);

            // 회사 연혁 동시 반영 또는 연결 해제 처리
            if (syncToHistory && window.HistoryAdmin && typeof window.HistoryAdmin.syncNoticeToHistory === 'function') {
                historySyncRes = window.HistoryAdmin.syncNoticeToHistory(updatedNotice || Object.assign({ id: currentEditingNoticeId }, noticePayload));
            } else if (!syncToHistory && window.HistoryAdmin && typeof window.HistoryAdmin.removeMilestoneByNoticeId === 'function') {
                window.HistoryAdmin.removeMilestoneByNoticeId(currentEditingNoticeId);
            }

            var syncMsg = (historySyncRes && historySyncRes.success)
                ? `\n(회사 연혁 ${historySyncRes.year}년 [${historySyncRes.month}] 마일스톤에도 동시 반영되었습니다.)`
                : '';
            alert("공지사항이 성공적으로 수정되었습니다." + syncMsg);
        } else {
            // 새 공지 등록
            var newNotice = window.NoticeStore.createNotice(noticePayload);

            // 회사 연혁 동시 반영
            if (syncToHistory && window.HistoryAdmin && typeof window.HistoryAdmin.syncNoticeToHistory === 'function') {
                historySyncRes = window.HistoryAdmin.syncNoticeToHistory(newNotice);
            }

            var syncMsg = (historySyncRes && historySyncRes.success)
                ? `\n(회사 연혁 ${historySyncRes.year}년 [${historySyncRes.month}] 마일스톤에도 동시 반영되었습니다.)`
                : '';
            alert("새 공지사항이 성공적으로 등록되었습니다." + syncMsg);
        }

        window.closeNoticeEditor();

        // 공지 목록 갱신 및 상세 모달 열려있으면 동기화
        if (typeof window.renderNoticeList === 'function') {
            window.renderNoticeList();
        }
        if (currentEditingNoticeId && typeof window.openNoticeDetail === 'function') {
            window.openNoticeDetail(currentEditingNoticeId);
        }
    };

    /**
     * 공지사항 삭제 처리 (연동된 연혁 마일스톤도 함께 정리)
     */
    window.handleDeleteNotice = function (noticeId, noticeTitle) {
        if (!window.AdminAuth.isLoggedIn()) {
            alert("관리자 로그인이 필요한 기능입니다.");
            window.openAdminLoginModal();
            return;
        }

        var confirmMsg = `정말 아래 공지사항을 삭제하시겠습니까?\n\n[제목]: ${noticeTitle || noticeId}\n\n※ 삭제 시 연동된 회사 연혁 마일스톤 항목도 함께 정리됩니다.`;
        if (confirm(confirmMsg)) {
            // 연관된 연혁 마일스톤 동시 삭제
            if (window.HistoryAdmin && typeof window.HistoryAdmin.removeMilestoneByNoticeId === 'function') {
                window.HistoryAdmin.removeMilestoneByNoticeId(noticeId);
            }

            var deleted = window.NoticeStore.deleteNotice(noticeId);
            if (deleted) {
                alert("공지사항이 성공적으로 삭제되었습니다.");
                if (typeof window.closeNoticeDetail === 'function') {
                    window.closeNoticeDetail();
                }
                if (typeof window.renderNoticeList === 'function') {
                    window.renderNoticeList();
                }
            } else {
                alert("삭제 처리 중 오류가 발생했습니다.");
            }
        }
    };

    // ==========================================================================
    // 7. 관리자 로그인 상태에 따른 UI 자동 동기화
    // ==========================================================================
    window.refreshAdminUIState = function () {
        var isAuth = window.AdminAuth.isLoggedIn();

        // 1. 공지사항 상단 관리자 컨트롤 바 업데이트
        var loginBtn = document.getElementById('notice-admin-login-btn');
        var adminPanel = document.getElementById('notice-admin-panel');

        if (loginBtn) {
            if (isAuth) {
                loginBtn.classList.add('hidden');
            } else {
                loginBtn.classList.remove('hidden');
            }
        }

        if (adminPanel) {
            if (isAuth) {
                adminPanel.classList.remove('hidden');
                adminPanel.classList.add('flex');
            } else {
                adminPanel.classList.add('hidden');
                adminPanel.classList.remove('flex');
            }
        }

        // 2. 공지사항 목록 재렌더링 (관리자 수정/삭제 버튼 노출 반영)
        if (typeof window.renderNoticeList === 'function') {
            window.renderNoticeList();
        }

        // 3. 공지사항 상세 모달 내 관리자 도구 버튼 상태 갱신
        var detailAdminActions = document.getElementById('notice-detail-admin-actions');
        if (detailAdminActions) {
            if (isAuth) {
                detailAdminActions.classList.remove('hidden');
                detailAdminActions.classList.add('flex');
            } else {
                detailAdminActions.classList.add('hidden');
                detailAdminActions.classList.remove('flex');
            }
        }

        // 4. 회사 연혁 및 주요 구축 실적(Reference) 관리자 UI 동기화
        if (window.HistoryAdmin && typeof window.HistoryAdmin.render === 'function') {
            window.HistoryAdmin.render();
        }
        if (window.ReferenceAdmin && typeof window.ReferenceAdmin.render === 'function') {
            window.ReferenceAdmin.render();
        }
    };

    // ==========================================================================
    // 8. 기존 renderNoticeList 함수 래핑 (관리자 전용 액션 버튼 주입)
    // ==========================================================================
    function setupNoticeRenderHook() {
        if (typeof window.renderNoticeList === 'function' && !window.renderNoticeList._adminHooked) {
            var originalRenderNoticeList = window.renderNoticeList;

            window.renderNoticeList = function (category, query, page) {
                // 기존 렌더링 함수 실행
                originalRenderNoticeList.apply(this, arguments);

                // 관리자로 로그인된 경우, 각 공지 카드에 [수정], [삭제] 퀵 버튼 추가 주입
                if (window.AdminAuth.isLoggedIn()) {
                    var container = document.getElementById('notice-list-container');
                    if (!container) return;

                    var articles = container.querySelectorAll('article');
                    articles.forEach(function (article) {
                        // article의 onclick에 들어있는 noticeId 추출
                        var onclickStr = article.getAttribute('onclick') || '';
                        var match = onclickStr.match(/openNoticeDetail\(['"]([^'"]+)['"]\)/);
                        if (!match || !match[1]) return;
                        var noticeId = match[1];

                        var item = window.NoticeStore.getNoticeById(noticeId);
                        var curLang = (typeof window.currentLanguage !== 'undefined') ? window.currentLanguage : 'ko';
                        var titleText = (item && item.title && (item.title[curLang] || item.title.ko)) || noticeId;
                        var safeTitle = titleText.replace(/"/g, '&quot;').replace(/'/g, "\\'");

                        // 기존에 이미 주입되었는지 확인
                        if (article.querySelector('.admin-card-actions')) return;

                        var actionsDiv = document.createElement('div');
                        actionsDiv.className = 'admin-card-actions flex items-center gap-1.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200';
                        actionsDiv.onclick = function (e) { e.stopPropagation(); }; // 카드 클릭 상세 열림 방지

                        actionsDiv.innerHTML = `
                            <button type="button" onclick="event.stopPropagation(); window.openNoticeEditor('${noticeId}')"
                                class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition-all flex items-center gap-1 cursor-pointer"
                                title="이 공지사항 수정">
                                <i class="fa-solid fa-pen-to-square text-[11px]"></i> 수정
                            </button>
                            <button type="button" onclick="event.stopPropagation(); window.handleDeleteNotice('${noticeId}', '${safeTitle}')"
                                class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
                                title="이 공지사항 삭제">
                                <i class="fa-solid fa-trash text-[11px]"></i> 삭제
                            </button>
                        `;

                        // 카드의 우측 정보 영역에 관리자 버튼 주입
                        var rightMeta = article.querySelector('div.flex.items-center.justify-between.md\\:justify-end');
                        if (rightMeta) {
                            rightMeta.insertBefore(actionsDiv, rightMeta.firstChild);
                        } else {
                            article.appendChild(actionsDiv);
                        }
                    });
                }
            };

            window.renderNoticeList._adminHooked = true;
        }
    }

    // ==========================================================================
    // 9. 초기화 및 리스너 등록
    // ==========================================================================
    function initModule() {
        window.NoticeStore.init();
        setupNoticeRenderHook();
        window.refreshAdminUIState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModule);
    } else {
        initModule();
    }

})();
