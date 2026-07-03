import React, { useState } from 'react';
import { DollarSign, Landmark, ArrowRight, Activity, Percent } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

export default function SimuladorIRS() {
  const [salarioBruto, setSalarioBruto] = useState(1200);

  // Estimativa simplificada e progressiva de IRS e Segurança Social (11%) portuguesa
  const ss = salarioBruto * 0.11;
  
  // Taxa média progressiva estimada de IRS
  let irsTaxa = 0;
  if (salarioBruto > 4500) irsTaxa = 0.32;
  else if (salarioBruto > 3000) irsTaxa = 0.24;
  else if (salarioBruto > 2000) irsTaxa = 0.18;
  else if (salarioBruto > 1500) irsTaxa = 0.13;
  else if (salarioBruto > 1000) irsTaxa = 0.08;
  else if (salarioBruto > 820) irsTaxa = 0.04;
  else irsTaxa = 0.0; // Isento abaixo do salário mínimo nacional aproximado

  const irs = salarioBruto * irsTaxa;
  const salarioLiquido = Math.max(0, salarioBruto - ss - irs);

  // Data para o mini-gráfico Recharts
  const chartData = [
    { name: 'Bruto', valor: Math.round(salarioBruto), fill: '#64748b' },
    { name: 'S.S. (11%)', valor: Math.round(ss), fill: '#ef4444' },
    { name: 'IRS Est.', valor: Math.round(irs), fill: '#f59e0b' },
    { name: 'Líquido', valor: Math.round(salarioLiquido), fill: '#10b981' }
  ];

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6 mt-8">
      
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Landmark className="h-5 w-5 text-techCyan" />
          <span>Simulador de Salário Bruto vs Líquido</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Descobre quanto do teu salário bruto realmente levas para casa depois dos impostos em Portugal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Lado Esquerdo - Controlo */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Salário Bruto Mensal (€)</label>
            <div className="relative">
              <input
                type="number" step="50" min="400" max="20000"
                value={salarioBruto} onChange={e => setSalarioBruto(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2.5 border border-darkBorder rounded-xl bg-darkBg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-techCyan font-bold"
              />
              <span className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-bold uppercase">Bruto</span>
            </div>
          </div>

          <div className="bg-darkBg/60 p-4 rounded-xl border border-darkBorder/70 space-y-2.5 text-xs text-slate-400">
            <div className="flex justify-between items-center">
              <span>Desconto Segurança Social (11%)</span>
              <span className="font-semibold text-red-400">-{ss.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Retenção IRS Est. ({(irsTaxa * 100).toFixed(0)}%)</span>
              <span className="font-semibold text-amber-500">-{irs.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center border-t border-darkBorder/40 pt-2 text-slate-200 font-bold">
              <span>Salário Líquido (Real)</span>
              <span className="text-techGreen">{salarioLiquido.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Lado Direito - Mini Gráfico Recharts */}
        <div className="lg:col-span-7 space-y-3">
          <div className="h-44 w-full bg-slate-950/45 p-2 rounded-xl border border-darkBorder/40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 15, left: -10, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px' }}
                  labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                />
                <Bar dataKey="valor" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center space-x-1.5 justify-center text-[10px] text-slate-500">
            <Percent className="h-3.5 w-3.5 text-slate-500" />
            <span>Contempla tabelas de retenção geral padrão para solteiro sem dependentes.</span>
          </div>
        </div>

      </div>

    </div>
  );
}
