import React, { useState } from 'react';
import { Plus, Minus, Euro, Cpu, Zap, Activity, Info, Home, Sun, Layers, Wallet, Lock, Landmark } from 'lucide-react';
import { CATEGORIAS } from '../lib/categorias';

export default function Dashboard({ profile, onAddTransaction }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('entrada');

  // Form de transações
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const saldoLivre = profile?.saldo_total || 0; // O saldo que sobrou fora das poupanças
  const nivel = profile?.nivel_construcao || 1;
  const estilo = profile?.estilo_construcao || 'futurista';
  const cofres = profile?.cofres || [];

  // Calcular poupanças totais (soma de todos os cofres)
  const totalPoupancas = cofres.reduce((acc, c) => acc + parseFloat(c.saldo || 0), 0.00);

  // Saldo da Conta Bancária (Total = Saldo Disponível para gastar + Poupanças acumuladas)
  const saldoContaBancaria = saldoLivre + totalPoupancas;

  // Custo de horas de trabalho (Rendimento do Perfil)
  const salarioMensal = parseFloat(profile?.rendimento_mensal || 0);
  const valorHora = salarioMensal > 0 ? (salarioMensal / 160) : 0; // Estimativa padrão de 160h por mês

  const getHoursEquivalent = () => {
    const valFloat = parseFloat(valor);
    if (isNaN(valFloat) || valFloat <= 0 || valorHora <= 0) return 0;
    return (valFloat / valorHora).toFixed(1);
  };

  const getLevelDetails = (lvl, style) => {
    const styleName = {
      futurista: "Mansão Cyberpunk",
      moderna: "Villa Minimalista",
      fazenda: "Fazenda Rústica",
      medieval: "Fortaleza Medieval",
      predio: "Aranha-Céus Corp"
    }[style] || "Mansão";

    switch (lvl) {
      case 1: return { title: `Nível 1: Terreno (${styleName})`, desc: "Laser de demarcação de terreno alinhado e pronto para início das obras.", color: "border-slate-500 text-slate-500", glow: "rgba(148, 163, 184, 0.15)" };
      case 2: return { title: "Nível 2: Fundações", desc: "Estrutura subterrânea e pilares de sustentação de base consolidados.", color: "border-amber-600 text-amber-500", glow: "rgba(217, 119, 6, 0.2)" };
      case 3: return { title: "Nível 3: Vigas Principais", desc: "Estrutura de suporte e vigas verticais instaladas com sucesso.", color: "border-slate-400 text-slate-300", glow: "rgba(203, 213, 225, 0.25)" };
      case 4: return { title: "Nível 4: Paredes & Entradas", desc: "Envelopamento exterior da base e portas de acesso finalizadas.", color: "border-blue-500 text-blue-400", glow: "rgba(59, 130, 246, 0.3)" };
      case 5: return { title: "Nível 5: Laje Intermédia", desc: "Estruturação do piso superior concluída e cablagens encaminhadas.", color: "border-teal-500 text-teal-400", glow: "rgba(20, 184, 166, 0.35)" };
      case 6: return { title: "Nível 6: Paredes Superiores", desc: "Janelas e barreiras protetoras do andar superior ativadas.", color: "border-techCyan text-techCyan", glow: "rgba(0, 240, 255, 0.4)" };
      case 7: return { title: "Nível 7: Cobertura / Telhado", desc: "Isolamento térmico e painel de teto totalmente selado.", color: "border-yellow-500 text-yellow-400", glow: "rgba(234, 179, 8, 0.45)" };
      case 8: return { title: "Nível 8: Paisagismo & Jardim", desc: "Elementos decorativos externos e iluminação de pátio ativos.", color: "border-techPurple text-techPurple", glow: "rgba(189, 0, 255, 0.5)" };
      case 9: return { title: "Nível 9: Zona de Lazer / Piscina", desc: "Deck de relaxamento e elemento de água com fluxo ativo.", color: "border-indigo-400 text-indigo-300", glow: "rgba(129, 140, 248, 0.55)" };
      case 10: return { title: `Nível 10: ${styleName} de Luxo`, desc: "Obra concluída! Chaves entregues e sistemas inteligentes ativos.", color: "border-techGreen text-techGreen", glow: "rgba(0, 255, 102, 0.65)" };
      default: return { title: "Nível 1: Terreno", desc: "Calibração e demarcação.", color: "border-slate-500 text-slate-500", glow: "rgba(148, 163, 184, 0.15)" };
    }
  };

  const currentLevel = getLevelDetails(nivel, estilo);
  const categoriasList = CATEGORIAS[modalType] || [];

  const openTransactionModal = (type) => {
    setModalType(type);
    setValor('');
    setDescricao('');
    setCategoria(type === 'entrada' ? 'Rendimento' : 'Compras');
    setValidationError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    const parsedVal = parseFloat(valor);
    if (isNaN(parsedVal) || parsedVal <= 0) { setValidationError('Insira um valor numérico válido superior a zero.'); return; }
    if (modalType === 'saida' && parsedVal > saldoLivre) { setValidationError('Saldo livre para gastar insuficiente.'); return; }
    setSubmitting(true);
    try {
      await onAddTransaction(parsedVal, modalType, descricao, categoria || 'Outros');
      setModalOpen(false);
    } catch (err) {
      setValidationError(err.message || 'Erro ao processar transação.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderBuilding = () => {
    if (estilo === 'futurista') {
      return (
        <div className="relative w-64 h-64 flex items-end justify-center pb-4">
          <div className="absolute bottom-4 w-48 h-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-slate-700 rounded flex items-center justify-between px-4 shadow-[0_0_12px_rgba(100,116,139,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-techCyan animate-ping"></span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-black">Base Emitter</span>
            <span className="w-1.5 h-1.5 rounded-full bg-techPurple"></span>
          </div>
          {nivel >= 2 && <div className="absolute bottom-9 w-40 h-3 bg-gradient-to-r from-amber-600/20 via-amber-600/50 to-amber-600/20 border border-amber-500/40 rounded flex items-center justify-around px-4 animate-scale-up"></div>}
          {nivel >= 3 && <div className="absolute bottom-12 w-36 h-28 flex justify-between px-3 pointer-events-none"><div className="w-1.5 h-full bg-slate-750 rounded border border-slate-600"></div><div className="w-1.5 h-full bg-slate-750 rounded border border-slate-600"></div><div className="w-1.5 h-full bg-slate-750 rounded border border-slate-600"></div></div>}
          {nivel >= 4 && <div className="absolute bottom-12 left-[62px] w-[132px] h-[52px] bg-slate-900/95 border border-slate-700/80 rounded-t flex items-end justify-center px-4 animate-scale-up"><div className="w-7 h-10 bg-slate-800 border-x border-t border-techCyan/60 rounded-t flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.2)]"><div className="w-1 h-1 bg-techCyan rounded-full animate-ping"></div></div></div>}
          {nivel >= 5 && <div className="absolute bottom-[64px] left-[54px] w-[148px] h-2 bg-gradient-to-r from-slate-800 via-teal-500/40 to-slate-800 border border-teal-500/30 rounded animate-scale-up"></div>}
          {nivel >= 6 && <div className="absolute bottom-[66px] left-[66px] w-[124px] h-[44px] bg-gradient-to-t from-slate-900/90 to-slate-900/60 border border-techCyan/50 rounded-t animate-scale-up"></div>}
          {nivel >= 7 && <div className="absolute bottom-[110px] left-[58px] w-[140px] h-12 flex flex-col justify-end animate-scale-up"><div className="w-full h-2 bg-yellow-500/25 border-t border-x border-yellow-400 rounded-t shadow-[0_0_10px_rgba(234,179,8,0.3)] rotate-[3deg]"></div><div className="h-6 w-full flex justify-center space-x-1.5 pr-2"><Sun className="h-4.5 w-4.5 text-yellow-400 animate-pulse shrink-0" /></div></div>}
          {nivel >= 8 && <div className="absolute bottom-4 w-[212px] h-[132px] pointer-events-none flex justify-between items-end px-1.5 animate-fade-in"><div className="w-4 h-4 rounded-full bg-techPurple/25 border border-techPurple/60 shadow-[0_0_8px_rgba(189,0,255,0.4)] mb-8"></div><div className="w-3.5 h-3.5 rounded-full bg-techPurple/20 border border-techPurple/40 mb-4"></div></div>}
          {nivel >= 9 && <div className="absolute bottom-9 right-2 w-14 h-4 bg-indigo-950 border border-indigo-500/50 rounded flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.3)] animate-scale-up"><div className="w-12 h-2.5 bg-indigo-500/30 rounded-sm animate-pulse"></div></div>}
          {nivel === 10 && <div className="absolute inset-0 pointer-events-none flex items-center justify-center"><div className="absolute w-56 h-56 border-2 border-dashed border-techGreen/40 rounded-full animate-spin"></div><div className="absolute -top-1 px-3 py-1 bg-techGreen/10 border border-techGreen/40 rounded-full shadow-[0_0_15px_rgba(0,255,102,0.4)] flex items-center space-x-1"><Zap className="h-3 w-3 text-techGreen animate-bounce" /><span className="text-[9px] font-black text-techGreen uppercase tracking-widest">Cyber-Mansion</span></div></div>}
        </div>
      );
    }
    if (estilo === 'moderna') {
      return (
        <div className="relative w-64 h-64 flex items-end justify-center pb-4">
          <div className="absolute bottom-4 w-48 h-4 bg-slate-900 border-2 border-slate-700 rounded shadow-md"></div>
          {nivel >= 2 && <div className="absolute bottom-8 w-44 h-2 bg-slate-700/80 border border-slate-600 rounded animate-scale-up"></div>}
          {nivel >= 3 && <div className="absolute bottom-10 w-36 h-24 flex justify-between px-4"><div className="w-2 h-full bg-slate-400 border border-slate-500"></div><div className="w-2 h-full bg-slate-400 border border-slate-500"></div></div>}
          {nivel >= 4 && <div className="absolute bottom-10 left-[68px] w-[120px] h-[48px] bg-slate-800/90 border border-slate-600 rounded flex items-end justify-between px-3 animate-scale-up"><div className="w-6 h-8 bg-amber-900 border border-amber-800 rounded-t"></div><div className="w-8 h-6 bg-slate-950 border border-slate-700 rounded mb-2"></div></div>}
          {nivel >= 5 && <div className="absolute bottom-[58px] left-[60px] w-[136px] h-2 bg-slate-600 rounded animate-scale-up"></div>}
          {nivel >= 6 && <div className="absolute bottom-[66px] left-[76px] w-[104px] h-[40px] bg-slate-900/80 border border-techCyan/40 rounded flex items-center justify-center animate-scale-up"><div className="w-16 h-5 bg-techCyan/10 border border-techCyan/30 rounded"></div></div>}
          {nivel >= 7 && <div className="absolute bottom-[106px] left-[70px] w-[116px] h-3 bg-slate-700 border-t border-slate-500 rounded animate-scale-up"></div>}
          {nivel >= 8 && <div className="absolute bottom-4 left-[30px] w-[28px] h-6 bg-slate-800 border-r-2 border-amber-900 rounded-l animate-fade-in"></div>}
          {nivel >= 9 && <div className="absolute bottom-4 right-[25px] w-[26px] h-5 bg-gradient-to-b from-blue-500 to-indigo-600 border border-blue-400 rounded-r animate-scale-up"></div>}
          {nivel === 10 && <div className="absolute -top-1 px-3 py-1 bg-techGreen/10 border border-techGreen/40 rounded-full shadow-[0_0_10px_rgba(0,255,102,0.35)]"><span className="text-[9px] font-bold text-techGreen uppercase">Villa Completa</span></div>}
        </div>
      );
    }
    if (estilo === 'fazenda') {
      return (
        <div className="relative w-64 h-64 flex items-end justify-center pb-4">
          <div className="absolute bottom-4 w-48 h-4 bg-amber-950 border-2 border-amber-900 rounded shadow-md"></div>
          {nivel >= 2 && <div className="absolute bottom-8 w-44 h-2 bg-amber-900 border border-amber-800 rounded animate-scale-up"></div>}
          {nivel >= 3 && <div className="absolute bottom-10 w-36 h-20 flex justify-between px-6"><div className="w-2.5 h-full bg-amber-800 border border-amber-700"></div><div className="w-2.5 h-full bg-amber-800 border border-amber-700"></div></div>}
          {nivel >= 4 && <div className="absolute bottom-10 left-[76px] w-[104px] h-[40px] bg-red-900 border border-red-800 rounded-t flex items-end justify-center animate-scale-up"><div className="w-8 h-7 bg-amber-950 border border-amber-900 rounded-t flex items-center justify-center"><span className="text-[10px] text-white">X</span></div></div>}
          {nivel >= 5 && <div className="absolute bottom-[50px] left-[70px] w-[116px] h-2 bg-amber-800 border border-amber-700 rounded animate-scale-up"></div>}
          {nivel >= 6 && <div className="absolute bottom-[52px] left-[84px] w-[88px] h-[36px] bg-red-950 border border-red-800 rounded-t animate-scale-up"></div>}
          {nivel >= 7 && <div className="absolute bottom-[88px] left-[78px] w-24 h-8 border-b-2 border-amber-900 animate-scale-up" style={{
            backgroundImage: 'linear-gradient(135deg, transparent 50%, #78350f 50%), linear-gradient(225deg, transparent 50%, #78350f 50%)',
            backgroundSize: '50% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'left, right'
          }}></div>}
          {nivel >= 8 && <div className="absolute bottom-4 left-6 w-8 h-20 bg-slate-800 border border-slate-700 rounded-t flex flex-col items-center justify-start pt-1 animate-fade-in"><div className="w-6 h-6 rounded-full border border-slate-600 animate-spin" style={{ animationDuration: '4s' }}></div></div>}
          {nivel >= 9 && <div className="absolute bottom-4 right-6 w-8 h-8 bg-amber-950 border-2 border-amber-900 rounded-full flex items-center justify-center animate-scale-up"><div className="w-5 h-5 bg-blue-500/30 rounded-full"></div></div>}
          {nivel === 10 && <div className="absolute -top-1 px-3 py-1 bg-techGreen/10 border border-techGreen/40 rounded-full"><span className="text-[9px] font-bold text-techGreen uppercase">Fazenda Pronta</span></div>}
        </div>
      );
    }
    if (estilo === 'medieval') {
      return (
        <div className="relative w-64 h-64 flex items-end justify-center pb-4">
          <div className="absolute bottom-4 w-48 h-4 bg-slate-800 border-2 border-slate-750 rounded shadow-md"></div>
          {nivel >= 2 && <div className="absolute bottom-8 w-44 h-2 bg-slate-700 border border-slate-600 rounded animate-scale-up"></div>}
          {nivel >= 3 && <div className="absolute bottom-10 w-36 h-20 flex justify-between px-2"><div className="w-6 h-full bg-slate-600 border border-slate-700"></div><div className="w-6 h-full bg-slate-600 border border-slate-700"></div></div>}
          {nivel >= 4 && <div className="absolute bottom-10 left-[72px] w-[112px] h-[44px] bg-slate-700 border border-slate-800 rounded-t flex items-end justify-center animate-scale-up"><div className="w-10 h-8 bg-amber-950 border-t border-x border-amber-900 rounded-t flex items-center justify-center"><div className="w-0.5 h-6 bg-slate-900 mx-0.5"></div><div className="w-0.5 h-6 bg-slate-900 mx-0.5"></div></div></div>}
          {nivel >= 5 && <div className="absolute bottom-[54px] left-[66px] w-[124px] h-2 bg-slate-600 border border-slate-700 rounded animate-scale-up"></div>}
          {nivel >= 6 && <div className="absolute bottom-[56px] left-[60px]. w-[136px] h-12 flex justify-between"><div className="w-6 h-full bg-slate-600 border border-slate-700 animate-scale-up"></div><div className="w-6 h-full bg-slate-600 border border-slate-700 animate-scale-up"></div></div>}
          {nivel >= 7 && <div className="absolute bottom-[104px] left-[56px] w-[144px] h-6 flex justify-between"><div className="w-8 h-full bg-red-800 border-b border-red-900 rounded-t animate-scale-up" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div><div className="w-8 h-full bg-red-800 border-b border-red-900 rounded-t animate-scale-up" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div></div>}
          {nivel >= 8 && <div className="absolute bottom-[124px] left-[68px] w-0.5 h-10 bg-slate-400 flex items-start justify-start animate-fade-in"><div className="w-4 h-3 bg-red-650 rounded-r"></div></div>}
          {nivel >= 9 && <div className="absolute bottom-4 left-[96px] w-12 h-2.5 bg-gradient-to-r from-blue-700 to-indigo-900 rounded shadow-md animate-scale-up"></div>}
          {nivel === 10 && <div className="absolute -top-1 px-3 py-1 bg-techGreen/10 border border-techGreen/40 rounded-full shadow-[0_0_8px_rgba(0,255,102,0.25)]"><span className="text-[9px] font-bold text-techGreen uppercase">Fortaleza Concluída</span></div>}
        </div>
      );
    }
    if (estilo === 'predio') {
      return (
        <div className="relative w-64 h-64 flex items-end justify-center pb-4">
          <div className="absolute bottom-4 w-48 h-4 bg-slate-900 border-2 border-slate-700 rounded shadow-md"></div>
          {nivel >= 2 && <div className="absolute bottom-8 w-36 h-2 bg-slate-800 border border-slate-700 rounded animate-scale-up"></div>}
          {nivel >= 3 && <div className="absolute bottom-10 w-24 h-36 border border-dashed border-slate-700 rounded flex flex-col justify-between p-1"><div className="w-full h-0.5 bg-slate-800"></div><div className="w-full h-0.5 bg-slate-800"></div><div className="w-full h-0.5 bg-slate-800"></div></div>}
          {nivel >= 4 && <div className="absolute bottom-10 left-[84px] w-[88px] h-[28px] bg-slate-900/90 border border-slate-700 rounded flex items-center justify-around px-1 animate-scale-up"><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div></div>}
          {nivel >= 5 && <div className="absolute bottom-[38px] left-[84px] w-[88px] h-[28px] bg-slate-900/90 border border-slate-700 rounded flex items-center justify-around px-1 animate-scale-up"><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div></div>}
          {nivel >= 6 && <div className="absolute bottom-[66px] left-[84px] w-[88px] h-[28px] bg-slate-900/90 border border-slate-700 rounded flex items-center justify-around px-1 animate-scale-up"><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div></div>}
          {nivel >= 7 && <div className="absolute bottom-[94px] left-[84px] w-[88px] h-[28px] bg-slate-900/90 border border-slate-700 rounded flex items-center justify-around px-1 animate-scale-up"><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div><div className="w-3 h-5 bg-slate-950 border border-slate-800 rounded"></div></div>}
          {nivel >= 8 && <div className="absolute bottom-[122px] left-[84px] w-[88px] h-[24px] bg-slate-900/90 border border-slate-700 rounded-t flex items-center justify-center animate-scale-up"><div className="w-16 h-3 bg-techCyan/10 border border-techCyan/30 rounded"></div></div>}
          {nivel >= 9 && <div className="absolute bottom-[146px] left-[126px] w-0.5 h-10 bg-slate-400 flex items-start justify-center animate-scale-up"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span></div>}
          {nivel === 10 && <div className="absolute -top-1 px-3 py-1 bg-techGreen/10 border border-techGreen/40 rounded-full"><span className="text-[9px] font-bold text-techGreen uppercase">HQ Construído</span></div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Reestruturação dos Saldos (Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Saldo Conta Bancária */}
        <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-techCyan/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            <Landmark className="h-4 w-4 text-techCyan" />
            <span>Saldo da Conta</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-100">
              {saldoContaBancaria.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-lg font-extrabold text-techCyan">€</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Património total no mealheiro.</p>
        </div>

        {/* Card 2: Poupanças Totais */}
        <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-techPurple/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            <Lock className="h-4 w-4 text-techPurple" />
            <span>Poupanças Guardadas</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-100">
              {totalPoupancas.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-lg font-extrabold text-techPurple">€</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Saldo total alocado nos teus cofres.</p>
        </div>

        {/* Card 3: Saldo Disponível para Gastar */}
        <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex flex-col justify-center ring-1 ring-techGreen/30">
          <div className="absolute top-0 right-0 w-24 h-24 bg-techGreen/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1">
            <Wallet className="h-4 w-4 text-techGreen" />
            <span>Disponível para Gastar</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-black text-slate-100">
              {saldoLivre.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-lg font-extrabold text-techGreen">€</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Saldo livre que podes gastar à vontade.</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-darkCard p-8 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-techCyan/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              <Activity className="h-4 w-4 text-techCyan" />
              <span>Movimentar Saldo Livre</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Deposita ou retira fundos do teu saldo disponível para gastar. O progresso da tua moradia ajusta-se automaticamente.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => openTransactionModal('entrada')}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-techGreen/20 to-techGreen/40 hover:from-techGreen/30 hover:to-techGreen/50 border border-techGreen/40 hover:border-techGreen text-techGreen font-bold py-4 px-6 rounded-xl transition-all duration-200 glow-green-hover shadow-sm cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                <span>Depositar</span>
              </button>
              <button
                onClick={() => openTransactionModal('saida')}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500/10 to-red-500/30 hover:from-red-500/20 hover:to-red-500/40 border border-red-500/30 hover:border-red-500 text-red-400 font-bold py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Minus className="h-5 w-5" />
                <span>Retirar</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-darkCard p-8 rounded-2xl border border-darkBorder shadow-md relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-4 left-4 flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-widest z-10">
            <Home className="h-4 w-4 text-techCyan" />
            <span>Simulador de Construção (Nível {nivel}/10)</span>
          </div>

          <div className="w-full h-72 my-4 flex items-center justify-center relative overflow-hidden bg-slate-950/45 rounded-xl border border-darkBorder/30">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #00f0ff 1px, transparent 1px), linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)',
              backgroundSize: '16px 16px, 8px 8px, 8px 8px'
            }}></div>
            <div className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 transition-all duration-500 animate-pulse pointer-events-none" style={{ backgroundColor: currentLevel.glow, bottom: '-20%' }}></div>

            {renderBuilding()}
          </div>

          <div className="w-full text-center bg-darkBg/60 p-4 rounded-xl border border-darkBorder mt-4">
            <h4 className="font-bold text-slate-200 text-sm flex items-center justify-center space-x-2">
              <span className={`w-3 h-3 rounded-full bg-current ${currentLevel.color}`}></span>
              <span>{currentLevel.title}</span>
            </h4>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{currentLevel.desc}</p>
            <div className="mt-3.5 flex items-center justify-center space-x-1">
              {Array.from({ length: 10 }).map((_, idx) => {
                const lvlNum = idx + 1;
                return (
                  <div
                    key={lvlNum}
                    className={`h-2.5 w-5.5 rounded-full transition-all duration-300 ${
                      nivel >= lvlNum
                        ? lvlNum === 10 ? 'bg-techGreen shadow-neonGreen'
                          : lvlNum >= 8 ? 'bg-techPurple shadow-neonPurple'
                          : lvlNum >= 5 ? 'bg-techCyan shadow-neonCyan'
                          : 'bg-blue-500'
                        : 'bg-slate-800 border border-slate-700/50'
                    }`}
                    title={`Nível ${lvlNum}`}
                  ></div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-darkCard border border-darkBorder w-full max-w-md rounded-2xl shadow-neonCyan overflow-hidden">
            <div className="px-6 py-5 border-b border-darkBorder flex justify-between items-center bg-darkBg/50">
              <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                {modalType === 'entrada' ? (
                  <><Plus className="h-6 w-6 text-techGreen" /><span>Depositar Fundos</span></>
                ) : (
                  <><Minus className="h-6 w-6 text-red-400" /><span>Retirar Fundos</span></>
                )}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-200 text-2xl font-bold focus:outline-none cursor-pointer">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {validationError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-200 rounded-lg text-xs flex items-center space-x-2">
                    <Info className="h-4 w-4 text-red-400 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Valor do {modalType === 'entrada' ? 'Depósito' : 'Levantamento'} (€)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Euro className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="number" step="0.01" min="0.01" required autoFocus
                      value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0.00"
                      className="block w-full pl-10 pr-3 py-3 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Valor-Hora Calculadora Feedback */}
                  {modalType === 'saida' && valorHora > 0 && valor > 0 && (
                    <div className="mt-2 text-[11px] text-amber-500 font-bold bg-amber-950/15 border border-amber-500/20 p-2 rounded-lg flex items-center space-x-1.5">
                      <Info className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                      <span>Este levantamento equivale a cerca de <strong className="text-slate-200 text-xs">{getHoursEquivalent()} horas</strong> do teu trabalho.</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Categoria</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categoriasList.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategoria(cat.value)}
                        className={`px-2 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          categoria === cat.value
                            ? modalType === 'entrada'
                              ? 'bg-techGreen/20 border-techGreen/60 text-techGreen'
                              : 'bg-red-500/20 border-red-500/60 text-red-300'
                            : 'bg-darkBg border-darkBorder text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {cat.emoji} {cat.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Descrição (Opcional)</label>
                  <input
                    type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}
                    placeholder={modalType === 'entrada' ? 'Ex: Dinheiro de prenda' : 'Ex: Compra de teclado'}
                    className="block w-full px-3 py-3 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-darkBorder bg-darkBg/50 flex justify-end space-x-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-darkBorder text-slate-300 hover:bg-slate-800 rounded-xl text-sm font-semibold transition cursor-pointer">
                  Cancelar
                </button>
                <button
                  type="submit" disabled={submitting}
                  className={`px-5 py-2 rounded-xl text-sm font-bold text-darkBg transition flex items-center space-x-1.5 ${modalType === 'entrada' ? 'bg-gradient-to-r from-techGreen to-emerald-400 hover:opacity-90 shadow-neonGreen' : 'bg-gradient-to-r from-red-500 to-rose-400 hover:opacity-90'}`}
                >
                  {submitting ? <div className="h-4 w-4 border-2 border-darkBg border-t-transparent rounded-full animate-spin"></div> : <span>Confirmar</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
