import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Quote, ArrowRight, Wallet, Sparkles } from 'lucide-react';

const DICAS_FINANCEIRAS = [
  {
    titulo: "Regra dos 50/30/20",
    dica: "Aloque 50% dos rendimentos para necessidades (renda, comida), 30% para desejos (lazer, compras) e poupe sempre pelo menos 20%."
  },
  {
    titulo: "A Regra das 24 Horas",
    dica: "Antes de fazer uma compra por impulso, espere 24 horas. Na maioria das vezes, a urgência desaparece e percebe que não precisa do item."
  },
  {
    titulo: "Pague-se a Si Próprio Primeiro",
    dica: "Assim que receber o seu salário ou mesada, retire imediatamente uma parte (ex: 10%) para o mealheiro antes de começar a pagar contas ou fazer compras."
  },
  {
    titulo: "Cálculo em Horas de Trabalho",
    dica: "Se quer comprar algo de 50€ e ganha 5€ por hora, pense se esse objeto realmente vale 10 horas do seu esforço no trabalho."
  },
  {
    titulo: "Cuidado com o 'Efeito Café'",
    dica: "Pequenos gastos diários repetidos (como cafés, lanches ou subscrições que não usa) somam centenas de euros ao final do ano."
  },
  {
    titulo: "Fundo de Emergência",
    dica: "Tente acumular o equivalente a 3 a 6 meses das suas despesas essenciais num local seguro e de fácil acesso para imprevistos."
  },
  {
    titulo: "Defina Objetivos Concretos",
    dica: "Poupar sem objetivo é difícil. Defina metas claras: 'juntar 150€ para um concerto' ou '300€ para um investimento'. A motivação aumenta!"
  },
  {
    titulo: "Evite Dívidas de Consumo",
    dica: "Se precisa de recorrer a cartões de crédito ou créditos pessoais para comprar um gadget ou roupa, significa que não tem capacidade financeira para o ter ainda."
  }
];

export default function Conselheiro() {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const obterDicaAleatoria = () => {
    setAnimating(true);
    setTimeout(() => {
      let novoIndex;
      do {
        novoIndex = Math.floor(Math.random() * DICAS_FINANCEIRAS.length);
      } while (novoIndex === index && DICAS_FINANCEIRAS.length > 1);
      
      setIndex(novoIndex);
      setAnimating(false);
    }, 400);
  };

  const dicaAtual = DICAS_FINANCEIRAS[index];

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
      <div className="absolute top-0 right-0 w-24 h-24 bg-techGreen/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <Lightbulb className="h-4.5 w-4.5 text-techGreen animate-pulse" />
            <span>Conselheiro Financeiro Inteligente</span>
          </div>

          <button
            onClick={obterDicaAleatoria}
            disabled={animating}
            className="p-2 text-slate-400 hover:text-techGreen hover:bg-slate-800 rounded-xl transition duration-200 cursor-pointer disabled:opacity-50"
            title="Outra dica"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${animating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className={`transition-all duration-300 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <h4 className="font-extrabold text-lg text-slate-200 flex items-center space-x-2">
            <span className="text-techGreen">#</span>
            <span>{dicaAtual.titulo}</span>
          </h4>
          
          <div className="relative mt-2.5 pl-6 pr-2">
            <Quote className="absolute left-0 top-0.5 h-4 w-4 text-techGreen/30 transform rotate-180" />
            <p className="text-slate-300 text-sm leading-relaxed italic">
              {dicaAtual.dica}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-darkBorder/50 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center space-x-1">
          <Wallet className="h-3.5 w-3.5" />
          <span>Educação Financeira</span>
        </span>
        <span className="flex items-center space-x-0.5 text-techGreen">
          <span>Pratique poupança ativa</span>
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
