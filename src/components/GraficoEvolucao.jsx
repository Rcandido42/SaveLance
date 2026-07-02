import React, { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#00f0ff', '#00ff66', '#bd00ff', '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9f43', '#a29bfe'];

const CustomAreaTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-darkCard border border-darkBorder p-3 rounded-xl shadow-lg text-sm">
        <p className="text-slate-400 text-xs mb-1">{payload[0].payload.data}</p>
        <p className="font-bold text-techCyan">{Number(payload[0].value).toFixed(2)} €</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-darkCard border border-darkBorder p-3 rounded-xl shadow-lg text-sm">
        <p className="text-slate-200 font-semibold">{payload[0].name}</p>
        <p className="text-techCyan">{Number(payload[0].value).toFixed(2)} €</p>
      </div>
    );
  }
  return null;
};

export default function GraficoEvolucao({ transactions }) {
  const evolutionData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const sorted = [...transactions].reverse();
    let saldo = 0;
    return sorted.map(t => {
      saldo = t.tipo === 'entrada' ? saldo + parseFloat(t.valor) : saldo - parseFloat(t.valor);
      return {
        data: new Date(t.criada_em).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
        saldo: parseFloat(saldo.toFixed(2)),
      };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const grouped = {};
    transactions
      .filter(t => t.tipo === 'saida')
      .forEach(t => {
        const cat = t.categoria || 'Outros';
        grouped[cat] = (grouped[cat] || 0) + parseFloat(t.valor);
      });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-techCyan" />
          <h3 className="text-xl font-bold text-slate-100">Evolução do Saldo</h3>
        </div>
        <div className="h-40 flex items-center justify-center border border-dashed border-darkBorder rounded-xl bg-darkBg/30">
          <p className="text-slate-500 text-sm">Adiciona transações para ver o gráfico de evolução.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-techCyan" />
            <h3 className="text-xl font-bold text-slate-100">Evolução do Saldo</h3>
            <span className="text-xs text-slate-500 ml-auto">{evolutionData.length} transações</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={evolutionData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="saldoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222f47" vertical={false} />
              <XAxis dataKey="data" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
              <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: '#00f0ff', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="saldo" stroke="#00f0ff" strokeWidth={2.5} fill="url(#saldoGrad)" dot={false} activeDot={{ r: 5, fill: '#00f0ff', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5 text-techPurple" />
            <h3 className="text-base font-bold text-slate-100">Gastos por Categoria</h3>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
                  iconSize={8}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center border border-dashed border-darkBorder rounded-xl bg-darkBg/30">
              <p className="text-slate-600 text-xs text-center px-4">Sem saídas registadas para mostrar categorias.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
