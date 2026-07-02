import React, { useState } from 'react';
import { FolderHeart, Plus, Trash2, ArrowUpRight, ArrowDownLeft, Info, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Cofres({ profile, onUpdateProfile, onAddTransaction }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [nome, setNome] = useState('');
  const [meta, setMeta] = useState('');
  const [emoji, setEmoji] = useState('🎮');

  // Controlo dos modais de transferência
  const [transferModal, setTransferModal] = useState(null); // { type: 'in' | 'out', vaultId: string }
  const [transferValue, setTransferValue] = useState('');

  const cofres = profile?.cofres || [];
  const saldoDisponivel = profile?.saldo_total || 0;

  const emojisPreset = ['🎮', '✈️', '🚗', '💻', '🏠', '🎓', '🎁', '💰'];

  const handleCreateVault = async (e) => {
    e.preventDefault();
    const parsedMeta = parseFloat(meta);
    if (!nome.trim()) { toast.error('Insere um nome para o cofre.'); return; }
    if (isNaN(parsedMeta) || parsedMeta <= 0) { toast.error('Insere uma meta de valor válida.'); return; }

    const novoCofre = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      meta: parsedMeta,
      saldo: 0.00,
      emoji
    };

    const novosCofres = [...cofres, novoCofre];
    try {
      await onUpdateProfile({ cofres: novosCofres });
      toast.success(`Cofre "${nome}" criado com sucesso!`);
      setNome('');
      setMeta('');
      setShowAddForm(false);
    } catch {
      toast.error('Erro ao criar cofre.');
    }
  };

  const handleDeleteVault = async (vault) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar o cofre "${vault.nome}"? O saldo acumulado de ${vault.saldo.toFixed(2)}€ será devolvido ao seu saldo disponível.`)) {
      return;
    }

    try {
      // Se houver saldo no cofre, devolvemos como transação de entrada
      if (vault.saldo > 0) {
        await onAddTransaction(
          vault.saldo,
          'entrada',
          `Devolução de saldo: Cofre "${vault.nome}" eliminado`,
          'Cofre'
        );
      }

      const novosCofres = cofres.filter(c => c.id !== vault.id);
      await onUpdateProfile({ cofres: novosCofres });
      toast.success(`Cofre "${vault.nome}" removido.`);
    } catch {
      toast.error('Erro ao eliminar cofre.');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const value = parseFloat(transferValue);
    if (isNaN(value) || value <= 0) { toast.error('Insere um valor de transferência válido.'); return; }

    const targetVault = cofres.find(c => c.id === transferModal.vaultId);
    if (!targetVault) return;

    if (transferModal.type === 'in') {
      // Depositar no cofre (retirar do saldo principal)
      if (value > saldoDisponivel) { toast.error('Saldo disponível insuficiente.'); return; }

      try {
        // Criar transação de saída (debita do saldo geral)
        await onAddTransaction(
          value,
          'saida',
          `Alocado para cofre: ${targetVault.emoji} ${targetVault.nome}`,
          'Cofre'
        );

        // Atualizar saldo do cofre no JSON
        const novosCofres = cofres.map(c => {
          if (c.id === targetVault.id) {
            return { ...c, saldo: c.saldo + value };
          }
          return c;
        });

        await onUpdateProfile({ cofres: novosCofres });
        toast.success(`Adicionado ${value.toFixed(2)}€ ao cofre "${targetVault.nome}".`);
        setTransferModal(null);
        setTransferValue('');
      } catch {
        toast.error('Erro ao transferir fundos.');
      }
    } else {
      // Resgatar do cofre (adicionar ao saldo principal)
      if (value > targetVault.saldo) { toast.error('Saldo do cofre insuficiente.'); return; }

      try {
        // Criar transação de entrada (credita no saldo geral)
        await onAddTransaction(
          value,
          'entrada',
          `Resgatado do cofre: ${targetVault.emoji} ${targetVault.nome}`,
          'Cofre'
        );

        // Atualizar saldo do cofre no JSON
        const novosCofres = cofres.map(c => {
          if (c.id === targetVault.id) {
            return { ...c, saldo: Math.max(0, c.saldo - value) };
          }
          return c;
        });

        await onUpdateProfile({ cofres: novosCofres });
        toast.success(`Resgatado ${value.toFixed(2)}€ do cofre "${targetVault.nome}".`);
        setTransferModal(null);
        setTransferValue('');
      } catch {
        toast.error('Erro ao resgatar fundos.');
      }
    }
  };

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <FolderHeart className="h-5 w-5 text-techPurple" />
          <span>Cofres de Poupança</span>
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 bg-techPurple/10 border border-techPurple/35 text-techPurple hover:bg-techPurple hover:text-darkBg rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Criar Objetivo</span>
        </button>
      </div>

      {/* Form de Criação */}
      {showAddForm && (
        <form onSubmit={handleCreateVault} className="bg-darkBg/60 p-4 rounded-xl border border-darkBorder/70 space-y-4 animate-scale-up">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nome do Objetivo</label>
              <input
                type="text" required placeholder="Ex: Consola PS5"
                value={nome} onChange={e => setNome(e.target.value)}
                className="w-full px-3 py-2 border border-darkBorder rounded-lg bg-darkBg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-techPurple"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Valor Meta (€)</label>
              <input
                type="number" step="0.01" min="1" required placeholder="500.00"
                value={meta} onChange={e => setMeta(e.target.value)}
                className="w-full px-3 py-2 border border-darkBorder rounded-lg bg-darkBg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-techPurple"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Escolher Ícone</label>
            <div className="flex flex-wrap gap-2">
              {emojisPreset.map(item => (
                <button
                  key={item} type="button" onClick={() => setEmoji(item)}
                  className={`h-8 w-8 rounded-lg text-base flex items-center justify-center border transition-all cursor-pointer ${emoji === item ? 'bg-techPurple/20 border-techPurple text-slate-100 scale-105' : 'bg-darkBg border-darkBorder hover:border-slate-500'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button" onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-darkBorder text-slate-400 hover:bg-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-techPurple text-darkBg rounded-lg text-xs font-bold hover:opacity-90 transition cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </form>
      )}

      {/* Lista de Cofres */}
      {cofres.length === 0 ? (
        <div className="text-center py-6 bg-darkBg/30 rounded-xl border border-dashed border-darkBorder/40">
          <HelpCircle className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Ainda não criaste nenhum cofre de poupança.</p>
          <p className="text-[10px] text-slate-600 mt-1">Cria metas para dividir e guardar o teu saldo geral.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cofres.map((vault) => {
            const progresso = Math.min(100, Math.round((vault.saldo / vault.meta) * 100)) || 0;
            return (
              <div key={vault.id} className="bg-darkBg/40 p-4 rounded-xl border border-darkBorder/60 space-y-3 relative overflow-hidden group">
                
                {/* Header do Item */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-slate-900 border border-darkBorder rounded-xl flex items-center justify-center text-lg">
                      {vault.emoji}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-200 leading-snug">{vault.nome}</h4>
                      <p className="text-[10px] text-slate-400">
                        {vault.saldo.toFixed(2)}€ de {vault.meta.toFixed(2)}€
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setTransferModal({ type: 'in', vaultId: vault.id })}
                      className="p-1.5 bg-techGreen/10 border border-techGreen/25 text-techGreen hover:bg-techGreen hover:text-darkBg rounded-lg transition cursor-pointer"
                      title="Alocar Saldo"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setTransferModal({ type: 'out', vaultId: vault.id })}
                      disabled={vault.saldo <= 0}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${vault.saldo > 0 ? 'bg-techCyan/10 border-techCyan/25 text-techCyan hover:bg-techCyan hover:text-darkBg' : 'bg-slate-800/30 border-slate-700/30 text-slate-600 cursor-not-allowed'}`}
                      title="Resgatar Saldo"
                    >
                      <ArrowDownLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVault(vault)}
                      className="p-1.5 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                      title="Eliminar Cofre"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Progresso</span>
                    <span className="text-techPurple">{progresso}%</span>
                  </div>
                  <div className="w-full h-2 bg-darkBg rounded-full overflow-hidden border border-darkBorder/40">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progresso === 100 ? 'bg-gradient-to-r from-techGreen to-emerald-400' : 'bg-gradient-to-r from-techPurple to-techCyan'}`}
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Transferência de Dinheiro */}
      {transferModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkCard border border-darkBorder w-full max-w-sm rounded-2xl shadow-neonCyan overflow-hidden animate-scale-up">
            <div className="px-5 py-4 border-b border-darkBorder flex justify-between items-center bg-darkBg/50">
              <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                {transferModal.type === 'in' ? (
                  <><ArrowUpRight className="h-5 w-5 text-techGreen" /><span>Guardar no Cofre</span></>
                ) : (
                  <><ArrowDownLeft className="h-5 w-5 text-techCyan" /><span>Resgatar para o Saldo</span></>
                )}
              </h3>
              <button onClick={() => { setTransferModal(null); setTransferValue(''); }} className="text-slate-400 hover:text-slate-200 text-xl font-bold cursor-pointer">&times;</button>
            </div>

            <form onSubmit={handleTransfer}>
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-400 leading-normal">
                  {transferModal.type === 'in'
                    ? `Quantos fundos do teu saldo disponível (${saldoDisponivel.toFixed(2)}€) queres colocar neste cofre?`
                    : `Quanto pretendes resgatar deste cofre e devolver para o teu saldo disponível?`
                  }
                </p>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Valor da Transferência (€)</label>
                  <input
                    type="number" step="0.01" min="0.01" required autoFocus
                    placeholder="0.00" value={transferValue} onChange={e => setTransferValue(e.target.value)}
                    className="w-full px-3 py-2.5 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-1 focus:ring-techPurple text-sm"
                  />
                </div>
              </div>

              <div className="px-5 py-3 border-t border-darkBorder bg-darkBg/30 flex justify-end space-x-2">
                <button type="button" onClick={() => { setTransferModal(null); setTransferValue(''); }} className="px-3.5 py-1.5 border border-darkBorder text-slate-400 hover:bg-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-techPurple text-darkBg rounded-lg text-xs font-bold hover:opacity-90 shadow-neonCyan transition cursor-pointer">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
