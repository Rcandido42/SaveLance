-- ==========================================================
-- SCRIPT DE ATUALIZAÇÃO (SaveLance v4)
-- Cole e execute isto no SQL Editor do Supabase (New Query)
-- ==========================================================

-- Adicionar colunas de Perfil Financeiro, Objetivos e Estilo Arquitetónico
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cargo TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rendimento_mensal NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS despesas_fixas NUMERIC(12, 2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS meta_prazo_meses INTEGER DEFAULT 3;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS estilo_construcao TEXT DEFAULT 'futurista';
