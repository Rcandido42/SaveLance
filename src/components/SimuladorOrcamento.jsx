import React, { useState } from 'react';
import { Target, TrendingUp, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';

export default function SimuladorOrcamento({ profile, saldo }) {
  const rendimento = parseFloat(profile?.rendimento_mensal || 0);
  const despesas = parseFloat(profile?.despesas_fixas || 0);
  const meta = parseFloat(profile?.meta_poupanca || 0);
  const meses = parseInt(profile?.meta_prazo_meses || 3);

  const saldoDisponivel = rendimento - despesas;
  const poupancaNecessariaMensal = meta > 0 ? meta / meses : 0;
  const limiteGastoRecomendado = Math.max(0, saldoDisponivel - poupancaNecessariaMensal);
  const impossivel = poupancaNecessariaMensal > saldoDisponivel;

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-techCyan/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center space-x-2">
        <TrendingUp className="h-5 w-5 text-techCyan" />
        <h3 className="font-bold text-slate-100">Recomendador & Simulador de Gastos</h3>
      </div>

      {meta > 0 && rendimento > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-darkBg/60 p-3 rounded-xl border border-darkBorder/40">
              <span className="text-slate-500 block mb-0.5">Poupança Mensal Requerida</span>
              <span className="text-slate-200 font-bold text-sm text-techCyan">{poupancaNecessariaMensal.toFixed(2)} €</span>
            </div>
            <div className="bg-darkBg/60 p-3 rounded-xl border border-darkBorder/40">
              <span className="text-slate-500 block mb-0.5">Saldo Livre Mensal</span>
              <span className="text-slate-200 font-bold text-sm">{saldoDisponivel.toFixed(2)} €</span>
            </div>
          </div>

          {impossivel ? (
            <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl flex items-start space-x-2.5 text-xs">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold block">Alerta: Meta Inviável!</span>
                <p className="leading-relaxed">
                  Para poupar {meta.toFixed(2)}€ em {meses} meses, precisas de guardar {poupancaNecessariaMensal.toFixed(2)}€ por mês. 
                  O teu saldo livre atual ({saldoDisponivel.toFixed(2)}€) é insuficiente. Recomendamos aumentar o prazo ou reduzir a meta.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-techGreen/10 border border-techGreen/30 text-slate-200 rounded-xl space-y-3">
              <div className="flex items-start space-x-2.5 text-xs">
                <ShieldCheck className="h-5 w-5 text-techGreen shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-extrabold text-techGreen block">Limite de Gastos Seguro</span>
                  <p className="text-slate-300 leading-relaxed">
                    Para cumprires a meta, podes gastar no máximo <span className="text-techGreen font-extrabold">{limiteGastoRecomendado.toFixed(2)} €</span> por mês (após pagar despesas fixas).
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-techGreen shadow-neonGreen rounded-full transition-all duration-500"
                  style={{ width: `${(limiteGastoRecomendado / (saldoDisponivel || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 border border-dashed border-darkBorder rounded-xl bg-darkBg/30">
          <p className="text-slate-500 text-xs px-4">
            Configura o teu Cargo, Salário, Despesas Fixas e Meta de Poupança no menu de perfil para ver o limite recomendado.
          </p>
        </div>
      )}
    </div>
  );
}
