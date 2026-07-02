-- Migration v3: Ampliacao para 10 Niveis de evolucao do mealheiro
-- Execute este script no SQL Editor do painel do Supabase para atualizar a logica de niveis e conquistas.

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

    SELECT COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE -valor END), 0.00)
    INTO v_saldo
    FROM public.transactions
    WHERE profile_id = v_profile_id;

    -- Nova curva de progressao com 10 niveis (subida mais gradual)
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

    UPDATE public.profiles
    SET saldo_total = v_saldo, nivel_construcao = v_nivel, atualizado_em = NOW()
    WHERE id = v_profile_id;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
        VALUES (v_profile_id, 'Primeiro Passo', 'Efetuou a sua primeira transacao no mealheiro!')
        ON CONFLICT (profile_id, nome_conquista) DO NOTHING;

        IF NEW.tipo = 'entrada' AND NEW.valor >= 50.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Mao Pesada', 'Fez um deposito unico de 50 euros ou mais!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        IF v_saldo >= 200.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Poupador Consistente', 'Atingiu um saldo acumulado de 200 euros ou mais!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        IF v_saldo >= 500.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Mestre do Mealheiro', 'Alcancou o nivel maximo com um saldo de 500 euros ou mais!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;

        -- Nova conquista para o nivel maximo de 1000 euros
        IF v_saldo >= 1000.00 THEN
            INSERT INTO public.achievements (profile_id, nome_conquista, descricao)
            VALUES (v_profile_id, 'Imperador do Mealheiro', 'Alcancou o topo absoluto do sistema com 1000 euros ou mais no cofre quântico!')
            ON CONFLICT (profile_id, nome_conquista) DO NOTHING;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
