import React from 'react';
import { LogOut, PiggyBank, Sparkles, Database } from 'lucide-react';

export default function Navbar({ userEmail, isDemo, onSignOut }) {
  return (
    <nav className="bg-darkCard border-b border-darkBorder px-6 py-4 relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-techPurple to-techCyan rounded-xl shadow-neonCyan">
            <PiggyBank className="h-6 w-6 text-darkBg" />
          </div>
          <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-techCyan to-slate-100 bg-clip-text text-transparent">
            SaveLance
          </span>
        </div>

        {/* User Status and Controls */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-darkBg border border-darkBorder px-3 py-1.5 rounded-full text-xs">
            {isDemo ? (
              <>
                <Sparkles className="h-3.5 w-3.5 text-techPurple animate-pulse" />
                <span className="text-techPurple font-semibold uppercase tracking-wider">Modo Demo Local</span>
              </>
            ) : (
              <>
                <Database className="h-3.5 w-3.5 text-techCyan" />
                <span className="text-techCyan font-semibold uppercase tracking-wider">Supabase Conectado</span>
              </>
            )}
          </div>

          <div className="text-sm font-medium text-slate-300">
            {userEmail}
          </div>

          <button
            onClick={onSignOut}
            className="flex items-center space-x-2 px-4 py-2 border border-darkBorder hover:border-red-500/30 hover:bg-red-500/10 text-slate-400 hover:text-red-400 font-semibold rounded-xl text-sm transition-all duration-250 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Terminar Sessão</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
