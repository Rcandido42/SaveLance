-- ==========================================================
-- SCRIPT DE ATUALIZAÇÃO (SaveLance v6 - Cofres Poupança)
-- Cole e execute isto no SQL Editor do Supabase (New Query)
-- ==========================================================

-- Adiciona a coluna cofres para guardar a listagem em JSON de cofres por perfil
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cofres JSONB DEFAULT '[]'::jsonb;
