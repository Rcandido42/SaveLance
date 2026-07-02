import React from 'react';
import { Award, Lock, Sparkles, Trophy, BadgeCheck, Target, Compass, Flag } from 'lucide-react';

export default function Conquistas({ achievements }) {
  const allAchievements = [
    {
      key: 'Primeiro Passo',
      title: 'Primeiro Passo',
      req: 'Efetuar a primeira transação (depósito ou levantamento) no mealheiro.',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      glow: 'rgba(59, 130, 246, 0.35)',
    },
    {
      key: 'Mão Pesada',
      title: 'Mão Pesada',
      req: 'Realizar um depósito único de valor igual ou superior a 50.00 €.',
      icon: Award,
      color: 'from-techPurple to-pink-650',
      glow: 'rgba(189, 0, 255, 0.35)',
    },
    {
      key: 'Poupador Consistente',
      title: 'Poupador Consistente',
      req: 'Atingir um saldo total acumulado de pelo menos 200.00 €.',
      icon: Trophy,
      color: 'from-techCyan to-teal-500',
      glow: 'rgba(0, 240, 255, 0.35)',
    },
    {
      key: 'Mestre do Mealheiro',
      title: 'Mestre do Mealheiro',
      req: 'Alcançar um saldo igual ou superior a 500.00 €.',
      icon: BadgeCheck,
      color: 'from-yellow-400 to-amber-500',
      glow: 'rgba(234, 179, 8, 0.35)',
    },
    {
      key: 'Imperador do Mealheiro',
      title: 'Imperador do Mealheiro',
      req: 'Alcançar o topo absoluto com um saldo igual ou superior a 1000.00 €.',
      icon: Trophy,
      color: 'from-emerald-400 to-techGreen',
      glow: 'rgba(0, 255, 102, 0.35)',
    },
    {
      key: 'Planeador Ativo',
      title: 'Planeador Ativo',
      req: 'Definir uma meta de poupança ativa no perfil.',
      icon: Compass,
      color: 'from-pink-500 to-rose-500',
      glow: 'rgba(244, 63, 94, 0.35)',
    },
    {
      key: 'Meio Caminho',
      title: 'Meio Caminho',
      req: 'Alcançar 50% ou mais do valor da meta de poupança definida.',
      icon: Target,
      color: 'from-indigo-500 to-blue-500',
      glow: 'rgba(99, 102, 241, 0.35)',
    },
    {
      key: 'Alvo Atingido',
      title: 'Alvo Atingido',
      req: 'Atingir 100% do valor da meta de poupança estabelecida.',
      icon: Flag,
      color: 'from-techGreen to-teal-400',
      glow: 'rgba(0, 255, 102, 0.35)',
    },
  ];

  const getUnlockedData = (key) => {
    return achievements.find(
      (a) => a.nome_conquista.trim().toLowerCase() === key.trim().toLowerCase()
    );
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span>Sala de Conquistas ({achievements.length}/{allAchievements.length})</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Desbloqueie insígnias ao gerir o seu orçamento e poupanças.
        </p>
      </div>

      {/* Grid vertical em coluna única para não espremer os cards na barra lateral */}
      <div className="space-y-4">
        {allAchievements.map((item) => {
          const unlocked = getUnlockedData(item.key);
          const IconComponent = item.icon;

          return (
            <div
              key={item.key}
              className={`p-4 rounded-xl border transition-all duration-350 relative overflow-hidden flex items-start space-x-3.5 ${
                unlocked
                  ? `bg-darkBg/50 border-darkBorder/80 hover:border-slate-650`
                  : 'bg-darkBg/20 border-darkBorder/40 opacity-40'
              }`}
              style={{
                boxShadow: unlocked ? `0 0 12px ${item.glow}` : 'none',
              }}
            >
              {unlocked && (
                <div
                  className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-15 bg-gradient-to-tr ${item.color}`}
                ></div>
              )}

              {/* Icon Badge */}
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  unlocked
                    ? `bg-gradient-to-tr ${item.color} text-darkBg shadow-[0_2px_8px_rgba(0,0,0,0.2)]`
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {unlocked ? (
                  <IconComponent className="h-5.5 w-5.5 animate-pulse" />
                ) : (
                  <Lock className="h-5.5 w-5.5" />
                )}
              </div>

              {/* Text Area */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className={`font-extrabold text-sm ${unlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                    {item.title}
                  </h4>
                  {unlocked && (
                    <span className="text-[9px] bg-slate-800 border border-slate-700/60 text-slate-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                      Ganha a {formatDate(unlocked.ganha_em)}
                    </span>
                  )}
                </div>

                <p className={`text-xs leading-normal whitespace-normal ${unlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.req}
                </p>

                <div className="pt-1.5">
                  {unlocked ? (
                    <span className="text-[9px] text-techGreen font-bold flex items-center space-x-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-techGreen inline-block animate-ping"></span>
                      <span>Desbloqueado</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-600 font-medium flex items-center space-x-1 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 inline-block"></span>
                      <span>Bloqueado</span>
                    </span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
