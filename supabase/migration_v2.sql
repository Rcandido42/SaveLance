-- Migration v2: Categorias de transacoes e meta de poupanca
-- Execute este script no SQL Editor do Supabase apos o schema.sql inicial.

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'Outros';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS meta_poupanca NUMERIC(12, 2) DEFAULT 0.00;
