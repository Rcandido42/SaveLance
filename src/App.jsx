import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabaseClient';
import { toast } from 'react-hot-toast';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Historico from './components/Historico';
import Conquistas from './components/Conquistas';
import Conselheiro from './components/Conselheiro';
import GraficoEvolucao from './components/GraficoEvolucao';
import MetaPoupanca from './components/MetaPoupanca';
import SimuladorOrcamento from './components/SimuladorOrcamento';
import { HelpCircle, ShieldAlert, Home } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Controlo do modal global de perfil
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cargo, setCargo] = useState('');
  const [rendimento, setRendimento] = useState('');
  const [despesas, setDespesas] = useState('');
  const [meta, setMeta] = useState('');
  const [meses, setMeses] = useState(3);
  const [estilo, setEstilo] = useState('futurista');
  const [submittingProfile, setSubmittingProfile] = useState(false);

  const knownAchievements = useRef(new Set());

  // Sincronizar campos do form local quando o profile carregar do Supabase ou LocalStorage
  useEffect(() => {
    if (profile) {
      setCargo(profile.cargo || '');
      setRendimento(profile.rendimento_mensal || '');
      setDespesas(profile.despesas_fixas || '');
      setMeta(profile.meta_poupanca || '');
      setMeses(profile.meta_prazo_meses || 3);
      setEstilo(profile.estilo_construcao || 'futurista');
    }
  }, [profile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setIsDemoMode(false);
      setLoading(false);
    }).catch(() => setLoading(false));

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
      knownAchievements.current = new Set();
    }
  }, [session, isDemoMode]);

  useEffect(() => {
    if (!session?.user || isDemoMode) return;

    const channel = supabase
      .channel('savelance-realtime')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'profiles',
        filter: `id=eq.${session.user.id}`
      }, (payload) => {
        setProfile(payload.new);
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'transactions',
        filter: `profile_id=eq.${session.user.id}`
      }, (payload) => {
        setTransactions(prev => {
          const exists = prev.find(t => t.id === payload.new.id);
          return exists ? prev : [payload.new, ...prev];
        });
      })
      .on('postgres_changes', {
        event: 'DELETE', schema: 'public', table: 'transactions',
        filter: `profile_id=eq.${session.user.id}`
      }, (payload) => {
        setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'achievements',
        filter: `profile_id=eq.${session.user.id}`
      }, (payload) => {
        const ach = payload.new;
        if (!knownAchievements.current.has(ach.nome_conquista)) {
          knownAchievements.current.add(ach.nome_conquista);
          toast.success(`🏆 Conquista desbloqueada: "${ach.nome_conquista}"!`, { duration: 5000 });
        }
        setAchievements(prev => {
          const exists = prev.find(a => a.nome_conquista === ach.nome_conquista);
          return exists ? prev : [...prev, ach];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session?.user?.id, isDemoMode]);

  const fetchSupabaseData = async () => {
    if (!session?.user) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles').select('*').eq('id', session.user.id).single();

      if (profileErr) {
        if (profileErr.code === 'PGRST116') {
          const { data: newProfile, error: createErr } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              saldo_total: 0.00,
              nivel_construcao: 1,
              meta_poupanca: 0.00,
              cargo: '',
              rendimento_mensal: 0.00,
              despesas_fixas: 0.00,
              meta_prazo_meses: 3,
              estilo_construcao: 'futurista'
            })
            .select().single();
          if (createErr) throw createErr;
          setProfile(newProfile);
        } else {
          throw profileErr;
        }
      } else {
        setProfile(profileData);
      }

      const { data: transData, error: transErr } = await supabase
        .from('transactions').select('*').eq('profile_id', session.user.id).order('criada_em', { ascending: false });
      if (transErr) throw transErr;
      setTransactions(transData || []);

      const { data: achData, error: achErr } = await supabase
        .from('achievements').select('*').eq('profile_id', session.user.id);
      if (achErr) throw achErr;

      const achList = achData || [];
      achList.forEach(a => knownAchievements.current.add(a.nome_conquista));
      setAchievements(achList);

    } catch (err) {
      setErrorMsg("Erro ao comunicar com o Supabase. Verifique o ficheiro .env e se executou o schema.sql no painel.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransactionReal = async (valor, tipo, descricao, categoria) => {
    if (!session?.user) return;
    const { error } = await supabase.from('transactions').insert({
      profile_id: session.user.id, valor, tipo,
      descricao: descricao || null,
      categoria: categoria || 'Outros'
    });
    if (error) throw error;
    toast.success(tipo === 'entrada'
      ? `✅ Depósito de ${valor.toFixed(2)} € registado!`
      : `📤 Levantamento de ${valor.toFixed(2)} € registado!`
    );
    await fetchSupabaseData();
  };

  const handleDeleteTransactionReal = async (id) => {
    if (!session?.user) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    toast.success('Transação eliminada.');
    await fetchSupabaseData();
  };

  const handleSetMetaReal = async (valor) => {
    if (!session?.user) return;
    const { error } = await supabase.from('profiles').update({ meta_poupanca: valor }).eq('id', session.user.id);
    if (error) { toast.error('Erro ao guardar a meta.'); return; }
    toast.success('Meta de poupança atualizada!');
    await fetchSupabaseData();
  };

  const handleUpdateProfileReal = async (fields) => {
    if (!session?.user) return;
    const { error } = await supabase.from('profiles').update(fields).eq('id', session.user.id);
    if (error) { toast.error('Erro ao salvar perfil.'); return; }
    toast.success('Perfil atualizado com sucesso!');
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
      const initialProfile = {
        id: 'demo-user-id',
        email: 'demo@savelance.com',
        saldo_total: 0.00,
        nivel_construcao: 1,
        meta_poupanca: 0.00,
        cargo: '',
        rendimento_mensal: 0.00,
        despesas_fixas: 0.00,
        meta_prazo_meses: 3,
        estilo_construcao: 'futurista'
      };
      setProfile(initialProfile);
      setTransactions([]);
      setAchievements([]);
      localStorage.setItem('demo_profile', JSON.stringify(initialProfile));
      localStorage.setItem('demo_transactions', JSON.stringify([]));
      localStorage.setItem('demo_achievements', JSON.stringify([]));
    }
    setLoading(false);
  };

  const handleAddTransactionDemo = (valor, tipo, descricao, categoria) => {
    const currentTrans = [...transactions];
    currentTrans.unshift({
      id: crypto.randomUUID(), profile_id: 'demo-user-id',
      valor, tipo, descricao: descricao || null,
      categoria: categoria || 'Outros',
      criada_em: new Date().toISOString()
    });

    const novoSaldo = currentTrans.reduce((acc, t) =>
      t.tipo === 'entrada' ? acc + parseFloat(t.valor) : acc - parseFloat(t.valor), 0.00);

    let novoNivel = 1;
    if (novoSaldo >= 1000) novoNivel = 10;
    else if (novoSaldo >= 750) novoNivel = 9;
    else if (novoSaldo >= 550) novoNivel = 8;
    else if (novoSaldo >= 400) novoNivel = 7;
    else if (novoSaldo >= 280) novoNivel = 6;
    else if (novoSaldo >= 180) novoNivel = 5;
    else if (novoSaldo >= 100) novoNivel = 4;
    else if (novoSaldo >= 50) novoNivel = 3;
    else if (novoSaldo >= 20) novoNivel = 2;

    const novoProfile = { ...profile, saldo_total: novoSaldo, nivel_construcao: novoNivel };

    const currentAch = [...achievements];
    const addAchievement = (name, desc) => {
      if (!currentAch.find(a => a.nome_conquista === name)) {
        currentAch.push({ id: crypto.randomUUID(), profile_id: 'demo-user-id', nome_conquista: name, descricao: desc, ganha_em: new Date().toISOString() });
        toast.success(`🏆 Conquista desbloqueada: "${name}"!`, { duration: 5000 });
      }
    };

    addAchievement('Primeiro Passo', 'Efetuou a sua primeira transação no mealheiro!');
    if (tipo === 'entrada' && valor >= 50) addAchievement('Mão Pesada', 'Fez um depósito único de 50€ ou mais!');
    if (novoSaldo >= 200) addAchievement('Poupador Consistente', 'Atingiu um saldo acumulado de 200€ ou mais!');
    if (novoSaldo >= 500) addAchievement('Mestre do Mealheiro', 'Alcançou o nível máximo com um saldo de 500€ ou mais!');
    if (novoSaldo >= 1000) addAchievement('Imperador do Mealheiro', 'Alcançou o topo absoluto do sistema com 1000€ ou mais!');

    toast.success(tipo === 'entrada'
      ? `✅ Depósito de ${valor.toFixed(2)} € registado!`
      : `📤 Levantamento de ${valor.toFixed(2)} € registado!`
    );

    localStorage.setItem('demo_profile', JSON.stringify(novoProfile));
    localStorage.setItem('demo_transactions', JSON.stringify(currentTrans));
    localStorage.setItem('demo_achievements', JSON.stringify(currentAch));
    setProfile(novoProfile);
    setTransactions(currentTrans);
    setAchievements(currentAch);
  };

  const handleDeleteTransactionDemo = (id) => {
    const filteredTrans = transactions.filter(t => t.id !== id);
    const novoSaldo = filteredTrans.reduce((acc, t) =>
      t.tipo === 'entrada' ? acc + parseFloat(t.valor) : acc - parseFloat(t.valor), 0.00);

    let novoNivel = 1;
    if (novoSaldo >= 1000) novoNivel = 10;
    else if (novoSaldo >= 750) novoNivel = 9;
    else if (novoSaldo >= 550) novoNivel = 8;
    else if (novoSaldo >= 400) novoNivel = 7;
    else if (novoSaldo >= 280) novoNivel = 6;
    else if (novoSaldo >= 180) novoNivel = 5;
    else if (novoSaldo >= 100) novoNivel = 4;
    else if (novoSaldo >= 50) novoNivel = 3;
    else if (novoSaldo >= 20) novoNivel = 2;

    const novoProfile = { ...profile, saldo_total: novoSaldo, nivel_construcao: novoNivel };
    localStorage.setItem('demo_profile', JSON.stringify(novoProfile));
    localStorage.setItem('demo_transactions', JSON.stringify(filteredTrans));
    setProfile(novoProfile);
    setTransactions(filteredTrans);
    toast.success('Transação eliminada.');
  };

  const handleSetMetaDemo = (valor) => {
    const novoProfile = { ...profile, meta_poupanca: valor };
    localStorage.setItem('demo_profile', JSON.stringify(novoProfile));
    setProfile(novoProfile);
    toast.success('Meta de poupança atualizada!');
  };

  const handleUpdateProfileDemo = (fields) => {
    const novoProfile = { ...profile, ...fields };
    localStorage.setItem('demo_profile', JSON.stringify(novoProfile));
    setProfile(novoProfile);
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleSignOutDemo = () => { setIsDemoMode(false); };

  const activeAddTransaction = isDemoMode ? handleAddTransactionDemo : handleAddTransactionReal;
  const activeDeleteTransaction = isDemoMode ? handleDeleteTransactionDemo : handleDeleteTransactionReal;
  const activeSetMeta = isDemoMode ? handleSetMetaDemo : handleSetMetaReal;
  const activeUpdateProfile = isDemoMode ? handleUpdateProfileDemo : handleUpdateProfileReal;
  const activeSignOut = isDemoMode ? handleSignOutDemo : handleSignOutReal;
  const currentUserEmail = isDemoMode ? 'demo@savelance.com' : session?.user?.email;

  const handleFormProfileSubmit = async (e) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      await activeUpdateProfile({
        cargo,
        rendimento_mensal: parseFloat(rendimento) || 0,
        despesas_fixas: parseFloat(despesas) || 0,
        meta_poupanca: parseFloat(meta) || 0,
        meta_prazo_meses: parseInt(meses) || 3,
        estilo_construcao: estilo
      });
      setProfileModalOpen(false);
    } catch {
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSubmittingProfile(false);
    }
  };

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
      <Navbar
        userEmail={currentUserEmail}
        isDemo={isDemoMode}
        onSignOut={activeSignOut}
        onOpenProfile={() => setProfileModalOpen(true)}
        profile={profile}
      />

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
              Modo Demo
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2">
            <Dashboard
              profile={profile}
              onAddTransaction={activeAddTransaction}
            />
          </div>
          <div className="space-y-6">
            <MetaPoupanca
              saldo={profile?.saldo_total || 0}
              meta={profile?.meta_poupanca || 0}
              onSetMeta={activeSetMeta}
            />
            <SimuladorOrcamento
              profile={profile}
              saldo={profile?.saldo_total || 0}
            />
            <Conselheiro />
            <div className="bg-gradient-to-tr from-techPurple/10 to-techCyan/10 p-5 rounded-2xl border border-darkBorder flex items-start space-x-3 text-xs text-slate-300">
              <HelpCircle className="h-5 w-5 text-techCyan shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-200">Real-Time Supabase ativo</span>
                <p className="leading-relaxed">
                  Saldo, nível e conquistas atualizam instantaneamente via <code className="text-techCyan">postgres_changes</code> sem necessidade de recarregar a página.
                </p>
              </div>
            </div>
          </div>
        </div>

        <GraficoEvolucao transactions={transactions} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <Historico transactions={transactions} onDeleteTransaction={activeDeleteTransaction} />
          </div>
          <div>
            <Conquistas achievements={achievements} />
          </div>
        </div>

      </main>

      {/* Modal Global de Perfil e Obra */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkCard border border-darkBorder w-full max-w-md rounded-2xl shadow-neonCyan overflow-hidden">
            <div className="px-6 py-5 border-b border-darkBorder flex justify-between items-center bg-darkBg/50">
              <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <Home className="h-6 w-6 text-techCyan" />
                <span>Configuração de Perfil & Obra</span>
              </h3>
              <button onClick={() => setProfileModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-2xl font-bold focus:outline-none cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleFormProfileSubmit}>
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Cargo / Onde Trabalha</label>
                  <input type="text" value={cargo} onChange={e => setCargo(e.target.value)} placeholder="Ex: Programador Full-Stack" className="block w-full px-3 py-2 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Salário (€/mês)</label>
                    <input type="number" step="0.01" value={rendimento} onChange={e => setRendimento(e.target.value)} placeholder="0.00" className="block w-full px-3 py-2 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Despesas Fixas (€/mês)</label>
                    <input type="number" step="0.01" value={despesas} onChange={e => setDespesas(e.target.value)} placeholder="Ex: Luz, Água, Renda" className="block w-full px-3 py-2 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-darkBorder/40 pt-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Meta de Poupança (€)</label>
                    <input type="number" step="0.01" value={meta} onChange={e => setMeta(e.target.value)} placeholder="0.00" className="block w-full px-3 py-2 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Prazo em Meses</label>
                    <input type="number" min="1" value={meses} onChange={e => setMeses(e.target.value)} className="block w-full px-3 py-2 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan text-sm" />
                  </div>
                </div>
                <div className="border-t border-darkBorder/40 pt-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Estilo Arquitetónico</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { value: 'futurista', name: 'Cyberpunk' },
                      { value: 'moderna', name: 'Minimalista' },
                      { value: 'fazenda', name: 'Fazenda' },
                      { value: 'medieval', name: 'Castelo' },
                      { value: 'predio', name: 'Aranha-Céus' }
                    ].map(item => (
                      <button
                        key={item.value} type="button" onClick={() => setEstilo(item.value)}
                        className={`px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${estilo === item.value ? 'bg-techCyan/20 border-techCyan text-techCyan font-bold' : 'bg-darkBg border-darkBorder text-slate-400 hover:border-slate-500'}`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-darkBorder bg-darkBg/50 flex justify-end space-x-3">
                <button type="button" onClick={() => setProfileModalOpen(false)} className="px-4 py-2 border border-darkBorder text-slate-300 hover:bg-slate-800 rounded-xl text-sm font-semibold transition cursor-pointer">Cancelar</button>
                <button type="submit" disabled={submittingProfile} className="px-5 py-2 bg-gradient-to-r from-techCyan to-techPurple text-darkBg rounded-xl text-sm font-bold hover:opacity-90 shadow-neonCyan transition cursor-pointer">
                  {submittingProfile ? 'A Guardar...' : 'Salvar Configuração'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-darkCard/50 border-t border-darkBorder py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} SaveLance - Gestor de Mealheiro Digital. Criado para Provas de Aptidão Profissional (PAP).</p>
      </footer>
    </div>
  );
}
