import React from 'react';
import { CalendarRange, Sparkles, Smile, HelpCircle, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function NoSpendDays({ profile, onUpdateProfile }) {
  const activeDays = profile?.dias_sem_gastar || [];

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  const monthName = today.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

  // Obter dias totais do mês corrente
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Função para alternar o estado do dia (marcado/desmarcado)
  const handleToggleDay = async (dayNum) => {
    // Formato da string de data para o JSON: "YYYY-MM-DD"
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    
    // Não permitir marcar dias futuros
    const dayDate = new Date(currentYear, currentMonth, dayNum);
    if (dayDate > today) {
      toast.error('Não é possível registar dias futuros.');
      return;
    }

    let updatedDays = [];
    const isSelected = activeDays.includes(dateStr);

    if (isSelected) {
      updatedDays = activeDays.filter(d => d !== dateStr);
      toast.success(`Dia ${dayNum} removido do desafio.`);
    } else {
      updatedDays = [...activeDays, dateStr];
      toast.success(`Fabuloso! Dia ${dayNum} guardado sem gastos supérfluos! 💚`);
    }

    try {
      await onUpdateProfile({ dias_sem_gastar: updatedDays });
    } catch {
      toast.error('Erro ao guardar calendário.');
    }
  };

  // Cálculo da streak mensal corrente (dias verdes neste mês)
  const greenDaysThisMonth = activeDays.filter(d => {
    const parts = d.split('-');
    return parseInt(parts[0]) === currentYear && parseInt(parts[1]) === (currentMonth + 1);
  });

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-6 mt-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <CalendarRange className="h-5 w-5 text-techGreen" />
            <span>Desafio: Dias Sem Gastar</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Marca a verde os dias em que mantiveste a tua carteira fechada para despesas desnecessárias.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-right">
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Dias Verdes</span>
            <span className="text-sm font-black text-techGreen">{greenDaysThisMonth.length} / {totalDays}</span>
          </div>
        </div>
      </div>

      {/* Calendário */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-350 capitalize">{monthName}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase">Clique nos dias passados</span>
        </div>

        {/* Grelha de Dias */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isGreen = activeDays.includes(dateStr);
            
            // Verificar se o dia é futuro
            const dayDate = new Date(currentYear, currentMonth, dayNum);
            const isFuture = dayDate > today;

            return (
              <button
                key={dayNum}
                type="button"
                disabled={isFuture}
                onClick={() => handleToggleDay(dayNum)}
                className={`h-11 rounded-xl border font-black text-xs flex flex-col items-center justify-center transition-all ${
                  isGreen
                    ? 'bg-techGreen/20 border-techGreen text-techGreen shadow-[0_0_10px_rgba(0,255,102,0.25)]'
                    : isFuture
                      ? 'bg-slate-900/10 border-slate-900/30 text-slate-700 cursor-not-allowed opacity-20'
                      : 'bg-darkBg border-darkBorder text-slate-450 hover:border-slate-600 cursor-pointer'
                }`}
              >
                <span>{dayNum}</span>
                {isGreen && <Check className="h-3 w-3 text-techGreen mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerta de Feedback Motivacional */}
      <div className="bg-gradient-to-tr from-techGreen/5 to-techCyan/5 p-4 rounded-xl border border-techGreen/20 flex items-start space-x-3 text-xs">
        <Smile className="h-5 w-5 text-techGreen shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          Cada dia sem gastos supérfluos representa um passo em direção à tua estabilidade financeira. 
          Desafia-te a conseguir o maior número de dias verdes possível este mês!
        </p>
      </div>

    </div>
  );
}
