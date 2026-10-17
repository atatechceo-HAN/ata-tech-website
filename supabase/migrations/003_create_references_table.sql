-- ==============================================================================
-- (주)에이티에이기술 웹사이트 - 003_create_references_table.sql
-- 주요 구축 실적(Company References) 카드 데이터 테이블 생성 및 보안 RLS 정책
-- 
-- [규칙 준수]
-- 1. 순서 번호 접두어 '003_' 적용
-- 2. supabase/migrations 폴더 내 보관
-- 3. RLS(Row Level Security): 일반 방문자는 읽기만 가능(SELECT), 관리자만 작성/수정/삭제 가능
-- ==============================================================================

-- 1. 주요 구축 실적 메인 테이블 (company_references)
CREATE TABLE IF NOT EXISTS public.company_references (
    id TEXT PRIMARY KEY,                            -- 고유 식별자 (예: 'ref_c1', 'ref_c2')
    category VARCHAR(50) NOT NULL,                  -- 카테고리 구분 ('ecommerce', 'food', 'manu')
    title VARCHAR(200) NOT NULL,                    -- 실적 명칭 (예: '국내 최대 이커머스 C사 메가 허브 터미널')
    image_url TEXT NOT NULL,                        -- 대표 이미지 파일명 또는 URL
    fallback_image_url TEXT,                        -- 대체 이미지 URL (이미지 로드 실패 시 사용)
    sub_badge VARCHAR(100),                         -- 상단 특화 뱃지 (예: '영하 20℃ 냉동창고', '2차전지 배터리')
    tags TEXT[] DEFAULT '{}',                       -- 기술 태그 목록 (예: ['Cross Belt Sorter', 'WCS'])
    description TEXT NOT NULL,                      -- 상세 구축 설명
    field VARCHAR(100) NOT NULL,                    -- 구축 분야명 (예: '대형 풀필먼트 허브', '스마트 저온 물류')
    sort_order INTEGER NOT NULL DEFAULT 0,          -- 표시 순서 (낮을수록 상단 또는 높을수록 상단)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (카테고리 필터링 및 정렬 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_references_category ON public.company_references (category);
CREATE INDEX IF NOT EXISTS idx_references_sort ON public.company_references (sort_order ASC);

-- 2. 행 단위 보안 (RLS: Row Level Security) 활성화
ALTER TABLE public.company_references ENABLE ROW LEVEL SECURITY;

-- 정책 1: 일반 방문자(모든 사용자)는 레퍼런스 실적을 '읽기(SELECT)'만 가능
CREATE POLICY "Public Read References" 
ON public.company_references FOR SELECT 
USING (true);

-- 정책 2: 인증된 관리자만 레퍼런스 실적 INSERT, UPDATE, DELETE 가능
CREATE POLICY "Admin All Operations References" 
ON public.company_references FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 3. 초기 공식 레퍼런스 데이터 7건 자동 삽입 (초기 시드 데이터)
INSERT INTO public.company_references 
(id, category, title, image_url, fallback_image_url, sub_badge, tags, description, field, sort_order)
VALUES 
    (
        'ref_c1', 
        'ecommerce', 
        '국내 최대 이커머스 C사 메가 허브 터미널', 
        'H00_레퍼런스_이커머스_1.jpg', 
        'https://images.unsplash.com/photo-1586528116311-ad8ed745363c?auto=format&fit=crop&q=80&w=800', 
        NULL, 
        ARRAY['Cross Belt Sorter', 'WCS', '텔레스코픽'], 
        '일 200만 건 이상의 압도적인 물동량을 소화하기 위해 초고속 크로스 벨트 소터 및 자동 상하차 시스템을 구축하여 전국 익일 배송의 핵심 인프라를 완성했습니다.', 
        '대형 풀필먼트 허브', 
        1
    ),
    (
        'ref_c2', 
        'ecommerce', 
        '글로벌 종합 유통 S사 수도권 풀필먼트 센터', 
        'H00_레퍼런스_이커머스_2.jpg', 
        'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800', 
        NULL, 
        ARRAY['AGV & AMR', 'Shuttle AS/RS'], 
        '다양한 규격의 소비재를 보관 및 피킹하기 위해 셔틀 타입의 자동 창고와 AGV 로봇을 결합하여 G2P(Goods-to-Person) 하이브리드 물류 센터를 구축했습니다.', 
        'G2P 하이브리드 센터', 
        2
    ),
    (
        'ref_c3', 
        'food', 
        'F&B 전문기업 F사 냉동 자동화 창고', 
        'H00_레퍼런스_콜드체인_1.jpg', 
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600', 
        '영하 20℃ 냉동창고', 
        ARRAY['저온형 AS/RS', '콜드체인 특화 WCS'], 
        '극한의 저온 환경에서도 안정적으로 구동되는 특수 윤활 및 히팅 기술이 적용된 AS/RS 스태커 크레인을 구축하여 작업자의 위험 노출을 최소화했습니다.', 
        '스마트 저온 물류', 
        3
    ),
    (
        'ref_c4', 
        'food', 
        '대형 마트 M사 신선 물류 허브', 
        'H00_레퍼런스_콜드체인_2.jpg', 
        'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=600', 
        '신선식품 당일배송', 
        ARRAY['Tilt Tray Sorter', '위생 스테인리스 컨베이어'], 
        '신선도가 생명인 농축수산물을 산지에서 매장 및 고객에게 빠르게 배송하기 위해 초고속 Tilt Tray Sorter 기반의 분류 라인을 설계했습니다.', 
        '신선 유통 분류', 
        4
    ),
    (
        'ref_c5', 
        'manu', 
        '글로벌 자동차 H사 공장 조립 라인', 
        'H00_레퍼런스_제조_1.jpg', 
        'https://images.unsplash.com/photo-1565891741441-64926e441838?auto=format&fit=crop&q=80&w=600', 
        '완성차 조립 라인', 
        ARRAY['Heavy Duty 컨베이어', 'AGV 이송 시스템'], 
        '중량물인 자동차 부품(엔진, 섀시 등)을 라인 간 오차 없이 이송하는 Heavy Duty 컨베이어 및 AGV 이송 시스템을 구축했습니다.', 
        '완성차 부품 이송', 
        5
    ),
    (
        'ref_c6', 
        'manu', 
        '배터리 제조 L사 셀 생산 라인', 
        'H00_레퍼런스_제조_2.jpg', 
        'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&q=80&w=600', 
        '2차전지 배터리', 
        ARRAY['클린룸 로봇 팔레타이징', '정밀 롤러 컨베이어'], 
        '분진 발생을 원천 차단하는 클린룸 특화 로봇 팔레타이징 시스템 및 고정밀 셀 이송 롤러 컨베이어를 성공적으로 설계 및 시공했습니다.', 
        '클린룸 2차전지 라인', 
        6
    ),
    (
        'ref_c7', 
        'manu', 
        '국내 1위 타이어 K사 물류센터', 
        'H00_레퍼런스_제조_3.jpg', 
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600', 
        '타이어 및 부품', 
        ARRAY['비전 바코드 인식', '비정형 특화 소터 라인'], 
        '비정형화된 대형 고무 타이어 화물을 바코드 비전 인식과 결합하여 목적지별로 자동 분류하는 특화 소터 라인을 구축했습니다.', 
        '비정형 대형물류 자동화', 
        7
    )
ON CONFLICT (id) DO NOTHING;
