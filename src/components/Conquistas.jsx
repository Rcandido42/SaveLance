import React from 'react';
import { Award, Lock, Sparkles, Trophy, BadgeCheck, ShieldAlert } from 'lucide-react';

export default function Conquistas({ achievements }) {
  const allAchievements = [
    {
      key: 'Primeiro Passo',
      title: 'Primeiro Passo',
      req: 'Efetuar a primeira transação (depósito ou levantamento) no mealheiro.',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
      glow: 'rgba(59, 130, 246, 0.4)',
    },
    {
      key: 'Mão Pesada',
      title: 'Mão Pesada',
      req: 'Realizar um depósito único de valor igual ou superior a 50.00 €.',
      icon: Award,
      color: 'from-techPurple to-pink-600',
      glow: 'rgba(189, 0, 255, 0.4)',
    },
    {
      key: 'Poupador Consistente',
      title: 'Poupador Consistente',
      req: 'Atingir um saldo total acumulado de pelo menos 200.00 €.',
      icon: Trophy,
      color: 'from-techCyan to-teal-500',
      glow: 'rgba(0, 240, 255, 0.4)',
    },
    {
      key: 'Mestre do Mealheiro',
      title: 'Mestre do Mealheiro',
      req: 'Alcançar um saldo igual ou superior a 500.00 €.',
      icon: BadgeCheck,
      color: 'from-yellow-400 to-amber-500',
      glow: 'rgba(234, 179, 8, 0.4)',
    },
    {
      key: 'Imperador do Mealheiro',
      title: 'Imperador do Mealheiro',
      req: 'Alcançar o topo absoluto com um saldo igual ou superior a 1000.00 €.',
      icon: Trophy,
      color: 'from-emerald-400 to-techGreen',
      glow: 'rgba(0, 255, 102, 0.4)',
    },
  ];

  const getUnlockedData = (key) => {
    return achievements.find(
      (a) => a.nome_conquista.trim().toLowerCase() === key.trim().toLowerCase()
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
          Desbloqueie conquistas na nuvem ao poupar e utilizar o seu mealheiro físico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allAchievements.map((item) => {
          const unlocked = getUnlockedData(item.key);
          const IconComponent = item.icon;

          return (
            <div
              key={item.key}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start space-x-4 ${
                unlocked
                  ? `bg-darkBg/60 border-darkBorder hover:border-slate-500`
                  : 'bg-darkBg/20 border-darkBorder/40 opacity-50'
              }`}
              style={{
                boxShadow: unlocked ? `0 0 15px ${item.glow}` : 'none',
              }}
            >
              {unlocked && (
                <div
                  className={`absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-20 bg-gradient-to-tr ${item.color}`}
                ></div>
              )}

              <div
                className={`p-3.5 rounded-xl shrink-0 ${
                  unlocked
                    ? `bg-gradient-to-tr ${item.color} text-darkBg`
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                {unlocked ? (
                  <IconComponent className="h-6 w-6" />
                ) : (
                  <Lock className="h-6 w-6" />
                )}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`font-bold text-base truncate ${
                      unlocked ? 'text-slate-100' : 'text-slate-500'
                    }`}
                  >
                    {item.title}
                  </h4>
                  {unlocked && (
                    <span className="text-[10px] bg-slate-800 border border-slate-700/50 text-slate-400 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Ganha a {formatDate(unlocked.ganha_em)}
                    </span>
                  )}
                </div>

                <p className={`text-xs ${unlocked ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.req}
                </p>

                <div className="pt-2">
                  {unlocked ? (
                    <div className="text-[10px] text-techGreen font-bold flex items-center space-x-1 uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-techGreen inline-block"></span>
                      <span>Desbloqueado</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-600 font-medium flex items-center space-x-1 uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 inline-block"></span>
                      <span>Bloqueado</span>
                    </div>
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
