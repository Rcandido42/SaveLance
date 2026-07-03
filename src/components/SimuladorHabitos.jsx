import React, { useState } from 'react';
import { Coffee, TrendingUp, Sparkles, Smile, ArrowRight, Heart } from 'lucide-react';

export default function SimuladorHabitos() {
  const [custoDiario, setCustoDiario] = useState(2.50);
  const [habitoPersonalizado, setHabitoPersonalizado] = useState('');

  const habitosPreset = [
    { name: 'Café + Pastel de nata na rua', val: 2.00, icon: Coffee },
    { name: 'Almoçar fora diariamente', val: 9.50, icon: Sparkles },
    { name: 'Tabaco / Vaping', val: 5.20, icon: Heart },
    { name: 'Compras impulsivas online', val: 4.00, icon: Smile }
  ];

  const handleApplyPreset = (val) => {
    setCustoDiario(val);
  };

  const totalMensal = custoDiario * 30.5;
  const totalAnual = custoDiario * 365;
  const totalCincoAnos = totalAnual * 5;

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6 mt-8">
      
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Coffee className="h-5 w-5 text-techCyan" />
          <span>Simulador de Poupança de Hábitos</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Descobre quanto dinheiro podes poupar ao reduzir pequenos gastos desnecessários do dia-a-dia.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Lado Esquerdo - Controles */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Presets Rápidos */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gastos Frequentes</span>
            <div className="grid grid-cols-2 gap-2">
              {habitosPreset.map(item => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.name} type="button"
                    onClick={() => handleApplyPreset(item.val)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${custoDiario === item.val ? 'bg-techCyan/10 border-techCyan text-techCyan font-bold' : 'bg-darkBg border-darkBorder text-slate-400 hover:border-slate-500'}`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <ItemIcon className="h-3.5 w-3.5" />
                      <span className="truncate">{item.name.split(' ')[0]}</span>
                    </div>
                    <span className="block font-black text-slate-200">{item.val.toFixed(2)}€/dia</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Customizado */}
          <div className="pt-2 border-t border-darkBorder/40">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Custo Diário Personalizado (€)</label>
            <div className="relative">
              <input
                type="number" step="0.10" min="0.10"
                value={custoDiario} onChange={e => setCustoDiario(Math.max(0.10, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-darkBorder rounded-xl bg-darkBg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-techCyan"
              />
              <span className="absolute right-3 top-2 text-[10px] text-slate-500 font-bold uppercase">Ao Dia</span>
            </div>
          </div>

        </div>

        {/* Lado Direito - Projeções */}
        <div className="lg:col-span-7 bg-darkBg/60 p-4 rounded-xl border border-darkBorder flex flex-col justify-around h-full space-y-4">
          
          <div className="flex items-center justify-between border-b border-darkBorder/40 pb-2">
            <span className="text-xs text-slate-400 font-semibold">Se poupares este valor todos os dias:</span>
            <span className="text-sm font-black text-techCyan">{custoDiario.toFixed(2)} €</span>
          </div>

          <div className="space-y-3">
            
            {/* Mensal */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center space-x-1">
                <ArrowRight className="h-3 w-3 text-techCyan" />
                <span>Em 1 Mês (30 dias)</span>
              </span>
              <span className="font-extrabold text-slate-200">{totalMensal.toFixed(2)} €</span>
            </div>

            {/* Anual */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center space-x-1">
                <ArrowRight className="h-3 w-3 text-techCyan" />
                <span>Em 1 Ano (365 dias)</span>
              </span>
              <span className="font-extrabold text-techGreen">{totalAnual.toFixed(2)} €</span>
            </div>

            {/* 5 Anos */}
            <div className="flex items-center justify-between text-xs border-t border-darkBorder/30 pt-2.5">
              <span className="text-slate-300 font-bold flex items-center space-x-1">
                <TrendingUp className="h-3.5 w-3.5 text-techPurple" />
                <span>Em 5 Anos</span>
              </span>
              <span className="font-black text-techPurple text-sm">{totalCincoAnos.toFixed(2)} €</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
