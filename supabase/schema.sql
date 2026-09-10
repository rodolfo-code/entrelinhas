-- =======================================================
-- SCHEMA COMPLETO DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- PROJETO: ENTRELINHAS (LITERATURE APP)
-- =======================================================

-- 1. TABELA DE LIVROS (ACERVO & BIBLIOTECA)
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    subjects TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'to_read',
    why_read TEXT,
    notes TEXT,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso total a books" 
ON public.books 
FOR ALL 
USING (true) 
WITH CHECK (true);


-- 2. TABELA DO DIÁRIO (REFLEXÕES PESSOAIS)
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    tags TEXT[] DEFAULT '{}',
    is_draft BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso total a journal_entries" 
ON public.journal_entries 
FOR ALL 
USING (true) 
WITH CHECK (true);


-- 3. TABELA DO CADERNO DE NOTAS & ESTUDOS
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Reflexão',
    tags TEXT[] DEFAULT '{}',
    linked_book_title TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso total a notes" 
ON public.notes 
FOR ALL 
USING (true) 
WITH CHECK (true);


-- 4. TABELA DO DICIONÁRIO DE PALAVRAS E TERMOS
CREATE TABLE IF NOT EXISTS public.dictionary_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    grammatical_class TEXT,
    context_example TEXT,
    source_book TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.dictionary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso total a dictionary_entries" 
ON public.dictionary_entries 
FOR ALL 
USING (true) 
WITH CHECK (true);
