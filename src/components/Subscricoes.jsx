import React, { useState } from 'react';
import { Calendar, CreditCard, Plus, Trash2, AlertCircle, Tv, Music, Heart, Shield, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Subscricoes({ profile, onUpdateProfile }) {
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [diaCobranca, setDiaCobranca] = useState(1);
  const [categoria, setCategoria] = useState('Outros');

  const subscricoes = profile?.subscricoes || [];

  const categoriasPreset = [
    { value: 'Entretenimento', icon: Tv, color: 'text-red-400' },
    { value: 'Música', icon: Music, color: 'text-techCyan' },
    { value: 'Saúde', icon: Heart, color: 'text-techGreen' },
    { value: 'Serviços/Utilidades', icon: Shield, color: 'text-yellow-400' },
    { value: 'Outros', icon: HelpCircle, color: 'text-slate-400' }
  ];

  const handleAddSubscription = async (e) => {
    e.preventDefault();
    const parsedVal = parseFloat(valor);
    const parsedDay = parseInt(diaCobranca);

    if (!nome.trim()) { toast.error('Insere o nome do serviço.'); return; }
    if (isNaN(parsedVal) || parsedVal <= 0) { toast.error('Insere um valor de mensalidade válido.'); return; }
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) { toast.error('O dia de cobrança deve ser entre 1 e 31.'); return; }

    const novaSub = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      valor: parsedVal,
      dia_cobranca: parsedDay,
      categoria
    };

    const novasSubs = [...subscricoes, novaSub];
    try {
      await onUpdateProfile({ subscricoes: novasSubs });
      toast.success(`Subscrição "${nome}" adicionada!`);
      setNome('');
      setValor('');
      setDiaCobranca(1);
      setCategoria('Outros');
      setShowForm(false);
    } catch {
      toast.error('Erro ao salvar subscrição.');
    }
  };

  const handleDeleteSubscription = async (id, name) => {
    if (!window.confirm(`Desejas remover a subscrição "${name}"?`)) return;

    const novasSubs = subscricoes.filter(s => s.id !== id);
    try {
      await onUpdateProfile({ subscricoes: novasSubs });
      toast.success(`Subscrição "${name}" removida.`);
    } catch {
      toast.error('Erro ao eliminar subscrição.');
    }
  };

  const getDaysRemaining = (dayOfMonth) => {
    const today = new Date();
    // Definir horas a zero para não influenciar a diferença de dias inteiros
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Dia de cobrança no mês atual
    let target = new Date(currentYear, currentMonth, dayOfMonth);
    target.setHours(0, 0, 0, 0);

    // Se o dia já passou no mês atual, aponta para o próximo mês
    if (target < today) {
      target = new Date(currentYear, currentMonth + 1, dayOfMonth);
    }

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalMensal = subscricoes.reduce((acc, s) => acc + parseFloat(s.valor), 0.00);

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6 mt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-techCyan" />
            <span>Subscrições & Contas Recorrentes</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Gere as tuas mensalidades ativas (Netflix, Spotify, Renda, etc.) e previne surpresas no saldo.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Custo Total Mensal</span>
            <span className="text-base font-black text-techCyan">{totalMensal.toFixed(2)} €</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-2 bg-techCyan/10 border border-techCyan/35 text-techCyan hover:bg-techCyan hover:text-darkBg rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Serviço</span>
          </button>
        </div>
      </div>

      {/* Formulário de Criação */}
      {showForm && (
        <form onSubmit={handleAddSubscription} className="bg-darkBg/60 p-5 rounded-xl border border-darkBorder space-y-4 animate-scale-up">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            
            <div className="sm:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nome do Serviço</label>
              <input
                type="text" required placeholder="Ex: Netflix, Ginásio"
                value={nome} onChange={e => setNome(e.target.value)}
                className="w-full px-3 py-2 border border-darkBorder rounded-lg bg-darkBg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-techCyan"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Mensalidade (€)</label>
              <input
                type="number" step="0.01" min="0.01" required placeholder="14.99"
                value={valor} onChange={e => setValor(e.target.value)}
                className="w-full px-3 py-2 border border-darkBorder rounded-lg bg-darkBg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-techCyan"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Dia Cobrança</label>
              <input
                type="number" min="1" max="31" required placeholder="15"
                value={diaCobranca} onChange={e => setDiaCobranca(e.target.value)}
                className="w-full px-3 py-2 border border-darkBorder rounded-lg bg-darkBg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-techCyan"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Categoria</label>
              <select
                value={categoria} onChange={e => setCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-darkBorder rounded-lg bg-darkBg text-xs text-slate-350 focus:outline-none focus:ring-1 focus:ring-techCyan"
              >
                {categoriasPreset.map(c => (
                  <option key={c.value} value={c.value} className="bg-darkCard text-slate-300">{c.value}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button" onClick={() => setShowForm(false)}
              className="px-3.5 py-1.5 border border-darkBorder text-slate-400 hover:bg-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-techCyan text-darkBg rounded-lg text-xs font-bold hover:opacity-90 transition cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </form>
      )}

      {/* Grid de Subscrições */}
      {subscricoes.length === 0 ? (
        <div className="text-center py-8 bg-darkBg/30 rounded-xl border border-dashed border-darkBorder/40">
          <CreditCard className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Ainda não registaste nenhuma subscrição recorrente.</p>
          <p className="text-[10px] text-slate-600 mt-1">Regista mensalidades fixas para controlar o teu custo acumulado mensal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscricoes.map((sub) => {
            const diasFaltam = getDaysRemaining(sub.dia_cobranca);
            const catInfo = categoriasPreset.find(c => c.value === sub.categoria) || categoriasPreset[4];
            const CatIcon = catInfo.icon;

            // Níveis de alerta por data de expiração
            let statusColor = 'text-slate-400 bg-slate-800/40 border-slate-700/50';
            if (diasFaltam === 0) {
              statusColor = 'text-red-400 bg-red-950/20 border-red-500/40 animate-pulse';
            } else if (diasFaltam <= 3) {
              statusColor = 'text-red-400 bg-red-950/10 border-red-500/30';
            } else if (diasFaltam <= 7) {
              statusColor = 'text-amber-400 bg-amber-950/10 border-amber-500/30';
            }

            return (
              <div key={sub.id} className="bg-darkBg/40 p-4 rounded-xl border border-darkBorder/60 flex items-center justify-between group hover:border-slate-700 transition">
                <div className="flex items-center space-x-3.5 min-w-0">
                  
                  {/* Category Badge Icon */}
                  <div className={`p-2.5 bg-slate-900 border border-darkBorder rounded-xl shrink-0 ${catInfo.color}`}>
                    <CatIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-200 truncate">{sub.nome}</h4>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-xs font-black text-slate-400">{sub.valor.toFixed(2)}€</span>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">/ mês</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Countdown Status */}
                  <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider shrink-0 text-center ${statusColor}`}>
                    {diasFaltam === 0 ? (
                      <span className="flex items-center space-x-1 text-red-500 font-black">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>Cobra Hoje</span>
                      </span>
                    ) : (
                      <span>Cobra em {diasFaltam} dias</span>
                    )}
                  </div>

                  {/* Delete Trigger */}
                  <button
                    onClick={() => handleDeleteSubscription(sub.id, sub.nome)}
                    className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition opacity-60 group-hover:opacity-100 cursor-pointer"
                    title="Remover Subscrição"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
