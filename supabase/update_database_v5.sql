-- ==========================================================
-- SCRIPT DE ATUALIZAÇÃO (SaveLance v5)
-- Cole e execute isto no SQL Editor do Supabase (New Query)
-- ==========================================================

-- Atualizar a lógica do trigger para verificar metas e conceder insígnias de objetivos
CREATE OR REPLACE FUNCTION public.process_transaction_updates()
RETURNS TRIGGER AS $$
DECLARE
    v_profile_id UUID;
    v_saldo NUMERIC(12, 2);
    v_nivel INTEGER;
    v_meta NUMERIC(12, 2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_profile_id := OLD.profile_id;
    ELSE
        v_profile_id := NEW.profile_id;
    END IF;

    -- Obter o saldo acumulado atual das transações
    SELECT COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END), 0.00)
    INTO v_saldo
    FROM public.transactions
    WHERE profile_id = v_profile_id;

    -- Obter as configurações de meta de poupança do perfil do utilizador
    SELECT meta_poupanca INTO v_meta FROM public.profiles WHERE id = v_profile_id;

    -- Determinar o nível de construção (1 a 10)
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

    -- Atualizar as informações de saldo e nível
    UPDATE public.profiles
    SET saldo_total = v_saldo, nivel_construcao = v_nivel, atualizado_em = NOW()
    WHERE id = v_profile_id;

    -- Lógica de concessão de conquistas (Apenas em inserções)
    IF TG_OP = 'INSERT' THEN
        -- Conquista 1: Primeiro Passo
        INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
        VALUES (v_profile_id, 'Primeiro Passo', 'Efetuou a sua primeira transação no mealheiro!')
        ON CONFLICT (profile_id, nome_conquista) DO NOTHING;

        -- Conquista 2: Mão Pesada
        IF NEW.tipo = 'entrada' AND NEW.valor >= 50.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Mão Pesada', 'Fez um depósito único de 50 euros ou mais!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        -- Conquista 3: Poupador Consistente
        IF v_saldo >= 200.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Poupador Consistente', 'Atingiu um saldo acumulado de 200 euros ou mais!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        -- Conquista 4: Mestre do Mealheiro
        IF v_saldo >= 500.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Mestre do Mealheiro', 'Alcançou um saldo igual ou superior a 500 euros!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        -- Conquista 5: Imperador do Mealheiro
        IF v_saldo >= 1000.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Imperador do Mealheiro', 'Alcançou o topo absoluto do sistema com 1000 euros ou mais no cofre da mansão!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        -- Lógica de Conquistas baseada na Meta de Poupança configurada
        IF v_meta > 0.00 THEN
            -- Conquista 6: Planeador Ativo
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Planeador Ativo', 'Definiu uma meta de poupança ativa no seu perfil!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;

            -- Conquista 7: Meio Caminho
            IF v_saldo >= (v_meta * 0.5) THEN
                INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
                VALUES (v_profile_id, 'Meio Caminho', 'Alcançou metade ou mais do valor da meta de poupança configurada!')
                ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
            END IF;

            -- Conquista 8: Alvo Atingido
            IF v_saldo >= v_meta THEN
                INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
                VALUES (v_profile_id, 'Alvo Atingido', 'Atingiu 100% da meta de poupança estabelecida no seu perfil!')
                ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
            END IF;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
