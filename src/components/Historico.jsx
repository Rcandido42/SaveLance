import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar, Tag, Trash2, SlidersHorizontal, Download, ChevronLeft, ChevronRight, AlertTriangle, FileText } from 'lucide-react';
import { getCategoriaEmoji } from '../lib/categorias';

const ITEMS_PER_PAGE = 10;

export default function Historico({ transactions, onDeleteTransaction }) {
  const [filter, setFilter] = useState('todos');
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredTransactions = transactions.filter(t => filter === 'todos' || t.tipo === filter);
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  const paginatedTransactions = filteredTransactions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    await onDeleteTransaction(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const exportCSV = () => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Valor (EUR)', 'Descricao'];
    const rows = filteredTransactions.map(t => [
      new Date(t.criada_em).toLocaleDateString('pt-PT'),
      t.tipo === 'entrada' ? 'Entrada' : 'Saída',
      t.categoria || 'Outros',
      parseFloat(t.valor).toFixed(2),
      `"${(t.descricao || '').replace(/"/g, "'")}"`,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savelance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    const today = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    let rowsHTML = '';
    let totalEntradas = 0;
    let totalSaidas = 0;

    filteredTransactions.forEach(t => {
      const valorNum = parseFloat(t.valor);
      if (t.tipo === 'entrada') totalEntradas += valorNum;
      else totalSaidas += valorNum;

      rowsHTML += `
        <tr>
          <td>${new Date(t.criada_em).toLocaleDateString('pt-PT')}</td>
          <td><span class="badge ${t.tipo}">${t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span></td>
          <td>${t.categoria || 'Outros'}</td>
          <td>${t.descricao || '-'}</td>
          <td class="amount ${t.tipo}">${t.tipo === 'entrada' ? '+' : '-'} ${valorNum.toFixed(2)} €</td>
        </tr>
      `;
    });

    const saldoFinal = totalEntradas - totalSaidas;

    printWindow.document.write(`
      <html>
        <head>
          <title>SaveLance - Extrato de Conta</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 40px; }
            .header { display: flex; justify-between: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: bold; color: #0f172a; }
            .meta-info { font-size: 12px; color: #64748b; text-align: right; }
            .summary-cards { display: flex; gap: 20px; margin-bottom: 30px; }
            .card { flex: 1; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; background: #f8fafc; }
            .card-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .card-val { font-size: 20px; font-weight: bold; margin-top: 5px; }
            .card-val.entrada { color: #10b981; }
            .card-val.saida { color: #ef4444; }
            .card-val.saldo { color: #0284c7; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            th { background-color: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 11px; }
            .amount { font-weight: bold; text-align: right; }
            th:last-child, td:last-child { text-align: right; }
            .amount.entrada { color: #10b981; }
            .amount.saida { color: #ef4444; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
            .badge.entrada { background: #d1fae5; color: #065f46; }
            .badge.saida { background: #fee2e2; color: #991b1b; }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">SaveLance Mealheiro</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Extrato Detalhado de Transações</div>
            </div>
            <div class="meta-info">
              <div>Emitido em: ${today}</div>
              <div>Filtro: ${filter.toUpperCase()}</div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card">
              <div class="card-label">Total Entradas</div>
              <div class="card-val entrada">+ ${totalEntradas.toFixed(2)} €</div>
            </div>
            <div class="card">
              <div class="card-label">Total Saídas</div>
              <div class="card-val saida">- ${totalSaidas.toFixed(2)} €</div>
            </div>
            <div class="card">
              <div class="card-label">Saldo do Extrato</div>
              <div class="card-val saldo">${saldoFinal.toFixed(2)} €</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML || '<tr><td colspan="5" style="text-align: center; color: #64748b;">Nenhuma transação encontrada para este filtro.</td></tr>'}
            </tbody>
          </table>

          <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8;" class="no-print">
            Pressione Ctrl+P ou utilize a opção de Impressão do navegador para Salvar em PDF.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
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
            {filteredTransactions.length} registo{filteredTransactions.length !== 1 ? 's' : ''} encontrado{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex space-x-1 bg-darkBg border border-darkBorder p-1 rounded-xl flex-1 sm:flex-none">
            {['todos', 'entrada', 'saida'].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === type
                    ? 'bg-gradient-to-r from-techCyan/20 to-techPurple/20 border border-techCyan/40 text-techCyan shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {type === 'todos' ? 'Todos' : type === 'entrada' ? 'Entradas' : 'Saídas'}
              </button>
            ))}
          </div>

          {filteredTransactions.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={exportCSV}
                className="flex items-center space-x-1.5 px-3 py-2 border border-darkBorder hover:border-techCyan/50 hover:bg-techCyan/5 text-slate-400 hover:text-techCyan rounded-xl text-xs font-semibold transition cursor-pointer shrink-0"
                title="Exportar CSV"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar CSV</span>
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center space-x-1.5 px-3 py-2 border border-darkBorder hover:border-techPurple/50 hover:bg-techPurple/5 text-slate-400 hover:text-techPurple rounded-xl text-xs font-semibold transition cursor-pointer shrink-0"
                title="Exportar PDF"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-darkBorder rounded-xl bg-darkBg/30">
          <Tag className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Nenhuma transação encontrada.</p>
          <p className="text-slate-500 text-xs mt-1">Experimente adicionar uma nova movimentação na Dashboard.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-darkBorder/60 hidden md:table">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-4 pt-2">Tipo</th>
                  <th className="pb-4 pt-2">Categoria</th>
                  <th className="pb-4 pt-2">Valor</th>
                  <th className="pb-4 pt-2">Descrição</th>
                  <th className="pb-4 pt-2">Data / Hora</th>
                  <th className="pb-4 pt-2 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-darkBorder/30 text-sm text-slate-200">
                {paginatedTransactions.map((t) => (
                  <React.Fragment key={t.id}>
                    <tr className="hover:bg-darkBg/20 transition-colors">
                      <td className="py-4">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          t.tipo === 'entrada' ? 'bg-techGreen/10 border-techGreen/30 text-techGreen' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                          {t.tipo === 'entrada' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          <span>{t.tipo === 'entrada' ? 'Entrada' : 'Saída'}</span>
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="text-slate-400 text-xs bg-slate-800 px-2 py-1 rounded-lg">
                          {getCategoriaEmoji(t.categoria || 'Outros')} {t.categoria || 'Outros'}
                        </span>
                      </td>
                      <td className="py-4 font-bold">
                        <span className={t.tipo === 'entrada' ? 'text-techGreen' : 'text-red-400'}>
                          {t.tipo === 'entrada' ? '+' : '-'} {parseFloat(t.valor).toFixed(2)} €
                        </span>
                      </td>
                      <td className="py-4 text-slate-300 max-w-[160px] truncate">
                        {t.descricao || <span className="text-slate-600 italic text-xs">Sem descrição</span>}
                      </td>
                      <td className="py-4 text-slate-400 text-xs">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{formatDate(t.criada_em)}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => setDeleteConfirmId(t.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                          title="Eliminar transação"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                    {deleteConfirmId === t.id && (
                      <tr className="bg-red-950/20">
                        <td colSpan={6} className="py-3 px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-red-300 text-sm">
                              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                              <span>Tens a certeza que queres eliminar esta transação? Esta ação não pode ser desfeita.</span>
                            </div>
                            <div className="flex space-x-2 shrink-0 ml-4">
                              <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 text-xs font-semibold border border-darkBorder text-slate-300 hover:bg-slate-700 rounded-lg transition cursor-pointer">
                                Cancelar
                              </button>
                              <button onClick={handleDeleteConfirm} className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition cursor-pointer">
                                Confirmar Eliminação
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            <div className="space-y-3 md:hidden">
              {paginatedTransactions.map((t) => (
                <div key={t.id} className="space-y-2">
                  <div className="bg-darkBg/40 border border-darkBorder/60 p-4 rounded-xl flex items-center justify-between space-x-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center p-1 rounded-lg border ${t.tipo === 'entrada' ? 'bg-techGreen/10 border-techGreen/30 text-techGreen' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                          {t.tipo === 'entrada' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        </span>
                        <span className="font-bold text-slate-100">{t.tipo === 'entrada' ? '+' : '-'} {parseFloat(t.valor).toFixed(2)} €</span>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                          {getCategoriaEmoji(t.categoria || 'Outros')} {t.categoria || 'Outros'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs truncate">{t.descricao || <span className="italic text-slate-600">Sem descrição</span>}</p>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(t.criada_em)}</span>
                      </div>
                    </div>
                    <button onClick={() => setDeleteConfirmId(deleteConfirmId === t.id ? null : t.id)} className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition shrink-0 cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {deleteConfirmId === t.id && (
                    <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 flex items-center justify-between gap-2">
                      <p className="text-red-300 text-xs flex-1">Tens a certeza? Esta ação não pode ser desfeita.</p>
                      <div className="flex space-x-2 shrink-0">
                        <button onClick={() => setDeleteConfirmId(null)} className="px-2.5 py-1 text-xs border border-darkBorder text-slate-300 rounded-lg cursor-pointer">Não</button>
                        <button onClick={handleDeleteConfirm} className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-lg cursor-pointer">Sim</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-darkBorder/50">
              <span className="text-xs text-slate-500">
                Página {page} de {totalPages} ({filteredTransactions.length} registos)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-darkBorder text-slate-400 hover:text-slate-200 hover:border-slate-500 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-slate-600 text-xs">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 text-xs font-semibold rounded-xl transition cursor-pointer ${
                          page === p ? 'bg-techCyan/20 border border-techCyan/40 text-techCyan' : 'border border-darkBorder text-slate-400 hover:text-slate-200 hover:border-slate-500'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-darkBorder text-slate-400 hover:text-slate-200 hover:border-slate-500 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
