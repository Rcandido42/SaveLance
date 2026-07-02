-- ==========================================================
-- SCRIPT DE ATUALIZAÇÃO CUMULATIVA (SaveLance v3)
-- Cole e execute isto no SQL Editor do Supabase (New Query)
-- ==========================================================

-- 1. Adicionar novas colunas se ainda não existirem
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'Outros';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS meta_poupanca NUMERIC(12, 2) DEFAULT 0.00;

-- 2. Atualizar a lógica dos 10 Níveis e Conquistas (Trigger do PostgreSQL)
CREATE OR REPLACE FUNCTION public.process_transaction_updates()
RETURNS TRIGGER AS $$
DECLARE
    v_profile_id UUID;
    v_saldo NUMERIC(12, 2);
    v_nivel INTEGER;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_profile_id := OLD.profile_id;
    ELSE
        v_profile_id := NEW.profile_id;
    END IF;

    -- Recalcular saldo total da conta
    SELECT COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END), 0.00)
    INTO v_saldo
    FROM public.transactions
    WHERE profile_id = v_profile_id;

    -- Nova curva de progressão gradual com 10 níveis (modelo Mansão)
    IF v_saldo < 20.00 THEN v_nivel := 1;
    ELSIF v_saldo < 50.00 THEN v_nivel := 2;
    ELSIF v_saldo < 100.00 THEN v_nivel := 3;
    ELSIF v_saldo < 180.00 THEN v_nivel := 4;
    ELSIF v_saldo < 280.00 THEN v_nivel := 5;
    ELSIF v_saldo < 400.00 THEN v_nivel := 6;
    ELSIF v_saldo < 550.00 THEN v_nivel := 7;
    ELSIF v_saldo < 750.00 THEN v_nivel := 8;
    ELSIF v_saldo < 1000.00 THEN v_nivel := 9;
    ELSE v_nivel := 10;
    END IF;

    -- Atualizar perfil com o novo saldo e nível
    UPDATE public.profiles
    SET saldo_total = v_saldo, nivel_construcao = v_nivel, atualizado_em = NOW()
    WHERE id = v_profile_id;

    -- Processar conquistas apenas ao inserir transações
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
        VALUES (v_profile_id, 'Primeiro Passo', 'Efetuou a sua primeira transação no mealheiro!')
        ON CONFLICT (profile_id, nome_conquista) DO NOTHING;

        IF NEW.tipo = 'entrada' AND NEW.valor >= 50.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Mão Pesada', 'Fez um depósito único de 50 euros ou mais!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        IF v_saldo >= 200.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Poupador Consistente', 'Atingiu um saldo acumulado de 200 euros ou mais!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        IF v_saldo >= 500.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Mestre do Mealheiro', 'Alcançou um saldo igual ou superior a 500 euros!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        -- Conquista do nível máximo (1000 euros / Nível 10)
        IF v_saldo >= 1000.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Imperador do Mealheiro', 'Alcançou o topo absoluto do sistema com 1000 euros ou mais no cofre da mansão!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
