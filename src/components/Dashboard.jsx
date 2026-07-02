import React, { useState } from 'react';
import { Plus, Minus, Euro, Lock, Unlock, Cpu, Zap, Activity, Info } from 'lucide-react';

export default function Dashboard({ profile, onAddTransaction }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('entrada');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const saldo = profile?.saldo_total || 0;
  const nivel = profile?.nivel_construcao || 1;

  const getLevelDetails = (lvl) => {
    switch (lvl) {
      case 1: return { title: "Alicerce Digital", desc: "Fundação do seu mealheiro cibernético. Poupança inicial abaixo de 50€.", color: "border-slate-700 text-slate-500", glow: "rgba(100, 116, 139, 0.15)" };
      case 2: return { title: "Cofre Básico", desc: "Colunas e painel de energia ativados. Poupança entre 50€ e 150€.", color: "border-blue-500/50 text-blue-400", glow: "rgba(59, 130, 246, 0.25)" };
      case 3: return { title: "Cofre Reforçado", desc: "Porta de segurança blindada de alta frequência instalada. Poupança entre 150€ e 300€.", color: "border-techCyan/50 text-techCyan", glow: "rgba(0, 240, 255, 0.35)" };
      case 4: return { title: "Cofre de Energia Avançado", desc: "Núcleo de fusão e escudos quânticos online. Poupança entre 300€ e 500€.", color: "border-techPurple/50 text-techPurple", glow: "rgba(189, 0, 255, 0.4)" };
      case 5: return { title: "Mansão Tecnológica / Cofre Máximo", desc: "Sistema quântico de potência total ativo! Poupança acima de 500€.", color: "border-techGreen/50 text-techGreen", glow: "rgba(0, 255, 102, 0.5)" };
      default: return { title: "Alicerce Digital", desc: "Fundação do seu mealheiro.", color: "border-slate-700 text-slate-500", glow: "rgba(100, 116, 139, 0.15)" };
    }
  };

  const currentLevel = getLevelDetails(nivel);

  const openTransactionModal = (type) => {
    setModalType(type);
    setValor('');
    setDescricao('');
    setValidationError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    const parsedVal = parseFloat(valor);
    if (isNaN(parsedVal) || parsedVal <= 0) { setValidationError('Insira um valor numérico válido superior a zero.'); return; }
    if (modalType === 'saida' && parsedVal > saldo) { setValidationError('Saldo insuficiente para realizar este levantamento.'); return; }
    setSubmitting(true);
    try {
      await onAddTransaction(parsedVal, modalType, descricao);
      setModalOpen(false);
    } catch (err) {
      setValidationError(err.message || 'Erro ao processar transação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-darkCard p-8 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-techCyan/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              <Activity className="h-4 w-4 text-techCyan" />
              <span>Saldo Disponível</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {saldo.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-3xl font-bold text-techCyan">€</span>
            </div>
            <p className="mt-4 text-sm text-slate-400 border-t border-darkBorder/50 pt-4">
              Mealheiro físico sincronizado automaticamente com a base de dados em tempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => openTransactionModal('entrada')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-techGreen/20 to-techGreen/40 hover:from-techGreen/30 hover:to-techGreen/50 border border-techGreen/40 hover:border-techGreen text-techGreen font-bold py-4 px-6 rounded-xl transition-all duration-200 glow-green-hover shadow-sm cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              <span>Depositar</span>
            </button>
            <button
              onClick={() => openTransactionModal('saida')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500/10 to-red-500/30 hover:from-red-500/20 hover:to-red-500/40 border border-red-500/30 hover:border-red-500 text-red-400 font-bold py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <Minus className="h-5 w-5" />
              <span>Retirar</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 bg-darkCard p-8 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-4 left-4 flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Cpu className="h-4 w-4 text-techPurple" />
            <span>Simulador de Mealheiro Físico (Nível {nivel}/5)</span>
          </div>

          <div className="w-full h-64 my-6 flex items-center justify-center relative">
            <div
              className="absolute w-48 h-48 rounded-full blur-3xl opacity-30 transition-all duration-500 animate-pulse"
              style={{ backgroundColor: currentLevel.glow }}
            ></div>

            <div className="relative w-56 h-56 flex items-center justify-center">
              <div className="absolute bottom-6 w-44 h-8 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center shadow-md">
                <div className="w-full h-1 bg-slate-600/50 rounded mx-3"></div>
              </div>

              {nivel >= 2 ? (
                <>
                  <div className="absolute bottom-14 left-10 w-4 h-24 bg-gradient-to-t from-slate-700 to-slate-500 border border-slate-600 rounded-t shadow-md"></div>
                  <div className="absolute bottom-14 right-10 w-4 h-24 bg-gradient-to-t from-slate-700 to-slate-500 border border-slate-600 rounded-t shadow-md"></div>
                </>
              ) : (
                <>
                  <div className="absolute bottom-14 left-10 w-4 h-6 border border-dashed border-slate-700/40 rounded-t"></div>
                  <div className="absolute bottom-14 right-10 w-4 h-6 border border-dashed border-slate-700/40 rounded-t"></div>
                </>
              )}

              {nivel >= 3 ? (
                <div className="absolute bottom-14 w-28 h-24 bg-gradient-to-b from-darkCard to-slate-900 border-2 border-techCyan/60 rounded-xl flex flex-col items-center justify-center shadow-neonCyan animate-pulse">
                  {nivel >= 4 ? <Unlock className="h-8 w-8 text-techCyan animate-bounce" /> : <Lock className="h-8 w-8 text-slate-500" />}
                  <span className="text-[10px] uppercase font-bold text-techCyan mt-1 tracking-wider">Secure Lock</span>
                </div>
              ) : (
                <div className="absolute bottom-14 w-28 h-24 border border-dashed border-slate-800 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-slate-600">Lvl 3 Desbloqueia</span>
                </div>
              )}

              {nivel >= 4 ? (
                <>
                  <div className="absolute top-10 w-32 h-6 bg-slate-800 border border-slate-700 rounded-b flex items-center justify-center">
                    <div className="w-16 h-2 bg-techPurple rounded-full shadow-neonPurple animate-pulse"></div>
                  </div>
                  <div className="absolute top-16 left-16 w-1 h-8 bg-techPurple shadow-neonPurple"></div>
                  <div className="absolute top-16 right-16 w-1 h-8 bg-techPurple shadow-neonPurple"></div>
                </>
              ) : (
                nivel >= 3 && <div className="absolute top-10 w-32 h-6 border border-dashed border-slate-800 rounded-b"></div>
              )}

              {nivel === 5 && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="absolute w-52 h-52 border border-techGreen/50 rounded-full animate-ping opacity-25"></div>
                  <div className="absolute w-44 h-44 border-2 border-dashed border-techGreen/40 rounded-full animate-spin"></div>
                  <div className="absolute -top-2 flex items-center justify-center space-x-1 px-3 py-1 bg-techGreen/10 border border-techGreen/30 rounded-full shadow-neonGreen">
                    <Zap className="h-3 w-3 text-techGreen animate-bounce" />
                    <span className="text-[9px] font-bold text-techGreen uppercase tracking-widest">Max Power</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full text-center bg-darkBg/60 p-4 rounded-xl border border-darkBorder mt-4">
            <h4 className="font-bold text-slate-200 text-lg flex items-center justify-center space-x-2">
              <span className={`w-3.5 h-3.5 rounded-full bg-current ${currentLevel.color}`}></span>
              <span>{currentLevel.title}</span>
            </h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{currentLevel.desc}</p>
            <div className="mt-3.5 flex items-center justify-center space-x-1.5">
              {[1, 2, 3, 4, 5].map((lvlNum) => (
                <div
                  key={lvlNum}
                  className={`h-2.5 w-10 rounded-full transition-all duration-300 ${
                    nivel >= lvlNum
                      ? lvlNum === 5 ? 'bg-techGreen shadow-neonGreen'
                        : lvlNum === 4 ? 'bg-techPurple shadow-neonPurple'
                        : lvlNum === 3 ? 'bg-techCyan shadow-neonCyan'
                        : 'bg-blue-500'
                      : 'bg-slate-800 border border-slate-700/50'
                  }`}
                  title={`Nível ${lvlNum}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkCard border border-darkBorder w-full max-w-md rounded-2xl shadow-neonCyan overflow-hidden">
            <div className="px-6 py-5 border-b border-darkBorder flex justify-between items-center bg-darkBg/50">
              <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                {modalType === 'entrada' ? (
                  <><Plus className="h-6 w-6 text-techGreen" /><span>Depositar Fundos</span></>
                ) : (
                  <><Minus className="h-6 w-6 text-red-400" /><span>Retirar Fundos</span></>
                )}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-2xl font-bold focus:outline-none">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {validationError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-200 rounded-lg text-xs flex items-center space-x-2">
                    <Info className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Valor do {modalType === 'entrada' ? 'Depósito' : 'Levantamento'} (€)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Euro className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="number" step="0.01" min="0.01" required autoFocus
                      value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0.00"
                      className="block w-full pl-10 pr-3 py-3 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Descrição (Opcional)</label>
                  <input
                    type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}
                    placeholder={modalType === 'entrada' ? 'Ex: Dinheiro de prenda' : 'Ex: Compra de teclado'}
                    className="block w-full px-3 py-3 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-darkBorder bg-darkBg/50 flex justify-end space-x-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-darkBorder text-slate-300 hover:bg-slate-800 rounded-xl text-sm font-semibold transition">
                  Cancelar
                </button>
                <button
                  type="submit" disabled={submitting}
                  className={`px-5 py-2 rounded-xl text-sm font-bold text-darkBg transition flex items-center space-x-1.5 ${modalType === 'entrada' ? 'bg-gradient-to-r from-techGreen to-emerald-400 hover:opacity-90 shadow-neonGreen' : 'bg-gradient-to-r from-red-500 to-rose-400 hover:opacity-90'}`}
                >
                  {submitting ? <div className="h-4 w-4 border-2 border-darkBg border-t-transparent rounded-full animate-spin"></div> : <span>Confirmar</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
