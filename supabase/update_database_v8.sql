-- ==========================================================
-- SCRIPT DE ATUALIZAÇÃO (SaveLance v8 - Dias Sem Gastar)
-- Cole e execute isto no SQL Editor do Supabase (New Query)
-- ==========================================================

-- Adiciona a coluna dias_sem_gastar para armazenar as datas do desafio
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dias_sem_gastar JSONB DEFAULT '[]'::jsonb;
