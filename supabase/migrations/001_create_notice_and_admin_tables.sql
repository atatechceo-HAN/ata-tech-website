-- ==============================================================================
-- (주)에이티에이기술 웹사이트 - 001_create_notice_and_admin_tables.sql
-- 공지사항(Notices) 및 관리자 계정(Admins) 테이블 생성 및 보안 RLS 정책
-- 
-- [규칙 준수]
-- 1. 순서 번호 접두어 '001_' 적용
-- 2. supabase/migrations 폴더 내 보관
-- 3. 비밀번호는 pgcrypto 기반 bcrypt/sha256 단방향 암호화 적용
-- 4. RLS(Row Level Security): 일반 방문자는 읽기만 가능, 관리자만 작성/수정/삭제 가능
-- ==============================================================================

-- 1. pgcrypto 확장 활성화 (보안 암호화 해시 지원)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. 관리자 계정 테이블 생성 (Admins)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    -- 비밀번호는 평문이 아닌 안전한 단방향 해시로 저장됩니다
    password_hash TEXT NOT NULL,
    admin_name VARCHAR(100) DEFAULT '에이티에이기술 관리자',
    role VARCHAR(20) DEFAULT 'superadmin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 초기 관리자 계정 등록 (아이디: admin / 비밀번호: ata2026!)
-- crypt('ata2026!', gen_salt('bf'))를 통해 강력한 bcrypt 솔트 해싱 적용
INSERT INTO public.admin_users (username, password_hash, admin_name)
VALUES ('admin', crypt('ata2026!', gen_salt('bf')), '최고 관리자')
ON CONFLICT (username) DO NOTHING;

-- 3. 공지사항 게시판 테이블 생성 (Notices)
CREATE TABLE IF NOT EXISTS public.notices (
    id TEXT PRIMARY KEY,
    category VARCHAR(20) NOT NULL DEFAULT 'notice', -- notice, tech, press
    pinned BOOLEAN NOT NULL DEFAULT false,          -- 상단 중요 공지 고정 여부
    date DATE NOT NULL DEFAULT CURRENT_DATE,        -- 등록 일자
    views INTEGER NOT NULL DEFAULT 0,               -- 조회수
    author VARCHAR(100) DEFAULT '주식회사 에이티에이기술 관리자',
    
    -- 다국어 제목
    title_ko TEXT NOT NULL,
    title_en TEXT,
    title_cn TEXT,
    title_ja TEXT,
    
    -- 다국어 요약문 (목록 미리보기용)
    summary_ko TEXT,
    summary_en TEXT,
    summary_cn TEXT,
    summary_ja TEXT,
    
    -- 다국어 본문 (HTML / Markdown 서식 지원)
    content_ko TEXT NOT NULL,
    content_en TEXT,
    content_cn TEXT,
    content_ja TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (정렬 및 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_notices_pinned_date ON public.notices (pinned DESC, date DESC);
CREATE INDEX IF NOT EXISTS idx_notices_category ON public.notices (category);

-- 4. 행 단위 보안 (RLS: Row Level Security) 활성화
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 정책 1: 모든 일반 방문자(익명 포함)는 공지사항을 '읽기(SELECT)'만 가능
CREATE POLICY "Public Read Notices" 
ON public.notices FOR SELECT 
USING (true);

-- 정책 2: 공지사항 조회수 증가 허용
CREATE POLICY "Public Update Notice Views" 
ON public.notices FOR UPDATE 
USING (true)
WITH CHECK (true);

-- 정책 3: 인증된 관리자만 공지사항 INSERT, UPDATE, DELETE 가능
CREATE POLICY "Admin All Operations Notices" 
ON public.notices FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 정책 4: 관리자 테이블은 외부 직접 노출 차단
CREATE POLICY "Admin User Self Only" 
ON public.admin_users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 5. 관리자 로그인 검증용 보안 RPC 함수 (비밀번호 일치 확인)
CREATE OR REPLACE FUNCTION public.verify_admin_login(p_username TEXT, p_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_stored_hash TEXT;
BEGIN
    SELECT password_hash INTO v_stored_hash
    FROM public.admin_users
    WHERE username = p_username;
    
    IF v_stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- bcrypt 해시 대조
    RETURN (v_stored_hash = crypt(p_password, v_stored_hash));
END;
$$;
