import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Info, DollarSign, HelpCircle } from 'lucide-react';

export default function SimuladorJuros() {
  const [mensal, setMensal] = useState(50);
  const [taxa, setTaxa] = useState(5);
  const [anos, setAnos] = useState(10);

  // Lógica de cálculo de juros compostos mês a mês agrupados por ano
  const data = useMemo(() => {
    const list = [];
    const taxaMensal = (taxa / 100) / 12;
    let acumuladoTotal = 0;
    let investidoTotal = 0;

    for (let ano = 1; ano <= anos; ano++) {
      // 12 depósitos mensais por ano
      for (let mes = 1; mes <= 12; mes++) {
        investidoTotal += mensal;
        acumuladoTotal = (acumuladoTotal + mensal) * (1 + taxaMensal);
      }
      
      const jurosGanhos = Math.max(0, acumuladoTotal - investidoTotal);

      list.push({
        ano: `Ano ${ano}`,
        'Total Investido': Math.round(investidoTotal),
        'Juros Acumulados': Math.round(jurosGanhos),
        'Valor Total': Math.round(acumuladoTotal)
      });
    }
    return list;
  }, [mensal, taxa, anos]);

  const finalInvestido = data[data.length - 1]?.['Total Investido'] || 0;
  const finalTotal = data[data.length - 1]?.['Valor Total'] || 0;
  const finalJuros = Math.max(0, finalTotal - finalInvestido);

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6 mt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-techGreen" />
            <span>Simulador de Juros Compostos</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Vê quanto o teu dinheiro pode crescer se o investires a longo prazo em vez de o guardares parado.
          </p>
        </div>
        <div className="flex items-center space-x-1.5 bg-darkBg border border-darkBorder px-3 py-1.5 rounded-xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Poder do Investimento</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Sliders de Controlo (4 colunas no Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Slider 1: Depósito Mensal */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-350">
              <span>Depósito Mensal</span>
              <span className="text-techCyan font-bold">{mensal} €</span>
            </div>
            <input
              type="range" min="10" max="1000" step="10"
              value={mensal} onChange={(e) => setMensal(Number(e.target.value))}
              className="w-full h-1.5 bg-darkBg rounded-lg appearance-none cursor-pointer accent-techCyan"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>10€</span>
              <span>1000€</span>
            </div>
          </div>

          {/* Slider 2: Taxa de Juro Anual */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-350">
              <span>Taxa de Juro Anual</span>
              <span className="text-techGreen font-bold">{taxa} %</span>
            </div>
            <input
              type="range" min="1" max="15" step="0.5"
              value={taxa} onChange={(e) => setTaxa(Number(e.target.value))}
              className="w-full h-1.5 bg-darkBg rounded-lg appearance-none cursor-pointer accent-techGreen"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Slider 3: Período em Anos */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-350">
              <span>Prazo (Anos)</span>
              <span className="text-techPurple font-bold">{anos} anos</span>
            </div>
            <input
              type="range" min="1" max="30" step="1"
              value={anos} onChange={(e) => setAnos(Number(e.target.value))}
              className="w-full h-1.5 bg-darkBg rounded-lg appearance-none cursor-pointer accent-techPurple"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 ano</span>
              <span>30 anos</span>
            </div>
          </div>

        </div>

        {/* Gráfico do Resultado (8 colunas no Desktop) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="h-64 w-full bg-slate-950/45 p-2 rounded-xl border border-darkBorder/40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="ano" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Total Investido" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Juros Acumulados" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-darkBg/60 p-3 rounded-xl border border-darkBorder/50">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Total Poupar</span>
              <span className="text-sm font-black text-slate-200">{finalInvestido.toLocaleString('pt-PT')} €</span>
            </div>
            <div className="bg-darkBg/60 p-3 rounded-xl border border-darkBorder/50">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Juros Ganhos</span>
              <span className="text-sm font-black text-techGreen">{finalJuros.toLocaleString('pt-PT')} €</span>
            </div>
            <div className="bg-darkBg/60 p-3 rounded-xl border border-darkBorder/50">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Total Acumulado</span>
              <span className="text-sm font-black text-techCyan">{finalTotal.toLocaleString('pt-PT')} €</span>
            </div>
          </div>

        </div>

      </div>

      {/* Caixa de Explicação Simplificada */}
      <div className="bg-gradient-to-tr from-techGreen/5 to-techCyan/5 p-4 rounded-xl border border-techGreen/20 flex items-start space-x-3 text-xs">
        <Info className="h-5 w-5 text-techGreen shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          Se guardasses apenas este valor de lado, pouparias um total de <strong className="text-slate-200">{finalInvestido}€</strong>. 
          Ao investires com uma taxa anual de <strong className="text-techGreen">{taxa}%</strong>, ganhas extra{' '}
          <strong className="text-techGreen">{finalJuros}€</strong> gerados apenas pelos juros. O teu montante total cresce para{' '}
          <strong className="text-techCyan">{finalTotal}€</strong>!
        </p>
      </div>

    </div>
  );
}
