-- ==============================================================================
-- (주)에이티에이기술 웹사이트 - 002_create_history_table.sql
-- 회사 연혁(Company History) 연도별 카드 데이터 및 마일스톤 테이블 생성과 보안 RLS 정책
-- 
-- [규칙 준수]
-- 1. 순서 번호 접두어 '002_' 적용
-- 2. supabase/migrations 폴더 내 보관
-- 3. RLS(Row Level Security): 일반 방문자는 읽기만 가능(SELECT), 관리자만 작성/수정/삭제 가능
-- ==============================================================================

-- 1. 연혁 연도별 카드 메인 테이블 (company_history_cards)
CREATE TABLE IF NOT EXISTS public.company_history_cards (
    id TEXT PRIMARY KEY,                            -- 고유 식별자 (예: 'hist_2025', 'hist_2024')
    year VARCHAR(50) NOT NULL,                      -- 연도 표시명 (예: '2025', '2021 이전')
    short_year VARCHAR(20) NOT NULL,                -- 뱃지용 약어 (예: '25', '~21')
    theme_badge VARCHAR(100) NOT NULL,              -- 테마 키워드 칩 (예: 'GLOBAL & INNOVATION')
    theme_icon VARCHAR(50) DEFAULT 'fa-award',      -- 폰트어썸 아이콘 클래스
    is_latest BOOLEAN NOT NULL DEFAULT false,       -- 최신 연도 하이라이트 여부 (네온 발광 효과)
    tags TEXT[] DEFAULT '{}',                       -- 하단 해시태그 목록 (예: ['#CES 2025', '#AI특허'])
    sort_order INTEGER NOT NULL DEFAULT 0,          -- 정렬 순서 (높을수록 상단/최신)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 연혁 세부 마일스톤 항목 테이블 (company_history_items)
CREATE TABLE IF NOT EXISTS public.company_history_items (
    id TEXT PRIMARY KEY,                            -- 고유 식별자 (예: 'item_2025_1')
    card_id TEXT NOT NULL REFERENCES public.company_history_cards(id) ON DELETE CASCADE,
    badge VARCHAR(30) NOT NULL DEFAULT '월',        -- 월/분류 뱃지 (예: '01월', '선정', '등록', '출원')
    content TEXT NOT NULL,                          -- 마일스톤 내용
    sort_order INTEGER NOT NULL DEFAULT 0,          -- 카드 내 표시 순서
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_history_cards_sort ON public.company_history_cards (sort_order DESC);
CREATE INDEX IF NOT EXISTS idx_history_items_card_id ON public.company_history_items (card_id, sort_order ASC);

-- 3. 행 단위 보안 (RLS: Row Level Security) 활성화
ALTER TABLE public.company_history_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_history_items ENABLE ROW LEVEL SECURITY;

-- 정책 1: 일반 방문자(모든 사용자)는 연혁 카드를 '읽기(SELECT)'만 가능
CREATE POLICY "Public Read History Cards" 
ON public.company_history_cards FOR SELECT 
USING (true);

CREATE POLICY "Public Read History Items" 
ON public.company_history_items FOR SELECT 
USING (true);

-- 정책 2: 인증된 관리자만 연혁 카드 INSERT, UPDATE, DELETE 가능
CREATE POLICY "Admin All Operations History Cards" 
ON public.company_history_cards FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admin All Operations History Items" 
ON public.company_history_items FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. 초기 연혁 기본 데이터 삽입 (초기 시드 데이터)
INSERT INTO public.company_history_cards (id, year, short_year, theme_badge, theme_icon, is_latest, tags, sort_order)
VALUES 
    ('hist_2025', '2025', '25', 'GLOBAL & INNOVATION', 'fa-earth-americas', true, ARRAY['#CES 2025', '#AI특허등록', '#글로벌진출'], 50),
    ('hist_2024', '2024', '24', 'EXPANSION & IP', 'fa-file-shield', false, ARRAY['#초기창업패키지', '#방향전환특허', '#국토교통진흥원'], 40),
    ('hist_2023', '2023', '23', 'R&D & CERTIFICATION', 'fa-award', false, ARRAY['#기술혁신기업', '#벤처기업인증', '#독일협력'], 30),
    ('hist_2022', '2022', '22', 'FOUNDATION & GROWTH', 'fa-building-flag', false, ARRAY['#법인설립', '#재도전패키지최우수', '#도로공사상생기업'], 20),
    ('hist_before_2021', '2021 이전', '~21', 'ORIGIN & PATENT', 'fa-lightbulb', false, ARRAY['#원천특허등록', '#스마트물류공모전', '#엔지니어링'], 10)
ON CONFLICT (id) DO NOTHING;

-- 2025년 마일스톤 항목
INSERT INTO public.company_history_items (id, card_id, badge, content, sort_order)
VALUES 
    ('item_2025_1', 'hist_2025', '01월', '[인공지능 기반 스마트 체형 교정 및 유지 시스템] 특허 등록', 1),
    ('item_2025_2', 'hist_2025', '01월', 'CES2025 라스베가스 참가', 2)
ON CONFLICT (id) DO NOTHING;

-- 2024년 마일스톤 항목
INSERT INTO public.company_history_items (id, card_id, badge, content, sort_order)
VALUES 
    ('item_2024_1', 'hist_2024', '11월', '[운송 차량 적재물의 분류 및 이송 장치] 특허 출원', 1),
    ('item_2024_2', 'hist_2024', '06월', '국토교통 과학기술진흥원 기업지원센터 입주 선정', 2),
    ('item_2024_3', 'hist_2024', '05월', '중소벤처기업부 창업기술개발사업 최종 선정', 3),
    ('item_2024_4', 'hist_2024', '04월', '창업진흥원 초기창업패키지 선정', 4),
    ('item_2024_5', 'hist_2024', '03월', '[물류장비 4분할 방향전환장치] 특허 출원', 5),
    ('item_2024_6', 'hist_2024', '03월', '[인공지능 기반 스마트 체형 교정 및 유지 시스템] 특허 출원', 6),
    ('item_2024_7', 'hist_2024', 'R&D', '중소벤처기업부 R&D기획 지원 사업 선정', 7)
ON CONFLICT (id) DO NOTHING;

-- 2023년 마일스톤 항목
INSERT INTO public.company_history_items (id, card_id, badge, content, sort_order)
VALUES 
    ('item_2023_1', 'hist_2023', '선정', '중소 벤처기업 진흥공단 기술혁신 기업 선정', 1),
    ('item_2023_2', 'hist_2023', '인증', '벤처기업 인증', 2),
    ('item_2023_3', 'hist_2023', '선정', '중소벤처기업부 창업성장기술개발사업 디딤돌 선정', 3),
    ('item_2023_4', 'hist_2023', '인증', '연구개발 전담부서 인증', 4),
    ('item_2023_5', 'hist_2023', '선정', '중소벤처기업부 R&D 기획사업 선정', 5),
    ('item_2023_6', 'hist_2023', '글로벌', '독일 Cellumation社 기술 협력 및 제품 도입 추진', 6)
ON CONFLICT (id) DO NOTHING;

-- 2022년 마일스톤 항목
INSERT INTO public.company_history_items (id, card_id, badge, content, sort_order)
VALUES 
    ('item_2022_1', 'hist_2022', '01월', '주식회사 에이티에이기술 설립 (ATA Technology Co., Ltd.)', 1),
    ('item_2022_2', 'hist_2022', '수상', '원주 창조경제 혁신 센터 중,장년 기술 창업 공모전 창의상 수상', 2),
    ('item_2022_3', 'hist_2022', '선정', '재도전 성공 패키지 일반형 선정 [ R&D 정부 사업 진행 ]', 3),
    ('item_2022_4', 'hist_2022', '선정', '한국도로공사 상생형 창업-벤처기업 선정 [ R&D 정부 사업 진행 ]', 4),
    ('item_2022_5', 'hist_2022', '최우수', '재도전 성공 패키지 일반형 사업 완료 [ 최우수판정 ]', 5)
ON CONFLICT (id) DO NOTHING;

-- 2021년 이전 마일스톤 항목
INSERT INTO public.company_history_items (id, card_id, badge, content, sort_order)
VALUES 
    ('item_2021_1', 'hist_before_2021', '등록', '2021년 10월 - 자동분류 및 이송장치 특허등록', 1),
    ('item_2021_2', 'hist_before_2021', '출원', '적재물의 자동분류 및 이송장치 특허 출원', 2),
    ('item_2021_3', 'hist_before_2021', '수상', '창조경제혁신센터 스마트물류 공모전 장려상 수상', 3),
    ('item_2021_4', 'hist_before_2021', '출원', '항공 수화물의 자동분류 택배 배송 시스템 및 그 시스템을 이용한 항공 수화물 택배 배송 방법 특허 출원', 4),
    ('item_2021_5', 'hist_before_2021', '사업', '공정 수립 및 공정 개선 사업 [ 엔지니어링 서비스 ]', 5)
ON CONFLICT (id) DO NOTHING;
