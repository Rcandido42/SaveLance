import React, { useState, useEffect, useRef } from 'react';
import { LogOut, PiggyBank, Sparkles, Database, User, Settings, Shield } from 'lucide-react';

export default function Navbar({ userEmail, isDemo, onSignOut, onOpenProfile, profile }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';
  const userJob = profile?.cargo || 'Utilizador';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-darkCard border-b border-darkBorder px-6 py-4 relative z-40">
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

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2.5 p-1.5 pr-3 hover:bg-slate-800/50 rounded-full border border-darkBorder transition-all duration-200 focus:outline-none cursor-pointer"
          >
            {/* Initials Avatar */}
            <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-techPurple to-techCyan flex items-center justify-center text-darkBg font-black text-sm shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              {userInitial}
            </div>
            <span className="hidden md:inline text-xs font-semibold text-slate-300 max-w-[120px] truncate">
              {userEmail}
            </span>
          </button>

          {/* Dropdown Card */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-darkCard border border-darkBorder rounded-2xl p-5 shadow-2xl z-50 transform transition-all animate-scale-up">
              
              {/* Profile Card Header */}
              <div className="flex items-center space-x-3 pb-4 border-b border-darkBorder/60">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-techPurple to-techCyan flex items-center justify-center text-darkBg font-black text-base">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{userEmail}</h4>
                  <p className="text-xs text-slate-400 capitalize truncate">{userJob}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="py-4 border-b border-darkBorder/60 space-y-3">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block">Conectividade</span>
                <div className="flex items-center space-x-2 bg-darkBg border border-darkBorder/80 px-3 py-2 rounded-xl text-xs">
                  {isDemo ? (
                    <>
                      <Sparkles className="h-4 w-4 text-techPurple animate-pulse shrink-0" />
                      <span className="text-techPurple font-bold uppercase tracking-wider">Modo Demo Local</span>
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 text-techCyan shrink-0" />
                      <span className="text-techCyan font-bold uppercase tracking-wider">Supabase Ativo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Options & Configuration */}
              <div className="pt-3.5 space-y-1">
                <button
                  onClick={() => { setIsOpen(false); onOpenProfile(); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 hover:bg-slate-800/40 text-slate-300 hover:text-techCyan rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  <Settings className="h-4.5 w-4.5 shrink-0" />
                  <span>Configurar Perfil & Obra</span>
                </button>

                <button
                  onClick={() => { setIsOpen(false); onSignOut(); }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Terminar Sessão</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
