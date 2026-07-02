import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar, Tag, Trash2, SlidersHorizontal } from 'lucide-react';

export default function Historico({ transactions, onDeleteTransaction }) {
  const [filter, setFilter] = useState('todos');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'todos') return true;
    return t.tipo === filter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5 text-techCyan" />
            <span>Histórico de Transações</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Registo completo de todas as movimentações financeiras do mealheiro.
          </p>
        </div>

        <div className="flex space-x-1.5 bg-darkBg border border-darkBorder p-1 rounded-xl w-full sm:w-auto">
          {['todos', 'entrada', 'saida'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all capitalize ${
                filter === type
                  ? 'bg-gradient-to-r from-techCyan/20 to-techPurple/20 border border-techCyan/40 text-techCyan shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {type === 'todos' ? 'Todos' : type === 'entrada' ? 'Depósitos' : 'Levantamentos'}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-darkBorder rounded-xl bg-darkBg/30">
          <Tag className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Nenhuma transação encontrada.</p>
          <p className="text-slate-500 text-xs mt-1">Experimente adicionar uma nova movimentação na Dashboard.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-darkBorder/60 hidden md:table">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-4 pt-2">Tipo</th>
                <th className="pb-4 pt-2">Valor</th>
                <th className="pb-4 pt-2">Descrição</th>
                <th className="pb-4 pt-2">Data / Hora</th>
                <th className="pb-4 pt-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkBorder/30 text-sm text-slate-200">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-darkBg/20 group transition-colors">
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        t.tipo === 'entrada'
                          ? 'bg-techGreen/10 border-techGreen/30 text-techGreen'
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}
                    >
                      {t.tipo === 'entrada' ? (
                        <>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                          <span>Entrada</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="h-3.5 w-3.5" />
                          <span>Saída</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-slate-100">
                    <span className={t.tipo === 'entrada' ? 'text-techGreen' : 'text-red-400'}>
                      {t.tipo === 'entrada' ? '+' : '-'} {parseFloat(t.valor).toFixed(2)} €
                    </span>
                  </td>
                  <td className="py-4 text-slate-300">
                    {t.descricao || <span className="text-slate-500 italic text-xs">Sem descrição</span>}
                  </td>
                  <td className="py-4 text-slate-400 text-xs flex items-center space-x-1 mt-1 border-none">
                    <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{formatDate(t.criada_em)}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition duration-200 cursor-pointer"
                      title="Eliminar transação"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-4 md:hidden">
            {filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="bg-darkBg/40 border border-darkBorder/60 p-4 rounded-xl flex items-center justify-between space-x-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center p-1 rounded-lg border ${
                        t.tipo === 'entrada'
                          ? 'bg-techGreen/10 border-techGreen/30 text-techGreen'
                          : 'bg-red-500/10 border-red-500/20 text-red-400'
                      }`}
                    >
                      {t.tipo === 'entrada' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                    </span>
                    <span className="font-bold text-slate-100 text-base">
                      {t.tipo === 'entrada' ? '+' : '-'} {parseFloat(t.valor).toFixed(2)} €
                    </span>
                  </div>
                  
                  <p className="text-slate-300 text-xs truncate">
                    {t.descricao || <span className="text-slate-500 italic">Sem descrição</span>}
                  </p>

                  <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(t.criada_em)}</span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteTransaction(t.id)}
                  className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition duration-200 shrink-0 cursor-pointer"
                  title="Eliminar transação"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
