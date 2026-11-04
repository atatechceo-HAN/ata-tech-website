const fs = require('fs');

let content = fs.readFileSync('admin_reference.js', 'utf8');

// 1. tRef 함수 및 FOLDER_LANG_MAP 보강
const oldTRefTarget = `    function tRef(key, params) {
        var lang = getRefLang();
        var str = (REF_I18N[lang] && REF_I18N[lang][key]) || REF_I18N['ko'][key] || key;
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(function (p) {
                str = str.replace(new RegExp('\\\\{' + p + '\\\\}', 'g'), params[p]);
            });
        }
        return str;
    }`;

const newTRefCode = `    // 폴더명 4개국어 공식 매핑 사전 (한글 키 인코딩 불일치 완전 방어)
    var FOLDER_LANG_MAP = {
        "전경": { ko: "전경 (캠퍼스)", en: "Campus Aerial", zh: "基地全景 (园区)", ja: "拠点全景 (キャンパス)" },
        "CBS": { ko: "CBS (크로스벨트)", en: "CBS (Cross Belt)", zh: "CBS (交叉带分拣机)", ja: "CBS (クロスベルト)" },
        "NC CBS": { ko: "NC CBS (수치제어)", en: "NC CBS (Numerical Control)", zh: "NC CBS (数控交叉带)", ja: "NC CBS (数値制御)" },
        "NBS": { ko: "NBS (내로우벨트)", en: "NBS (Narrow Belt)", zh: "NBS (窄带分拣机)", ja: "NBS (ナローベルト)" },
        "Wheel Sorter": { ko: "Wheel Sorter (휠소터)", en: "Wheel Sorter", zh: "Wheel Sorter (摆轮分拣机)", ja: "Wheel Sorter (ホイールソーター)" },
        "틸트트레이소터": { ko: "틸트트레이 소터", en: "Tilt Tray Sorter", zh: "翻盘分拣机 (Tilt Tray)", ja: "ティルトトレイソーター" }
    };

    function getFolderTabLabel(folderName) {
        var lang = getRefLang();
        if (FOLDER_LANG_MAP[folderName] && FOLDER_LANG_MAP[folderName][lang]) {
            return FOLDER_LANG_MAP[folderName][lang];
        }
        var tabKey = "tab_" + folderName.replace(/\\s+/g, "_");
        var res = tRef(tabKey);
        return (res && res !== tabKey) ? res : folderName;
    }

    function tRef(key, params) {
        var lang = getRefLang();
        var str = (REF_I18N[lang] && REF_I18N[lang][key]) || (REF_I18N['zh'] && REF_I18N['zh'][key]) || REF_I18N['ko'][key] || key;
        if (typeof str !== 'string') return key;
        if (params && typeof params === 'object') {
            Object.keys(params).forEach(function (p) {
                var val = (params[p] !== undefined && params[p] !== null) ? params[p] : '';
                str = str.split('{' + p + '}').join(val);
            });
        }
        // 추가 안전망: 남아 있는 {count}가 있으면 params.count로 강제 치환
        if (params && params.count !== undefined && params.count !== null) {
            str = str.split('{count}').join(params.count);
        }
        return str;
    }`;

if (content.includes(oldTRefTarget)) {
    content = content.replace(oldTRefTarget, newTRefCode);
    console.log('[1/4] tRef and FOLDER_LANG_MAP successfully updated');
} else {
    console.warn('[1/4] oldTRefTarget not found by exact match, searching alternative...');
    const altRegex = /function tRef\s*\([\s\S]*?return str;\s*\}/;
    if (altRegex.test(content)) {
        content = content.replace(altRegex, newTRefCode.trim());
        console.log('[1/4] tRef replaced via regex match');
    }
}

// 2. renderCategoryTabs 탭 라벨 매핑 업데이트
const oldTabLoop = `        FOLDER_ORDER.forEach(function (f) {
            var d = REFERENCE_GALLERY_DB[f];
            var tabKey = "tab_" + f.replace(/\\s+/g, "_");
            var tabLabel = tRef(tabKey) !== tabKey ? tRef(tabKey) : f;`;

const newTabLoop = `        FOLDER_ORDER.forEach(function (f) {
            var d = REFERENCE_GALLERY_DB[f];
            var tabLabel = getFolderTabLabel(f);`;

if (content.includes(oldTabLoop)) {
    content = content.replace(oldTabLoop, newTabLoop);
    console.log('[2/4] renderCategoryTabs updated with getFolderTabLabel');
}

// 3. renderCategoryBriefing 내부 버튼 다국어 적용
const oldBriefingButtons = `            hasVideos ? '      <button type="button" onclick="window.ReferenceAdmin.scrollToSection(\\'ref-youtube-section\\')" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer active:scale-95"><i class="fa-brands fa-youtube text-base"></i> 동영상 시어터 바로가기 (' + mediaData.videos.length + ')</button>' : '',
            hasPhotos ? '      <button type="button" onclick="window.ReferenceAdmin.scrollToSection(\\'ref-photo-section\\')" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"><i class="fa-solid fa-images text-base"></i> 이미지 시어터 바로가기 (' + mediaData.photos.length + ')</button>' : '',`;

const newBriefingButtons = `            hasVideos ? '      <button type="button" onclick="window.ReferenceAdmin.scrollToSection(\\'ref-youtube-section\\')" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer active:scale-95"><i class="fa-brands fa-youtube text-base"></i> ' + tRef("btn_go_vid", { count: mediaData.videos.length }) + '</button>' : '',
            hasPhotos ? '      <button type="button" onclick="window.ReferenceAdmin.scrollToSection(\\'ref-photo-section\\')" class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"><i class="fa-solid fa-images text-base"></i> ' + tRef("btn_go_pho", { count: mediaData.photos.length }) + '</button>' : '',`;

if (content.includes(oldBriefingButtons)) {
    content = content.replace(oldBriefingButtons, newBriefingButtons);
    console.log('[3/4] renderCategoryBriefing buttons updated with tRef');
}

// 4. 비디오 시어터 중앙 대형 재생 버튼 및 모바일 자동 스크롤
const oldVideoStage = `        <div class="ref-main-stage w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner flex items-center justify-center">
          <video id="ref-yt-main-video" controls playsinline preload="metadata"
                 poster="`;

const newVideoStage = `        <div class="ref-main-stage w-full aspect-video bg-black rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner flex items-center justify-center group/stage">
          <video id="ref-yt-main-video" controls playsinline preload="metadata"
                 poster="`;

content = content.replace(oldVideoStage, newVideoStage);

// video 태그 닫는 부분 뒤에 중앙 대형 재생 오버레이 삽입
const oldVideoEnd = `                 onerror="window.handleRefVideoError(this)"
                 class="w-full h-full object-contain bg-black"></video>
        </div>`;

const newVideoEnd = `                 onerror="window.handleRefVideoError(this)"
                 class="w-full h-full object-contain bg-black cursor-pointer"></video>
          <!-- [모바일 & 데스크톱 공통] 중앙 대형 원터치 재생 오버레이 버튼 -->
          <div id="ref-yt-center-play-overlay" onclick="window.ReferenceAdmin.toggleMainVideoPlay(event)" role="button" tabindex="0" aria-label="재생"
               class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/25 active:bg-black/50 transition-all duration-300 cursor-pointer z-20 group">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-active:scale-95 transition-transform border-2 border-white/50 backdrop-blur-sm">
              <i class="fa-solid fa-play text-2xl sm:text-3xl ml-1 text-white drop-shadow"></i>
            </div>
            <span class="mt-3 px-3.5 py-1 rounded-full bg-black/80 text-white text-xs font-bold border border-white/20 tracking-wider shadow">터치하여 재생 (▶)</span>
          </div>
        </div>`;

if (content.includes(oldVideoEnd)) {
    content = content.replace(oldVideoEnd, newVideoEnd);
    console.log('[4/4] Video center play overlay inserted');
}

// 5. bindVideoEndedEvent -> bindVideoEvents 교체 및 toggleMainVideoPlay 추가
const oldBindVideo = `    function bindVideoEndedEvent() {
        var videoEl = document.getElementById("ref-yt-main-video");
        if (videoEl) {
            videoEl.volume = 0.1;
            videoEl.onended = function () {
                if (autoPlayNextVideo && currentVideoList.length > 1) {
                    window.ReferenceAdmin.nextVideo();
                }
            };
        }
    }`;

const newBindVideo = `    function syncCenterPlayBtnState() {
        var videoEl = document.getElementById("ref-yt-main-video");
        var overlay = document.getElementById("ref-yt-center-play-overlay");
        if (!videoEl || !overlay) return;
        if (videoEl.paused || videoEl.ended) {
            overlay.style.display = "flex";
        } else {
            overlay.style.display = "none";
        }
    }

    function bindVideoEndedEvent() {
        var videoEl = document.getElementById("ref-yt-main-video");
        if (videoEl) {
            videoEl.volume = 0.1;
            videoEl.onplay = syncCenterPlayBtnState;
            videoEl.onpause = syncCenterPlayBtnState;
            videoEl.onplaying = syncCenterPlayBtnState;
            videoEl.onwaiting = syncCenterPlayBtnState;
            videoEl.onended = function () {
                syncCenterPlayBtnState();
                if (autoPlayNextVideo && currentVideoList.length > 1) {
                    window.ReferenceAdmin.nextVideo();
                }
            };
            syncCenterPlayBtnState();
        }
    }`;

if (content.includes(oldBindVideo)) {
    content = content.replace(oldBindVideo, newBindVideo);
    console.log('[5/4] bindVideoEndedEvent enhanced with syncCenterPlayBtnState');
}

// 6. playVideoAtIndex 및 selectPhotoAtIndex 자동 스크롤과 toggleMainVideoPlay 탑재
const oldPlayIdx = `        playVideoAtIndex: function (idx) {
            if (!currentVideoList || idx < 0 || idx >= currentVideoList.length) return;
            currentVideoIndex = idx;
            updateActiveVideoUI(true);
        },`;

const newPlayIdx = `        playVideoAtIndex: function (idx) {
            if (!currentVideoList || idx < 0 || idx >= currentVideoList.length) return;
            currentVideoIndex = idx;
            updateActiveVideoUI(true);
            // 모바일 화면(폭 1024px 미만)에서 상단 비디오 시어터로 부드럽게 자동 스크롤
            if (window.innerWidth < 1024) {
                var box = document.getElementById("ref-yt-theater-box");
                if (box) {
                    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
        },
        toggleMainVideoPlay: function (e) {
            if (e && e.stopPropagation) e.stopPropagation();
            if (e && e.preventDefault) e.preventDefault();
            var videoEl = document.getElementById("ref-yt-main-video");
            if (!videoEl) return;
            if (videoEl.paused) {
                var p = videoEl.play();
                if (p && typeof p.catch === "function") {
                    p.catch(function () {
                        videoEl.muted = true;
                        videoEl.play();
                    });
                }
            } else {
                videoEl.pause();
            }
        },`;

if (content.includes(oldPlayIdx)) {
    content = content.replace(oldPlayIdx, newPlayIdx);
    console.log('[6/4] playVideoAtIndex and toggleMainVideoPlay added');
}

const oldSelectPhoto = `        selectPhotoAtIndex: function (idx) {
            if (!currentPhotoList || idx < 0 || idx >= currentPhotoList.length) return;
            currentPhotoIndex = idx;
            updateActivePhotoUI();
        },`;

const newSelectPhoto = `        selectPhotoAtIndex: function (idx) {
            if (!currentPhotoList || idx < 0 || idx >= currentPhotoList.length) return;
            currentPhotoIndex = idx;
            updateActivePhotoUI();
            // 모바일 화면(폭 1024px 미만)에서 상단 포토 시어터로 부드럽게 자동 스크롤
            if (window.innerWidth < 1024) {
                var box = document.getElementById("ref-photo-theater-box");
                if (box) {
                    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            }
        },`;

if (content.includes(oldSelectPhoto)) {
    content = content.replace(oldSelectPhoto, newSelectPhoto);
    console.log('[7/4] selectPhotoAtIndex updated with mobile auto-scroll');
}

fs.writeFileSync('admin_reference.js', content, 'utf8');
console.log('ALL admin_reference.js changes successfully saved!');

