import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PiggyBank, Lock, Mail, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function AuthScreen({ onDemoMode }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setMessage('Registo efetuado! Verifique o seu email para confirmar a conta.');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao processar a autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 bg-darkBg text-slate-100">
      <div className="w-full max-w-md space-y-8 bg-darkCard p-8 rounded-2xl border border-darkBorder shadow-neonCyan relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-techCyan/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-techPurple/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center">
          <div className="h-16 w-16 bg-gradient-to-tr from-techPurple via-techCyan to-techGreen rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-12 transition-transform duration-300">
            <PiggyBank className="h-10 w-10 text-darkBg" />
          </div>
          <h2 className="mt-6 text-center text-4xl font-extrabold tracking-tight bg-gradient-to-r from-techCyan via-slate-100 to-techGreen bg-clip-text text-transparent">
            SaveLance
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Rastreamento inteligente de mealheiro físico
          </p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-start space-x-3 text-sm animate-pulse">
            <ShieldAlert className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Erro:</span> {error}
            </div>
          </div>
        )}

        {message && (
          <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 p-4 rounded-xl flex items-start space-x-3 text-sm">
            <Sparkles className="h-5 w-5 text-techGreen shrink-0 mt-0.5" />
            <div>{message}</div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Endereço de Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-darkBorder rounded-xl bg-darkBg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-techCyan focus:border-transparent transition duration-200 text-sm"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Palavra-passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-darkBorder rounded-xl bg-darkBg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-techCyan focus:border-transparent transition duration-200 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-darkBg bg-gradient-to-r from-techCyan to-techGreen hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techCyan transition-all duration-200 shadow-neonCyan"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-darkBg border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isSignUp ? 'Registar Conta' : 'Entrar'}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-slate-400 hover:text-techCyan transition-colors"
              >
                {isSignUp
                  ? 'Já tem conta? Inicie sessão aqui'
                  : 'Ainda não tem conta? Registe-se grátis'}
              </button>
            </div>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-darkBorder"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-darkCard px-2 text-slate-500">Ou teste sem Supabase</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onDemoMode}
          className="w-full flex items-center justify-center py-3 px-4 border border-dashed border-techPurple/40 hover:border-techPurple text-techPurple hover:bg-techPurple/5 font-semibold text-sm rounded-xl transition-all duration-200"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Aceder em Modo Demo (Offline)
        </button>
      </div>
    </div>
  );
}
