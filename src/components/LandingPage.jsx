import React from 'react';
import { PiggyBank, ArrowRight, Database, Home, TrendingUp, Trophy, FileText, Compass, ShieldCheck, Heart } from 'lucide-react';

export default function LandingPage({ onEnterApp, onEnterDemo }) {
  return (
    <div className="min-h-screen bg-darkBg text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-techCyan/30">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-techCyan/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-techPurple/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-darkBorder/40 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-techPurple to-techCyan rounded-xl shadow-neonCyan">
            <PiggyBank className="h-6 w-6 text-darkBg" />
          </div>
          <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-techCyan to-slate-100 bg-clip-text text-transparent">
            SaveLance
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onEnterDemo}
            className="text-xs font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            Modo de Teste
          </button>
          <button
            onClick={onEnterApp}
            className="px-4 py-2 bg-gradient-to-r from-techCyan to-techPurple text-darkBg rounded-xl text-xs font-black hover:opacity-90 shadow-neonCyan transition cursor-pointer"
          >
            Começar Agora
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-12 relative z-10">
        
        {/* Project Intro */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-techCyan/10 border border-techCyan/30 rounded-full text-xs font-bold text-techCyan uppercase tracking-widest animate-pulse">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>O Teu Assistente Financeiro Inteligente</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Atinge os teus objetivos e{' '}
            <span className="bg-gradient-to-r from-techCyan via-techPurple to-techGreen bg-clip-text text-transparent">
              constrói o teu futuro
            </span>
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            O SaveLance ajuda-te a poupar dinheiro de forma interativa. Define um objetivo, regista os teus ganhos e gastos diários e vê a tua casa virtual crescer à medida que a tua poupança aumenta.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-techCyan to-techPurple text-darkBg rounded-2xl font-black text-sm hover:opacity-95 shadow-neonCyan transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Criar Conta Gratuita</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onEnterDemo}
            className="w-full sm:w-auto px-8 py-4 bg-darkCard border border-darkBorder hover:border-slate-650 rounded-2xl font-bold text-sm text-slate-350 hover:text-slate-100 transition cursor-pointer"
          >
            Experimentar sem Registar
          </button>
        </div>

        {/* Features Showcase Grid */}
        <section className="w-full pt-16 space-y-8">
          <h2 className="text-2xl font-extrabold text-slate-200">Como o SaveLance te ajuda a poupar?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder/70 text-left space-y-3 shadow-md hover:border-techCyan/40 transition duration-300">
              <div className="p-3 bg-techCyan/10 text-techCyan rounded-xl w-fit">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Criação Visual de Casas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vê a tua poupança materializar-se! Escolhe entre 5 estilos de habitação (Moderno, Castelo, Fazenda, Cyberpunk ou Prédio) que evoluem até ao nível 10 consoante o teu saldo cresce.
              </p>
            </div>

            <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder/70 text-left space-y-3 shadow-md hover:border-techPurple/40 transition duration-300">
              <div className="p-3 bg-techPurple/10 text-techPurple rounded-xl w-fit">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Calculadora de Gastos Segura</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Indica-nos a tua meta e despesas fixas mensais. O nosso sistema sugere-te um limite de gastos diário e mensal seguro para garantir que chegas ao teu objetivo a tempo.
              </p>
            </div>

            <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder/70 text-left space-y-3 shadow-md hover:border-techGreen/40 transition duration-300">
              <div className="p-3 bg-techGreen/10 text-techGreen rounded-xl w-fit">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-100">Conquistas e Recompensas</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Torna a gestão do teu dinheiro divertida. Desbloqueia medalhas virtuais à medida que bates recordes de poupança e crias hábitos financeiros saudáveis.
              </p>
            </div>

          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full pt-12 border-t border-darkBorder/30 space-y-8">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-200">Mais Vantagens do SaveLance</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-darkBg/60 p-5 rounded-xl border border-darkBorder/50 text-left space-y-2">
              <div className="text-techCyan font-bold text-sm">📁 Exportação Rápida</div>
              <p className="text-xs text-slate-400">Guarda o teu histórico de transações em Excel (CSV) ou gera um extrato em PDF limpo e organizado com apenas um clique.</p>
            </div>

            <div className="bg-darkBg/60 p-5 rounded-xl border border-darkBorder/50 text-left space-y-2">
              <div className="text-techPurple font-bold text-sm">💡 Dicas Financeiras</div>
              <p className="text-xs text-slate-400">Recebe conselhos práticos e simples do nosso conselheiro automático para reduzir despesas desnecessárias no teu dia-a-dia.</p>
            </div>

            <div className="bg-darkBg/60 p-5 rounded-xl border border-darkBorder/50 text-left space-y-2">
              <div className="text-techGreen font-bold text-sm">🔒 Acesso Seguro</div>
              <p className="text-slate-400 text-xs">Os teus dados são encriptados de forma segura para que apenas tu tenhas acesso às tuas contas e planos de poupança.</p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 border-t border-darkBorder/30 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 bg-darkCard/35">
        <p>&copy; {new Date().getFullYear()} SaveLance - Gestor de Mealheiro Digital. Desenvolvido como projeto pessoal.</p>
        <p className="flex items-center space-x-1 justify-center sm:justify-end">
          <span>Criado com</span>
          <Heart className="h-3.5 w-3.5 text-red-500 animate-pulse fill-red-500" />
          <span>para simplificar poupanças.</span>
        </p>
      </footer>

    </div>
  );
}
