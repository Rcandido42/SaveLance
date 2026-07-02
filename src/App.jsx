import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Historico from './components/Historico';
import Conquistas from './components/Conquistas';
import Conselheiro from './components/Conselheiro';
import { HelpCircle, ShieldAlert } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setIsDemoMode(false);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsDemoMode(false);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (isDemoMode) {
      loadDemoData();
    } else if (session) {
      fetchSupabaseData();
    } else {
      setProfile(null);
      setTransactions([]);
      setAchievements([]);
    }
  }, [session, isDemoMode]);

  const fetchSupabaseData = async () => {
    if (!session?.user) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileErr) {
        if (profileErr.code === 'PGRST116') {
          const { data: newProfile, error: createErr } = await supabase
            .from('profiles')
            .insert({ id: session.user.id, email: session.user.email, saldo_total: 0.00, nivel_construcao: 1 })
            .select()
            .single();
          if (createErr) throw createErr;
          setProfile(newProfile);
        } else {
          throw profileErr;
        }
      } else {
        setProfile(profileData);
      }

      const { data: transData, error: transErr } = await supabase
        .from('transactions')
        .select('*')
        .eq('profile_id', session.user.id)
        .order('criada_em', { ascending: false });
      if (transErr) throw transErr;
      setTransactions(transData || []);

      const { data: achData, error: achErr } = await supabase
        .from('achievements')
        .select('*')
        .eq('profile_id', session.user.id);
      if (achErr) throw achErr;
      setAchievements(achData || []);

    } catch (err) {
      setErrorMsg("Erro ao comunicar com o Supabase. Verifique se correu o script SQL (schema.sql) no seu painel ou se as credenciais do .env estão corretas.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransactionReal = async (valor, tipo, descricao) => {
    if (!session?.user) return;
    const { error } = await supabase
      .from('transactions')
      .insert({ profile_id: session.user.id, valor, tipo, descricao: descricao || null });
    if (error) throw error;
    await fetchSupabaseData();
  };

  const handleDeleteTransactionReal = async (id) => {
    if (!session?.user) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    await fetchSupabaseData();
  };

  const handleSignOutReal = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setIsDemoMode(false);
    setLoading(false);
  };

  const loadDemoData = () => {
    setLoading(true);
    const demoProfile = localStorage.getItem('demo_profile');
    const demoTrans = localStorage.getItem('demo_transactions');
    const demoAch = localStorage.getItem('demo_achievements');

    if (demoProfile && demoTrans && demoAch) {
      setProfile(JSON.parse(demoProfile));
      setTransactions(JSON.parse(demoTrans));
      setAchievements(JSON.parse(demoAch));
    } else {
      const initialProfile = { id: 'demo-user-id', email: 'demo@savelance.com', saldo_total: 0.00, nivel_construcao: 1 };
      setProfile(initialProfile);
      setTransactions([]);
      setAchievements([]);
      localStorage.setItem('demo_profile', JSON.stringify(initialProfile));
      localStorage.setItem('demo_transactions', JSON.stringify([]));
      localStorage.setItem('demo_achievements', JSON.stringify([]));
    }
    setLoading(false);
  };

  const handleAddTransactionDemo = (valor, tipo, descricao) => {
    const currentTrans = [...transactions];
    const newTrans = {
      id: crypto.randomUUID(),
      profile_id: 'demo-user-id',
      valor, tipo,
      descricao: descricao || null,
      criada_em: new Date().toISOString()
    };
    currentTrans.unshift(newTrans);

    const novoSaldo = currentTrans.reduce((acc, t) => {
      return t.tipo === 'entrada' ? acc + parseFloat(t.valor) : acc - parseFloat(t.valor);
    }, 0.00);

    let novoNivel = 1;
    if (novoSaldo < 50) novoNivel = 1;
    else if (novoSaldo < 150) novoNivel = 2;
    else if (novoSaldo < 300) novoNivel = 3;
    else if (novoSaldo < 500) novoNivel = 4;
    else novoNivel = 5;

    const novoProfile = { ...profile, saldo_total: novoSaldo, nivel_construcao: novoNivel };

    const currentAch = [...achievements];
    const checkAndAddAchievement = (name, desc) => {
      const exists = currentAch.some((a) => a.nome_conquista === name);
      if (!exists) {
        currentAch.push({ id: crypto.randomUUID(), profile_id: 'demo-user-id', nome_conquista: name, descricao: desc, ganha_em: new Date().toISOString() });
      }
    };

    checkAndAddAchievement('Primeiro Passo', 'Efetuou a sua primeira transação no mealheiro!');
    if (tipo === 'entrada' && valor >= 50) checkAndAddAchievement('Mão Pesada', 'Fez um depósito único de 50€ ou mais!');
    if (novoSaldo >= 200) checkAndAddAchievement('Poupador Consistente', 'Atingiu um saldo acumulado de 200€ ou mais!');
    if (novoSaldo >= 500) checkAndAddAchievement('Mestre do Mealheiro', 'Alcançou o nível máximo (Nível 5) com um saldo de 500€ ou mais!');

    localStorage.setItem('demo_profile', JSON.stringify(novoProfile));
    localStorage.setItem('demo_transactions', JSON.stringify(currentTrans));
    localStorage.setItem('demo_achievements', JSON.stringify(currentAch));

    setProfile(novoProfile);
    setTransactions(currentTrans);
    setAchievements(currentAch);
  };

  const handleDeleteTransactionDemo = (id) => {
    const filteredTrans = transactions.filter((t) => t.id !== id);

    const novoSaldo = filteredTrans.reduce((acc, t) => {
      return t.tipo === 'entrada' ? acc + parseFloat(t.valor) : acc - parseFloat(t.valor);
    }, 0.00);

    let novoNivel = 1;
    if (novoSaldo < 50) novoNivel = 1;
    else if (novoSaldo < 150) novoNivel = 2;
    else if (novoSaldo < 300) novoNivel = 3;
    else if (novoSaldo < 500) novoNivel = 4;
    else novoNivel = 5;

    const novoProfile = { ...profile, saldo_total: novoSaldo, nivel_construcao: novoNivel };

    localStorage.setItem('demo_profile', JSON.stringify(novoProfile));
    localStorage.setItem('demo_transactions', JSON.stringify(filteredTrans));
    setProfile(novoProfile);
    setTransactions(filteredTrans);
  };

  const handleSignOutDemo = () => { setIsDemoMode(false); };

  const activeAddTransaction = isDemoMode ? handleAddTransactionDemo : handleAddTransactionReal;
  const activeDeleteTransaction = isDemoMode ? handleDeleteTransactionDemo : handleDeleteTransactionReal;
  const activeSignOut = isDemoMode ? handleSignOutDemo : handleSignOutReal;
  const currentUserEmail = isDemoMode ? 'demo@savelance.com' : session?.user?.email;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-darkBg text-slate-100 min-h-screen">
        <div className="h-12 w-12 border-4 border-techCyan border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold tracking-wider text-slate-400">A iniciar o SaveLance...</p>
      </div>
    );
  }

  if (!session && !isDemoMode) {
    return <AuthScreen onDemoMode={() => setIsDemoMode(true)} />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-darkBg text-slate-100">
      <Navbar userEmail={currentUserEmail} isDemo={isDemoMode} onSignOut={activeSignOut} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {errorMsg && (
          <div className="bg-red-950/40 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-start space-x-3 text-sm">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Nota de Configuração:</span> {errorMsg}
            </div>
            <button
              onClick={() => setIsDemoMode(true)}
              className="px-3 py-1 bg-techPurple/20 border border-techPurple/40 text-techPurple rounded-lg text-xs font-bold hover:bg-techPurple/30 transition shrink-0 cursor-pointer"
            >
              Mudar para Modo Demo
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2">
            <Dashboard profile={profile} onAddTransaction={activeAddTransaction} />
          </div>
          <div className="space-y-8">
            <Conselheiro />
            <div className="bg-gradient-to-tr from-techPurple/10 to-techCyan/10 p-5 rounded-2xl border border-darkBorder flex items-start space-x-3 text-xs text-slate-300">
              <HelpCircle className="h-5 w-5 text-techCyan shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-200">Como funciona o sincronismo?</span>
                <p className="leading-relaxed">
                  As transações são enviadas de imediato para a tabela <code className="text-techCyan">transactions</code>.
                  Triggers de banco de dados recalculam as estatísticas na tabela <code className="text-techCyan">profiles</code> e enviam conquistas instantâneas para <code className="text-techCyan">achievements</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Historico transactions={transactions} onDeleteTransaction={activeDeleteTransaction} />
          </div>
          <div>
            <Conquistas achievements={achievements} />
          </div>
        </div>
      </main>

      <footer className="bg-darkCard/50 border-t border-darkBorder py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} SaveLance - Gestor de Mealheiro Digital. Criado para Provas de Aptidão Profissional (PAP).</p>
      </footer>
    </div>
  );
}
