import React, { useState } from 'react';
import { Target, Edit3, Check, X, Trophy } from 'lucide-react';

export default function MetaPoupanca({ saldo, meta, onSetMeta }) {
  const [editing, setEditing] = useState(false);
  const [newMeta, setNewMeta] = useState('');

  const percentage = meta > 0 ? Math.min((saldo / meta) * 100, 100) : 0;
  const remaining = meta > 0 ? Math.max(meta - saldo, 0) : 0;
  const achieved = meta > 0 && saldo >= meta;

  const getBarColor = () => {
    if (achieved) return 'from-techGreen to-emerald-400';
    if (percentage >= 75) return 'from-techCyan to-teal-400';
    if (percentage >= 50) return 'from-blue-500 to-indigo-400';
    return 'from-techPurple to-pink-500';
  };

  const handleSave = () => {
    const val = parseFloat(newMeta);
    if (!isNaN(val) && val > 0) {
      onSetMeta(val);
      setEditing(false);
      setNewMeta('');
    }
  };

  return (
    <div className="bg-darkCard p-6 rounded-2xl border border-darkBorder shadow-md space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-techGreen/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-techGreen" />
          <h3 className="font-bold text-slate-100">Meta de Poupança</h3>
        </div>
        {!editing && (
          <button
            onClick={() => { setEditing(true); setNewMeta(meta > 0 ? String(meta) : ''); }}
            className="p-1.5 text-slate-400 hover:text-techCyan hover:bg-slate-800 rounded-lg transition cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">€</span>
            <input
              type="number" min="0.01" step="0.01" autoFocus
              value={newMeta} onChange={e => setNewMeta(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Ex: 500"
              className="w-full pl-7 pr-3 py-2.5 border border-darkBorder rounded-xl bg-darkBg text-slate-200 focus:outline-none focus:ring-2 focus:ring-techCyan text-sm"
            />
          </div>
          <button onClick={handleSave} className="p-2.5 text-techGreen hover:bg-techGreen/10 border border-techGreen/20 rounded-xl transition cursor-pointer">
            <Check className="h-4 w-4" />
          </button>
          <button onClick={() => setEditing(false)} className="p-2.5 text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : meta > 0 ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">
              <span className="text-slate-200 font-semibold">{saldo.toFixed(2)} €</span> de {meta.toFixed(2)} €
            </span>
            <span className={`text-sm font-extrabold ${achieved ? 'text-techGreen' : 'text-slate-300'}`}>
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full bg-gradient-to-r transition-all duration-700 ease-out ${getBarColor()}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          {achieved ? (
            <div className="flex items-center justify-center space-x-2 py-1.5 bg-techGreen/10 border border-techGreen/20 rounded-xl">
              <Trophy className="h-4 w-4 text-techGreen" />
              <p className="text-techGreen text-xs font-bold">Meta atingida! Parabéns! 🎉</p>
            </div>
          ) : (
            <p className="text-slate-500 text-xs">Faltam <span className="text-slate-300 font-semibold">{remaining.toFixed(2)} €</span> para atingir o objetivo.</p>
          )}
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="w-full py-4 border border-dashed border-darkBorder hover:border-techGreen/40 hover:bg-techGreen/5 rounded-xl text-slate-500 hover:text-techGreen text-xs transition cursor-pointer"
        >
          Clica para definir uma meta de poupança ✏️
        </button>
      )}
    </div>
  );
}
