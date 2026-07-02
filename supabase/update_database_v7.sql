-- ==========================================================
-- SCRIPT DE ATUALIZAÇÃO (SaveLance v7 - Gestor de Subscrições)
-- Cole e execute isto no SQL Editor do Supabase (New Query)
-- ==========================================================

-- Adiciona a coluna subscricoes para gerir mensalidades e datas de vencimento
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscricoes JSONB DEFAULT '[]'::jsonb;
